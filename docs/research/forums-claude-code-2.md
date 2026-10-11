# What experienced Claude Code users write about long-project setup (shelf 1, "Rules and Claude Code") (part 2)

Part 1: [forums-claude-code.md](forums-claude-code.md).

### S17. @satoshi_061 (Qiita), "Claude Code のサブエージェントに「聞かずに」仕事を振らせる" (getting Claude Code to delegate to subagents without asking), posted/updated 3 Oct 2026 — https://qiita.com/satoshi_061/items/de480b7464b7226dd5a5
Author: solo developer building a parenting-log app (Next.js/Supabase/Vercel) almost entirely with Claude Code.
- (3) Kept three custom subagents (feature-dev, qa-tester, docs-auditor); DELETED his own `reviewer` subagent for the official `/code-review`: the official one has adjustable effort and is kept up to date, his prompt only "reflected only what the author knew when writing it".
- Project rules moved into CLAUDE.md because custom subagents read CLAUDE.md at start, so reviewer and implementer share rules.
- (2) Hooks can't route work to a subagent (`type: "agent"` hook only checks conditions, experimental); delegation is decided by each subagent's `description` plus a CLAUDE.md table of when to delegate without asking.
- (5) Reviews in the main session filled it with diffs and logs; since v2.1.218 `/code-review` runs as a forked subagent; custom skills can use `context: fork`.
  Mark (b). Ours: 7 custom subagents incl. reviewers whose prompts are ours (fact-checker, practice-reviewer, paper-reviewer...) and CodeRabbit for code review (owner-decisions) — our domain reviewers have no official equivalent (paper fidelity, VR practice), so his reason applies only to a generic code reviewer, which we already left to CodeRabbit — matches.

## Russian (Habr)

### S18. (Russian text: see the source) Software Architect, Cian), «(Russian text: see the source) Claude Code (Russian text: see the source) Jun 2026 (year inferred from text referring to May 2026) — https://habr.com/ru/companies/cian/articles/1024734/
Author: architect at Cian (large Russian real-estate company); pilot in infra, platform and product teams.
- (5) Auto-compaction weak: «(Russian text: see the source) Claude Code (Russian text: see the source) root agent only orchestrates, subagents code.
- (3) Subagents do not always do what they report: the root agent must verify with the same test/lint/build skills ("feedback loops").
- Windows: Claude Code makes bash quoting and path-separator mistakes; «(Russian text: see the source) Windows».
- (4) Skills need tests; prohibitions (no commits/pushes) should be tested "under pressure"; «(Russian text: see the source) Auto-approve risk: approval prompts push people to broad permissions; mitigations must "not depend on individual vigilance" (scoped account, sandbox, blockers).
  Mark (a) with S4/S9 on verification of agent claims. Ours: Windows laptop, hooks matched on both Bash and PowerShell (settings.json) — matches their Windows concern; our skill new-room has no test of its own — differs; tests/structure.test.mjs checks CLAUDE.md length — partly.

### S19. (Russian text: see the source) @sburyi), «(Russian text: see the source) Claude Code (Russian text: see the source) CLAUDE.md (Russian text: see the source) Oct 2026 (year inferred: tested on Claude Code 2.1.288) — https://habr.com/ru/articles/1091676/
Author: tested in `claude -p` mode only.
- (1) @-import breaks silently on a space in the path (quotes do not help: «(Russian text: see the source) files outside the working folder ask approval once and after a refusal it «(Russian text: see the source) depth: f1–f4 loaded, f5–f6 silently not.
- Check what loaded with `/context` after every import edit; keep core CLAUDE.md about 200 lines; rarely-needed docs as a plain path with a "read when…" condition; must-never rules: PreToolUse hook ("CLAUDE.md (Russian text: see the source) Claude — (Russian text: see the source) Mark (b) for the bugs (one tester), (a) for the advice. Ours: imports `@docs/owner-decisions.md`, `@docs/tools.md` — no spaces, depth 1, inside the repo — safe by his tests; whether they load in the desktop app's worktree sessions: not measured here (one /context look would settle it).

## Chinese

### S20. tw93, «你不知道的 Claude Code：架构、治理与工程实践» (What you don't know about Claude Code: architecture, governance, practice), V2EX, 21 Mar 2026 (year inferred from replies to 2 Apr) — https://v2ex.com/t/1199971 (full text also on his X; not opened)
Author: tw93, known Chinese open-source developer (author of the Kaku terminal per the page; Pake/Mole not confirmed here); "half a year+" on two accounts, about 40 USD/month.
- (1) CLAUDE.md is a collaboration contract, not a knowledge base: «短、硬、可执行» ("short, hard, executable"); build/test commands, boundaries, prohibitions; no long background, no API docs, no vague principles, nothing readable from the repo; may start empty and add what recurs; add a "Compact Instructions" section saying what compaction must keep.
- (2) Hooks only for deterministic things (lint after edit, protect files, notify); limit hook output length so it does not pollute context; semantic judgement and multi-step decisions do not belong in hooks.
- (3) Subagents' value is context isolation, not parallelism; restrict tools, model and maxTurns; anti-patterns: permissions as wide as the main thread, free-form output.
- (4) Skills: descriptions short with "when to use"; side-effect skills `disable-model-invocation`; rarely used skills moved out into AGENTS.md.
- (5) MCP tool definitions are the largest fixed cost (his count: 5 servers ≈25K tokens, ≈12.5%); compaction drops architecture decisions and the reasons for constraints; HANDOFF.md for a new session.
- (8) Removed: RAG vector search (Claude preferred grep); a TodoWrite reminder that "became a limitation as models got stronger" — re-check old restrictions periodically; switching models mid-session breaks the cache and costs more.
  Mark (a) for most points (same as S1, S2, S19). Ours: no "Compact Instructions" section in CLAUDE.md — differs; our claude-guard start output is the board (91 lines, many long lines) — size vs hook output limit not measured here; subagents have tools allowlists (.claude/agents frontmatter) — matches; MCP: 4 servers on in this session (Consensus, PubMed, reference lookup, PDF Tools, plus browser, Supabase, Claude Docs) — the context cost is worth one /context look.

## Korean
- Korean search (extended) found official docs in Korean, a Korean translation of Blake Crosley's post (below), and Dale Seo's sub-agent explainer (https://daleseo.com/claude-code-sub-agents/, not opened); no first-person Korean long-project write-up found. Korean: "not found" beyond these.

### S21. Blake Crosley, "Every hook is a scar" (84 agent failures turned into hooks), 29 Mar 2026 — https://blakecrosley.com/blog/every-hook-is-a-scar (Korean translation: https://blakecrosley.com/ko/blog/every-hook-is-a-scar)
Author: designer/developer, former VP of Product Design at ZipRecruiter, founder of 941 Apps; runs his own agent orchestration system; the site also sells Claude Code guides (weigh accordingly).
- (2) 84 hooks over 15 of 26 lifecycle events; each from a real incident; six categories: credential exposure (12 hooks), destructive operations (8), task drift (4), output quality (6, e.g. an agent reported "All tests pass" without running pytest), resource exhaustion (3), cross-project contamination (4).
- Cost: 200–400 ms hook overhead per tool call vs 2–5 s model time; credential guard hard-blocked 3 reads in 200+ sessions, none malicious.
- (8) Speculative hooks from a threat model produce false positives that erode trust; reactive guards "can still overmatch later as the codebase evolves"; hard blocks only for irreversible actions or credential exposure; hooks do not catch reasoning-level failures.
  Mark (a) with S1 (avoid block-at-write) and the owner's 11.10 process review. Ours: owner-decisions "a ban stands only where a mistake cannot be undone or costs him time; a complaint is no reason for a new guard" — matches exactly; our guard runs on every Bash/PowerShell/MCP/Write call (one node process each) — its per-call time not measured here.

## Over-engineering of the process (8)

### S22. Alex Jacobs, "I am morally opposed to updating my CLAUDE.md", 19 Aug 2026 — https://alex-jacobs.com/posts/claudemd/ (HN 20 Aug 2026, item 49376287, 29 pts)
Author: a developer blogging on Claude Code; little visible background (weight low).
- (1)(8) The file becomes "a grievance archive"; each rule is "a constitutional amendment" with "no sunset clause"; old rules may make a newer model worse and he cannot tell which; his anti-docs rule (after one unwanted summary.md) later made Claude refuse a README he asked for, quoting the rule back.
- Instead: corrects in the live chat, saves nothing (credits Steinberger, S7).
  Mark (c): contradicts S3/S11/S16 (record each mistake); agrees with R1 (rules pile up because their reason is lost) and S20 (re-check old restrictions as models change).
  Ours: owner-decisions.md is exactly a record of his corrections — the risk he names applies; our defence is R1's remedy (each rule carries its date and his words, so it can be retired) and the owner's own rule "a change replaces something".

### S23. Armin Ronacher, "Agent Psychosis: Are We Going Insane?", 18 Jan 2026 — https://lucumr.pocoo.org/2026/1/18/agent-psychosis/
Author: creator of Flask/Jinja, ex-Sentry; heavy Claude Code user since mid-2025 (his "A Year of Vibes", 22 Dec 2025, https://lucumr.pocoo.org/2025/12/22/a-year-of-vibes/, not opened).
- (8) Admits two months of excessive prompting and building tools he never used: "Just because you can, you might not want to."; calls Beads and Gas Town "the complete celebration of slop loops" (Beads ~240,000 lines managing markdown, "the code quality is abysmal") — (c) against S14; loops restarted from scratch waste tokens and cache.
- (7) "The asymmetry is completely brutal": generating takes minutes, reviewing far longer; agents are "massive slop machines if you turn off your brain".
  Ours: owner does not review code; reviewer agents + CodeRabbit + tests stand in (owner-decisions) — the asymmetry he names is why our checks are machine checks; process frozen after the rebuild (CLAUDE.md "anything new needs his word and replaces something") — matches his warning against building tools for their own sake.

## Skills (4)

### S24. Simon Willison, "Claude Skills are awesome, maybe a bigger deal than MCP", 16 Oct 2025 — https://simonwillison.net/2025/Oct/16/claude-skills/
Author: co-creator of Django, Datasette; writes daily on LLM tools.
- (4) A skill is Markdown plus optional scripts; only the frontmatter description loads at start ("a few dozen tokens"), the rest when needed; GitHub's MCP server "consumes tens of thousands of tokens of context"; skills need a filesystem and command execution, and a sandbox against prompt injection.
  Mark (a) with S1, S20. Ours: one skill (new-room, 71 lines) holding the room procedure — matches "procedures go to skills"; docs/tools.md in CLAUDE.md lists when to use what — partly duplicates what skill descriptions would do.

### S25. Jesse Vincent, "Superpowers: How I'm using coding agents in October 2025", 9 Oct 2025 — https://blog.fsck.com/2025/10/09/superpowers/
Author: creator of Request Tracker, co-founder of Keyboardio; maintains the Superpowers plugin (popular skills library).
- (4) Bootstrap rule: "If you have a skill to do something, you _must_ use it to do that activity."; plan first, git worktree per task, subagents implement and each is reviewed before the next; TDD.
- Testing skills on subagents ("TDD for skills"): the first try was false — Claude quizzed subagents "like they were on a gameshow" and reported perfect scores; realistic pressure scenarios (outage, sunk cost) were needed.
  Mark (a) with S18 (Cian: test skills, test prohibitions under pressure). Ours: superpowers turned off by the owner (owner-decisions, 10.10) — settled, not reopened; our new-room skill has no pressure test — differs from S18/S25.

## Parallel sessions, worktrees (6) — primary posts

### S26. Boris Cherny on X (read in the browser pane without login; only the first post of each thread is visible)
- 2 Jan 2026 — https://x.com/bcherny/status/2007179832300581177 — "My setup might be surprisingly vanilla! Claude Code works great out of the box, so I personally don't customize it much."; "Each person on the Claude Code team uses it very differently." (8.2M views)
- 1 Feb 2026 — https://x.com/bcherny/status/2017742743125299476 — "Spin up 3–5 git worktrees at once, each running its own Claude session in parallel. It's the single biggest productivity unlock, and the top tip from the team."; "Personally, I use multiple git checkouts, but most of the Claude Code team prefers worktrees" (native support in the Desktop app); some keep "a dedicated "analysis" worktree that's only for reading logs".
- Same thread per secondary summary (okhlopkov.com, Feb 2026, https://okhlopkov.com/en-claude-code-creator-tips-git-worktrees/ — not Boris's words): after a mistake ask Claude to "update your CLAUDE.md so you don't do this again"; a session-end skill to find duplicate code, commit, update specs; make Claude a strict reviewer: "prove to me this will work". Unverified as Boris's wording (rest of thread needs an X login).
  Mark (c) on (6): Anthropic's team (worktrees, 3–5 parallel) vs Steinberger (S7, reverted to one folder) vs Hashimoto (S11, one agent at a time). (8): the creator's own setup is "vanilla".
  Ours: worktree per session in the desktop app — matches the team's tip; but the owner's decision is one window at a time until the corridor is done — we use worktrees for isolation and safety, not for parallelism; that is a deliberate difference and settled.

## Memory across sessions (5)

### S27. GitHub issue #37314 "Claude repeatedly fails to apply its own memory/feedback — same mistakes recur across sessions", 22 Mar 2026 — https://github.com/anthropics/claude-code/issues/37314
Filed by @jfbourdeau (Opus 4.6, CLI); auto memory (MEMORY.md index) held rules like "always cd to backend/ before running backend commands" and "uncommitted changes get lost on sync"; "Claude stores the feedback, acknowledges it, sometimes even updates the memory file again with stronger wording — then makes the exact same mistake." Closed by bot (inactivity) 20 Apr 2026; no maintainer reply. Bot listed duplicates #36296, #36997, #32775.
- Comment @yurukusa: "Memory is a suggestion. Hooks are enforcement." — a PreToolUse hook that blocks the wrong command (exit 2) and prints the right one.
  Mark (a) with S4, S6, S9, S10, S19, R3. Ours: memory folder (MEMORY.md 7 entries) holds working style only; rules in the repo (memory "Where rules live") — matches the advice that memory is a hint; the irreversible things are in claude-guard — matches.

## Non-programmer owner (7)

### S28. Sachin Rekhi, "Claude Code for Product Managers", 11 Mar 2026 — https://www.sachinrekhi.com/p/claude-code-for-product-managers (paywalled after the intro; only the free part read)
Author: product leader and PM educator (ex-LinkedIn per his site; not verified here).
- (7) "You don't even need to know how to code for it to do so."; examples beat descriptions ("showing it what great looks like": 20 past release notes to match his voice); a competitor pricing summary "hand-verified for accuracy".
  Mark (b). Ours: approved shots in docs/rooms/ as examples for the owner's taste — matches "show what great looks like".

### O1 (official cross-check). Output styles — https://code.claude.com/docs/en/output-styles (read 11.10.2026)
- "Claude Code sends the active style's instructions with every request."; a custom style can keep coding instructions with `keep-coding-instructions: true`; desktop app sets it with `outputStyle` in a settings file; styles do not apply to non-fork subagents; "It's an instruction Claude follows, so nothing enforces it."
  Ours: how to talk to the owner (Russian, plain words, short; no empty words, Orwell's rules) lives in CLAUDE.md/owner-decisions.md — an output style is the documented place for "every response in a certain voice", sent with every request; we do not use one — differs (an option, not a finding of failure).

### S29. KOH (note), 「【保存版マニュアル】CLAUDE.mdは"7割"しか守られない」, 14 Jul 2026 — https://note.com/koh369/n/nb6f2cd440b84
Author: non-engineer, former SDF officer (20 years), now a manager: 「プログラミングの知識はありません」 ("I have no programming knowledge").
- (7)(2) 「「絶対にテストを実行してね」とCLAUDE.mdに大きく書いたのに、平気で飛ばされる」 ("I wrote 'definitely run the tests' in big letters in CLAUDE.md, yet it was skipped"); moved musts to hooks: PreToolUse block (exit 2; exit 1 does not block), PostToolUse format, Stop runs tests once (with loop prevention); checks loaded files with /memory and hooks with /hooks; starts CLAUDE.md empty, adds rules only after problems, ~200 lines.
- The "70%" compliance figure is 「一説には」 ("some say") — no source: unverified.
  Mark (a) with S4, S9, S27. Ours: owner does not write hooks; Stop runs checks (claude-guard stop) — matches.

### S30. storehero (Zenn), 「非エンジニアのための Claude Code / Cowork ベストプラクティス」 (best practices for non-engineers), date not read — https://zenn.dev/storehero/articles/18f7cf454ad947
- (7)(5) New session per task (/clear between unrelated tasks); after two failed fixes rewind or start fresh (failed attempts in context pull later answers toward them); 「検証できないものは納品しない」 ("Don't deliver what you can't verify"); check key figures, dates and names against source data because Claude invents them confidently.
  Mark (a) with S12 (slot machine) and CLAUDE.md "Two or three failed tries… measure first". Ours: "A new topic goes to a new window" (CLAUDE.md) — matches; fact-checker + "Names, numbers, quotes… come from the file" — matches.

### S31. HN thread on "Claude Code as a Daily Driver: Claude.md, Skills, Subagents, Plugins, and MCPs", 27 May 2026 — https://news.ycombinator.com/item?id=48289950 (Algolia API, first 100k of 143k chars; pseudonymous, weight low)
- rkuska: lint/test in git pre-commit "this way the targets are always ran and the agent is forced to fix them".
- chris_money202: "All these MCPs, Skills, plugins, etc are just noise"; hansmayer: "just write a few deterministic orchestration scripts"; Uptrenda: "Nerds and their tendency to over-complicate everything."
- Dzugaru questions "verify plan with a second clean agent" vs reading it yourself in 5 min; maipen: full delegation is "how you get a slop codebase".
- sgc: tuned prompts and skills are "tailored to a specific LLM" (transfer poorly).
- rethab: Opus 4.7 on the 100$/mo plan, keeps context under 30-40%.
  Mark (b) each; (c) against S25/S16 on elaborate setups.

### Local measures of our setup (11.10.2026, read-only)
- Characters: CLAUDE.md 4,324; docs/owner-decisions.md 11,752; docs/tools.md 2,495 → about 18,571 characters load at every start (Cyrillic quotes included); Boris's team CLAUDE.md is "2.5k tokens" (S3, via InfoQ). Token count of ours not measured.
- docs/board.md 17,146 characters; tools/claude-guard.mjs comments (lines 394–411) say the start prints only the top of the board because Claude Code keeps a hook's output whole only up to 10,000 characters — matches tw93's "limit hook output" (S20) and the official cap.

### R4. Xing Zhang et al., "Guardrails Beat Guidance: A Large-Scale Study of Rules, Skills, and Persistent Configuration for Coding Agents", arXiv 2604.11088v2 (13 Apr 2026, rev. 28 May 2026) — https://arxiv.org/html/2604.11088v2 (full text via WebFetch)
- Claude Code + Opus 4.6 on a 58-task subset of SWE-bench Verified; every rule condition beat the no-rule baseline (50.0%) by 6.9–13.8 pp; "Random rules improve a coding agent's task performance as much as expert-curated ones" (both 63.8%) — "context priming".
- 18 curated rules ablated one by one: 3 helped, all negative constraints ("do not refactor unrelated code"); 4 hurt, all positive directives ("follow code style"); 11 inert (Fisher p = 0.029; does not survive strict correction). Advice: "Prefer “do not” over “do.”"; "Up to 50 rules shows no degradation" (59–67% across 0–50).
- Limits stated: one vendor/model/benchmark (Python bug fixes); small n; baseline varied 50.0% vs 60.3%.
  (c) contradicts S1 ("Always provide an alternative") and S10 bisonbear ("telling the agent NOT to do something sometimes primes it"); measures task success on bug fixes, not rule obedience over long sessions — not our kind of task.
  Ours: CLAUDE.md mixes "never" lines (Playwright, main, keys) with positive process rules — no change suggested by this alone.

### S32. Teresa Torres (author of "Continuous Discovery Habits", product coach), All Things Product podcast "Claude Code", 10 Feb 2026 — https://www.producttalk.org/claude-code-all-things-product-podcast-with-teresa-torres-petra-wille/
- (7) Only show notes readable (transcript paywalled): Claude Code can spiral on web tasks; debug by asking "What are you doing?"; "treat it like an intern" with a "walled garden" (show-note summary, not her verbatim words). Her three-layer CLAUDE.md (global/project/reference) is reported only by secondary podcast summaries (chatprd.ai, Lenny's) — unverified.

### Our Stop hook, read against S5 and S15 (tools/claude-guard.mjs lines 3-4, 468-491, read 11.10.2026)
- It blocks the end of a turn (exit 2) while work is uncommitted, unpushed, missing from room-polish, or a helper's command is left running; its header cites the docs: "Claude Code ends it anyway after 8 blocks in a row". It does not read stop_hook_active.
- Against S15 (worktree cleanup deleting uncommitted/unpushed work): our Stop hook is exactly the defence the reporters lacked — matches.
- Against S5 (Stop loop burning quota): our conditions are deterministic and fixable by the agent (commit, push, stop a command), unlike #55754's "task incomplete" judgement; the leftover-command condition is the one that waits on something outside the agent's control — the 8-block cap is the only brake there.

## Subagents and reviewers (3) — more

### S33. Alireza Rezvani, "My Seven Claude Code Subagents Did the Easy Part", 3 Jun 2026 — https://alirezarezvani.substack.com/p/my-seven-claude-code-subagents-did (HN item 48382744)
Author: "Twenty-plus years of shipping software", mostly MedTech (no maintained project named on the page).
- (3) Seven role subagents (researcher, product, backend, launch, an adversarial reviewer `blueprint-qa`, …); six of seven outputs "commodity": "If the artifact has a known shape, an agent fills it."; the hard part was the seam: the product agent cut a feature the backend agent's data model still assumed — each right in its own lane; the human decision was "the entire product decision".
- The one he would hand out first: the adversarial reviewer, tools only Read and Grep; it "owes the plan nothing".
  Mark (a) with S34 below: read-only reviewers with isolated context pay off; role builders do not. Ours: all our reviewers are read-only (fact-checker, paper-reviewer, practice-reviewer, request-auditor, architecture-auditor: tools Read/Grep/Glob/Bash, practice-reviewer + web) — matches; we have no role builders — matches.

### S34. HN thread "How to use Claude Code subagents to parallelize development", 9–14 Sep 2025 — https://news.ycombinator.com/item?id=45181577 (288 pts, 128 comments; read via Algolia; pseudonymous)
- sixhobbits: role subagents (PM, backend dev) "the results were pretty bad compared to just using CC with no agent specific instructions."
- prash2488: role subagents, "Spent around 50 USD on a failed project, context contaminated"; narrower scaffolding/triage/QA agents worked better.
- a_bonobo: one refactor spawned 40+ subagents, each re-reading the script (cost).
- d4rkp4ttern: "they are black boxes" (cannot intervene).
- GoatInGrey ("hundreds of hours"): "more suitable for research tasks to provide informed context to the parent agent"; lucraft: "don't make subagents for the different roles, make them to manage context for token heavy tasks."
- (c) wild_egg: strong results on 200k+ line projects with the main agent banned from doing work itself.
  Mark (a) for "role subagents = noise; context-isolation and research subagents = useful" (S1, S7, S20, S33, here). 2025, possibly dated (subagents changed since: forks, background runs).
  Ours: quick-research and deep-research are research/context subagents — matches the useful kind; reviewers read-only — matches.

## Parts: status at the end (11.10.2026)
1 CLAUDE.md — answered (S1–S4, S7, S9–S11, S16, S19, S20, S22, R1–R4).
2 Hooks — answered (S1, S2, S5, S6, S21, S27, S29); "hooks that blocked legitimate work": only Shrivu (mid-plan blocks confuse) and Crosley (false positives from speculative hooks); no GitHub issue found on hooks blocking legitimate work — not found.
3 Subagents/reviewers — answered (S1, S7, S17, S18, S20, S33, S34).
4 Skills — answered (S24, S25, S18, S20).
5 Memory/compaction/work queue — answered (S1, S6, S14, S18, S20, S27, S23 contra Beads).
6 Worktrees/parallel — answered (S26, S7, S11, S15).
7 Non-programmer owner — partly (S12, S13, S28, S29, S30, S32, O1); a first-person account of plain-language reports to a non-coding owner over months: not found.
8 Cost/over-engineering — answered (S7, S21, S22, S23, S26, S31, S16, S20).
Korean: no first-person write-up found. Chinese: one (tw93). Japanese: four. Russian: two.

## Not read
- Rest of Boris Cherny's two X threads (login wall after the first post): https://x.com/bcherny/status/2007179832300581177 , https://x.com/bcherny/status/2017742743125299476
- Paywalled: https://www.sachinrekhi.com/p/claude-code-for-product-managers (after intro); Teresa Torres transcript (producttalk.org); Lenny's / How I AI not opened.
- Second halves of HN threads 46098838 and 48289950 (Algolia JSON > 100k chars); Habr 1062206, 1030832, 1086832; Armin's "A Year of Vibes"; Dale Seo (Korean) — not opened (budget).
- Papers R1–R4 not saved into objekt-files/papers (saving a downloaded file needs the owner's permission; WebFetch gives no raw text). Temporary text copies: scratchpad/mcmillan.txt, scratchpad/anthropic-teams2.txt.
- Reddit: not tried (owner downloads it).

