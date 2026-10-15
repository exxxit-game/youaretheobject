// Reveal pages of room 01: every page renders real text (no "undefined", "NaN",
// "null"), and the numbers shown match original.js.
import assert from 'node:assert/strict';
import { analyse } from '../src/rooms/01-control/report.js';
import { revealPages } from '../src/rooms/01-control/reveal.js';

const trial = (n, press, green) => ({ t: n, k: 'trial', v: { n, press, green } });
const answer = (key, value) => ({ t: 99, k: 'answer', v: { key, value } });
const run = (gender, pressAll = false) => analyse([
  ...Array.from({ length: 40 }, (_, i) => trial(i + 1, pressAll || i % 2 === 0, i % 4 !== 0)),
  answer('control', 45), answer('total', 70), answer('ifPress', 70), answer('ifNoPress', 60),
  answer('certainty', 50), answer('evidence', 1), answer('hypotheses', 1), answer('gender', gender), answer('knew', 1)
]);
const text = (pages) => pages.map(p => p.map(b => b.t).join('\n')).join('\n\n');

for (const condition of ['25-25', '75-75']) {
  for (const gender of [0, 1, 2]) {
    for (const pressAll of [false, true]) {
      const pages = revealPages(run(gender, pressAll), condition);
      assert.equal(pages.length, 6);
      const all = text(pages);
      assert.ok(!/undefined|NaN|null|\[object/.test(all), `bad text (${condition}, ${gender}):\n${all}`);
      assert.ok(all.includes(`«${condition.split('-')[0]}%»`));
    }
  }
}

const all = text(revealPages(run(1), '75-75'));
for (const s of ['Из 40 попыток вы нажали кнопку 20 раз.', '64 студента', 'мужчины 30, женщины 51', 'мужчины ставили в среднем 20 баллов из 100, женщины — 8',
  'только 6%', 'Женщины без признаков депрессии ставили в этом варианте в среднем 51 из 100 (в группе — 8 человек).', 'в среднем 18–28 из 100 при 25% и 34–37 при 75%',
  'В 2022 году', 'В вариантах без управления — 242 человека.', 'Вы оценили своё управление в 45 из 100.']) {
  assert.ok(all.includes(s), `missing: ${s}\n---\n${all}`);
}
// comparison with other players: enough players, too few, unavailable
{
  const many = text(revealPages(run(1), '75-75', { '75-75': { n: 120, control: 41.6, zero: 7.9 } }));
  assert.ok(many.includes('впервые прошли 120 игроков. В среднем они оценили своё управление в 42 из 100. Ноль поставили 8%.'), many);
  const few = text(revealPages(run(1), '25-25', { '25-25': { n: 3 } }));
  assert.ok(few.includes('пока 3 игрока'), few);
  const none = text(revealPages(run(1), '25-25', null));
  assert.ok(none.includes('Сравнение с другими игроками сейчас недоступно.'));
}
// "prefer not to say": no gender comparison line
assert.ok(!text(revealPages(run(2), '75-75')).includes('в этом варианте ставили'));
console.log('control reveal tests: ok');
