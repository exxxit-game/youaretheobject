# What to take when

## Codex hooks
Scoped user hooks call tools/codex-events.mjs; .codex/agents/ inherit the model and never self-start.
Owner messages are checkout-bound; replay cannot renew acceptance. Reviews require matching start, full report
and unchanged files. Completion is neither absence of findings nor owner approval; legacy records retain meaning.
Check the chat root, not shell workdir. --status reads journals/lock, not runtime trust. Fixtures prove logic only.
After a crash inspect the lock PID before removing that stale lock; never erase or fabricate journals.
tools/codex-guard.mjs adapts shell/MCP restrictions to PreToolUse. After restart, real Bash bypass and isolated
journal-patch probes were denied; safe reads passed. This proves those paths, not all tools; see progress.
Sources: https://learn.chatgpt.com/docs/hooks ; https://learn.chatgpt.com/docs/agent-configuration/subagents .

## Before a task: what to read first
Host limits and task placement: [laptop, GitHub and Quest](research/laptop-workflow.md). No local automated browser rendering.
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
- Context7, PubMed and free research routes: [verified operation and limits](research/process-efficiency.md#free-tool-closeout).
- A paper: docs/library.md, its card in docs/cards and text in objekt-files/papers first; then PubMed/Europe PMC,
  OpenAlex citing works, Crossref updates. Read the original methods; citation counts are not replication.
  A PDF: the PDF skill; an inaccessible page: browser or another lawful source. Assistant operates these routes.
- A new page before he sees it: the fact-checker, two runs that do not see each other; edits from their findings
  checked by me against them.
- Building anything: a short script file in node, never long mixed shell lines; a command judged by its exit code,
  not by its last line.
- The headset: node tools/quest-look.mjs; frame rate and GPU: OVR Metrics, `metavr perf capture` read with Perfetto, RenderDoc for one draw.
