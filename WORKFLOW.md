# WORKFLOW.md — Object

The owner's permanent prompt: his long text of 11.10 put in points, variant B of the revision's shelf 1, his choice («Вариант В» 11.10).
> Продолжаем. Что делать:
> 1. Бери нужные инструменты, нужную документацию и готовые уроки (что брать когда: docs/tools.md).
> 2. Сверяйся с процессом (этот файл и доска docs/board.md) и с тем, как ты по нему идёшь.
> 3. Опыт показывает, что лучше всего сверяться с тем, что уже существует: там можно понять причину и следствие или, наоборот, проложить свои, увидев ошибки. Уже давно известно, как строят стену, комнату, свет, планету: изучай и делай грамотно, так у нас будет эталон и документация по работе с ним.
> 4. Обоснованно подходи к своим решениям, логика должна быть прочной. Проверяй свои решения.
> 5. Если тебе что-то мешает выполнить процесс или не хватает знаний, сообщи мне об этом.
> 6. При нужде пользуйся интернетом, обновляй документацию, инструменты и наши знания.

Codex reads this file explicitly through AGENTS.md, then reads the referenced documents below.
These references are project notation, not a claim of native automatic imports.

Our words, approved by him word for word («Утверждаю» 14.10 and 15.10): @docs/ten-circles.md
His decisions load with this file: @docs/owner-decisions.md

"You are the object" (the name is never translated): a browser VR game (WebXR, A-Frame as vendored in vendor/) for Meta Quest; the player is the subject of
real psychology experiments, one room each, then sees how he was caught. Maps: ARCHITECTURE.md, docs/state.md.

## Every session (the process: Anthropic, "Effective harnesses for long-running agents", 26.11.2025)
1. Read the newest entry of docs/progress.md, `git log --oneline -20`, then docs/features.json. The task is his message; if it names
   none, use the active step in the corridor map. Nothing a hook prints is a task by itself.
2. One feature at a time.
3. Use evidence and professional practice to choose a step toward the goal, its consequences and verification.
   Use docs/research/perception-knowledge.md and primary sources. Mark gaps as hypotheses and test them.
   Finish preparation before requesting the owner's time. Source player-visible facts in docs/sources.md.
4. Verify as a person would: `npm test`; the smoke test on GitHub; what he will see, looked at by me first in the
   headset or on the stand (tools/quest-look.mjs, tools/stand-measure.mjs; they refuse until the practice-reviewer
   and, for a room, the paper-reviewer have run: tools/review-gate.mjs).
5. "passes" turns true only after those checks and his «Принимаю N» to what he saw (N: its number in the list);
   nothing else in the file changes. An error is fixed in the thing itself, never with a new rule.
6. End: a commit, a dated entry in docs/progress.md (done / not done and why / next).
   `node tools/finish.mjs check` only reads exact-version CI and CodeRabbit evidence. Sending a branch,
   opening its PR and any later merge are separate actions; a green check is not owner acceptance.

## The owner and me
He has zero technical knowledge («ноль знаний в языках программирования, в супабейсе, в гитхабах, в доменах… весь наш
процесс» 14.10): every technical choice is mine, with its source, never written as his; he is asked about what he
sees, values and money.
Repo English; Russian only where tests/structure.test.mjs allows. Who does what: @docs/tandem.md

## Cannot be undone (held by machines, not by this text)
- main is the live site: the GitHub ruleset; a push to main only on his word. Work on a branch; commit often.
- No key, token or his email in the repo (tools/secrets.mjs). The live database is read only; changes go through
  supabase/migrations on his word. Never restart the headset while he wears it (tools/headset.mjs refuses).
- The process only shrinks (policy/process-size.json); his decisions and the circles change only by his «утверждаю»
  (current owner instructions; policy/settings.json is our deny list, not provider settings).

## Rooms and code
A room: the new-room skill (its card, its paper read in full, a clear task); the paper-reviewer checks it. No build
step; the code's shape is held by tests/structure.test.mjs.
