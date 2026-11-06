import assert from 'node:assert/strict';
import { analyse } from '../src/rooms/02-point-of-view/report.js';
import { changeView, INITIAL_VIEW, projection } from '../src/rooms/02-point-of-view/view.js';

const initial = projection(INITIAL_VIEW);
assert.deepEqual(analyse([]), { view: INITIAL_VIEW, count: 0, recent: [] });

const log = [];
function act(k) {
  const v = changeView(analyse(log).view, k);
  log.push({ k, v });
  return projection(v);
}

const turned = act('turn');
assert.notDeepEqual(turned.rotation, initial.rotation);
assert.deepEqual(turned.position, initial.position);
assert.deepEqual(turned.scale, initial.scale);

const scaled = act('scale');
assert.notDeepEqual(scaled.scale, turned.scale);
assert.deepEqual(scaled.rotation, turned.rotation);
assert.deepEqual(scaled.position, turned.position);

const angled = act('angle');
assert.notDeepEqual(angled.position, scaled.position);
assert.deepEqual(angled.scale, scaled.scale);
assert.deepEqual(angled.rotation, scaled.rotation);

assert.deepEqual(act('return'), initial);
assert.deepEqual(analyse(log), {
  view: INITIAL_VIEW, count: 4, recent: ['turn', 'scale', 'angle', 'return']
});
assert.deepEqual(act('turn'), turned);
assert.equal(analyse(log).count, 5);
assert.deepEqual(analyse(log).recent, ['scale', 'angle', 'return', 'turn']);
assert.equal(log[0].v.turn, 1);

for (const [action, length] of [['turn', 12], ['scale', 3], ['angle', 3]]) {
  let view = INITIAL_VIEW;
  for (let i = 0; i < length; i++) view = changeView(view, action);
  assert.deepEqual(projection(view), initial, `${action} cycles through a fixed range`);
}
assert.throws(() => changeView(INITIAL_VIEW, 'unknown'), RangeError);
console.log('point of view tests: ok');
