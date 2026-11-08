// Ordinary WebGL2 grammar controls in CI, not native headset/multiview proof.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { priorVendor, assertPatched } from '../tools/multiview-vendor.mjs';
import { shaderCases } from './multiview-fixtures.mjs';

if(!process.env.CI)throw Error('Run this browser check in CI, not on the laptop.');
const build=fs.readFileSync(new URL('../vendor/aframe-1.8.0.min.js',import.meta.url),'utf8');
assertPatched(build);
const cases=[...shaderCases(priorVendor(build)).map(c=>({...c,version:'prior',expected:false})),
  ...shaderCases(build).map(c=>({...c,version:'patched',expected:true}))];
let browser;
try {
  browser=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader'],timeout:30000});
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const result=await page.evaluate(cases=>{
    const gl=document.createElement('canvas').getContext('webgl2');
    if(!gl)throw Error('WebGL2 is unavailable; shader verification did not run.');
    const results=cases.map(c=>{
      const shader=gl.createShader(c.kind==='vertex'?gl.VERTEX_SHADER:gl.FRAGMENT_SHADER);
      gl.shaderSource(shader,c.source);gl.compileShader(shader);
      const compiled=!!gl.getShaderParameter(shader,gl.COMPILE_STATUS),log=gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);return {...c,compiled,log};
    });
    return {version:gl.getParameter(gl.VERSION),results};
  },cases);
  for(const c of result.results)assert.equal(c.compiled,c.expected,c.version+': '+c.name+'\n'+c.log);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({webgl:result.version,nativeMultiviewTested:false,
    results:result.results.map(({name,version,compiled,log})=>({name,version,compiled,log}))}));
  console.log('shader grammar controls: old failures and patched WebGL2 compilation confirmed; native Quest path untested');
} finally { await browser?.close(); }
