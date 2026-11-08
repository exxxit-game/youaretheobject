# Corridor rooms and delivery plan

Owner clarification: 8 November 2026, current conversation. This develops the
[approved foundation](perception-corridor.md#approved-foundation-7-november-2026).
It does not replace it or create another task queue. Read the active map through
`node tools/corridor-brief.mjs`; retrieve originals through [the catalogue](perception-knowledge.md).

## One purpose, different kinds of evidence

The familiar corridor is itself an experience of perception. Scientific and
philosophical rooms let a visitor investigate the world and their own explanation
or choice, then return to the same corridor with that experience. The owner's
spiritual purpose remains authorial meaning; optical effects do not prove it.
The community name is Society Zero (the owner's Russian name is in README.md).
History of human knowledge is a long-term connection, not a promise to teach all
history in one release, rank people as zero/one, or assign each century a floor.

| Type | Player action | Evidence needed | Do not claim |
|---|---|---|---|
| Scientific demonstration | Change one condition, compare, repeat | Primary explanation, rendered conditions, reference and counterexample | Everyone must see the effect; a screen is a physical measurement |
| Numerical model | Change a parameter and inspect its consequence | Equations, units, assumptions, valid range, reference outputs | A model proves nature behaves exactly like its output |
| Empirical recreation | Participate in a sourced procedure | Full paper and later corrections, protocol, deviations, analysis; research ethics if collecting research data | A working game is a verified replication |
| Philosophical question | Compare interpretations or make a reasoned choice | Original question, stated premises and variants, accurate consequences | One correct answer settles a disputed question or diagnoses the player |
| Fictional deal | Accept or refuse a stated exchange | Approved prompts, valid no/exit, voluntary bargaining, exactly-once ledger and consequences | A response proves moral worth or all unpleasant acts are equivalent |

The cash checkpoint belongs to the deal branch. Scientific and philosophical
answers do not earn money by default. Zero balance gives no bills, a small one
few bills; a very large pile can bury the character and require restart. Exact
thresholds, denominations, prompts and reset rules remain to be designed.

## Proposed first connected route

This is a bounded proposal, not approval of exact room content or a new scene.
Guiding question: did the object change, the viewing conditions, or my explanation?

1. Leave the ordinary door on N; follow the simple request to go up one floor.
   One reachable composition changes its reading through movement; return remains possible.
2. Enter one scientific room, vary one condition, compare and repeat.
3. Return to the recognisable corridor; the same details can now be re-examined.
4. Enter one philosophical room and compare two accounts of the same object.
5. Return and continue. The deal branch and checkpoint are a later connected slice,
   retained in the foundation, not silently removed from the game.

Keep one discoverable main action at first. Details support connected observations;
additional controls, decoration and simultaneous effects must justify their cost.
Sources can be offered after the experience without forcing a lecture first.
Allen's museum design account and Allen/Gutwill's case studies support conceptual
coherence and caution about competing interactions. Their museum findings do not
establish learning effects in our browser or VR implementation.

## Reuse inventory, checked 8 November

| Candidate | Existing material | Actual status / next check |
|---|---|---|
| Checker shadow | Earlier site's own ShadowBoard SVG and pure shadowBoard geometry | Held on the earlier site; not a ready public/VR room. Preserve the owner's variant, clear source/release conditions, check rendering and real displays. Do not substitute the rejected raster/bridge variant. |
| Ship of Theseus | identity.js state machine, IdentityStory React view and method record | Pure logic reusable; React/SVG is not an A-Frame room. Six replacements, then original-material second ship. Preserve current options; no timer, score or payment. |
| Psychology laboratory | Current `src/rooms/01-control/` | Existing separate integration; its procedures and scientific review remain intact. It does not implement the new route. |
| Fictional deals | Approved foundation | Text rendering is simple; voluntary prompts, ledger, checkpoint and restart still need exact specifications and checks. |

Read-only Node checks of the old site's pure logic passed: early Theseus answers
are blocked, six replacements advance each question, two answers finish; both SVG
target cells use the same rgb(120,120,120) fill. This checks state and code values,
not rendered pixels, human perception, learning or VR. The old site was unchanged.
The dated receipt and source hashes are indexed as corridor-room-reuse-checks.
The current integration/review dependency gap B09 remains open. Source-review
instructions now distinguish room types; no positive native review cycle for a new
type has been demonstrated merely by editing those instructions.

## One content system, three input surfaces

Share room state, source facts, consequences and pause/leave semantics. Device
adapters supply movement, looking and selection; do not maintain three diverging games.

| Target | Present in inspected code | Next implementation / acceptance evidence |
|---|---|---|
| Laptop, keyboard and trackpad | Preview walking, turn/tilt keys, view buttons, eye-height slider; held keys clear on blur | Owner can look, move, stop and return without a mouse or conflicting laptop keys. Check the actual trackpad; retain accessible visible controls. |
| Phone browser | Preview HTML view buttons and height slider; touch-look and motion disabled | Implement touch movement/looking and legible layout. Basic use must not require sensors. Test actual Android/iOS browser versions, both orientations and interruption; no blanket browser-support claim. |
| Quest 3 / WebXR | Main laboratory has XR UI, controllers and recenter; preview XR UI is disabled | Integrate the N route; verify secure origin, session support and successful user-initiated entry, both-eye geometry, height, seated/standing use, controls, pause, return, recenter and measured performance. |

W3C WebXR defines secure-context access and user-initiated immersive entry;
capability detection alone cannot guarantee session creation. Session visibility
and reference-space reset are different events. Verify each on the actual route.
The screen preview cannot prove binocular appearance or native multiview shaders.
One displayed pattern remains distinct from deliberately rendered double copies.
Head pose is not eye tracking; a conditional blur is not a validated human visual model.

## Stages and observable completion

1. Synchronise plan, source catalogue, instructions and GitHub; preserve history and
   distinguish decisions, proposals, implementation, checks, acceptance and release.
2. Close the current review-dependency defect T01g/B09 with the original negative
   counterexample and positive checks; retain independent source and practice review.
3. Specify one room and a short corridor return. Check sources and old reusable
   modules before building; unresolved checker-shadow holds may require another candidate.
4. Complete and verify the desktop slice. Then implement/test phone controls; then
   integrate and verify Quest. Early bounded compatibility probes may precede full
   content work when they resolve a dependency; prepare them before asking for headset use.
5. Owner sees a functioning slice and decides acceptance. Expand one room or one
   relationship at a time; add the deal/checkpoint slice with its own state tests.

For each slice require a complete enter/action/compare/stop/return path, truthful
source explanation, repeat/late-input and reset checks, exact-version CI, applicable
independent reviews and real target-device observations. A missing effect is a valid
observation. Automated passes, owner approval and publication are separate states.
No data collection, leaderboard, paid floors or store release is added by this plan.

## Owner's later route clarification, 8 November

The origin is logical floor 0; repeated corridors and stairs can represent
unbounded positive and negative indices. This does not require that many meshes.
The first door may contain a common introductory question sequence; reopening the
same door with variants is a possible later extension. These details remain drafts.
Learning gives no money; fictional harmful/regressive deals pay. Refusal stays
valid; bargaining is voluntary. Hesitation is not a moral diagnosis. Burning a book
and harming animals are draft text prompts, not approved new interactions.
A previously harmed character who cannot later help is a proposed consequence.
The learning-path outcome is an undefined placeholder; the verbatim word forms
are retained in the owner-route-clarification source record in the catalogue.
Do not invent its meaning. The author's soul-test wording remains a metaphor,
not a scientific assessment of a player.

## Sources and limits

- [W3C WebXR Device API](https://www.w3.org/TR/webxr/), sections 1.2, 3, 4 and 13; current draft read 8 November 2026. Specifies API conditions, not compatibility/performance of our game.
- A-Frame 1.8.0 local documentation, look-controls and xr-mode-ui; compare to `src/preview/index.html`, `src/preview/main.js`, `src/app/stage.js` and `src/engine/recenter.js`. Online pages failed in the root's browser fetch; local docs and code are the versioned basis.
- [Allen, Designs for Learning (2004)](https://www.exploratorium.edu/sites/default/files/pdfs/S.Allen-Science%20Museums%20that%20do%20more%20than%20Entertain.pdf), selected design discussion; not evidence of an effect in our game.
- [Allen and Gutwill, Designing with Multiple Interactives (2004)](https://www.exploratorium.edu/sites/default/files/pdfs/designingwithinteractives.pdf), case-based pitfalls; computer/symbolic media excluded from its scope.
- [Plutarch, Theseus 23.1](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Theseus%2A.html#23), replacement and disagreement; [SEP, relative identity](https://plato.stanford.edu/entries/identity-relative/#ShipThesPara), the later second-ship variant. Neither settles the identity question by authority.
- Earlier site method records: ship-theseus-method-record-20261030.md and checker-shadow-method-record-20261105.md under its docs/research. The catalogue resolves the separate read-only site root. Adelson's original page could not be retrieved in this inquiry; that gap stays explicit.

Calendar clarification belongs to the history record: historical 2 BCE, 1 BCE,
1 CE, 2 CE correspond to astronomical -1, 0, 1, 2. No year elapsed uncounted;
the naming systems differ. Brahmagupta's 628 is his treatise date, not birth or
the start of counting years. [NASA](https://eclipse.gsfc.nasa.gov/SEhelp/dates.html),
[MacTutor](https://mathshistory.st-andrews.ac.uk/Biographies/Brahmagupta/).
