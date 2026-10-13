# Shelf 3, the engine (13.10)

The third shelf of the revision in its walking order (docs/audit/revision.md, "Order"; row 5 of its table). What
is on it: src/engine and src/engine/ui, and what they stand on: vendor/aframe-1.8.0.min.js with three.js inside,
the scene's settings in index.html and src/app/stage.js, the vendored assets.

## Versions, read from the things themselves (13.10)
- A-Frame 1.8.0, released 2026-06-24, is still the newest release (GitHub releases of aframevr/aframe, read 13.10).
- three.js inside it: super-three 0.184.0, that is r184 (A-Frame 1.8.0's package.json, the copy in
  objekt-files/docs-engine/aframe-1.8.0). Newer three.js: r185 (2026-07-01) and r186 (2026-09-24), GitHub
  releases of mrdoob/three.js, read 13.10.

## The method
As on shelves 1 and 2 (docs/audit/revision.md, "The method"): each part of the engine against the official
documentation of the version we run, then what practitioners wrote, then his decisions. Our own docs
(docs/engine.md, docs/research, the code's comments) are leads, never sources (docs/circles.md, circle 12): every
check reads the code and the primary source itself. Five checks that do not see each other, each writing its
report as it goes into objekt-files/notes/revision-shelf3-2026-10-13/:
- A, A-Frame 1.8.0: every engine file against A-Frame's own docs (the local copy) and its source at v1.8.0.
- B, three.js r184: every file that draws with three.js against the r184 source and manual, and the published
  methods (Lengyel's Foundations of Game Engine Development, the community's geometry merger).
- C, WebXR and Meta: input, movement, comfort and the session's settings against the W3C WebXR standards and
  Meta's Horizon docs (read through the Meta VR CLI).
- D, versions and the vendor: what we ship from outside against its origin; what changed upstream since our
  versions, each change weighed for benefit and harm (his rule of 13.10).
- E, structure and tests: the engine against Gregory's Game Engine Architecture (4th edition, his book of
  12.10), its dependency direction, the per-frame work, which tests hold each file, and which choices name
  their source.

## Findings
(filled from the five reports)
