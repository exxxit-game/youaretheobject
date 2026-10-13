// The reading of the headset's own outputs by tools/measure.mjs, on outputs saved from his Quest 3 on 13.10
// (tests/fixtures/quest3): a misread temperature or GPU share would put a crack under every later comparison
// (his words of 13.10 on precision, docs/owner-decisions-history-2.md; two fact-checks found the first
// baseline's spans and conditions wrong).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { thermalOf, memoryOf, gpuIds, gpuSamples, traceGpuOf, windowStats, SLOW_MS, lateMs, mean } from '../tools/measure.mjs';

const read = (f) => fs.readFileSync(new URL(`fixtures/quest3/${f}`, import.meta.url), 'utf8');

// temperatures: only the section "Current temperatures from HAL", not the cached ones printed first (there
// nspss-0 reads 25.7) nor the cooling devices printed after, whose lines look alike
const t = thermalOf(read('thermalservice.txt'), read('battery.txt'));
assert.equal(t.status, 0);
assert.equal(t.current['soc-usr'], 40.747, 'the SoC read from the current section');
assert.equal(t.current['nspss-0'], 39.516003, 'the cached 25.702002 taken instead of the current value');
assert.ok(!('pwm-tach-fan0' in t.current), 'a cooling device read as a temperature');
assert.equal(t.battery, 34, 'the battery in tenths of a degree, as dumpsys prints it');
assert.equal(t.level, 92);

// the GPU's metrics found by name: on this Quest 3, 29 and 30 (Meta's example numbers) are other metrics
const ids = gpuIds(read('gpu-metrics.txt'), ['GPU Frequency', 'GPU % Utilization', '% Shaders Busy', '% Time Shading Vertices', '% Time Shading Fragments']);
assert.deepEqual(ids, { 'GPU Frequency': '2', 'GPU % Utilization': '4', '% Shaders Busy': '17', '% Time Shading Vertices': '25', '% Time Shading Fragments': '32' });
assert.deepEqual(gpuIds(read('gpu-metrics.txt'), ['Avg Bytes / Vertex', 'ALU / Vertex']), { 'Avg Bytes / Vertex': '29', 'ALU / Vertex': '30' });

// every sample of each metric, in order (the room's run of 13.10: 5 samples)
const g = gpuSamples(read('gpu-realtime.txt'));
assert.equal(g['% Time Shading Fragments'].length, 5);
assert.equal(g['% Time Shading Fragments'][0], 97.615);
assert.equal(mean(g['% Time Shading Fragments']), 97.6);
assert.equal(mean(g['% Time Shading Vertices']), 2.4);

// memory: the browser's own summary line, in kB (dumpsys meminfo com.oculus.browser)
const mem = memoryOf(read('meminfo-browser.txt'));
assert.equal(mem.pssKb, 193403);
assert.equal(mem.rssKb, 411284);
// a trace's GPU frame time, as metavr perf analyze-trace prints it (the corridor of 13.10)
assert.deepEqual(traceGpuOf(read('perfetto-analysis.txt')), { frames: 40, avgMs: 6.19, maxMs: 8.72, p75Ms: 6.36 });
assert.deepEqual(traceGpuOf('no GPU data'), { frames: 0, avgMs: null, maxMs: null, p75Ms: null });
assert.deepEqual(windowStats([], 90), { frames: 0 }, 'a window with no frames says so');

// a window: the rate over the frames' own span; late past 1.5 refreshes of the session's rate (a frame that
// missed a refresh comes after two); the 72 Hz bar of tools/quest-look.mjs perf (1000/72 + 2 ms) beside it
assert.equal(Number(SLOW_MS.toFixed(2)), 15.89);
assert.equal(Number(lateMs(90).toFixed(2)), 16.67);
const w = windowStats([11, 11, 11, 20, 11, 15.8, 16], 90);
assert.equal(w.frames, 7);
assert.equal(w.late, 1, 'at 90 Hz only the 20 ms frame missed a refresh');
assert.equal(w.slowUnder72, 2, '20 and 16 ms are over the 72 Hz bar, 15.8 is not');
assert.equal(w.worst, 20);
assert.equal(w.fps, Number((7 / (95.8 / 1000)).toFixed(1)));
assert.equal(w.p50, 11);
// at 120 Hz a frame that lost one refresh (16.7 ms) is late by both bars; at 90 Hz the 72 Hz bar also counts a
// 16 ms frame that lost none (above: late 1, slowUnder72 2)
const fast = windowStats([8.3, 8.3, 16.7, 8.3], 120);
assert.equal(fast.late, 1);
assert.equal(fast.slowUnder72, 1);
assert.equal(mean([]), null, 'no samples give no mean, not NaN');

console.log('measure tests: ok (the headset\'s temperatures, GPU metrics and frame windows read as printed)');
