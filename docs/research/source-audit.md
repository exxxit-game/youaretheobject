# Source audit: delivery, sessions and room lifecycle - 17 October 2026

Working copy: codex/trial-migration, base 802847f1196d582d99edb98788c42b0271543826. Local changes only. No publication, production request, purchase, owner acceptance or independent-review record.
The owner requested careful inspection of file contents, names and dependencies. This report separates reproduced defects, static inventory and areas still requiring review; it is not a certificate that every repository file is correct.

## Reproduced defects and changes

| Defect | Evidence before the fix | Change and check |
|---|---|---|
| Hidden files entered the game export | A fictional src/.local-note was refused by the local server but copied into both the raw export and chunk manifest | Shared public-file boundary; hidden files and hidden folders excluded. delivery-export test checks both copies |
| Export changes kept an old review valid | Changing tools/export-game.mjs did not change the public fingerprint | Fingerprint and dirty-state check include the export recipe; regression changes the recipe in an isolated fixture |
| Preview protection depended on its URL | Preview at a domain root made three transport calls after consent in the isolated session test | Export embeds a preview marker in the verified game and raw fallback; session checks it at any URL |
| A full cache broke an otherwise valid lazy asset | A simulated cache quota error rejected the streamed asset | Active fetch returns verified bytes even if storage fails; candidate core installation still fails safely if it cannot persist |
| Leaving a paused room left its timer running | Virtual clock retained one interval after end() | flow.js cancels outstanding intervals immediately; old work never resumes and a new run works |
| Public-looking filesystem links escaped the file boundary | Real HTTP served a fictional private sentinel through a junction; exporter also followed a linked parent of an explicitly listed file | Every path segment is checked; HTTP returns 403 and exports/review refuse links. Both direct and parent links tested |
| Smoke browser lost its graphics context | Chromium 156.0.8078.4 with the old flag reported shader errors and contextLost=true; normal gameplay reached its end but the check failed | Documented ANGLE/SwiftShader flags produced WebGL 2, contextLost=false and no errors in the same local scene; full smoke result recorded below |
| Comparison ignored the recording choice | A real-speed session without consent still made one comparison transport call | session.compare uses the existing consent/speed/preview gate; no-consent test now observes zero calls |
| Error collection was unbounded | 1,000 distinct errors produced 1,000 reports in memory although only five could be sent | Collect at most five distinct errors per page, before and after consent; test verifies both paths |

The hidden-file, export-review and cache defects also affect the assistant's own recent delivery implementation. They are not attributed only to older work.

## File roles and inspected connections

| Files or chain | Purpose and outcome |
|---|---|
| index.html, src/main.js, app/lab.js, app/stage.js | Engine/bootstrap, room selection, persistent scene and controller setup traced |
| tools/public-files.mjs -> delivery-pack.mjs -> export-game.mjs -> publish-preview.mjs | One public boundary and one export implementation. Removed duplicated copying/transformation from publisher; temporary export cleanup also runs on failure |
| tools/review-gate.mjs, tests/static-server.mjs | Review identity matches export inputs; served files and export use the shared boundary |
| src/delivery-boot.js, src/delivery-worker.js, css/delivery.css | Installation, activation, update waiting, cache reuse, byte ranges, fallback and quota behavior traced |
| src/app/session.js -> src/engine/results.js | Consent, preview, speed, comparison and bounded issue collection. Durable retry remains separate unfinished work |
| src/app/consent.js, issue-report.js, playtest-report.js, left-early.js | Consent input, report fields and early-leave handling inspected alongside session callers |
| src/rooms/01-control/room.js -> flow.js, trials.js, schedule.js, questions.js, report.js | Run state, timing, cancellation, logging, question/reveal transitions and transport callers traced |
| src/app/menu.js, lobby/lobby.js, lobby/opening.js, lobby/exit.js | Menu hold, corridor-to-room transitions, leaving and returning traced. Suspected presses through the menu are blocked by room.js; no speculative fix made |
| src/engine/ui/sheet.js, sheet-page.js, ink.js, choice.js, scale.js, engine/panel.js, app/seal.js | Clipboard state and input routing inspected; existing layout/geometry tests exercise text and wall bounds |
| src/engine/audio.js, voice.js, sfx.js, away-meter.js, log.js | Audio unlock, playback, observation time and event-log paths inspected; this is not a complete audio/hardware certification |
| src/engine/locomotion.js, recenter.js, room-bounds.js, menu-button.js, grab-press.js, laser-beam.js, haptics.js | Controller event routing, menu pause and camera placement inspected with callers |
| src/engine/prewarm.js, reflect-env.js, merge-static.js, controller-batch.js, fader.js, glide.js, vignette.js, door.js | Resource preparation, visibility restoration, transitions and rendering helpers inspected; real headset performance remains unmeasured |
| vendor/, package-lock.json | Existing vendor verification passed for A-Frame 1.8.0, 20 controller models and the inspector. Locked packages installed with scripts disabled; lockfile unchanged |

Static inventory covers 175 code/config/page files, including 84 source JavaScript modules, with hashes/imports/exports/component names. No source module is unreachable from the declared game, room and delivery entry points. Two apparent missing imports are deliberate strings inside guard tests, verified in their callers. This inventory is not manual review of all 175 files.
The minified vendor bundles are used dependencies, not disposable leftovers. No current loading reference to A-Frame 1.7.1 was found in index, source or tools. Unrelated primary-checkout edits, old branches, existing documentation edits and user decisions were preserved.

## The process chain, checked against files and settings

| Link | Actual evidence | Boundary |
|---|---|---|
| Source -> export | Byte-for-byte reconstruction tests and real exported-root browser launch | Hosting itself has not been changed |
| Export -> review | Export-recipe edits now invalidate the fingerprint | No fresh independent approval record |
| Edit -> local commit | Git core.hooksPath points to primary-checkout hooks; both hook files have exactly the same SHA-256 as this checkout | Configuration alone is not proof that a callback ran; actual commit outcome is recorded separately |
| Commit -> remote tests | Workflow runs npm test, guard checks when applicable, and smoke on pull requests/pushes into the configured branches | No new remote run was requested for these local changes |
| Review -> headset/publication | Existing review and paper checks retained; changed room requires fresh paper review | Neither gate is replaced with this audit's prose or tests |
| Codex event -> review/owner journal | Configuration exists; read-only status returns zero real events | Runtime callback activation remains unproven |
| Tested game -> owner acceptance | features.json unchanged | No acceptance is inferred from technical work |

## Validation and remaining work

Full npm test passed on the final source, including the parent-link and consent/queue extensions; its complete log is saved with the evidence. Structure and diff checks passed. Exact commit is recorded in docs/progress.md. The quota-warning stack in the worker test is intentional. Local shell-hook cases skip on Windows; that is not a hook activation proof.
Initial smoke failed on real graphics errors. The isolated old/new browser-flag comparison is saved with exact flags, renderer and errors. Do not treat that comparison alone as a full smoke pass.
Real exported-root preview: Chromium 156.0.8078.4, manifest 67a1dd1b1abe433bc53d3f896be32fc2fdf735c25890176edd4db6e680072328. First launch transferred 4,378,652 object-body bytes (143 requests); reload transferred zero object bytes and made zero object requests. Verified worker control and preview marker at the domain root with speed 1: result/playtest/comparison calls stayed disabled. No outside requests or page/console errors. Other origins were intercepted and refused by the test, so no production request was possible. This is a browser launch/reload proof, not a full device restart or offline certificate. All smoke scenarios passed: normal, playtest, corridor exit and emulated VR; worst-view draw calls for both eyes were 96 in the corridor and 86 in the room (limits 100 each). The smoke run began before the last consent/error-queue guards were added; those guards were separately tested on the final source and in this final exported-root browser. Smoke uses accelerated non-recording sessions; it is not a real headset playthrough.

No current practice or paper approval is claimed; room changes invalidate the prior room review. codex-events --status reports zero owner/reviewer events and unestablished runtime trust. No review records were written or substituted with test output.
Remaining boundaries: full manual pass over visual geometry/content and scientific sources, real Quest/Safari/restart/eviction checks, current independent reviews and live callback path, live publisher round trip and mutable CDN cache behavior. The result-delivery queue still needs durable storage plus server-side duplicate protection; existing board entry remains open. No database migration was applied.

Evidence: C:/Users/admin/Documents/objekt-files/notes/source-audit-2026-10-17 contains the static inventory and GPU comparison. Earlier browser-cache byte counts in docs/research/game-cache.md belong to the exact 802847f exports, not this changed version.
Graphics source, checked 17 October 2026: [Chromium SwiftShader documentation](https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md). The current official search excerpt names --use-gl=angle and --use-angle=swiftshader-webgl; the direct page request timed out. The behavior was independently compared on the installed Chromium version.

## Process audit extension - 17 October 2026

The owner explicitly asked to verify and set up the complete process before further game work. Source base c791a8e4e3ec855433efe07b9432f03235d3040e. This extension does not certify every project file or service.

| Link | Current evidence and action | Remaining boundary |
|---|---|---|
| Global Codex setup | CLI 0.163.0-alpha.10.2, desktop 26.1013.3656.0. Native doctor loads config/auth and reports consistent installation; configured model Astra/xhigh. Global AGENTS is the owner's Russian instruction | Doctor does not inspect active-thread overrides; model defaults are not proof of every thread's selection |
| Chat -> correct project | App lists this chat at the primary checkout, where .codex is absent. Hooks and native reviewer TOML files exist only in the trial. No global hooks file/inline hooks found. Attempted supported attachment: app says the worktree belongs to another task | The current chat has not moved. This explains a concrete missing configuration layer; normal project/hook trust and real callbacks must still be verified in the correct workspace |
| Instructions -> behavior | AGENTS now explicitly reads retained CLAUDE workflow and relevant owner rules; docs/tools points Codex work at its own docs | Claude imports, permissions and event guards do not become native Codex behavior merely because the files exist |
| Tools -> actual use | Doctor warns standalone CLI lacks node_repl's app environment variable; the actual app Node tool returned 4 for 2+2 | No unnecessary MCP reconfiguration; this is a tool invocation proof, not all integrations |
| Edited file -> saved version | Reproduced a bad staged module being committed because the disk copy was fixed. Hook now parses index contents before clearing Git variables. Real Git regression cases reject bad index and commit -a, and accept good index with an unfinished disk edit | Quick unit tests still use working files; remote CI must test the exact commit |
| Working copy -> Git hooks | Set trial-only core.hooksPath=tools/hooks using the existing worktreeConfig extension; read back its worktree config and the unchanged primary setting | This setting is local; future clones need their own hook setup |
| Saved files -> recovery | New F:/objekt-project-snapshots/2026-10-17T12-26-08Z: Git bundle plus all tracked/non-ignored untracked files and dirty patches. Restored 637 trial and 616 primary files and checked every SHA-256. Original status unchanged | Snapshot precedes this documentation update and the commit that records it; ignored credentials/dependencies/local settings are excluded |
| Library -> recovery | Restored all 2,205 manifest files (1,287,712,279 bytes) from F:/objekt-files-snapshots/2026-10-17-004858; every source/restored hash matched. No recorded path missing or changed against current library. C: disk 0, F: disk 1 | New paths outside the saved manifest, cloud restore and live Supabase restore are not proven; this is not automatic backup scheduling |
| Reviews -> publication -> game | Existing review/acceptance gates retained; Codex status still zero, no real current review or new remote CI run | Correct workspace and normal hook trust first; real named review callbacks next; then exact-version CI, permitted preview, own Quest check and owner's acceptance |

Full npm test passed after the index fix; syntax regression failed before it and passed after it. No game source changed in this process extension, so the earlier bounded browser/smoke evidence remains applicable to game behavior. Guard mutation checks and actual commit callback outcomes are recorded in progress.md. No publication, purchase, live migration or owner acceptance was made.

Evidence in the same private source-audit folder: recovery.json, codex-doctor.json, npm-test-process.txt and process-commit-trace.jsonl. Git trace is evidence of execution only for the recorded commit. The supported attachment refusal is an app ownership restriction, not a reason to rewrite app state or bypass hook trust.
Sources read 17 October 2026: [Codex hooks](https://learn.chatgpt.com/docs/hooks), [AGENTS loading](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees), [Git hooks](https://git-scm.com/docs/githooks), [Git configuration](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath). Codex manual was freshly fetched through openai-docs; source files and actual tool behavior were checked separately.
