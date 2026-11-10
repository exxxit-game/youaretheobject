# Native Codex review integration

Activated and checked on 7 November 2026 for T01b, after explicit owner permission.
Native practice-review delivery is verified; this is not owner acceptance or a
release approval.

## Existing practice and reuse

The [official hook contract](https://learn.chatgpt.com/docs/hooks) supplies native
SubagentStart/Stop events and requires trust of each exact hook definition.
The [custom-agent schema](https://learn.chatgpt.com/docs/agent-configuration/subagents)
defines standalone TOML roles. Neither a transcript parser nor a fake Claude event
is needed. Earlier work under the codex-trial-migration checkout supplied the
start/stop, explicit Codex provenance, content snapshot and journal-lock approach.
Its old scope, website roles and unavailable ownerRoot import were not copied.

## Implemented scope

`tools/codex-review.mjs` accepts the two actual reviewer role types, distinct
session/agent IDs and a matching session, turn, role and checkout. It compares
served content and review infrastructure before and after review, retains the
report with its hash and rejects missing, metadata-only, truncated or mismatched
reports. A completed report has pass, changes-required or unverified status.
New pending/failed/adverse reviews cannot silently reuse an older positive one.
The paper path remains separate and lists the checked rooms.

`tools/review-gate.mjs` also checks Codex scope, provenance fields, report hash and
verdict when consuming a record. The existing Claude path remains compatible.
The named-fix exception permits only the assistant's own look, not publication.

Native PreToolUse translates shell/edit inputs to the existing project guard;
it does not replace that shell parser. Missing commands, journal mutation,
record redirection and direct simulated callback invocation are rejected.
The three callbacks and two read-only role profiles are in this chat workspace's
local .codex folder, outside the game repository. Only its project trust and the
three exact hook-trust entries changed through the native configuration API.

## Checks and limits

`tests/codex-review.test.mjs` uses only disposable journals. The ordinary legacy
review and guard checks still run. The process character limit was not raised:
the adapter and local configuration are counted. Removed explanatory comments
are retained in the F-drive evidence; Acorn AST comparison verifies that the
comment-only edits changed no executable statements.

Native discovery confirms all three hooks enabled/trusted, with old definitions
preserved. A real PreToolUse callback blocked the harmless canary before execution.
An ephemeral parent's spawn failed with no saved rollout; ordinary Codex exec
then produced a real practice-reviewer start/finish. Its final response was fetched
through read_thread and matched to the hook's report and content snapshot.
The verdict is unverified: the bounded code review did not check the full scene.
Both review and own-look gates remain closed. Native paper-review delivery was
not exercised; its separate logic has synthetic coverage. A completed review does
not prove a browser/Quest
walk-through or owner acceptance. Journal files and hashes are process evidence,
not cryptographic proof of reviewer identity against a malicious OS-level writer.
Import/startup failures can prevent the hook from loading; the CLI catch does not
establish that every possible hook failure blocks all tools. No VR or publication
has been unlocked as a demonstration of this integration.

The current map links the versioned native verification. T01b's delivery check is
complete; T01c branch/CI and T01d visible route are separate later steps. No game
scene, Quest run or publication was approved by this integration test.
