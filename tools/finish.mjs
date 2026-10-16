// Finish a work branch without treating a skipped CodeRabbit review as approval.
// The owner decides the merge; this command never merges or publishes main.
// Usage: node tools/finish.mjs [--title "…" --body-file <file>]
//        node tools/finish.mjs --check (read only: no push, PR creation, comment or wait)
//        node tools/finish.mjs pulled (fast-forward the primary checkout after the owner's merge)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'room-polish';
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
const read = (cmd, args) => run(cmd, args).trim();
const stop = (why) => { process.stderr.write(`finish: ${why}\n`); process.exit(1); };
const say = (line) => process.stdout.write(`${line}\n`);
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };

// GitHub returns commit statuses newest first. A skipped review also has state=success.
export const codeRabbitStatus = (statuses) => statuses.find((s) => s.context === 'CodeRabbit' && s.creator?.login === 'coderabbitai[bot]');
export const codeRabbitRetryCommand = (status, number) => ['error', 'failure'].includes(status?.state)
  ? `gh pr comment ${number} --body "@coderabbitai review"` : undefined;
export function checkMergeReadiness({ checks, statuses, unresolved, draft, head, reviewedHead }) {
  const reasons = [], rabbit = codeRabbitStatus(statuses);
  if (!head || head !== reviewedHead) reasons.push('the PR head differs from the local commit');
  if (draft) reasons.push('the pull request is still a draft');
  if (!checks.some((c) => c.name === 'test' && c.bucket === 'pass')) reasons.push('the required test has not passed');
  if (checks.some((c) => !['pass', 'skipping'].includes(c.bucket))) reasons.push('a check is pending or unsuccessful');
  if (rabbit?.state !== 'success' || rabbit.description !== 'Review completed') reasons.push('CodeRabbit has not confirmed a completed review of this commit');
  if (unresolved !== 0) reasons.push('review discussions remain unresolved or were not read');
  return reasons;
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  if (checkOnly && process.argv[2] === 'pulled') stop('--check cannot be combined with pulled');
  if (process.argv[2] === 'pulled') {
    // the main folder is the first worktree git lists (git-worktree(1): "the main worktree is listed first")
    const main = read('git', ['worktree', 'list', '--porcelain']).split('\n').find((l) => l.startsWith('worktree '))?.slice(9);
    if (!main) stop('no main folder found');
    const on = read('git', ['-C', main, 'branch', '--show-current']);
    if (on !== BASE) stop(`the main folder ${main} is on ${on || 'no branch'}, not ${BASE}: not pulled`);
    say(read('git', ['-C', main, 'pull', '--ff-only']) || 'up to date');
    say(`main folder ${main}: ${read('git', ['-C', main, 'log', '--oneline', '-1'])}`);
    process.exit(0);
  }

  if (read('git', ['status', '--porcelain'])) stop('uncommitted changes: commit them first (by command, so the hooks run)');
  const branch = read('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (!/^(claude|codex)\/.+$/.test(branch)) stop(`on ${branch}: a work branch (claude/… or codex/…) goes into ${BASE}`);
  if (!checkOnly) run('git', ['push', '-u', 'origin', branch], { stdio: 'inherit' }); // the pre-push hook checks for secrets first

  const { owner, name } = JSON.parse(read('gh', ['repo', 'view', '--json', 'owner,name']));
  const repo = `${owner.login}/${name}`;
  const open = () => JSON.parse(read('gh', ['pr', 'list', '--head', branch, '--base', BASE, '--state', 'open', '--json', 'number,url,isDraft,headRefOid']))[0];
  let pr = open();
  if (!pr) {
    if (checkOnly) stop('no open pull request for this work branch');
    const title = arg('--title'), body = arg('--body-file');
    if (!title || !body) stop('no open pull request yet: give --title "…" and --body-file <file> for it');
    run('gh', ['pr', 'create', '--base', BASE, '--head', branch, '--title', title, '--body-file', body]);
    pr = open();
  }
  say(`pull request #${pr.number}: ${pr.url}`);

  // A status may describe a skipped review; completion is checked separately below.
  const sha = read('git', ['rev-parse', 'HEAD']);
  if (pr.headRefOid !== sha) stop('the pull request head differs from the local commit');
  const statuses = () => JSON.parse(read('gh', ['api', `repos/${repo}/commits/${sha}/statuses`, '--paginate', '--slurp'])).flat();
  const reviewing = () => codeRabbitStatus(statuses());
  let asked = false;
  if (!checkOnly && !pr.isDraft) for (let i = 0; i < 6 && !reviewing(); i++) await pause(30000);
  if (!checkOnly && !pr.isDraft && !reviewing()) {
    run('gh', ['pr', 'comment', String(pr.number), '--body', '@coderabbitai review']);
    asked = true;
  }
  const rabbit = reviewing(), retry = codeRabbitRetryCommand(rabbit, pr.number);
  say(asked ? 'CodeRabbit review requested' : `CodeRabbit: ${rabbit?.description || 'no status for this commit'}`);
  if (retry) say(`CodeRabbit ended unsuccessfully. To request another review: ${retry}`);

  // GitHub's checks (the tests and CodeRabbit's status), read once a minute until none is pending; the test run
  // takes 7-14 minutes (docs/state.md), so 45 minutes is the limit. `gh pr checks` exits non-zero while any
  // check is pending or failed, so its JSON is read from the error too
  const checks = () => {
    try { return JSON.parse(read('gh', ['pr', 'checks', String(pr.number), '--json', 'name,bucket'])); } catch (e) {
      // pending or failed checks still print their JSON; no JSON at all is a gh or network failure, not a wait
      try { return JSON.parse(e.stdout); } catch { return stop(`gh pr checks gave no result: ${String(e.stderr || e.message).trim()}`); }
    }
  };
  let now = checks();
  if (!checkOnly) for (let i = 0; i < 45 && (!now.length || now.some((c) => c.bucket === 'pending')); i++) { await pause(60000); now = checks(); }
  for (const c of now) say(`  ${c.name}: ${c.bucket}`);

  // CodeRabbit's remarks still open: each must be fixed, or shown wrong by a test or doc it accepts (CLAUDE.md step 6)
  // every page of threads is read (GraphQL pagination, pageInfo), so none past the first hundred is missed
  const query = 'query($o:String!,$r:String!,$n:Int!,$after:String){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100,after:$after){pageInfo{hasNextPage endCursor} nodes{isResolved comments(first:1){nodes{author{login} path}}}}}}}';
  const threads = [];
  for (let after = null, more = true; more;) {
    const page = JSON.parse(read('gh', ['api', 'graphql', '-f', `query=${query}`, '-F', `o=${owner.login}`, '-F', `r=${name}`, '-F', `n=${pr.number}`, ...(after ? ['-f', `after=${after}`] : [])]))
      .data.repository.pullRequest.reviewThreads;
    threads.push(...page.nodes.filter((t) => !t.isResolved));
    ({ hasNextPage: more, endCursor: after } = page.pageInfo);
  }
  pr = open();
  if (!pr) stop('the pull request is no longer open');
  const reasons = checkMergeReadiness({ checks: now, statuses: statuses(), unresolved: threads.length,
    draft: pr.isDraft, head: sha, reviewedHead: pr.headRefOid });
  say(`Open review discussions: ${threads.length}${threads.length ? `: ${threads.map((t) => t.comments.nodes[0]?.path || '?').join(', ')}` : ''}`);
  for (const reason of reasons) say(`Not ready: ${reason}`);
  say(!reasons.length
    ? `Automated checks passed; the owner decides whether to merge: ${pr.url} ("Create a merge commit"); then: node tools/finish.mjs pulled`
    : 'Not ready for his merge: fix what is above, commit, and run this again');
  if (reasons.length) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
