// tools/stand-measure.mjs reads the headset as printed (outputs saved from his Quest 3, tests/fixtures/quest3) and
// judges each known change from its samples alone: a tool that misreads, or a verdict that passes a change the
// tools missed, would let the 45-minute run be trusted before its tools were (docs/research/long-measure.md).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sandboxedPids, pssOf, proximityOf, verdicts, MARKS } from '../tools/stand-measure.mjs';

const read = (f) => fs.readFileSync(new URL(`fixtures/quest3/${f}`, import.meta.url), 'utf8');
assert.deepEqual(sandboxedPids(read('meminfo-whole.txt')), [11822, 11665], 'the browser\'s sandboxed processes, once each');
assert.equal(pssOf(read('meminfo-sandboxed.txt')), 285204, 'a process\'s own TOTAL PSS in kB');
assert.equal(proximityOf(read('vrpowermanager.txt')), 'DISABLED', 'the proximity override as the power service prints it');
assert.equal(proximityOf(''), null);

// a run as the tools should see it: 90, then 72, then 90 frames a second; a box adds one call and 12 triangles;
// ten stalled frames are late; the session visible and the override on throughout
// sample times as a real trial on his Quest 3 gave them (docs/research/long-measure.md, "The trial"): each read just
// after its mark, as the tool reads them
const marks = MARKS;
const TIMES = [10.2, 20.6, 30.1, 40.4, 42.1, 59.5, 60.1, 70.4, 75.1, 85.1, 95.1, 105.1, 122.7, 125.1];
const make = (stallLate = 10, boxTris = 12) => TIMES.map((s, i) => {
  const from = i ? TIMES[i - 1] : 0, dt = s - from;
  const rate = from >= 30 && s <= 60.2 ? 72 : 90, box = from >= 75 && s <= 85.2, stalled = from >= 95 && s <= 105.2;
  const frames = Math.round(rate * dt);
  // the reflections' start: renders beyond the frames in the samples of the first 20 s
  return { s, dt, prox: 'CLOSE', renderFrames: i === 0 ? undefined : frames + (from < 20 ? 100 : 0),
    page: { frames, late: stalled ? stallLate : 0, calls: box ? 27 : 26, triangles: box ? 25044 + boxTris : 25044, visibility: 'visible' } };
});
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
