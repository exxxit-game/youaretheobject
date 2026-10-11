---
name: new-room
description: Build or substantially change a room of Object (a re-created psychology experiment). Use whenever a new experiment is chosen or a room's procedure, texts or measures change. Fixed order of steps; none may be skipped.
---

# New room: steps in order

The owner cannot read code or papers, so every step leaves proof a machine can
check. Do not tell the owner "done" before step 10.

1. **Card, then the paper in full.** Start from the experiment's card (`docs/catalog.md`, `docs/cards/`): its
   quotes are already checked against the paper text. Download the original (and the main replication) into
   `C:\Users\admin\Documents\objekt-files\papers\` as PDF and `pdftotext` .txt. Read the
   method and results completely (CLAUDE.md: the paper read in full). If the participant's time is
   over about 10 min or there is no task/tension, stop and tell the owner.
   Write a 3-line entry in `docs/decisions.md` first.
2. **Owner decisions.** Everything the headset cannot copy (money, typing, paper
   forms, live experimenter, personal data): a choice a source settles is mine, with the reason in a
   line; the rest goes to the owner as real options, in pictures where it is a look.
3. **Spec** `docs/rooms/NN-name.md`: the original procedure table with pages, the
   results to compare with, deviations (told to player or docs only), "not in the
   paper: our choices", flow and states, data sent, and the room recipe below filled in for this room.
   Facts also in `docs/sources.md`.
4. **Numbers first.** `protocol.js` (procedure) and `original.js` (results shown),
   page in each comment, frozen; a test pins every value to the paper. Then pure
   `schedule.js` / `report.js` with tests. Break a value on purpose once: the test
   must go red.
5. **Room** by the room contract (`docs/rooms.md`): it stands behind its corridor door, so its markup
   is only its inside, in its own metres (`sceneHTML`, `DOORWAY`), and `room.js` gives `ENTRY`,
   `mount(root)` and `enter(withRecording)`; the app holds the scene, the player, the corridor, the door
   and the arrival (`src/app/lab.js`). From the shared parts only:
   `src/app/consent.js`, `src/app/session.js`, the clipboard `src/engine/ui/sheet.js`,
   `src/engine/ui/choice.js`, `src/engine/ui/scale.js`, voice, sound, `writePlaque` (the
   room's number only: the experiment's name waits for the reveal). Every part of the scene
   follows `docs/building-standards.md` (we recreate: the standard first, then the build); its
   door opening and flat wall things sit on the block module (`tests/masonry.test.mjs`).
   A new look (an object, a picture, a sign) goes to the owner as pictures before it goes in. Widgets go
   under the text (`panel.write` returns where it ends). Answer options: equal size;
   random order where order could bias.
6. **Words and voice.** `texts.ru.js` only; formal "вы". Record with
   `node tools/make-voice.mjs NN-name`, then `node tools/check-voice.mjs NN-name`:
   every line must match (a number heard as digits is fine).
7. **Tests.** `npm test` green (structure rules included). Update `tests/smoke.mjs`
   and `tools/quest-check.mjs` for the room's flow.
8. **Independent review.** Run the `paper-reviewer` agent on the room. Verify its
   main claims in the paper yourself, fix, then run it again on the fixes.
9. **See it.** First the `practice-reviewer` agent (the headset waits for it: `tools/review-gate.mjs`).
   Then a browser pass at `?speed=20` with screenshots of every new screen
   and a comparison with the room's approved shots (`docs/rooms/NN-shots/`); in the
   headset `node tools/quest-look.mjs` (enter VR, frames, timing of each step, frame rate,
   `levels` for its sounds) and `node tools/quest-check.mjs` (all PASS); an independent
   reviewer agent on the diff; fix.
10. **Lessons.** A mistake that broke the room gets a test that catches it
    and a row in `docs/mistakes.md`; nothing else is added. Only now report, with a frame
    from the headset, saying what ran and what was seen.

## The room recipe (from docs/research; each step already tested somewhere)
1. A "what stands for what" table: every part of the original procedure and its place in the room (Re-Search,
   docs/research/owner-brought.md).
2. A playable practice step first, repeatable until understood; controls taught before the measure (vrprotocols
   "Gradual Acclimation", "Controls Training"; Oppenheimer 2009; Miura & Kobayashi 2016; Druzhinin's training series).
3. A one-tap commitment before the measure, never a trap question before it (Geisen 2022; Hauser & Schwarz 2015).
4. The measured moment plain: the host quiet, no game styling on what is measured, the host's style the same for
   every player (Lumsden 2016; Portal commentary; Druzhinin).
5. Effects that show in few trials; behaviour logged automatically; head pose only for coarse gaze.
6. After the measure: one short block in the headset; a no-blame "did anything get in the way, did you play it
   for real" question (Aust 2013; LabintheWild); prior VR and game experience and the run number recorded.
7. The reveal: your result next to other players and the original study, a share button; science counts the
   first run (LabintheWild; Moral Machine; Van den Bussche 2026; Chandler 2015).
8. Before data count: a preregistered plan (AsPredicted), exclusions fixed in advance, sample 2.5 x the original
   (Simonsohn 2015; Many Labs 2), ethics approval (docs/research/ethics-law.md), a separate science consent.
