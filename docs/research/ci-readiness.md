# Corridor delivery evidence

T01c, 8 November 2026. This records the implementation contract. Live outcomes
are saved by commit SHA in the F-drive project map and validation report, so a
documentation update does not silently replace the version whose CI was read.

## Branch and scope

Work stays on experiment/perception-corridor. The publication source observed
through GitHub Pages is main; this step does not merge or publish that branch.
The workflow runs on pushes to this branch and codex work branches, retaining
room-polish/main pushes and PR checks into those bases.
[GitHub branch filters](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
apply to the PR base. A push run checks its exact head SHA; a PR run may check a
synthetic merge commit. The read-only delivery check requires the former and
does not mislabel a merge-ref run as the local HEAD.

## Portable checks

`tests/structure.test.mjs` keeps the existing 116793-character process ceiling.
The explicit reserved allocation of 1431 for host-only ../../.codex/ remains
occupied when that folder is absent on CI. Measured growth above the reserve
still consumes the same ceiling. No host configuration is published to satisfy
this accounting check. All previous guard tests remain enabled.

`tests/smoke-preview.mjs` opens the real /src/preview/ page in CI, checking boot,
view buttons, eye height, keyboard motion and input clearing. The blur case
dispatches the browser event; it is not a physical-window test. It neither
renders the denied local project map nor proves walking N to N+1 to N, mobile
comfort, binocular perception or Quest behavior. The old smoke remains.

## Read-only status

`node tools/finish.mjs check` calls `tools/delivery-check.mjs`; it never pushes,
creates/comments on a PR, merges or publishes. Dirty or stale work, unknown
arguments, missing checks, incomplete pagination and network/parse failures do
not produce a positive result. Two evidence snapshots must agree, even when the
commit SHA has not changed. Results are observations, not permanent guarantees.

The expected test job and unit/browser steps must actually finish. CodeRabbit
also needs a recognised submitted review of the same SHA, a positive completed
status/check and no unresolved threads. The observed review-body/status format
was checked against historical PR 27; that old review is not current approval.
[CodeRabbit configuration](https://docs.coderabbit.ai/reference/configuration)
explains why a successful commit status alone can still represent a skip/error.
Unknown formats remain unverified. Drafts are not auto-reviewed by the existing
configuration; no automatic review comment is sent by check mode.

Code-check completion does not grant owner acceptance, merge, headset access or
release permission. The native practice/paper gates and the owner's decisions
remain separate. New source changes require new version-bound evidence.

Codex-only active guidance lives in AGENTS.md and WORKFLOW.md, with retained
policy specifications under policy/. The native adapter reads the deny list;
three approved host hooks call it. Old start/prompt helpers have unit coverage
but are not registered native hooks. Feature acceptance remains closed without
a genuine owner record. Markdown budgets/imports do not prove native loading.
Code-only review pass never authorises the whole served surface; full-practice
coverage must be explicit. Historical provider reports are not native approvals.
