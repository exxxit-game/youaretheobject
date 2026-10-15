# Reference: browser experiment frameworks (jsPsych, lab.js, PsychoJS) against Object's room contract

Read-only research. Budget used: 6 web searches, 12 fetches (limit reached).

**What I read myself**
- jsPsych: the docs pages "Plugin development" and "Data" (jspsych.org/latest), the raw files
  `/docs/overview/timing-accuracy.md` and `/docs/support/migration-v8.md`, and the full file tree of
  `jspsych/jsPsych` (main, 1163 paths, through the GitHub API).
- lab.js: the full file tree of `FelixHenninger/lab.js` (800 paths) and the paper: Henninger, Shevchenko,
  Mertens, Kieslich & Hilbig (2022), *lab.js: A free, open, online study builder*,
  Behavior Research Methods 54(2), 556–573, doi 10.3758/s13428-019-01283-5 (PMC9046347). I read
  the first 100,000 of about 103,000 characters, through a summarising fetch.
- PsychoJS: the README of `psychopy/psychojs`, its full file tree (278 paths) and the raw file
  `/src/data/ExperimentHandler.js` (483 lines; I grepped it and read the save section).
- Timing: Bridges, Pitiot, MacAskill & Peirce (2020), *The timing mega-study: comparing a range of
  experiment generators, both lab-based and online*, PeerJ 8:e9414 (PMC7512138). I read the first
  100,000 of about 117,000 characters, through a summarising fetch. peerj.com returned 403.
- Our side: ARCHITECTURE.md, docs/rooms.md, src/engine/log.js, src/engine/results.js,
  src/app/session.js, src/rooms/01-control/trials.js, tests/control-report.test.mjs,
  supabase/migrations/0003 and 0006 (grep).

**Unverified** (marked [U] below): anything that came only from search-result summaries (forum
threads, mirrors of old jsPsych docs), and anything I infer from a file name without reading the file.
Quotes from the papers went through a summarising fetch tool. Treat them as close to exact, but check
them against the PDF before citing any in the game (rule 20).

---

## 1. jsPsych (github.com/jspsych/jsPsych, v8)

**1. Packaging and the core.** One trial = one plugin. A plugin is a class with a static `info`
(parameters with types, a `data` description, a `version`), a constructor that receives the JsPsych
instance, and `trial(display_element, trial)`. The trial must "call `jsPsych.finishTrial()` when it is
done". In v8 an async `trial()` can return the data instead. Ending a trial "will automatically clear
the display element" and its pending timeouts (docs "Plugin development", sections *trial()* and
*When a plugin finishes*). The core is a timeline of nested trials:
`packages/jspsych/src/timeline/Timeline.ts`, `Trial.ts`. The repo holds 53 `plugin-*` packages
and 4 `extension-*` packages. Plugins reach shared services through `pluginAPI`
(`packages/jspsych/src/modules/plugin-api/`: KeyboardListenerAPI, TimeoutAPI, MediaAPI,
AudioPlayer, SimulationAPI).
*Compared with our contract:* their unit is a trial and ours is a whole experiment (`mount()` builds
scene, flow, report). Their plugins correspond to our engine/ui parts (choice, scale, sheet). Their
`pluginAPI` corresponds to "shared parts a room must not re-implement" in docs/rooms.md.

**2. Consent, instructions, debrief.** None of them is built into the core. There is
`plugin-instructions` (paged HTML) and `plugin-external-html`. The only consent material is an
example, `examples/external_html/simple_consent.html`. No file in the 1163 paths has "debrief" in
its name. All three are left to the author.

**3. Data.** "Plugins save data on their own" (docs "Data"). Each plugin documents its fields in
`info.data`, and in v8 "The version will be automatically included in the data" (Plugin
development, *static info*). Fields added to every trial: `trial_type`, `trial_index`, `time_elapsed`,
`internal_node_id` [U: from search summaries of mirrored 6.x/7.x docs, not the current page].
To add something to every trial, use `jsPsych.data.addProperties()`. The docs' own example shows how
to "generate a random subject ID with 15 characters". Saving goes to the author's server, as a PHP
file writer or MySQL. The page warns about the security risks of this and gives no guidance on
anonymity. Browser interaction data (focus, blur, fullscreen) has its own doc and test:
`/docs/overview/record-browser-interactions.md` and `packages/jspsych/tests/data/interactions.test.ts`
[U: contents not read].

**4. Timing.** `/docs/overview/timing-accuracy.md` says: if "a one or two frame (17-33ms) difference" in
display matters, take care. For best display timing it recommends Kuroki (2021), *A new jsPsych plugin for
psychophysics*, BRM 53, 301–310. On RT: "tend to be a little bit longer (10-40ms), but have similar
variance." It cites Bridges et al. 2020, Anwyl-Irvine et al. 2020, Pronk et al. 2020, Pinet et al. 2017,
de Leeuw & Motz 2016, Hilbig 2016 and Reimers & Stewart 2015. It warns the results may "not apply to current
versions of web browsers". For durations it recommends its own `pluginAPI.setTimeout()`, whose
timeouts "will be automatically cleared when the trial ends" (Plugin development, *Waiting for
specified durations*). Bridges et al. 2020 report, in Results, variability for jsPsych (and Testable) "in the range
3.2–8.4 ms in all configurations". I did not confirm whether that measure is RT or visual onset.

**5. Testing.** Jest. Core tests live in `packages/jspsych/tests/{core,data,pluginAPI,randomization,extensions}`,
for example `core/min-rt.test.ts`, `core/simulation-mode.test.ts` and `data/interactions.test.ts`.
There are also `.spec.ts` files next to the source (`timeline/Timeline.spec.ts`, `Trial.spec.ts`),
one `/src/index.spec.ts` per plugin, and a shared `packages/test-utils/src/index.ts`. Timing is
not tested automatically. It is checked with manual pages: `packages/jspsych/tests/timing-tests/square-flicker.html`,
`audio-input.html` and `calibration-timeline.js` [U: that they are run by hand with a photodiode
is my inference from the file types]. Plugins can also support a simulation mode,
`simulate()` with `"data-only"` or `"visual"` (Plugin development, *Simulation mode*).

**6. Languages.** No i18n module: none of the 1163 paths contains i18n, translat, locale or language.
Text is passed through each plugin's parameters (`pages`, `choices`, `button_label_next` and so on),
and the parameter names differ between plugins (`button_label` in one, `button_label_next` in another)
[U: from search summaries of plugin docs].

**7. Mistakes and regrets** (`/docs/support/migration-v8.md`). v8 was "a complete rewrite of the core library".
These were breaking changes:
- `conditional_function` was re-checked on every loop and is now checked once.
- `on_timeline_start` and `on_timeline_finish` used to run on every repetition.
- `timelineVariable()` was split into `evaluateTimelineVariable()`, and `getAllTimelineVariables()`
  was removed.
- `array: true` parameters now throw when they are not arrays, and `button_html` changed from a
  string to a function.
- Parameters missing from `info` are no longer evaluated: "Plugins should list all parameters in
  the `info` object."
- A missing `version` or `data` now gives a warning, and "In version 9.x, we plan to make this a
  requirement".
- `getAudioBuffer()` was removed.

The lesson they learned: a loose plugin contract that the core silently tolerated had to be broken later.

## 2. lab.js (github.com/FelixHenninger/lab.js)

**1. Packaging and the core.** A study is a tree of components, "building blocks that, together, make up a
study": screens (html or canvas), forms, sequences, loops and frames (paper). Code:
`packages/library/src/core/component.ts`, `flow/sequence.ts`, `flow/loop.ts`, `html/screen.ts`,
`html/form.ts`, `canvas/screen.ts`. Custom code hooks in when a component is prepared, runs or ends.
Components can be "prepared only just prior to its presentation" (tardy mode). Values pass through
`${ this.parameters.x }` and `${ this.state.x }`. Cross-cutting features are plugins, one per file:
`/src/plugins/` holds debug, download, fullscreen, log, metadata, navigationGuard, paradata,
postmessage, style, submit and transmit.
*Compared with our contract:* their component lifecycle (prepare, run, end) is close to our
`mount()` plus `data-room-state`. Their plugins work like our app layer (session, sending).

**2. Consent, instructions, debrief.** The paper does not discuss consent or debriefing. Instructions
are ordinary html screens or templates. All of it is left to the author.

**3. Data.** Logging "adds a line the instant a participant moves beyond it": one row per component,
with columns such as sender, sender_type, timing, responses, parameters and correct (paper). The offline
export saves a CSV at the end (`plugins/download.ts`). On a server, "Data are continuously sent
from the client", debounced (`plugins/transmit.ts`, `data/transmit/debounce.ts`,
`data/transmit/transmit.test.ts`). Participant ids come from forms or from the recruitment
service's URL. `util/random/uuid.ts` exists. The only anonymity measure in the paper is about the
study, not the people: paths "are obfuscated so as not to reveal the experiment's structure".
`plugins/paradata.ts` and `metadata.ts` exist [U: contents not read].

**4. Timing.** "all timer onsets are aligned to the browser's animation frame cycle". Durations come
from an adaptive frame-matching algorithm, not from setTimeout (paper). Code: `base/util/rAF.ts`,
`core/timing/timeout.ts`, `core/timing/shims.ts`. The validation is in the paper's appendix.
- Equipment: Nexys Video capture device, a Teensy 3.5 simulating responses, and a Logic Pro 8
  analyser at 50 MHz.
- Design: 100 stimuli each at 50, 100, 250, 500 and 1000 ms, on Windows 10, Ubuntu 18.10 and
  macOS 10.14, on modest machines at 60 Hz.
- Display: Chrome and Safari "always matched the intended stimulus duration exactly". Firefox was
  exact in over 98% of measurements and never more than 1 frame off. Edge was 2 or more frames off
  in 0.3% of measurements.
- RT: browsers "overestimate response latencies by between one and two frames" (16.7–33.4 ms).
  "The maximum sd we observed was 7.4 ms" (Edge, 1000 ms).
- The repo keeps the validation task: `tasks/Timing validation/timing-validation.study.json`. There
  is also a docs recipe, `/docs/recipes/timing-performance/index.rst` [U: not read].

**5. Testing.** Unit tests sit next to the code (`*.test.ts`): `core/controller.test.ts`,
`data/store.test.ts`, `flow/loop.test.ts`, `html/screen.test.ts`, `util/random/index.test.ts` and
others, with `core/test/helpers.ts`. The paper says "A set of automated tests run across multiple
browsers" runs on every change. CI: `/.github/workflows/build.yml` [U: contents not read]. Timing is
validated with external hardware, as above.

**6. Languages.** The paper does not discuss it, and the tree has no i18n path. Text lives inside each component.

**7. Mistakes, regrets and admitted limits** (paper).
- Keyboards and displays add lag and noise.
- The browser a participant uses may confound correlations between individual differences and absolute RTs.
- Chrome has a constant lag of about 1 frame on Linux and macOS.
- "A visual questionnaire builder for lab.js is currently under development."
- The repo has both `/src/base/` and `/src/core/`, each with `component.ts` and `controller.ts`
  [U: my reading is that a core rewrite is running beside the old one].

## 3. PsychoJS (github.com/psychopy/psychojs)

**1. Packaging and the core.** "The recommended approach to creating experiments is to use PsychoPy
Builder" (README). Builder exports a generated JS file plus index.html. There is no plugin
contract: a routine is generated code that calls the library. Core: `/src/core/PsychoJS.js`,
`Window.js`, `EventManager.js`, `Keyboard.js`, `ServerManager.js`. Flow: `/src/util/Scheduler.js`.
Trials: `/src/data/TrialHandler.js`. Data: `/src/data/ExperimentHandler.js`. Rendering: PIXI/WebGL
(`/src/util/Pixi.js`).
*Compared with our contract:* they have no contract, because the generator is the contract. We are hand-written, so our
contract has to be enforced by tests instead (we do this in `tests/structure.test.mjs`).

**2. Consent, instructions, debrief.** No consent or debrief module in `src/`. `/src/visual/Form.js`
and `Survey.js` exist and could hold them [U]. Left to the author and the hosting platform (Pavlovia).

**3. Data** (`/src/data/ExperimentHandler.js`).
- Recording: `addData(key, value)` within a trial, then `nextEntry()`.
- `save()` writes either CSV or a database (`SaveFormat.CSV` / `DATABASE`). On the server, while
  `status === "RUNNING"` and with no `__pilotToken`, it calls `serverManager.uploadData(...)`.
  Otherwise it calls `util.offerDataForDownload(...)`, a local download (lines 325–339).
- The file name is `${participant}_${expName}_${datetime}` (line 95), and database rows carry
  `__participant`, `__session` and `__datetime` (lines 354–356). The participant field is
  whatever the author puts in. The library does nothing to make it anonymous.
- Forum threads ask how to avoid IP addresses being recorded. One reply recommends a pseudonymous id
  with personal data kept elsewhere [U: forum, not official]. `saveIncompleteResults` "isn't
  guaranteed" to work [U: forum summary].

**4. Timing.** Bridges et al. 2020 is the PsychoPy team's own study: PsychoJS is their product.
- Method: Black Box Toolkit v2, a photodiode, a robotic key actuator on a 1 kHz button box, and 1,000
  trials per run, "from over 110,000 trials" in total.
- PsychoJS RT precision is "under 3.5 ms in all" browsers. "most of the packages achieved precision
  at least under 10 ms in all browsers".
- Online visual onset lag could not be measured, because a browser cannot send a hardware trigger.
- "Linux often performed poorly in these tests". "no online system can yet provide audio stimuli with
  precisely timed onsets".
- Advice: "we consider constant lags of lesser importance than variability". A constant lag "is
  canceled out by taking a difference". Comparing absolute online RTs between participants is unwise.
  "We stress the importance of scientists making their own timing validation measurements."

**5. Testing.** In 278 paths there is a single unit test file, `/src/util/Util.test.js`, plus the
workflows `.github/workflows/Automated Test (short).yml` and `Automated Test (full).yml`
[U: what they run was not read; a search found nothing about them]. The README shows only their badges.

**6. Languages.** No i18n in the library tree. Text sits in Builder components. A forum thread shows
Japanese text turning into "?" because of the file encoding [U: forum].

**7. Mistakes and regrets** (in the code).
- The save routine has a commented-out block headed "INCORRECT: since new attributes can be added
  throughout the participant session, we need, currently, to upload the whole result data, on each
  call to save" (lines 306–314). The whole result is re-uploaded on every save.
- `// TODO only save the given attributes` (line 316): the documented `attributes` option of `save()`
  is ignored.
- Audio–visual synchrony is weak online (Bridges 2020). Partial results are not reliably saved [U].

---

## What we do the same, what to take, what to avoid

| | Point | Evidence (theirs) | Ours |
|---|---|---|---|
| **Same** | One timestamped event log per run; measures derived by a pure function | lab.js logs one row per component the instant it ends (paper). jsPsych "Plugins save data on their own" | `src/engine/log.js` (`performance.now`, seconds since begin) and `report.js analyse(log)`, pure (docs/rooms.md) |
| **Same** | Version travels with every result | jsPsych v8 includes the plugin version in the data automatically (Plugin development, *static info*) | `ROOM_VERSION` in `src/rooms/01-control/room.js:44` and `p_version` in `submit_run` (migration 0003) |
| **Same** | Pilot and test runs never reach the data | PsychoJS skips upload when `__pilotToken` is set (ExperimentHandler.js 329–333) | `PREVIEW` and `SPEED !== 1` never send (`src/app/session.js`) |
| **Same** | Shared services, not re-implemented per experiment | jsPsych `pluginAPI` (keyboard, timeouts, audio); lab.js `/src/plugins/` | engine/ui choice, scale, sheet; "must not re-implement" list in docs/rooms.md |
| **Same** | Leaving or switching away is tracked | jsPsych `record-browser-interactions.md` plus `interactions.test.ts` [U] | `src/engine/away-meter.js` |
| **We go further** | Consent and debrief are built in and shared | Left to the author in all three: jsPsych has only `examples/external_html/simple_consent.html`, lab.js's paper is silent, PsychoJS has no module | `runLobby()` consent and shared reveal (docs/rooms.md, ARCHITECTURE.md data flow) |
| **We go further** | No participant id at all | jsPsych's example makes a random subject id. PsychoJS names the file `participant_expName_datetime` and stores `__participant` | `results.js`: room, version, first/repeat, numbers only; insert-only whitelist |
| **We go further** | Text kept separate from logic | All three put text inside plugin parameters or components; jsPsych label names differ per plugin [U] | `texts.ru.js` per folder (CLAUDE.md rule 4) |
| **Take** | Declare each room's result fields (name, type) in one place. A test checks that `analyse()` output and the SQL whitelist both match it | jsPsych `info.data` plus v8 strictness: "Plugins should list all parameters", required in 9.x (migration-v8.md) | `report.js` output and migration 0005 are separate, and nothing ties them together |
| **Take** | Stamp stimulus onset at the frame that shows it, and measure display durations in frames | lab.js: onsets "aligned to the browser's animation frame cycle", frame-matching "instead of setTimeout" (paper; `base/util/rAF.ts`). jsPsych: 1–2 frame (17–33 ms) display error (timing-accuracy.md) | `trials.js` stamps `t0` when the lamp is switched and ends the window by a 10 ms `setInterval` poll. That is fine for room 01, whose measure is press or no press inside the window, but wrong for a future RT room. In WebXR the frame time is the XRFrame time in the render loop |
| **Take** | A timer registry per room, cleared automatically at end, pause and leave | jsPsych `pluginAPI.setTimeout()`: "automatically cleared when the trial ends" | `trials.js` uses raw `setInterval`s guarded by a `stopped` flag |
| **Take** | Data-only simulation: generate many synthetic runs from `protocol.js` and push them through `analyse()` and the reveal | jsPsych `simulate()` with `"data-only"` (Plugin development, *Simulation mode*; `/tests/core/simulation-mode.test.ts`) | `tests/control-report.test.mjs` uses a few hand-written logs. The smoke test plays one run at 20× |
| **Take** | Our own timing check on the real device before any RT claim, kept in the repo; show players only within-player differences | Bridges 2020: "make their own timing validation measurements" and lag cancels in differences. lab.js keeps `tasks/Timing validation/…study.json`. jsPsych keeps `/tests/timing-tests/square-flicker.html` | `tools/quest-look.mjs` measures the frame rate but not input-to-log latency. `compare_room` (0006) compares ratings and press counts, not RT: keep it so |
| **Avoid** | A loose contract the core silently tolerates, which must be broken later | jsPsych v8 was "a complete rewrite of the core library", with semantics changed (conditional_function, on_timeline_*), undeclared parameters dropped, types made strict | Keep the room contract checked by `tests/structure.test.mjs` from the start; add the result-field schema above |
| **Avoid** | Options that silently do nothing, and re-sending everything on each save | PsychoJS `save({attributes})` ignored (`// TODO only save the given attributes`); "INCORRECT" note: whole data re-uploaded each save | `results.js` sends once per finished room with `keepalive`. Keep it that way, and fail loudly in tests on an unknown option |
| **Avoid** | Precise measures that hang on audio onset or `setTimeout` | Bridges 2020: "no online system can yet provide audio stimuli with precisely timed onsets". lab.js and jsPsych both move display timing to frames | Voice and sound stay narrative. No measured interval starts from a sound or a timer callback |
| **Avoid** | Absolute RT compared between players and devices | Bridges 2020 Conclusions: between-participant comparisons of absolute online RTs are unwise. lab.js: the browser may confound individual differences | Any future "you vs others" on speed must compare each player's differences, not raw milliseconds |
| **Avoid** | Keeping partial data from people who quit | PsychoJS `saveIncompleteResults` "isn't guaranteed" and a forum argument that withdrawn participants' data should not be used [U: forum]. lab.js streams continuously | We send only at the finish, with consent. Keep it |
