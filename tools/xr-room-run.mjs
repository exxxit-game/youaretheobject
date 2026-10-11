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
// link must be Wi-Fi only and the power off the battery's own, from outside. A run started on the
// cable lost him mid-walk when the cable came out (docs/mistakes.md); a link or power that does not
// match stops the run here. The headset reports a strap and a wall charger alike ("AC powered"), so
// the strap itself is what he confirms: the page asks for every cable out but the strap's, and his
// press of its start button is that answer
const link = adb('devices').split('\n').slice(1).map((l) => l.trim().split('\t')).filter(([, s]) => s === 'device').map(([id]) => id);
const power = adb('shell', 'dumpsys', 'battery');
const onWifi = link.length === 1 && link[0].includes(':'), onAc = /AC powered: true/.test(power);
console.log(`link ${link.join(', ') || 'none'} (${onWifi ? 'Wi-Fi' : 'not Wi-Fi only'}), power ${onAc ? 'from outside, AC (the strap or a wall charger)' : 'the battery only'}`);
if (!onWifi) { console.log('not now: the steps have him walk; first node tools/quest-wifi.mjs, then the cable out, then this again'); process.exit(1); }
if (!onAc) { console.log('not now: no outside power: is the strap on and switched on?'); process.exit(1); }
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
// started and still running, with no error: started stays true after the session has ended
if (!state || state.error || !state.started || !state.running) await stop(`the mixed-reality session did not start or ended at once: ${state && state.error}`);

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
// a call to the page that survives a lost link: the link is made again and the call repeated; the
// page keeps its record in the headset meanwhile, so nothing is lost while the link is down
const ask = async (js) => {
  for (let i = 0; i < 3; i++) {
    let v;
    try { v = await room.run(js); } catch (e) { v = { error: String(e) }; }
    if (!(v && v.error)) return v;
    log('link to the page lost, trying again:', String(v.error).slice(0, 80));
    await sleep(5000);
    try { room.close(); } catch (e) { /* already closed */ }
    // finding the page again waits on the headset's tab list and socket with no limit of their own:
    // bounded, so a lost link cannot hold the loop past its end
    try {
      room = await Promise.race([page({ test: (u) => u.includes('xr-room') }, { noAnswerMs: 20000 }), sleep(30000).then(() => null)]) || room;
    } catch (e) { /* the headset not reachable yet */ }
  }
  return null;
};
let last = -1;
while (Date.now() - t0 < total * 1000) {
  readHeat();
  await sleep(5000);
  const s = await ask('window.__roomState()');
  if (s && s.stepAt !== last) { last = s.stepAt; log('step', s.stepAt, 'of', STEPS.length); }
  if (s && (s.ended || (s.done && !s.running))) break;
}
// the result, or where it stays when the link never comes back
let summary = null;
for (let i = 0; i < 24 && !summary; i++) { summary = await ask('window.__roomSummary()'); if (!summary) await sleep(5000); }
if (!summary) console.log('the result stays in the headset (the page keeps its last runs): open tools/xr-room.html there again and read window.__rooms');
const result = JSON.stringify({ summary, heat }, null, 1);
if (here) { fs.writeFileSync(path.join(here, 'room-result.json'), result); log('saved', path.join(here, 'room-result.json')); } else console.log(result);
room.close();
