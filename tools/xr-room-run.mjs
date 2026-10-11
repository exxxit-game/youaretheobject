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
// the folder is made before the run, so a long session never ends unsaved
if (here) fs.mkdirSync(here, { recursive: true });

serveToHeadset(3100);
const url = 'http://localhost:3000/tools/xr-room.html';
const tab = await page({ test: (u) => u.startsWith('http://localhost:3000/') });
if (!tab) throw new Error('no tab on localhost:3000 in the headset');
await tab.send('Page.navigate', { url });
tab.close();
await sleep(4000);
const room = await page({ test: (u) => u.includes('xr-room') });
if (!room) throw new Error('the room page did not open');
log('page', await room.run("({ three: !!window.THREE, say: typeof window.__say })"));
// what he is to do, each for its time, kept with the page's words (tools/xr-room.html)
const STEPS = await room.run('window.__steps');
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
if (!state || !state.started) { console.log('the mixed-reality session did not start:', state && state.error); room.close(); process.exit(1); }

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
for (const [i, s] of STEPS.entries()) {
  log('step', i + 1, await room.run(`window.__say(${JSON.stringify(s.main)}, ${JSON.stringify(s.small)})`));
  const t0 = Date.now();
  while (Date.now() - t0 < s.secs * 1000) {
    readHeat();
    await sleep(Math.min(10000, s.secs * 1000 - (Date.now() - t0)));
  }
}
const summary = await room.run('window.__roomSummary()');
const result = JSON.stringify({ summary, heat }, null, 1);
if (here) { fs.writeFileSync(path.join(here, 'room-result.json'), result); log('saved', path.join(here, 'room-result.json')); } else console.log(result);
room.close();
