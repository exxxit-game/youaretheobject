# Target architecture: the finished game

Purpose: every change is made knowing where it ends up, so fixing one place never breaks or
duplicates another. This page is the picture of the end; what is built now is in
[ARCHITECTURE.md](../ARCHITECTURE.md), the order of work on the board (docs/board.md).
Files that do not exist yet are written without backticks (structure rule 7 checks the rest).

## The finished game in one picture
```
youaretheobject.com
 ├─ index.html → the lab's corridor: a door per room, a floor per pack (floor 1 free,
 │               floors above bought once), language, progress
 ├─ privacy.html: what is recorded, why, where, how long
 └─ every room runs the same life cycle, on the clipboard:

  consent → instruction (voice + clipboard) → experiment (the room's own logic, logged)
     → after-questions (manipulation, prior knowledge) → reveal (what you did, how you were
       caught) → the original study and how this room differs → you against other players
     → the result sent only with consent
```

## Layers
| Layer | Folder | Knows about | Never knows about |
|---|---|---|---|
| Shell | `index.html`, `src/main.js` | which room stands behind door 1, the game's face | room logic |
| App | `src/app/` | the scene and the player for the whole visit, the corridor and every door, where a room stands (its plan), consent, the clipboard flow, reveal paging, session, language, purchases | a specific room |
| Engine | `src/engine/` | A-Frame components, audio, voice, panels, the clipboard sheet, log, UI widgets, results transport | rooms, texts |
| Room | `src/rooms/NN-name/` | its inside in its own metres (no scene, player or door), experiment, report, texts, recordings | other rooms |
| Server | `supabase/migrations/` | per-room result validation, aggregates for "you against others" | game code |

## Every room the same folder
```
src/rooms/NN-name/
  room.js          the phases of THIS experiment only (consent, paging, sending come from app/):
                   ENTRY, mount(root), enter(withRecording), docs/rooms.md
  scene.js         markup of its inside and DOORWAY, where its door opening is
  protocol.js      every number of the original procedure, with paper pages
  report.js        log → measures, pure, tested
  reveal.js        its reveal pages, pure
  texts.ru.js      every word (texts.en.js and other languages later)
  voice-lines.js   spoken lines, voice/<lang>/*.mp3
  sound-list.js    effects, sound/*.mp3
docs/rooms/NN-name.md (against its paper), its docs/sources.md section
tests/NN-*.test.mjs; the smoke test runs every room to its end in CI
```

## Still to build, in this order of need
- Room 01 onto the clipboard: it still talks through its wall screen, and its flow helpers
  (say, ask, paging the reveal, phase timing) live in its room.js; they move to src/app/ so a
  second room does not copy them, with a test listing what a room may import. Decided: a
  questionnaire's answers are printed on the paper as lines with a box to tick, as paper forms are
  (answer buttons on the sheet now keep the page's letter and wrap a long label); work started on the local branch
  claude/wip-experimenter, parked until the corridor is finished.
- The reveal pager and a chart widget for "your timeline" (future src/app/reveal.js,
  src/engine/ui/timeline-chart.js).
- "You against other players" is read for room 01 (`compareRoom`, src/engine/results.js; the word
  "stats" stays out of file names, ad blockers block it); each room version's report is checked against its JSON
  Schema (supabase/schemas, 0009_data_protection.sql).
- Languages: texts.en.js beside every texts.ru.js, voice per language, each language's script
  in the game's face (tests/fonts.test.mjs fails until its file is added).
- A room behind any door: the room is told its door (number, latch side) and lays its inside sign
  and switch by it, instead of importing door 101's number and the corridor's plaqueX; leaving a
  room for the corridor (unmount, the corridor drawn and lit again); the app watching the page's
  errors from its first moment (now a room's session watches them once the scene has loaded).
- A room scaffold (future tools/new-room.mjs): all files and tests of a new room at once.

## Rules that follow from this
- A room never re-implements consent, sending, reveal paging, choice panels or charts.
- Every room ships: report tests, voice and sound file tests, a smoke run to the end, sources
  with page numbers, a deviations list, a preregistration draft.
- No music in rooms: it changes mood and behaviour.
