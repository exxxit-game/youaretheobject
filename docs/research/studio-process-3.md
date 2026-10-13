# How game studios work, part 3: performance, QA, documentation, pipeline

Third file of docs/research/studio-process.md (the question, the marks and the index are there). Marks:
**[read]** opened and quoted; **[book]** read in objekt-files/books (page given); **[unverified]** not confirmed.

### Part 3. Performance: budgets, baselines, repeated runs

- **Meta's workflow for WebXR performance** [read 13.10.2026] — Meta, "WebXR performance optimization
  workflow", last updated 2026-07-21, https://developers.meta.com/horizon/documentation/web/webxr-perf-workflow/.
  Steps in order: (1) set a frame budget from the target rate (listed: "60 FPS = 16.6 milliseconds per frame",
  "72 FPS = 13.7 milliseconds per frame", "90 FPS = 11.1 milliseconds per frame"; 1000/72 is 13.9, so the 72 line
  is Meta's rounding slip, as docs/research/vr/01-meta.md already notes); (2) measure frame time on device with the OVR Metrics Tool's Performance HUD (or MQDH logs
  and metrics); (3) CPU- or GPU-bound: temporarily disable all rendering: "If the app's framerate is not affected
  or affected very little when not rendering anything, the app is likely CPU bound"; (4) if GPU-bound, set the
  render scale very low (e.g. 0.01): no change means vertex-bound, a gain means fragment-bound; (5) fix the
  bottleneck: CPU: Chrome Tracing ("Any app logic that takes longer than two milliseconds should be considered
  for optimization."), fewer draw calls
  (merge meshes, multiview, instancing); vertex: simpler meshes, LOD, batching; fragment: RenderDoc for Oculus
  (Performance Counter Viewer by GPU duration), cheaper materials, fewer lights, compressed textures (ETC/ASTC),
  FFR, framebuffer scale as a last resort; (6) "Iterate", since fixing one bottleneck can expose another. The
  page says nothing on repeated runs, warm-up or heat.
- **Per-device budgets and the store floor** [already verified in docs/research/vr/01-meta.md, sections 8, 10 and 13]:
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
  The page gives no test length, no run count, no ambient temperature. The length is in Meta's frame-rate check
  itself: VRC.Quest.Performance.1 (last updated 2025-10-22), test step 1: "Use the app for the length of the
  content or 45 minutes, whichever is shorter." [read 13.10.2026]
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
  before building (Quest 2: 100 draw calls, 750K triangles, 13.9 ms at 72 fps), measured on the device and never
  only on the laptop; a warm-up excluded from every measure and several samples with an outlier rule (Unity's
  defaults are a published starting point: 80 ms or 3 frames of warm-up, 2% margin at 99%); and a separate
  long-session run (45 minutes or the content's length, as Meta's own check), because Meta names start-only
  profiling the most common shipping mistake. Since an app only hints its CPU and GPU levels and the system sets
  them (Meta, "CPU and GPU levels", essentials/cpu-gpu-levels; Android's clock locking needs a rooted device), the
  state of the device (cold or warm, the levels shown by the OVR Metrics Tool) must be recorded beside each number.

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

- **A VR studio's own measuring method on Quest 2** [read: the talk from its own captions, and the article] —
  Ben Hopkins (principal graphics engineer, Owlchemy Labs), "Building Big Games on Little Headsets", GDC 2023,
  Future Realities Summit, https://gdcvault.com/play/1029093/Future-Realities-Summit-Building-Big (tagged "free
  content"; its captions saved by tools/gdc-captions.mjs: objekt-files/notes/gdc-talks/2023-owlchemy-building-big-
  games.txt). The Vault's overview names only SplatTech, but the talk's first half, 01:00–03:00, is the A/B test
  framework: RenderDoc's timings "are all relative", so they "use Meta's metric API to get the GPU time" and run
  tests "deterministically on device. For this, we disable head tracking and Fixed Foveated Rendering, and we make
  sure that every test is duplicated, other than the things that we're actually trying to get timing for"; "Every
  frame, we record the GPU time, we calculate the average, store the results in a JSON file". Takeaways (30:00):
  "use methodical deterministic testing to keep yourself honest"; "if the tools you need don't exist, write
  them." The same framework in his Featured Blog on Game Developer, 11 Apr 2023,
  https://www.gamedeveloper.com/production/building-big-games-on-little-headsets (it does not mention the talk):
  "Disable all head tracking and fix foveated rendering" (the talk says FFR disabled, the article fixed: they
  differ); each test "Several seconds later" switched off; "Calculate the min, max, and average AppGPUTime"; "Write
  test results to a JSON file on the device"; "the goal is for all tests to be deterministic and identical except
  for the element you want to profile and compare". Run counts: not given in either.
- For us: this is the practice a studio uses to settle "is A cheaper than B" on the headset: the same view (head
  tracking off), foveation held, one change at a time, numbers saved on the device, every claimed optimisation
  proven by such a run. What we have is different: tools/measure.mjs (committed in c61ab96, mended in 180b5a5, 0b26ea7, e66dbcf) walks
  the game as a player does and records the head's pose rather than fixing it, so it is a baseline, not an A/B
  test; the A/B run is still missing. Whether a WebXR page can hold the view still while the headset tracks: not
  checked.

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
  change, there from the start (as Sea of Thieves was built) and catching a bug as it is written (Mojang's aim),
  which the agent owns entirely. (2) Playtests, which test the
  design and fun on people who are not us (the 5–10 testers), with behaviour watched rather than opinions asked.
  (3) Certification against the VRCs, done as our own checklist long before submission, then an ALPHA channel
  for the testers, then RC, then the store, with two weeks kept for review.

- **Bug severity and triage: no authoritative game standard found** [not found] — one search (13.10) gave
  only tool vendors' and QA-outsourcers' blogs (blocker / critical / major / minor / cosmetic, or P0–P3, and the
  split between severity, how bad, and priority, how urgent); a forum post says the A/B/C classes are shared by
  teams and console makers but have no official definition. None opened; all unverified. Filament's gold gate
  above uses A–E classes without defining them. The one definition found in a book is of class A only, in
  contract wording [book] — Dan Irish, *The Game Producer's Handbook* (Thomson Course Technology, 2005, first
  edition), p. 265 (objekt-files/books/irish-2005-producers-handbook.txt, lines 10968–10974): "An A bug means (1) a
  repeatable phenomenon of unintended events or any action occurring during the running of the product that
  results in the product being rendered partially or completely nonfunctional; (2) a failure of the product to
  conform to the specifications in the Design and Technical Design Documentation; (3) a detriment to the visual
  representation, sound, or function of the version; or (4) the destruction, disruption, or corruption of a data
  system, storage device, or mechanism." Classes B and C: not in the book.
- **The producer's QA practice, 2005** [book] — Irish, pp. 263–268: "'Fix bugs as we go' should be the mantra"
  (line 10893); "Track bugs early." and "Ensure that an autobuild system is in place." (10918, 10922); "Develop a
  prioritized bug list" (11122); "Development testing should be considered separate from play testing." (11021);
  playtests with "trusted individuals not involved in the game's development and representative of the principal
  demographic" (11038–11040); platform makers "will often reject a product several times before it passes their
  final QA process" (11112–11115). Holds in 2026 (the autobuild is our GitHub run, the platform check Meta's VRC
  review); the console names and the disc are aged.
- For us: until a primary source is found, a plain rule from what the sources share: a bug that stops play,
  loses data or breaks comfort blocks a release; the rest is ordered by how many players meet it.

### Part 5. Documentation

- **The design doc is rarely updated** [read] — Politowski et al. 2021 (above, §4.5): the
  GDD "is also rarely updated during the projects' life and the game design visions change regardless of the
  definitions contained within it." Washburn et al. 2016 (above): Splinter Cell's pre-production TDDs held "all
  the knowledge we gleaned from our prototype"; Operation Flashpoint, with no record, lost "hours ... trying to
  investigate how something had originally been meant to work"; and the opposite failure: Big Motha Truckers'
  documentation, written also as in-house marketing, dwelt on "the 'whos' and the 'wheres'" instead of "the
  'hows' and 'whys'".
- **One-page designs instead of a design bible** [read; a commentary piece about the talk; the talk is free on
  the Vault ("free content") but not watched] — Danielle Riendeau, "'The goal of design is to efficiently communicate ideas'", Game Developer,
  16 Jul 2026, https://www.gamedeveloper.com/design/-the-goal-of-design-is-to-efficiently-communicate-ideas- :
  Stone Librande's single-page format answers thick "design bibles" and the "disconnected nature of design
  wikis". (Talk: Stone Librande, "One-Page Designs", GDC 2010, https://gdcvault.com/play/1012356, not watched.)
- **Keep the design and the technical notes to the build** [book] — Irish 2005: "A design document should be
  updated to reflect the actual state of the game at the present time." (p. 157, line 7099–7100); "Don't mark a
  task as complete on the schedule until the technical design documentation has been updated to reflect how the
  game feature was implemented." (p. 159, lines 7196–7198); and, quoting Cerny, "the single worse thing that you
  can do to kick off your Pre-production (phase) is to sit down and write a 100-page design document." (p. 156,
  lines 7052–7053). Holds; the wiki he names as the tool is aged (ours is the repository).
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
  with its reason and a "superseded" mark instead of deletion. Ours only half do it: docs/decisions.md keeps
  "Three lines each: what, why, consequence" but has no status and no "superseded" mark; docs/owner-decisions.md
  holds only the decision in force, one line each ("a change comes only from the owner"), and his earlier words
  stay in its history files, not marked in the line itself. The rule that keeps docs true is mechanical: the doc changes in the same commit as the code
  it describes (Google; Irish: a task is not complete until its technical note is), and a dead doc is deleted.

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

