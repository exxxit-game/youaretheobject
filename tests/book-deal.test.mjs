import assert from 'node:assert/strict';
import { balance, changeDeal, DEAL_KEY, dealStore, episode, freshDeal, OFFERS, readDeal } from '../src/preview/deal-state.js';
import { BOOK_STAND } from '../src/preview/layout.js';
import { walk } from '../src/preview/route.js';

assert.deepEqual(OFFERS, [100, 250, 500, 1000]);
let state = freshDeal();
for (let i = 0; i < 8; i++) state = changeDeal(state, 'bargain', episode(state).offer);
assert.equal(episode(state).offer, 3, 'bargaining stops at the shared trial cap');
assert.equal(balance(state), 0, 'bargaining alone neither burns nor pays');
assert.equal(episode(readDeal(JSON.stringify(state))).offer, 3, 'reload preserves the reached offer');
const burned = changeDeal(state, 'accept', 3);
assert.equal(balance(burned), 1000);
assert.equal(episode(burned).outcome, 'burned');
for (const action of ['accept', 'refuse', 'bargain']) {
  assert.deepEqual(changeDeal(burned, action, 0), burned, 'a completed episode is terminal, including stale callbacks');
}
const refused = changeDeal(freshDeal(), 'refuse', 0);
assert.equal(balance(refused), 0);
assert.equal(episode(refused).outcome, 'refused');
assert.deepEqual(changeDeal(refused, 'bargain', 0), refused, 'a refusal ends all offers');
assert.throws(() => changeDeal(state, 'accept', 0), /stale/, 'an earlier price cannot commit a later quote');
for (const raw of ['{', '{}', 'null', '{"version":2}',
  JSON.stringify({ ...freshDeal(), extra: true }),
  JSON.stringify({ version: 1, episodes: { 'intro-book': { offer: -1, outcome: 'open', paid: 0 } } }),
  JSON.stringify({ version: 1, episodes: { 'intro-book': { offer: 0, outcome: 'burned', paid: 1000 } } })]) {
  assert.throws(() => readDeal(raw), 'invalid saves do not become a new unpaid attempt');
}
assert.deepEqual(readDeal(null), freshDeal());
const values = new Map([['unrelated', 'keep']]);
const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
const locks = { request: async (name, options, fn) => fn({ name }) };
const store = dealStore(() => storage, locks);
assert.equal(episode(store.load()).outcome, 'open');
await store.act('accept', 0, () => false);
assert.equal(values.has(DEAL_KEY), false, 'an outside or cancelled input cannot create a decision');
await store.act('bargain', 0, () => true);
assert.equal(episode(store.load()).offer, 1);
assert.equal(balance(store.load()), 0);
await store.act('accept', 1, () => true);
const after = values.get(DEAL_KEY);
await store.act('accept', 1, () => true);
assert.equal(values.get(DEAL_KEY), after, 'duplicate acceptance writes no second reward');
const reloaded = dealStore(() => storage, locks);
assert.equal(balance(reloaded.load()), 250, 'new visit/floor/store instance uses the same episode ledger');
await reloaded.act('refuse', 0, () => true);
assert.equal(values.get(DEAL_KEY), after, 'a stale tab cannot reverse a completed decision');
assert.equal(values.get('unrelated'), 'keep');
const broken = dealStore(() => ({ ...storage, setItem: () => { throw Error('quota'); } }), locks);
values.delete(DEAL_KEY);
await assert.rejects(broken.act('accept', 0, () => true), /quota/);
assert.equal(values.has(DEAL_KEY), false, 'failed persistence cannot leave an accepted local record');
await assert.rejects(dealStore(() => storage, null).act('accept', 0, () => true), /lock-unavailable/);
await assert.rejects(dealStore(() => storage, { request: async (name, options, fn) => fn(null) })
  .act('accept', 0, () => true), /busy/);
assert.throws(() => dealStore(() => { throw Error('denied'); }, locks).load(), /denied/);
const delayed = [];
const waiting = dealStore(() => storage, { request: (name, options, fn) => new Promise(resolve => delayed.push(() => resolve(fn({ name })))) });
let inside = true;
const pending = waiting.act('accept', 0, () => inside);
inside = false; delayed[0](); await pending;
assert.equal(values.has(DEAL_KEY), false, 'leaving before lock acquisition cancels the action');
const b = BOOK_STAND, position = { x: b.x - 0.9, z: b.z, y: 0, floor: 0 };
const stopped = walk(position, 1, 0, true);
assert.ok(stopped.x < b.x - b.width / 2, 'the player cannot walk through the book stand');
console.log('book deal: finite offers, refusal, stable episode/payment, corrupt/blocked saves, late input and stand collision pass');
