# Engine and tools, part 2: IWSDK, Babylon.js, the options, Meta's tools

Continues [engine-and-tools.md](engine-and-tools.md) (the parts list, parts 1-2, the short answer and the
recommendation are there). Same marks: **[read]** the page was opened and the quote is in it; **[code]** read in
source code; **[unverified]** not confirmed.

### Part 3. Meta's Immersive Web SDK (IWSDK)

- **What Meta says to use** [read] — "WebXR overview", 2026-07-21, https://developers.meta.com/horizon/documentation/web/webxr-overview/ —
  "Use the Immersive Web SDK (IWSDK) as the primary path for building an immersive web experience."
- **What it is** [read] — "Immersive Web SDK" overview, 2026-09-04, https://developers.meta.com/horizon/documentation/iwsdk/guides/overview/ —
  "It combines Three.js rendering with an Entity Component System (ECS)"; includes "XR and browser input", "Locomotion
  and grabbing", "Spatial audio and Havok physics", "UIKitML spatial interfaces", "A managed browser, XR emulation, a
  native scene editor, and command-line tools". Note: the page says it was "verified against landed source ... (IWSDK v0.5.3)",
  older than the package now shipped.
- **Version and maturity** [read, npm registry] — `@iwsdk/core` first published 2025-09-17; 1.0.0 on 2026-09-24; latest
  1.0.1 on 2026-10-01; MIT. Meta's blog of Oct 7, 2025 (https://developers.meta.com/horizon/blog/immersive-web-sdk-new-era-spatial-web-development/)
  called it "available now in early access" and claimed custom input management "reduces draw calls by up to 70 percent"
  [read; the claim is not explained there]. GitHub facebook/immersive-web-sdk: 338 stars, 33 open issues, last push
  2026-10-01 (API, 10 Oct) — against A-Frame 17,654, Babylon.js 26,150, three.js 116,196. Shipped titles built on it:
  **not found** (the blog names *In Tirol* and a PUMA demo as examples of what can be built, not as IWSDK titles).
- **Build step required** [read] — "Chapter 1: Project Setup", 2026-09-04, https://developers.meta.com/horizon/documentation/iwsdk/guides/01-project-setup/ —
  "IWSDK projects use Vite, Three.js, and an Entity Component System (ECS)"; Node "20.19 or later"; the project is
  `iwsdk.config.json` + `public/scenes/main.iwsdk.scene.json` + `src/*.ts` + `vite.config.ts`. "Chapter 8: Build and
  Deploy", 2026-09-23, https://developers.meta.com/horizon/documentation/iwsdk/guides/08-build-deploy/ — "Your starter
  app uses Vite to create a production build"; output `dist/` to GitHub Pages. This contradicts our rule "no build
  step" (CLAUDE.md): a move to IWSDK means adopting Vite and npm dependencies (`@iwsdk/core` 1.0.1 pulls `elics`,
  `@pmndrs/uikit`, `@babylonjs/havok`, `three-mesh-bvh`, `@preact/signals-core`, ... per its package.json).
  Using `@iwsdk/core` from a CDN through an import map without Vite: **not documented** [unverified].
- **Performance it gives** [code] — multiview on by default on super-three 0.181.0 (engine-and-tools.md, Part 2c); `layers` offered by
  default. No IWSDK GitHub issue mentions multiview (search `repo:facebook/immersive-web-sdk multiview`: 0 results);
  Meta's IWSDK tutorial is "verified with" Quest 3 / 3S, not Quest 2 (testing guide below). Known-good on Quest 2: **not found**.
- **Testing without a headset: IWER** [read] — "Chapter 2: Testing Your Experience", 2026-09-04,
  https://developers.meta.com/horizon/documentation/iwsdk/guides/02-testing-experience/ — "IWER (Immersive Web Emulator
  Runtime) is a WebXR emulator that runs entirely in your browser, allowing you to develop and test WebXR applications
  without a headset"; "We recommend using a Meta Quest 3 or Quest 3S for development, because this tutorial is verified
  with those devices." IWER is a separate package: npm `iwer` 2.5.0 (2026-09-24), MIT, deps only `gl-matrix` and
  `webxr-layers-polyfill`. Its getting-started page (https://meta-quest.github.io/immersive-web-emulation-runtime/getting-started.html)
  offers a script tag or an import map without a bundler, `new XRDevice(metaQuest3); xrDevice.installRuntime();`, and
  a JS API to move the head and press controller buttons (`xrDevice.controllers['left'].updateButtonValue('x-button', 1)`).
  **It works in our no-build page as it is** — the "headset run in CI (an emulated WebXR device)" that
  docs/target-architecture.md lists as still to build.
- **Store path is framework-free; Meta documents A-Frame on it** [read] — "Getting Started with WebXR PWAs", 2026-07-22,
  https://developers.meta.com/horizon/documentation/web/pwa-webxr/ — "WebXR PWAs should behave like native immersive
  apps ... launching directly into immersive mode right after launch"; the page gives code for "### Three.js" and
  "### A-Frame" (`if (window.getDigitalGoodsService !== undefined) { const scene = document.querySelector('a-scene'); ...`).
  The meta-vr skill `hz-store-pwa/SKILL.md` [read]: "Immersive WebXR app ... (IWSDK is the easy path)"; the pipeline is
  "package as a signed Meta VR APK with `@meta-quest/bubblewrap-cli`, and upload with `ovr-platform-util`". IWSDK is
  therefore not required for the Horizon Store; nothing read ties the store or in-app purchases to IWSDK.
  (The web in-app purchase page `documentation/web/web-iap` returned nothing through metavr: **unverified** URL.)

### Part 3 (cont.). Babylon.js multiview [read, forum]

- Enabled through the WebXR Layers feature: `enableFeature(WebXRFeatureName.LAYERS, ..., { preferMultiviewOnInit: true })`
  (https://forum.babylonjs.com/t/multiview-in-webxr-using-quest-3-in-2024/48191, Feb 2024). A Quest 3 user "never saw an
  improvement in FPS while using the OVR metrics tool"; maintainer RaananW: "multiview is not a magic solution to suddenly
  render in double the framerate."
- Apr 2025, Babylon.js v8.1.1 (https://forum.babylonjs.com/t/xr-multiview-layers-water-material-crashes-in-quest-browser/57698):
  RaananW: "all materials in the babylon materials library) does not work in multiview, as it is missing the multiview
  extension in the shader." No fix shown. Known-good on Quest 2: **not found**.

### A side effect of this research (for the owner)

- Running `metavr vrc-local guide` (expected to print a guide) **downloaded a 305 MB "VRC-local runtime bundle" (668 MB unpacked)**
  into `C:\Users\admin\.hzdb\cache\vrc-local` and **installed ten skills for Claude Code**: new folders in
  `C:\Users\admin\.agents\skills\` (analyze-drive, da-scout, perf-render-capture, renderdoc-optimize, runtime-optimizer,
  troubleshoot, vrc-drive, vrc-listing-assets, vrc-listing-check, vrc-verdict) and links to them in the newly created
  `C:\Users\admin\.claude\skills\`. User-level skills load in every project, against the owner's decision that only
  CodeRabbit and the TypeScript server are on for every project. Not undone by me: the owner decides. To undo: delete
  the ten links in `C:\Users\admin\.claude\skills\` (and, if wanted, `C:\Users\admin\.agents\` and the cache folder).

### Part 4. The options, each with its cost and its gain

Our size (wc/grep, 10 Oct): src/engine ~2,900 lines, src/app ~1,900, room 01 ~1,000; 19 `AFRAME.registerComponent`;
~150 `<a-...>` tags in the two scene files; the smoke and draw-call tests read `document.querySelector('a-scene')`.

| Option | Cost | Gain | Risk |
|---|---|---|---|
| (a) Stay on 1.7.1, cut draw calls (merge by material, one atlas for plaques/signs, instancing for repeats, room behind the door hidden) | work on content only; already started (merge-static.js) | Meta's first-listed fix ("merge small meshes into larger chunks"); needed on every engine (IWSDK's skill also says "< 100"); to pass the strict reading: corridor 66 → < 50 per view (-25 %), room 97 → < 50 (-49 %) | low |
| (a+) free fixes on 1.7.1: clear colour pure black; `updateTargetFrameRate(72)` on Quest 2 | minutes | Adreno fast clear on Quest 1/2 [read]; 13.9 ms instead of 11.1 ms if Quest 2 really starts at 90 [read, undated page] | low; measure |
| (b) A-Frame 1.8.0 / master as shipped | upgrade r173 → r184/185 (release notes: Clock → Timer, `pcfsoft` removed, `npot` removed); retest all | fixes we use: "Click event triggered on the wrong controller with the `cursor` component", controller reconnect, Quest `hand-controls` orientation [read, release notes] | multiview **must stay off**: on, our canvas texts go black [code] |
| (c) 1.8.0 with the one lost line restored (`textures.runDeferredUploads()` after the scene, as in super-three 0.181.0), vendored as a static file | one patched vendor file we own until upstream fixes it (PR #26 open); keep no build step; mirrors already render in `tick` | multiview: one submission for both eyes; Meta: "CPU usage reduction of 25% - 50% is possible" for CPU-bound apps; per-frame calls ≈ per-view calls (corridor ~66, room ~97, both < 100) [arithmetic from our measures; unverified in headset] | medium: experimental ("Multiview is an experimental feature"); one frame of texture lag; KooIaIa found it working on a built A-Frame (Aug 2025, device not named) |
| (d) Move to IWSDK 1.0.1 | Vite build + npm deps + Node ≥ 20.19 (breaks "no build step"); rewrite 19 components into ECS systems, the HTML scenes into code or `*.iwsdk.scene.json`; tests rewritten | Meta's "primary path"; multiview on by default on the good fork; IWER, locomotor (whose numbers we already copy), pointers, UIKitML, Havok; the store skill's "easy path" | high: 1.0 is 16 days old; 338 stars; docs verified against v0.5.3; tutorial verified on Quest 3/3S, not Quest 2; no shipped title found |
| (e) Plain three.js (upstream) | rewrite all of A-Frame's role (entities, controllers, lasers, scene loading) | none on multiview: upstream WebGLRenderer has none; WebGPURenderer needs `OVR_multiview2` (behind a flag on Quest per Meta) | high, and no draw-call gain; plain *super-three 0.181* = IWSDK without its tools |
| (f) Babylon.js | full rewrite into another engine | multiview through Layers; mature engine | high; library materials without multiview (Apr 2025); a Quest 3 user saw no FPS gain |

**Which one Meta points to.** For a new WebXR title: IWSDK — "Use the Immersive Web SDK (IWSDK) as the primary path"
(webxr-overview, 2026-07-21); "IWSDK is the recommended development path for both screen-based 3D sites and immersive
WebXR experiences on Meta Quest" (https://developers.meta.com/horizon/documentation/web/3d-web/, 2026-07-22). For the
Store: no engine is required — Meta's PWA page gives A-Frame code for the auto-enter step (pwa-webxr, 2026-07-22).

### Part 5. Meta tools we do not use, and what each would have caught today

What we have: `tools/quest-look.mjs perf` (five seconds: fps, slow frames, `renderer.info` draw calls and triangles,
through the browser's DevTools port) and `tests/draw-calls.mjs` on GitHub (desktop render, worst view). Neither
splits CPU from GPU time, which is the first step of Meta's workflow ("the first goal is to discover if your app is
GPU bound or CPU bound", webxr-perf-workflow). Available through `metavr tools list` (read 10 Oct): `ovrmetric` 2.0.1
(175 KiB), `renderdoc` (Meta fork, 236.8 MiB), `perfetto`, `platform-utils` (Store upload, 90.8 MiB), `xrsim`,
`spatialsim`, `vrc-local`. Nothing installed by me except the side effect above.

| Tool | What it does (source) | What it would have caught today |
|---|---|---|
| Chrome trace with the `xr.debug` category (`chrome://inspect#devices` → trace) | "frame time taken on CPU as well as the Phase Sync period" (webxr-perf-tools) [read] | whether we are CPU-bound: multiview only helps then ("Only CPU-bound experiences will benefit"); our fps alone cannot say it |
| OVR Metrics Tool HUD (`metavr tools install ovrmetric`) | "highly recommended that you keep this HUD up and running throughout development" (webxr-perf-tools) [read] | CPU and GPU frame time and levels live in the headset, during the owner's walks, not five-second samples |
| `ovrgpuprofiler --realtime="29,30"` (on the headset) | vertex vs fragment share (webxr-perf-tools) [read] | whether FFR or render scale would help (fragment-bound) or not |
| `metavr perf capture --mode vr --app com.oculus.browser` / `metavr perf monitor` | Perfetto trace with XR runtime metrics; "Minimum-overhead CPU-vs-GPU-bound perf recorder" (metavr --markdown-help) [read] | the same CPU/GPU answer, recorded and comparable before/after (`metavr perf compare`); browser package as `--app` **unverified** |
| RenderDoc Meta fork (`metavr perf render-capture`) | per-draw GPU cost, draw order, depth test (webxr-perf-workflow, ts-webxr-perf-drawcall) [read] | the doubled per-eye passes seen directly in one capture, instead of reading minified code; overdraw on glass and plaques |
| IWER (`iwer` 2.5.0, import map, no build) | emulated Quest 3 with scripted head and buttons [read] | a CI run that enters VR: draw calls counted on the real XR path (both eyes) on every push, controllers and locomotion tested without the headset; it cannot test `OCULUS_multiview` (desktop GPU) [unverified] |
| Meta XR Simulator (`xrsim`) | for "Unity, Unreal, and native OpenXR projects"; WebXR is routed elsewhere (skill `hz-xr-simulator-install-and-configure`) [read] | not for us |
| VRC-local (`metavr vrc-local`) | "testing a Quest OpenXR application ... It starts from an APK" with an injected TapeDeck layer (its guide) [read] | nothing yet; for our future TWA APK **unverified**; `store-listing-check` for the listing assets later |
| `@meta-quest/bubblewrap-cli` + `ovr-platform-util` | the Store path (pwa-packaging; skill `hz-store-pwa`) [read] | nothing yet; needed at packaging (docs/research/projects/distribution.md) |
| `session.updateTargetFrameRate` (an API, not a tool) | "runs by default at 90 frames per second on Meta Quest 2" (webxr-frames) [read] | a Quest 2 budget of 11.1 ms, not 13.9 ms, unless we ask for 72 |
