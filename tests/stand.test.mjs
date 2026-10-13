// tools/stand-measure.mjs reads the headset as printed (outputs saved from his Quest 3, tests/fixtures/quest3) and
// judges each known change from its samples alone: a tool that misreads, or a verdict that passes a change the
// tools missed, would let the 45-minute run be trusted before its tools were (docs/research/long-measure.md).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sandboxedPids, pssOf, proximityOf, verdicts } from '../tools/stand-measure.mjs';

const read = (f) => fs.readFileSync(new URL(`fixtures/quest3/${f}`, import.meta.url), 'utf8');
assert.deepEqual(sandboxedPids(read('meminfo-whole.txt')), [11822, 11665], 'the browser\'s sandboxed processes, once each');
assert.equal(pssOf(read('meminfo-sandboxed.txt')), 285204, 'a process\'s own TOTAL PSS in kB');
assert.equal(proximityOf(read('vrpowermanager.txt')), 'DISABLED', 'the proximity override as the power service prints it');
assert.equal(proximityOf(''), null);

// a run as the tools should see it: 90, then 72, then 90 frames a second; a box adds one call and 12 triangles;
// ten stalled frames are late; the session visible and the override on throughout
const marks = { vr: 0, to72: 30, to90: 60, boxOn: 75, boxOff: 85, stall: 95, memOn: 105, end: 125 };
const make = (stallLate = 10, boxTris = 12) => {
  const xs = [];
  for (let s = 10; s <= 125; s += 10) {
    const rate = s > 30 && s <= 60 ? 72 : 90, box = s > 75 && s <= 85;
    xs.push({ s, dt: 10, prox: 'CLOSE', renderFrames: rate * 10,
      page: { frames: rate * 10, late: s > 95 && s <= 105 ? stallLate : 0, calls: box ? 21 : 20, triangles: box ? 24000 + boxTris : 24000, visibility: 'visible' } });
  }
  return xs;
};
const ok = verdicts(make(), marks);
for (const [k, v] of Object.entries(ok)) assert.equal(v.pass, true, `a run the tools saw right fails ${k}: ${JSON.stringify(v)}`);
// each verdict must fail when its change was not seen
assert.equal(verdicts(make(0), marks).lateFrames.pass, false, 'ten stalled frames unseen still passed');
assert.equal(verdicts(make(10, 0), marks).box.pass, false, 'a box with no triangles still passed');
const stuck = make().map((x) => ({ ...x, page: { ...x.page, frames: 900 }, renderFrames: 900 }));
assert.equal(verdicts(stuck, marks).frameRate.pass, false, 'a rate that never left 90 still passed');
const asleep = make().map((x, i) => (i === 5 ? { ...x, prox: 'DISABLED', page: { ...x.page, visibility: 'hidden' } } : x));
assert.equal(verdicts(asleep, marks).stayedAwake.pass, false, 'the override lost mid-run still passed');
assert.equal(verdicts(asleep, marks).stayedVisible.pass, false, 'a hidden session still passed');
const split = make().map((x) => ({ ...x, renderFrames: x.renderFrames + 50 }));
assert.equal(verdicts(split, marks).twoCounters.pass, false, 'two frame counters 50 apart still passed');

console.log('stand tests: ok (the headset\'s processes, memory and proximity read as printed; each known change must be seen)');
