# What experienced Claude Code users write about long-project setup (shelf 1, "Rules and Claude Code")

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): what experienced Claude Code users wrote (shelf 1). Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Searched 11.10.2026 (UTC). Practitioners first; official docs only as a cross-check.
Marks: (a) several independent people, (b) one person, (c) contradicted. "possibly stale" = written before 2025.
Weight: the author's visible experience is named on each point. "Ours:" = where our setup matches or differs.

Our setup read (read only): CLAUDE.md 45 lines + imports docs/owner-decisions.md (78 lines) and docs/tools.md (28 lines);
.claude/settings.json hooks on SessionStart, UserPromptSubmit, PreToolUse (Bash|PowerShell, mcp__.*, Write|Edit),
SubagentStart/Stop (practice-reviewer), Stop (180 s timeout), all through tools/claude-guard.mjs (493 lines);
7 subagents (.claude/agents/); 1 skill (.claude/skills/new-room/SKILL.md, 71 lines); docs/board.md (91 lines) shown by the start hook;
worktrees per session; auto-memory folder (MEMORY.md, 7 entries).
Earlier official-docs digest: docs/audit/rebuild/claude-code-practice.md (10.10).

## Parts (each gets an answer or "not found")
1. CLAUDE.md: length, content, imports, what people cut and why
2. Hooks as guards: what they enforce, failures, hooks that blocked work
3. Subagents and reviewers: which paid off, which were noise
4. Skills
5. Memory and context across many sessions, compaction, a work queue
6. Worktrees and parallel sessions
7. Working for a non-programmer owner (plain-language reports, approvals)
8. Cost and over-engineering of the process itself (too many rules/guards, what was removed)
Languages: English; Japanese (Zenn, Qiita, note); Chinese (Juejin, Zhihu); Korean; Russian (Habr); others where found.

## Findings (appended as found)

### S1. Shrivu Shankar, "How I Use Every Claude Code Feature", 2 Nov 2025 — https://blog.sshh.io/p/how-i-use-every-claude-code-feature
Author: runs Claude Code across a company monorepo (team uses "several billion tokens per month"); blog sshh.io. Read in full via WebFetch.
- (1) CLAUDE.md: monorepo file "currently sits at 13KB"; "Start with Guardrails, Not a Manual"; against @-importing docs (bloats context); instead "pitch the agent on _why_ and _when_ to read the file"; negative-only rules bad: "Always provide an alternative."; "If you can't explain your tool concisely, it's not ready for the CLAUDE.md".
  Ours: CLAUDE.md @-imports docs/owner-decisions.md (78 lines) and docs/tools.md (28) — differs from his advice on @-imports; docs/tools.md is a when/why pointer list — matches his "why and when".
- (2) Hooks: block-at-submit (PreToolUse on git commit checks a pass-file written by tests) is his main one; avoids block-at-write: blocking mid-plan "confuses or even “frustrates” it"; hint hooks non-blocking.
  Ours: tools/claude-guard.mjs pre runs on every Bash/PowerShell, every mcp__ call and every Write/Edit — partly block-at-write; differs.
- (3) Subagents: custom subagents "Gatekeep Context" and "Force Human Workflows"; prefers built-in Task clones ("Master-Clone").
  Ours: 7 custom reviewers/researchers (.claude/agents) — differs; ours are read-only checkers, his objection is to hiding testing context from the main agent.
- (4) Skills: agrees "Skills are (maybe) a bigger deal than MCP"; moved stateless tools from MCP to CLIs.
- (5) Context: "/compact" avoided: "The automatic compaction is opaque, error-prone, and not well-optimized."; default /clear + custom /catchup (read changed files on branch); "Document & Clear" for large tasks (plan+progress to .md, clear, resume).
  Ours: docs/board.md as the queue the start hook shows — matches "Document & Clear" in spirit.
- (6) Parallel: `claude -p` in bash scripts for large refactors; no worktrees mentioned.
- Mark: (5)/(2) partly (a) — see others below.

### S2. Kyle (HumanLayer), "Writing a good CLAUDE.md", 25 Nov 2025 — https://www.humanlayer.dev/blog/writing-a-good-claude-md
Author: HumanLayer builds agent tooling (humanlayer, CodeLayer); their own root file "less than sixty lines". Read via WebFetch.
- (1) "< 300 lines is best, and shorter is even better" (called "general consensus"); "Frontier thinking LLMs can follow ~ 150-200 instructions with reasonable consistency"; Claude Code's system prompt alone "~50 individual instructions".
- (1) CLAUDE.md is wrapped in a reminder "IMPORTANT: this context may or may not be relevant to your tasks" — so Claude ignores what looks irrelevant.
- (1) Progressive disclosure: task-specific files listed, "Prefer pointers to copies"; avoid /init auto-generation ("the highest leverage point of the harness").
- (2) "Never send an LLM to do a linter's job."; Stop hook "runs your formatter & linter and presents errors to Claude for it to fix."
  Ours: CLAUDE.md 45 lines, but with @-imports about 151 lines load each session, owner-decisions.md is long prose lines (each line ~200+ chars) — roughly within 300 lines but the instruction count is high; our Stop hook runs checks (claude-guard stop, 180 s) — matches the Stop-hook idea.

### S3. Boris Cherny (created Claude Code, Anthropic), via InfoQ (Sergio De Simone), 10 Jan 2026 — https://infoq.com/news/2026/01/claude-code-creator-workflow/
Original thread: https://x.com/bcherny/status/2007179832300581177 (not opened: X; quotes below are as InfoQ reports them).
- (1) "Currently, Cherny says, their CLAUDE.md is 2.5k tokens"; "Each team at Anthropic maintains a CLAUDE.md in git to document mistakes"; he tags coworkers' PRs to add learnings.
  Ours: CLAUDE.md is the rules file grown from the owner's corrections (docs/owner-decisions.md) — matches "document mistakes"; ours loads more (CLAUDE.md+2 imports ~151 lines; size in tokens not measured here).
- (2) Hooks: a PostToolUse hook on Write|Edit runs the formatter ("bun run format || true") — a fixer, not a blocker.
  Ours: no fixer hooks; claude-guard pre is a blocker — differs.
- (3) Slash commands that start subagents for commit/PR, simplify, verify; named: /commit-push-pr.
- (6) Parallel: "five locally in his MacBook's terminal and 5-10 on Anthropic's website"; 10-20% of remote sessions abandoned.
- Verification: "Claude tests every single change I land to claude.ai/code using the Claude Chrome extension" (feedback loop, InfoQ says 2-3x better).
  Ours: practice-reviewer + browser pane + headset look (CLAUDE.md "Checking") — matches the verify loop.
- Permissions: "almost never uses --dangerously-skip-permissions"; allowlists safe commands via /permissions.
  Ours: .claude/settings.json permissions.allow lists quest-look, gh run, push to claude/* — matches.

### S4. GitHub issue #32193 "Claude violates its own mandatory CLAUDE.md instructions with no enforcement mechanism", 8 Mar 2026 — https://github.com/anthropics/claude-code/issues/32193
Filed by @DEKEDMC (Opus 4.6, macOS); no maintainer reply; closed "not planned" by bot 23 May 2026 for inactivity.
- (1)(2) CLAUDE.md rules ("seek clarification over guessing"; read docs before proposing) broken in one session; asks for "A mechanism to make CLAUDE.md instructions enforceable rather than advisory".
- Comments: @penguinboi "There's no such thing as a 'mandatory instruction' for an LLM" and the model should not be "the sole verifier of its own work"; @MaxwellCalkin suggests PreToolUse hooks; @ratkitesurfer: 13 violations of a plan-approval rule, model quoted: "The moment I start reasoning about whether this particular case is an exception, I've already broken the rule."; @ARDA-World: required first-action file read skipped; memory writes never happened unless prompted.
  Mark (a): CLAUDE.md is advisory, hard rules belong in hooks/permissions — same as official docs ("context, not enforced configuration", docs/audit/rebuild/claude-code-practice.md) and S2.
  Ours: matches — must-not-break things are in hooks (owner-decisions "What matters is kept by checks the machine runs by itself"); independent reviewers check the main agent (fact-checker, practice-reviewer) — matches "not the sole verifier".

### S5. GitHub issue #55754 "Stop hook returning {"ok": false} causes infinite loop", 3 May 2026 — https://github.com/anthropics/claude-code/issues/55754
Filed by AndresMuelas2004; Claude Code 2.1.126, Windows, PowerShell, Opus. Closed as duplicate of #54360 (6 May 2026); no maintainer reply.
- (2) A Stop hook that judged the task incomplete and did not check stop_hook_active looped "~50 minutes", "repeated >100 times", "consumed my entire session quota"; trigger: a skill that launched background subagents and told Claude to wait idle. Asks: "Honor stop_hook_active automatically" and a "Hard cap on Stop-hook continuation iterations per task".
  Mark (b) one reporter, but the duplicate #54360 (stop_hook_active stays false on repeat fires) is a second; official docs (10.10 digest) say a Stop hook is overridden after eight consecutive blocks — so the cap may now exist (unverified which version).
  Ours: Stop hook claude-guard stop, timeout 180 s, and it blocks the end of a turn while a command under Claude Code runs longer than 10 minutes (board 11.10) — the same pattern (blocking Stop while background work runs); check that claude-guard stop reads stop_hook_active (not checked here: read-only task, flag for the caller).

### S6. GitHub issue #6354 "Claude forgets everything in CLAUDE.md after compaction", opened 22 Aug 2025, still open — https://github.com/anthropics/claude-code/issues/6354
Filed by flux627 (CLI 1.0.88, possibly stale for the bug itself); thread runs to Sep 2026.
- (5) Maintainer igorkofman (22 Aug 2025): "In my testing it still have the contents of CLAUDE.md in context" — asks for a repro.
- tatyree (24 Nov 2025): "It just wiped out a running production project because it carried on making changes after compaction".
- Workarounds: SebRogala (4 Feb 2026) SessionStart hook with compact matcher re-reading CLAUDE.md — worked after /clear, not /compact: "The compacted conversation summary creates 'momentum' that overrides the injected reminder."; yurukusa (Mar/Apr 2026) PreCompact checkpoint + PostToolUse reprinting rules every 20 calls: "Neither approach is perfect"; John-Rood (27 Sep 2026): "The rules text surviving is mostly handled now... What still fails is rank." / "Re-injection loses that fight. A denied tool call does not." — a PreToolUse gate denying Bash/Edit/Write until the rules file is re-read after compaction; notes PostCompact may not fire on Windows (#77832).
  Mark (a): many reporters; (c) partly — maintainer says contents remain; the newest comment agrees the text survives and the failure is priority ("rank").
  Ours: SessionStart hook (claude-guard start) shows the board; owner-decisions.md says it loads "at every session start and after every compaction" (via CLAUDE.md import) — matches text survival; no post-compaction gate — differs from John-Rood's gate.

### S7. Peter Steinberger, "Just Talk To It – the no-bs Way of Agentic Engineering", ~Oct 2025 (page undated; 16 Oct 2025 per conffab repost) — https://steipete.me/posts/just-talk-to-it
Author: founded PSPDFKit; later OpenClaw (joined OpenAI Feb 2026 per iq.wiki, unverified). Mostly a Codex user by then; Claude Code earlier.
- (1) His AGENTS.md (symlinked to claude.md) about 800 lines, "organizational scar tissue"; the agent writes it: when something goes wrong he asks for a concise note; avoids all-caps commands; expects to trim it as models improve.
  (c) contradicts S2's "<300 lines" — a long file can work for one author.
- (3) Subagents a "charade"; uses separate terminal windows instead; Anthropic's sample subagent "an amalgamation of slop", possibly "context poison".
- (2) Hooks: "no hook will stop them if they are determined."
- MCP: most should be CLIs (GitHub MCP 23k tokens vs gh CLI).
- Plan mode: "let's discuss"/"give me options" instead of big plan files.
- (6) 3-8 agents in a terminal grid "mostly in the same folder"; tried worktrees and PRs, "always revert back to this setup".
- (8) "elaborated charades instead of getting sh*t done" — against heavy process; orchestration tools "None stick".
  Ours: owner-decisions forbid a second window until the corridor is done (one window at a time) — opposite of his many-agent style but agrees with "few tools"; our 7 subagents differ from his no-subagent view.

### S8. Hacker News, list of CLAUDE.md stories (Algolia API, read 11.10.2026) — https://hn.algolia.com/api/v1/search?query=CLAUDE.md&tags=story
Top by points: "Writing a good Claude.md" (748 pts, 290 comments, 30 Nov 2025, item 46098838); "Claude Code now reads AGENTS.md if there is no Claude.md" (741 pts, 18 Sep 2026, item 49760187, links the changelog); "Claude Code as a Daily Driver" (451 pts, 27 May 2026, item 48289950); "Why Does Claude.md Keep Growing? Catastrophic Remembering in Agentic Coding" (arXiv 2608.11095, 12 Aug 2026); "Your Claude.md Is a Wish List, Not a Contract" (30 Mar 2026); "I am morally opposed to updating my Claude.md" (20 Aug 2026).

### S9. HN thread on "Writing a good Claude.md", 30 Nov–1 Dec 2025 — https://news.ycombinator.com/item?id=46098838 (read through the Algolia items API, first 100k of 189k chars)
Commenters are pseudonymous (weight low unless named). Post author 0xblacklight is with HumanLayer.
- victorbuilds (1 Dec 2025): deleted a production database; "no amount of CLAUDE.md instructions would have prevented that." — revoked access instead.
- anonzzzies (30 Nov 2025): "claude routinely ignores stuff from CLAUDE.md, even with warning bells etc. You need a linter preventing things."
- MarkMarine: "Setting hooks has been super helpful for me, you can reject certain uses of tools".
- lostdog: keep it short, "a couple paragraphs describing the codebase at a high level", grow from observed mistakes; Aeolun: "If you add what you tell it every time to CLAUDE.md, it also works fine".
- johnsmith1840: "more context comments and info damage quality on hard problems."
  Mark (a) with S2/S4: hard rules go to tools (hooks, permissions, linters), not prose.

### S10. Ask HN "Do you still spend time maintaining Claude.md / AGENTS.md files?", 16–17 May 2026 — https://news.ycombinator.com/item?id=48160604 (10 comments, pseudonymous)
- david_d8912 (asker): behavior rules "they're constantly not followed."
- bisonbear: "Keep it concise, use progressive disclosure / nested AGENTS.md"; "telling the agent NOT to do something sometimes primes it to do that exact thing."
- verdverm: rewrote it to "a table of contents and some highlights of important things".
- luodaint: splits facts / regression constraints / behavior rules; "Rules made from scratch are usually not followed." — behavior rules work only when concise and made from an observed failure.
- alwillis: guidelines into .claude/rules for progressive disclosure.
  Ours: owner-decisions.md is made of observed failures with his words — matches luodaint; it is behavior rules in long prose, loaded whole — differs from "table of contents" (verdverm) and progressive disclosure.

## Research cross-checks (papers on CLAUDE.md/AGENTS.md files; not practitioners, but measured)

### R1. Kushal Chakrabarti, "Why Does CLAUDE.md Keep Growing? Catastrophic Remembering in Agentic Coding", arXiv 2608.11095v1, 11 Aug 2026 — https://arxiv.org/html/2608.11095v1 (full text read via WebFetch, first 100k of 153k chars; single author, preprint, no affiliation shown)
- (1)(8) Data: "247,694 instruction lifetimes in 1,867 repositories" (public repos with CLAUDE.md, AGENTS.md or copilot-instructions.md); files grow "more than tripling over their lifetime (+226%)", "gaining +4.9 net instructions every commit"; old instructions are rarely deleted because the reason is lost.
- Fix: "the practice is to record the why, not the how or the what"; rationale comments removed "99.3% of the excess size (+211.3% to +1.4%) over 51 steps" in a controlled test; WildIFEval: "Comments lift satisfaction from 50.4% to 62.0%".
  Ours: docs/owner-decisions.md records each rule with his quoted words and date (the why) and CLAUDE.md says "comments say why" — matches the paper's remedy; it makes our rules prunable when he changes his mind.
- Not saved to the papers library: saving a file needs the owner's permission (download rule); WebFetch gives no raw text.

### R2. Gloaguen, Mündler, Müller, Raychev, Vechev (ETH Zurich / LogicStar.ai), "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?", arXiv 2602.11988, 12 Feb 2026 — https://arxiv.org/html/2602.11988 (full text via WebFetch, 100k of 103k chars)
- Claude Code with Sonnet-4.5 among four agent/model pairs. Their table: Sonnet-4.5 on their benchmark 73.2% with no file, 65.2% with an LLM-generated file, 70.3% with the developers' own file; developer files "+2.4% on average" not significant (p = 0.21); LLM files raise cost about 20-23% and add steps.
- Agents do follow the files; "repository overviews" are "not helpful"; human files should hold only what the agent needs and the README lacks.
  Ours: CLAUDE.md is mostly behaviour and process rules, not a codebase overview (that is in ARCHITECTURE.md / docs/state.md, read on demand) — matches.

### R3. Damon McMillan (HxAI Australia), "Instruction Adherence in Coding Agent Configuration Files: A Factorial Study of Four File-Structure Variables", arXiv 2605.10039, May 2026 — https://arxiv.org/pdf/2605.10039 (full PDF text read: pdftotext of the copy WebFetch saved)
- 1,650 Claude Code CLI sessions (CLI 2.1.92; Opus 4.7 on 2.1.123), CLAUDE.md sizes "25, 100, 250, 500 lines": "Within 25 to 500 lines, file length did not produce a detectable compliance contrast"; splitting into several files did not help either ("does not support distributing the configuration across multiple files").
- Largest effect: compliance falls as the session goes on: "5.6% lower odds of compliance per generation step (OR = 0.944)"; advice: rules that must hold over long sessions "benefit from agent hooks that re-surface the rule mid-session (PreToolUse, PostToolUse, Stop)" and tooling checks (linters, CI).
  (c) contradicts the length advice of S2 (<300 lines, ~60 ideal) within 25–500 lines; agrees with S4/S6/S9 that hooks and tooling carry the must-holds.
  Ours: hooks on PreToolUse and Stop (claude-guard) — matches; length of CLAUDE.md+imports (~151 lines) is inside the tested range.

### S11. Mitchell Hashimoto, "My AI Adoption Journey", 5 Feb 2026 — https://mitchellh.com/writing/my-ai-adoption-journey
Author: co-founder of HashiCorp, maintains Ghostty. Mostly Amp/Codex by then; Claude Code tried early and "initially unimpressed".
- (1)(2) "Harness engineering": each time an agent errs, engineer a fix "such that the agent never makes that mistake again": either an AGENTS.md line (each line in Ghostty's example "is based on a bad agent behavior") or a programmed tool/script plus an AGENTS.md note that it exists.
- (6) Parallel: "I'm not [yet?] running multiple agents, and currently don't really want to."; turned desktop notifications off because context switching was "very expensive".
- (7) Reviews output himself; will not let agents answer issues; calls his role "babysitting".
  Mark (a) with S3 (Cherny: CLAUDE.md documents mistakes) and S10 (luodaint): rules from observed failures.
  Ours: owner-decisions.md = rules from observed failures, plus tools (tools/quest-look.mjs, claude-guard) — matches; our owner does not review code (owner-decisions: "he never re-checks code, machines and reviewers do") — differs from Hashimoto's own review, replaced by reviewer agents.

### S12. Anthropic, "How Anthropic teams use Claude Code" (PDF, file dated 3 Jun 2025; interviews with Anthropic's own teams) — https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf (full text via pdftotext of the copy WebFetch saved)
Authors: Anthropic staff about their own use (engineering and non-engineering teams). Mid-2025: early Claude Code, read as possibly dated in details.
- (7) Legal Department (non-coders): "Plan extensively in Claude.ai first" then "ask Claude to summarize everything into a step-by-step prompt for implementation"; "Ask Claude Code to slow down and implement one step at a time"; "Use screenshots liberally"; "iterate based on visual feedback rather than describing features in text".
  Ours: owner judges by pictures and the headset, one action at a time (owner-decisions "I check all a tool can measure; he judges what he sees, one action at a time"; CLAUDE.md "Progress = he saw it") — matches.
- (5)(8) Data Science/ML: "Treat it like a slot machine": "Save your state before letting Claude work, let it run for 30 minutes, then either accept the result or start fresh"; "Starting over often has a higher success rate than trying to fix Claude's mistakes."; "Interrupt for simplicity": ask "why are you doing this? Try something simpler."
  Ours: CLAUDE.md "Two or three failed tries at one problem: measure first"; commit and push often — partly matches (we measure rather than restart).
- (1) Data Infrastructure: "The better you document your workflows, tools, and expectations in Claude.md files, the better Claude Code performs." (c) vs R2 (overviews do not help) and S2 (short files).
- Commits as checkpoints: tell Claude Code to "commit your work as you go"; "checkpoints regularly so they can easily revert".
  Ours: "commit and push often (power cuts)" — matches.

### S13. Nomiki Petrolla, "How a Non-Technical Female Founder Builds Frontend Using Claude Code", 25 Feb 2026 — https://theanna.io/building-theanna/how-a-non-technical-female-founder-builds-frontend-using-claude-code
Author: solo founder/CEO of Theanna, ex Head of Product; "never written a line of backend code in my life".
- (7) Works in plain language with screenshots; asks Claude to "show me the UI" (local server); her lead engineer audits each pull request before merge. No CLAUDE.md or failures described.
  Mark (b). Ours: no human engineer reviews; reviewer agents + CodeRabbit on the PR (owner-decisions) stand in — differs in who checks.

### S14. Steve Yegge, Beads (bd), README read 11.10.2026 — https://github.com/steveyegge/beads
Author: Steve Yegge (ex-Amazon/Google, Sourcegraph; README itself does not state it); repo 27.8k stars, 11,261 commits.
- (5) A work queue for agents instead of markdown plans: "replaces messy markdown plans with a dependency-aware graph, allowing agents to handle long-horizon tasks without losing context"; `bd ready` lists "tasks with no open blockers"; `bd prime` prints "agent workflow context and persistent memories"; old closed tasks summarized ("memory decay"); README tells agents not to use markdown TODO lists.
  Mark (b) as a tool by one author, widely adopted (stars). Ours: docs/board.md is a markdown queue in Russian the start hook shows; 91 lines with long finished items ("(Russian text: see the source) still in it — differs from Beads (structured, closed items summarized away); matches the idea of one queue read at start.

### S15. Worktree data loss, GitHub issues (2026)
- #46444 "Claude Code worktree auto-cleanup permanently deleted 10 days of uncommitted project work", 10 Apr 2026 — https://github.com/anthropics/claude-code/issues/46444 — Windows 11, desktop app; at each new session start the app "silently cleaned up the previous session's worktrees WITHOUT committing or preserving any work"; comments: same on macOS; manu-sapiens (20 May 2026): Claude said it committed "But it did not and just deleted the worktrees." Recovery advice (guimaferreira): `git fsck --lost-found`, `git reflog --all`, session transcripts. No maintainer reply; closed "not planned" by bot 22 Jul 2026.
- #38287 "Worktree cleanup silently deletes branches with unmerged commits", 24 Mar 2026 — https://github.com/anthropics/claude-code/issues/38287 — `claude -w` exit removed the branch "even if it contains commits that were never pushed or merged"; workaround: a PreToolUse hook on ExitWorktree that blocks (exit 2) when unpushed commits exist; reporter notes "In PreToolUse hooks, exit 0 means 'allow'. To block a tool call, the hook must exit 2." Closed by bot, no fix listed.
  Mark (a): several reporters, Windows and macOS. Not confirmed fixed (bot closures).
  Ours: worktree per session in the Windows desktop app (this session is in .claude/worktrees/continuation-e2af23) — the exact exposed setup; CLAUDE.md "commit and push often (power cuts)" and push to claude/* allowed in settings.json — matches the defence; whether claude-guard blocks worktree exit with unpushed commits: not checked (read-only).

## Japanese

### S16. kiyokuro (Kurashiru Inc. tech blog), "Claude Codeの失敗をチームルールに昇格させる仕組み" (turning Claude Code failures into team rules), 7 May 2026 — https://zenn.dev/dely_jp/articles/5bc3e9cf62d776
Author: a team at Kurashiru (large Japanese recipe app company), Rails project as of Apr 2026.
- (1)(5) Failures go first to a personal, gitignored .claude/workspace/FAILURES.md; only after 3 or more similar failures does `/failure-promote` propose a rule (a draft PR into `.claude/rules/{project}/*.md`; general principles into CLAUDE.md). Reason: one-off failures turned into rules inflate maintenance; threshold "still being tuned".
- `/retro` sorts lessons into 5 kinds: code style → hook/linter; architecture → rules; domain knowledge → memory; external integration → skills; dangerous operations → hook.
- Pruning test: "この行を削除したらClaudeが間違えるか？" ("If I delete this line, would Claude make a mistake?") — same as Anthropic's docs test (docs/audit/rebuild/claude-code-practice.md).
  Mark (a) with S3, S11: rules from observed failures; adds a threshold.
  Ours: every observed failure the owner names becomes a line in owner-decisions.md at once (no threshold) — differs; our sorting (hooks for irreversible, skills for room procedure, memory for the rest) matches their 5-way sort in shape.

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
