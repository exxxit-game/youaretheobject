import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { gunzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { publicationSnapshot } from '../tools/verify-delivery.mjs';
import { exportGame, retainObjects } from '../tools/export-game.mjs';
import { ROOT, hash, deliveryFiles } from '../tools/delivery-pack.mjs';
import { fingerprint } from '../tools/review-gate.mjs';

const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'object-game-export-'));
try {
  const a = path.join(folder, 'A'), b = path.join(folder, 'B');
  const source=path.join(folder,'source');fs.mkdirSync(source);
  for(const file of deliveryFiles(ROOT)){const target=path.join(source,file.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,file.data);}
  fs.writeFileSync(path.join(source,'src/.local-note'),'NONSECRET TEST NOTE');
  fs.mkdirSync(path.join(source,'vendor/.private'));fs.writeFileSync(path.join(source,'vendor/.private/note.txt'),'NONSECRET TEST NOTE');
  const filtered=exportGame(source,path.join(folder,'filtered'),{preview:true});
  assert.ok(!filtered.files.some(file=>file.path.split('/').some(part=>part.startsWith('.'))),'hidden files cannot enter the manifest');
  assert.ok(!fs.existsSync(path.join(folder,'filtered/src/.local-note')),'hidden files cannot enter the raw fallback');
  const before=fingerprint(source);fs.writeFileSync(path.join(source,'tools/export-game.mjs'),'changed export recipe');
  assert.notEqual(fingerprint(source),before,'a changed export recipe must invalidate a previous review');
  const first = exportGame(ROOT, a, { preview: true });
  const second = exportGame(ROOT, b, { previous: a, preview: true });
  assert.equal(first.version, second.version, 'same files produce the same release');
  const entry = fs.readFileSync(path.join(a, 'index.html'), 'utf8');
  assert.ok(entry.includes('data-delivery="prepare"') && entry.includes('noindex, nofollow'));
  assert.ok(!entry.includes('aframe-1.8.0.min.js'), 'uncontrolled shell must not start a mixed game');
  const fallback=fs.readFileSync(path.join(a,'uncached.html'),'utf8');
  assert.ok(fallback.includes('AFRAME_CDN_ROOT'));
  assert.ok(fallback.includes('data-preview="true"'),'plain fallback must keep preview protection at every URL');
  for (const file of first.files) {
    const data = Buffer.concat(file.parts.map(part => {
      const data = fs.readFileSync(path.join(a, 'delivery/objects', part.sha256 + '.bin'));
      assert.equal(data.length, part.bytes); assert.equal(hash(data), part.sha256);
      if (part.gzipBytes) { const gzip=fs.readFileSync(path.join(a,'delivery/objects',part.sha256+'.bin.gz')); assert.equal(gzip.length,part.gzipBytes); assert.deepEqual(gunzipSync(gzip),data); }
      return data;
    }));
    assert.equal(hash(data), file.sha256, file.path);
    if (file.path === 'index.html') assert.ok(data.toString().includes('data-delivery="game"'));
    else assert.deepEqual(data, fs.readFileSync(path.join(ROOT, file.path)), file.path);
    if (/\.(glb|mp3|wav)$/.test(file.path)) assert.equal(file.core, false, 'models and recordings load on demand');
    assert.ok(!file.path.includes('supabase/') && !file.path.startsWith('docs/'));
  }
  const git = (...args) => execFileSync('git', args, { cwd:b, stdio:['ignore','pipe','pipe'] });
  git('init','-q'); git('config','core.autocrlf','true'); git('add','-A');
  const code = first.files.find(file => file.path === 'src/main.js').parts[0];
  const staged = git('show', ':delivery/objects/' + code.sha256 + '.bin');
  assert.equal(hash(staged), code.sha256, 'Git cannot normalize a text-looking immutable chunk');
  const snapshot = publicationSnapshot(b);
  assert.ok(!snapshot.has('.gitattributes') && ![...snapshot.keys()].some(name=>name.startsWith('.git/')), 'Git metadata is not a served-file check');
  new vm.Script(fs.readFileSync(path.join(a, 'delivery-worker.js'), 'utf8'));
  const old = Buffer.from('a still-open old version needs this'), oldHash = hash(old);
  fs.writeFileSync(path.join(a, 'delivery/objects', oldHash + '.bin'), old);
  assert.equal(retainObjects(a,b), 1);
  assert.deepEqual(fs.readFileSync(path.join(b,'delivery/objects',oldHash+'.bin')), old);
  fs.writeFileSync(path.join(a, 'delivery/objects', oldHash+'.bin'), 'corrupt');
  assert.throws(() => retainObjects(a,b), /Corrupt/);
  assert.throws(() => exportGame(ROOT,a), /EEXIST/);
  const boot = fs.readFileSync(new URL('../src/delivery-boot.js', import.meta.url),'utf8');
  assert.ok(boot.includes("updateViaCache: 'none'"), 'worker updates bypass stale HTTP script cache');
  console.log('game export: deterministic release, all game bytes/chunks, core boundary and retained immutable objects passed');
} finally {
  assert.equal(path.dirname(path.resolve(folder)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(folder).startsWith('object-game-export-'));
  fs.rmSync(folder, { recursive: true, force: true });
}
