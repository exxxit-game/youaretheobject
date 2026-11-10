import assert from 'node:assert/strict';
import './book-deal.test.mjs';
import { ANCHORS, PLAN, floorNumber, upperNumber, walk } from '../src/preview/route.js';
import { ROOM, DOORS, OPEN_LEAF, nearDoor, inRoom, beginVisit, returnVisit } from '../src/preview/layout.js';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} differs from ${expected}`);
const moveTo = (position, x, z) => walk(position, x - position.x, z - position.z);

assert.equal(upperNumber(''), '9');
assert.equal(upperNumber('?upper=8'), '8');
assert.equal(upperNumber('?upper=11'), '9');
assert.equal(floorNumber(0, ''), '8');
assert.equal(floorNumber(-2, ''), '6');
assert.equal(floorNumber(3, ''), '11');
assert.equal(floorNumber(-500, '?upper=8'), '8');
assert.equal(floorNumber(500, '?upper=8'), '8');

function ascend(position) {
  position = moveTo(position, ANCHORS.turn.x, ANCHORS.turn.z);
  position = moveTo(position, ANCHORS.turn.x, ANCHORS.overlap.z);
  position = moveTo(position, ANCHORS.top.x, ANCHORS.overlap.z);
  return moveTo(position, ANCHORS.top.x, ANCHORS.top.z);
}

function descend(position) {
  position = moveTo(position, ANCHORS.top.x, ANCHORS.top.z);
  position = moveTo(position, ANCHORS.top.x, ANCHORS.overlap.z);
  position = moveTo(position, ANCHORS.turn.x, ANCHORS.overlap.z);
  return moveTo(position, ANCHORS.turn.x, ANCHORS.turn.z);
}

const turn = moveTo(ANCHORS.start, ANCHORS.turn.x, ANCHORS.turn.z);
close(turn.x, ANCHORS.turn.x);
close(turn.y, 0);
close(turn.z, ANCHORS.turn.z);

const firstRun = moveTo(turn, turn.x, -1.52);
close(firstRun.y, 0.72);

const blockedCrossing = walk(firstRun, -1.4, 0);
assert.ok(blockedCrossing.x > PLAN.right.minX, 'the rails between the runs block a shortcut');
close(blockedCrossing.y, firstRun.y);

const halfLanding = moveTo(firstRun, firstRun.x, ANCHORS.overlap.z);
close(halfLanding.y, PLAN.halfRise);
const overlap = moveTo(halfLanding, ANCHORS.overlap.x, ANCHORS.overlap.z);
close(overlap.x, ANCHORS.overlap.x);
close(overlap.y, ANCHORS.overlap.y);

const secondRun = moveTo(overlap, ANCHORS.top.x, -1.52);
close(secondRun.y, 2.16);
const top = moveTo(secondRun, ANCHORS.top.x, ANCHORS.top.z);
close(top.y, 0);
assert.equal(top.floor, 1);
close(top.z, ANCHORS.top.z);

const upperAboveFirstRun = moveTo(top, ANCHORS.turn.x, ANCHORS.turn.z);
close(upperAboveFirstRun.y, 0);
const continuedUp = walk(upperAboveFirstRun, 0, -2);
assert.ok(continuedUp.z < -1, 'the next ascent remains open');
assert.ok(continuedUp.y > 0);
assert.equal(continuedUp.floor, 1);

const bottomBelowSecondRun = moveTo(turn, ANCHORS.top.x, ANCHORS.top.z);
close(bottomBelowSecondRun.y, 0);
const continuedDown = walk(bottomBelowSecondRun, 0, -2);
assert.ok(continuedDown.z < -1, 'the initial floor also has a descent');
assert.ok(continuedDown.y < 0);
assert.equal(continuedDown.floor, 0);

const returnLanding = moveTo(top, top.x, ANCHORS.overlap.z);
const rightAtLanding = moveTo(returnLanding, ANCHORS.turn.x, returnLanding.z);
const returnedHall = moveTo(rightAtLanding, rightAtLanding.x, ANCHORS.turn.z);
const returnedStart = moveTo(returnedHall, ANCHORS.start.x, ANCHORS.start.z);
close(returnedStart.x, ANCHORS.start.x);
close(returnedStart.y, 0);
close(returnedStart.z, ANCHORS.start.z);
assert.equal(returnedStart.floor, 0);

let repeated = ANCHORS.start;
for (let floor = 1; floor <= 1000; floor++) {
  repeated = ascend(repeated);
  assert.equal(repeated.floor, floor);
  close(repeated.y, 0);
}
for (let floor = 999; floor >= -1000; floor--) {
  repeated = descend(repeated);
  assert.equal(repeated.floor, floor);
  close(repeated.y, 0);
}
for (let floor = -999; floor <= 0; floor++) repeated = ascend(repeated);
assert.equal(repeated.floor, 0, 'reversing the full route recovers the starting floor');
close(repeated.y, 0);

const reversedMidFlight = moveTo(firstRun, firstRun.x, ANCHORS.turn.z);
close(reversedMidFlight.y, 0);
assert.equal(reversedMidFlight.floor, 0, 'turning around within a flight does not count a floor');

const below = descend(ANCHORS.start);
const descendingHalf = moveTo(bottomBelowSecondRun, ANCHORS.top.x, ANCHORS.overlap.z);
close(descendingHalf.y, -PLAN.halfRise);
assert.equal(descendingHalf.floor, 0, 'the half landing does not recenter the route');
assert.equal(below.floor, -1);

const seam = moveTo(secondRun, ANCHORS.top.x, 0.12);
close(seam.y, PLAN.floorRise);
assert.equal(seam.floor, 0);
const crossed = walk({ ...seam, yaw: 0.6, pitch: -0.2 }, 0, 0.04);
close(crossed.y, 0);
assert.equal(crossed.floor, 1);
close(crossed.z, seam.z + 0.04);
assert.equal(crossed.yaw, 0.6);
assert.equal(crossed.pitch, -0.2);

const stopAtWall = walk(ANCHORS.start, -12, 0);
assert.ok(stopAtWall.x > PLAN.hall.minX && stopAtWall.x < ANCHORS.start.x, 'large input cannot tunnel through the end wall');

assert.equal(new Set(DOORS.map(d => d.id)).size, DOORS.length, 'door identity is stable across the repeated floor');
assert.ok(DOORS.some(d => d.side === 'north') && DOORS.some(d => d.side === 'south'));
for (const floor of [-123, 0, 321]) {
  const outside = { x: ROOM.doorX, z: PLAN.hall.maxZ - 0.6, y: 0, floor };
  assert.ok(nearDoor(outside));
  const closed = walk(outside, 0, 6);
  assert.ok(closed.z <= PLAN.hall.maxZ - 0.14 + 1e-7, 'a closed door blocks the opening');
  const visit = beginVisit(outside, -1.4, 0.2);
  assert.ok(visit);
  let entered = walk(outside, 0, 2, true);
  assert.ok(inRoom(entered), 'the open doorway leads into the adjacent room');
  assert.equal(entered.floor, floor);
  const beyond = walk(entered, -10, 10, true);
  assert.ok(beyond.x >= ROOM.minX + 0.14 - 1e-7 && beyond.z <= ROOM.maxZ - 0.14 + 1e-7,
    'large diagonal input cannot cross the room walls');
  const wrongOpening = walk({ ...outside, x: ROOM.doorX + 0.7 }, 0, 6, true);
  assert.ok(wrongOpening.z < PLAN.hall.maxZ, 'the wall beside the door remains solid');
  const besideLeaf = { ...entered, x: ROOM.maxX - 0.15, z: 2.4 };
  const hitLeaf = walk(besideLeaf, -1, 0, true);
  assert.ok(hitLeaf.x > OPEN_LEAF.maxX, 'the visible open leaf cannot be walked through');
  const aroundLeaf = walk({ ...besideLeaf, z: OPEN_LEAF.maxZ + 0.3 }, -1, 0, true);
  assert.ok(aroundLeaf.x < OPEN_LEAF.minX, 'the free space beyond the leaf remains usable');
  const back = walk(entered, 0, -2, true);
  assert.ok(!inRoom(back) && back.z < PLAN.hall.maxZ, 'walking out uses the same opening');
  const restored = returnVisit(visit);
  assert.deepEqual(restored.position, outside, 'return preserves the actual opening position and logical floor');
  assert.equal(restored.yaw, -1.4); assert.equal(restored.pitch, 0.2);
  restored.position.floor++;
  assert.equal(visit.position.floor, floor, 'return and movement do not mutate the saved visit');
}
assert.equal(beginVisit(ANCHORS.turn, 0, 0), null, 'a door cannot be opened from across the corridor');
assert.equal(beginVisit({ ...ANCHORS.start, y: PLAN.halfRise }, 0, 0), null, 'the half landing is not a room entrance');
console.log('perception route: 4000 floor transitions, room/door boundaries and floor-preserving return pass');
