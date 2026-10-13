# What to take when

Loaded with CLAUDE.md at every start (a tool on demand only is a tool forgotten: two reviewers here never ran
once); what it names is read or run only for its task. One line per situation; the first tool named goes first.

- A decision whose line is not enough (all his words, how it came, the texts he accepted): docs/owner-decisions-history.md.
- Before adding or changing a guard, hook, rule, check, tool or step of the process: docs/circles.md (the circles
  we keep coming back to, and what breaks each).
- Who does what, where we are on the route, the loop of every step: docs/studio-map.md.
- A room, new or changed: the new-room skill (its room recipe), then the paper-reviewer agent.
- A paper: docs/library.md, then its card in docs/cards, then its text in
  C:\Users\admin\Documents\objekt-files\papers\. A note on one paper: research-desk research-litnote;
  several papers: paper-compare; are the references real: citation-check.
- A narrow fact (a real size, a standard's number, a period photo): the quick-research agent; a wide
  question (a market, every platform, many options, how those who do it work: their forums): the deep-research agent.
- Searching papers: Consensus, PubMed, the hosted reference lookup; a PDF: PDF Tools (it opens files only
  under Documents, Downloads or Desktop); a page a fetch cannot read: the browser pane;
  one it cannot open either (Reddit, a closed forum): its exact link to the owner, who saves it (Ctrl+S).
- How the engine does a thing (a component, a primitive, the scene, a material): A-Frame's own docs of our
  version, a copy in C:\Users\admin\Documents\objekt-files\docs-engine\aframe-1.8.0\docs (aframe.io/docs/1.8.0
  online); the page goes in the WHY comment.
- A claim about our own setup (a plan, a version, a number): read it from the thing itself first (the service
  through its connector, the vendored code, a fresh measure); about Quest or WebXR: Meta's docs first
  (metavr docs search, the meta-vr skill hz-quest-verify-first). A doc, the board or another window is a lead.
- A claim before anyone relies on it ("done", a number, a quote): the fact-checker agent, two runs.
- The owner's requests since the last check, once at the end of a step: the request-auditor agent.
- Code and docs against the finished picture, after a large change: the architecture-auditor agent.
- The headset: the practice review runs before he is called to it, never while he waits in it;
  node tools/quest-look.mjs (look, measure, `say` for each step while he wears it; sleep after). Meta's own
  checks and traces: metavr, the Meta VR CLI (device, perf, vrc-local); live frame rate, CPU and GPU in the headset: OVR
  Metrics Tool's HUD, on and off over adb (installed by the owner 13.10); CPU- or GPU-bound: `metavr perf capture`,
  read with Perfetto's trace_processor (installed 13.10, metavr tools; `metavr perf monitor` needs Meta Perf Service, whose
  feed held no build on 13.10); one draw's GPU cost: RenderDoc Meta fork
  (installed 13.10, C:\Program Files\RenderDocForMetaQuest; `metavr tools install` failed with MSI 1639, so its MSI
  from metavr's downloads was run by msiexec); install and store: the meta-vr skills
  hz-store-pwa and hz-store-submit; comfort: hz-immersive-designer.
- The laptop: node tools/health.mjs (it also runs at every session start).
