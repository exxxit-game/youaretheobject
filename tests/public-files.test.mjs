import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startServer } from './static-server.mjs';
import { publicFiles, PUBLIC } from '../tools/public-files.mjs';
import { fingerprint } from '../tools/review-gate.mjs';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'object-public-boundary-'));
const root=path.join(temp,'site'),outside=path.join(temp,'private');
fs.mkdirSync(root);fs.mkdirSync(path.join(root,'src'));fs.mkdirSync(outside);
fs.writeFileSync(path.join(root,'index.html'),'PUBLIC');
fs.writeFileSync(path.join(root,'src/.local-note'),'HIDDEN TEST SENTINEL');
fs.writeFileSync(path.join(outside,'note.txt'),'PRIVATE TEST SENTINEL');
for (const item of PUBLIC) {
  const full=path.join(root,item);fs.mkdirSync(item.endsWith('/') ? full : path.dirname(full),{recursive:true});
  if(!item.endsWith('/') && !fs.existsSync(full)) fs.writeFileSync(full,'PUBLIC');
}
fs.symlinkSync(outside,path.join(root,'src/link'),process.platform==='win32'?'junction':'dir');
const server=await startServer(0,{root}),base='http://127.0.0.1:'+server.address().port;
try {
  assert.equal(await (await fetch(base+'/')).text(),'PUBLIC');
  assert.equal((await fetch(base+'/src/.local-note')).status,403);
  assert.equal((await fetch(base+'/src/link/note.txt')).status,403,'a public-looking path must not follow a link outside the site');
  assert.throws(()=>fingerprint(root),/Refusing link/,'a review must not follow a link either');
  assert.throws(()=>publicFiles(root),/Refusing link/);
  const linkedSite=path.join(temp,'linked-parent-site');
  fs.mkdirSync(linkedSite);
  for (const item of PUBLIC.filter(item=>!item.startsWith('tools/'))) {
    const full=path.join(linkedSite,item);
    fs.mkdirSync(item.endsWith('/') ? full : path.dirname(full),{recursive:true});
    if(!item.endsWith('/')) fs.writeFileSync(full,'PUBLIC');
  }
  for(const name of ['xr-probe.html','xr-probe-input.html','xr-room.html']) fs.writeFileSync(path.join(outside,name),'PRIVATE TEST SENTINEL');
  fs.symlinkSync(outside,path.join(linkedSite,'tools'),process.platform==='win32'?'junction':'dir');
  assert.throws(()=>publicFiles(linkedSite),/Refusing link/,'an explicitly listed file must not pass through a linked parent');
  assert.throws(()=>fingerprint(linkedSite),/Refusing link/);
  console.log('public files: hidden paths and linked private directories refused over real HTTP');
} finally {
  server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
  assert.equal(path.dirname(path.resolve(temp)),path.resolve(os.tmpdir()));assert.ok(path.basename(temp).startsWith('object-public-boundary-'));
  fs.rmSync(temp,{recursive:true,force:true});
}
