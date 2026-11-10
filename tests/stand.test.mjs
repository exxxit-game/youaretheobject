// tools/stand-measure.mjs reads the headset as printed (outputs saved from his Quest 3, tests/fixtures/quest3) and
// judges each known change from its samples alone: a tool that misreads, or a verdict that passes a change the
// tools missed, would let the 45-minute run be trusted before its tools were (docs/research/long-measure.md). The readers and
// judges live apart from the headset in tools/stand-judge.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { standOff, withStandProximity, restoreStandProximity } from '../tools/headset.mjs';
import { sandboxedPids, pssOf, proximityOf, verdicts, MARKS, longSummary, flowSummary, heatStop, SURFACE_STOP_C } from '../tools/stand-judge.mjs';
import { thermalOf } from '../tools/measure.mjs';

const read = (f) => fs.readFileSync(new URL(`fixtures/quest3/${f}`, import.meta.url), 'utf8');
assert.deepEqual(sandboxedPids(read('meminfo-whole.txt')), [11822, 11665], 'the browser\'s sandboxed processes, once each');
assert.equal(pssOf(read('meminfo-sandboxed.txt')), 285204, 'a process\'s own TOTAL PSS in kB');
assert.equal(proximityOf(read('vrpowermanager.txt')), 'DISABLED', 'the proximity override as the power service prints it');
assert.equal(proximityOf(''), null);

// Execute the real scoped helper with no device. A previous CLOSE is not physical evidence.
const power = (state = 'HEADSET_UNMOUNTED', virtual = 'DISABLED') =>
  `State: ${state}\nVirtual proximity state: ${virtual}\n`;
assert.equal(standOff(read('vrpowermanager.txt')), true);
for (const dump of [power('HEADSET_MOUNTED'), power('HEADSET_MOUNTED', 'CLOSE'),
  power('HEADSET_UNMOUNTED', 'CLOSE'), '', 'State: STANDBY\n', power('UNKNOWN')]) {
  const calls = [];
  await assert.rejects(withStandProximity({ readPower: () => dump,
    setProximity: on => calls.push(on) }, () => calls.push('work')), /sensor was not changed/);
  assert.deepEqual(calls, [], 'worn, unread and existing overrides must not cause any sensor action');
}
const scoped = async (fault) => {
  const calls = []; let state = power();
  const io = {
    readPower: () => { calls.push('read'); return state; },
    setProximity: on => {
      calls.push(on ? 'enable' : 'disable');
      state = power('HEADSET_MOUNTED', on && fault !== 'restore-stuck' ? 'DISABLED' : 'CLOSE');
      if (!on && fault === 'partial-acquire') throw new Error('acquisition failed after changing the signal');
    }
  };
  try {
    const value = await withStandProximity(io, async () => {
      calls.push('work'); if (fault === 'work') throw new Error('work failed'); return 42;
    });
    return { calls, value };
  } catch (error) { return { calls, error }; }
};
const successfulScope = await scoped();
assert.equal(successfulScope.value, 42);
assert.deepEqual(successfulScope.calls, ['read', 'disable', 'read', 'work', 'enable', 'read']);
for (const fault of ['partial-acquire', 'work', 'restore-stuck']) {
  const result = await scoped(fault);
  assert.ok(result.error, `${fault} reported success`);
  assert.equal(result.calls.at(-2), 'enable', `${fault} skipped restoration`);
  assert.equal(result.calls.at(-1), 'read', `${fault} did not verify restoration`);
}
const restoration = [];
await assert.rejects(restoreStandProximity({ setProximity: () => restoration.push('enable'),
  readPower: () => power('HEADSET_MOUNTED', 'CLOSE') }), /not proven restored/);
assert.deepEqual(restoration, ['enable']);

// Exercise the real main body with only its device/gate/OS adapters replaced. No tool or device runs.
const standSource = fs.readFileSync(new URL('../tools/stand-measure.mjs', import.meta.url), 'utf8');
let mainSource = standSource.slice(standSource.indexOf('async function main()'));
assert.equal((mainSource.match(/await import\('\.\/headset\.mjs'\)/g) || []).length, 1);
assert.equal((mainSource.match(/await import\('\.\/review-gate\.mjs'\)/g) || []).length, 1);
mainSource = mainSource.replace("await import('./headset.mjs')", 'headset')
  .replace("await import('./review-gate.mjs')", 'gates')
  .replaceAll('import.meta.url', JSON.stringify(new URL('../tools/stand-measure.mjs', import.meta.url).href));
async function standMain({ mode = 'check', initial = power(), fault, args = [] } = {}) {
  let state = initial; const calls = [], messages = [];
  const headset = { standOff, withStandProximity, restoreStandProximity,
    connected: () => true, localPort: () => 3217,
    adb: (...a) => {
      const command = a.join(' ');
      if (command.includes('dumpsys vrpowermanager')) { calls.push('read'); return state; }
      if (command.includes('topResumedActivity')) return 'topResumedActivity u0 com.oculus.browser/.Main';
      if (command.includes('dumpsys thermalservice')) return read('thermalservice.txt');
      if (command.includes('dumpsys battery')) return read('battery.txt');
      return '1000';
    },
    serveToHeadset: () => 'http://fixture/', openGame: async () => {},
    page: async () => ({ run: async () => ({ error: 'fixture page failure' }), close: () => { throw Error('fixture close failure'); } }),
    restartBrowser: () => calls.push('restart'),
    sleepNow: () => { calls.push('sleep'); return fault !== 'sleep-refused'; }
  };
  const gates = Object.fromEntries(['requireReview', 'requirePaper'].map(name => [name, () => {
    calls.push(name); if (fault === name) throw Error('fixture gate refused');
  }]));
  const fakeProcess = { argv: ['node', 'stand-measure.mjs', mode, ...args], env: { USERPROFILE: 'fixture' },
    exit: () => { throw Error('unexpected immediate exit'); } };
  const fakeFs = { existsSync: () => false, mkdirSync: () => { if (fault === 'mkdir') throw Error('fixture mkdir failure'); },
    appendFileSync: () => {}, writeFileSync: () => {}, readFileSync: () => '{"step":"fixture"}' };
  const context = { headset, gates, fs: fakeFs, path, fileURLToPath, process: fakeProcess,
    console: { log: text => messages.push(text) }, fetch: async () => ({ ok: fault !== 'server' }),
    setTimeout: fn => { fn(); }, gpuIds: () => ({}), thermalOf, heatStop, proximityOf, verdicts, MARKS,
    execFileSync: (command, a) => {
      if (command !== 'metavr' || !a.includes('proximity')) return '';
      if (a.includes('--status')) return state;
      const enable = a.includes('--enable'); calls.push(enable ? 'enable' : 'disable');
      state = enable ? (fault === 'restore-stuck' ? power('HEADSET_MOUNTED', 'CLOSE') :
        power(fault === 'worn-on-return' ? 'HEADSET_MOUNTED' : 'HEADSET_UNMOUNTED')) : power('HEADSET_MOUNTED', 'CLOSE');
      return '';
    } };
  let error;
  try { await vm.runInNewContext(mainSource + '\nmain();', context); } catch (e) { error = e; }
  return { calls, messages, error, exitCode: fakeProcess.exitCode };
}
for (const initial of [power('HEADSET_MOUNTED'), '', power('HEADSET_MOUNTED', 'CLOSE')]) {
  for (const mode of ['check', 'trial', 'long', 'flow']) {
    const r = await standMain({ initial, mode });
    assert.equal(r.exitCode, 1);
    assert.ok(!r.calls.some(x => ['disable', 'enable', 'sleep', 'restart'].includes(x)), `${mode} acted on an unproven off state`);
  }
}
for (const fault of ['requireReview', 'requirePaper']) {
  const r = await standMain({ mode: 'trial', fault });
  assert.ok(r.error); assert.ok(!r.calls.includes('disable'), 'a refused review touched the sensor');
}
for (const options of [{}, { fault: 'server' }, { mode: 'trial', fault: 'mkdir' }, { mode: 'trial', fault: 'close' }]) {
  const r = await standMain(options);
  assert.equal(r.calls.filter(x => x === 'disable').length, 1);
  assert.equal(r.calls.filter(x => x === 'enable').length, 1, 'an early setup/close/return skipped restoration');
  assert.ok(r.calls.indexOf('read', r.calls.indexOf('enable')) > r.calls.indexOf('enable'));
}
assert.equal((await standMain({ fault: 'restore-stuck' })).exitCode, 1, 'command success with CLOSE still active passed');
for (const mode of ['check', 'long']) {
  const r = await standMain({ mode, args: mode === 'long' ? ['--minutes=Infinity'] : [] });
  if (mode === 'long') { assert.ok(r.error); assert.deepEqual(r.calls, [], 'invalid arguments touched the device'); }
}
const returnedWorn = await standMain({ mode: 'trial', fault: 'worn-on-return' });
assert.ok(!returnedWorn.calls.some(x => ['sleep', 'restart'].includes(x)), 'idle actions ran after a worn restoration');
const restoredWorn = await standMain({ mode: 'restore', initial: power('HEADSET_MOUNTED', 'CLOSE'), fault: 'worn-on-return' });
assert.deepEqual(restoredWorn.calls.filter(x => ['disable', 'enable', 'sleep', 'restart'].includes(x)), ['enable']);
const refusedSleep = await standMain({ mode: 'restore', fault: 'sleep-refused' });
assert.equal(JSON.parse(refusedSleep.messages.at(-1)).slept, false, 'a refused sleep was reported as performed');
for (const mode of ['look', 'judge']) {
  const r = await standMain({ mode });
  assert.ok(!r.calls.some(x => ['disable', 'enable'].includes(x)), `${mode} unexpectedly changed proximity`);
}

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
