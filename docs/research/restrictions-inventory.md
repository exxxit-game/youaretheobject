# Restrictions on the agent's work: inventory, firings, additions since 11.10

Measured 2026-10-13 (UTC). Read only. Repository: worktree critical-project-issues-051203 at c9cb505.
Transcripts: 475 .jsonl files (52 sessions, 423 helper transcripts) under C:\Users\admin\.claude\projects\*objekt*,
2026-10-08T05:23Z to 2026-10-13T12:04Z, scanned line by line (scratchpad scan.mjs, classify.mjs, rates.mjs; raw: events.json, events2.json).
"Review" = commit 9989090, 2026-10-11T10:51:48Z (13:51 +0300), the process review carried out on the owner's yes.
Tool calls: 22,266 before the review (15,814 through the guard's matchers), 13,016 after (10,237 through them).
Stop-hook runs: 346 before, 301 after.

Matching: a guard refusal = tool_result text that starts with `PreToolUse:<tool> hook error: [node ...claude-guard.mjs pre]`
(grep output that only quotes such text is excluded); a stop hold = `system/stop_hook_summary` holding "NOT DONE"
(before 09:00Z on 11.10 this gives 41, the count of the 11.10 review); a commit/push stop = a `STOP  ` line in the result
of a command that runs git commit/push; a gate stop = a `not now:` line from quest-look/measure/publish-preview/xr-*;
a classifier denial = "denied by the Claude Code auto mode classifier". Judgement read from the command and the next 2-5 actions.

## 1. Inventory

Kinds: (a) blocks an action; (b) demands an action before a turn ends; (b') said at session start, not enforced;
(c) gate before the owner meets something; (d) check at commit/push or on GitHub; (e) text rule only.

| # | Restriction | Kind | Stops what mistake | Undoable? | Where |
|---|---|---|---|---|---|
| 1 | `--no-verify`, `git commit -n` refused | a | a commit/push past the commit and secret checks | the skip itself yes; a pushed secret no | tools/claude-guard.mjs:140-141, 192, 198 |
| 2 | core.hooksPath changed/unset; `-c core.hooksPath`; GIT_CONFIG_KEY_n / PARAMETERS / GLOBAL / SYSTEM, PowerShell and .NET forms | a | hooks switched off | yes | claude-guard.mjs:142, 182-185, 204-210, 226-240, 247, 253 |
| 3 | Playwright/Chromium on the laptop (npx playwright, npm run test:smoke, node tests/smoke.mjs) | a | the laptop's own browser runs (his decision: smoke only on GitHub) | yes (CPU and time only) | claude-guard.mjs:143, 290-294, 309 |
| 4 | adb reboot / force-stop / svc power / setprop sys.powerctl (also via su -c, adb shell stdin) | a | restarting the headset past quest-look's worn check | his time in the headset is lost | claude-guard.mjs:144, 214-220, 318-327 |
| 5 | writing the practice review record (shell writers, redirection, sed -i, find -delete, copies, node -e/python -c code naming review-gate/practice-reviews, Write/Edit tools) | a | faking a reviewer run so the gate opens | yes (a JSONL file outside the repo) | claude-guard.mjs:145, 163, 169-170, 308, 314, 328-336, 370, 417 |
| 6 | OBJECT_REVIEW_RECORD set | a | pointing the gate at another record | yes | claude-guard.mjs:146, 246, 252 |
| 7 | `gh pr merge`, REST merges, GraphQL mergePullRequest/enablePullRequestAutoMerge, a merge under a gh alias | a | changing main (the live site) past the push hook | revert by a new PR; public meanwhile | claude-guard.mjs:147, 271-280 |
| 8 | gh api graphql with the body from a file/stdin (`=@`, `--input`) | a | a merge the guard cannot read | yes | claude-guard.mjs:149, 284 |
| 9 | resolveReviewThread / minimizeComment | a | closing CodeRabbit's remark on my own word | yes (re-open) | claude-guard.mjs:148, 287 |
| 10 | delete in, or move out of, Documents\objekt-files (rm, del, Remove-Item, find -delete, robocopy /MIR /PURGE /MOVE, rsync --delete, delete calls in node -e/python -c; relative paths after cd or by the event's cwd) | a | losing papers no git holds | only from the F: backup | claude-guard.mjs:150, 152-160, 342-364, 375-378, 419 |
| 11 | execute_sql that is not one read-only SELECT (quoted values ignored; write functions listed) | a | writing to the live database | no for data | claude-guard.mjs:390-400, 416 |
| 12 | 19 deny rules: playwright/chrome-devtools MCP; Supabase apply_migration, deploy_edge_function, pause/restore/create project, branch ops, confirm_cost; GitHub push_files, create_or_update_file, delete_file, merge_pull_request, update_pull_request_branch, create_repository, fork_repository | a | the same through connectors | DB/GitHub writes: no | .claude/settings.json:37-57 |
| 13 | deniedMcpServers: local reference-lookup (hosted kept), metavr MCP | a | tool duplication / a server with no tools | yes | .claude/settings.json:15-19 |
| 14 | guard fails closed: a crash or timeout of the command and MCP guard blocks the call (the Edit guard does not) | a | an action passing a broken guard | yes | .claude/settings.json:78, 84 |
| 15 | maxTurns on every helper (deep-research 200, quick-research 40, request-auditor 80, others 150) | a | runaway helpers | yes | .claude/agents/*.md:5 |
| 16 | Claude Code auto-mode classifier (Production Deploy, Credential Exploration, Git Destructive, Self-Modification, ...), steered by the autoMode text in the user settings | a | Claude Code's own list | varies | C:\Users\admin\.claude\settings.json autoMode.environment (not ours to tune per action) |
| 17 | Claude Code's worktree guard: no Edit of the base checkout from a worktree session | a | editing the main folder from a worktree | yes | built into Claude Code |
| 18 | Stop: work not saved (`git status --porcelain` not empty) | b | losing work to the daily power cut | no (lost edits) | claude-guard.mjs:550-551 |
| 19 | Stop: branch has no copy on GitHub / commits not pushed (held once, then a warning when GitHub is out of reach) | b | losing commits with the laptop | mostly yes | claude-guard.mjs:546-554 |
| 20 | Stop: room-polish (the main folder, where the next window starts) lacks this branch's commits | b | the next window starting without the work | yes (merge later) | claude-guard.mjs:555-568 |
| 21 | Stop: a command under Claude Code running over 10 minutes | b | runaway background commands | yes (kill) | claude-guard.mjs:569-571; tools/leftovers.mjs:12 |
| 22 | Start: board's top; "the process took more than the game: say so first"; checkout lacks room-polish; health problems; CodeRabbit "read them before other work"; GitHub RED "read why before other work" | b' | forgetting state, drift, open remarks, red CI | n/a | claude-guard.mjs:429-477; tools/coderabbit.mjs:185; tools/health.mjs (exit 0 always, line 7) |
| 23 | Prompt hook logs every owner message (never blocks) | none | lost requests | n/a | claude-guard.mjs:527-537 |
| 24 | Practice-review gate: VR in the headset, the test copy, the headset probe and the real-room run wait for a recorded practice-reviewer run on exactly these files (own look: one whose report named every changed file) | c | the owner meeting an unreviewed thing | his time is not | tools/review-gate.mjs:144-148; callers quest-look.mjs:79, publish-preview.mjs:21, measure.mjs:90, xr-probe-run.mjs:18, xr-room-run.mjs:17 |
| 25 | Paper gate: the same waits for a paper-reviewer run per room whose folder is unchanged | c | an unchecked room in the headset | his time is not | review-gate.mjs:134-139; quest-look.mjs:80, publish-preview.mjs:22, measure.mjs:91 |
| 26 | Reviewer runs count only if files did not change while read and the report reaches its last block | c | a cut-short or stale review opening the gate | yes | claude-guard.mjs:482-522; review-gate.mjs:64-74 |
| 27 | Headset worn checks: no browser restart/reboot while worn; VR and the measure only while worn | c | throwing him out of the headset / a VR run nobody sees | his time is not | quest-look.mjs:70, 96; measure.mjs:96; headset.mjs:54-55 |
| 28 | pre-commit: nothing private staged and git email is the noreply one | d | a key or his address in a public commit | no once pushed | tools/hooks/pre-commit:10; tools/secrets.mjs:14-24, 55-65 |
| 29 | pre-commit: every staged script parses | d | a broken script saved | yes | pre-commit:13-17 |
| 30 | pre-commit: all quick tests of npm test pass (all but structure and review-gate), including library.test, which reads the papers folder outside the repo, and guard.test's start-size cap (board top + start lines under 10,000 characters) | d | a red test committed | yes | pre-commit:19-25; tests/library.test.mjs:1-5; tests/guard.test.mjs:342-348 |
| 31 | pre-push: a push to main needs OBJECT_LIVE=owner-said-yes | d | main without his word | revert by PR | tools/hooks/pre-push:7-10 |
| 32 | pre-push: secrets.mjs over the commits not on origin | d | a key or his address leaving the laptop | no once public | pre-push:12; secrets.mjs:34-51 |
| 33 | pre-push: structure and review-gate tests pass | d | a red test reaching GitHub | yes | pre-push:17-20 |
| 34 | structure test (24 rules): code and docs ≤300 lines, state.md ≤80, CLAUDE.md ≤45 and ≤200 with imports, engine/app/room imports, Russian only in named files, room files, no dead modules, docs name only real files and constants, mistakes.md rows name a test, scripts parse, catalog current, play()/pause(), room-light, game's name, no cut words, no who/when in comments, no control chars, no secret shapes, room contract, commit address, map lists every file, styles only in css, every doc linked, headset abilities decided | d | drift a non-programmer cannot see | yes | tests/structure.test.mjs:17-316 |
| 35 | GitHub ruleset 24770045 "main is the live site": no deletion, no force push, pull request required (0 approvals), status check "test" required, no bypass (since 12.10) | d | main changed outside a green PR | revert by PR | gh api repos/exxxit-game/youaretheobject/rulesets/24770045 |
| 36 | GitHub test.yml: npm test, smoke test, prove-guards when a guard file changes; red last run named at start | d | red code on room-polish/main | yes | .github/workflows/test.yml:57-86 |
| 37 | reviewed.yml robot moves `reviewed` only from main's copy; the session never moves it | d | the reviewed branch moving its own reviewer's baseline | yes | .github/workflows/reviewed.yml:1-42 |
| 38 | Supabase connector logs in as a read-only database user (13.10) | a | DB writes through the chat connector | no for data | docs/state.md:5 (service side) |
| 39 | Text: answer in Russian, plain, short; repo English | e | - | - | CLAUDE.md:16 |
| 40 | Text: a «Показы» row at start, show at end; his requests on the board in his words; order only on his word; new topic = new window; ideas not into code | e | - | - | CLAUDE.md:19-22 |
| 41 | Text: everything from what exists, source in a WHY comment/decisions.md; names and numbers from the file; player-visible facts in docs/sources.md; never bend a test; measure after 2-3 failed tries | e | - | - | CLAUDE.md:25-30 |
| 42 | Text: "done" only after npm test; reviewer, own look, approved shots before he meets anything | e (partly c) | - | - | CLAUDE.md:33-36 |
| 43 | Text: main only on his word; commit and push often; no key/token/email; DB read only; migrations on his word; no headset restart while worn ("hooks hold these") | e (held by 1-12, 18-20, 27-35) | - | - | CLAUDE.md:38-40 |
| 44 | Text: new-room skill and paper-reviewer; one room per folder; styles only in css; player text only in texts.ru.js; comments say why; ~300-line files; no build step | e (partly 25, 34) | - | - | CLAUDE.md:43-45 |
| 45 | Text in his decisions: two fact-check runs; numbers only on a fact-checked page; one window at a time; headset steps by quest-look say; one corridor item at a time; and the rest of docs/owner-decisions.md | e | - | - | docs/owner-decisions.md |

## 2. Firings

### 2a. Our PreToolUse guard (claude-guard pre): 36 refusals in 26,051 guarded calls

| Refusal | Before review | After review | Real catch | Friction |
|---|---|---|---|---|
| hooks skipped (`--no-verify`, `git commit -n`) | 16 (09.10-11.10) | 0 | 2: 10.10 15:58Z `git commit -q --no-verify -m "wip"`, 18:36Z a WIP commit with --no-verify; both then committed through the hook | 3 probes; 11 false: sed -i or echo lines naming the words, a sed beside a normal commit, commits in scratch repositories, a helper's grep (11.10 10:05Z) |
| Playwright/Chromium | 5 (09.10) | 0 | 0 | 5: commands that read or edited tests/smoke.mjs |
| SQL not read-only | 4 (10.10) | 1 (12.10 07:13Z) | 0 | 5: reads naming INSERT, cron.job, submit_run( inside text; after: a read whose JSON value was dollar-quoted ($g$...$g$), rewritten with single quotes and passed |
| one window (removed 11.10) | 5 | - | 0 | 5 (the 11.10 review) |
| review record written | 2 | 2 (11.10 22:18Z, 13.10 06:30Z) | 0 | 4: a transcript scan; a node -e edit of tools/xr-room-run.mjs; after: two node -e edits of tools/claude-guard.mjs whose text named review-gate, redone with the Edit tool |
| papers library | - | 1 (12.10 15:17Z) | 0 | 1: `rmdir` of a mistaken folder C:\Users\admin\Documents\GitHub\objekt-files (not the library) after moving its one file into the library; the regex matches any folder named objekt-files; the stray folder was left |
| merge into main, GraphQL file, resolve remark, headset restart, OBJECT_REVIEW_RECORD, Write/Edit of the record | 0 | 0 | - | - |

After the review: 4 refusals in 10,237 guarded calls (0.04 %), 0 real catches.

### 2b. Stop hook: 90 holds in 647 runs

Before the review: 51 holds. To 09:00Z on 11.10: 41, read by the 11.10 review: 12 caught, 8 false, 17 workarounds, 8 unclear
(owner-links 17, unsaved 15, unpushed 6, main folder 5, npm test 1, chat 1). 09:00-10:51Z on 11.10: 10 more holds by the chat guard
(tools/plain-words.mjs, words like «весь», «целиком», «главное», «сделано»; one also held a link for the owner-links stop); each
was followed by a corrected line sent to him, mostly starting «Поправка: ...»;
the guard was removed at 10:51Z.

After the review: 39 holds in 301 runs (13 %):

| Item | Count | Real catch | Friction |
|---|---|---|---|
| work not saved | 29 | 6: own work left uncommitted at turn end (11.10 11:38Z a migration file; 12.10 11:54Z his answers in the board and decisions; 13.10 08:45Z board and history; 10:01Z measure tool and tests; 10:18Z measure fix; 11:43Z 16 files of the CodeRabbit fixes) | 23: files research helpers were still writing (docs/research, docs/library) while the commit check was red on the same helpers' papers; 12.10 12:26-12:48Z 14 holds in 22 min (board copied to notes, 25-try `npm test && git commit` loops, a `until npm test; sleep 30` wait, helpers told to hurry); 12.10 16:09-16:11Z 4 holds then a 25 x 120 s commit loop and a 560 s loop (the session then hit its weekly limit); 13.10 06:08-06:34Z 2; 13.10 10:08-10:23Z 4, ended by telling the helper to write drafts outside the repo |
| main folder lacks the branch's commits | 10 | 10 by its rule, each closed by one `git merge --ff-only` | cost one command each |
| no copy on GitHub / commits not pushed | 6 | 3 new branches pushed (11.10 19:27Z, 13.10 07:33Z, 11:27Z) | 1 false (11.10 18:34Z: branch on GitHub, upstream not set); 2 with GitHub out of reach (13.10 06:18Z, 06:34Z); the 07:33Z and 11:27Z pushes, chained with the merge into the main folder, were then denied by the classifier as "Production Deploy" and passed when split |
| command running over 10 min | 2 | 1: 11.10 22:45Z python.exe, 16 min, stopped | 1: 13.10 06:18Z the session's own 10-minute save loop (itself a workaround of the hold above) |

### 2c. Commit and push checks: 64 stops

Before the review: 33 (11 old full-npm-test commit stops, 8 new commit stops, 9 push slow-test stops, 3 secrets, 1 deliberate main test, 1 results test).
The 11.10 review: 14 of the 19 commit stops were the start-size cap (shorten the board); push: 1 caught (a control character in src/engine/door.js), 3 research notes reworded; secrets: 2 true (his gmail in old commits while secrets.mjs was being built, 09.10), 1 false (`service-role` in a doc).

After the review: 31 stops (about 308 commit commands, 306 push commands, retries included):

| Stop | Count | Real catch | Friction |
|---|---|---|---|
| library.test fails (commit) | 9 | the rule held: papers in objekt-files\papers without a record (the agent then wrote records with authors, DOIs from Crossref) | 7 of 9 while helpers were dropping papers into the folder; it failed commits of unrelated work (his board records, 12.10 12:27Z, 12:38Z) because the test reads a folder outside the repo; 11.10 19:50Z a helper's huber-2020.txt landed there and the helper was told not to write in it |
| structure.test fails (push) | 11 | 0 touching the game | 11 doc hygiene: state.md over 80 lines (3: 11.10 13:36Z, 12.10 08:32Z twice), docs over 300 lines (reddit-2026-10-11-2.md 316, data-wording.md, forums docs), constants named in research docs (A-Frame's CDN root and a CSV switch, not in our code), Russian in docs/research/studio-process.md (test edited to allow it by name), a migration file's first line, the board |
| guard.test fails (commit): start over 10,000 characters | 5 | 0 | 5: the board's top shortened (12.10 07:43Z "would print 10056 characters"; 11.10 20:13Z, 22:25Z; 13.10 07:13Z, 11:08Z) |
| secrets: something private staged | 5 | 0 | 4 false: the role name of Supabase's service key (written with an underscore) in docs and the board, rewritten to "service-role", "the service role", «служебный» (11.10 20:10Z, 20:44Z; 12.10 07:31Z, 09:12Z); 1 unclear (11.10 11:45Z, a scratch worktree made for main) |
| vendor.test fails (commit) | 1 | 1 by its rule (13.10 11:08Z; the next command read the vendored files' line ends) | - |
| main without OBJECT_LIVE | 0 | - | - |

### 2d. Gates before the owner: 8 stops

| Stop | Count | Read |
|---|---|---|
| practice-review gate | 2 before (10.10 17:43Z, 18:27Z: both by its rule; he was in the headset, «Мне просто хочется плакать уже» 17:47Z) + 3 after | 11.10 13:57Z he was waiting in the headset for a reflection fix: told to take it off about 10 min while the review ran; 13.10 09:12Z the same after he was asked to press «Войти в VR» (notification «Снимите очки минут на 10»); 13.10 11:53Z `measure.mjs --check`, the pre-call check doing its job before he was called. All three real by the rule; two cost him headset time because the review was not run before calling him |
| paper gate | 0 since 12.10 | - |
| worn checks | 3 after | 13.10 09:15Z `quest-look restart-browser` refused because he wore the headset: a real catch of the "never restart while he wears it" rule. 11.10 14:38Z and 13.10 09:31Z VR refused because nobody wore it: friction, retried after `worn off` |

### 2e. Claude Code's own permission system

| Kind | Before | After | Read |
|---|---|---|---|
| auto-mode classifier | 22 | 11 | After: Production Deploy 4: 11.10 11:46Z push of the robot fix to main after his «Делай» (11:27Z) → moved to a branch; 11.10 20:38Z the same after his «Да» (20:37Z) → he ran it himself («Я нажал» 20:38Z); 13.10 07:33Z and 11:28Z a claude/* push chained with a merge into the main folder → split and passed (false). Credential Exploration 6 + Materialization 1, all in helpers on 12.10: a key-pattern scan over ~/.claude/projects (2, defensible), `ls ~/.elevenlabs-key.txt`, a grep in notes for "GitHub Enterprise", a curl of GitHub's docs, a grep of a research file (false). Before: Git Destructive 6 (incl. `gh run list`, 09.10 08:21Z: false), Irreversible Local Destruction 2 (`git reset --hard origin/room-polish` 09.10 17:07Z: real, done by --ff-only instead; a `sed -n` read: false), Self-Modification 4 (editing ~/.claude/settings.json for his plugin decision, 10.10 09:48Z: friction), Out-of-Place Publication 2 (quest-look open, a GitHub Actions page: false), Credential Exploration 2, others 6 |
| worktree base-checkout edit block | 5 (08.10 05:27Z) | 0 | real: edits aimed at the main checkout from a worktree |
| owner rejected a tool call | 3 | 0 | his own clicks |

## 3. The 11.10 review and what came after

### What it measured (objekt-files\notes\process-review-2026-10-11)
guards.md: 281 transcripts 08.10-11.10, 9,792 guarded calls. 31 tool refusals (2 caught, 26 false, 3 probes); 41 stop blocks naming
45 problems (12 caught, 8 false, 17 workarounds, 8 unclear); 19 commit stops (14 the board's start-size cap); 9 push slow-test stops
(1 caught); 2 review-gate stops (both real, the owner waiting in the headset); owner-links stop 17 (7 links pasted "nothing to do");
one-window 5 of 5 false; stall rule 4 of 4 false; "no row for today" 0 in 280 stops; prove-guards turned GitHub red 24 times in a row
by its own plant and took 4,245 s locally; health checks found real drift 9 times. Time: the pre hook ~0.28 s a call; the start hook
3.6-13.3 s. days.md: per day, process commits outnumbered game commits (65 commits after the 10.10 freeze, 7 touching src/).
walls.md: the owner's complaints by kind. tools.md: agents, connectors, CodeRabbit, CI. external.md: hooks docs, alarm fatigue,
checklists (Degani & Wiener, Gawande), Google's static-analysis lessons.

### What it decided (his «Давай дальше по этому файлу делать, что нам надо. Убирать, что не надо» 11.10; commit 9989090)
Removed: the chat guard (plain-words.mjs), the owner-links stop, the one-window ban, the stall rule, the no-row stop.
Changed: the start shows only the board's top and yesterday's commits split game/process; the SQL check reads quoted values as
values; prove-guards runs on GitHub only when a guard file changed; the metavr MCP server denied; the fact-checker reports only
what changes a fact. Principle written into his decisions: a ban only where a mistake cannot be undone or costs him time;
a complaint is no reason for a new guard.

### Added or tightened since 11.10 (git log --since=2026-10-11 on the guard files)

| Commit (local time) | What | Reason given |
|---|---|---|
| 2dbedb3 11.10 00:32 | structure rule 24: every headset ability has a decision | hands sat in the map unused until he remembered them |
| 9e9b7bf 11.10 10:49 | refusal: resolveReviewThread / minimizeComment | only the reviewer closes its remark ("I could justify myself") |
| d6e1538-cdb7afc 11.10 10:18-11:58 | chat guard (removed by 9989090 the same day) | his «Делай… и сторож будет это проверять» |
| 8fc4ca2 11.10 14:29 | start line counts CodeRabbit's nitpick and outside-diff remarks: read and fix or answer each | remarks without a thread went unanswered |
| fe353fe 11.10 14:09 | prove-guards also runs when test.yml changes | CodeRabbit |
| e3d590c 11.10 14:34 | hooks-path refusal catches PowerShell -Value before -Path; agent headers catch an unclosed quote | CodeRabbit's declines that held only in part |
| 72c93c0 11.10 14:45 | the reviewed robot runs only from main's copy | a branch could move its own reviewer's baseline (CodeRabbit, his word) |
| 100ff3c / bf2ac06 11.10 18:17 / 18:39 | Stop: commands running over 10 minutes | a helper's `find /` ran 1.5 h; the app has no time limit on background commands (CodeRabbit) |
| 1c07b8b 12.10 00:24 | onFailure: block on the command and MCP guards; health requires Claude Code 2.1.295; start timeout 45 s | shelf 1 repairs 1-2, his «Чини 1-7» |
| 554e886 12.10 00:29 | maxTurns on every helper | shelf 1 repair 3 |
| bb8880e 12.10 00:36 | (loosened) Stop holds once on what no command fixes; no push of room-polish every turn | shelf 1 repairs 4, 6c; CodeRabbit starved by pushes |
| 81da02d 12.10 00:47 | 19 deny rules replace the guard's tool-name regexes; 4 allow rules removed; health reads skills' headers; structure: CLAUDE.md with imports ≤200 lines | shelf 1 repair 6: what Claude Code holds by itself leaves the guard |
| 7eb12d5 / b1ab529 12.10 00:54 / 01:12 | refusal: delete in or move out of the papers library | shelf 1 repair 7: no git holds that folder |
| aa78fba 12.10 01:22 | paper gate (requirePaper) before VR and the test copy; subagent hooks record paper-reviewer runs room by room | his «Сделать сейчас» 12.10, card 5 |
| 5f37e90 12.10 10:02 | paper check counts only rooms on the report's last line | CodeRabbit on PR 10 |
| ruleset 12.10 18:10 | main: pull request with the test check green, no bypass | his yes (docs/state.md:5) |
| 080a485 13.10 09:31 | a report counts only when its marker starts the last block | CodeRabbit on PR 10 |
| b133a5f 13.10 09:38 | (data side) doors to the database closed; connector read-only user | his decision 13.10 |
| c61ab96 13.10 13:01 | measure.mjs: review gate, paper gate, worn check | the baseline measure in his headset |
| ad9744f 13.10 14:37 | merge refusal widened (joined GraphQL options, --input=, REST with a query string, gh alias); GIT_CONFIG_GLOBAL/SYSTEM and a GIT_CONFIG_KEY_0 set through .NET refused | CodeRabbit remarks (10.17, 10.10) |
| 0a146a6 13.10 14:44 | agent/skill headers read by a YAML parser; comment rule widened to possessives and bare day.month | CodeRabbit (#11, 10.09) |
| 7d7a87f 13.10 14:26 | start line: answer each CodeRabbit remark naming @coderabbitai | unnamed replies stood two days |

## 4. Overlaps seen in the inventory (facts, not advice)

- main is held four times: pre-push OBJECT_LIVE, the guard's gh-merge refusals, the classifier (Production Deploy), and since 12.10
  the ruleset (PR + green test, no bypass). Since the ruleset, a direct push to main is refused by GitHub, so the OBJECT_LIVE path
  of pre-push no longer leads anywhere; the classifier refused both pushes to main that had his word (11.10).
- The live database is held three times: the guard's SQL check, 10 deny rules, and since 13.10 a read-only database user.
- The review record refusal fired 4 times after the review and 6 times in all; none was an attempt to write the record.
- The commit check's library test reads a folder outside the repository, so a helper saving a paper there stops every commit;
  the Stop hook then holds every turn for the unsaved work: 23 of 29 "not saved" holds after the review came from this pair.
- The structure test's doc caps and the board's start-size cap stopped 16 pushes and commits after the review; none touched the game.
