// The measure with the headset on a stand, unworn: first a two-minute trial that proves the tools, then the
// 45-minute run (.claude/rules/measures.md, "Quality measures before polishing old numbers"; the plan:
// docs/research/long-measure.md).
// No reading is trusted before its tool has shown a change made on purpose whose size is known beforehand
// (long-measure.md, "Known-change proofs"): the trial makes each such change once and writes whether each tool saw
// it. Every time is the headset's own clock; every tool's raw output is kept beside the log (as tools/measure.mjs).
// Usage: node tools/stand-measure.mjs trial      (about three minutes; the owner does not wear it)
//        node tools/stand-measure.mjs long       (45 minutes in the corridor, the view turned a little each minute)
//        node tools/stand-measure.mjs flow       (the corridor's start to room 101's end, played by tools/stand-flow.mjs)
//        node tools/stand-measure.mjs restore    (the headset given back as it was, after a run cut short)
//        node tools/stand-measure.mjs judge <run folder>   (a run's verdicts again from its log)
// The boundary is not paused (a safety setting of his headset): the stand stands inside his play area, lit, so it
// does not rise; a VR entry it holds is given up after 90 s (a headset just woken took 38 s to find its place in the room) and the browser restarted before the headset sleeps,
// the cure of docs/mistakes.md ("the headset browser had lost its link to the VR system for hours").
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { thermalOf, gpuIds, gpuSamples, mean } from './measure.mjs';
import { sandboxedPids, pssOf, proximityOf, verdicts, longSummary, flowSummary, heatStop, MARKS } from './stand-judge.mjs';
import { player } from './stand-flow.mjs';


if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();

async function main() {
  const mode = process.argv[2];
  if (!['trial', 'long', 'flow', 'restore', 'judge', 'check', 'look'].includes(mode)) { console.log('usage: node tools/stand-measure.mjs check | trial | long [--minutes=N] | flow | look | restore | judge <run folder>'); process.exit(1); }
  // a run's verdicts again from its own log, with no headset (the samples are all in it)
  if (mode === 'judge') {
    const lines = fs.readFileSync(path.join(process.argv[3], 'log.jsonl'), 'utf8').trim().split(/\r?\n/).map((l) => JSON.parse(l));
    console.log(JSON.stringify(verdicts(lines.filter((l) => l.step === 'sample'), MARKS), null, 1));
    return;
  }
  const { adb, serveToHeadset, localPort, openGame, page, takenOff, connected, sleepNow, restartBrowser, screencap } = await import('./headset.mjs');
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
    if (!takenOff()) { console.log('not now: the owner wears the headset, or its state did not read'); process.exit(1); }
    console.log(JSON.stringify(giveBack('restart')));
    return;
  }
  // What has stopped runs before they measured anything, checked in one go before he is asked to do anything: the
  // game server (stopped with the window that started it), and a system window in front (the tracking window of a
  // headset that cannot find the room comes back however often it is closed)
  const RUNS = path.join(process.env.USERPROFILE || process.env.HOME, 'Documents', 'objekt-files', 'notes', 'headset');
  const front = () => (sh('dumpsys activity activities | grep topResumedActivity | head -1').match(/u0 ([\w.]+)\//) || [])[1] || 'none';
  // read awake: asleep, the headset shows nothing in front; a wake key would open its quick menu instead
  const awakeFront = async () => { metavr('device', 'proximity', '--disable'); await pause(10000); return front(); };
  const blockers = async () => { const inFront = await awakeFront(); return [
    !(await fetch(`http://localhost:${localPort()}/`).then((r) => r.ok, () => false)) && `the game server is not running on port ${localPort()}: start the preview "objekt"`,
    !takenOff() && 'the headset is worn, or its state did not read: this measure is for the stand',
    /guardian/.test(inFront) && 'the headset cannot find its place in the room (its tracking or boundary window is in front): switch on travel mode in its quick settings (no position tracking, which a still stand does not need; it made the run of 14.10 go), or face the stand to furniture, not a bare wall or a door'
  ].filter(Boolean); };
  if (mode === 'check') { const b = await blockers(); const f = front(); metavr('device', 'proximity', '--enable'); console.log(b.length ? `not ready: ${b.join('; ')}` : `ready (in front: ${f})`); process.exit(b.length ? 1 : 0); }
  // two runs in a row that failed: a third waits for a look at what the headset shows (CLAUDE.md: "Two or three failed
  // tries at one problem: measure first"; five tries went round one cause before this was held by the tool)
  const last = fs.existsSync(RUNS) ? fs.readdirSync(RUNS).filter((d) => /^stand-(trial|long|flow)-/.test(d)).sort().slice(-2) : [];
  const failed = (d) => { try { return /"step":"failed"/.test(fs.readFileSync(path.join(RUNS, d, 'log.jsonl'), 'utf8')); } catch (e) { return false; } };
  if (mode === 'look') {
    const into = last.length ? path.join(RUNS, last[last.length - 1], 'look.png') : path.join(RUNS, 'look.png');
    console.log(metavr('capture', 'screenshot', '-o', into).trim(), `| in front: ${front()}`);
    return;
  }
  if (last.length === 2 && last.every(failed) && !fs.existsSync(path.join(RUNS, last[1], 'look.png'))) {
    console.log('not now: the last two runs failed; look first (node tools/stand-measure.mjs look) and name the cause'); process.exit(1);
  }
  // the review gates exit on their own, so they run before the sensor is touched: after it a refused gate
  // would leave the proximity sensor overridden
  requireReview(ROOT, 'VR in the headset', { look: true });
  requirePaper(ROOT, 'VR in the headset', { look: true });
  const b = await blockers();
  // the check above left the proximity sensor overridden: given back on every way out, the headset put to sleep
  // only when nobody wears it
  if (b.length) { console.log(`not ready: ${b.join('; ')}`); metavr('device', 'proximity', '--enable'); if (takenOff()) sleepNow(); process.exit(1); }
  // this run is for a headset nobody wears: on a person it would hold frames and rates against him
  if (!takenOff()) { console.log('not now: the owner wears the headset, or its state did not read; this measure is for the stand'); metavr('device', 'proximity', '--enable'); process.exit(1); }
  const ids = gpuIds(sh('ovrgpuprofiler -m'), ['GPU Frequency', 'GPU % Utilization']);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const DIR = path.join(process.env.USERPROFILE || process.env.HOME, 'Documents', 'objekt-files', 'notes', 'headset', `stand-${mode}-${stamp}`);
  fs.mkdirSync(DIR, { recursive: true });
  const LOG = path.join(DIR, 'log.jsonl');
  const log = (step, data = {}) => { const e = { at: now(), step, ...data }; fs.appendFileSync(LOG, JSON.stringify(e) + '\n'); return e; };
  const keep = (name, text) => fs.writeFileSync(path.join(DIR, name), String(text));
  // every heat read is also the stop check (heatStop): the trial throws, the long run ends and keeps what it gathered
  let stoppedFor = null;
  const thermal = (tag) => { const t = sh('dumpsys thermalservice'), b = sh('dumpsys battery'); keep(`thermal-${tag}.txt`, `${t}\n${b}`);
    const r = thermalOf(t, b), why = heatStop(r); if (why && !stoppedFor) { stoppedFor = why; log('stopped: heat', { why, tag }); } return r; };
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
    if (stoppedFor) throw new Error(`not started: ${stoppedFor}`);
    // Meta's own command keeps an unworn headset awake and re-enables the sensor by itself after 2 hours
    // (metavr device proximity --disable; its binary passes "prox_close --ei duration 7200000")
    log('proximity off', { out: metavr('device', 'proximity', '--disable') });
    // OVR Metrics' overlay costs GPU time of its own (docs/baseline.md): off for the measure
    sh('am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.DISABLE_OVERLAY');

    await openGame(serveToHeadset(localPort()));
    for (let i = 0; i < 60 && !game; i++) { game = await page(/localhost:3000/); if (!game) await pause(500); }
    if (!game) throw new Error('the game tab did not appear');
    run = async (js) => { const v = await game.run(js); if (v && v.error) throw new Error(v.error); return v; };
    // a scene that never loads ends the run with its own cause in the log, not as a later failure to enter VR
    const loaded = async () => {
      for (let i = 0; i < 80; i++) { if ((await run("!!document.querySelector('a-scene')?.hasLoaded")) === true) return; await pause(250); }
      throw new Error('the scene did not load in 20 s');
    };
    await loaded();
    // the flow plays a first visit: the mark of an earlier run left mid-room (left-early.js) shows its own page in
    // place of the consent, so it is cleared and the page loaded again; what was cleared goes in the log
    if (mode === 'flow') {
      const cleared = await run("(() => { const k = Object.keys(localStorage).filter((x) => x.startsWith('object.left.')); k.forEach((x) => localStorage.removeItem(x)); return k; })()");
      if (cleared.length) { log('marks cleared', { cleared }); await run('setTimeout(() => location.reload(), 50); true'); await pause(3000); await loaded(); }
    }
    log('loaded');
    // the risk named first in the plan: whether an unworn headset enters VR at all (the boundary window may hold it)
    const vr = log('vr', { answer: await run(`Promise.race([document.querySelector('a-scene').enterVR().then(() => 'in VR', (e) => 'failed: ' + e.message),
      new Promise((r) => setTimeout(() => r('held 90 s: the boundary window, or no tracking'), 90000))])`) });
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
    // (each late one also kept with its time and, in a flow run, the step the player was at: window.__flow)
    await run(`(() => { const s = document.querySelector('a-scene').xrSession, w = window.__stand = { frames: 0, late: 0, maxStep: 0, noTime: 0, lates: [] }; let last = 0;
      const f = (t, frame) => { const p = frame && frame.predictedDisplayTime; if (!p) w.noTime++; const at = p || t;
        if (last) { const dt = at - last; w.frames++; if (dt > 1.5 * 1000 / (s.frameRate || 90)) { w.late++; if (w.lates.length < 500) w.lates.push([Math.round(performance.timeOrigin + at), +dt.toFixed(1), window.__flow ? window.__flow.step : null]); }
          if (dt > w.maxStep) w.maxStep = dt; } last = at; s.requestAnimationFrame(f); };
      s.requestAnimationFrame(f); return true; })()`);
    const readPage = () => run(`(() => { const a = document.querySelector('a-scene'), w = window.__stand, r = a.renderer.info, s = a.xrSession;
      const out = { frames: w.frames, late: w.late, maxStep: +w.maxStep.toFixed(1), noTime: w.noTime, renderFrame: r.render.frame, calls: r.render.calls,
        triangles: r.render.triangles, geometries: r.memory.geometries, textures: r.memory.textures, programs: (r.programs || []).length,
        visibility: s && s.visibilityState, rate: s && s.frameRate, heap: performance.memory ? performance.memory.usedJSHeapSize : null, lates: w.lates,
        flow: window.__flow ? { step: window.__flow.step, done: window.__flow.done, error: window.__flow.error, presses: window.__flow.presses, windows: window.__flow.windows } : null };
      w.frames = 0; w.late = 0; w.maxStep = 0; w.noTime = 0; w.lates = []; return out; })()`);
    await readPage();

    if (mode === 'long' || mode === 'flow') {
      // Meta's test of VRC.Quest.Performance.1: "the length of the content or 45 minutes", in the corridor every room
      // stands on; the view turned 45° a minute, so a standing player's look round repeats every 8 minutes. Frames every
      // 10 s, heat every 30 s, the page's memory every minute, the GPU every 5 minutes; whether the session stays
      // visible is read with every sample (Meta's safety page: standby after about 15 minutes with no interaction)
      const minutes = Number((process.argv.find((a) => a.startsWith('--minutes=')) || '').split('=')[1]) || 45;
      // a headset just woken drew nothing for 38 s in VR while "visible" (the long run's first try): its place being found,
      // so the run begins at the first frames; none in 3 minutes is no link to the VR system: restarted, as a held entry
      // the heat is watched in the wait too (every 30 s), so a hot headset stops the run before it begins
      const asked = now(); let got = 0, waitHeatAt = asked;
      while (!got && !stoppedFor && now() - asked < 180000) {
        await pause(2000); got = (await readPage()).frames;
        if (now() - waitHeatAt >= 30000) { waitHeatAt = now(); thermal(`wait${Math.round((waitHeatAt - asked) / 1000)}`); }
      }
      if (stoppedFor) throw new Error(`stopped: ${stoppedFor}`);
      if (!got) { held = true; throw new Error('no VR frame in 180 s'); }
      log('frames began', { afterS: Number(((now() - asked) / 1000).toFixed(1)) });
      await readPage();
      if (mode === 'flow') {
        // the player plays from here; a sample every 5 s (a step can last seconds), the heat every 30 s, the page's
        // memory every minute; the run ends with the player's last step, its error, the heat, or an hour
        await run(`(${player.toString()})({})`);
        const t0 = now(), rows = [];
        let lastAt = t0, heatAt = 0, memAt = 0, f = null;
        while (now() - t0 < 3600000) {
          await pause(5000);
          const p = await readPage(), at = now();
          const x = { s: Number(((at - t0) / 1000).toFixed(1)), at, dt: (at - lastAt) / 1000, page: p, prox: proximityOf(sh('dumpsys vrpowermanager')) };
          if (at - heatAt >= 30000) { heatAt = at; x.thermal = thermal(`s${Math.round(x.s)}`); }
          if (at - memAt >= 60000) { memAt = at; x.pss = sandboxPss(`s${Math.round(x.s)}`); }
          lastAt = at; rows.push(x); log('sample', x); f = p.flow;
          if (stoppedFor || !f || f.done || f.error) break;
        }
        const steps = await run('window.__flow ? window.__flow.steps : []');
        const end = log('end', { thermal: thermal('end'), steps, flow: f });
        const summary = { dir: DIR, minutes: Number(((end.at - t0) / 60000).toFixed(2)), stoppedFor, flow: f, ...flowSummary(rows, steps), ...longSummary(rows) };
        fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
        console.log(JSON.stringify(summary, null, 1));
        return;
      }
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
        if (stoppedFor) break;
      }
      const end = log('end', { thermal: thermal('end') });
      const summary = { dir: DIR, minutes: Number(((end.at - t0) / 60000).toFixed(2)), stoppedFor, ...longSummary(rows) };
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
      lastAt = at; lastFrame = p.renderFrame; samples.push(x); log('sample', x); if (stoppedFor) throw new Error(`stopped: ${stoppedFor}`); return x;
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
