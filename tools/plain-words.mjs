// What the owner reads in the chat holds no new numbers and no empty words: new numbers and
// conclusions reach him only on a page that passed the fact-check, and an evaluation with no measure
// behind it says more than was found (docs/owner-decisions.md: "his answer: «Делай… и сторож будет
// это проверять»"; the tyranny of words). The stop hook (tools/claude-guard.mjs) reads what was
// written to him since his last message and does not let the turn end while one remains.
// Quoted words («…»), links and `code` are left out: they quote him, a page or a name.

// Names that carry digits and are not numbers of ours.
const NAMES = [/\bQuest\s?(?:2|3S?|Pro)\b/gi, /\bA-Frame\s?\d+(?:\.\d+)*/gi, /\bOpus\s?\d+(?:\.\d+)*/gi, /\bIWSDK\s?\d+(?:\.\d+)*/gi];

// The words: filled from a published method, each with where it comes from (EMPTY below).
export const EMPTY = [];

// the text he reads, with quotes, links, code and names taken out
export function bare(text) {
  let t = String(text)
    .replace(/«[^«»]*»/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ');
  for (const n of NAMES) t = t.replace(n, ' ');
  return t;
}

// what in the text breaks the rule: new numbers, and empty words from the list
export function findings(text, list = EMPTY) {
  const t = bare(text), found = [];
  const digits = t.match(/\d+(?:[.,]\d+)?/g);
  if (digits) found.push(`numbers: ${[...new Set(digits)].slice(0, 8).join(', ')}`);
  for (const w of list) {
    const re = new RegExp(`(?<![\\p{L}])${w.word}(?![\\p{L}])`, 'iu');
    if (re.test(t)) found.push(`«${w.word}» (${w.why})`);
  }
  return found;
}

// The assistant's own text in a stretch of the session record (JSON lines): what he read.
export function written(record) {
  const parts = [];
  for (const line of String(record).split('\n')) {
    if (!line.includes('"type":"assistant"')) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type !== 'assistant' || e.isSidechain) continue;
    for (const p of e.message?.content || []) if (p.type === 'text' && p.text) parts.push(p.text);
  }
  return parts.join('\n');
}
