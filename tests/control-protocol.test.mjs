// Room 01 must run the procedure of Alloy & Abramson (1979), Experiment 2.
// These values are copied from the paper (page in each line). If this test fails,
// someone changed the experiment: fix the code, or change the paper reference and
// docs/rooms/01-control.md together on purpose.
import assert from 'node:assert/strict';
import { PROTOCOL } from '../src/rooms/01-control/protocol.js';

assert.equal(PROTOCOL.trials, 40);                 // p. 451
assert.equal(PROTOCOL.windowSecs, 3);              // p. 451
assert.equal(PROTOCOL.intervalMinSecs, 10);        // p. 451
assert.equal(PROTOCOL.intervalMaxSecs, 25);        // p. 451
assert.equal(PROTOCOL.intervalMeanSecs, 14);       // p. 451
assert.equal(PROTOCOL.scaleStep, 5);               // p. 451
assert.deepEqual(JSON.parse(JSON.stringify(PROTOCOL.conditions)), {
  '25-25': { press: 0.25, noPress: 0.25 },         // p. 458
  '75-75': { press: 0.75, noPress: 0.75 }          // p. 458
});
// zero control in both conditions: green does not depend on pressing
for (const c of Object.values(PROTOCOL.conditions)) assert.equal(c.press, c.noPress);
assert.ok(Object.isFrozen(PROTOCOL) && Object.isFrozen(PROTOCOL.conditions));

console.log('control protocol tests: ok');

// Numbers shown in the reveal (original Table 5 p. 459, p. 461; replication Table 1)
import { ORIGINAL } from '../src/rooms/01-control/original.js';
assert.deepEqual(JSON.parse(JSON.stringify(ORIGINAL.nondepressed)), {
  '25-25': { men: 20.0, women: 7.5 },
  '75-75': { men: 30.3, women: 51.4 }
});
assert.equal(ORIGINAL.zeroIn7575Pct, 6);
assert.equal(ORIGINAL.perCell, 8);
assert.equal(ORIGINAL.replication.people, 83 + 77 + 40 + 42);
assert.equal(ORIGINAL.participants, 64);
assert.deepEqual([...ORIGINAL.replication['25-25']], [18.15, 27.64]);
assert.deepEqual([...ORIGINAL.replication['75-75']], [34.23, 36.83]);
console.log('control original-results tests: ok');
