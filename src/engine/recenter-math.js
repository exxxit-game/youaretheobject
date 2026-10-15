// Pure math for recenter.js: the rig transform that puts a head with the given
// local pose (position px, pz and yaw, relative to the rig) at the target spot
// (tx, tz) facing target yaw. Angles in radians. Rotation is about the Y axis,
// using three.js conventions.
export function rigTransform(px, pz, headYaw, tx, tz, targetYaw) {
  const phi = targetYaw - headYaw;
  return {
    yaw: phi,
    x: tx - (px * Math.cos(phi) + pz * Math.sin(phi)),
    z: tz - (-px * Math.sin(phi) + pz * Math.cos(phi))
  };
}

// The designed standing eye height the scenes are laid out for.
export const EYE = 1.6;

// When to place the player after VR starts, the headset is recentered or put back on: on the
// frame after the first one that carries a tracked head pose (WebXR getViewerPose, not emulated),
// by which the pose has reached the camera; never after a guessed delay, which on a slow first
// frame read the head before it existed. state: 'idle' | 'waiting' | 'seen'; pose: the frame's
// viewer pose or null. Returns the next state and whether to place now.
export function placementStep(state, pose) {
  if (state === 'seen') return { state: 'idle', place: true };
  if (state === 'waiting' && pose && !pose.emulatedPosition) return { state: 'seen', place: false };
  return { state, place: false };
}

// Seated mode: a head lower than `below` metres means the player sits. Then the
// rig is lifted so the eyes are at the designed standing height `eye`; the
// table, its controls and the screen end up at the right place relative to the body.
export function seatedLift(headY, eye = EYE, below = 1.35) {
  return headY < below ? eye - headY : 0;
}
