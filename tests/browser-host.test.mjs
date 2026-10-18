import assert from 'node:assert/strict';
import { assertBrowserHost } from './browser-host.mjs';
import fs from 'node:fs';

for (const env of [{}, { CI: 'true' }, { GITHUB_ACTIONS: 'true' },
  { GITHUB_ACTIONS: 'true', RUNNER_ENVIRONMENT: 'self-hosted' }]) {
  assert.throws(() => assertBrowserHost(env, 'linux'), /Keep this laptop free/);
}
const hosted = { GITHUB_ACTIONS: 'true', RUNNER_ENVIRONMENT: 'github-hosted' };
assert.throws(() => assertBrowserHost(hosted, 'win32'));
assert.doesNotThrow(() => assertBrowserHost(hosted, 'linux'));
for (const file of ['smoke.mjs', 'lines-smoke.mjs']) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const guard = source.indexOf('assertBrowserHost();');
  assert.ok(guard >= 0 && guard < source.indexOf('chromium.launch('), `${file}: protect before browser launch`);
}
console.log('browser-host: local, generic CI and self-hosted rejected; hosted Linux allowed (no browser launched)');
