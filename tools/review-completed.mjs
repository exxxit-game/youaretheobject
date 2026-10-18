// Required merge check: a green skipped CodeRabbit review is not a completed review.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeRabbitStatus } from './finish.mjs';

export function completedReview(statuses) {
  const review = codeRabbitStatus(statuses);
  return review?.state === 'success' && review.description === 'Review completed';
}

export async function verifyReview({ repo, number, sha, draft, token, request = fetch,
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)), attempts = 75 }) {
  if (draft) throw Error('Draft PR: review is skipped; mark ready before merge');
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo || '') || !Number.isSafeInteger(number) || number <= 0 || !/^[a-f0-9]{40}$/.test(sha || '') || !token)
    throw Error('Missing or invalid current PR identity');
  const read = async resource => {
    const response = await request(`https://api.github.com/repos/${repo}/${resource}`, {
      headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw Error(`GitHub metadata unavailable: HTTP ${response.status}`);
    return response.json();
  };
  for (let i = 0; i < attempts; i++) {
    const pr = await read(`pulls/${number}`);
    if (pr.head?.sha !== sha || pr.draft || pr.state !== 'open') throw Error('PR changed, closed or became a draft');
    const statuses = await read(`commits/${sha}/statuses?per_page=100`);
    if (!Array.isArray(statuses)) throw Error('Invalid status response');
    if (completedReview(statuses)) return;
    const review = codeRabbitStatus(statuses);
    if (review && ['failure', 'error'].includes(review.state)) throw Error('CodeRabbit ended unsuccessfully');
    if (review?.state === 'success') throw Error('CodeRabbit succeeded without completing review');
    if (i + 1 < attempts) await wait(20000);
  }
  throw Error('No completed CodeRabbit review of this PR head within 25 minutes');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
    const pr = event.pull_request;
    await verifyReview({ repo: process.env.GITHUB_REPOSITORY, number: pr?.number,
      sha: pr?.head?.sha, draft: pr?.draft, token: process.env.GITHUB_TOKEN });
    console.log('CodeRabbit completed review of the current PR head; thread resolution is enforced separately');
  } catch (error) { console.error(`Review gate: ${error.message}`); process.exitCode = 1; }
}
