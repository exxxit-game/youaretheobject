# What to take when

Read the line for the task's kind first, in plan mode (CLAUDE.md, "Every session", 3).

## Before a task: what to read first
The book: Gregory, Game Engine Architecture, 4th ed. (2026): objekt-files/books/gregory-2026-4th-vol1.txt and vol2
(the Russian 3rd ed. for quoting him: gregory-2021-ru-3rd.txt). VR: A-Frame 1.8.0's docs
(objekt-files/docs-engine/aframe-1.8.0/docs), three.js r184 (what A-Frame 1.8.0 ships), Meta's Quest docs (metavr
docs search, the hz-quest-verify-first skill), the W3C WebXR spec. The page read goes in the WHY comment.
- Light, shadow, colour, gloom: Gregory 12 and 11; A-Frame light and renderer; three.js lights and colour management;
  docs/building-standards.md.
- An object or a text in the scene: photos of the real thing first; Gregory 16.1-16.2 and 12.8; A-Frame text,
  geometry, material; docs/vr-checklist.md.
- A room: the new-room skill (its card, its paper in full), then the paper-reviewer; Gregory 17.8, 17.10, 9 and 15.
- Loading, frame rate, memory: Gregory 7, 8 and 17.4; Meta's performance docs; docs/baseline.md.
- Controls and the menu: Gregory 9; Meta's input docs (the default mapping).
- Data and the server: Supabase's docs (search_docs); docs/methodology.md; .claude/rules/data.md.
- Tests, GitHub, the process: Gregory 2 and 10; Claude Code's docs (the claude-code-guide helper); GitHub's docs.

## Which tool when
- Reading or finding in files: Read and Grep myself, no helper.
- A claim about our setup: the thing itself first (the service through its connector, the vendored code, a fresh
  measure); a doc, the board or another window is a lead.
- One narrow fact: quick-research, one question a run. A wide question: deep-research in the background.
- A whole system (GitHub, Supabase, the app): one general helper per system, in parallel.
- A paper: docs/library.md, its card in docs/cards, its text in objekt-files/papers; searching: Consensus, PubMed,
  the reference lookup; a PDF: PDF Tools; a page a fetch cannot read: the browser pane; Reddit (closed to both):
  its RSS through curl with a user agent, one request every 45 s (docs/research/ai-and-vr-4.md); a page nothing
  opens: its exact link to him.
- What we have and do not use, each with its reason: objekt-files/notes/others-2026-10-15/inventory-2026-10-15.md.
- A new page before he sees it: the fact-checker, two runs that do not see each other; edits from their findings
  checked by me against them.
- Building anything: a short script file in node, never long mixed shell lines; a command judged by its exit code,
  not by its last line.
- The headset: the practice review first, then node tools/quest-look.mjs (`say` each step while he wears it; sleep
  after); frame rate and GPU: OVR Metrics, `metavr perf capture` read with Perfetto, RenderDoc for one draw.
