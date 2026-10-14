# Progress

Read at the start of every session, with `git log --oneline -20` and docs/features.json (CLAUDE.md, "Every
session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the feature at hand goes
to the end of docs/board.md, one line each.

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
Next, in order: 6) CodeRabbit's resolve does not take effect on GitHub (17 verified remarks still open): find why,
then short pull requests in place of the `reviewed` robot; 7) the live site serves only the game: a small pull
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

