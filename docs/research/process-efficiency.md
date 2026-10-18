# Subscription-efficient assistant workflow

18 October 2026. Assessment and implementation proposal, not a deployed tool or a new owner decision.
Baseline: verified trial checkout, branch codex/trial-migration, HEAD 2a31874e0235dd1f7513696b6b1ede243454e6b1,
with the existing uncommitted changes. Builds and old receipts describe their named versions only.
Scope: the seven links in [studio-map](../studio-map.md), the existing tools, and current primary documentation.
The earlier [studio-process](studio-process.md) research remains available; no repeat scientific or whole-code audit.

## Outcome to optimize

Owner correction, 18 October: he has no technical knowledge and does not want to engage with code at any stage.
The initial owner-operated launcher recommendation missed that requirement and is withdrawn as the first step.
The assistant owns tool operation, model selection, checks, error diagnosis and technical handoff. The owner supplies
intent, priorities, product choices and feedback on the actual experience. Tools should reduce repeated assistant
work and model calls without making the owner a technical operator. An unavoidable owner-only access action must
be explained concretely; this does not make technical diagnosis his responsibility.
Optimize allowance and owner effort per verified, useful result, including rework. Do not optimize message count,
agent count, test count or number of new tools. A smaller model that needs repeated repairs can cost more overall.

## Confirmed local findings

- package.json already provides npm test, test:smoke, serve, delivery inventory and export commands. These are
  ordinary Node programs, not AI inference. Running them directly does not consume Codex allowance; asking an
  agent to orchestrate and interpret them does involve model usage. Machine, network and hosting costs remain.
- Existing building blocks include export-game, public-files, review-gate, codex-events, finish, quest-look,
  headset, measurement and library tools. Reuse these; do not create another build or approval system.
- tools/board.mjs counts commits touching game/process files. It is not an owner control panel or a time meter.
- tools/usage.mjs reads Claude transcripts and historical plan files. Its API-price weighting is not a Codex
  subscription cost measurement. No Codex task-cost dashboard was established by this inspection.
- The local knowledge HTML is a generated navigation/document snapshot. It does not execute the project tools.
  No *.ps1/*.cmd/*.bat launcher or backup/restore-named script was found in the repository file inventory;
  this does not inventory every shortcut or helper outside the repository.
- .github/workflows/test.yml uses Ubuntu/Node 22, tests, conditional guard probes and Playwright smoke. It triggers
  on pushes to main/room-polish and PRs targeting them. A local edit or standalone trial-branch push is not that trigger.
- Smoke uses the Playwright library directly, not the Playwright Test runner. No tracing call was found in that
  script. Runner configuration examples cannot simply be pasted into it.
- The preview server filters public files, but listen() does not specify a loopback host. Any future serving helper
  must check serving scope and preview provenance; it must not expose project files through a new command server.
- Existing recovery and Quest evidence is recorded in progress. It was not repeated for this process assessment.
  Restore receipts are dated; an old backup is not proof that newer files are recoverable.

## The seven links

| Link | Reuse now | Where model judgment is useful | Proposed improvement / completion evidence |
|---|---|---|---|
| 1. Owner decisions and sources | Owner/topic records, research index, library search and source cards | Resolve a concrete conflict, compare original evidence, ask only an unresolved product question | A task packet points to the controlling decision and relevant source passages; no duplicate decision register or whole-library prompt |
| 2. Game, room and assets | Existing engine, measurement, sound/voice and room tools; pinned dependencies | Implement a bounded change and explain its causal effect | Reuse templates and parameterized tools for repeated work; add one only after a real repeated operation is identified. Keep source-to-room fidelity review |
| 3. Consent and data | Session/result tests, SQL contracts, methodology and current consent proposal | Reconcile user intent, scientific protocol and current legal evidence | Automate selected invariants and failure cases after the flow is settled. Passing tests do not establish lawful or scientifically valid use |
| 4. Tests and review | npm test, Playwright smoke, CI, exact-version review gates and finish --check | Diagnose failures, independently review changed behavior and paper fidelity | Save a concise dated test receipt and full local log; retain a diagnostic browser trace for a failure where useful. Keep required review gates; no endless reviewer loop |
| 5. Preview and headset | Public export, quest-look/headset, measurement tools, owner acceptance record | Prepare the identified preview, interpret actual VR behavior and decide what to change | Assistant-operated device flow reuses existing protections; owner sees the experience and judges it. Desktop smoke cannot replace real Quest/owner acceptance |
| 6. Versions and delivery | Git, export hashes, cache/delivery tests, finish readiness checks | Resolve compatibility and rollout choices; prepare the version for the owner | Assistant identifies the preview and checks its provenance. Publish/merge remain separate actions. New delivery purchases or main release are not authorized by this plan |
| 7. Knowledge and recovery | Local catalog, generated entry, Drive copy and dated F: snapshots | Curate findings and explain unresolved questions | Reusable handoff and recovery instructions, then a repeatable snapshot/restore helper if existing external helpers do not suffice. Verify restoration into a separate folder; preserve dirty files |

## What to build first

**P1: a portable task and evidence packet for the assistant.** Extend existing reports rather than another journal. Collect branch,
commit, relevant dirty-file hashes, commands/exit codes, receipts, source links and the next unfinished action.
Judgment-dependent fields (why a decision was made, unresolved assumptions) are written and checked by the assistant.
Exclude tokens, private participant data and bulk chat transcripts. Another executor must be able to locate the
correct files and reproduce the named check without reconstructing all chats. A matching HEAD alone is insufficient
when the working tree is dirty. Reuse evidence only within its version, dependencies, environment and stated scope;
source freshness and real runtime checks still matter. Required release gates remain in force.

**P2: automate a demonstrated repeated assistant operation.** Start with the existing Node/PowerShell commands in
the next real product task. If collecting version/check receipts or another routine step repeats, add the smallest
helper that performs it reliably and returns a compact result to the assistant. Preserve full logs outside public
game files. The assistant diagnoses failures and explains the user-visible outcome; the owner is not asked to run
commands, read logs or learn tool settings. Check failure reporting and checkout boundaries when implementing it.
No new owner dashboard, framework or generalized workflow platform is a prerequisite for continuing game work.

**P3: budget observations, initially simple.** Use official current account-usage readings before/after meaningful
tasks, plus selected model/effort, duration, accepted outcome and rework. Do not revive the Claude meter for Codex.
Record reset boundaries and other account activity: a shared/rounded quota difference is not exact task attribution.
Unavailable data means unknown, not zero. Collect no conversation bodies or credentials. Start with a small table
in existing task receipts; implement automatic collection only if supported metadata and repeated demand justify it.
No per-minute monitoring agent, paid API migration or extra subscriptions for measurement.

**P4: reuse recovery work.** Inventory the existing external snapshot helpers before writing another one. A Git
commit alone excludes untracked/ignored files and the external library. A cloud sync alone can propagate deletion.
A new recovery helper earns its place only by preserving the selected sources plus dirty work/library, producing
a file manifest, and restoring into a separate location with verified hashes and documented exclusions. Credentials
and live database recovery need their own controlled treatment; do not copy them into a public task packet.

## Model and chat use

Keep the agreed [board matrix](../board.md): Sol medium for bounded routine/document work, Sol high for connected
implementation, Astra high for difficult architecture/conflicts, xhigh for a specific unresolved hard question.
These are starting choices, not measured project-wide quality rankings. More reasoning cannot replace missing data.
The main chat coordinates decisions; its role does not itself require maximum reasoning for every exchange.
An explicit chat model can override project defaults. No automatic semantic model switch has been implemented.

Use a new topic chat for one separable outcome with its own inputs, completion check and handoff. Stay in the same
chat for corrections to that outcome. One executor at a time; required independent review is a bounded separate
purpose. A new chat is not new subscription quota and has context-transfer overhead. Do not ask every chat to audit
the whole project or repeatedly review the same unchanged evidence. Read small relevant sections, keep large logs
on disk and return compact findings. Record a concrete hypothesis and new evidence before repeating failed attempts.

When allowance is exhausted, files and ordinary programs remain available, but unfamiliar technical work still
needs engineering help. Do not substitute a list of owner-operated commands for that help or promise unlimited
autonomous work. Portable project state allows another qualified executor to continue without asking the owner
to reconstruct technical history. No continuous between-turn monitoring or automatic model routing is implied.

## Find versus create: primary-source checks, 18 October

- [OpenAI usage](https://learn.chatgpt.com/docs/pricing): model, context, reasoning, tools, retrieval and caching
  affect consumption. Local and cloud chats share allowance. API-key use has separate usage pricing; it is not
  a free continuation of an exhausted subscription. Check the live account for actual windows, not a fixed forecast.
- [OpenAI models](https://learn.chatgpt.com/docs/models): higher effort can improve complex work but costs more
  tokens/time; begin at default and raise it for a reason. Our board routing is a project proposal/choice, not a
  vendor guarantee. No unsupported savings multiplier or assistant-versus-Claude quality claim follows.
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer): inspect recorded actions, snapshots and logs.
  For our library-based script, use browserContext.tracing when a recurring browser failure justifies it; avoid
  recording/uploading every passing run. Traces may contain private page/network data; inspect and keep local.
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions): standard
  hosted runs for public repositories and self-hosted usage have different costs from private quotas/larger runners
  and stored artifacts. Existing CI does not use Codex inference, but this is not a promise of zero hosting costs.
- [Ollama on Windows](https://docs.ollama.com/windows): a possible later local-model trial, not a drop-in quality
  replacement. Hardware, memory, model license and useful-task quality have not been evaluated here. Download/storage,
  electricity and maintenance remain costs. Consider one narrow classification/summary task only if ordinary
  search/scripts do not solve it; compare corrections and total effort before adopting. No installation now.

Do not add a vector database, agent orchestration platform, second knowledge base or always-running AI watcher
without a measured gap. Existing indexed files and exact text search are sufficient for the assessed first steps.
Visual or scientific tools should be selected for a concrete room/source/device problem, not installed in anticipation.

## Pilot and stopping condition

Apply P1 using existing records in the owner's first-room trial priority; consent/menu repairs follow their
applicable decisions and affected experience. Add P2 only for an observed repetition. The assistant records
the next 3-5 comparable real tasks as an initial observation,
not a statistically established benchmark. Record model/effort, quota readings with uncertainty, total/rework time,
owner actions, concrete accepted result and remaining untested scope. Compare equivalent outcomes, not raw turns.

Automation is worthwhile when repeated effort avoided exceeds build, maintenance and verification effort over actual
uses. That break-even is unknown until measured; there is no responsible percentage-saving or unlimited-work promise.
Stop process expansion if a helper does not remove a repeated assistant burden or no next real task needs the addition.
Do not run a new full audit to approve this plan. This assessment changed documentation only: no new tool installed,
no model setting changed, no game or provider modified, no purchase or publication.

## Plugin assessment, 18 October 2026

Follow-up: Context7 verified; owner declined paid Scite on 18 October. Current routing below supersedes earlier candidates.
The earlier PubMed dependency failure below was repaired with isolated requests 2.34.2; real title search and
summary retrieval returned PMID 28195523. Later live probes and Context7 status are recorded below; Scite is declined.

Owner asks the assistant to select useful plugins across the whole workflow; he does not know their technical
roles and must not be made their operator. This assessment does not authorize purchases or additional data collection.
Current product priority is the first playable experiment trials, superseding the earlier example queue above.
Verified checkout/HEAD remains the baseline named at the top. No game, configuration or provider changed here.

### Evidence boundary

22 targeted catalog searches returned 45 distinct entries across research, development, graphics, testing,
knowledge, project management and sound. This is a screened subset, not the whole directory or 45 runtime tests.
Search produced irrelevant matches and omitted several items visible in the owner's screenshot. Empty search
does not establish absence. Selected installed manifests/skills and primary vendor documentation were inspected.
Catalog records report GitHub and Google Drive installed; that alone does not verify an account operation.
Research Methodology 1.1.0, Life Sciences Literature 0.1.5 and Healthcare Public Data 0.1.5 have local manifests.
alphaXiv is visible in the screenshot and its public site was read; its connector is not exposed in this chat.
Raw catalog metadata and two bounded local probes are saved outside game files in
C:/Users/admin/.codex/visualizations/2026/10/17/01a14a11-24c9-71c3-afea-a44326478778/plugin-assessment-2026-10-18/catalog-and-probe.json.

### Selection for our tasks

| Tool or family | Concrete role / evidence | Recommendation and limit |
|---|---|---|
| Research Methodology | Local skills for source strategy, evidence review and research handoff | Use for a bounded scientific comparison; it is instructions for the assistant, not an independent researcher or evidence database. Avoid expanding every small question into a full process audit |
| Life Sciences Literature | PubMed publication records, PMC availability/license/retraction metadata, bioRxiv/medRxiv preprints | Useful for room source discovery; PubMed is not all psychology. Installed local helper is not operational in the two tested environments; see probe below. Full methods and replications still need reading |
| Healthcare Public Data | Local manifest lists clinical trials, PubMed, medicine/device and US provider/Medicare sources | Reserve for an actual clinical-trial or health-evidence question. Much of its coverage is unrelated to our current behavioral rooms; do not duplicate every PubMed search |
| GitHub | Catalog describes repositories, PRs and CI; existing repository checks and workflow already present | Core existing connection. Use to inspect concrete changes/checks; preserve limited access and publication boundaries |
| Google Drive | Catalog confirms Drive/Docs/Sheets/Slides integration; local library and index already exist | Core existing connection for cloud materials. Preserve canonical local records; do not make another decision database |
| PDF / spreadsheet / image capabilities | Already available native tools and local skills | Read papers/figures, calculate experiment schedules/results, create visual references when needed. No extra catalog provider required merely for these functions |
| Quest tools, Playwright, existing review tools | package.json and docs/tools.md identify the current path | Use existing technical checks for the room. No catalog tool establishes real headset comfort, exact stimulus timing, scientific validity or owner interest |
| ElevenLabs | Owner's settled sound/voice choice and existing project scripts | Reuse current route when the trial needs voice. No new voice subscription. Access was not tested in this assessment |
| Context7 | Catalog entry; public docs support library/version queries; three.js index found | First technical candidate if local pinned docs and direct official search repeatedly miss needed material. No adoption yet: coverage of our exact A-Frame/three.js versions and benefit remain untested |
| Scite | Catalog entry; citation context and supporting/contrasting/mentioning classifications | Strongest additional research candidate for later citing studies. A classification is not proof of replication; inspect methods. Paid service, so no trial or subscription started |
| alphaXiv | Public site connects papers, researchers and organizations and offers literature assistance | Supplementary discovery; current usefulness and connected retrieval for our ten candidates remain untested. It is not a verified replacement for original papers |
| Firecrawl / TinyFish | Catalog describes page extraction / cloud browser automation | Reserve for a concrete source that existing browser/search cannot retrieve. No credentials, private chats or library bulk upload in this assessment |
| PostHog / Datadog | Catalog analytics/errors/observability; PostHog docs describe session recording | Consider only after a defined real-player error-monitoring need. Additional telemetry is a data-design change, not a harmless plugin toggle; current consent scope is preserved |
| Superpowers | Catalog and maintainer repository describe development workflows | Do not overlay a second general development process on the existing rules/review gates. No project-specific advantage demonstrated |
| Notion / Linear / Asana / Trello / monday / Todoist | Catalog task/page/board management | No new workspace now: existing board and library cover our current single-executor work; migration would add upkeep |
| Product Design / Replit / Lovable / Vercel / Railway | Catalog prototypes, app builders and hosting | No replacement engine/hosting for the first room. A web preview does not establish WebXR or original-method fidelity |
| Supabase / Firebase / MongoDB / Redis / AWS analytics / dbt | Catalog backend and data-management capabilities | No new platform or broad write connector. Existing production data remains read-only; no transfer of player records |
| Language courses / skincare / NGS / school or scholarship tools | Owner screenshot descriptions only | No role demonstrated in current experiment-room task; NGS is sequencing analysis, not a general psychology-paper tool. No verdict on their general quality |
| Commerce, advertising, CRM, meetings and SEO entries | Catalog descriptions | No current room-building need. This excludes Shopify, Ads Manager, Klaviyo, Outreach, Actively, ZoomInfo, Similarweb, Ahrefs, vidIQ, Granola, Plaud and Zoom from adoption now |

### Runtime probe and costs

The local PubMed helper was invoked with a public candidate-paper query, requesting at most three identifiers.
Default python failed before any source request: Windows Python manager has no installed runtime. The bundled
Python then failed with missing_dependency: requests. No successful PubMed call or paper retrieval is claimed.
No system Python or plugin files were changed. Before relying on that helper, supply its dependency in an isolated
environment and rerun; ordinary official-source web access remains an alternative, not proof that the helper works.

[Context7 plans](https://context7.com/plans) and [API guide](https://context7.com/docs/api-guide) describe a free
public-document tier with 1,000 calls/month. Paid figures differ between the plans and search-guide pages observed
today, so no paid-cost forecast is endorsed. [Version handling](https://context7.com/docs/api-reference/search/search-documentation-in-one-request)
can return unverified-version results; inspect that status and original documentation. The
[three.js index](https://context7.com/websites/threejs) is evidence of an index, not tested coverage of our version.

[Scite reports](https://scite.ai/blog/how-do-i-use-the-scite-report-page) classify citation context; counts are
not independent successful replications. [Pricing](https://scite.ai/pricing) shows separate MCP allowances and
a seven-day trial which automatically becomes the chosen paid plan. No account terms, connection, charge or
coverage of our candidate papers was tested. Do not enroll merely to complete a tool inventory.

Other primary checks: [alphaXiv](https://www.alphaxiv.org/),
[Superpowers maintainer](https://github.com/obra/superpowers),
[PostHog session replay](https://posthog.com/docs/session-replay/installation),
[Firecrawl billing source](https://github.com/firecrawl/firecrawl-docs/blob/main/billing.mdx).
Installed manifests and vendor descriptions establish intended capabilities, not delivery, accuracy or savings.

### Action

Use existing source files, official web access, technical checks and the selected relevant skills in the first
room trial. Fix the bounded literature-helper dependency before using that route. Context7 and Scite remain
conditional candidates, not required installations: compare one real task against the existing route before adoption.
The assistant selects and operates tools; the owner judges the room. No new account, purchase, installation,
permission change, agent, background monitor, game edit or subscription-saving claim follows from this assessment.

<a id="plugin-operation"></a>
## Plugin operation: owner request, 18 October follow-up

Latest owner decision, 18 October: no paid Scite; remove it from pending setup. No subscription or trial initiated.
Context7 is enabled in the owner's screenshot and passed real library resolution and documentation retrieval
for A-Frame component play/pause. Selected /aframevr/aframe; returned sources point to master/docs/core/component.md
and entity.md, NOT a verified 1.8.0 snapshot. Before applying examples, compare against the pinned project version.
This confirms working retrieval, not bug-free advice or a repaired menu. Research continues through existing papers,
PubMed and original citing studies; no equivalent automated citation-classification service is claimed.
Use relevant tools, not all plugins on every turn; save useful evidence in the existing library.
Research Methodology, Life Sciences Literature, Drive and GitHub remain the core set. Healthcare Public Data and
alphaXiv are shown disabled in the owner's 18 October screenshot; this is UI evidence, not an uninstall or a
new endpoint probe. Preserve required shared apps.
Life Sciences Literature's PubMed helper now works with bundled Python and requests 2.34.2 installed only into
node_modules/.cache/literature-python (ignored, local, not published). Launch bundled Python, insert that absolute
directory into sys.path, then runpy.run_path the installed ncbi-entrez-skill/scripts/ncbi_entrez.py as __main__,
passing the skill's JSON on stdin. Default python still points to an empty manager; no system PATH change.
Verified real esearch + esummary for PMID 28195523; this proves those calls, not PMC/bioRxiv or scientific validity.
Exact invocation/outputs: plugin-setup-2026-10-18 receipts under this chat's visualizations directory.

<a id="free-tool-closeout"></a>
## Free-tool closeout

[Full evidence and limits, 18 October](free-tool-closeout.md). Split from this note to keep each document under 300 lines.
