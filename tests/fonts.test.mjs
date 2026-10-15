// The game draws every text in its own faces (css/fonts.css, src/engine/panel.js), each split
// into files by script. A letter no file covers would show as an empty box in the headset: every
// character of every player-facing text file must be covered by every face, so a new language
// fails here until its script's files are added. Each file is vendored with its licence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { CAP } from '../src/app/brand.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(ROOT, 'css/fonts.css'), 'utf8');
const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => ({
  family: body.match(/font-family:\s*([^;]+);/)[1].trim(),
  file: body.match(/url\(([^)]+)\)/)[1],
  ranges: body.match(/unicode-range:\s*([^;]+);/)[1].split(',').map((r) => {
    const [a, b] = r.trim().replace(/^U\+/i, '').split('-').map((h) => parseInt(h, 16));
    return [a, b ?? a];
  })
}));
assert.ok(faces.length >= 2, 'faces declared in css/fonts.css');
const families = [...new Set(faces.map((f) => f.family))];
for (const f of faces) {
  const file = path.join(ROOT, 'css', f.file);
  assert.ok(fs.existsSync(file) && fs.readFileSync(file).subarray(0, 4).toString() === 'wOF2', `${f.file}: a woff2 file in the repo`);
  assert.ok(fs.existsSync(path.join(path.dirname(file), `OFL-${f.family.toLowerCase()}.txt`)), `${f.family}: its licence beside the file`);
}
// the faces the game waits for before a room starts are the ones declared
const main = fs.readFileSync(path.join(ROOT, 'src/main.js'), 'utf8');
for (const family of families) assert.ok(main.includes(`px ${family}'`), `src/main.js waits for ${family}`);

const texts = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (/^texts\.[a-z]{2}\.js$/.test(e.name)) texts.push(p);
  }
};
walk(path.join(ROOT, 'src'));
assert.ok(texts.length >= 1, 'player-facing text files');
let count = 0;
for (const file of texts) {
  const chars = new Set([...fs.readFileSync(file, 'utf8')].filter((c) => c.codePointAt(0) >= 0x20));
  for (const c of chars) {
    const cp = c.codePointAt(0);
    for (const family of families) {
      const covered = faces.some((f) => f.family === family && f.ranges.some(([a, b]) => cp >= a && cp <= b));
      assert.ok(covered, `${path.relative(ROOT, file)}: "${c}" (U+${cp.toString(16).toUpperCase().padStart(4, '0')}) is in no file of ${family}`);
    }
  }
  count += chars.size;
}
// The capital height the sign sizes rest on (src/app/brand.js, CAP) is the font's own: read from
// each Inter file's OS/2 table (a woff2 file: a table directory, then the tables in one brotli stream).
function os2(file) {
  const buf = fs.readFileSync(file);
  const KNOWN = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill'];
  let off = 48;
  const base128 = () => { let v = 0; for (let i = 0; i < 5; i++) { const b = buf[off++]; v = (v << 7) | (b & 0x7f); if (!(b & 0x80)) return v; } return v; };
  const tables = [];
  for (let i = 0; i < buf.readUInt16BE(12); i++) {
    const flags = buf[off++], idx = flags & 0x3f;
    let tag = KNOWN[idx];
    if (idx === 63) { tag = buf.toString('latin1', off, off + 4); off += 4; }
    const xform = (flags >> 6) & 3;
    let len = base128();
    if ((tag === 'glyf' || tag === 'loca') ? xform === 0 : xform !== 0) len = base128();
    tables.push({ tag, len });
  }
  const data = zlib.brotliDecompressSync(buf.subarray(off, off + buf.readUInt32BE(20)));
  let p = 0;
  const at = {};
  for (const t of tables) { at[t.tag] = p; p += t.len; }
  return { upm: data.readUInt16BE(at.head + 18), cap: data.readInt16BE(at['OS/2'] + 88) };
}
for (const f of faces.filter((x) => x.family === 'Inter')) {
  const { upm, cap } = os2(path.join(ROOT, 'css', f.file));
  assert.equal(cap / upm, CAP, `${f.file}: Inter's capitals are ${cap}/${upm} of the size, the signs assume ${CAP}`);
}
console.log(`fonts tests: ok (${families.join(', ')}: ${faces.length} files; ${count} characters in ${texts.length} text files covered; capitals ${CAP.toFixed(4)})`);
