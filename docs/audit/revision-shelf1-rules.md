# Shelf 1, part A: our instruction files against Anthropic's docs (11.10.2026)

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): shelf 1, part A: our instruction files and memory against the Claude Code docs of 11.10. Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only; nothing in the repo was changed. Every fix below changes the frozen process, so each needs
his word and replaces something (docs/owner-decisions.md:13).

Sources read. Claude Code docs saved today in scratchpad/ccdocs/ (cited as file:line): memory.md,
best-practices.md, context-window.md, claude-directory.md, costs.md, common-workflows.md,
features-overview.md, plus hooks-guide.md, hooks.md, worktrees.md and sub-agents.md from the same folder,
used for single lines. Prompt guidance opened online today:
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
  (it now holds "Be clear and direct", "Add context", "Tool usage" and "Control the format" as its own
  sections; the separate overview and be-clear pages were not opened)
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
- https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
  (the Opus 5.5 page says: "Existing Claude Opus 5 prompts should perform well without changes, and the
  patterns in Prompting Claude Opus 5 remain a reasonable starting point")
Ours, measured today: CLAUDE.md 45 lines / 5,156 bytes; docs/owner-decisions.md 78 lines / 14,057 bytes
(32 lines are longer than 200 characters); docs/tools.md 28 lines / 2,495 bytes; together 151 lines,
21.7 KB at every start. The start hook printed 7,323 characters. MEMORY.md 7 lines / 933 bytes.
No ~/.claude/CLAUDE.md, no ~/.claude/rules, no .claude/rules, no nested CLAUDE.md (git ls-files).

## 1. What the docs advise about instruction files and memory

| # | Doc says (file:line, words) | We do (path:line) | Verdict | Needed? why | Smallest fix |
|---|---|---|---|---|---|
| 1 | memory.md:88 "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence" | CLAUDE.md is 45 lines; with its two imports 151 lines (CLAUDE.md:14, :15) | MATCH | | |
| 2 | memory.md:88 "Imports ... don't reduce its context cost, because imported files also load at launch" | tests/structure.test.mjs:79-80 caps only CLAUDE.md at 45 lines ("a new rule replaces an old one"); the two imported files are not counted, so a rule can grow there unmeasured | DIFFER | Not needed: no reason found | Count CLAUDE.md plus its imports in the same test, against the doc's 200 lines |
| 3 | memory.md:89 "group related instructions under markdown headers and bullets" | CLAUDE.md:18-45 and owner-decisions.md:8-78 are headed bullet lists; only the prompt block (CLAUDE.md:4-10) is prose, see part 3 | MATCH | | |
| 4 | memory.md:80 "Write instructions that are concrete enough to verify" | CLAUDE.md:33 "`npm test`", :44-45 (folders, css/, texts.ru.js, 300 lines) | MATCH (exceptions only in the prompt, part 3) | | |
| 5 | best-practices.md:176-184 include: commands Claude can't guess, style that differs, testing, repository etiquette, architecture, environment quirks, gotchas | CLAUDE.md:33 (npm test, serve, smoke test on GitHub), :39 (branch, push often), :44 (engine never imports rooms), :45 (no build step) | MATCH | | |
| 6 | best-practices.md:174 "For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it." | The prompt repeats lines the file already holds: CLAUDE.md:4 "(Russian text: see the source) = owner-decisions.md:62; CLAUDE.md:5 "(Russian text: see the source) = owner-decisions.md:64; CLAUDE.md:7 "(Russian text: see the source) = CLAUDE.md:25 | DIFFER | Needed: owner-decisions.md:11 "His permanent prompt stands at the top of CLAUDE.md as he pasted it («(Russian text: see the source) | His choice among the variants in part 3 |
| 7 | best-practices.md:188 "add emphasis such as "IMPORTANT" to that line alone. If you emphasize many lines, none of them stands out"; prompting best practices, Tool usage: "dial back any aggressive language" | No IMPORTANT, MUST or capitals in CLAUDE.md, tools.md or owner-decisions.md (grep) | MATCH | | |
| 8 | memory.md:24 "To block an action regardless of what Claude decides, use a PreToolUse hook"; features-overview.md:189 "If a rule must hold every time, make it a hook" | .claude/settings.json:42-99 (SessionStart, UserPromptSubmit, PreToolUse, SubagentStart/Stop, Stop); CLAUDE.md:38 "hooks hold these" | MATCH | | |
| 9 | memory.md:51 "If an entry is a multi-step procedure ... move it to a skill" | CLAUDE.md:43 one line pointing to the new-room skill (.claude/skills/new-room/SKILL.md holds the steps) | MATCH | | |
| 10 | memory.md:51 "...or only matters for one part of the codebase, move it to a ... path-scoped rule"; features-overview.md:140 "Use rules to keep CLAUDE.md focused" | CLAUDE.md:44-45 (rooms folder, css/, texts.ru.js, comments, 300 lines) matter only when code is touched; no .claude/rules exists | DIFFER | Not needed: no reason found; gain is small (2 lines) | Optional: .claude/rules/code.md with `paths:` src/**, css/** holding CLAUDE.md:44-45 |
| 11 | Same advice as 10 | Decisions that matter only for rooms load every session: owner-decisions.md:49, :65-70 (mirrors, character, space tiers, voice, humour) | DIFFER | Needed: owner-decisions.md:3-4 "loaded with CLAUDE.md at every session start and after every compaction"; and context-window.md:1613 "Path-scoped rules ... compaction summarizes them away", so a moved decision could be reopened in chat | None |
| 12 | memory.md:146 nested CLAUDE.md in subdirectories load on demand | None exist (git ls-files) | MATCH (n/a) | | |
| 13 | memory.md:70 "focus on project-level standards rather than personal preferences"; memory.md:62 CLAUDE.local.md for "Personal project-specific preferences" | CLAUDE.md:4-10, :16, :22 hold his personal way of working | DIFFER | Needed: one-person project worked in many worktrees, and memory.md:125 itself warns "a gitignored CLAUDE.local.md only exists in the worktree where you created it"; plus owner-decisions.md:11 | None |
| 14 | memory.md:546-548 MEMORY.md: first 200 lines or 25KB load; "keep one line per entry" | MEMORY.md:1-7, one line each, 933 bytes | MATCH | | |
| 15 | memory.md:476-481 types user / feedback / project / reference in frontmatter | each file has `type:` (e.g. roles-fantasy-hands.md:6 user, vision-mythbusters.md:6 project) | MATCH | | |
| 16 | memory.md:483 "It also skips anything your CLAUDE.md files already say" | copy-what-exists.md:17 (practice review before «(Russian text: see the source) repeats CLAUDE.md:34-35; copy-what-exists.md:18 (answer anger with action) repeats CLAUDE.md:22 "He is angry: act on the topic, no promises" | DIFFER | Not needed: where-rules-live.md:20 says the same ("if it does, change the repo instead") | Delete copy-what-exists.md:17-18, keep its lesson at :11 |
| 17 | memory.md:512 "all worktrees ... share one auto memory directory"; memory.md:554 "auto memory isn't loaded into subagents" | One folder under the main repo's project; rules kept in the repo, not memory (where-rules-live.md:11-14), so the 7 agents still see them | MATCH | | |
| 18 | sub-agents.md:33 "Every other built-in and custom subagent loads both [CLAUDE.md and git status], unless its definition sets the omitClaudeMd field"; sub-agents.md:315 "Set to `true` to launch this subagent without the user, project, and local CLAUDE.md files" | .claude/agents/paper-reviewer.md:3 says it "Gets only the paper text and the code", but no agent sets omitClaudeMd (grep), so it also gets CLAUDE.md, his decisions and tools.md | DIFFER | Not needed: the reviewer's own description promises the opposite; independence is his rule (owner-decisions.md:60 «(Russian text: see the source) | Add `omitClaudeMd: true` to paper-reviewer.md (the fact-checker could be weighed the same way) |
| 19 | context-window.md:1599 "Project-root CLAUDE.md and unscoped rules: Re-injected from disk"; :1609 SessionStart hooks matching `compact` run after compaction; hooks-guide.md:315 | Root CLAUDE.md with both imports; settings.json:43-48 SessionStart has no matcher, which hooks.md:207 says "activates on every occurrence of the event" (compact included); claude-guard.mjs:376 | MATCH | | |
| 20 | best-practices.md:392 "Customize compaction behavior in CLAUDE.md with instructions like "When compacting, always preserve..."" (also costs.md:243) | No compact instructions (grep); his messages are logged outside the repo by the prompt hook "so no request is lost to a compaction" (claude-guard.mjs:454) | DIFFER (optional advice) | Not needed: no reason found; the log covers the main risk | Optional, one line: when compacting, keep his words of this session and the board item in work |
| 21 | hooks.md:996 hook stdout "capped at 10,000 characters"; :1084 over it only a 2,000-character preview | Start hook printed 7,323 characters today; tests/guard.test.mjs:266, :273 hold it under 10,000 | MATCH | | |
| 22 | memory.md:94 "`/doctor prompt-audit` ... looks for ... instructions written for older models, references to files or commands that don't exist, and files that contradict each other"; memory.md:621, best-practices.md:186 `/doctor` trim | No trace of either having been run | DIFFER | Not needed: no reason found | He types `/doctor prompt-audit` once as a second opinion on this shelf (nothing changes until he asks; needs v2.1.283+) |
| 23 | best-practices.md:186 "Treat CLAUDE.md like code: review it when things go wrong, prune it regularly"; memory.md:90 review "periodically" | This revision; owner-decisions.md:64 monthly watch of Claude Code; structure tests | MATCH (mechanism); the stale lines it missed are in part 2 | | |
| 24 | worktrees.md:243 desktop worktree sessions read "settings, hooks, skills, agents ... from the main checkout's root"; "read the worktree's path from the hook's `cwd`"; "CLAUDE.md files and .claude/rules/ still load from the worktree" | claude-guard.mjs:41-42 takes the worktree from event.cwd; claude-guard.mjs:484 keeps the main folder up to date, so agents and skills changed on a branch take effect there | MATCH | | |
| 25 | memory.md:625 CLAUDE.md is re-read from disk after /compact; worktrees.md:122 a worktree subagent "takes the instruction files it starts with from your main conversation" | Observed today: this agent started with an older CLAUDE.md and decisions file (no prompt block) than the ones on disk (commit 3a7a6e8, 21:31 +0300). The board already sends the revision to a new window, "(Russian text: see the source) docs/board.md:9) | MATCH | | |
| 26 | Opus 5 page, Response length: "To control response length, prompt for it explicitly" | CLAUDE.md:16 "Answer the owner in Russian, plain words, short." | MATCH | | |
| 27 | Opus 5 page, Task scope: "Deliver what was asked, at the scope intended" | CLAUDE.md:22 "Do what was asked, with the whole around it seen first; ideas go at the end of the answer, not into code." | MATCH | | |
| 28 | Prompting best practices, Add context: "explaining to Claude why such behavior is important" | CLAUDE.md:39 "(power cuts)"; each decision carries his words (owner-decisions.md:3-4) | MATCH | | |
| 29 | Prompting best practices, Control the format: "Tell Claude what to do instead of what not to do" | Mostly positive rules; owner-decisions.md:10 "Bans few" | MATCH | | |
| 30 | Opus 5.5 page, Unattended runs: "name the stops you do want, for example when no work can advance without the user's input" | owner-decisions.md:62 "Missing anything ... tell him at once"; prompt CLAUDE.md:4 "(Russian text: see the source) | MATCH | | |
| 31 | Opus 5 page, Task scope: "If your prompt contains explicit verification instructions (... "use a subagent to verify"), remove them"; Controlling subagents: "do not use subagents to verify or double-check your own work"; Self-correction: "Avoid instructing re-checks it already performs" | tools.md:21 fact-checker "two runs"; CLAUDE.md:34 practice-reviewer first; CLAUDE.md:43 paper-reviewer; tools.md:22 request-auditor; prompt CLAUDE.md:4 "(Russian text: see the source) | DIFFER | Needed for the independent reviewers: owner-decisions.md:60 "The outside reviewer's remark is closed only by the reviewer («(Russian text: see the source) he never re-checks code", :15 "kept by checks the machine runs by itself". The page's reason is cost "with no loss in quality" on Anthropic's tasks, and the same page praises "effective writer-verifier patterns". The generic "(Russian text: see the source) is the kind the page means: part 3 | Part 3 (prompt only) |

## 2. What the docs warn against, found in our files

Doc lines used: memory.md:90 "if two instructions contradict each other, Claude may pick one arbitrarily
... remove outdated or conflicting instructions"; best-practices.md:181 exclude "Information that changes
frequently"; best-practices.md:186 "If Claude asks you questions that are answered in CLAUDE.md, the
phrasing might be ambiguous"; best-practices.md:563 "If Claude already does something correctly without
the instruction, delete it or convert it to a hook"; memory.md:548 "merge or drop stale entries";
memory.md:587 built-in git guidance can compete with CLAUDE.md.

| # | Our line | Problem | Verdict | Needed? why | Smallest fix |
|---|---|---|---|---|---|
| A | owner-decisions.md:34 "Yesterday's errors closed fully first («(Russian text: see the source) | Relative to 9.10; stale | DIFFER | Not needed | Move to owner-decisions-history.md (owner-decisions.md:6 "the rest there") |
| B | owner-decisions.md:54 "...by the plan he accepted: merge first, measure in the headset, then multiview" | The plan is done: docs/board.md:12 "A-Frame 1.8 (Russian text: see the source) multiview ... (Russian text: see the source) | DIFFER | Not needed | Keep "Looks rise later, one thing at a time"; move the plan to history |
| C | owner-decisions.md:21 CodeRabbit "14-day trial" (10.10) and "the one pull request room-polish → reviewed" | State that changes (trial ends about 24.10) | DIFFER | Not needed | Keep the decision (kept only if useful); the PR detail to docs/state.md |
| D | owner-decisions.md:12 "The process first, rebuilt by the plan, all at once" | Done; :13 "Then frozen" is what holds now | DIFFER | Not needed | Move to history |
| E | owner-decisions.md:33 "The headset check before the next room" | Possibly done (board 11.10 headset runs), but docs/board.md:84 says the headset run (quest-check) has not passed the corridor since 9.10 | UNVERIFIED | | Ask the board, not him |
| F | owner-decisions.md:32 "Until it is done: one window" vs CLAUDE.md:22 "A new topic goes to a new window" | The shortening dropped "at a time, the others closed" (owner-decisions-history.md:80-81), so the two now read as a contradiction | DIFFER | Not needed: a loss in shortening | Restore "one window at a time, the others closed" from history:80-81 |
| G | memory step-by-step-foundation.md:20-21 "use the installed skills (systematic debugging, brainstorming, verification)" | Those are the superpowers plugin's skills; it is off (owner-decisions.md:17) | DIFFER | Not needed | Delete the clause |
| H | memory explain-the-why.md:24, no-lazy-compromise.md:23-24, step-by-step-foundation.md:21 link [[decide-yourself]], [[show-before-build]] | Files archived 10.10 (where-rules-live.md:16-18); dangling | DIFFER | Not needed | Drop the links |
| I | CLAUDE.md:19 "Every session opens with a row in the board's «(Russian text: see the source) | Said again by the start hook at every start and compaction (claude-guard.mjs:380 "First thing: if its showings table has no row for today...") and by docs/board.md:3 | DIFFER (small) | Not needed | Keep in CLAUDE.md:19 only what the hook does not say: progress = his «(Russian text: see the source) a session ends by showing it |
| J | CLAUDE.md:34-35 and tools.md:24 (practice review before the headset) | Two places, but complementary (tools.md adds "never while he waits in it"), plus the review-gate hooks | MATCH | | |
| K | CLAUDE.md:33 "never Playwright or Chromium on the laptop" with the hook refusing it (claude-guard.mjs:8-9, :364) | Rule plus hook; removing the words would cost a refused turn, so it passes the doc's test | MATCH | | |
| L | CLAUDE.md:39 "commit and push often (power cuts)" vs Claude Code's built-in "Commit or push only when the user asks" (this session's Bash tool text) | memory.md:587 "Check whether your instruction competes with guidance Claude Code adds on its own ... turn off the built-in ones with includeGitInstructions" | DIFFER | Needed (technical, no owner line): the Stop hook settles it ("a turn does not end while work is unsaved or not on GitHub", claude-guard.mjs:13); context-window.md:1601 ties the git status snapshot to the same setting | None now; if a session asks before pushing, weigh includeGitInstructions |
| M | CLAUDE.md:4 "(Russian text: see the source) vs owner-decisions.md:37 «(Russian text: see the source) and :38 "Lessons on our code ... only when he wants" | "(Russian text: see the source) reads two ways: ready tutorials to learn from, or lessons for him | DIFFER | Needed until he picks: his words (owner-decisions.md:11) | Variant B in part 3 uses his own «(Russian text: see the source) |
| N | CLAUDE.md:12-13 (what the game is), CLAUDE.md:44 (engine never imports rooms) | Checked for "Anything Claude can figure out by reading code" (best-practices.md:178): they are rules and purpose, not a layout | MATCH | | |

## 3. His permanent prompt (CLAUDE.md:4-10)

What Anthropic's guidance asks of a standing prompt (pages above):
- clear, explicit instructions: "Claude responds well to clear, explicit instructions" (Be clear and direct),
  and the golden rule "Show your prompt to a colleague with minimal context ... If they'd be confused,
  Claude will be too";
- order as steps: "Provide instructions as sequential steps using numbered lists or bullet points when the
  order or completeness of steps matters";
- the reason behind each instruction: "Providing context or motivation behind your instructions";
- instructions, not questions: "If you say "can you suggest some changes," Claude will sometimes provide
  suggestions rather than implementing them" (Tool usage); best-practices.md:186 on ambiguous phrasing;
- concrete enough to verify (memory.md:80), no self-evident lines (best-practices.md:184 "Self-evident
  practices like "write clean code"");
- for Opus 5/5.5: no generic re-check orders (Opus 5 page, Self-correction: "Avoid instructing re-checks it
  already performs ("double-check your answer," "re-verify before responding")"); name the stops you want
  (Opus 5.5 page).

Where his text matches:
- the why is there: CLAUDE.md:7 "(Russian text: see the source) CLAUDE.md:9
  "(Russian text: see the source) Add context);
- sources and tools named as the way to work: CLAUDE.md:4 "(Russian text: see the source) CLAUDE.md:5 "(Russian text: see the source) best-practices "Point to sources", research guidance
  "Encourage source verification");
- the stop he wants is named: CLAUDE.md:4 "(Russian text: see the source) Opus 5.5 page);
- plain language, no capitals or MUST.

What it lacks or reads as a question:
1. Three questions. CLAUDE.md:4 "(Russian text: see the source) a question
   where an instruction is meant); CLAUDE.md:4 "(Russian text: see the source) and CLAUDE.md:10 "(Russian text: see the source) both answered on
   11.10, CLAUDE.md:3, so a reader meets questions that are already closed).
2. "(Russian text: see the source) cannot be checked (memory.md:80); his own "(Russian text: see the source) CLAUDE.md:5) says the checkable part.
3. "(Russian text: see the source) is the generic re-check the Opus 5 page advises against; his meaning (checks by
   tools and reviewers) already stands in CLAUDE.md:32-36 and owner-decisions.md:61.
4. "(Russian text: see the source) do not say where they are (they are CLAUDE.md, docs/board.md,
   docs/tools.md); "(Russian text: see the source) is ambiguous (part 2, M).
5. One prose block, while the text has an order (take sources, check against the process, decide with
   reasons, report blockers, update knowledge).
6. Typo: "(Russian text: see the source) should be "(Russian text: see the source) Variants for him to choose from (his meaning, his words; no new rules):

**Variant A: the same text, questions turned into statements** (follows Tool usage: questions get answers,
not action; best-practices.md:186)
> (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) **Variant B: his words as steps, each pointing to where it lives** (follows "Provide instructions as
sequential steps using numbered lists" and memory.md:80 "concrete enough to verify"; «(Russian text: see the source) is
his own, owner-decisions.md:37)
> (Russian text: see the source) > 1. (Russian text: see the source) docs/tools.md).
> 2. (Russian text: see the source) docs/board.md) (Russian text: see the source) > 3. (Russian text: see the source) >    (Russian text: see the source) >    (Russian text: see the source) > 4. (Russian text: see the source) > 5. (Russian text: see the source) > 6. (Russian text: see the source) **Variant C: only what the rest of the file does not already say** (follows best-practices.md:174
"Would removing this cause Claude to make mistakes?" and the Opus 5 Self-correction line; the why is kept,
per Add context. Dropped lines live on: tools in docs/tools.md, «(Russian text: see the source) in owner-decisions.md:62,
«(Russian text: see the source) in :64, «(Russian text: see the source) in CLAUDE.md:32-36)
> (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) > (Russian text: see the source) Any variant replaces CLAUDE.md:3-10 (the line count stays within the 45-line test). The note on CLAUDE.md:3
about the answered questions would no longer be needed with any of them.

## 4. Counts

| | Part 1 | Part 2 | Total |
|---|---|---|---|
| MATCH | 21 | 3 | 24 |
| DIFFER, needed | 4 | 2 | 6 |
| DIFFER, not needed | 6 | 8 | 14 |
| Unverified | 0 | 1 | 1 |
| Rows | 31 | 14 | 45 |

Not checked here (other parts of the shelf): the agents' and skill's own texts beyond paper-reviewer.md:3,
settings.json permissions, and the hooks' behaviour beyond the start hook's length.
