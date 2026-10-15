// Checks every experiment card in docs/cards/: each fact must carry a quote that
// really occurs in the paper's full text (C:\Users\admin\Documents\objekt-files\papers\
// <paper>.txt). A summary cannot invent a number this way: a card whose quote is
// not in the paper fails. Local tool: the papers are not in the repo (copyright).
// Usage: node tools/check-cards.mjs [card-id ...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = path.join(ROOT, 'docs', 'cards');
const PAPERS = 'C:\\Users\\admin\\Documents\\objekt-files\\papers';
const REQUIRED = ['Participants', 'Procedure', 'Duration', 'Main result'];
const MAX_QUOTE_WORDS = 25; // short quotes only: the papers are copyrighted

// pdftotext drops ligatures ("first" → "frst", "different" → "diferent") and breaks
// words across lines, so both sides are reduced the same way before comparing.
// Letters and digits of every script are kept (Japanese, Chinese, Korean included):
// a quote that shrank to nothing would match anything.
// Accents are dropped on both sides ("Müller", "naïve" are extracted in several forms).
const norm = (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').toLowerCase()
  .replace(/ﬀ|ﬁ|ﬂ|ﬃ|ﬄ/g, 'f')
  .replace(/ff|fi|fl/g, 'f')
  .replace(/[^\p{L}\p{N}]/gu, '');
const MIN_QUOTE_CHARS = 8;

const ids = process.argv.slice(2);
const files = fs.readdirSync(CARDS).filter(f => f.endsWith('.md') && f !== 'README.md' && (!ids.length || ids.includes(f.slice(0, -3))));
let failed = 0;
const cache = new Map();

for (const file of files) {
  const text = fs.readFileSync(path.join(CARDS, file), 'utf8');
  const problems = [];
  const paper = (text.match(/^- paper:\s*(\S+)/m) || [])[1];
  const status = (text.match(/^- status:\s*(\S+)/m) || [])[1];
  if (status !== 'read' && status !== 'no-full-text') problems.push('status must be "read" or "no-full-text"');
  if (status === 'read') {
    const txtPath = paper && path.join(PAPERS, paper);
    if (!txtPath || !fs.existsSync(txtPath)) problems.push(`paper text not found: ${paper}`);
    else {
      if (!cache.has(txtPath)) {
        // some extractions are Latin-1, not UTF-8: read them as Latin-1
        const raw = fs.readFileSync(txtPath);
        const utf8 = raw.toString('utf8');
        cache.set(txtPath, norm(utf8.includes('�') ? raw.toString('latin1') : utf8));
      }
      const body = cache.get(txtPath);
      const facts = text.split(/^## Facts/m)[1]?.split(/^## /m)[0] || '';
      const rows = facts.split('\n').filter(l => /^\|/.test(l) && !/^\|\s*(What|---)/.test(l));
      const seen = new Set();
      for (const row of rows) {
        const cells = row.split('|').map(c => c.trim());
        const [what, , quote] = [cells[1], cells[2], cells[3]];
        seen.add(what);
        const q = (quote || '').replace(/^["«]|["»]$/g, '');
        if (!q || q === '—') { problems.push(`${what}: no quote`); continue; }
        if (q.split(/\s+/).length > MAX_QUOTE_WORDS) problems.push(`${what}: quote over ${MAX_QUOTE_WORDS} words`);
        if (norm(q).length < MIN_QUOTE_CHARS) problems.push(`${what}: quote too short to prove anything: "${q}"`);
        else if (!body.includes(norm(q))) problems.push(`${what}: quote not in paper: "${q.slice(0, 60)}"`);
      }
      for (const r of REQUIRED) if (![...seen].some(s => s && s.startsWith(r))) problems.push(`missing fact row: ${r}`);
    }
  }
  if (!/^## Fit for Object/m.test(text)) problems.push('missing "## Fit for Object" section');
  if (!/^- Verdict:/m.test(text)) problems.push('missing "- Verdict:" line');
  if (problems.length) { failed++; console.log(`FAIL ${file}\n  ${problems.join('\n  ')}`); }
  else console.log(`PASS ${file} (${status})`);
}
console.log(`${files.length - failed} of ${files.length} cards pass`);
process.exit(failed ? 1 : 0);
