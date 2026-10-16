# Codex project handoff

The owner is not a programmer. Do technical work and verification yourself; explain results in plain Russian. Distinguish observations, earlier reports, and untested assumptions.

## Resume the actual work
- During the Codex migration, the tested working copy is `C:/Users/admin/.codex/worktrees/codex-trial-migration/objekt`, branch `codex/trial-migration`. Verify that path, branch, HEAD and working-tree status before edits. The primary checkout has older code and preserved local changes; do not reset, clean or overwrite them to align copies.
- Read the latest entries in that copy's `docs/progress.md` first. They record the migration status, evidence and next unfinished step. Then read `docs/state.md` for locations, treating its Claude-era setup claims as historical until verified.
- For the task at hand, consult `docs/owner-decisions.md`, `docs/board.md`, `docs/features.json`, and the relevant architecture or research file. Do not repeat the entire project audit at every continuation.
- Update the existing progress log with material results, exact version, remaining uncertainty and the next action. Keep user decisions separate from an assistant's proposals. Memory and chat summaries are aids, not proof of completed work.

## Verify and preserve
- Existing commands: `npm test`, `npm run test:smoke`, `npm run serve`. Run checks appropriate to the change; recorded success applies only to the version and scope actually tested.
- Quest work uses `tools/quest-look.mjs` and `tools/headset.mjs`. Match the served game to the working copy, obey the worn-headset protections, and distinguish a short launch check from a full playthrough or performance test.
- Preserve the existing review gates and owner-acceptance requirements. Do not fabricate their records or mark a feature accepted from an assistant's text. The trial has a Codex event bridge (docs/tools.md); its isolated tests do not establish live hook activation. Read `node tools/codex-events.mjs --status` and verify real callbacks before relying on it. Other Claude hooks are not migrated.
- Preserve the owner's files and old branches. Production data remains read-only; publishing to main, applying live migrations and purchases require the owner's specific authorization under the existing decisions.
- Use bounded tasks with an observable completion condition. Extra agents and repeated reviews need a concrete purpose; installing tools is not evidence that the delivery process works.
