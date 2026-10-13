// The baseline's measure in the owner's headset, as one walk (docs/baseline.md; his words of 13.10:
// «надо все замерить… очень-очень хорошо детально», «мы любим точность»). Two fact-checks of the first
// baseline found every number copied right and the times, spans and conditions around them wrong, written
// from memory; so here the machine writes them: every step's time from the headset's own clock (the page's
// clock is the same device's), every tool's raw output and the conditions, into one log, and the summary is
// made from that log alone. The reading of each tool's output is a function of its own, held by
// tests/measure.test.mjs on outputs saved from his Quest 3 (tests/fixtures/quest3).
// Usage: node tools/measure.mjs [--clean]   (run it more than once: whether two runs agree says whether the
// measure holds, his word of 13.10: «можно несколько раз замерить, чтобы… среднее получить… и убедиться»)
//   --clean  OVR Metrics' HUD off, no trace, and each step shown only between the windows, hidden while they run
// Needs: the headset on his head over the cable, the laptop's server (the app's preview, .claude/launch.json),
// the practice review of what he meets (as tools/quest-look.mjs vr).
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
// five seconds of frame times (ms, each the time from the frame before): the rate over the frames' own span,
// the slow ones (over 1000/72 + 2 ms, as tools/quest-look.mjs perf: Meta's 72 Hz floor, 2 ms of timer jitter)
// and the spread
export const SLOW_MS = 1000 / 72 + 2;
export function windowStats(dts) {
  const q = [...dts].sort((a, b) => a - b), span = dts.reduce((a, b) => a + b, 0);
  const at = (p) => Number(q[Math.min(q.length - 1, Math.floor(p * q.length))].toFixed(1));
  return { frames: dts.length, fps: Number((dts.length / (span / 1000)).toFixed(1)), slow: dts.filter((d) => d > SLOW_MS).length,
    p50: at(0.5), p95: at(0.95), p99: at(0.99), worst: Number(q[q.length - 1].toFixed(1)) };
}
export const mean = (v) => Number((v.reduce((a, b) => a + b, 0) / v.length).toFixed(1));

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();

async function main() {
  const { adb, serveToHeadset, localPort, openGame, page, wornByPerson, connected } = await import('./headset.mjs');
  const { requireReview, requirePaper } = await import('./review-gate.mjs');
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const clean = process.argv.includes('--clean');
  const sh = (cmd) => { try { return adb('shell', cmd); } catch (e) { return `error: ${e.message}`; } };
  const now = () => Number(sh('date +%s%3N').trim());   // the headset's clock, ms since 1970
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const quest = (...a) => execFileSync('node', [path.join(ROOT, 'tools', 'quest-look.mjs'), ...a], { encoding: 'utf8' });
  const metavr = (...a) => execFileSync('metavr', a, { encoding: 'utf8', shell: true });   // an npm command: .cmd on Windows

  if (!connected()) { console.log('the headset is not on the cable'); process.exit(1); }
  if (!wornByPerson()) { console.log('not now: the measure runs only while the owner wears the headset'); process.exit(1); }
  requireReview(ROOT, 'VR in the headset', { look: true });
  requirePaper(ROOT, 'VR in the headset', { look: true });
  const WANT = ['GPU Frequency', 'GPU % Utilization', '% Shaders Busy', '% Time Shading Vertices', '% Time Shading Fragments'];
  const ids = gpuIds(sh('ovrgpuprofiler -m'), WANT);   // under Meta's limit of 30 at once
  if (Object.keys(ids).length !== WANT.length) { console.log(`ovrgpuprofiler lacks: ${WANT.filter((w) => !ids[w]).join(', ')}`); process.exit(1); }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const DIR = path.join(process.env.USERPROFILE || process.env.HOME, 'Documents', 'objekt-files', 'notes', 'headset', `measure-${stamp}${clean ? '-clean' : ''}`);
  fs.mkdirSync(DIR, { recursive: true });
  const LOG = path.join(DIR, 'log.jsonl');
  const log = (step, data = {}) => { const e = { at: now(), step, ...data }; fs.appendFileSync(LOG, JSON.stringify(e) + '\n'); return e; };
  // the dumps themselves kept beside the log, the parsed values in it
  const thermal = (tag) => { const t = sh('dumpsys thermalservice'), b = sh('dumpsys battery'); fs.writeFileSync(path.join(DIR, `thermal-${tag}.txt`), `${t}
${b}`); return thermalOf(t, b); };
  const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

  // OVR Metrics' HUD (Meta's ts-ovrmetricstool page: these broadcasts): on in a normal run, off in a clean one
  sh(`am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.${clean ? 'DISABLE' : 'ENABLE'}_OVERLAY`);
  const start = log('conditions', { model: sh('getprop ro.product.model').trim(), os: sh('getprop ro.build.version.incremental').trim(),
    browser: (sh('dumpsys package com.oculus.browser').match(/versionName=(\S+)/) || [])[1], commit: git('rev-parse', '--short', 'HEAD'),
    dirty: git('status', '--porcelain').length > 0, clean, hud: !clean, gpuIds: ids, thermal: thermal('start') });

  // the page opened afresh from the laptop's server; its own load timing
  await openGame(serveToHeadset(localPort()));
  let game = null;
  for (let i = 0; i < 60 && !game; i++) { game = await page(/localhost:3000/); if (!game) await pause(500); }
  if (!game) { console.log('the game tab did not appear'); process.exit(1); }
  const run = (js) => game.run(js);
  for (let i = 0; i < 80 && (await run("!!document.querySelector('a-scene')?.hasLoaded")) !== true; i++) await pause(250);
  log('loaded', { navigation: await run("(({domContentLoadedEventEnd: d, loadEventEnd: l}) => ({domReady: Math.round(d), load: Math.round(l)}))(performance.getEntriesByType('navigation')[0])") });
  const asked = log('vr asked');
  const vr = log('vr', { answer: await run("document.querySelector('a-scene').enterVR().then(() => 'in VR', (e) => 'failed: ' + e.message)") });
  if (vr.answer !== 'in VR') { console.log(vr.answer); process.exit(1); }

  // every frame of the VR session from here to the end: each slow one kept with its time (the page's clock,
  // the headset's) and where the player was (the room's state once its procedure began, else the corridor's)
  await run(`(() => {
    const s = document.querySelector('a-scene'), d = document.documentElement.dataset, w = window.__measure = { frames: 0, slow: [] };
    const where = () => (d.roomState && d.roomState !== 'idle' ? 'room:' + d.roomState : 'corridor' + (d.lobby ? ':' + d.lobby : ''));
    let last = 0;
    const f = () => { const at = performance.timeOrigin + performance.now(); if (last) { const dt = at - last; w.frames++; if (dt > ${SLOW_MS}) w.slow.push([Math.round(at), Math.round(dt), where()]); } last = at; if (s.xrSession) s.xrSession.requestAnimationFrame(f); };
    s.xrSession.requestAnimationFrame(f);
    return true;
  })()`);
  // one window: five seconds of frame times, then the last frame's draw calls and triangles (three.js counts
  // one frame: renderer.info resets on every render)
  const windowOf = async () => {
    const from = now();
    const v = await run(`new Promise((resolve) => { const s = document.querySelector('a-scene'), dts = []; let last = 0, first = 0;
      const f = () => { const t = performance.now(); if (last) dts.push(t - last); else first = t; last = t;
        if (t - first < 5000) s.xrSession.requestAnimationFrame(f); else resolve({ dts, calls: s.renderer.info.render.calls, triangles: s.renderer.info.render.triangles }); };
      s.xrSession.requestAnimationFrame(f); })`);
    return { from, to: now(), ...windowStats(v.dts), lastFrameCalls: v.calls, lastFrameTriangles: v.triangles };
  };
  // a spot: the step shown (hidden again in a clean run before measuring), three windows, the GPU's stages for
  // 6 s, and in a normal run one 10-second Perfetto trace (it loads the headset: a clean run leaves it out)
  const spot = async (name, main, small = '') => {
    log('step shown', { spot: name, main }); quest('say', main, small);
    await pause(4000);
    if (clean) { quest('say', 'off'); log('step hidden', { spot: name }); }
    const windows = [];
    for (let k = 0; k < 3; k++) windows.push(await windowOf());
    log('windows', { spot: name, windows });
    log('gpu', { spot: name, ids, samples: gpuSamples(sh(`timeout 7 ovrgpuprofiler --realtime="${Object.values(ids).join(',')}"`)) });
    if (!clean) {
      const out = metavr('perf', 'capture', '--app', 'com.oculus.browser', '--mode', 'vr', '--duration', '10000');
      const id = (out.match(/Session ID: (\S+)/) || [])[1];
      log('trace', { spot: name, session: id, analysis: id ? metavr('perf', 'analyze-trace', id, '--app', 'com.oculus.browser') : out });
    }
  };

  await spot('corridor, standing', 'Замер. Стойте спокойно, смотрите прямо');
  await spot('corridor, along it to the doors', 'Повернитесь и смотрите вдоль коридора на двери', 'не двигайтесь');
  // the way to the room, timed by the page: from the step shown to the room's procedure begun (room.js setState)
  const go = log('step shown', { spot: 'to room 101', main: 'Идите к двери 101 и войдите в комнату' });
  quest('say', 'Идите к двери 101 и войдите в комнату', 'внутри остановитесь');
  let inRoom = null;
  for (let i = 0; i < 300 && !inRoom; i++) {
    const st = await run("document.documentElement.dataset.roomState || ''");
    if (st && st !== 'idle') inRoom = log('in room 101', { roomState: st, sinceStep: now() - go.at }); else await pause(1000);
  }
  if (inRoom) {
    await spot('room 101, standing', 'Вы в комнате. Стойте спокойно, смотрите прямо');
    await spot('room 101, turning the head', 'Медленно поворачивайте голову влево и вправо');
  }
  const pids = sh('pidof com.oculus.browser').trim();
  const end = log('end', { record: JSON.parse(await run('JSON.stringify(window.__measure)')), thermal: thermal('end'),
    memory: sh('dumpsys meminfo com.oculus.browser').split('\n').filter((l) => /TOTAL|Graphics|GL mtrack|EGL mtrack/.test(l)).join('\n'),
    sandboxed: sh('dumpsys meminfo').split('\n').filter((l) => /sandboxed_process/.test(l)).join('\n'), browserPids: pids,
    outside: JSON.parse(await run("JSON.stringify(performance.getEntriesByType('resource').map((e) => e.name).filter((n) => !n.startsWith(location.origin) && !/^(data|blob):/.test(n)))")) });
  quest('say', 'Замер готов. Спасибо! Можно снимать очки');
  game.close();

  // the summary, from the log alone
  const lines = fs.readFileSync(LOG, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const summary = { dir: DIR, clean, conditions: start, vrMs: vr.at - asked.at, toRoomMs: inRoom ? inRoom.sinceStep : null,
    framesRecorded: end.record.frames, slowFrames: end.record.slow,
    spots: lines.filter((l) => l.step === 'windows').map((l) => ({ spot: l.spot, windows: l.windows })),
    gpu: lines.filter((l) => l.step === 'gpu').map((l) => ({ spot: l.spot, n: Object.values(l.samples)[0]?.length || 0,
      mean: Object.fromEntries(Object.entries(l.samples).map(([k, v]) => [k, mean(v)])) })),
    heat: { start: start.thermal, end: end.thermal, minutes: Number(((end.at - start.at) / 60000).toFixed(2)) }, outside: end.outside };
  fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
}
