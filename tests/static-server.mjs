// Minimal static file server for tests and local preview. No dependencies.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
import { isPublic, publicPath } from '../tools/public-files.mjs';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2'
};

export function startServer(port = 0, { root = ROOT } = {}) {
  const server = http.createServer((req, res) => {
    // a malformed escape (/%) or a NUL byte throws inside this listener and would stop the server
    // for everyone on the public link: such a path is refused instead
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { rel = '\0'; }
    if (rel.includes('\0')) { res.writeHead(400).end(); return; }
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(root, rel);
    if (!file.startsWith(root) || !isPublic(path.relative(root, file).split(path.sep).join('/'))) {
      res.writeHead(403).end();
      return;
    }
    try { publicPath(root, path.relative(root, file).split(path.sep).join('/')); }
    catch (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await startServer(Number(process.env.PORT) || 3000);
  console.log(`http://localhost:${server.address().port}`);
}
