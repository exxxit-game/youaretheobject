import assert from 'node:assert/strict';
import { completedReview, verifyReview } from '../tools/review-completed.mjs';
const sha = 'a'.repeat(40), complete = { context: 'CodeRabbit', state: 'success',
  description: 'Review completed', creator: { login: 'coderabbitai[bot]' } };
assert.ok(completedReview([complete]));
for (const changed of [{ description: 'Review skipped' }, { state: 'pending' }, { creator: { login: 'another-user' } }])
  assert.equal(completedReview([{ ...complete, ...changed }]), false);
const options = { repo: 'fixture/repo', number: 28, sha, draft: false, token: 'fixture', attempts: 2, wait: async () => {} };
const response = value => ({ ok: true, json: async () => value });
let queries = 0;
await verifyReview({ ...options, request: async url => {
  queries++; return response(url.includes('/pulls/') ? { head: { sha }, state: 'open' } : [complete]);
} });
assert.equal(queries, 2);
await assert.rejects(verifyReview({ ...options, draft: true }), /Draft PR/);
await assert.rejects(verifyReview({ ...options, request: async () => response({ head: { sha: 'b'.repeat(40) }, state: 'open' }) }), /PR changed/);
await assert.rejects(verifyReview({ ...options, request: async url => response(url.includes('/pulls/')
  ? { head: { sha }, state: 'open' } : [{ ...complete, description: 'Review skipped' }]) }), /without completing/);
await assert.rejects(verifyReview({ ...options, request: async () => ({ ok: false, status: 403 }) }), /HTTP 403/);
await assert.rejects(verifyReview({ ...options, request: async url => response(url.includes('/pulls/')
  ? { head: { sha }, state: 'open' } : []) }), /within 25 minutes/);
console.log('review completed gate: skipped/spoofed/stale/missing review and API failure cannot pass: ok');
