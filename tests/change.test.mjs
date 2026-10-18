import assert from 'node:assert/strict';
import { createPreview } from '../src/rooms/03-change/flow.js';
import { effectTransform } from '../src/rooms/03-change/transform.js';
import { PROTOCOL, ASPECTS, PREVIEW } from '../src/rooms/03-change/protocol.js';
import { ORIGINAL } from '../src/rooms/03-change/original.js';
import { sceneHTML } from '../src/rooms/03-change/scene.js';

// Drori, primary p. 5; source settings are separate from the adjustable preview.
assert.deepEqual(PROTOCOL, { viewMs: 2000, blankMs: 1000, staircasesPerAspect: 4,
  staircaseCount: 24, trainingMaximum: 26 });
assert.deepEqual(ASPECTS, ['grain', 'roll', 'stretch', 'narrow', 'grow', 'shrink']);
assert.ok(Object.isFrozen(PROTOCOL) && Object.isFrozen(PREVIEW) && Object.isFrozen(PREVIEW.levels));
assert.equal(ORIGINAL.exactInitialLevelsKnown, false);
assert.equal(ORIGINAL.exactStopRuleKnown, false);
assert.equal(ORIGINAL.thresholdTail, 5);
assert.ok(sceneHTML.includes('id="changeWorld"') && sceneHTML.includes('id="changeDisplay"'));
assert.ok(!sceneHTML.includes('linesDisplay') && !sceneHTML.includes('linesScreen'), 'the old apparatus is absent');
assert.equal((sceneHTML.match(/id="plaque"/g) || []).length, 1, 'one reusable assigned plaque');
for (const aspect of ASPECTS) {
  const neutral = effectTransform(aspect, 0, 2.5);
  assert.ok(neutral.scaleX === 1 && !neutral.pitch && !neutral.offsetY && !neutral.grain);
  const low = effectTransform(aspect, 0.25, 2.5), high = effectTransform(aspect, 1, 2.5);
  assert.notDeepEqual(low, high, `${aspect} has adjustable visible strength`);
  assert.ok(high.scaleX > 0 && Object.values(high).every(Number.isFinite));
}
assert.throws(() => effectTransform('fake', 1, 2.5));
assert.throws(() => effectTransform('roll', NaN, 2.5));
assert.throws(() => effectTransform('grow', 1, 0));
assert.ok(effectTransform('stretch', 1, 2.5).scaleX > 1);
assert.ok(effectTransform('narrow', 1, 2.5).scaleX < 1);
assert.ok(effectTransform('grow', 1, 2.5).offsetY < 0, 'a higher viewpoint means environment moves down');
assert.ok(effectTransform('shrink', 1, 2.5).offsetY > 0);
let now = 0;
const trial = createPreview(() => 0.25, () => now);
trial.begin(); assert.equal(trial.state, 'intro'); trial.next();
const expose = () => {
  for (const [phase, duration] of [['first', 2000], ['blank', 1000], ['second', 2000]]) {
    assert.equal(trial.state, phase); trial.present(); now += duration; trial.tick();
  }
  assert.equal(trial.state, 'answer'); trial.present(); now += 100;
};
for (let index = 0; index < ASPECTS.length; index++) {
  assert.equal(trial.state, 'ready'); assert.equal(trial.aspect, ASPECTS[index]);
  for (let i = 0; i < 10; i++) trial.adjust(-1);
  assert.equal(trial.strength, 0.25);
  for (let i = 0; i < 10; i++) trial.adjust(1);
  assert.equal(trial.strength, 1);
  assert.equal(trial.start(), true); const stale = trial.token;
  assert.equal(trial.altered, true, 'seed selects the explicitly altered first view');
  assert.equal(trial.adjust(-1), false, 'strength is fixed throughout a presented pair');
  expose();
  assert.equal(trial.answer('same', stale), false);
  const token = trial.token;
  assert.equal(trial.answer('different', token), true);
  assert.equal(trial.answer('same', token), false);
  assert.equal(trial.state, 'feedback'); trial.next();
}
assert.equal(trial.state, 'done');
assert.equal(trial.report().length, 6);
assert.deepEqual(trial.report().map(row => row.aspect), ASPECTS);
assert.ok(trial.report().every(row => row.phases.length === 3 && row.strength === 1));
assert.ok(!JSON.stringify(trial.report()).includes('jnd'), 'preview observations are not thresholds');
for (const phase of ['first', 'blank', 'second', 'answer']) {
  trial.begin(); trial.next(); trial.start();
  while (trial.state !== phase) { trial.present(); now += trial.state === 'blank' ? 1000 : 2000; trial.tick(); }
  const token = trial.token; trial.hold(true);
  assert.equal(trial.state, 'interrupted'); assert.equal(trial.altered, false);
  assert.equal(trial.answer('different', token), false); assert.equal(trial.start(), false);
  trial.hold(false); trial.start();
  assert.equal(trial.state, 'first'); assert.equal(trial.report().length, 0);
}
trial.leave(); assert.equal(trial.state, 'idle');
console.log('change preview: all six transforms, complete six-pair flow, fixed strengths and interrupted/stale answers pass');
