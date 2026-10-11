// Whose turn a message is: one the owner typed, or one the app delivers (helpers' reports,
// background notices, the pull request watcher's events, the artifact view). The prompt hook logs
// his words only (tools/claude-guard.mjs); a notice logged as his reads as his words. The first message
// of a new window comes with the app's note about the worktree before his words (11.10 his first
// word there was read as that note): leading notes are cut, and what is left is his.
// Pages only he can open, left by research, go once into the board's list of what waits for him: a stop hook
// that made them reach him in every turn sent the same link again and again (the process review of
// 11.10, his yes).
const NOTICE = /^\s*<(task-notification|system-reminder|agent-message|artifact-view-context|ci-monitor-event)\b/;
export function typedText(text) {
  const own = String(text).replace(/^(\s*<system-reminder>[\s\S]*?<\/system-reminder>)+/, '');
  return own.trim() !== '' && !NOTICE.test(own);
}
