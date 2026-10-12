# 11b. A projector at the start: where the screen sits, and things that appear

Parts 2 and 3 of `11-projector-start.md` (the question, the marks and the options are there).

### Part 2. Where a screen sits and how big (Meta, the period rule, our corridor)

Read from Meta's pages as markdown (`https://developers.meta.com/horizon/llmstxt/design/<page>.md`,
12.10, full); `03c-viewing-text.md` already holds the distances, angles and letter sizes.

- **Meta, "Key considerations" (MR design guideline, last_updated 2025-10-07),
  https://developers.meta.com/horizon/design/mr-design-guideline/:** "we recommend placing objects
  at a roughly 1 meter distance slightly below the user's line of sight"; "When launching an app,
  avoid objects that suddenly appear too close or large to the user"; "If an object's size can be
  visually overwhelming to the user, consider gradually revealing the object with fade-in
  animation"; on a wall, "make sure the object is aligned with the surface so that it feels
  realistic"; 2D windows "around 45 cm" for hands, "around 1 meter" for indirect input, "around
  70 cm" for both.
- **Meta, "Panels" (2026-03-02), https://developers.meta.com/horizon/design/panels/:** default panel
  1024 × 640 dp; "Theater screens are larger, and darken the surrounding immersive or passthrough
  environment to give visual priority to the content". "Layouts" (2026-04-19,
  https://developers.meta.com/horizon/design/styles_layouts/): "It is critical to test your layouts
  on an actual Meta VR device". No angle or size in degrees for a video screen was found in Meta's
  pages.
- **Meta, "Accessibility" (2026-04-06), https://developers.meta.com/horizon/design/accessibility/,
  captions for immersive experiences:** "Start with captions at about half the distance of the
  far-field or 1 meter away"; "Try placing captions at the top or bottom of their 40-degree field
  of view"; "Captions should be an overlay that's visible at all times"; a new line rolls up in
  "approximately 0.5s". For us: a film that talks needs its words in print too (the project already
  pairs sound with a visual twin, README note 4).
- **The period rule: films and slides watched from 2W to 6–10W** (Ely 1970, Part 4 above).
- **Our corridor against both (computed from `plan.js`):** the arrival spot is 1.21 m from the
  cork and 1.5 m to the right of the board's centre, so the board's centre lies about 51° to the
  left of the arrival view, beyond the comfortable 30° head turn (Chu via Alger, 03c). Facing the
  board, a viewer can stand at most about 1.6 m from it (the corridor is 1.8 m). The whole board as
  a screen (1.6 m wide) would need 3.2 m by the 2W rule and spans 2·atan(0.8/1.6) = 53° at 1.6 m;
  a 40 × 40 in (1.02 m) screen, the smallest classroom size in Ely, needs 2.0 m, and at 1.6 m spans
  35°, a little over the ±15° glance zone of ISO 9241-306 (03c). A picture about 0.85 m wide at
  1.6 m spans 30° (±15°). So on the long wall the picture should be smaller than the board, or the
  screen goes where the corridor gives distance: an end wall is 14.6 m away along the corridor
  (`plan.js` from −6.6 to 8.0).


### Part 3. Things that appear after an event (research first)

- **Objects that break physical laws break Plausibility, and telling people in advance did not
  help.** Brubach et al. 2022 (IEEE TVCG, doi:10.1109/tvcg.2022.3150496), as reported in Slater
  et al. 2022 (doi:10.3389/frvir.2022.914392; library `slater-2022.txt`, section "Place Illusion
  and Plausibility", full): cubes that floated scored lower on every plausibility item than cubes
  that obeyed physics; being told beforehand of weightlessness had "no effect"; "39/40 chose the
  normal cube behaviour" as more plausible. Brubach itself not read (only through Slater).
  For us: a clipboard that fades in on the cork is the floating cube; something real has to
  bring it (a screen that rolls up, a person who pins it, a drawer).
- **A break in Plausibility usually does not recover; a break in Place Illusion does** (Slater
  2009, already in 05a §1). Slater 2009 adds (library `slater-2009.txt`, full): "when Psi breaks,
  it is unlikely to recover".
