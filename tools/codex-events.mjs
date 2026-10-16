// Translate documented Codex events into the existing local review/owner journals.
// Completion is not approval: findings still need fixes and owner acceptance stays separate.
// Spec: https://learn.chatgpt.com/docs/hooks . Never parse a Codex transcript as Claude JSONL.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { withoutGitVars } from './secrets.mjs';
import { ownText, ownerRoot } from './owner-links.mjs';
import { scan, roomScan, entries, write, named, endsWithBlock, checkedRooms,
  REVIEWER, REPORT_END, PAPER_REVIEWER, PAPER_END } from './review-gate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTES = path.join(os.homedir(), 'Documents', 'objekt-files', 'notes');
const canonical = (p) => fs.realpathSync(p);
const same = (a, b) => ownerRoot(a) === ownerRoot(b);
const id = (v) => {
  if (typeof v !== 'string' || !/^[\w-]{1,160}$/.test(v)) throw Error('Missing or invalid Codex event id');
  return v;
};
const read = (p) => {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return ''; throw e; }
};
const gitRoot = (cwd, root) => canonical(execFileSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, 'rev-parse', '--show-toplevel'], {
  cwd, env: withoutGitVars(), encoding: 'utf8', windowsHide: true,
  timeout: 5000, stdio: ['ignore', 'pipe', 'pipe']
}).trim());

// Paths are injectable only through an import for isolated tests, never through CLI flags.
export function handleEvent(event, { root = ROOT, notes = NOTES } = {}) {
  const kind = event?.hook_event_name;
  if (!['UserPromptSubmit', 'SubagentStart', 'SubagentStop'].includes(kind)) throw Error('Unsupported Codex event');
  root = canonical(root);
  if (typeof event.cwd !== 'string' || !same(gitRoot(event.cwd, root), root)) throw Error('Event belongs to a different checkout');
  const session = id(event.session_id), turn = id(event.turn_id);
  if (kind !== 'UserPromptSubmit' && ![REVIEWER, PAPER_REVIEWER].includes(event.agent_type)) return { status: 'ignored' };

  fs.mkdirSync(notes, { recursive: true });
  // Serialize the tiny journal transaction. A concurrent callback fails visibly and grants nothing.
  // A leftover lock after a crash must be inspected, not silently treated as successful recording.
  const lock = path.join(notes, 'codex-events.lock');
  const fd = fs.openSync(lock, 'wx');
  try {
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, root, session, turn }));
    if (kind === 'UserPromptSubmit') {
      if (typeof event.prompt !== 'string') throw Error('Missing user prompt');
      // Do not unwrap machine notices or attachments into a human acceptance.
      const prompt = event.prompt.replace(/\r\n?/g, '\n');
      const own = /^\s*</.test(prompt) ? '' : ownText(prompt);
      if (!own) return { status: 'ignored' };
      const log = path.join(notes, 'owner-messages.md');
      const key = `codex:${ownerRoot(root)}:${session}:${turn}`;
      if (read(log).split('\n').some((line) => /^## \S+ /.test(line) && line.endsWith(` ${key}`))) return { status: 'duplicate' };
      fs.appendFileSync(log, `\n## ${new Date().toISOString()} ${key}\n${own.replace(/^## /gm, ' ## ')}\n`);
      return { status: 'owner-message-recorded' };
    }

    const agent = `codex:${session}:${id(event.agent_id)}`;
    const record = path.join(notes, 'practice-reviews.jsonl');
    // Fail visibly on a damaged journal; the older reader intentionally tolerates bad lines.
    for (const line of read(record).split('\n').filter(Boolean)) JSON.parse(line);
    const history = entries(record).filter((e) => e.source === 'codex' && e.agent === agent && e.root && same(e.root, root));
    const paper = event.agent_type === PAPER_REVIEWER;
    const common = { source: 'codex', agent, session, turn, agent_type: event.agent_type, root };
    const add = (data) => write({ ...common, ...data }, record);
    const startKind = paper ? 'paper-start' : 'start';
    if (kind === 'SubagentStart') {
      if (history.length) return { status: 'duplicate' };
      const snapshot = paper ? { rooms: Object.fromEntries(Object.entries(roomScan(root)).map(([r, s]) => [r, s.print])) } : scan(root);
      if (paper ? !Object.keys(snapshot.rooms).length : !Object.keys(snapshot.files).length) throw Error('Nothing to review in this checkout');
      add({ kind: startKind, ...snapshot });
      return { status: 'review-start-recorded' };
    }
    // A changed callback cannot overwrite an earlier terminal result for the same agent.
    if (history.some((e) => !['start', 'paper-start'].includes(e.kind))) return { status: 'duplicate' };
    const start = history.find((e) => e.kind === startKind && e.agent_type === event.agent_type);
    const report = typeof event.last_assistant_message === 'string' ? event.last_assistant_message.trim() : '';
    const voidRun = (why) => { add({ kind: 'void', why }); return { status: 'review-not-recorded', why }; };
    if (!start) return voidRun('No matching start in this session and checkout');
    if (!report || report.length > 250000 || !endsWithBlock(report, paper ? PAPER_END : REPORT_END)) return voidRun('Incomplete final report');
    if (!report.slice(0, report.lastIndexOf(paper ? PAPER_END : REPORT_END)).trim()) return voidRun('Report contains only its completion marker');
    const evidence = { report, report_sha256: crypto.createHash('sha256').update(report).digest('hex'), named: named(report) };
    if (paper) {
      const listed = [...new Set(checkedRooms(report))], rooms = roomScan(root);
      if (!listed.length || listed.some((r) => !rooms[r] || !start.rooms?.[r])) return voidRun('Report lists no known reviewed rooms');
      if (listed.some((r) => rooms[r].print !== start.rooms[r])) return voidRun('A reviewed room changed during the review');
      for (const room of listed) add({ kind: 'paper', room, ...rooms[room], ...evidence });
    } else {
      const now = scan(root);
      if (now.print !== start.print) return voidRun('Served files changed during the review');
      add({ kind: 'review', ...now, ...evidence });
    }
    return { status: 'completed-review-recorded' };
  } finally {
    fs.closeSync(fd);
    fs.unlinkSync(lock);
  }
}

export function status({ root = ROOT, notes = NOTES } = {}) {
  root = canonical(root);
  const key = `codex:${ownerRoot(root)}:`;
  const owner = read(path.join(notes, 'owner-messages.md')).split('\n').filter((l) => /^## \S+ /.test(l) && l.includes(` ${key}`));
  const reviews = entries(path.join(notes, 'practice-reviews.jsonl')).filter((e) => e.source === 'codex' && e.root && same(e.root, root));
  return { root, hooks_file_present: fs.existsSync(path.join(root, '.codex', 'hooks.json')),
    owner_events_recorded: owner.length, review_starts_recorded: reviews.filter((e) => ['start', 'paper-start'].includes(e.kind)).length,
    completed_review_records: reviews.filter((e) => ['review', 'paper'].includes(e.kind)).length,
    rejected_review_records: reviews.filter((e) => e.kind === 'void').length,
    journal_lock_present: fs.existsSync(path.join(notes, 'codex-events.lock')),
    runtime_hook_trust: 'not established by this command' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv[2] === '--status') console.log(JSON.stringify(status(), null, 2));
    else {
      if (process.argv.length > 2) throw Error('Only --status is supported');
      let input = '';
      for await (const chunk of process.stdin) {
        input += chunk;
        if (input.length > 4000000) throw Error('Codex event too large');
      }
      const result = handleEvent(JSON.parse(input));
      console.log(JSON.stringify(result.status === 'review-not-recorded'
        ? { systemMessage: `Review not recorded: ${result.why}. Existing release gates remain in force.` } : {}));
    }
  } catch (error) {
    // No automatic continuation loop and no exit 2, which would retry a stopped subagent.
    console.error(`Codex event was not recorded: ${error.message}`);
    process.exitCode = 1;
  }
}
