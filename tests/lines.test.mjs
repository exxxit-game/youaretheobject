import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { PROTOCOL as P, DISPLAY as D } from '../src/rooms/02-lines/protocol.js';
import { ORIGINAL } from '../src/rooms/02-lines/original.js';
import { makeSchedule } from '../src/rooms/02-lines/schedule.js';
import { segments, metres } from '../src/rooms/02-lines/geometry.js';
import { analyse } from '../src/rooms/02-lines/report.js';
import { createTrial } from '../src/rooms/02-lines/flow.js';

// Cretenoud 2020 p. 14, p. 3. Independent constants, not copied from the implementation.
assert.deepEqual(P, { referenceDeg: 15.6, referenceShiftDeg: 0.2, comparisonDownDeg: 2.1,
  startMinDeg: 0, startMaxDeg: 21.5, finDeg: 3.5, inwardLeftDeg: 77,
  inwardRightDeg: 74.5, outwardDeg: 102.2, practicePerCondition: 1, repetitions: 2 });
assert.deepEqual(ORIGINAL, { recruited: 86, analysed: 76, variants: 12, trials: 24, expectedPoorOutwardEffect: false });
assert.ok(Object.isFrozen(P) && Object.isFrozen(ORIGINAL));
for (let i = 0; i < 100; i++) {
  let seed = i + 1;
  const s = makeSchedule(() => (seed = (seed * 16807) % 2147483647) / 2147483647);
  assert.equal(s.length, 6);
  for (const c of ['inward', 'outward']) {
    assert.equal(s.filter(r => r.condition === c && r.practice).length, 1);
    assert.equal(s.filter(r => r.condition === c && !r.practice).length, 2);
  }
  assert.ok(s.every(r => r.startDeg >= 0 && r.startDeg < 21.5));
}
assert.throws(() => makeSchedule(() => 1));
assert.throws(() => makeSchedule(() => NaN));
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
for (const c of ['inward', 'outward']) {
  const lines = segments(c, 15.6);
  assert.equal(lines.length, 6);
  near(lines[0].b[1] - lines[0].a[1], lines[1].b[1] - lines[1].a[1]);
  assert.equal(segments(c, 15.6, false).length, 2);
  for (const line of lines.slice(2)) {
    near(Math.hypot(line.b[0] - line.a[0], line.b[1] - line.a[1]), metres(3.5));
    assert.ok(c === 'inward' ? Math.abs(line.b[1]) < Math.abs(line.a[1]) : Math.abs(line.b[1]) > Math.abs(line.a[1]));
  }
  for (const p of lines.flatMap(l => [l.a, l.b])) assert.ok(Math.abs(p[0]) < D.width / 2 && Math.abs(p[1]) < D.height / 2);
}
const log = ['inward', 'outward', 'inward', 'outward'].map(condition => ({ condition, practice: false, adjustedDeg: 15.6, activeMs: 100 }));
assert.ok(analyse(log).every(r => r.bias === 0));
const practice = { condition: 'inward', practice: true, adjustedDeg: 1, activeMs: 30 };
assert.deepEqual(analyse([...log, practice]), analyse(log));
const changed = log.map(r => ({ ...r, adjustedDeg: 10 }));
near(analyse(changed)[0].bias, (metres(10) - metres(15.6)) / metres(15.6));
for (const bad of [[], log.slice(1), [...log, log[0]], [{ ...log[0], adjustedDeg: NaN }, ...log.slice(1)]]) assert.throws(() => analyse(bad));
const f = createTrial(() => 0.4);
f.begin(); assert.equal(f.state, 'intro'); f.next(); f.next(); f.next();
assert.equal(f.state, 'adjust');
f.adjust(20); f.tick(100); f.pause(true);
assert.equal(f.confirm(0, f.generation), false); assert.equal(f.adjust(2), false); f.tick(100);
f.pause(false); assert.equal(f.state, 'interrupted'); f.next();
near(f.value, 0.4 * 21.5); f.tick(50); assert.ok(f.confirm(0, f.generation));
assert.equal(f.confirm(0, f.generation), false, 'stale confirmation cannot answer the next trial');
assert.equal(f.log[0].activeMs, 50); assert.ok(f.confirm(1, f.generation));
assert.equal(f.state, 'ready'); assert.ok(f.repeatPractice()); f.next(); f.confirm(0, f.generation); f.confirm(1, f.generation);
assert.ok(f.measure());
for (let i = 2; i < 6; i++) { f.adjust(15.6); assert.ok(f.confirm(i, f.generation)); }
assert.equal(f.report(), null); assert.equal(f.state, 'feedback'); assert.ok(f.answer(0));
assert.ok(f.report().every(r => r.bias === 0)); f.leave(); assert.equal(f.state, 'idle');
assert.equal(f.confirm(5, f.generation), false); assert.deepEqual(f.log, []); f.begin(); assert.equal(f.state, 'intro');
f.next(); f.next(); f.next();
const previousRun = f.generation;
f.begin(); f.next(); f.next(); f.next();
assert.equal(f.confirm(0, previousRun), false, 'old run must not answer the new run at reused index zero');
const beforePause = f.generation;
f.pause(true); f.pause(false); f.next();
assert.equal(f.confirm(0, beforePause), false, 'removed pre-pause confirmation cannot answer the resumed adjustment');
f.tick(100); f.tick(250); f.tick(1000); f.confirm(0, f.generation);
assert.equal(f.log[0].activeMs, 1350, 'visible slow frames count, explicit pauses do not');
const boundary = log.map(r => ({ ...r, adjustedDeg: D.maxDeg }));
assert.ok(analyse(boundary).every(r => r.limited));
assert.ok(analyse(log).every(r => !r.limited));
const uneven = log.map((r, i) => ({ ...r, adjustedDeg: i < 2 ? 0 : 21.5 }));
near(analyse(uneven)[0].meanMetres, (metres(0) + metres(21.5)) / 2);
// Execute the actual bar handlers without a browser: removed controls must be inert.
{
  const source = fs.readFileSync(new URL('../src/rooms/02-lines/adjustment.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace('export function', 'function');
  const bars = [], stickHandlers = {};
  const right = { addEventListener(type, fn) { stickHandlers[type] = fn; }, removeEventListener(type) { delete stickHandlers[type]; } };
  const context = { D, T: {}, FONT: '', requestAnimationFrame: () => { throw Error('Window frames unavailable in immersive mode'); },
    window: { addEventListener() {}, removeEventListener() {} },
    document: { createElement: () => {
      const el = { handlers: {}, components: {}, dataset: {}, classList: { add() {} }, setAttribute() {}, remove() {},
        addEventListener(type, fn) { this.handlers[type] = fn; } };
      bars.push(el); return el;
    } } };
  const make = vm.runInNewContext(source + '\ncreateAdjustment', context);
  let value = 10;
  const control = make({ sceneEl: { querySelector: () => right }, appendChild() {} },
    { y: 1, z: -1, getValue: () => value, enabled: () => true, change: v => { value = v; return true; } });
  const click = (bar, x) => bar.handlers.click({ detail: { intersection: { uv: { x } } } });
  control.show(); const removed = bars.at(-1); control.hide(); control.show();
  click(removed, 0.95); assert.equal(value, 10, 'removed bar cannot change a later answer');
  click(bars.at(-1), 0.95); assert.equal(value, 25, 'upper endpoint snaps exactly to the warned bound');
  click(bars.at(-1), 0.05); assert.equal(value, 0);
  click(bars.at(-1), 0.5); near(value, 12.5);
  stickHandlers.thumbstickmoved({ detail: { y: -1 } }); control.tick(50);
  near(value, 12.5 + D.speedDeg * 0.05);
  control.reset(); control.tick(50); near(value, 12.5 + D.speedDeg * 0.05);
  click(bars.at(-1), 0.5);
  control.dispose(); click(bars.at(-1), 0.95); near(value, 12.5);
  assert.equal(stickHandlers.thumbstickmoved, undefined);
}
// The mounted room must advance from renderer frames even when Window RAF cannot run.
{
  const source = fs.readFileSync(new URL('../src/rooms/02-lines/room.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/^export \{.*;\r?\n/gm, '').replace(/export /g, '');
  const definitions = {}, attrs = new Set(), trial = createTrial(() => 0.4), steps = [];
  const adjustment = { tick: ms => steps.push(ms), hide() {}, dispose() {} };
  const panel = { write() {} };
  const target = { components: { panel }, addEventListener() {}, removeEventListener() {} };
  const root = { querySelector: () => target, sceneEl: { querySelector: () => target, addEventListener() {}, removeEventListener() {} },
    setAttribute: key => attrs.add(key), removeAttribute: key => attrs.delete(key) };
  const ctx = { createTrial: () => trial, createAdjustment: () => adjustment, createChoice: () => ({ hide() {} }),
    createSession() {}, loadVoice() {}, writePlaque() {}, hush() {}, VOICE_LINES: [], SOUNDS: [], ORIGINAL,
    T: { early: '' }, document: { documentElement: { dataset: {} }, addEventListener() {}, removeEventListener() {} },
    AFRAME: { registerComponent: (name, definition) => { definitions[name] = definition; } },
    requestAnimationFrame: () => { throw Error('Window frames unavailable in immersive mode'); } };
  // Strip only import.meta.url because VM runs without module support; no rendering is performed.
  const room = vm.runInNewContext(source.replaceAll('import.meta.url', "'file:///room.js'") + '\n({mount,dispose,hold})', ctx);
  room.mount(root, { number: '101' }); assert.ok(attrs.has('lines-frame'));
  trial.begin(); trial.next(); trial.next(); trial.next();
  const tick = dt => definitions['lines-frame'].tick.call({ el: root }, 0, dt);
  tick(100); tick(250); tick(1000); trial.confirm(0, trial.generation);
  assert.equal(trial.log[0].activeMs, 1350, 'XR renderer counts full active time without Window RAF');
  assert.deepEqual(steps, [100, 250, 1000], 'same renderer frames reach controller adjustment');
  trial.pause(true); tick(5000); trial.pause(false); trial.next(); tick(20); trial.confirm(1, trial.generation);
  assert.equal(trial.log[1].activeMs, 20, 'hidden time and interrupted adjustment are excluded');
  room.dispose(); assert.ok(!attrs.has('lines-frame'));
  const count = steps.length; tick(20); assert.equal(steps.length, count, 'disposed room cannot keep ticking');
  room.mount(root, { number: '205' }); assert.ok(attrs.has('lines-frame')); room.dispose();
}
console.log('lines tests: source constants, geometry, schedule, actual-length report and interrupted/stale input: ok');
