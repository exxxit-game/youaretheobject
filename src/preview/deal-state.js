// Trial ladder, not the whole economy; see docs/rooms/book-deal-preview.md.
// MDN Window.localStorage and Web Locks API: one record keeps the decision and
// its payment together, with an exclusive lock for same-origin writers.
export const OFFERS = Object.freeze([100, 250, 500, 1000]);
export const EPISODE = 'intro-book';
export const DEAL_KEY = 'object-corridor-deal-v1';
export const freshDeal = () => ({ version: 1, episodes: {
  [EPISODE]: { offer: 0, outcome: 'open', paid: 0 }
} });
export const episode = state => state.episodes[EPISODE];
export const balance = state => Object.values(state.episodes).reduce((sum, item) => sum + item.paid, 0);

export function readDeal(raw) {
  if (raw === null) return freshDeal();
  const state = JSON.parse(raw), item = state?.episodes?.[EPISODE];
  if (state?.version !== 1 || Object.keys(state).sort().join() !== 'episodes,version' ||
      !state.episodes || Object.keys(state.episodes).join() !== EPISODE || !item ||
      Object.keys(item).sort().join() !== 'offer,outcome,paid' ||
      !Number.isInteger(item.offer) || item.offer < 0 || item.offer >= OFFERS.length ||
      !['open', 'burned', 'refused'].includes(item.outcome) ||
      item.paid !== (item.outcome === 'burned' ? OFFERS[item.offer] : 0)) {
    throw Error('invalid-deal-save');
  }
  return state;
}

export function changeDeal(state, action, quotedOffer) {
  const item = episode(state);
  if (item.outcome !== 'open') return state;
  if (!['bargain', 'accept', 'refuse'].includes(action)) throw Error('invalid-deal-action');
  if (quotedOffer !== item.offer) throw Error('stale-deal-offer');
  const next = { ...item };
  if (action === 'bargain') next.offer = Math.min(item.offer + 1, OFFERS.length - 1);
  if (action === 'accept') { next.outcome = 'burned'; next.paid = OFFERS[item.offer]; }
  if (action === 'refuse') next.outcome = 'refused';
  return { version: 1, episodes: { [EPISODE]: next } };
}

export function dealStore(storage, locks) {
  const load = () => readDeal(storage().getItem(DEAL_KEY));
  return {
    load,
    async act(action, quotedOffer, allowed) {
      // No unlocked fallback: two tabs must not overwrite a completed decision.
      if (!locks?.request) throw Error('deal-lock-unavailable');
      return locks.request(DEAL_KEY, { ifAvailable: true }, lock => {
        if (!lock) throw Error('deal-busy');
        const before = load();
        if (!allowed()) return before; // A late callback after leaving is not consent.
        const after = changeDeal(before, action, quotedOffer);
        if (after !== before) {
          const encoded = JSON.stringify(after);
          storage().setItem(DEAL_KEY, encoded);
          if (storage().getItem(DEAL_KEY) !== encoded) throw Error('deal-save-not-confirmed');
        }
        return after;
      });
    }
  };
}
