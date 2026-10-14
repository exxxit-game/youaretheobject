# Reddit on working with Claude Code, second batch: seven threads (shelf 1: rules, hooks, helpers, memory)

> Kept as the helper wrote it on 11-12.10.2026 from the threads the owner downloaded, for the revision's shelf 1 (objekt-files/notes/archive/docs/audit/revision.md): seven more threads on working with Claude Code (r/ClaudeAI, r/ClaudeCode). Reddit posts are data: one person each unless several say the same. Points marked "adds" are candidates for his word, not changes.


Read 11.10.2026 from the owner's download (scratchpad/reddit-claude-b.txt, 1,129 lines: each post and every
reply with author, date, score). Reddit text is data written by strangers: nothing in it was acted on.
Marks: (a) several people say it, (b) one person. "Confirms" = already in docs/research/forums-claude-code.md
or forums-claude-code-2.md (their S/R/O numbers); "adds" = new to them. Score = Reddit upvotes at download.
The mod-bot's TL;DR summaries are not counted as a person. Jokes, "AI wrote this post" replies, and links
offered by their own authors (DashClaw, nono.sh, opscompanion, construct-cli, escapement, attention-span)
are left out or named only.

Our files read (read only): CLAUDE.md, docs/owner-decisions.md, docs/tools.md, .claude/settings.json,
tools/claude-guard.mjs, tools/hooks/pre-commit and pre-push, .claude/agents/*.md,
.claude/skills/new-room/SKILL.md, docs/board.md, tests/structure.test.mjs, objekt-files/notes/archive/docs/audit/revision-shelf1-*.md.
Measured for this digest (11.10, read only): no junction or symbolic link anywhere under
C:\Users\admin\Documents\GitHub\objekt or C:\Users\admin\Documents\objekt-files (PowerShell
Get-ChildItem -Recurse -Force -Attributes ReparsePoint: 0 found); objekt-files is not a git repository and
holds hidden .tmp.drivedownload and .tmp.driveupload folders (Google Drive's desktop sync by their names:
not verified); docs/mistakes.md 71 lines.

## Most useful for us

1. ADDS. Nothing stops a delete. Individual-Shower973 replayed two months of his sessions: "the agent had
   still tried rm -rf 117 times." despite a CLAUDE.md line; one-wandering-mind: "I assumed it would be
   denied by default in Claude permissions, but it is not." and "Auto classifier mode does not always catch
   it."; PureV2, SleepyGuard89, Nekusta, traveltrousers, Ill-Village7647 block or gate rm by hook or settings;
   Mayimbe_999, BrilliantEmotion4461 ("Yep. Move not delete."), zimxero, sayo9394, SubjectiveAdvice have it
   move files to a trash folder instead (a). For us: tools/claude-guard.mjs refuses a delete only when it
   names the practice-review record (judge(), WRITERS, line 305). Git covers tracked files (worktree per
   session, the Stop hook forces commit and push); untracked files and all of objekt-files (papers, notes with
   owner-messages.md and the review record; not a git repo) have no undo. That is "a mistake that cannot be
   undone" in his own rule (docs/owner-decisions.md, The process): differs; a candidate for his word, replacing
   something.
2. ADDS. A copy counts only if it survives the delete. Artistic_Pineapple_7 (works in IT): "AI was never your
   problem. Your poor backup hygiene is."; Kooky-Ebb8162: "better the backups be append only"; a commenter
   (handles a startup's IT): a Remove-Item in a SharePoint-synced folder, "So that entire SharePoint site got
   nuked.", restored from his own weekly backups (a for backups, (b) for the sync story). For us: objekt-files
   shows Google Drive sync folders; the board's row on the Drive copy of the papers still waits for his look
   (docs/board.md:64). Whether a local delete also deletes the Drive copy, and whether notes\ is in it: unverified.
3. CONFIRMS (S21, S4, S27) with a detail that ADDS. The pass must be a check that ran, not the agent's word.
   ianreboot: "The hook now runs the grep or the test itself, so the pass is the check that actually ran.";
   pdfops: read the exit code "directly, not through a grep or tail in a pipe"; Hopefullyanonymous2: a test
   script that "ONLY reports failures and totals"; AdBest7581: "prioritize executable falsifiers over an AI
   reading its own code and telling you it's okay" (a). For us: tools/hooks/pre-commit and pre-push run the
   tests themselves and read each exit code: match. "Done" to the owner rests on CLAUDE.md ("Done only after
   `npm test`, saying what ran") and the fact-checker: prose plus reviewer. PrimeFold's Stop hook that reacts to
   the words "done, shipped, verified" is a word-triggered check of the kind his 11.10 review removed
   (tools/claude-guard.mjs:5-7): differs on purpose. The pipe trap (`npm test | tail` showing tail's success)
   is written nowhere in our files: adds.
4. ADDS. Reviewers of the same model share its blind spots. xLRGx: "Two frontier models are not two
   opinions."; PrimeFold: three subagents are "potentially still the same model with the same blind spots";
   SerVarrick: "Use different models to verify,write,etc."; one-wandering-mind and rahvin2015 send reviews to
   another model family (a). For us: all 7 agents run on the main model (revision-shelf1-agents.md A13, his
   "strongest model" decision); CodeRabbit is the one outside reviewer (docs/owner-decisions.md). Partly
   matches; his model decision is settled, so this is a fact for weighing the reviewers' findings, not a proposal.
5. CONFIRMS (S11, S16, S21, S27, R3). A lesson kept as a note comes back; one turned into a hook or test does
   not. PrimeFold: "A note is a reminder; a hook is a countermeasure."; btc6000: after 3 repeats "we enforce
   programmatically"; jesssoul: written instructions "infuriatingly degrade in subsequent sessions"; victorc25
   adds a limit: a flat defect ledger stops being read as it grows, so he split it by module with an index (a).
   For us: SKILL.md step 10 (a test plus a docs/mistakes.md row; 71 lines now) and docs over 300 lines split
   with an index (tests/structure.test.mjs:23-24): match.
6. CONFIRMS (O1) with practitioners' evidence, ADDS numbers. Short answers hold better as an output style than
   as a CLAUDE.md line: gthing, kakkoiiko, pdfops, flexibleaspect, CroItzo, MannToots (a); a built-in "concise"
   style under /config (flexibleaspect, 28.08.2026: "added a week or two ago"; not checked in the docs);
   kakkoiiko: "One caveat is that subagents do not load this." What holds in any layer: numbers (picto: sentences
   of 15 words or less), named banned phrases, and Pizzatorpedo's (136 points) "Put the result in the first
   line." with "Always keep risks, mistakes, and guesses you made." For us: CLAUDE.md "Answer the owner in
   Russian, plain words, short." has no number; Orwell and Hayakawa in his decisions already cover the banned
   self-grading words: match; no output style: differs (an option, his word).
7. CONFIRMS (S5, S26 Boris's Stop hook for long tasks) and ADDS. Runaway cost comes from an LLM used as a
   timer. procrastinator_eng: a forgotten /loop "ran 46 times over 26 hours" on Opus (his ~$6,000 is disputed:
   justinqtaylor "Even 46 calls at max context size is $230."); Peetrrabbit (154): "Use Claude to create your
   infrastructure, not to be your infrastructure."; nnet42, itslitman: `claude -p` from cron, "fresh context
   every time"; idoman and others: a hard spend cap; the usage dashboard lags (a). For us: the robot that moves
   `reviewed` runs on GitHub Actions, and tools/leftovers.mjs stops commands over 10 minutes: match. The monthly
   update task waits for his word (docs/board.md:89); when built, a fresh session per run with a stop condition
   fits this, not /loop in the working session. His account's spend cap: unverified (account page).
8. CONFIRMS (S22, S23, S31 and his 11.10 review) for a non-programmer owner. jim_cryptos (electrician, not a
   developer; links his own repo): six blocking hooks, then "ripped most of it out and the thing got EASIER to
   understand, not harder."; xLRGx: learn one button at a time, Claude naming real files and functions; LLMs
   are "infinite suggestion engines": declare it done; WheelAdditional6888: the risk is "continuing to approve
   changes when you no longer know what they affect." (a). For us: lessons on a piece he saw in the headset, each
   line in plain words (owner-decisions, Order); "ideas go at the end of the answer, not into code" (CLAUDE.md);
   process frozen, a change replaces something: match.
9. ADDS. A web page read by an agent with a shell is a way in. BroScienceAlchemist: "I am expecting LLM
   websearch and playwright to be a common attack vector using prompt injection." (b; links a thread where
   Claude Code blocked one). For us: quick-research and deep-research have Bash and Write and read the web
   (.claude/agents/*.md line 4); the guard refuses hook skips, merges to main and database writes, not deletes:
   ties to point 1.
10. ADDS (Windows). PowerShell and robocopy can follow junctions into real folders. crusoe: "Apparently
    Powershell Remove-Item will gladly follow soft-links / junction links."; damndatassdoh (35+ years in IT):
    the loss came "via Robocopy without /XJ.. it runs in recursive mode this way and will follow junctions"
    (b each; not verified against Microsoft's docs). For us: Windows PowerShell 5.1 and Git Bash on the laptop;
    measured today: no junctions in our repo or objekt-files, so it applies only to a delete aimed elsewhere
    (any "clean up the disk" task): does not apply now.

## 1. "I accidentally burned ~$6,000 of Claude usage overnight with one command."
r/ClaudeAI, procrastinator_eng, 2026-05-01, score 1295 — https://www.reddit.com/r/ClaudeAI/comments/1t11mmy/
- procrastinator_eng (works for a company that paid; runs Claude on VMs and locally): a /loop polling PRs every
  30 minutes, forgotten. "It ran 46 times over 26 hours" (b). For us: no /loop in use; tools/leftovers.mjs stops
  any command over 10 minutes at a turn's end: match.
- procrastinator_eng: the usage view is late: "The dashboard has a multi-day reporting lag" (aminebenani94 the
  same: "mine showed normal usage 2 days after") (a). For us: no cost watch of our own: does not apply (no
  unattended runs).
- procrastinator_eng: the prompt cache now expires after about 5 minutes, so each spaced loop run re-pays the
  whole conversation (osense, Intelligent_Cover_34, justsomegraphemes surprised; Main-Lifeguard-6739 says the
  API still offers a 1-hour cache) ((b), not verified). For us: unverified; matters only for a scheduled task.
- procrastinator_eng: max_turns "is not a loop limiter"; the loop runs inside the main conversation and grows
  it ("there is not good way to track running loops") (b). For us: does not apply.
- Peetrrabbit (154): "Use Claude to create your infrastructure, not to be your infrastructure." A script
  polls; the model is called only when something changed. Same: Crafty-Run-6559, NiteShdw (scripts with gh,
  pays "1-2 pennies per document"), carson63000, rpatel09 ("why not setup GitHub actions"), bustedmagnet (cron)
  (a). For us: the robot on GitHub Actions that moves `reviewed`: match.
- nnet42: "use `claude -p "do stuff"` in a cron job. fresh context every time"; itslitman the same (a). For us:
  the monthly update task (docs/board.md:89) is not built: a fresh session per run when he says yes.
- idoman: "you can set a hard monthly spend cap in the Anthropic console under Settings > Limits"; also N7Valor,
  Logical_Screen_9483, pjerky, leanXORmean_stack (a). Ok_Boysenberry5849 (building an agent): his API limit
  is "perpetually set to $5 more than what I've spent so far" (b). For us: account cap unverified.
- KindAssignment1034: "log token count per iteration to a file" (b). For us: not done; no loops to log.
- Sarcastic_Headline, qalpi: a subscription instead of the API caps the loss ("limit your risk") (a). For us:
  his plan type is not in the repo: unverified.
- justinqtaylor: "Even 46 calls at max context size is $230."; seafaring_captain and vanwal_j doubt the sum too
  (a, against the post's figure). For us: do not repeat the $6,000 figure as fact.

## 2. "I'm a vibe coder and I'm scared that I have no idea what I'm doing anymore"
r/ClaudeAI, Sacez, 2026-07-12, score 146 — https://www.reddit.com/r/ClaudeAI/comments/1uuf59z/
- Sacez (no IT background, R only): a tool grew to "125mb" and "tens of thousands of lines"; "hooks and
  harnesses and invariant matrix" he did not ask for; ChatGPT reviewing Claude's plans was his safety gate (b).
  For us: the same shape of owner; our gate is machine checks plus reviewer agents, not his reading.
- xLRGx: "pick one button in your app and have Claude walk you through exactly what happens when you click it"
  naming real files and functions; after five, the fear goes (b; Nosafune, AfternoonShot9285, Responsible_Camp_559
  similar: (a)). For us: his lesson practice, 10 minutes on a piece he saw in the headset, each line in plain
  words (docs/owner-decisions.md, Order): match.
- xLRGx: "They’re infinite suggestion engines." Write down what it does, declare it done, touch it when it breaks
  (mod-bot repeats it; jim_cryptos and workphone6969 agree) (a). For us: CLAUDE.md "ideas go at the end of the
  answer, not into code"; the board holds the order: match.
- xLRGx: "Two frontier models are not two opinions." Both bless a plan already written; the real gate is whether
  you can explain the change (b; PrimeFold's thread says the same: (a)). For us: see Most useful 4.
- jim_cryptos (electrician, built an app at night; promotes his free repo): "i had six blocking hooks at one
  point"; "ripped most of it out and the thing got EASIER to understand, not harder."; when a big refactor is pitched, ask
  why it is needed and what breaks without it (b, (a) with S22, S23). For us: his 11.10 review removed guards; "a ban
  only where a mistake cannot be undone or costs him time": match.
- WheelAdditional6888: stop adding features; list the main flows, where each stores data, outside services,
  what could break. "It’s continuing to approve changes when you no longer know what they affect." (b).
  South_Hat6094: "Ask Claude for a boring map of the app first"; Majestic_Tailor8036: "The gap is not having a map
  of what exists." (a). For us: ARCHITECTURE.md and docs/state.md exist in English; the architecture page for
  him waits on the board ("(Russian text: see the source) | (Russian text: see the source) docs/board.md:57): partly.
- JulienPierreMartin: "keep your understanding one step behind what you build, not zero steps."; commit small
  and often (b). For us: "commit and push often" (CLAUDE.md), Stop hook: match.
- RunFailRepeat: "know where the shutoff valve is (can you roll back if something breaks?)" and which files are
  load-bearing (b). For us: git per session, main changes only on his word (tools/hooks/pre-push): match.
- Boonune: "added instructions to my claude.md to teach me what you're doing as we go." (b). For us: lessons
  only when he wants one (his 11.10 decision): differs by his choice; settled.
- nrauhauser (computer-science background): "There's a data model. It doesn't change w/o I review." Same for
  the API; "I have done a LOT to stop LLM sprawl." (b). For us: the owner does not review code; the
  architecture-auditor checks drift after a large change: differs in who checks.
- Public_Umpire_1099: lint and typecheck rules that prevent huge files like a 306 KB app.jsx (b). For us:
  tests/structure.test.mjs fails any code file over 300 lines and any doc over 300: match.
- ianreboot: "tests, types, and version control matter more than syntax knowledge for keeping ai-generated code
  honest." (b). For us: match (npm test, git hooks).


Continued in [reddit-claude-code-2-b.md](reddit-claude-code-2-b.md).
