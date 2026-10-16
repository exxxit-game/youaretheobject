// Whose turn a message is: one the owner typed, or one the app delivers (helpers' reports,
// background notices, the pull request watcher's events, the artifact view). The prompt hook logs
// only what he typed (tools/claude-guard.mjs); a notice logged as his reads as typed by him. The first
// message of a new window comes with the app's note about the worktree before his text (his first word
// there was once read as that note): leading notes are cut, and what is left is his, logged alone (with the notes
// in front, his yes was not the entry's first word).
// Pages only he can open, left by research, go once into the board's list of what waits for him: a stop hook
// that made them reach him in every turn sent the same link again and again (the process review).
// Notes between windows, scheduled runs and the brief a window gets from the window that opened it are not
// his either: logged, a yes among them would count as his acceptance of a feature (tools/claude-guard.mjs accepted)
const NOTICE = /^\s*(<(task-notification|system-reminder|agent-message|artifact-view-context|ci-monitor-event|side-sessions-event|cross-session-message|scheduled-task)\b|Background \(from the session that started this one\):)/;
// his own text, or '' for a notice
import path from 'node:path';
import crypto from 'node:crypto';

// Bind new Codex owner messages to a checkout; old Claude entries retain their old semantics.
export function ownerRoot(root) {
  const resolved = path.resolve(root);
  return crypto.createHash('sha256').update(process.platform === 'win32' ? resolved.toLowerCase() : resolved).digest('hex');
}
export function ownerEntryApplies(header, root) {
  return !header.includes(' codex:') || header.match(/ codex:([a-f0-9]{64}):[\w-]+:[\w-]+$/)?.[1] === ownerRoot(root);
}

export function ownText(text) {
  const own = String(text).replace(/^(\s*<system-reminder>[\s\S]*?<\/system-reminder>)+/, '').trim();
  return own && !NOTICE.test(own) ? own : '';
}
