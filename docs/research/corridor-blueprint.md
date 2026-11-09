# Floor 0: source-grounded working layout

## Current state, 9 November 2026

B0-02 replaces the incomplete B0-01 layout as the current discussion drawing.
The same F page, `blueprint-2026-11-09/blueprint.html`, links one A2 plan and its
parameters under `revision-02/`. B0-01 remains a historical inventory of code.
Its arithmetic did not validate the intended architectural arrangement. The owner
identified missing landmarks, unclear stair arrows and incorrect door ordering.
Neither revision is a measured survey, accepted building solution or game render.

The latest owner clarification sets the start at the centre beside the stairs,
facing the existing You are the object sign. Door labels run clockwise: top row
D1-D4 left to right, bottom row D5-D8 right to left; D4 faces D5. Eight symmetric
positions are a working arrangement, not a measured or mandatory door count.
Show end pictures, extinguisher, lamps, rails, window/sill, baseboard and a closed
future lift facade. Latest owner amendment: floor number T1 shares the central
You are the object panel V1, which remains present; remove the separate plate above
the extinguisher. The larger panel/lettering dimensions remain proposals.

Floor 0 is the reference. N+ and N- may alter geometry and dimensions as well as
details, with changed connections, clearance and viewpoints checked anew. A
passive discovery may occur anywhere along the corridor, stairs or landing;
neither text nor room entry is always necessary. Positive/negative floor indices
do not encode moral worth. Stable episode history and consequences remain separate
from geography, displayed floor number and composition version.

## What was examined

- The owner's original sketch and photographs 3-5 establish qualitative layout
  and a visible baseboard, not dimensions. Ten photos were checked by a bounded
  helper; ambiguous window/door associations were kept open.
- The owner's `video_2026-11-06_21-23-34.mp4` is 47.84 seconds. Sampled frames
  at 0/8/13/16/18/20/22/30/40 seconds were examined across lead/helper reviews;
  no continuous complete-video viewing is claimed. At 16 seconds the stairs are
  visible; at 18-20 the lift frontage adjoins the corridor portal.
- The attached 184-line owner compilation was read completely by a helper.
  Earlier quoted AI responses do not override the owner's later centre start
  and permission to vary N geometry. The lead checked the resulting decisions
  against the current chat; a helper's report alone is not architectural proof.
- The actual UIC Science and Engineering Offices fifth-floor evacuation plan
  was opened and visually inspected in Chrome. Its different stair/lift core
  illustrates connected circulation, not dimensions to transplant to this house.
- Nine local source hashes bind the inherited parameters: tile math, old scene,
  sign, extinguisher, lift hall, preview camera, layout, route and world. B0-02 recentres
  and changes placements without modifying those game modules.

## Drawing and quantities

The plan is 1:40 on one A2 sheet. A complete U-turn ascent runs from floor 0,
up the right flight, across the half landing, then up the left flight to +1.
The second flight is above floor 0 and dashed in plan. Descent below 0 lies
under its projection, not on the same physical landing. A separate axonometric
route sketch distinguishes heights; it is not a construction section.

| Candidate parameter | Basis and boundary |
|---|---|
| Hall 12.9 x 1.8 m; room 2.2 x 2.9 m | Inherited nominal footprints, not measured optimum |
| 8 + 8 rises, 0.18 rise / 0.38 run; floor period 2.88 m | Existing model parameters, not counted from photos |
| Equal flights 1.26 m; central step-edge gap 0.16 m | New symmetry proposal; not clear handrail spacing |
| Landing 2.68 x 1.38 m | Width equals two flights plus gap; turn/guards remain to check |
| Hall grid 258 = 164 whole + 94 clipped | Existing module 0.3048 m; cells, not purchase tiles |
| Proposed landing grid 45 = 21 + 24; room 80 = 48 + 32 | New grids; current game floors are concrete |
| Baseboard straight axes: hall 17.5516, room 9.2, landing 5.44 m | Openings excluded; corners, waste and stair profile excluded |

All quantities are conditional on the candidate boundaries. Each inherited value
is labelled as such; copying it is not evidence that it is ideal for our experience.
The lift uses the old 1.1684 m opening; cabin, shaft and travel are unspecified.
The old sign artwork is reusable, but a proposed smaller/lower panel is needed
for the new start under the tested framing assumptions.

The inherited 0.18/0.38 pair gives `2h+b=0.74 m`, outside the saved VBG guide's
0.60-0.66 m range. It is not yet a professionally justified stair proportion.
Current code has eight rises/boxes per flight, seven separate goings between the
first and last rise (2.66 m), and a final 0.38 m strip at landing height. The allocated
flight strip remains 3.04 m; this does not widen the entire landing by 0.38 m.
Demina/Elchishcheva, section 5.4 and figure 5.6 (PDF 54-55), were read and the
figure visually inspected after the owner saved the complete 106-page PDF.
Their example distinguishes ten rises from nine goings. Do not silently shorten
our model: resolve boundaries and a consistent section before recalculating it.

## Calculations that expose design work

The current preview camera uses vertical FOV 62 degrees and zoom 1. At aspect
9:16, the old sign width 0.94 m at distance 0.89 m does not fit. A candidate
0.50 x 0.16 combined brand/floor panel at centre height 1.54 m fits the tested level-camera views
for eye heights 1.1, 1.6 and 1.9 m. This proves framing only, not occlusion,
legibility, notice or the actual per-eye Quest projections.
The 1.25 m window also fails the same portrait framing from 0.69 m away; an
accessible farther viewpoint, changed dimensions or another inspection method is needed.

Analytic intersections of repeated current-code geometry give upper step-box
clearance varying from 2.74 to 2.56 m, inclined-support clearance about 2.66148 m,
and 2.64 m to the upper landing slab in its interior. End caps, seams and finite
buffer boundaries need separate checks. The existing landing lamp hangs down
to 2.0795 m. A new unimplemented candidate mounts its top to the slab underside,
giving a derived underside of 2.599 m instead of an arbitrary hanging offset.
The sill projects to Z -4.221 while the route permits centre Z -4.28, with its
bottom at +0.35. A ceiling check does not close this low-obstacle collision gap.
These are model findings, not real-building measurements or full-body acceptance.

## Proposed unusual stair encounter

The owner proposes deliberately exchanging ascent and descent once. The previous
unclear arrows were not an intentionally designed illusion. A global reflection
of an entire consistent stair stack preserves distances and intersections.
Naively mirroring only one pair among ordinary pairs gives a mixed joint:
our 0.32 m step boxes overlap by 0.14 m. This counterexample was independently
recalculated. It does not prove a real-world fault or controller trapping, because
the current controller follows a separate smooth route. A local change needs
a designed transition, or a different representational mechanism.

[Sugihara's 3D Schroeder Staircase](https://www.isc.meiji.ac.jp/~kokichis/contest/contest2020/contest2020e.html)
and his [height-reversal commentary](https://www.isc.meiji.ac.jp/~kokichis/3Dillusionworld/lecture3/3Dcomment3e.html)
were read in full. The flat stair image and real side walls can support two height
readings after rotation. This is a relevant artist/researcher's example, not a
walkable structure or demonstrated Quest effect. The published kit specifies
nonprofit use and was not copied. Distinguish viewpoint reinterpretation, actual
light changes and scripted object replacement; the author's own example separates
an optical effect from a two-car magic trick.

## Professional sources and remaining boundary

- [Autodesk constraints](https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-Core/files/GUID-899E008D-B422-4DF2-AC8D-1A4F5701ED4E.htm): geometric relationships and dependent dimensions; not our building sizes.
- [Approved Document K](https://assets.publishing.service.gov.uk/media/60d5bdcde90e07716f516cfd/Approved_Document_K.pdf), England 2013, sections 1.11, 1.15, 1.20-24: headroom, width and landing/door relationships. Architectural reference, not local legal requirements for a virtual game.
- [UIC official plan index](https://ehso.uic.edu/fire-safety/building-specific-emergency-action-plans/) and [viewed fifth-floor plan](https://uofi.app.box.com/s/kxbsa9ymqso8gpqwqyeh7nsql37q4cwd): real connected circulation, different geometry; no copied measurements.
- [Three.js camera](https://threejs.org/docs/pages/PerspectiveCamera.html), [WebXR views](https://www.w3.org/TR/webxr/#xrview-interface), [XAUR orientation](https://www.w3.org/TR/xaur/#orientation-and-navigation): framing and actual device projections, input/posture alternatives; not observed human attention.
- [Varini's own account](https://varini.org/a-propos-de-felice-varini/): architecture, reading point and other views; our composition remains to build and verify.

Next, close one base section: slab opening, flight/landing joints, guards, fixtures
and a stated body envelope, then the 0.22 frame / 0.08 wall joint. Sizes and a
top-down plan alone do not prove passage. B16 still blocks automatic game viewing;
no alternate surface, port or settings workaround was attempted. No phone/Quest
acceptance, owner acceptance, code geometry change, moral-effect proof or release.
The first book deal and its existing receipts remain unchanged and separate.

## Whole-space research, 9 November 2026

[The connected interaction layer](corridor-interaction-map.md) now uses the same
plan for selectable details, directed relations, seven routes and N variants.
Planning relationships does not close the unresolved base-section checks below.

The same blueprint page links `revision-02/research.html` and its JSON ledger:
45 bounded source records, six design questions and six connected surface groups.
Architecture, multi-viewpoint construction, image/material/light, attention, route
memory and sound are separate mechanisms. Reading scope distinguishes the lead,
bounded helpers, unviewed illustrations and unavailable local copies. Existing
Glennerster 2006, Suma 2011, Klatzky 1998 and McFadyen 2021 entries are reused.
The collection is a targeted multilingual inquiry, not exhaustive world coverage.

The lead checked Doerschner/Pont 2026 methods, results and 3D limitation: printed
images on a corridor wall under changing-colour lamps are relevant, but their
reported appearance changes do not establish our screen/Quest result. The two
2025/2026 texts contain a colour-model inconsistency; the helper verified the
2025 PDF typography. No official erratum or complete numerical audit is claimed.
Do not import that model blindly. Likewise, head direction is not gaze or notice,
and a doorway does not guarantee forgetting. See the ledger for primary links,
methods, limitations, local files and the surface-by-surface verification plan.

The owner selected Chrome-only Browsec. System proxy settings were absent and a
direct TSTU request still timed out. Manual download solved file availability,
not that network failure. Browser automation separately stopped because it could
not confidently identify the current URL; do not route around this restriction.
