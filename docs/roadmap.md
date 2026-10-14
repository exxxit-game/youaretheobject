# Roadmap

## What Object is
A living archive of classic psychology experiments that you go through yourself
in VR. One short room per experiment. Every room follows the same arc:

1. **Catch** — you are the subject; the room reproduces the original situation.
2. **Reveal** — what you did, proven by the event log; how the trick worked.
3. **Original** — what the study found (sourced in `sources.md`).
4. **You vs others** — your result next to other players and the original numbers.

Not a big game: small rooms, minutes each. Reading about an experiment is weak,
watching is better, living through it is the strongest form of explanation.

## End point (release 1.0)
- The lab's corridor + 3 rooms, each through the full arc above: one first-room hook chosen by a
  playtest (not by opinion) and two more; room 01 (illusion of control) is set aside as a lab room.
- Russian and English; Quest Browser and desktop where the room allows.
- Privacy page, consent, anonymous statistics; "you vs others" in every reveal.
- Playtested with at least 10 people outside the team; top issues fixed.
- Installed first, through Meta's test channel and store (a WebXR app); the public page second (his decision:
  install first).

## Science track (runs beside the game)
- Evidence that people take part for a personal result and a comparison with others:
  Moral Machine (2.3 million people, 40 million decisions, Awad et al. 2018, Nature),
  LabintheWild (about 3.5 million volunteers, feedback-driven design, Reinecke & Gajos),
  Sea Hero Quest (more than 4 million players). All were short and on phones or
  computers, not in VR.
- Before any data counts as science: a university partner, ethics approval, a separate
  science consent, preregistration (OSF) of one study.
- First study candidates are the open questions in `objekt-files/notes/archive/docs/ideas/` (e.g. does mixed reality
  bring VR effects back to real-room size; how much one reveal weakens the next room): by region
  `objekt-files/notes/archive/docs/ideas/europe.md`, `objekt-files/notes/archive/docs/ideas/east-europe-global-south.md`, `objekt-files/notes/archive/docs/ideas/east-asia.md`;
  playing together by voice `objekt-files/notes/archive/docs/ideas/multiplayer-voice.md`; the owner's own ideas `objekt-files/notes/archive/docs/ideas/owner-experiments.md`.

## Principles (from research)
| Area | Rule | Source |
|---|---|---|
| Frame rate | 72 fps on Quest (13.7 ms per frame), 90 fps on Quest 2 (11.1 ms) | [Meta WebXR perf](https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/) |
| Draw calls | Fewer than 200 a frame on Quest 3. The corridor measured 124 in the headset | [Meta WebXR best practices](https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/) |
| Materials | Prefer Basic/Lambert or baked lighting over Standard (PBR). Room 01 uses 71 Standard materials: fine for now, first thing to change if a headset drops frames | same |
| Comfort | No forced artificial movement; if movement is needed, teleport and snap turn; no sudden camera motion | [Meta comfort](https://developers.meta.com/horizon/design/comfort/) |
| Text | A sans with a high x-height (the game ships Inter), high contrast; the clipboard is read 1 m in front, its text never under 24 mm (`docs/research/vr/03c-viewing-text.md`) | [Meta typography](https://developers.meta.com/horizon/design/styles_typography/) |
| VR is valid for this | People react to virtual social situations as if real: Milgram in VR (Slater 2006), smoke/bystander in VR (Kinateder), Asch in VR (conformity about 34%) | [Slater 2006](https://doaj.org/article/ac663279a2064039873d63c77347297f), [Frontiers 2016](https://www.frontiersin.org/articles/10.3389/frobt.2016.00043/pdf) |
| Deception | Allowed only with a full debriefing right after; the player can quit at any time | [IRB guidance on deception](https://irb.northwestern.edu/resources-guidance/policies-guidance/docs/guidance-for-research-involving-deception-or-incomplete-disclosure---general---1919.pdf) |
| Data | Store only truly anonymous data (no IP, no account, no free text); ask consent before sending anything; say upfront that anonymous runs cannot be deleted later | [GDPR Recital 26](https://presencis.com/regulations/gdpr/recital-26/) |
| Wording | "Online experiment", not "scientific study": publishing research needs ethics approval | — |

Voice: recorded lines (ElevenLabs, Daniel), checked by speech-to-text with
`tools/check-voice.mjs`; the browser's speech synthesis is not used.

## Phases
Work on one phase at a time. A phase is done only when its exit check passes.

### 0. Foundation — done
Structure, rules, tests, CI, headset check tool, voice pipeline, card method
(`docs/cards/`, 145 experiments read from full texts), guards in `docs/mistakes.md`.

### 1. Room 01 — built, then set aside
Built, reviewed twice against the paper, passes the headset check. The owner played it (08.10):
16–20 minutes of waiting, too boring for a first room. It stays as a lab room; before room 2 it
moves onto the clipboard and gives its shared flow to `src/app/` (`docs/target-architecture.md`).

### 2. First playtest (before building more rooms)
5–10 people outside the team play the first room (phase 3 picks it from prototypes). Measured: who finishes, where they get bored
(head turned away, long pauses), a 1–10 "would you play the next room", and what they
retell in their own words. Exit check (owner 08.10): 7 of 10 finish and the mean "would play the
next room" is at least 7 of 10; a written result in docs/playtests/.

### 3. Choose the first room: trial rooms, then his pick
Read the top candidates' papers in full (Kohnstamm, Morehead, Hirschhorn, Shams, Drori,
Pailhès, DRM); build two or three short prototypes; playtest them the same way.
Exit check: he picks one, with the playtest numbers in front of him (board step 2).

### 4. Statistics live
Built for room 01: privacy page, server whitelist, consent, sending on, "you vs others" read.
Still: a whitelist per new room.
Exit check: a real run appears in the database and in the reveal.

### 5. Lobby, third room, English
Exit check: all rooms pass unit, smoke and headset checks; owner plays all.

### 6. Soft launch
Free link to VR communities; measure completion and "next room" clicks.
Exit check: numbers collected; decide pricing with data.

## Room candidates
Only from passing cards in `docs/cards/` (full text read, quotes checked). Coverage of
every area: `docs/library/coverage.md`. Papers still to obtain: `docs/library/wanted.md` (index of the
whole papers library: `docs/library.md`).

## Scope guard
- New ideas go to "Room candidates" or a "Later" note, not into the current phase.
- No feature without the owner's word. One phase at a time.

## Decided with the owner
- **Business model:** a floor of 9 rooms is one pack; floor 1 free, floors above bought once
  (Meta Horizon Store, WebXR PWA with in-app purchases). Also: licences for education (schools,
  psychology courses, science museums) and partnerships with universities.
  Never sell player data, never add ads or third-party trackers.
- **First vs repeat play:** the game remembers whether this is the player's
  first run of a room. Statistics never mix first and repeat runs: a repeat run
  is a different experiment ("does knowing change behaviour?").
- **Reveal wording:** "you did X", never a diagnosis ("you are superstitious").
  The strength is the comparison: you, all players, the original study.
- **Ethics approval:** needed before data counts as science. Most realistic path:
  a university co-author whose ethics board reviews the study. Requirements to
  expect: 18+, consent screen saying some details are revealed at the end, full
  debrief, quit any time, data plan. Do not collect data "for science" before approval.
- **Room 01** is the illusion of control (Alloy & Abramson 1979, Exp. 2): faithful, seated,
  about 16 minutes. Its reveal is strongest as "you vs others", so it sits mid-game, not first.
