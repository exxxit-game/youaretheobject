// The pointing ray shows only where it can act. Meta's system ray (Ray casting specs,
// developers.meta.com/horizon/design/raycasting_specs/): "When the ray is not aimed at any interactable,
// the beam fades to avoid drawing a floating laser into empty space", and "Teleport locomotion takes over
// input": the ray is off while the teleport arc aims. A-Frame's laser-controls draws its line all the
// time (docs/components/laser-controls.md), so beside the teleport arc two rays were seen in the headset.
// The fade is Meta's default, 0.25 s, made through the raycaster's own lineOpacity, which it reads
// whenever it redraws the line (docs/components/raycaster.md, "Customizing the Line"), and the animation
// component (docs/components/animation.md); a line faded out is switched off, so it costs no draw call.
// A target behind a wall or under a hidden part is no target: the rays reach through walls to whatever
// is clickable (three.js tests no visibility), and Meta's best practices say no hover on hidden objects
// (Ray casting best practices, docs/research/vr/01-meta.md).
// <a-entity laser-controls raycaster="objects: .clickable; lineOpacity: .6" laser-beam>
const FADE_MS = 250;
const seen = (el) => { for (let o = el.object3D; o; o = o.parent) if (!o.visible) return false; return true; };

// What the rays answer, put in or taken out: a target that does nothing now is none, or the ray would
// mark it as something to press (Meta: the ray goes out where it "has nothing to act on"). The
// raycasters then read their list again, as a class change does not reach them by itself.
export function pressable(el, on) {
  el.classList.toggle('clickable', on);
  const scene = el.sceneEl;
  for (const r of [scene, ...scene.querySelectorAll('[raycaster]')]) r.components.raycaster?.refreshObjects();
}

AFRAME.registerComponent('laser-beam', {
  init() {
    this.shown = null;
    this.full = null;
    this.faded = () => { if (this.shown === false) this.el.setAttribute('line', 'visible', false); };
    // a controller connected again gets its line again from laser-controls: judged afresh
    this.reset = () => { this.shown = null; };
    this.el.addEventListener('animationcomplete__beam', this.faded);
    this.el.addEventListener('controllerconnected', this.reset);
  },

  remove() {
    this.el.removeEventListener('animationcomplete__beam', this.faded);
    this.el.removeEventListener('controllerconnected', this.reset);
  },

  tick() {
    const ray = this.el.components.raycaster;
    // the line exists once laser-controls has a controller to draw it from
    if (!ray || !this.el.components.line) return;
    if (this.full === null) this.full = ray.data.lineOpacity;
    const aiming = this.el.parentEl?.components.locomotion?.aimHand === this.el;
    const show = !aiming && ray.intersectedEls.some(seen);
    if (show === this.shown) return;
    this.shown = show;
    if (show) this.el.setAttribute('line', 'visible', true);
    this.el.setAttribute('animation__beam', { property: 'raycaster.lineOpacity', to: show ? this.full : 0, dur: FADE_MS, easing: 'linear' });
  },
});
