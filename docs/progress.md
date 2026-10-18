# Progress

The newest entry is read at the start of every session, with `git log --oneline -20` and docs/features.json
(CLAUDE.md, "Every session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the
feature at hand goes to the end of docs/board.md, one line each.
Entries of 14.10 and before: docs/progress-2026-10-14.md; the earlier ones of 15.10: docs/progress-2026-10-15.md.

## 2026-10-18 - First portable trial: implementation and bounded checks
Pushed through c8cb72f on codex/trial-migration: preview-only 02-lines uses two Cretenoud 2020 configurations, 2 practice and 4 measured adjustments. Old 01-control remains. Stable identity and app-supplied number/placement; no result upload or production change. Primary paper and transfer limits are in docs/rooms/02-lines.md and the library index.
Fixed reviewer findings: stale choices/bars, pause generations, XR visibility, elapsed time, own 0-25 boundary warning, controller instructions, result replacement confirmation, seated stop and paginated results. Independent paper/practice reviews ran; both own-look gates passed. Eight voice transcripts and full sequential npm test passed. GitHub runs39128154552/39128392118 caught slider-panel overflow; fixed in8e8e6f7. Run39129318956(15c4020/merge3438343) passed npm, all browser flows and both guard mutations. All15 screenshots inspected; no clipped text, layout report empty. Run39130041900(c8cb72f) also passed; export hash matches15c4020. PR28 was draft, so CodeRabbit skipped it despite a green status: assistant oversight. Marked ready and requested review; actualc8cb72f review pending at13:20UTC.
Local automated WebGL overloaded this laptop earlier. Both smoke entries now refuse local/self-hosted execution; quick commit tests run sequentially. GitHub workflow stores new-room screenshots. Quest checker adds a bounded trial route without proximity override or waking the device. USB headset is connected and in standby at observation.
Resolved export mismatch: Windows git archive applied CRLF conversion. Command-scoped core.autocrlf=false/core.eol=lf produced exact GitHub version1eb6c4b5d3287de54cdd1d4adcdafa388a8d662c161af5b29a29a895de5a46cc on Node24.21. Same Node22 alone had not fixed it. Fonts unchanged. Smoke also retains its actual tested export with screenshots to avoid rebuilding for Quest. c8cb72f changes only headset URL quoting/test/lesson, not game files. Actual Quest preparation found Android shell splitting URL ampersands; fixed and regression-tested. Off-head browser restart also failed to expose its tab list. No proximity override. Asked owner to wear the USB-connected Quest for the next technical check. Exact canonical export's185 served files match the latest successful CI version. No successful device launch, VR, playthrough or acceptance. Next: obtain the retained tested export, inspect review findings and perform the same-version Quest check. Owner evaluates interest, clarity and comfort; technical checking remains the assistant's job.

## 2026-10-17 - Complete-process request: workspace gap, index fix and recovery
Owner asks for a reasoned process suited to our two-person studio before more game work, plain-language learning and no prolonged setup cycle. He clarified room-polish as the development/test branch and main as release, and supplied another person's advice as material to assess. No model change or release approval inferred. Technical details: docs/research/source-audit.md, process extension and branch/site map.
Reproduced and fixed pre-commit parsing disk contents instead of staged contents; real Git regressions cover partial staging and commit -a. Configured trial-only Git hooks to use its own tools/hooks; primary unchanged. Full npm test passed at a964ea6, whose real pre-commit ran successfully. Codex entry instructions explicitly read the retained workflow.
Recovered both source copies (637/616 files, dirty files included) from a separate F: snapshot, then all 2,205 recorded library files, checking every hash. Scope/time boundaries are in the report; this is not cloud, credential or live database recovery.
At 4749351, CRLF mutation checks caught 37/37; LF had one refusal with missing diagnostics. Isolated secret-hook probes passed in both modes, but that alone did not close the full-run failure. Code checkpoint ee239d931fb64263a59603553ca8f6a312f71d4d now records subprocess errors/silent failures; four focused diagnostic cases passed, and the complete LF repeat caught 37/37. The original failure log remains; its cause is unknown. Whole old log entries moved without text loss; both working and prepared-commit structure checks passed.
Live branch/site comparison: public main 26f0944 uses A-Frame 1.7.1; published preview's main.js matches ff7a812 and its index uses 1.8.0. Remote room-polish is 435e6d2, primary is 3084b40, current repairs are on the trial branch. Direct-source main publication does not deploy the new generated cache. Draft PR28 still targets room-polish. Evidence: branch-map.json and guards-lf-ee239d9.txt in the private source-audit folder.
Quest 3 was connected, charging at 95%, not worn at 12:45 UTC; no new VR launch/playthrough. This chat remains in the old primary folder, while native hooks/profiles are in the trial. Supported attachment refused ownership by another task. Real Codex owner/review event counts remain zero; no bypass or fabricated records.
Not complete: correct chat context and normal hook trust, real scoped review callbacks, current independent review and remote CI, permitted preview/Quest checks, production export path and owner acceptance. Next: finish the exact-version CI checkpoint and supported workspace connection, then prove one complete existing-game cycle before extending the toolchain. No main merge, website publication, purchase or live migration.

## 2026-10-17 - GitHub gates and the first real CodeRabbit review in Codex
Starting 693a0a4, codex/trial-migration. finish rejects skipped/missing/failed reviews, failed tests, drafts, open threads and a changed head; --check is read-only.
CodeRabbit uses repository config: review errors fail, owner decisions cover all paths, drafts and automatic code fixes stay disabled. AGENTS/README/state separate Codex evidence from historical claims.
Owner-approved settings saved and read back: room-polish requires PR, test from Actions (15368), resolved discussions; main requires resolved discussions; no bypass. Dependency graph/alerts on; automatic updates off, CodeQL unconfigured.
Code 32710b9 passed npm test; a misplaced map entry was corrected. At 773c541, GitHub CI 38968880258 passed including smoke.
Owner-approved configuration/review comments posted in PR28. Bot reviewed 773c541 (run e3bc5b30-71df-4631-a0f8-2bda879a45fd); effective YAML confirmed. Live --check rejected draft plus one unresolved finding despite both checks passing.
Finding r4299575101 confirmed: terminal bot errors had no retry route. finish now prints the exact manual command for error/failure; pending reviews get no duplicate request. Full npm test and diff --check pass; this fix is not covered by the prior bot review.
Service audit evidence and owner actions are private: objekt-files/notes/codex-service-audit-2026-10-17.json. No production data, service settings or subscriptions changed by this audit.
Next: publish this correction and run the owner-approved repeat review on its exact version; real Codex callback activation (still unproven), recovery verification. No merge or game release claimed.

## 2026-10-16 - GitHub settings read in the owner's authorized Chrome; no settings changed
Draft PR #28 is open against room-polish, head 693a0a4; GitHub run 38962201372 passed all stages.
CodeRabbit explicitly skipped the draft despite a green status. It has not reviewed this version.
A finish.mjs correction and isolated passing readiness tests are in Temp/objekt-github-audit-20261016 only.
UI confirmed: Actions default token read-only, self-approval off; main requires PR and test from GitHub Actions.
room-polish only prevents deletion/force push: PR/tests are not required. Review-conversation resolution is off.
Dependency graph/Dependabot alerts are off; CodeQL is unconfigured. Secret/push protection and Pages HTTPS are on.
Six app installations: evidence in objekt-files/notes/codex-github-audit-2026-10-16.json, outside this public repo.
Next: get specific approval for live settings; integrate the prepared finish/CodeRabbit corrections and test.
Codex real callback activation and external-service billing/configuration remain unverified.

## 2026-10-16 - Codex event bridge prepared; runtime activation remains unverified
Added tools/codex-events.mjs, isolated tests, .codex/hooks.json and two reviewer profiles. They record events; they do not start reviewers.
Reviews require matching session/agent/checkout, a complete final report and unchanged files. Owner messages carry checkout provenance;
duplicates cannot refresh acceptance, another checkout is rejected, and legacy Claude records remain valid.
npm test passed. The Windows command worked in a temporary path with spaces, nested cwd and a failure exit; TOML profiles parsed.
Corrected the first fixture-root replacement, shell escaping and missing architecture-map entries before passing.
The size check exposed uncounted Codex steering. Explicit migration proposal: include AGENTS, Codex profiles/hooks, bridge and owner-links;
baseline 116793 to 134147 characters (+17354). The growth check and 1000-character ratchet remain; PR review is still required.
Real journals were unchanged (SHA-256 owner messages 4933e4378c44..., reviews 2e92f5f8681e...); status showed zero Codex events, no lock.
Runtime trust/callback delivery, real review and feature acceptance are NOT established. No game release is claimed.
Next: normal hook trust/activation in the trial, a neutral real owner message, then a real scoped review when needed. Never inject success records.
Details and sources: docs/tools.md. The primary checkout retains its handoff and owner changes.

## 2026-10-16 - Codex readiness recheck: migration is not finished
The owner asked for an evidence-based handover, useful integrations and reliable continuation between chats.
Confirmed:
- The primary checkout is still room-polish 3084b40 with two preserved local changes; the attached trial is
  codex/trial-migration b42f8a0, game code 435e6d2. The latest real-headset check below applies to that trial.
- Code, tests, GitHub, read-only Supabase, Drive reads and Quest have bounded successful checks. This does not
  establish deployment, live migrations, complete recovery, or every installed skill's operation.
- Codex config selects Astra/xhigh. Native browser inventory exposes Chrome and the in-app browser.
- No project .codex layer, global hooks.json or inline global hook configuration was found. Repository
  .claude/settings.json wires owner-message and reviewer records to Claude events. No Codex equivalent is
  demonstrated. Publication still lacks the exact practice review; preserve the gate, do not forge a record.
- Git's shared hooksPath points at the primary checkout. Its pre-commit and pre-push files currently have
  the same SHA-256 as the trial's copies; that is not proof of future worktree isolation or runtime enforcement.
- F:/objekt-files exists, despite older state text saying no separate-disk copy. Its freshness, completeness,
  independence and recovery have not been established. The earlier library manifest remains an inventory.
Changed:
- Added a short AGENTS.md in the primary and trial checkouts: resume from the trial's progress log, verify
  the working copy, preserve owner decisions, use appropriate checks, and keep unverified capabilities explicit.
- Fixed the previous Codex log entry's Russian quote to an English translation after the structure check
  rejected it. The original answer remains in the external Quest result.json. No game code changed.
- Searched the plugin catalog for relevant observability, security and research options. No new integration
  was justified by an established missing provider; none installed and no permissions expanded.
Validation: structure tests passed after these changes; trial git diff --check passed; the two 17-line AGENTS.md files have identical SHA-256 and no trailing whitespace.
Sources: https://learn.chatgpt.com/guides/best-practices and https://learn.chatgpt.com/docs/hooks .
Open: validate Codex review/owner-acceptance recording; reconcile unfinished Claude work and recovery;
prove a bounded change through checks and a reviewable release, with rollback and owner-visible evidence.
Next: migrate and test the two event-dependent records without weakening the existing gates. Store delivery
and engine choice remain a separate product decision; they do not justify another general setup cycle.

## 2026-10-16 — Codex current-code Quest launch and controller check
The owner approved proceeding from setup to a practical headset check.
Done:
- Ran the existing local preview from codex/trial-migration (b42f8a0; game code 435e6d2). The worktree was clean;
  its only difference from the already tested code commit was docs/progress.md. The broad suite was not rerun.
- Quest 3 connected over USB. The headset browser loaded localhost:3000; SHA-256 of src/main.js matched the
  worktree, including after entering VR. The scene loaded and the XR session was visible with both controllers.
- Inspected a screenshot containing both eyes. Five-second sample: approximately 90 fps, worst interval rounded
  to 16 ms, 52 draw calls, 79,935 triangles, multiview on. This is not a sustained performance result.
- The owner answered the in-headset visual/controller question: "Yes, I can press it" (English translation; original in result.json). He separately confirmed that
  he had closed the first game tab himself. No crash is established by that tab disappearance.
- Showed the completion instruction in VR. The tool confirmed the headset was taken off, delivered the HUD-off
  broadcast and put it to sleep. The local preview server remains running in this Codex task session.
Evidence: ~/.codex/visualizations/2026/10/16/01a145d5-8edb-73b3-9695-97ebfe5a5bcd/quest-current-check/
(result.json, browser-current.png, vr-current.png).
Found: quest-look.mjs perf counts intervals over 1000/72 + 2 ms, although its text says "slower than 72 Hz".
Treat that counter as having a 2 ms tolerance; do not report it as a strict 72 Hz check.
Not done: full room playthrough, all controls/locomotion, audio, sustained stability, store build or purchases.
No game code changed, publication made, review record fabricated, or feature acceptance recorded.
Next: one bounded gameplay task, using this proven current-code path; exact publication review remains outstanding.

## 2026-10-16 — Codex trial migration baseline
The owner asked Codex to take over reversibly, preserve prior work, assess the whole tool chain, and teach him one useful action at a time.
Owner guide: https://chatgpt.com/space/page_42ac40c68e748191affb6ef7b9686d0e (read back; rendering not inspected).
Done:
- Isolated trial: codex/trial-migration in ~/.codex/worktrees/codex-trial-migration/objekt; fast-forwarded from
  3084b40 to room-polish 435e6d2 (nine existing commits). The primary folder and its two local changes are untouched.
- npm test passed at 435e6d2. The local shell-hook cases were skipped by the test itself; GitHub run 38905672992
  passed for that same commit. Neither result establishes that Claude hooks run in Codex.
- Google Drive connected: objekt-files and its six main folders found; five ANSUR file names and sizes match the
  local files, and one text file was fetched. Full cloud completeness and restore remain unverified.
- Local library manifest: 2,195 files, 1,287,376,373 bytes, SHA-256 for each; no read errors or changes during reading.
  This is an inventory, not a backup. Evidence: ~/.codex/visualizations/2026/10/16/
  01a144b4-cfa4-7562-a2c9-3bf52c70806c/migration-evidence/checkpoint.json and library-manifest.json.
Found:
- The published preview still records source ff7a812 (10 Oct). Its live src/main.js matches that source, not
  435e6d2. The earlier Codex headset check proved access and VR on this old preview, not the current game.
- The trial has an own-look review and an exact paper review for room 01, but no exact practice review for
  publication. No review records were changed and no preview was published.
Not done: native import, Codex event-hook compatibility/trust, acceptance logging, exact practice review,
the current version's headset check, full archive reconciliation. No feature was accepted or game code edited.
Next: inspect native selective import before copying old rules; test the two event-dependent records, then
inspect the current game and obtain the required exact review before publishing its test copy.

## 2026-10-16, evening — the delivery chain published; Codex's review checked and its first fixes
Same window (his «do it here» to the proposed next window), on a new branch from room-polish 3084b40.
Done:
- The delivery chain document rewritten from both fact-checks and the real weights research, checked again by two
  narrow runs, published as his doc: https://claude.ai/code/artifact/61184b9b-cbd5-41be-82ad-54088c45a30e (docs/state.md
  names it as the map each window checks the delivery against). Added after: his decision of 12.10 that paid rooms'
  files come from our own server after a purchase check, so mirrors serve the free floor only (my omission).
- Codex (ChatGPT, read-only, on his laptop) reviewed the whole project at 834510f: 24 findings. Three fact-check runs
  checked each against the current code (side notes codex-review-2026-10-16.md): 18 hold, 4 in part, 1 mostly fixed,
  1 fixed by his text 5. None reaches a player today: the live main never calls the database.
- Fixed now, one commit each: 23 (three docs that said what the code no longer does), 12 (sleep and browser restart
  refuse a headset on his head, in tools/headset.mjs itself, held by tests/guard.test.mjs), 15 (the long measure exits
  non-zero unless it succeeded), 21 (the test copy checks its own commit's run and is marked unchecked otherwise),
  20 (.claude/settings.local.json in the repository's .gitignore).
Errors of mine: a git checkout that wiped my own uncommitted edit while testing the guard (redone at once); the
paid-rooms server missing from the delivery document until I read his data decisions.
Not done: the data fixes (his choice: the next window); the rest of Codex's findings (board line of 16.10).
Next: the data fixes as on the board (game code first; the migration file checked before he runs it), then his
reading of the delivery document and his choice in its section 9.

## 2026-10-16, day — what the four windows forgot, then the delivery chain
A window opened by the one of feature 3 to finish the 26 forgotten items (side notes: forgotten-all-2026-10-16.md), detached
from it the same day (the windows woke each other up the chain).
Done:
- CodeRabbit: no card entered (his answer), so no charge is expected when the trial ends on 23.10; then the free plan, a review called by
  comment under 10 stars. The records that said the plan's steps were given to him corrected. ChatGPT Plus (his, 15.10) in
  docs/state.md; its setup as the second checker waits for its own window.
- His decisions approved word for word, texts 1-4 (the HUD at every VR look, answers by buttons in the headset,
  the building A1, the theme files' repeated head cut for room) and text 5 (the head of his decisions: a new fact
  against one is told him once); the talk protocol closed as it stands (his approval). History entries off the repo.
- Owed to him: the six login-only pages (three read with him: UBC 1976 Sec. 3302 passes, the 1981 handbook, the 1973 dead
  ends); the stack study told; five unanswered questions answered; his game decisions for later in his doc.
- The delivery chain he asked for (up to 1,000,000 players, no captcha, every store, the heaviest real weight): six
  researches in the side notes folder (hosting, stores, law and money, product and operations, real weights, three checks);
  the chain document drafted (delivery-chain-draft-2026-10-16.md there) and under two fact-checks; not shown to him yet.
- tools/finish.mjs, his request of 15.10: a window's end in one command (CLAUDE.md step 6).
- Technical leftovers: stale records, his doc's rows 103 and 155 closed, two library records, the Portland photos kept.
Errors of mine: numbers given in chat on assumptions (5 MB a room, 10% buyers), then the future game weighed by one room,
a list instead of a chain; technical questions put to him; detail he does not need. For 21.10: the start hook counts 2
accepted this week, but one is the smoke test (his yes to a green run, not seen in the headset); by his rule it is 1.
Not done: the delivery document published and read by him; the merge.
Next: fix the fact-checkers' findings in the draft, publish it as his doc (the map every window checks against: the link "me"
first), then his choice in its section 9 (stay web and light, native store apps, or both); ChatGPT's setup window.

## 2026-10-16, late night — feature 3: the whole building, then the directories; accepted
A window opened by the one of 15-16.10 for feature 3, in his order of 16.10: the whole building first.
Done:
- Research (docs/research/vr/12-whole-building.md): the Science and Engineering Offices, University of Illinois at
  Chicago Circle (13 stories, 1968: its elevator lobby, corridor and stair photographed in 1968, its floors' 2023
  plans) and University Hall there (28 floors, 1965); the 1978 BOCA code read in its text (two exits a floor, remote,
  dead ends at most 20 ft, elevators no exit, a floor sign on every stair landing), added to the papers index. Our
  floor broke two of those rules (one stair, no elevators).
- His choices by buttons: variant A (the elevator hall where the stair was, a stair on each side); after my error in
  the elevators' size, A1 (the same corridor, 5 rooms; A2 kept 9 in a longer corridor, my advice); the directories'
  words "for now as they are".
- Built (src/app/lobby/plan.js, hall.js, directory.js): the elevator core in the middle three bays of the south
  wall (the hall, four centre-opening 3'6" x 7'0" entrances, lanterns, call stations, light slots), a stair in each
  end bay, the way in and out at the hall's end (a glass wall with a pair of swinging doors), walking and the
  clipboard over the corridor and the hall; the main directory at the entrance (changeable letters on black felt,
  20 x 30 in) and the floor directory where one comes out of the hall (blue/white panels, capital and lower case).
- Checks: npm test green at every commit; two fact checks of the building page (its findings fixed in the research;
  the page itself not published, a pictures sheet sent instead); the practice review (its findings fixed or on the
  board); room 01's check against its paper, which the headset lock asked for (15 findings on the room itself, none
  from this window: on the board and in the window's notes); GitHub's smoke test found a light slot 4 mm under the
  ceiling and the worst view at 100 draw calls (both fixed; the last run pending at this entry); my look in the
  headset (90 fps, 31 draw calls, OVR Metrics' HUD on), then his: he accepted item 3 (16.10). passes: true.
- His two requests on the headset: OVR Metrics' HUD on at every look in VR, off when the look ends (tools/quest-look.mjs
  vr and sleep).
- His request to answer from inside the headset (he cannot press the chat's buttons with the headset on): his choice of
  my mixed advice, now: tools/quest-look.mjs ask (a question in the headset, its answers as the game's own buttons
  under the controller's ray) and end (the last step: take it off and answer in the chat; then the HUD off and
  asleep); his acceptance of a thing stays in the chat, his own channel (a press in the headset passes through my
  tool's link to the page). Checked on the laptop (a press recorded, the note and buttons gone); in the headset with
  him tomorrow.
Errors of mine: search words given to DPLA that found nothing; the elevators drawn a third of their size, so variant A
had to be redrawn after he chose it; variant A called the 1968 building "as is" (it is modelled on it: one corridor,
not two offset wings); floor 1's stairs first drawn leaving through the hall (BOCA 611.5); the floor directory first
put on the hall's side walls, pointing nowhere useful (the practice review); the light slot and the draw calls
(GitHub's smoke test).
Pull request #25: GitHub's tests green from 9dfd067 on; CodeRabbit's three findings fixed in d7d25c7 (the east call
station's down button; the HUD's lines say "asked"; a HUD request not delivered is reported and stops vr), each thread
answered.
GitHub's runs on d7d25c7 and 416c5ed green. CodeRabbit's second round, four findings, fixed: an unanswered question's
buttons taken away, end stops when its step was not shown, a power dump the tools cannot read counts as neither on
nor off the head (no VR, no restart, no sleep on it); and passes was set true with the acceptance while a run was
pending: answered with the runs, all green.
The headset answers tried in the headset with him: quest-look ask showed the question with two buttons, his press
came back (the first button, "I see them, pressing"); end waited until he took the headset off, asked the HUD off and put
it to sleep. (The laptop's preview server had stopped overnight: the headset showed an empty page until it was
started again.)
Not done: the merge into room-polish (I try it myself first; if refused, his merge button with "Create a merge
commit"), the main folder pulled.
Next: room 01's paper findings (the board's end: the green-light tapes have a learnable pattern while the player is
told it is chance), the corridor's light (feature 4), and the board's three thoughts on the elevators, their jamb
numbers and an EXIT sign over the stairs.

## 2026-10-16, night — the floor directory: period photos; the whole building comes first
Same window, after #23; his choice: the two forms are built in a new window.
Done:
- Period photos with him and three helpers, each image looked at (docs/research/vr/10-floor-directory.md, 1a):
  form A in our years: WSU Johnson Hall 1969, Pepperdine 1965, Chattanooga 1970-74, Fort Worth 1976, Portland
  courthouse (survey of April 1983); form B: a 1959 catalog, a Tampa lobby (record not identified). Shown to him as
  one page: https://claude.ai/artifact/JjV8FUgjbXgaLJr9KR9Kbc.
- An August 1979 government report on a hospital's signs: the main directory at the entrance has changeable
  letters (form A); floor directories at the elevators and stairs are frames of inserted panels (form B). So the
  form follows the board's place in the building, not a pick between two.
- His point (16.10, in English): see the whole building first; we put the stairs in the middle, and where they lead
  is unclear. True: nothing decides where they lead, there are no elevators, and the one stair stands in the middle.
Errors of mine: search words given to him before I tried the searches myself (DPLA opens to me); the Tampa image
numbers taken for record numbers, so three source links pointed at other photos, and the 1970 board was wrongly
called unverified (CodeRabbit on #24; corrected).
Next (a new window, his choice): the whole building from a real university building of the period (outside photos,
plans, stairs, elevators, entrance) and the fire rules of the time, shown to him as pictures with options; then the
directories in their places (the main one at the entrance, a floor one at the stairs and elevators); feature 3.

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
the hooks, the measure shows). Checked on 16.10 (the window that finished the forgotten items): edits pass in auto mode (every edit of that window landed); the refusal of a commit that skips the hooks is asserted by tests/guard.test.mjs (npm test green); the measure line was printed at that window's start and said to him; on his screen: not checked.
Errors of mine: I began removing the watchers on the earlier window's confirmation, not on his word here; a mistake
planted into a file the acceptance gate imports left a guard blind; a node one-liner wrote literal line breaks into a
test (restored, redone with Edit); the list's first form copied "his choice" onto technical items and turned "not
checked" into "absent" (both caught by the checks); one doc write over the doc service's 64-chip limit.
Next: merge #22 and pull the main folder; the update, then its three checks; the counted process files one by one,
sorted by the hierarchy of controls (a text rule goes where a machine holds the same); then the floor directory
(features.json number 3) to his accept word.
