# Shelf 1, part C: our subagents and our skill against Anthropic's docs (11.10.2026)

> Correction (11.10, two fact-checks of the shelf page): 2.1.268 below is the npm CLI on PATH, not what runs the sessions. The desktop app runs its own copy, 2.1.295 (its folder AppData/Roaming/Claude/claude-code holds 2.1.295 and 2.1.293), so maxTurns, omitClaudeMd and onFailure are all available without an update.

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): shelf 1, part C: our subagents and skill against the Claude Code docs of 11.10. Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only; nothing in the repo changed. Docs: the raw pages saved today in `scratchpad/ccdocs/` (cited as
`sub-agents.md:N`, `skills.md:N`, `features-overview.md:N`, `best-practices.md:N`, `costs.md:N`, `memory.md:N`).
Ours: worktree `continuation-e2af23` (paths relative to it). Installed Claude Code: `2.1.268 (Claude Code)`
(`claude --version`, run today); doc version gates below are checked against it.

How rows are counted: one row per doc statement; where all 7 agents behave the same, one row covers all 7
and names their lines. Classes: MATCH (we do what the doc says, or leave an optional field at a default
that fits); DIFFER-needed (a reason in docs/owner-decisions.md requires the difference); DIFFER-not-needed
(no such reason, or his decisions point the other way: fix it).

## 1a. DIFFER rows first

| # | Doc says (file:line, words) | Ours (path:line) | Class | Needed? (reason) | Smallest fix |
|---|---|---|---|---|---|
| A13 model | `sub-agents.md:307` "When you omit it, Claude Code picks the model in the subagent model order"; order ends at `:364` "The main conversation's model"; `:23` "Control costs by routing tasks to faster, lower-cost models like Haiku"; `costs.md:253` "For simple subagent tasks, specify `model: haiku`" | No `model:` line in any of the 7 (frontmatter is lines 1-5 of each `.claude/agents/*.md`); no `CLAUDE_CODE_SUBAGENT_MODEL` in `.claude/settings.json` or `~/.claude/settings.json` (grep: nothing) -> every agent runs on the main model, Opus 5.5 | DIFFER-needed | `docs/owner-decisions.md:19` "the strongest model («(Russian text: see the source) | None. Optional: `model: inherit` in each file writes his decision down (a per-call `model` still overrides it, `sub-agents.md:361`) |
| S11 must-hold rules | `skills.md:1184` "Claude skipped a rule that must hold every time: move the rule into a hook ... define the hook in the skill's `hooks` frontmatter" | `.claude/skills/new-room/SKILL.md:3` "none may be skipped" and `:9` "Do not tell the owner 'done' before step 10" are prose; only step 9's practice review is machine-held (`.claude/settings.json:77-91`, `tools/review-gate.mjs`); `docs/mistakes.md:11` step 1 "unguarded: a step of a procedure, not a test" | DIFFER-needed | `docs/owner-decisions.md:13` the process is frozen: "it changes only on a health-check finding ... or his word"; `:14` "a ban only where a mistake cannot be undone or costs him time; a complaint is no reason for a new guard" | None now; a candidate for his word (section 2, F6) |
| A15 maxTurns | `sub-agents.md:309` "Maximum number of agentic turns before the subagent stops. When the subagent reaches the limit, Claude Code returns its output marked as partial, and Claude can resume it ... requires Claude Code v2.1.246 or later" (installed 2.1.268) | None of the 7 sets it. Limits are prose: `quick-research.md:12-13` "At most 8 searches and 8 page reads in total, about 10 minutes"; `deep-research.md:33-35` "about 45 minutes, at most 60 searches and 80 page reads"; `docs/mistakes.md:40` "unguarded: research limits are prose ... nothing reads whether a report was cut short at its limit" | DIFFER-not-needed | No reason found; `docs/owner-decisions.md:15` points the other way: "What matters is kept by checks the machine runs by itself ... not by memory" | Add `maxTurns:` to quick-research and deep-research (and a generous one to the 5 reviewers). Numbers by inference from the prose limits (a turn is one model reply, which may hold several tool calls): quick about 30, deep about 200; check them against real run lengths in the subagent transcripts (`sub-agents.md:1125`, `~/.claude/projects/{project}/{sessionId}/subagents/`) |
| A16 what a subagent loads | `sub-agents.md:33` "Every other built-in and custom subagent loads both [CLAUDE.md and git status], unless its definition sets the `omitClaudeMd` field"; `:1072`; `memory.md:102` imported files "are expanded and loaded into context at launch"; `:315` omitClaudeMd "Requires Claude Code v2.1.271 or later" | `paper-reviewer.md:3` "Gets only the paper text and the code": not true; each run of every agent also gets CLAUDE.md + `@docs/owner-decisions.md` + `@docs/tools.md` = 21,708 bytes (`wc -c`) and the git status | DIFFER-not-needed | No reason found for the false claim | Now: reword `paper-reviewer.md:3` (it gets the paper, the code and CLAUDE.md). After updating Claude Code to 2.1.271 or later: `omitClaudeMd: true` for paper-reviewer makes the claim true (settings hooks still apply inside subagents, `sub-agents.md:741`, so the guards hold) |
| A17 rules restated in bodies | `sub-agents.md:1079` "The main conversation still has your full CLAUDE.md when it reads these subagents' results, so most rules don't need to reach the subagent itself" (and the subagent loads CLAUDE.md itself, `:1072`) | The A-Frame docs path in `architecture-auditor.md:30-31`, `fact-checker.md:42-43`, `practice-reviewer.md:13-14` repeats `docs/tools.md:15-16`; "Never run Playwright, Chromium" in `architecture-auditor.md:8-9`, `fact-checker.md:10-11` repeats `CLAUDE.md:33` | DIFFER-not-needed (minor, harmless) | No reason found | Drop the repeated path sentence; keep the `find /` and time-limit sentence, which CLAUDE.md lacks (`docs/mistakes.md:70`) |
| S12 unnamed reviewer | `best-practices.md:538` "run the bundled `/code-review` skill, which reviews the current diff for bugs in a fresh subagent" | `SKILL.md:51-52` "an independent reviewer agent on the diff": no agent of ours has that name | DIFFER-not-needed | No reason found | Name one: the doc's bundled `/code-review`, or `coderabbit:coderabbit-review` (CodeRabbit is kept, `docs/owner-decisions.md:19,21`) |
| S13 skill header unchecked | `skills.md:394` "If the YAML between the markers doesn't parse, the skill still loads with no fields set"; `:1167` "Claude can't match against your `description`"; `:1171` `claude plugin validate .claude/skills` | `tools/health.mjs:232-233` and `tests/health.test.mjs:123` read only `.claude/agents`; `SKILL.md:1-4` is checked by nothing (it parses today) | DIFFER-not-needed | `docs/owner-decisions.md:15` "kept by checks the machine runs by itself" | Run `agentHeaderProblems` over `.claude/skills/*/SKILL.md` too (health.mjs and the test, a few lines) |

## 1b. MATCH rows

Agents, frontmatter (doc table `sub-agents.md:301-320`):

| # | Doc says | Ours | Class |
|---|---|---|---|
| A1 name | `:303` "Unique identifier ... Names can't contain `:`" | line 2 of each file; equals the file name; no `:` | MATCH |
| A2 description decides delegation | `:304` "When Claude should delegate to this subagent"; `:25` "Claude uses each subagent's description to decide when to delegate tasks" | line 3 of each says when: `paper-reviewer.md:3` "Use after building or changing any room"; `fact-checker.md:3` "Use before a plan or a doc is relied on"; `architecture-auditor.md:3` "after a large change"; `request-auditor.md:3` "at most once at the end of a step"; `practice-reviewer.md:3` "before it is run with the owner or shown to him" | MATCH |
| A3 description budget | `:27` warning when combined descriptions "exceed 15,000 tokens" | 7 descriptions = 2,290 characters (`wc -c` of line 3) | MATCH |
| A4 single out one agent | `:1232` "Make each description specific enough to route to the right subagent" | `quick-research.md:3` "A wide question ... goes to deep-research instead"; `deep-research.md:3` "For one narrow fact use quick-research instead" | MATCH |
| A6 proactive use | `:826` "To encourage proactive delegation, include phrases like 'use proactively'" (optional) | no "proactively"; each moment is named in `docs/tools.md:7,11-12,21-24` and `CLAUDE.md:34,43`, loaded every session | MATCH (routing by CLAUDE.md, `features-overview.md:40` "always do X" rules) |
| A7 tools allowlist | `:450-458` example `tools: Read, Grep, Glob, Bash` "can't edit files, write files, or use any MCP tools"; `:1233` "Limit tool access" | `architecture-auditor.md:4`, `fact-checker.md:4`, `paper-reviewer.md:4`, `request-auditor.md:4` exactly that; `practice-reviewer.md:4` adds WebSearch, WebFetch; research agents list their MCP tools by name | MATCH |
| A8 read-only with Bash | `:1239` the doc's own "read-only subagent ... excludes Edit and Write" keeps Bash; `:668` a PreToolUse hook only "when you need to allow some operations of a tool while blocking others" | "Read only" in prose (`fact-checker.md:10`, `paper-reviewer.md:34`, `practice-reviewer.md:37`) with Bash | MATCH (a stray write in a git worktree can be undone: `owner-decisions.md:14` "a ban only where a mistake cannot be undone") |
| A9 no nesting | `:1038` "such as a reviewer that should stay read-only, omit `Agent` from its `tools` list" | all 7 omit Agent | MATCH |
| A10 no Skill tool | `:611` "To prevent a subagent from invoking skills entirely, omit `Skill`" | all 7 omit Skill | MATCH (see F3 for what this costs the practice-reviewer) |
| A11 background tool filter | `:440` a background subagent keeps "every MCP tool but only these built-in tools: `Read`, `Grep`, `Glob`, `LSP`, `Bash`, ... `WebFetch`, `WebSearch`"; `:906` fork mode is on by default, so subagents run in the background | every built-in we list is in that set | MATCH |
| A12 MCP names | `:474` server-level patterns allowed; `:472` launch refused only "When nothing in the `tools` list resolves" | `deep-research.md:4`, `quick-research.md:4` list single tools by server id; `tools/health.mjs:203-207` checks the names are there | MATCH (note: a renamed connector would drop its tools without a word; the check reads text only) |
| A14 effort | `:316` "Overrides the session effort level" (optional) | none | MATCH (default; the strongest-model decision points no lower) |
| A18 permissionMode | `:579` "When the main conversation is in `bypassPermissions`, `acceptEdits`, or auto mode, the subagent runs in that same mode and Claude Code ignores the `permissionMode` you set" | none (sessions run in auto mode) | MATCH (the field would be ignored) |
| A19 memory | `:313`, `:649` the agent's prompt "includes the first 200 lines or 25KB of `MEMORY.md`" | none | MATCH: `docs/decisions.md:123` fact-checker "run ... in two runs that do not see each other"; a shared memory folder would let them |
| A20 hooks for subagent events | `:787-794` "Configure hooks in `settings.json` that respond to subagent lifecycle events ... matchers to target specific agent types by name" | `.claude/settings.json:77-91` SubagentStart/SubagentStop, matcher `practice-reviewer`; `tools/claude-guard.mjs:432-433` checks `agent_type` | MATCH |
| A21 skills (preload) | `:310` optional | none | MATCH (default; see F3) |
| A22 mcpServers | `:311` optional | none; tools come from the session | MATCH |
| A23 background | `:314`; `:906` fork mode already backgrounds them | none | MATCH |
| A24 isolation | `:317` worktree "branched by default from your default branch rather than the parent session's `HEAD`" | none; `practice-reviewer.md:36-37` "read the files as they stand" | MATCH (a worktree from main would show the reviewers the wrong files) |
| A25 color, initialPrompt, experimental | `:318-320` display colour; main-session only; cache lifetime | none | MATCH (n/a) |
| A26 disallowedTools | `:306` optional | none; the allowlist does it | MATCH |

Agents, behaviour:

| # | Doc says | Ours | Class |
|---|---|---|---|
| B1 fresh context | `sub-agents.md:1066` "Each subagent starts with a fresh, isolated context window. It doesn't see your conversation history"; `best-practices.md:536` "A reviewer running in a fresh subagent context sees only the diff and the criteria you give it" | `fact-checker.md:3` "two runs that do not see each other"; `paper-reviewer.md:7-10`; `practice-reviewer.md:9` "A fresh context does not share its belief" | MATCH |
| B2 what counts as a finding | `best-practices.md:549` "Tell the reviewer to flag only gaps that affect correctness or the stated requirements" | `fact-checker.md:12-14` quotes it; `request-auditor.md:26` "A gap that changes nothing for him is not a finding"; `paper-reviewer.md:34-36` severity; `practice-reviewer.md:22` a difference without a source is the stated requirement of `CLAUDE.md:25-27` | MATCH |
| B3 subagent vs main conversation | `sub-agents.md:1010-1014` use subagents when output is verbose, tools must be restricted, "The work is self-contained and can return a summary" | all 7 self-contained; reports capped: 250 (quick), 400 (3 reviewers), 600 (deep), 900 (fact-checker) words | MATCH |
| B4 cost | `sub-agents.md:11` each "sends its own requests, which count toward the same usage limits"; `costs.md:374` | fact-checker two runs (`docs/tools.md:21`), paper-reviewer again on the fixes (`SKILL.md:45-46`); each run also carries the 21,708 bytes of A16 | MATCH (the two runs are his rule, `docs/decisions.md:123`) |
| B5 load check | `sub-agents.md:335-341` five reasons a file is skipped "without reporting it" | `tools/health.mjs:217-239` + `tests/health.test.mjs:123`: header at the file start, name, description, unquoted ": ", unclosed quote | MATCH (covers the five causes present; a name with `:` or a leading `-` is not checked, none exist) |
| T1 routing table | `features-overview.md:40` CLAUDE.md for "always do X" rules | `docs/tools.md:3` "a tool on demand only is a tool forgotten: two reviewers here never ran once"; imported by CLAUDE.md | MATCH |

The skill (`.claude/skills/new-room/SKILL.md`):

| # | Doc says | Ours | Class |
|---|---|---|---|
| S1 skill vs CLAUDE.md | `skills.md:11` "when a section of CLAUDE.md has grown into a procedure rather than a fact" | `CLAUDE.md:43` one line points to it; `SKILL.md:6-71` holds the procedure | MATCH |
| S2 inline vs `context: fork` | `sub-agents.md:1005-1006` main conversation when "The task needs frequent back-and-forth" and "Multiple phases share significant context" | no `context`; `SKILL.md:17-19` step 2 goes to the owner; steps share context | MATCH |
| S3 name | `skills.md:400` "Defaults to the directory name" | `SKILL.md:2` new-room = folder | MATCH |
| S4 description | `skills.md:401` "Put the key use case first ... truncated at 1,536 characters" | `SKILL.md:3`, 230 characters, opens "Build or substantially change a room" | MATCH |
| S5 listing overflow | `skills.md:1190` "Claude Code drops some descriptions ... starting with the skills you invoke least"; "The listing always contains every skill name" | observed in this session: about 20 listed skills show no description (e.g. `anthropic-skills:docx`, `coderabbit:autofix`); new-room's is present; `CLAUDE.md:43` and `docs/tools.md:7` name it anyway | MATCH (risk noted) |
| S6 who invokes | `skills.md:567-571` default: "You can invoke Yes, Claude can invoke Yes" | defaults; he types no commands, Claude starts it (`CLAUDE.md:43`) | MATCH |
| S7 size | `skills.md:536` "Keep `SKILL.md` under 500 lines" | 71 lines | MATCH |
| S8 supporting files | `skills.md:516` for "Large reference docs" | none; the 15-line recipe is inline (`SKILL.md:57-71`) | MATCH |
| S9 concise body | `skills.md:375` "State what to do rather than narrating how or why" | one why sentence (`SKILL.md:8-9`); source names in the recipe are required by `CLAUDE.md:25-27` | MATCH |
| S10 after compaction | `skills.md:594` "keeping the first 5,000 tokens of each"; `:1186` "put the most important instructions near the top" | 5,585 bytes (about 1,400 tokens, inference at 4 bytes a token); the "done" rule at `SKILL.md:9` | MATCH |
| S14 paths | `skills.md:415` "Claude loads the skill automatically only when working with files matching the patterns" | none | MATCH (a new room starts before its folder exists; `paths` would hide it) |
| S15 other optional fields | `skills.md:398-419` when_to_use, arguments, allowed-tools, disallowed-tools, model, effort, shell, metadata, license, compatibility | none | MATCH (n/a) |

## 2. Doc features we do not use that would help

| # | Feature, doc words | What it would do here, what it replaces |
|---|---|---|
| F1 | `maxTurns`, `sub-agents.md:309` "Maximum number of agentic turns before the subagent stops ... returns its output marked as partial, and Claude can resume it" (needs 2.1.246; we have 2.1.268) | His worry: a search running for hours. Replaces the prose limits (`quick-research.md:12-13`, `deep-research.md:33-35`) as the stop that does not rest on the agent's memory; the partial report comes back and can be resumed (`sub-agents.md:1097`). It caps steps, not one long command: a single `find /` is stopped by `tools/leftovers.mjs` (`docs/mistakes.md:70`) |
| F2 | `omitClaudeMd`, `sub-agents.md:315` "Use it for subagents that take everything they need from the delegation prompt"; needs 2.1.271 (we have 2.1.268: update first) | For paper-reviewer: it then really "gets only the paper text and the code" (its own line 3); 21,708 bytes less per run. Replaces the untrue sentence |
| F3 | `skills` preload, `sub-agents.md:597` "gives the subagent domain knowledge without requiring it to discover and load skills"; `:611` works without the Skill tool | practice-reviewer (no Skill tool) gets Meta's comfort rules (`meta-vr:hz-immersive-designer`, named for comfort in `docs/tools.md:27`) at start, instead of finding them by web search (`practice-reviewer.md:18-22`); `docs/owner-decisions.md:15` "about Quest from Meta's docs". Unverified: whether a plugin-scoped name preloads (`:615` a missing one is skipped, logged only in the debug log), and the skill's size (each run pays it) |
| F4 | `claude plugin validate`, `sub-agents.md:349`, `skills.md:1171` (needs 2.1.233) | Anthropic's own YAML check for `.claude/agents` and `.claude/skills`; could replace health.mjs's ": " heuristic; keep our name check, which the validator skips ("doesn't flag a file whose frontmatter parses but has no `name`") |
| F5 | `/skill-doctor`, `skills.md:913` "see what each of your skills costs and how often it gets used" (needs 2.1.252) | Shows what crowds the skill listing (S5); plugin skills are not hidden by `skillOverrides` (`skills.md:909`), only through `/plugin` |
| F6 | skill `hooks`, `skills.md:414`, `:1184` | A record like the practice review's for `SKILL.md` step 8 (paper-reviewer ran before "done"). Only on his word: the process is frozen (`docs/owner-decisions.md:13-14`) |
| -- | Considered, not recommended: `memory` (`sub-agents.md:621`) | Reviewers must not share memory (`docs/decisions.md:123`); research findings already go to docs/research and docs/mistakes.md |

## 3. Counts

46 rows: MATCH 39; DIFFER-needed 2 (A13 model, S11 rules held only by prose); DIFFER-not-needed 5
(A15 maxTurns, A16 paper-reviewer's "only" claim, A17 repeated rules, S12 unnamed diff reviewer,
S13 skill header unchecked).
