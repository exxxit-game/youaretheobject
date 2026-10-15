// Moving with the thumbsticks (docs/decisions.md, "Moving in the corridor with the thumbsticks"):
// what a stick asks for, the teleport arc, and where the player ends up. Values from Meta's
// locomotion guidance: snap turn 45°, back step 80 cm, a stick fires past 0.8 and re-arms under 0.5.
import assert from 'node:assert/strict';
import { STICK, MOVE, SMOOTH, readStick, arc, inside, snapTurn, teleport, backStep, slide, smoothTurnDeg, vignetteLevel } from '../src/engine/locomotion-math.js';
import { DIST as VIGNETTE_DIST } from '../src/engine/vignette.js';
import { BOUNDS } from '../src/app/lobby/plan.js';

const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
// the walking area the corridor really has, from its plan
const corridor = BOUNDS;

assert.equal(MOVE.snapDeg, 45);
assert.equal(MOVE.backStep, 0.8);
assert.ok(STICK.fire === 0.8 && STICK.rearm === 0.5);

// a stick: one turn per push, the push must come back before the next; forward aims, letting go
// teleports; a quick pull back steps back; aiming wins over turning
let s = readStick(undefined, 0, 0);
assert.equal(s.action, null);
s = readStick(s.state, -0.9, 0); assert.equal(s.action, 'turn-left');
s = readStick(s.state, -0.95, 0); assert.equal(s.action, null, 'held: no second turn');
s = readStick(s.state, -0.6, 0); assert.equal(s.action, null, 'not yet re-armed');
s = readStick(s.state, -0.3, 0); assert.equal(s.action, null);
s = readStick(s.state, 0.85, 0); assert.equal(s.action, 'turn-right');
s = readStick(s.state, 0, 0);
s = readStick(s.state, 0, -0.9); assert.equal(s.action, 'aim');
s = readStick(s.state, 0.9, -0.9); assert.equal(s.action, null, 'no turning while aiming');
s = readStick(s.state, 0, -0.3); assert.equal(s.action, 'release');
s = readStick(s.state, 0, 0.9); assert.equal(s.action, 'back');
s = readStick(s.state, 0, 0.95); assert.equal(s.action, null, 'one step per pull');
s = readStick(s.state, 0, 0.2);
s = readStick(s.state, 0, 0.9); assert.equal(s.action, 'back');

// a diagonal push held for several events does one thing, by its larger part
for (const [x, y, want] of [[0.85, 0.85, 'turn-right'], [-0.85, 0.85, 'turn-left'], [0.6, 0.9, 'back'], [-0.9, 0.82, 'turn-left']]) {
  let r = readStick(undefined, 0, 0);
  const actions = [0, 1, 2].map(() => (r = readStick(r.state, x, y)).action).filter(Boolean);
  assert.deepEqual(actions, [want], `diagonal (${x}, ${y}): ${actions}`);
}

// letting go of an aimed stick by rolling it sideways or flicking it back only teleports
for (const roll of [[[0, -0.9], [0.6, -0.4], [0.9, 0]], [[0, -0.9], [0, 0.9]]]) {
  let r = readStick(undefined, 0, 0);
  const actions = roll.map(([x, y]) => (r = readStick(r.state, x, y)).action).filter(Boolean);
  assert.deepEqual(actions, ['aim', 'release'], `rolled ${JSON.stringify(roll)}: ${actions}`);
  r = readStick(r.state, 0, 0);
  r = readStick(r.state, 0.9, 0);
  assert.equal(r.action, 'turn-right', 'after centre the stick turns again');
}

// the arc: from a hand at 1.1 m pointing forward and a little up, it lands on the floor ahead,
// within the corridor's length, and every point is above the floor
const a = arc([0, 1.1, 3], [0, Math.sin(0.3), -Math.cos(0.3)]);
assert.ok(a.hit, 'lands on the floor');
assert.ok(near(a.hit[1], 0, 1e-6));
assert.ok(a.hit[2] < 3 - 1.5 && a.hit[2] > 3 - 6, `lands ${(3 - a.hit[2]).toFixed(2)} m ahead`);
assert.ok(a.points.every(p => p[1] >= -1e-6));
assert.ok(!arc([0, 1.1, 3], [0, 1, 0]).hit, 'pointing straight up never lands');

assert.ok(inside(0.6, 3.05, corridor) && !inside(0.6, 1.9, corridor) && !inside(corridor.maxX + 0.3, 3, corridor));

// a turn keeps the head where it is; the rig turns by the angle
for (const [rig, head, ang] of [[{ x: 0, z: 0, yaw: 0 }, [0.6, 3.05], 45], [{ x: 0.3, z: -0.2, yaw: 1 }, [-1, 2.5], -45]]) {
  const r = snapTurn(rig, head, ang);
  assert.ok(near(r.yaw, rig.yaw + ang * Math.PI / 180));
  // the head's offset from the rig, turned with the rig, lands on the same spot
  const ox = head[0] - rig.x, oz = head[1] - rig.z, t = ang * Math.PI / 180;
  const hx = r.x + ox * Math.cos(t) + oz * Math.sin(t), hz = r.z - ox * Math.sin(t) + oz * Math.cos(t);
  assert.ok(near(hx, head[0]) && near(hz, head[1]), 'the head stays put');
}

// a teleport puts the head over the target
const t = teleport({ x: 0.1, z: 0.2, yaw: 0.5 }, [0.6, 3.05], [-1.5, 2.6]);
assert.ok(near(0.6 + (t.x - 0.1), -1.5) && near(3.05 + (t.z - 0.2), 2.6) && t.yaw === 0.5);

// a back step goes 80 cm behind the head, never through the wall behind
const b = backStep([0.6, 2.9], 0, corridor);   // facing -Z (the doors), the back wall is 45 cm behind
assert.ok(near(b[0], 0.6) && near(b[1], corridor.maxZ), 'stopped at the corridor edge');
const b2 = backStep([0.6, 3.0], Math.PI / 2, corridor);   // facing -X: back is +X
assert.ok(near(b2[0], 1.4) && near(b2[1], 3.0));
// smooth moving, the player's choice: walking pace at once, the same speed however far the stick
// is pushed past its dead zone, along where the head looks, never through a wall
assert.equal(SMOOTH.speed, 1.4, 'walking pace (Meta: about 3 mph)');
const ahead = slide([0.7, 3.05], 0, 0, -1, 0.1, corridor);       // stick forward, facing the doors
assert.ok(near(ahead[0], 0.7) && near(ahead[1], 3.05 - 0.14), `forward ${ahead}`);
const halfPush = slide([0.7, 3.05], 0, 0.5, 0, 0.1, corridor);   // half a push to the right
assert.ok(near(halfPush[0], 0.84) && near(halfPush[1], 3.05), 'the same speed for a smaller push');
const turnedLeft = slide([0.7, 3.05], Math.PI / 2, 0, -1, 0.1, corridor);   // facing -X
assert.ok(near(turnedLeft[0], 0.56) && near(turnedLeft[1], 3.05), 'forward is where the head looks');
assert.equal(slide([0.7, 3.05], 0, 0.1, 0.1, 0.1, corridor), null, 'a resting stick does not move');
const wall = slide([0.7, 2.15], 0, 0, -1, 1, corridor);
assert.ok(near(wall[1], corridor.minZ), 'stopped at the corridor edge');
assert.ok(near(smoothTurnDeg(1, 0.5), -SMOOTH.turnDegPerS / 2) && smoothTurnDeg(-1, 0.5) > 0 && smoothTurnDeg(0.1, 0.5) === 0, 'stick right turns right');
assert.ok(vignetteLevel(0, 0) === 0 && near(vignetteLevel(0.7, 0), 0.5) && vignetteLevel(1.4, 0) === 1 && vignetteLevel(0, 180) === 1, 'the view narrows with speed');
// the vignette ring hangs far enough that an eye off the head's centre sees it where the other
// eye does: even 5 cm off centre (wider than human eyes sit) shifts it under half a degree
const shiftDeg = Math.atan(0.05 / VIGNETTE_DIST) * 180 / Math.PI;
assert.ok(shiftDeg < 0.5, `the vignette shifts ${shiftDeg.toFixed(2)}° between the eyes`);
console.log('locomotion tests: ok');
