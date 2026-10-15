// The tapes and intervals of room 01 (pure, seeded).
import assert from 'node:assert/strict';
import { PROTOCOL } from '../src/rooms/01-control/protocol.js';
import { makeTape, makeTapes, makeIntervals, pickCondition, seeded } from '../src/rooms/01-control/schedule.js';

const count = (a) => a.filter(Boolean).length;

for (let seed = 1; seed <= 300; seed++) {
  const rand = seeded(seed);

  // tapes: exact greens per block of 4, so any prefix stays near the nominal rate
  for (const [p, perBlock] of [[0.25, 1], [0.75, 3]]) {
    const tape = makeTape(p, PROTOCOL.trials, rand);
    assert.equal(tape.length, PROTOCOL.trials);
    for (let i = 0; i < tape.length; i += 4) assert.equal(count(tape.slice(i, i + 4)), perBlock);
    assert.equal(count(tape), PROTOCOL.trials * p);
  }

  // intervals: trials − 1 values, 0.1 s steps, within 10–25 s, mean exactly 14 s
  const iv = makeIntervals(rand);
  assert.equal(iv.length, PROTOCOL.trials - 1);
  for (const x of iv) {
    assert.ok(x >= 10 && x <= 25, `interval ${x} out of range (seed ${seed})`);
    assert.equal(Math.round(x * 10), x * 10);
  }
  const mean = iv.reduce((a, b) => a + b, 0) / iv.length;
  assert.ok(Math.abs(mean - 14) < 1e-9, `mean ${mean} (seed ${seed})`);
}

// intervals actually spread over the range, not all near 14
{
  const all = Array.from({ length: 50 }, (_, s) => makeIntervals(seeded(1000 + s))).flat();
  assert.ok(Math.min(...all) < 10.5, 'no short intervals');
  assert.ok(Math.max(...all) > 22, 'no long intervals');
}

// both conditions are assigned, about equally
{
  const rand = seeded(7);
  const n = { '25-25': 0, '75-75': 0 };
  for (let i = 0; i < 2000; i++) n[pickCondition(rand)]++;
  assert.ok(n['25-25'] > 900 && n['75-75'] > 900, JSON.stringify(n));
}

// makeTapes gives one tape per response at the condition's rate
{
  const t = makeTapes('75-75', seeded(3));
  assert.equal(count(t.press), 30);
  assert.equal(count(t.noPress), 30);
  const u = makeTapes('25-25', seeded(3));
  assert.equal(count(u.press), 10);
  assert.equal(count(u.noPress), 10);
}

// the same seed gives the same schedule (reproducible runs)
assert.deepEqual(makeIntervals(seeded(42)), makeIntervals(seeded(42)));

console.log('control schedule tests: ok');
