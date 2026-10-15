import { DECAL_OFFSET } from '../decal.js';
import { PAPER_DENSITY } from './sheet-math.js';

// A field to write in by hand on the clipboard's paper (sheet-page.js puts one over every blank
// of a form). Pressing the trigger or the mouse button on it puts the pen down where the laser or
// the mouse points; moving draws until it is let go. The pointer's jitter (a ray held at arm's
// length shakes) is smoothed by the 1€ filter (Casiez, Roussel & Vogel 2012, CHI): little
// smoothing when the pen moves fast, more when it moves slowly. A pen's line, in blue ballpoint
// ink, wide enough to see from 1 m. On a desktop the mouse (or a finger) would also turn the view
// while it is held: the view stays still while a stroke is drawn. A ray that slips off the field
// lifts the pen; back on it, a new stroke starts (no line across the gap). The pen also lifts when
// the button is let go anywhere, the trigger is no longer held, or VR is left, so it never sticks.
// In VR every laser's cursor hears any controller's select (A-Frame 1.7): a stroke starts only
// for the controller whose own trigger is held.
// strokes: [[[u, v], ...], ...], u and v from 0 to 1 across the field (v down), for keeping.
const INK = '#1f3a93';
const LINE_M = 0.0022;
// 1€ filter settings, in the field's metres: the slow cutoff (Hz) and how fast it rises with speed
const MIN_CUTOFF = 1.5, BETA = 30, D_CUTOFF = 1;
const STEP_M = 0.0005;   // a point is kept only this far from the last: a still hand adds nothing

function oneEuro() {
  const alpha = (cutoff, dt) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt));
  let last = null;
  return (t, p) => {
    if (!last) { last = { t, p, dp: [0, 0] }; return p; }
    const dt = Math.max(1e-3, (t - last.t) / 1000);
    const dp = p.map((v, i) => (v - last.p[i]) / dt).map((v, i) => last.dp[i] + alpha(D_CUTOFF, dt) * (v - last.dp[i]));
    const a = alpha(MIN_CUTOFF + BETA * Math.hypot(...dp), dt);
    const out = p.map((v, i) => last.p[i] + a * (v - last.p[i]));
    last = { t, p: out, dp };
    return out;
  };
}

AFRAME.registerComponent('ink', {
  schema: { w: { default: 0.3 }, h: { default: 0.06 }, px: { default: PAPER_DENSITY } },

  init() {
    const d = this.data;
    this.c = document.createElement('canvas');
    this.c.width = Math.round(d.w * d.px);
    this.c.height = Math.round(d.h * d.px);
    this.ctx = this.c.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    // the ink lies on the page as a decal (decal.js): 2 mm over it for the rays, it would flicker into it
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.h), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false, ...DECAL_OFFSET }));
    this.el.setObject3D('mesh', mesh);
    // lasers and the mouse list what they can hit when a page is drawn, before this field has its
    // mesh: list it again now that it has one
    const scene = this.el.sceneEl;
    for (const r of [scene, ...scene.querySelectorAll('[raycaster]')]) r.components.raycaster?.refreshObjects();
    this.strokes = [];
    this.pen = null;
    this.el.addEventListener('mousedown', (e) => this.down(e.detail && e.detail.cursorEl));
    this.up = this.up.bind(this);
    this.el.sceneEl.addEventListener('exit-vr', this.up);
  },

  // a controller's trigger, while its pen is down; true for the mouse and for hands without one
  held(cursor) {
    const tc = cursor.components['tracked-controls'];
    const pad = tc && tc.controller && tc.controller.gamepad;
    if (tc && !tc.controller) return false;   // the controller is gone
    return !pad || !!(pad.buttons[0] && pad.buttons[0].pressed);
  },

  down(cursor) {
    if (!cursor || this.pen || !this.held(cursor)) return;
    const look = this.el.sceneEl.camera && this.el.sceneEl.camera.el.components['look-controls'];
    this.pen = { cursor, points: null, filter: oneEuro(), look: look && { enabled: look.data.enabled, touch: look.data.touchEnabled } };
    if (look) { look.data.enabled = false; look.data.touchEnabled = false; }
    cursor.addEventListener('mouseup', this.up);
    window.addEventListener('mouseup', this.up);
    window.addEventListener('touchend', this.up);
  },

  up() {
    const pen = this.pen;
    if (!pen) return;
    this.pen = null;
    pen.cursor.removeEventListener('mouseup', this.up);
    window.removeEventListener('mouseup', this.up);
    window.removeEventListener('touchend', this.up);
    const look = this.el.sceneEl.camera && this.el.sceneEl.camera.el.components['look-controls'];
    if (look && pen.look) { look.data.enabled = pen.look.enabled; look.data.touchEnabled = pen.look.touch; }
    this.strokes = this.strokes.filter((s) => s.length >= 2);
    this.el.emit('inked', { strokes: this.strokes.length });
  },

  tick(t) {
    const pen = this.pen;
    if (!pen) return;
    if (!this.held(pen.cursor)) { this.up(); return; }
    const hit = pen.cursor.components.raycaster && pen.cursor.components.raycaster.getIntersection(this.el);
    // off the field: the pen is lifted; back on it, the next point starts a new stroke
    if (!hit || !hit.uv) { pen.points = null; pen.filter = oneEuro(); return; }
    const { w, h } = this.data;
    const [x, y] = pen.filter(t, [hit.uv.x * w, (1 - hit.uv.y) * h]);
    const p = [x / w, y / h];
    if (!pen.points) { pen.points = []; this.strokes.push(pen.points); }
    const prev = pen.points[pen.points.length - 1];
    if (prev && Math.hypot((p[0] - prev[0]) * w, (p[1] - prev[1]) * h) < STEP_M) return;
    pen.points.push(p);
    if (prev) this.segment(prev, p);
  },

  segment(a, b) {
    const { ctx, c } = this;
    ctx.strokeStyle = INK;
    ctx.lineWidth = LINE_M * this.data.px;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0] * c.width, a[1] * c.height);
    ctx.lineTo(b[0] * c.width, b[1] * c.height);
    ctx.stroke();
    this.tex.needsUpdate = true;
  },

  // A stroke given whole (the tests; strokes kept from before), points [u, v] from 0 to 1.
  addStroke(points) {
    this.strokes.push(points);
    for (let i = 1; i < points.length; i++) this.segment(points[i - 1], points[i]);
    this.el.emit('inked', { strokes: this.strokes.length });
  },

  // whether anything is written: a stroke at least a centimetre long
  written() {
    const { w, h } = this.data;
    return this.strokes.some((s) => s.reduce((len, p, i) => (i ? len + Math.hypot((p[0] - s[i - 1][0]) * w, (p[1] - s[i - 1][1]) * h) : 0), 0) >= 0.01);
  },

  // a form's fields go when its page does; their GPU memory goes with them only when disposed
  // (three.js r184 manual, how-to-dispose-of-objects; as panel.js)
  remove() {
    this.up();
    this.el.sceneEl.removeEventListener('exit-vr', this.up);
    const mesh = this.el.getObject3D('mesh');
    if (!mesh) return;
    this.el.removeObject3D('mesh');
    mesh.geometry.dispose();
    mesh.material.dispose();
    this.tex.dispose();
  }
});
