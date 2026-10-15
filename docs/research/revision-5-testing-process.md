# Revision 5 of 5: testing, measuring and our development tools

The owner's question (10 Oct 2026): the smartest set of tools for testing, measuring and developing, checked
now, because today a feature claimed to work did nothing (multiview in A-Frame 1.7.1), tests passed on the
laptop and failed on GitHub, a red test got committed, Meta's own tools sat installed and unused, and a
database "risk" came from not reading our own plan. He reads no code: the tools must catch mistakes themselves.
Marks: **[read]** the page was opened and the quote is in it; **[code]** read in our files or a package's source;
**[unverified]** not confirmed. Meta facts through `metavr docs fetch`; Claude Code facts from code.claude.com.

## The parts (each gets an answer or "not found")

1. Testing a WebXR game: (a) IWER in the GitHub smoke test (enter VR, both eyes' draw calls, controllers,
   hands); (b) the IWER dev UI; (c) Meta XR Simulator for WebXR; (d) automated headset runs; (e) visual
   regression against docs/rooms/ shots; (f) performance in CI.
2. Measuring on the headset: (a) metavr perf capture / monitor; (b) OVR Metrics Tool; (c) Chrome tracing with
   xr.debug / Perfetto; (d) RenderDoc Meta fork; (e) ovrgpuprofiler; (f) CPU- vs GPU-bound, run without the owner.
3. The metavr MCP server in Claude Code: install (user or project), why no tools showed, what it gives.
4. Code quality: (a) `// @ts-check` / checkJs with the TypeScript server; (b) ESLint; (c) CodeRabbit after
   its trial vs alternatives.
5. Claude Code for a non-programmer owner: (a) the guards that matter; (b) noise to drop; (c) claims checked;
   (d) no feature claim without a measurement. Plus today's four failures, each traced to its cause.

## What we use now (read from the repo, 10 Oct) [code]

- `npm test`: 26 node test files (package.json `"test"`); the commit hook runs all but `structure` and
  `review-gate` in parallel (tools/hooks/pre-commit `SLOW='structure review-gate'`), the push hook runs those two.
- GitHub (`.github/workflows/test.yml`, on push to room-polish and main): `npm test`, `prove-guards.mjs --lf` and
  CRLF, then `npm run test:smoke` (Playwright Chromium with `--use-gl=swiftshader`, tests/smoke.mjs:19).
- Draw calls in CI: `tests/draw-calls.mjs` renders the scene with a plain `THREE.PerspectiveCamera` from 24-ish
  spots ("looking every 45 degrees round") and reads `renderer.info.render.calls`: one desktop view, **not the XR
  path** (no XR session, no second eye); a budget of 70 and 100 per view, 50 for Quest 2 (now the XR path: `FRAME_BUDGET`, `QUEST2_FRAME`).
- Headset: `tools/quest-look.mjs perf` = 5 s of `requestAnimationFrame` deltas plus `renderer.info` over the
  DevTools socket (`adb forward tcp:9222 localabstract:chrome_devtools_remote`, tools/headset.mjs:56); it fails
  under 72 fps, at 100 calls or 750,000 triangles. No CPU/GPU split. `tools/quest-check.mjs` plays the corridor
  and room at 10x and fails under 72 fps or on a page error.
- No visual comparison anywhere: the approved shots in docs/rooms/*-shots/ are looked at by people only.
- No type check, no linter: `node --check` (syntax only) on staged scripts in the commit hook.
- Claude Code: tools/claude-guard.mjs on SessionStart, UserPromptSubmit, PreToolUse (Bash|PowerShell, mcp__.*,
  Write|Edit), SubagentStart/Stop (practice-reviewer), Stop (.claude/settings.json); seven agents in .claude/agents/.

## Findings (written as they come)

### Part 3. The metavr MCP server in Claude Code

- **What metavr itself would install** [read, ran `metavr mcp install claude-code --dry-run`, nothing written]:
  "would execute: claude mcp add metavr -- npx -y metavr@latest mcp server". The plugin starts the same thing
  ("`npx -y metavr mcp server`", docs/research/projects/claude-code/F-inventory.md:73). So `metavr mcp install
  claude-code` repeats the npx start that gave 0 tools; it does not fix it.
- **Options of the installer** [read, `metavr --markdown-help`, metavr 1.8.0.17.10]: `claude-code` "Show command to
  install into Claude Code CLI", `--execute` "Execute the installation command directly", `--executable` "Path to
  metavr executable"; `project` "Install into a project directory (creates mcp.json or .mcp.json)". The server:
  `mcp server` with `--no-telemetry`, `--enable-full-docs`, `--disable-perf-tools`, "only stdio is supported".
- **The likely cause, now documented by Claude Code** [read] — https://code.claude.com/docs/en/mcp.md, "MCP client
  runtimes": the v2 runtime "adds MCP protocol revision 2026-07-28"; it "Asks HTTP, stdio, and claude.ai connector
  servers whether they support the newer revision"; "To pick the runtime yourself" a setting takes `v1` or `v2`; "To decide whether Claude Code
  asks" another takes `auto` or `legacy` (their names are on that page). Our board's
  own diagnosis (docs/board.md, commit f1852e1): the server "refuses the tool list" with «request _meta is missing».
  That fits a server that mis-answers the new revision's probe [unverified: the error was seen on 10.10, the docs
  page does not name metavr].
- **Status and timeouts** [read, same page]: "The `/mcp` panel shows the tool count next to each connected server"
  and "flags servers that advertise the tools capability but expose no tools"; `claude mcp list` "appends the
  failure detail"; "Configure MCP server startup timeout" by an environment variable; "Stdio
  servers are local processes, and Claude Code doesn't reconnect them automatically." Plugin servers: "You add and
  remove plugin servers by installing or uninstalling the plugin, not with `/mcp` commands." Scopes: local (default,
  `~/.claude.json`), project (`.mcp.json`, approved once per person: "Claude Code prompts for approval in interactive
  sessions before using project-scoped servers"), user.
- **The fix, best to worst** [the steps are documented; that they cure metavr is unverified]: (1) a project server
  that runs the global binary, no npx: `.mcp.json` `{"mcpServers":{"metavr":{"command":"metavr","args":["mcp",
  "server","--no-telemetry"]}}}` (`metavr mcp install project --dry-run` itself still writes "command: npx", "args: [-y, metavr@latest, mcp,
  server]" [read, dry run]; its `--executable` option names the binary instead), plus Claude Code's protocol negotiation set to `legacy` (an env entry in .claude/settings.json) if the tool list is still
  refused (it "keeps every server on" the earlier handshake: Supabase and the others too); (2) the same at user
  scope; (3) leave the plugin's server and use the CLI from Bash, as now. Then switch the plugin's own server off
  (deny `plugin:meta-vr:metavr` in `deniedMcpServers`, as already done for reference-lookup) so two copies do not run.
- **What the server would give over the CLI** [read]: the same commands as tools (docs, device, perf, capture,
  app, files, logs); the plugin README promised "40+ tools ... documentation search, performance tracing"
  (F-inventory.md:74). The CLI already gives all of them from Bash (`metavr docs fetch` worked for this research).
  Gain of the server: tools Claude finds without remembering the CLI; cost: one more server's instructions in every
  session. **Verdict: change** (one project entry without npx, tested with `claude mcp list`); if it still gives 0
  tools, drop the server and keep the CLI (no loss: every needed command runs from Bash).
- This session got the plugin server's instructions but no metavr tool in its list (deferred? unverified).

### Part 1. Testing a WebXR game

**(a) IWER in the GitHub smoke test** [read + code]
- What it is: npm `iwer` 2.5.0 (registry, modified 2026-09-24), MIT, deps only `gl-matrix`, `webxr-layers-polyfill`.
  Its site: "With IWER, automated testing in WebXR becomes a breeze" (https://meta-quest.github.io/immersive-web-emulation-runtime/).
- No build needed [read] — https://meta-quest.github.io/immersive-web-emulation-runtime/getting-started.html (v2.5.0):
  a script tag `iwer.min.js` or an import map entry; `new XRDevice(metaQuest3)` then `xrDevice.installRuntime()`,
  run "before any rendering or WebXR logic" so frameworks that check WebXR on load see it. In Playwright that is
  an init script before A-Frame loads [unverified: no A-Frame example found; none of IWER's pages name A-Frame].
- **Both eyes need one switch** [read]: stereo is off by default and IWER then shows the left eye only;
  `xrDevice.stereoEnabled = true` gives two views. Our vendored three.js counts both then [code]: the render call
  resets `renderer.info` once (`autoReset&&this.info.reset()`) and, without multiview, draws `for(...)
  {const i=n[e];Ot(m,t,i,i.viewport)}` once per camera of the XR array camera (vendor/aframe-1.7.1.min.js). So in an
  IWER session with stereo on, `renderer.info.render.calls` after one frame = both eyes' draw calls: the number
  Meta's "< 100" is about, measured on the real XR path instead of tests/draw-calls.mjs's desktop camera.
- Controllers and hands [read, API page https://meta-quest.github.io/immersive-web-emulation-runtime/api/xr-device.html]:
  `controllers` "indexed by handedness", `updateButtonValue('x-button', 1)`, `updateAxes('thumbstick', x, y)`;
  `hands` with `poseId` ("default" and "pinch" are essential) and `updatePinchValue`; `primaryInputMode` "either
  `controller` or `hand`"; `recenter()`; `updateVisibilityState(state)`. That covers our locomotion (thumbstick),
  the laser/trigger on the clipboard, hands, recenter and the headset taken off (visibility): today only pure
  maths of these is tested (tests/locomotion.test.mjs, recenter.test.mjs).
- Replaying a real walk [read] — https://meta-quest.github.io/immersive-web-emulation-runtime/action.html: an
  `ActionRecorder` "captures data directly from the `XRSession` and `XRFrame`" where native WebXR exists (the
  headset), `recorder.log()` gives JSON, `xrdevice.createActionPlayer(refSpace, capture)` replays it in IWER;
  status "beta", "experimental". A walk the owner once did in the headset could be replayed on every push.
- IWER cannot time frames or test the Quest GPU or `OCULUS_multiview` (CI runs software GL) [unverified, reasoning].
- **Verdict: add.** Cost now: about a day (an init script in tests/smoke.mjs, `iwer` pinned, one XR pass per place
  with stereo on, presses for the clipboard and thumbstick). After five rooms: scripted inputs per room. Free.

**(b) The IWER dev UI** [read] — npm `@iwer/devui` 2.5.0: React 19, three 0.184, 6.5 MB; "overlay UI for full control
  of the emulated WebXR device" (IWER README): for a person at a desktop browser. Meta's agent route, an MCP server in
  `vite-plugin-iwer` that "exposes 32 tools" (`accept_session`, `select`, `capture_canvas`...; https://developers.meta.com/horizon/documentation/web/iwsdk-ai-assisted-dev-tooling,
  2026-03-10), has peer `vite ^7.0.0` (npm `@iwsdk/vite-plugin-iwer` 0.2.2): it needs Vite. **Verdict: not now.**

**(c) Meta XR Simulator** [read] — "Meta XR Simulator Overview" (last_updated 2026-09-04, `metavr docs fetch`
  https://developers.meta.com/horizon/documentation/native/xrsim-intro/): "a lightweight OpenXR runtime that runs
  on your computer"; "It ships no operating system image and no Android layer, so it does not emulate device
  hardware"; graphics "Vulkan ... Direct3D 11 and Direct3D 12". It cannot run the Quest Browser; the page names no
  WebXR use. A desktop Chrome might use it as its OpenXR runtime [unverified], but that means Chromium on the
  laptop, which the owner ruled out. **Verdict: not for us** (IWER covers the emulated session in CI).

**(d) Automated headset runs** [read + code]
- Ours: quest-check (10x walk, fps, page errors) and quest-look (frame, eval, perf, levels) drive the Quest
  Browser over the DevTools socket. `worn on` already uses Meta's proximity broadcast `prox_close`
  (tools/headset.mjs:33). The gap: VR is entered only while the owner wears it ("On a table the boundary window
  holds the request", quest-look.mjs:87), so no unattended VR run exists.
- Meta's own answer [read] — "Use Meta Quest Scriptable Testing Services to Enable E2E Testing" (last_updated
  2026-10-06, https://developers.meta.com/horizon/documentation/native/android/ts-scriptable-testing/): "You can
  use simple ADB commands ... without putting on the headset" to disable "the boundary", "auto-sleep" and blocking
  dialogs (one `adb shell content call --uri content://com.oculus.rc` with `'disable_guardian:b:true'`
  ...); "The Store PIN associated with the logged in account is required"; recommended: "a single test user";
  warning: "Use of these features by non-developers ... could degrade the lifetime of the headset". metavr wraps it:
  `metavr device set-property --disable-guardian --disable-autosleep --set-proximity-close` and `metavr device
  boundary --disable` ("pauses the boundary so you can move freely while testing") [read, `metavr --markdown-help`].
- With the boundary paused, quest-check could enter VR on the table and run the corridor and room unattended
  [unverified: not tried; it changes headset settings, so the owner's word first and his PIN typed by him].
- metavr `tapedeck` replays OpenXR sessions but "Requires a userdebug build" (metavr help) [read]: not for us.
- **Verdict: change** quest-check to enter VR after pausing the boundary (Meta's documented way), on the owner's
  yes. Cost now: an hour plus his one-time PIN step; after five rooms: one walk script per room.

**(e) Visual regression against the approved shots** [read]
- Our approved shots are headset frames (docs/rooms/corridor-shots/1-arrival.jpg: "1280x960", from quest-look
  `frame`) [code]. A CI render (software GL) will never match them pixel for pixel: Playwright's own page says
  "Screenshots differ between browsers and platforms due to different rendering, fonts and more" and keeps a
  baseline per platform (https://playwright.dev/docs/test-snapshots; `threshold` default 0.2, `maxDiffPixels`).
- The published method for WebGL [read] — three.js's own screenshot test
  (https://raw.githubusercontent.com/mrdoob/three.js/dev/test/e2e/puppeteer.js): references in
  `examples/screenshots/${file}.jpg` made by its `--make` mode, "threshold error in one pixel" 0.1, "at most 0.1%
  different pixels", `Math.random` made deterministic before the page runs, a software GPU in CI, failing runs
  write `-actual`, `-expected` and `-diff` pictures. So: baselines rendered in CI itself from fixed camera spots
  (the views tests/draw-calls.mjs already walks), never compared with headset photos.
- **Verdict: add, in two layers.** (1) CI: a handful of fixed views per place rendered with `?speed`, our clock
  and random seeded, compared with stored CI baselines at three.js's tolerances; a diff picture saved as a GitHub
  artifact on failure; a new baseline only with a picture the owner approved (his "pictures before the game").
  (2) Headset: quest-look renders the same fixed views on the Quest GPU (a scripted camera, as draw-calls does) and
  compares them with headset baselines; the docs/rooms shots stay the human reference. Cost now: one to two
  days; after five rooms: about 10 views per room, baselines re-approved when a room changes on purpose.

**(f) Performance in CI** [code + reasoning]
- GitHub's runner has no Quest GPU, so frame times there mean nothing; what is stable there is counting:
  draw calls, triangles, textures, programs (`renderer.info`), on the XR path once IWER is in (above). Meta's
  numbers to hold: "Recommended draw calls | < 200 | < 100", "Recommended triangles per frame | < 1.5M | < 750K"
  (device-optimization-comparison, quoted in docs/research/engine-and-tools.md). Timing belongs to the headset
  (Part 2). **Verdict: keep** tests/draw-calls.mjs, **change** it to read both eyes through IWER and add
  triangles and texture memory; cost: part of the IWER day.

### Part 2. Measuring on the headset

- **Meta's order** [read] — "WebXR performance optimization workflow" (last_updated 2026-07-21,
  https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/): "the first goal is to discover if your
  app is GPU bound or CPU bound"; "A simple way ... is to not render anything": "If the app's framerate is not
  affected or affected very little ... the app is likely CPU bound"; then vertex vs fragment by "setting the app's
  render scale to something small, like 0.01" (`setFramebufferScaleFactor` in three.js). Both are page switches a
  script can flip through `quest-look eval`: **no install, no owner** [unverified in our headset; A-Frame sets the
  scale at session start, so the scale test needs a re-entry into VR].
- **(c) Chrome trace with xr.debug** [read] — "WebXR Performance Tools" (https://developers.meta.com/horizon/documentation/web/webxr-perf-tools/):
  desktop `chrome://inspect#devices`, "trace" on "com.oculus.browser", category "xr.debug"; "The resulting trace will
  have the frame time taken on CPU as well as the Phase Sync period". The same trace can be started without desktop
  Chrome over the socket quest-look already opens: the DevTools protocol's `Tracing.start` "Start trace events
  collection" with `TraceConfig` "Included category filters", `Tracing.end`, `dataCollected`
  (https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Tracing.pdl) [read; that the
  Quest Browser accepts it on its browser target is unverified]. **Verdict: add** as `quest-look trace` (CPU ms per
  frame; save the JSON, open in ui.perfetto.dev). Free, an hour or two.
- **(b) OVR Metrics Tool** [read] — https://developers.meta.com/horizon/documentation/native/android/ts-ovrmetricstool/
  (last_updated 2026-10-02): "Report Mode ... can be easily exported as a CSV"; turned on by ADB:
  one `am broadcast` to its settings receiver (the CSV action), files in `/sdcard/Android/data/com.oculus.ovrmon...`;
  "Basic" metrics include "CPU level", "GPU level", "Average FPS", "Stale Frame Count", "CPU Utilization", "GPU
  Utilization", "App GPU Time"; the HUD by another broadcast. Install "from the Meta Horizon Store" (or `metavr tools
  install ovrmetric`, 175 KiB, docs/research/engine-and-tools-2.md); "Install OVR Metrics Tool before launching the
  app you want to monitor". This gives GPU time and the CPU/GPU split for every session, the owner's walks included.
  **Verdict: add** (install on the owner's word; then quest-check pulls the CSV and fails on GPU time over budget).
- **(a) metavr perf capture / monitor** [read, `metavr --markdown-help`]: `perf capture` "Capture a timed Perfetto trace"
  with `--mode vr/xr` and `--app <APP>`; `perf compare` "Compare two Perfetto traces and produce a delta report";
  `perf monitor` "Minimum-overhead CPU-vs-GPU-bound perf recorder (relaunch + monitor + bound report)". With the
  browser as `--app com.oculus.browser` **unverified** (the relaunch would drop the VR session). **Verdict: try
  once** (read-only capture, owner's word for the headset session); keep if it names the bound for the browser.
- **(e) ovrgpuprofiler** [read, perf-tools page]: "lives on the device itself"; `ovrgpuprofiler --realtime="29,30"`
  gives "what percentage of the frame is spent on vertex processing vs. fragment shading". Runs over `adb shell`,
  nothing to install. **Verdict: add** to quest-look after the CPU/GPU answer says GPU.
- **(d) RenderDoc Meta fork** [read] — "Using RenderDoc with Browser" (https://developers.meta.com/horizon/documentation/web/webxr-perf-renderdoc/):
  a Windows installer, then in the headset `chrome://flags` "Android ImageReader" to "Disabled" and "RenderDoc
  Immersive Mode Support" "Enabled", a desktop GUI capture; per-draw "GPU Duration". `metavr perf render-capture`
  scripts it ("Standalone Quest GPU frame capture + RenderDoc deep-dive"), 236.8 MiB (engine-and-tools-2.md).
  **Verdict: later**, only when a GPU-bound view is found; it changes browser flags (owner's word).
- **(f) CPU vs GPU, ours today**: unknown. quest-look perf reads fps and `renderer.info` only. Draw calls cost CPU
  ("draw calls can be CPU intensive", workflow page), so multiview and merging help only if we are CPU-bound.

### Part 4. Code quality

- **(a) Type checking plain JS** [read] — https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html: "add:
  `// @ts-check` to the first line in your `.js` files to have TypeScript raise it as an error"; "switch to using a
  `jsconfig.json`" for many files; JSDoc "annotations that come before a declaration will be used to set the type";
  `// @ts-nocheck` to skip a file. Our 11,474 lines of src/tools/tests carry no `@ts-check` and no jsconfig [code].
  A-Frame's types are old: npm `@types/aframe` 1.2.10 (we run 1.7.1), `@types/three` 0.186.0, `typescript` 7.0.2
  (npm registry, 10 Oct) [read]. **Verdict: add** a jsconfig (checkJs, vendor/ excluded, `AFRAME` and `THREE`
  declared loosely) and one type-check command in npm test, file by file starting with the pure modules (engine
  maths, sheet-math, protocol), each fixed before the next; the language server then shows the same errors after
  every edit. It catches wrong names, wrong arguments and missing properties: the class of "a flag passed but never
  read" (multiview: a fourth argument dropped). Cost now: one to two days; after five rooms: rooms written checked
  from the start, cheaper than retrofitting. TypeScript 7 handling of JSDoc: **unverified**, pin the version.
- **(b) ESLint** [read] — https://eslint.org/docs/latest/rules/no-undef: "Disallow the use of undeclared variables";
  "it is safe to turn this rule off" in TypeScript because "TypeScript's compiler enforces this check". With (a) on,
  ESLint adds little beyond unused code and a few bug rules. **Verdict: not now** (one checker, not two); revisit if
  (a) leaves gaps. Cost: none now.
- **(c) CodeRabbit after its trial** [read] — https://docs.coderabbit.ai/management/plans: "New organizations start
  with a 14-day Advanced trial"; then they "revert to Free"; "Open-source projects receive Team features with no
  paid subscription required"; but "For public repositories with less than 10 stars, CodeRabbit requires reviews
  to be triggered manually" (`@coderabbitai review`); OSS PR reviews "1–10" an hour "varying by repository star
  count". Paid: Essentials "$30 per developer per month", Team "$60" (https://www.coderabbit.ai/pricing).
  The alternative on the owner's existing plan [read] — https://code.claude.com/docs/en/github-actions.md: a review
  workflow running `/code-review:code-review --comment` on `pull_request` events; "If you authenticate with an OAuth
  token, runs use your Claude subscription instead of API billing" (`claude setup-token`, a GitHub secret); it
  follows CLAUDE.md; caution: Claude "skips ... pull requests that already have a comment from Claude", so on our
  one long-lived pull request (room-polish into reviewed) later pushes may go unreviewed [unverified how it judges].
  **Verdict: keep CodeRabbit to the trial's end, then free with a robot comment** `@coderabbitai review` per push
  (the reviewed.yml robot can post it) [unverified that a bot's comment triggers it]; paid only if its remarks
  proved useful (his rule). The Claude review workflow is the second option, at no extra money.

### Today's failures, each to its cause and the tool that stops it [code]

- Multiview "worked" but did nothing: no measurement of the claim (the vendored manager gets two arguments,
  engine-and-tools.md 2a). Stops it: IWER both-eyes count in CI + a headset A/B (`quest-look perf` with and without).
- Laptop green, GitHub red: the laptop checks out CRLF (`git config core.autocrlf` = `true`; .gitattributes sets LF
  only for `tools/hooks/*`) and has its own fonts. Git: "Attributes which should be ... distributed to other
  repositories ... should go into `.gitattributes`"; `eol` "marks a path to use a specific line-ending style in
  the working tree" (https://git-scm.com/docs/gitattributes). Stops it: `* text=auto eol=lf` for the whole repo.
- A red test committed: the pre-commit runs the quick tests, the push hook the slow ones (tools/hooks/*); the
  smoke test runs only on GitHub. Stops it: the session start already says a red last run; make the stop guard
  refuse "done" while the last GitHub run of the pushed commit is red or pending (Part 5).
- Meta's tools unused and a database "risk" from not reading our own plan: a reading rule, not a tool (docs/tools.md
  "read it from the thing itself first"). Stops it: the fact-checker run on every claim before it reaches the owner.

### Part 5. Claude Code for an owner who reads no code

- **Guards that matter** [code + read]: the ones for what cannot be undone (main, secrets, live database, headset
  restart, unsaved work: tools/claude-guard.mjs) stay. They fail open today: "`onFailure` ... `"continue"`, the
  default, or `"block"`", "Requires Claude Code v2.1.295 or later", and it "has no effect on `Stop`"
  (https://code.claude.com/docs/en/hooks.md) [read]; the laptop's CLI is 2.1.268 (`claude --version`) [code]; the
  app's own copy unverified. **Change**: `onFailure: "block"` on the PreToolUse guards once the app is new enough.
- **A claim needs a measurement** (the multiview lesson). Our Stop guard checks unsaved work, unpushed commits,
  owner links and today's showing (claude-guard.mjs:449-479), not claims. Two options (Decisions, 2): (A) tools
  write evidence: quest-look perf/trace and the CI draw-call count append a row (date, commit, numbers) to one
  measures file, and the fact-checker accepts a feature claim only with a row newer than the change; (B) also an
  agent Stop hook: "spawn a subagent that can use tools ... to verify conditions"; "Agent hooks are experimental"
  (hooks.md) [read], tokens every turn. (A) is cheap and exact; (B) catches prose but costs every turn.
- **Laptop green, GitHub red**: the Stop guard can also refuse "done" while the pushed commit's GitHub run is red or
  still running (`gh run list` is already allowed in .claude/settings.json) [code; not built].
- **Noise to leave out**: ESLint beside the type check, the IWER dev UI, Meta XR Simulator, RenderDoc before a GPU
  bound is found, a second metavr server copy, a paid review before the trial proves itself (above).

## Decisions for the owner (real options; each new tool replaces something, per his freeze rule)

1. **CI enters VR (IWER)**: (a) yes, and the desktop draw-call camera is replaced by the both-eyes count; (b) no.
2. **Claims**: (A) a measures file written only by tools, checked by the fact-checker; (B) A plus an agent Stop hook;
   (C) as now.
3. **Headset unattended**: pause the boundary and sleep by Meta's scriptable testing (his PIN, typed by him, once;
   Meta warns it is for developers) so quest-check enters VR on the table; or keep VR only while he wears it.
4. **Headset measures**: install OVR Metrics Tool (175 KiB) for CSV of CPU/GPU every walk: yes / no.
5. **Type check** with JSDoc on pure modules first: yes / no. **Line endings** LF everywhere: yes / no.
6. **Review after the trial ends**: CodeRabbit free with a per-push `@coderabbitai review`; or the Claude review
   workflow on his subscription token; or paid CodeRabbit ($30 per developer per month) if its remarks proved useful.
7. **metavr server**: one project entry without npx (and legacy protocol if needed), or the CLI only.

## What to do first (in this order, each measured before the next)

1. No install: build `quest-look trace` (xr.debug over the DevTools socket) and run it with the "render nothing"
   test in one headset session, on his word, in VR: CPU- or GPU-bound decides everything after it.
2. IWER in the smoke test with stereo on: both eyes' draw calls and the controllers on every push.
3. `.gitattributes` LF for all text, then the Stop guard's "GitHub run green" check.
4. The rest by his answers above.

## Unverified (said plainly)

- IWER with A-Frame 1.7.1 and SwiftShader; ActionRecorder in the Quest Browser; a bot comment triggering CodeRabbit.
- `metavr perf capture/monitor --app com.oculus.browser`; Quest Browser accepting `Tracing.start` over the socket.
- That a binary start or legacy negotiation gives metavr's tools; the desktop app's Claude Code version.
- TypeScript 7 with JSDoc checking; the trial's end date (14 days from the day it started: not read here).
