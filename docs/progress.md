# Progress

Read at the start of every session, with `git log --oneline -20` and docs/features.json (CLAUDE.md, "Every
session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the feature at hand goes
to the end of docs/board.md, one line each.

## 2026-10-14 night to 2026-10-15 — the app's insides re-checked with him (setup task, his words on the board)
Done (each with npm test green; the work in PR #16):
- PR #15 (the previous window) reviewed by CodeRabbit, its four remarks fixed (69828f4), merged by fast-forward on
  his written permission in the chat, the main folder pulled.
- A page for him on commands, skills, plugins, connectors and settings: https://claude.ai/artifact/8ffDtPYooD9gfXEJAG7Wfw
  (88 skills load in every window: 36 Meta, 23 Anthropic, 8 research, 3 CodeRabbit, 17 built in, 1 ours; counted
  from the transcripts 08-14.10, 24 skill calls in all; evidence in objekt-files/notes/setup-2026-10-14). Checked
  by two fact-check runs per version; version 2 adds six re-checks (GitHub, Claude Code setup, Supabase, the
  internet, the future from Cosmogram's notes, why each tool), the reports in the session notes folder.
- Question 1 of the page: the Meta VR plugin off in this project (7d50c41), on his go-ahead to the page (his words on the board); Meta's docs
  through `metavr docs search` (docs/tools.md). It takes effect once #16 is merged and the main folder pulled.
- The stop hook no longer repeats the merge reminder while HEAD is in an open PR of this repository into
  room-polish (his remark that it flashed at every answer; afb3acd, aff0a21 after CodeRabbit).
- Found and fixed: CLAUDE.md's import `@docs/tandem.md.` loaded nothing (0a551d9; the size test now reads imports
  as Claude Code does); four dead lines; the health check reads all four rules of main and requires the "test"
  check by name (3a50807 and the CodeRabbit fix); test.yml runs on PRs into main too; docs/methodology.md,
  docs/testing.md and docs/decisions.md now say what the database keeps and that the health check runs by hand.
Errors of mine, named to him: a word our circles ban ("done") on the page and Meta called off before the merge;
"the morning check" for the health check; my advice written as his decision in the page's first draft; a CodeRabbit reply
saying npm test was green while it was red (steps chained with `;`, corrected in the thread; the cause, a paper
saved without a record, fixed in 58feb5d).
Not done and why: the average of "you vs others" is computed on every call, while his yes of 12.10 was to batches
of at least 10 (0011_doors.sql; a migration, on his word); the monthly update check's first run waits in its own
window since 23:00 14.10 (he has to answer it there); questions 2-4 of the page and the future's nine decisions wait
for him, one at a time; the GitHub actions' pinning and versions wait for the benefit-and-harm weighing.
Next: 0) PR #16: CodeRabbit's review answered, merged, the main folder pulled; then, in a new window, check that
the 36 Meta skills and the tandem show (or not) in its listing. 1) The page's queue, one question at a time:
the update check's window; turning on two-factor sign-in for his Supabase account (off there, on for GitHub,
Google, Namecheap and Meta, his word on the board) and a look at its spend cap; GitHub security alerts; Supabase
SSL, old keys, sign-ups; the average in batches; questions 3-4; the guard on shell writes. (Question 2 settled: no
switch exists, only Delete; he deleted the 13 Anthropic skills, checked with the skills list; docs and skill-creator
stay.) 2) His order (the board): a try at the game next.

## 2026-10-14, evening, next window — item 6 done but his merge; our documents compared with experienced practice
Done:
- 6b) PR #10 closed with a comment placing each of its 19 unresolved remarks (17 CodeRabbit had verified fixed, the
  loading screen moved to the board, the integers already there) and answering its two outside-diff remarks. The
  `reviewed` robot removed from room-polish by PR #13 (merged as c48820b once CodeRabbit confirmed both its remarks
  fixed); its copy on main goes by PR #14, which waits for his merge.
- The push guard let nothing from a branch made from main leave the laptop; fixed in #13: a slow test is skipped
  only when the pushed commit itself has none.
- room-polish locked on GitHub by his hand: ruleset "room-polish keeps its history" (no deletion, no force push, no
  bypass), read back with gh.
- His words on things that change (versions, time) on the board; CodeRabbit's open remark on the loading screen too.
- Our 14 main documents compared with how experienced people keep theirs, a page for him:
  https://claude.ai/artifact/CC3VLWFAifPk3THwKCvGGf (two fact-checks found 20 problems each, all fixed). Evidence:
  docs/research/docs-practice-classic.md, docs/research/docs-practice-agents.md; IFScale and Xiong re-read in their
  own text; Cherny's advice to delete CLAUDE.md, skills and hooks every six months read in YC's transcript once he
  widened the browser pane (docs/research/cherny-yc-2026.md).
- Six Reddit threads he saved read, and the article they point to: Anthropic's rules of context for Claude 5 models
  (docs/research/context-claude-5.md); added to the page as its most important part.
- Anthropic's prompt audit run on our instruction files (docs/research/prompt-audit-2026-10-14.md): six of my own
  places fixed on his yes; his lines one at a time, each by his answer (outcome in that file); the circles now arrive
  once, with CLAUDE.md; a monthly scheduled task in the desktop app (monthly-updates-check) watches A-Frame, three.js,
  Claude Code, the Quest Browser and Meta's tools and writes him a page, updating nothing; the old separate Claude
  Code copy (npm, 2.1.268) removed on his word, the app's own copy updates itself.
Errors of mine, found and fixed the same day: #13 merged before a remark CodeRabbit posted three minutes earlier was
read (fixed in #15); an audit finding (the prompt's variant letter) raised without reading the archive, where it was
settled; a too-wide claim in the closing comment on PR #10 (corrected there);
the page's first draft quoted my English retelling as his words, called work in a pull request done and counted
lines as mentions.
Not done and why: PR #14 and the `reviewed` branch's removal wait for him; ten documents (state, engine, rooms, roadmap, tools, testing, baseline, building standards, VR checklist,
methodology) are not compared yet; items 7 to 10 of the wall's plan not started.
Done after: his merge of #14 (the robot gone from main); the branches `reviewed` and my two merged ones deleted on GitHub
on his yes.
Next, in order: 0) PR #15 (this window's work, branch claude/docs-audit): CodeRabbit's review answered, findings fixed
or shown wrong, then merged into room-polish and the main folder pulled. 1) his task for the next window, commands and
skills (his words on the board's last line). About 88 skills load into every
window (36 Meta's, about half for Unity, Android, React Native and Portal, not our WebXR game; 23 Anthropic's, many for
office work; 7 research; 3 CodeRabbit; about 17 built in; 1 ours). One plain page for him: what a command and a skill
are, which few he would use himself, which I use and when, which are noise; then his choice group by group (plugins are
his setup decisions), with Claude Code's docs (`/skill-doctor`, skill overrides) as the source. 2) The first page of
the monthly update check (scheduled task monthly-updates-check) read with him. 3) The page's list: the A-Frame version
in one place,
full dates in new records, a status and date on each decision record; with his permission, a guard on "passes" and
omitClaudeMd for the fact-checker and the practice-reviewer; options on the old versions of his words in the public
history.

## 14.10, late night — item 6 half done; this window archived on his word
Done: 6a) a window's work now reaches room-polish through a pull request CodeRabbit reviews (6f8edb0: CLAUDE.md
step 6, the Stop hook's reminder, .coderabbit.yaml base branch room-polish, tests on each pull request into
room-polish); this window's own commits still went in the old way, the new way starts with the next window's work.
The guard prover removes a stale git lock before its reset (58d505b): one GitHub run had gone red on it.
Not done: 6b) close PR #10 with a comment, and stop the `reviewed` robot (it runs from main: its workflow disabled by
his click in GitHub's Actions, or removed by a pull request to main he merges); 7) the live site serves only the
game: a small pull request to main with only that change, merged by him; 8) screenshots compared against his
approved ones; 9) his request: everything in one place for me and a fast search, from what the market has
(connectors beyond Anthropic's store), judged by our own experience; 10) at the end, CLAUDE.md and the rules
given to him in plain Russian on one page, for him to check that the meaning is his.
Why the window stopped: two confusions in a row (Russian words twice in this log, the size limit hit three times
in an hour); circle 8 of the ten says a new window. This window had also loaded the rules of an old copy.
Next: 6b, then 7, 8, 9, 10, in that order.

## 14.10, night — the wall's plan, items 1 to 5 done
Done (each with npm test green, on GitHub): 1) his decisions split (469b825): 24 lines of my advice and my additions
to 11 of his moved to docs/decisions.md, "Moved from his decisions"; 2) no copying between disks (bc19c5e);
3) 26 branches deleted on GitHub (left: main, room-polish, reviewed, claude/end-pictures-look), 4 abandoned
worktrees and 28 local branches removed (his permission in the chat); 4) the history of the process moved to
objekt-files/notes/archive (15254cb; 51 files, checked byte for byte; the board down to 6,500 characters; the
cards and research stay, the code names them as sources); 5) a task starts in plan mode, docs/tools.md names
what to read first by the task's kind: Gregory's book (4th ed., objekt-files/books), A-Frame 1.8.0, three.js r184,
Meta's docs (3f211e7, his point of 14.10: the light starts from the engine book).
Not done: unused helpers (request-auditor, architecture-auditor) left in place: removing them costs him windows.
Next, in order: 6) why CodeRabbit's resolve did not take effect, found in its docs
(docs.coderabbit.ai/guides/commands): "`@coderabbitai resolve` is not supported in inline or review-thread
replies"; only a top-level PR comment resolves, and it resolves all its comments at once. The `reviewed` robot
waits for 0 open remarks, so it could never move. Still open for real on PR #10: the loading screen
(src/app/stage.js, game work), the Stop hook's output (tools/claude-guard.mjs, its answer awaited), the counts as
integers (supabase/schemas, a migration on his word), the tandem (fixed in aa9e38b, its check awaited). Then: short
pull requests into room-polish, each reviewed by CodeRabbit (its base branches set to room-polish), PR #10 and the
robot retired; 7) the live site serves only the game: a small pull
request to main with only that change, merged by him; 8) screenshots compared against his approved ones; then his
request of 14.10: everything in one place for me and a fast search, from what the market has (connectors beyond
Anthropic's store), judged by our own experience.

## 14.10, evening — the whole wall approved
Done:
- A window that opens on an old copy brings it up to room-polish itself (092caed); the rules it already read stay old.
- The rules and guards are held by one limit in characters that only comes down (.claude/process-size.json, e3c4b15).
- His zero technical knowledge stands at the top of CLAUDE.md's "The owner and me", in his words (aa9e38b).
- CodeRabbit: five new remarks answered on PR #10; two fixed (c4eac99). 17 remarks it verified still show open:
  its resolve does not take effect on GitHub, so the `reviewed` robot is stuck.
- The wall: every part of the setup, what holds it, where everything lies, verified world knowledge, one plan:
  https://claude.ai/artifact/Ld81yG7m4n57KNn5SBwsVs (two blind checks found 20 and 22 problems, all fixed). His
  approval of the wall as a whole (his word in the chat of 14.10).
Not done: the plan below.
Next, in this order, one pass: 1) his decisions split (the list shown to him first: his choices of meaning, ethics,
money stay his; my technical advice to my log; widened lines keep only his words); 2) no more copying between disks;
3) merged branches and abandoned worktrees removed; 4) the repository keeps the game and the minimum the process needs,
the knowledge (cards, research, audits, the history of his words) moves to objekt-files on Google Drive, the board
to an archive; 5) rules and agents cut, docs/tools.md rewritten from 14.10's facts (which tool when), the limit
lowered; 6) CodeRabbit's closing fixed and short pull requests in place of the `reviewed` robot; 7) the live site
serves only the game; 8) screenshots compared against his approved ones. His hands, step by step when he says:
two-factor sign-in on Supabase, GitHub, Google, Claude; a lock on room-polish on GitHub; Supabase's spare key and
sign-up.

## 14.10 — the process replaced by a published standard
Done:
- The revision of 8–14.10 (23 windows, 467 errors, 20 reports, two independent checks; all in
  objekt-files/notes/revision-2026-10-14, the page https://claude.ai/artifact/GNUkHZf5MjEj2Ym5SeMuzA): the circles came
  from the process itself, the one part invented instead of recreated; checks made on a stand-in, and every error
  answered with a new rule that caused the next errors.
- His answers: yes to all six questions of the page; the check date 21.10 (three of his yes to things he saw).
- The process is now Anthropic's harness for long-running agents: CLAUDE.md's session loop, docs/features.json,
  this file. The session start prints the ten circles, his commit line and the current feature, nothing else to
  do first. The Stop hook reminds once. A commit is no longer stopped by the papers-library check. Process files
  change only through his permission (Claude Code asks him).
- Six lines of his decisions that were my advice are marked suspended to 21.10 (his yes to question 3).
Feature:
- smoke-test-after-leaving: the fix is in abd73cb; GitHub's run on room-polish is green
  (https://github.com/exxxit-game/youaretheobject/actions/runs/38577626182); "passes" waits for his yes to that link.
- The backup to drive F copied (robocopy: 94.75 MB, 0 failed).
- His yes to the green run (his yes in the chat of 14.10, the revision window): smoke-test-after-leaving passes; his first yes toward 21.10.
Next: the next feature of docs/features.json (corridor-floor-directory: two forms to him as pictures); on 21.10, count his yes to things he saw.

