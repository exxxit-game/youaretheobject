# Revision 4 of 5: graphics and the content pipeline, at the scale of the whole game

The owner's question (10 Oct 2026): the smartest way, not the simplest, to build the pictures and sounds of
about 10 floors of 9 rooms, decided now while one corridor and one room exist. Budget: Quest 2, Meta's
"< 100" draw calls and "< 750K" triangles a frame; in our A-Frame 1.7.1 each eye draws on its own, so a view
must stay under 50 (then a desktop camera; now `QUEST2_FRAME`, both eyes in VR, tests/draw-calls.mjs). Measured worst views: corridor 66, room 97.
Marks: **[read]** the page was opened and the quote is in it; **[code]** read in source code; **[estimate]** my
arithmetic or judgement, not measured; **[unverified]** not confirmed. Meta pages read with `metavr docs fetch`
(metavr 1.8.0.17.10) on 10 Oct unless said otherwise. Engine questions (multiview, IWSDK) are in
[engine-and-tools.md](engine-and-tools.md) and not repeated here.

## The parts (each gets an answer or "not found")

1. Authoring rooms at 90-room scale: primitives in code vs glTF from Blender (baked lightmaps, KTX2/Basis,
   Draco/meshopt, gltf-transform), instancing, atlases; what Meta and shipped WebXR titles do; how much would move.
2. Lighting: real-time vs baked; what Meta recommends for Quest 2.
3. Text: canvas textures vs SDF/MSDF (troika-three-text, A-Frame `text`) for sharpness and draw calls; readability.
4. A plan to under 50 draw calls a view for corridor and room, in order of payoff, from Meta's perf workflow.
5. Assets and licences: CC0 libraries, photogrammetry, Meta's asset library (metavr), the provenance rule.
6. Audio: formats, spatialisation, loudness.
For each: what we use now; the best option; keep / change / add; cost now vs after five rooms.

## Findings

### Meta, WebXR performance [read]
- "WebXR Performance Best Practices" (undated), https://developers.meta.com/horizon/documentation/web/webxr-perf-bp/ :
  "limit yourself to one directional light or one point light if you're making heavy use of PBR materials"; "For fully
  static setups (i.e., static lighting and static objects), consider baking lighting into lightmaps"; "KTX 2.0/Basis
  Universal is the recommended approach to texture-compression for WebXR"; transparent objects are "rendered
  back-to-front ... a lot of fragments ... rendered to multiple times"; "Set your clear color to white or black".
- "WebXR performance optimization workflow" (2026-07-21), https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/ :
  "merge small meshes into larger chunks and look for any meshes that can be removed from the scene entirely"; "Both
  multi-view rendering and instanced mesh rendering are great options for reducing the number of draw calls";
  "minimizing state changes between draw calls"; "batching objects that use the same material into a single call";
  "a portal system or occlusion culling"; "Break apart large models ... to enable better frustum culling"; GPU side:
  "Consider using static lighting (lightmaps, environment maps, or light probes)"; "If using anisotropic filtering, try
  switching to bilinear". Its first step: learn whether the app is CPU- or GPU-bound ("not render anything").
- Meta's IWSDK skill (meta-vr plugin, `hz-iwsdk-webxr/SKILL.md`): "Aim for under 50-80 draw calls on Quest 2";
  `references/performance-tips.md`: "Combine multiple small textures into a single texture atlas to reduce material
  count and draw calls"; "keep total texture memory under 256 MB". A helper, not a source (engine-and-tools.md, Part 2c).

### Meta, art and lighting design [read]
- "Art and performance" (2025-07-25), https://developers.meta.com/horizon/design/art-and-performance/ : "static
  environment lighting that can be baked into lightmaps, light probes, or in some cases even a static object's diffuse
  texture. While a slowly swinging, flickering light bulb may create a wonderful atmospheric effect, it is not free."
- "Lighting and effects" (2025-06-27), https://developers.meta.com/horizon/design/lighting-and-effects/ : "Using
  real-time lights sparingly as they are resource-intensive. Bake lighting whenever possible."
- "Art assets" (2025-06-25), https://developers.meta.com/horizon/design/art-assets/ : "limit .gltf textures to
  1024x1024 for best performance" (said for Meta's Spatial SDK; no WebXR number found).

### Shipped WebXR work [read]
- Meta's Project Flowerbed (three.js), repo https://github.com/meta-quest/ProjectFlowerbed : models "saved as `.gltf`s
  from Blender"; "The asset pipeline will compress them and convert textures to `ktx2` basis textures"; sounds
  "compressed with `ffmpeg`"; "Assets ... have their own licenses". Case study (23 Feb 2023),
  https://developers.meta.com/horizon/blog/project-flowerbed-a-webxr-case-study/ : "All of our 3D assets, including the
  main environment, were created in Blender"; "KTX2 textures are much smaller in memory, faster to render"; instanced
  meshes for plants and "repeating parts of the environment" (their own culling and LOD added); "Be sure you're
  combining meshes where possible"; target "72 frames per second". Lightmaps and Quest 2: not mentioned.
- Needle Engine (three.js-based; docs "Last Updated: 4/21/26"), https://engine.needle.tools/docs/how-to-guides/xr/vr-performance :
  "Keep draw calls under ~100-150 for Quest"; lightmaps "Pre-computed lighting for static scenes - zero runtime cost";
  "Limit to a single directional light"; "Compressed textures use 4-8x less GPU memory".

### A-Frame and three.js, as vendored [read + code]
- A-Frame 1.7.1 "Best Practices", https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/introduction/best-practices.md :
  "Merge together all static meshes if possible"; "Texture atlases provide one efficient way to reuse materials";
  "If using models, look to bake your lights into textures rather than relying on real-time lighting and shadows."
- `gltf-model` docs, https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/components/gltf-model.md : KTX2
  needs `basis_transcoder.js` and `.wasm` "from the three.js repository"; "Meshopt may have similar compression ratios
  to Draco, with much faster decompression"; "compression does not particularly affect framerate".
- [code] `vendor/aframe-1.7.1.min.js` already contains the glTF loaders for `KHR_texture_basisu`,
  `EXT_meshopt_compression`, `KHR_draco_mesh_compression`, `EXT_mesh_gpu_instancing` and `KHR_materials_unlit`;
  `basisTranscoderPath` and `meshoptDecoderPath` default to empty. glTF + KTX2 + meshopt needs only the decoder files
  vendored beside A-Frame: **no build step**. It also contains three.js `BatchedMesh` (r173).
- three.js r173 `BatchedMesh` docs, https://raw.githubusercontent.com/mrdoob/three.js/r173/docs/api/en/objects/BatchedMesh.html :
  "render a large number of objects with the same material but with different geometries"; "If the WEBGL_multi_draw
  extension is not supported then a less performant fallback is used". [code] it has `setColorAt` and
  `perObjectFrustumCulled = true`. Whether Quest Browser exposes `WEBGL_multi_draw`: **unverified**.
- three.js r173 `MeshStandardMaterial` docs: "The lightMap requires a second set of UVs." [code] its GLTFLoader maps
  the occlusion texture to `aoMap` but has no lightmap slot (glTF core has none): a bake goes into the colour texture
  (with `KHR_materials_unlit`) or is attached by a small component after load. merge-static keeps only `position`,
  `normal`, `uv` (its `KEEP` list), so a second UV set would be dropped today.
- [code] r173 `WebGLLights.js` counts every point light (`pointLength ++`) whatever its intensity; only
  `object.visible === false` skips one (`WebGLRenderer.js`, projectObject); the point-light count is part of the shader
  program key (`WebGLPrograms.js`, `numPointLights`), so changing the count recompiles shaders.

### The offline tools [read]
- gltf-transform CLI, https://gltf-transform.dev/cli : `etc1s` / `uastc` "KTX + Basis ... texture compression";
  `meshopt`; `instance` "Create GPU instances from shared mesh references"; `join` "Join meshes and reduce draw calls";
  `palette` "Creates palette textures and merges materials". `palette`,
  https://gltf-transform.dev/modules/functions/functions/palette : uses "a material's base color, alpha, emissive
  factor, metallic factor, and roughness factor"; it "can reduce the number of materials used" and makes more meshes
  "eligible for join operations". An offline Node tool, like ffmpeg in tools/make-voice.mjs. Not installed.
- KTX Artist Guide (Khronos), https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXArtistGuide.md :
  "ETC1S offers greater compression and works better with large areas of solid colors"; "UASTC offers higher visual
  quality for high-contrast high-detail color textures"; one example "saves about 82% in GPU memory".

### Our code today [code]
- Scenes are HTML strings of primitives: about 150 `<a-...>` tags; the corridor is generated from its plan
  (src/app/lobby/plan.js), and tests/masonry.test.mjs, standards.test.mjs and plaque.test.mjs check it against trade
  standards through that plan. Surfaces are 512 px canvases drawn in code, one per kind (block, linoleum, ceiling,
  cork, lens, wood: src/engine/surface.js). merge-static merges opaque parts per "look" (`look()`: colour, roughness,
  metalness, emissive, map, side, env map, polygon offset): **one draw call per colour**.
- Lights: corridor and room 01 are one scene (docs/decisions.md, "One page and one scene"); it holds 2 ambient and
  **4 point lights** (`signLight`, `corridorLamp`, the room's lamp, `obsLight`); off ones are set to `intensity: 0`
  (src/app/lobby/lobby.js, src/rooms/01-control/room.js line 111), so all four are shaded on every lit material.
  Materials are A-Frame's default PBR (`standard`). No real-time shadows: soft shadows are textured quads
  (src/engine/blob-shadow.js).
- Text: each panel is its own canvas on `MeshBasicMaterial({ map: this.tex, transparent: true })` (src/engine/panel.js),
  even on an opaque plate, so merge-static skips it: nine corridor door signs (scene.js, line 69) plus room 101's, two
  notices, the light box and the extinguisher's label are a draw call each, sorted back to front. Inter ships as woff2.
- The extinguisher (about 30 primitives, src/app/lobby/extinguisher.js) stays out of the merge (`data-dynamic`): "a
  dozen more draw calls" (docs/decisions.md).
- Audio (ffprobe, 10 Oct): MP3 44.1 kHz 128 kbps everywhere; the voice mono, all effects **stereo**. The voice is evened
  to -18 LUFS, -1.5 dBTP (tools/make-voice.mjs); effects get no loudness step (tools/make-sounds.mjs). Effects go
  through an HRTF `PannerNode` (src/engine/sfx.js); the voice goes straight to the output (src/engine/voice.js,
  `src.connect(ctx.destination)`): head-locked.

### Text options [read]
- A-Frame `text` (1.7.1), https://raw.githubusercontent.com/aframevr/aframe/v1.7.1/docs/components/text.md : "MSDF
  helps to preserve sharp corners and edges"; "To use non-ascii characters, you need to create your own custom font";
  "Tools for MSDF fonts may be less mature".
- troika-three-text (npm 0.52.5, 2026-07-24), README https://github.com/protectwise/troika/tree/main/packages/troika-three-text :
  "All font parsing, SDF generation, and glyph layout is performed in a web worker"; ".woff2 is _not_ supported".
  [code] its BatchedText source (https://github.com/protectwise/troika/blob/main/packages/troika-three-text/src/BatchedText.js):
  "@experimental"; batches texts "to render in a single draw call".
- aframe-troika-text 0.14.0 (2025-04-14, peer aframe "1.1.x - 1.7.x"), https://github.com/lojjic/aframe-troika-text :
  "similar performance and quality to A-Frame's built-in SDF `text` component"; loads by a plain script tag.
- Meta "WebXR Layers" (undated), https://developers.meta.com/horizon/documentation/web/webxr-layers/ : "Higher quality
  rendering of imagery and text"; "you can avoid double sampling and distortions". Setting both `baseLayer` and
  `layers` throws (docs/research/vr/02-standards.md), so this needs A-Frame's projection-layer path.
- Size: our smallest letter is 24 mm at 1 m, 1.375 deg (docs/decisions.md, "large-print document"); Quest 2 has
  20.6 pixels a degree (docs/research/vr/03c-viewing-text.md), so that letter spans about 28 display pixels
  [estimate: 1.375 x 20.6]; the clipboard canvas is drawn at 1432 px a metre for Quest 3's 25 (sheet-math), denser
  than either display.

### Audio sources [read]
- Meta "Immersive sound" (2026-03-11), https://developers.meta.com/horizon/design/immersive_sound/ : "most sounds should
  be authored as monophonic (single channel) sources"; head-locked stereo "should generally be avoided when possible";
  "a doubling of distance is a halving of intensity"; "Controlling the amount of reverb per sound is a critical
  component to creating the perception of distance."
- WebKit bug 228215 (2021), https://bugs.webkit.org/show_bug.cgi?id=228215 : "Chrome and Firefox properly parse those
  MP3 which results in a continuous audio stream when looping". Quest Browser is Chromium-based [unverified on Quest].
- Game loudness: Sony's ASWG-R001 (-24 LUFS console, -18 portable) is known to me only second-hand (the Audiokinetic page
  did not render): **unverified**. https://www.gamedeveloper.com/audio/standardizing-loudness-in-virtual-reality (2016)
  proposes no VR number.

### Assets and licences [read]
- `metavr asset search "fire extinguisher" --count 3 --json` [run]: three models ("fire extinguisher", "compact
  canister", "A scuba tank"), fields only `id, name, image_url, fbx_url, glb_url`: no licence, author or source.
  Meta's Asset Library page, https://developers.meta.com/horizon/documentation/unity/unity-asset-library-overview/ :
  "a collection of 3D models generated by AI"; "All assets are free to use". Meta's SDK licence,
  https://developers.meta.com/horizon/licenses/ , lets materials "made available for incorporation" be distributed
  "as part of your Application"; the library is not named there. Use in a public web game: **unverified**.
- Meta "Sourcing art assets", https://developers.meta.com/horizon/design/art-sourcing-assets/ : "Ensure assets are
  properly licensed"; AI assets "may suffer from issues like unoptimized geometry, poor UV mapping".
- Poly Haven, https://polyhaven.com/license : "Our assets are all licensed as CC0"; "You do not need to give credit".
  ambientCG, https://docs.ambientcg.com/license/ : "Creative Commons CC0 1.0 Universal". Smithsonian Open Access FAQ
  (browser pane), https://www.si.edu/openaccess/faq : "2D and 3D images and data" carry "a CC0 designation"; "CC0 only
  applies to copyright" (trade marks may still bind).
- Fab (Epic; Megascans now there), https://www.fab.com/eula (browser pane): usage "not limited to Unreal Engine";
  "You may not: Resell or redistribute the asset for free on a standalone basis or allow others to do the same". Our
  reading [unverified, legal]: a web game serves every model and texture as a public file anyone can save.
- docs/art/credits.md today: one table (what, where used, source and licence), two rows, both public domain.

## Answers, part by part

**1. Authoring.** Now: primitives in code, merged per colour; corridor generated from the plan and tested
against standards. What Meta and shipped titles do: Blender, glTF, KTX2, merging and instancing (Flowerbed,
Needle, A-Frame's own page). Best for us [estimate, my judgement from the sources]: a **hybrid**. The building
(walls, openings, doors, signs, rails, floor and ceiling grids, troffers) stays generated from the plan: it is one
kit repeated over 90 rooms, and the standards tests read it. Period props (extinguisher, chairs, tables, apparatus,
typewriters) become glTF models made in Blender from dated photos, one texture atlas per prop, KTX2 (ETC1S for
colour, UASTC for detail) and meshopt via gltf-transform, served as static files. Instancing (`BatchedMesh` or
`EXT_mesh_gpu_instancing`) only where one prop repeats in view (a room of chairs); merging already covers static
repeats. Verdict: **change** (props) and **add** (the offline tool chain). What moves now: the extinguisher (114 lines)
and room 01's furniture and equipment, roughly a quarter of the scene code [estimate]; the plan-built corridor stays.
Cost after five rooms: five rooms of props rebuilt, and every approved shot in docs/rooms/ judged again.

**2. Lighting.** Now: 4 point lights and 2 ambient in one scene on PBR materials, off lights at intensity 0.
Meta: one point light with PBR; "Bake lighting whenever possible". Best: lightmaps baked from the real lamp
positions (troffers, the room's lamp), on cheap unlit or basic materials, with the scene's events (the corridor
dimming, the room's lights coming up, the observation light) as a second baked state or one live light. This fits
"no light from nowhere ... fixed once for the whole corridor" (docs/owner-decisions.md) and answers the corridor's
pending light item. Verdict: **change**. Now: one bake pipeline for a corridor and a room; after five rooms: five
rooms relit and re-approved. Free first step: fewer always-present lights (a change of count recompiles shaders,
so lights are moved or kept, not toggled).

**3. Text.** Now: canvas per panel, transparent, one call each. MSDF/troika gives edges sharp at any zoom, but still
one call per text (troika's batching is experimental), A-Frame `text` needs a hand-made Cyrillic atlas, troika
cannot read our woff2, and neither draws what the paper carries (ink, the seal, pictures, tick boxes).
Verdict: **keep** canvas for paper; **change** signs and plates: all door signs on one shared canvas atlas, opaque,
merged into one mesh (about 10 calls to 1-2 [estimate]); **add later, if the headset shows blur**: a WebXR quad
layer for the clipboard (Meta: no double sampling). Cost is the same now or later; the atlas is cheaper before 90
doors exist.

**4. Draw calls under 50 a view, by payoff** (Meta's order: measure, merge, instance/multiview, state changes):
0. Measure first: list the worst view's calls by material in tests/draw-calls.mjs, and learn CPU- or GPU-bound in the
   headset (engine-and-tools.md). Free; it decides the order below.
1. Merge across colours: merge-static writes each part's colour into the mesh (vertex colours or a palette
   texture, as gltf-transform `palette` does) and groups only by roughness, metalness and map. Saves "colours minus
   groups" per place [estimate: the largest single cut; unmeasured].
2. One atlas for door signs and plates, opaque (about 8-10 calls in the corridor's long view [estimate]).
3. The extinguisher merged after its reflection is taken (a dozen to 2-3 [estimate]).
4. Blob shadows and decals into the bake once lighting is baked (each is a transparent call now).
5. The room's 97: the corridor seen through the open door. Split the corridor's merge into segments that frustum
   culling can drop (Meta: "Break apart large models"), or a doorway portal [estimate: size unknown].
6. Multiview (engine-and-tools.md, option c): halves CPU submission; decided by the measurement in step 0.

**5. Assets.** Now: built by hand from photos and standards; credits.md for two images. Best: the provenance
rule below. Meta's AI library is out for now: no licence for the web found, and an AI "fire extinguisher" is not a
1972 General WS-900 (our "recreate from what exists" rule). Photogrammetry fits objects the owner can photograph;
which tool: not researched. Verdict: **keep** the rule, **add** CC0 libraries and a fuller credits table.
Proposed rule for docs/art/credits.md: every model, texture and sound has a row (file, where used, source URL,
licence, author, date, the photo or catalogue it was shaped after); allowed: public domain, CC0, our own photos
and scans, our own models; CC-BY only with a credit line in the game; nothing whose licence forbids standalone
redistribution (the game's files are public); nothing without a row (a test can check every file in vendor/ and
the rooms' asset folders has one).

**6. Audio.** Now: MP3, HRTF effects, head-locked voice, loudness for voice only. Best: keep MP3 (Chromium loops it
cleanly); effects to mono at generation (Meta); one loudness step for effects in tools/make-sounds.mjs with a level
per sound in each sound-list.js, so the mix holds across 90 rooms; reverb per room as a distance cue later.
Verdict: **change** (mono, loudness), **decide** (where the voice comes from). Cost: minutes now; after five
rooms, every room's sounds re-made and re-heard.

## Decisions for the owner (real options; pictures or sound where taste decides)

1. The tool chain on the laptop (a machine change, his word): Blender (free) and gltf-transform with
   KTX-Software for the bake and the props. Without it the light stays real-time and props stay primitives.
2. The look of baked light, three pictures of the same corridor view: (a) as now, real-time; (b) baked from the
   troffers, neutral; (c) baked with deeper corners and pools of light under each troffer. Made after decision 1.
3. Who makes period props: (a) the assistant, scripting Blender from dated photos (free; quality unproven);
   (b) a paid 3D artist per prop (cost unknown); (c) CC0 models (Poly Haven, Smithsonian) where a period match
   exists, else (a). Shown as one prop, the extinguisher, made by each way that can be tried.
4. The experimenter's voice: (a) in the head, as now; (b) from a place, an intercom speaker on the wall
   or the experimenter's spot (Meta: avoid head-locked). Two short recordings to hear in the headset.

## What to do first (no taste involved; each measured with tests/draw-calls.mjs)

1. Step 0 of part 4: the per-material list of the worst views, and the CPU/GPU measurement in the headset.
2. Merge across colours in merge-static; the door-sign atlas; the extinguisher merged after its reflection.
3. The always-present lights cut to what each place needs; the clear colour black (engine-and-tools.md).
4. Effects re-made mono and evened; the provenance rule written into docs/art/credits.md with its test.
5. Then decisions 1-4 with the owner, before room 02 is built.

## Unverified and not reached

- Draw-call savings above are estimates until step 0 lists calls by material.
- `WEBGL_multi_draw` in Quest Browser; MP3 loop behaviour on the Quest itself.
- Meta's Asset Library licence for a web game; Sony ASWG-R001 numbers (secondary only).
- Not researched: photogrammetry tools, in-browser baking without Blender, Blender's size on disk,
  the GPU cost of our four point lights (needs the headset), troika's quality against our canvas at 1 m.

## The Flowerbed case study read in full (the owner brought it, 10.10)
https://developers.meta.com/horizon/blog/project-flowerbed-a-webxr-case-study/ , four points the sections above lack:
- Text panels: Meta tried canvas textures and copied HTML for its UI and both "suffered from blurry panels due to how
  pixel sampling in VR works"; it built every panel as 3D objects with three-mesh-ui instead. Our clipboard and signs are
  canvas textures, so their sharpness in the headset is a check, not an assumption (with the quad layer of part 3).
- Static objects: "we turn off Three's DefaultMatrixAutoUpdate ... so nothing updates by default", then update by hand
  what moves: a CPU saving for a scene that is mostly still, as ours is.
- Transparency: plants authored "fully opaque" rendered faster than fewer polygons with blended alpha ("the cost of
  additional polygons is generally easier to deal with than the blended overdraw"); our door plaques are transparent.
- Frame rate and tools: "Project Flowerbed's target framerate is 72 frames per second" via updateTargetFrameRate; the
  OVR Metrics overlay "almost the entire time", remote Chrome DevTools for CPU, the RenderDoc Meta fork for GPU, and
  Spector.js with the immersive web emulator to count WebGL calls on a desktop. Multiview came from Meta's own three.js
  fork (its pull request to three.js, 24048), as part 1 found.
Flowerbed itself lit with real-time PBR lights and a static shadow map; Meta's later guidance (part 2) is to bake.
