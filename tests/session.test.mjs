// Real session code with isolated transport: no live server requests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/app/session.js',import.meta.url),'utf8')
  .replace(/^import .*;\r?$/gm,'').replace(/export /g,'');
function session(url, preview) {
  const calls=[], listeners={};let formatted=0;
  const transport=name=>(...args)=>{calls.push({name,args});return Promise.resolve(true);};
  const api=vm.runInNewContext(source+';({createSession,PREVIEW,SPEED})',{
    location:new URL(url), URLSearchParams, document:{documentElement:{dataset:preview ? {preview:'true'} : {}}},
    window:{addEventListener:(name,fn)=>{listeners[name]=fn;}},navigator:{userAgent:'Test'},
    sendResult:transport('result'),sendPlaytest:transport('playtest'),sendIssue:transport('issue'),compareRoom:transport('compare'),
    markPlayed:()=>true,CONSENT_VERSION:1,issueReport:err=>{formatted++;return err;}
  });
  const game=api.createSession('01-control',1);
  game.watchIssues(()=>({state:'run',xr:false}));
  return {game,calls,get formatted(){return formatted;},fail:(message='test')=>listeners.error({message,filename:'test.js',lineno:1})};
}
for(const [url,preview] of [['https://preview.example/?playtest=1',true],['https://example.test/object-preview/?playtest=1',false],['https://example.test/?speed=100&playtest=1',false]]) {
  const {game,calls,fail}=session(url,preview);game.begin(true);fail();
  await game.finish({});await game.finishPlaytest({});
  assert.equal(calls.length,0,'preview at the root must not record live data');
  await game.compare();
  assert.equal(calls.length,0,'preview or accelerated run must never call the live transport: '+url);
}
const real=session('https://example.test/?playtest=1',false);
real.game.begin(false);real.fail();await real.game.finish({});await real.game.compare();assert.equal(real.calls.length,0,'no consent, no recording');
real.game.begin(true);real.fail();await real.game.finish({});await real.game.finishPlaytest({});await real.game.compare();
assert.deepEqual(real.calls.map(x=>x.name),['issue','result','playtest','compare']);
console.log('session: preview at any path, accelerated runs, consent and real transport passed');

for(const record of [false,true]) {
  const many=session('https://example.test/',false);if(record) many.game.begin(true);
  for(let i=0;i<1000;i++) many.fail('distinct error '+i);
  assert.equal(many.formatted,5,'only five distinct errors may be retained per page, before or after consent');
  if(!record) many.game.begin(true);
  assert.equal(many.calls.filter(c=>c.name==='issue').length,5);
}
console.log('session: comparison requires consent and error collection stays bounded');
