import { tripPose, easeInOut } from './ui/sheet-math.js';

// Moves an entity along a curve to a new place and turn, easing in and out (the path
// rules are in ui/sheet-math.js, glidePath). Tick-driven, so it plays in a headset. The turn
// is a tilt and a yaw (order YXZ, never a roll), blended as tripPose says, the same pose the
// path's wall check measures.
// el.components.glide.go({ to: [x, y, z], ctrl: [x, y, z], rotation: [pitch, yaw, 0] (radians,
// order YXZ), ms, step }) → Promise when it arrives; step(e), if given, gets the eased
// progress (0..1) every frame, for anything that changes along the way. trip.arrived is the
// same promise, for whoever must wait for a trip already under way.
AFRAME.registerComponent('glide', {
  init() {
    this.trip = null;
  },

  go({ to, ctrl, rotation, ms, step }) {
    const o = this.el.object3D;
    o.rotation.reorder('YXZ');
    this.trip = {
      from: { pos: o.position.toArray(), pitch: o.rotation.x, yaw: o.rotation.y },
      to: { pos: to, pitch: rotation[0], yaw: rotation[1] },
      ctrl, ms, step, started: null
    };
    this.trip.arrived = new Promise((resolve) => { this.trip.done = resolve; });
    return this.trip.arrived;
  },

  tick(t) {
    const trip = this.trip;
    if (!trip) return;
    if (trip.started === null) trip.started = t;
    const f = Math.min(1, (t - trip.started) / trip.ms);
    const e = easeInOut(f);
    const p = tripPose(trip.from, trip.ctrl, trip.to, e);
    const o = this.el.object3D;
    o.position.fromArray(p.pos);
    o.rotation.set(p.pitch, p.yaw, 0, 'YXZ');
    if (trip.step) trip.step(e);
    if (f >= 1) { this.trip = null; trip.done(); }
  }
});
