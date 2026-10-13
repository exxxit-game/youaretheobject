// What the game sends must be exactly what the server accepts (the newest supabase/migrations): room
// 01's report against its JSON Schema, the call's parameters against each function's, and the consent
// version against the consent's words. A mismatch would silently lose every player's result.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { analyse } from '../src/rooms/01-control/report.js';
import { T } from '../src/rooms/01-control/texts.ru.js';
import { APP_T } from '../src/app/texts.ru.js';
import { definition, params, roomSchema, check, consentVersions, code } from './sql.mjs';

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const ROOM_VERSION = Number(read('../src/rooms/01-control/room.js').match(/const ROOM_VERSION = (\d+);/)[1]);
const CONSENT_VERSION = Number(read('../src/app/consent.js').match(/export const CONSENT_VERSION = (\d+);/)[1]);

// the schema in the repo is the one the server loads (the codebook's machine half: one file per room version)
const schema = JSON.parse(read(`../supabase/schemas/01-control-${ROOM_VERSION}.json`));
assert.deepEqual(roomSchema('01-control', ROOM_VERSION).schema, schema, `the server loads another schema for room 01 version ${ROOM_VERSION} than supabase/schemas holds`);

// a full run: every trial kind, every answer at its largest value
const log = [
  ...Array.from({ length: 40 }, (_, i) => ({ t: i, k: 'trial', v: { n: i + 1, press: i % 2 === 0, green: i % 4 !== 0, rt: 0.5 } })),
  { t: 50, k: 'void', v: 3 }, { t: 51, k: 'stray' }
];
const Q = T.questions;
const maxAnswer = { control: 100, total: 100, ifPress: 100, ifNoPress: 100, certainty: 100,
  evidence: Q.evidence.answers.length - 1, hypotheses: Q.hypotheses.answers.length - 1,
  gender: Q.gender.answers.length - 1, age: Q.age.answers.length - 1, knew: Q.knew.answers.length - 1 };
for (const [key, value] of Object.entries(maxAnswer)) log.push({ t: 60, k: 'answer', v: { key, value, pos: 0 } });

// exactly what room.js sends: { condition, ...analyse(log), seated, speed }
const report = { condition: '75-75', ...analyse(log), seated: true, speed: 1 };
assert.deepEqual(check(schema, report), [], 'the server would refuse room 01\'s report');
// every question the room asks has a server limit, and the limit is the question's last answer
for (const [key, max] of Object.entries(maxAnswer)) assert.equal(schema.properties.answers.properties[key]?.maximum, max, `the server's limit for ${key}`);
assert.ok(Buffer.byteLength(JSON.stringify(report)) < 2048, 'report over 2 KB');
// and it refuses what it must: a test run, an unknown field, an answer past its last choice
assert.notDeepEqual(check(schema, { ...report, speed: 20 }), [], 'a test run (?speed) would be stored');
assert.notDeepEqual(check(schema, { ...report, name: 'x' }), [], 'an unknown field would be stored');
assert.notDeepEqual(check(schema, { ...report, answers: { ...report.answers, age: maxAnswer.age + 1 } }), [], 'an answer out of range would be stored');

// each call sends exactly the parameters its function takes
const client = read('../src/engine/results.js');
for (const [fn, send] of [['submit_run', 'sendResult'], ['submit_playtest', 'sendPlaytest'], ['submit_issue', 'sendIssue']]) {
  const body = client.match(new RegExp(`export function ${send}\\([^)]*\\) \\{[^}]*\\{([^}]*)\\}`))[1];
  const sent = [...body.matchAll(/\b(p_\w+):/g)].map((m) => m[1]);
  assert.deepEqual(sent.sort(), params(definition(fn)).sort(), `${send} sends other parameters than public.${fn} takes`);
}

// the consent version names the words the player agreed to: change the words, raise the version
const WORDS = { 1: 'e6addd86020ed78894ea848b90f8f399687d43f14db03212b917d786006d5bd1' };
const words = crypto.createHash('sha256').update(JSON.stringify([APP_T.consent, APP_T.playtest.consent])).digest('hex');
assert.equal(words, WORDS[CONSENT_VERSION], `the consent's words changed (${words}): raise CONSENT_VERSION in src/app/consent.js and add its words here`);
// and the server knows that version: a row naming an unknown one is refused (0010_consent_versions_compare_gate.sql)
assert.ok(consentVersions().has(CONSENT_VERSION), `the server knows no consent version ${CONSENT_VERSION}: add its row to app.consent_versions in a migration`);

// the doors (0011, the owner's word of 13.10): every table of app says its deny as a rejection policy, so
// a table added later without one fails here; and the fingerprint's key is replaced every day
const migrations = fs.readdirSync(new URL('../supabase/migrations/', import.meta.url)).filter((f) => f.endsWith('.sql')).sort()
  .map((f) => read(`../supabase/migrations/${f}`)).join('\n');
for (const [, t] of migrations.matchAll(/create table app\.(\w+)/g)) {
  assert.match(migrations, new RegExp(`create policy \\w+ on app\\.${t} for select using \\(false\\);`), `app.${t} has no rejection policy: add one in the migration that creates it`);
}
// the question for the average has its own cap before it reads a row, so it cannot be asked without end
// (read in its SQL, not its comments or strings: CodeRabbit on pull request 10)
const compare = definition('compare_room').text, compareSql = code(compare);
assert.match(compareSql, /\bvolatile\b/i, 'compare_room is not volatile: its cap cannot write app.recent');
const cap = /\bperform\s+app\.allow\(\s*'/i.exec(compareSql), runsRead = /\bfrom\s+app\.runs\b/i.exec(compareSql);
assert.ok(cap && compare.startsWith("'compare'", cap.index + cap[0].length - 1), 'compare_room has no cap of its own (app.allow with kind compare)');
assert.ok(runsRead && cap.index < runsRead.index, 'compare_room reads app.runs before its cap');
assert.match(migrations, /cron\.schedule\('new-limit-key', '0 0 \* \* \*',\s*\$job\$update app\.limit_key set key = extensions\.gen_random_bytes\(32\)\$job\$\)/, 'the daily job that replaces the fingerprint key is gone');

console.log('results tests: ok');
