// Fades the view to black and back (moving between places without a jump). A black
// sphere around the camera whose opacity follows a target; it runs in the scene's own
// frame loop, so it also works inside a VR session, where window timers do not drive frames.
// A step longer than this is a stall, and the fade moves nothing in it, as A-Frame 1.8.0's own wasd-controls
// does with a step over 0.2 s (its tick in vendor/aframe-1.8.0.min.js)
const STALL_MS = 200;
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
    // creation): skipped as a stall, so a fade asked for during loading still fades
    if (dt > STALL_MS) return;
    const step = dt / this.data.ms;
    m.opacity = this.target > m.opacity ? Math.min(this.target, m.opacity + step) : Math.max(this.target, m.opacity - step);
    if (m.opacity === this.target) {
      this.mesh.visible = this.target > 0;
      const done = this.done;
      this.done = null;
      done();
    }
  }
});
