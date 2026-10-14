// The baseline's measure in the owner's headset, as one walk (docs/baseline.md; .claude/rules/measures.md:
// «надо все замерить… очень-очень хорошо детально», «мы любим точность»). Two fact-checks of the first
// baseline found every number copied right and the times, spans and conditions around them wrong, written
// from memory; so here the machine writes them: every step's time from the headset's own clock (the page's
// clock is the same device's), every tool's raw output and the conditions, into one log, and the summary is
// made from that log alone. The reading of each tool's output is a function of its own, held by
// tests/measure.test.mjs on outputs saved from his Quest 3 (tests/fixtures/quest3).
// Usage: node tools/measure.mjs --check     (before he is called: the gates, the cable, the GPU metrics)
//        node tools/measure.mjs [--clean]   (he wears the headset; run it more than once: whether two runs
//        agree says whether the measure holds: «можно несколько раз замерить… и убедиться»,
//        docs/owner-decisions-history-2.md)
//   --clean  OVR Metrics' HUD asked off, no trace
// The walk: the corridor's start as a player plays it (the sign, the clipboard, the consent) up to the doors;
// windows by the doors; door 101; windows in the room's intro. Each step is shown 8 s and then hidden, so no
// note stands in the view while frames are counted. Any failure is said in the headset before the tool stops.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// dumpsys thermalservice prints cached values first, then "Current temperatures from HAL" up to "Current
// cooling devices" (whose lines look alike: CoolingDevice{mValue=...}); only that section is now
export function thermalOf(thermalDump, batteryDump) {
  const cur = (String(thermalDump).split('Current temperatures from HAL')[1] || '').split('Current cooling devices')[0];
  return {
    status: Number((String(thermalDump).match(/Thermal Status: (\d+)/) || [])[1]),
    current: Object.fromEntries([...cur.matchAll(/Temperature\{mValue=([\d.]+), mType=\d+, mName=([\w-]+)/g)].map((m) => [m[2], Number(m[1])])),
    battery: Number((String(batteryDump).match(/temperature: (\d+)/) || [])[1]) / 10,   // tenths of a degree
    level: Number((String(batteryDump).match(/level: (\d+)/) || [])[1])
  };
}
// dumpsys meminfo <package>: its own summary line, in kB (Android's kilobytes: 1024 bytes); the browser's main
// process only, the page runs in a sandboxed one listed in the whole dump
export function memoryOf(packageDump, wholeDump = '') {
  const t = String(packageDump);
  return { pssKb: Number((t.match(/TOTAL PSS:\s*(\d+)/) || [])[1]), rssKb: Number((t.match(/TOTAL RSS:\s*(\d+)/) || [])[1]),
    sandboxed: String(wholeDump).split('\n').filter((l) => /sandboxed_process/.test(l)).map((l) => l.trim()) };
}
// ovrgpuprofiler -m lists "<id>\t<name>": the ids of the wanted names, found by name, since the numbers differ
// between devices (Meta's page calls --realtime="29,30"; on his Quest 3 29 and 30 are bytes and ALU per vertex)
export function gpuIds(list, want) {
  const all = Object.fromEntries([...String(list).matchAll(/^(\d+)\t(.+?)\s*$/gm)].map((m) => [m[2], m[1]]));
  return Object.fromEntries(want.filter((w) => all[w]).map((w) => [w, all[w]]));
}
// ovrgpuprofiler -r prints "<name> : <value>" once a second for each metric: every sample of each, in order
export function gpuSamples(out) {
  const samples = {};
  for (const m of String(out).matchAll(/^(.+?)\s*:\s*([\d.]+)\s*$/gm)) (samples[m[1].trim()] ||= []).push(Number(m[2]));
  return samples;
}
// metavr perf analyze-trace: its GPU frame time block ("GPU Frame Time  (40 frames, …)" then "avg … max … p75")
export function traceGpuOf(analysis) {
  const t = String(analysis), m = t.match(/avg\s+([\d.]+) ms\s+max\s+([\d.]+) ms\s+p75\s+([\d.]+) ms/);
  return { frames: Number((t.match(/GPU Frame Time\s+\((\d+) frames/) || [])[1]) || 0, avgMs: m ? Number(m[1]) : null, maxMs: m ? Number(m[2]) : null, p75Ms: m ? Number(m[3]) : null };
}
// A frame is late when its display time is more than one refresh after the one before: XRFrame.predictedDisplayTime
// (W3C WebXR, section 5.1; given on his Quest 3, docs/headset-capabilities.md) steps one refresh, 1000/R ms at the
// session's rate R, when every frame is shown on time, and two or more when one was not; the bar is halfway, 1.5
// refreshes. The page's own callback times are kept beside it with the 72 Hz bar of tools/quest-look.mjs perf
// (1000/72 + 2 ms), so runs stay comparable with the first baseline; those times also carry the engine's own work
// (three.js asks for the next frame after rendering), and at 90 Hz the 72 Hz bar also counts a 16 ms callback
// interval that lost no refresh.
export const SLOW_MS = 1000 / 72 + 2;
export const lateMs = (rate) => 1.5 * (1000 / rate);
export function windowStats(dts, rate = 90) {
  if (!dts.length) return { frames: 0 };
  const q = [...dts].sort((a, b) => a - b), span = dts.reduce((a, b) => a + b, 0);
  const at = (p) => Number(q[Math.min(q.length - 1, Math.floor(p * q.length))].toFixed(1));
  return { frames: dts.length, fps: Number((dts.length / (span / 1000)).toFixed(1)), rate, late: dts.filter((d) => d > lateMs(rate)).length,
    slowUnder72: dts.filter((d) => d > SLOW_MS).length, p50: at(0.5), p95: at(0.95), p99: at(0.99), worst: Number(q[q.length - 1].toFixed(1)) };
}
export const mean = (v) => (v.length ? Number((v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)) : null);

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();

async function main() {
  const { adb, serveToHeadset, localPort, openGame, page, wornByPerson, connected, noteScript } = await import('./headset.mjs');
  const { requireReview, requirePaper } = await import('./review-gate.mjs');
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const clean = process.argv.includes('--clean'), checkOnly = process.argv.includes('--check');
  // a shell command's output; "; true" so a command ended by its timeout (exit 124) still gives what it printed
  const sh = (cmd) => { try { return adb('shell', `${cmd} ; true`); } catch (e) { return `error: ${e.message}`; } };
  const now = () => Number(sh('date +%s%3N').trim());   // the headset's clock, ms since 1970
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const metavr = (...a) => execFileSync('metavr', a, { encoding: 'utf8', shell: true });   // an npm command: .cmd on Windows
  const hud = (on) => sh(`am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.${on ? 'ENABLE' : 'DISABLE'}_OVERLAY`);

  // what can stop the measure is checked before he is called (--check), and again here before anything is shown
  if (!connected()) { console.log('the headset is not on the cable'); process.exit(1); }
  requireReview(ROOT, 'VR in the headset', { look: true });
  requirePaper(ROOT, 'VR in the headset', { look: true });
  const WANT = ['GPU Frequency', 'GPU % Utilization', '% Shaders Busy', '% Time Shading Vertices', '% Time Shading Fragments'];
  const ids = gpuIds(sh('ovrgpuprofiler -m'), WANT);   // under Meta's limit of 30 at once
  if (Object.keys(ids).length !== WANT.length) { console.log(`ovrgpuprofiler lacks: ${WANT.filter((w) => !ids[w]).join(', ')}`); process.exit(1); }
  if (checkOnly) { console.log('ready: the cable, the review, the paper check and the GPU metrics', JSON.stringify(ids)); return; }
  if (!wornByPerson()) { console.log('not now: the measure runs only while the owner wears the headset'); process.exit(1); }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const DIR = path.join(process.env.USERPROFILE || process.env.HOME, 'Documents', 'objekt-files', 'notes', 'headset', `measure-${stamp}${clean ? '-clean' : ''}`);
  fs.mkdirSync(DIR, { recursive: true });
  const LOG = path.join(DIR, 'log.jsonl');
  const log = (step, data = {}) => { const e = { at: now(), step, ...data }; fs.appendFileSync(LOG, JSON.stringify(e) + '\n'); return e; };
  const keep = (name, text) => fs.writeFileSync(path.join(DIR, name), String(text));
  // the dumps themselves kept beside the log, the parsed values in it
  const thermal = (tag) => { const t = sh('dumpsys thermalservice'), b = sh('dumpsys battery'); keep(`thermal-${tag}.txt`, `${t}\n${b}`); return thermalOf(t, b); };
  const memory = (tag) => { const m = sh('dumpsys meminfo com.oculus.browser'), all = sh('dumpsys meminfo'); keep(`meminfo-${tag}.txt`, `${m}\n${all}`); return memoryOf(m, all); };
  const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
  // An app only hints its CPU and GPU levels and the system sets them (Meta, essentials/cpu-gpu-levels: the OS keeps
  // them "at the lowest value within a range that preserves your application's framerate"); every app is boosted for
  // its first 45 s (essentials/boost-cpu-gpu-levels), so no window starts sooner than that after the page opens
  const notKnown = ['the CPU and GPU levels the system chose were not read (the system sets them from the app\'s hints; a page cannot fix them)',
    'three windows a spot is our choice (his word on repeating), not a published rule',
    'the room\'s spots fall in its intro, not in its trials',
    'the game served is the working tree of the commit named (the dirty flag says whether it differs)'];

  let game = null, run = null, start = null, stepNo = 0;
  const note = (main, small = '') => run(noteScript(main, small));
  // a step: logged, shown with its length, read for 8 s, then hidden, so no note stands in the view while frames
  // are counted (nor over the sign he is to read)
  const step = async (main, small) => { stepNo++; log('step shown', { n: stepNo, main, small }); await note(main, small); await pause(8000); await note('off'); log('step hidden', { n: stepNo }); };
  try {
    hud(!clean);   // Meta's ts-ovrmetricstool page: these broadcasts; their reply says nothing of the state
    notKnown.push(`OVR Metrics' HUD asked ${clean ? 'off' : 'on'}, its state not read back`);
    start = log('conditions', { model: sh('getprop ro.product.model').trim(), os: sh('getprop ro.build.version.incremental').trim(),
      browser: (sh('dumpsys package com.oculus.browser').match(/versionName=(\S+)/) || [])[1], commit: git('rev-parse', '--short', 'HEAD'),
      dirty: git('status', '--porcelain').length > 0, clean, hudAsked: !clean, gpuIds: ids, thermal: thermal('start'), memory: memory('start') });
    sh('logcat -c');   // the headset's log from here on, kept at the end (Meta's per-second VrApi line, if the browser writes it)

    await openGame(serveToHeadset(localPort()));
    for (let i = 0; i < 60 && !game; i++) { game = await page(/localhost:3000/); if (!game) await pause(500); }
    if (!game) throw new Error('the game tab did not appear');
    run = async (js) => { const v = await game.run(js); if (v && v.error) throw new Error(v.error); return v; };
    for (let i = 0; i < 80 && (await run("!!document.querySelector('a-scene')?.hasLoaded")) !== true; i++) await pause(250);
    log('loaded', { navigation: await run("(({domContentLoadedEventEnd: d, loadEventEnd: l}) => ({domReady: Math.round(d), load: Math.round(l)}))(performance.getEntriesByType('navigation')[0])") });
    const opened = log('opened');   // the browser may have been launched just now: its launch boost lasts 45 s
    const asked = log('vr asked');
    const vr = log('vr', { answer: await run("document.querySelector('a-scene').enterVR().then(() => 'in VR', (e) => 'failed: ' + e.message)") });
    if (vr.answer !== 'in VR') throw new Error(`VR: ${vr.answer}`);
    const rateRead = await run('document.querySelector("a-scene").xrSession.frameRate ?? null');   // null: the session gives none
    const rate = rateRead || 90;
    if (!rateRead) notKnown.push('the session gave no frame rate: the late bar assumes 90 Hz');
    log('session', { frameRate: rateRead, rates: await run('Array.from(document.querySelector("a-scene").xrSession.supportedFrameRates || [])'),
      foveation: await run('document.querySelector("a-scene").renderer.xr.getFoveation?.() ?? null'), vrMs: vr.at - asked.at });

    // every frame of the VR session from here to the end: each late one by its display time kept with that time
    // (the headset's clock), its length and where the player was: the corridor's start (the sign), the doors, the
    // passage after door 101 was pressed, the room once its procedure began
    await run(`(() => {
      const s = document.querySelector('a-scene'), d = document.documentElement.dataset, w = window.__measure = { frames: 0, late: [], noDisplayTime: 0, doorsSeen: false };
      const where = () => { if (d.roomState && d.roomState !== 'idle') return 'room:' + d.roomState; if (d.lobby) { w.doorsSeen = true; return 'corridor:doors'; } return w.doorsSeen ? 'passage' : d.signStart ? 'corridor:start' : 'corridor'; };
      let last = 0;
      const f = (t, frame) => { const shown = frame && frame.predictedDisplayTime; if (!shown) w.noDisplayTime++;
        const at = shown || t; if (last) { const dt = at - last; w.frames++; if (dt > ${lateMs(rate)}) w.late.push([Math.round(performance.timeOrigin + performance.now()), Math.round(dt), where()]); } last = at;
        if (s.xrSession) s.xrSession.requestAnimationFrame(f); };
      s.xrSession.requestAnimationFrame(f);
      return true;
    })()`);
    // what the player looked from and at, and where the game stood, read with each window
    const state = () => run(`(() => { const s = document.querySelector('a-scene'), d = document.documentElement.dataset, c = s.camera, p = new THREE.Vector3(), e = new THREE.Euler();
      c.getWorldPosition(p); e.setFromQuaternion(c.getWorldQuaternion(new THREE.Quaternion()), 'YXZ');
      return { at: [p.x, p.y, p.z].map((v) => +v.toFixed(2)), yawDeg: Math.round(e.y * 57.2958), pitchDeg: Math.round(e.x * 57.2958), lobby: d.lobby || null, roomState: d.roomState || null, signStart: d.signStart || null, left: d.left || null }; })()`);
    // one window: five seconds of frames, read twice: by display time (late frames) and by the page's own callback
    // time (as tools/quest-look.mjs perf); then the last frame's draw calls and triangles (three.js counts one frame)
    const windowOf = async () => {
      const from = now(), before = await state();
      const v = await run(`new Promise((resolve) => { const s = document.querySelector('a-scene'), shown = [], cb = []; let lastShown = 0, lastCb = 0, first = 0;
        const f = (t, frame) => { const p = frame && frame.predictedDisplayTime, c = performance.now();
          if (p && lastShown) shown.push(p - lastShown); if (lastCb) cb.push(c - lastCb); else first = c; lastShown = p || 0; lastCb = c;
          if (c - first < 5000) s.xrSession.requestAnimationFrame(f); else resolve({ shown, cb, calls: s.renderer.info.render.calls, triangles: s.renderer.info.render.triangles }); };
        s.xrSession.requestAnimationFrame(f); })`);
      return { from, to: now(), before, after: await state(), display: windowStats(v.shown, rate), callback: windowStats(v.cb, rate), lastFrameCalls: v.calls, lastFrameTriangles: v.triangles };
    };
    // a spot: the step (8 s, then hidden), three windows, the GPU's stages for 6 s, and in a normal run one
    // 10-second Perfetto trace; each tool's start logged, so a late frame can be set against the measuring itself
    const spot = async (name, main) => {
      await step(main, clean ? 'около 35 секунд, не двигайтесь; конец — новая надпись и вибрация' : 'около минуты, не двигайтесь; конец — новая надпись и вибрация');
      const windows = [];
      for (let k = 0; k < 3; k++) windows.push(await windowOf());
      log('windows', { spot: name, windows });
      log('gpu start', { spot: name });
      log('gpu', { spot: name, ids, samples: gpuSamples(sh(`timeout 7 ovrgpuprofiler --realtime="${Object.values(ids).join(',')}"`)) });
      if (!clean) {
        log('trace start', { spot: name });
        const out = metavr('perf', 'capture', '--app', 'com.oculus.browser', '--mode', 'vr', '--duration', '10000');
        const id = (out.match(/Session ID: (\S+)/) || [])[1];
        const analysis = id ? metavr('perf', 'analyze-trace', id, '--app', 'com.oculus.browser') : out;
        log('trace', { spot: name, session: id, analysis, gpu: traceGpuOf(analysis) });
      }
    };
    // waits for the page to reach a state, at most `secs`; the times are the headset's clock
    const waitFor = async (what, js, secs, from) => {
      for (let i = 0; i < secs; i++) { if (await run(js)) { const r = log('reached', { what }); return { ...r, afterMs: r.at - from.at }; } await pause(1000); }
      log('not reached', { what, waitedS: secs }); return null;
    };

    const toCorridor = log('walk', { part: 'the corridor\'s start' });
    await step('Пройдите начало коридора как игрок: табличка, планшет, согласие', 'надпись исчезнет; дойдите до выбора двери и стойте у дверей');
    const doors = await waitFor('the doors', "document.documentElement.dataset.lobby === 'door'", 600, toCorridor);
    if (!doors) throw new Error('the corridor did not reach the doors in 10 minutes');
    const sinceOpen = now() - opened.at;
    if (sinceOpen < 45000) { log('boost wait', { ms: 45000 - sinceOpen }); await pause(45000 - sinceOpen); }
    await spot('corridor, by the doors, standing', 'Стойте спокойно у дверей, смотрите прямо');
    await spot('corridor, along it towards door 101', 'Повернитесь к двери 101 и смотрите вдоль коридора на неё');
    const toRoom = log('walk', { part: 'door 101' });
    await step('Нажмите дверь 101 и войдите в комнату', 'надпись исчезнет; внутри остановитесь');
    const pressed = await waitFor('door 101 pressed', '!document.documentElement.dataset.lobby', 180, toRoom);
    const inRoom = pressed && await waitFor('room 101', "!!document.documentElement.dataset.roomState && document.documentElement.dataset.roomState !== 'idle'", 180, toRoom);
    if (inRoom) {
      await spot('room 101, standing', 'Вы в комнате. Стойте спокойно, смотрите прямо');
      await spot('room 101, turning the head', 'Медленно поворачивайте голову влево и вправо');
    } else notKnown.push('room 101: not reached in 3 minutes, not measured');
    const end = log('end', { record: await run('window.__measure'), thermal: thermal('end'), memory: memory('end'),
      outside: await run("performance.getEntriesByType('resource').map((e) => e.name).filter((n) => !n.startsWith(location.origin) && !/^(data|blob):/.test(n))") });
    if (end.record.noDisplayTime) notKnown.push(`${end.record.noDisplayTime} frames came without a display time: timed by the callback instead`);
    keep('logcat.txt', sh('logcat -d -s VrApi'));
    await note('Замер готов. Спасибо! Можно снимать очки');

    // the summary, from the log alone
    const lines = fs.readFileSync(LOG, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    const summary = { dir: DIR, clean, conditions: start, session: lines.find((l) => l.step === 'session'), minutes: Number(((end.at - start.at) / 60000).toFixed(2)),
      toDoorsMs: doors.afterMs, doorPressedMs: pressed ? pressed.afterMs : null, toRoomMs: inRoom ? inRoom.afterMs : null,
      framesRecorded: end.record.frames, lateFrames: end.record.late,
      spots: lines.filter((l) => l.step === 'windows').map((l) => ({ spot: l.spot, windows: l.windows })),
      gpu: lines.filter((l) => l.step === 'gpu').map((l) => ({ spot: l.spot, n: Object.values(l.samples)[0]?.length || 0, mean: Object.fromEntries(Object.entries(l.samples).map(([k, v]) => [k, mean(v)])) })),
      traces: lines.filter((l) => l.step === 'trace').map((l) => ({ spot: l.spot, gpu: l.gpu })),
      heat: { start: start.thermal, end: end.thermal }, memory: { start: start.memory, end: end.memory }, outside: end.outside,
      vrapiLines: fs.readFileSync(path.join(DIR, 'logcat.txt'), 'utf8').split('\n').filter((l) => /VrApi/.test(l)).length, notKnown };
    fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
    console.log(JSON.stringify(summary, null, 1));
  } catch (e) {
    // a failure is said where he is, the log keeps it, and the measure stops
    try { log('failed', { error: String(e.message || e) }); } catch (err) { /* the headset itself gone */ }
    try { if (run) await note('Замер прерван, данные сохранены', 'можно снимать очки; причину напишу в чат'); } catch (err) { /* no page to show it on */ }
    console.log(`failed: ${e.message || e} (log: ${LOG})`);
    process.exitCode = 1;
  } finally {
    // the overlay switched on for the run stays on the headset after it unless switched off here: it was found
    // still drawn after the headset was put away
    if (connected()) hud(false);
    if (game) game.close();
  }
}
