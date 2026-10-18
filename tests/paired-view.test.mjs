import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPairedView } from '../src/engine/paired-view.js';

// Drori et al., JCM 9:1627, Methods 2.6.1, PDF p. 5: 2 s / 1 s / 2 s.
const sourceDurations = Object.freeze({ viewMs: 2000, blankMs: 1000 });
let now = 0;
const pair = createPairedView(sourceDurations, () => now);
const trial = { id: 'grain-1', alteredView: 'second' };
assert.throws(() => createPairedView({}), /explicit positive/);
assert.throws(() => createPairedView({ viewMs: 0, blankMs: 1000 }), /explicit positive/);
assert.throws(() => pair.begin({ id: 'grain-1' }), /explicit identity and altered-view order/);
assert.equal(pair.state, 'idle');
assert.equal(pair.begin(trial), true);
assert.equal(pair.state, 'first');
assert.equal(pair.begin(trial), false, 'an active pair cannot be silently replaced');
const firstToken = pair.token;
assert.equal(pair.answer('different', firstToken), false, 'answers before both views are rejected');
now = 30000;
assert.equal(pair.tick(), false, 'construction and loading time is not stimulus exposure');
assert.equal(pair.present(firstToken), true);
now += 1999;
assert.equal(pair.tick(), false);
assert.equal(pair.present(firstToken), false, 'a repeated frame must not restart the exposure clock');
now++;
assert.equal(pair.tick(), true);
assert.equal(pair.state, 'blank');
assert.equal(pair.present(firstToken), false, 'a stale rendered phase cannot start the next phase');
now += 60000;
assert.equal(pair.tick(), false, 'a delayed blank render cannot consume the second view');
assert.equal(pair.present(pair.token), true);
now += 999;
assert.equal(pair.tick(), false);
now++;
assert.equal(pair.tick(), true);
assert.equal(pair.state, 'second');
assert.equal(pair.present(pair.token), true);
now += 1999;
assert.equal(pair.tick(), false);
now++;
assert.equal(pair.tick(), true);
assert.equal(pair.state, 'answer');
assert.equal(pair.answer('different', pair.token), false, 'an undisplayed answer screen cannot receive a response');
assert.equal(pair.present(pair.token), true);
assert.equal(pair.answer('yes', pair.token), false);
const responseToken = pair.token;
now += 350;
assert.equal(pair.answer('different', responseToken), true);
assert.equal(pair.answer('same', responseToken), false, 'a release/double click cannot record two responses');
assert.equal(pair.result.responseMs, 350);
assert.deepEqual(pair.result.phases.map(p => p.end - p.onset), [2000, 1000, 2000]);
assert.equal(pair.result.alteredView, 'second');
const copy = pair.result;
copy.phases[0].end = -1;
assert.notEqual(pair.result.phases[0].end, -1, 'callers cannot rewrite exposure evidence');

// Interruption invalidates every point of the pair, including an unanswered pair.
for (const interruptedPhase of ['first', 'blank', 'second', 'answer']) {
  pair.leave(); pair.begin(trial);
  while (pair.state !== interruptedPhase) {
    pair.present(pair.token); now += pair.state === 'blank' ? 1000 : 2000; pair.tick();
  }
  pair.present(pair.token);
  const stale = pair.token;
  assert.equal(pair.hold(true), true);
  assert.equal(pair.state, 'interrupted');
  assert.equal(pair.result, null, 'an interrupted pair has no score');
  assert.equal(pair.current, null);
  assert.equal(pair.answer('same', stale), false);
  assert.equal(pair.begin(trial), false);
  assert.equal(pair.tick(), false);
  pair.hold(false);
  assert.equal(pair.state, 'interrupted', 'resuming does not silently repeat an exposure');
  assert.equal(pair.begin(trial), true);
  assert.equal(pair.state, 'first', 'a repeated pair always begins with the first view');
  assert.equal(pair.present(stale), false);
}

pair.leave(); pair.begin({ id: 'narrow-4', alteredView: 'first' });
pair.present(pair.token); now += 60000;
assert.equal(pair.tick(), true);
assert.equal(pair.state, 'blank', 'a delayed frame advances at most one phase');
assert.equal(pair.tick(), false);
pair.present(pair.token); now -= 1;
assert.throws(() => pair.tick(), /finite monotonic/);
pair.leave();
assert.equal(pair.state, 'idle');
assert.equal(pair.result, null);

// The same source boundary must detect an actual duration defect in the implementation.
function checkSourceBlank(factory) {
  let at = 0;
  const p = factory(sourceDurations, () => at);
  p.begin(trial); p.present(p.token); at = 2000; p.tick(); p.present(p.token);
  at = 2999;
  assert.equal(p.tick(), false, 'source blank must last a full second');
}
checkSourceBlank(createPairedView);
const source = readFileSync(new URL('../src/engine/paired-view.js', import.meta.url), 'utf8');
const mutant = source.replace("state === 'blank' ? blankMs : viewMs", "state === 'blank' ? blankMs / 2 : viewMs");
assert.notEqual(mutant, source, 'timing mutation must actually change the implementation');
const mutated = await import(`data:text/javascript;base64,${Buffer.from(mutant).toString('base64')}`);
assert.throws(() => checkSourceBlank(mutated.createPairedView), /source blank must last a full second/,
  'source boundary rejects a deliberately shortened blank without modifying runtime files');
console.log('paired-view tests: source exposure timing, delayed frames, stale responses and interruptions pass');
