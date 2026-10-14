// The recenter math must put the head exactly at the target spot, facing the
// target direction, wherever the player stood and looked when VR started.
import assert from 'node:assert/strict';
import { rigTransform } from '../src/engine/recenter-math.js';

// World head position/yaw after applying the rig transform (three.js Y rotation).
function world(px, pz, headYaw, t) {
  return {
    x: t.x + px * Math.cos(t.yaw) + pz * Math.sin(t.yaw),
    z: t.z - px * Math.sin(t.yaw) + pz * Math.cos(t.yaw),
    yaw: t.yaw + headYaw
  };
}
const near = (a, b) => Math.abs(a - b) < 1e-9;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

const cases = [
  [0, 0, 0], [1.2, -0.4, 0], [-0.7, 2.1, Math.PI / 2], [0.3, 0.3, Math.PI],
  [-2, -1, -2.5], [0.05, -0.02, 0.1]
];
for (const [px, pz, yaw] of cases) {
  const t = rigTransform(px, pz, yaw, 0, 0.35, 0);
  const w = world(px, pz, yaw, t);
  assert.ok(near(w.x, 0) && near(w.z, 0.35), `head not at target for ${px},${pz},${yaw}: ${w.x},${w.z}`);
  assert.ok(near(wrap(w.yaw), 0), `head not facing the screen for ${px},${pz},${yaw}`);
}
console.log(`recenter tests: ok (${cases.length} poses)`);

// Seated players are lifted to standing eye height; standing players are not moved.
import { seatedLift } from '../src/engine/recenter-math.js';
assert.equal(seatedLift(1.7), 0);
assert.equal(seatedLift(1.36), 0);
assert.ok(Math.abs(seatedLift(1.15) - 0.45) < 1e-9);
assert.ok(Math.abs(1.0 + seatedLift(1.0) - 1.6) < 1e-9);
console.log('seated tests: ok');

// The player is placed on the frame after the first one whose head pose is tracked (WebXR
// getViewerPose, not emulated), never after a guessed delay: a slow first frame read the head
// before it existed and placed the player off the spot (objekt-files/notes/archive/docs/audit/flow.md F5).
import { placementStep } from '../src/engine/recenter-math.js';
const real = { emulatedPosition: false }, guessed = { emulatedPosition: true };
assert.deepEqual(placementStep('waiting', null), { state: 'waiting', place: false }, 'no pose yet: wait');
assert.deepEqual(placementStep('waiting', guessed), { state: 'waiting', place: false }, 'an emulated pose is no head yet: wait');
assert.deepEqual(placementStep('waiting', real), { state: 'seen', place: false }, 'the first tracked pose: place on the next frame');
assert.deepEqual(placementStep('seen', real), { state: 'idle', place: true }, 'the frame after: place');
assert.deepEqual(placementStep('idle', real), { state: 'idle', place: false }, 'nothing asked: nothing moves');
console.log('placement tests: ok (placed by the first tracked pose, not a timer)');
