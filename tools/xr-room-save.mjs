// Save a captured frame from an already open Quest tab. This never starts an XR session.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isMain } from './is-main.mjs';

export function saveGeometry(snapshot, target) {
  if (!target || !path.isAbsolute(target)) throw new Error('Supply an absolute output filename');
  if (snapshot?.schemaVersion !== 1 || !snapshot.meshes?.some(mesh => mesh.indices?.length > 0)) {
    throw new Error('No geometry snapshot is available yet');
  }
  const content = JSON.stringify(snapshot);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  let created = false;
  try {
    const fd = fs.openSync(target, 'wx');
    created = true;
    try {
      fs.writeFileSync(fd, content);
      fs.fsyncSync(fd);
    } finally { fs.closeSync(fd); }
    if (digest(fs.readFileSync(target)) !== digest(content)) throw new Error('Saved file verification failed');
  } catch (error) {
    if (created) fs.unlinkSync(target);
    throw error;
  }
  return { saved: target, bytes: Buffer.byteLength(content),
    meshes: snapshot.meshes.length, planes: snapshot.planes.length,
    triangles: snapshot.meshes.reduce((sum, mesh) => sum + mesh.indices.length / 3, 0),
    skipped: snapshot.skipped.length };
}

async function main() {
  const target = process.argv[2];
  if (!target || !path.isAbsolute(target)) throw new Error('Supply an absolute output filename');
  const { page } = await import('./headset.mjs');
  const tab = await page({ test: address => {
    const url = new URL(address);
    return url.hostname === 'localhost' && url.port === '3000'
      && url.pathname === '/tools/xr-room.html' && url.searchParams.get('capture') === '1';
  } }, { noAnswerMs: 10000 });
  if (!tab) throw new Error('The short capture page is not open');
  try {
    const result = await tab.run('({snapshot:window.__roomGeometry,state:window.__roomState()})');
    if (result.state.mode !== 'capture') throw new Error('The page is not in short capture mode');
    if (result.state.sessionId && result.snapshot?.sessionId !== result.state.sessionId) {
      throw new Error('The snapshot belongs to a different session');
    }
    console.log(JSON.stringify({ ...saveGeometry(result.snapshot, target),
      capturedAt: result.snapshot.capturedAt,
      source: result.state.phase === 'restored' ? 'restored from device' : 'current session',
      persistedOnDevice: result.state.persisted }));
  }
  finally { tab.close(); }
}

if (isMain(import.meta.url)) await main();
