# F. Inventory of Claude Code on this laptop (read only)

Collected 2026-10-09 from the files themselves. No secret values are printed.

## 0. Where things come from (three separate sources)

1. **Claude Code CLI plugins** (`C:\Users\admin\.claude\settings.json` -> `enabledPlugins`,
   `C:\Users\admin\.claude\plugins\installed_plugins.json`), marketplace `claude-plugins-official`
   (git https://github.com/anthropics/claude-plugins-official.git). CLI version: `claude --version` = 2.1.268
   (the desktop app ships its own Claude Code 2.1.289 / 2.1.293 in `AppData\Roaming\Claude\claude-code\`).
2. **claude.ai org/directory plugins** pulled by the Claude desktop app ("rpm" = remote plugin manager):
   `C:\Users\admin\AppData\Roaming\Claude\local-agent-mode-sessions\f25ba824-...\c4910dfa-...\rpm\plugin_*`
   with `manifest.json` listing 11 plugins, all `installedBy: user`, `installationPreference: available`
   (= loaded into every desktop session; they show as `*-inline` in `~/.claude/plugins/data`).
3. **Desktop app extensions and claude.ai connectors** (MCP servers): `AppData\Roaming\Claude\Claude Extensions\`
   (filesystem, figma, minutes, pdf-filler-simple) and the claude.ai connectors (UUID-named MCP servers in session).

No user-level `C:\Users\admin\.claude\skills\` or `C:\Users\admin\.claude\agents\` folder exists.

Note: `~/.claude/settings.json` -> `autoMode.environment` still describes the OLD project
(cosmogram-app, remote exxxit-game/cosmogram-app, "git push is never performed by the agent").
It is stale for objekt and is injected into the auto-mode classifier's context.

## 1. CLI plugins (claude-plugins-official)

| Plugin | Version | Enabled in user settings.json |
|---|---|---|
| playwright | 340e33aef211 | false |
| security-guidance | 2.0.7 (cache also has 2.0.8, 2.0.11) | false |
| supabase | 0.1.15 | false |
| chrome-devtools-mcp | 1.7.0 | false |
| skill-creator | 340e33aef211 | true |
| code-review | 340e33aef211 | true |
| pr-review-toolkit | "unknown" (cache also b78ac49cdc6b, c447c3207a42) | true |
| superpowers | 6.3.0 (user + 3 project scopes for old cosmogram-app paths) | true |

Install manifests also exist (but plugin not installed) for: claude-security, context7, github, gitlab.

## 2. claude.ai directory plugins (desktop app, rpm)

| Plugin | Version | Source marketplace | MCP servers in its .mcp.json |
|---|---|---|---|
| research-desk | 0.4.1 | anthropic-plugin-directory | reference-lookup (local python3 stdio), reference-lookup-hosted (https://research-desk-checker.fly.dev/mcp) |
| meta-vr | 2.0.0 (Meta Platforms) | anthropic-plugin-directory | metavr (`npx -y metavr mcp server`, stdio) |
| privacy-legal | 1.0.2 (Anthropic) | anthropic-plugin-directory | Slack, Google Drive; hooks.json is empty |
| data | 1.1.0 | anthropic-plugin-directory | snowflake, databricks, bigquery, hex, amplitude, amplitude-eu, atlassian, definite |
| scientific-coding | 0.1.0 | anthropic-plugin-directory | none |
| customer-research | 0.1.0 | anthropic-plugin-directory | none |
| adobe-for-creativity | 3.0.0 | knowledge-work-plugins | Adobe for creativity |
| marketing | 1.2.0 | knowledge-work-plugins | slack, canva, figma, hubspot, amplitude(+eu), notion, ahrefs, similarweb, klaviyo, supermetrics, google calendar, gmail |
| canva | 1.0.0 | knowledge-work-plugins | canva |
| figma | 2.2.127 | knowledge-work-plugins | figma |
| design | 1.2.0 | knowledge-work-plugins | slack, figma, linear, asana, atlassian, notion, intercom, google calendar, gmail |

`claude plugin list` (CLI) shows only the 8 CLI plugins above (superpowers listed 4 times: user + 3 project
scopes pointing at old cosmogram-app paths). `claude mcp list` (CLI): "No MCP servers configured".
`~/.claude.json`: no user-level `mcpServers`; the objekt project entries have no MCP servers.
So every MCP server this session sees comes from the desktop app (plugins, connectors, extensions).

**Important:** the desktop session loads playwright, chrome-devtools-mcp and supabase although the CLI
settings mark them disabled (their tools `mcp__plugin_playwright_playwright__*`,
`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*` and the `supabase:*` skills are present in this session;
`~/.claude.json` pluginUsage shows playwright last used 2026-10-02, chrome-devtools 2026-10-02).

Usage counts (`~/.claude.json` pluginUsage / skillUsage, all projects together): security-guidance 26306+7377
hook firings (last 2026-09-30, now disabled), playwright 1834, chrome-devtools 267, superpowers 100,
pr-review-toolkit 14, research-desk 5, supabase 2, design 1, figma 2, skill-creator 1; **0 ever** for meta-vr,
privacy-legal, scientific-coding, data, customer-research, marketing, canva, adobe, code-review, context7.

## 3. Each plugin: what it adds, and the verdict for objekt

### meta-vr 2.0.0 (Meta Platforms, Apache-2.0, github.com/meta-quest/agentic-tools) — never used
- MCP server `metavr` = `npx -y metavr mcp server` (npm `metavr` 1.8.1 is in the npx cache; no global install).
  README: "40+ tools for device management, app control, file operations, documentation search,
  performance tracing". The server's instructions reached this session, but **no `metavr` tool is listed**
  (ToolSearch "metavr" finds nothing), so in practice its tools are not available now.
- CLI groups (docs/metavr-cli.md, 4827 lines): `docs search|fetch|api-search` (Meta Quest developer docs,
  category filter incl. WEB, DESIGN, POLICY), `perf capture|analyze-trace|gpu-counters|thread-state|compare|
  memory-snapshot|simpleperf` (Perfetto), `capture screenshot`, `device`, `app`, `log`, `adb`, `audio`,
  `xrsim`/`ssim` (simulators), `store`, `auth login` (Meta account, device-code flow).
- 36 skills. Relevant: `hz-quest-verify-first` (forces checking Quest claims against Meta docs),
  `hz-immersive-designer` (comfort, depth zones 0.5 / 1-2 / 2-5 m, FOV zones, text readability, accessibility;
  4 reference files, about 450 lines, no source URLs inside: secondary summaries), `hz-perfetto-debug`,
  `hz-simpleperf-debug`, `hz-vr-debug`, `hz-store-pwa` (WebXR as PWA in the Horizon Store), `hz-iwsdk-webxr`
  (Meta's Immersive Web SDK, Three.js ECS, not A-Frame). The other ~25 are Unity, Android, Spatial SDK,
  Portal, React Native: not this project.
- Verdict: **USE NOW** (docs search for rule 23 "Meta and W3C XR guidelines" straight from developers.meta.com;
  Perfetto/GPU traces of the Quest browser to complement the frame-rate reading in tools/quest-look.mjs;
  hz-immersive-designer as a checklist, numbers only after `metavr docs fetch` of the primary page).
  First: make the metavr MCP tools actually appear (may need the owner to run `metavr auth login` once).

### superpowers 6.3.0 — enabled, used (100)
Skills (14): brainstorming, dispatching-parallel-agents, executing-plans, finishing-a-development-branch,
receiving-code-review, requesting-code-review, subagent-driven-development, systematic-debugging,
test-driven-development, using-git-worktrees, using-superpowers, verification-before-completion,
writing-plans, writing-skills. Hook: SessionStart (startup|clear|compact) injects using-superpowers
into every session = fixed context cost at each start and after every compaction.
Verdict: **USE NOW** selectively: systematic-debugging (rule 12), verification-before-completion (rule 8),
receiving-code-review (rule 18). brainstorming / TDD / writing-plans / executing-plans overlap the project's
own plan doc and rules 21-22; the "MUST use before any creative work" wording can fight rule 22a.
Remove the 3 stale cosmogram-app project-scope installs.

### pr-review-toolkit — enabled, used (14)
Agents: code-reviewer, code-simplifier, comment-analyzer, pr-test-analyzer, silent-failure-hunter,
type-design-analyzer. Command: /review-pr. Verdict: **USE NOW** for rule 24's "independent reviewer agent on
the diff" (code-reviewer reads CLAUDE.md; comment-analyzer fits rule 1 "no history in comments";
pr-test-analyzer fits rule 19 guards; silent-failure-hunter for the Supabase save path).
type-design-analyzer: **NOT NEEDED** (plain JS, no types).

### code-review — enabled, never used (0)
Command /code-review (PR review). Verdict: **NOT NEEDED** (duplicates pr-review-toolkit and the built-in
`code-review` skill also present in the session).

### skill-creator — enabled, used once
Verdict: **LATER** (only when a project skill like new-room is written or measured; the session also
has `anthropic-skills:skill-creator` and `superpowers:writing-skills` for the same job).

### supabase 0.1.15 — CLI-disabled, loaded in desktop; MCP needs authorization
Skills: `supabase` (all Supabase work, RLS, auth, logs), `supabase-postgres-best-practices`. MCP `supabase` =
https://mcp.supabase.com/mcp with no project_ref and no read_only flag in the plugin config, so once
authorized it could write to every project of the account. The session reports it "needs authentication".
Separately, a claude.ai **Supabase connector** is live in this session (tools incl. execute_sql,
apply_migration, deploy_edge_function, delete_branch, pause_project, get_advisors, search_docs).
Verdict: skills **USE NOW** for step 4.2 data protection (RLS, advisors); MCP **LATER and read-only only**:
the owner's word "my server access read-only" is not met by either config as written. get_advisors
(security lints) is the single most useful tool.

### playwright (MCP `npx @playwright/mcp@latest`) — CLI-disabled, loaded in desktop
Verdict: **NOT NEEDED**, and a rule-8 risk: these MCP tools start Chromium on the laptop, and the project's
PreToolUse guard (`.claude/settings.json` -> `tools/claude-guard.mjs`) matches only `Bash|PowerShell`,
so it never sees them.

### chrome-devtools-mcp 1.7.0 (MCP `npx chrome-devtools-mcp@1.7.0`) — CLI-disabled, loaded in desktop
Skills: a11y-debugging, chrome-devtools, chrome-devtools-cli, debug-optimize-lcp, memory-leak-debugging,
troubleshooting. Tools include performance traces, lighthouse_audit, heap snapshots.
Verdict: **LATER**, same rule-8 gap (launches local Chrome; the guard does not see MCP calls).

### security-guidance 2.0.7 — disabled (fired on every prompt and edit until 2026-09-30)
Hooks: SessionStart (installs agent SDK via python, 180 s timeout), UserPromptSubmit, PostToolUse on
Edit/Write (LLM security review). Verdict: **NOT NEEDED** as a hook (cost, noise); keep disabled.

### research-desk 0.4.1 — used (5)
Skills: citation-check, decision-matrix, llm-council, paper-compare, paper-critique, related-work,
research-litnote. MCP: `reference-lookup-hosted` (OpenAlex + arXiv: verify_reference, verify_bibtex,
lookup_reference, search_works, citation_neighbours) works; local `reference-lookup` (python3 stdio) fails
("Connection closed"; `python3` is not on PATH in Git Bash here, `which python3` finds nothing).
Verdict: **USE NOW**: citation-check + verify_reference over docs/sources.md (rule 5);
research-litnote / paper-compare when reading papers (rules 16, 20); decision-matrix fits rule 23
("a choice a standard answers never goes to the owner as taste").

### privacy-legal 1.0.2 — never used
Skills: use-case-triage (PIA vs GDPR DPIA), pia-generation, dpa-review, dsar-response, reg-gap-analysis,
policy-monitor, cold-start-interview, customize, matter-workspace. MCP: Slack (needs auth), Google Drive
(tools present). hooks.json is empty.
Verdict: **USE NOW** for step 4.2 (player data in Supabase; privacy.html exists): use-case-triage, then
pia-generation, dpa-review of Supabase's DPA, policy-monitor (privacy.html against the code).
Its Slack / Drive servers: NOT NEEDED. Caveat: written for legal teams; cold-start expects a seed PIA/DPA.

### scientific-coding 0.1.0 — never used
One skill (rules for faithful scientific code). Verdict: **LATER** (when rooms compute and report measures).

### design 1.2.0 — used once
Skills: accessibility-review, design-critique, design-handoff, design-system, research-synthesis,
user-research, ux-copy; MCP slack, figma, linear, asana, atlassian, notion, intercom (need auth).
Verdict: **LATER**: ux-copy and user-research (play-tests). Its 7+ MCP servers NOT NEEDED.
accessibility-review is WCAG for 2D pages, not VR.

### figma 2.2.127 (+ Figma desktop extension) — used twice in September
14 skills (figma-use, generate-design, implement-motion, shaders, ...), MCP figma. Verdict: **LATER**,
only if "show before build" pictures move to Figma.

### data 1.1.0, marketing 1.2.0, customer-research 0.1.0, canva 1.0.0, adobe-for-creativity 3.0.0 — never used
data: 10 SQL/BI skills + 8 BI MCP servers (definite fails "endpoint not found"; others need auth).
marketing: 8 skills + 13 MCP servers. customer-research: 5 skills. canva: 6 skills + MCP.
adobe: 15 skills (photo batch edit, resize, quick-cut video, fonts) + MCP (needs auth).
Verdict: **NOT NEEDED** now (about 45 skill names and about 25 MCP servers that connect or ask for auth in
every session). data:statistical-analysis is the one to bring back LATER when player results are analysed.
Adobe: LATER only for image or video work (a trailer). Nothing installed handles sound.

## 4. MCP servers seen by this session (names only), with verdicts

| Server | Source | For | Verdict |
|---|---|---|---|
| metavr | meta-vr plugin | Quest device, Meta docs, Perfetto | USE NOW (tools not showing yet) |
| reference-lookup-hosted | research-desk | references vs OpenAlex / arXiv | USE NOW |
| reference-lookup (local) | research-desk | same, local python3 | broken |
| PubMed connector (UUID 652cfc02) | claude.ai connector | search_articles, get_full_text_article, copyright status | USE NOW (paper text for rules 16, 20) |
| Supabase connector (607c535c) | claude.ai connector | SQL, migrations, edge functions, advisors | LATER, read-only only |
| supabase (plugin) | supabase plugin | same, needs auth | duplicate of the connector; pick one |
| GitHub connector (816a40f8) | claude.ai | PRs, issues, files | LATER (`gh` CLI already does it) |
| Jam (ccce8626) | claude.ai | bug-report recordings, console, video transcript | LATER (owner bug reports from the phone) |
| image generation (e3cb30dc) | claude.ai | generate_image | NOT NEEDED by rule 23 (pictures from real sources) |
| Motion import (a8df8e0f) | claude.ai | import motion from a URL | NOT NEEDED |
| Notion (3f04be00) | claude.ai | Notion pages | NOT NEEDED |
| Claude Docs (1a59c906) | claude.ai | shared docs | LATER (owner-facing pages) |
| threads (4ff8cb31) | claude.ai | find / create threads | purpose unclear, NOT NEEDED |
| Google Drive | privacy-legal | Drive files | NOT NEEDED |
| Figma (desktop extension + plugin) | extension / plugin | Figma files | LATER |
| Filesystem | desktop extension | file access | NOT NEEDED (Claude Code reads files) |
| Minutes Conversation Memory | desktop extension | recording, dictation, transcripts | LATER maybe (owner dictates by voice) |
| PDF Tools | desktop extension | read, search, render PDF pages | USE NOW for papers in objekt-papers |
| playwright | playwright plugin | local Chromium | NOT NEEDED, rule-8 risk |
| chrome-devtools | chrome-devtools-mcp | local Chrome, perf, lighthouse | LATER, rule-8 risk |
| claude-in-chrome, computer-use | built in | owner's Chrome / desktop | LATER (logins, captchas: "ask when blocked") |
| Claude_Browser (preview), terminal, visualize, scheduled-tasks, mcp-registry, ccd_* | built in | app panes | browser pane USE NOW (rule 8 names it) |
| slack, linear, asana, atlassian, intercom, notion, hubspot, klaviyo, ahrefs, similarweb, supermetrics, amplitude(+eu), bigquery, hex, snowflake, databricks, definite, canva, adobe, gmail, google calendar | design / marketing / data / adobe / canva plugins | business tools | NOT NEEDED (most "need auth"; definite fails) |

## 5. Project .claude (worktree workflow-testing-plan-96f413; same files in the main checkout)

- agents: architecture-auditor, fact-checker, paper-reviewer, quick-research, request-auditor
  (all Read/Grep/Glob/Bash except quick-research: WebSearch, WebFetch, Read, Write, Bash).
  fact-checker.md has valid frontmatter but is **not in this session's agent list** (the other four are);
  probably added after the session started; check in a fresh session.
- skills: new-room (SKILL.md).
- settings.json hooks: PreToolUse `Bash|PowerShell` -> `node tools/claude-guard.mjs pre` (10 s);
  Stop -> `node tools/claude-guard.mjs stop` (180 s). No permissions, no enabledPlugins, no MCP.
- launch.json: one config "objekt", `npm run serve`, port 3100, autoPort.
- No settings.local.json, no .mcp.json in the project.
- User `~/.claude/settings.json`: no hooks, no permissions; `autoMode.environment` describes cosmogram-app
  (stale, see section 0).

## 6. Summary

Most useful, installed, not used: meta-vr (Meta docs search + Perfetto on the Quest; MCP tools not yet
exposed), privacy-legal (PIA / DPA for step 4.2), PubMed connector + research-desk reference lookup +
PDF Tools (paper text and sources), pr-review-toolkit comment-analyzer / pr-test-analyzer,
superpowers systematic-debugging / verification-before-completion, supabase skills (RLS, advisors).

Installed, not needed, costing context: marketing, data, canva, adobe, customer-research, most of design
and figma; about 25 Unity / Android / Portal skills inside meta-vr (cannot be dropped one by one);
code-review (duplicate); playwright and chrome-devtools MCP (bypass the rule-8 guard); security-guidance
(disabled, keep so); 3 stale cosmogram-app superpowers installs; stale cosmogram-app autoMode text.

