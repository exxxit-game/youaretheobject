// Runs the real-room session in the owner's headset: opens tools/xr-room.html in the game's tab,
// starts it, shows each step for its time, logs battery and heat meanwhile, saves the summary.
// Usage: node tools/xr-room-run.mjs [folder]   the game tab open on localhost:3000 in the headset; the
// result goes to <folder>/room-result.json, or is printed. It starts only while the owner wears the
// headset and once a practice review has seen these very files, as tools/xr-probe-run.mjs does
// (docs/audit/room-probe-review.md). He presses the start button himself, after reading the page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adb, serveToHeadset, page, wornByPerson } from './headset.mjs';
import { requireReview } from './review-gate.mjs';

const here = process.argv[2] || null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

requireReview(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), 'the real-room session in the headset');
if (!wornByPerson()) { console.log('not now: the headset is not on his head'); process.exit(1); }
// The plan against the headset as it is, before he takes a step: the session has him walk, so the
// link must be Wi-Fi and the power his strap. A run started on the cable lost him mid-walk when the
// cable came out (docs/mistakes.md); a link or power that does not match stops the run here.
const link = adb('devices').split('\n').slice(1).map((l) => l.trim().split('\t')).filter(([, s]) => s === 'device').map(([id]) => id);
const power = adb('shell', 'dumpsys', 'battery');
const onWifi = link.length === 1 && link[0].includes(':'), onStrap = /AC powered: true/.test(power);
console.log(`link ${link.join(', ') || 'none'} (${onWifi ? 'Wi-Fi' : 'not Wi-Fi only'}), power ${onStrap ? 'strap' : 'not the strap'}`);
if (!onWifi) { console.log('not now: the steps have him walk; first node tools/quest-wifi.mjs, then the cable out, then this again'); process.exit(1); }
if (!onStrap) { console.log('not now: the headset is not on his strap'); process.exit(1); }
// the folder is made before the run, so a long session never ends unsaved
if (here) fs.mkdirSync(here, { recursive: true });

serveToHeadset(3100);
const url = 'http://localhost:3000/tools/xr-room.html';
const tab = await page({ test: (u) => u.startsWith('http://localhost:3000/') });
if (!tab) throw new Error('no tab on localhost:3000 in the headset');
await tab.send('Page.navigate', { url });
tab.close();
// the page is ready once its steps are there: A-Frame loads first, over Wi-Fi, in no known time
let room = null, STEPS = null;
for (let i = 0; i < 60 && !Array.isArray(STEPS); i++) {
  await sleep(1000);
  if (room) room.close();
  room = await page({ test: (u) => u.includes('xr-room') });
  STEPS = room ? await room.run('window.__steps') : null;
}
// on any early exit the start button is turned off, so no session starts before the checks above held
const stop = async (why) => { console.log(why); if (room) { await room.run("document.getElementById('start').disabled = true"); room.close(); } process.exit(1); };
if (!Array.isArray(STEPS)) await stop('the room page did not load its steps');
log('page ready', STEPS.length, 'steps');
// he presses the start button and answers the browser's question about his space data; the session has
// started, or the run stops: no steps are timed without it
log('waiting for his press');
let state = null;
for (let i = 0; i < 120; i++) {
  await sleep(1000);
  state = await room.run('window.__roomState()');
  if (!state || state.error || state.started) break;
}
log('start', state);
if (!state || !state.started) await stop(`the mixed-reality session did not start: ${state && state.error}`);

const heat = [];
const readHeat = () => {
  try {
    const b = adb('shell', 'dumpsys', 'battery');
    const t = adb('shell', 'dumpsys', 'thermalservice');
    const cpu = [...t.matchAll(/mValue=([\d.]+)[^}]*mName=cpu-[^,]*/g)].map((m) => +m[1]);
    heat.push({ at: new Date().toISOString().slice(11, 19), level: +(b.match(/level: (\d+)/) || [])[1], counter: +(b.match(/Charge counter: (\d+)/) || [])[1],
      batteryC: +(b.match(/temperature: (\d+)/) || [])[1] / 10, cpuMaxC: cpu.length ? Math.max(...cpu) : null });
  } catch (e) { heat.push({ error: String(e).slice(0, 80) }); }
};
// the page leads him through the steps on its own clock; here only the heat is logged and the end
// awaited. A link lost meanwhile costs only these readings: the steps and the record go on in the headset
// the steps pause while the session is hidden, so the wait has no fixed length: up to a quarter hour
const total = 15 * 60;
const t0 = Date.now();
let last = -1;
while (Date.now() - t0 < total * 1000) {
  readHeat();
  await sleep(5000);
  const s = await room.run('window.__roomState()');
  if (s && !s.error && s.stepAt !== last) { last = s.stepAt; log('step', s.stepAt, 'of', STEPS.length); }
  if (s && (s.ended || (s.done && !s.running))) break;
}
const summary = await room.run('window.__roomSummary()');
const result = JSON.stringify({ summary, heat }, null, 1);
if (here) { fs.writeFileSync(path.join(here, 'room-result.json'), result); log('saved', path.join(here, 'room-result.json')); } else console.log(result);
room.close();
