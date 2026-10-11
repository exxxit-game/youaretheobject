// The chat guard (tools/plain-words.mjs) run both ways on the kinds of lines I write him: what his
// rules keep out of the chat must be found, and what only quotes, names or dates must pass, or the
// guard holds every turn and teaches me to write round it. Then the stop hook itself, on a session
// record as Claude Code writes it.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RULES, findings, reminder, written } from '../tools/plain-words.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rules = (text) => findings(text).map((f) => f.rule);
const words = (text) => findings(text).flatMap((f) => f.words);

// held: the lines he named and their kind
const held = [
  ['Замер подтвердил: кадров хватает.', 'an inference told as a report'],
  ['Обезврежено сегодня: согласие и схема.', 'an inference told as a report'],
  ['Новый сеанс по-правильному ждёт проверяющего.', 'a judgment (purr or snarl word)'],
  ['Вывод: нижняя половина крепкая.', 'a judgment (purr or snarl word)'],
  ['Главное, что надо переделать: комната.', 'pretentious diction'],
  ['Сеанс прошёл весь, без сбоев.', 'allness'],
  ['Всё сохранено.', 'allness'],
  ['Всё сохранено.', 'the passive'],
  ['Скажу честно: не знаю.', 'a word that can be cut'],
  ['Сохраняю эту правку отдельным коммитом.', 'jargon'],
  ['В очках 90 кадров.', 'a new number'],
  ['Видеокарта занята на 2,4 мс.', 'a new number'],
  ['Отрисовок стало 94 из 114.', 'a new number'],
];
for (const [line, rule] of held) assert.ok(rules(line).includes(rule), `«${line}» not held as ${rule}: ${JSON.stringify(findings(line))}`);
assert.deepEqual(words('Отрисовок стало 94 из 114.'), ['94', '114'], 'the numbers are named to me');

// passed: quotes, code, links, paths, names, list numbers, dates, times, and the forms that only look alike
const passed = [
  'Ты написал «всё отлично, 19 фото», я так и записал на доске.',
  'Его ответ: "the passive 1946" — цитата.',
  'Запусти `node tools/quest-look.mjs say 3` и надень очки.',
  'Ссылка: https://example.org/page/42 и [доска](docs/board.md:42).',
  'Файл docs/research/vr/10-floor-directory.md лежит на месте.',
  'Это Quest 3 и A-Frame 1.8, огнетушитель WS-900.',
  '1. Надень очки.\n2. Нажми «Начать».\n10. Сними очки.',
  'Твоё решение от 10.10 и от 9.10.2026 стоит на доске.',
  'Ты написал в 07:56, работа перешла сюда в 2026-10-11T08:07:11Z.',
  'Это обсуждение #10 на GitHub.',
  'Не проверено: шаг в соседнюю комнату. Не сохранено: ничего.',
  'Всё ещё жду проверяющего; всё-таки он нужен; всё равно позову.',
  'У Meta не было подтверждения про страну.',
  'Нужна ссылка с доказательством.',
  'Неважно, какой рукой.',
  'Это отличие от бумаги.',
  'Простой шаг: подключи кабель.',
];
for (const line of passed) assert.deepEqual(findings(line), [], `«${line}» held: ${JSON.stringify(findings(line))}`);

// every rule names its source and what to do instead, and comes before me in the reminder
for (const r of RULES) {
  assert.ok(/Orwell|Hayakawa|Korzybski/.test(r.source) && r.fix && r.shown, `${r.rule}: no source, fix or shown words`);
  assert.ok(reminder().includes(r.rule) && reminder().includes(r.shown), `the reminder lacks ${r.rule}`);
}

// the record: only my main text after the stop hook's last word counts, and a helper's text is not his
const line = (o) => JSON.stringify(o);
const mine = (text, side = false) => line({ type: 'assistant', isSidechain: side, message: { content: [{ type: 'text', text }] } });
const hook = line({ type: 'user', isMeta: true, message: { content: 'Stop hook feedback:\n[node tools/claude-guard.mjs stop]: NOT DONE.' } });
assert.equal(written([mine('Всё отлично.'), hook, mine('Сохранил на GitHub.')].join('\n')), 'Сохранил на GitHub.', 'text checked at the last stop was read again');
assert.equal(written([mine('Читаю доску.'), mine('Всё отлично.', true)].join('\n')), 'Читаю доску.', 'a helper\'s text counted as mine');

// the stop hook holds the turn on it, and only on it: the words are named in its reason
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'plain-words-'));
const record = path.join(dir, 'session.jsonl');
const stopOn = (lines) => {
  fs.writeFileSync(record, `${[line({ type: 'user', origin: { kind: 'human' }, message: { content: 'his message' } }), ...lines].join('\n')}\n`);
  return spawnSync(process.execPath, ['tools/claude-guard.mjs', 'stop'], { cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ cwd: ROOT, transcript_path: record }) }).stderr;
};
const reason = stopOn([mine('Всё работает, кадров 90.')]);
assert.match(reason, /chat rules[^\n]*allness: всё/, 'the stop hook let an all through');
assert.match(reason, /chat rules[^\n]*a new number: 90/, 'the stop hook let a number through');
assert.doesNotMatch(stopOn([mine('Всё работает, кадров 90.'), hook, mine('Сохранил на GitHub, тест guard прошёл.')]), /chat rules/, 'the stop hook held a clean line written after its word');
// his message brings the rules in front of me; a notice does not
const prompt = (text) => spawnSync(process.execPath, ['tools/claude-guard.mjs', 'prompt'], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, OBJECT_WINDOW: path.join(dir, 'w.json'), HOME: dir, USERPROFILE: dir }, input: JSON.stringify({ cwd: ROOT, session_id: 'T', prompt: text }) }).stdout;
assert.ok(prompt('давай дальше').includes(reminder()), 'his message did not bring the chat rules');
assert.equal(prompt('<task-notification>done</task-notification>'), '', 'a notice brought the chat rules');
fs.rmSync(dir, { recursive: true, force: true });

console.log(`plain-words tests: ok (${held.length} held, ${passed.length} passed, ${RULES.length} rules with sources, the stop and prompt hooks wired)`);
