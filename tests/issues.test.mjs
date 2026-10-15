// Error reports must be exactly what the server accepts (the newest public.submit_issue in
// supabase/migrations): fields, kinds, devices, states, lengths.
import assert from 'node:assert/strict';
import { issueReport } from '../src/app/issue-report.js';
import { definition, list as listIn } from './sql.mjs';

const def = definition('submit_issue'), sql = def.text;
const list = (name) => listIn(def, name);
const ua = 'Mozilla/5.0 (X11; Linux x86_64; Quest 3) AppleWebKit/537.36 OculusBrowser/152.1.0 Chrome/152.0 VR Safari/537.36';

const r = issueReport({ kind: 'error', message: 'x'.repeat(500), file: 'https://youaretheobject.com/src/rooms/01-control/trials.js?v=2', line: 57.4 },
  { state: 'run', xr: true, userAgent: ua });
for (const k of Object.keys(r)) assert.ok(list('allowed').includes(k), `server does not accept field ${k}`);
assert.ok(list('kinds').includes(r.kind));
assert.ok(list('devices').includes(r.device));
assert.ok(list('states').includes(r.state));
assert.equal(r.message.length, 200);
assert.equal(r.file, 'trials.js');
assert.equal(r.line, 57);
assert.equal(r.browser, 'OculusBrowser/152.1.0');
assert.equal(r.xr, 'vr');
assert.ok(Buffer.byteLength(JSON.stringify(r)) < 1024);
// an unknown state is left out, not sent
assert.equal(issueReport({ kind: 'rejection', message: 'm' }, { state: 'weird', userAgent: '' }).state, undefined);
console.log('issues tests: ok');
