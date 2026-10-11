# Where things are (the work itself: docs/board.md, shown at every start)

## Where things are
- Repo `exxxit-game/youaretheobject` (folder `C:\Users\admin\Documents\GitHub\objekt`). Site:
  https://youaretheobject.com (GitHub Pages from `main`; `main` is an OLD package). Work: `room-polish`.
  Each session: one visible thing for him plus internal work (the board). Each session works in its own worktree, made from the main
  folder's HEAD (`.claude/settings.json` worktree.baseRef head; the default was old main); no turn ends until
  the main folder (room-polish) holds the session branch (stop hook, tools/claude-guard.mjs). Push every turn (power cuts); main only on his word.
- Room 01 = illusion of control (Alloy & Abramson 1979), `src/rooms/01-control/`: SET ASIDE 08.10 as a lab
  room (16–20 min of waiting, owner found it unbearably boring). Playtest `?playtest=1`, speed `?speed=N`.
- Migration 0009 (date only, random key, consent version, room 01 JSON Schema, keyed IP limit) is live: the owner
  ran it in the SQL editor on 10.10 (history 20261010151418), read back the same day (tables, functions, grants,
  the pg_cron launcher, compare_room through the API). Run again, it stops at once at the pg_cron setup and
  changes nothing. Open: on the first real results read app.recent.trusted (does CF-Connecting-IP arrive).
- Supabase `objekt` (`rkvdwzlymmewsxjysgma`, eu-west-1 Ireland), in the owner's organisation on the paid Pro plan (read
  10.10 with the Supabase connector's get_organization; a paid project is never paused), private schema `app`:
  `runs` via `submit_run` (room 01 checked against supabase/schemas/01-control-1.json), `playtests` via `submit_playtest`; both
  insert-only for anon, verified. Sending is ON in code with consent; privacy page `privacy.html`
  (contact t.me/exxxit). Tests pin client fields to the SQL (`tests/results.test.mjs`, `tests/playtest.test.mjs`).
- Files outside the repo, one folder `C:\Users\admin\Documents\objekt-files\`: `papers\` (every paper as `<id>.pdf`
  and `<id>.txt`), `datasets\`, `imports\` (exports as downloaded), `notes\` (his messages, the review record); copied
  whole to `F:\objekt-files` (`node tools/health.mjs` checks it) and to Google Drive by its program; the card index of
  the whole library: `docs/library.md` (sections, then one line per paper, then card, then text; wanted and
  dropped papers in `docs/library/wanted.md`; a new paper needs a record in `docs/library/papers.json`). 145 cards from full texts: `docs/cards/`, checked by
  `node tools/check-cards.mjs`; catalog generated: `docs/catalog.md` (`node tools/build-catalog.mjs`);
  search coverage: `docs/library/coverage.md`; ideas: `docs/ideas/`; headset abilities:
  `docs/headset-capabilities.md`; owner page: https://claude.ai/artifact/Srhwjio7Ukp4FBDQAHpZB2
- THE WORK is the one-page board `docs/board.md` (shown at every start; his yes is the only measure of progress).
  Every owner message is logged on the laptop by the prompt hook. The big plan (archive and strategy, read only
  when a step needs it): https://claude.ai/code/artifact/71113d16-57ad-42ce-9905-87ff87dfdbd7
  Every critical problem still open on 10.10 (money, law, data, headset, process, records), whose step each is and
  the owner's choices: https://claude.ai/artifact/NGika3MZ8ms7GdFvfiZhvT
  The road from the corridor to the store, how he and I work, the tools (10.10): https://claude.ai/artifact/3unCQLkqfc36ExW2RtzvX4
  How the game's code is built, now and after the turnaround (10.10): https://claude.ai/artifact/NZR4cdhP1QGAEE6kipyjp5
  His room as the headset reads it, two mixed-reality sessions (11.10; records in objekt-files/notes/headset, not in the repo): https://claude.ai/artifact/CgxirtxxN4gPidXWnmiDjV
- Headset: Quest 3 over USB; `tools/quest-check.mjs` (11/11 PASS 08.10, old 60 fps bar, no log); `tools/xr-probe.html`.
  Owner plays the test copy https://exxxit-game.github.io/object-preview/ (bookmark in the headset, the
  game from GitHub): `node tools/publish-preview.mjs` before he looks; it never sends data. From 9.10 the
  headset stays on the laptop's USB cable (his choice); it charges slowly and power is cut daily: wake it
  only to check, end with `quest-look.mjs sleep`, push work often. I check in the headset myself:
  `tools/quest-look.mjs` (open [local port], reload, vr, frame, eval, sleep); opening 8.10: sign +10 s, 90 fps (no saved log: re-measure with a log, plan step 4.3).
- Voice: ElevenLabs key in ~/.elevenlabs-key.txt; Daniel, eleven_v3; `tools/make-voice.mjs`, `tools/check-voice.mjs`.

## Skills and tools, and when to use them
- docs/tools.md, loaded with CLAUDE.md in every session. Other installed skills idle.

## Decisions with the owner
All in `docs/owner-decisions.md` (shown at every session start): settled, never asked again.

## How errors are caught (the owner cannot read code)
- `new-room` skill; `paper-reviewer` agent; `docs/mistakes.md` (a mistake that broke the game, with the test that now catches it); facts in one place
  with a test; `tests/structure.test.mjs` (sizes, imports, no Russian outside texts, this file ≤ 80 lines).
- Machine stops: tools/hooks (no commit while the quick tests fail, no push without the secret check, main only on
  his word); Claude Code hooks, `tools/claude-guard.mjs` (state at start and after compaction, owner messages
  logged, no skipping hooks, no browser on the laptop, the live DB read only, no GitHub connector writes, no
  turn ends unsaved or unpushed); every guard seen red by `tools/prove-guards.mjs` on GitHub on room-polish (main gets it with its next update).

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
  controllers-and-hands probe (tools/xr-probe-input.html) follows docs/audit/probe-review.md.
- Prompt and agent hooks need Claude Code 2.1.294 or later; the terminal and the app may run different versions.
- Meta's tools: the Meta VR CLI is installed (npm install -g metavr, Meta's own package) and runs from the shell
  (metavr device, perf, vrc-local); the meta-vr plugin's MCP server gave 0 tools (started through npx it answered
  Claude Code's protocol probe late and then refused the tool list), so the CLI is the way in. Supabase: the plugin's server is not signed
  in; the claude.ai connector's writes and any SELECT that calls a writing function are refused by
  tools/claude-guard.mjs. The process rebuild of 10.10 and its audits' findings: docs/audit/process-rebuild.md.
- Earlier causes and audits: docs/audit/README.md. Corridor: finished item by item on the board; approved shots in docs/rooms/corridor-shots/.
  Style book: https://claude.ai/artifact/DKDDa4sH1BG9TF24MJyQaH. How to use Claude Code, his memo: https://claude.ai/artifact/V4HzbgVtK8HGqczZ3zyfS9.
