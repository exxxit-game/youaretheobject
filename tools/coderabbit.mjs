// CodeRabbit's open remarks, read at every session start. CodeRabbit is the reviewer from outside (the
// owner's 14-day trial): it reads the pull request from room-polish into the branch `reviewed`, the last
// state it has already read, and writes its remarks on GitHub, where a remark nobody reads changes
// nothing. A pull request into main held three days of work, 428 files, over its limit of 300, so it
// read nothing; against `reviewed` it sees only what is new. A robot on GitHub moves `reviewed` up once a
// push is read and no remark is open (tools/advance-reviewed.mjs), never this session.
// Usage: node tools/coderabbit.mjs   (one line; nothing printed when GitHub cannot be reached)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const REPO = 'exxxit-game/youaretheobject';
export const BASE = 'reviewed';
export const FILE_LIMIT = 300;
const [OWNER, NAME] = REPO.split('/');
const QUERY = `query { repository(owner: "${OWNER}", name: "${NAME}") {
  pullRequests(states: OPEN, baseRefName: "${BASE}", headRefName: "room-polish", first: 1) { nodes { number url headRefOid changedFiles
    commits(last: 1) { nodes { commit { committedDate status { contexts { context state description } } } } }
    reviews(last: 30) { nodes { author { login } submittedAt body } }
    reviewThreads(first: 100) { pageInfo { hasNextPage } nodes { isResolved isOutdated comments(first: 1) { nodes { author { login } path } } } } } } } }`;

// A push it has not read for hours may never be read: after the trial a public repository under 10
// stars is reviewed only when asked ("For public repositories with less than 10 stars, CodeRabbit
// requires reviews to be triggered manually", docs.coderabbit.ai/management/plans), so the line says
// how long the head has waited and, past WAIT hours, how to ask.
export const WAIT = 2;
// Remarks with no thread of their own sit inside its review bodies ("Nitpick comments (n)", "Outside diff
// range comments (n)"); an audit of every remark found that only these went unanswered, so the line also
// counts those of the last day's reviews
export const DAY = 24 * 3600000;
export function untracked(reviews, now = Date.now()) {
  const recent = (reviews || []).filter((r) => /^coderabbitai/.test(r.author?.login || '') && now - Date.parse(r.submittedAt) < DAY);
  const count = (re) => recent.reduce((n, r) => n + [...String(r.body).matchAll(re)].reduce((a, m) => a + Number(m[1]), 0), 0);
  return { nitpicks: count(/Nitpick comments \((\d+)\)/g), outside: count(/Outside diff range comments \((\d+)\)/g) };
}
// what to say at the start of a session
export function summarize(data, now = Date.now()) {
  const pr = data?.data?.repository?.pullRequests?.nodes?.[0];
  if (!pr) return { line: `CodeRabbit: no open pull request from room-polish into ${BASE}, so nothing is reviewed: open one (gh pr create --base ${BASE} --head room-polish)` };
  const said = base(pr, now);
  const { nitpicks, outside } = untracked(pr.reviews?.nodes, now);
  return nitpicks + outside ? { line: `${said.line}. Its reviews of the last day also hold ${nitpicks} nitpick and ${outside} outside-diff remarks with no thread: read each in the reviews (gh pr view ${pr.number} --comments) and fix it or answer it` } : said;
}
function base(pr, now) {
  // an outdated thread is one whose line changed since; it stays a remark until CodeRabbit closes it
  const open = pr.reviewThreads.nodes.filter((t) => !t.isResolved && /^coderabbitai/.test(t.comments.nodes[0]?.author?.login || ''));
  if (pr.reviewThreads.pageInfo?.hasNextPage) return { line: `CodeRabbit: more than 100 remark threads on ${pr.url}: read them on GitHub (gh pr view ${pr.number} --comments) before other work` };
  const status = (pr.commits.nodes[0]?.commit?.status?.contexts || []).find((c) => /^coderabbit/i.test(c.context));
  const skipped = status && /skipp/i.test(status.description || '');
  const read = status?.state === 'SUCCESS' && !skipped;
  if (open.length) {
    const files = [...new Set(open.map((t) => t.comments.nodes[0].path).filter(Boolean))];
    return { line: `CodeRabbit: ${open.length} open remark${open.length === 1 ? '' : 's'} on ${pr.url} (${files.slice(0, 4).join(', ')}${files.length > 4 ? ', …' : ''}): read them before other work (gh pr view ${pr.number} --comments), fix the real ones, answer the rest; CodeRabbit closes its own` };
  }
  if (skipped) return { line: `CodeRabbit skipped the last push (${status.description}) on ${pr.url}: ${pr.changedFiles > FILE_LIMIT ? `${pr.changedFiles} files against its limit of ${FILE_LIMIT}; ` : ''}ask it again with a comment "@coderabbitai review"` };
  if (!read) {
    const at = Date.parse(pr.commits.nodes[0]?.commit?.committedDate || ''), hours = Number.isNaN(at) ? null : Math.floor((now - at) / 3600000);
    const waited = hours === null ? '' : ` (waiting ${hours} h)`;
    return { line: `CodeRabbit: the last push to ${pr.url} is not read yet${waited}${hours >= WAIT ? `: past ${WAIT} h it may never come (a public repository under 10 stars is reviewed only when asked once the trial ends); ask with a comment "@coderabbitai review"` : ''}` };
  }
  return { line: `CodeRabbit: no open remarks on ${pr.url}; the robot on GitHub moves ${BASE} up` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const gh = (args) => spawnSync('gh', args, { encoding: 'utf8', timeout: 8000, windowsHide: true });
  const r = gh(['api', 'graphql', '-f', `query=${QUERY}`]);
  let said = null;
  try { said = r.status === 0 ? summarize(JSON.parse(r.stdout)) : null; } catch { /* an answer that is not JSON: say nothing */ }
  if (said) console.log(said.line);
}
