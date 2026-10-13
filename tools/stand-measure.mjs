// The measure with the headset on a stand, unworn: first a two-minute trial that proves the tools, then the
// 45-minute run (docs/owner-decisions.md, "Quality measures before polishing old numbers"; the plan:
// docs/research/long-measure.md).
// No reading is trusted before its tool has shown a change made on purpose whose size is known beforehand
// (long-measure.md, "Known-change proofs"): the trial makes each such change once and writes whether each tool saw
// it. Every time is the headset's own clock; every tool's raw output is kept beside the log (as tools/measure.mjs).
// Usage: node tools/stand-measure.mjs trial      (about three minutes; the owner does not wear it)
//        node tools/stand-measure.mjs long       (45 minutes in the corridor, the view turned a little each minute)
//        node tools/stand-measure.mjs restore    (the headset given back as it was, after a run cut short)
//        node tools/stand-measure.mjs judge <run folder>   (a run's verdicts again from its log)
// The boundary is not paused (a safety setting of his headset): the stand stands inside his play area, lit, so it
// does not rise; a VR entry it holds is given up after 20 s and the browser restarted before the headset sleeps,
// the cure of docs/mistakes.md ("the headset browser had lost its link to the VR system for hours").
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { thermalOf, gpuIds, gpuSamples, mean } from './measure.mjs';

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
// and the page's memory (the browser's largest sandboxed process: the page's, by the trial's 64 MiB proof).
export function longSummary(rows) {
  const minutes = new Map();
  for (const x of rows) { const m = Math.floor((x.s - x.dt / 2) / 60); const a = minutes.get(m) || { frames: 0, t: 0, late: 0 }; a.frames += x.page.frames; a.t += x.dt; a.late += x.page.late; minutes.set(m, a); }
  const perMinute = [...minutes.entries()].map(([m, a]) => ({ m, fps: Number((a.frames / a.t).toFixed(1)), late: a.late }));
  const heat = rows.filter((x) => x.thermal).map((x) => ({ s: x.s, status: x.thermal.status, surface: x.thermal.current['surf-virt-usr'] ?? null, soc: x.thermal.current['soc-usr'] ?? null, battery: x.thermal.battery, level: x.thermal.level }));
  const pages = rows.filter((x) => x.pss).map((x) => ({ s: x.s, pageKb: Math.max(...Object.values(x.pss)) }));
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

// the trial's timeline, seconds after VR: each known change at its mark
export const MARKS = { vr: 0, to72: 30, to90: 60, boxOn: 75, boxOff: 85, stall: 95, memOn: 105, end: 125 };

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();

async function main() {
  const mode = process.argv[2];
  if (!['trial', 'long', 'restore', 'judge'].includes(mode)) { console.log('usage: node tools/stand-measure.mjs trial | long [--minutes=N] | restore | judge <run folder>'); process.exit(1); }
  // a run's verdicts again from its own log, with no headset (the samples are all in it)
  if (mode === 'judge') {
    const lines = fs.readFileSync(path.join(process.argv[3], 'log.jsonl'), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
    console.log(JSON.stringify(verdicts(lines.filter((l) => l.step === 'sample'), MARKS), null, 1));
    return;
  }
  const { adb, serveToHeadset, localPort, openGame, page, wornByPerson, connected, sleepNow, restartBrowser, screencap } = await import('./headset.mjs');
  const PREVIEW = 'https://exxxit-game.github.io/object-preview/';
  const { requireReview, requirePaper } = await import('./review-gate.mjs');
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const sh = (cmd) => { try { return adb('shell', `${cmd} ; true`); } catch (e) { return `error: ${e.message}`; } };
  const now = () => Number(sh('date +%s%3N').trim());
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const metavr = (...a) => { try { return execFileSync('metavr', a, { encoding: 'utf8', shell: true }); } catch (e) { return `error: ${e.message}`; } };
  const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

  if (!connected()) { console.log('the headset is not on the cable'); process.exit(1); }
  // Meta: "Re-enable any disabled properties after your test" (ts-scriptable-testing); read back, not assumed
  const giveBack = (why) => {
    const out = metavr('device', 'proximity', '--enable');
    if (why === 'restart') restartBrowser(PREVIEW);
    sleepNow();
    return { out, after: proximityOf(sh('dumpsys vrpowermanager')) };
  };
  if (mode === 'restore') {
    if (wornByPerson()) { console.log('not now: the owner wears the headset'); process.exit(1); }
    console.log(JSON.stringify(giveBack('restart')));
    return;
  }
  requireReview(ROOT, 'VR in the headset', { look: true });
  requirePaper(ROOT, 'VR in the headset', { look: true });
  // this run is for a headset nobody wears: on a person it would hold frames and rates against him
  if (wornByPerson()) { console.log('not now: the owner wears the headset; this measure is for the stand'); process.exit(1); }
  const ids = gpuIds(sh('ovrgpuprofiler -m'), ['GPU Frequency', 'GPU % Utilization']);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const DIR = path.join(process.env.USERPROFILE || process.env.HOME, 'Documents', 'objekt-files', 'notes', 'headset', `stand-${mode}-${stamp}`);
  fs.mkdirSync(DIR, { recursive: true });
  const LOG = path.join(DIR, 'log.jsonl');
  const log = (step, data = {}) => { const e = { at: now(), step, ...data }; fs.appendFileSync(LOG, JSON.stringify(e) + '\n'); return e; };
  const keep = (name, text) => fs.writeFileSync(path.join(DIR, name), String(text));
  const thermal = (tag) => { const t = sh('dumpsys thermalservice'), b = sh('dumpsys battery'); keep(`thermal-${tag}.txt`, `${t}\n${b}`); return thermalOf(t, b); };
  const sandboxPss = (tag) => { const all = sh('dumpsys meminfo'); keep(`meminfo-${tag}.txt`, all);
    return Object.fromEntries(sandboxedPids(all).map((pid) => [pid, pssOf(sh(`dumpsys meminfo ${pid}`))])); };

  let game = null, run = null, held = false;
  try {
    // the conditions, and proof that no debug override of levels or foveation is active (a forced level would make
    // the heat and the frames something no player gets: long-measure.md, Part 2)
    log('conditions', { model: sh('getprop ro.product.model').trim(), os: sh('getprop ro.build.version.incremental').trim(),
      browser: (sh('dumpsys package com.oculus.browser').match(/versionName=(\S+)/) || [])[1], commit: git('rev-parse', '--short', 'HEAD'),
      dirty: git('status', '--porcelain').length > 0, vrruntime: metavr('device', 'vrruntime', 'get'), proximity: metavr('device', 'proximity', '--status'),
      gpuIds: ids, thermal: thermal('start') });
    // Meta's own command keeps an unworn headset awake and re-enables the sensor by itself after 2 hours
    // (metavr device proximity --disable; its binary passes "prox_close --ei duration 7200000")
    log('proximity off', { out: metavr('device', 'proximity', '--disable') });
    // OVR Metrics' overlay costs GPU time of its own (docs/baseline.md): off for the measure
    sh('am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE_OVERLAY');

    await openGame(serveToHeadset(localPort()));
    for (let i = 0; i < 60 && !game; i++) { game = await page(/localhost:3000/); if (!game) await pause(500); }
    if (!game) throw new Error('the game tab did not appear');
    run = async (js) => { const v = await game.run(js); if (v && v.error) throw new Error(v.error); return v; };
    for (let i = 0; i < 80 && (await run("!!document.querySelector('a-scene')?.hasLoaded")) !== true; i++) await pause(250);
    log('loaded');
    // the risk named first in the plan: whether an unworn headset enters VR at all (the boundary window may hold it)
    const vr = log('vr', { answer: await run(`Promise.race([document.querySelector('a-scene').enterVR().then(() => 'in VR', (e) => 'failed: ' + e.message),
      new Promise((r) => setTimeout(() => r('held 20 s: the boundary window, or no tracking'), 20000))])`) });
    if (vr.answer !== 'in VR') {
      held = true;
      // what holds it is what the headset shows (a boundary prompt, a tracking-lost notice): a frame of it kept
      try { fs.writeFileSync(path.join(DIR, 'held.png'), screencap()); log('held: frame kept', { file: 'held.png' }); } catch (e) { log('held: no frame', { error: e.message }); }
      throw new Error(`VR: ${vr.answer}`);
    }
    log('session', { rate: await run('document.querySelector("a-scene").xrSession.frameRate ?? null'),
      rates: await run('Array.from(document.querySelector("a-scene").xrSession.supportedFrameRates || [])') });
    // every XR frame counted, a frame late when its display time steps more than 1.5 refreshes (W3C WebXR 5.1,
    // predictedDisplayTime; as tools/measure.mjs), read and reset at each sample
    await run(`(() => { const s = document.querySelector('a-scene').xrSession, w = window.__stand = { frames: 0, late: 0, maxStep: 0, noTime: 0 }; let last = 0;
      const f = (t, frame) => { const p = frame && frame.predictedDisplayTime; if (!p) w.noTime++; const at = p || t;
        if (last) { const dt = at - last; w.frames++; if (dt > 1.5 * 1000 / (s.frameRate || 90)) w.late++; if (dt > w.maxStep) w.maxStep = dt; } last = at; s.requestAnimationFrame(f); };
      s.requestAnimationFrame(f); return true; })()`);
    const readPage = () => run(`(() => { const a = document.querySelector('a-scene'), w = window.__stand, r = a.renderer.info, s = a.xrSession;
      const out = { frames: w.frames, late: w.late, maxStep: +w.maxStep.toFixed(1), noTime: w.noTime, renderFrame: r.render.frame, calls: r.render.calls,
        triangles: r.render.triangles, geometries: r.memory.geometries, textures: r.memory.textures, programs: (r.programs || []).length,
        visibility: s && s.visibilityState, rate: s && s.frameRate, heap: performance.memory ? performance.memory.usedJSHeapSize : null };
      w.frames = 0; w.late = 0; w.maxStep = 0; w.noTime = 0; return out; })()`);
    await readPage();

    if (mode === 'long') {
      // Meta's test of VRC.Quest.Performance.1: "the length of the content or 45 minutes", in the corridor every room
      // stands on; the view turned 45° a minute, so a standing player's look round repeats every 8 minutes. Frames every
      // 10 s, heat every 30 s, the page's memory every minute, the GPU every 5 minutes; whether the session stays
      // visible is read with every sample (Meta's safety page: standby after about 15 minutes with no interaction)
      const minutes = Number((process.argv.find((a) => a.startsWith('--minutes=')) || '').split('=')[1]) || 45;
      // a headset just woken gave no frame for its first 38 s in VR while the session read "visible" (the long run's
      // first try): that is the headset finding its place, not the game, so the run begins at the first frames
      const asked = now();
      for (let got = 0; !got && now() - asked < 180000;) { await pause(2000); got = (await readPage()).frames; }
      log('frames began', { afterS: Number(((now() - asked) / 1000).toFixed(1)) });
      await readPage();
      const t0 = now(), rows = [];
      let lastAt = t0, lastFrame = null, heatAt = 0, memAt = 0, gpuAt = 0, turnAt = t0;
      while (now() - t0 < minutes * 60000) {
        await pause(10000);
        const p = await readPage(), at = now();
        const x = { s: Number(((at - t0) / 1000).toFixed(1)), dt: (at - lastAt) / 1000, page: p, prox: proximityOf(sh('dumpsys vrpowermanager')),
          renderFrames: lastFrame === null ? undefined : p.renderFrame - lastFrame };
        if (at - heatAt >= 30000) { heatAt = at; x.thermal = thermal(`s${Math.round(x.s)}`); }
        if (at - memAt >= 60000) { memAt = at; x.pss = sandboxPss(`s${Math.round(x.s)}`); }
        if (ids['GPU Frequency'] && at - gpuAt >= 300000) { gpuAt = at; x.gpu = gpuSamples(sh(`timeout 5 ovrgpuprofiler --realtime="${Object.values(ids).join(',')}"`)); }
        if (at - turnAt >= 60000) { turnAt = at; x.yaw = await run('(() => { const r = document.querySelector("#rig").object3D; r.rotation.y += Math.PI / 4; return +r.rotation.y.toFixed(2); })()'); }
        lastAt = at; lastFrame = p.renderFrame; rows.push(x); log('sample', x);
      }
      const end = log('end', { thermal: thermal('end') });
      const summary = { dir: DIR, minutes: Number(((end.at - t0) / 60000).toFixed(2)), ...longSummary(rows) };
      fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
      console.log(JSON.stringify(summary, null, 1));
      return;
    }

    // the timeline, seconds after VR: each known change at its mark, a sample every 10 s
    const marks = MARKS;
    const t0 = now(), secs = () => (now() - t0) / 1000;
    const samples = [];
    let lastAt = t0, lastFrame = null;
    let heatAt = 0;
    const sample = async () => {
      const p = await readPage(), at = now(), prox = proximityOf(sh('dumpsys vrpowermanager'));
      const x = { s: Number(((at - t0) / 1000).toFixed(1)), dt: (at - lastAt) / 1000, page: p, prox, renderFrames: lastFrame === null ? undefined : p.renderFrame - lastFrame };
      // the heat every 30 s, so a rise shows while it happens, not only between start and end
      if (at - heatAt >= 30000) { heatAt = at; x.thermal = thermal(`s${Math.round(x.s)}`); }
      lastAt = at; lastFrame = p.renderFrame; samples.push(x); log('sample', x); return x;
    };
    const until = async (mark) => { while (secs() < mark) { const wait = Math.min(10, mark - secs()); await pause(wait * 1000); if (secs() >= mark || wait >= 9.5) await sample(); } };
    const act = (name, js) => run(js).then((out) => log(name, { out }));
    let pssBefore = null, gpu = null;
    await until(marks.to72);
    await act('rate 72', 'document.querySelector("a-scene").xrSession.updateTargetFrameRate(72).then(() => "asked 72", (e) => "failed: " + e.message)');
    await until(marks.to72 + 12);
    // GPU clock and load while at 72 Hz: 7 one-second samples (Meta, ts-ovrgpuprofiler)
    if (ids['GPU Frequency']) { gpu = gpuSamples(sh(`timeout 7 ovrgpuprofiler --realtime="${Object.values(ids).join(',')}"`)); log('gpu', { samples: gpu }); }
    await until(marks.to90);
    await act('rate 90', 'document.querySelector("a-scene").xrSession.updateTargetFrameRate(90).then(() => "asked 90", (e) => "failed: " + e.message)');
    await until(marks.boxOn);
    await act('box on', `(() => { const a = document.querySelector('a-scene'), c = a.camera, q = c.getWorldQuaternion(new THREE.Quaternion());
      const b = window.__box = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 0xff00ff }));
      b.position.copy(new THREE.Vector3(0, 0, -1).applyQuaternion(q).add(c.getWorldPosition(new THREE.Vector3()))); a.object3D.add(b); return 'one box, 12 triangles'; })()`);
    await until(marks.boxOff);
    await act('box off', '(() => { const b = window.__box; b.removeFromParent(); b.geometry.dispose(); b.material.dispose(); return "removed"; })()');
    await until(marks.stall);
    // ten frames each held 25 ms more than their budget allows: ten late frames must be counted
    await act('stall', `(() => { const s = document.querySelector('a-scene').xrSession; let n = 10;
      const f = () => { const t = performance.now(); while (performance.now() - t < 25) {} if (--n > 0) s.requestAnimationFrame(f); }; s.requestAnimationFrame(f); return '10 x 25 ms'; })()`);
    await until(marks.memOn);
    pssBefore = sandboxPss('before');
    // 64 MiB written page by page, so the system counts it as the page's memory (PSS counts touched pages)
    await act('memory on', '(() => { const m = window.__mem = new Uint8Array(64 * 1024 * 1024); for (let i = 0; i < m.length; i += 4096) m[i] = 1; return m.length; })()');
    await pause(3000);
    const pssAfter = sandboxPss('after');
    await act('memory off', '(() => { window.__mem = null; return "released"; })()');
    await until(marks.end);
    const end = log('end', { thermal: thermal('end') });

    const v = verdicts(samples, marks);
    const rises = Object.keys(pssAfter).map((pid) => ({ pid, riseKb: pssAfter[pid] - (pssBefore[pid] || 0) }));
    const best = rises.sort((a, b) => b.riseKb - a.riseKb)[0];
    v.memory = { pass: !!best && best.riseKb > 0.75 * 65536 && best.riseKb < 1.25 * 65536, rises, wantKb: 65536 };
    const startT = JSON.parse(fs.readFileSync(LOG, 'utf8').split('\n')[0]).thermal;
    // the thermal service's battery and the battery service's own are two sources, not one sensor read twice (the first
    // trial read 35 and 33 °C at its start, 35 and 35 at its end): both kept, neither taken as the other's check
    v.batteryTwoSources = { start: [startT.current.battery, startT.battery], end: [end.thermal.current.battery, end.thermal.battery] };
    // the GPU's clock read at one of the levels the system sets (an unlisted value would mean a misread)
    v.gpuClock = { seen: gpu ? [...new Set(gpu['GPU Frequency'] || [])] : null, meanLoad: gpu ? mean(gpu['GPU % Utilization'] || []) : null };
    const summary = { dir: DIR, marks, verdicts: v, samples: samples.length, minutes: Number(((end.at - t0) / 60000).toFixed(2)) };
    fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
    console.log(JSON.stringify(summary, null, 1));
  } catch (e) {
    try { log('failed', { error: String(e.message || e) }); } catch (err) { /* the headset itself gone */ }
    console.log(`failed: ${e.message || e} (log: ${LOG})`);
    process.exitCode = 1;
  } finally {
    // the sensor given back and the headset asleep, whatever happened (quest-look.mjs sleep)
    try { if (run) await run('document.querySelector("a-scene").xrSession?.end()'); } catch (e) { /* no session */ }
    if (game) game.close();
    // a held entry leaves the browser unable to enter VR until it restarts (docs/mistakes.md): restarted first
    log('given back', giveBack(held ? 'restart' : 'sleep'));
  }
}
