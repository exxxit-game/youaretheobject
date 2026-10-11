# Shelf 1, part B: our Claude Code machinery against Anthropic's docs (11.10)

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): shelf 1, part B: our hooks and settings against the Claude Code docs of 11.10. Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only. Nothing in the repo changed, no hook run by hand.
Docs: the raw pages saved today in `scratchpad/ccdocs/` (hooks.md, hooks-guide.md, settings.md, permissions.md,
worktrees.md, desktop.md, plugins-overview.md, features-overview.md, plus sub-agents.md for one row).
Our files: repo `continuation-e2af23` (paths relative to it), the user's `C:\Users\admin\.claude\settings.json`
and `plugins\installed_plugins.json`. Installed Claude Code measured: `%APPDATA%\Claude\claude-code\` holds 2.1.293 and 2.1.295.

Status key: MATCH; DIFFER-needed (a reason in the owner's words); DIFFER-not-needed (no reason found);
UNVERIFIED (the doc page that settles it was not among the saved pages).

## 1. Table

### A. Hook events, input and output

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| A1 | hooks.md:937 "`PreToolUse` \| Yes \| Blocks the tool call"; hooks.md:1916 "A hook that blocks by exiting 2 routes the same way as `"deny"`: Claude sees the stderr message as the denial reason" | tools/claude-guard.mjs:37 (`stderr` + `exit(2)`), :362-371 | MATCH | | |
| A2 | hooks.md:991 "Choose one approach per hook: either use exit codes alone for signaling, or exit 0 and print JSON" | every mode uses exit codes and plain text only: claude-guard.mjs:37, :425, :491 | MATCH | | |
| A3 | hooks.md:294-295 matcher of letters, digits, `_ - , \|` is an exact list; any other character makes it a regex; hooks.md:365 "The `.*` is required" for an MCP server | .claude/settings.json:59 `Bash\|PowerShell`, :65 `mcp__.*`, :71 `Write\|Edit\|MultiEdit\|NotebookEdit`, :79 and :87 `practice-reviewer` | MATCH (MultiEdit is "the legacy `MultiEdit` tool", permissions.md:355; harmless) | | |
| A4 | hooks.md:426 "Defaults: 600 for `command`… lowers… to 30 on `UserPromptSubmit`" | explicit timeouts .claude/settings.json:46 (20), :53 (10), :61/:67/:73 (10), :81/:89 (60), :96 (180) | MATCH | | |
| A5 | hooks.md:874 "Claude Code cancels a `command`… hook that reaches its `timeout`, discarding the hook's output"; hooks.md:1184 "SessionStart runs on every session, so keep these hooks fast"; hooks.md:1198 "Claude's first response still waits for the hooks to finish" | start hook timeout 20 s (.claude/settings.json:46) while the start's own waits add up to 35 s and more: health 15 s (claude-guard.mjs:409), coderabbit 10 s (:417), `gh run list` 10 s (:421), plus git calls with no timeout (:42, :374) | DIFFER | not needed: no reason found; our own comment wants the opposite, "a hung check must not hold the session up" (claude-guard.mjs:406-407) | raise `timeout` at settings.json:46 to 45, or cut the inner waits so they sum under 20 s (for example 8 + 5 + 5) |
| A6 | hooks.md:786 "Non-blocking error: your hook exits with any other code, or fails… The action goes ahead"; hooks.md:878 "A timed-out `command`… hook doesn't block the tool call… don't count on a stalled hook to act as a gate"; hooks.md:883 "a policy hook with a wrong path or a crashing script lets everything through. To block the action instead, set `"onFailure": "block"`"; hooks.md:461 "Requires Claude Code v2.1.295 or later" | no `onFailure` on the three PreToolUse entries (.claude/settings.json:57-76). The guard imports five modules before any check (claude-guard.mjs:23-27) and runs git with no timeout (:42): a crash, a missing node or a 10 s stall lets `git commit -n`, a database write or Playwright through | DIFFER | not needed: the guards exist where "a mistake cannot be undone" (owner-decisions.md, The process: "a ban stands only where a mistake cannot be undone or costs him time"); failing open contradicts it | add `"onFailure": "block"` to the `Bash\|PowerShell` and `mcp__.*` entries (settings.json:61, :67); leave `Write\|Edit` on the default so a broken guard can still be mended by Edit; raise `MIN_VERSION` in tools/health-setup.mjs:84 from 2.1.294 to 2.1.295 |
| A7 | hooks.md:926-928 `onFailure` "has no effect on… `Stop`, `SubagentStop`… Claude can't repair a hook that won't run" | Stop and SubagentStop have no `onFailure` (settings.json:85-99) | MATCH | | |
| A8 | hooks.md:467 "Set `args` whenever the hook references a path placeholder"; hooks.md:618 "Prefer exec form for any hook that references a path placeholder. In shell form, wrap each placeholder in double quotes"; hooks-guide.md:1033 "Git Bash… still source your profile, and anything the profile prints reaches stdout" | shell form with the placeholder in double quotes: .claude/settings.json:46, :53, :61, :67, :73, :81, :89, :96 | DIFFER (allowed form, not the preferred one) | not needed: no reason found | `"command": "node", "args": ["${CLAUDE_PROJECT_DIR}/tools/claude-guard.mjs", "pre"]` (and the same for each mode); no Git Bash, no profile text in the start's context |
| A9 | hooks.md, SessionStart output: "A hook that only adds context can print it without building JSON, because Claude Code adds a SessionStart hook's plain-text stdout to Claude's context" | claude-guard.mjs:425 plain stdout, exit 0 | MATCH | | |
| A10 | hooks.md:1186-1194 matcher values `startup`, `resume`, `clear`, `compact`, `fork` | no matcher (settings.json:43-48): fires on all five; comment claude-guard.mjs:376 "at startup, resume and after every compaction" | MATCH | | |
| A11 | hooks.md:1182 "For static context that doesn't require a script, use CLAUDE.md instead" | the owner's decisions come through the CLAUDE.md import; the hook prints them only when the import is gone (claude-guard.mjs:393-400) | MATCH | | |
| A12 | hooks.md:996-1001 stdout "capped at 10,000 characters… Over the limit… a preview of up to the first 2,000 characters… Claude Code doesn't ask Claude to read the file" | tests/guard.test.mjs:266 and :273 (today and the worst day under 10,000); limits claude-guard.mjs:354 | MATCH | | |
| A13 | hooks.md:954 "`SessionStart` \| No \| Shows stderr to user only"; hooks.md:971 "Claude doesn't see it" | start always exits 0 and puts its warnings on stdout (claude-guard.mjs:391, :399, :405, :414) | MATCH | | |
| A14 | hooks.md:1426 "`UserPromptSubmit` hooks don't fire only on prompts you type" (scheduled tasks, background subagent reports, other sessions' messages) | tools/owner-links.mjs:9-13 drops notices and leading system reminders; used at claude-guard.mjs:463 | MATCH | | |
| A15 | hooks.md:1432 "a stuck hook stalls the session" | prompt hook 10 s (settings.json:53), never blocks, all in try/catch (claude-guard.mjs:456-466) | MATCH | | |
| A16 | hooks.md:2492 SubagentStart gets "`agent_id`… and `agent_type`"; hooks.md:2528 SubagentStop gets "`agent_id`, `agent_type`, `agent_transcript_path`, and `last_assistant_message`" | claude-guard.mjs:433-449 reads exactly these | MATCH | | |
| A17 | hooks.md:2486 SubagentStart "Runs when Claude spawns a subagent… when Claude resumes a subagent" | each start is appended; the stop takes the last start of that agent_id (claude-guard.mjs:439 `.pop()`), so a resumed reviewer is judged against the files at resume | MATCH | | |
| A18 | hooks.md:942 SubagentStop exit 2 "Prevents the subagent from stopping"; hooks.md:953 SubagentStart cannot block | both reviewer hooks always exit 0 (claude-guard.mjs:437, :450) | MATCH (we record, never block) | | |
| A19a | hooks.md:2681 "`stop_hook_active`… Check this value or process the transcript to avoid blocking on a condition that will never resolve"; hooks-guide.md:1011 "Your hook script needs to check whether it already triggered a continuation" | the stop hook never reads `stop_hook_active` (claude-guard.mjs:468-493); the tests send it (tests/guard.test.mjs:210, tools/prove-guards.mjs:132) but nothing reads it | DIFFER | needed for unsaved and unpushed work: CLAUDE.md, "Cannot be undone": "Work on a branch; commit and push often (power cuts)"; the leftover check "(the owner's yes, 11.10)" (claude-guard.mjs:486) | keep blocking for those |
| A19b | same doc | a problem Claude cannot fix in the turn still blocks: "could not list the processes… mend it" (tools/leftovers.mjs:68); a push refused while the network is down; a merge conflict with another window (claude-guard.mjs:480-484) | DIFFER | not needed: no reason found | when `stop_hook_active` is true, let these pass (exit 0) and keep blocking only on unsaved work; or make the process-list failure a non-blocking line |
| A20 | hooks.md:2683 "after stop hooks have continued the turn eight times in a row… The count of consecutive continuations resets each time Claude calls a tool"; hooks-guide.md:1011 "eight times in a row with no tool call from Claude in between" | claude-guard.mjs:3-4 and docs/testing.md:9 say "Claude Code ends it anyway after 8 blocks in a row" with no mention of the reset; here Claude calls git between blocks, so the cap may never come | DIFFER (our text incomplete) | not needed: no reason found | add "with no tool call between" in both places |
| A21 | hooks.md:2762 "Use `additionalContext` when the hook is working as designed and giving Claude guidance… the transcript labels it `Stop hook feedback` and no hook error notification is shown"; hooks.md:2753 exit 2 "routes the same way as `reason`" | stop blocks by exit 2 and stderr (claude-guard.mjs:491 via :37): every block shows as a hook error | DIFFER | not needed: no reason found | print `{"hookSpecificOutput":{"hookEventName":"Stop","additionalContext":"NOT DONE…"}}` and exit 0; the same loop protections apply (hooks.md:2762); update tests/guard.test.mjs:211 and the stop cases in tools/prove-guards.mjs:130-138, which read status 2 |
| A22 | hooks-guide.md:963 "`Stop` hooks fire whenever Claude finishes responding, not only at task completion" | blocks any turn end with unsaved or unpushed work, a plain answer included (claude-guard.mjs:468-492) | MATCH (intended) | | |
| A23 | worktrees.md:243 desktop worktree session: "Hook commands run in that root, and `${CLAUDE_PROJECT_DIR}` points at it. To reach the files Claude is working on, read the worktree's path from the hook's `cwd`"; hooks.md:612-613 | claude-guard.mjs:38-43 takes the checkout from `event.cwd` | MATCH | | |
| A24 | hooks.md:718 "Direct edits to hooks in settings files are normally picked up automatically by the file watcher" | docs/testing.md:9 "Hooks load when a session starts" | DIFFER (our doc is stale) | not needed: no reason found | replace with: edits to the main folder's `.claude/settings.json` are picked up by the file watcher; the script is read on every run |

### B. Permissions: rules and hooks

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| B1 | permissions.md:62 "Rules are evaluated in order: deny, then ask, then allow" | allow list only (.claude/settings.json:20-41) | MATCH | | |
| B2 | permissions.md:262 a Bash deny rule "isn't a security boundary around the program"; :272 "To inspect the full command text with your own logic before it runs, use a PreToolUse hook"; :298 "Bash permission patterns that try to constrain command arguments are fragile" | the argument bans are a hook that reads the command as the shell does (claude-guard.mjs:51-325) | MATCH | | |
| B3 | permissions.md:602 "A hook that exits with code 2 stops the tool call before permission rules are evaluated, so the block applies even when an allow rule would otherwise let the call proceed" | allow `git push origin claude/*` (settings.json:34-39); the guard still refuses `--no-verify` (claude-guard.mjs:178) | MATCH | | |
| B4 | hooks-guide.md:968 "`PreToolUse` hooks fire before any permission-mode check, in every permission mode" | the guards run under the auto mode set up in the user settings (~/.claude/settings.json:20-46) | MATCH | | |
| B5 | permissions.md:188 "A `*` at the end, with a space before it, also matches the bare command" | both forms listed: settings.json:22+23, :24+25, :26+27, :29+30 | DIFFER (redundant) | not needed: no reason found | drop the four bare lines 22, 24, 26, 29 |
| B6 | permissions.md:197 "Deny and ask rules also accept glob patterns in the tool-name position… A tool matched by a bare-name glob deny rule is removed from Claude's context" | tool-name-only bans written as regexes in the hook: browser tools, live-database writes, GitHub connector writes (claude-guard.mjs:331-335, :364-366) | DIFFER | not needed: the owner's rule ("The live database is read only", CLAUDE.md) is met either way; the GitHub connector is off by his decision (owner-decisions.md, Connectors) | `"deny": ["mcp__*__apply_migration", "mcp__*__deploy_edge_function", …, "mcp__plugin_playwright*", "mcp__plugin_chrome-devtools*"]`; keep `execute_sql` in the hook (it reads the query) |
| B7 | permissions.md:355 "Claude Code checks file permissions against `Edit(path)` and `Read(path)` rules only… Use `Edit(docs/**)` in place of `Write(docs/**)`"; the Warning after it: deny rules do not stop "a Python or Node script that opens files itself" | the record file is guarded for Write, Edit, NotebookEdit by the hook (claude-guard.mjs:368) and for shell writers by the hook (:305-312) | DIFFER | not needed: no reason found | an `Edit(//…/objekt-files/notes/practice-reviews.jsonl)` deny rule for the file tools (the exact Windows spelling of the absolute path is not shown in the saved pages: check it with `/permissions`); keep the shell part in the hook |

### C. Settings scopes and precedence

| # | Doc | What we do | Status |
|---|---|---|---|
| C1 | settings.md:626 "Claude Code uses the value from the highest level that sets it" (managed, command line, project local, shared project, user) | hooks, permissions and plugin-offs in the project file (.claude/settings.json:1-101); plugin-ons and auto mode in the user file (~/.claude/settings.json:2-46) | MATCH |
| C2 | settings.md:644 "When you set the same list key… Claude Code combines the lists" | `privacy-legal@synced: false` both in the project (settings.json:13) and the user file (:8): same value, harmless | MATCH |
| C3 | settings.md:447 "Commit `.claude/settings.json` so everyone who clones the repository gets the same permissions, hooks, and plugins" | committed | MATCH |
| C4 | worktrees.md:243 a desktop worktree session "reads project configuration such as settings, hooks… from the main checkout's root" | tools/health.mjs checks that the main folder's guard copies equal this checkout's (docs/testing.md:5) | MATCH |
| C5 | worktrees.md:236 an approval in a worktree goes to the main checkout's settings.local.json; "On Windows… the rule stays with that worktree" | the allow list is committed (settings.json:21-40), so it does not depend on approvals lost with a worktree | MATCH |

### D. Worktree settings

| # | Doc | What we do | Status |
|---|---|---|---|
| D1 | worktrees.md:152-153 `"fresh"` (default) branches from the remote default branch; `"head"`: "branch from your current local `HEAD`" | `"worktree": { "baseRef": "head" }` (settings.json:2): new windows start from room-polish, not from main (the live site); the stop hook keeps room-polish carrying the work (claude-guard.mjs:475-485) | MATCH |

### E. Plugins and MCP denial

| # | Doc | What we do | Status | Note |
|---|---|---|---|---|
| E1 | sub-agents.md:552 names "`allowedMcpServers` and `deniedMcpServers` policies" only under "Enterprise managed MCP configuration" (page managed-mcp, not saved) | `deniedMcpServers` in the project file (settings.json:15-19); tests/health.test.mjs:166 checks only that the entry exists | UNVERIFIED | this session's tool list has the hosted reference lookup and neither the local one nor a metavr MCP server, which agrees with the denial working; save managed-mcp.md to confirm project scope is honored |
| E2 | plugins-overview.md:61 "disable the plugin with `/plugin` or… `claude plugin disable`"; settings.md:754 names `enabledPlugins` as a project key | `enabledPlugins` false for `…@inline` / `…@synced` names (settings.json:3-14) | UNVERIFIED | the saved pages do not name the `inline` and `synced` marketplaces |
| E3 | hooks.md:4114 interactive sessions hold hooks back "until you accept the workspace trust dialog" | the owner's own folder, trusted | MATCH | |

### F. Preview server

| # | Doc | What we do | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| F1 | desktop.md:600-602 "`true`: Claude finds and uses a free port… `false`: Use this when your server must use a specific port… When Claude picks a different port, it passes the assigned port… via the `PORT` environment variable" | .claude/launch.json:8-9 port 3100 with `autoPort: true`; the server takes `PORT` (tests/static-server.mjs:47), but the headset tools take 3100 from launch.json (tools/headset.mjs:25-29) or hard-code it (tools/xr-room-run.mjs:34) | DIFFER | not needed: no reason found | `autoPort: false` (a clash fails loudly), or the headset tools ask the preview for its port |

## 2. What our hooks do that the docs advise against, and doc features that would replace our code

Against the docs:
- A PreToolUse gate that fails open (A6). hooks.md:878: "don't count on a stalled hook to act as a gate".
- A Stop hook that can block on conditions it cannot resolve and never reads `stop_hook_active` (A19b). hooks.md:2681.
- A Stop hook giving designed guidance through exit 2, which shows as a hook error (A21). hooks.md:2762.
- A SessionStart hook that can run longer than its own timeout (A5). hooks.md:1184: "keep these hooks fast".
- Nothing we do is impossible by the docs: we never try to block from SessionStart or SubagentStart (hooks.md:953-954), and the subagent hooks only record.

Doc features that would replace a part of our own code:
- `onFailure: "block"` (hooks.md:461, :883). It adds no code. It closes the fail-open gap in A6.
- Tool-name glob deny rules (permissions.md:197). They replace the three name-only regexes and checks (claude-guard.mjs:331-335, :364-366) and also remove those tools from Claude's context. `GITHUB_WRITES` guards a connector that is already off by the owner's decision.
- An `Edit(path)` deny rule (permissions.md:355). It replaces the file-tool branch for the review record (claude-guard.mjs:368).
- Exec form `args` (hooks.md:467). It replaces the quoting in eight command strings and avoids Git Bash.
- Stop `additionalContext` (hooks.md:2762). It replaces exit 2 for the stop hook's guidance.
- Stop input `background_tasks` (hooks.md:2681 and the table after it) lists this session's in-flight shell tasks with their commands. It could replace part of tools/leftovers.mjs (74 lines of process walking), but only for this session's own tasks. The saved pages do not say whether a finished helper's leftover command still shows there, so tools/leftovers.mjs stays until that is measured.

## 3. Risks the docs name that apply to us

1. **The start's output can be dropped whole.** A SessionStart past its 20 s timeout is cancelled "discarding the hook's output" (hooks.md:874). The board top, the health problems and the red-CI line would then never reach the session, and no error tells Claude. The inner waits add up to 35 s or more (A5).
2. **The guards fail open.** A crash, a missing node or a stall over 10 s is a "non-blocking error" and "the action goes ahead" (hooks.md:786, :878). This covers exactly the actions the owner calls irreversible (A6).
3. **The Stop hook can loop.** The 8-block cap "resets each time Claude calls a tool" (hooks.md:2683). Offline in a power cut, a refused push, or a failed process listing (leftovers.mjs:68) keeps the turn going for as long as Claude keeps trying tools. That costs his time and tokens (A19b, A20).
4. **Hook-error noise.** Every Stop block shows as a hook error notification (hooks.md:2762), not as "Stop hook feedback" (A21).
5. **Outside text enters context with hook authority.** The start pastes the outside reviewer's remark text (tools/coderabbit.mjs output, clipped to 350 characters at claude-guard.mjs:418) into Claude's context. hooks.md:4123 asks to "Validate and sanitize inputs: never trust input data blindly". The 350-character clip limits it; nothing marks the text as data.
6. **Size limit.** It is held by tests on today's board and on the worst day (tests/guard.test.mjs:266, :273). Low risk.
7. **Shell profile output.** Hooks run in shell form under Git Bash, which may source a profile (hooks-guide.md:1033). Our hooks print plain text, so a profile line would only add noise to the start's context (A8 removes it).
8. **Port mismatch.** With `autoPort: true` the preview may move off 3100 while the headset tools still use 3100 (F1).

## 4. Counts

- MATCH: 28 (A1-A4, A7, A9-A18, A22, A23, B1-B4, C1-C5, D1, E3)
- DIFFER-needed: 1 (A19a: blocking the turn on unsaved or unpushed work, by the owner's power-cut rule)
- DIFFER-not-needed: 11 (A5, A6, A8, A19b, A20, A21, A24, B5, B6, B7, F1)
- UNVERIFIED (page not saved): 2 (E1 `deniedMcpServers` at project scope, E2 the `@inline` / `@synced` plugin names)
