// End-to-end check inside the owner's Quest on its cable: the corridor (the clipboard, the
// two-page form with its seal, the age, door 1) and the default room behind it, played in the
// headset browser at 10× speed; then a report: screens shown, voice lines played, page errors and
// the frame rate. Pictures of what the player sees: node tools/quest-look.mjs frame (in VR).
//
// Usage: node tools/quest-check.mjs [url]
//   url defaults to the laptop's server (the preview's port), seen by the headset as localhost:3000.
// The headset is woken and kept awake for the run, then put back to sleep (tools/headset.mjs).
import { serveToHeadset, awake, worn, sleepNow, openUrl, page as openPage } from './headset.mjs';

// 10× speed so the whole room (40 trials) is checked in about three minutes.
const URL_TO_TEST = process.argv[2] || serveToHeadset() + '?speed=10';
const ROOM = '01-control';
const { VOICE_LINES } = await import(new URL(`../src/rooms/${ROOM}/voice-lines.js`, import.meta.url));
// Every line is played at least once except the repeat question's answer path;
// instructions, concept twice, leave, back, 9 questions, thanks.
// the room's lines plus the corridor's (src/app/lobby), which come first
const { VOICE_LINES: LOBBY_LINES } = await import(new URL('../src/app/lobby/voice-lines.js', import.meta.url));
const EXPECTED_VOICE_FILES = VOICE_LINES.length + LOBBY_LINES.length;
const MIN_VOICE_PLAYS = 20;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

worn(true);
// every way out, a failure or a throw included, puts the headset back to sleep: worn(true) overrides
// its proximity sensor, which would otherwise keep it awake on the slow USB charge
let game = null;
process.on('exit', () => { game?.close(); try { sleepNow(); } catch { /* the cable is out */ } });
if (!awake()) openUrl(URL_TO_TEST);
// Use the open game tab if there is one, else open the URL in the headset browser.
game = await openPage(/object|localhost:3000/);
if (!game) { openUrl(URL_TO_TEST); await sleep(5000); game = await openPage(/object|localhost:3000/); }
if (!game) { console.log('FAIL no browser tab with the game'); process.exit(1); }
const { send, errors } = game;
const run = async (expression) => {
  const v = await game.run(expression, false);
  if (v && v.error && /^page threw/.test(v.error)) throw new Error(v.error);
  return v;
};

await send('Runtime.enable');
const freshUrl = URL_TO_TEST + (URL_TO_TEST.includes('?') ? '&' : '?') + 'check=' + Date.now();
await send('Page.navigate', { url: freshUrl });
// Wait for the NEW document (the old one may still report a loaded scene).
const marker = freshUrl.split('check=')[1];
let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  await sleep(500);
  ready = await run(`location.href.includes('${marker}') && !!document.querySelector('#screen')?.components?.panel && !!document.querySelector('a-scene')?.hasLoaded`).catch(() => false);
}
if (!ready) { console.log('FAIL page did not load in 30 s'); process.exit(1); }
// A headset asleep or showing its menu draws no frame of the page, and every step of the game waited
// on frames that never came (two runs hung 120 s so): stop at once with the reason. Only its power
// button wakes it (headset.mjs: a wake key press opens the quick menu and lets it sleep again).
// The count stops at its deadline, or it would go on adding a callback to every frame of the fps sample below.
const frames = await run(`new Promise((r) => { let n = 0, on = true; const f = () => { if (!on) return; n++; requestAnimationFrame(f); }; requestAnimationFrame(f); setTimeout(() => { on = false; r(n); }, 1500); })`);
if (!frames) { console.log('FAIL the headset draws no frame of the page: it is asleep or shows its menu; press its power button (or put it on), then run again'); process.exit(1); }
// Runtime.enable replays console history of earlier page loads: count only this load.
errors.length = 0;

// Hooks: count voice playback, record what the experimenter screen shows, fast timer.
await run(`(() => {
  window.__played = []; window.__screens = []; window.__states = [];
  window.addEventListener('voice-line', (e) => window.__played.push(e.detail));
  const panel = document.querySelector('#screen').components.panel; const write = panel.write.bind(panel);
  panel.write = (blocks, opt) => { window.__screens.push(blocks.map(b => b.t).join(' | ')); return write(blocks, opt); };
  new MutationObserver(() => window.__states.push(document.documentElement.dataset.roomState)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-room-state'] });
  return 1;
})()`);

const page = await run(`({ url: location.href, screenPx: document.querySelector('#screen').getAttribute('panel').px, voiceFiles: performance.getEntriesByType('resource').filter(e => e.name.includes('/voice/')).length })`);

// A trusted key press gives the page user activation (audio may start), then the
// room is played: consent without recording, understood, presses on some trials,
// every question, every reveal page.
const key = { key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 };
await send('Input.dispatchKeyEvent', { type: 'keyDown', ...key });
await send('Input.dispatchKeyEvent', { type: 'keyUp', ...key });
await run(`(async () => {
  const st = () => document.documentElement.dataset.roomState; const w = (ms) => new Promise(r => setTimeout(r, ms));
  const pick = async (i) => { for (;;) { const a = [...document.querySelectorAll('.answer')].find(e => +e.dataset.index === i && e.dataset.ready); if (a) { a.emit('click'); return; } await w(150); } };
  (async () => {
    while (!document.querySelector('.sheet[data-take]')) await w(150);
    document.querySelector('.sheet[data-take]').emit('click'); // corridor: take the clipboard from the board
    await pick(0); // "next" after the welcome
    // the consent form: a line written in each field (name, signature), then "next"
    for (let p = 0; p < 2; p++) {   // the form: the name page, then the signature page with the seal
      while (!document.querySelector('.ink-field')) await w(150);
      document.querySelectorAll('.ink-field').forEach((f) => f.components.ink.addStroke([[0.1, 0.6], [0.4, 0.3], [0.7, 0.6], [0.9, 0.4]]));
      await pick(0);
      await w(400);
    }
    await pick(0); // the age: "yes"
    await pick(1); // last consent page: start without recording
    while (document.documentElement.dataset.lobby !== 'door') await w(150);
    document.querySelector('#door1 .clickable').emit('click');
    for (let c = 0; c < 2; c++) {
      while (!(st() === 'intro' && document.querySelectorAll('.answer').length === 2)) await w(150);
      await pick(0);
      while (document.querySelectorAll('.answer').length) await w(100);
    }
    while (st() !== 'run') await w(100);
    let k = 0;
    while (st() === 'run') { if (document.querySelector('#yellow').getAttribute('material').emissiveIntensity > 0 && k++ % 3 === 0) document.querySelector('#buttonCap').emit('click'); await w(60); }
    for (let q = 0; q < 10; q++) { // 5 scales + 5 choices (src/rooms/01-control/questions.js)
      // the experimenter speaks first: wait until a scale or several answers are shown
      while (!document.querySelector('.scale-bar') && document.querySelectorAll('.answer').length < 2) await w(150);
      await w(300);
      const bar = document.querySelector('.scale-bar');
      if (bar) { const p = new THREE.Vector3(); bar.object3D.getWorldPosition(p); bar.emit('click', { intersection: { point: p } }); await w(300); }
      await pick(0);
    }
    while (st() !== 'done') await w(200);
    for (let i = 0; i < 5; i++) { await w(2500); await pick(0); }
  })();
  return 1;
})()`);
const fps = await run(`new Promise(r => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); }; requestAnimationFrame(f); })`);
await run(`new Promise(r => { const t = setInterval(() => { if (document.documentElement.dataset.roomState === 'done') { clearInterval(t); r(1); } }, 300); setTimeout(() => r(0), 300000); })`);
await sleep(19000);
const result = await run(`({ states: window.__states, played: window.__played, screens: window.__screens, drawCalls: document.querySelector('a-scene').renderer.info.render.calls })`);

const checks = [
  ['tested build is the requested URL', page.url.startsWith(URL_TO_TEST.split('?')[0])],
  ['all voice recordings loaded', page.voiceFiles === EXPECTED_VOICE_FILES],
  ['room went idle -> intro -> run -> questions -> done', ['intro', 'run', 'questions', 'done'].every(s => result.states.includes(s))],
  [`voice played at least ${MIN_VOICE_PLAYS} times`, result.played.length >= MIN_VOICE_PLAYS],
  ['all questions shown', result.screens.some(s => s.includes('управляли зелёной лампой?')) && result.screens.some(s => s.includes('знали этот опыт'))],
  ['reveal: what you did', result.screens.some(s => s.startsWith('ЧТО ВЫ ДЕЛАЛИ'))],
  ['reveal: the truth', result.screens.some(s => s.startsWith('КАК БЫЛО НА САМОМ ДЕЛЕ'))],
  ['reveal: original and replication', result.screens.some(s => s.startsWith('ОРИГИНАЛ')) && result.screens.some(s => s.startsWith('ПОВТОРЕНИЕ'))],
  ['reveal: differences with the share line', result.screens.some(s => s.startsWith('ЧЕМ ЭТА КОМНАТА') && s.includes('Не рассказывайте'))],
  ['no page errors', errors.length === 0]
];
// The rate is told, not judged: this run plays the flat page in the headset's browser window, whose
// own refresh paces it, while Meta's "at least 72 Hz" is for the VR session; that is judged in VR by
// quest-look perf (a 72 bar here failed a run at 71, two missed frames in three seconds at 10x speed)
console.log(`URL ${page.url}\nscreen resolution ${page.screenPx}, draw calls ${result.drawCalls}, fps on the flat page ${fps} (the VR rate: quest-look perf in VR)`);
console.log(`voice durations: ${result.played.join(', ') || 'none'}`);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (errors.length) console.log('errors:\n  ' + errors.join('\n  '));
process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
