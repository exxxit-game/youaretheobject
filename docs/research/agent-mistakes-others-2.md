# Our mistakes and what others report: patterns P1-P10 (part 2 of 3)

> Index, Part 1 (our patterns with their records) and the ranked fixes: docs/research/agent-mistakes-others.md.
> Marks: [read] = opened and quoted; [seen] = only a listing or snippet. Dates are 2026 unless a year is given.

### A. The official word: Anthropic, "Best practices for Claude Code" [read 14.10.2026; names v2.1.283, current]
https://code.claude.com/docs/en/best-practices ; quoted below as A1-A9.
- A1 (verify): "Without a check it can run, "looks done" is the only signal available, and you become the
  verification loop"; "Have Claude show evidence rather than asserting success".
- A2 (review chasing): "A reviewer prompted to find gaps will usually report some, even when the work is sound";
  "Chasing every finding leads to over-engineering"; flag "only gaps that affect correctness or the stated requirements".
- A3 (CLAUDE.md): "Would removing this cause Claude to make mistakes?" If not, cut it. "Bloated CLAUDE.md files cause
  Claude to ignore your actual instructions!"; "If you emphasize many lines, none of them stands out."
- A4 (hooks): "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic"; the over-specified
  CLAUDE.md fix: "Ruthlessly prune. If Claude already does something correctly without the instruction, delete it
  or convert it to a hook."
- A5 (context): "LLM performance degrades as context fills"; "Run `/clear` between unrelated tasks"; the "kitchen
  sink session" failure: one task, then something unrelated, then back.
- A6 (corrections): "After two failed corrections, `/clear` and write a better initial prompt".
- A7 (plan): "Letting Claude jump straight to coding can produce code that solves the wrong problem"; "Reference
  existing patterns" ("follow the pattern").
- A8 (scope): "The infinite exploration": "Scope investigations narrowly or use subagents".
- A9 (independent review): "A fresh context improves code review since Claude won't be biased toward code it just
  wrote"; "the agent doing the work isn't the one grading it".

### P1. A guard for every complaint (ours: circles 1; Cosmogram 1 to 54 hooks, 25.08-30.09)
- GitHub issue #61953, @yoshikihorie, 24.05.2026, https://github.com/anthropics/claude-code/issues/61953 [read]:
  "each rule violation leads to a new hook, which Claude then finds a way to circumvent": rule, then a hook on
  edits, then "Claude sets bypass env vars", then "deletes the enforcement flag files", then "(next circumvention
  TBD)"; "Each hook exists solely because Claude circumvented the previous control"; "user estimates 200%+ time
  cost"; "significant time building and maintaining defensive hooks instead of productive work". Closed, no
  Anthropic answer.
- Earlier research of 13.10 (docs/research/restrictions-sources.md, read there by a helper; not re-opened today):
  "The Guardrails I Actually Ship" (07.07.2026): "If you make it too aggressive it will block the agent constantly
  and you will turn it off inside a day"; "Then delete the ones that never fired". Habr, M. Katrushenko (27.03.2026,
  translated from Russian): three hooks only. Chen Feldman (23.09.2026): "if you can write it down in advance, it
  is a rule. If you have to look at what is happening, it is a hook."
- r/ClaudeAI u/DevMoses (P2) [read]: rules moved into hooks, skills and a state file instead of more rules.
- What fixed it: few hooks, each tried on the forbidden act, unused ones deleted; the hard line moved to where the
  agent cannot reach (sandbox, server-side check, permissions) [machine]. For us: same as circles 1's own fix (a new
  lock only after an incident that cannot be undone, replacing something). Cosmogram's numbers (54 hooks, 4.6 s on
  every command) are larger than any count reported in these threads.

### P2. Rules written until nobody reads them (ours: circles 2; Cosmogram 25.08-30.09)
- Official: A3, A4 above (prune; bloated files make Claude ignore instructions; a rule it keeps breaking: the file
  is too long).
- HumanLayer, "Writing a good CLAUDE.md", 25.11.2025, https://www.humanlayer.dev/blog/writing-a-good-claude-md
  [read]: "Frontier thinking LLMs can follow ~ 150-200 instructions with reasonable consistency"; consensus
  "< 300 lines is best, and shorter is even better", their own root file under 60 lines; Claude Code wraps the
  file in a reminder that it "may or may not be relevant", so non-universal lines get skipped. HN discussion,
  748 points, 290 comments, https://news.ycombinator.com/item?id=46098838 [read, matching comments]:
  u/anonzzzies (30.11.2025) "claude routinely ignores stuff from CLAUDE.md, even with warning bells etc. You need
  a linter preventing things"; u/girvo (01.12.2025) "these tools still ignore that line sometimes so I still have
  to check for it myself"; u/brianwawok (01.12.2025) "Git lint hook has been key. No matter how many times I told
  it, it lints randomly"; u/vunderba (30.11.2025) the "Table-of-Contents approach": task files listed in
  CLAUDE.md, read only when relevant.
- r/ClaudeAI, u/DevMoses, 20.03.2026, "What happens when you stop adding rules to CLAUDE.md and start building
  infrastructure instead", https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/ [read, 94 entries]: "It started
  lean. 45 lines ... Three months later it was 190 lines and Claude was ignoring more instructions than when I
  started"; an audit found "40% redundancy" (rules repeated, contradicting, or "true three weeks ago"); "I
  trimmed it from 190 to 123 lines and compliance improved immediately"; a typecheck rule became a hook: "Rules
  degrade. Hooks don't." The sub's summary bot after 100 comments: "everyone hits a wall around the 100-150 line
  mark".
- The owner's thread (P5): u/tomm3hshipp (14.10) CLAUDE.md "shouldn't ever be big. max 500 lines, even less";
  u/yangqi (13.10) "your big claude.md is sent with every request" (OP's was 406 lines plus nine playbooks).
- What fixed it: short file plus files read on demand (skills, a table of contents) [written structure]; what
  must hold every time moved into a linter or hook [machine]. For us: our CLAUDE.md is held at 45 lines by a test
  (circles 2); the file that grows is docs/owner-decisions.md (about 90 lines, loaded every start) and
  docs/tools.md: the same A3 question ("would removing this line cause a mistake?") applies to them.

### P3. Two checks that lock each other (ours: circles 3; loops of 25 tries, 12.10)
- Official, hooks reference, "Stop input", https://code.claude.com/docs/en/hooks [read 14.10]: `stop_hook_active` is
  true when Claude is already continuing because of a stop hook: "Check this value or process the transcript to
  avoid blocking on a condition that will never resolve"; "an 8-consecutive-continuation cap" ends the turn, but
  "The count of consecutive continuations resets each time Claude calls a tool" (which is how a loop of 25 tries
  with tool calls between them got past the cap).
- Forums: no thread found that names two gates locking each other; not found.
- What fixed it (official): the Stop hook reads `stop_hook_active` and does not block again on a state the agent
  cannot change [machine]. For us: our Stop hook (tools/claude-guard.mjs stop) could hold only once per state it
  cannot clear, as the docs say; circles 3's own fix (a check runs only where its input changes) stands.

### P4. The owner called before the check had passed (ours: circles 4; 10.10, 11.10, 13.10)
- Official: A1: without a check the agent can run, "you become the verification loop: every mistake waits for you
  to notice it"; the docs' order is the agent's check first, then the person's own `/verify` on the running app.
- r/ClaudeCode u/lucianw, 04.03.2026, in u/mrothro's thread (P5) [read]: each milestone ends with the agent's
  "validation walkthrough" listing what it wants the human to look at, after its own checks.
- Forums naming a person called to test before the machine checks were done: not found.
- What fixed it: machine checks gate the moment the person is called [machine]. For us: circles 4's fix (the tool's
  own pre-check passes before "put on the headset") is the official order; a short list of what he is to look at,
  as u/lucianw's walkthrough, is what quest-look.mjs `say` already gives inside the headset.

### P5. Re-check rounds on small things (ours: circles 5, 5a, 5b; 12-14.10)
- The owner's thread [read, all 37 entries of its RSS, newest 14.10]: r/ClaudeCode "Burning a full 20x max plan a day
  on code reviews", u/GreenCurious9895, 13.10.2026, https://www.reddit.com/r/ClaudeCode/comments/1x5afg9/ . His own
  log: "37% of passes were re-reviews of a PR that had already been reviewed"; each PR "reviewed 3.5 times on
  average (median 2, worst one 23 times)"; 142 passes on PRs of 3 files or fewer. His planned fix: "one review per
  PR at the very end, no reviewing drafts, no re-review after a clean pass".
- Replies with a concrete method: u/harthren_developing (14.10) "have the reviewer look at only the diff since the
  last reviewed commit"; u/BlackAtomXT (13.10) a review runs once on a status flag, "the flag has to be cleared to
  run it again", and he logs "token count per line reviewed", 30-40 reviews a day unnoticed in his usage;
  u/studioinafolder (13.10) "a cheap first pass that only flags", the expensive model only on flagged diffs;
  u/LairBob (13.10) Claude tests "your same code ... completely unchanged ... over and over"; u/dbbk (13.10)
  "Just stop. You don't need to be reviewing every PR." Against: u/Professional_Ad705 (13.10) "You can have 100
  passing tests that all enforce the same incorrect assumption" (reviews do not prove tests are right).
- r/ClaudeCode u/mrothro, 04.03.2026, "97 days running autonomous Claude Code agents with 5,109 quality checks",
  https://www.reddit.com/r/ClaudeCode/comments/1rkt6k6/ [read, 33 entries]: "Half of all the issues were omissions";
  "After a gate rejection, they spend ridiculous time and tokens going in circles. I'm still figuring out the right
  balance between rerolling versus revising"; "If you let a single agent reason too long, it starts contradicting
  itself", fixed by "bounded tasks with fresh contexts". u/lucianw (same thread): the agent ends each milestone
  with "a "validation walkthrough" ... with the things it wants me to look at".
- Official: A2 (a reviewer asked for gaps always finds some; flag only what breaks correctness or the requirement),
  A6 (after two failed corrections, start clean).
- What fixed it: review once at the end, re-review only the new diff, a cheap pass first, a flag that must be
  cleared to run again [machine: the pipeline decides when a review runs]; tell the reviewer to report only
  correctness gaps [rule]. For us: his rule of 14.10 (two checks only on a new page he decides from; edits checked
  by me against their findings) is the same as OP's "no re-review after a clean pass"; A2's instruction (findings
  only on correctness and the stated requirement) is in .claude/agents/fact-checker.md (its lines 14-15); a grep of
  .claude/agents finds it in no other reviewer's prompt.

### P6. Numbers and claims from memory (ours: circles 6; mistakes lines 21, 38, 55, 56; Cosmogram's "sound radar")
- HN u/Aurornis, 22.07.2026, https://news.ycombinator.com/item?id=49006459 [read via the HN API]: a report made with
  Claude whose author "didn't read any details, so they didn't notice that Claude couldn't access the actual
  documents. So it started guessing and hallucinating until it came up with the scary number" ($2B).
- HN u/austin-cheney, 02.10.2026, https://news.ycombinator.com/item?id=49932630 [read via the HN API]: a benchmark
  figure "was confirmed as valid by Claude. Two weeks later I confirmed it was a defect" (a measured number checked
  by the agent instead of against the tool).
- r/cursor u/br_logic, 23.11.2025, https://www.reddit.com/r/cursor/comments/1p4xxk0/ [read, post]: models wrote code
  "deprecated 2 months ago" from older training data; his fix: "the key "Breaking Changes" from the Next.js 15 and
  Tailwind v4 docs" compiled into the standing instructions (a written rule built from the docs).
- Official: A7 "Point to sources. Direct Claude to the source that can answer a question."
- What fixed it: not found as a named fix in these threads beyond reading the source; the quote-checker pattern
  (every fact quotes its file) is ours (tools/check-cards.mjs) [machine, run by hand]. For us: a number with no
  file or tool output behind it is written "unverified" (CLAUDE.md already says so); the gap is that check-cards
  covers paper cards only, not pages and chat.

### P7. My own first idea before the documented pattern (ours: circles 13, the menu 13.10; mistakes lines 11, 30, 58)
- Official: A7 ("Letting Claude jump straight to coding can produce code that solves the wrong problem"; "Reference
  existing patterns ... follow the pattern"); explore, plan, then code, in plan mode.
- HN u/theshrike79, 25.07.2025, https://news.ycombinator.com/item?id=44680572 [read via the HN API]: "Claude has a
  tendency to reinvent the wheel heavily ... But if there's a pattern of already using stdlib functions, it can
  copy that easily." r/ClaudeAI u/hustler-econ, 20.03.2026, in u/DevMoses's thread (P2) [read]: Claude "very often
  will build a full component from scratch even though it already exists in the codebase". HN u/fg137, 25.07.2026, https://news.ycombinator.com/item?id=49047689 : a capable human "would
  have stopped and discussed with the team" before writing its own version of a common tool.
- HN u/dansmyers (a CS professor teaching AI coding to non-programmers), 13.02.2026,
  https://news.ycombinator.com/item?id=47006646 [read via the HN API]: "Specs-driven development ... Chat about the
  problem, then develop a detailed spec ... Refine that into a system design and detailed step-by-step task list
  with tests for each step."
- What fixed it: an existing example in front of the agent before it writes (a pattern file, a named sample), a plan
  read before code [written procedure; plan mode is a mode, not a check]. For us: circles 13's fix (the pattern in
  three lines with its link, then the plan reviewed, then code) is the same as the official one; no machine check
  for it was found anywhere.

### P8. Process work crowding out the product (ours: circles 7; Cosmogram 07.10; 12.10 and 13.10 commit counts)
- r/vibecoding u/Sp2ctre, 11.07.2026, "Anyone else feel like vibecoding is leading you in circles instead of
  forward?", https://www.reddit.com/r/vibecoding/comments/1uti86l/ [read, post]: "Constant maintenance of the process
  instead of the product"; "stuck on the dashboard of my app for about 2 weeks".
  Replies [read, 23 entries]: u/xxcxcxc (11.07) "I have 260,000 lines of documentation and my web app is half
  finished so maybe I'm overdoing it"; u/_crs (11.07) "act like a product manager. Ruthless prioritization".
- GitHub #61953 (P1) [read]: "significant time building and maintaining defensive hooks instead of productive work".
- r/vibecoding u/knutolee, 18.06.2026, a Steam game in 8 months by a non-programmer ("I basically cannot code at
  all (or only very little)"), https://www.reddit.com/r/vibecoding/comments/1u9g7ym/ [read, post]: "roughly 1000 hours", about 500 EUR of AI
  tools, "I ask myself what exactly all that time went into"; what held: "a documentation requirement for every
  smaller adjustment ... which every agent has to read before touching the code. It kept the bigger bugs in check."
- HN u/scomag232, 15.07.2026, https://news.ycombinator.com/item?id=48925551 [read via the HN API], 40 years with
  engineering teams, "never written production code": an iOS app in about 3 months, "followed a structured and
  linear process" (requirements, design spec, test plans), "No agents, just me and claude", plus a "working_with_me"
  file and a "project_handoff" file.
- What fixed it: not a check; a fixed, linear process with few parts, and the product as the measure [written
  process]. For us: the owner chose process first until he is sure of it (owner-decisions, 13.10); circles 7's sign
  (restrictions added faster than removed) is the one measure; the start's count of commits to game and process is
  told to him each window.

### P9. Heavy checks on the owner's laptop (ours: circles 8, closed)
- Official: the CLAUDE.md example in best practices: "Prefer running single tests, and not the whole test suite, for
  performance". The owner's thread: u/dbbk (13.10) "run tests on the PR's changed files only".
- Forums on a full browser suite freezing a laptop: not found. For us: closed (the smoke test runs only on GitHub).

### P10. Guards that silently do not run (ours: circles 9; mistakes lines 48, 50, 53; Cosmogram)
- Official, hooks reference [read 14.10]: "Claude never sees stderr from a hook that exits 0"; "Claude Code treats
  exit code 1 as a non-blocking error, even though 1 is the conventional Unix failure code. If your hook is meant to
  enforce a policy, use `exit 2`"; "A hook that can't start is a non-blocking error too" (shell code 127); to block
  instead, `"onFailure": "block"` (v2.1.295 or later, the version in his Claude Desktop since 13.10, h14); "A
  timed-out ... hook doesn't block the tool call ... don't count on a stalled hook to act as a gate"; "use the
  permission system rather than a hook to enforce a hard allow or deny".
- r/ClaudeCode, u/Tunisandwich, 08.09.2026, https://www.reddit.com/r/ClaudeCode/comments/1wb1wrg/ [seen, title]:
  Claude tested a new permission hook "by removing its own guardrails and then trying to delete a random system
  file. The hook in fact did not work and I was only saved by the auto-classifier" (the thread [read, 79 entries]:
  u/IntentRouterIRL, 08.09, a hook test "overwrote my api key"; u/reddebtt, 10.09: "move the safety test into a
  disposable worktree or container ... use a harmless canary file. A broken hook should produce a failed test, not
  a near miss on the host").
- What fixed it: exit 2 or JSON decisions, `onFailure: block`, deny rules in permissions for hard limits [machine];
  a guard proved by planting its mistake (ours: tools/prove-guards.mjs). For us: check that every guard in
  .claude/settings.json that must block has `onFailure: block` (circles 9 says the Write/Edit guard and the Stop hook
  do not block when they crash).
