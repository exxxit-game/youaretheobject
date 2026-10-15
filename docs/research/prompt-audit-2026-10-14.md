# Prompt audit of our instruction files, 2026-10-14

Run by the assistant in its own session through the bundled `/claude-api prompt-audit` method (the one
`/doctor prompt-audit` runs; the app's own `/doctor` is not available inside the desktop session, and the separate
Claude Code program on the laptop is not signed in). The method's text was followed step by step; nothing was edited.

## Assumptions (Step 0)
- Scope: the working directory's instruction files: CLAUDE.md and its imports (docs/ten-circles.md,
  docs/owner-decisions.md, docs/tandem.md), .claude/rules/ (4), .claude/agents/ (7), .claude/skills/new-room/SKILL.md,
  and the text the SessionStart hook prints (tools/claude-guard.mjs, start). Not read, by the method: .claude/settings.json.
- Target model: Claude Opus 5.5, the model running this audit; no file pins another.
- Every path these files name inside the project and in objekt-files was checked and exists.

## Summary
The highest-impact findings are stale facts about review and the old robot (H1, H2) and a line of his decisions that
contradicts itself (H3). Counts: Group 1 (dated prompt text) 0: no pressure language, hedges or step-by-step
incantations; Group 2 (brittle configuration) 3 high, 5 medium, 7 flags; Group 3 (tool descriptions) not applicable
(no tool definitions; agent descriptions are routing text); Group 4 not applicable except one roster flag.

## Findings
| # | Location | Evidence (short) | Pattern | Why obsolete | Conf. | Action |
|---|---|---|---|---|---|---|
| H1 | .claude/skills/new-room/SKILL.md:52-53 | "CodeRabbit on the pull request once room-polish goes to GitHub (its remarks come at the next start)" | 2, volatile specifics | room-polish is on GitHub; the start no longer prints the reviewer's remarks (tools/claude-guard.mjs, comment above the current-feature line); tools/coderabbit.mjs removed in #13; CLAUDE.md:30-32 | High | rewrite: "CodeRabbit reviews the window's pull request into room-polish; its findings are fixed, or shown wrong, before the merge (CLAUDE.md, Every session, 6)" |
| H2 | .claude/rules/setup.md:26 | "moved forward by a robot on GitHub, never by the session under review ... the pull request it reads: docs/state.md" | 2, volatile specifics | the robot is retired (#13 merged, #14 open); docs/state.md:8 names no such pull request | High | flag: his decision; wording offered to him |
| H3 | docs/owner-decisions.md:40 | "Errors named by their weight: critical, medium, minor ..." then "WEIGHT REMOVED 14.10 ... without a weight; the rest of this line stands" | 2, files that contradict + 1d patch accretion | the line's first half states what its own patch removed | High | flag: his decision; a clean line offered to him |
| M1 | .claude/agents/request-auditor.md:15 | "docs/owner-decisions-history.md and its part 2, docs/owner-decisions-history-2.md (all his words)" | 2, volatile specifics | both files are pointers since 15254cb; the words are in objekt-files/notes/archive/docs/ | Medium | rewrite to the archive paths |
| M2 | .claude/agents/fact-checker.md:43-46, practice-reviewer.md:14-17, architecture-auditor.md:31-34 | "A-Frame 1.8.0 at C:/.../aframe-1.8.0/docs"; "(a `find /` ran an hour and a half after a review ended ...)" | 2, volatile specifics + history narrative | a version pinned in three copies rots at the next update; the incident is archaeology, the rule is what counts | Medium | rewrite each: the docs folder named by docs/tools.md; keep the rule, drop the incident |
| M3 | .claude/agents/quick-research.md:26-27 | "(editions renumber: corridors are 3304 in the 1976 building code, not 3305)" | 2, recency trap | one session's incident kept as a permanent example | Medium | remove the parenthesis, keep the rule |
| M4 | .claude/agents/deep-research.md:21-22 | "(over 500 files ...)", "the 146 paper cards" | 2, volatile specifics | counts go stale as the library grows | Medium | rewrite without counts |
| M5 | CLAUDE.md:15 | "A-Frame 1.8.0" | 2, volatile specifics | the version lives in vendor/ and tests/vendor.test.mjs | Medium | rewrite: "A-Frame (the version vendored in vendor/)" |
| F1 | CLAUDE.md:12 and tools/claude-guard.mjs:442 | the circles imported by CLAUDE.md and printed again at start | 1c padding (repetition) | Anthropic: a hook printing what CLAUDE.md loads adds a second copy | - | flag: his decision ("in two places") |
| F2 | docs/owner-decisions.md:39 | "the night search of 14.10 went to him unchecked ... for that task only" | 2, recency trap | a one-time exception inside a permanent rule | - | flag: his |
| F3 | .claude/rules/measures.md:19 | "shelf 3 paused for the long measure of shelf 4" | 2, time-sensitive | a status inside a permanent rule | - | flag: his |
| F4 | .claude/rules/game.md:22 | "(after the process rebuild)" | 1d migration-relative | relative to a past state | - | flag: his |
| F5 | .claude/rules/setup.md:34-35 | updates of A-Frame, Meta, the browser and Claude Code watched monthly | 1d unenforced instruction | nothing schedules it; on 2026-10-14 an old Claude Code copy (2.1.268) sat beside the app's 2.1.295 | - | flag: his; a routine could hold it |
| F6 | CLAUDE.md:3 | "variant B" next to his quoted choice of 11.10 | low, idiom | his quote names the third option with the Cyrillic letter that looks like Latin B, the second; and history in a rule file | Low | flag |
| F7 | .claude/agents/ | quick-research and deep-research differ in limits and report size; request-auditor and architecture-auditor kept though unused (docs/progress.md, 14.10) | 4, roster | every agent description rides in every request | Low | flag |

## Proposed diff (proposals only: process files change through his permission)
H1, M1, M2 (three hunks), M3, M4, M5, each one hunk, as worded in the table. H2, H3 and the flags go to him.

## Outcome (same day)
- Mine, with his permission: H1, M1, M2, M3, M4, M5 rewritten as proposed.
- His, one at a time with his answer: H2 and H3 rewritten (his approval of each); F1: the circles load
  once, with CLAUDE.md, and the start hook prints them only when the import is gone (option A); F2 and F3: the
  one-time exception and the shelves' status removed, his words kept in the archived history (option A each); F4: the
  reference to a past state removed (option A); F5: held by a monthly scheduled task in the desktop app
  (monthly-updates-check), his line unchanged.
- F6 withdrawn: the archived history shows the letter was asked and answered on 11.10 ("the variant that named the
  documents' paths", so B); my error to have flagged it without reading the archive first.
- F7 left as is: the two research agents do different jobs; the two auditors are named by docs/tools.md for a step's end.

## Verify (Step 7)
After any accepted hunk: npm test (the structure test reads several of these files), and for M1 one request-auditor
run on a short span of his messages.
