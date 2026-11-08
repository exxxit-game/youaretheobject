// Isolated shipped-code fixtures. These do not emulate OCULUS_multiview.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { textureMethods, multiviewBranch, transmissionFunction, vertexPrefixAssignment } from '../tools/multiview-vendor.mjs';

export function textureFrame(build) {
  const uploads=[];
  const manager = vm.runInNewContext(`(()=>{
    let A=[],m=false; const api={};
    (function(){${textureMethods(build)};}).call(api);
    return {api,deferred:()=>m,enqueue(texture){
      if(m){A.push({textureProperties:{},texture,slot:0});texture.isPendingDeferredUpload=true;}
      else F({},texture,0);
    }};
  })()`,{F:(_,texture)=>uploads.push(texture.name)});
  const render=vm.runInNewContext('(function(Tt,ot,Gt,b,t,e,tt,yt){'+multiviewBranch(build)+'})');
  const late={name:'late'},desktop={name:'desktop'};
  render({enabled:true,isMultiview:true},manager.api,()=>{
    assert.equal(manager.deferred(),true,'multiview draw must defer uploads');manager.enqueue(late);
  },{}, {},{cameras:[{viewport:{}}]},false,{});
  // Include the old global flush when evaluating the prior shipped build.
  const at=build.indexOf('t.onAfterRender(M,t,e),')+'t.onAfterRender(M,t,e),'.length;
  const end=build.indexOf('_t.resetDefaultState()',at);
  assert.ok(end>=at);
  const tail=build.slice(at,end).replace(/,$/,'');
  if(tail)vm.runInNewContext('(function(ot){'+tail+'})')(manager.api);
  const deferredAfter=manager.deferred();manager.enqueue(desktop);
  return {deferredAfter,uploads,latePending:late.isPendingDeferredUpload};
}
export function assembleVertex(build,extensions,views=2) {
  const prefix=[extensions,'#define attribute in','#define varying out','#define texture2D texture'].join('\n')+'\n';
  return vm.runInNewContext('y>0&&('+vertexPrefixAssignment(build)+');m',{p:extensions,y:views,m:prefix});
}
export function shaderCases(build) {
  const fn=transmissionFunction(build),signature=fn.slice(0,fn.indexOf('{')+1);
  const transmission='#version 300 es\nprecision highp float;\nprecision highp int;\nuniform mat4 viewMatrices[2];\nuniform int testViewId;\n'+
    '#define VIEW_ID testViewId\n#define viewMatrix viewMatrices[VIEW_ID]\n'+signature+
    '\nreturn vec4(1.0);\n}\nout vec4 result;\nvoid main(){result=vec4(1.0);}\n';
  const prefix=assembleVertex(build,'#extension all : warn')
    .replace('#extension GL_OVR_multiview : require','// Native extension is not available in this grammar test.')
    .replace('layout(num_views = 2) in;','layout(location = 0) in vec3 position;');
  return [
    {name:'transmission parameter under viewMatrix macro',kind:'fragment',source:transmission},
    {name:'material extension before a layout token',kind:'vertex',source:'#version 300 es\n'+prefix+'\nvoid main(){gl_Position=vec4(0.0,0.0,0.0,1.0);}\n'}
  ];
}
