# VR and MR norms: the reference

What the field already knows, so nothing in the game is invented where a standard, a guideline,
a measurement or a shipped game has settled it. Six areas were read from primary sources (Meta's
own pages, W3C and other standards, papers in full, developers' own accounts); every item in the
files below names its source, says whether it was verified, and what it means for us. Papers read
in full are in `C:\Users\admin\Documents\objekt-papers\` (PDF and text).

| File | Area |
|---|---|
| `01-meta.md` | Meta design guidelines, store checks (VRCs), comfort ratings, age, PWA, Quest Browser, IWSDK |
| `02-standards.md` | WebXR modules and their status, W3C XAUR, WCAG, photosensitivity, ISO/IEEE, GAG, XAG, captions |
| `03-data.md` | play spaces, posture, audience, body sizes, IPD, arm fatigue (with 03a, 03b, 03c) |
| `03a-locomotion.md` | what reduces sickness when moving: teleport, vignette, speed, turning |
| `03b-sickness.md` | how many get sick, sex and IPD, age, time course, the SSQ |
| `03c-viewing-text.md` | head rotation, distances, focus conflict, letter and target sizes |
| `04-mr.md` | mixed reality in Quest Browser, A-Frame and AR, Meta MR rules, MR apps, MR research |
| `05-wow.md` | what fits experiment rooms and what breaks the science, top 15, sources; the findings in `05a-presence-onboarding.md` (presence, first minutes), `05b-attention-reveals.md` (attention, UI, reveals, curiosity), `05c-awe-body-comedy-pacing.md` (awe, body, comedy, pacing), `05d-puzzles-sharing-avoid.md` (escape rooms, sharing, what to avoid) |
| `06-science.md` | VR as an experiment platform: methods, replications, home studies, ethics, debrief, measurement |
| `07-corridor-1979.md` | a US university lab corridor of 1979: doors, signs, extinguishers, notices, typewriters |
| `08-paper.md` | paper in the headset: large-print documents (UKAAF, CNIB), text inside pictures, forms that grow in pages |
| `09-end-wall-pictures.md` | the corridor's end walls: what hung in 1970s psychology lab corridors, how games draw a player to a corridor's end, images free to use |
| `10-floor-directory.md` | the floor directory by the stairs: its 1970s form, sizes, letters, where it hung, the stair-sign standards of the time |
| `11-projector-start.md` | a projector or screen at the corridor's start: how shipped VR games open with an in-world briefing (trigger, tutorial, skip, screen place), how to start it, the options for the owner; the period in `11a-projector-period.md` (1970s pull-down screens, 16 mm, Carousel and slide-tape shows, TV carts, the exit rule), placement and reveals in `11b-projector-screen.md` |

Other projects compared with ours, the good and the bad (file layout, psychology-experiment frameworks, WebXR samples and web games, engines from China and Japan): `docs/research/projects/file-layout.md`, `docs/research/projects/experiments.md`, `docs/research/projects/webxr-and-games.md`, `docs/research/projects/china-japan.md`. How large online psychology platforms record, store, check, publish and share their data (Project Implicit, LabintheWild, Moral Machine, Pavlovia, Gorilla, the Psychological Science Accelerator): `docs/research/projects/data-platforms.md`. What the owner's earlier game, Cosmogram, learned about card indexes, stale records, guards and releases: `docs/research/projects/cosmogram.md`. What Claude Code itself can do for us, from its full documentation, and everything installed on the laptop: `docs/research/projects/claude-code/README.md`. Where the game can be installed or played worldwide (Meta, Pico, SideQuest, heyVR, VIVERSE, itch.io, Steam, Android XR, Apple, arcades, Russia, Japan and Korea, China) and what to decide now: `docs/research/projects/distribution.md`.

Each file ends with "Conflicts with our notes", "Top 15 for our game", the sources read and the gaps.
Gaps that stayed open: paywalled ISO 9241-391/392/394, ISO/IEC 5927 and IEEE 3079 (scope pages
only); GDC talks (video captions blocked); no study compares snap angles; no published timing
accuracy for WebXR on Quest Browser.

## What it settles: movement settings (01 §2, 02 §10, 03a)

- Defaults: teleport and snap turn; smooth moving and smooth turning as choices. Meta, XAUR, GAG,
  XAG and the papers agree (03a: snap turning alone lowered sickness on a Quest 2, Kelly 2024).
- Keep smooth moving: some players do worse with teleport (03a, Clifton 2020).
- Vignette: helps with smooth moving (Al Zayer 2019, our 1.4 m/s, 180°/s and 50° are its values),
  but it costs immersion and on top of snap turning it did not help (Kelly 2024): a switch, on for
  smooth moving, never forced on snap turning.
- Choices Meta names: snap angle 30/45/90°, smooth-turn speed, travel speed (also XAUR 15a), seated
  or standing chosen early, either hand. No source gives numbers for vignette strength, snap angle
  or speed beyond these.
- Where: no forced questionnaire at first launch; comfortable defaults, preferences settable early
  and any time, applied at once, remembered. Meta's place is the left Menu button; whether a page
  can read it is unsettled (01 §4, 02 §1: maybe `buttons[7]`): a headset probe decides; Meta's
  fallbacks are B or the left trigger, ours could be the clipboard.

## Our notes that disagree with the sources (to fix)

1. `tests/glow.test.mjs` counts flashes in lamp level, not WCAG relative luminance: all endings
   still pass, but a flicker between levels 0.85 and 1.0 would slip through (02, conflict 1). No
   guard on total flicker length (BT.1702-3 and GAG: 5 s) (02, conflict 4).
2. Roadmap and experiments claim "Asch in VR about 26–34%": unsupported; headset Asch studies found
   almost no conformity unless the task was hard (06, conflict 1). "Obedience proven in VR" and
   "people react as if real" are overstated (06, conflicts 2 and 10).
3. `docs/headset-capabilities.md`: the camera feed is available to a web page through its own
   permission (not through WebXR); VR and MR can share one `immersive-ar` session (04, conflicts 1, 2).
4. `docs/vr-checklist.md`: 72 Hz is 13.9 ms a frame; the store floor is 60 fps at 72 Hz; meaningful
   sound effects need a visual twin; hide the controllers and laser when the system menu opens
   (01, conflicts); 3:1 contrast for buttons and the laser (02, conflict 6).
5. "Standing = Meta's 1 × 1 m": on the Store "Standing" means about 2 × 2 m (01, 02 conflict 10).
   Stationary is the real base for most players; 1.8 × 1.8 m roomscale is an offer (03).
6. The sheet 12° below the eyes has no research source of its own; it sits inside the sourced
   ranges (03c). The letter floor has one now: Google's 24 dmm (MIN_LETTER, 08-paper).
7. The looping sign hum needs a stop or its own volume control (WCAG 1.4.2, Level A) (02, conflict 7).

## Decisions for the owner (in the plan doc)

- Results are sent before the debrief; the rules ask that a player may withdraw their data once the
  trick is explained (APA 8.07c, BPS): a "keep / discard my result" choice after the reveal (06).
- "18+" is stated, not asked; Meta allows players from 10 (06). The seated lift at eyes below
  1.35 m lifts standing children (03).

## To check on the headset

The left Menu button in a page; one `immersive-ar` session for corridor and room; hit test without a
room scan; the light box's clicks heard before its first flash (05b §3).
