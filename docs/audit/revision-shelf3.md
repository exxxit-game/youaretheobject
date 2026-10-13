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
Each line names the report it comes from (A to E). A finding marked "read in the code" was read again in our code
before it was written here; the reports themselves are leads until then (circle 12): on 13.10 one of them (C)
said a crouch sends the player back to the corridor's start, and the code (locomotion.js settle(), which moves
recenter's spot after every move) showed it sends him back only to his last move's place.

### Matches its source and stays
- The A-Frame build is the official npm aframe@1.8.0 file with one call put back (`runDeferredUploads()`, 24 bytes) and
  its source-map line dropped, nothing else (D). The call is still missing upstream: super-three 0.184.0 and 0.185.0,
  A-Frame master (D).
- The session: local-floor, multiview, foveation 0, framebuffer scale 1.0, 72 Hz; the comments quoting Meta on
  multiview, foveation and the ray's fade quote it word for word (C).
- The movement numbers: the 0.8 stick threshold, the 80 cm back step, 1.4 m/s, 180°/s, the vignette's easing (C).
- The controller drawn as one mesh: its skinning is the mechanism of Meta's IWSDK, and it is disposed right (B).
- The merge's vertex colours, the canvas textures in sRGB, the windings of the lathe and the slats, the 60° crease
  (three's own toCreasedNormals default) (B).
- The layers: no engine file imports src/app or src/rooms (E).
- The vendored models, inspector and fonts are byte-identical to their origins and the newest releases (D).
- The quick tests: 30 files, all passing (E, 13.10 16:51).

### To fix (a source settles each)
1. GPU memory never freed: panel.js has no remove(), ui/ink.js's remove() frees nothing, and A-Frame's
   removeObject3D does not dispose (read in the code: the bundle and both files). Every answer button, scale bar
   and form field made and thrown away keeps its texture, geometry and material; replaying room 01 adds more
   (A, B; sizes estimated from the code, 0.4 to 3.9 MB each, not measured). Also blob-shadow.js and merge-static.js
   lack a remove(), and surface.js clones a geometry on every apply() without disposing the last (A, B).
2. The reflections: the four reflect-env instances keep their PMREM generators and cube targets after their last
   picture (about 9 MiB, B's estimate), and all four take their pictures in the same frames during the first 15 s
   (E): one generator, freed after the last picture, and the four spread out.
3. Garbage made every frame while moving: about 50 arrays a frame while the teleport arc aims (locomotion.js),
   4 to 7 objects a frame walking smoothly, closures in controller-batch.js, `map`/`some` in lightbox.js, new
   objects in sheet-math's tripPose (A, B, E agree); A-Frame's best-practices.md asks to reuse objects in tick.
4. A crouch below 1.20 m (seatedBelow 1.35 less 0.15) re-places the player: back to where his head was at his last
   move, facing the way he faced then, so a step taken in his real room or a turn of the body is undone (C; read in
   the code: recenter.js tick() line 68 calls apply(), which sets x, z and yaw). Meta's "Locomotion comfort and
   usability": "users should be able to choose between seated and standing modes" (C).
5. Losing focus (Meta's menu): recenter.js listens to `visibilitychange` only to place the player again (read in the
   code); locomotion keeps a held stick's state, the controllers stay drawn, sound plays on (C; Meta VRC.Quest.Input.4
   and Functional.2 ask the app to react).
6. Targets that are hidden or behind a wall are only unlit: the cursor still hovers and clicks them (C; Meta's ray
   casting page: no interactions with occluded or invisible objects; IWSDK filters them).
7. `vr-mode-ui` on the scene does nothing: renamed to xr-mode-ui in 1.5.0, and the 1.8.0 bundle registers only
   xr-mode-ui (A; read in the code: stage.js line 32, the bundle).
8. The first frame's time step is the scene's whole load time, since A-Frame 1.8.0 runs on three's Timer, not a clock
   starting at 0; fader.js's comment says 0 (A; the Timer class read in the bundle).
9. Smaller ones, each with its source in A or C: grab-press.js never removes its listeners; laser-beam.js can keep a
   line drawn after a controller reconnects (animation.md); ink.js writes look-controls' data directly (component.md:
   "Do not modify the data attribute directly"); shapes.js rebuilds the clipboard's board on a colour-only hover;
   prewarm.js starts on the first tick after enter-vr, not the first frame with a pose; haptics' pulse() promise is
   not caught; the gltf-model system's Draco path points at gstatic.com (nothing is fetched today).
10. Five comments that the v1.8.0 source contradicts (A, its list "Comments that the v1.8.0 source contradicts").
11. Sources not named: 16 engine files name none (E); B found four of them (prisoner849's rounded box on three.js's
    forum, Park and Miller 1988 for `seeded()`, Yuksel and others 2011 for the centripetal curve, Lengyel vol. 2, 10.1
    for decals).
12. What holds the engine: 12 of 37 files have no test of their main job (E); first recenter, log, grab-press and
    prewarm. tests/vendor.test.mjs holds the one call but not the whole build (no hash), and no licence text lies
    beside the A-Frame build or the inspector (D); docs/art/credits.md names the controllers' set 1.0.19, the files
    equal 1.0.20 (D).
13. door.js and results.js are the lab's, not the engine's: to src/app (E).

### Waits for the headset (shelf 4)
- The leaks' real size (renderer.info.memory before and after a few questions), the cost of the garbage, of the
  sign's 0.7 MB texture upload on each frame it animates, of the four reflection pictures (E, B).
- The near plane of 0.005 m with a 24-bit depth buffer gives depth steps of about 2.3 mm at 14 m: the likely cause of
  the far flicker the decal offsets fight (B, Lengyel vol. 2, 6.3.3); a larger near plane changes what is drawn close
  to the eyes, so it is measured and looked at first.
- The clear colour: black or white gets the fast clear on Quest 1 and 2 (Meta, WebXR performance best practices);
  ours is #0b0b0d (C). The mouse's raycaster keeps casting in VR (C).
- What Quest does on the Meta menu and a long press (visibility states, `reset`), whether hands work without asking
  for `hand-tracking` (C).

### A step of its own, later
- The comfort choices inside VR (teleport or smooth, the snap angle): Meta's design pages ask for them; ours are only in
  the address (`?move=smooth`, `?turn=smooth`) (C).
- The laser as Meta's spec draws it (short, with a cursor) is already on the board, to him as pictures first.
- The controllers' models through three's XRControllerModelFactory: take r186's file, which fixes a crash on swapping
  controllers, pointed at our own copy (D).
- A room's end: an unmount that frees its sounds and lines, sound names per room (E); with the loading order below.

### Loading and smoothness (his request of 13.10)
Two more checks: F1, the targets (Meta, the web's standards, research on how waiting drives players away); F2, what
our game loads, when, and where it waits.
