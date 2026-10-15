# Claude Code: what it can do for this project

The owner asked for a full look at every Claude Code feature and every installed tool: what we
use, what we need now, what later. Read on 9.10 from the live documentation
(code.claude.com/docs, index llms.txt, 221 pages; the enterprise and cloud-provider pages left out)
against the newest release, 2.1.295 of 8 Oct 2026 (the laptop's CLI is 2.1.268; the desktop app's
Code tab runs its own copy, updated by Help, Check for Updates). Six readers, one part each, every
row quoting its page:

- `A-working-style.md`: sessions, memory, context, compaction, cost, /goal, commands.
- `B-extensions.md`: hooks, skills, subagents, plugins, MCP.
- `C-safety-settings.md`: permissions, sandbox, data use, settings; `C2-safety-proposal.md`: the laptop's facts and the proposed permission rules.
- `D-automation.md`: GitHub Actions, code review, routines, cloud sessions, worktrees.
- `E-owner-access.md`: the desktop app, the phone, Remote Control, what the owner clicks.
- `F-inventory.md`: everything installed on the laptop, with a verdict for each.

## What changed how we work (facts, each in its part)

- Quality drops as a session's context fills; start fresh between tasks (best-practices.md).
  The owner's decision 9.10: one queue step, one session.
- CLAUDE.md edited mid-session is not reloaded until /clear, /compact or a restart (A); rules
  in CLAUDE.md are advice, hooks always run (best-practices.md). So a guard that must hold is a
  hook (tools/claude-guard.mjs) or a test, not a sentence.
- A new desktop session's worktree starts from the remote's default branch, main, the old live
  site, unless `worktree.baseRef` is "head" (E, worktrees.md); set in `.claude/settings.json`,
  with the main folder kept on the latest work.
- Hooks load when a session starts; project agents added mid-session load only in a new one.

## Done from this research on 9.10

- `.claude/settings.json`: SessionStart (the state and the queue after every compaction, a warning
  when the checkout lacks the latest work), UserPromptSubmit (every owner message logged outside
  the repository), PreToolUse (no skipping the git hooks, no browser on the laptop through any
  tool, the live database read only), Stop (no turn ends with failing tests or unsaved work),
  `worktree.baseRef: "head"`. Every refusal seen red in `tools/prove-guards.mjs`.
  The GitHub connector's write tools (push_files and others) are refused too: they would reach
  main past the push hook (C2).

## Now: the owner's clicks (each explained in his guide)

1. Update the desktop app: Help, Check for Updates, then a new session; `/status` shows the version.
   27 releases of fixes, among them hooks that were skipped when matching failed (2.1.288) and
   finished work redone after a compaction (2.1.293) (B, E).
2. His data choice at claude.ai/settings/data-privacy-controls: with "help improve Claude" off,
   chats are kept 30 days instead of 5 years and not used for training (C, data-usage.md).
3. The phone: the Claude app, Code: every laptop session is already joined to Remote Control
   (his setting is on); notifications on (E).
4. The new session per queue step, opened as his guide shows; the first message is "continue" in his words.
5. Optional: hookify (official plugin); our own guards stay the proven ones (B).

## Now: the assistant's work, next session (small, each proven by the prover)

1. After the update: `onFailure: "block"` on the PreToolUse and Stop guards, so a broken guard
   stops the action instead of letting it through (B, changelog 2.1.295).
2. Permission deny rules beside the hooks (C2), and a corrected `autoMode.environment` in his user
   settings, which still describes the earlier project (C, F): on his yes, as settings change.
3. `/goal` with a provable condition for each queue step (A).
4. Switch off the plugins and connectors this project never uses (marketing, data, canva, adobe,
   customer-research and others: F): less context every turn, fewer ways for data to leave; on
   his yes.

## Later (with the step that needs it)

- Plan step 4.2 (data): the privacy-legal plugin (privacy impact assessment, Supabase's data
  processing agreement), `/security-review`, a weekly database export as a cloud routine (D).
- Plan step 4.3 (the headset): the meta-vr plugin (Meta's own Quest docs, GPU traces), whose
  tools did not load here (F).
- A reviewer on every pull request (claude-code-action with his subscription token; D), cloud
  sessions to ride out power cuts (D), the typescript-lsp plugin for errors after each edit (B),
  `/design` for picture choices (E), an output style for reports to him (A).

## Not for us

Agent teams (experimental, about 7 times the tokens), fast mode (paid from usage credits), the
Telegram channel (terminal only, dies with the power), Slack and Claude Tag, the sandbox (not on
native Windows), plugin evals, managed Code Review (Team and Enterprise only).
