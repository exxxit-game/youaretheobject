// A window's end in one command, so its steps do not rest on memory: the branch pushed,
// its pull request into room-polish opened, CodeRabbit asked to review, GitHub's checks waited for, and what is
// left printed. The merge stays his button on GitHub ("Create a merge commit"): tools/claude-guard.mjs refuses a
// merge by command, since it cannot tell room-polish from main. After his merge, `pulled` brings the main folder up.
// CodeRabbit: open-source projects get its Team features free, and a repository under 10 stars "must trigger
// reviews manually" with the comment `@coderabbitai review` (docs.coderabbit.ai/management/plans;
// our trial's end: docs/state.md), so the comment is posted whenever its review has not started by itself.
// Usage: node tools/finish.mjs [--title "…" --body-file <file>]   (the title and body only for a new pull request)
//        node tools/finish.mjs pulled
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

if (process.argv[2] === 'pulled') {
  // the main folder is the first worktree git lists (git-worktree(1): "the main worktree is listed first")
  const main = read('git', ['worktree', 'list', '--porcelain']).split('\n').find((l) => l.startsWith('worktree '))?.slice(9);
  if (!main) stop('no main folder found');
  say(read('git', ['-C', main, 'pull', '--ff-only']) || 'up to date');
  say(`main folder ${main}: ${read('git', ['-C', main, 'log', '--oneline', '-1'])}`);
  process.exit(0);
}

if (read('git', ['status', '--porcelain'])) stop('uncommitted changes: commit them first (by command, so the hooks run)');
const branch = read('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
if (!branch.startsWith('claude/')) stop(`on ${branch}: a window's branch (claude/…) goes into ${BASE}, nothing else`);
run('git', ['push', '-u', 'origin', branch], { stdio: 'inherit' }); // the pre-push hook checks for secrets first

const { owner, name } = JSON.parse(read('gh', ['repo', 'view', '--json', 'owner,name']));
const repo = `${owner.login}/${name}`;
const open = () => JSON.parse(read('gh', ['pr', 'list', '--head', branch, '--base', BASE, '--state', 'open', '--json', 'number,url']))[0];
let pr = open();
if (!pr) {
  const title = arg('--title'), body = arg('--body-file');
  if (!title || !body) stop('no open pull request yet: give --title "…" and --body-file <file> for it');
  run('gh', ['pr', 'create', '--base', BASE, '--head', branch, '--title', title, '--body-file', body]);
  pr = open();
}
say(`pull request #${pr.number}: ${pr.url}`);

// CodeRabbit's own commit status (commit_status: true in .coderabbit.yaml) shows its review of this push began
const sha = read('git', ['rev-parse', 'HEAD']);
const reviewing = () => JSON.parse(read('gh', ['api', `repos/${repo}/commits/${sha}/statuses`])).some((s) => /coderabbit/i.test(s.context));
let asked = false;
for (let i = 0; i < 6 && !reviewing(); i++) await pause(30000);
if (!reviewing()) {
  run('gh', ['pr', 'comment', String(pr.number), '--body', '@coderabbitai review']);
  asked = true;
}
say(asked ? 'CodeRabbit had not started by itself: asked by comment' : 'CodeRabbit started by itself');

// GitHub's checks (the tests and CodeRabbit's status), read once a minute until none is pending; the test run
// takes 7-14 minutes (docs/state.md), so 45 minutes is the limit. `gh pr checks` exits non-zero while any
// check is pending or failed, so its JSON is read from the error too
const checks = () => {
  try { return JSON.parse(read('gh', ['pr', 'checks', String(pr.number), '--json', 'name,bucket'])); } catch (e) {
    try { return JSON.parse(e.stdout || '[]'); } catch { return []; }
  }
};
let now = checks();
for (let i = 0; i < 45 && (!now.length || now.some((c) => c.bucket === 'pending')); i++) { await pause(60000); now = checks(); }
const green = now.length > 0 && now.every((c) => ['pass', 'skipping'].includes(c.bucket));
for (const c of now) say(`  ${c.name}: ${c.bucket}`);

// CodeRabbit's remarks still open: each must be fixed, or shown wrong by a test or doc it accepts (CLAUDE.md step 6)
const query = 'query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved comments(first:1){nodes{author{login} path}}}}}}}';
const threads = JSON.parse(read('gh', ['api', 'graphql', '-f', `query=${query}`, '-F', `o=${owner.login}`, '-F', `r=${name}`, '-F', `n=${pr.number}`]))
  .data.repository.pullRequest.reviewThreads.nodes.filter((t) => !t.isResolved);
say(`GitHub's checks: ${green ? 'all green' : 'NOT green: see the checks above'}`);
say(`CodeRabbit's open remarks: ${threads.length}${threads.length ? `: ${threads.map((t) => t.comments.nodes[0]?.path || '?').join(', ')}` : ''}`);
say(green && !threads.length
  ? `Ready for his merge: ${pr.url} ("Create a merge commit"); then: node tools/finish.mjs pulled`
  : 'Not ready for his merge: fix what is above, commit, and run this again');
