# Safety and settings, part 2: local facts and the proposed rules

Continues `C-safety-settings.md` (the reading of each page).

## Local facts that shape the proposal (checked read-only on this laptop, 2026-10-09)

* `tools/hooks` is the git hooks folder (`core.hooksPath`); `tools/claude-guard.mjs` is the Claude Code guard. Neither is a protected path, so in auto mode an edit there goes to the classifier, not to the owner.
* `~/.claude/settings.json` has keys `enabledPlugins, extraKnownMarketplaces, theme, agentPushNotifEnabled, autoMode` and NO `permissions` and NO `env`.
* Its `autoMode.environment` (23 entries) was drafted for ANOTHER project: it names "cosmogram-app" as the trusted repo and says "Repository visibility: ... assume private". This list applies to every project, objekt included, and says nothing about objekt being public or its Supabase data.
* Secret files present: `~/.elevenlabs-key.txt`, `~/.claude/.credentials.json` (Claude's own login), `~/.supabase/` (holds `telemetry.json`, `traces`; no access token seen). Not present: `~/.ssh`, `~/.git-credentials`.
* Remote: `https://github.com/exxxit-game/youaretheobject.git` (public, GitHub Pages).
* MCP tool names seen in this session: Supabase connector `mcp__607c535c-9305-44eb-b5c7-2dba084ec42a__<tool>` (tools: apply_migration, confirm_cost, create_branch, create_project, delete_branch, deploy_edge_function, execute_sql, generate_typescript_types, get_advisors, get_cost, get_edge_function, get_organization, get_project, get_project_url, get_publishable_keys, list_branches, list_edge_functions, list_extensions, list_migrations, list_organizations, list_projects, list_tables, merge_branch, pause_project, query_logs, rebase_branch, reset_branch, restore_project, search_docs); a second path, plugin server `plugin:supabase:supabase` (not authenticated now; by the naming of other plugin tools here, e.g. `mcp__plugin_playwright_playwright__browser_click`, its tools would be `mcp__plugin_supabase_supabase__<tool>` — inferred, verify with `/mcp`); GitHub connector `mcp__816a40f8-...__push_files / create_or_update_file / delete_file / merge_pull_request` (these write to GitHub WITHOUT passing the local pre-push hook; only the GitHub ruleset stops them on main); Desktop tools `mcp__ccd_session_mgmt__set_session_permission_mode` and `mcp__ccd_settings__set_setting` (could change the session's own mode/settings).
* No Python on PATH (`python`, `python3`, `py` all missing): the security-guidance and Claude Security plugins cannot run yet.

## Proposed permission rules (syntax from the docs; NOT applied — owner decides)

Why two files: deny/ask rules "apply in every session, trusted or not"; lists from all files "combine". The project file is public, so it holds only generic names (no connector UUID, no home paths). Home-folder secrets go in user settings, where `~/` paths are correct ("To write a rule in user settings that applies inside every project, use a `//` absolute path or a `~/` home-relative path"). Glob tool names in deny/ask are allowed ("Deny and ask rules also accept glob patterns in the tool-name position. The pattern must match the full tool name"), so `mcp__*__execute_sql` catches the tool under both the connector UUID and the plugin prefix. MCP rules must have no parentheses ("it skips any `mcp__` rule that has parentheses"). Every Bash rule gets a PowerShell twin, and bare `Bash` is never denied ("Denying Bash also turns off the PowerShell tool").

### A. Project `.claude/settings.json` (add a `permissions` block next to the existing `hooks`)

```json
{
  "permissions": {
    "deny": [
      "mcp__*__execute_sql",
      "mcp__*__apply_migration",
      "mcp__*__deploy_edge_function",
      "mcp__*__confirm_cost",
      "mcp__*__merge_branch",
      "mcp__*__rebase_branch",
      "mcp__*__reset_branch",
      "mcp__*__delete_branch",
      "mcp__*__create_project",
      "mcp__*__pause_project",
      "mcp__*__restore_project",
      "mcp__plugin_supabase_supabase",
      "Read(**/.env)",
      "Read(**/.env.*)"
    ],
    "ask": [
      "mcp__*__query_logs",
      "mcp__*__push_files",
      "mcp__*__create_or_update_file",
      "mcp__*__delete_file",
      "mcp__*__merge_pull_request",
      "mcp__ccd_session_mgmt__set_session_permission_mode",
      "mcp__ccd_settings__set_setting",
      "Bash(git push *main*)",
      "PowerShell(git push *main*)",
      "Bash(gh pr merge *)",
      "PowerShell(gh pr merge *)",
      "Bash(git config *hooksPath*)",
      "PowerShell(git config *hooksPath*)",
      "Bash(git -c *)",
      "PowerShell(git -c *)",
      "Edit(/tools/hooks/**)",
      "Edit(/tools/claude-guard.mjs)",
      "Edit(/.github/workflows/**)"
    ],
    "disableBypassPermissionsMode": "disable"
  }
}
```

Notes on A:
* Supabase: `execute_sql` is denied outright because even a SELECT brings player rows into the chat (which goes to Anthropic, through the MCP proxy, and into plaintext transcripts). Schema-only checks stay possible with `list_tables`, `list_migrations`, `get_advisors` (left allowed). `create_branch` is not named because the GitHub connector has a tool with the same name; a paid Supabase branch already needs `confirm_cost`, which is denied. `query_logs` is `ask` because API logs can hold player IP addresses.
* When step 4.2 truly needs a migration: move `mcp__*__apply_migration` from `deny` to `ask` for that one session and back afterwards (a deny can't be overridden by anyone: "Neither the classifier nor user intent can override it").
* Push: auto mode by default allows "Pushing to any branch ..., including the default branch", so the owner's word on main becomes a prompt. `*main*` is deliberately broad; a bare `git push` while on main does not name main and is still caught by the pre-push hook and the GitHub ruleset ("a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary"). Branch pushes stay prompt-free (he must push often because of power cuts).
* `git -c *` and `git config *hooksPath*`: changing `core.hooksPath` or passing `-c core.hooksPath=` would switch off the git hooks; `git -c` is rare in this project's flow (check: it would also prompt for any legitimate `git -c` use).
* The two `mcp__ccd_*` names come from this session's tool list, not from the docs; verify they match after adding.

### B. User `~/.claude/settings.json` (= `C:\Users\admin\.claude\settings.json`; merge into the existing file, keep its keys)

```json
{
  "permissions": {
    "deny": [
      "Read(~/.elevenlabs-key.txt)",
      "Read(~/.claude/.credentials.json)",
      "Read(~/.supabase/**)",
      "Read(~/.ssh/**)",
      "Read(~/.git-credentials)"
    ],
    "disableBypassPermissionsMode": "disable"
  },
  "env": {
    "DISABLE_FEEDBACK_COMMAND": "1",
    "CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY": "1",
    "DISABLE_ERROR_REPORTING": "1"
  },
  "feedbackDrafts": "off"
}
```

Notes on B: a Read deny "also blocks the Edit and Write tools on the same path" and recognized `cat`/`head`/`tail`; it does NOT stop a node script from reading the key ("arbitrary subprocesses"), which is what we want: the game's tools can still use the key, but the key never enters the chat.

### C. User `autoMode.environment` (second wall; prose, read by the classifier only from user/managed settings)

Append to the existing list (do not replace it; it holds the cosmogram-app entries):

```json
"**Trusted repo (objekt)**: youaretheobject, C:\\Users\\admin\\Documents\\GitHub\\objekt and its worktrees, remote https://github.com/exxxit-game/youaretheobject.git. Repository visibility: PUBLIC, served live by GitHub Pages from main; main changes only when the owner explicitly says so in his own message.",
"**Sensitive data locations & audiences (objekt)**: the objekt Supabase project (EU) holding anonymous player science data — no writes, migrations, deletes or reads of player rows into the conversation unless the owner names that exact action; the ElevenLabs key file ~/.elevenlabs-key.txt — never printed, copied, committed or sent anywhere except ElevenLabs by the project's own scripts; the owner's email address — never in commits, PR or issue text, or public files."
```

Then run `claude auto-mode config` to confirm, and optionally `claude auto-mode critique`.

### D. How to prove it works (rules 18/19: a guard must be seen red)

1. `/permissions` shows the new deny/ask rules; `claude doctor` reports no skipped rule.
2. In a new session, the denied Supabase tools are gone ("A bare tool name ... removes the tool from Claude's context"): searching for `execute_sql` in the deferred tool list finds nothing. No database call is needed to test.
3. Asking the assistant to `cat ~/.elevenlabs-key.txt` must be refused with "File is covered by a Read deny rule" (it refuses before reading, so nothing leaks).
4. A dry `git push --dry-run origin main` must raise a prompt.
5. A row in docs/mistakes.md / the guard prover could plant a settings file without these rules and expect a red check.

## Top 5 for us now

1. **Lock the live database by rule, not by words**: project deny rules for the Supabase write/SQL tools (`mcp__*__execute_sql`, `mcp__*__apply_migration`, ... and the duplicate plugin server). Docs: "Permission rules are enforced by Claude Code, not by the model"; a boundary said in chat "can be lost if context compaction removes the message".
2. **Keep secrets out of the chat**: user deny rules for `~/.elevenlabs-key.txt`, `~/.claude/.credentials.json`, `.env` files. Everything read goes to Anthropic ("all user prompts and model outputs") and stays in "plaintext under `~/.claude/projects/`"; auto mode by default even allows "Reading `.env` and sending credentials to their matching API".
3. **Make "main only on my word" a real prompt**: ask rules for pushes naming main (Bash + PowerShell), `gh pr merge`, GitHub connector write tools (they skip the local pre-push hook), hooks-path changes and edits to `tools/hooks/`, `tools/claude-guard.mjs`, `.github/workflows/` — auto mode otherwise allows "Pushing to any branch ..., including the default branch", and these files are not protected paths.
4. **Owner's own privacy switches** (2 minutes, by him): check "help improve Claude" at claude.ai/settings/data-privacy-controls (on = training and "5-year retention", off = "30-day retention"); set `DISABLE_FEEDBACK_COMMAND`, `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY`, `feedbackDrafts: "off"` and `disableBypassPermissionsMode` in user settings.
5. **Fix the auto-mode classifier's picture**: the user `autoMode.environment` describes cosmogram-app and assumes "private"; add the objekt entries (public repo, Supabase = sensitive data, key file, email) and verify with `claude auto-mode config`.

Not now: the sandbox ("On native Windows, Claude Code runs commands unsandboxed"; needs WSL2), ZDR and server-managed settings (Enterprise/Team only), telemetry kill-switches that also turn off feature flags (PowerShell tool default on Windows, `/auto-mode-setup`). Later: `/security-review` before each merge to main (built in, no Python), the Claude Security plugin for the step-4.2 threat model once Python is installed, `blockReadsOutsideWorkingDirectories` after adding the papers folder as an additional directory.

