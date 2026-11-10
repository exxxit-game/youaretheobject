import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMain } from '../tools/is-main.mjs';
import { briefFromHtml, formatBrief, checkEvidence, renderMapFields, renderCurrentState,
  updateCurrentState, readBrief, syncCurrentViews } from '../tools/corridor-brief.mjs';

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

// Changing one source updates both current views; dates and history are not rewritten.
const repaired = renderMapFields(page(data, next));
assert.equal(briefFromHtml(repaired).task.id, active.id);
assert.equal(renderMapFields(repaired), repaired);
assert.equal(briefFromHtml(renderMapFields(page(quoted, next))).task.title, quoted.active_step.title);
assert.throws(() => renderMapFields(page(data).replace('data-brief-field="proof"', 'data-brief-field="owner"')), /one visible owner/);
const stateShell = '# State\n<!-- corridor-current:start -->\nstale\n<!-- corridor-current:end -->\nHistorical result stays here.\n';
const state = updateCurrentState(stateShell, brief);
assert.ok(state.includes(renderCurrentState(brief)));
assert.ok(state.endsWith('Historical result stays here.\n'));
assert.equal(updateCurrentState(state, brief), state);
assert.throws(() => updateCurrentState(state + state, brief), /one current-state block/);

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'corridor-current-'));
try {
  fs.mkdirSync(path.join(fixture, 'docs/research'), { recursive: true });
  const manifest = { version: 1, roots: { repo: '.', papers: '.' }, topics: [], entries: [
    { id: 'corridor-project-map', title: 'Map', kind: 'map', purpose: 'Current work', reading: 'Fixture',
      topics: [], expected: 'present', location: { root: 'repo', path: 'map.html' } }
  ] };
  fs.writeFileSync(path.join(fixture, 'docs/research/perception-knowledge.json'), JSON.stringify(manifest));
  fs.writeFileSync(path.join(fixture, 'map.html'), page(data, next));
  fs.writeFileSync(path.join(fixture, 'docs/state.md'), stateShell);
  assert.throws(() => readBrief(fixture), /Visible next task differs/);
  assert.equal(syncCurrentViews(fixture).changed.length, 2);
  assert.equal(readBrief(fixture).task.id, active.id);
  assert.equal(syncCurrentViews(fixture).changed.length, 0);
  fs.writeFileSync(path.join(fixture, 'docs/state.md'), stateShell);
  assert.throws(() => readBrief(fixture), /Current state differs/);
  syncCurrentViews(fixture);
  const changedGoal = { ...data, goal: 'A changed goal', active_step: { ...active, title: 'A changed step' } };
  fs.writeFileSync(path.join(fixture, 'map.html'), page(changedGoal));
  assert.throws(() => readBrief(fixture), /Current state differs/);
  const synced = syncCurrentViews(fixture);
  assert.equal(synced.goal, changedGoal.goal);
  assert.equal(synced.task.title, changedGoal.active_step.title);
  assert.ok(fs.readFileSync(path.join(fixture, 'docs/state.md'), 'utf8').includes('A changed step'));
} finally {
  const relative = path.relative(path.resolve(os.tmpdir()), path.resolve(fixture));
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
  fs.rmSync(fixture, { recursive: true, force: true });
}
// Real directory aliases must run the CLI, while eval/import must not inherit a foreign command.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliFixture = fs.mkdtempSync(path.join(os.tmpdir(), 'corridor-cli-'));
const alias = path.join(cliFixture, 'repo alias');
try {
  fs.symlinkSync(root, alias, process.platform === 'win32' ? 'junction' : 'dir');
  assert.equal(fs.realpathSync.native(alias), fs.realpathSync.native(root));
  assert.equal(isMain(import.meta.url), true);
  if (process.platform === 'win32') assert.equal(isMain(import.meta.url, process.argv[1].toLowerCase()), true);
  assert.equal(isMain(import.meta.url, ''), false);
  assert.equal(isMain(import.meta.url, path.join(cliFixture, 'missing.mjs')), false);
  assert.equal(isMain('data:text/javascript,', process.argv[1]), false);
  const run = (args, input = '') => {
    const result = spawnSync(process.execPath, args, { cwd: cliFixture, input, encoding: 'utf8', timeout: 15000 });
    assert.ifError(result.error);
    return result;
  };
  const entryRoots = [root, alias, ...(process.platform === 'win32' ? [alias.toLowerCase()] : [])];
  for (const base of entryRoots) {
    const invalid = run([path.join(base, 'tools/corridor-brief.mjs'), '--invalid']);
    assert.equal(invalid.status, 1, invalid.stderr);
    assert.match(invalid.stderr, /Usage: node tools\/corridor-brief\.mjs/);
    const callback = run([path.join(base, 'tools/codex-review.mjs')],
      JSON.stringify({ hook_event_name: 'SessionStart', source: 'compact', cwd: cliFixture }));
    assert.equal(callback.status, 0, callback.stderr);
    assert.equal(callback.stdout.trim(), '{}');
  }
  const guardUrl = pathToFileURL(path.join(alias, 'tools/project-guard.mjs')).href;
  const helperUrl = pathToFileURL(path.join(alias, 'tools/is-main.mjs')).href;
  const script = `const { isMain } = await import(${JSON.stringify(helperUrl)}); `
    + `if (isMain(${JSON.stringify(guardUrl)})) throw Error('Foreign entry'); `
    + `await import(${JSON.stringify(guardUrl)}); console.log('imported');`;
  for (const args of [[], [path.join(cliFixture, 'missing.mjs'), 'start'], [path.join(root, 'tests/corridor-brief.test.mjs'), 'start']]) {
    const imported = run(['--input-type=module', '-e', script, ...args]);
    assert.equal(imported.status, 0, imported.stderr);
    assert.equal(imported.stdout.trim(), 'imported');
  }
} finally {
  const relative = path.relative(path.resolve(os.tmpdir()), path.resolve(cliFixture));
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative));
  if (fs.existsSync(alias)) {
    assert.ok(fs.lstatSync(alias).isSymbolicLink());
    fs.unlinkSync(alias); // Remove the link itself before recursively deleting its TEMP parent.
  }
  fs.rmSync(cliFixture, { recursive: true, force: true });
}
console.log('corridor brief: state/evidence integrity, real alias CLI and import isolation pass');
