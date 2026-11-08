// Read-only delivery evidence. This grants no merge, publication or headset permission.
import { execFileSync } from 'node:child_process';

const BASE = 'room-polish', WORKFLOW = '.github/workflows/test.yml';
const bot = login => ['coderabbitai','coderabbitai[bot]'].includes(String(login).toLowerCase());
const completedReview = text => /^Review completed(?: successfully)?[.!]?$/i.test(String(text || '').trim());
const newest = list => [...list].sort((a,b) => (Date.parse(b.submitted_at || b.created_at) || 0) - (Date.parse(a.submitted_at || a.created_at) || 0) ||
  (b.run_attempt || b.id || 0) - (a.run_attempt || a.id || 0))[0];

export function assessDelivery(s) {
  const reasons = [], need = (condition, why) => { if (!condition) reasons.push(why); };
  const { local = {}, after = {}, pr = {}, prAfter = {} } = s, sha = local.sha;
  need(/^[a-f0-9]{40}$/.test(sha || ''), 'No valid local commit SHA.');
  need(local.branch?.startsWith('codex/') || local.branch === 'experiment/perception-corridor', 'Not an allowed work branch.');
  need(local.status === '' && after.status === '', 'Tracked, staged or untracked work remains.');
  need(after.sha === sha && after.branch === local.branch, 'Local version changed while checking.');
  need(s.remote === sha && s.remoteAfter === sha, 'Remote branch is missing, stale or changed.');
  need(pr.state === 'OPEN' && pr.baseRefName === BASE && !pr.isDraft, 'No open non-draft PR into room-polish.');
  need(pr.headRefOid === sha && prAfter.headRefOid === sha && prAfter.state === 'OPEN' && !prAfter.isDraft &&
    prAfter.baseRefName === BASE, 'PR version or state differs from the checked version.');
  const run = newest(s.runs || []);
  need(run && run.head_sha === sha && run.head_branch === local.branch && run.event === 'push' &&
    run.path?.split('@')[0] === WORKFLOW && run.status === 'completed' && run.conclusion === 'success', 'Latest test workflow did not succeed on this branch SHA.');
  const job = newest((s.jobs || []).filter(j => j.name === 'test' && j.run_id === run?.id));
  need(job && job.head_sha === sha && job.status === 'completed' && job.conclusion === 'success', 'Expected test job is missing, skipped or not successful.');
  for (const name of ['Run npm test','Run npm run test:smoke:shaders','Run npm run test:smoke:preview','Run npm run test:smoke'])
    need(job?.steps?.some(step => step.name === name && step.conclusion === 'success'), 'Required step not completed: ' + name);
  const review = newest((s.reviews || []).filter(r => bot(r.user?.login)));
  need(review && review.commit_id === sha && ['COMMENTED','APPROVED'].includes(review.state) && review.submitted_at &&
    /^\s*\*\*Actionable comments posted:\s*\d+\*\*/i.test(review.body || ''),
  'No recognised completed CodeRabbit review for this exact SHA.');
  let botStates = 0;
  for (const status of s.statuses || [])
    if (/coderabbit/i.test(status.context)) {
      const latest = newest((s.statuses || []).filter(x => x.context === status.context));
      botStates++;
      need(latest.state === 'success' && completedReview(latest.description), 'CodeRabbit has not positively confirmed a completed review.');
    }
  for (const check of s.checkRuns || [])
    if (/coderabbit/i.test(check.name) || bot(check.app?.slug)) {
      const latest = newest((s.checkRuns || []).filter(x => x.name === check.name));
      botStates++;
      need(latest.status === 'completed' && latest.conclusion === 'success' && latest.output?.title === 'Finished' &&
        /^Result: Success - Review completed[.!]?$/m.test(latest.output?.summary || ''),
      'CodeRabbit check is pending, failed, skipped or limited.');
    }
  need(botStates > 0, 'No completed-review status or check was observed from CodeRabbit.');
  need(s.threadsReadComplete === true && Array.isArray(s.threads), 'Review-thread collection is incomplete.');
  need(Array.isArray(s.threads) && s.threads.every(t => t.isResolved === true), 'Unresolved review threads remain.');
  return { status: reasons.length ? 'not-verified' : 'code-checks-complete', checksComplete: !reasons.length,
    sha, branch: local.branch, pr: pr.url || null, workflowRun: run?.html_url || null,
    reasons: [...new Set(reasons)], ownerAcceptance: false, releasePermission: false };
}

export function collectDelivery(root, { runner } = {}) {
  const run = runner || ((cmd,args) => execFileSync(cmd,args,{cwd:root,encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:16*1024*1024}).trim());
  const git = (...args) => run('git',args);
  const json = (...args) => JSON.parse(run('gh',args));
  const local = () => ({ sha:git('rev-parse','HEAD'),branch:git('branch','--show-current'),status:git('status','--porcelain') });
  let first = {};
  try {
    first = local();
    if (first.status || !(first.branch.startsWith('codex/') || first.branch === 'experiment/perception-corridor'))
      return { status:'not-verified',checksComplete:false,sha:first.sha,branch:first.branch,
        reasons:['Commit the intended work on its work branch before asking for remote evidence.'],ownerAcceptance:false,releasePermission:false };
    const remote = () => git('ls-remote','--heads','origin','refs/heads/'+first.branch).split(/\s/)[0] || '';
    const beforeRemote = remote();
    const info = json('repo','view','--json','nameWithOwner').nameWithOwner;
    if (!/^[\w.-]+\/[\w.-]+$/.test(info)) throw Error('Invalid repository identity');
    const prs = json('pr','list','--head',first.branch,'--base',BASE,'--state','open','--json','number,url,headRefOid,baseRefName,isDraft,state');
    if (!Array.isArray(prs) || prs.length !== 1) throw Error('No unique open pull request for this work branch');
    const pr = prs[0], endpoint = 'repos/'+info;
    const pages = route => {
      const result = json('api','--paginate','--slurp',route);
      if (!Array.isArray(result)) throw Error('Expected paginated GitHub data');
      return result;
    };
    const [owner,repo] = info.split('/');
    const query='query($o:String!,$r:String!,$n:Int!,$after:String){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100,after:$after){pageInfo{hasNextPage endCursor} nodes{isResolved}}}}}';
    const evidence = () => {
      const runs = pages(endpoint+'/actions/workflows/test.yml/runs?head_sha='+first.sha+'&event=push&per_page=100').flatMap(p => {
        if (!Array.isArray(p.workflow_runs)) throw Error('Missing workflow runs'); return p.workflow_runs;
      });
      const latest = newest(runs), jobs = latest ? pages(endpoint+'/actions/runs/'+latest.id+'/jobs?filter=latest&per_page=100').flatMap(p => {
        if (!Array.isArray(p.jobs)) throw Error('Missing jobs'); return p.jobs;
      }) : [];
      const reviews = pages(endpoint+'/pulls/'+pr.number+'/reviews?per_page=100').flat();
      const statuses = pages(endpoint+'/commits/'+first.sha+'/statuses?per_page=100').flat();
      const checkRuns = pages(endpoint+'/commits/'+first.sha+'/check-runs?per_page=100').flatMap(p => {
        if (!Array.isArray(p.check_runs)) throw Error('Missing check runs'); return p.check_runs;
      });
      const threads = [], cursors = new Set(); let after = null;
      for (;;) {
        const response = json('api','graphql','-f','query='+query,'-F','o='+owner,'-F','r='+repo,'-F','n='+pr.number,...(after?['-f','after='+after]:[]));
        const page = response.data?.repository?.pullRequest?.reviewThreads;
        if (response.errors || !Array.isArray(page?.nodes) || typeof page.pageInfo?.hasNextPage !== 'boolean') throw Error('Incomplete review-thread page');
        threads.push(...page.nodes);
        if (!page.pageInfo.hasNextPage) break;
        after = page.pageInfo.endCursor;
        if (!after || cursors.has(after)) throw Error('Invalid review-thread cursor');
        cursors.add(after);
      }
      return { runs,jobs,reviews,statuses,checkRuns,threads,threadsReadComplete:true };
    };
    const one = evidence();
    const view = () => json('pr','view',String(pr.number),'--json','headRefOid,baseRefName,isDraft,state');
    const mid = view(), two = evidence(), observedAt = new Date().toISOString(), prAfter = view();
    if (JSON.stringify(one) !== JSON.stringify(two)) throw Error('CI or review evidence changed during collection, even for the same SHA');
    if (JSON.stringify(mid) !== JSON.stringify(prAfter)) throw Error('PR state changed during collection');
    return { ...assessDelivery({local:first,after:local(),remote:beforeRemote,remoteAfter:remote(),pr,prAfter,...two}),
      evidenceStable:true,observedAt };
  } catch (error) {
    return { status:'unverified',checksComplete:false,sha:first.sha,branch:first.branch,
      reasons:[String(error.stderr || error.message).trim()],ownerAcceptance:false,releasePermission:false };
  }
}

