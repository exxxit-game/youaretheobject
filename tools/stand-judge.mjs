// The stand measure's readers and judges, apart from the headset (tools/stand-measure.mjs runs them): each reads a
// dump as his Quest 3 prints it or judges a run from its samples alone, so tests/stand.test.mjs holds them on saved
// outputs and made-up runs, and a run's log can be judged again with no headset.
// dumpsys meminfo lists every process, each in several blocks (by process, by importance): the browser's sandboxed
// ones by pid, once each (one of them runs the page), so a page allocation is looked for in each
export function sandboxedPids(wholeDump) {
  return [...new Set([...String(wholeDump).matchAll(/sandboxed_process\d*[^\n]*?\(pid (\d+)/g)].map((m) => Number(m[1])))];
}
export const pssOf = (pidDump) => Number((String(pidDump).match(/TOTAL PSS:\s*(\d+)/) || [])[1]);
// dumpsys vrpowermanager: the override that keeps an unworn headset drawing (ours reads CLOSE)
export const proximityOf = (dump) => (String(dump).match(/Virtual proximity state: (\w+)/) || [])[1] || null;

// What each known change must show, judged from the samples alone. A sample: { s (seconds since VR), page: { frames,
// late, renderFrame, calls, triangles, visibility, rate }, prox }. Rates: the session asks 90, then 72 (W3C WebXR
// updateTargetFrameRate), then 90; a frame-count per second within 6 % of the asked rate counts as following it.
export function verdicts(samples, marks) {
  // a sample counts the time from the one before it to itself (s - dt, s]; it is read just after its mark, so a
  // window takes the samples whose time lies within it, give or take the reading's own second and a half
  const at = (from, to) => samples.filter((x) => x.page && x.s - x.dt >= from - 0.5 && x.s <= to + 1.5);
  const fps = (xs) => { const f = xs.reduce((a, x) => a + x.page.frames, 0), t = xs.reduce((a, x) => a + x.dt, 0); return t ? f / t : null; };
  const near = (v, want) => v !== null && Math.abs(v - want) / want <= 0.06;
  const v = {};
  const before = fps(at(marks.vr + 2, marks.to72)), slow = fps(at(marks.to72 + 2, marks.to90)), after = fps(at(marks.to90 + 2, marks.boxOn));
  v.frameRate = { pass: near(before, 90) && near(slow, 72) && near(after, 90), before, slow, after };
  // three.js counts every render in renderer.info.render.frame, the page counts every XR frame: one per frame each,
  // once the start is over; at the start the reflections' cube pictures are renders too (reflect-env.js: four, six
  // faces each, every 2.5 s for 15 s), so the renders over the frames there are kept apart, as what the start draws
  const counted = samples.filter((x) => x.page && x.renderFrames !== undefined);
  const settled = counted.filter((x) => x.s - x.dt >= marks.vr + 20), early = counted.filter((x) => x.s - x.dt < marks.vr + 20);
  const gaps = settled.map((x) => x.renderFrames - x.page.frames);
  v.twoCounters = { pass: gaps.length > 0 && gaps.every((g) => Math.abs(g) <= 3), gaps, extraRendersAtStart: early.map((x) => x.renderFrames - x.page.frames) };
  const plain = at(marks.boxOn - 10, marks.boxOn), withBox = at(marks.boxOn, marks.boxOff), last = (xs) => xs[xs.length - 1]?.page;
  const dCalls = (last(withBox)?.calls ?? NaN) - (last(plain)?.calls ?? NaN), dTris = (last(withBox)?.triangles ?? NaN) - (last(plain)?.triangles ?? NaN);
  // one box: one draw call and 12 triangles, or twice that if each eye is drawn on its own (no multiview)
  v.box = { pass: [1, 2].includes(dCalls) && dTris === 12 * dCalls, dCalls, dTris };
  const stall = at(marks.stall, marks.stall + 10), calm = at(marks.stall - 10, marks.stall);
  const lateIn = (xs) => xs.reduce((a, x) => a + x.page.late, 0);
  v.lateFrames = { pass: lateIn(stall) >= 8 && lateIn(calm) <= 2, stalled: lateIn(stall), calm: lateIn(calm) };
  v.stayedVisible = { pass: samples.every((x) => !x.page || x.page.visibility === 'visible'), seen: [...new Set(samples.map((x) => x.page?.visibility))] };
  v.stayedAwake = { pass: samples.every((x) => x.prox === 'CLOSE'), seen: [...new Set(samples.map((x) => x.prox))] };
  return v;
}

// The long run read minute by minute from its samples: the rate in each minute (VRC.Quest.Performance.1: never below
// 60 fps for long), late frames, whether the session stayed visible and the override on, the heat's course (the
// first throttling threshold of his Quest 3 is the virtual surface sensor's 48 °C: long-measure.md), the GPU's clocks
// and the memory of each of the browser's sandboxed processes by its pid.
export function longSummary(rows) {
  const minutes = new Map();
  for (const x of rows) { const m = Math.floor((x.s - x.dt / 2) / 60); const a = minutes.get(m) || { frames: 0, t: 0, late: 0 }; a.frames += x.page.frames; a.t += x.dt; a.late += x.page.late; minutes.set(m, a); }
  const perMinute = [...minutes.entries()].map(([m, a]) => ({ m, fps: Number((a.frames / a.t).toFixed(1)), late: a.late }));
  const heat = rows.filter((x) => x.thermal).map((x) => ({ s: x.s, status: x.thermal.status, surface: x.thermal.current['surf-virt-usr'] ?? null, soc: x.thermal.current['soc-usr'] ?? null, battery: x.thermal.battery, level: x.thermal.level }));
  // each of the browser's sandboxed processes by its pid, first and last: the largest is not always the same one
  // (the first long run: the largest changed five times), and which is the page is proven only by an allocation
  const byPid = {};
  for (const x of rows.filter((r) => r.pss)) for (const [pid, kb] of Object.entries(x.pss)) (byPid[pid] ||= []).push([x.s, kb]);
  const pages = Object.entries(byPid).map(([pid, v]) => ({ pid, firstKb: v[0][1], lastKb: v.at(-1)[1], maxKb: Math.max(...v.map((p) => p[1])), samples: v.length }));
  return {
    perMinute, minFps: perMinute.length ? Math.min(...perMinute.map((p) => p.fps)) : null,
    minutesUnder60: perMinute.filter((p) => p.fps < 60).length, lateFrames: rows.reduce((a, x) => a + x.page.late, 0),
    worstStepMs: rows.length ? Math.max(...rows.map((x) => x.page.maxStep)) : null,
    stayedVisible: rows.every((x) => x.page.visibility === 'visible'), notVisibleAt: rows.filter((x) => x.page.visibility !== 'visible').map((x) => x.s),
    stayedAwake: rows.every((x) => x.prox === 'CLOSE'), heat, maxStatus: heat.length ? Math.max(...heat.map((h) => h.status)) : null,
    gpuClocks: [...new Set(rows.filter((x) => x.gpu).flatMap((x) => x.gpu['GPU Frequency'] || []))], memory: pages,
    gpuResources: rows.length ? { first: [rows[0].page.geometries, rows[0].page.textures, rows[0].page.programs], last: [rows.at(-1).page.geometries, rows.at(-1).page.textures, rows.at(-1).page.programs] } : null
  };
}

// The flow run read step by step (tools/stand-flow.mjs names each step with the page's time; the page and the tool
// read the same headset's clock): each step's length, its late frames (each one carries the step it fell in, so
// these are exact), the worst of them, and the GPU's resources at the step's first and last sample, which show what
// the step loaded (geometries, textures, shader programs). Its frames a second are from the 5 s samples that end
// inside it, so a short step's rate is only roughly its own.
export function flowSummary(rows, steps) {
  const lates = rows.flatMap((x) => x.page.lates || []);
  const res = (x) => (x ? [x.page.geometries, x.page.textures, x.page.programs] : null);
  const perStep = steps.map(([from, name], i) => {
    const to = steps[i + 1] ? steps[i + 1][0] : Infinity;
    const own = lates.filter((l) => l[2] === name), inside = rows.filter((x) => x.at > from && x.at <= to);
    const t = inside.reduce((a, x) => a + x.dt, 0);
    return { name, seconds: Number.isFinite(to) ? Number(((to - from) / 1000).toFixed(1)) : null, lateFrames: own.length,
      worstLateMs: own.length ? Math.max(...own.map((l) => l[1])) : null,
      fpsRough: t ? Number((inside.reduce((a, x) => a + x.page.frames, 0) / t).toFixed(1)) : null,
      resources: { first: res(inside[0]), last: res(inside.at(-1)) } };
  });
  return { perStep, lateOutsideSteps: lates.filter((l) => !steps.some(([, n]) => n === l[2])).length };
}

// The headset spared, not stressed: a run stops 3 °C under the virtual surface sensor's first threshold (48.0 °C in
// his Quest 3's table, tests/fixtures/quest3) or at any throttling status (AOSP thermal mitigation: 1 LIGHT and up);
// a heat that cannot be read is not watched, so it stops the run too (a model naming its sensors otherwise is fixed first).
export const SURFACE_STOP_C = 45;
export function heatStop(t) {
  const surface = t?.current?.['surf-virt-usr'];
  if (!t || !Number.isFinite(t.status) || !Number.isFinite(surface)) return 'the heat could not be read';
  if (t.status >= 1) return `thermal status ${t.status}`;
  if (surface >= SURFACE_STOP_C) return `surface ${surface} °C`;
  return null;
}

// the trial's timeline, seconds after VR: each known change at its mark
export const MARKS = { vr: 0, to72: 30, to90: 60, boxOn: 75, boxOff: 85, stall: 95, memOn: 105, end: 125 };
