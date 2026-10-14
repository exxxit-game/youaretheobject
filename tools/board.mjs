// The owner's one-page board (docs/board.md) as the session start shows it. Only its top goes into
// the start message: the work now, what waits for him, the newest showings. The whole board printed
// there had to fit Claude Code's 10,000 characters of hook output, and keeping it inside that cap
// was the commit check's most frequent stop (as the process review found); the session reads the
// rest from the file when a step needs it.
export const BOARD = 'docs/board.md';
export const SHOWS = '## Показы';
export const UNTIL = '## Путь';
export const WAITS = '## Ждёт тебя';
export const SHOWN_ROWS = 5;

// the section of the board that starts at heading `h`, up to the next heading of its level
const section = (text, h) => {
  const at = text.indexOf(h);
  if (at < 0) return '';
  const next = text.indexOf('\n## ', at + h.length);
  return text.slice(at, next < 0 ? text.length : next).trim();
};

// what the start shows: the head and the work now, what waits for him, and the newest rows of the
// showings (new rows go on top of the table)
export function top(text) {
  const t = String(text).replace(/\r\n/g, '\n').trim();
  const head = t.indexOf(UNTIL) < 0 ? t : t.slice(0, t.indexOf(UNTIL)).trim();
  // rows counted by place, not by text: two rows may read the same; a row is a showing whatever note
  // follows its date (such as "(new window)"), or every such row slips past the count
  let seen = 0;
  const table = section(t, SHOWS).split('\n').filter((l) => !/^\|\s*\d{1,2}\.\d{1,2}\b/.test(l) || seen++ < SHOWN_ROWS);
  return [head, section(t, WAITS), table.join('\n'), `(the rest of the board: ${BOARD})`].filter(Boolean).join('\n\n');
}

// Yesterday's commits by what they touched, for the line at the top of the start: the owner's brake
// (the process review: when the process takes more commits than the game, he sees it first)
export const GAME = /^(src\/|css\/|index\.html$|assets\/|vendor\/)/;
export const PROCESS = /^(tools\/|tests\/|docs\/|\.claude\/|\.github\/|CLAUDE\.md$|package\.json$)/;
export function split(log) {
  let game = 0, process = 0;
  for (const commit of String(log).split(/\n(?=@@)/)) {
    const files = commit.split('\n').slice(1).map((f) => f.trim()).filter(Boolean);
    if (!files.length) continue;
    if (files.some((f) => GAME.test(f))) game++;
    if (files.some((f) => PROCESS.test(f))) process++;
  }
  return { game, process };
}
