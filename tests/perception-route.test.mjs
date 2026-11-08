import assert from 'node:assert/strict';
import { ANCHORS, PLAN, floorNumber, upperNumber, walk } from '../src/preview/route.js';

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

console.log('perception route: 4000 floor transitions, reversal, seams and boundaries pass');
