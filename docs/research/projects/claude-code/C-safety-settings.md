# C. Claude Code safety, permissions, sandbox, data use, settings — research for "You are the object"

Read-only research of the official docs at https://code.claude.com/docs/en/ (fetched 2026-10-09).
Every row quotes a few words from the page. Value: NOW / LATER / NO.
Project facts checked locally (read only): `git config core.hooksPath` = `tools/hooks`; `.claude/settings.json`
has only `hooks` (PreToolUse on `Bash|PowerShell` -> `tools/claude-guard.mjs pre`; Stop -> `... stop`), no `permissions` block.
In this desktop session the Supabase tools appear as `mcp__607c535c-9305-44eb-b5c7-2dba084ec42a__<tool>`
(a claude.ai connector, UUID server name), and a second Supabase source exists as plugin server `plugin:supabase:supabase`
(not authenticated now).

## 1. permissions.md — https://code.claude.com/docs/en/permissions

| Feature | What it does | Use it? | Value | Why (data protection / owner's pains) | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| allow / ask / deny rules | Rules evaluated "in order: deny, then ask, then allow"; "An allow rule can't carve an exception out of a deny rule" | no (none yet) | NOW | The only hard, non-model guard: "Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or CLAUDE.md shape what Claude tries to do, but they don't change what Claude Code allows." CLAUDE.md rules alone are not a lock. | `permissions` block in `.claude/settings.json` (project, shared via git) or `~/.claude/settings.json` (user); or `/permissions` dialog. Assistant can draft; owner approves (writes to `.claude/` are a protected path) | permissions#manage-permissions |
| Bare-tool deny removes the tool | "A bare tool name like `Bash` removes the tool from Claude's context entirely, so Claude never sees it" | no | NOW | Deny a whole MCP write tool by its exact name, so the assistant cannot even see it | deny list | permissions#manage-permissions |
| MCP rule naming | "`mcp__puppeteer` matches any tool provided by the `puppeteer` server"; "`mcp__puppeteer__puppeteer_navigate` matches the `puppeteer_navigate` tool"; "Tools from connectors Claude Code fetches itself appear as `mcp__claude_ai_<server>__<tool>`" | no | NOW | This is how to lock the Supabase write tools (execute_sql, apply_migration, deploy_edge_function, ...) | deny list with exact tool names (copy the name the session shows) | permissions#mcp |
| Tool-name globs in deny/ask | "`\"mcp__*\"` matches every MCP tool across all servers"; deny/ask accept globs in tool-name position | no | NOW | Lets one rule catch every Supabase write tool whatever the server prefix, e.g. `mcp__*__execute_sql` (the docs say "The pattern must match the full tool name") | deny/ask list | permissions#tool-name-wildcards |
| No parameters on MCP rules in settings | "When Claude Code loads a settings file, it skips any `mcp__` rule that has parentheses" | — | NOW (pitfall) | Cannot write `mcp__x__execute_sql(query:...)` to allow only SELECT; must deny the whole tool or gate it with a hook | — | permissions#match-by-input-parameter |
| Read/Edit deny for secret files | "To block Claude's file tools from reading a file or directory, add a `Read` deny rule ... such as `Read(./.env)`"; "A `Read` deny rule also blocks the Edit and Write tools on the same path" | no | NOW | Blocks reading `~/.elevenlabs-key.txt`, `.env*`, ssh keys. `.claudeignore` "has no effect" | deny list; paths in gitignore syntax: `//abs`, `~/home`, `/settings-relative`, `./relative` | permissions#read-and-edit |
| Windows path form | "On Windows, paths are normalized to POSIX form before matching. `C:\Users\alice` becomes `/c/Users/alice`"; "To match across all drives, use `//**/.env`" | — | NOW | The owner is on Windows 10: absolute rules must be `//c/Users/admin/...` or `~/...` | — | permissions#read-and-edit |
| Limit of Read deny | "They don't apply to ... arbitrary subprocesses that read or write files indirectly, like a Python or Node script"; "For OS-level enforcement ... enable the sandbox" | — | NOW (pitfall) | A `node -e "fs.readFileSync(...)"` still reads the key. Deny rules are a strong first wall, not the last | — | permissions#read-and-edit |
| Bash rule limits | `Bash(git push *)` stops `git push origin main` but not "`git -C . push origin main`" ... "isn't a security boundary around the program" | partly (PreToolUse hook exists) | NOW | A push deny/ask rule must be backed by the existing pre-push git hook and the GitHub ruleset (both already in place) | — | permissions#bash-rule-limits |
| PowerShell rules | "PowerShell permission rules use the same shape as Bash rules"; aliases canonicalized | no | NOW | The session has a PowerShell tool too; every Bash rule needs a PowerShell twin | deny/ask list | permissions#powershell |
| Hooks vs rules | "PreToolUse hook decisions don't bypass permission rules"; "A hook that exits with code 2 stops the tool call before permission rules are evaluated" | yes (claude-guard.mjs) | NOW | The existing hook can be extended to read the SQL text of a Supabase call and refuse anything but SELECT, which rules cannot do | `.claude/settings.json` hooks; matcher can name the MCP tool | permissions#extend-permissions-with-hooks |
| Settings precedence for rules | "If a tool is denied at any level, no other level can allow it"; "a user-level deny blocks a project-level allow" | — | NOW | Deny rules can live in both project (public repo, visible) and user settings (private, covers every project) | — | permissions#settings-precedence |
| Workspace trust for project allow | "`deny` and `ask` rules aren't affected, since they only restrict" | — | NOW | Project deny rules apply at once, no trust step | — | permissions#project-allow-rules-and-workspace-trust |
| `blockReadsOutsideWorkingDirectories` | "make the file tools refuse the paths it fences in every permission mode" | no | NOW | Stops reading the key file in the home folder through Read/Grep/Glob and recognized `cat` etc. without listing every file | `permissions.blockReadsOutsideWorkingDirectories: true` in user settings, or answer "No, and block reads outside..." at the first prompt in auto mode | permissions#working-directories; permission-modes#first-read-outside-the-working-directories |
| `disableBypassPermissionsMode` | "A user can set it in their own settings to lock themselves out of bypass mode" | no | NOW | Prevents anyone (or a click by mistake) from switching to "skip all checks" | `"permissions": {"disableBypassPermissionsMode": "disable"}` in user settings | permissions#managed-settings |
| Managed settings | admin-deployed settings "that user and project settings can't override" | no | LATER | Only one person; user settings are enough. Would matter if a team joins | admin | permissions#managed-settings |
| Sandbox + rules together | "Use both for defense-in-depth, since sandbox restrictions still apply even if a prompt injection bypasses Claude's decision-making" | no | LATER (see sandboxing) | — | — | permissions#how-permissions-interact-with-sandboxing |

## 2. permission-modes.md — https://code.claude.com/docs/en/permission-modes

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Auto mode (current) | "a second model, the classifier, reviews actions instead of you" | yes | NOW (keep, add rules) | Comfortable for a non-programmer, but: "Auto mode reduces permission prompts but does not guarantee safety ... not as a replacement for review on sensitive operations" | Desktop mode selector; remembered per folder | permission-modes#eliminate-prompts-with-auto-mode |
| Deny rules hold in every mode | "Deny rules block in every mode, including `bypassPermissions`" | — | NOW | Rules are the only lock that does not depend on the classifier's judgement | — | permission-modes#available-modes |
| Ask rules still prompt in auto | "Explicit ask rules still force a prompt"; "Actions no mode auto-approves: Tools matched by an explicit ask rule" | no | NOW | Turn "push", Supabase reads of real rows, writes to git hooks into a human checkpoint even in auto mode | `permissions.ask` | permission-modes#actions-no-mode-auto-approves |
| Auto mode ALLOWS push to main by default | "Allowed by default: ... Pushing to any branch of the repository you're working in, including the default branch" | — | NOW (gap) | Conflicts with "main changes only on the owner's word"; today only the pre-push hook and GitHub ruleset stop it. An `ask` rule adds a third wall | `permissions.ask: ["Bash(git push *)", ...]` — docs: "To require a human checkpoint before these commands while staying in auto mode, add `permissions.ask` rules" | permission-modes#what-the-classifier-blocks-by-default |
| Classifier blocks by default (relevant ones) | "Production deploys and migrations"; "Printing a live credential or token into the transcript or a file"; "Pushing secrets or personal or entrusted data to a repository known to be public"; "Including sensitive details ... live API response data such as emails" | yes (implicit) | NOW (know it) | Good second wall for Supabase migrations and leaking keys/emails into the public repo — but judgement, not a rule | on by default in auto mode; `claude auto-mode defaults` prints the list | permission-modes#what-the-classifier-blocks-by-default |
| Classifier allows reading .env | "Allowed by default: ... Reading `.env` and sending credentials to their matching API" | — | NOW (gap) | The classifier will let the assistant read the ElevenLabs key file to call ElevenLabs. Only a Read deny rule stops that | `Read(...)` deny | same |
| Conversation boundaries are not stored | "Boundaries are not stored as rules ... a boundary can be lost if context compaction removes the message ... For a hard guarantee, add a deny rule instead" | — | NOW | Exactly the owner's pain (requests vanish after compaction): "never touch the live database" said in chat is not a lock | deny rules | permission-modes#boundaries-you-state-in-conversation |
| Broad allow rules dropped in auto | "On entering auto mode, broad allow rules that grant arbitrary code execution are dropped" | — | info | — | — | permission-modes#how-the-classifier-evaluates-actions |
| Protected paths | Writes to `.git`, `.claude` (except worktrees, memory .md), `.husky`, `.vscode`, `.mcp.json`, `.gitconfig`... are "never auto-approved"; in `auto` "Routed to the classifier" | yes (automatic) | NOW (know the gap) | `.claude/settings.json` is protected, but the project's git hooks live in `tools/hooks/` and the guard in `tools/claude-guard.mjs`, which are NOT protected paths -> add `ask` Edit rules for them | — | permission-modes#protected-paths |
| Desktop: default mode | "The desktop app reads the same settings files as the CLI"; "A mode you pick in the mode selector is remembered per folder and takes precedence over `defaultMode`" | — | info | — | — | permission-modes (Desktop tab) |
| `defaultMode: "auto"` location | "`auto` doesn't take effect from those files [.claude/settings.json / settings.local.json]. Move it to `~/.claude/settings.json`" | — | info | — | user settings | permission-modes#eliminate-prompts-with-auto-mode |
| dontAsk mode | "auto-denies every tool call that would otherwise prompt" | no | NO | Made for CI; would stall the owner's work | — | permission-modes#allow-only-pre-approved-tools-with-dontask-mode |
| bypassPermissions | "offers no protection against prompt injection" | no | NO (lock it out) | — | `disableBypassPermissionsMode` | permission-modes#skip-all-checks-with-bypasspermissions-mode |
| Desktop denies critical-path rm | "in ... the Desktop app ... it denies the command immediately" (rm of critical path in auto) | yes (automatic) | info | — | — | permission-modes#critical-paths |

## 3. auto-mode-config.md — https://code.claude.com/docs/en/auto-mode-config

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Human checkpoint with `permissions.ask` | "Content-scoped ask rules ... always force a permission prompt, even in auto mode"; recipe `"Bash(git push *)", "Bash(gh pr create *)"` | no | NOW | The owner's word before anything reaches GitHub; matches his "main only on my word" rule | `permissions.ask` in settings | auto-mode-config#add-a-human-checkpoint |
| Firmness table | `permissions.deny`: "Neither the classifier nor user intent can override it"; chat boundary: "can be lost if context compaction removes the message" | — | NOW | Decides what must be a deny rule (Supabase writes, key file) vs ask (push) | — | auto-mode-config#add-a-human-checkpoint |
| `autoMode.environment` | Prose entries telling the classifier what is trusted and what is sensitive, incl. "Sensitive data locations & audiences: the buckets, databases, or paths that hold personal data" and "Repository visibility" | no | NOW | Tell the classifier: repo is PUBLIC; the Supabase project = sensitive data location; ElevenLabs key file = secret. Keep `"$defaults"` | `~/.claude/settings.json` only: "The classifier doesn't read `autoMode` from project settings in `.claude/settings.json` or .claude/settings.local.json" — owner (or assistant with his yes) edits user settings | auto-mode-config#define-trusted-infrastructure |
| `autoMode.hard_deny` / `soft_deny` | prose rules; "`hard_deny` rules block unconditionally. User intent and `allow` exceptions don't apply" | no | NOW (small) | e.g. "Never write to, migrate or delete anything in the Supabase project" as a second wall behind the deny rule. Danger: "Setting any of ... without `"$defaults"` replaces the entire default list" | user settings | auto-mode-config#override-the-block-and-allow-rules |
| `autoMode.classifyAllShell` | "suspend every Bash and PowerShell allow rule while auto mode is active, so the classifier evaluates every shell command" | no | LATER | Only matters once allow rules exist (none now) | user settings | auto-mode-config#route-all-shell-commands-through-the-classifier |
| `claude auto-mode defaults / config / critique` | print built-in rules, effective config, AI critique of custom rules | no | NOW (check step) | After adding entries, `claude auto-mode config` proves they took effect (rules 18/19: verify, not trust) | CLI | auto-mode-config#inspect-the-defaults-and-your-effective-config |
| `/auto-mode-setup` | drafts environment entries; scan reads "This project's CLAUDE.md, README.md, config files, and git remotes" and optionally shell history | no | LATER | Optional; hand-written entries avoid scanning shell history | `/auto-mode-setup` | auto-mode-config#generate-environment-entries |
| Recently denied tab / `PermissionDenied` hook | review what the classifier blocked | no | LATER | A log of what the assistant tried to do with the database | `/permissions` | auto-mode-config#review-denials |
| Classifier reads CLAUDE.md | "an instruction like "never force push" in your project's CLAUDE.md steers both Claude and the classifier" | partly | NOW | A one-line data rule in CLAUDE.md helps both, but is not a lock | CLAUDE.md | auto-mode-config#where-the-classifier-reads-configuration |

## 4. sandboxing.md — https://code.claude.com/docs/en/sandboxing

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Bash/PowerShell sandbox (OS-level file + network fence) | limits files and hosts shell commands can reach | no | NO now / LATER only via WSL2 | "The sandbox runs on macOS, Linux, and WSL2. On native Windows, Claude Code runs commands unsandboxed." The owner runs the desktop app on native Windows 10 | `/sandbox` or `"sandbox": {"enabled": true}`; needs WSL2 | sandboxing (intro) |
| What it would not cover anyway | "Claude's file tools, MCP servers, and hooks run outside it"; "A `denyRead` entry doesn't stop the Read tool" | — | info | Even with a sandbox the Supabase MCP tools are outside it, so permission deny rules are the right lock for the database | — | sandboxing#what-runs-outside-the-sandbox |
| Default read reach | Reads: "Most of the machine, including credential files such as `~/.ssh`" unless `denyRead` | — | info | — | — | sandboxing#what-the-sandbox-restricts |
| Credentials deny / mask | `credentials` entries with `"mode": "deny"` unset env vars and deny file reads; `mask` substitutes a sentinel | no | LATER (WSL2 only) | Would protect the ElevenLabs key from scripts too | sandbox settings | sandboxing#protect-credentials |
| `failIfUnavailable` | "if the sandbox can't start ... Claude Code runs commands without sandboxing" unless set | — | NO now | — | — | sandboxing#get-started |
| `dangerouslyDisableSandbox` ask rule | "add an ask rule for `Bash(dangerouslyDisableSandbox:true)`" | — | LATER | only with a sandbox | — | sandboxing#the-unsandboxed-retry-escape-hatch |

## 5. data-usage.md — https://code.claude.com/docs/en/data-usage

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Training choice (consumer plans) | "We will train new models using data from Free, Pro, and Max accounts when this setting is on (including when you use Claude Code from these accounts)" | unknown (owner must check) | NOW | Owner worries who sees data. If the model-improvement setting is on, code, prompts and whatever enters the chat (e.g. Supabase rows) may be used for training | Owner, at claude.ai/settings/data-privacy-controls ("Privacy settings can be changed at any time") | data-usage#data-training-policy |
| Retention (consumer) | "allow data use for model improvement: 5-year retention"; "don't allow ...: 30-day retention period" | — | NOW | Turning training off also cuts retention to 30 days | same setting | data-usage#data-retention |
| Commercial terms | "Anthropic does not train generative models using code or prompts sent to Claude Code under commercial terms"; standard "30-day retention period" | no | LATER | Team/API plans; ZDR only "for Claude Code on Claude for Enterprise" | plan change | data-usage#data-training-policy |
| Local transcripts in plaintext | "Claude Code clients store session transcripts locally in plaintext under `~/.claude/projects/`"; Desktop/Cowork transcripts are "exempt from that limit by default" | yes (automatic) | NOW | Anything the assistant ever read (a key, a row, his email) sits in plain files on the laptop, with no expiry for Desktop sessions. Never let a key be printed into chat | `cleanupPeriodDays`; see claude-directory page | data-usage#data-retention |
| `/feedback`, `/bug`, `/share` | "a copy of your conversation history including code is sent to Anthropic"; "retained for 5 years"; "Optionally, a GitHub issue is created in the public repository" | no | NOW (switch off) | One click could upload a transcript holding data. "To opt out, set the `DISABLE_FEEDBACK_COMMAND` environment variable to `1`" | `env` block in `~/.claude/settings.json` | data-usage#telemetry-services |
| Survey transcript share | "Yes: uploads your conversation transcript ... Source code, file contents ... are uploaded as-is. Shared transcripts are retained for up to 6 months" | no | NOW (switch off) | Same leak path. "To disable these surveys, set `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1`" | env | data-usage#session-quality-surveys |
| Metrics | "Metrics never include your code, prompts, or file paths. Set `DISABLE_TELEMETRY=1` to opt out" | — | optional | Low risk; also turns off feature-flag fetching (side effects) | env | data-usage#telemetry-services |
| Error reports | "redacts known patterns of secrets, file paths, email addresses ... Set `DISABLE_ERROR_REPORTING=1`" | — | optional | Low risk, cheap to turn off | env | data-usage#telemetry-services |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | "disable all non-essential traffic at once"; also "disables feature-flag evaluation, which can make Remote Control unavailable" | no | LATER (test first) | One switch for all of the above but with side effects; prefer the two narrow switches first | env | data-usage#telemetry-services |
| WebFetch domain check | "sends the requested hostname to `api.anthropic.com`"; "Only the hostname is sent" | yes | info | No data risk | — | data-usage#webfetch-domain-safety-check |
| What leaves the machine | "This data includes all user prompts and model outputs, encrypted in transit via TLS 1.2+" | — | NOW (key fact) | Everything the assistant reads into the conversation (files, query results) goes to Anthropic. The real protection: rows, keys and his email are never read into the chat | — | data-usage#local-claude-code-data-flow-and-dependencies |

## 6. security.md — https://code.claude.com/docs/en/security

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| MCP trust is on the user | Anthropic "does not security-audit or manage any MCP server"; "claude.ai connectors are configured outside the repository, and plugins can add servers too, so reviewing `.mcp.json` doesn't show every server a session can load" | — | NOW | The Supabase connector came from claude.ai, plus a Supabase plugin server: both must be covered by deny rules, and it is worth listing every MCP server the session loads (`/mcp`) | — | security#mcp-security |
| Working directory boundary is only a prompt | "a Bash command you approve can still write anywhere your user account can" | — | info | Why deny rules + git hooks matter on Windows without a sandbox | — | security#built-in-protections |
| Credential storage on Windows | "on Windows in a file that inherits the access controls of your user profile directory" | yes (automatic) | info | Claude's own login token sits in the user profile; same exposure class as the ElevenLabs key file | — | security#additional-safeguards |
| Windows WebDAV warning | "we recommend against enabling WebDAV or allowing Claude Code to access paths such as `\\*`"; WebDAV "may allow Claude Code to trigger network requests to remote hosts, bypassing the permission system" | unknown | NOW (one check) | A Windows-specific bypass path; the owner can confirm the WebClient service is off | Windows service settings, by the owner | security#additional-safeguards |
| Privacy settings link | "Consumer users can change their privacy settings at any time" (claude.ai/settings/privacy) | — | NOW | Same as data-usage training switch | owner | security#privacy-safeguards |
| `ConfigChange` hooks | "Audit or block settings changes during sessions with ConfigChange hooks" | no | LATER | Would alert if anything rewrites the deny rules mid-session; protected-path routing already covers `.claude/` in auto mode | hooks | security#team-security |
| "Regularly audit your permission settings with `/permissions`" | best practice | no | NOW (habit) | fits the morning check | `/permissions` | security#working-with-sensitive-code |
| Cloud session push restrictions | "GitHub decides which branches a session can update by applying your repository's branch protection rules and rulesets" | — | LATER | If cloud sessions are ever used, the existing main ruleset keeps working | — | security#cloud-execution-security |

## 7. security-guidance.md — https://code.claude.com/docs/en/security-guidance

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Security guidance plugin | "makes Claude review its own code changes for common vulnerabilities while it works"; per-edit patterns (e.g. `.innerHTML =`, `document.write`, `eval(`), end-of-turn diff review, commit/push review | no | LATER (blocked by Python) | Useful for the Supabase client code (injection, keys in code). But "Python 3.7 or later on your PATH" is required and the laptop had no `python`/`python3`/`py` on PATH (checked 9.10; Python 3.14.8 is on PATH since, `python --version` 15.10; whether the plugin runs on it: not checked). "None of the layers block writes or commits" | Desktop: "+" -> Plugins -> Add plugin; or `"enabledPlugins": {"security-guidance@claude-plugins-official": true}` in `.claude/settings.json` | security-guidance#install-the-plugin |
| Custom patterns file | .claude/security-patterns.json with `substrings` like a key prefix; "JSON works on any Python install" | no | LATER | Could flag a Supabase service-role key or ElevenLabs key prefix pasted into code; the pre-push secret scan already covers this at push time | project file | security-guidance#add-custom-per-edit-patterns |
| Cost | "end-of-turn and commit reviews each spend additional model usage" | — | info | — | — | security-guidance#usage-cost |

## 8. claude-security.md — https://code.claude.com/docs/en/claude-security

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Claude Security plugin (`/claude-security`) | "multi-agent vulnerability scan of your codebase"; builds a threat model; findings "independently" verified; patches "never applied automatically" | no | LATER (step 4.2 data protection) | The owner asked for threat models and a break-in try on a copy; this is a ready tool for the code side (RLS-calling client code, key handling). Needs Python 3.9 (missing on 9.10; 3.14.8 on PATH on 15.10, the plugin on it not checked) and "may use a significant number of tokens" | install from official marketplace; `/claude-security` -> Scan codebase | claude-security#scan-and-fix-your-codebase |
| Output stays local, git-ignored | results in `CLAUDE-SECURITY-<timestamp>/` "carries its own `.gitignore`, so a stray `git add` never sweeps a report into a commit" | — | LATER | Matters: the repo is public; a vulnerability report must not be pushed | — | claude-security#read-the-scan-results |
| Scope | "the review reads the source code in your checkout, not a running site or deployed service" | — | info | It will not test the live Supabase RLS policies; a separate check of the database (Supabase advisors) is still needed | — | security-guidance#how-this-fits-with-other-security-tools |
| `/security-review` | "run an on-demand security pass over the changes on your current branch" | no | NOW (cheap) | Built-in, no Python; run before asking the owner to merge to main | type `/security-review` | security#related-resources |
| Managed Claude Security product | Enterprise only | no | NO | plan | — | claude-security (intro) |

## 9. sandbox-environments.md — https://code.claude.com/docs/en/sandbox-environments

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Choice table for Windows | "Work on a native Windows host: A container or VM, or run the Bash sandbox inside WSL2" | no | LATER | No cheap option on native Windows; all need WSL2/Docker/VM, a big change for a non-programmer on a laptop that must stay free | owner decision | sandbox-environments#choose-an-approach |
| Isolation does not change what is sent | "Isolation also does not change what is sent to the model. Your prompts and the files Claude reads are transmitted to the Anthropic API" | — | NOW (key fact) | A sandbox would not answer the owner's "who sees the data" worry; only keeping data out of the chat does | — | sandbox-environments#compare-sandboxing-approaches |
| Sandbox runtime (`npx @anthropic-ai/sandbox-runtime claude`) | wraps "The whole Claude Code process, including file tools, MCP servers, and hooks"; "beta research preview" | no | NO | Linux/macOS/WSL2 only; beta; does not fit the desktop app | — | sandbox-environments#sandbox-runtime |
| Auto mode is not isolation | "The classifier is a per-action control, not an isolation boundary" | — | info | Supports adding hard deny rules | — | sandbox-environments#how-isolation-relates-to-permission-modes |
| Cloud sessions | "isolated, Anthropic-managed virtual machine"; network proxy allowlist | no | LATER | Could run risky experiments away from the laptop; but data then also lives on Anthropic servers (data-usage) | — | sandbox-environments#cloud-sessions |

## 10. zero-data-retention.md — https://code.claude.com/docs/en/zero-data-retention

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| ZDR | "prompts and model responses ... not stored by Anthropic after the response is returned, except where needed to comply with law or combat misuse" | no | NO | "available to qualified accounts on Claude for Enterprise"; "cannot be enabled from your admin settings". A one-person project on a consumer plan cannot get it | Anthropic account team | zero-data-retention (intro) |
| MCP data never covered | "Data processed by third-party tools, MCP servers, or other external integrations is not covered by ZDR" | — | NOW (key fact) | Whatever the Supabase MCP returns is the Supabase/connector side's business too; another reason to keep real rows out of the chat | — | zero-data-retention#what-zdr-does-not-cover |
| Policy-violation retention | "may retain the associated inputs and outputs for up to 2 years" | — | info | — | — | zero-data-retention#data-retention-for-policy-violations |

## 11. settings.md — https://code.claude.com/docs/en/settings

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Desktop reads the same files | "the desktop app, which all read the same settings files" | yes | NOW | Rules written in settings work in the owner's Desktop app | — | settings (intro note) |
| Scopes & order | "1. Managed ... 2. Command line ... 3. Project local settings (.claude/settings.local.json) ... 4. Shared project settings (`.claude/settings.json`) ... 5. User settings (`~/.claude/settings.json`)" | yes | NOW | Decide where each rule lives (see proposal) | — | settings#settings-precedence |
| Lists merge | "When you set the same list key, such as `permissions.allow`, in more than one file, Claude Code combines the lists instead of picking one" | — | NOW | Deny rules in user + project both apply | — | settings#lists-merge-instead-of-overriding |
| Windows home path | "On Windows, `~/.claude` means `%USERPROFILE%\.claude`" | — | NOW | = `C:\Users\admin\.claude\settings.json` | — | settings#find-or-create-your-settings-files |
| Local file location on Windows | the local file "stays with `.claude/settings.json` instead: outside a git repository ... on Windows" | — | NOW (pitfall) | On this laptop, "Yes, and don't ask again" approvals land in each worktree's own .claude/settings.local.json, not the main checkout's; a rule meant for all worktrees belongs in project or user settings | — | settings#where-claude-code-keeps-the-local-file-in-a-git-repository |
| Restrictive keys win from any scope | `disableClaudeAiConnectors` "`true` from any scope"; `permissions.blockReadsOutsideWorkingDirectories` "`true` from any scope" | no | NOW / option | `disableClaudeAiConnectors: true` would remove ALL claude.ai connectors from Claude Code (incl. the Supabase connector) — the bluntest lock if per-tool denies are not trusted; but also removes Notion, GitHub, etc. connectors | settings key | settings#exceptions-to-managed-settings-precedence |
| Verify what loaded | "Run `/status` ... `Setting sources` line"; "To list entries Claude Code rejected, run `claude doctor`" | no | NOW (check step) | Proves deny rules loaded and none were skipped (e.g. an `mcp__` rule with parentheses) | `/status`, `claude doctor` | settings#confirm-what-loaded |
| `/config` not in Desktop | "`/config` is part of the terminal interface. The VS Code chat panel and the desktop app don't open it" | — | info | In Desktop, rules are added by editing settings files (assistant drafts, owner approves) | — | settings#use-the-config-menu |

## 12. settings-reference.md — https://code.claude.com/docs/en/settings-reference (420k chars; read in parts at offsets 0, 100000, 200000)

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| `permissions.deny` ("Exclude sensitive files") | "Use it for files that hold API keys, secrets, or environment values: Claude Code excludes matching files from file discovery and search results, denies reads of them, and blocks the Edit and Write tools on the matching paths" | no | NOW | Exactly the ElevenLabs key file and any `.env` | any settings file | settings-reference#exclude-sensitive-files |
| `permissions.ask` | "prompt you for confirmation even in a permission mode that would otherwise approve them, such as `acceptEdits` or `bypassPermissions`" | no | NOW | push / Supabase reads | any file | settings-reference#permissions-ask |
| `permissions.allow` MCP glob limit | "In an MCP rule, `*` can appear only in the tool name after the `mcp__<server>__` prefix ... it can't appear in the server name" (allow rules) | — | info | Globs over server names work only in deny/ask (permissions page) | — | settings-reference#permissions-allow |
| `permissions.blockReadsOutsideWorkingDirectories` | "Make Claude's file tools refuse reads outside your working directories in every permission mode"; "A `true` in any file applies, so a repository can turn the block on for itself but can't lift yours" | no | NOW (with care) | Blocks the key in the home folder and all of `~` in one switch. Side effect: the project's papers folder `C:\Users\admin\Documents\objekt-papers\` and the memory folder are outside the worktree -> add them with `permissions.additionalDirectories` first | `permissions.blockReadsOutsideWorkingDirectories: true` (+ `additionalDirectories`) | settings-reference#permissions-blockreadsoutsideworkingdirectories |
| `permissions.disableBypassPermissionsMode` | "Prevent anyone from entering `bypassPermissions` mode ... ignores an agent definition's `permissionMode: bypassPermissions`" | no | NOW | also stops a subagent file from switching itself to bypass | any file; best in user settings | settings-reference#permissions-disablebypasspermissionsmode |
| `permissions.defaultMode` | "`auto` and `bypassPermissions` don't take effect from project or local settings" | — | info | — | user settings | settings-reference#permissions-defaultmode |
| `autoMode` scope | "Scope: User or managed" | no | NOW | environment entries go to `~/.claude/settings.json` | user | settings-reference#automode |
| `env` | "Set environment variables for every session and for the subprocesses Claude Code starts from it" | no | NOW | Where the feedback/survey opt-outs go | any file; user settings for personal privacy switches | settings-reference#env |
| `disableAllHooks` | "Turn off hooks ..." | no | NO (danger) | Would switch off the project's own guard hooks; worth a deny/ask on edits that add it | — | settings-reference#disableallhooks |
| `sandbox.filesystem.denyRead` | for sandboxed commands only | no | LATER | needs sandbox (WSL2) | — | settings-reference#sandbox-filesystem-denyread |

## 13. settings-example.md — https://code.claude.com/docs/en/settings-example

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Team file pattern | `"ask": ["Bash(git push *)"]`, `"deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]` | no | NOW | Ready template for the project file | `.claude/settings.json` | settings-example#a-teams-shared-settings |
| Trust note | "deny and ask rules apply in every session, trusted or not" | — | NOW | Project deny rules work at once | — | same |
| Known gap stated | "`Read(./.env)` on its own stops the file tools and commands that name the file, such as `cat .env`, but not `grep -r` run over the directory; the `sandbox` block in this file closes that gap" | — | NOW (pitfall) | Without a sandbox on Windows, keep secrets OUT of the repo folder entirely (already so: the key is in the home folder) | — | same |
| `cleanupPeriodDays` example | "Delete session transcripts and other local session data older than 20 days" | no | NOW (owner's choice) | Shortens how long plaintext transcripts (which may hold anything read) stay on the laptop; trade-off with resuming old sessions | user settings | settings-example#your-own-settings |

## 14. env-vars.md — https://code.claude.com/docs/en/env-vars (read in two parts)

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| `DISABLE_FEEDBACK_COMMAND=1` | "disable the `/feedback` command and Claude-drafted feedback. Also disables `/bug` and `/share`" | no | NOW | Removes a one-click path that uploads a transcript (5-year retention) | `env` in `~/.claude/settings.json` | env-vars#variables |
| `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1` | "disable the "How is Claude doing?" session quality surveys" | no | NOW | Removes the "share transcript?" follow-up | same | env-vars#variables |
| `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` | "removes credentials from the environments of the subprocesses it starts, such as Bash commands, hooks, and stdio MCP servers" | no | LATER (cheap) | The ElevenLabs key lives in a file, not an env var, so little gain now; useful if a key ever goes into the environment. Leaves `GITHUB_TOKEN` in place | env | env-vars#what-the-subprocess-environment-scrub-removes |
| `DISABLE_TELEMETRY` / `DO_NOT_TRACK` | "Telemetry events don't include user data like code, file paths, or Bash commands. Also disables feature-flag fetching" | no | NO now | Side effects on Windows: with fetching off you can't "Get the PowerShell tool by default ... on Windows with Git Bash installed", nor run `/auto-mode-setup`, nor read artifact comments. Low privacy gain | env | env-vars#features-that-need-feature-flag-fetching |
| `DISABLE_ERROR_REPORTING` | opt out of error reporting; "Setting it to `0` or `false` still opts out" | no | optional | small gain, no listed side effects | env | env-vars#variables |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | disables auto-updates, telemetry, error reporting, `/feedback`, release notes ... "Also disables feature-flag fetching" | no | NO now | Also stops auto-updates (security fixes) | env | env-vars#variables |
| `CLAUDE_CODE_MCP_ALLOWLIST_ENV=1` | "spawn stdio MCP servers with only a safe baseline environment plus the server's configured `env`" | no | LATER | Only for local stdio MCP servers; Supabase here is a remote connector | env | env-vars#variables |
| env in settings | "Claude Code reads them directly from the file, so they take effect no matter how `claude` was launched"; "Paths aren't expanded" | — | info | Desktop app picks them up from settings | — | env-vars |

## 15. settings-reference.md, part at offset 300000 (MCP and data keys)

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| `cleanupPeriodDays` | "how many days Claude Code keeps session transcripts and other application data"; "Default: `30`"; "Setting `0` fails validation"; "To stop Claude Code from writing transcripts at all, see Plaintext storage" | no | NOW (owner's choice) | Shorter = less plaintext history on the laptop; but data-usage says Desktop transcripts are "exempt from that limit by default", so check the claude-directory page before relying on it for Desktop | user settings | settings-reference#cleanupperioddays |
| `disableClaudeAiConnectors` | turns off "the claude.ai MCP connectors Claude Code fetches itself" | no | LATER / option | Blunt kill switch for all claude.ai connectors. Caveat: in the Desktop app the connectors appear with UUID server names, which suggests the app registers them; the page says app-registered "In-process `type: \"sdk\"` servers are exempt" from `deniedMcpServers` — so whether this switch or `deniedMcpServers` reaches Desktop connectors is NOT verified. Tool-name deny rules are the dependable lock | any file | settings-reference#disableclaudeaiconnectors, #deniedmcpservers |
| `deniedMcpServers` | "Block specific MCP servers ... including plugin servers ... and the claude.ai connectors it fetches itself"; `serverName` may be "a claude.ai connector's display name such as `\"claude.ai Slack\"`" | no | LATER (test) | Could block the duplicate Supabase plugin server by name; same Desktop caveat as above | any file | settings-reference#deniedmcpservers |
| `feedbackDrafts: "off"` | "Claude Code removes the SendFeedback tool, so Claude can't queue drafts"; scope "User or managed" | no | NOW | Closes the assistant-initiated feedback path | `~/.claude/settings.json` | settings-reference#feedbackdrafts |
| `feedbackSurveyRate: 0` | "Set `0` to keep the survey from appearing" | no | NOW (alt.) | same as the survey env var | any file | settings-reference#feedbacksurveyrate |
| `enableArtifact: false` | turns off the Artifact tool, which "publishes session output as a private web page on claude.ai" | no | NO | Artifacts are private by default and useful for showing the owner pictures; just never put data/keys in them | — | settings-reference#enableartifact |
| `disabledMcpjsonServers` | reject `.mcp.json` servers by name | no | NO | the project has no `.mcp.json` | — | settings-reference#disabledmcpjsonservers |

## 16. debug-your-config.md — https://code.claude.com/docs/en/debug-your-config

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| `/permissions` | "Resolved allow and deny rules currently in effect" | no | NOW (proof step) | After adding rules, a screenshot/list for the owner that they are live | command | debug-your-config#see-what-loaded-into-context |
| `claude doctor` / `/doctor` | "invalid settings files"; prints read-only diagnostics | no | NOW (proof step) | Catches a skipped rule (e.g. an `mcp__` rule with parentheses, a typo) — a rule that silently does nothing is the worst case | terminal | debug-your-config#check-resolved-settings |
| `/mcp` | "every configured server, its connection status" | no | NOW | Lists every MCP server the session can load, incl. connectors and plugin servers, to make sure each Supabase path is covered | command | debug-your-config#check-mcp-servers |
| CLAUDE.md vs permissions | "Use permissions or hooks for security boundaries and anything that must never happen, where you need a guarantee instead of guidance" | — | NOW | Directly answers "how do we make the data rule hold": not by CLAUDE.md text | — | debug-your-config (Note) |
| Live reload | "the change takes effect in the running session after a brief file-stability delay" | — | info | No restart needed after adding rules | — | debug-your-config#check-hooks |
| Bash deny limits | "`Bash(rm *)` deny rule doesn't block `/bin/rm` or `find -delete`" -> "Use a PreToolUse hook or the sandbox for a hard guarantee" | partly | info | Same lesson as permissions page | — | debug-your-config#check-common-causes |

## 17. errors.md — https://code.claude.com/docs/en/errors (first 100k of 484k chars; full explanations of rule warnings were beyond that part, meanings below are from the index wording only)

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| "Denying Bash also turns off the PowerShell tool, so Claude has neither" | warning text in the error index | — | NOW (pitfall) | Never deny bare `Bash`; deny specific commands | — | errors (index) |
| "Invalid permission rule "..." was skipped: Malformed Tool(content) rule" | warning text | — | NOW | Check after writing rules | — | errors (index) |
| "File is covered by a Read deny rule in your permission settings" | what the assistant sees when it hits a Read deny | — | info | Expected message when the key file is protected | — | errors#file-is-covered-by-a-read-deny-rule |
| Auto mode "cannot determine the safety" / "server returned no safety verdict" | classifier failures deny the action | — | info | Fail-closed: a classifier outage blocks, not allows | — | errors (auto mode entries) |

## 18. troubleshooting.md — https://code.claude.com/docs/en/troubleshooting

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| `/heapdump` warning | "The `.heapsnapshot` file contains every string in the process, including your full conversation and credentials. Don't attach it to a public issue" | — | NOW (rule for us) | If a memory problem is ever debugged, only the `-diagnostics.json` may be shared | — | troubleshooting#high-cpu-or-memory-usage |
| `claude --safe-mode` | session "with your customizations disabled" incl. hooks and MCP | — | info | Note: safe mode also turns off the project's own guard hooks | — | troubleshooting |
| "Use the `/feedback` command ... to report problems" | suggested help path | — | NO for us | It uploads the transcript (see data-usage) | — | troubleshooting#get-more-help |

## 19. feature-availability.md — https://code.claude.com/docs/en/feature-availability

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Desktop needs a Claude subscription | "Claude Code Desktop" listed under "Features that require a Claude subscription" | yes | info | consumer plan -> consumer data terms (data-usage) apply unless he is on Team | — | feature-availability#features-that-require-a-claude-subscription |
| claude.ai connectors | "load only when your claude.ai subscription is the active authentication method" | yes | info | how the Supabase connector reaches the session | — | feature-availability#features-available-on-every-provider |
| Server-managed settings | "✓ (Team and Enterprise)" only | no | NO | not on a personal plan; user settings are the top level he controls | — | feature-availability#availability-by-subscription-plan |
| ZDR | Enterprise only, "Requires separate enablement by Anthropic" | no | NO | — | — | same |
| Sandboxing listed "on every provider" | but sandboxing page: "On native Windows, Claude Code runs commands unsandboxed" | — | info | provider ≠ OS; on this laptop it is still NO | — | feature-availability; sandboxing |

## 20. network-config.md — https://code.claude.com/docs/en/network-config

| Feature | What it does | Use it? | Value | Why | How switched on, by whom | Source |
|---|---|---|---|---|---|---|
| Connector traffic goes via Anthropic's MCP proxy | `mcp-proxy.anthropic.com`: "MCP connectors from claude.ai ... Connector traffic routes through this proxy" | yes (implicit) | NOW (key fact for "who sees data") | Every Supabase connector call and its result passes Anthropic's proxy, on top of entering the chat. Another reason the Supabase connector must never return player rows | `ENABLE_CLAUDEAI_MCP_SERVERS=false` or `disableClaudeAiConnectors` to stop (see Desktop caveat in §15) | network-config#network-access-requirements |
| Telemetry hosts | Datadog intake hosts "carry only optional operational telemetry" | — | optional | low data risk | env vars | network-config#network-access-requirements |
| Desktop reads proxy/TLS vars only from user/managed settings when the app manages the connection | "a checked-out repository can't redirect the TLS or proxy path" | — | info | A public repo's settings can't reroute his traffic | — | network-config#mtls-authentication |
| Proxy / CA / mTLS | enterprise plumbing | no | NO | not needed | — | network-config |

---


The local facts, the proposed permission rules and the top 5 continue in `C2-safety-proposal.md`.
