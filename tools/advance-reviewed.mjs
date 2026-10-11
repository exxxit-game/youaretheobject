// Moves the branch `reviewed`, CodeRabbit's baseline, up to the newest commit of room-polish that
// CodeRabbit has read, once none of its remarks is open. It runs on GitHub from main's own copy
// (.github/workflows/reviewed.yml: never code the branch under review could change),
// never in a session: the party under review does not move its own reviewer's baseline. It stops one
// commit short of room-polish's head when the head itself was read:
// a base holding every commit of the pull request makes GitHub close it as merged, and the review
// window must stay open for the next push.
// Usage (GitHub Actions, GH_TOKEN set): node tools/advance-reviewed.mjs
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BASE } from './coderabbit.mjs';

const REPO = process.env.GITHUB_REPOSITORY || 'exxxit-game/youaretheobject';

// commits: room-polish's commits not yet in `reviewed`, oldest first; read(sha): CodeRabbit finished
// a review of that commit (not skipped); open: its remarks neither resolved nor outdated
export function target(commits, read, open) {
  if (open > 0 || !commits.length) return null;
  const last = commits.length - 1;
  let i = last;
  while (i >= 0 && !read(commits[i])) i--;
  if (i < 0) return null;
  const to = i === last ? i - 1 : i;
  return to >= 0 ? commits[to] : null;
}

const gh = (args) => {
  const r = spawnSync('gh', args, { encoding: 'utf8', timeout: 30000 });
  if (r.status !== 0) throw new Error(`gh ${args.slice(0, 3).join(' ')}: ${(r.stderr || '').trim()}`);
  return r.stdout;
};
const isRead = (sha) => {
  const s = JSON.parse(gh(['api', `repos/${REPO}/commits/${sha}/status`])).statuses.find((c) => /^coderabbit/i.test(c.context));
  return Boolean(s && s.state === 'success' && !/skipp/i.test(s.description || ''));
};
const openRemarks = () => {
  const [owner, name] = REPO.split('/');
  const q = `query { repository(owner: "${owner}", name: "${name}") { pullRequests(states: OPEN, baseRefName: "${BASE}", headRefName: "room-polish", first: 1) {
    nodes { reviewThreads(first: 100) { pageInfo { hasNextPage } nodes { isResolved isOutdated comments(first: 1) { nodes { author { login } } } } } } } } }`;
  const pr = JSON.parse(gh(['api', 'graphql', '-f', `query=${q}`])).data.repository.pullRequests.nodes[0];
  // no open pull request (closed, renamed, another base) or more threads than one page: the remarks
  // are unknown, and may be open, so nothing moves
  if (!pr || pr.reviewThreads.pageInfo.hasNextPage) return Infinity;
  // an outdated thread (its line changed since) is still open until CodeRabbit closes it: counted, as the
  // start line counts it (tools/coderabbit.mjs)
  return pr.reviewThreads.nodes.filter((t) => !t.isResolved && /^coderabbitai/.test(t.comments.nodes[0]?.author?.login || '')).length;
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const commits = JSON.parse(gh(['api', `repos/${REPO}/compare/${BASE}...room-polish`])).commits.map((c) => c.sha);
  const open = openRemarks();
  const to = target(commits, isRead, open);
  if (!to) console.log(`${BASE} stays: ${commits.length} new commits, ${open} open remarks`);
  else {
    // a fast-forward only: GitHub refuses to move a branch backwards or sideways without force
    gh(['api', '-X', 'PATCH', `repos/${REPO}/git/refs/heads/${BASE}`, '-f', `sha=${to}`]);
    console.log(`${BASE} moved up to ${to.slice(0, 7)}`);
  }
}
