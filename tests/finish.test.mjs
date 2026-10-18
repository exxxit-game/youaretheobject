import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkMergeReadiness, codeRabbitStatus, codeRabbitRetryCommand } from '../tools/finish.mjs';

const complete = { context: 'CodeRabbit', state: 'success', description: 'Review completed', creator: { login: 'coderabbitai[bot]' } };
const good = { checks: [{ name: 'test', bucket: 'pass' }, { name: 'CodeRabbit', bucket: 'pass' }],
  statuses: [complete], unresolved: 0, draft: false, head: 'current', reviewedHead: 'current' };
const ready = (change = {}) => checkMergeReadiness({ ...good, ...change }).length === 0;
assert.ok(ready(), 'completed review and passing tests can be reported ready');
assert.ok(!ready({ statuses: [] }), 'missing CodeRabbit is not completion');
assert.ok(!ready({ statuses: [{ ...complete, description: 'Review skipped: draft pull request' }] }), 'a green skipped review is not completion');
assert.ok(!ready({ statuses: [{ ...complete, state: 'pending' }, complete] }), 'a new pending review supersedes the old success');
assert.ok(!ready({ statuses: [{ ...complete, state: 'error' }, complete] }), 'a new review error supersedes the old success');
assert.ok(!ready({ statuses: [{ ...complete, description: 'Unrecognized result' }] }), 'unknown results require inspection');
assert.ok(!ready({ statuses: [{ ...complete, creator: { login: 'another-bot' } }] }), 'another author cannot supply the CodeRabbit completion');
assert.equal(codeRabbitStatus([{ ...complete, context: 'NotCodeRabbit' }]), undefined);
assert.ok(!ready({ checks: [] }), 'no checks is not success');
assert.ok(!ready({ checks: [{ name: 'CodeRabbit', bucket: 'pass' }] }), 'the test check must exist');
assert.ok(!ready({ checks: [{ name: 'test', bucket: 'skipping' }] }), 'a skipped test must not pass');
assert.ok(!ready({ checks: [{ name: 'test', bucket: 'fail' }] }), 'failed tests block readiness');
assert.ok(!ready({ checks: [...good.checks, { name: 'another check', bucket: 'pending' }] }));
assert.ok(!ready({ checks: [...good.checks, { name: 'another check', bucket: 'cancel' }] }));
assert.ok(!ready({ unresolved: 1 }), 'unresolved findings block readiness');
assert.ok(!ready({ unresolved: undefined }), 'unknown discussion state blocks readiness');
assert.ok(!ready({ draft: true }), 'a draft stays a draft');
assert.ok(!ready({ reviewedHead: 'another' }), 'a changed PR head requires fresh checks');
assert.ok(!ready({ head: undefined, reviewedHead: undefined }));
// A failed review needs an explicit retry route; pending reviews must not request duplicates.
for (const state of ['error', 'failure']) {
  assert.equal(codeRabbitRetryCommand({ ...complete, state }, 28), 'gh pr comment 28 --body "@coderabbitai review"');
  assert.ok(!ready({ statuses: [{ ...complete, state }] }));
}
for (const status of [undefined, complete, { ...complete, state: 'pending' }]) {
  assert.equal(codeRabbitRetryCommand(status, 28), undefined);
}
// Conflicting modes must stop before Git is invoked; the fixture has no repository or remote.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'finish-mode-'));
try {
  const script = path.join(fixture, 'tools', 'finish.mjs');
  fs.mkdirSync(path.dirname(script));
  fs.copyFileSync(new URL('../tools/finish.mjs', import.meta.url), script);
  const result = spawnSync(process.execPath, [script, 'pulled', '--check'], { encoding: 'utf8', cwd: fixture });
  assert.equal(result.status, 1);
  assert.equal(result.stderr.trim(), 'finish: --check cannot be combined with pulled');
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
console.log('finish readiness tests: ok');
