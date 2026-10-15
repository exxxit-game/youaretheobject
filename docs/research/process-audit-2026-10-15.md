# The process audit by the ten circles, 2026-10-15

The owner's question (docs/board.md, 15.10): did we get out of the circles, and does the process stand on known human
knowledge or on stones of our own; and, in the audit's window, why we took each decision and not another, and whether
those decisions help or lead back to the circles, walls, stones and the axe whose handle and blade keep being changed.
His choice: Opus 5.5 at max effort, a workflow for this audit, the result saved part by part. Plan approved by him in
plan mode. Evidence (outside the repository, on the laptop): objekt-files/notes/audit-ten-circles-2026-10-15/, each
part in its own note; every number comes from a script in its scripts/ folder. Nothing in the process is changed by
this audit: what it finds goes to him as proposals, each replacing something old.

## Part 0: the data (note 00-data.md)
- 29 windows where he typed, 08.10 to 15.10. The revision of 14.10 (467 errors) covered 23 of them, up to 14.10
  10:43 UTC; 7 windows after it (277 of his messages) were checked by no one before this audit.
- His messages are counted in both places a transcript keeps them (typed, and sent while the agent worked); counting
  only the first misses about 1155 of 1898.
- Commits per day to the game: 28, 45, 39, 20, 19, 0, 13, 6, 0 (07.10 to 15.10); to the process: 47, 77, 136, 169, 142,
  96, 150, 163, 27. 677 of 1048 commits touched a file that steers the agent; docs/board.md changed in 340 commits,
  CLAUDE.md in 41, tools/claude-guard.mjs in 58.
- The size limit on the steering files went only down on 14.10 (187,327 to 178,338 characters), but it counts neither
  the tests that hold the process nor docs/decisions.md.
- Seven earlier pages analysed the circles or rebuilt the process in five days (10.10 to 14.10).

## Part 1: the circles before and after (note 01-circles.md)
- Method: the 7 windows after the revision read whole by one helper each, every error challenged by a second helper;
  a control ran the same method on two windows of 13.10 the revision had counted (it found 43 errors where the
  revision found 33), so before and after are compared by one method. A blind relabelling of 52 old errors agreed on
  the primary circle in 68% (Cohen's kappa 0.64): totals compare better than circles.
- Errors per 100 of his messages, confirmed by the second helper: 32.8 before (control), 45.8 after (127 in 277);
  per hour 5.6 and 9.0. By window after: 47.9, 55.4, 35.0, 32.3 in the four long ones. Not lower; "higher" is not
  established (exact test of the two rates: p = 0.059, two-sided; each side is one day).
- In 4 of the 7 windows after his approval the circles did not load at start (stale worktree copies; one loaded the
  CLAUDE.md of 07.10); in 3 of them I read the circles in by tool within minutes. No clear difference between the two
  kinds of window is shown.
- After the rule that bans "done" words, 48 uses reached him, 31 without proof; the unproven ones fell window by window
  from 18 to 0.
- Answer: not out of the circles. Circles 2 and 5 (claims without proof, numbers from memory) are the largest after,
  in windows that were audits and pages about the process; with 0 to 8 errors a circle in the control, no per-circle
  direction is established; circle 10, the only one fully held by a machine, had no occasion.

## Part 2: the walls and stones (note 02-walls.md; walls/axe-chain.md)
- 273 parts in six groups, each traced against sources opened on 15.10 and checked by a second helper (128 rows
  corrected, none refuted). The frame stands on current sources (Anthropic's harness article of 26.11.2025, Claude
  Code's docs); the machine guards for what cannot be undone hold; most other parts are held by text.
- Parts that do not do what they say: the tandem import (never loaded), the health check "at every start" (runs at no
  start), the board's top at start (gone since 14.10), plan mode (used by 1 of 4 windows after its rule), the report
  word caps (exceeded by 309 of 371 reports), the size limit (text moved into docs/decisions.md, which it does not
  count).
- The permission lock: 70 prompts in 8.7 hours, 69 allowed; 3 shell writes passed it unprompted.
- The axe: seven rebuild pages in five days, 107 prescriptions, 86 applied, 24 later undone or replaced, four freezes
  promised and none held; errors per 100 of his messages stayed between 29.5 and 36.0 a day from 9.10 to 14.10
  morning. Totals fell after two cures, both from a peak; errors caused by our own guards fell only after the cure
  of 11.10 that mostly removed rules and guards (+159 -519 lines: 8.1 to 2.6 per 100) and rose after the next (2.5 to
  7.7); people systematically overlook subtractive changes (Adams et al., Nature 592:258-261, 2021).

## Part 3: the synthesis and the proposals (note 03-synthesis.md; the completeness critic: critic.md)
- A completeness critic read the evidence and the page draft and found ten kinds of problem, among them a "main cause"
  the notes did not support, two proposals that reopened the owner's settled decisions, and per-circle comparisons
  across two methods; all were corrected before the page reached him, and four proposals were withdrawn. Two
  fact-check runs that did not see each other checked the page; their findings were fixed and checked against them.
- Seven proposals remain, each correcting or removing something, none adding: the records made true, plan mode by the source's condition, the unobeyed report caps removed,
  the duplicate main check in the pre-push hook removed, reviewers started without the builder's context, the size
  limit counting every steering file, and the "always allow" rules made during the audit removed. Nothing is changed
  before his answer, one proposal at a time.
- Not checked: windows after the audit; the audit is one hand too (every helper is the same model).
