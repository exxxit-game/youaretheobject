import { createPairedView } from '../../engine/paired-view.js';
import { ASPECTS, PREVIEW, PROTOCOL } from './protocol.js';
import { analyse } from './report.js';

export function createPreview(random = Math.random, clock) {
  const pair = createPairedView(PROTOCOL, clock);
  let state = 'idle', index = 0, level = PREVIEW.initialLevel, log = [], generation = 0;
  let order = ['same', 'different'];
  const pairActive = () => ['first', 'blank', 'second', 'answer'].includes(pair.state);
  const start = () => {
    const alteredView = random() < 0.5 ? 'first' : 'second';
    order = random() < 0.5 ? ['same', 'different'] : ['different', 'same'];
    if (!pair.begin({ id: ASPECTS[index], alteredView })) return false;
    state = 'pair'; generation++; return true;
  };
  return {
    get state() { return pairActive() || pair.state === 'interrupted' ? pair.state : state; },
    get token() { return pair.token; }, get generation() { return generation; },
    get aspect() { return ASPECTS[index]; }, get index() { return index; },
    get level() { return level; }, get strength() { return PREVIEW.levels[level]; },
    get altered() { return pair.current?.alteredView === pair.state; },
    get order() { return [...order]; }, get held() { return pair.held; },
    begin() { pair.leave(); index = 0; level = PREVIEW.initialLevel; log = []; state = 'intro'; generation++; },
    next() {
      if (pair.held) return false;
      if (state === 'intro') { state = 'ready'; generation++; return true; }
      if (this.state !== 'feedback') return false;
      pair.leave(); index++; level = PREVIEW.initialLevel; state = index === ASPECTS.length ? 'done' : 'ready';
      generation++; return true;
    },
    start() { return !pair.held && ['ready', 'feedback', 'interrupted'].includes(this.state) ? start() : false; },
    adjust(delta) {
      if (pair.held || !['ready', 'feedback'].includes(this.state) || ![-1, 1].includes(delta)) return false;
      level = Math.max(0, Math.min(PREVIEW.levels.length - 1, level + delta));
      generation++; return true;
    },
    present() { return pair.present(pair.token); }, tick() { return pair.tick(); },
    answer(value, token) {
      if (!pair.answer(value, token)) return false;
      log.push({ ...pair.result, aspect: ASPECTS[index], strength: PREVIEW.levels[level] });
      state = 'feedback'; generation++; return true;
    },
    hold(on) { const changed = pair.hold(on); if (changed) generation++; return changed; },
    report() { return analyse(log); },
    leave() { pair.leave(); state = 'idle'; log = []; generation++; }
  };
}
