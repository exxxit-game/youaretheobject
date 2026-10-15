# Engines from China and Japan: how they are built, and what Object can take

Research, read only. Budget used: 6 web searches, 12 page fetches (5 repo file trees through the GitHub API,
4 source or README files, 3 doc pages). Marks used below:
- **[read]**: I read the file or page myself.
- **[tree]**: I saw only the file name or folder in the repo tree. What the file contains is unverified.
- **[search]**: taken from a search result summary, not from the page itself. Unverified.

Repo trees read: galacean/engine@main, cocos/cocos-engine@v3.8.6, layabox/LayaAir@HEAD, Orillusion/orillusion@main,
pixiv/three-vrm@dev.

---

## 1. Galacean Engine (Ant Group), github.com/galacean/engine

### Structure: engine and content
- pnpm monorepo: `packages/core`, `math`, `loader`, `rhi-webgl`, `shader`, `shader-lab`, `ui`, `physics-lite`,
  `physics-physx`, `xr`, `xr-webxr`, `galacean` (the bundle) **[tree]**. Build with rollup, tests with vitest
  (`rollup.config.js`, `vitest.workspace.ts`) **[tree]**.
- XR is split in two packages. `packages/xr` is the part that knows nothing about the browser: `session/XRSessionManager.ts`,
  `XRSessionMode.ts`, `XRSessionState.ts`, `input/XRInputManager.ts`, `XRController.ts`, `XRInputButton.ts`,
  `XRTargetRayMode.ts`, `XRTrackingState.ts`, `XRCamera.ts`, `feature/hitTest`, `feature/trackable`. `packages/xr-webxr`
  is the WebXR backend: `WebXRDevice.ts`, `WebXRSession.ts`, `WebXRFrame.ts`, plane, image and anchor tracking
  **[tree]**. So input is named in engine terms (button, tracking state, ray mode) and the WebXR API sits behind one
  backend package. How the two talk is unverified.
- Content is made in the Galacean editor and loaded as assets; scripts are components (`/tests/src/core/Script.test.ts`,
  `CompomentDependencies.test.ts`) **[tree]**. Same entity + component model as A-Frame and Unity.

### Text, CJK
- `packages/core/src/2d/text/TextUtils.ts` **[read]**:
  - measures text on one shared 2D canvas (`OffscreenCanvas` when present), `willReadFrequently: true`.
  - per-character cache: `TextUtils._getCharInfo` asks the `SubFont` for a char and adds it when missing
    (lines 449-454); with `packages/core/src/2d/atlas/FontAtlas.ts` **[tree]** this is a dynamic glyph atlas. Atlas size
    unverified.
  - line breaking for Chinese: comment "The char code scope of Chinese is [一-鿿]" (line 145); a char in that
    range may break a line on its own, like a space. Only the basic CJK block: no kana, no Hangul, no CJK Ext-A, no
    full-width punctuation, and no rule that keeps "。" or "，" off the start of a line (none found in the file).
  - generic families include `"fangsong"` (a Chinese generic family) next to serif and sans-serif (line 14-24).
  - a platform hack lives in the text core: "_extendHeight ... in miniprogram performance is different from h5"
    (line 26). Mini-programs (WeChat, Alipay) shape these engines.
- Design note, Galacean blog "text renderer design and implementation p1" **[read]**: compares DOM, Canvas, BMFont, SDF.
  BMFont: "Text needs to be pre-planned", and big textures pass the 2048 that mobile handles. They chose Canvas
  (system fonts) first, one texture per text renderer, and planned "caching based on individual characters" next.
  The article does not mention CJK.
- Custom font files arrived later (changelog v0.9) **[search]**. `e2e/.dev/AlibabaSans.ttf` is the only font file in the
  repo **[tree]**.

### Testing
- Unit tests: `tests/src/core/*.test.ts` (Entity, Script, Transform, TextRenderer, `PolyfillTextMetrics.test.ts`, ...)
  run with vitest in a real browser; they keep screenshots in `tests/src/core/__screenshots__/*.png`
  (Sprite, SpriteMask, SpriteRenderer) **[tree]**.
- End-to-end: `e2e/README.md` **[read]**: Playwright, Chromium only, "visual regression tests with odiff comparison".
  Each case is a small page in `e2e/case/*.ts` (about 100 cases: animator, material, particle, `text-typed.ts`, ...)
  that calls `initScreenshot(engine, camera)`; `e2e/config.ts` gives each case a threshold: "0.01 for strict
  tests, 0.1 for normal tests". Baseline images live in `e2e/fixtures/originImage/` under git-lfs; a new baseline is
  made by running debug mode and copying the picture by hand.
- CI: `/.github/workflows/ci.yml` **[tree]**, content unverified.

### Problems / regrets
- Text started as one canvas texture per renderer; the blog itself names memory pressure ("bullet comments") as the
  reason to move to a char cache **[read]**.
- No CJK-specific issue found in my one search **[search]**.

---

## 2. Cocos Creator (Xiamen), github.com/cocos/cocos-engine (v3.8.6 tree)

### Structure: engine and content
- Engine modules in `cocos/` (2d, 3d, animation, physics, ui, xr, ...) **[tree]**; each optional feature has an entry
  file in `exports/*.ts` (`exports/physics-ammo.ts`, `exports/physics-cannon.ts`, `exports/rich-text.ts`, ...) and
  `cc.config.json` lists modules **[tree]**, so a project ships only the modules it turns on (feature cut, unverified
  how).
- `pal/` (platform abstraction layer) and `platforms/` keep WeChat, ByteDance, native and web apart **[tree]**.
- Content is editor-first: scenes and prefabs are serialized assets made in the editor, scripts are TypeScript
  components on nodes. The engine never knows a game; the game is data plus components.
- XR: the engine has only `cocos/xr/index.ts`, `xr-enums.ts`, `event/xr-event-handle.ts` **[tree]**; the rest is an
  editor extension `xr-plugin` that adds XR components and ready prefabs ("XR HMD", "XR Agent") built on OpenXR; web
  preview simulates headset and controllers with keyboard and mouse; controller haptics live on `cc.InteractorEvent`
  **[search]** (docs.cocos.com/creator/manual/en/xr/architecture/component.html, version-history.html).

### Text, CJK
- Label doc (zh) **[read]**, docs.cocos.com/creator/manual/zh/ui-system/components/editor/label.html:
  - CacheMode NONE: one bitmap per label. BITMAP: one bitmap that joins dynamic atlasing, only for text that rarely
    changes. CHAR: per-character cache in a global shared bitmap, 1024 x 1024, "只有场景切换时才会清除" ("cleared only
    when the scene changes"); when it is full, new characters do not render; no SHRINK, no bold or italic.
  - CacheMode works only for system fonts and TTF; BMFont "无需进行这个优化" (needs no such optimization).
  - The 2.x doc said CHAR suits frequently changing text; the 3.x doc narrows it to a small character set **[search]**.
    That narrowing is a quiet regret: CHAR breaks on large Chinese character sets.
- `cocos/2d/utils/text-utils.ts` **[read]**:
  - `isUnicodeCJK(ch)` (line 178) with three ranges: Chinese `一-鿿㐀-䷿`; Japanese kana, CJK
    punctuation, full-width forms; Korean Hangul.
  - `SYMBOL_REG = /^[!,.:;'}\]%\?>、‘“》？。，！]/` (line 162): punctuation that must not start a line.
  - `WORD_REG` and `CHAR_SET` (lines 160-164) list Latin, Cyrillic (the Russian alphabet range), Vietnamese and Polish letters, so
    those words are not cut in the middle.
  - `getSymbolLength`, `getSymbolAt` (lines 221, 254): surrogate-pair aware length and index (bodies not read).
  - `safeMeasureText`, `MAX_CACHE_SIZE = 100` (measure cache), `BASELINE_RATIO = 0.26` with a platform feature flag for
    alphabetic baseline (lines 31-58).
- Localisation:
  - The engine's own editor strings are one JS module per language and topic: `editor/i18n/en/components.js`,
    `editor/i18n/zh/components.js`, `.../modules/ui.js` **[tree]**: the same pattern as our `texts.ru.js`.
  - L10N editor (since 3.6) **[read]**, docs.cocos.com/creator/manual/zh/editor/l10n/overview.html: data in
    `localization-editor/translate-data`; big projects use PO, CSV or Excel; an `L10nLabel` component; "collect and
    count" finds text that needs translating; at publish you pick the languages, a default language and a fallback
    language; audio and images can be localised. Per-language fonts: the page does not say.

### Testing
- 159 `*.test.ts` files under `tests/` with jest (`jest.config.js`): animation, asset-manager, scene-graph, physics,
  ui (`/tests/ui/label.test.ts`, `text-utils.test.ts`, `richtext.test.ts`) **[tree]**.
- 25 workflows: `web-npm_test.yml`, `web-interface-check.yml` (public API check posted to the PR),
  `run_test_cases.yml` and `run_test_cases_pr_comment.yml`, native compile per platform **[tree]**; contents unverified.

---

## 3. LayaAir (Layabox, Beijing), github.com/layabox/LayaAir

- One big package `/src/layaAir/laya/...` plus `/src/extensions` and `/src/samples` (2d, 3d, ui, webgpu, a WebXR demo
  `/src/samples/3d/WebXR/WebXRControllerDemo.ts`) **[tree]**. WebXR in the engine: `d3/WebXR/core/WebXRSessionManager.ts`,
  `WebXRInputManager.ts`, `WebXRGamepad.ts`, `WebXRCameraManager.ts` **[tree]**. Translations in the UI layer:
  `laya/ui2/Translations.ts`, `TranslationLoader.ts` **[tree]**.
- Text: `laya/webgl/text/TextRenderConfig.ts` **[read]**, comments in both languages (`@en` and `@zh` on every field):
  `atlasWidth = 1024` (a new atlas when one is full), `atlasGridW = 16`, `standardFontSize = 32` for measuring,
  `forceSplitRender` (per character) or `forceWholeRender` (whole sentence), `scaleFontWithCtx = true` with
  `maxFontScale = 3`: "如果舞台有缩放，则修改渲染大小，以保证清晰度" ("if the stage is scaled, change the render size to
  keep it sharp"), `useTextureArray = true`. Also `BitmapFont.ts`, `TTFFontLoader.ts`, `platform/FontAdapter.ts` **[tree]**.
- Testing: only `tests/native-text-input/*.test.ts` (3 files) and no `.github/workflows` in the tree **[tree]**. The
  samples are the checks. Stable releases per branch `LayaAir_3.x` **[search]**.

## 4. Orillusion (Shanghai, WebGPU), github.com/Orillusion/orillusion

- `/src/Engine3D.ts` (engine singleton), `/src/components/ComponentBase.ts` and components, optional features as
  `packages/` (physics, physics-rapier, particle, post, media-extention, debug with dat.gui) **[tree]**.
- Text: 3D mesh text via `packages/geometry/parser/FontParser.ts` and `text/TextGeometry.ts` **[tree]**. GUI text is
  BMFont: the doc says you load the fnt atlas first; the Chinese sample loads a BMFont "that supports Microsoft Yahei";
  making the fnt needs outside tools (Hiero, distance-field fonts) **[search]** (orillusion.com/en/guide/gui/textfield.html).
  The GUI text classes are not in today's `main` tree (only `GUIPass.ts`), so they moved or were dropped **[tree]**,
  reason unverified.
- Testing: `test/` with math (Matrix4, Quaternion, ...), gfx (WebGPU buffers), render-graph passes, components,
  run from `test/index.html` with `test/ci/main.js` and `preload.js` (looks like an Electron runner, unverified);
  one `ci.yml` **[tree]**.

## 5. pixiv/three-vrm (Tokyo), github.com/pixiv/three-vrm

- pnpm + lerna monorepo **[tree]**. One package per glTF extension of the VRM spec, each a loader plugin:
  `three-vrm-core` (`VRMCoreLoaderPlugin.ts`), `three-vrm-materials-mtoon` (`MToonMaterialLoaderPlugin.ts`, with
  `nodes/` for WebGPU), `three-vrm-springbone`, `three-vrm-node-constraint`, `three-vrm-animation`,
  `three-vrm-materials-v0compat`; a `types-*` package per JSON schema (`types-vrmc-vrm-1.0`, ...); and
  `@pixiv/three-vrm` that bundles them all **[tree]**. Release notes: users "probably don't have to care" about the
  sub-packages because the bundle includes them **[search]**.
- Tests: 12 vitest files, all on pure math or logic, next to the source in `src/**/tests/`
  (`lookAt/utils/tests/calcAzimuthAltitude.test.ts`, `sanitizeAngle.test.ts`, `VRMAimConstraint.test.ts`,
  `VRMSpringBoneColliderShapeCapsule.test.ts`) **[tree]**. No browser test, no screenshot test.
- Examples: plain HTML pages per package that import from a CDN-style path: `packages/three-vrm/examples/basic.html`,
  `firstperson.html`, `lookat.html`, `webgpu-dnd.html`; `three-vrm-springbone/examples/collider.html`,
  `plane-collider.html` **[tree]**. They are both the docs and the manual check.
- Guides written after a real problem: `guides/spring-bones-on-scaled-models.md` with `media/springbone-scale-correct.mp4`
  and `springbone-scale-wrong.mp4` **[tree]**.
- Regret: v1.0 "There are a lot of breaking changes!" (importer became a GLTFLoader plugin, BlendShape renamed to
  Expression) **[search]**, with `guides/migration-guide-1.0.md` **[tree]**.

---

## Our side, for the comparison (read in this repo)
- `src/engine/panel.js`: each panel is one canvas texture; font `Inter, "Segoe UI", Roboto, Arial, sans-serif`;
  wrapping is `para.split(' ')` (line 66): **it breaks only on spaces.** A Chinese paragraph has no spaces, so it is
  one word: it would never wrap and only the shrink-to-fit would save it.
- `css/fonts.css` + `vendor/fonts/`: Inter in two files, Latin and Cyrillic, split by unicode-range.
- `tests/fonts.test.mjs`: every character of every player text file must be covered by every face, "so a new language
  fails here until its script's files are added".
- `tests/structure.test.mjs`: imports go room -> app -> engine. `npm test` is pure node; `tests/smoke.mjs` is one
  headless run in CI.

## Table

| | What | Evidence |
|---|---|---|
| **Same** | Text drawn to a canvas, one texture per text block | Galacean's first design (blog p1 **[read]**); Cocos CacheMode NONE (Label doc **[read]**); LayaAir `forceWholeRender` (TextRenderConfig.ts **[read]**); ours `src/engine/panel.js` |
| **Same** | Player text in one JS module per language | Cocos `editor/i18n/en/*.js` and `editor/i18n/zh/*.js` **[tree]**; ours `texts.ru.js` |
| **Same** | Engine knows no game; features are separate modules | Galacean `packages/*`, Cocos `exports/*.ts`, three-vrm one package per extension **[tree]**; ours `structure.test.mjs` |
| **Same** | Pure math split out and unit tested without a browser | three-vrm `lookAt/utils/tests/*.test.ts`, Orillusion `test/math/*` **[tree]**; ours `*-math.js` + `npm test` |
| **Same** | One headless Chromium run in CI | Galacean `e2e` Playwright, Chromium only (README **[read]**); ours `tests/smoke.mjs` |
| **Ahead of them** | A test that fails when a character has no glyph | Ours `tests/fonts.test.mjs`. Cocos CHAR (atlas full) and Orillusion BMFont (glyph not baked) fail silently: no char drawn (Label doc **[read]**, Orillusion doc **[search]**) |
| **Take** | Break lines between CJK characters, not only on spaces | Galacean TextUtils.ts line 145 **[read]**; Cocos `isUnicodeCJK` line 178 **[read]**; our `panel.js` line 66 splits on `' '` |
| **Take** | Keep closing punctuation off the start of a line | Cocos `SYMBOL_REG` line 162 (`、。，！？》`) **[read]** |
| **Take** | Use wide CJK ranges: Ext-A, kana, CJK punctuation, full-width forms, Hangul | Cocos text-utils.ts lines 179-181 **[read]** (Galacean's single 4E00-9FFF block misses them) |
| **Take** | Keep text sharp by rendering at a scale tied to how large it is shown, with a cap | LayaAir `scaleFontWithCtx`, `maxFontScale = 3` **[read]**. CJK glyphs have more strokes per glyph than Latin (my inference) |
| **Take** | Screenshot regression in CI: one page per case, a baseline image, a per-case threshold | Galacean e2e: Playwright + odiff, baselines in git-lfs, 0.01 strict / 0.1 normal (README **[read]**). Fits our approved shot sets (CLAUDE.md rule 13) |
| **Take** | Default and fallback language; a list of untranslated texts | Cocos L10N: default + fallback language at publish, "collect and count" (doc **[read]**). For us: a node test that lists keys present in `texts.ru.js` but missing in `texts.zh.js` (my proposal) |
| **Take** | A Chinese face shipped as a subset holding only the characters our texts use, split by unicode-range like Inter | Principle from BMFont "bake only what you use" (Orillusion doc **[search]**) and Cocos's warning against many unused characters (Label doc **[read]**); the subset itself and its tooling are my proposal, unverified against any of these engines |
| **Take** | Per-feature example page that doubles as a manual check | three-vrm `examples/*.html` per package **[tree]**; ours has `tools/xr-probe.html` |
| **Take** | Input named in engine terms behind one WebXR backend | Galacean `packages/xr/input/XRInputButton.ts`, `XRTrackingState.ts` vs `packages/xr-webxr` **[tree]** (contents unverified) |
| **Avoid** | A shared per-character glyph atlas | Cocos CHAR: 1024 x 1024, cleared only on scene change, new characters not drawn when full (Label doc **[read]**); LayaAir 1024 atlases (**[read]**). Our texts are static per panel, so the atlas brings only risk |
| **Avoid** | Bitmap fonts (BMFont, fnt) for Chinese | Galacean blog: "Text needs to be pre-planned", re-export for new text, 2048 mobile limit **[read]**; Orillusion needs outside tools to bake a YaHei fnt **[search]** |
| **Avoid** | A hard-coded single CJK block and no punctuation rule | Galacean TextUtils.ts line 145 **[read]** |
| **Avoid** | Samples instead of tests | LayaAir: 3 test files, no workflows in the tree **[tree]** |
| **Avoid** | One big breaking release of a contract | three-vrm v1.0 "a lot of breaking changes" **[search]**; for us: the room contract (docs/rooms.md) changes in small steps |
| **Avoid** | Platform hacks inside the text core | Galacean `_extendHeight` for mini-programs (TextUtils.ts line 26 **[read]**); Cocos baseline feature flags (text-utils.ts lines 38-49 **[read]**) |

## Does their architecture differ?
Not at the core. All five use the same entity + component model as A-Frame and Unity, and keep the engine apart from
games. The real differences:
1. Editor-first: content is serialized scenes and prefabs made in an editor (Cocos, Galacean, LayaAir IDE); XR in Cocos
   comes as prefabs ("XR HMD", "XR Agent").
2. TypeScript monorepos with a build (rollup, vite, pnpm), feature modules cut at build time (Cocos `exports/`).
3. Chinese mini-programs (WeChat, Alipay) shape them: platform layers (`pal/`), text hacks for mini-programs, glyph
   atlases to save memory and draw calls.
4. Bilingual by habit: doc comments `@en` and `@zh` (LayaAir), docs in both languages, editor strings per language.
