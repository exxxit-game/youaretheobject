// A GDC Vault talk's own captions as plain text with a mark every minute, so a developers' talk can be read
// and quoted with its time (to learn from developers' talks only what we need). Only talks
// the Vault plays without an account (its free share); the text stays in objekt-files/notes (the talk is the
// speaker's), the repository keeps summaries and short quotes.
// How the Vault plays them, read from its player (gdcvault.blazestreaming.com, script_VOD…js): the
// talk's page holds an iframe gdcvault.blazestreaming.com/?id=<id>; the stream is
// https://cdn-a.blazestreaming.com/out/v1/<id>/38549d9a185b445888c6fbc2e2e792e9/50413c5b8a95441e919f0a1579606e47/index.m3u8,
// an HLS playlist (RFC 8216) whose SUBTITLES media playlist lists WebVTT segments.
// Usage: node tools/gdc-captions.mjs <gdcvault.com/play/... url> <out.txt>
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const TAIL = '/38549d9a185b445888c6fbc2e2e792e9/50413c5b8a95441e919f0a1579606e47/index.m3u8';
const text = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.text(); };

// WebVTT cues (W3C WebVTT) to text: the cue times dropped, a repeated cue (segments overlap) kept once, a
// "[mm:00]" mark at each new minute
export function vttToText(vtt) {
  const out = []; let last = '', minute = -1, cur = null;
  for (const line of String(vtt).replace(/\r/g, '').split('\n')) {
    const m = line.match(/^(\d\d):(\d\d):(\d\d)\.\d+ -->/);
    if (m) { cur = { s: Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]), t: [] }; continue; }
    if (!line.trim() || /^(WEBVTT|X-TIMESTAMP|NOTE)/.test(line)) {
      if (cur && cur.t.length) { const t = cur.t.join(' '); if (t !== last) { const mm = Math.floor(cur.s / 60); if (mm !== minute) { minute = mm; out.push(`\n[${String(mm).padStart(2, '0')}:00]`); } out.push(t); last = t; } }
      cur = null; continue;
    }
    if (cur) cur.t.push(line.trim());
  }
  return out.join(' ').trim();
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [page, outFile] = process.argv.slice(2);
  if (!page || !outFile) { console.log('usage: node tools/gdc-captions.mjs <gdcvault.com/play/... url> <out.txt>'); process.exit(1); }
  const html = await text(page);
  const id = (html.match(/blazestreaming\.com\/\?id=([0-9a-f]{32})/) || [])[1];
  const title = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').trim();
  if (!id) { console.log('no player on the page: the talk is for members only, or the page changed'); process.exit(1); }
  const master = `https://cdn-a.blazestreaming.com/out/v1/${id}${TAIL}`;
  const subs = (await text(master)).match(/TYPE=SUBTITLES[^\n]*URI="([^"]+)"/);
  if (!subs) { console.log('the talk has no captions'); process.exit(1); }
  const subsUrl = new URL(subs[1], master).href;
  const segments = (await text(subsUrl)).split('\n').filter((l) => l && !l.startsWith('#')).map((l) => new URL(l.trim(), subsUrl).href);
  let vtt = '';
  for (const s of segments) vtt += (await text(s)) + '\n\n';
  fs.writeFileSync(outFile, `${title}. Its own captions (WebVTT, ${segments.length} segments) from ${page}, read ${new Date().toISOString().slice(0, 10)} by tools/gdc-captions.mjs.\n\n${vttToText(vtt)}\n`);
  console.log(`${title}: ${segments.length} caption segments -> ${outFile}`);
}
