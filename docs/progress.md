# Progress

The newest entry is read at the start of every session, with `git log --oneline -20` and docs/features.json
(CLAUDE.md, "Every session"). Newest entry on top. Each entry: done, not done and why, next. Anything outside the
feature at hand goes to the end of docs/board.md, one line each.
Entries of 14.10 and before: docs/progress-2026-10-14.md; the earlier ones of 15.10: docs/progress-2026-10-15.md.

## 2026-10-16, day — what the four windows forgot, then the delivery chain
A window opened by the one of feature 3 to finish the 26 forgotten items (side notes: forgotten-all-2026-10-16.md), detached
from it the same day (the windows woke each other up the chain).
Done:
- CodeRabbit: no card entered (his answer), nothing charged on 23.10; then the free open-source plan, a review called by
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
- PR #23: CodeRabbit's two findings: the record rule narrowed, not dropped (ea41abd, it agreed); assets/ shown never
  to have existed (it withdrew). The app's auto-mode classifier refused my fast-forward push to room-polish ("CI
  Bypass"), so he merged with the button (15a7615); the main folder pulled.
Not checked: the start without its first line (the next window's start shows it).
Errors of mine: a node one-liner of mine was stopped by the guard's false rule (fixed in 1c93161); a script of mine
failed on CRLF lines in docs/tools.md (nothing written there; redone); the allow rule for a push to room-polish
removed as unused (c889c07), then my push refused (whether the two are linked: not checked); the LoC link held back
"for the end" instead of given to him at once.
For him later: "never advised against" in his decisions (row 34); the circles' header said twice; rare setup lines
out of what loads, by his principle of this window.
Next: the floor directory (the entry above).

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
