// Shared chunk format and local transfer inventory; this file never publishes.
// Reuse the preview allowlist; never package the repository or private notes.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PUBLIC, publicFiles } from './public-files.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const CHUNK_BYTES = 256 * 1024;

export const deliveryFiles = (root = ROOT) => publicFiles(root);

export function makePack(entries, chunkBytes = CHUNK_BYTES) {
  if (!Number.isSafeInteger(chunkBytes) || chunkBytes < 1) throw new Error('Invalid chunk size');
  const objects = new Map();
  const files = entries.map(({ path: name, data }) => {
    const parts = [];
    for (let offset = 0; offset < data.length; offset += chunkBytes) {
      const part = data.subarray(offset, offset + chunkBytes), sha256 = hash(part);
      objects.set(sha256, Buffer.from(part));
      parts.push({ sha256, bytes: part.length });
    }
    return { path: name, bytes: data.length, sha256: hash(data), parts };
  });
  const core = { schema: 1, scope: 'public-delivery-probe', chunkBytes, files };
  return { manifest: { ...core, version: hash(JSON.stringify(core)) }, objects };
}

export function inventory(entries, manifest, root = ROOT) {
  const groups = {};
  for (const { path: name, data } of entries) {
    const group = /^(src|vendor)\//.test(name) ? name.split('/').slice(0, 2).join('/') : name.split('/')[0];
    groups[group] ??= { files: 0, bytes: 0 };
    groups[group].files++;
    groups[group].bytes += data.length;
  }
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  return {
    head: git(['rev-parse', 'HEAD']), branch: git(['branch', '--show-current']),
    deliveryChanges: git(['status', '--porcelain', '--', ...PUBLIC]),
    version: manifest.version, scope: manifest.scope, files: entries.length,
    bytes: entries.reduce((n, f) => n + f.data.length, 0), groups,
    largest: manifest.files.map(({ path, bytes }) => ({ path, bytes })).sort((a, b) => b.bytes - a.bytes).slice(0, 12),
    note: 'Full preview allowlist, including models for other devices, inspector, licenses and probes; not cold-launch traffic or RAM.'
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const entries = deliveryFiles(), pack = makePack(entries), report = inventory(entries, pack.manifest);
  if (process.argv.length > 2) {
    if (process.argv[2] !== '--out' || !process.argv[3] || process.argv.length !== 4) throw new Error('Usage: node tools/delivery-pack.mjs [--out NEW_DIRECTORY]');
    const out = path.resolve(process.argv[3]);
    fs.mkdirSync(out); // Existing outputs must never be silently overwritten.
    fs.mkdirSync(path.join(out, 'objects'));
    for (const [sha, data] of pack.objects) fs.writeFileSync(path.join(out, 'objects', `${sha}.bin`), data);
    fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(pack.manifest, null, 2) + '\n');
    fs.writeFileSync(path.join(out, 'inventory.json'), JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
}
