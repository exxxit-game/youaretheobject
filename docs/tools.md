# What to take when

## Codex migration events
tools/codex-events.mjs records UserPromptSubmit and named reviewer start/stop events through .codex/hooks.json.
Profiles in .codex/agents/ inherit the model; they never start themselves or other agents.
The bridge uses the existing local journals and acceptance gate. Owner messages are checkout-bound;
replays cannot refresh acceptance. A review needs a matching start, complete final report and unchanged files.
Completion means neither no findings nor owner approval. Legacy Claude records retain their semantics.
node tools/codex-events.mjs --status reads events and the lock without writes. Zero does not prove activation.
Check the chat root first: a shell workdir does not move the chat or load another checkout's profiles.
Hooks need normal Codex trust (CLI: /hooks); config presence does not prove trust. After trust, verify a real
neutral owner message, then a needed review with its actual agent type. Never inject synthetic success records.
tests/codex-events.test.mjs uses temporary journals and checks the Windows command; it cannot prove live callbacks.
After a crash, inspect codex-events.lock's PID before removing that exact stale lock; never erase journals.
Local journals are not tamper-proof or a substitute for checking findings. Other Claude event guards are not migrated.
Sources: https://learn.chatgpt.com/docs/hooks and https://learn.chatgpt.com/docs/agent-configuration/subagents .

## Before a task: what to read first
The book: Gregory, Game Engine Architecture, 4th ed. (2026): objekt-files/books/gregory-2026-4th-vol1.txt and vol2
(the Russian 3rd ed. for quoting him: gregory-2021-ru-3rd.txt). VR: A-Frame 1.8.0's docs
(objekt-files/docs-engine/aframe-1.8.0/docs), three.js r184 (what A-Frame 1.8.0 ships), Meta's Quest docs (metavr
docs search), the W3C WebXR spec. The page read goes in the WHY comment.
- Light, shadow, colour, gloom: Gregory 12 and 11; A-Frame light and renderer; three.js lights and colour management;
  docs/building-standards.md.
- An object or a text in the scene: photos of the real thing first; Gregory 16.1-16.2 and 12.8; A-Frame text,
  geometry, material; docs/vr-checklist.md.
- A room: Gregory 17.8, 17.10, 9 and 15.
- Loading, frame rate, memory: Gregory 7, 8 and 17.4; Meta's performance docs; docs/baseline.md.
- Controls and the menu: Gregory 9; Meta's input docs (the default mapping).
- Data and the server: Supabase's docs (search_docs); docs/methodology.md; .claude/rules/data.md.
- Tests, GitHub, the process: Gregory 2 and 10; the active agent's official docs (Codex: openai-docs); GitHub's docs. Legacy helper names below do not prove Codex availability.

## Which tool when
- A claim about our setup: the thing itself first (the service through its connector, the vendored code, a fresh
  measure); a doc, the board or another window is a lead.
- One narrow fact: quick-research, one question a run. A wide question: deep-research in the background.
- A whole system (GitHub, Supabase, the app): one general helper per system, in parallel.
- A paper: docs/library.md, its card in docs/cards, its text in objekt-files/papers; searching: Consensus, PubMed,
  the reference lookup; a PDF: PDF Tools; a page a fetch cannot read: the browser pane; Reddit: RSS by curl
  with a user agent, a request per 45 s, until 13.11.2026 (RSS ends: Reddit's changelog of 8.10.2026;
  docs/research/ai-and-vr-4.md); a page nothing opens: its link to him.
- A new page before he sees it: the fact-checker, two runs that do not see each other; edits from their findings
  checked by me against them.
- Building anything: a short script file in node, never long mixed shell lines; a command judged by its exit code,
  not by its last line.
- The headset: node tools/quest-look.mjs; frame rate and GPU: OVR Metrics, `metavr perf capture` read with Perfetto, RenderDoc for one draw.
