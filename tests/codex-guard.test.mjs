import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkTool } from '../tools/codex-guard.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-policy-'));
const sibling = root + '-other'; fs.mkdirSync(sibling);
const settings = JSON.parse(fs.readFileSync('.claude/settings.json', 'utf8'));
const event = (tool_name, tool_input) => ({ hook_event_name: 'PreToolUse', cwd: root, tool_name, tool_input });
const check = e => checkTool(e, { root, cwd: root, settings }).hookSpecificOutput?.permissionDecision;
try {
  for (const command of ['git -c core.hooksPath=__objekt_denial_probe__ status --short',
    'git commit --no-verify -m x', 'git push origin main', 'git push origin HEAD:main',
    'git push origin +x:refs/heads/main', 'npx playwright test',
    'gh api graphql -f query="mutation { resolveReviewThread(input:{threadId:x}) {clientMutationId} }"'])
    assert.equal(check(event('Bash', { command })), 'deny', command);
  for (const command of ['git status --short', 'git push origin codex/trial-migration', 'node tests/lines.test.mjs',
    'Get-Content docs/state.md', 'rg "requestAnimationFrame" src/rooms', 'node tools/quest-look.mjs perf'])
    assert.equal(check(event('Bash', { command })), undefined, command);
  assert.equal(check(event('exec_command', { cmd: 'git commit --no-verify -m x' })), 'deny');
  assert.equal(check(event('Bash', {})), 'deny');
  for (const name of ['mcp__codex_apps__github_merge_pull_request', 'mcp__codex_apps__github_enable_auto_merge',
    'mcp__codex_apps__github_update_file', 'mcp__db__apply_migration'])
    assert.equal(check(event(name, {})), 'deny', name);
  assert.equal(check(event('mcp__codex_apps__github_fetch_pr_comments', { pr: 28 })), undefined);
  assert.equal(check(event('apply_patch', { command: '*** Begin Patch\n*** Update File: C:/notes/practice-reviews.jsonl\n*** End Patch' })), 'deny');
  assert.equal(check(event('apply_patch', { command: '*** Begin Patch\n*** Update File: src/app/trial.js\n*** End Patch' })), undefined);
  assert.deepEqual(checkTool({ ...event('Bash', { command: 'git push origin main' }), cwd: sibling }, { root, cwd: root, settings }), {});
  assert.deepEqual(checkTool(event('Bash', { command: 'git push origin main' }), { root, cwd: sibling, settings }), {});
  assert.deepEqual(checkTool({ ...event('Bash', {}), hook_event_name: 'UserPromptSubmit' }, { root, cwd: root, settings }), {});
  console.log('codex guard: real project policy, current tool aliases, safe reads and checkout scope: ok');
} finally {
  fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(sibling, { recursive: true, force: true });
}
