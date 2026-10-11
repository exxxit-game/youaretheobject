// Pages only the owner can open (behind a login, a captcha, a paywall, a site that blocks tools)
// must reach him in the same turn, not sit in a research report. A research agent lists them
// after the marker MARK (.claude/agents/quick-research.md); the stop hook (claude-guard.mjs) reads
// the session's record since his last message and does not let a turn end while one of those links
// has not appeared again after the report: in the answer to him or in the plan's list of what is
// asked of the owner. The record's format is Claude Code's own and changes between versions, so
// this only searches its raw text.
import fs from 'node:fs';

export const MARK = 'FOR THE OWNER:';

// A report's block starts a line (raw, as \n inside JSON, or at a JSON string's start); a doc
// that names the mark inside a sentence or quotes it in code is not a report.
const BLOCK = new RegExp(String.raw`(?:^|\n|\\n|(?<!\\)")[ \t*_>#]*` + MARK, 'g');

// text: the session record as one string. Returns the links listed after a mark that never come
// up again later in the record. A block ends at a blank line (raw or as \n\n inside JSON).
export function unrelayed(text) {
  const missing = new Set();
  for (const found of text.matchAll(BLOCK)) {
    const at = found.index + found[0].length - MARK.length;
    const tail = text.slice(at, at + 4000);
    const end = tail.search(/\n\s*\n|\\n\\n/);
    const block = end === -1 ? tail : tail.slice(0, end);
    const after = text.slice(at + block.length);
    for (const [url] of block.matchAll(/https?:\/\/[^\s"'\\)<>`]+/g)) {
      const link = url.replace(/[.,;:]+$/, '');
      if (!after.includes(link)) missing.add(link);
    }
  }
  return [...missing];
}

// Text of a turn the owner typed, not one the app delivers (helpers' reports, background notices,
// the pull request watcher's events, the artifact view). The first message of a new window comes
// with the app's note about the worktree before his words (11.10 his "продолжаем" was read as that
// note, so the window did not take the work): leading notes are cut, and what is left is his.
const NOTICE = /^\s*<(task-notification|system-reminder|agent-message|artifact-view-context|ci-monitor-event)\b/;
export function typedText(text) {
  const own = String(text).replace(/^(\s*<system-reminder>[\s\S]*?<\/system-reminder>)+/, '');
  return own.trim() !== '' && !NOTICE.test(own);
}

// A line of the record that is a message the owner typed: Claude Code marks it as a person's
// (origin "human"); records without that mark: user text that is no tool result and no notice.
// Helpers' reports and background notices also arrive as user lines and are not his.
function typedByOwner(line) {
  if (!line.includes('"type":"user"')) return false;
  let e;
  try { e = JSON.parse(line); } catch { return false; }
  if (e.type !== 'user' || e.isMeta || e.isSidechain || e.isCompactSummary) return false;
  if (e.origin) return e.origin.kind === 'human';
  const c = e.message?.content;
  const text = typeof c === 'string' ? c : Array.isArray(c) && !c.some((p) => p.type === 'tool_result') ? c.map((p) => p.text || '').join('') : '';
  return typedText(text);
}

// The record (JSON lines, tens of MB late in a session) from the owner's last message on, read
// backwards in blocks so a turn's check costs only what came since he spoke; the whole record when
// he has not spoken in it. Blocks are cut after a newline, which never splits a character.
export function sinceOwner(file, block = 1 << 20) {
  const fd = fs.openSync(file, 'r');
  try {
    let end = fs.fstatSync(fd).size, carry = Buffer.alloc(0);
    const later = [];
    while (end > 0) {
      const start = Math.max(0, end - block);
      const buf = Buffer.alloc(end - start);
      fs.readSync(fd, buf, 0, buf.length, start);
      end = start;
      const joined = Buffer.concat([buf, carry]);
      // the first line may begin in the block before: carried back until it is whole
      const cut = start > 0 ? joined.indexOf(10) + 1 : 0;
      if (start > 0 && cut === 0) { carry = joined; continue; }
      carry = joined.subarray(0, cut);
      const lines = joined.subarray(cut).toString('utf8').split('\n');
      for (let k = lines.length - 1; k >= 0; k--) {
        if (typedByOwner(lines[k])) return [lines.slice(k).join('\n'), ...later].join('');
      }
      later.unshift(lines.join('\n'));
    }
    return later.join('');
  } finally { fs.closeSync(fd); }
}
