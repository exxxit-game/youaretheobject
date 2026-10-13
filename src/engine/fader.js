// Fades the view to black and back (moving between places without a jump). A black
// sphere around the camera whose opacity follows a target; it runs in the scene's own
// frame loop, so it also works inside a VR session, where window timers do not drive frames.
// Our choice, as locomotion.js's: about three frames at 72 Hz.
const MAX_STEP_MS = 40;
AFRAME.registerComponent('fader', {
  schema: { ms: { default: 450 } },
  init() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide, transparent: true, opacity: 0, depthTest: false })
    );
    this.mesh.renderOrder = 9999;
    this.mesh.visible = false;
    this.el.setObject3D('fader', this.mesh);
    this.target = 0;
    this.done = null;
  },
  // to: 1 = black, 0 = clear. Resolves when the fade has finished, or when a newer fade takes
  // over (a waiting caller must not hang forever).
  to(target) {
    if (this.done) this.done();
    this.target = target;
    this.mesh.visible = true;
    return new Promise((resolve) => { this.done = resolve; });
  },
  tick(t, dt) {
    const m = this.mesh.material;
    if (!this.done) return;
    // dt is the scene's timer's step, and its first one is the whole time since the scene was made
    // (A-Frame v1.8.0 a-scene.js:45, 693-694: a THREE.Timer, whose first update counts from its
    // creation): a long frame counts as MAX_STEP_MS, so a fade asked for during loading still fades
    const step = Math.min(dt, MAX_STEP_MS) / this.data.ms;
    m.opacity = this.target > m.opacity ? Math.min(this.target, m.opacity + step) : Math.max(this.target, m.opacity - step);
    if (m.opacity === this.target) {
      this.mesh.visible = this.target > 0;
      const done = this.done;
      this.done = null;
      done();
    }
  }
});
