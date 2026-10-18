// One public-file boundary for the local server, exports and review inputs.
import fs from 'node:fs';
import path from 'node:path';

export const PUBLIC = ['index.html', 'privacy.html', 'src/', 'css/', 'vendor/',
  'tools/xr-probe.html', 'tools/xr-probe-input.html', 'tools/xr-room.html'];
export const isPublic = rel => !rel.split('/').some(part => part.startsWith('.'))
  && PUBLIC.some(item => item.endsWith('/') ? rel.startsWith(item) : rel === item);

// A path inside a public folder may still be a junction to private files.
export function publicPath(root, rel) {
  if (!isPublic(rel)) throw new Error('Not public: ' + rel);
  let full = root;
  for (const part of rel.split('/').filter(Boolean)) {
    full = path.join(full, part);
    if (fs.lstatSync(full).isSymbolicLink()) throw new Error('Refusing link: ' + rel);
  }
  return full;
}

export function publicFiles(root) {
  function walk(rel) {
    if (!isPublic(rel)) return [];
    const full = publicPath(root, rel), stat = fs.lstatSync(full);
    if (stat.isDirectory()) return fs.readdirSync(full).sort()
      .flatMap(name => walk(rel.replace(/\/$/, '') + '/' + name));
    if (!stat.isFile()) throw new Error('Unsupported public file: ' + rel);
    return [{ path: rel, data: fs.readFileSync(full) }];
  }
  return PUBLIC.flatMap(walk).sort((a, b) => a.path < b.path ? -1 : 1);
}
