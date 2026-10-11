import { rigTransform, seatedLift, placementStep, EYE } from './recenter-math.js';

// Puts the player at the designed spot, facing the designed direction, in VR.
// A headset sets its origin where the player happened to stand and look when the
// session started, so without this the room appears shifted or rotated.
// Runs on entering VR, when the player recenters the headset (reference space
// "reset", e.g. holding the Meta button) and when the headset is put back on.
// Put on the camera rig.
AFRAME.registerComponent('recenter', {
  schema: {
    x: { default: 0 },     // where the head should be (world metres); every room passes its own spot
    z: { default: 0 },
    yaw: { default: 0 },   // which way the player should face (degrees, 0 = -Z)
    eye: { default: EYE },  // designed eye height, used only with lift
    seatedBelow: { default: 1.35 },
    // lift: true raises a seated player to the standing eye height (rooms played standing).
    // false keeps the real height: the room puts its chair under a seated player.
    lift: { default: false }
  },

  init() {
    this.saved = { p: this.el.object3D.position.clone(), r: this.el.object3D.rotation.y };
    this.apply = this.apply.bind(this);
    this.wait = 'idle';   // placement: asked for, then done by the first tracked pose (tick)
    const sc = this.el.sceneEl;
    sc.addEventListener('enter-vr', () => {
      // a computer's full screen is A-Frame's VR mode too (enterVR, no headset): nothing to place
      this.presented = sc.renderer.xr.isPresenting;
      if (!this.presented) return;
      this.wait = 'waiting';
      const space = sc.renderer.xr.getReferenceSpace();
      if (space && !this.space) { this.space = space; space.addEventListener('reset', () => { this.wait = 'waiting'; }); }
      // Headset taken off and put back on: the session goes hidden, then visible, and the
      // player may now sit or stand somewhere else, so they are placed again. The system
      // menu only blurs the session (visible-blurred) and must not move anyone.
      const session = sc.xrSession;
      if (session) {
        session.addEventListener('visibilitychange', () => {
          if (session.visibilityState === 'hidden') this.wasHidden = true;
          else if (session.visibilityState === 'visible' && this.wasHidden) { this.wasHidden = false; this.wait = 'waiting'; }
        });
      }
    });
    sc.addEventListener('exit-vr', () => {
      if (!this.presented) return;
      this.presented = false;
      this.space = null;
      this.wait = 'idle';
      this.seated = undefined;
      this.el.object3D.position.copy(this.saved.p);
      this.el.object3D.rotation.y = this.saved.r;
    });
  },

  // A seated player who stands up (or a standing one who sits down) is re-placed;
  // checked about once a second, with a margin so a lean does not flip it.
  tick(t) {
    if (this.wait !== 'idle') {
      const sc = this.el.sceneEl, space = sc.renderer.xr.getReferenceSpace();
      const step = placementStep(this.wait, (sc.frame && space && sc.frame.getViewerPose(space)) || null);
      this.wait = step.state;
      if (step.place) this.apply();
      return;
    }
    if (this.seated === undefined || t - (this.checked || 0) < 1000) return;
    this.checked = t;
    const y = this.el.sceneEl.camera.el.object3D.position.y; // real head height above the floor
    if (this.seated ? y > this.data.seatedBelow + 0.15 : y < this.data.seatedBelow - 0.15) this.apply();
  },

  apply() {
    const sc = this.el.sceneEl;
    if (!sc.renderer.xr.isPresenting) return;
    const head = sc.camera.el.object3D; // headset pose, local to this rig
    const e = new THREE.Euler().setFromQuaternion(head.quaternion, 'YXZ');
    const t = rigTransform(head.position.x, head.position.z, e.y,
      this.data.x, this.data.z, THREE.MathUtils.degToRad(this.data.yaw));
    const rig = this.el.object3D;
    rig.rotation.y = t.yaw;
    rig.position.x = t.x;
    rig.position.z = t.z;
    const seated = head.position.y < this.data.seatedBelow;
    const lift = this.data.lift ? seatedLift(head.position.y, this.data.eye, this.data.seatedBelow) : 0;
    rig.position.y = lift;
    this.lifted = lift > 0;
    this.seated = seated;
    this.el.emit('recentered', { seated });
  }
});
