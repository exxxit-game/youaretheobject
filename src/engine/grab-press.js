import { pulse } from './haptics.js';

// Press things with the hand, not only with the laser. Put on each controller.
// When the controller is within `radius` of an element with class "grabbable",
// a light vibration says "you are touching it"; trigger or grip then sends that
// element a 'click' with detail.cursorEl = this controller, like the laser does.
AFRAME.registerComponent('grab-press', {
  schema: { radius: { default: 0.1 } },

  init() {
    this.p = new THREE.Vector3();
    this.q = new THREE.Vector3();
    this.near = null;
    this.targets = [];
    this.scanned = -Infinity;
    const press = () => { if (this.near) this.near.emit('click', { cursorEl: this.el }); };
    this.el.addEventListener('triggerdown', press);
    this.el.addEventListener('gripdown', press);
  },

  tick(time) {
    this.el.object3D.getWorldPosition(this.p);
    let best = null;
    let bestDist = this.data.radius;
    // the target list is refreshed once a second, not searched every frame; counted in time,
    // not frames, because a headset runs at 72, 90 or 120 frames a second
    if (time - this.scanned >= 1000) { this.scanned = time; this.targets = [...this.el.sceneEl.querySelectorAll('.grabbable')]; }
    for (const t of this.targets) {
      t.object3D.getWorldPosition(this.q);
      const d = this.p.distanceTo(this.q);
      if (d < bestDist) { bestDist = d; best = t; }
    }
    if (best !== this.near) {
      this.near = best;
      if (best) pulse(this.el, 0.25, 25);
    }
  }
});
