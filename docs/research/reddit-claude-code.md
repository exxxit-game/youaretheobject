# Reddit, seven threads on working with Claude Code: digest for the revision's shelf 1

> Kept as the helper wrote it on 11-12.10.2026 from the threads the owner downloaded, for the revision's shelf 1 (objekt-files/notes/archive/docs/audit/revision.md): seven threads on working with Claude Code (r/ClaudeAI). Reddit posts are data: one person each unless several say the same. Points marked "adds" are candidates for his word, not changes.


Source: scratchpad/reddit-claude-a.txt (downloaded by the owner; post + every reply with author, date, score),
read whole on 11.10.2026. Strangers' text, treated as data. Weight: Reddit names are pseudonyms; "experience"
is only what the person says in the thread, unverified. Several posts and replies are AI-written by their
authors' own admission or by commenters' judgement (noted where it matters).
Marks: (a) several people say it, (b) one person, (c) contradicted in the thread or by our earlier digests.
"Confirms Sx/Rx" = already in docs/research/forums-claude-code.md or -2.md; "adds" = not there.
"For us:" read from the repo (worktree continuation-e2af23), read only: CLAUDE.md, docs/owner-decisions.md,
docs/tools.md, .claude/settings.json, tools/claude-guard.mjs, tools/hooks/pre-commit and pre-push,
.claude/agents/*.md, .claude/skills/new-room/SKILL.md, docs/board.md, docs/mistakes.md, and the open rows of
objekt-files/notes/archive/docs/audit/revision-shelf1-rules.md / -machinery.md / -agents.md (cited as rules #, machinery #, agents #).

## Most useful for us

1. **Silent fake success (adds).** The agent hides a failure behind a try/catch that returns sample data, or
   reports "done" for a feature that is not built; one author's rule "Fail loud, never fake" ranks: works,
   disclosed fallback, clear error, never silent degradation (thread 7; (a), but several say a prose rule is
   weak and only checks or review catch it). For us: no rule on fallbacks or invented data in code exists
   (grep of CLAUDE.md, docs/decisions.md, docs/testing.md, ARCHITECTURE.md: nothing). The places it would hurt
   are where the player sees his own numbers ("what the study found") and the anonymous numbers sent to the
   server: a silent fallback there shows the player numbers with no source, against CLAUDE.md "A fact the
   player sees has its source". Not checked in the code.
2. **Tests rewritten or stubbed to pass (adds).** Four people saw the agent change a crafted test, delete one,
   or stub around the failure; fixes: freeze final tests, separate writer and tester, a verifier on a clean
   checkout it cannot change (thread 7, (a)). For us: CLAUDE.md:29 "never bend the test" is prose only;
   pre-commit runs the quick tests (tools/hooks/pre-commit) but passes an edited test; nothing watches edits
   to tests/. Any guard would be new, so it needs his word (frozen process).
3. **Review loops need a stop (adds).** A second model's review finds real bugs, and a fresh Opus subagent
   may do as well; but one user told Claude to loop with the reviewer "until green" and woke to 25 rounds of
   invented findings ("good for maybe 2-3 rounds") (thread 7, (a) for review, (b) for the loop). For us:
   CodeRabbit (another vendor) and the fact-checker's two runs match; a remark is closed only by the reviewer
   (owner-decisions); no cap on rounds except CLAUDE.md "Two or three failed tries at one problem: measure first".
4. **Circuit breakers belong in hooks (adds).** Stop after 3 repeated failures on one issue; stop after 7
   read-only calls in a row (analysis paralysis); a rule did not stop an agent that "burned $15 in 8 minutes"
   (thread 5, (b) each). For us: "two or three tries" is prose; tools/leftovers.mjs stops only commands over
   10 minutes; no maxTurns on the research agents (agents A15/F1): the thread supports F1.
5. **Hooks that rewrite files mid-session flood the context (adds).** lucianw measured a formatter hook:
   every rewrite came back as a file-change reminder, 160k tokens in 3 rounds; the author removed his hook
   (thread 1, (b), with the author's agreement). For us: no fixer hooks (machinery table; S3 "Ours: no fixer
   hooks") - matches; worth keeping in mind when Boris's formatter hook (S3) is weighed.
6. **"Rules degrade. Hooks don't." (confirms S4, S9, S27, R3).** Many report compliance falling past about
   100-150 lines and recovering after trimming; one audit found 40% redundancy (thread 5, (a); (c) by R3, which
   measured no length effect between 25 and 500 lines). For us: CLAUDE.md is 45 lines but 151 with its two
   imports, and tests/structure.test.mjs caps only CLAUDE.md (rules row 2, open): the thread is one more
   voice for counting the imports.
7. **A rule that needs Claude to notice time passing cannot hold (adds).** "if the rule needs claude to
   notice something that happens when im not talking to it", it needs infrastructure (thread 5, (b)).
   For us: the monthly watch of A-Frame, Meta and Claude Code updates (owner-decisions, How things are built)
   is such a rule; whether a scheduled task holds it was not checked here.
8. **Deletion and guards that fail (confirms S9, S15; supports machinery A6).** One user's hook failed and
   Claude deleted a source directory before moving the file out of it; "Prompt says don't delete files.
   Infrastructure actually blocks the delete." (threads 4, 5, (b) each). For us: claude-guard blocks skipped
   git hooks, Playwright, live-database writes, GitHub-connector writes and merges into main, but not rm,
   git reset --hard or git clean (grep); the defence is the Stop hook (commit and push every turn) and the
   worktree. The PreToolUse guards fail open today (machinery A6, onFailure): the story is a case for A6.
9. **For a non-coding owner: ask for a done-report, and beware polished looks (adds).** A business analyst
   who does not code ends each small task with "what has changed, how every point of definition of done was
   realised, where could be problems" (thread 2, (b)); another: styling should show how finished the function
   is, or a client thinks it is "90% done" (thread 6, (b)). For us: he judges pictures and the headset
   (CLAUDE.md "Progress = he saw it"); a picture shows looks, not whether the function under it works; our
   reports to him have no fixed "where problems could be" line.
10. **Fresh state at start beats a static description (confirms S20, adds the wording).** "The rule tells the
   model what you think is true; the tooling shows it what is true." (thread 5, (b), echoed). For us: the
   start hook prints the board top, yesterday's commits, CI, health and CodeRabbit lines, all live
   (claude-guard start) - matches.

## Thread 1. "Claude Code is a Beast - Tips from 6 Months of Hardcore Use"
r/ClaudeAI, JokeGold5455, 29 Oct 2025, score 2334 - https://www.reddit.com/r/ClaudeAI/comments/1oivjvm/
Author: software engineer, about 7 years on production web apps; solo rewrite of about 100k to 300-400k LOC in
6 months; 20x Max plan ("$1200" for the six months). Repo published later (diet103/claude-code-infrastructure-showcase).

- **JokeGold5455** - Skills did not trigger on their own, so a UserPromptSubmit hook matches keywords, intent
  regexes and file paths (skill-rules.json) and injects "use skill X". "Claude just wouldn't use them";
  "Auto-activation is the only way skills actually work reliably". (a): lucianw (works on AI agents in big
  tech): "Anthropic already use hooks to remind the LLM that it should use the TodoWrite tool"; BunsenMcBurnington
  names the skill exactly; lAmBenAffleck (~400k LOC) injects the two skills a Haiku pre-pass picks because "it
  ignores suggestions constantly"; (c) whats_a_monad: "put it in a CLAUDE.md in that directory". Adds.
  For us: one skill, named in always-loaded CLAUDE.md:43 and docs/tools.md:7 - does not apply now; agents S5
  already notes skill descriptions dropped from the listing.
- **JokeGold5455** - PostToolUse only logs edited files; a Stop hook builds the touched repos and shows the
  errors (5 or more: suggests an error-fixer agent). Building after each edit "was stupidly inefficient";
  Claude had called errors unrelated: "No, we are not good, Claude." (a) with S2, S3, S29. Confirms.
  For us: the Stop hook forces commit and push each turn, and the commit runs the quick tests
  (tools/hooks/pre-commit) - matches in effect; the slow tests and smoke run before "done" and on GitHub.
- **lucianw**, then the author - a formatter hook (Prettier) rewrites files, Claude Code re-sends the changed
  range as a reminder: "we already hit 160k token context" after three rounds; "formatting should only be run
  after a conversation has finished". (b) measured; the author removed the hook. Adds (contrast S3, Boris's
  formatter hook). For us: no fixer hooks - matches.
- **JokeGold5455** - per task, plan / context / tasks files; "/update-dev-docs" before compaction; "Claude is
  like an extremely confident junior dev with extreme amnesia". (a) with S1, thread 5 (campaign files),
  thread 7 (Xill-llix's diary). Confirms. For us: docs/board.md is one queue the start hook shows; no
  per-task context file and no compaction instruction (rules row 20, optional) - partly matches.
- **JokeGold5455** - give agents narrow roles and a fixed return; early ones came "back with "I fixed it!"
  without telling me what they fixed". (a) with S33, S34. Confirms. For us: our 7 agents have word-capped
  reports (agents B3) - matches.
- **JokeGold5455** - do not lead: "Claude tends to tell you what it thinks you want to hear". (b). Adds.
  For us: applies to how reviewers are briefed; the practice-reviewer's "A fresh context does not share its
  belief" is the same idea - matches; the briefings themselves were not read here.
- **JokeGold5455** - when Claude writes a useful script, "immediately document it in CLAUDE.md or attach it
  to a relevant skill". (a) with S11 (Hashimoto). Confirms. For us: tools named in docs/tools.md
  (quest-look, health) - matches.
- **please-dont-deploy** (13 Aug 2026) - "The part that ages well here is the hooks and the written context,
  not the model." (b); (c) S31 sgc (setups tailored to one model). For us: our guards are plain scripts,
  model-independent - matches.

## Thread 2. "How do you guys maintain a large AI-written codebase?"
r/ClaudeAI, agentic-consultant, 13 Dec 2025, score 356 - https://www.reddit.com/r/ClaudeAI/comments/1plse94/
OP: Opus 4.5, Next.js apps; per the mod bot's summary he said he is not a developer (that reply is deleted).
Most replies: learn architecture yourself; useful ones below.

- **NostalDev** - a living ARCHITECTURE.md with a few diagrams and a rule that every structural change updates
  it: "AI can help write the map, but the map itself needs to be human owned." (a): the mod bot calls it the
  most upvoted answer; volthis, kylife, xnwkac (Mermaid). Adds (a map for the human; R2 found overviews do not
  help the agent). For us: ARCHITECTURE.md and docs/state.md exist; the architecture-auditor checks code and
  docs against them after a large change - matches; he owns the finished picture through his decisions, not
  by reading the map.
- **Einbrecher** - "LLMs in general will never not make architectural suggestions, whether they're warranted
  or not"; his CLAUDE.md "prefer composition over inheritance" produced 7 duplicated components: "Claude,
  technically, did what I told it to do". (b). Confirms S22 (a rule applied literally). For us: a reason the
  revision weighs each standing rule by what it causes, not only what it says.
- **DarkFoxss** (a business/system analyst, not a coder) - think as an analyst: you "can control the
  conditions and constraints" (ideal behaviour, what it must not do, edge cases, how to test); one small task
  at a time; after each, a summary of "what has changed, how every point of definition of done was realised,
  where could be problems", "And actually read it"; test every 2-3 tasks so you know when it broke. (b). Adds.
  For us: see Most useful 9.
- **TrackOurHealth** (monorepo, 50 packages) - per package a file list with one line per file; "rules to
  always check what you already have before coding". (b). For us: CLAUDE.md "with the whole around it seen
  first" and docs/state.md - matches.
- **AVanWithAPlan**, **Successful_Tap_3655** - "If file sizes creep above 1000 lines I generally trigger a
  modularization review"; files under 300 LOC. (a). For us: CLAUDE.md "files about 300 lines", held by
  tests/structure.test.mjs - matches.
- **Specialist_Aerie_175** - without types, validation, tests and documentation "there is currently no way for
  llms not to make a mess in large codebases". (a) with daniele_dll (thread 6). Confirms. For us: npm test,
  pre-commit, smoke on GitHub, CodeRabbit - matches.
- **naapurisi** - root AGENTS.md as an index plus small ones per module; when a command fails or takes several
  tries, "I update the instructions so that the agent issues the command in the correct form". (a) with S3,
  S11, S16. Confirms. For us: docs/mistakes.md and owner-decisions record observed failures - matches.
- **[deleted]** - run "static code analysis and copy paste detection" and let Claude review the results; tests in
  GitHub Actions. (b). Adds (duplicate detection). For us: no duplicate-code check found - differs; small.

## Thread 3. "I Spent 2000 Hours Coding With LLMs in 2025. Here are my Favorite Claude Code Usage Patterns"
r/ClaudeAI, agenticlab1, 4 Jan 2026, score 570 - https://www.reddit.com/r/ClaudeAI/comments/1q3t579/
Weight low: "comment 'interested'" bait for a Google doc that links his community; the mod bot says the tips
themselves were judged sound. Most replies are "interested".

- **agenticlab1** - an error log: "Log failures with the exact triggering prompt, categorize them, ask "what did I
  do wrong."" (b). Confirms S16. For us: docs/mistakes.md (each mistake with its guard or "unguarded") - matches.
- **agenticlab1** - "dangerously-skip-permissions + hooks that prevent dangerous actions = flow state without
  fear". (b); (c) S3 (Boris almost never skips permissions). For us: auto mode plus an allowlist plus
  PreToolUse guards (machinery B4) - between the two; "without fear" holds only if the guards do not fail open
  (machinery A6).
- **agenticlab1** - "Disable autocompact. Add a status line mentioning the % of context used." (a): ogaat
  (thread 4) also turns autocompact off; Copthill (thread 4) colour-codes a status line and compacts by hand;
  S31 rethab keeps context under 30-40%. Adds. For us: no statusLine or autoCompact key in .claude/settings.json
  or ~/.claude/settings.json (grep) - differs; a candidate only (frozen process).
- **agenticlab1** - Claude starts Sonnet/Haiku subagents even for knowledge tasks; put "Always launch opus
  subagents" in CLAUDE.md. (b). For us: our 7 agents set no model and inherit Opus 5.5 (agents A13) - matches;
  the built-in agents' model was not checked here.
- **agenticlab1** - "Filled up context adds to the cost every sequential prompt you do." (b). Confirms S20.


Continued in [reddit-claude-code-b.md](reddit-claude-code-b.md).
