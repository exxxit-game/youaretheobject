import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assertPatched, priorVendor, patchVendor, transmissionFunction } from '../tools/multiview-vendor.mjs';
import { textureFrame, assembleVertex } from './multiview-fixtures.mjs';

const build=fs.readFileSync(new URL('../vendor/aframe-1.8.0.min.js',import.meta.url),'utf8');
assertPatched(build);const prior=priorVendor(build);
assert.equal(patchVendor(prior),build,'backports reproduce the shipped build exactly');
assert.throws(()=>patchVendor(prior+' '),/unknown vendor input/);
assert.deepEqual(textureFrame(prior),{deferredAfter:true,uploads:['late'],latePending:false},'prior patch uploads but leaves ordinary later updates deferred');
assert.deepEqual(textureFrame(build),{deferredAfter:false,uploads:['late','desktop'],latePending:false},'late and post-XR updates remain uploadable');
assert.ok(!build.includes('t.onAfterRender(M,t,e),ot.runDeferredUploads()'),'ordinary nested draws must not flush the outer multiview queue');

const shader=transmissionFunction(build),oldShader=transmissionFunction(prior);
assert.match(oldShader,/const in mat4 viewMatrix,/);
assert.ok(!/\bviewMatrix\b/.test(shader),'the macro must not rewrite a function parameter or its uses');
assert.equal(shader.match(/projMatrix \* viewMat \* vec4/g)?.length,2,'both dispersion paths retain the same matrix argument');
assert.ok(build.includes('pos, modelMatrix, viewMatrix, projectionMatrix'),'the call still supplies the global per-view matrix');
for(const extensions of ['', '#extension GL_ANGLE_multi_draw : require', '#extension GL_ANGLE_clip_cull_distance : require\n#extension GL_ANGLE_multi_draw : require']) {
  const fixed=assembleVertex(build,extensions),old=assembleVertex(prior,extensions);
  if(!extensions)assert.equal(fixed,old,'existing multiview prefix without custom extensions is unchanged');
  const lines=fixed.split('\n'),layout=lines.findIndex(l=>l.startsWith('layout('));
  assert.ok(layout>=0);
  assert.ok(lines.every((line,i)=>!line.startsWith('#extension ')||i<layout),'all material and multiview extensions precede layout');
  for(const line of extensions.split('\n').filter(Boolean))assert.equal(lines.filter(l=>l===line).length,1,'no duplicated material extension');
  if(extensions)assert.ok(old.indexOf(extensions)>old.indexOf('layout('),'negative control retains the original directive-order defect');
  assert.equal(assembleVertex(build,extensions,0),assembleVertex(prior,extensions,0),'non-multiview prefix is unchanged');
}
console.log('multiview source regressions: prior failures, texture lifecycle, matrix binding, directive order and exact reconstruction pass; Quest GPU untested');
