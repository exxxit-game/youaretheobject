# Experiment cards

One card per experiment, written only from the paper's full text. The room list and
every recommendation are built from cards that pass `node tools/check-cards.mjs`.

Rules:
- Get a legal full text (author copy, university repository, PMC, publisher open
  access; never pirate sites). Save it in `C:\Users\admin\Documents\objekt-files\papers\`
  as `<id>.pdf` and `<id>.txt` (`pdftotext <id>.pdf <id>.txt`), and give it a record in
  `docs/library/papers.json` (then `node tools/build-library.mjs`; `npm test` fails on a file without one).
- No legal full text: write the card with `- status: no-full-text` and no Facts;
  such an experiment cannot be recommended until the paper is read.
- Every fact row has a quote copied character for character from the `.txt` file
  (not from the PDF, not retyped), at most 25 words. The checker refuses quotes
  that are not in the text. Required rows: Participants, Procedure, Duration
  (write the quote that says it, or the quote nearest to it and "not stated" as the
  value), Main result. Add rows for replication, measures, space, equipment.
- The "Fit for Object" section is judgment, not facts. Be strict: Quest 3 at home
  (head and two controllers or hands, no eye tracking, no force feedback), one
  player, 5–15 minutes, measured automatically, ethical.
- Space is never a reason to reject. Record the space the ORIGINAL procedure needs as
  one tier, from the paper's own numbers:
  `seated` · `standing` (in place, Meta's stationary boundary 1 × 1 m) ·
  `roomscale` (walking within 1.8 × 1.8 m; our base design, see `docs/decisions.md`) ·
  `large W × L m` (more than 1.8 × 1.8 m: the room is offered only to players whose
  boundary is that big; it is never shrunk, because a shrunk version is a
  different experiment).
- Verdict: one of `first-room candidate`, `room`, `interlude`, `reject`, with one
  line why.

Template (`suma-2011.md` is a full example):

```
# <id> — <short name>

- paper: <id>.txt
- citation: Authors (year). Title. Journal, volume(issue), pages.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | ... | "..." | ... |
| Procedure | ... | "..." | ... |
| Duration | ... | "..." | ... |
| Main result | ... | "..." | ... |

## Fit for Object (reviewer's judgment, not facts)
- Participant time:
- Task/tension:
- Within-person reveal:
- Works if the player expects tricks:
- Space tier:
- VR or mixed reality: which suits the original better (see `docs/headset-capabilities.md`)
- Quest 3 feasibility:
- Replication:
- Ethics:
- Verdict:
```
