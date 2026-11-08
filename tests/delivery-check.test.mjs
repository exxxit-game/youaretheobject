// Version-bound read-only evidence: fixtures never push, contact a bot or change a checkout.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { assessDelivery, collectDelivery } from '../tools/delivery-check.mjs';
const sha='a'.repeat(40), later='b'.repeat(40); let branch='experiment/perception-corridor';
const good=()=>({
 local:{sha,branch,status:''},after:{sha,branch,status:''},remote:sha,remoteAfter:sha,
 pr:{number:42,url:'https://example.invalid/pr/42',state:'OPEN',baseRefName:'room-polish',isDraft:false,headRefOid:sha},
 prAfter:{state:'OPEN',baseRefName:'room-polish',isDraft:false,headRefOid:sha},
 runs:[{id:1,created_at:'2026-11-08T00:00:00Z',head_sha:sha,head_branch:branch,event:'push',path:'.github/workflows/test.yml',status:'completed',conclusion:'success'}],
 jobs:[{id:1,name:'test',run_id:1,head_sha:sha,status:'completed',conclusion:'success',steps:[
  {name:'Run npm test',conclusion:'success'},{name:'Run npm run test:smoke',conclusion:'success'},{name:'Run npm run test:smoke:preview',conclusion:'success'},{name:'Run npm run test:smoke:shaders',conclusion:'success'}]}],
 reviews:[{id:1,user:{login:'coderabbitai[bot]'},commit_id:sha,state:'COMMENTED',submitted_at:'2026-11-08T00:00:00Z',body:'**Actionable comments posted: 0**'}],
 statuses:[{id:1,context:'CodeRabbit',state:'success',description:'Review completed',created_at:'2026-11-08T00:00:00Z'}],checkRuns:[],threads:[],threadsReadComplete:true
});
assert.equal(assessDelivery(good()).checksComplete,true);
const checkMode=good();checkMode.statuses=[];checkMode.checkRuns=[{id:1,name:'CodeRabbit',status:'completed',conclusion:'success',output:{title:'Finished',summary:'Result: Success - Review completed'}}];
assert.equal(assessDelivery(checkMode).checksComplete,true);
for(const summary of ['Result: Success - Review skipped','Result: Success - Review paused','Result: Failure - Review completed']){
 const s=structuredClone(checkMode);s.checkRuns[0].output.summary=summary;assert.equal(assessDelivery(s).checksComplete,false);
}
const badCases=[
 s=>s.local.status=' M file',s=>s.local.status='?? file',s=>s.after.status='M  file',
 s=>s.local.branch='main',s=>s.local.branch='',s=>s.after.sha=later,
 s=>s.remote='',s=>s.remoteAfter=later,s=>s.pr.headRefOid=later,s=>s.prAfter.headRefOid=later,
 s=>s.pr.baseRefName='main',s=>s.prAfter.state='CLOSED',s=>s.pr.isDraft=true,
 s=>s.runs=[],s=>s.runs[0].head_sha=later,s=>s.runs[0].path='.github/workflows/other.yml',
 s=>s.runs[0].conclusion='skipped',s=>s.runs.push({...s.runs[0],id:2,created_at:'2026-11-08T01:00:00Z',status:'in_progress',conclusion:null}),
 s=>s.jobs=[],s=>s.jobs[0].conclusion='skipped',s=>s.jobs[0].steps[1].conclusion='skipped',s=>s.jobs[0].steps.pop(),
 s=>s.jobs.push({...s.jobs[0],id:2,conclusion:'failure'}),
 s=>s.reviews=[],s=>s.reviews[0].commit_id=later,s=>s.reviews[0].user.login='other-bot',
 s=>s.reviews[0].state='PENDING',s=>s.reviews[0].state='DISMISSED',s=>s.reviews[0].body='',
 s=>s.reviews[0].body='Review skipped. Actionable comments posted: 0',
 s=>s.reviews.push({...s.reviews[0],id:2,submitted_at:'2026-11-08T01:00:00Z',commit_id:later}),
 s=>s.statuses=[{context:'CodeRabbit',state:'success',description:'Review skipped',created_at:'2026-11-08T01:00:00Z'}],
 ...['Review paused','No files to review','Too many files to review','Summary could not be published'].map(description=>s=>{s.statuses[0].description=description;}),
 s=>s.statuses=[],
 s=>s.checkRuns=[{id:2,name:'CodeRabbit',status:'completed',conclusion:'success',output:{summary:'rate-limited'}}],
 s=>s.threadsReadComplete=false,s=>s.threads=[{isResolved:false}]
];
for(const mutate of badCases){const s=good();mutate(s);const result=assessDelivery(s);assert.equal(result.checksComplete,false);assert.ok(result.reasons.length);}
const original=good();assessDelivery(original);assert.deepEqual(original,good(),'reader must not mutate evidence');
const calls=[];let graph=0;
const runner=(cmd,args)=>{
 calls.push([cmd,...args]);const s=good(),a=args.join(' ');
 if(cmd==='git'){
  if(args[0]==='rev-parse')return sha;
  if(args[0]==='branch')return branch;
  if(args[0]==='status')return '';
  if(args[0]==='ls-remote')return sha+'\trefs/heads/'+branch;
 }
 if(args[0]==='repo')return JSON.stringify({nameWithOwner:'owner/repo'});
 if(args[0]==='pr'&&args[1]==='list')return JSON.stringify([s.pr]);
 if(args[0]==='pr'&&args[1]==='view')return JSON.stringify(s.prAfter);
 if(args[1]==='graphql'){
  graph++;const more=!args.includes('after=next');return JSON.stringify({data:{repository:{pullRequest:{reviewThreads:{nodes:[],pageInfo:{hasNextPage:more,endCursor:more?'next':null}}}}}});
 }
 let data;
 if(a.includes('/actions/workflows/'))data={workflow_runs:s.runs};
 else if(a.includes('/actions/runs/'))data={jobs:s.jobs};
 else if(a.includes('/reviews?'))data=s.reviews;
 else if(a.includes('/statuses?'))data=s.statuses;
 else if(a.includes('/check-runs?'))data={check_runs:s.checkRuns};
 else throw Error('Unexpected command '+cmd+' '+a);
 return JSON.stringify([data]);
};
assert.equal(collectDelivery('.', {runner}).checksComplete,true);
assert.equal(graph,4,'every review-thread page must be consumed in both snapshots');
branch='codex/verification';assert.equal(collectDelivery('.',{runner}).checksComplete,true,'Codex branch must reach live-evidence collection');branch='experiment/perception-corridor';
const mutations=new Set(['push','pull','checkout','create','comment','merge','config']);
assert.ok(calls.every(c=>c.every(a=>!mutations.has(a))),'reader must have no mutating commands');
const broken=(cmd,args)=>cmd==='git'?runner(cmd,args):'{broken';
assert.equal(collectDelivery('.',{runner:broken}).status,'unverified');
const incomplete=(cmd,args)=>args[1]==='graphql'?'{"data":null}':runner(cmd,args);
assert.equal(collectDelivery('.',{runner:incomplete}).checksComplete,false);
let rerun=false;
const racing=(cmd,args)=>{
 if(args[0]==='pr'&&args[1]==='view')rerun=true;
 const value=runner(cmd,args);
 if(rerun&&args.join(' ').includes('/actions/workflows/')){
  const pages=JSON.parse(value);pages[0].workflow_runs[0].run_attempt=2;pages[0].workflow_runs[0].status='in_progress';return JSON.stringify(pages);
 }
 return value;
};
assert.equal(collectDelivery('.',{runner:racing}).status,'unverified','a same-SHA rerun invalidates the earlier snapshot');
for(const args of [['unknown'],['check','--send'],['--title','x','--send'],['pulled','--send']]){
 const r=spawnSync(process.execPath,['tools/finish.mjs',...args],{encoding:'utf8'});
 assert.equal(r.status,1,'unknown arguments must stop before legacy send');
}
console.log('delivery check: exact SHA, latest CI/review, complete pagination, failures and read-only commands pass');

