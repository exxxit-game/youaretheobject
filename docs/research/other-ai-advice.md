# Two other AIs' advice on A-Frame 1.8.0 on Quest, checked (11.10.2026)

The owner brought two answers of other AIs (the stack, the libraries, the tools) and asked whether they
are of use. Each claim was checked against A-Frame 1.8.0's own docs (the local copy) and the build the
game runs, against each library's npm and GitHub pages, and against our code. The verdicts for the
owner are on the revision's inventory page (objekt-files/notes/archive/docs/audit/revision.md, shelf 5); the evidence is below,
in two reports. What the owner then asked for, practitioners' forums in every language, is in
docs/research/forums-aframe-quest.md.

Verdicts in short:
- Already ours: Meta's emulator runtime IWER (the VR run on GitHub), the Meta VR CLI, remote DevTools
  over USB (tools/headset.mjs), draw calls counted (renderer.info in the headset, tests/draw-calls.mjs on
  GitHub), a budget stricter than A-Frame's 300 (Meta's 100 for Quest 2).
- Wrong or stale in the advice: `stats` in 1.8.0 shows only FPS and CPU; pcfsoft falls back to pcf with a
  warning; transmission's slowdown was fixed in r164; A-Frame's text is itself SDF/MSDF; hand events are
  `pinchstarted`/`pinchended`; KTX2's setting is `basisTranscoderPath`; an import map with three@0.160
  loads three twice; Rapier is not supported by the A-Frame physics system.
- For the engine shelf of the revision: our merge against aframe-geometry-merger-component and three's
  merge; texture compression (glTF-Transform 4.5.1, KTX-Software's toktx, not on the laptop yet); the new
  objects 4 of the 13 tick handlers make in their body (lightbox, ink and controller-batch each frame, grab-press
  once a second); text sharpness on canvas panels; hands with the built-in
  hand-tracking-controls; our hand press against super-hands.
- Not taken: maige-3d-mcp (one 0.1.0 release, drives its own pages, needs an AI key), LMQL and DSPy
  (Python LLM tools), teleport, particle, environment and extras components (written for older A-Frame),
  the inspector's save (needs aframe-watcher; our scene is code).

---

# A-Frame 1.8.0 claims checked against the engine's own sources (11.10.2026)

Sources:
- DOCS = C:\Users\admin\Documents\objekt-files\docs-engine\aframe-1.8.0 (CHANGELOG.md, package.json, webpack configs, docs/)
- BUILD = C:\Users\admin\Documents\GitHub\objekt\.claude\worktrees\continuation-e2af23\vendor\aframe-1.8.0.min.js
  (one line, 1,323,381 bytes; places are given as character offsets `@N`, read with node `s.slice()`)
- Online only where the local copy is silent (named in each item).

Verdicts: CONFIRMED / CONTRADICTED / UNPROVEN. Mixed claims are split into their parts.

---

## 1. "pcfsoft was removed in 1.8.0; use pcf; leaving pcfsoft may break shadows"

- Removed, use pcf: **CONFIRMED.**
  - DOCS CHANGELOG.md:14 — "Remove pcfsoft shadow type in shadow component, deprecated in THREE r182+ fallback to pcf (#5798)"
  - DOCS CHANGELOG.md:55 — "If you used `shadow="type: pcfsoft"`, change it to `shadow="type: pcf"`. From three.js migration guide for r182: PCFSoftShadowMap with WebGLRenderer is now deprecated. Use PCFShadowMap which is now soft as well."
  - DOCS docs/components/shadow.md:50 — "Shadow type. One of `pcf`, `basic`." default `pcf`.
  - BUILD @1314595 — `var sI={basic:kt,pcf:Qt};XC("shadow",{schema:{...type:{default:"pcf",oneOf:["basic","pcf"]}}`
- "May break shadows": **CONTRADICTED.** The code falls back to pcf with a console warning; shadows still render.
  - BUILD @1314785 — `void 0===sI[n]&&(console.warn('shadow type "'+n+'" is not supported, falling back to "pcf". To remove this warning set <a-scene shadow="type: pcf">.'),n="pcf")`
  - three itself does the same: BUILD @765461 — `this.type===Gt&&(kr("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Qt)`
  - `oneOf` is not enforced at parse time: the build never reads `.oneOf` (all 3 non-literal hits are schema definitions, e.g. @1101618, @1169490, @1207798), so `pcfsoft` reaches the fallback above.
  - Effect of leaving it: one warning in the console, nothing else.

## 2. "A-Frame 1.8.0 is built on three.js r184"

**CONFIRMED** (precisely: supermedium's fork `super-three` 0.184.0).
- DOCS CHANGELOG.md:1 "### 1.8.0 (June 23, 2026)", :5 "- Update THREE to r184 (@vincentfretin, @mrxz, @dmarcos)"
- DOCS package.json:53 — `"three": "npm:super-three@0.184.0",`
- BUILD @135948 — `const Rt=Tt,Lt="184",` and @112524 `REVISION:()=>Lt` (three's REVISION export = "184")
- BUILD @1322637 — `console.log("A-Frame Version: 1.8.0 (Date 2026-06-23, Commit #47a08f1c)"),console.log("THREE Version (https://github.com/supermedium/three.js):",FE.REVISION)`

## 3. "Materials with transmission became very slow on Quest after three.js r160"

**CONFIRMED for r160–r163, fixed in r164; stale as a statement about our r184.** Not in the local docs (no "transmission" in docs/); found online:
- three.js issue #28073 (opened 2024-04-05, closed 2024-04-09), "Possible performance degradation in VR with r160 when using certain materials" (https://github.com/mrdoob/three.js/issues/28073). Reporter, using A-Frame on Quest 2 (Wolvic and the Quest browser, also Quest 3): "All versions of A-Frame using three.js >= r160 display this behavior". Maintainer mrxz: "The glass material is using transmission, meaning a transmission pass is rendered (once per eye)". The cause was the r159 change #26905 that made the transmission render target take the WebXR framebuffer size, and it ended up "twice the needed width".
- Fixes: PR #28088 "WebGLRenderer: Let transmissionRenderTarget size match relevant viewport size" (merged 2024-04-09, milestone r164) and PR #28097 "WebGLRenderer: Prerender transmission pass(es)" (merged 2024-04-11, milestone r164), which closed #22594 "Transmissive objects cause inefficient rendering on VR headsets". Read with `gh issue view` / `gh pr view` (read only).
- The fix is in our build. BUILD @855616: `s.setSize(a.z*M.transmissionResolutionScale,a.w*M.transmissionResolutionScale)` (sized to the viewport), and @839100 `this.transmissionResolutionScale=1` (the scale knob asked for in three.js issue #30017, closed completed 2024-12-09).
- Still true in r184: transmission adds an extra render pass per eye (mrxz above). Still OPEN: #28131 "DoubleSided transmission unsupported with `WEBGL_multisampled_render_to_texture` (Oculus Browser)" (r163, 2024-04-13). That one is about correctness (the back side is not drawn), not speed.
- A-Frame's own tracker: `gh search issues transmission --repo aframevr/aframe` finds no performance issue (only #5514, #4919, #4357, none about speed).

## 4. "`<a-scene stats>` shows FPS, draw calls, geometries and vertices"

**CONTRADICTED by the 1.8.0 code; the 1.8.0 doc page is stale and still says yes.**
- DOCS docs/components/stats.md:22-33 (and the same text at https://aframe.io/docs/1.8.0/components/stats.html, opened) lists: "fps … Aim for stable 90 fps with the WebVR 1.0 API", raf, Textures, Programs, Geometries, Vertices, Faces, "**Calls**: number of draw calls on each frame.", Load Time, Entities. These are the old rStats panels.
- DOCS CHANGELOG.md:36 — "Replace `rStats` with `stats-gl` in stats component (fix #5397) (#5700)".
- BUILD @1282295 — `QC("stats",{schema:{default:!0},sceneOnly:!0,init:function(){this.stats=new BS,this.stats.init(this.el.renderer),document.body.append(this.stats.dom)}…` The constructor gets no options.
- stats-gl defaults, BUILD @1272347: `constructor({trackGPU:e=!1,trackCPT:n=!1,trackHz:i=!1,logsPerSecond:r=4,…})`. Panels built, @1274118: `new t.Panel("FPS",…)`, `new t.Panel("CPU",…)`. GPU, CPT and Hz panels appear only when their flags are true. No panel reads `renderer.info.render.calls`, geometries or vertices: the only `info` reads in that class are WebGPU timestamps (@1276900).
- So in 1.8.0 `<a-scene stats>` shows **FPS and CPU (ms)** only. Draw calls and geometries have to be read from `renderer.info` yourself.

## 5. "Target: 300 draw calls maximum and a stable 72–90 FPS" (only: does A-Frame give a number?)

**CONFIRMED that A-Frame's docs give both numbers** (Meta's own numbers are checked elsewhere).
- DOCS docs/introduction/best-practices.md:82-84 — "Limit draw calls as much as possible. Each geometry, object, model without optimization is generally a draw call. Rule of thumb, try to keep under 300 maximum."
- FPS: docs/components/stats.md:22 — "Aim for stable 90 fps with the WebVR 1.0 API." (wording from the WebVR era); best-practices.md:247 — "they will be run 90 times per second".
- 72/90: docs/components/renderer.md:76 (highRefreshRate table): "Device supports 90Hz refresh rate (e.g. Quest 2, Quest Pro) | 72 Hz | 90 Hz" (default | high).
- The "300" is A-Frame's "rule of thumb", with no source given for it.

## 6. "geometry-merger merges static objects into one geometry": core or separate?

**Separate community component, not in A-Frame 1.8.0 core.**
- DOCS docs/introduction/best-practices.md:71 — `[geometrymerger]: https://www.npmjs.com/package/aframe-geometry-merger-component`; :84-86 "[Merge] together all static meshes if possible. You can use [geometry-merger] and then make use a three.js material with vertex colors enabled."
- BUILD: 0 occurrences of "geometry-merger".
- npm registry (registry.npmjs.org/aframe-geometry-merger-component, read with curl): "An A-Frame component to merge geometries to reduce draw calls.", latest 2.0.1, last modified 2023-05-17, repo github.com/supermedium/superframe. It has not been checked against 1.8.0 / r184.

## 7. "Standard `<a-text>` is terrible for performance and quality; Troika-three-text with SDF is better"

**CONTRADICTED as framed (A-Frame's text is itself SDF/MSDF); "Troika is better": UNPROVEN** (A-Frame's docs never mention Troika).
- DOCS docs/components/text.md:13 — "The text component renders signed distance field (SDF) font text."
- text.md:33-35 — "As a default, we've selected SDF-based text to be included as a core component due to its **relatively good performance and clarity**. This component uses [mattdesl's `three-bmfont-text` library]".
- text.md:114-115 — "The text component defaults to `roboto` which uses a multi-channel signed distance (MSDF) font. MSDF helps to preserve sharp corners and edges."
- BUILD @1208921 — a roboto font or a `-msdf.` file switches the shader to `"msdf"`. @1207037: `roboto:FM+"Roboto-msdf.json"`. Fonts load from cdn.aframe.io unless A-Frame's CDN root setting (on window) is overridden.
- What the doc admits as limits (text.md:283, :286): it is bitmap-based ("Unicode this is not"), and "The generated text is not suitable for raycaster intersection testing." The docs make no claim about draw calls per text entity either way.

## 8. "Inspector opens with Ctrl+Alt+I in the headset's browser; it can save changes into the HTML"

- Ctrl+Alt+I opens it: **CONFIRMED.** Headset browser: **UNPROVEN** (the docs say nothing about a headset).
  - DOCS docs/introduction/visual-inspector-and-dev-tools.md:48-50 — "press the **`<ctrl> + <alt> + i`** shortcut on our keyboard. This will fetch the Inspector code via CDN and open up our scene in the Inspector."
  - BUILD @1253650 — `"https://unpkg.com/aframe-inspector@"+…(G_)+"/dist/aframe-inspector.min.js"` (version 1.8.x from unpkg). Key handler: `73===t.keyCode&&(t.ctrlKey&&t.altKey||t.getModifierState("AltGraph"))&&this.openInspector()`. It also opens from a URL parameter `inspector` (`Nx("inspector")` in `play`).
  - It needs a physical keyboard keydown, a network fetch from unpkg, and a 2D mouse UI. The viewport controls are mouse-only: visual-inspector-and-dev-tools.md:79-81 "hold down left mouse button … right mouse button … scroll".
- Saving into the HTML: **CONTRADICTED for the Inspector alone.** The docs offer export and copy only; writing to files needs a separate server.
  - visual-inspector-and-dev-tools.md:64-65 — "select, search, delete, clone, and add entities* or exporting HTML."; :103-105 — "We can copy the HTML output of individual components. … syncing it back to source code."
  - Online, github.com/aframevr/aframe-inspector README: "A-Frame Watcher - Companion server to sync changes to HTML files."
  - github.com/supermedium/aframe-watcher README: "Companion server to the A-Frame Inspector to sync changes back to HTML files"; `npm install -g aframe-watcher`. It handles only entities that have IDs.

## 9. "hand-tracking-controls is built into A-Frame 1.8; it emits pinchstart and pinchend"

- Built in: **CONFIRMED.** DOCS docs/components/hand-tracking-controls.md:6 `source_code: src/components/hand-tracking-controls.js`; BUILD @1107564 `QC("hand-tracking-controls"`.
- Event names: **CONTRADICTED.** On the entity they are `pinchstarted`, `pinchended`, `pinchmoved`.
  - hand-tracking-controls.md:34-36 — "pinchstarted | The pinch gesture has started. World coordinates passed as event detail." / "pinchended | The pinch gesture has ended." / "pinchmoved | The hand moved while making the pinch gesture."
  - BUILD @1112689/@1112813/@1112905 — `this.el.emit("pinchstarted",i)`, `this.el.emit("pinchended",i)`, `this.el.emit("pinchmoved",i)`.
  - `pinchstart`/`pinchend` exist only inside three.js, dispatched on three's internal hand Group (BUILD @206151, `this.dispatchEvent({type:"pinchend",handedness:…})`). An `el.addEventListener('pinchstart')` on an A-Frame entity never fires.

## 10. "Never create new THREE.Vector3 etc. inside tick; pool objects"

**CONFIRMED** (A-Frame's own docs say it).
- DOCS docs/introduction/best-practices.md:201-206 — "In component tick handlers, be frugal on creating new objects. Try to reuse objects. … Below we create a helper vector and quaternion and reuse them between frames, rather than creating new ones on each frame." Example at :214-222 builds `var helperVector = new THREE.Vector3();` once, in a closure.
- best-practices.md:156-157 — "Avoid creating garbage and instantiating new JavaScript objects, arrays, strings, and functions as much as possible."; :189-190 "All of the suggestions above are _especially_ important in `tick()` handlers".
- "Pool": the docs' word for entities is the `pool` component (best-practices.md:112-114, "use the **[pool component]** to pre-generate and reuse entities"). For vectors the docs say "reuse", and the shape they show is a closure, not a pool. The docs also warn (:204-205) that "these variables do not hold state because they will be shared between all instances".

## 11. "aframe-extras has animation-mixer and a GLTF loader with DRACO/KTX2"; "in 1.8 KTX2 goes through THREE.KTX2Loader with decoderPath"

- animation-mixer in aframe-extras: **CONFIRMED.** DOCS docs/components/gltf-model.md:111 — "you can use the [animation-mixer] component from [aframe-extras]".
- aframe-extras' glTF loader with DRACO/KTX2: **CONTRADICTED.** Draco, KTX2 and Meshopt are handled by A-Frame's core `gltf-model`. aframe-extras only has `gltf-model-legacy`, for old glTF 1.0 (gltf-model.md:27-28 "For models using older versions of the glTF format, use `gltf-model-legacy` from [aframe-extras]"). The aframe-extras loaders README (github.com/c-frame/aframe-extras/tree/master/src/loaders, opened) does not mention Draco, KTX2, Basis or Meshopt.
- KTX2 through THREE.KTX2Loader: **CONFIRMED** in mechanism. Property name "decoderPath": **CONTRADICTED.** The property is **`basisTranscoderPath`**, set on `<a-scene gltf-model="…">`.
  - gltf-model.md:145-159 — "When using glTF models compressed with Draco, KTX2 or Meshopt, you must configure the path to the necessary decoders: `<a-scene gltf-model="dracoDecoderPath: path/to/decoder/; basisTranscoderPath: path/to/transcoder/; meshoptDecoderPath: path/to/meshopt_decoder.cjs;">`". Defaults: dracoDecoderPath 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/', basisTranscoderPath '', meshoptDecoderPath ''.
  - gltf-model.md:173-176 — basisTranscoderPath folder holds `basis_transcoder.js` and `basis_transcoder.wasm`.
  - BUILD @1305819/@1305979 — `XC("gltf-model",{schema:{dracoDecoderPath:{default:"https://www.gstatic.com/draco/versioned/decoders/1.5.7/"},basisTranscoderPath:{default:""},meshoptDecoderPath:{default:""}}` … `this.ktx2Loader=new Ky,this.ktx2Loader.setTranscoderPath(e).detectSupport(this.el.renderer)` (e = basisTranscoderPath); Draco: `this.dracoLoader.setDecoderPath(t)`. (`setDecoderPath` is the DRACOLoader method, not a KTX2 one.)
  - Note: KTX2 is off until basisTranscoderPath is set (the default is empty). three throws "THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures" (BUILD @904741) for a model that requires it.

## 12. Import map: `"aframe": "https://unpkg.com/aframe@1.8.0/dist/aframe-master.min.js"` with `"three": "https://unpkg.com/three@0.160.0/build/three.module.js"`

**CONTRADICTED** on both entries.
- `aframe-master.min.js` is the classic UMD bundle with three **inside it**: DOCS webpack.prod.config.cjs:12-15 (`libraryTarget: 'umd'`, `filename: 'aframe-master.min.js'`, no `externals`). Our copy of that build contains three r184 (claim 2). A separate "three" entry next to it gives a second three instance.
- The bundle without three is the **module** build: DOCS webpack.module.config.cjs:10 `filename: 'aframe-master.module.min.js'` and :15-18 `externalsType: 'module', externals: { three: 'three' }`; package.json:7 `"module": "./dist/aframe-master.module.min.js"`.
- DOCS docs/introduction/faq.md (section "Can I load A-Frame as an ES module?", lines 399-411): "Since version 1.8.0, A-Frame ships an ES module bundle without the three dependency. … Make sure the three and A-Frame versions are compatible. See browser console (or package.json) to see what THREE version A-Frame ships with by default." The doc's own map:
  `"aframe": "https://aframe.io/releases/1.8.0/aframe.module.min.js"`, `"three": "https://cdn.jsdelivr.net/npm/super-three@0.184.0/build/three.module.js"`, `"three/addons/": "https://cdn.jsdelivr.net/npm/super-three@0.184.0/examples/jsm/"`.
- three@0.160.0 is 24 revisions behind the r184 that 1.8.0 is built for (package.json:53). It is also stock three, not supermedium's super-three fork. The 1.8.0 code calls APIs added after r160 (CHANGELOG.md:13 Timer for "THREE r183+"; :14 the shadow change for r182+).
- The installation page offers only the classic script: docs/introduction/installation.md:75 `<script src="https://aframe.io/releases/1.8.0/aframe.min.js"></script>` and :154 `https://cdn.jsdelivr.net/npm/aframe@1.8.0/dist/aframe-master.min.js`. Import maps are covered in the FAQ only.

---

## Side finding (not a claim)
The 1.8.0 stats doc (local copy and aframe.io/docs/1.8.0) still describes rStats metrics that the 1.8.0 code no longer shows (item 4). Anyone using our docs copy to read draw calls has to read `renderer.info` instead.

---

# Library claims from two AI chat answers, checked against the registry and GitHub

Checked 2026-10-11 (UTC), read only: `npm view` / `npm search` (registry), `api.npmjs.org` (downloads),
`gh api` (GitHub repos, commits, releases, file contents), `pypi.org/pypi/<pkg>/json`. Nothing installed or run.
Reference point: `aframe` 1.8.0 was published to npm on 2026-06-23 (npm search output), so a release older than
that date cannot have been tested on 1.8.0.

"Last commit" = newest commit on the default branch (`gh api repos/<r>/commits?per_page=1`), which can be older
than GitHub's `pushed_at` (pushes to other branches count there).

## Table

| # | Item as named | Real name (npm) / repo | Latest version, date | Archived / deprecated | Last commit | A-Frame version it states | Licence | Claims A-Frame 1.8.0? |
|---|---|---|---|---|---|---|---|---|
| 1 | maige-3d-mcp | npm `maige-3d-mcp`; package points to github.com/m-ai-geXR/maigeXR, which is **404**; source found at github.com/m-ai-geXR/mcp-webgpu | 0.1.0, 2026-04-03 (only version) | no / no | 2026-04-05 (mcp-webgpu) | A-Frame client: package.json `aframe ^1.6.0`; its index.html loads `aframe.io/releases/1.7.0` | MIT | **no** (not stated; uses 1.7.0) |
| 2 | superframe (ngokevin) | github.com/supermedium/superframe (ngokevin/kframe redirects there); npm `superframe` is a 2017 placeholder 0.0.0-alpha, UNLICENSED | components published one by one | no / no | 2026-05-29 | per component | MIT (repo) | not stated |
| 2a | geometry-merger | npm `aframe-geometry-merger-component`, in superframe `components/geometry-merger` | 2.0.1, 2023-05-17 | no / no | folder last changed 2023-05-17 | devDep `aframe: "*"`; README example 1.4.1 | MIT | not stated |
| 3 | fern-aframe-components | not on npm (E404); github.com/mrxz/fern-aframe-components, packages `@fern-solutions/*` | extra-stats: `@fern-solutions/aframe-extra-stats` 1.0.2, 2022-09-05 | no / no | 2026-05-21 (yarn update) | no peerDependency; extra-stats example loads 1.5.0 | each package MIT on npm; repo has no root licence (GitHub API: null) | not stated |
| 4 | hand-tracking-controls-extras | not on npm (E404 for both names); github.com/gftruj/aframe-hand-tracking-controls-extras (package.json 0.9.0, unpublished) | none on npm | no / - | 2023-09-29 | examples load an A-Frame master build pinned by commit hash | MIT | not stated |
| 5 | aframe-super-hands | `aframe-super-hands` is E404; real: npm `super-hands`, github.com/c-frame/aframe-super-hands-component | 3.0.6, 2025-10-30 | no / no | 2025-10-30 | no peerDependency; devDep `aframe ^1.7.1`; README table up to A-Frame ^1.4.0; workaround for 1.5.0+ | MIT | not stated |
| 6 | aframe-physics-system | `aframe-physics-system` 4.0.2 (2023-01-12) from n5ro repo, **archived**; maintained fork `@c-frame/aframe-physics-system`, github.com/c-frame/aframe-physics-system | fork 4.2.4, 2025-11-13 | n5ro archived; fork no / no | 2025-11-13 | peer `aframe >=0.5.0`; devDep `aframe ~1.1.0` | MIT | not stated (open range only) |
| 6a | driver cannon-es | npm `cannon-es`, github.com/pmndrs/cannon-es | 0.20.0, 2022-08-12 (fork bundles `^0.9.1`) | no / no | 2024-01-06 | - | MIT | - |
| 6b | driver Ammo.js | github.com/kripken/ammo.js (npm `ammo.js` 0.0.10 is from 2016) | - | no / no | 2026-09-22 | "not a dependency", you include it yourself | GitHub: NOASSERTION | - |
| 6c | Rapier | 0 mentions in the fork's README, code search empty; no A-Frame Rapier package in `npm search "aframe rapier"` | - | - | - | - | - | **not supported** |
| 7 | aframe-extras | npm `aframe-extras`, github.com/c-frame/aframe-extras | 7.7.0, 2026-04-01 | no / no | 2026-06-24 "update examples to aframe 1.8.0 (#466)" (after 7.7.0, unreleased) | README table: A-Frame v1.7.x -> extras v7.x.x | MIT | **not in a release**; master examples moved to 1.8.0 |
| 8a | aframe-teleport-controls | npm same, github.com/fernandojsg/aframe-teleport-controls | 0.3.1, 2017-10-31 | no / no | 2020-02-11 | devDep `^0.7.0`; README 0.7.1 | MIT | no |
| 8b | aframe-blink-controls | npm same, github.com/jure/aframe-blink-controls | 0.4.3, 2022-12-02 | no / no | 2026-02-23 (2026 fixes not on npm) | devDep `^1.3.0`; README 1.3.0 | MIT | not stated |
| 9 | aframe-environment-component | npm same, github.com/supermedium/aframe-environment-component | 1.5.0, 2025-02-21 | no / no | 2026-03-30 | README: "A-Frame 1.7.0 or later" | MIT | yes, only by "1.7.0 or later" (1.8.0 not named) |
| 10 | aframe-particle-system-component | npm same, github.com/IdeaSpaceVR/aframe-particle-system-component | 1.1.3, 2018-12-04 | no / no | 2022-02-25 | README example 1.2.0; wraps ShaderParticleEngine | MIT | not stated |
| 11a | troika-three-text | npm same, github.com/protectwise/troika | `latest` tag 0.52.5, 2026-07-24 (0.53.0 also published that day, not tagged latest) | no / no | 2026-07-24 | not A-Frame; peer `three >=0.125.0` | MIT | - |
| 11b | aframe-troika-text | npm same, github.com/lojjic/aframe-troika-text | 0.14.0, 2025-04-14 | no / no | 2025-04-14 | peer `aframe: "1.1.x - 1.7.x"`; Renovate PRs #95/#96 to 1.8 open since 2026-06-23 | MIT | **no** (range ends at 1.7.x) |
| 12a | Mozilla WebXR API Emulator | github.com/MozillaReality/WebXR-emulator-extension | release v0.3.0, 2020-03-16 | **archived**, description "INACTIVE" | 2022-03-13 | - | MPL-2.0 | - |
| 12b | Meta Immersive Web Emulator (IWE) | standalone repo github.com/meta-quest/immersive-web-emulator **archived**; extension now in the IWER monorepo, `packages/extension` (`@iwer/extension` 2.0.0, private, not on npm) | standalone v2.0.0-alpha, 2025-02-26 | standalone archived | monorepo 2026-09-24 | - | MIT | - |
| 12c | IWER | npm `iwer`, github.com/meta-quest/immersive-web-emulation-runtime | 2.5.0, 2026-09-24 | no / no | 2026-09-24 | not A-Frame specific | MIT | - |
| 13 | Meta VR CLI | npm `metavr` = thin alias to `@meta-quest/metavr`; repository github.com/meta-quest/agentic-tools | 1.8.1, 2026-10-01 (both) | no / no | 2026-09-24 (release v1.8.0) | - | npm: "Meta Platform Technologies SDK License"; repo (skills, docs): Apache-2.0 | - |
| 14 | glTF-Transform CLI | npm `@gltf-transform/cli`, github.com/donmccurdy/glTF-Transform | 4.5.1, 2026-09-28 | no / no | 2026-10-06 | - | MIT | - |
| 15a | LMQL | github.com/eth-sri/lmql, PyPI `lmql` (not on npm) | 0.7.3, 2023-10-14 | no / - | 2025-05-22 | - | Apache-2.0 | - |
| 15b | DSPy | github.com/stanfordnlp/dspy, PyPI `dspy` | 3.4.0, 2026-09-25 | no / - | 2026-10-08 | - | MIT | - |

## Notes per item

1. **maige-3d-mcp.** Publisher on npm: `seacloud9` (Brendon Smith). Downloads last week: 11
   (api.npmjs.org, 2026-10-04 to 2026-10-10). The package's own repository link (m-ai-geXR/maigeXR) answers 404;
   the code is in m-ai-geXR/mcp-webgpu (3 stars; GitHub org created 2025-11-16), `packages/server/package.json`
   is this package. README claims: "33 MCP Tools", in-world chat opened with `~`, WebXR mode, 9 AI providers;
   "At least one API key required for in-world chat". Architecture in the README: an MCP server with a WebSocket
   on port 8083 broadcasting to its **own** four client pages (Three.js :5173, A-Frame :5174, Babylon :5175,
   R3F :5176); "Server maintains a single source of truth. Clients are views of that state". It drives its own
   scene, not an existing A-Frame app. Its A-Frame client also loads aframe-extras 7.6.0 and aframe-effects 5.0.0.
2. **superframe.** Components folder lists 31 components, `geometry-merger` among them. The npm name `superframe`
   is not the collection.
3. **fern-aframe-components.** Root README lists: mirror, highlight, screen-fade, sky-background, effekseer,
   extra-stats ("Replacement for the `stats` component that shows additional stats"), fix-fog, hud, 3dof.
   Other packages on npm: aframe-mirror 1.1.2 (2026-03-30), aframe-sky-background 1.0.4, aframe-highlight 0.2.0,
   aframe-3dof 1.1.1. Publisher `mrxz` (README badges: @noerihuisman).
4. **hand-tracking-controls-extras.** README disclaimer: the author was "kinda reinventing the wheel" and points to
   Ada Rose Cannon's handy-work (npm `handy-work` 3.1.13, 2025-12-15) and marlon360/webxr-handtracking. Script is
   served from gftruj.github.io, not npm.
5. **super-hands.** README: "To use with A-Frame 1.5.0 and onward" add `delete AFRAME.components["grabbable"];`
   before loading; "a workaround solution to resolve the conflict between A-Frame grabbable component (introduced in
   A-Frame 1.5.0) and Superhands grabbable". 3.0.6 release notes: "Support for Ammo.js physics".
6. **Physics.** Fork README: drivers Cannon and Ammo; PhysX is a separate project (c-frame/physx) with "no current
   plan to integrate". Cannon: `driver: local` or `worker`; "current status of the worker version of Cannon driver
   seems to be poor", collision events only with the local driver. Ammo: "The Ammo.js binaries are not a dependency
   ... You will need to include this into your project yourself". Rapier exists only as `@dimforge/rapier3d(-compat)`
   0.21.0 (2026-09-25, Apache-2.0), with no A-Frame component found.
7. **aframe-extras loaders** (src/loaders/README): `animation-mixer` "Controls animations embedded in a glTF model"
   (also three.js models); `fbx-model`; `object-model` (three.js JSON); `collada-model-legacy`. For the last two the
   README says to use A-Frame's own `gltf-model` where possible. Depends on `three ^0.164.0`, `nipplejs`,
   `three-pathfinding`.
8. **Teleport.** blink-controls is "a modified version of the aframe-teleport-controls component" (README): rotation,
   thumbsticks, snap turn, no line mode.
9. **Environment.** No GitHub releases or tags; npm devDep `aframe: "*"`.
10. **Particles.** README: "exposes only a subset of the ShaderParticleEngine API".
11. **Troika.** troika CHANGELOG 0.53.0 (2026-07-24) adds `styleRanges` and fixes; the npm `latest` tag still points
    to 0.52.5. aframe-troika-text: last release commit "update aframe in examples and docs to 1.7.1".
12. **Emulators.** IWE README: a browser extension that "injects a WebXR runtime into web pages", Manifest V3,
    Chrome/Edge; features table lists WebXR Device API, Gamepads, Hand Input, AR, Hit Test, Plane/Mesh Detection,
    Anchors (Layers via polyfill; Lighting Estimation and DOM Overlays not supported). IWER README: "a
    TypeScript-based tool designed to enable the running of WebXR applications in modern browsers without requiring
    native WebXR support". Same monorepo also publishes `@iwer/devui` 2.5.0 and `@iwer/extension-bridge` 2.5.0, a
    "Local MCP daemon bridging coding agents to the Immersive Web Emulator" (repo `.mcp.json` runs it).
    The Chrome Web Store id in IWE's README is `cgffilbpcibhmcfbgggfhfolhkfbhmik`; maige's README links a different id.
13. **metavr.** `metavr` README: "Unscoped alias for `@meta-quest/metavr`". `@meta-quest/metavr` README:
    `metavr perf` - "Performance analysis and Perfetto trace tools"; `metavr mcp` - "Built-in MCP server for AI
    assistant integration"; "built-in ... MCP server with 40+ tools"; `metavr mcp install claude-code` (and 13 other
    targets); platforms darwin-arm64/x64, linux-x64, win32-x64; "The binary for your platform is downloaded on first
    run from Meta's CDN" (so the CLI code itself is not in the agentic-tools repo, which holds skills and docs).
14. **glTF-Transform.** The npm registry holds no README for the CLI (`npm view ... readme` empty); read from
    GitHub `packages/cli/README.md`. The README shows only `gltf-transform optimize input.glb output.glb
    --texture-compress webp` for optimize, and separate commands: `draco ... --method edgebreaker`,
    `meshopt ... --level medium`, `uastc ... --level 4 --rdo --rdo-lambda 4 --zstd 18`, `etc1s ... --quality 255`.
    The optimize options themselves are in `packages/cli/src/cli.ts` (main): `--compress <method>` one of
    `draco | meshopt | quantize | false`, default `meshopt`; `--texture-compress <format>` one of
    `ktx2 | webp | avif | auto | false`, default `auto` ("KTX2 optimizes VRAM usage and performance; AVIF and WebP
    optimize transmission size"); with `ktx2` it runs UASTC (level 4, rdo, lambda 4) on normal, occlusion and
    metallicRoughness textures and ETC1S quality 255 on the rest; `--texture-size` default 2048. KTX2 needs
    KTX-Software (`toktx`) installed (the etc1s/uastc help names KTX-Software under Dependencies).
15. **LMQL**: "A programming language for large language models" (eth-sri/lmql README; PyPI summary "A query
    language for language models"), Python. **DSPy**: "the framework for programming—rather than prompting—language
    models", "Declarative Self-improving Python" (stanfordnlp/dspy README), Python. Neither touches A-Frame or WebXR.

## Sources (all opened 2026-10-11)

- npm registry via `npm view <pkg> name version time license peerDependencies dependencies devDependencies
  repository.url deprecated readme --json` for every package named above; `npm search @fern-solutions`,
  `npm search maige`, `npm search hand-tracking-controls-extras`, `npm search "aframe rapier"`.
- https://api.npmjs.org/downloads/point/last-week/maige-3d-mcp
- GitHub API (`gh api repos/<r>`, `/commits`, `/releases`, `/tags`, `/pulls`, `/contents/...`) for: m-ai-geXR/maigeXR
  (404), m-ai-geXR/mcp-webgpu, supermedium/superframe, mrxz/fern-aframe-components,
  gftruj/aframe-hand-tracking-controls-extras, c-frame/aframe-super-hands-component, n5ro/aframe-physics-system,
  c-frame/aframe-physics-system (README.md, CannonDriver.md, AmmoDriver.md), pmndrs/cannon-es, kripken/ammo.js,
  c-frame/aframe-extras (README.md, src/loaders/README.md, PR #466), fernandojsg/aframe-teleport-controls,
  jure/aframe-blink-controls, supermedium/aframe-environment-component, IdeaSpaceVR/aframe-particle-system-component,
  protectwise/troika (CHANGELOG.md), lojjic/aframe-troika-text, MozillaReality/WebXR-emulator-extension,
  meta-quest/immersive-web-emulator, meta-quest/immersive-web-emulation-runtime (README, packages/extension,
  packages/extension-bridge, .mcp.json), meta-quest/agentic-tools, donmccurdy/glTF-Transform
  (packages/cli/README.md, packages/cli/src/cli.ts), eth-sri/lmql, stanfordnlp/dspy.
- `gh search repos hand-tracking-controls-extras`, `gh search code maige-3d-mcp`, `gh search code rapier --repo
  c-frame/aframe-physics-system`.
- https://pypi.org/pypi/lmql/json, https://pypi.org/pypi/dspy/json
