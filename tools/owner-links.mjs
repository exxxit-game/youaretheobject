// Whose turn a message is: one the owner typed, or one the app delivers (helpers' reports,
// background notices, the pull request watcher's events, the artifact view). The prompt hook logs
// only what he typed (tools/claude-guard.mjs); a notice logged as his reads as typed by him. The first
// message of a new window comes with the app's note about the worktree before his text (his first word
// there was once read as that note): leading notes are cut, and what is left is his.
// Pages only he can open, left by research, go once into the board's list of what waits for him: a stop hook
// that made them reach him in every turn sent the same link again and again (the process review).
// Notes between windows, scheduled runs and the brief a window gets from the window that opened it are not
// his either: logged, a yes among them would count as his acceptance of a feature (tools/claude-guard.mjs accepted)
const NOTICE = /^\s*(<(task-notification|system-reminder|agent-message|artifact-view-context|ci-monitor-event|side-sessions-event|cross-session-message|scheduled-task)\b|Background \(from the session that started this one\):)/;
export function typedText(text) {
  const own = String(text).replace(/^(\s*<system-reminder>[\s\S]*?<\/system-reminder>)+/, '');
  return own.trim() !== '' && !NOTICE.test(own);
}
