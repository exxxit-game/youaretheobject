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


Continued in [forums-claude-code-2.md](forums-claude-code-2.md).
