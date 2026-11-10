import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

export const OWNER_LOG = path.join(os.homedir(), 'Documents', 'objekt-files', 'notes', 'owner-messages.md');
const MARK = 'codex-prompt-v1';
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
// Legacy app notices are not the owner's text; native prompts are stored verbatim.
const NOTICE = /^\s*(<(task-notification|system-reminder|agent-message|artifact-view-context|ci-monitor-event|side-sessions-event|cross-session-message|scheduled-task)\b|Background \(from the session that started this one\):)/;
// his own text, or '' for a notice
export function ownText(text) {
  const own = String(text).replace(/^(\s*<system-reminder>[\s\S]*?<\/system-reminder>)+/, '').trim();
  return own && !NOTICE.test(own) ? own : '';
}

// A JSON body keeps prompt headings inside one message. Old Markdown entries remain readable.
export function ownerMessages(text) {
  return [...String(text).matchAll(/(?:^|\n)## ([^\n]+)\n([\s\S]*?)(?=\n## |$)/g)].map((m) => {
    const [time, session, turn, mark] = m[1].trim().split(/\s+/);
    if (mark !== MARK) return { time, session, prompt: m[2] };
    const value = JSON.parse(m[2]);
    if (typeof value.prompt !== 'string' || value.sha256 !== digest(value.prompt)) throw Error('Damaged native owner prompt');
    return { time, session, turn, prompt: value.prompt, native: true };
  });
}

// Called only by the scoped native adapter; an injected path is for isolated tests.
export function recordOwnerPrompt(event, log = OWNER_LOG) {
  for (const key of ['session_id', 'turn_id']) {
    if (typeof event[key] !== 'string' || !/^[\w-]{1,160}$/.test(event[key])) throw Error('Invalid owner prompt ' + key);
  }
  if (typeof event.prompt !== 'string' || event.prompt.length > 4000000) throw Error('Invalid owner prompt text');
  fs.mkdirSync(path.dirname(log), { recursive: true });
  const lock = log + '.prompt-lock', fd = fs.openSync(lock, 'wx');
  try {
    const before = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
    const old = ownerMessages(before).find(m => m.native && m.session === event.session_id && m.turn === event.turn_id);
    if (old) {
      if (old.prompt !== event.prompt) throw Error('Conflicting owner prompt for session/turn');
      return { status: 'owner-prompt-duplicate' };
    }
    const body = JSON.stringify({ prompt: event.prompt, sha256: digest(event.prompt) });
    const added = `\n## ${new Date().toISOString()} ${event.session_id} ${event.turn_id} ${MARK}\n${body}\n`;
    fs.appendFileSync(log, added);
    if (fs.readFileSync(log, 'utf8') !== before + added) throw Error('Owner prompt readback differs');
    return { status: 'owner-prompt-recorded' };
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
