import { PROTOCOL } from './protocol.js';
import { T } from './texts.ru.js';
import { APP_T } from '../../app/texts.ru.js';
import { eventLog } from '../../engine/log.js';

// The measures after the trials (pp. 449–451): judgment of control first, then
// if-press, if-not-press and total percentages (p. 454 says total was completed
// last; p. 450 lists it second — we follow the completion order), then
// the post-questionnaire, then our additions (gender, age group, prior knowledge).
// Every answer goes to the event log as { key, value }.
const Q = T.questions;
const SCALES = [
  ['control', Q.control.labels, ''],
  ['ifPress', T.percentLabels, '%'],
  ['ifNoPress', T.percentLabels, '%'],
  ['total', T.percentLabels, '%'],
  ['certainty', Q.certainty.labels, '']
];
const CHOICES = ['evidence', 'hypotheses', 'gender', 'age', 'knew'];
// Reasons are shown in a random order per player so that no reason gains from
// being first; the last answer ("other") stays last. The log keeps the index in texts.ru.js.
const SHUFFLED = new Set(['evidence']);

function displayOrder(key, n, rand) {
  const order = Array.from({ length: n }, (_, i) => i);
  if (!SHUFFLED.has(key)) return order;
  const last = order.pop();
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return [...order, last];
}

// ui: { ask(text) shows the question and returns the top edge for the answers, scale, choice }
export async function askAll(ui, rand = Math.random) {
  for (const [key, labels, unit] of SCALES) {
    const top = ui.ask(Q[key].ask);
    const value = await new Promise((resolve) =>
      ui.scale.show({ labels, step: PROTOCOL.scaleStep, unit, doneLabel: APP_T.done }, resolve, top));
    eventLog.add('answer', { key, value });
  }
  for (const key of CHOICES) {
    const top = ui.ask(Q[key].ask);
    const order = displayOrder(key, Q[key].answers.length, rand);
    const shown = await new Promise((resolve) => ui.choice.show(order.map(i => Q[key].answers[i]), resolve, top));
    // pos = where it was shown, so a position effect can be checked later
    eventLog.add('answer', { key, value: order[shown], pos: shown });
  }
}
