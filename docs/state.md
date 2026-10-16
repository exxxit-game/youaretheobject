# Where things are (the work itself: docs/features.json and docs/board.md)

Codex migration: work in `C:/Users/admin/.codex/worktrees/codex-trial-migration/objekt`, branch `codex/trial-migration`; resume from AGENTS.md and docs/progress.md. The primary checkout contains older code and local changes.
Setup reports dated before the migration describe Claude; they are not proof of Codex behavior. Current verification and pending work are in docs/progress.md.
## Where things are
- Repo `exxxit-game/youaretheobject` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (registered 7.10.2026 at Namecheap to 7.10.2027; a spare, youaretheobject.top, bought by him 14.10, to 13.10.2027, pointed nowhere yet) (GitHub Pages from `main`; `main` is an OLD package; since 12.10, his yes, main takes changes only by a pull request with the test check green, no bypass: ruleset 24770045, the test check pinned to GitHub Actions). The Supabase connector since 13.10: the custom «Supabase чтение», https://mcp.supabase.com/mcp?project_ref=rkvdwzlymmewsxjysgma&read_only=true (one project, a read-only Postgres user); the full one removed. Read 13.10 through it: current_user supabase_read_only_user, transaction_read_only on, no INSERT or DELETE on app.runs, no CREATE in public or app, rolbypassrls true (it reads every row). My GitHub access since 12.10: one fine-grained key he made (this repo and object-preview; contents, pull requests, workflows write; actions, statuses read; no administration, no deployments; expires in 90 days), git through gh; the old logins removed. Work: `room-polish`.
  Each session: one visible thing for him plus internal work (the board). The recorded Claude setup made a worktree from the main
  folder's HEAD (`.claude/settings.json` worktree.baseRef head; the default was old main). At a step's end the session branch goes into room-polish through a pull request CodeRabbit reviews (earlier report: trial to 23.10, no card; current billing unverified; public projects may qualify for its free plan, where a repository under 10 stars calls a review by the comment `@coderabbitai review`, which I post: docs.coderabbit.ai/management/plans, read 16.10), then the main folder pulls; main only on his word.
- Room 01 = illusion of control (Alloy & Abramson 1979), `src/rooms/01-control/`: SET ASIDE 08.10 as a lab
  room (16–20 min of waiting, owner found it unbearably boring). Playtest `?playtest=1`, speed `?speed=N`.
- Migrations 0009 (date only, random key, consent version, room 01 JSON Schema, keyed IP limit) and 0010 (known consent
  versions, the comparison's gate; run 11.10, read back) are live: the owner ran 0009 in the SQL editor on 10.10
  (history 20261010151418), read back the same day (tables, functions, grants, the pg_cron launcher, compare_room
  through the API); run again, it stops at the pg_cron setup and changes nothing. 0011 (the doors: rejection policies, a daily IP-hash key, the comparison's cap) run by the owner 13.10 and read back; app.recent.trusted true on its first calls: CF-Connecting-IP arrives.
- Supabase `objekt` (`rkvdwzlymmewsxjysgma`, eu-west-1 Ireland), in the owner's organisation on the paid Pro plan (read
  10.10 with the Supabase connector's get_organization; a paid project is never paused), private schema `app`:
  `runs` via `submit_run` (room 01 checked against supabase/schemas/01-control-1.json), `playtests` via `submit_playtest`; both
  insert-only for anon, verified. Sending is ON in code with consent; privacy page `privacy.html`
  (contact t.me/exxxit). Tests pin client fields to the SQL (`tests/results.test.mjs`, `tests/playtest.test.mjs`). The laptop's Supabase CLI: logged out 12.10 on his word, no token.
- Files outside the repo, one folder `C:\Users\admin\Documents\objekt-files\`: `papers\` (every paper as `<id>.pdf`
  and `<id>.txt`), `datasets\`, `imports\` (exports as downloaded), `notes\` (his messages, the review record); its
  Drive sync was reported on 14.10; F:/objekt-files was found on 16.10, but freshness and restoration are unverified. The card index of
  the whole library: `docs/library.md` (sections, then one line per paper, then card, then text; wanted and
  dropped papers in `docs/library/wanted.md`; a new paper needs a record in `docs/library/papers.json`). 145 cards from full texts: `docs/cards/`, checked by
  `node tools/check-cards.mjs`; catalog generated: `docs/catalog.md` (`node tools/build-catalog.mjs`);
  search coverage: `docs/library/coverage.md`; research notes: `docs/research/README.md`; ideas: `objekt-files/notes/archive/docs/ideas/`; headset abilities:
  `docs/headset-capabilities.md`; owner page: https://claude.ai/artifact/Srhwjio7Ukp4FBDQAHpZB2
- THE WORK is the feature list `docs/features.json` (the start names the current one; his accept word is the only measure of progress) and the board `docs/board.md` (his words, what waits).
  Claude logged owner messages through its prompt hook; Codex callback delivery remains unverified (zero recorded events on 17.10). The big plan (archive and strategy, read only
  when a step needs it): https://claude.ai/code/artifact/71113d16-57ad-42ce-9905-87ff87dfdbd7; the delivery chain from today to a million players, checked by four fact-check runs (16.10, his doc, the map each window checks the delivery against): https://claude.ai/code/artifact/61184b9b-cbd5-41be-82ad-54088c45a30e
  Every critical problem still open on 10.10 (money, law, data, headset, process, records), whose step each is and
  the owner's choices: https://claude.ai/artifact/NGika3MZ8ms7GdFvfiZhvT
  The road from the corridor to the store, how he and I work, the tools (10.10): https://claude.ai/artifact/3unCQLkqfc36ExW2RtzvX4
  How the game's code is built, now and after the turnaround (10.10): https://claude.ai/artifact/NZR4cdhP1QGAEE6kipyjp5
  His room as the headset reads it (11.10; records in objekt-files/notes/headset): https://claude.ai/artifact/CgxirtxxN4gPidXWnmiDjV; room 101 behind its door (11.10): https://claude.ai/artifact/RrNeo3s4Uk9WpzyrnoLGLH
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS 08.10, old 60 fps bar, no log); `tools/xr-probe.html`.
  Owner plays the test copy https://exxxit-game.github.io/object-preview/ (bookmark in the headset, the
  game from GitHub): `node tools/publish-preview.mjs` before he looks; it sends no results (it still asks the live average: a fix on the shelf-2 list). From 9.10 the
  headset stays on the laptop's USB cable (his choice); it charges slowly and power is cut daily: wake it
  only to check, end with `quest-look.mjs sleep`, push work often. I check in the headset myself:
  `tools/quest-look.mjs` (open [local port], reload, vr, frame, eval, sleep); opening 8.10: sign +10 s, 90 fps; the measured baseline of 13.10 (each place, heat, memory, loading): docs/baseline.md.
- Voice: ElevenLabs key in ~/.elevenlabs-key.txt; Daniel, eleven_v3; `tools/make-voice.mjs`, `tools/check-voice.mjs`.
- Codex is handling the migration and technical work at the owner's request. The earlier plan for ChatGPT as only a second checker is historical; billing and every inherited workflow are not thereby verified.
## Skills and tools, and when to use them
- docs/tools.md: named in CLAUDE.md (not imported, so not loaded by itself), read at a task's start. Everything available, used or not, with its recorded reason: the inventory of 15.10 (objekt-files/notes/others-2026-10-15/inventory-2026-10-15.md).

## Decisions with the owner
One line each: for every window in `docs/owner-decisions.md` (loaded at every start), for one theme in `.claude/rules/` (game, measures, data, setup; loaded when a file of that theme is read or edited); all his words in `docs/owner-decisions-history.md` (read for a task).

## How errors are caught (the owner cannot read code)
- `new-room` skill; `paper-reviewer` agent; `docs/mistakes.md` (a mistake that broke the game, with the test that now catches it); facts in one place
  with a test; `tests/structure.test.mjs` (sizes, imports, no Russian outside texts, this file ≤ 80 lines).
- Repository Git hooks: tools/hooks (commits by command only: the app's own git buttons skip repository hooks since app 2.42304.0, its notes of 15.10; no commit while the quick tests fail, no push without the secret check, main only on
  his word). Claude-only event hooks, `tools/claude-guard.mjs` (state at start and after compaction, owner messages
  logged, no skipping hooks, no browser on the laptop, no GitHub connector writes); these are not established Codex protections. Their refusals are asserted in tests/guard.test.mjs and tests/review-gate.test.mjs, the planted mistakes of `tools/prove-guards.mjs` run on GitHub when a guard file changed.

## Lessons (do not repeat)
- Read the full paper before recommending or designing (summaries overstated effects twice).
- A session opened from another folder loads that folder's rules: open Object sessions from objekt.
- Paper titles and DOIs from Crossref, never from memory. Shell heredocs eat backslashes:
  edit regex code with the Edit tool. Never send the owner's email to services.
- Faithful ≠ interesting: lead with short, within-person, suspicion-proof rooms;
  personal result + "you vs others" is what brings people (LabintheWild 556k vs 1.1k).

## Technical notes behind the board (the board itself: docs/board.md)
- The owner's automatic stop: VR in the headset and the test copy wait for a practice review of the files a
  person meets (tools/review-gate.mjs); the first real review was recorded by the hook on 9.10. The rebuilt
  controllers-and-hands probe (tools/xr-probe-input.html) follows objekt-files/notes/archive/docs/audit/probe-review.md.
- Prompt and agent hooks need Claude Code 2.1.294 or later, onFailure: block on the guards 2.1.295; the terminal and the app may run different versions (14.10: the app, Claude Desktop 2.37337.1 from the Microsoft Store, installed 13.10 21:16, runs 2.1.295; the terminal's `claude` is 2.1.268, below the hooks' need).
- Meta's tools: the Meta VR CLI is installed (npm install -g metavr, Meta's own package) and runs from the shell
  (metavr device, perf, vrc-local); the meta-vr plugin's MCP server gave 0 tools (started through npx it answered
  Claude Code's protocol probe late and then refused the tool list), so the CLI is the way in. Supabase: the plugin's server is not signed
  in; the claude.ai connector reads as supabase_read_only_user, so the server refuses its writes, and its write tools
  are denied in .claude/settings.json (the guard's own SQL check was removed on 15.10, 7a25902). The process rebuild of 10.10 and its audits' findings: objekt-files/notes/archive/docs/audit/process-rebuild.md.
- Earlier causes and audits: objekt-files/notes/archive/docs/audit/README.md. Corridor: finished item by item on the board; approved shots in docs/rooms/corridor-shots/.
  Style book: https://claude.ai/artifact/DKDDa4sH1BG9TF24MJyQaH. How to use Claude Code, his memo: https://claude.ai/artifact/V4HzbgVtK8HGqczZ3zyfS9.
- Process review 11.10: https://claude.ai/artifact/NMfbi3vWaZQX8oR9t39mTC, measures in objekt-files\notes\process-review-2026-10-11;
  lesson one: https://claude.ai/artifact/FVhfv8i8CGGTi4WSHgwbC9.
