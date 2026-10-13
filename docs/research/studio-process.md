# How game studios work, and what it means for us

The owner's request (13.10.2026, translated): find out how game studios do it, since they have a clear
process for all of this; we are at step 0 and cannot move until it is clear how to move, where to, with what
(the engine, the wiring, the fuel). Asked of the deep-research agent on 13.10.2026. Sharpened by him the same
day: the aim is to set up our own two-member studio (him and an AI coding agent) so each does what he does best
and they cover each other fully; studio practice is the base, the human + agent team is part 8.

Marks: **[read]** the page or file was opened and the quote is in it; **[book]** read in a book in
objekt-files/books (page given); **[unverified]** not confirmed from a primary page. "For us" lines are
the implication for a two-member team (the owner, who decides and judges; an AI agent, who writes all code)
making a WebXR game (A-Frame 1.8.0, no build step) for Meta Quest.

## The parts (each gets an answer or "not found")

1. Stages from idea to release and after (concept, pre-production, vertical slice, production, alpha/beta,
   certification, launch, live ops): what each must produce before the next (gates, definition of done).
2. Roles in a studio and which duties a one-person team plus an AI agent must still cover; how small and
   solo teams cover them.
3. Performance: budgets per device, baselines, repeated runs and statistics (runs, means, variance, warm vs
   cold), automated performance tests in CI, profiling tools and when; Meta's Quest guidance (VRC
   performance requirements, frame-time targets, workflow).
4. QA: test plans, regression, playtests, bug triage and severity, certification checklists (Meta VRC).
5. Documentation: GDD vs living docs, technical design docs, decision records, keeping docs true to the build.
6. Tools and pipeline: version control, branching and releases, asset pipeline, build/CI, one source of truth.
7. What postmortems say goes wrong most often and what fixed it.
8. (Added by the owner, 13.10, same priority) Human + AI-agent teams: what AI coding agents do reliably and
   where they fail (studies; Anthropic's own guidance on Claude Code and agents), what stays with the human
   (judgement, taste, feel, wearing the headset, payments, accounts, decisions), how solo developers working
   with AI agents organise work (experience reports with visible authors), human-in-the-loop practice
   (review gates, verification, hand-off). The aim: set up OUR two-member studio so each does what he does
   best and they cover each other fully.

## The files of this report

- docs/research/studio-process.md (this file): the question, the parts, and Parts 2 (roles), 7 (postmortems),
  1 (stages and gates).
- [docs/research/studio-process-2.md](studio-process-2.md): Part 8, the human + AI-agent team.
- [docs/research/studio-process-3.md](studio-process-3.md): Parts 3 (performance), 4 (QA, playtests,
  certification), 5 (documentation), 6 (tools and pipeline).

## Short answers (13.10.2026; each backed by a finding below or in the parts files)

1. Stages: concept → pre-production (ends with a playable piece at final quality: Cerny's "publishable first
   playable", or, for a small project and above all a game meant to change its player, Unity's lighter gate: it
   "can be tested with players" and its effect is measured) → production in chunks → alpha / beta /
   gold, each a checkable list (Filament) → certification (Meta's VRCs; submit at least two weeks ahead) →
   launch → post-release from an archive that can rebuild any version.
2. Roles: engineers, artists, designers, producers, support (Gregory). Two-member cover: studio-process-2.md, end.
3. Performance: budget first, measured on the device, CPU/GPU split, iterate (Meta's workflow); warm-up cut off,
   several fresh runs, intervals not single numbers (Georges 2007; Unity's defaults); a separate long session for
   heat (Meta: start-only profiling is "the most common shipping mistake"; its frame-rate check runs 45 minutes or
   the content's length, whichever is shorter); A/B runs on the device with head tracking off, identical but for
   the one thing compared (Owlchemy's talk and article).
4. QA: automated gameplay tests from the start (Rare's Sea of Thieves), a net that catches a bug as it is written
   (Mojang); playtests test the design on target players, watched
   (Valve, Microsoft); VRC checklist, then ALPHA/BETA/RC channels (Meta). Bug severity: no primary source found.
5. Docs: short, alive, changed in the same commit as the code (Google); decisions recorded with reasons and
   marked superseded, never deleted (Nygard; our docs/decisions.md has no such mark yet); the GDD is "rarely
   updated during the projects' life" (Politowski).
6. Pipeline: version control even for one person (Gregory); assets' metadata as text in it; small batches merged
   daily (DORA); release ladder on the store's channels.
7. Postmortems: problems are about people and planning more than technology; top causes: too few people,
   environment, marketing, underestimation, unclear vision, lack of fun (Politowski); obstacles and optimistic
   schedules (Washburn). Fixes: more pre-production, prototypes, playtests, feature lock dates, tools chosen early.
8. Human + agent: the agent's failure is "looks done" without a check; the cure is checks it runs itself,
   evidence shown, a fresh-context reviewer, one feature at a time, a machine-held list of what passes (Anthropic,
   four pages); people keep taste and design (Anthropic's survey); felt speed misleads (METR).

Not done or unverified: Chandler's handbook (only the alpha quote); the Sea of Thieves and Owlchemy talks
themselves (videos not watched); DORA's seven AI capabilities and its 2024 AI numbers; an authoritative bug
severity scale; Gregory's 4th edition has no team-structure section (the 3rd edition's Russian translation used).

## Findings (written as they come)

### Part 2. Roles (from the project's own library first)

- **Five disciplines in a studio** [book] — Jason Gregory, *Game Engine Architecture*, 3rd ed., Russian
  translation (2021), §1.1 "Структура типичной игровой команды", pp. 35–38
  (objekt-files/books/gregory-2021-ru-3rd.txt, lines 206–238): studios are formed from engineers, artists,
  game designers, producers, and other management and support staff (marketing, legal, IT, admin).
  Engineers split into runtime and tools programmers; senior engineers become leads who still code and set
  the technical direction; artists cover concept, 3D models, textures, **lighting**, animation, sound; designers
  work from the macro level (story, sequence of levels, player goals) down to single levels; the producer's role
  "is defined differently in different studios" (schedule and people, or senior designer, or link to finance,
  legal and marketing), and "some small studios have no producers at all" (quotes translated from the Russian:
  «В некоторых небольших студиях вообще нет продюсеров»; Naughty Dog: leadership shared among
  senior staff). Marketing and distribution are usually the publisher's.
  The 4th edition (vol. 1, 2026, objekt-files/books/gregory-2026-4th-vol1.txt) no longer has this section; its
  ch. 2 keeps version control (2.1), profiling (2.3) and other tools (2.5).
- For us: the owner holds the game director's and producer's chairs (what is made, in what order, does it feel
  right); the agent holds engineer, tools programmer, technical artist and lighting; the publisher's part
  (store, marketing) is Meta's store plus the owner. Naughty Dog shows a studio can run without a producer when
  seniors share the duty, but the duty (schedule, order, what is cut) still has to sit with someone: the board.

- **A solo VR developer's lessons (Quest's top-rated app in Nov 2020)** [read] — Thomas Van Bouwel, guest piece
  on Cubism, Road to VR, 18 Nov 2020, https://roadtovr.com/cubism-solo-indie-developer-lessons-thomas-van-bouwel/:
  "I developed Cubism on my own in my spare time" (prototype 2017, launch September 2020, per the article);
  "Choosing the right scope for a game is the best way to ensure you can actually finish it"; "build a vertical
  slice—a small but fully playable segment of your game idea—as soon as possible"; his weak spots were "3D
  modelling, graphics programming and audio design", which he covered by choosing a minimal look that "removed
  the need for detailed environment modelling or complex lighting" and by building his own editor tools; testers
  who were mostly developers and enthusiasts hid an onboarding problem until "about a year and a half into
  development".
- For us: a solo studio covers a missing role in one of three ways: a style that does not need it (Cubism's
  minimal look), a tool that does it (his editors; for us, the agent and scripted pipelines), or a person bought in
  for that job. And testers must be the target players, not people like us, or onboarding faults stay hidden.

### Part 7. What postmortems say goes wrong (first source)

- **200 postmortems, 927 problems** [read] — C. Politowski, F. Petrillo, G. C. Ullmann, Y.-G. Guéhéneuc,
  "Game industry problems: an extensive analysis of the gray literature", *Information and Software Technology*
  134 (2021) 106538; preprint https://arxiv.org/abs/2009.02440 (full text saved:
  objekt-files/papers/politowski-2021.txt). "We analyzed 200 postmortems from 1997 to 2019, resulting in 927
  problems divided into 20 types." Groups: "46% of the problems relate to production, 45% to management, and 9%
  to business"; "technical and game design, with 11% each" are the two most common types; "the majority of the
  main root causes are related to people, not technologies" (the abstract).
  Top 10 root causes (Table 3, count of problems): insufficient workforce 49; environment problems 48; wrong
  marketing strategy 35; underestimation 34; unclear game design vision 28; lack of fun 27; platform and
  technology constraints 24; game design complexity 23; inadequate or missing tools 22; misaligned teams 22.
  What fixed them, in the developers' own advice (section 4):
  - Underestimation: "goals and deadlines must be defined early and, if needed, re-defined often during the
    production"; "spend more time assessing risks during pre-production", "not letting anything be added as
    'afterthought'".
  - Unclear vision: the GDD "is also rarely updated during the projects' life"; fix: "spend more time on
    pre-production and prototyping", more playtesting, "enforcing 'feature lockdown dates'", and "define the set
    of tools before going into production".
  - Lack of fun: more playtesting sessions, balancing and polish, tutorials, more prototyping in pre-production.
  - Platform constraints: "understanding the architecture and hardware constraints, working closely with the
    platform developers", "prioritising core game mechanics and leaving non-essential features for future
    updates".
  - Tools: "evaluating the tools to be used during pre-production, because any change during production is
    financially costly".
- For us: the owner's "we cannot move until it is clear how" is the postmortems' own lesson: settle the tools,
  the hardware limits (Quest 2/3 budgets) and the core loop in pre-production; freeze features on a date; keep
  the design doc alive (the postmortems find it "rarely updated"). Insufficient workforce, the first cause, is our
  standing condition, so scope is the lever: fewer rooms done fully.

- **155 Gamasutra postmortems** [read] — M. Washburn Jr., P. Sathiyanarayanan, M. Nagappan, T. Zimmermann,
  C. Bird, "'What went right and what went wrong': an analysis of 155 postmortems from game development",
  ICSE 2016 SEIP; author copy https://www.microsoft.com/en-us/research/wp-content/uploads/2016/06/washburn-icse-2016-2.pdf
  (saved: objekt-files/papers/washburn-2016.txt). Went wrong most: obstacles 37%, schedule 25% ("common problems
  in estimation and optimistic scheduling"), development process 24% (no planning before development), game
  design 22% ("overly ambitious game designs"). Went right most: game design 50%, development process 43% (three
  common practices: planning before development, prototypes as proof of concept, an iterative process).
  Small teams (20 or fewer): "50% of small teams listed obstacles as something that went wrong, while only 26% of
  large teams". Documentation: Splinter Cell's pre-production "Technical Design Documents (TDD), into which we
  poured all the knowledge we gleaned from our prototype"; Operation Flashpoint, with no record of what had been
  built: "hours were spent trying to investigate how something had originally been meant to work".
  The authors' recommendations: risk management; "an iterative development process, and utilize prototypes as a
  method of proving features and concepts before committing them to your design"; "don't be overly ambitious";
  "If you make an estimate that initially feels optimistic to you, don't give that estimate to your stakeholders."
- For us: small teams name obstacles about twice as often as large ones (50% against 26%), so a written risk list with a plan for each matters more for
  us than for a big studio; prototype each room's core before building it fully; keep a record of what was
  built and why (our docs/decisions.md and docs/state.md are that record, if kept true).

### Part 1. Stages and their gates

- **Cerny's "Method": pre-production ends with a "publishable" first playable** [read; the deck is credited to
  Mark Cerny / Cerny Games and was uploaded to SlideShare by a third party, so its being his official deck is
  unverified] — "The Cerny Method", https://www.slideshare.net/slideshow/the-cerny-method/71184108 (the talk
  "Method", D.I.C.E. Summit 2002, per secondary sources). Slide 3: pre-production is "'Capturing Lightning'",
  production is "'Building the game'". Slide 14: "Deliverables at end of Pre-Production" are the "Publishable"
  First Playable and the Macro Game Design. Slide 17, the gate: "Two levels of publishable quality, with:"
  "player behavior fully defined", "enemy/obstacle behavior fully defined", "art direction in place", "all local
  features included", "a touch of variety", "scope of game defined", "basic technology done". Slide 19: cancel if
  the "Team cannot create 'Publishable' First Playable": "Your project will not miraculously get better during
  Production!" Slide 24, the Macro Game Design is "five pages": character and moveset, level structure, size
  and count, level contents, overall structure, a macro chart. Slide 15 warns against "'ALPHA = FIRST PLAYABLE'".
- **Alpha in Chandler's handbook** [read, quote only; the book itself not opened] — Heather Maxwell Chandler,
  *The Game Production Handbook* (the quotes page names no edition: unverified), via
  https://www.goodreads.com/work/quotes/22237702: "Alpha: At this milestone, key gameplay functionality is
  implemented, assets are 40–50% final (the rest are placeholders)"; "Alpha occurs 8 to 10 months before code
  release." Beta, code release and the rest of her milestone list: unverified (book not available here).
- For us: the corridor is our "first playable": two levels of publishable quality in Cerny's sense means the
  corridor plus one room, finished to the bar, with the player's behaviour defined, the art direction set, the
  scope of the game written, and the basic technology (loading, saving results, frame budget) done. Production
  (more rooms) waits until it passes; if it cannot pass, the plan changes rather than production starting.

- **A studio's own exit criteria for alpha, beta and gold** [read] — Jennifer Javornik (Filament Games, a
  learning-games studio), "Alpha, Beta, Gold: A Commitment to High-quality Game Development", 10 May 2017,
  https://www.filamentgames.com/blog/alpha-beta-gold-commitment-high-quality-game-development. Each milestone
  is a list of conditions a build must meet. Alpha: "roughly feature-complete"; "A new player in the target
  audience with minimal external guidance can play the game"; "Game performance is minimally viable on the
  primary target platform"; "A player in the target audience indicates a desire to continue playing on their
  own"; "Key sound effects are implemented". Beta: "feature-complete with polish"; "The target playtime is fully
  realized"; "There are no placeholder art assets"; "All art assets match the style guide"; "A majority of new
  players can play without external guidance"; "The game runs at the target framerate in a majority of tested
  scenarios. The game remains playable in all tested scenarios". Gold: "feature complete with high polish"; "All
  new players can play without external guidance"; "No A, B, C and very few D and E defects"; "The game runs at
  the target framerate in all tested scenarios". (The page lists no prototype or vertical-slice gate; the
  meaning of its A–E defect classes is not given there: unverified.)
- For us: a gate is a short list of things anyone can check on the build, with players and frame rate in it,
  not a feeling of "almost done". The corridor and each room can carry the same three lists: alpha (plays end
  to end, a new tester gets through without help, frame rate viable on Quest 2), beta (no placeholders, style
  guide met, most testers get through alone, target frame rate in most measured places), gold (all testers alone,
  target frame rate in every measured place, no serious defect open).

- **An engine vendor's stage model for small teams** [read] — Unity Learn, "Game development in a nutshell",
  tutorial "Production and Post-release",
  https://learn.unity.com/course/game-development-in-a-nutshell/tutorial/production-and-post-release (undated;
  the course's stages: ideation and pre-production, production, post-release). End of pre-production: "In
  commercial games, this assessment is often done via a specific milestone known as a 'vertical slice'", where
  "some subset of the final game now exists, which is fully reflective of the final product"; but "In smaller
  projects, and particularly games for impact, a true vertical slice tends to be something of an unattainable
  luxury", and the page's lighter gate, whole: "A different metric, particularly for a game designed to create
  change in the player, might be that the game itself exists in a form that can be tested with players, and some
  kind of measurement made in terms of its effectiveness (even if that measurement is just a simple survey or
  interview)." (Re-read 13.10.2026; the course is written with games for impact in view.) Production: "While
  pre-production is about discovery and experiments, production is about hitting a target"; "Divide the work
  into chunks." "Estimate the time for each chunk." "Complete the game, one chunk at a time." Milestones "make
  great days for playtesting". Release: "There's no magic formula for knowing when to stop"; "An outsider is often
  the best resource for helping to decide when the game is done enough to be released". After release: "A bug or
  flaw might be discovered well after the game's release", so keep "an organized archive from which you can
  update the game"; live services "may or may not be relevant for your project".
- For us: the stages studios use, and what each must hand on, as the sources above give them:
  concept (what the game is, one page) → pre-production (prototypes; tools, budgets and risks settled; ends with
  Cerny's first playable or Unity's "can be tested with players") → production (one chunk at a time, each to the
  bar) → alpha / beta / gold (Filament's checkable lists) → certification (VRCs; submitted at least two weeks
  before the launch date) → launch → post-release (patches from an archive that can rebuild any version). Where
  we stand on this ladder is the owner's call; our inference, no source's: the corridor is pre-production's first
  playable. Also our inference: a game whose goal is to help each player open hidden abilities (the owner's goal,
  docs/owner-decisions.md) is one "designed to create change in the player" in Unity's words, so Unity's lighter
  gate fits it as written: playable with players, and its effect measured.

