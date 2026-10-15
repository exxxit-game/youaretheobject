# Progress

The newest entry is read at the start of every session, with `git log --oneline -20` and docs/features.json
(CLAUDE.md, "Every session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the
feature at hand goes to the end of docs/board.md, one line each.
Entries of 14.10 and before: docs/progress-2026-10-14.md; the earlier ones of 15.10: docs/progress-2026-10-15.md.

## 2026-10-15, night — the counted process files one by one
A window opened by "Old problems one by one" (step 3 of its brief); his order here: the process files, then the floor
directory, then every other link one by one (the board's end).
Done:
- His measure came to me at this window's start; his screenshot shows no line from the machine, only my repeat
  (row 69: the desktop checked, the phone not).
- His approval: the monthly update check gone, the scheduled task and two setup lines (58631a0); he reminds me.
- Four read-only helpers reviewed every counted file (notes: the shared notes folder, review-*.md). The guard refused
  47 real calls since 09.10: 2 right, 2 arguable, 38 false, 5 from a removed mode.
- Cuts, one change a commit, each with its expected effect: the prover's 9 cases that only repeated the tests
  (62b5848); stale comments in the gate, prover and hooks (4ab897c); two false-stop kinds of the guard, a raw -f
  "@" field (c780fea) and one-liners naming review-gate (1c93161); the guard's stale text and dead code (052bc1c);
  the helpers and the skill (10d299b); CLAUDE.md, the tools page, settings (c889c07); stale CLAUDE.md citations
  (016ab5c). On his yes: the guard's SQL check, after the connector was read as supabase_read_only_user with no
  write grants (7a25902); database changes stay a file he pastes and runs. His approval of 1, 2 and 3: three stale lines
  of his rules (e52f656). Process size 129 981 to 116 872.
- His doc: rows 21, 39, 40, 42, 43, 52 closed with their commits; 69 and 74 noted as checked.
Kept on purpose: the start's feature line (a machine bringing it beats a text telling me to fetch it); imports() not
moved into the test (text moved where the limit does not count, row 22); the library guard's wide path match
(narrowing adds code); systemMessage until the phone is checked; the deny rules as the spare lock.
Checked: npm test green after every commit; tools/prove-guards.mjs CRLF and LF: 39 of 39 after the first cut, 37 of
37 at e52f656.
Not checked: the hooks act only after the merge and the main folder's pull; the start without its first line.
Errors of mine: a node one-liner of mine was stopped by the guard's false rule (fixed in 1c93161); a script of mine
failed on CRLF lines in docs/tools.md (nothing written there; redone).
For him later: "never advised against" in his decisions (row 34); the circles' header said twice; rare setup lines
out of what loads, by his principle of this window.
Next: the pull request, CodeRabbit, the merge, the main folder pulled; the floor directory (features.json number 3).

## 2026-10-15, late evening — old problems one by one: the one list, the cleanup, four cuts
A window opened by the evening window (its brief: one list of the old problems from the analyses already made, the
cleanup he confirmed, then each counted file, then the floor directory).
Done:
- The cleanup, chosen by him here ("remove all three"; asked again because the app's auto-mode classifier stopped
  the removal of oversight resting on the earlier window's confirmation): the thermometer (InstructionsLoaded hook,
  its record, the not-loaded lines), the end-of-turn reminders (Stop hook, tools/leftovers.mjs), the laptop health
  check (tools/health*.mjs, its test, the YAML copy only it used). His measure moved to the start hook (source
  startup or fork). The lock checks of the health test (deny rules, onFailure block) moved to tests/guard.test.mjs,
  the helpers' turn limit and model to tests/structure.test.mjs; docs made true.
- Four cuts he confirmed after a study of what could hold our text better (none holds a judgement rule more firmly
  than text: Claude Code's features overview, "make it a hook"; hooks see only what a tool's input shows, issue
  anthropics/claude-code#70420): the research helpers load no CLAUDE.md and mark each source's date and fit for now;
  step 1 reads the newest progress entry; the CodeRabbit plugin in the app off (the GitHub app reviews as before);
  CLAUDE.md's code-shape lines cut to a pointer to the structure test. Process size 176 026 to 129 981.
- One list of the old problems: six helpers read every analysis (his 16 uploaded pages, 22 published pages, the
  errors by kind, the self and stack studies, the audit, the board and the log of 15.10): 599 entries; 209 closed
  or superseded before, 5 closed here, 385 merged into 247 problems; two independent checks, about 15 lines fixed.
  His doc, a state per line to tick off: https://claude.ai/code/artifact/aeffd195-fe5e-4c4d-b9a1-b50a56a92612. The
  lists and the merge map: the side-session notes folder (one-list.md, one-list-map.md, problems-A to F).
- Studies on his questions: Cosmogram's records (what held: removing the risky path, a deny at the act; what did
  not: text rules, warn or ask hooks); human methods untried (the hierarchy of controls; Deming on tampering: one
  planned change with a written prediction, not a rule per error); the update to app 2.42304.0 with Claude Code
  2.1.299 (nothing in our files to change; open Windows issue #102351 on edits in auto mode).
Checked: npm test green; tools/prove-guards.mjs on the laptop, all 48 guards saw their mistake (one was blind, found
by GitHub's run, fixed in 1f8e6ff); GitHub's test green; CodeRabbit on #22: four findings fixed, one kept with a reason.
Not checked: the hooks act only after the merge and the main folder's pull; whether his measure reaches him at a
new window's start; the update's three checks (an edit passes in auto mode, the guard refuses a commit that skips
the hooks, the measure shows).
Errors of mine: I began removing the watchers on the earlier window's confirmation, not on his word here; a mistake
planted into a file the acceptance gate imports left a guard blind; a node one-liner wrote literal line breaks into a
test (restored, redone with Edit); the list's first form copied "his choice" onto technical items and turned "not
checked" into "absent" (both caught by the checks); one doc write over the doc service's 64-chip limit.
Next: merge #22 and pull the main folder; the update, then its three checks; the counted process files one by one,
sorted by the hierarchy of controls (a text rule goes where a machine holds the same); then the floor directory
(features.json number 3) to his accept word.
