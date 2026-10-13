# How game studios work, part 3: performance, QA, documentation, pipeline

Third file of docs/research/studio-process.md (the question, the marks and the index are there). Marks:
**[read]** opened and quoted; **[book]** read in objekt-files/books (page given); **[unverified]** not confirmed.

### Part 3. Performance: budgets, baselines, repeated runs

- **Meta's workflow for WebXR performance** [read 13.10.2026] — Meta, "WebXR performance optimization
  workflow", last updated 2026-07-21, https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/.
  Steps in order: (1) set a frame budget from the target rate (table: "60 FPS 16.6 ms", "72 FPS 13.7 ms",
  "90 FPS 11.1 ms"); (2) measure frame time on device with the OVR Metrics Tool's Performance HUD (or MQDH logs
  and metrics); (3) CPU- or GPU-bound: temporarily disable all rendering: "If the app's framerate is not affected
  or affected very little when not rendering anything, the app is likely CPU bound"; (4) if GPU-bound, set the
  render scale very low (e.g. 0.01): no change means vertex-bound, a gain means fragment-bound; (5) fix the
  bottleneck: CPU: Chrome Tracing, "optimizing any app logic that takes longer than 2 ms", fewer draw calls
  (merge meshes, multiview, instancing); vertex: simpler meshes, LOD, batching; fragment: RenderDoc for Oculus
  (Performance Counter Viewer by GPU duration), cheaper materials, fewer lights, compressed textures (ETC/ASTC),
  FFR, framebuffer scale as a last resort; (6) "Iterate", since fixing one bottleneck can expose another. The
  page says nothing on repeated runs, warm-up or heat.
- **Per-device budgets and the store floor** [already verified in docs/research/vr/01-meta.md, lines 140–173]:
  VRC.Quest.Performance.1 (required) "Apps must maintain a rendering rate of at least 60 fps"
  (https://developers.meta.com/horizon/resources/vrc-quest-performance-1/); Meta's device comparison (2026-05-11,
  https://developers.meta.com/horizon/resources/device-optimization-comparison/): Quest 3 under 200 draw calls
  and 1.5M triangles, Quest 2 under 100 and 750K; VRC.Quest.Performance.3: head-tracked graphics "within 4
  seconds of launch or provide a loading indicator in VR"; Performance.4 (recommended) "no less than 85% render
  scaling".
- **Heat: test the long session, on the device** [read] — Meta, "Thermal management", last updated 2026-09-15,
  https://developers.meta.com/horizon/essentials/thermal: "Build for the long session, not the demo."; "The most
  common shipping mistake is profiling only startup and missing the thermal cliff at minute ten."; "If your app
  feels great for the first three minutes and then visibly degrades, you are running near the thermal
  ceiling."; "Test on the device, not the simulator."; "Thermal behavior is hardware-dependent — only on-device
  profiling reveals the real envelope." Stages: CPU/GPU levels hold a steady envelope; "When sensors approach a
  threshold, the system reduces clock speeds"; past a hard limit, a cool-down state with a notice to the user.
  The page gives no test length, no run count, no ambient temperature.
- **How an engine vendor automates repeated measures** [read] — Unity, Performance Testing package 3.2,
  https://docs.unity3d.com/Packages/com.unity.test-framework.performance@3.2/manual/index.html and
  .../measure-frames.html: the package "extends Unity Test Framework with performance testing capabilities" and
  records build and player settings so results can be compared across hardware. `Measure.Frames`: "a default
  warmup is executed for 80 ms or until at least 3 full frames have rendered, whichever is longest", then frames
  for about 500 ms; with `DynamicMeasurementCount` "Statistical outliers will not be taken into account unless
  different behaviour is specified", default margin of error 2% at 99% confidence (per the page).
- **Android (Quest's base) on unstable clocks** [read] — Android Developers, "Microbenchmark", last updated
  2026-05-19, https://developer.android.com/topic/performance/benchmarking/microbenchmark-overview: "Clocks on
  mobile devices dynamically change from high state, for performance, to low state, to save power or when the
  device gets hot. These varying clocks can make your benchmark numbers vary widely"; "Locking clocks is the best
  way to get stable performance" (needs a rooted device); otherwise the library detects throttling and "pauses
  execution to let the device cool down and then retries the current benchmark."
- For us: a studio's performance practice has three parts we can copy exactly: a budget per device written
  before building (Quest 2: 100 draw calls, 750K triangles, 13.7 ms at 72 fps), measured on the device and never
  only on the laptop; a warm-up excluded from every measure and several samples with an outlier rule (Unity's
  defaults are a published starting point: 80 ms or 3 frames of warm-up, 2% margin at 99%); and a separate
  long-session run, because Meta names start-only profiling the most common shipping mistake. Since clocks
  cannot be locked on a retail Quest, the state of the device (cold or warm, CPU/GPU level shown by the OVR
  Metrics Tool) must be recorded beside each number.

- **How many runs, and what to report: the benchmarking method** [read] — A. Georges, D. Buytaert, L. Eeckhout,
  "Statistically rigorous Java performance evaluation", OOPSLA '07, pp. 57–76; copy
  https://dri.es/files/oopsla07-georges.pdf (saved: objekt-files/papers/georges-2007.txt). Reporting the best
  run, or one number, "can be misleading, and can even lead to incorrect conclusions"; only "4 out of 50"
  surveyed papers gave confidence intervals. Method: separate start-up from steady state; for start-up "take
  multiple measurements where each measurement comprises one VM invocation and a single benchmark iteration",
  for steady state collect numbers "once performance reaches steady-state, i.e., after the start-up phase", and
  in both "compute confidence intervals across these measurements" (multiple process launches, not only
  repeats inside one). The paper treats n ≥ 30 and n < 30 separately (Student's t for small n). (Java, not a
  browser; the method transfers because a browser page with a JIT and a garbage collector has the same kinds of
  run-to-run noise. That transfer is our inference.)
- For us: a number we act on comes from several fresh page loads (not one long run), each with its warm-up cut
  off, reported as a mean with a confidence interval (or median and range), with the cold start measured as its
  own thing; a change counts as better only when the intervals do not overlap.

- **A VR studio's own measuring method on Quest 2** [read] — Ben Hopkins (Principal Graphics Engineer,
  Owlchemy Labs), "Building Big Games on Little Headsets", Game Developer, 11 Apr 2023,
  https://www.gamedeveloper.com/production/building-big-games-on-little-headsets (written from their GDC 2023
  talk, https://gdcvault.com/play/1029093/Future-Realities-Summit-Building-Big, members-only, not watched).
  RenderDoc's timings are "relative to one another and not necessarily reflective of real-world cost", so they
  built an A/B Test Framework: at runtime head tracking is disabled and foveation fixed, all test objects are
  turned off, then each test is turned on in turn for several seconds while AppGPUTime is recorded every update;
  min, max and average go to a JSON file on the device; tests must be identical except for the one thing compared
  (per the article; run counts not given). Motto: "If it doesn't exist, build it!"; advice: "prove that any
  optimization has a positive impact."
- For us: this is the practice a studio uses to settle "is A cheaper than B" on the headset: the same fixed
  view, the same seconds, one change at a time, numbers saved on the device, every claimed optimisation proven by
  such a run. Our tools/quest-look.mjs perf and the new tools/measure.mjs (in the working tree, uncommitted on
  13.10) are the start of it; whether they fix the view and compare one change at a time: unverified (not read in
  full for this report).

- **Budgets enforced by the build, for a web app** [read] — Milica Mihajlija, "Performance budgets 101",
  web.dev, last updated 2018-11-05, https://web.dev/articles/performance-budgets-101: a budget is "a set of limits
  imposed on metrics that affect site performance"; three kinds: quantity-based (file sizes, counts), "useful in
  the early stages of development"; milestone timings (load events); rule-based scores (Lighthouse). Put the
  budgets in the build pipeline (Lighthouse CI and similar named); when a budget is exceeded the choices are to
  optimise the feature or asset, remove it, or not add it.
- For us: what a CI machine without the headset's GPU can hold honestly is the countable part (draw calls per
  view in both eyes, triangles, texture sizes, download size, page errors); its frame times say nothing about a
  Quest (our inference: GitHub renders with SwiftShader, a CPU renderer, tests/smoke.mjs), so timings are held
  on the headset by the repeated-run method above. An exceeded budget has three answers only:
  make it cheaper, remove it, or do not add it.

### Part 4. QA, playtests, certification

- **Playtests are experiments on the design, not bug hunts** [read, project library] — Mike Ambinder (Valve),
  "Valve's Approach to Playtesting: The Application of Empiricism", GDC 2009 slides,
  https://cdn.fastly.steamstatic.com/apps/valve/2009/GDC2009_ValvesApproachToPlaytesting.pdf (text:
  objekt-files/papers/ambinder-2009.txt). Slide 5: "Game designs are hypotheses -> Playtests are experiments ->
  Evaluate designs off playtest results -> Repeat"; slide 6: "Playtesting Goal: Fun; Not bug testing; Not game
  balancing; DEFINITELY not focus testing"; slide 8: "Get data early, get data often"; slide 16: "Importance of
  what people do - not what they say"; slide 35 on stats: "Averages hide extreme examples".
- **Two kinds of user test at Microsoft Game Studios** [read, project library] — R. Pagulayan et al.,
  "User-centered design in games" (Handbook of HCI, 2003 draft; objekt-files/papers/pagulayan-2003.txt, p. 18–19
  and the playtest section): usability tests find where "the designers' intentions don't match the users
  expectations", while fun and challenge are measured by a survey "Playtest" on larger samples; their formative
  playtests are "the critical facet test and the initial experience test", plus benchmark tests for comparison.
- **Automated gameplay tests from day one** [read; description pages only, talks not watched] — Robert Masella
  (Rare), "Automated Testing of Gameplay Features in 'Sea of Thieves'", GDC 2019, free video,
  https://gdcvault.com/play/1026366/Automated-Testing-of-Gameplay-Features: "Automated testing of gameplay
  features has traditionally not been embraced by the industry"; "Sea of Thieves however was created with
  automated testing for gameplay from the start." Henry Golding (Mojang), GDC 2021,
  https://gdcvault.com/play/1027345/Lessons-Learned-in-Adapting-the: "relying on manual testing is becoming
  increasingly inefficient, time consuming and ineffective"; the aim is "a safety net that catches bugs as soon as
  they are written". Jessica Baker (Rare), Unreal Fest Europe 2019,
  https://www.unrealengine.com/events/unreal-fest-europe-2019/automated-testing-at-scale-in-sea-of-thieves
  (opened in the browser): automated testing "to deliver Sea of Thieves as a constantly changing service". Test
  counts and types from the talks themselves: unverified (videos not watched).
- **Research on how studios test** [abstracts only; numbers not used] — E. Murphy-Hill et al.,
  "Cowboys, ankle sprains, and keepers of quality: how is video game development different from software
  development?", ICSE 2014 (interviews and a survey): game developers hesitate to automate tests
  because tests go stale as designs change; Politowski et al., "A survey of video game testing", AST 2021: game
  developers "rely, almost exclusively, upon manual play-testing" (from the abstract, via Consensus).
- **Certification and release on Meta's store** [read 13.10.2026] — Meta, "Submitting your app", last updated
  2026-05-08, https://developers.meta.com/horizon/resources/publish-submit/: review checks the VRCs (different
  for 2D and immersive apps), technical, content and privacy policies, and assets; "plan to submit your app for
  review at least two weeks in advance of your target launch date"; in crowded genres "review may be concluded
  upon the first identified guideline violation"; "it is strongly recommended to consult and follow the Meta
  Quest Virtual Reality Check (VRC) guidelines prior to submission". Meta, "Release Channels", last updated
  2026-03-23, https://developers.meta.com/horizon/resources/publish-release-channels/: ALPHA, BETA and RC
  channels, invite-only by default, 200 users per channel by default (up to 2,500 on request); new channels start
  with no users, "not even yourself"; "all uploaded apps, even alpha builds, must meet the release packaging
  requirements"; a build proven on a test channel is copied to Production and submitted for review.
- For us: QA in a studio is three separate things, and we need all three. (1) Automated tests that run on every
  change, written with the feature (Rare's rule), which the agent owns entirely. (2) Playtests, which test the
  design and fun on people who are not us (the 5–10 testers), with behaviour watched rather than opinions asked.
  (3) Certification against the VRCs, done as our own checklist long before submission, then an ALPHA channel
  for the testers, then RC, then the store, with two weeks kept for review.

### Part 5. Documentation

- **The design doc is the document most often left stale** [read] — Politowski et al. 2021 (above, §4.5): the
  GDD "is also rarely updated during the projects' life and the game design visions change regardless of the
  definitions contained within it." Washburn et al. 2016 (above): Splinter Cell's pre-production TDDs held "all
  the knowledge we gleaned from our prototype"; Operation Flashpoint, with no record, lost "hours ... trying to
  investigate how something had originally been meant to work"; and the opposite failure: Big Motha Truckers'
  documentation, written also as in-house marketing, dwelt on "the 'whos' and the 'wheres'" instead of "the
  'hows' and 'whys'".
- **One-page designs instead of a design bible** [read; a news article about the talk, the talk itself
  members-only] — Danielle Riendeau, "'The goal of design is to efficiently communicate ideas'", Game Developer,
  16 Jul 2026, https://www.gamedeveloper.com/design/-the-goal-of-design-is-to-efficiently-communicate-ideas- :
  Stone Librande's single-page format answers thick "design bibles" and the "disconnected nature of design
  wikis". (Talk: "One-Page Designs", GDC 2010, https://gdcvault.com/play/1012356, not watched.)
- **Decision records** [read] — Michael Nygard, "Documenting Architecture Decisions", 15 Nov 2011,
  https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions: "One of the hardest things to
  track during the life of a project is the motivation behind certain decisions." Each record: Title, Context,
  Decision ("We will ..."), Status (proposed, accepted, deprecated, superseded), Consequences; kept "in the
  project repository"; "If a decision is reversed, we will keep the old one around, but mark it as superseded";
  "The whole document should be one or two pages long."
- **Keeping docs true to the code** [read] — Google, "Documentation Best Practices",
  https://google.github.io/styleguide/docguide/best_practices.html: "A small set of fresh and accurate docs is
  better than a large assembly of 'documentation' in various states of disrepair."; "Change your documentation
  in the same CL as the code change"; "Dead docs are bad."; "Default to delete or leave behind if migrating."
- For us: studios keep three kinds of document, each short: a one-page design per room or system (what the
  player does, in a picture), a technical note per system written from the prototype, and a decision record
  with its reason and a "superseded" mark instead of deletion (our docs/decisions.md and
  docs/owner-decisions.md play this part). The rule that keeps them true is mechanical: the doc changes in the
  same commit as the code it describes, and a dead doc is deleted, not kept.

### Part 6. Tools and pipeline

- **Version control even for one person** [book] — Gregory, *Game Engine Architecture*, 4th ed., vol. 1 (2026),
  §2.1.1, p. 60 (page from the text copy's page marks; objekt-files/books/gregory-2026-4th-vol1.txt, lines
  1684–1690): version control keeps a history, tags versions, and allows branches "often used to produce demos or
  make patches"; "A source control system can be useful even on a single‑engineer project." Git: "very easy to use
  on a one‑person software project, because there's zero server set‑up"; Perforce "is used by many game
  companies, including Naughty Dog and Electronic Arts" (§2.1.2, line 1701–1702).
- **One source of truth for assets** [book] — same book, §1.6.2 "The Asset Conditioning Pipeline", p. 52, and
  §1.6.4 "The Resource Database", p. 56: the formats of content tools (DCC apps) "are rarely suitable for direct
  use in‑game", so studios convert them in a pipeline; and "Every game engine requires some kind of database to
  manage all of the metadata associated with the game's assets", which may be "a collection of text files,
  managed by a revision control system such as Subversion, Perforce or Git".
- **Small batches on one main line** [read] — DORA (Google Cloud's research programme), "Capabilities:
  Trunk-based development", https://dora.dev/capabilities/trunk-based-development/: work in small batches merged
  into trunk at least daily; branches last "no more than a few hours"; three or fewer active branches; "No code
  freezes when no one can submit code"; DORA's 2016 and 2017 data linked these practices to higher delivery
  performance (per the page).
- **Release ladder on Meta's store** [read, see Part 4]: ALPHA, BETA, RC channels, then Production after review.
- For us: what studios do maps onto what we have: git is the one source of truth for code, docs and the asset
  list (each asset's source, licence and conversion settings beside it, as Gregory's resource database);
  Blender files are converted by a scripted pipeline, never by hand; short-lived branches merged often (a power
  cut loses at most hours), main only as a release; a build goes alpha channel, then RC, then the store.

