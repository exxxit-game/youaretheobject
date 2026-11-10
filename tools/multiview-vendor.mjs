// Backports from vincentfretin/three.js: 9561820, 9c6b6fc, e97db70.
// Exact input and reversible edits retain the existing npm A-Frame build.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { isMain } from './is-main.mjs';

export const PRIOR_SHA256 = '0fd9768440300b116af76343ab9d7bfb4699758ed236bdcda5be56f316d3709f';
export const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const oldPrefix = String.raw`y>0&&(m=["#extension GL_OVR_multiview : require","layout(num_views = "+y+") in;","#define VIEW_ID gl_ViewID_OVR"].join("\n")+"\n"+m,m=m.replace`;
const newPrefix = String.raw`y>0&&(m=(p?p+"\n":"")+["#extension GL_OVR_multiview : require","layout(num_views = "+y+") in;","#define VIEW_ID gl_ViewID_OVR"].join("\n")+"\n"+m.slice(p?p.length+1:0),m=m.replace`;
const changes = [
  ['Gt(b,t,e,e.cameras[0].viewport);else', 'Gt(b,t,e,e.cameras[0].viewport),ot.setDeferTextureUploads(!1),ot.runDeferredUploads();else', 1],
  ['t.onAfterRender(M,t,e),ot.runDeferredUploads(),_t.resetDefaultState()', 't.onAfterRender(M,t,e),_t.resetDefaultState()', 1],
  ['const in mat4 viewMatrix, const in mat4 projMatrix', 'const in mat4 viewMat, const in mat4 projMatrix', 1],
  ['projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 )', 'projMatrix * viewMat * vec4( refractedRayExit, 1.0 )', 2],
  [oldPrefix, newPrefix, 1]
];
const replace = (text, from, to, count) => {
  assert.equal(text.split(from).length - 1, count, 'unexpected vendor patch target: '+from);
  return text.split(from).join(to);
};
export function patchVendor(text) {
  assert.equal(digest(text), PRIOR_SHA256, 'unknown vendor input: inspect it before patching');
  return changes.reduce((s, [a,b,n]) => replace(s,a,b,n), text);
}
export function priorVendor(text) {
  if (digest(text) === PRIOR_SHA256) return text;
  const prior = [...changes].reverse().reduce((s,[a,b,n]) => replace(s,b,a,n), text);
  assert.equal(digest(prior), PRIOR_SHA256, 'vendor has unrelated or incomplete changes');
  return prior;
}
export function assertPatched(text) {
  assert.notEqual(digest(text), PRIOR_SHA256, 'multiview backports are absent');
  priorVendor(text);
}

// Extract the shipped code for isolated regression checks, not a second renderer.
export function textureMethods(build) {
  const start=build.indexOf('this.runDeferredUploads=function');
  const end=build.indexOf(',this.isReversedDepthBuffer=',start);
  assert.ok(start>=0 && end>start);
  return build.slice(start,end);
}
export function multiviewBranch(build) {
  const start=build.indexOf('if(tt&&yt.render(t),Tt.enabled&&Tt.isMultiview)');
  const end=build.indexOf(';else for',start);
  assert.ok(start>=0 && end>start);
  return build.slice(start,end+1)+'else{}';
}
export function transmissionFunction(build) {
  const marker='transmission_pars_fragment:',start=build.indexOf(marker)+marker.length;
  assert.ok(start>=marker.length);
  const literal=build.slice(start).match(/^"(?:\\.|[^"\\])*"/)?.[0];
  assert.ok(literal,'transmission shader chunk missing');
  const chunk=JSON.parse(literal),at=chunk.indexOf('vec4 getIBLVolumeRefraction('),brace=chunk.indexOf('{',at);
  assert.ok(at>=0 && brace>at);
  let level=1,end=brace+1;
  for(;end<chunk.length&&level;end++) {if(chunk[end]==='{')level++;if(chunk[end]==='}')level--;}
  assert.equal(level,0);
  return chunk.slice(at,end);
}
export function vertexPrefixAssignment(build) {
  const start=build.indexOf('y>0&&(m=[')>=0 ? build.indexOf('y>0&&(m=[') : build.indexOf('y>0&&(m=(p?');
  const end=build.indexOf(',m=m.replace(',start);
  assert.ok(start>=0&&end>start);
  return build.slice(start+'y>0&&('.length,end);
}

if (isMain(import.meta.url)) {
  assert.ok(process.argv.length===3&&['--apply','--check'].includes(process.argv[2]),'use --check or --apply');
  const file=new URL('../vendor/aframe-1.8.0.min.js',import.meta.url);
  let text=fs.readFileSync(file,'utf8');
  if(process.argv[2]==='--apply'&&digest(text)===PRIOR_SHA256) {text=patchVendor(text);assertPatched(text);fs.writeFileSync(file,text);}
  assertPatched(text);
  console.log(JSON.stringify({sha256:digest(text),bytes:Buffer.byteLength(text),prior:PRIOR_SHA256,questVerified:false}));
}
