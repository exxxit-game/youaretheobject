# How a lab runs a study, applied to one game room (part 3 of 3: VR practice)

Moved whole from study-methods-2.md to keep files under 300 lines. Same rules: link + short quote;
"unverified" = snippet only. Parts 1-2: study-methods-1.md; study plan, ethics, checklist: study-methods-2.md.

### 5a. VR reporting standard: the Openverse protocols (PNAS 2026) and vrprotocols.org

- Zelderen, Masters-Waage, Affinito, ... Banakou, ... Draschkow ... (2026), "Creating common virtual ground:
  Protocols to democratize open VR research", PNAS 123(26), doi:10.1073/pnas.2524991123 (record and abstract via Europe
  PMC: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1073/pnas.2524991123&format=json&resultType=core).
  Abstract: "an interactive checklist to support VR research from across disciplines to meet three essential
  protocols-interoperability, procedural standardization, and data sharing", "a common, easy-to-evaluate format
  for researchers to present projects to ethics boards, reviewers, and beyond". Full text read (6 pages, the owner
  brought it; PNAS Perspective, published 24 June 2026, CC BY-NC-ND; copy objekt-papers/van-zelderen-2026.pdf, image
  only, no text layer). Built "through a Delphi process". Procedural standardization has five areas: "reporting VR
  procedures, standard battery of measurements, ethics, accessibility, and safety"; VR familiarity is measured
  because "participants' VR experiences ... can strongly predict effect sizes in VR studies". The standards "do not
  adjudicate what is or is not acceptable in human-subjects research - that responsibility lies with ethics
  committees"; "the psychological realism inherent in VR can render scenarios that appear benign in written or video
  form, substantially more intense for participants". Cybersickness: "prioritizing seated experiences with no
  locomotion, restricting the field of view during movement, and blurring dynamic nonsalient regions". For a
  commercial product: "To prevent misuse (e.g., third parties illegally downloading the VR application for commercial
  purposes), researchers may opt to make their assets available only to other researchers upon reasonable request".
  Repository https://github.com/Openverse-OS/VR-Protocols (Zenodo 10.5281/zenodo.19442410). Leads in its references:
  Steed et al. 2023 (distributed and remote MR experiments, Front. Comput. Sci. 4:966319), Draschkow 2022 (remote VR
  and external validity, Nat. Rev. Psychol. 1:433-434), Gonzalez-Franco et al. 2018 (a VR Milgram, PLOS ONE).
- https://www.vrprotocols.org/ (opened in the browser): pillars "Pillar 1: Interoperability", "Pillar 2: Procedural
  Standardisation", "Pillar 3: Data Sharing", plus "Health, Safety, and Ethics"; workflow "Plan Your Project" ->
  "Conduct Research" -> "Audit & Submit" (export a checklist as JSON/Word/PDF, self-audit at the end). The item list
  appears only after ticking badges; the owner ticked all four and exported the checklist (v.0.62, 10.10.2026, 8
  pages; copy in objekt-papers/vrprotocols-checklist-v0.62.pdf). All items "Required". What it asks, and where we
  stand (our reading):
  - Interoperability: common formats and engines, assets listed in a repository with version numbers (engine and
    tools), version control, OpenXR and SDK versions. Ours: public git repo, A-Frame pinned in vendor/; WebXR is the
    browser's standard, not OpenXR itself (to state in the report).
  - Reporting: simulation name and version; trial length incl. breaks; "simulation mode" (on the headset) and
    researcher involvement; "observatory condition" (who watches); HMD make, resolution, field of view, refresh rate;
    the physical space; participant instructions incl. "training or familiarization periods" and their duration;
    the tasks. Ours: at home, unattended, the player's own room: to report as such.
  - Standard battery: a presence measure ("IPQ, SUS, or SPES") and VR familiarity ("Self-rated familiarity, 2 items").
  - Ethics: consent names cybersickness and possible distress, "withdraw at any time without penalty"; informed
    choices on biometric and interaction data; GDPR; "robust encryption ... in transit and at rest"; explicit use and
    reuse of data; IRB approval; distressing scenarios named in the consent; harm mitigation; virtual humans keep out
    of the participant's personal space unless the question needs it.
  - Accessibility: not colour alone; adjustable size and distance; dominant-hand choice; hand or controller and a
    seated alternative; subtitles that can be turned off; few buttons; highlighted interactables; small steps.
  - Safety: 90 Hz or more and 6DoF; IPD set; boundary system; "Avoid leaving ambulatory participants in VR
    unattended" (at home we cannot: a deviation to declare, seated or standing tiers only); audio level; natural
    locomotion; smooth movement; "Gradual Acclimation ... starting with simple, low-intensity tasks" and "Controls
    Training" (the owner's warm-up idea is the standard's own step); a comfort rating told beforehand; rest.
  - Data sharing: rights to share the simulation and assets; readme; the complete simulation and assets; participant
    data as a benchmark; open repository; csv with a codebook; head orientation and other automatic output "in a
    separate file"; analysis reproducible in two steps; the repository link in the paper.
  - Items that appear only for some project features (the full live list the owner sent, and the exported project
    file objekt-papers/vrprotocols-project-v0.62.json): "Detail Deviations" (off OpenXR: name the SDK and the headsets
    it runs on: ours, WebXR in the Quest browser); hardware and software reported; open source for custom software;
    asset EULAs, repurposed or reputable-store assets; controllers and motion tracking described; the code of the
    virtual environment uploaded; sensitive variables removed before sharing; analysis code also in plain text; and
    "Prevent Reidentification": body or eye tracking never combined with other data that could re-identify a person.
- Other checklists (both read): Skorupska et al. 2021, "All Factors Should Matter! Reference Checklist for
  Describing Research Conditions in Pursuit of Comparable IVR Experiments" (arXiv preprint,
  https://arxiv.org/abs/2101.01285): "a ready-to-use reference tool" covering "key hardware, software and human
  factors". VR-Check (Krohn et al. 2020, J Med Internet Res 22(4):e16724, https://pmc.ncbi.nlm.nih.gov/articles/PMC7215516/):
  "10 main evaluation dimensions" for clinical neuropsychology VR paradigms (domain specificity, ecological
  relevance, technical and user feasibility, user motivation, task adaptability, performance quantification,
  immersive capacities, training feasibility, predictable pitfalls).
- For a game room: run the room through vrprotocols.org's checklist (all four badges) and keep the exported JSON
  with the room's preregistration; it is the newest field standard and is aimed at ethics boards and reviewers.

### 5b. Simulator sickness: how the SSQ is meant to be used (Kennedy et al. 1993; local objekt-papers/kennedy-1993.txt)

- Int. J. Aviation Psychology. Scoring weights in the paper: Nausea = [1] x 9.54; Oculomotor = [2] x 7.58;
  Disorientation = [3] x 13.92; Total = ([1]+[2]+[3]) x 3.74.
- Pre-screen: a "pre-exposure checklist" asked whether people were "sick" or not in their "usual state of fitness";
  "Records from subjects who reported themselves as 'other than healthy' were excluded"; the scoring "is intended
  only for application to postexposure symptoms, with the further precondition that a screening of 'unhealthy'
  subjects is required".
- For a game room: one pre-room question ("feeling well right now?"); a no answer = play allowed, run not used for
  science; the full 16-item SSQ is too long for every room (our reading); a short post-room sickness item plus
  drop-out logging (06-science.md, Pan & Hamilton; Mottelson 2021) is the practical minimum. Presence: IPQ details are
  in 06-science.md (not repeated).

### 5c/5d. Frame rate, tracking loss, interruptions, play area: what WebXR itself reports (W3C spec, read)

- WebXR Device API, W3C Candidate Recommendation Snapshot, https://immersive-web.github.io/webxr/
- Frame rate: "The frameRate attribute reflects the internal nominal framerate"; supportedFrameRates "returns a list
  of supported target frame rate values"; updateTargetFrameRate(rate) sets the target. -> log the nominal rate and the
  measured frame times per run.
- Interruptions: visibilityState "visible" / "visible-blurred" (seen but "not the primary focus", input not
  processed) / "hidden" (imagery "cannot be seen by the user", frame callbacks pause). -> log every state change
  with time; a run with "hidden" during the critical moment is flagged (headset off or system menu).
- Tracking quality: emulatedPosition "is false when the transform represents an actively tracked 6DoF pose ... or
  true if its position value includes a computed offset, such as that provided by a neck or arm model". -> log the
  flag per frame for head and each hand.
- Tracking loss / recentre: a "reset" event fires on "discontinuities of the native origin", e.g. "After user
  recalibration of their XR device or if the XR device automatically shifts its origin after losing and regaining
  tracking", and when boundsGeometry changes; not for momentary loss "within the same tracking area".
- Play area: boundsGeometry "MUST report an empty array" during "extended periods of tracking loss"; bounded-floor
  "Always requires consent". -> log reference-space type and bounds size if granted.
- Session end is "permanent and irreversible" ("end" event): log it; an ended-early run is a drop-out, reported per
  condition (Mottelson 2021 checklist, 06-science.md).
- Hardware differences (06-science.md, not repeated): absolute performance depended on hardware (Mottelson &
  Hornbaek 2017); built-in timing off by about 55 ms in a native engine (Wiesing et al. 2020); browser RT delays
  70-120 ms (Anwyl-Irvine et al. 2021) -> compare conditions within the same device type; log device model.
