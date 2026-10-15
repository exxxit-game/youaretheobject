// Measures of room 01 (pure).
import assert from 'node:assert/strict';
import { analyse } from '../src/rooms/01-control/report.js';

const trial = (n, press, green) => ({ t: n, k: 'trial', v: { n, press, green } });
const answer = (key, value) => ({ t: 99, k: 'answer', v: { key, value } });

// empty run
{
  const r = analyse([]);
  assert.equal(r.trials, 0);
  assert.equal(r.total, null);
  assert.equal(r.actualControl, null);
  assert.deepEqual(r.answers, {});
}

// 4 trials: press+green, press+no, no+green, no+no
{
  const r = analyse([
    trial(1, true, true), trial(2, true, false), trial(3, false, true), trial(4, false, false),
    { t: 5, k: 'stray' }, { t: 6, k: 'void', v: 5 },
    answer('control', 40), answer('total', 60), answer('ifPress', 50), answer('ifNoPress', 30)
  ]);
  assert.equal(r.trials, 4);
  assert.equal(r.presses, 2);
  assert.equal(r.greens, 2);
  assert.equal(r.total, 50);
  assert.equal(r.ifPress, 50);
  assert.equal(r.ifNoPress, 50);
  assert.equal(r.actualControl, 0);
  assert.equal(r.successes, 50);
  assert.equal(r.confirming, 2);   // press+green and no-press+no-green
  assert.equal(r.strays, 1);
  assert.equal(r.voided, 1);
  assert.equal(r.answers.control, 40);
  assert.equal(r.errTotal, 10);
  assert.equal(r.errIfPress, 0);
  assert.equal(r.errIfNoPress, -20);
}

// never pressed: press rate unknown, control unknown, not zero
{
  const r = analyse([trial(1, false, true), trial(2, false, false), trial(3, false, true)]);
  assert.equal(r.ifPress, null);
  assert.equal(r.ifNoPress, 66.7);
  assert.equal(r.actualControl, null);
  assert.equal(r.confirming, 1);
}

// a later answer to the same question replaces the earlier one
assert.equal(analyse([answer('control', 10), answer('control', 35)]).answers.control, 35);

console.log('control report tests: ok');
