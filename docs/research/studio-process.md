# How game studios work, and what it means for us

The owner's request (13.10.2026, translated): find out how game studios do it, since they have a clear
process for all of this; we are at step 0 and cannot move until it is clear how to move, where to, with what
(the engine, the wiring, the fuel). Asked of the deep-research agent on 13.10.2026.

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

### Part 7. What postmortems say goes wrong (first source)

- **200 postmortems, 927 problems** [read] — C. Politowski, F. Petrillo, G. C. Ullmann, Y.-G. Guéhéneuc,
  "Game industry problems: an extensive analysis of the gray literature", *Information and Software Technology*
  134 (2021) 106538; preprint https://arxiv.org/abs/2009.02440 (full text saved:
  objekt-files/papers/politowski-2021.txt). "We analyzed 200 postmortems from 1997 to 2019, resulting in 927
  problems divided into 20 types." Groups: "46% of the problems relate to production, 45% to management, and 9%
  to business"; "technical and game design, with 11% each" are the two most common types; the root causes are
  "related to people, not technologies".
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
  the design doc alive (it is the item most often left stale). Insufficient workforce, the first cause, is our
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
- For us: small teams meet twice the obstacles, so a written risk list with a plan for each matters more for
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
  *The Game Production Handbook* (Jones & Bartlett, 2nd ed. 2008/2009), via
  https://www.goodreads.com/work/quotes/22237702: "Alpha: At this milestone, key gameplay functionality is
  implemented, assets are 40–50% final (the rest are placeholders)"; "Alpha occurs 8 to 10 months before code
  release." Beta, code release and the rest of her milestone list: unverified (book not available here).
- For us: the corridor is our "first playable": two levels of publishable quality in Cerny's sense means the
  corridor plus one room, finished to the bar, with the player's behaviour defined, the art direction set, the
  scope of the game written, and the basic technology (loading, saving results, frame budget) done. Production
  (more rooms) waits until it passes; if it cannot pass, the plan changes rather than production starting.

