# Circles: the mistakes we keep coming back to

Not rules: a record to check a decision against before it is taken, so a path that led in a circle before is not
walked again. The owner's words (13.10): «у нас есть повторяющиеся ошибки, к которым мы постоянно через время
возвращаемся… не свод правил, а… записи… чтобы ты мог сверяться… больше такое решение не принимать, потому что оно
заводит в круги». Read before adding or changing a guard, a hook, a rule, a check, a tool, or a step of the process.
Each circle: what was done, how it came back (dates), what it cost, why it happens to us, what breaks it. A circle is
closed when what breaks it is in place; it stays here, marked, as the memory of why.

## Who is built how (the reason circles return)
- The owner does not read code: what happens inside it he sees only as its effect, often late; he judges what he sees
  and feels, and decides.
- I (the agent) forget: between windows everything not written is gone, and in a long window early messages are
  compacted away; I answer the finding in front of me locally, one at a time; I write from memory unless I read the
  thing itself; I tend to add rather than remove.
- Together: he cannot brake what he cannot see, and I do not see the pattern across windows; so the pattern has to
  be written down, here, and read at the moment of deciding.

## 1. A guard for every complaint or remark — open
- Done: Cosmogram's hooks 1 (25.08) → 7 → 12 → 22 → 34 → 53 (30.09), cut to 12 the same day: "раздутые правила, хуки
  и записи сами мешали работе" (569191c). Here: the process review of 11.10 removed five guards; on 13.10 nine command
  forms were added to the merge and hooks-path guards after CodeRabbit's remarks, and he said: «Ограничения, ограничения… снова
  понаставляем… ставить ограничения на ограничения, это не особо разумно».
- Cost: after 11.10 the command guard refused 4 times in 10,237 calls, all false; the forms added before 13.10 never
  fired (docs/research/restrictions-inventory.md).
- Why us: I fix the finding in front of me (Reason 2000: active failures "can be swatted one by one, but they still
  keep coming"); a client-side guard can always be got round by another form, so there is always another remark.
- Breaks it: a client guard only against slips, not chasing every bypass (a lock out of reach would need the agent's
  own identity, which he refused 13.10); a new lock only after a real
  incident whose mistake cannot be undone, and it replaces something; a remark about another way round a client
  guard is answered with that principle (docs/research/restrictions.md).

## 2. Rules written until no one reads them — watch
- Done: Cosmogram's CLAUDE.md 5.8 KB (25.08) → 35 KB (30.09) → cut to 8 KB; 451 memory files; a note of 24.09 that
  "150+" rules were never searched before acting.
- Here: CLAUDE.md held at 45 lines by a test; docs/owner-decisions.md (his decisions, loaded at every start) is the one
  that grows, a line a decision.
- Why us: every lesson wants a line; no line is ever taken out.
- Breaks it: sizes held by tests; Anthropic's "Ruthlessly prune"; a line whose removal would cause no mistake is cut.

## 3. Two checks that lock each other — open
- Done: Cosmogram's worst-case gate demanded what its full-suite warning forbade (hook audit 02.10). Here: a helper
  saves a paper outside the repository, the library test fails every commit, the Stop hook holds every turn for the
  unsaved work: up to 17 of the 29 "not saved" holds after 11.10 came with it, loops of 25 tries (12.10); the
  rest came with helpers writing drafts inside the repository.
- Why us: each check is added alone; no one asks what other check can force the state it fails on.
- Breaks it: a check runs only where its input changes (docs/research/restrictions.md, item 1).

## 4. The owner called before the check is done — open
- Done: 10.10 (twice; «Мне просто хочется плакать уже»), 11.10 13:57 UTC, 13.10 09:12 UTC: the review gate refused
  VR after he had put the headset on.
- Cost: his time in the headset, the thing he asked to protect («Все твои проверки… сколько времени я потратил»).
- Why us: I call him as soon as the work looks ready; the gate runs when VR starts, not when I call.
- Breaks it: the tool's own pre-check (`node tools/measure.mjs --check`, the review gates) passes before the words
  «наденьте очки».

## 5. Rounds of fixes that make new errors — open
- Done: 12.10 «проверка, перепроверка… уже десятая»; 13.10 the studio page took four rounds of two fact-checks, and
  the restrictions analysis miscounted every time in the direction of its own conclusion (its fact-checks).
- Why us: I shorten and translate sources from memory and write our setup's state from memory; each shortening
  makes a source stronger or narrower.
- Breaks it: a page is written only from the checked research and from files read while writing; fewer claims;
  quote rather than retell; our own inference labelled as ours.

## 5a. The same circle, 13.10 (fourth window)
- Done: the nine tips for players took three rounds of two fact-checks for nine lines; the usage page three rounds,
  its numbers retold from helpers' reports instead of read from the tool's output; the game's menu four rounds of the
  practice and paper reviews (about three hours), each round finding holes in the last round's own fixes.
- His words: «повторять по 500 раз одно и то же… какая-то глупость»; «Ты потратил весь день сегодня на свои, по
  сути, галлюцинации»; «Зачем ты фантазировал… если у нас есть четкие документации?»
- Breaks it: see 13; numbers on a page only from the tool's own output; the rule «two checks, and on each edit
  too» (his, 12.10) made a small page circle: changed by his «Да» 14.10 (two checks on a new page; edits from
  their findings checked by me against them).

## 6. Claims from memory — open
- Done: 13.10 the baseline's times and conditions (two fact-checks found them wrong); 13.10 "Claude Code deletes
  transcripts after 30 days" (the general rule, read without its exception for the desktop app).
- Breaks it: read the thing itself first (docs/tools.md), and read the whole rule, exceptions included.

## 13. My own first idea before the documented pattern — open
- Done: 13.10 the game's menu: built as a panel of my own design (index 7 from the input registry while our own probe
  of his Quest 3 had already found the Menu button at 12, docs/headset-capabilities.md; a depth test turned off; rays
  to guess a free distance), then patched after each review, until it became Meta's own theater mode, the pattern
  that existed from the start (developers.meta.com/horizon/design/panels/). 157 commits that day, 12 to the game.
- Cost: his day; the exit he asked for at once («Сделай выход прямо сейчас») not in his headset by night.
- Why us: I start writing as soon as I see a way, and the reviews come after the code; each fix is again my own idea.
- Breaks it: his own loop, kept in order (docs/owner-decisions.md: «Искать, воплощать»): first the pattern, three
  lines «делаем как …» with its link (a Meta page, a shipped sample, our own earlier probe), then the practice
  reviewer on that plan, then the code, then one review.

## 7. Process instead of the game — watch
- Done: Cosmogram, 07.10: «Я думал, что мы два месяца стартуем, а оказалось, что мы два месяца хуюем». Here, 12.10:
  0 commits to the game, 96 to the process.
- Now: the process first is his decision (13.10: «Дальше первой комнаты и коридора не двигаемся… пока мы все не
  настроим»). The circle is process that does not converge: the sign is restrictions added faster than removed.
- Breaks it: each step of the process ends in something he sees, and each change replaces something.

## 8. Heavy checks on the laptop — closed
- Done: Cosmogram ran its 330+ Playwright guards on the laptop 1436 times in one 21-day session; he caught it on
  24.09, 25.09, 30.09. Here: the smoke test runs only on GitHub (tests/smoke.mjs, .github/workflows/test.yml).

## 9. Guards that silently do not run — closed in part
- Done: Cosmogram's hooks failed to start ("bash is not recognized", "node: command not found") and reminders went to
  stderr, which never reached the agent. Here: a crashed command or MCP guard blocks (.claude/settings.json; the
  Write/Edit guard and the Stop hook do not), and each guard is proved to fire on GitHub (tools/prove-guards.mjs).

## 10. Work straight on the live site — closed
- Done: Cosmogram, 1385 of its 1538 commits went straight to main, the live site. Here: branches, and main only by a
  pull request with the test check green (GitHub ruleset, 12.10).

## 11. One endless window — closed in part
- Done: Cosmogram's main session ran 21 days at about 570,000 tokens a request. Here: windows end with a written
  handoff, and the whole dialogue is kept (docs/owner-decisions.md).

## 12. Errors built on errors — open
- Done: 13.10, the guard's forms were added on CodeRabbit's remarks, then counted in the restrictions analysis as
  evidence, then options were built on that analysis; two fact-checks found every count leaning toward the
  analysis's own conclusion, and an option resting on a misread key ("admin").
- His words (13.10): «ты ошибку на ошибку лепишь, и потом… свои же знания подкрепляешь теми же ошибками и от них же
  отталкиваешься и считаешь, будто то были правильные решения»; «я в языках программирования нифига не понимаю…
  если ты мне не будешь помогать, а будешь мешать, то мы будем это изучать гораздо дольше».
- Why us: my own earlier docs and decisions read like sources to me in the next step; he cannot see the code to
  catch it, and learns all of this as he goes.
- Breaks it: my own docs, the board and an earlier window are leads, never sources (docs/tools.md): before building
  on one, the thing itself is read (the code, the setting, the source); checks go to primary sources, not to my
  texts; each step is shown to him as one plain picture of what and why, so he can brake what he understands.
