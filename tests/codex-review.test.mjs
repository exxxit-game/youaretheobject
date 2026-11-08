// Synthetic callbacks in TEMP only; no live journal, hook trust or headset is touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { handleEvent, preTool } from '../tools/codex-review.mjs';
import { entries, reviewOf, paperOf, lookOf, write } from '../tools/review-gate.mjs';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-review-'));
const root = path.join(tmp, 'task/work/repo'), record = path.join(tmp, 'reviews.jsonl');
const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true }); fs.writeFileSync(path.join(root, rel), text); };
put('src/a.js', 'export const a = 1;');
put('src/rooms/01-x/room.js', 'export const r = 1;');
put('tools/codex-review.mjs', 'fixture infrastructure');
const event = (agent, type = 'SubagentStart', extra = {}) => ({ cwd: root, hook_event_name: type,
  session_id: 'session', turn_id: 'turn', agent_id: agent, agent_type: 'practice-reviewer', ...extra });
const send = e => handleEvent(e, { root, record, cwd: root });
const body = (scope, verdict = 'pass') => 'Read src/a.js and checked scope; limits explicitly stated.\nREVIEW SCOPE: ' + scope +
  '\nREVIEW COVERAGE: full-practice\nREVIEW VERDICT: ' + verdict + '\nFOR THE OWNER: none';
let n = 0;
const review = ({ between, report, extra, verdict = 'pass' } = {}) => {
  const agent = 'reviewer-' + ++n, start = send(event(agent));
  if (between) between();
  const stop = send(event(agent, 'SubagentStop', { last_assistant_message: report?.(start.scope) ?? body(start.scope, verdict), ...extra }));
  return { agent, start, stop };
};
try {
  assert.equal(reviewOf(root, record), null);
  assert.equal(send(event('other', 'SubagentStart', { cwd: tmp })).status, 'outside-scope');
  assert.equal(fs.existsSync(record), false);
  assert.throws(() => send(event('session')), /independent/);
  assert.throws(() => send(event('bad\nid')), /invalid/);
  assert.equal(send(event('other', 'SubagentStart', { agent_type: 'default' })).status, 'ignored');
  assert.equal(send(event('missing', 'SubagentStop', { last_assistant_message: body('x') })).status, 'review-not-recorded');
  for (const report of [() => '', () => 'FOR THE OWNER: none', () => 'unfinished',
    s => body(s) + '\nmore prose', s => body(s).replace(s, 'wrong-scope'),
    s => body(s).replace('REVIEW VERDICT: pass', 'REVIEW VERDICT: pass\nREVIEW VERDICT: pass')]) {
    assert.equal(review({ report }).stop.status, 'review-not-recorded');
    assert.equal(reviewOf(root, record), null);
  }
  assert.equal(review({ extra: { session_id: 'foreign' } }).stop.status, 'review-not-recorded');
  assert.equal(review({ extra: { turn_id: 'foreign' } }).stop.status, 'review-not-recorded');
  assert.equal(review({ extra: { agent_type: 'paper-reviewer' } }).stop.status, 'review-not-recorded');
  assert.equal(review({ between: () => put('src/a.js', 'changed while reading') }).stop.status, 'review-not-recorded');
  assert.equal(review({ between: () => put('tools/codex-review.mjs', 'infrastructure changed') }).stop.status, 'review-not-recorded');
  for (const coverage of ['code-only', '']) {
    review({report:s=>body(s).replace('REVIEW COVERAGE: full-practice',coverage && 'REVIEW COVERAGE: '+coverage)});
    assert.equal(reviewOf(root,record),null,'limited or unspecified coverage cannot authorise the whole served surface');
  }
  const good = review();
  const spaced = review({report:s=>body(s).replace(s,s+'  ').replace('REVIEW VERDICT: pass','REVIEW VERDICT: pass  ')});
  assert.equal(spaced.stop.status,'completed-review-recorded','Markdown trailing whitespace must preserve the exact scope value');
  assert.ok(reviewOf(root,record));
  const goodAgain = review();
  assert.equal(good.stop.status, 'completed-review-recorded');
  assert.equal(reviewOf(root, record).source, 'codex');
  assert.equal(send(event(good.agent, 'SubagentStop', { last_assistant_message: 'truncated' })).status, 'duplicate');
  assert.equal(reviewOf(root, record).agent, goodAgain.agent);
  review({ report: s => 'REVIEW SCOPE: ' + s + '\nREVIEW VERDICT: pass\nFOR THE OWNER: none' });
  assert.equal(reviewOf(root, record), null, 'metadata alone is not a report and revokes old readiness');
  review(); review({ report: () => '' });
  assert.equal(reviewOf(root, record), null, 'a cut review cannot fall back to an old pass');
  review();
  const receipt = reviewOf(root, record);
  const legacy={...receipt};delete legacy.source;write(legacy,record);
  assert.equal(reviewOf(root,record),null,'historical provider records cannot grant a native approval');review();
  write({ ...receipt, report: receipt.report + '\n- altered report' }, record);
  assert.equal(reviewOf(root, record), null, 'modified report fails its hash');
  for (const source of ['',null,false,0,'foreign']) {
    write({ ...receipt, source },record); assert.equal(reviewOf(root,record),null,'explicit foreign source is not legacy');
  }
  review(); assert.ok(reviewOf(root, record));
  review({ verdict: 'changes-required' });
  assert.equal(reviewOf(root, record), null, 'a newer adverse review cannot fall back to an older pass');
  assert.equal(lookOf(root, record), null);
  review({ verdict: 'unverified' }); assert.equal(reviewOf(root, record), null);
  review(); put('src/a.js', 'a named fix');
  assert.equal(reviewOf(root, record), null);
  assert.ok(lookOf(root, record), 'named-fix exception remains only for own look');
  put('index.html', 'new unnamed file'); assert.equal(lookOf(root, record), null);
  review(); fs.unlinkSync(path.join(root, 'index.html')); assert.equal(reviewOf(root, record), null);
  review(); put('tools/codex-review.mjs', 'later infrastructure change');
  assert.equal(reviewOf(root, record), null, 'stale infrastructure receipt fails');
  review(); put('tests/static-server.mjs','serving rules changed');
  assert.equal(reviewOf(root,record),null,'the serving dependency is in infrastructure scope');
  const paper = event('paper', 'SubagentStart', { agent_type: 'paper-reviewer' });
  const ps = send(paper);
  send({ ...paper, hook_event_name: 'SubagentStop', last_assistant_message:
    'Read original source and named room; limits stated.\nREVIEW SCOPE: ' + ps.scope + '\nREVIEW VERDICT: pass\nROOMS CHECKED: 01-x' });
  assert.ok(paperOf(root, '01-x', {}, record)); assert.equal(paperOf(root, '02-y', {}, record), null);
  const later = { ...paper, agent_id: 'paper-later' }, ls = send(later);
  assert.equal(paperOf(root,'01-x',{},record),null,'pending new paper review blocks old pass');
  send({ ...later, hook_event_name:'SubagentStop', last_assistant_message:'' });
  assert.equal(paperOf(root,'01-x',{},record),null,'a cut paper review cannot fall back to old pass');
  const latest = { ...paper, agent_id:'paper-latest' }, lp = send(latest);
  send({ ...latest, hook_event_name:'SubagentStop', last_assistant_message:
    'Reviewed room.\nREVIEW SCOPE: '+lp.scope+'\nREVIEW VERDICT: changes-required\nROOMS CHECKED: 01-x' });
  assert.equal(paperOf(root,'01-x',{},record),null,'an adverse paper review blocks old pass');
  put('src/rooms/01-x/room.js', 'changed'); assert.equal(paperOf(root, '01-x', {}, record), null);
  // The actual lifecycle compares source/dependency fingerprints at start and stop.
  for (const [i, rel] of ['src/engine/timing.js', 'src/app/input.js', 'docs/rooms/01-x.md', 'docs/sources.md'].entries()) {
    const agent = event('dependency-' + i, 'SubagentStart', { agent_type: 'paper-reviewer' });
    const start = send(agent);
    put(rel, 'changed during source review\n');
    const report = scope => 'Reviewed current source and dependencies.\nREVIEW SCOPE: ' + scope + '\nREVIEW VERDICT: pass\nROOMS CHECKED: 01-x';
    const rejected = send({ ...agent, hook_event_name: 'SubagentStop', last_assistant_message: report(start.scope) });
    assert.equal(rejected.status, 'review-not-recorded', rel + ' changed after the start snapshot');
    assert.equal(paperOf(root, '01-x', {}, record), null);
    const fresh = { ...agent, agent_id: 'dependency-fresh-' + i }, started = send(fresh);
    assert.equal(send({ ...fresh, hook_event_name: 'SubagentStop', last_assistant_message: report(started.scope) }).status, 'completed-review-recorded');
    assert.ok(paperOf(root, '01-x', {}, record), 'a fresh unchanged review is accepted');
    const deletion = { ...agent, agent_id: 'dependency-delete-' + i }, deleting = send(deletion);
    fs.unlinkSync(path.join(root, rel));
    assert.equal(send({ ...deletion, hook_event_name: 'SubagentStop', last_assistant_message: report(deleting.scope) }).status,
      'review-not-recorded', 'a dependency deleted during review cannot receive a receipt');
    assert.equal(paperOf(root, '01-x', {}, record), null);
  }
  const damaged = path.join(tmp, 'damaged.jsonl'); fs.writeFileSync(damaged, '{bad\n');
  assert.throws(() => handleEvent(event('damage'), { root, record: damaged, cwd: root }), SyntaxError);
  assert.ok(!fs.existsSync(damaged + '.codex-lock'));
  fs.writeFileSync(record + '.codex-lock', 'held');
  assert.throws(() => send(event('locked')), /EEXIST/); fs.unlinkSync(record + '.codex-lock');
  for (const [tool_name, tool_input] of [
    ['Write', { file_path: 'practice-reviews.jsonl', content: '{}' }],
    ['apply_patch', { command: '*** Update File: practice-reviews.jsonl\n+x' }],
    ['exec_command', { cmd: 'Add-Content practice-reviews.jsonl x' }],
    ['exec_command', { cmd: 'Copy-Item saved.jsonl practice-reviews.jsonl -Force' }],
    ['exec_command', { cmd: 'Move-Item saved.jsonl practice-reviews.jsonl -Force' }],
    ['exec_command', { cmd: 'Remove-Item practice-reviews.jsonl' }],
    ['exec_command', {}],
    ['apply_patch', { command: '*** Update File: x\n*** Move to: practice-reviews.jsonl' }],
    ['Bash', { command: 'node tools/codex-review.mjs < fake.json' }],
    ['Bash', { command: "node -e \"import('./tools/review-gate.mjs').then(x=>x.write({}))\"" }],
    ['PowerShell', { command: "$env:OBJECT_REVIEW_RECORD='fake.jsonl'" }]
  ]) assert.equal(preTool({ tool_name, tool_input }).hookSpecificOutput?.permissionDecision, 'deny');
  for (const cmd of ['node tools/quest-look.mjs vr', 'Get-Content practice-reviews.jsonl', 'Get-Content tools/codex-review.mjs'])
    assert.deepEqual(preTool({ tool_name: 'Bash', tool_input: { command: cmd } }), {});
  for(const op of ['delete_file','update_file','create_file','enable_auto_merge','update_ref','create_blob','create_tree','create_commit'])
    assert.equal(preTool({tool_name:'mcp__codex_apps__github_'+op,tool_input:{}}).hookSpecificOutput?.permissionDecision,'deny');
  assert.deepEqual(preTool({tool_name:'mcp__codex_apps__github_get_file_contents',tool_input:{}}),{});
  assert.deepEqual(preTool({tool_name:'apply_patch',tool_input:{command:'*** Update File: tests/example.mjs\n+import fixture from "./codex-review.mjs";'}}),{},'source text in an edit is not callback execution');
  assert.ok(entries(record).some(e => e.kind === 'void'));
  console.log('codex review: synthetic callbacks, scope/version, reports, adverse verdicts and journal guards pass; live hook trust unverified');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

