import assert from 'node:assert/strict';
import { analyse } from '../src/rooms/02-point-of-view/report.js';
import { changeView, INITIAL_VIEW, projection } from '../src/rooms/02-point-of-view/view.js';

const initial = projection(INITIAL_VIEW);
assert.deepEqual(analyse([]), { view: INITIAL_VIEW, frontSeen: false, count: 0, recent: [] });

function act(log, k) {
  log.push({ k, v: changeView(analyse(log).view, k) });
  return analyse(log);
}

const direct = act([], 'end');
assert.equal(direct.view.turn, 180);
assert.equal(direct.frontSeen, false);
assert.deepEqual(projection(direct.view), initial);

const log = [];
const front = act(log, 'front');
assert.equal(front.view.turn, 90);
assert.equal(front.frontSeen, true);
assert.notDeepEqual(projection(front.view).rotation, initial.rotation);
assert.deepEqual(projection(front.view).position, initial.position);
assert.deepEqual(projection(front.view).scale, initial.scale);

const viaFront = act(log, 'end');
assert.deepEqual(viaFront.view, direct.view);
assert.deepEqual(projection(viaFront.view), initial);
assert.equal(viaFront.frontSeen, true);
assert.equal(act(log, 'start').frontSeen, true);

const scaled = projection(act(log, 'scale').view);
assert.notDeepEqual(scaled.scale, initial.scale);
assert.deepEqual(scaled.position, initial.position);
const angled = act(log, 'angle');
assert.notDeepEqual(projection(angled.view).position, scaled.position);
assert.deepEqual(projection(angled.view).scale, scaled.scale);
assert.deepEqual(projection(angled.view).rotation, initial.rotation);
assert.equal(angled.frontSeen, true);
assert.equal(angled.count, 5);
assert.deepEqual(angled.recent, ['end', 'start', 'scale', 'angle']);
assert.deepEqual(projection(act(log, 'end').view), projection(angled.view));

for (const action of ['scale', 'angle']) {
  let view = INITIAL_VIEW;
  for (let i = 0; i < 3; i++) view = changeView(view, action);
  assert.deepEqual(projection(view), initial, `${action} cycles through a fixed range`);
}
assert.throws(() => changeView(INITIAL_VIEW, 'unknown'), RangeError);
console.log('point of view tests: ok');
