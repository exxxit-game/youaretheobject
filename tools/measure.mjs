// The baseline's measure in the owner's headset, as one walk (docs/baseline.md; his words of 13.10:
// «надо все замерить… очень-очень хорошо детально», «мы любим точность»). Two fact-checks of the first
// baseline found every number copied right and the times, spans and conditions around them wrong, written
// from memory; so here the machine writes them: every step's time from the headset's own clock (the page's
// clock is the same device's), every tool's raw output and the conditions, into one log, and the summary is
// made from that log alone. The reading of each tool's output is a function of its own, held by
// tests/measure.test.mjs on outputs saved from his Quest 3 (tests/fixtures/quest3).
// Usage: node tools/measure.mjs [--clean]   (run it more than once: whether two runs agree says whether the
// measure holds, his word of 13.10: «можно несколько раз замерить, чтобы… среднее получить… и убедиться»)
//   --clean  OVR Metrics' HUD asked off, no trace, each step shown only between the windows, hidden while they run
// The walk: the corridor's start as a player plays it (the sign, the clipboard, the consent) up to the doors;
// windows by the doors; door 101; windows in the room. Any failure is said in the headset before the tool stops.
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
// A frame is late when more than one refresh of the session passed since the one before: at the session's rate
// R (XRSession.frameRate, W3C WebXR) a frame on time comes after 1000/R ms and one that missed a refresh after
// twice that, so the bar is halfway, 1.5 refreshes. The 72 Hz bar of tools/quest-look.mjs perf (1000/72 + 2 ms)
// is kept beside it, so runs stay comparable with the first baseline; at 90 Hz it also counts a 16 ms frame that
// lost no refresh (the late bar there is 16.7 ms).
export const SLOW_MS = 1000 / 72 + 2;
export const lateMs = (rate) => 1.5 * (1000 / rate);
export function windowStats(dts, rate = 90) {
  const q = [...dts].sort((a, b) => a - b), span = dts.reduce((a, b) => a + b, 0);
  const at = (p) => Number(q[Math.min(q.length - 1, Math.floor(p * q.length))].toFixed(1));
  return { frames: dts.length, fps: Number((dts.length / (span / 1000)).toFixed(1)), rate, late: dts.filter((d) => d > lateMs(rate)).length,
    slowUnder72: dts.filter((d) => d > SLOW_MS).length, p50: at(0.5), p95: at(0.95), p99: at(0.99), worst: Number(q[q.length - 1].toFixed(1)) };
}
export const mean = (v) => (v.length ? Number((v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)) : null);

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();

async function main() {
  const { adb, serveToHeadset, localPort, openGame, page, wornByPerson, connected } = await import('./headset.mjs');
  const { requireReview, requirePaper } = await import('./review-gate.mjs');
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const clean = process.argv.includes('--clean');
  // a shell command's output; "; true" so a command ended by its timeout (exit 124) still gives what it printed
  const sh = (cmd) => { try { return adb('shell', `${cmd} ; true`); } catch (e) { return `error: ${e.message}`; } };
  const now = () => Number(sh('date +%s%3N').trim());   // the headset's clock, ms since 1970
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const quest = (...a) => execFileSync('node', [path.join(ROOT, 'tools', 'quest-look.mjs'), ...a], { encoding: 'utf8' });
  const metavr = (...a) => execFileSync('metavr', a, { encoding: 'utf8', shell: true });   // an npm command: .cmd on Windows
  const hud = (on) => sh(`am broadcast -n com.oculus.ovrmonitormetricsservice/.SettingsBroadcastReceiver -a com.oculus.ovrmonitormetricsservice.${on ? 'ENABLE' : 'DISABLE'}_OVERLAY`);

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
  const keep = (name, text) => fs.writeFileSync(path.join(DIR, name), String(text));
  // the dumps themselves kept beside the log, the parsed values in it
  const thermal = (tag) => { const t = sh('dumpsys thermalservice'), b = sh('dumpsys battery'); keep(`thermal-${tag}.txt`, `${t}\n${b}`); return thermalOf(t, b); };
  const memory = (tag) => { const m = sh('dumpsys meminfo com.oculus.browser'), all = sh('dumpsys meminfo'); keep(`meminfo-${tag}.txt`, `${m}\n${all}`);
    return { browserTotal: (m.match(/TOTAL PSS:\s*(\d+)/) || m.match(/TOTAL\s+(\d+)/) || [])[1], sandboxed: all.split('\n').filter((l) => /sandboxed_process/.test(l)).map((l) => l.trim()) }; };
  const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
  const notKnown = ['frames are the page\'s own callbacks, not the compositor\'s stale frames (Meta\'s ts-ovrstats)',
    'the CPU and GPU levels and the foveation the browser ran at were not locked (Meta locks them before comparing: tools-per-frame-gpu)',
    'three windows a spot is our choice (his word on repeating), not a published rule'];

  let game = null, start = null, stepNo = 0;
  const step = (main, small) => { stepNo++; log('step shown', { n: stepNo, main, small }); quest('say', main, small); };
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
    const run = async (js) => { const v = await game.run(js); if (v && v.error) throw new Error(v.error); return v; };
    for (let i = 0; i < 80 && (await run("!!document.querySelector('a-scene')?.hasLoaded")) !== true; i++) await pause(250);
    log('loaded', { navigation: await run("(({domContentLoadedEventEnd: d, loadEventEnd: l}) => ({domReady: Math.round(d), load: Math.round(l)}))(performance.getEntriesByType('navigation')[0])") });
    log('vr asked');
    const vr = log('vr', { answer: await run("document.querySelector('a-scene').enterVR().then(() => 'in VR', (e) => 'failed: ' + e.message)") });
    if (vr.answer !== 'in VR') throw new Error(`VR: ${vr.answer}`);
    const rate = await run('document.querySelector("a-scene").xrSession.frameRate || 90');
    log('session', { frameRate: rate, rates: await run('Array.from(document.querySelector("a-scene").xrSession.supportedFrameRates || [])'),
      foveation: await run('document.querySelector("a-scene").renderer.xr.getFoveation?.() ?? null') });

    // every frame of the VR session from here to the end: each late one kept with its time (the page's clock,
    // the headset's), its length and where the player was (the room's state once its procedure began, else the
    // corridor's: the sign's start, the doors)
    await run(`(() => {
      const s = document.querySelector('a-scene'), d = document.documentElement.dataset, w = window.__measure = { frames: 0, late: [] };
      const where = () => (d.roomState && d.roomState !== 'idle' ? 'room:' + d.roomState : 'corridor' + (d.lobby ? ':' + d.lobby : d.signStart ? ':sign' : ''));
      let last = 0;
      const f = () => { const at = performance.timeOrigin + performance.now(); if (last) { const dt = at - last; w.frames++; if (dt > ${lateMs(rate)}) w.late.push([Math.round(at), Math.round(dt), where()]); } last = at; if (s.xrSession) s.xrSession.requestAnimationFrame(f); };
      s.xrSession.requestAnimationFrame(f);
      return true;
    })()`);
    // what the player looked from and at, and where the game stood, read with each window
    const state = () => run(`(() => { const s = document.querySelector('a-scene'), d = document.documentElement.dataset, c = s.camera, p = new THREE.Vector3(), e = new THREE.Euler();
      c.getWorldPosition(p); e.setFromQuaternion(c.getWorldQuaternion(new THREE.Quaternion()), 'YXZ');
      return { at: [p.x, p.y, p.z].map((v) => +v.toFixed(2)), yawDeg: Math.round(e.y * 57.2958), pitchDeg: Math.round(e.x * 57.2958), lobby: d.lobby || null, roomState: d.roomState || null, signStart: d.signStart || null, left: d.left || null }; })()`);
    // one window: five seconds of frame times, then the last frame's draw calls and triangles (three.js counts one
    // frame: renderer.info resets on every render)
    const windowOf = async () => {
      const from = now(), before = await state();
      const v = await run(`new Promise((resolve) => { const s = document.querySelector('a-scene'), dts = []; let last = 0, first = 0;
        const f = () => { const t = performance.now(); if (last) dts.push(t - last); else first = t; last = t;
          if (t - first < 5000) s.xrSession.requestAnimationFrame(f); else resolve({ dts, calls: s.renderer.info.render.calls, triangles: s.renderer.info.render.triangles }); };
        s.xrSession.requestAnimationFrame(f); })`);
      return { from, to: now(), before, after: await state(), ...windowStats(v.dts, rate), lastFrameCalls: v.calls, lastFrameTriangles: v.triangles };
    };
    // a spot: the step shown with its length (8 s to read and turn; hidden in a clean run before measuring), three
    // windows, the GPU's stages for 6 s, and in a normal run one 10-second Perfetto trace; each tool's start logged,
    // so a late frame can be set against what the measuring itself was doing
    const spot = async (name, main) => {
      step(main, clean ? 'около 25 секунд, не двигайтесь; конец — новая надпись и вибрация' : 'около минуты, не двигайтесь; конец — новая надпись и вибрация');
      await pause(8000);
      if (clean) { quest('say', 'off'); log('step hidden', { spot: name }); }
      const windows = [];
      for (let k = 0; k < 3; k++) windows.push(await windowOf());
      log('windows', { spot: name, windows });
      log('gpu start', { spot: name });
      log('gpu', { spot: name, ids, samples: gpuSamples(sh(`timeout 7 ovrgpuprofiler --realtime="${Object.values(ids).join(',')}"`)) });
      if (!clean) {
        log('trace start', { spot: name });
        const out = metavr('perf', 'capture', '--app', 'com.oculus.browser', '--mode', 'vr', '--duration', '10000');
        const id = (out.match(/Session ID: (\S+)/) || [])[1];
        log('trace', { spot: name, session: id, analysis: id ? metavr('perf', 'analyze-trace', id, '--app', 'com.oculus.browser') : out });
      }
    };
    // waits for the page to reach a state, at most `secs`; the log says if it did not
    const waitFor = async (what, js, secs) => {
      for (let i = 0; i < secs; i++) { if (await run(js)) return log('reached', { what, afterS: i }); await pause(1000); }
      log('not reached', { what, afterS: secs }); return null;
    };

    step('Пройдите начало коридора как игрок: табличка, планшет, согласие', 'до выбора двери; потом стойте у дверей');
    const doors = await waitFor('the doors', "document.documentElement.dataset.lobby === 'door'", 600);
    if (!doors) throw new Error('the corridor did not reach the doors in 10 minutes');
    await spot('corridor, by the doors, standing', 'Стойте спокойно у дверей, смотрите прямо');
    await spot('corridor, along it', 'Повернитесь и смотрите вдоль коридора');
    step('Нажмите дверь 101 и войдите в комнату', 'внутри остановитесь');
    const inRoom = await waitFor('room 101', "!!document.documentElement.dataset.roomState && document.documentElement.dataset.roomState !== 'idle'", 180);
    if (inRoom) {
      await spot('room 101, standing', 'Вы в комнате. Стойте спокойно, смотрите прямо');
      await spot('room 101, turning the head', 'Медленно поворачивайте голову влево и вправо');
    } else notKnown.push('room 101: not reached in 3 minutes, not measured');
    const end = log('end', { record: await run('window.__measure'), thermal: thermal('end'), memory: memory('end'),
      outside: await run("performance.getEntriesByType('resource').map((e) => e.name).filter((n) => !n.startsWith(location.origin) && !/^(data|blob):/.test(n))") });
    keep('logcat.txt', sh('logcat -d -s VrApi'));
    quest('say', 'Замер готов. Спасибо! Можно снимать очки');

    // the summary, from the log alone
    const lines = fs.readFileSync(LOG, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    const traces = lines.filter((l) => l.step === 'trace').map((l) => ({ spot: l.spot, gpu: (String(l.analysis).match(/avg\s+[\d.]+ ms\s+max\s+[\d.]+ ms[^\n]*/) || [])[0] || null }));
    const summary = { dir: DIR, clean, conditions: start, session: lines.find((l) => l.step === 'session'), minutes: Number(((end.at - start.at) / 60000).toFixed(2)),
      toDoorsS: doors.afterS, toRoomS: inRoom ? inRoom.afterS : null, framesRecorded: end.record.frames, lateFrames: end.record.late,
      spots: lines.filter((l) => l.step === 'windows').map((l) => ({ spot: l.spot, windows: l.windows })),
      gpu: lines.filter((l) => l.step === 'gpu').map((l) => ({ spot: l.spot, n: Object.values(l.samples)[0]?.length || 0, mean: Object.fromEntries(Object.entries(l.samples).map(([k, v]) => [k, mean(v)])) })),
      traces, heat: { start: start.thermal, end: end.thermal }, memory: { start: start.memory, end: end.memory }, outside: end.outside,
      vrapiLines: fs.readFileSync(path.join(DIR, 'logcat.txt'), 'utf8').split('\n').filter((l) => /VrApi/.test(l)).length, notKnown };
    fs.writeFileSync(path.join(DIR, 'summary.json'), JSON.stringify(summary, null, 1));
    console.log(JSON.stringify(summary, null, 1));
  } catch (e) {
    // a failure is said where he is, the log keeps it, and the measure stops
    try { log('failed', { error: String(e.message || e) }); } catch (err) { /* the headset itself gone */ }
    try { quest('say', 'Замер прерван, данные сохранены', 'можно снимать очки; причину напишу в чат'); } catch (err) { /* no page to show it on */ }
    console.log(`failed: ${e.message || e} (log: ${LOG})`);
    process.exitCode = 1;
  } finally {
    if (game) game.close();
  }
}
