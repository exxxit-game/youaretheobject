# Work placement on the owner's laptop

18 October 2026; measured current Windows host, not a generic minimum specification.
Owner requires a responsive laptop and delegates technical operation to the assistant.

## Charter and source order
Goal: keep editing/chat responsive while verifying the first room; reject heavy local browser runs.
Scope: development workload; object: this laptop, existing GitHub workflow and Quest;
subject: rendering location, resource ownership, cost and recovery after a mistaken launch.
Type: descriptive; working knowledge of the pipeline, actual host facts newly inspected.
Questions: Q1 available resources; Q2 where each check belongs; Q3 extra spending; Q4 remaining proof.
Canon: manufacturer/maintainer documentation for intended behaviour (rank 1), official references (2),
this Windows inventory, repository files and GitHub job results for actual state (3).
No stress test, benchmarks, driver changes, new subscription or public release is authorized by this inspection.

## Findings ledger
| ID | Finding | Evidence and scope |
|---|---|---|
| H1 | Lenovo 81DC; Intel i3-7130U, 2 cores/4 logical processors; 11.9 GiB usable RAM | Win32 ComputerSystem/Processor/OperatingSystem, host read 18 October; no serial identifiers collected |
| H2 | Intel HD Graphics 620 and NVIDIA MX110 present | Win32 VideoController; does not establish which GPU a particular app uses |
| H3 | Samsung 119 GiB disk and Seagate 466 GiB disk; C: has 17.2 GiB free of 118.1 | Win32 DiskDrive/LogicalDisk snapshot; not a disk health or thermal test |
| H4 | F: is a 465.8 GiB local volume; G: is labelled Google Drive, 15 GiB | Fresh volume inventory; F: copy is not proof of independent cloud backup |
| H5 | 5.41 GiB RAM available after browser test; CPU load snapshot 52% | One observation, not the peak during the reported stall; no precise causal percentage |
| H6 | The new browser check explicitly selected SwiftShader | tests/lines-smoke.mjs; Chromium documents CPU/software rendering [S1]. It added avoidable CPU work; exact contribution to the stall was not profiled |
| H7 | GitHub already runs npm test and smoke on ubuntu-latest | .github/workflows/test.yml; remote job [S3] succeeded at 2a31874, not the current dirty work |
| H8 | Repository is public; standard hosted compute is free for public repositories | Fresh repository API private=false; [S2]. This is not a claim that every artifact/storage product is unlimited |
| H9 | No lines-smoke/smoke Node process remained at inventory time | Fresh process query after its final exit; no user apps were stopped |
| H10 | Both browser entry points now reject local runs before exports, servers or Chromium | tests/browser-host.mjs, smoke.mjs, lines-smoke.mjs; unit guard checks and actual refused local lines-smoke invocation |

## Scope and object filters
Exclude new cloud desktops, local AI models, GPU rental and laptop upgrades: no present gap justifies a purchase.
Do not change browser/driver performance settings from this snapshot. No claimed thermal, GPU or SSD ceiling.
Exclude cloud software graphics from Quest performance evidence: frames, controllers and comfort need actual Quest.
Exclude training the owner to operate tools; assistant runs checks and explains results. No always-on monitor.

## Work placement
| Work | Location | Assistant responsibility |
|---|---|---|
| Edit code/docs, Git, short numeric/protocol checks | Laptop, one task at a time | Stop if responsiveness degrades; no parallel local heavy processes |
| Full automated browser/VR emulation and regression suite | Existing GitHub-hosted Linux workflow | Submit a coherent tested revision, inspect that revision's result; never spoof hosted variables locally |
| View screenshot/report | Laptop, static artifact | Retrieve CI evidence rather than rerendering locally |
| VR rendering, controller input, sound, frame timing, real comfort | Quest 3 | Use existing review gates and worn-headset protections; laptop only serves files/reads results |
| Literature and source lookup | Existing connectors/public sources | Retrieve bounded relevant sections, not duplicate libraries |
| Backups | Existing local snapshot plus separately verified cloud copy | Identify actual destination; a drive letter or sync icon alone is not restore proof |

No automatic CPU/RAM threshold is presented as a measured safe limit. Resource ownership and single-task
execution are the initial controls. No user app is killed or uninstalled merely because it appears in a process list.
The runtime guard is an accidental-launch safeguard, not an OS sandbox against arbitrary commands.

## Acceptance and remaining work
- Confirmed: hardware inventory; old real remote run; local browser rejection; no purchase or new service.
- Unverified: current first-room revision on GitHub and Quest, sustained comfort/performance, actual cloud restore.
- Next: fix the first trial's practice-review findings, run its coherent revision remotely, then verify on Quest.
- Owner participation: wear the headset and report experience when the prepared version is ready; no coding.

## Sources opened
- S1: https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md
- S2: https://docs.github.com/en/billing/concepts/product-billing/github-actions
- S3: https://github.com/exxxit-game/youaretheobject/actions/runs/39034862486 (17 October, completed success; steps read 18 October)
- S4: https://docs.github.com/en/actions/reference/workflows-and-actions/variables (RUNNER_ENVIRONMENT)

Research steps: canon, charter and descriptive method read; findings ledger above; scope/object filters above;
conclusions limited to the evidence above. Earlier emergency process inspection preceded this bounded research.
