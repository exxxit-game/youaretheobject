# Reference projects: folder layout of open-source WebXR games (A-Frame / three.js)

Paths starting with / in these notes are paths in the other project's repository, not ours.

## Repo facts (gh repo view)
- supermedium/moonrider: https://github.com/supermedium/moonrider — licence field empty in gh (check LICENSE file), last push 2024-05-02, not archived
- mozilla/hubs -> redirects to https://github.com/Hubs-Foundation/hubs — last push 2026-08-23, not archived
- aframevr/a-blast: https://github.com/aframevr/a-blast — last push 2022-02-26, not archived
- meta-quest/immersive-web-sdk: does NOT exist under that name (gh: could not resolve)

## 1. Moonrider — https://github.com/supermedium/moonrider
- Licence: MIT (LICENSE file, "Copyright 2018 Supermedium"); last commit 2024-03-05 (repo pushed 2024-05-02). A-Frame + webpack build (package.json: webpack, babel, nunjucks-style templates via aframe-super-hot-html-loader). No test script in package.json (scripts: build, deploy, lint, start) -> no tests.
- Root: assets/ index.html src/ vendor/ webpack.config.js
- src/: assets.html, scene.html, index.js, index.css, utils.js, components/ (~90 flat files, one A-Frame component each, incl. debug-*.js), constants/ (colors, genres, playlists), lib/ (convert-beatmap, soundpool, FontLoader...), state/index.js (single file, 1001 lines), templates/ (one .html per screen: menu, intro, stage, score, victory, leaderboard, loading...), workers/ (zip.js)
- State: ONE global store via aframe-state-component: AFRAME.registerState({ initialState, handlers: {...}, computeState }) in src/state/index.js; scene binds state to components declaratively with bind__<component>="prop: stateKey" attributes on <a-scene> (seen in src/scene.html).
- Content vs engine: levels are DATA (beatmaps downloaded as zips, parsed by lib/convert-beatmap.js), not code; screens are HTML templates in src/templates/. Debug helpers are separate components (debug-*.js) toggled by URL params.

## 2. A-Blast — https://github.com/aframevr/a-blast
- Licence: MIT ("Copyright 2015-2016 A-Frame authors"); last commit 2018-08-24 (repo pushed 2022-02-26). A-Frame + webpack. package.json scripts: build, start, lint -> no tests.
- Root: assets/ build/ css/ index.html manifest.webmanifest src/ vendor/ webpack.config.js
- src/: index.js, components/ (26 files: gamestate.js, gun, enemy, countdown, points-counter, highscores, gamestate-debug...), systems/ (bullet.js, enemy.js, explosion.js = pools/managers), enemies/ (enemy0..3.js, enemy_start.js), bullets/ (5 bullet types), lib/ (poolhelper, letterpanel, utils)
- Content vs engine: CONTENT is a REGISTRY. Each enemy/bullet type is one file that calls ABLAST.registerEnemy(name, data, definition) (src/enemies/enemy0.js); the generic system (src/systems/enemy.js, AFRAME.registerSystem('enemy') + PoolHelper) owns them and never names a specific enemy.
- State: one 'gamestate' component (src/components/gamestate.js) with a schema (health, points, wave, state oneOf STATE_MAIN_MENU/PLAYING/GAME_OVER/GAME_WIN) and registerHandler(event, fn(newState)) reducers keyed by game events; separate gamestate-visuals and gamestate-debug components read it.

## 3. Hubs — https://github.com/Hubs-Foundation/hubs (mozilla/hubs redirects here)
- Licence: MPL-2.0; last commit 2026-08-23. Very large; forked A-Frame (github:hubs-foundation/aframe) + bitECS fork, webpack, TypeScript/React. Tests: ava unit tests in test/unit/** (only test/unit/utils/component-mappings.test.js found) + test/browser-stack/ (browser tests). package.json "test": lint && ava.
- Root: admin/ doc/ habitat/ scripts/ src/ test/ types/ .storybook/ webpack.config.js
- src/: many entry pages (hub.html/js, avatar, signin, cloud...), components/ (A-Frame components, legacy), systems/ (66, A-Frame systems), bit-systems/ (45, ECS systems), inflators/ (47: turn glTF/JSON component data into ECS components), prefabs/ (17: duck.tsx, media.tsx, button3D.tsx = entity templates), react-components/ (2D UI), storage/ (store.js, media-search-store.js = persisted state), loaders/, utils/, workers/, assets/
- Content vs engine: rooms/scenes are DATA (glTF scenes authored in Spoke/Blender, loaded at runtime); code maps glTF component names to engine components (gltf-component-mappings.js, inflators/). Moving from A-Frame components to bitECS (aframe-to-bit-components.js).
- State: storage/store.js (persisted user prefs) separate from per-entity ECS data.

## IWSDK (Meta)
- facebook/immersive-web-sdk: MIT, pushed 2026-10-01 (gh search). meta-quest/iwsdk-v0-template: Apache-2.0, pushed 2026-10-05. Not checked for a reference game (limit).
- facebook/immersive-web-sdk tree: monorepo (pnpm) packages/ (core, locomotor, xr-input, scene-composition, cli, create, ...) + examples/ (audio, grab, locomotion, physics, poke, ...: FEATURE DEMOS, not a finished game). Example layout e.g. examples/locomotion/src: index.ts, assets.ts (asset manifest), components.ts, elevator.ts (one system), panel.ts; Vite build (vite.config.ts). No reference game found -> not a layout reference for a finished game.

## Patterns worth copying (summary)
- A-Blast: content-as-registry (one file per enemy calls ABLAST.registerEnemy; the generic system never names one) -> same shape as our rooms/ talking to engine via a contract.
- A-Blast: game state as event-keyed handlers on one schema (registerHandler('enemy-death', newState => ...)) + separate *-debug and *-visuals readers.
- Moonrider: one state module with handlers + computeState, components bound to it declaratively; screens as one template per screen; debug-* components kept separate and URL-toggled.
- Hubs: tests in test/unit mirroring src paths; prefabs/ (entity templates) and inflators/ (data -> components) separate from systems/.
