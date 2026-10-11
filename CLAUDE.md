# CLAUDE.md — Object

"You are the object" (the name is never translated): a browser VR game (WebXR, A-Frame). The player is the
subject of real psychology experiments, one room each, then sees how he was caught and what the study found.
His decisions load with this file, settled (never re-ask, never argue against): @docs/owner-decisions.md
The start hook shows docs/board.md (the work and its only order). Maps: docs/state.md, ARCHITECTURE.md. What to take when: @docs/tools.md
Answer the owner in Russian, plain words, short. The repo is English; Russian only where tests/structure.test.mjs allows.

## How we work
- Progress = he saw it and said «да». Every session opens with a row in the board's «Показы» (what he will
  see today) and ends by showing it to him, in the headset or as a picture.
- His new request goes on the board in his words; the order changes only on his word. A choice a source
  settles is mine (the reason in a line); one no source settles goes to him as real options, in pictures.
- Do what was asked, with the whole around it seen first; ideas go at the end of the answer, not into code. A new topic goes to a new window.
- After the rebuild the process is frozen (his decision): a health-check finding (node tools/health.mjs) only
  repairs the broken thing; anything new needs his word and replaces something. This file stays within 45 lines (tests/structure.test.mjs).
- Missing anything for the work (a norm, a document, a login, a paywall, his photo): tell him at once, each time, with the link.
- He is angry: act on the topic, no promises.

## Truth: we recreate («воссоздаём»)
- Everything but our experiments and words is taken from what exists (standards, Meta/W3C XR guidelines,
  research, shipped games; for how code draws or lays out a thing: a spec, library or published method),
  named in a WHY comment or docs/decisions.md; our own only where nothing exists or it fails in the headset.
- Names, numbers, quotes and pages come from the file (papers: the index docs/library.md, then the texts in
  C:\Users\admin\Documents\objekt-files\papers\; the code), never from memory. A fact the player sees has its source in docs/sources.md, or is not shown.
- A test or reviewer disagrees: re-read the source and fix the cause; never bend the test. Two or three
  failed tries at one problem: measure first.

## Checking
- "Done" only after `npm test`, saying what ran; no run = "not verified".
- Before he meets anything: the practice-reviewer first (VR and the test copy wait for it: tools/review-gate.mjs),
  then my own look in the browser pane and the headset (tools/quest-look.mjs, sleep after), and the approved
  shots in docs/rooms/. He judges only feel and taste.
- Never Playwright or Chromium on the laptop: the smoke test runs on GitHub. Preview: `npm run serve`.

## Cannot be undone (hooks hold these; never work round them)
- main is the live site: only on his word. Work on a branch; commit and push often (power cuts).
- No key, token or his email in the repo. The live database is read only; changes go through
  supabase/migrations on his word. Never restart the headset while he wears it.

## Rooms and code
- A room starts from its card (docs/catalog.md, docs/cards/), then its paper read in full (about 10 min or
  less for the participant, a clear task), then the new-room skill; the paper-reviewer checks it.
- One room per folder in src/rooms/; the engine never imports rooms. Styles only in css/, player text only
  in texts.ru.js, comments say why (never when or who), files about 300 lines, no build step.
