# Progress

Read at the start of every session, with `git log --oneline -20` and docs/features.json (CLAUDE.md, "Every
session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the feature at hand goes
to the end of docs/board.md, one line each.

## 2026-10-15, morning — the tandem, step 1: the thermometer, his measure by machine, the tandem loaded
On his words after the audit (the split of the work between him, me, us both and the other tools; he cannot keep
up with watching everything; he is asked to permit what he does not understand), after his five pages of 14-15.10
(seven files, two pairs the same). Plan mode, his approval of the plan.
Done:
- tools/claude-guard.mjs: mode `loaded` for Claude Code's InstructionsLoaded hook records each instruction file that
  really loads; at each of his messages the prompt hook compares the record with CLAUDE.md and its imports, read as
  Claude Code reads them (imports()); a file that did not load, or loaded before the copy was brought up, is told to
  him once a window and to me each message. His measure (features turned to passing in 7 days; yesterday's commits
  to the game and to the process) is shown to him by the machine at a window's first message. Removed: the start's
  text check of the imports (a broken import passed it), the board-top code and its test, the health check's
  line limit.
- CLAUDE.md: the tandem import without its trailing period (the same line as PR #16). docs/tandem.md: who takes what
  and what holds it. .claude/settings.json: the InstructionsLoaded hook. Tests for all of it.
- Process size 177,964 of 178,338 (was 178,289).
Checked: tests/guard.test.mjs and tests/structure.test.mjs green; imports() names "docs/tandem.md." on room-polish's
CLAUDE.md as a name with no file behind it, and nothing on this branch; npm test stops at tests/library.test.mjs
(di-febo-2026, a record PRs #16 and #17 add), the 12 tests after it green one by one.
Not checked: that InstructionsLoaded fires in the app (its 2.1.295 program names the event, the docs list it); the
hooks act from the main folder only after the merge and the pull, so the first real window after that is the test.
Errors of mine: the guard first came out 3,766 characters longer, over the size limit; a comment with a date and
"his decision" in it, caught by the structure test.
Next: an independent premortem of the plan (running); CodeRabbit's review; merge; then the floor directory with the
tandem; the next rows only after measuring.

## 2026-10-15, night to morning — the process audited by the ten circles (Opus 5.5 at max effort, a workflow)
A session started by the setup window, on his question on the board (did we get out of the circles) and his choice of
max effort; in this window he chose a workflow for the audit. Plan mode used for the plan.
Done:
- The record counted by scripts (29 windows, his messages in both places a transcript keeps them, 1,048 commits) and
  judged by 36 helpers at max effort: the 7 windows after the revision read whole, every error challenged by a second
  helper, a control on two windows of 13.10 by the same method, a blind relabelling of 52 old errors (kappa 0.64);
  273 process parts traced against sources opened on 15.10, each group checked by a second helper; the seven earlier
  rebuild pages traced against git; a completeness critic and two blind fact-checks on the page. Evidence:
  objekt-files/notes/audit-ten-circles-2026-10-15/ (00 to 03, data, scripts, circles, control, walls, page);
  summary: docs/research/process-audit-2026-10-15.md.
- Findings: not out of the circles (45.8 confirmed errors per 100 of his messages after his approval, 32.8 before, by
  one method; not lower, "higher" not established, p = 0.059); text-held rules hardly held, machine-held ones did; the
  same axe: 7 rebuilds, 107 prescriptions, the error rate unchanged; errors caused by our own guards fell only after
  the one cure that mostly removed rules and guards.
- A page for him: https://claude.ai/artifact/S41gdKsuAaYDS8WmwrAc9x (the critic found ten kinds of problem in the
  draft, fact-check runs found 12 and 6 wrong claims; all fixed before publishing), with seven proposals, each
  correcting or removing something, and his own recorded words on the order of process and game, without a question.
- His words of this window on the board (the task as he put it, the million players, the many earlier pages, his
  question on Ultracode and my answer).
Errors of mine in this window: three answers repeated in English after the next-step box; asked him for the slider's
"last item, max" without checking (the sixth notch is Ultracode), then took back my correct reading of his screenshot
and sent him to click a "switch" that is not one; the plan's size-limit history without its first value; a node
one-liner that ate a regex's backslashes; commits made after the structure test alone, not the whole npm test (the
whole chain is red on the laptop at the library test, a missing record that PRs #16 and #17 add; the 12 tests after it
were run one by one, all green); the page draft stated a "main cause", two proposals against his settled decisions
and his yes to question 5 widened, all caught by the critic and the fact-checks before he saw it.
Not done and why: nothing in the process is changed: the seven proposals wait for his permission one by one.
Next: his answers on the page; then, one at a time, what he allows.

## 2026-10-15, night — what helped others like us; everything we use and do not use, with its reason
A session started by the setup window, his question on the board (what others use, 15.10).
Done:
- One inventory of everything available (app settings, connectors, plugins, skills, "/" commands, helpers, the game's
  tools), each unused item with its recorded reason or "no reason recorded"; three searches of 2025-2026 reports: solo
  and non-programmer builders with Claude Code, WebXR/A-Frame developers, small teams on the Horizon Store. Evidence:
  objekt-files/notes/others-2026-10-15/ (inventory, three research notes, the page's checks).
- A page for him: https://claude.ai/artifact/CPbGVn2ZpPLVo7y6C7zTQx (useful now, useful later on the road to the
  Store, not useful with reasons, not checked, the inventory, the errors it found, question 1). Two fact-checks found
  22 and 16 problems, many the same, all fixed before publishing.
- Three stale records corrected: docs/tools.md is named in CLAUDE.md, not loaded with it (state.md); Dropbox is not
  connected (decisions.md); Python 3.14.8 is on the laptop now (C-safety-settings.md). The library record of Di Febo
  2026 brought over from PR #16 (the library test was red without it).
- His words on effort levels and on the models on the board, my answers given in the chat from Claude Code's
  model-config page; the code gaps the WebXR search found on the board.
Errors of mine: the page's first draft took several facts from the night's notes without re-reading the board and
PR #16 (the 13 skills he had removed, the Haiku record), stretched his words (a check of checks), promised a consent
prompt the desktop app is not shown to give and called both models "twice the cost"; I acted on a message of his
meant for another window (taken back). Plan mode, required by CLAUDE.md since 14.10 20:33, was used by no working window before the audit window (PR #18), this one included.
Question 1 answered: his choice of max effort (the board): the process audit by the ten circles ran in its own window on
Opus 5.5 at max effort, its result saved part by part, merged into room-polish as PR #18.
Not done and why: the useful-later items wait for their step on the road.
Next: the audit's outcome and proposals (PR #18, its page) with him, one at a time.

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
of at least 10 (0011_doors.sql; a migration, on his word); the monthly update check's first run stopped after two
commands at 23:00 14.10 and made no page (why: not checked; that it waits for his permission was my guess); questions 2-4 of the page and the future's nine decisions wait
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

