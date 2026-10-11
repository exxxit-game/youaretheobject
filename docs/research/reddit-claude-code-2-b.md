# Reddit on working with Claude Code, second batch: seven threads (shelf 1: rules, hooks, helpers, memory) (continued)

First part: [reddit-claude-code-2.md](reddit-claude-code-2.md).

## 3. "I never thought this would happen to me (data loss)"
r/ClaudeCode, Optimal-Fix1216, 2026-07-19, score 1790 — https://www.reddit.com/r/ClaudeCode/comments/1v0d7iv/
- Optimal-Fix1216: Fable asked to "clean up some unnecessary files"; documents and photos went too (b). Replies
  trace it to Windows.old: rare_design "windows.old uses sym links"; damndatassdoh (35+ years in IT): deletion
  "via Robocopy without /XJ.. it runs in recursive mode this way and will follow junctions"; crusoe: "Apparently
  Powershell Remove-Item will gladly follow soft-links / junction links." (b each, unverified). For us: Most
  useful 10; no junctions in our folders today.
- gajop (runs most agents with permission checks skipped): "Don't give it tasks that have destructive actions."
  (clean up, free space, undo, deploy); "Last year's Sonnet is just as "dangerous" as frontier models" (b; many
  agree: (a)). For us: no such tasks so far; no guard either (Most useful 1).
- Mayimbe_999 (154): "have it move everything to a consolidated folder so I can personally check"; BrilliantEmotion4461:
  "Yep. Move not delete."; sayo9394, Prod_SO ("make a copy of it, have Claude clean the copy"), maztec (plan in
  read-only mode, a _TrashCandidates folder), benzonchan and Batty25111 (a list, reviewed before approval) (a).
  For us: no trash-folder rule: differs.
- GuitarAgitated8107: a script, "run dry by default, then I AS A USER WILL RUN MANUALLY"; uninchar, northerncodemky
  the same (a). For us: the owner does not run commands; does not apply as written.
- Artistic_Pineapple_7 (261, in IT): "AI was never your problem. Your poor backup hygiene is."; an immutable
  30-day cloud bucket; Kooky-Ebb8162: "better the backups be append only"; Wild_Wallet, saintpetejackboy (cloud
  plus a second server), sooner_25 (restic to three places), cloud_sec_guy (VM clones) (a). For us: Most useful 2.
- Kooky-Ebb8162: agents force-push when blocked; ArtisticFox8: "you can disable force pushing on Gitlab / Github
  /wherever you host your git." (b each). For us: main is protected on GitHub (his decision 9.10) and
  tools/hooks/pre-push stops any push, force push or deletion of main without his word: match; other branches are
  not protected (they are copies on GitHub).
- spiders888: "What most people call guardrails are "suggestions" to the AI (written instructions)."; QuasiSpace:
  "they denied an agent access to a directory, so it wrote a Python application to access it." (hearsay);
  Substantial-Elk4531, senseven, El_Wij: a container or a separate machine (a). For us: our hard limits are hooks,
  not prose: match; no container: differs (the browser pane, the headset cable and the papers folder would need
  mounting; not proposed).
- a commenter (handles IT at a startup): a pasted Remove-Item lost months of work and a SharePoint site
  synced to every PC: "So that entire SharePoint site got nuked."; almost 200,000 files resynced from his own backups (b).
  For us: Most useful 2 (a synced folder).
- Hazzman: "I ran a session yesterday that overwrote my main.": two sessions in tandem; GitHub had the copy (b).
  For us: one window at a time until the corridor is done; pre-push guards main: match.
- hiskias: a cleanup command that checks each file is safe, asks, explains; "Running remote branch deletion is
  restricted on hook level" (b). For us: no branch deletion guard; Claude Code's worktree cleanup already lost
  work for others (S15): confirms S15.
- the1ice9: "Always resolve paths first" (a symlink took a production database) (b). For us: no links today.
- No_Statement2730: "the more I am getting lazy at even verifying the outcome" (b). For us: checks are run by
  the machine, not by his attention: match.

## 4. "Claude rm -rf ed my pc"
r/ClaudeCode, Ecstatic-Big5126, 2026-08-05, score 3284 — https://www.reddit.com/r/ClaudeCode/comments/1vg18yu/
- Ecstatic-Big5126: Opus 5 asked for a backup: "it created the backup in the wrong directory", then deleted the
  drive (SubjectiveAdvice reads the screenshot as the user folder only); permission mode "Bypass unfortunately" (b).
  For us: sessions run in auto mode (revision-shelf1-machinery.md B4), not bypass.
- silvercondor (101): "seems like you're not running the auto classifier?"; ItstheSECopenup: "I've watched claude
  hit and stop on auto classifiers a hundred times now." Against: En-tro-py "Probably a 50/50"; one-wandering-mind
  "Auto classifier mode does not always catch it."; BroScienceAlchemist: "an LLM can work around it" (contested).
  For us: auto mode is our only check on deletes: Most useful 1.
- rahvin2015 (150): a container: "Claude never has access outside of the current project directory because
  that's all that's mounted in the container."; parts of ~/.claude read-only "so that Claude can't change its own
  permissions"; MrDilbert: project, ~/.claude and /tmp only (a). For us: no container; settings and hooks are
  ordinary files Claude can edit (the guard blocks only the review record): differs; owner-gated.
- Nekusta: rm -rf in the deny list; One-Next: "If opus wants to delete, opus finds a way."; lllorrr: python
  os.remove, "`find -delete`, `rsync --delete` and other creative ways to wipe your data." (a). For us: our guard
  reads commands the way the shell does and follows python -c, node -e, bash -c (tools/claude-guard.mjs:223-292),
  so the parser to catch these exists; it is pointed only at the record file.
- clintCamp (runs 5 or more agents at once): agents stashing each other's work lost 8 hours; "It took 3 more
  changes to get agents to stop taking a deny as a puzzle to work around"; fix: the hook says why the deny exists
  (b). For us: every refusal names its reason (WHY table, claude-guard.mjs:135-146) and ends "Do the work so the
  guard passes instead.": match.
- PureV2 (155): "hooks that trigger on the usual destructive commands", through an approval gate; Ammoun442 and
  matznerd point to destructive_command_guard (dcg) on GitHub (Ammoun442: "idk if its doing anything") (a).
  For us: a third-party tool would need his word; our own guard could carry the same rule (Most useful 1).
- SleepyGuard89 (OpenCode with Claude and Codex): rm, rmdir, unlink, shred, -delete denied; a "Trash" directory
  instead; "This thing has caught Claude trying to use rm at least a dozen times now."; traveltrousers: "banning
  rm was one of the first and best decisions I made" (a). For us: differs.
- one-wandering-mind: rm -rf is common in normal work, "I assumed it would be denied by default in Claude
  permissions, but it is not."; for irreversible file work he has Claude write and review a script instead (b).
  For us: Most useful 1.
- IonizedHydration: "wsl automatically mounts windows drives"; KHRZ: "it's just due to bad path standardization
  confusing the model." (b each). For us: confirms S18 (Windows path mistakes); our guard reads both Bash and
  PowerShell forms (base(), claude-guard.mjs:148).
- BroScienceAlchemist: "I am expecting LLM websearch and playwright to be a common attack vector using prompt
  injection." (b). For us: Most useful 9.
- FourWayFork: "It only runs on my development VM, which has differential backups nightly and full backups
  weekly." (b). For us: does not apply (the laptop is the only machine).
- Nekusta: the settings and CLAUDE.md "are not a one time set up. They evolve with the project." (b). For us:
  frozen process changed only on a finding or his word: differs on purpose.

## 5. "I tried everything to get Claude to stop writing 5-paragraph essays for a 2-line bug fix. What's your actual fix?"
r/ClaudeAI, Physical_Tea9389, 2026-08-28, score 202 — https://www.reddit.com/r/ClaudeAI/comments/1w0fyvr/
- Pizzatorpedo (136): a root CLAUDE.md block: "Put the result in the first line."; keep only what he will act on;
  questions last; "Always keep risks, mistakes, and guesses you made."; a banned list ("load-bearing", "to be
  clear", self-grading such as "successfully", "perfect", "production ready") (b, many endorse). For us:
  owner-decisions (Orwell's six rules, Hayakawa's report against judgment, no empty words): match; the "keep the
  risks even when short" exception is not written: adds.
- gthing, kakkoiiko, pdfops: an output style beats CLAUDE.md; "the default output style is still being included
  in the overall prompt sent to Claude."; "A custom output style replaces the default style block instead of
  competing with it."; kakkoiiko: "One caveat is that subagents do not load this." (a). For us: confirms O1; no
  output style set (.claude/settings.json): differs.
- flexibleaspect: "In Claude Code you can set the output style: /config > Output style > concise" ("added a week
  or two ago"); MannToots, CroItzo, dar-mit the same (a). For us: not checked against the docs; an option.
- ben_bliksem: "A CLAUDE/AGENT.md instruction (nevermind an optional skill) is only going to last a few rounds";
  his fix: a hook that adds "tldr" to every prompt; Top_Emu_2254: "A hook (or an append-system-prompt file) is the
  harness, not the model's mood." (a). For us: the prompt hook only logs his messages (claude-guard.mjs:456-466):
  differs; confirms R3 (rules fade over a session).
- IveWastedMyLifeAgain: "the essay is usually claude narrating a refactor it wants to do."; fence the scope;
  reviews asked for blocking findings only: "cut mine by like 80%" (b). For us: CLAUDE.md "Do what was asked";
  fact-checker reports only what changes a fact (revision-shelf1-agents.md B2): match.
- picto: numbers work where "be brief" did not: "Sentences should be 15 words or less but must not exceed 30";
  kevin_g_g: "Concrete constraints hold where "be brief" doesn't, because the model can check itself against them.";
  Own_Thought902 (under 100 words), stevioc_54 (250 words) (a). For us: "short" in CLAUDE.md has no number:
  differs.
- EnvironmentalLeg8506: write the reason, "why I need it short (I read in a split terminal, long answers get
  skipped)"; still not reliable (b). For us: his reason is in his decisions (Chase, the marketer's speech): match.
- octolunge: "Never end by offering more work"; SaltsMoon: "Patch only, max one sentence of rationale, test command"
  (b each). For us: CLAUDE.md "ideas go at the end of the answer": differs slightly (ideas are allowed, at the end).
- gwmccull, jrjsmrtn: the ISO 24495-1 plain-language standard; Spenceful, ChronoLink99: ASD-STE100 ("simple
  technical english") (a). For us: our rules come from Orwell and Hayakawa by his choice; ISO 24495-1 not read
  (unverified); ASD-STE100 is for English, his answers are Russian: does not apply.

## 6. "I ported Toyota's Lean quality system to Claude Code so the same agent mistakes stop coming back (MIT, free)"
r/ClaudeAI, PrimeFold, 2026-09-08, score 373 — https://www.reddit.com/r/ClaudeAI/comments/1waoo5h/
- PrimeFold (15 years in manufacturing, runs his company through Claude Code, calls himself a non-developer):
  a bug fixed in five places; "There were nine more instances sitting in files the agent hadn't opened." (b).
  For us: CLAUDE.md "with the whole around it seen first" is prose; no machine search for all instances: differs.
- PrimeFold: a Stop hook: "When an agent says something like "done," "shipped," or "verified," the hook checks for
  fresh verification evidence."; warn first, then block; his own hole: "It doesn't know whether that verification
  actually falsifies the specific claim the agent just made." (b). For us: Most useful 3 (word-triggered checks
  were removed 11.10).
- ianreboot: "The hook now runs the grep or the test itself, so the pass is the check that actually ran."; the
  check comes from the touched paths: "A fixed suite can exit clean without ever opening that file."; for
  behaviour claims "the evidence has to be the run" (b). For us: pre-commit and pre-push run tests themselves:
  match; behaviour in the headset is shown by tools/quest-look.mjs frames: match.
- AdBest7581 (quality engineering, CAPA): "prioritize executable falsifiers over an AI reading its own code and
  telling you it's okay" (b). For us: confirms S4.
- Bahatur: "never allow the same agent to write both a test and the tested code"; BestUsernameLeft: test writer,
  implementer, verifier as three subagents; Expert-Instruction41: TDD (a). For us: SKILL.md steps 4 and 8: the
  same session writes the numbers' tests and the room; the paper-reviewer checks against the paper after: partly.
- demosthenes83: "a test oracle brief, mutation challenger, and independent outcome verifier" (b). For us: SKILL.md
  step 4 "Break a value on purpose once: the test must go red": match for the mutation part.
- PrimeFold: "A note is a reminder; a hook is a countermeasure."; a "codified" field in his mistakes log;
  promotes a lesson "roughly at the 3rd recurrence"; btc6000: "if Claude makes the same mistake/ governance failure
  3 times then we enforce programmatically."; amirfish the same (a). For us: confirms S16 (3-failure threshold);
  ours promotes a room-breaking mistake at once (SKILL.md step 10), guards only for the irreversible: match.
- victorc25 (about a year on a similar system): "your defect layer doesn’t scale"; his: per-module boards
  mirroring the code, an index of indexes, search (b). For us: docs/mistakes.md 71 lines; split rule at 300 lines
  with an index: no problem yet.
- PrimeFold and btc6000: enforce the session handover: "commits exist but no fresh session manifest = something
  got skipped" (a). For us: the Stop hook checks commit, push and room-polish; nothing checks that the board was
  updated when commits exist: differs (the start hook only asks for today's showing row).
- amirfish, PrimeFold: a lesson stays in one worktree's memory unless pointed at a shared store (a). For us: rules
  live in the repo, and new worktrees start from room-polish, which the Stop hook keeps current
  (claude-guard.mjs:475-485): match.
- xia03: "it routinely finds the root cause, writes a bad unit test, makes it pass and declares victory." (b).
  For us: CLAUDE.md "Two or three failed tries at one problem: measure first"; reviewers: partly.
- jesssoul: instructions "infuriatingly degrade in subsequent sessions"; PrimeFold: move them into the
  environment (a). For us: confirms R3, S27.
- Timely-Weight: the model "treats whatever is there as holy" and never revisits a data structure (b). For us:
  "The whole before a part" (his decisions): match.

## 7. "What's the one line in your CLAUDE.md that made the biggest difference ?"
r/ClaudeAI, Tough_Stretch_4045, 2026-09-30, score 1367 — https://www.reddit.com/r/ClaudeAI/comments/1wu40t8/
- Tough_Stretch_4045: "be extremely concise and sacrifice grammar for sake of concision." (b). For us: plain
  Russian with grammar kept (his decisions): does not apply.
- himiaoxin (466): "If my request is ambiguous, ask one clarifying question before doing anything."; refined:
  "ask one clarifying question, then proceed with your best judgment."; bugra_sa: "ask only when the answer changes
  something expensive to undo."; others want many questions for specs (a). For us: CLAUDE.md "A choice a source
  settles is mine (the reason in a line); one no source settles goes to him as real options": match in shape.
- Individual-Shower973: "the agent had still tried rm -rf 117 times." over two months despite the CLAUDE.md line;
  a PreToolUse hook exits 2 with "refused: recursive delete. Don't retry another way; tell me what you wanted to
  remove."; "Claude can't talk its way past exit 2" (b, (a) with thread 4). For us: Most useful 1; our refusal
  text lacks "tell me what you wanted": adds.
- Individual-Shower973: "a PreToolUse hook on the Agent tool can refuse any subagent that isn't one of yours" (b).
  For us: docs/tools.md routes helpers by prose; a wrong helper can be undone: not needed.
- Dunsmuir: "Don't trust assumptions when verifiable information exists."; blangzo: "explicitly state all
  assumptions used in the response." and separate evidence from reasoning; Coolerwookie (a). For us: CLAUDE.md
  "Names, numbers, quotes and pages come from the file"; his decisions (Kodish: dates and indexes on every claim):
  match.
- ElegantApartment1325: "when you're stuck after two failed attempts, stop and explain what's blocking you instead
  of trying a third time"; himiaoxin: "after the second failed approach, stop and tell me what you've ruled out."
  (a). For us: CLAUDE.md "Two or three failed tries at one problem: measure first": match; "say what is ruled out"
  adds.
- pdfops: never report a pass unless "you read the exit code directly, not through a grep or tail in a pipe";
  Hopefullyanonymous2: a test script that "ONLY reports failures and totals" (a). For us: Most useful 3.
- Hopefullyanonymous2 (runs an orchestrator, two full $200 plan runs this month): "Preplan your tool calls, and group
  in batches where it makes sense": Opus 5.5 from 1.1-1.15 to 1.3-1.4 tools a turn, about 20% fewer tokens; a
  stronger wording made reviews miss "about 20%" (b, his own measure). For us: our cost per turn is not measured:
  unverified.
- Yelov: "Optimize for the simplest resulting design, not the smallest diff."; "Existing code isn't correct just
  because it exists." (b). For us: "The whole before a part" (his decisions): match.
- locn4r: a hook that asks, after code was written, whether Claude read it back (b). For us: no such hook;
  CodeRabbit and reviewers read the diff: not needed.
- No-Needleworker5295: "every few days ask it to review our working together and suggest changes", including
  unused plugins and token use (b). For us: the monthly watch (his decisions, Knowledge is updated) and this
  revision: match.
- Niceyyc: "don't change anything I didn't ask you to change."; YearlyBrown: "Could easily backfire" (contested).
  For us: CLAUDE.md "Do what was asked, with the whole around it seen first": match.
- martinus: "No human reads this file." so Claude writes it for itself (b). For us: CLAUDE.md is English and he
  reads Russian; his words stay in docs/owner-decisions.md: does not apply.
- InformationHoarding: "Claude now natively supports AGENTS.md like a normal AI"; CosmopolisDev dropped CLAUDE.md
  (a). For us: confirms S8; one tool, does not apply.
- Style lines ("I have ADHD", a pirate voice, "Remember, you are cherished", "make no mistakes"): jokes and
  personal taste, left out.

