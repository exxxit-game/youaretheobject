// The reading of the headset's own outputs by tools/measure.mjs, on outputs saved from his Quest 3 on 13.10
// (tests/fixtures/quest3): a misread temperature or GPU share would put a crack under every later comparison
// (his words of 13.10 on precision, docs/owner-decisions-history-2.md; two fact-checks found the first
// baseline's spans and conditions wrong).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { thermalOf, gpuIds, gpuSamples, windowStats, SLOW_MS, mean } from '../tools/measure.mjs';

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

// a window: the rate over the frames' own span, slow over 1000/72 + 2 ms (tools/quest-look.mjs perf)
assert.equal(Number(SLOW_MS.toFixed(2)), 15.89);
const w = windowStats([11, 11, 11, 20, 11, 15.8, 16]);
assert.equal(w.frames, 7);
assert.equal(w.slow, 2, '20 and 16 ms are slow, 15.8 is not');
assert.equal(w.worst, 20);
assert.equal(w.fps, Number((7 / (95.8 / 1000)).toFixed(1)));
assert.equal(w.p50, 11);

console.log('measure tests: ok (the headset\'s temperatures, GPU metrics and frame windows read as printed)');
