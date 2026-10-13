// tools/stand-measure.mjs reads the headset as printed (outputs saved from his Quest 3, tests/fixtures/quest3) and
// judges each known change from its samples alone: a tool that misreads, or a verdict that passes a change the
// tools missed, would let the 45-minute run be trusted before its tools were (docs/research/long-measure.md). The readers and
// judges live apart from the headset in tools/stand-judge.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sandboxedPids, pssOf, proximityOf, verdicts, MARKS, longSummary, flowSummary, heatStop, SURFACE_STOP_C } from '../tools/stand-judge.mjs';
import { thermalOf } from '../tools/measure.mjs';

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

// the long run's minutes: one minute at 54 fps is a minute under Meta's 60; a hidden sample and a lost override are
// named; the heat's course and the page's memory are read from the samples that carry them
const row = (s, frames, extra = {}) => ({ s, dt: 10, prox: 'CLOSE', page: { frames, late: 0, maxStep: 11.1, visibility: 'visible', geometries: 257, textures: 40, programs: 53 }, ...extra });
const heat = { status: 0, current: { 'surf-virt-usr': 34, 'soc-usr': 50 }, battery: 33, level: 90 };
const rows = [];
for (let s = 10; s <= 180; s += 10) rows.push(row(s, s > 60 && s <= 120 ? 540 : 900, s % 30 === 0 ? { thermal: heat } : s % 60 === 0 ? {} : {}));
rows[3] = { ...rows[3], pss: { 11822: 285000, 11665: 200000 } };
const long = longSummary(rows);
assert.deepEqual(long.perMinute.map((p) => p.fps), [90, 54, 90], 'the rate of each minute from its samples');
assert.equal(long.minutesUnder60, 1);
assert.equal(long.stayedVisible, true);
assert.deepEqual(long.memory, [{ pid: '11665', firstKb: 200000, lastKb: 200000, maxKb: 200000, samples: 1 }, { pid: '11822', firstKb: 285000, lastKb: 285000, maxKb: 285000, samples: 1 }],
  'each sandboxed process by its own pid, never the largest of the moment');
assert.equal(long.heat.length, 6);
const lost = longSummary(rows.map((x, i) => (i === 7 ? { ...x, prox: 'DISABLED', page: { ...x.page, visibility: 'hidden' } } : x)));
assert.equal(lost.stayedVisible, false); assert.deepEqual(lost.notVisibleAt, [80]); assert.equal(lost.stayedAwake, false);

// the stop for heat, read from his Quest 3's own dumps: calm as saved; stopped at the surface's 45 °C, at a throttling
// status, and when the heat cannot be read; 45 is 3 °C under the surface sensor's first threshold in its own table
const dump = read('thermalservice.txt'), batt = read('battery.txt');
assert.equal(heatStop(thermalOf(dump, batt)), null, 'a calm headset stopped the run');
const warm = dump.replace(/mValue=33\.714(, mType=3, mName=surf-virt-usr)/, 'mValue=45.2$1');
assert.equal(heatStop(thermalOf(warm, batt)), 'surface 45.2 °C', 'a surface at 45.2 °C did not stop the run');
assert.equal(heatStop(thermalOf(dump.replace('Thermal Status: 0', 'Thermal Status: 1'), batt)), 'thermal status 1', 'light throttling did not stop the run');
assert.equal(heatStop(thermalOf('error: device offline', '')), 'the heat could not be read', 'an unread heat let the run go on');
const first = Number(dump.match(/mName=surf-virt-usr, mHotThrottlingThresholds=\[NaN, ([\d.]+)/)[1]);
assert.equal(SURFACE_STOP_C, first - 3, `the stop is not 3 °C under the surface's first threshold (${first})`);

// the flow run step by step: each late frame counts in the step it carries, the worst of them is named, the GPU's
// resources are read at a step's first and last sample (what it loaded), a late frame with no step is counted apart
const T = 1_700_000_000_000;
const steps = [[T, 'sign'], [T + 20000, 'door 101 pressed'], [T + 30000, 'room: intro']];
const frow = (sec, frames, lates, g) => ({ s: sec, at: T + sec * 1000, dt: 5, page: { frames, late: lates.length, maxStep: 11.1, visibility: 'visible', geometries: g, textures: 40, programs: 53, lates } });
const flowRows = [frow(5, 450, []), frow(10, 450, []), frow(15, 450, []), frow(20, 450, []),
  frow(25, 400, [[T + 21000, 60.2, 'door 101 pressed'], [T + 22000, 33.4, 'door 101 pressed']], 257), frow(30, 450, [], 290),
  frow(35, 450, [[T + 31000, 25, 'room: intro'], [T + 31500, 25, null]], 300), frow(40, 450, [], 300)];
flowRows.slice(0, 4).forEach((x) => { x.page.geometries = 257; });
const fl = flowSummary(flowRows, steps);
assert.deepEqual(fl.perStep.map((p) => [p.name, p.seconds, p.lateFrames, p.worstLateMs]), [['sign', 20, 0, null], ['door 101 pressed', 10, 2, 60.2], ['room: intro', null, 1, 25]],
  "each step's length, its late frames and the worst of them");
assert.deepEqual(fl.perStep[1].resources, { first: [257, 40, 53], last: [290, 40, 53] }, "what the door's step loaded, from its first and last sample");
assert.equal(fl.perStep[1].fpsRough, 85, 'the rough rate of a step from the samples that end inside it');
assert.equal(fl.lateOutsideSteps, 1, 'a late frame with no step is counted apart, not lost');

console.log('stand tests: ok (the headset\'s processes, memory and proximity read as printed; each known change must be seen; heat stops a run; a flow run read step by step)');
