import { APP_T } from './texts.ru.js';
import { PLAYTEST_KEYS } from './playtest-report.js';

// The playtest questions after a room's reveal. ui: { ask(text) → top edge for the
// answers, scale, choice }. Resolves with { next, boring, guessed, trouble, psych }.
export async function askPlaytest(ui) {
  const P = APP_T.playtest;
  const answers = {};
  for (const key of PLAYTEST_KEYS) {
    const q = P[key];
    const top = ui.ask(q.ask);
    answers[key] = await new Promise((resolve) => (q.labels
      ? ui.scale.show({ labels: q.labels, step: 1, max: 10, doneLabel: APP_T.done }, resolve, top)
      : ui.choice.show(q.answers, resolve, top)));
  }
  return answers;
}
