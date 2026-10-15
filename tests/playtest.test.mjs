// The playtest report the game sends must be exactly what the server accepts (the newest
// public.submit_playtest in supabase/migrations): same field names, devices and ranges.
// A mismatch would silently lose testers' answers, so this test reads the SQL.
import assert from 'node:assert/strict';
import { playtestReport, deviceOf, PLAYTEST_KEYS } from '../src/app/playtest-report.js';
import { definition, list as listIn } from './sql.mjs';

const def = definition('submit_playtest'), sql = def.text;
const list = (name) => listIn(def, name);
const allowed = list('allowed');
const phases = list('phases');
const devices = list('devices');
const maxOf = (k) => Number(sql.match(new RegExp(`'${k}'\\)::numeric, 0\\) not between 0 and (\\d+)`))[1]);

// a full report: every key is allowed, every value in range
const full = playtestReport({
  finished: true, secs: { intro: 61.4, run: 700.2, questions: 90, reveal: 120 }, away: 35.6,
  presses: 18, voided: 1, seated: true, userAgent: 'Mozilla/5.0 (X11; Linux x86_64; Quest 3) OculusBrowser/152'
}, { next: 8, boring: 1, guessed: 0, trouble: 0, psych: 1 });
for (const k of Object.keys(full)) assert.ok(allowed.includes(k), `server does not accept field ${k}`);
for (const k of Object.keys(full.secs)) assert.ok(phases.includes(k), `server does not accept phase ${k}`);
assert.ok(devices.includes(full.device), `server does not accept device ${full.device}`);
for (const k of ['away', 'presses', 'voided', ...PLAYTEST_KEYS]) {
  assert.ok(full[k] >= 0 && full[k] <= maxOf(k), `${k} = ${full[k]} outside server range 0–${maxOf(k)}`);
}
assert.equal(full.device, 'quest3');
assert.equal(full.secs.intro, 61);

// out-of-range input is clamped, not sent as is
const wild = playtestReport({ secs: { run: 99999 }, away: -3, presses: 5000 }, { next: 42, boring: 9 });
assert.equal(wild.secs.run, 7200);
assert.equal(wild.away, 0);
assert.equal(wild.presses, 1000);
assert.equal(wild.next, 10);
assert.equal(wild.boring, 4);
assert.equal(wild.finished, false);

// every device the game can name is one the server accepts
for (const ua of ['Quest 3S', 'Quest 3', 'Quest Pro', 'Quest 2', 'Oculus Quest', 'Android Mobile', 'Windows NT 10.0']) {
  assert.ok(devices.includes(deviceOf(ua)), `device ${deviceOf(ua)} for "${ua}" not accepted`);
}
assert.equal(deviceOf('Windows NT 10.0; Win64'), 'desktop');

console.log('playtest tests: ok');
