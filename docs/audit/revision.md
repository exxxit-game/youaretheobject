# The revision: every shelf, and what each is checked against

The owner asked for a full revision of everything we have, the way a librarian re-checks every book
(docs/board.md, 11.10). Its first step is this inventory: every shelf, what is on it, what it is
checked against, how it is checked today, and when it was last checked as a whole. Counts were read
from the things themselves on 11.10 (git ls-files, the folders, GitHub and the live database through
their tools); the owner sees it as a page in Russian.

## The method, taken from what exists

ISO 19011:2018 defines an audit as a "systematic, independent and documented process for obtaining objective
evidence" and judging it against the audit criteria (read through the EU Agency for Railways terminology collection, which names
ISO 19011:2018 as its source: era.europa.eu/era-railway-terminology-collection/audit/term/international_standard;
the ISO text itself sits behind a terms-of-use gate). So each shelf has three columns: what is on it
(the scope), what it is checked against (the criteria), how it is checked now (where the evidence comes from).

The criteria of every shelf have three layers, in this order (owner's decisions, "How things are built"):
1. the official documentation or standard of the thing, of the version we run;
2. what practitioners wrote down (forums, issues, talks), in every language, weighed by the author's
   visible experience;
3. his decisions.
A shelf is done when its page tells him where we match, where we differ, and whether each difference is
needed; where no source settles it, the options go to him.

## The shelves

| # | Shelf | On it (11.10) | Checked against | Checked now by | Last whole check |
|---|---|---|---|---|---|
| 1 | Rules and Claude Code | CLAUDE.md (45 lines), docs/owner-decisions.md (78) and its record, docs/tools.md, docs/board.md; 8 memory files; 7 agents, 1 skill; .claude/settings.json (6 hook events, 18 allow rules); the user's settings (2 of 5 installed plugins on); 9 services (MCP) connected to the session | Claude Code docs (code.claude.com/docs index: 222 English pages on 11.10, 221 when read on 9.10); Claude Code's issues and forums; his decisions | tests/structure.test.mjs, tools/health.mjs, tools/health-setup.mjs, tests/guard.test.mjs, tools/prove-guards.mjs; the request-auditor | the docs read 9.10 (docs/research/projects/claude-code), the rebuild 10.10 (process-rebuild.md), the process review 11.10, the rules split 11.10 |
| 2 | Guards and our tools | tools/: 27 files and 2 git hooks | Claude Code's hooks reference, git's githooks, Node.js, GitHub Actions; Meta's adb and metavr docs for the headset tools | tests/guard.test.mjs, review-gate, health, secrets tests; tools/prove-guards.mjs (each guard seen red) | inventory.md 9.10, rebuild/machinery.md 10.10 |
| 3 | Tests | tests/: 34 files | the source behind each thing a test holds; Node's test runner; our rule that a guard fails when its mistake is put back (docs/audit/README.md, cause 4) | GitHub's test run on every push, the pre-commit hook; prove-guards covers the structure checks and git hooks only | none of its own in docs/audit |
| 4 | GitHub and the live site | public repository, 22 branches, the ruleset on main, 2 workflows, Pages built from main (youaretheobject.com), pull request 10 with CodeRabbit, 0 releases | GitHub's docs (rulesets, Actions, Pages, releases), CodeRabbit's docs; his decisions (main on his word, numbered releases, the site through Actions with only the game's files) | tools/health-setup.mjs (main protected), tools/secrets.mjs before every push, the test run | research/projects/claude-code/D-automation.md 9.10, revision-1-store.md 10.10 |
| 5 | The engine | src/engine: 37 files; vendor/aframe-1.8.0.min.js (three r184 inside) | A-Frame 1.8.0 docs (the local copy, 105 pages), three.js, W3C WebXR, Meta's WebXR docs; practitioners' forums | unit tests, tests/vendor.test.mjs, the smoke runs on GitHub (tests/smoke.mjs, smoke-vr.mjs on Meta's emulator, draw-calls.mjs); the architecture-auditor | architecture.md 9.10, architecture-2026-10-10.md, research/engine-and-tools.md 10.10 |
| 6 | The corridor and the shared game | src/app: 33 files; index.html, src/main.js, css/ (5), privacy.html | docs/building-standards.md, photos of the real objects, Meta's comfort and VRC guidelines (docs/vr-checklist.md), docs/sources.md for every fact shown; his decisions on voice and text | the unit tests of its parts (plaque, masonry, tiles, standards, sheet, logo, glow, plan), the smoke run, the practice-reviewer, the approved shots (docs/rooms/corridor-shots), his eyes | scene.md, paper.md, flow.md, numbers.md 9.10 |
| 7 | Rooms | src/rooms/01-control: 41 files | its paper (Alloy and Abramson 1979, Experiment 2), docs/rooms.md, docs/methodology.md, the new-room skill | 4 control-* tests, the paper-reviewer | the code against the paper 7.10, twice; 11.10 one change (the mirror) |
| 8 | Sound, voice, fonts, pictures | 35 recordings (7 corridor, 28 room 01), 4 font files with 2 OFL licences, 1 painting, docs/art | each licence (docs/art/credits.md), the loudness norms named in docs/, the voice service's docs | voice, sound and fonts tests, tools/check-voice.mjs | none of its own in docs/audit |
| 9 | Server and players' data | supabase/migrations: 10 (the live project lists the same 10 names), 1 report schema, 7 tables in schema app, the consent texts, privacy.html | Supabase's docs (row level security, its advisors), data-protection law (docs/research/ethics-law.md), JSON Schema; his data decisions | tests on what the server accepts (tests/sql.mjs), the guard that keeps the live database read only | research/revision-2-data.md 10.10–11.10 |
| 10 | The headset | his Quest 3 and BoboVR strap; tools quest-look, quest-check, quest-wifi, headset, xr-probe, xr-room; docs/headset-capabilities.md, docs/vr-checklist.md | Meta's docs (Quest 3, Quest Browser, VRC), W3C WebXR, the metavr CLI | the health check (the headset's link), the run on Meta's emulator, his eyes | probe-review.md 9.10, room-probe-review.md 11.10 |
| 11 | Knowledge | 371 papers in docs/library/papers.json (237 PDFs, 344 texts in objekt-files/papers), 145 cards and the catalog, 69 research files, 20 docs, 25 audit files, 6 idea files | the papers' full texts, reference databases (OpenAlex, arXiv), the code for docs that describe it, his messages for the board and decisions | tests/library.test.mjs, tools/check-cards.mjs, tools/build-catalog.mjs --check, the structure rules on docs, the fact-checker, request-auditor, architecture-auditor | rebuild/knowledge.md 10.10 |
| 12 | Copies and records outside the repository | objekt-files: docs-engine (105 pages and the release files, 129 in all), one dataset (ANSUR II, 5 files), imports (44), notes (his message log, the practice reviews); the papers' copy on Google Drive; a backup on F: | their originals (the A-Frame release, each dataset's publisher); his decision on Google Drive | the health check (a text copy of every paper, the backup on F: complete; nothing checks the Google Drive copy) | none of its own in docs/audit |
| 13 | The laptop | Windows 10 Pro, Node, git, gh, adb, metavr, Blender; the compression tools not yet installed | each program's docs | tools/health.mjs at every session start (31 checks on 11.10) | every start |
| 14 | Money, store, law | the Meta developer account, payouts to Ukraine, CodeRabbit's trial to 23.10, the store's fees, ethics approval | Meta's developer terms and store docs, the law texts | the dates on the board; nothing by machine | store-fees-own-sales.md, meta-payout-ukraine.md, ethics-law.md 10.10 |

## Two measures taken for the inventory

- Full (https) links in docs/, src/, tools/, tests/, .claude/, CLAUDE.md and ARCHITECTURE.md at 90b7e9b: 1383,
  215 of them to papers (doi.org); 323 to official documentation (developers.meta.com, code.claude.com, w3.org,
  supabase.com, docs.github.com, aframe.io, developer.mozilla.org), with dozens more written without https; 12 to
  forums, of which 6 are about WebXR (Meta's forum, Babylon's). The practitioners' layer was nearly empty; the
  searches of 11.10 begin to fill it.
- The engine (37 files) has no full link to a source (its one https link is our server's address); 3 files
  write a source's address without https, and 3 name A-Frame's docs.

The two other AIs' advice the owner brought on 11.10 is checked claim by claim in
[docs/research/other-ai-advice.md](../research/other-ai-advice.md); what it leaves for shelf 5 is listed there. What practitioners wrote, found
the same day on his word: [docs/research/forums-aframe-quest.md](../research/forums-aframe-quest.md) (English) and
[docs/research/forums-other-languages.md](../research/forums-other-languages.md) (the other languages), and the threads the owner downloaded from Reddit:
[docs/research/reddit-2026-10-11.md](../research/reddit-2026-10-11.md).

## Shelf 1, the rules and Claude Code (11.10)

Against the docs saved that day: [instruction files and memory](revision-shelf1-rules.md),
[hooks and settings](revision-shelf1-machinery.md), [subagents and the skill](revision-shelf1-agents.md); what
experienced users wrote: [docs/research/forums-claude-code.md](../research/forums-claude-code.md). For the later
shelves: [docs/research/forums-data.md](../research/forums-data.md) (shelf 9) and
[docs/research/forums-rooms.md](../research/forums-rooms.md) (rooms) and [docs/research/forums-store-money.md](../research/forums-store-money.md) (shelf 14).

## Order

1. Rules and Claude Code: his word (docs/board.md).
2. Server and players' data: data protection first of all (his decisions, "Data, science, money").
3. The engine, then 4. the headset: the weakest headset's budget first (his decisions, "Order").
5. Money, store, law: money first (the same line).
6. GitHub and the site; 7. guards and tools; 8. tests; 9. the corridor; 10. rooms; 11. sound and
   pictures; 12. knowledge; 13. copies outside; 14. the laptop.
