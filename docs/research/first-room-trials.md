# First-room trials before corridor polish

18 October 2026. Owner-directed priority change, with a preliminary candidate screen.
Verified working copy: codex/trial-migration at 2a31874e0235dd1f7513696b6b1ede243454e6b1, with preserved dirty files.
Initial screen below; the first implementation and its limits are now in [02-lines](../rooms/02-lines.md).
No effect has been verified on the owner.

## Confirmed mismatch

The owner again rejects the long, passive light/button room as boring and asks to replace it, try the candidates
personally and add several worthwhile rooms. This supersedes the older corridor-finished-before-rooms order.
docs/state.md already records the old room as set aside on 8 October for boredom. Yet src/main.js still defaults
to 01-control; the new 02-lines is available only through an explicit preview trial. Preserve the old room:
it as a reference, do not polish it as the selected opening, and switch the opening after testing its replacement.
The present task does not authorize a live release, room acceptance or erasing the existing work.

The ten first-room candidates are in [catalog](../catalog.md#first-room-candidates). They are distinct from the
ten proposed new studies in [own-experiments-now](own-experiments-now.md). A card's favorable verdict is an earlier
assessment of a paper, not evidence of a functioning short Quest room. Several short durations are estimates for
modified procedures. All ten remain visible below; none is silently promoted to a completed experiment.

## Candidate screen (technical notes contain spoilers)

This table uses the existing cards' task, duration, feasibility and replication sections. It is not a fresh full-paper
or independent-replication audit of all ten. Read the original and relevant replication completely before selecting
a protocol, as required by the repository new-room workflow. Do not show the explanations to the owner before play.

| Candidate | What must be resolved before the personal trial | Current status |
|---|---|---|
| [Amir & Firestone 2025](../cards/amir-firestone-2025.md) | The catalog source is a review, not the primary protocol. Find/read a concrete adjustment or discrimination procedure; verify visual dimensions and rendering | Candidate; no playable build or duration measurement |
| [Drori 2020](../cards/drori-2020.md) | Original has 24 staircases / 200 trials across separate experiments. Supplement retrieved and checked; starting values/stopping criterion missing and update rule ambiguous. No clinical inference | Candidate two; faithful implementation blocked, shortened substitute rejected; [evidence](drori-recreation.md) |
| [Fernandez-Ruiz & Diaz 1999](../cards/fernandez-ruiz-1999.md) | Real prism glasses and physical throws are not automatically equivalent to altered virtual throws. Specify what is preserved and how actual hand/landing errors distinguish adaptation from programmed motion | Candidate; active task, VR transfer unverified |
| [Hirschhorn 2024](../cards/hirschhorn-2024.md) | Roughly 50 rides in the original; a 5-6 ride proposal is a modified trial, not the same evidence. Quest 3 head direction is not eye gaze; moving scenery and picture choices need checks | Candidate; active task, short version unverified |
| [Kohnstamm 1915](../cards/kohnstamm-1915.md) | Real physical setup and appropriate modern method review before instructions. Passthrough/hand recording and individual variability matter; do not improvise physical exertion advice | Candidate; no home/headset trial performed |
| [Moharramipour 2022](../cards/moharramipour-2022.md) | Controller vibration onset precision and stimulation site differ from fingertip apparatus; 240 trials are not automatically a short opening | Candidate; device timing gate unresolved |
| [Morehead 2017](../cards/morehead-2017.md) | Original has hundreds of reaches; shorter remote replication still needs faithful transfer. Hidden hand feedback conflicts with the existing always-visible-controller preference and cannot be silently changed | Candidate; protocol and experience constraint unresolved |
| [Pailhes, Kumari & Kuhn 2021](../cards/pailhes-kumari-kuhn-2021.md) | Live experimenter, wording and action order are part of the method. A deterministic card outcome does not guarantee felt agency or surprise; a computer may feel less convincing. Duration is estimated | Candidate; source retrieved, not built or personally tested |
| [Roediger & McDermott 1995](../cards/roediger-mcdermott-1995.md) | Original sessions exceed the desired short trial; Russian associative lists require evidence, not direct translation. Prior knowledge affects the first experience | Candidate; language/procedure gate unresolved |
| [Shams 2000](../cards/shams-2000.md) | Actual audio/display synchronization must be measured; scheduling timestamps alone do not establish it. Flashing stimuli need appropriate advance information | Candidate; device timing gate unresolved |

Owner clarification, 18 October: use the first five in the existing catalog order, strictly one at a time:
Amir/Firestone, Drori, Fernandez-Ruiz/Diaz, Hirschhorn, Kohnstamm. This replaces the assistant's earlier
triage proposal; Pailhes does not move ahead of them. A source or hardware obstacle must be reported,
not silently resolved by substituting a later candidate. The owner does not read papers or debug trials.

These are provisional trials, not permanent room assignments. Keep experiment identity, protocol version,
local coordinates and saved observations independent of floor and door number. The building supplies the
placement and displayed number; moving a trial must not reset its identity or change its stimuli. Verify
the same module at another placement before claiming portability. No second floor is being built now.

## What each trial must answer

1. Technical: do inputs, timing, stimulus changes, measurements and exit actually work as specified on this device?
   The assistant verifies this before asking the owner to wear the headset; preserve required paper/practice gates.
2. Personal experience: is the task understandable, engaging and comfortable; is its conclusion meaningful to the
   player? The owner can reject a boring opening even if its underlying scientific effect is well supported.
3. Scientific: what can the actual protocol and recorded observations support? One person's success or failure does
   not prove or refute a population finding. Do not fabricate an effect, display group averages as the owner's result,
   explain failure away as the owner playing incorrectly, or present a reduced trial as a completed replication.

Prepare one playable core at a time; latest owner clarification: prepare all five sequentially, then he compares them one after another. Aim for a short first look only where the source supports it, with the real procedure length disclosed; do not
accelerate or cut causal parts just to promise five minutes. Use the existing controls and minimal functional space.
Only fixing unreadable instructions, broken controls, pauses or discomfort belongs before these trials; decorative
lighting and corridor finishing are deferred. The first-room feature remains unaccepted until its actual conditions hold.

Use owner preview mode without uploading play/results/comparison data. For each trial keep a dated local record of
the exact version, deviations, technical checks and actual owner feedback. No prefilled success record. Offer one
simple post-trial question about whether this is worth developing, without making the owner manage a testing system.
Instructions and answers belong inside the headset while it is worn. No headset session was started for this screen.

Only after trying the viable cores choose the new first room and the next few rooms. Replace the default route after
the selected prototype has passed its required checks; keep the old source and history. Room count alone is not progress.

## Sources checked in this pass

- Local source: catalog, ten linked cards, state, current main.js, old protocol and room contract. Existing card claims
  about replications are explicitly not freshly reverified here.
- [Drori et al., original article](https://pmc.ncbi.nlm.nih.gov/articles/PMC7355917/) opened on 18 October. The short
  candidate duration is not evidence that a reduced protocol has the original reliability.
- [Pailhes et al., accepted manuscript](https://research.gold.ac.uk/29234/1/Equivoque-Revised_final.pdf) located;
  the local manuscript introduction and first method/results were consulted. Full remaining reading is still required.
- [Fernandez-Ruiz & Diaz, publisher PDF](https://learnmem.cshlp.org/content/6/1/47.full.pdf) located. The PMC copy
  returned a browser challenge; the locally stored paper remains available. No full-paper reading claimed this pass.

Next concrete deliverable: one source-grounded playable core and its technical evidence, ready for the owner's
first experience. Additional cores follow sequentially; no new room was implemented by this prioritization pass.

## First candidate: primary-procedure search after the queue correction

Cretenoud et al. (2020), DOI 10.1167/jov.20.6.4, PMID 32511665, is a primary adjustment experiment,
not the Amir/Firestone review. Europe PMC full-text XML retrieved successfully on 18 October;
Methods and stimulus Appendix read. [Author repository](https://livrepository.liverpool.ac.uk/3099577/).
The original tested 12 variants, one practice per variant and two measured repetitions, with no time limit;
it does not establish a duration for our trial. A subset or headset transfer would be a documented adaptation,
not a replication of the whole study. Full reading, source selection, geometry and headset checks remain.
No protocol constants, room module, new drawing or route switch have been implemented yet.
