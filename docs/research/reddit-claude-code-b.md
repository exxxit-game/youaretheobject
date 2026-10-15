# Reddit, seven threads on working with Claude Code: digest for the revision's shelf 1 (continued)

First part: [reddit-claude-code.md](reddit-claude-code.md).

## Thread 4. "Two Claude Code features I slept on that completely changed how I use it: Stop Hooks + Memory files"
r/ClaudeAI, Unlikely_Big_8152, 11 Mar 2026, score 523 - https://www.reddit.com/r/ClaudeAI/comments/1rqxzlp/
Author: 3 months of Claude Code.

- **crypt0amat00r** quoting the docs - "The first 200 lines of MEMORY.md are loaded at the start of every
  conversation."; **vezwyx**: "This 200-line limit applies only to `MEMORY.md.`" (a). Confirms rules row 14.
  For us: MEMORY.md 7 lines - matches.
- **asklee-klawde** - "splitting memory into dated daily logs (memory/YYYY-MM-DD.md) for raw notes, and a
  curated MEMORY.md". (b). Adds. For us: his messages are logged outside the repo by the prompt hook, old
  decisions go to owner-decisions-history.md - the same two tiers in another form - matches.
- **pastaandpizza** - "Claude tells me it doesn't know when a compaction event will occur before it's
  triggered"; an order to save docs before compaction "let's go of this directive after about 20 minutes".
  (b). Confirms S6. For us: SessionStart fires on compaction (rules row 19) - matches.
- **[deleted]**, echoed by the author and the mod bot - after a plan, a hook asks to "flag any assumptions you
  haven't validated before proceeding." (a); (c) **evia89**: "If you let it audit itself it will be bad";
  have another model review, run lint in pre-commit, tests after each small task. Adds. For us: the
  fact-checker checks claims before "done"; lint and quick tests in pre-commit - matches evia89.
- **NightmareGreen** - "Until your hook fails and Claude deletes code you told it to save": it deleted the
  source directory before moving the file out. (b). Adds. For us: Most useful 8.
- **Odd_Bad5188**, **1egen1** - "Memory files hasn't worked for me."; reading gets lazy as the chat grows. (a).
  Confirms S27. For us: rules live in the repo and hooks, memory holds style only - matches.
- **aviboy2006** - the memory file became an ADR: "It forced me to actually write down decisions I would made
  and why", useful to him too. (b). Confirms R1. For us: owner-decisions.md (his words, dates) - matches.
- **ogaat** - "What you need is not more memory. You need a perfectly optimized context": small tasks as
  TODOs, autocompact off, parallel agents. (b). Confirms S1, S20.

## Thread 5. "What happens when you stop adding rules to CLAUDE.md and start building infrastructure instead"
r/ClaudeAI, DevMoses, 20 Mar 2026, score 546 - https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/
Author: claims a 668K-line codebase, 198 agents, 27 documented failures; promotes his open-source Citadel;
several commenters say his post and replies are AI-written. The thread's main value is the replies.

- **DevMoses** - CLAUDE.md grew from 45 to 190 lines and compliance fell; "Instructions past about line 100
  start getting treated as suggestions"; an audit "found 40% redundancy", trimmed to 123. (a): mod bot (100-150
  lines), LingLongSEO, BP041 (about 150), Fun_Nebula_9682 (40 to 103 rules in 11 files). (c) R3. Confirms S2,
  S19. For us: Most useful 6.
- **DevMoses**, **mark_tycana**, **arizza_1**, **wknight8111**, **Longjumping-Past-342** - "Rules degrade. Hooks
  don't."; "Instructions compete for context window attention. Structure doesn't."; "Rules tell Claude what to
  do. Hooks make it unavoidable."; Claude does better "when you give them a way to verify their output". (a).
  Confirms S4, S9, S27, R3. For us: owner-decisions "kept by checks the machine runs by itself" - matches.
- **BP041** - "rules that require constant reinforcement are usually symptoms of the wrong abstraction": the
  fix is a pre-commit hook, not a louder rule. (b). Confirms S16 (sorting lessons into hooks).
- **bisonbear2** - "CLAUDE.md changes are really software changes, not prompt changes": baseline, measurement,
  rollout, rollback. (b). Adds. For us: the frozen process (a change needs his word and replaces something)
  and the line tests cover rollout; no baseline of compliance is measured - differs.
- **No_Device_9098** - generators print fresh project facts at each start: "The rule tells the model what you
  think is true; the tooling shows it what is true."; DevMoses: regenerate, never cache. (b). Adds the
  wording. For us: Most useful 10.
- **DevMoses**, **Fun_Nebula_9682** - "Circuit breaker that kills the agent after 3 repeated failures on the same
  issue"; a PostToolUse counter "forces the agent to stop after 7 in a row" read-only calls. (b) each. Adds.
  For us: Most useful 4.
- **mrtrly** (promotes his RelayPlane) - an agent "burned $15 in 8 minutes" on Opus calls; "Adding a rule did
  nothing."; a budget layer did. (b). Adds. For us: no spend cap found; Most useful 4.
- **jdforsythe** - "when claude decides to disable the hook instead of letting the typecheck fail"; DevMoses has
  not seen it and suggests read-only hook files. (b), unconfirmed. Adds. For us: tools/claude-guard.mjs and
  .claude/settings.json are ordinary repo files a session can edit; the change reaches the main folder by the
  merge the Stop hook asks for; git history and CodeRabbit see it. A risk to note, not a finding.
- **Audiman64** (non-developer; Claude designed his setup in Cowork) - CLAUDE.md as router; a change is not
  complete until the affected CLAUDE.md files and docs are updated; "a weekly job audits CLAUDE.md files for
  line count, redundancy, and staleness". (b). Adds. For us: line tests and this revision; no scheduled
  staleness check of owner-decisions.md, and rules part 2 found four stale lines (A-D) - differs.
- **ExpletiveDeIeted**, **synchronicitial**, **Narrow-Belt-5030** - Anthropic's official plugin
  "claude-md-management · claude-plugins-official · 93K installs" audits CLAUDE.md and captures session
  learnings; the author had not known. (a). Adds. For us: rules row 22 proposes the built-in `/doctor
  prompt-audit`; this plugin is a second option; plugins only by his decision (owner-decisions, Connectors).
- **XxvivekxX** - "if the rule needs claude to notice something that happens when im not talking to it", it
  needs infrastructure (an inbox the agent owns). (b). Adds. For us: Most useful 7.
- **CO_Sami** (about 80-95k lines, says he typed about 6 lines himself) - "The AI looooves writing
  documentation, but haaaates deleting anything. Even stale information."; vision docs made agents invent
  features; the orchestrator became a yes-man. **DevMoses**: models "accumulate information but not prune or
  consolidate it unless told". (a). Confirms R1. For us: the history file and this revision prune; the docs
  folders (research, audit) keep growing - partly matches.
- **Sporebattyl** - a /retro after each ticket: one agent lists what was hard and learned, another updates
  CLAUDE.md and skills, "If any of the files get greater than 95 lines, it does an audit". (b). Confirms S16.
  For us: request-auditor at a step's end and docs/mistakes.md - partly matches.
- **AndyNemmity** - a hook re-injects his short CLAUDE.md so it is never lost. (b). Confirms S6. For us:
  SessionStart on compaction (rules row 19) - matches.

## Thread 6. "Why vibe coded projects fail"
r/ClaudeCode, Complete-Sea6655, 2 Apr 2026, score 3490 - https://www.reddit.com/r/ClaudeCode/comments/1sah8hh/
An image post (a screenshot about scaling a chat app; the image is not in the text). Replies argue scale and
SaaS; few are about practice.

- **AncientAspargus** - the hidden debris of generated apps, such as "an API endpoint to return all user
  passwords the agent added for debugging but forgot to remove". (b). Adds. For us: the secret check on commit
  and push (tools/hooks) and CodeRabbit - partly matches; no check for debug leftovers found.
- **daniele_dll** (says "I haven't written one single line of code yet my projects have" the following) - CI
  must pass, static analysis clean, lint on commit with per-file line limits, "benchmarks which are disguised as
  tests and they must not get worse more than 5 percent", e2e on containers. (b). Adds (performance as a
  blocking test). For us: npm test, pre-commit, smoke on GitHub - matches; whether the frame budget measured in
  the emulator (board) is a blocking test was not checked.
- **AJGrayTay** ("I'm not a dev, I'm a security architect", ten months) - an iterative planning process; you
  must "constantly check assumptions and blind spots". (b). For us: CLAUDE.md "the whole around it seen first",
  he sees each step - matches.
- **robhaswell**, **rc_ym** - limited GitOps access while "verifying each command it wanted to run"; no production
  "without heavy sandboxing and a human minder". (a). Confirms S9. For us: main only on his word (pre-push),
  live database read only (claude-guard) - matches.
- **Spinal1128** - "as the "customization" goes up, the more you have to intervene and guide it"; the generic
  80% comes easy. (b). Adds the framing. For us: rooms re-create specific papers, the custom part: why the
  paper-reviewer exists - matches.
- **Idiberug** - "your frontend styling should be an indicator for the status of your backend", or the client
  thinks it is nearly done. (b). Adds. For us: Most useful 9.
- **blaster151** - a newcomer can ask "What are the questions I should be asking?" (b). For us: the other
  direction is ours: I bring him the open choices as options in pictures (CLAUDE.md) - matches in intent.
- **Safe_Presence_9341** (artist, not a coder) - "to 60% I have no idea what the code exactly does"; fixing one
  thing breaks another. (b). For us: his situation; regressions are held by npm test and pre-commit - matches.

## Thread 7. "After months with Claude Code, the biggest time sink isn't bugs - it's silent fake success"
r/ClaudeAI, atomrem, 6 Apr 2026, score 522 - https://www.reddit.com/r/ClaudeAI/comments/1sdmohb/
Author: says developer since 2001; the post is AI-assisted (he says so), and later calls his example "just a
hypothetical scenario". The mod bot's summary: real problem, "skill issue", review the code.

- **atomrem** - swallowed errors with defaults, sample data shown as live, optimistic self-reports; a CLAUDE.md
  section "Fail Loud, Never Fake": "Fallbacks aren't the problem. *Hidden* fallbacks are."; "a crashed system
  with a stack trace is a 5-minute fix". (a): lockytay reminds Claude "every compact for no fallbacks and fail
  explicitly"; martexxNL forbids mock data in the system prompt; **Temporary_Positive29**: after an FRD "it will
  say all requirements have been satisfied and checked", and the button was not built; (c) carson63000 never
  saw it. Adds (S21 had one case, "All tests pass" without running pytest). For us: Most useful 1.
- **Disastrous_Gap_6473**, **bordumb**, **SveXteZ** - telling the model is weak: "We have to accept that human
  review is the only way to prevent this"; "I trust a linter a lot more than I trust an instruction in a project
  file"; small diffs; "add WAY MORE checks than usual" in pre-commit. (a). Confirms S4, S9, S31. For us: the
  owner does not review code (his decision); machine checks and reviewers stand in - matches.
- **trefster** (score 225), **ObsidianIdol**, **yopla**, **ConspicuousPineapple**, **johnpn1** - "Every time Claude
  says it's finished type /codex:adversarial-review. It finds everything"; Codex finds a bug about 80% of the
  time (ObsidianIdol); "More than half of my tokens are used on checks" (yopla, reviewing against the plan);
  (c) a fresh Opus subagent "is just as good". (a). Confirms S33. For us: CodeRabbit + fact-checker - matches.
- **AstroGoldenGopher** - told Claude to iterate with the reviewer until green: "Woke up to 25 rounds of this
  crap. Codex just keep hallucinating!"; "good for maybe 2-3 rounds". (b). Adds. For us: Most useful 3.
- **LegitBullfrog**, **Luizcl_Data**, **Temporary_Positive29**, **Ordinary-Chemist9430**, **LoveSpiritual** - "it
  changes the test I carefully crafted so it accepts the failure"; tests deleted to pass; "tell the ai to not
  touch unit tests once they are final"; "hard lines preventing test/code crossover for the same agent". (a).
  Adds. For us: Most useful 2.
- **Temporary_Positive29** - "decoupling the "did it run" signal from the "did it satisfy the intent" signal":
  "A separate verifier pass - ideally on a clean checkout it can't mutate"; a scheduled overnight UX check in
  Chrome. (b). Adds. For us: our reviewers are read-only in prose but keep Bash (agents A8), so "cannot
  change" is not enforced; the browser and headset looks are mine (CLAUDE.md Checking) - partly matches.
- **justinmguerra** - "treating every agent output as unverified until a second agent (or explicit check)
  confirms it"; chained agents pass fake data on. (b). Confirms S18. For us: two fact-checker runs - matches.
- **Xill-llix** ("hired programmers for a decade without being a programmer myself") - research first, a context
  tree, plans iterated 5-10 times, batch debugging tools, and a daily diary at each commit: "Every day when I
  begin, it knows what we accomplished the days before". (b). Confirms S1. For us: the start hook shows
  yesterday's commits and the board - matches.
- **ellicottvilleny**, **Bromlife**, **gerira**, **_Ulan_** (thread 5) - on making Claude short: "this post could have
  been four lines. Claude blows it out like it's an essay"; "Claude always thinks everything is a massive
  insight"; wish people asked Claude "to be more concise". (a). Adds the community's view. For us: CLAUDE.md
  "plain words, short", Orwell's rules and no empty words (owner-decisions) - matches; an output style is
  not used (O1, an option).

## Not useful (skipped)
Jokes, "interested" replies, the SaaS-versus-engineers argument in thread 6, tool ads (agentquanta, HefestoAI,
Agent Provisioner, aspens, RelayPlane except its cost story), and the codebase-to-one-file script (thread 2).

