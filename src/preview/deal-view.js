import { balance, DEAL_KEY, dealStore, episode, OFFERS } from './deal-state.js';
import { bookModel } from './book-model.js';
import { T } from './texts.ru.js';

export function mountDeal(root, canAct, isOpen, stopWalking) {
  const store = dealStore(() => localStorage, navigator.locks);
  const model = bookModel(root);
  const panel = document.querySelector('#preview-deal');
  const prompt = document.querySelector('#preview-deal-prompt');
  const result = document.querySelector('#preview-deal-result');
  const money = document.querySelector('#preview-balance');
  const accept = document.querySelector('#preview-deal-accept');
  const refuse = document.querySelector('#preview-deal-refuse');
  const bargain = document.querySelector('#preview-deal-bargain');
  const controls = [accept, refuse, bargain];
  let state = null, error = false, busy = false, active = false, generation = 0;
  let rendered = '';
  const outcome = () => state && episode(state).outcome;
  const load = () => {
    try { state = store.load(); error = false; }
    catch { state = null; error = true; }
  };
  function draw() {
    const item = state && episode(state);
    panel.hidden = !active;
    model.set(outcome(), isOpen());
    const key = JSON.stringify([state, error, busy, active]);
    if (key === rendered) return;
    rendered = key;
    money.textContent = state ? T.balance(balance(state)) : T.balanceUnknown;
    panel.dataset.outcome = outcome() ?? 'unknown';
    for (const button of controls) button.hidden = !item || item.outcome !== 'open';
    prompt.textContent = T.bookPremise;
    result.textContent = error ? T.saveError : !item ? '' :
      item.outcome === 'burned' ? T.burned(item.paid) :
      item.outcome === 'refused' ? T.refused : T.offer(OFFERS[item.offer]);
    if (!item) return;
    accept.textContent = T.accept(OFFERS[item.offer]);
    refuse.textContent = T.refuse;
    bargain.textContent = item.offer === OFFERS.length - 1 ? T.lastOffer : T.bargain;
    for (const button of controls) button.disabled = busy || error;
    bargain.disabled ||= item.offer === OFFERS.length - 1;
  }
  async function act(action) {
    if (!active || !canAct() || !state || error || busy || document.hidden) return;
    const token = generation, quote = episode(state).offer;
    stopWalking(); busy = true; draw();
    try {
      state = await store.act(action, quote, () => token === generation && active && canAct() && !document.hidden);
      error = false;
    } catch {
      // Re-read: a write may have succeeded before verification failed. Never
      // invent an unburned book/zero ledger from a failed persistence operation.
      load(); error = true;
    } finally { busy = false; draw(); }
  }
  accept.addEventListener('click', () => act('accept'));
  refuse.addEventListener('click', () => act('refuse'));
  bargain.addEventListener('click', () => act('bargain'));
  panel.addEventListener('focusin', stopWalking);
  const cancel = () => { generation++; stopWalking(); };
  addEventListener('blur', cancel);
  document.addEventListener('visibilitychange', cancel);
  addEventListener('storage', event => {
    if (event.key === DEAL_KEY || event.key === null) { cancel(); load(); draw(); }
  });
  load();
  return {
    update() {
      const inside = canAct();
      if (active && !inside) cancel();
      if (!active && inside) load();
      active = inside;
      draw();
    },
    leave() { cancel(); active = false; draw(); }
  };
}
