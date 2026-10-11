// What the owner reads in the chat holds no new numbers and no empty words (docs/owner-decisions.md,
// How things are built: new numbers and conclusions reach him only on a page that passed the
// fact-check; the same guard keeps out evaluations with no measure behind them, by Orwell's six rules
// and Hayakawa's report against judgment, with general semantics as the method). The prompt hook puts
// the rules in front of me with each of his messages (reminder); the stop hook (tools/claude-guard.mjs)
// reads what I wrote him since his message, or since its own last word, and holds the turn while one
// remains, so my next line to him says it without them. A stop hook cannot take back text already
// shown: the check comes after, the reminder before.
// Left out, as they quote or name and are not my words: «…» and "…" quotes, `code`, links, paths,
// names with a number (Quest 3, A-Frame 1.8), list numbers, dates and times (Korzybski's dating
// device asks for them), and a negated passive ("не проверено" is the report CLAUDE.md asks for).

// Each rule with its source and the words that break it in my own messages: counted in the Russian
// messages to him in this project's session records (words used at least once, or named by him:
// "подтвердил", "обезврежено", "по-правильному", "крепкая", "главное", "весь").
// Russian forms have no published list for these rules; the words are the forms of the categories
// the sources name, and the owner sees the list with its counts before it stands.
export const RULES = [
  { rule: 'allness', shown: 'всё, весь, полностью, целиком, всегда, никогда, везде', fix: 'name what, or how many were checked',
    source: 'Korzybski, Science and Sanity, introduction to the 2nd edition (1941), p. lx: the extensional devices (indexes, dates, etc., quotes, hyphens); "etc." as the tool against allness: the Institute of General Semantics help sheet (A. Johnson, 2006)',
    words: ['всё(?![ \\t]+(?:ещё|еще|равно|же|таки)(?!\\p{L}))', 'весь', 'полностью', 'целиком', 'всегда', 'никогда', 'везде'] },
  { rule: 'an inference told as a report', shown: 'подтвердил, доказано, гарантирует, обезврежено, устранено', fix: 'say what was measured, by what, and what it showed',
    source: 'Hayakawa, Language in Thought and Action, ch. 3, p. 38: reports are verifiable and exclude inferences and judgments',
    words: ['подтверди(?:л|ла|ли|лось|лся|т|тся)', 'подтвержда(?:ет|ют)', 'подтвержд[её]н[оаы]?', 'доказа(?:л|ла|ли|но|на|ны)', 'гарантир\\p{L}*', 'обезврежен[оаы]?', 'устран[её]н[оаы]?'] },
  { rule: 'a judgment (purr or snarl word)', shown: 'отлично, идеально, красиво, крепкий, надёжно, по-правильному, хорошо, лучше', fix: 'what was measured instead, or leave the judgment to him',
    source: 'Hayakawa, Language in Thought and Action, ch. 3, pp. 42-46: judgments are expressions of approval or disapproval; snarl-words and purr-words',
    words: ['отличн\\p{L}*', 'идеальн\\p{L}*', 'прекрасн\\p{L}*', 'замечательн\\p{L}*', 'великолепн\\p{L}*', 'супер', 'круто', 'красив\\p{L}*', 'крепк\\p{L}*', 'над[её]жн\\p{L}*', 'по-правильному', 'хорошо', 'лучш\\p{L}*', 'плохо', 'ужасн\\p{L}*'] },
  { rule: 'pretentious diction', shown: 'главное, важно, ключевой, огромный', fix: 'say what follows from it',
    source: 'Orwell, Politics and the English Language (1946), "Pretentious diction": epoch-making, historic, unforgettable',
    words: ['главн\\p{L}*', 'важн\\p{L}*', 'ключев\\p{L}*', 'огромн\\p{L}*', 'историческ\\p{L}*', 'грандиозн\\p{L}*'] },
  { rule: 'a word that can be cut', shown: 'очень, действительно, реально, на самом деле, честно, просто', fix: 'cut it',
    source: 'Orwell, Politics and the English Language (1946), rule iii: if it is possible to cut a word out, always cut it out',
    words: ['очень', 'действительно', 'реально', 'по-настоящему', 'на самом деле', 'абсолютно', 'совершенно', 'буквально', 'честно', 'просто'] },
  { rule: 'the passive', shown: 'сохранено, проверено, исправлено, сделано, записано, отправлено', fix: 'say who did it: «я сохранил», «тест проверил»',
    source: 'Orwell, Politics and the English Language (1946), rule iv: never use the passive where you can use the active',
    words: ['(?<!не[ \\t])(?:сохранен|проверен|исправлен|сделан|записан|отправлен|решен|обновлен|починен)[оаы]', '(?<!не[ \\t])решён'] },
  { rule: 'jargon', shown: 'коммит, хук, пуш, мерж, деплой, фича, баг, регулярка', fix: 'the everyday word: сохранение, отправить, проверка при сохранении, ошибка',
    source: 'Orwell, Politics and the English Language (1946), rule v: never a jargon word if you can think of an everyday equivalent',
    words: ['коммит\\p{L}*', 'закоммит\\p{L}*', 'хук\\p{L}*', 'пуш\\p{L}*', 'запуш\\p{L}*', 'мерж\\p{L}*', 'смерж\\p{L}*', 'деплой\\p{L}*', 'фич[аиуе]\\p{L}*', 'баг(?:и|ов|а|у)?', 'регулярк\\p{L}*', 'рефактор\\p{L}*', 'кейс\\p{L}*'] },
];

// names followed by their number (Quest 3, A-Frame 1.8, Opus 5.5); a model glued to its number
// (WS-900) is taken out in bare() as well
const NAMED = /\b(?:Quest|A-Frame|Opus|Sonnet|Haiku|Fable|IWSDK|Node|Windows|Android|Chrome|WebXR|Postgres(?:QL)?|Python)[ \t]?(?:\d+(?:\.\d+)*S?|Pro)\b/gi;

// a date in the board's form (day.month, day.month.year): a day and a month, not a measure
const date = (s) => {
  const [d, m] = s.split('.').map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
};

// the text he reads, with what quotes or names taken out
export function bare(text) {
  return String(text)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/«[^«»]*»/g, ' ')
    .replace(/"[^"\n]*"/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^\s«»"()]*[\\/][^\s«»"()]*/g, (s) => (/[A-Za-zА-Яа-яЁё]/.test(s) ? ' ' : s))
    .replace(/^[ \t>]*(?:[-*+][ \t]+)?\d+[.)][ \t]/gm, ' ')
    .replace(/\b\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z?)?/g, ' ')
    .replace(/(?<![\d.,])\d{1,2}\.\d{1,2}(?:\.\d{4})?(?![\d.,])/g, (s) => (date(s) ? ' ' : s))
    .replace(/(?<![\d:])\d{1,2}:\d{2}(?::\d{2})?(?![\d:])/g, ' ')
    .replace(/#\d+/g, ' ')
    .replace(NAMED, ' ')
    .replace(/\b[A-Za-z][A-Za-z-]*\d[\w.-]*/g, ' ');
}

// what in the text breaks the rules: the new numbers, and each empty word with its rule
export function findings(text, rules = RULES) {
  const t = bare(text), found = [];
  const digits = t.match(/\d+(?:[.,]\d+)?/g);
  if (digits) found.push({ rule: 'a new number', fix: 'it goes on a page that passed the fact-check', words: [...new Set(digits)].slice(0, 8) });
  for (const r of rules) {
    const words = new Set();
    for (const w of r.words) for (const m of t.matchAll(new RegExp(`(?<![\\p{L}-])${w}(?![\\p{L}-])`, 'giu'))) words.add(m[0].toLowerCase());
    if (words.size) found.push({ rule: r.rule, fix: r.fix, words: [...words] });
  }
  return found;
}

// the findings as the stop hook says them to me
export const told = (found) => found.map((f) => `${f.rule}: ${f.words.join(', ')} (${f.fix})`).join('; ');

// the rules in one paragraph, put in front of me with each of his messages
export const reminder = () => `Chat rules (his decision; tools/plain-words.mjs checks them when the turn ends): no new digits to him, a number goes on a fact-checked page (dates, «quotes», links, paths and code aside); none of: ${RULES.map((r) => `${r.rule} (${r.shown})`).join('; ')}.`;

// The assistant's own text he read in a stretch of the session record (JSON lines): after the stop
// hook's last word in it, the text before was checked at that stop.
export function written(record) {
  let parts = [];
  for (const line of String(record).split('\n')) {
    if (!line.includes('"type":"assistant"') && !line.includes('Stop hook feedback')) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.isSidechain) continue;
    const c = e.message?.content;
    if (e.type === 'user' && e.isMeta && /^Stop hook feedback/.test(typeof c === 'string' ? c : (c || []).map((p) => p.text || '').join(''))) parts = [];
    if (e.type === 'assistant') for (const p of c || []) if (p.type === 'text' && p.text) parts.push(p.text);
  }
  return parts.join('\n');
}
