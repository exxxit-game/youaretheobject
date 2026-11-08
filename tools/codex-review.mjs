// Native Codex hook adapter, adapted from the earlier codex-trial-migration implementation.
// https://learn.chatgpt.com/docs/hooks . Only real callbacks may write the live journal.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RECORD, scan, roomScan, reviewScope, entries, write, named, endsWithBlock,
  checkedRooms, REVIEWER, REPORT_END, PAPER_REVIEWER, PAPER_END } from './review-gate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const canonical = p => process.platform === 'win32' ? fs.realpathSync.native(p).toLowerCase() : fs.realpathSync.native(p);
const same = (a, b) => canonical(a) === canonical(b);
const context = root => path.basename(path.dirname(root)) === 'work' ? path.resolve(root, '../..') : root;
const id = value => typeof value === 'string' && /^[\w-]{1,160}$/.test(value);
export const inScope = (event, root = ROOT, cwd = process.cwd()) => {
  try { return [root, context(root)].some(p => same(p, cwd) && same(p, event.cwd)); } catch { return false; }
};
export function preTool(event) {
  const input = event.tool_input || {}, name = event.tool_name;
  const text = ['Bash','PowerShell','exec_command'].includes(name) ? JSON.stringify(input) : '';
  const deny = reason => ({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } });
  const policy = JSON.parse(fs.readFileSync(path.join(ROOT,'policy/settings.json'),'utf8'));
  if (!Array.isArray(policy.permissions?.deny)) return deny('Project deny policy is unavailable.');
  const names = [name, String(name).replace(/^mcp__codex_apps__github_/,'mcp__github__')
    .replace(/__(?:update_file|create_file)$/,'__create_or_update_file').replace(/__enable_auto_merge$/,'__merge_pull_request')];
  for (const pattern of policy.permissions.deny) {
    const re = new RegExp('^' + pattern.split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*') + '$');
    if (names.some(n=>re.test(n))) return deny('Project policy denies this tool.');
  }
  if (typeof name !== 'string' || !input || typeof input !== 'object' ||
      (['Bash','PowerShell','exec_command'].includes(name) && typeof (input.command ?? input.cmd) !== 'string')) return deny('Invalid tool input.');
  if (/(?:node(?:\.exe)?|import|require).{0,200}codex-review\.mjs/i.test(text) || /project-guard.{0,100}subagent-(start|stop)/i.test(text))
    return deny('Reviewer callbacks cannot be invoked as an assistant tool.');
  const calls = name === 'apply_patch'
    ? [...String(input.command || '').matchAll(/^\*\*\* (?:(?:Add|Update|Delete) File|Move to): (.+)$/gm)].map(m => ['Write', { file_path: m[1] }])
    : ['Bash','PowerShell','exec_command'].includes(name)
      ? ['Bash','PowerShell'].map(shell => [shell, { command: input.command ?? input.cmd }]) : [[name,input]];
  if (!calls.length) return deny('Cannot inspect edit targets.');
  for (const [tool_name, tool_input] of calls) {
    const result = spawnSync(process.execPath, [path.join(ROOT,'tools/project-guard.mjs'),'pre'], {
      cwd: ROOT, input: JSON.stringify({ cwd: ROOT, tool_name, tool_input }), encoding:'utf8', timeout:10000, windowsHide:true });
    if (result.status !== 0) return deny(result.stderr?.trim() || 'Existing project guard could not validate the tool.');
  }
  return {};
}
export function handleEvent(event, { root = ROOT, cwd = process.cwd(), record = RECORD } = {}) {
  if (!inScope(event, root, cwd)) return { status: 'outside-scope' };
  if (event.hook_event_name === 'PreToolUse') return preTool(event);
  if (!['SubagentStart', 'SubagentStop'].includes(event.hook_event_name)) return { status: 'ignored' };
  if (![REVIEWER, PAPER_REVIEWER].includes(event.agent_type)) return { status: 'ignored' };
  for (const key of ['session_id', 'agent_id', 'turn_id']) if (!id(event[key])) throw Error('Missing or invalid ' + key);
  if (event.agent_id === event.session_id) throw Error('The author is not an independent reviewer');
  root = fs.realpathSync.native(root);
  fs.mkdirSync(path.dirname(record), { recursive: true });
  const lock = record + '.codex-lock', fd = fs.openSync(lock, 'wx');
  try {
    const text = fs.existsSync(record) ? fs.readFileSync(record, 'utf8') : '';
    for (const line of text.split('\n').filter(Boolean)) JSON.parse(line);
    const run = [event.session_id, event.turn_id, event.agent_id].join(':');
    const history = entries(record).filter(e => e.source === 'codex' && e.run === run && e.root === root);
    const paper = event.agent_type === PAPER_REVIEWER, startKind = paper ? 'paper-start' : 'start';
    const common = { source: 'codex', run, root, session: event.session_id, turn: event.turn_id,
      agent: event.agent_id, agent_type: event.agent_type };
    const add = data => write({ ...common, ...data }, record);
    if (event.hook_event_name === 'SubagentStart') {
      if (history.length) return { status: 'duplicate' };
      const scope = reviewScope(root);
      const snapshot = paper ? { rooms: Object.fromEntries(Object.entries(roomScan(root)).map(([r,s]) => [r,s.print])) } : scan(root);
      if (paper ? !Object.keys(snapshot.rooms).length : !Object.keys(snapshot.files).length) throw Error('Nothing to review');
      add({ kind: startKind, scope, ...snapshot });
      return { status: 'review-start-recorded', scope };
    }
    if (history.some(e => !['start', 'paper-start'].includes(e.kind))) return { status: 'duplicate' };
    const start = history.find(e => e.kind === startKind && e.agent_type === event.agent_type);
    const voidRun = why => { add({ kind: 'void', why, ...scan(root),
      rooms: Object.fromEntries(Object.entries(roomScan(root)).map(([r,s]) => [r,s.print])) });
      return { status: 'review-not-recorded', why }; };
    if (!start) return voidRun('No matching start in this session, turn, role and checkout');
    const report = typeof event.last_assistant_message === 'string' ? event.last_assistant_message.trim() : '';
    const end = paper ? PAPER_END : REPORT_END;
    if (!report || report.length > 250000 || !endsWithBlock(report, end)) return voidRun('Incomplete final report');
    const body = report.slice(0, report.lastIndexOf(end)).trim();
    const scopes = [...body.matchAll(/^REVIEW SCOPE: ([a-f0-9]{64})\s*$/gm)];
    if (!body.replace(/^REVIEW (SCOPE|VERDICT):.*$/gm,'').trim() || scopes.length !== 1 || scopes[0][1] !== start.scope)
      return voidRun('Missing review body or exact scope');
    const verdicts = [...body.matchAll(/^REVIEW VERDICT: (pass|changes-required|unverified)\s*$/gm)];
    if (verdicts.length !== 1) return voidRun('Missing or ambiguous verdict');
    if (reviewScope(root) !== start.scope) return voidRun('Review infrastructure changed during the review');
    const evidence = { report, report_sha256: crypto.createHash('sha256').update(report).digest('hex'),
      verdict: verdicts[0][1], scope: start.scope, named: named(report) };
    if (paper) {
      const rooms = roomScan(root), listed = [...new Set(checkedRooms(report))];
      if (!listed.length || listed.some(r => !rooms[r] || !start.rooms[r])) return voidRun('Unknown or absent reviewed room');
      if (listed.some(r => rooms[r].print !== start.rooms[r])) return voidRun('Room changed during the review');
      for (const room of listed) add({ kind: 'paper', room, ...rooms[room], ...evidence });
    } else {
      const now = scan(root);
      if (now.print !== start.print) return voidRun('Served files changed during the review');
      add({ kind: 'review', ...now, ...evidence });
    }
    return { status: 'completed-review-recorded', verdict: evidence.verdict };
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 2 || process.env.OBJECT_REVIEW_RECORD) throw Error('No CLI overrides supported');
    let input = '';
    for await (const chunk of process.stdin) { input += chunk; if (input.length > 4000000) throw Error('Event too large'); }
    const event = JSON.parse(input), result = handleEvent(event);
    const start = result.status === 'review-start-recorded' ? {
      hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext:
        'Read ' + path.join(ROOT, 'policy/agents', event.agent_type + '.md') + '. Report your full review and limits. Include REVIEW SCOPE: ' +
        result.scope + ' and one REVIEW VERDICT: pass, changes-required or unverified before the required final block. For practice review also state REVIEW COVERAGE: code-only or full-practice. Use full-practice only after walking through the whole served surface; limited code review never authorises it. Completion is not owner acceptance.' }
    } : result.status === 'review-not-recorded' ? { systemMessage: 'Review not recorded: ' + result.why } : {};
    console.log(JSON.stringify(event.hook_event_name === 'PreToolUse' ? result : start));
  } catch (error) { console.log(JSON.stringify({ hookSpecificOutput: { hookEventName:'PreToolUse', permissionDecision:'deny', permissionDecisionReason:error.message } })); }
}

