import assert from 'node:assert/strict';
import { briefFromHtml, formatBrief } from '../tools/corridor-brief.mjs';

const next = { id: 'T01', title: 'Complete delivery', why: 'Check actual work',
  in: 'Current sources', out: 'Version verified', bounds: 'No publication',
  owner: 'Lead', proof: 'Rerun the original failing check' };
const active = { ...next, id: 'T01b', title: 'Adapt review', out: 'Current review completed' };
const obstacle = { id: 'B01', status: 'Open', affected: 'Map visual inspection only', next: 'Needs supported access' };
const data = { schema: 1, updated: '2026-11-07', goal: 'Discover another view', next,
  active_step: active, obstacles: [obstacle], authority: 'approved-plan.txt' };
const encoded = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const page = (record, shown = record.active_step || record.next) =>
  `<p data-brief-field="goal">${encoded(record.goal)}</p><section id="next">`
  + Object.entries(shown).map(([key, value]) => `<span data-brief-field="${key}">${encoded(value)}</span>`).join('')
  + '</section>'
  + `<script type="application/json" id="project-map-data">${JSON.stringify(record)}</script>`;

// A specific next step must win over a broad delivery milestone, without hiding an unrelated limit.
const brief = briefFromHtml(page(data));
assert.equal(brief.task.id, 'T01b');
assert.equal(brief.blockers[0].affects, 'Map visual inspection only');
assert.equal(data.obstacles[0].status, 'Open');
assert.match(formatBrief(brief), /Recorded state only/);

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
console.log('corridor brief: active step, visible/data drift, scope and non-execution pass');
