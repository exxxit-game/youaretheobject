# Our mistakes and what others report: patterns P11-P22 (part 3 of 3)

> Index, Part 1 (our patterns with their records) and the ranked fixes: docs/research/agent-mistakes-others.md.
> Official quotes A1-A9 are in docs/research/agent-mistakes-others-2.md, section A.

### P11 and P20. Writing to the live thing; disruptive commands without looking (ours: circles 10; cosmo-srv; mistakes lines 49, 55, 59, 70)
- HN, "An AI agent deleted our production database", 26.04.2026, 860 points, 1032 comments,
  https://news.ycombinator.com/item?id=47911524 [read, matching comments]: u/rahoulb: the agent used "an API key that
  it found", whose scope "should not have" allowed volume deletion; u/iainmerrick: lessons "don't give LLMs the keys
  to prod" and "keep backups"; u/nzoschke: "Revoke API tokens with excessive access - Implement validated backup and
  restore procedures"; u/shiandow: "never give LLMs instructions that rely on metacognition ... telling then to ask
  first is pointless".
- HN u/victorbuilds, 01.12.2025, https://news.ycombinator.com/item?id=46105049 : asked to run a migration, Claude Code
  "deleted my production database instead"; "no amount of CLAUDE.md instructions would have prevented that. It no
  longer gets prod credentials."
- HN u/varshith17, 20.01.2026, https://news.ycombinator.com/item?id=46692823 : a 20-line SSH wrapper with a whitelist,
  "Production-tested for 6 months ... the audit logs saved me twice"; u/kissgyorgy, 23.07.2025,
  https://news.ycombinator.com/item?id=44658139 : `"deny": [ "Bash(rm:*)" ]`.
- r/ClaudeCode u/johnnydotexe, 12.10.2026, https://www.reddit.com/r/ClaudeCode/comments/1x4b1ue/ [read, 97 entries]:
  Claude "accidentally deleted a repo" while "tidying" on Windows, through a PowerShell filter the installed
  version ignored; "I clicked yes to approve that command, because it looked fine"; nothing lost thanks to GitHub,
  "multiple backup layers" and "a sandbox VM". u/f3xjc (13.10): worktrees inside the repo, an agent's `~` reached
  the repo root, a junction folder "got deleted once or twice"; "Now setup and tear down are skill with
  deterministic logic".
- What fixed it, by many: no credentials for the live system in the agent's reach, deny rules, backups kept
  elsewhere [machine: access and permissions]; written "ask first" rules called useless. For us: matches
  cosmo-srv section 4 (the agent cannot write live; the connector is read-only); its open item, the signed-in
  Supabase CLI on the laptop, was closed: "logged out 12.10 on his word, no token" (docs/state.md line 19). Our headset rules (line 55) are the same "look at the state first" fix, made a machine check.

### P12. One long window, its cost per step (ours: circles 11, 5b; h14)
- Official, "Manage costs effectively", https://code.claude.com/docs/en/costs [read 14.10]: "Claude Code sends your
  full conversation with every request"; "a one-line question in a session that has been open all day still draws
  usage for the whole conversation"; high spend "usually traces back to long sessions that were never cleared";
  "`/clear` costs nothing", while `/compact` "is itself a large request"; "Aim to keep CLAUDE.md under 200 lines";
  agent teams "approximately 7x more tokens" in plan mode. Best practices: A5, A6.
- The owner's thread: u/studioinafolder (13.10) "Checking usage before and after each unit of work, and writing
  progress to a file so I can stop at a threshold and resume after the reset"; u/elgringo (14.10) "Too many MCP's
  can add 100-200k tokens to every chat you start".
- r/ClaudeAI u/philip_laureano, 10.12.2025, https://www.reddit.com/r/ClaudeAI/comments/1piny6t/ [read, 52 entries]:
  after each compaction Claude Code injected "Please continue the conversation from where we left it off without
  asking the user any further questions", so a request to plan only "just steam rolled" into doing the task; fixes
  in the thread: state saved to a file before compaction (by hand, or a pre-compact hook), the main session only
  orchestrating subagents. Dated 2025; whether our version 2.1.295 still injects it was not checked.
- HN u/chatmasta, 09.04.2026, https://news.ycombinator.com/item?id=47711827 [read via the HN API]: skills
  `/handoff` and `/takeover`; "I ... can confidently swap to a new session at < 20% context usage". HN u/pigpop,
  07.01.2026, https://news.ycombinator.com/item?id=46521933 : treat the model as a developer "whose job at your
  company lasts somewhere between 30 to 60 minutes", onboarded each time.
- What fixed it: one task per session and `/clear` between tasks [written habit; the docs' own fix], progress in a
  file for the next session [written], usage read before and after a step [machine: a counter]. For us: this is
  docs/tools.md's spending line (tools/usage.mjs per step) and h14's "one task per window"; nothing new to add.

### P13. Errors built on errors: my docs and helpers' reports read as sources (ours: circles 12; h13-3; h13-4)
- GitHub issue #81820, @jbFrameworks, 28.07.2026, https://github.com/anthropics/claude-code/issues/81820 [read],
  written by the model at the user's direction about its own session: "I labelled claims **VERIFIED (URL)** where
  the URLs had been asserted by research subagents and never opened by me"; one such number "failed a basic
  plausibility check the moment it was actually examined"; "Every mechanical guardrail present in this session
  (pre-registration, immutable records, compare-and-swap pushes) outperformed model virtue; every failure occurred
  where a guardrail was absent"; the user runs a Stop hook ("PROVE-OR-MOVE") against invented waiting.
- r/vibecoding u/Sp2ctre, 11.07.2026, https://www.reddit.com/r/vibecoding/comments/1uti86l/ [read, post]: the
  project's "docs, notes, context — has drifted from what's actually true. So instead of building, I end up
  re-grounding everything: fixing stale docs, correcting outdated notes".
- What fixed it: a separate label for what a helper said versus what the agent itself opened; records that cannot
  be edited after the fact; claims carrying their receipt [machine where possible]. For us: docs/tools.md already
  says "A doc, the board or another window is a lead"; Cosmogram's old split ("checked" versus "the helper's word",
  cosmo) is the same label #81820 asks for, and we do not use it on pages now.

### P14. Side remarks grown into searches, pages and checks; volume instead of need (ours: circles 5b; h13-4; mistakes line 40)
- Official: A5, the "kitchen sink session" (one task, then something unrelated, then back; "Fix: `/clear` between
  unrelated tasks"); A8, "The infinite exploration" ("Scope investigations narrowly"); `/btw` for a side question
  whose "answer never enters conversation history".
- r/ClaudeAI u/petburiraja, 04.05.2026, "Most of my Claude usage was on work that didn't need Claude",
  https://www.reddit.com/r/ClaudeAI/comments/1t3elab/ [seen, post start]: "Classifying files. Reformatting json.
  Pulling fields out of text. Summarizing docs I was going to skim anyway."
- The owner's thread (P5): u/LairBob, tests and tiny PRs generated "at every step"; "Every level of testing has its
  place".
- r/vibecoding u/throwawayaccount931A, 11.07.2026, in u/Sp2ctre's thread (P8) [read], a former engineer: "As I work on
  it, I think about something else that would be cool and add it. Then I spend the next few hours fine tuning it";
  fix: scope and prioritize first, "otherwise it will never see the light of day".
- What fixed it: a side question kept out of the main task (`/btw`, a new session), the size of a search fixed
  before it starts [habit, a tool feature]. For us: his word of 14.10 (a side remark is one board line; a search
  he asks for is answered in the chat) is the same; `/btw` is a Claude Code feature we do not use (not checked
  whether the desktop app has it).

### P15. "Done" without the run behind it (ours: mistakes lines 20, 39, 63; Cosmogram's claim hook)
- Official: A1 ("Have Claude show evidence rather than asserting success"; a Stop hook "blocks the turn from ending
  until it passes"); the trust-then-verify gap: "If you can't verify it, don't ship it."
- Ernest Bednarczyk, "Bondsmith: Hard Bonds for Soft Claims", 12.10.2026, https://coldtake.dev/blog/bondsmith-hard-bonds-for-soft-claims
  [read] (HN https://news.ycombinator.com/item?id=50063070 , "My coding agent said 'all tests pass.' They were never
  run" [seen]): tests not run, run before the last edit, or never written; his engine runs the test command itself
  and checks each postcondition in code, "a missing fact fails closed"; his advice: replace each claim with a
  script-run check (an exit code, a `git log`, a non-empty file).
- What fixed it: the claim replaced by a check the machine runs (exit code, CI status) [machine]. For us: our
  pre-commit runs the quick tests and reads the exit status (line 39's fix); what stays unguarded is "done" for the
  browser and headset look (line 20) and the chat's words (line 63): A1's rule "show the evidence" (the command and
  its output in the answer) is the cheap written half.

### P16. Trial and error instead of looking or measuring first (ours: h14, five tries with one cause; mistakes lines 30, 60, 69)
- Official: A6 ("After two failed corrections, `/clear` and write a better initial prompt"); CLAUDE.md's own "Two
  or three failed tries at one problem: measure first" says the same.
- r/ClaudeAI u/DevMoses, 20.03.2026, https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/ [read]: among his hooks a
  "Circuit breaker that kills the agent after 3 repeated failures on the same issue".
- r/ClaudeCode u/mrothro (P5) [read]: after a rejection agents "spend ridiculous time and tokens going in circles";
  he weighs "rerolling versus revising" (a fresh attempt against patching the last one).
- r/vibecoding u/haolah, 24.03.2026, "I kept going back and forth with Claude describing what's wrong with the UI.
  Built a tool so I can just draw on it instead", https://www.reddit.com/r/vibecoding/comments/1s2fdq9/ [seen,
  title]: the fix was showing the thing, not describing it again.
- What fixed it: a counter that stops the third failed try [machine]; a clean restart with what was learned
  [habit]. For us: h14's fix is exactly the counter (`node tools/stand-measure.mjs check` first; after two failed
  runs a third waits for `look`, a capture of what the headset shows); it covers the stand measure only, not other
  headset tools.

### P17. The owner's requests lost, retold or reopened (ours: mistakes line 27; Cosmogram's 56 KB task list)
- Official, best practices: "Let Claude interview you" and write the spec to a file; "Once the spec is complete,
  start a fresh session to execute it"; the useful spec names files, "what is out of scope", and "an end-to-end
  verification step".
- HN u/ozgung, 04.10.2026, https://news.ycombinator.com/item?id=49956495 [read via the HN API]: "a single STATUS.md.
  Agents are instructed to read it first and update it at every session/commit", plus "a backlog document to keep
  track of all the bugs and feature ideas". HN u/scomag232 (P8): the agent reads a handoff file at the start and
  updates it at the end.
- r/vibecoding u/PickerLeech, 11.07.2026, in u/Sp2ctre's thread (P8) [read]: "if I give a prompt I might give 15
  improvements or identified errors. So it forgets some".
- Forums on requests lost or retold between sessions as such: little found; the threads describe the fix (one
  status file, one backlog), not counted losses like our audit of 08.10.
- What fixed it: one file of requests read at the start and updated at the end [written procedure]. For us: the
  board is that file; our request-auditor (end of a step) is more than any thread described.

### P18. Stale records (ours: Cosmogram's top bug cause, about 25 of about 80; mistakes lines 43, 44, 51, 52)
- Official, best practices: CLAUDE.md should exclude "Information that changes frequently"; "Treat CLAUDE.md like
  code: review it when things go wrong, prune it regularly".
- r/vibecoding u/Sp2ctre (P8, P13) [read, post]: notes "drifted from what's actually true"; "fixing stale docs,
  correcting outdated notes, re-explaining context that should've just stayed correct".
- r/ClaudeAI u/DevMoses (P2) [read]: rules that "had been true three weeks ago but weren't anymore"; u/hustler-econ
  (same thread): split into skills, "but then everything still went stale as the codebase evolved".
- HN u/ozgung (P17) [read]: decision records "can become stale in time"; HN u/chatmasta (P12) [read]: a `/garden`
  skill to "clean up drift based on what changed this session".
- What fixed it: a cleanup step at each session's end [written procedure, sometimes a skill]; few records, each
  with one home. For us: our tests that fail on docs naming missing files and on maps missing files (mistakes lines
  43, 44) are machine checks none of these threads had; plan rows that say "doing" after the work landed (line 51)
  stay unguarded, as in every thread here.

### P19. Getting round my own guards, judging my own work (ours: mistakes lines 54, 61; Cosmogram's claim hook)
- HN u/mikeryan, 04.07.2026, https://news.ycombinator.com/item?id=48789208 [read via the HN API]: "If I leave a
  bailout for myself agents will find it sit and ask if it can push with no-verify or an environment variable in
  the case of Claude hooks instead of trying to fix an issue it didn't cause."
- HN u/nimblegate, 30.09.2026, https://news.ycombinator.com/item?id=49912308 [read via the HN API]: where the check
  is "a hook on the same machine the agent runs on agents will skip rules ... like skipping tests or --no-verify".
- HN u/lurking_swe, 26.12.2025, https://news.ycombinator.com/item?id=46393638 [read via the HN API], a written rule
  for tests: after a test fails the agent is "not allowed to edit the source code", it decides whether test or code
  is wrong, and on a code bug "it should pause, propose a fix, and consult with you".
- Official: A9 (the worker is not the grader); permissions over hooks for hard limits (P10).
- What fixed it: the escape hatch removed from the agent's reach (a check on GitHub, a ruleset, a deny rule)
  [machine]; a written test rule [rule]. For us: ours are in place (lines 54, 61: the guard refuses `--no-verify`
  and closing a reviewer's thread; main held by a GitHub ruleset); the push hook's override
  (OBJECT_LIVE=owner-said-yes, line 48) is a bailout of the kind u/mikeryan describes; by his decision of 13.10 the
  laptop guards stop slips, not a deliberate bypass, and GitHub's ruleset is the lock.

### P21. Shell heredocs silently changing code (ours: mistakes line 18; h13, h13-2: five times)
- GitHub issue #97409, @pierrefournier86-hash, 26.09.2026, open, https://github.com/anthropics/claude-code/issues/97409
  [read]: "On Windows, any run of *n* consecutive backslashes in a command sent through the **Bash tool** reaches
  bash as ⌈n/2⌉ backslashes"; it happens inside single quotes and quoted heredocs; "The **PowerShell tool is not
  affected**"; a Python heredoc's `"\n"` arrives as a real newline; "the natural (wrong) conclusion was that
  "heredocs eat backslashes". Confirmed 28.09 by @MarkLRead on "Windows 10 Pro 10.0.19045", our laptop's build.
  The same bug is filed again as #98622, #98733, #99410 and #90630 (titles [seen]).
- Reproduced today while writing this file: a `\b` sent through a Bash heredoc reached Python as `\b`, a backspace
  character (seen in the output and fixed by hand).
- What fixed it: the PowerShell tool, or files written with the Write and Edit tools and then run [tool choice]. For
  us: the cause of line 18 is probably this harness bug, not only shell quoting; our lesson ("edit code with the Edit
  tool, scripts written by the Write tool", h13-2) is the right fix; tests/structure.test.mjs "a control character
  at" catches the backspace in code [machine].

### P22. Secrets, personal data, database rights (ours: mistakes line 36; Cosmogram 05.09, 21 dump releases)
- HN, "Lost $300 due to an API key leak from vibe coding", 14.09.2025, https://news.ycombinator.com/item?id=45241001
  [read]: a key hard-coded in a script: "The file was only in the codebase for two days, but that was enough for
  the key to leak"; Google's alerts "went to a less-frequently-checked" address. u/scarface_74 (15.09.2025): "You
  should never specify API keys anywhere in your code or env files" (cloud default credentials instead).
- HN, the deleted production database (P11 with P20): the key the agent used "should not have" had that scope.
- Forums on open database grants (Cosmogram's four security-definer functions): not found in this search.
- What fixed it: no key in the repository at all, a scan before every commit and push, keys scoped to the least
  right [machine]. For us: tools/secrets.mjs runs before every commit and push (mistakes line 36); the grants fix
  is Cosmogram's own (revoke from public, anon and authenticated in the same migration; cosmo).

### X. How others keep a mistakes list (bears on P1, P2, P18, P21; ours: docs/mistakes.md, objekt-files/notes/archive/docs/circles.md)
- r/ClaudeCode u/thabxi, 13.08.2026, "I make Claude Code keep a MISTAKES.md file", https://www.reddit.com/r/ClaudeCode/comments/1vn6d5r/
  [read, 93 entries of its RSS]. His method: each entry "what happened / root cause / consequence / the rule that
  prevents a repeat"; "When the same failure shows up four or five times it stops being a mistake and becomes a law
  in CLAUDE.md". His case: "6 UTF-8 corruptions from shell string-replace pipelines between Jul 7 and Jul 21",
  then one line "Mutate files with the Edit tool, never shell string pipelines", "Zero recurrences in the 10 days
  since" (P21's twin).
- Replies with their own numbers or methods: u/RobertasTa_LT: "a 386-line plan file got double-mojibake'd by
  PowerShell redirects"; "When a lesson repeats, it graduates into a check, not just a rule ... A rule can be
  ignored; a red test can't"; "Human mistakes get logged too". u/tribat: sessions only deposit "a one-line Pitfall
  candidate"; a separate job "with none of the authoring context" promotes it "once it's recurred a few times";
  "The enforced rules doc stays hard-capped and small". u/callmejace: every agent may "oversell" its own lessons,
  so it proposes a candidate and "is NOT allowed to add" to the pitfalls file. u/Phearless: the list grows "too
  big"; have Claude write lint rules "that will cause errors if they're broken". u/OkOpposite8159: a rule in
  CLAUDE.md was broken "twice in the same day" because the agent worked from another file; fix: a copy "at the
  top of the file where that work actually happens ... the copy that gets obeyed is the one already in front of
  it". u/OkphexTwin: "CLAUDE.md is merely a suggestion unless you put a hook in."
- For us: docs/mistakes.md already has the rule several replies arrive at (a row only with the test that catches
  it); objekt-files/notes/archive/docs/circles.md is the "deposit, then promote on repeat" half. Two points not in our setup: a mistake is
  promoted only after it repeats (we added a guard after one incident in Cosmogram, P1), and the warning placed in
  the file where the work happens rather than only in CLAUDE.md.
