# Reference projects for "You are the object": what they did well and badly

Research only, nothing in the repo was edited. Budget used: 6 searches, 12 fetches (one 404).
Legend: **[read]** = I read the file or page myself (through a fetch that summarised it; quotes
are from that summary, short). **[unverified]** = from a search snippet, a mirror, a forum, or my
inference; not read in the original.

---

## 1. immersive-web/webxr-samples (W3C Immersive Web WG)

Sources: `immersive-vr-session.html` (raw, main) **[read]**; README.md on `main` returned 404
(probably another default branch, not retried); explainer and Chromium commit via search **[unverified]**.

- **Structure.** Each sample is one HTML page that imports small shared modules: `./js/util/webxr-button.js`,
  `./js/util/query-args.js`, `./js/render/core/renderer.js`, `./js/render/scenes/scene.js`, and the polyfill
  `./js/third-party/webxr-polyfill/build/webxr-polyfill.module.js` **[read]**. No build step to run a sample.
  The explainer says the samples use their own minimal renderer to keep the API in focus, and advises real
  projects to use a framework **[unverified, search snippet of the Chromium mirror]**.
- **Session start.** `navigator.xr.isSessionSupported('immersive-vr')` decides `xrButton.enabled`; the session is
  requested only from the button click; `onSessionStarted` registers `session.addEventListener('end', onSessionEnded)`,
  makes the GL context `xrCompatible: true`, sets `updateRenderState({ baseLayer: new XRWebGLLayer(...) })` **[read]**.
- **Reference space.** `session.requestReferenceSpace('local')`; comment: poses are relative to where the device was
  first detected **[read]**. The teleport sample moves the viewer with `getOffsetReferenceSpace()` **[unverified, Brown VR wiki]**.
- **Session end.** One handler, `onSessionEnded`, runs for both "user ended" and "browser/system ended"; it resets the
  button and drops the renderer **[read]**.
- **Frame timing.** `session.requestAnimationFrame(onXRFrame)` is re-registered first, before drawing; a `null` pose
  from `frame.getViewerPose(xrRefSpace)` (tracking lost) means "draw nothing"; one viewport per `pose.views` entry. The
  timestamp `t` is passed but unused: no own timing logic **[read]**.
- **Input.** This sample has none. The old `input-selection` sample was split into a teleportation sample and a
  gamepad sample; later commits added more-than-two controllers and a hands fix **[unverified, Chromium commit 669027 snippet]**.
- **Debug flags in the URL.** The polyfill is on by default, switchable: `QueryArgs.getBool('usePolyfill', true)` **[read]**.
- **Testing / regrets.** Nothing found in what I read. **[unverified: not checked]**

## 2. three.js WebXR examples (mrdoob/three.js `examples/webxr_*`, `test/e2e/`)

Sources: `test/e2e/puppeteer.js` (dev) **[read]**; `examples/webxr_vr_sandbox.html` (dev) **[read]**;
HTMLMesh / InteractiveGroup docs and forum threads via search **[unverified]**.

- **Structure.** Every example is one HTML file with an import map (`three` → `../build/three.module.js`,
  `three/addons/` → `./jsm/`); helpers live in `examples/jsm/` (`webxr/VRButton.js`, `XRControllerModelFactory`,
  `interactive/HTMLMesh.js`, `interactive/InteractiveGroup.js`) **[read]**.
- **Text and UI in XR.** The sandbox hides the lil-gui DOM (`gui.domElement.style.visibility = 'hidden'`) and shows it as
  an `HTMLMesh`, i.e. the DOM painted onto a canvas texture **[read]**. A canvas that changes must be pushed by hand
  every frame: `statsMesh.material.map.update()` **[read]**. Forum reports: an HTMLMesh panel came out black, and
  canvas text blurs when you come close; alternatives are troika-three-text (SDF) and three-mesh-ui **[unverified, forum]**.
- **Input.** One code path for mouse and controllers: `group.listenToPointerEvents( renderer, camera )` plus
  `group.listenToXRControllerEvents( controller1 )` **[read]**. The sandbox has no hands and requests no optional
  features: `VRButton.createButton( renderer )` **[read]**. The hand-input examples (`webxr_vr_handinput_*`) **[unverified: not read]**.
- **Loop.** `renderer.setAnimationLoop( animate )` drives both desktop and XR frames **[read]**.
- **Testing (the e2e screenshot test).** Puppeteer serves the repo, opens every `examples/*.html` at 400x250 (2x),
  waits for network idle, then 1 s per MB downloaded, then polls `window._renderFinished`; screenshots are compared with
  `examples/screenshots/<name>.jpg`: `pixelThreshold` 0.1 per pixel, at most 0.1% of pixels may differ; on failure it
  writes `-actual`, `-expected`, `-diff` images; `--make` regenerates references; CI splits into 5 shards **[read]**.
  Determinism: the build is rewritten so `Math.random()` becomes `Math._random()` from `deterministic-injection.js`,
  and the page waits on `performance._now()` **[read: rewrite seen; injection file not read, so the seeding is inferred]**.
- **Weak spots in that test.** A render timeout is ignored (a TODO), so the screenshot is taken anyway **[read]**.
  A WebGPU "device lost" relaunches the browser and the example is not counted as failed, so it is in effect unchecked
  **[read]**. The exception list carries guessed reasons, e.g. `webxr_vr_video` sits under "Timming issues?" **[read]**.
  XR sessions themselves are never entered: headless Chrome has no XR device, so `webxr_*` pages are checked only in
  their flat state **[unverified, inference]**.

## 3. aframevr/a-painter (A-Frame VR painting app)

Sources: README.md **[read]**; `src/` listing **[read]**; `/src/systems/painter.js` **[read]**; open issues
via GitHub issue search **[read: titles only]**.

- **Structure.** `src/`: `index.js`, `systems/`, `components/`, `brushes/`, `binarymanager.js`,
  `sharedbuffergeometry.js`, `sharedbuffergeometrymanager.js`, `ui2d.js`, `dragndrop.js`, `atlas.js`, `utils.js`
  **[read]**. Brushes are plug-ins with a small contract: `AFRAME.registerBrush(name, definition, options)`, `addPoint`
  required, `init` and `tick` optional, options `thumbnail`, `spacing`, `maxPoints` (default 1000) **[read]**.
- **Saving user work.** Own binary format `.apa`: magic string `'apainter'`, a uint16 version, the brush names, then
  strokes (brush index, colour, size, points with position, quaternion, intensity, timestamp) **[read]**. Also JSON.
  Loaded from the URL: `?url=` (binary), `?urljson=` **[read]**. painter.js never touches localStorage and has no
  autosave: saving is desktop keys only (`v` binary, `j` JSON, `u` upload to Cloudinary, which returns a share link
  `.../a-painter/?url=`) **[read]**. A crash or a closed tab loses the painting.
- **UI in VR.** Not described in README; a menu toggled by a controller button (`abutton`/`xbutton` on Touch) **[read]**.
- **Input.** Separate mappings per controller model: `vive-controls`, `oculus-touch-controls`, `windows-motion-controls`;
  common `grip.down` = undo, `trigger.changed` = paint (pressure 0–1) **[read]**. Desktop debug keys exist (`t` test lines,
  `r` random stroke, `x` "remove brush 2") **[read]**.
- **Testing.** None mentioned in README; no test folder seen in `src/` **[read, absence at the levels I listed]**.
- **Known problems (open issues).** #260 "can't open menu in oculus quest 2" (2020); #258 "Oculus Quest" (2020);
  #277 "updated to aframe 1.4.2 and there is an error on oculus_touch_contrls.js" (2023); #276 "3DoF controller mapping
  is wrong" (2022); #246 "Bug when painting with two hands simultaneously" (2018); #252 "Tab crash whenever the main menu
  button is pressed" (2018) **[read: titles]**. Pattern: per-device mappings rot as headsets and A-Frame change, and
  nothing catches it.

## 4. doublespeakgames/adarkroom (A Dark Room)

Sources: repo root listing **[read]**; `script/state_manager.js` **[read]**; README via fetch returned only the
badge/language part **[read, partial]**; translation pipeline via search **[unverified]**.

- **Structure.** Root: `index.html`, `script/`, `lang/`, `css/`, `audio/`, `img/`, `lib/`, `tools/`, `doc/`,
  `dev-server.js` (172 bytes), `package.json` (446 bytes), `contributing.md`, `browserWarning.html`, `mobileWarning.html`
  **[read]**. Plain scripts, no bundler needed to play **[unverified: inferred from the tiny dev server and package.json]**.
- **Game state.** One global `State`; the file header: all state is read and written through the StateManager `$SM`
  **[read]**. Categories: `features`, `stores`, `character`, `income`, `timers`, `game`, `playStats`, `previous`,
  `outfit`, `config`, `wait`, `cooldown` **[read]**. Paths are strings (`'stores.wood'` → `State.stores.wood`) evaluated
  with `eval` **[read]**. `set` caps numbers at `MAX_STORE` and resets negative stores to 0 with a warning **[read]**.
- **Events.** Each non-silent change publishes `stateUpdate` (category + name) through `$.Dispatch`; the file's own
  subscriber `handleStateUpdates` is an empty stub **[read]**.
- **Saving.** Every non-silent `set/setM/addM/remove` calls `Engine.saveGame()`: save on every change, no timer
  **[read]**. Old saves are upgraded step by step in `updateOldState`: 1.0→1.1→1.2→1.3, each step a small data move
  **[read]**. So a player's old save never breaks.
- **Bugs visible in the file.** `whichState == {}` can never be true, so empty objects are never treated as zero
  **[read]**.
- **Text and languages.** 23 languages, chosen with `?lang=` **[read, README]**. A `lang/` folder per language;
  `.po` catalogs exist (Debian ships them) **[unverified: upstream gettext pipeline and the `_()` wrapper not read]**.
- **Testing.** No test folder at the root **[read, listing]**.

## 5. excalidraw/excalidraw

Sources: `packages/excalidraw/i18n.ts` (master) **[read]**; translation workflow, restore API and tests via search
(docs.excalidraw.com and a Gitea mirror of commits) **[unverified]**.

- **Translations.** Strings live in `locales/<code>.json`, loaded lazily one locale at a time:
  `` await import(`./locales/${currentLang.code}.json`) `` **[read]**. A language is offered only if
  `percentages.json` says it is at least `COMPLETION_THRESHOLD = 85` per cent translated **[read]**. Translators work in
  Crowdin, not in the repo; a CI job (`locales-coverage`) recomputes the percentages **[unverified, mirror commit #2736]**.
- **Missing text.** `t()` tries the current locale, then English, then an optional fallback string **[read]**. A missing
  key outside production throws `new Error(errorMessage)`; in production it warns and returns `""` **[read]**. A special
  test language returns every key as `[[key]]` markers, so a test sees which text was meant without real wording **[read]**.
- **RTL.** `document.documentElement.dir` set from the language's `rtl` flag **[read]**.
- **Saved data.** Every loaded scene goes through one "restore" layer (`restore`, `restoreElements`, `restoreAppState`)
  that repairs broken links between elements and recomputes text sizes **[unverified, docs.excalidraw.com restore page
  via search]**. `restore.ts` got its own unit tests with snapshots, free of the UI (#3679) **[unverified, mirror]**.
- **Tests in general / accessibility.** Not read **[unverified]**. Snapshot tests of big generated data churn when time
  and ids are not controlled **[unverified, third-party Vitest guide]**.

---

## Our repo, checked for the comparison (local reads, `claude/workflow-testing-plan-96f413`)

- One page, plain ES modules, no build: `ARCHITECTURE.md` line 3 ("Static files, GitHub Pages, no build step").
- Canvas text for VR: `src/engine/panel.js:1` ("canvas text shows in a headset, where the page's DOM does not").
- Room contract: `docs/rooms.md`; engine never imports rooms, enforced by `tests/structure.test.mjs`.
- Event log as the one source of truth: `ARCHITECTURE.md` ("The event log is the single source of truth").
- URL switches: `?room=`, `?speed=N` (`docs/testing.md`), `?sign=b` (smoke test).
- Input: `laser-controls="hand: left|right"` with a raycaster on `.clickable` (`src/rooms/01-control/scene.js:19-20`);
  no `hand-tracking` anywhere in `src/` (grep, no hits).
- Storage: `localStorage` keys `object.form` (`src/app/consent.js:19,24`), `object.signVisits`
  (`src/app/lobby/opening.js:15`), plus per-room flags (`left-early.js`, `results.js:53`); all in try/catch; no version
  field in the stored values.
- Headless test: `tests/smoke.mjs` plays the room at 20x in CI; it presses the button with an unseeded
  `Math.random() < 0.1` (`tests/smoke.mjs:233`), so two CI runs press differently.
- Exit handling: `exit-vr` / `enter-vr` listeners in six files (`hint.js`, `left-early.js`, `lobby.js`, `opening.js`,
  `locomotion.js`, `recenter.js`).
- Text keys: I found no test that every text key used in code exists in a `texts.ru.js` (grep of `tests/` for
  `texts.ru` hits only `structure.test.mjs` and `results.test.mjs`, which check file presence and Cyrillic placement)
  **[partly verified: grep only, not a full read of those tests]**.

## Table: same / take / avoid

| | What | Evidence there | Evidence here |
|---|---|---|---|
| Same | One HTML page per entry, shared plain modules, no build | webxr-samples imports `./js/util/*.js` **[read]**; adarkroom `dev-server.js` 172 B **[read]** | `ARCHITECTURE.md` "no build step" |
| Same | Debug and test switches in the URL | `QueryArgs.getBool('usePolyfill', true)` **[read]**; a-painter `?url=` **[read]**; adarkroom `?lang=` **[read]** | `?room=`, `?speed=`, `?sign=b` |
| Same | VR text drawn on a canvas, not DOM | three.js `HTMLMesh` **[read]** | `src/engine/panel.js:1` |
| Same | Plug-in contract for the varying part | a-painter `registerBrush`, `addPoint` required **[read]** | room contract `docs/rooms.md` |
| Same | All state through one owner, changes as events | adarkroom `$SM` + `stateUpdate` **[read]** | event log "single source of truth" |
| Same | Headless browser run in CI | three.js `test/e2e/puppeteer.js` **[read]** | `tests/smoke.mjs` in GitHub Actions |
| Same | One input path for mouse and lasers | three.js `listenToPointerEvents` + `listenToXRControllerEvents` **[read]** | raycaster on `.clickable` for both (scene.js:19-20) **[unverified for mouse: not traced]** |
| Take | Deterministic headless run: replace `Math.random` (and clocks) with a seeded version | three.js rewrites `Math.random()` to `Math._random()` **[read]** | `tests/smoke.mjs:233` unseeded `Math.random()` |
| Take | Compare desktop screenshots against approved images with a written tolerance; `--make` to refresh; save actual/expected/diff on failure | three.js `pixelThreshold` 0.1, max 0.1% pixels **[read]** | owner-approved sets `/docs/rooms/NN-shots/` (CLAUDE.md rule 13) compared by eye only |
| Take | A version number in everything we store, and one upgrade step per version before reading | adarkroom `updateOldState` 1.0→1.3 **[read]**; a-painter `'apainter'` + uint16 version **[read]**; excalidraw `restore` **[unverified]** | `object.form` stores `{name, sign, on}` with no version (`consent.js:24`) |
| Take | Missing text key = loud in dev and tests, safe in production; a marker language for tests | excalidraw `throw new Error(errorMessage)` outside prod, `[[key]]` test language **[read]** | no key-coverage test found **[partly verified]** |
| Take | One "session ended" path, whoever ended it (user, Quest home button, system) | webxr-samples `onSessionEnded` for both **[read]** | exit-vr handled in six files; worth one check that the system-ended path behaves like the player's own exit **[unverified: not tested]** |
| Take | Null pose (tracking lost) = draw nothing, never crash | webxr-samples `getViewerPose` null → skip **[read]** | A-Frame handles this inside; our own per-frame code (recenter, locomotion) not checked for it **[unverified]** |
| Avoid | Button mappings per controller model | a-painter vive/oculus/windows mappings **[read]**; issues #260, #277, #276 open for years **[read]** | we use generic `laser-controls` (keep it so); hand tracking not supported at all (no `hand-tracking` in `src/`) |
| Avoid | A check that passes when it could not check | three.js: render timeout ignored (TODO), device-lost example uncounted **[read]** | matches our audit finding "tests that do not guard" (commit ddf2efa message) |
| Avoid | Skipping a check with a guessed reason | three.js exception list "Timming issues?" (`webxr_vr_video`) **[read]** | CLAUDE.md rules 12 and 18 already demand measuring first; keep skips with a measured cause |
| Avoid | User work kept only on a manual save | a-painter: no localStorage, no autosave, save by desktop keys **[read]** | consent form is stored at once (`consent.js:24`), keep it so for any future player work |
| Avoid | String paths through `eval` and empty stub handlers | adarkroom `buildPath` + `eval`, empty `handleStateUpdates`, `whichState == {}` bug **[read]** | not present here (no `eval` checked **[unverified]**) |
| Avoid | DOM-to-canvas panels that need manual texture refresh and blur close up | `statsMesh.material.map.update()` each frame **[read]**; blur and black panels **[unverified, forum]** | our panels are drawn for their size (`px`, `ref` in `panel.js`); the paper-in-hand research (commit ddf2efa) is the right line |
