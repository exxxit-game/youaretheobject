import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { briefFromHtml, formatBrief, checkEvidence } from '../tools/corridor-brief.mjs';

const next = { id: 'T01', title: 'Complete delivery', why: 'Check actual work',
  in: 'Current sources', out: 'Version verified', bounds: 'No publication',
  owner: 'Lead', proof: 'Rerun the original failing check' };
const active = { ...next, id: 'T01b', title: 'Adapt review', out: 'Current review completed' };
const obstacle = { id: 'B01', open: true, status: 'Open', affected: 'Map visual inspection only', next: 'Needs supported access' };
const data = { schema: 1, updated: '2026-11-07', goal: 'Discover another view', next,
  authorPurpose: 'Personal meaning beyond the current scene',
  active_step: active, obstacles: [obstacle], authority: 'approved-plan.txt' };
const encoded = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const page = (record, shown = record.active_step || record.next) =>
  `<p data-brief-field="goal">${encoded(record.goal)}</p>`
  + `<p data-brief-field="authorPurpose">${encoded(record.authorPurpose)}</p><section id="next">`
  + Object.entries(shown).map(([key, value]) => `<span data-brief-field="${key}">${encoded(value)}</span>`).join('')
  + '</section>'
  + `<script type="application/json" id="project-map-data">${JSON.stringify(record)}</script>`;

// A specific next step must win over a broad delivery milestone, without hiding an unrelated limit.
const brief = briefFromHtml(page(data));
assert.equal(brief.task.id, 'T01b');
assert.equal(brief.blockers[0].affects, 'Map visual inspection only');
assert.equal(data.obstacles[0].status, 'Open');
assert.match(formatBrief(brief), /Recorded state only/);
// Restoring the current technical step must not drop the owner's wider purpose.
assert.equal(brief.authorPurpose, data.authorPurpose);
assert.match(formatBrief(brief), /Author's purpose: Personal meaning beyond the current scene/);
assert.throws(() => briefFromHtml(page({ ...data, authorPurpose: undefined })), /missing authorPurpose/);
assert.throws(() => briefFromHtml(page(data).replace(data.authorPurpose, 'A different purpose')), /Visible authorPurpose differs/);

// Refuse the real drift case: structured status advanced while the visible card still shows the old task.
assert.throws(() => briefFromHtml(page(data, next)), /Visible next task differs/);
assert.throws(() => briefFromHtml(page({ ...data, active_step: next }, { ...next, id: 'T01b' })), /differs.*id/);
assert.throws(() => briefFromHtml(page(data, { ...active, bounds: 'Publish immediately' })), /Visible next task differs/);
assert.throws(() => briefFromHtml(page({ ...data, active_step: { ...active, proof: '' } })), /missing proof/);
assert.throws(() => briefFromHtml(page(data).replace(data.goal, 'Another goal')), /Visible goal differs/);
assert.throws(() => briefFromHtml(page({ ...data, obstacles: undefined })), /obstacle list/);
assert.throws(() => briefFromHtml(page({ ...data, obstacles: [{ id: 'B01' }] })), /Incomplete obstacle/);
assert.throws(() => briefFromHtml(page(data) + page(data)), /exactly one/);
assert.throws(() => briefFromHtml(page({ ...data, authority: '' })), /missing authority/);
assert.equal(briefFromHtml(page({ ...data, obstacles: [{ ...obstacle, open: false }] })).blockers.length, 0);
// The real B18 failure: a missing flag must not silently reopen a closed record.
for (const open of [undefined, null, 'false', 0]) {
  assert.throws(() => briefFromHtml(page({ ...data, obstacles: [{ ...obstacle, open }] })), /explicit boolean/);
}
const closed = { ...obstacle, id: 'B18', open: false, status: 'Closed: original update verified' };
const mixed = briefFromHtml(page({ ...data, obstacles: [closed, { ...obstacle, id: 'B16' }] }));
assert.deepEqual(mixed.blockers.map(item => item.id), ['B16']);
assert.doesNotMatch(formatBrief(mixed), /Open limitation B18/);
const quoted = { ...data, active_step: { ...active, title: "Owner's <task> & review" } };
for (const quote of ['&#39;', '&#x27;', "'"]) {
  assert.equal(briefFromHtml(page(quoted).replaceAll('&#39;', quote)).task.title, quoted.active_step.title);
}
assert.equal(briefFromHtml(page(quoted).replaceAll('&amp;', '&AMP;')).task.title, quoted.active_step.title);
assert.throws(() => briefFromHtml(page(data).replace('data-brief-field="proof"', 'data-brief-field="owner"')), /one visible owner/);

// The map is source data, not a program granted permission to run during context restoration.
assert.equal(globalThis.mapExecuted, undefined);
briefFromHtml(page(data) + '<script>globalThis.mapExecuted = true;</script>');
assert.equal(globalThis.mapExecuted, undefined);

// Only the explicitly current receipt is checked; changing its bytes invalidates its proof.
const receipt = Buffer.from('verified receipt');
const evidence = { path: '/current/receipt.json', sha256: crypto.createHash('sha256').update(receipt).digest('hex') };
assert.deepEqual(checkEvidence([], () => assert.fail('No library scan expected')), []);
assert.equal(checkEvidence(evidence, () => receipt)[0].status, 'matched');
const changed = checkEvidence(evidence, () => Buffer.from('verified receipt!'));
assert.equal(changed[0].status, 'changed');
assert.equal(evidence.sha256, crypto.createHash('sha256').update(receipt).digest('hex'));
assert.match(formatBrief({ ...brief, evidenceChecks: changed }), /Evidence changed.*receipt\.json/);
assert.equal(checkEvidence(evidence, () => { throw Object.assign(new Error('missing'), { code: 'ENOENT' }); })[0].status, 'unavailable');
assert.throws(() => checkEvidence({ ...evidence, sha256: '' }), /Invalid current evidence/);
const historical = briefFromHtml(page({ ...data, oldReview: { path: '/old', sha256: 'old', evidenceStatus: 'historical' } }));
assert.deepEqual(historical.historicalEvidence, ['oldReview']);
assert.match(formatBrief(historical), /Historical content review.*oldReview/);
console.log('corridor brief: explicit states, visible/data drift, current receipt integrity and historical scope pass');
