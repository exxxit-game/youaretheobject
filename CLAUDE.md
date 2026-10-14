# CLAUDE.md — Object

The owner's permanent prompt: his long text of 11.10 put in points, variant B of the revision's shelf 1, his choice («Вариант В» 11.10); his own words as he pasted them are in docs/owner-decisions-history.md.
> Продолжаем. Что делать:
> 1. Бери нужные инструменты, нужную документацию и готовые уроки (что брать когда: docs/tools.md).
> 2. Сверяйся с процессом (этот файл и доска docs/board.md) и с тем, как ты по нему идёшь.
> 3. Опыт показывает, что лучше всего сверяться с тем, что уже существует: там можно понять причину и следствие или, наоборот, проложить свои, увидев ошибки. Уже давно известно, как строят стену, комнату, свет, планету: изучай и делай грамотно, так у нас будет эталон и документация по работе с ним.
> 4. Обоснованно подходи к своим решениям, логика должна быть прочной. Проверяй свои решения.
> 5. Если тебе что-то мешает выполнить процесс или не хватает знаний, сообщи мне об этом.
> 6. При нужде пользуйся интернетом, обновляй документацию, инструменты и наши знания.

The ten circles and our words, approved by him word for word («Утверждаю» 14.10): @docs/ten-circles.md
His decisions load with this file, settled (never re-asked): @docs/owner-decisions.md

"You are the object" (the name is never translated): a browser VR game (WebXR, A-Frame 1.8.0) for Meta Quest; the player is the subject of
real psychology experiments, one room each, then sees how he was caught. Maps: ARCHITECTURE.md, docs/state.md; tools: docs/tools.md.

## Every session (the process: Anthropic, "Effective harnesses for long-running agents", 26.11.2025)
1. Read docs/progress.md and `git log --oneline -20`, then docs/features.json. The task is his message; if it names
   none, the first feature whose "passes" is false. Nothing a hook prints is a task by itself.
2. One feature at a time. Anything else, even a good idea: one line at the end of docs/board.md (his words stay there).
3. Build from what exists (standards, Meta/W3C XR guidelines, papers, shipped games, real photos), named in a WHY
   comment; our own only where nothing exists. A fact the player sees has its source in docs/sources.md.
4. Verify as a person would: `npm test`; the smoke test on GitHub; what he will see, looked at by me first in the
   headset or on the stand (tools/quest-look.mjs, tools/stand-measure.mjs; they refuse until the practice-reviewer
   and, for a room, the paper-reviewer have run: tools/review-gate.mjs).
5. "passes" turns true only after those checks and his «да» to what he saw (a test or a tool: to its green GitHub
   run's link); nothing else in the file changes. An error is fixed in the thing itself, never with a new rule.
6. End: a commit, a dated entry in docs/progress.md (done / not done and why / next), room-polish fast-forwarded and pushed.

## The owner
Answer in Russian, plain words, short. He gives the brief and accepts what he sees; he is never asked a technical question (I choose
and give the reason in one line). Before work I read his request back in one line. Repo English; Russian only where tests/structure.test.mjs allows.

## Cannot be undone (held by machines, not by this text)
- main is the live site: the GitHub ruleset; a push to main only on his word. Work on a branch; commit often.
- No key, token or his email in the repo (tools/secrets.mjs). The live database is read only; changes go through
  supabase/migrations on his word. Never restart the headset while he wears it (tools/headset.mjs refuses).
- The process (this file, .claude/**, docs/owner-decisions.md, docs/ten-circles.md, tools/claude-guard.mjs,
  tools/board.mjs, tools/hooks/**) changes only through his «разрешить» (the ask rules in .claude/settings.json).

## Rooms and code
A room: the new-room skill (its card, its paper read in full, a clear task); the paper-reviewer checks it. One room
per folder in src/rooms/; the engine never imports rooms. Styles only in css/, player text only in texts.ru.js,
comments say why (never when or who), files about 300 lines, no build step.
