# How a lab runs a study, applied to one game room (part 2 of 3: study plan, ethics, checklist)

Part 1 (seriousness, data quality) is in study-methods-1.md; part 5 (VR practice) in study-methods-3.md. Same rules: link + short quote; "unverified" = snippet only.

### 3a. Preregistration: AsPredicted's eight questions (read from its own example PDF)

- https://aspredicted.org/ : "Pre-registration remains private until an author makes it public"; public ones
  "cannot be modified and are automatically backed up in the Web Archive"; "single page PDFs that are time-stamped
  and include a unique URL for verification". Cost (Help page, https://aspredicted.org/help): "we are a free
  service and receive about 200 submissions a day".
- Questions, verbatim from the example https://aspredicted.org/kv692.pdf :
  1 "Have any data been collected for this study already?"
  2 "What's the main question being asked or hypothesis being tested in this study?"
  3 "Describe the key dependent variable(s) specifying how they will be measured."
  4 "How many and which conditions will participants be assigned to?"
  5 "Specify exactly which analyses you will conduct to examine the main question/hypothesis."
  6 "Describe exactly how outliers will be defined and handled, and your precise rule(s) for excluding observations."
  7 "How many observations will be collected or what will determine sample size?"
  8 "Anything else you would like to pre-register?"
- The example screens out people who fail an attention check before the dependent variable is asked (screening, not
  post-hoc exclusion): the same pattern as a playable instruction check before the critical moment in a room.
- For a game room: one AsPredicted form per room, filed before the room's data are used for science (Q1 must be
  answerable "no data looked at"); data from the free floor played before the filing count as pilot only.

### 3a (cont.). OSF registration templates (OSF help page)

- https://help.osf.io/article/229-select-a-registration-template : "OSF Preregistration": "Standard, comprehensive,
  and general purpose preregistration form"; "Preregistration Template from AsPredicted.org": "Eight questions derived
  from content recommended by AsPredicted.org"; and, directly for us, "Replication Recipe (Brandt et al., 2013):
  Pre-registration": "Register a replication study with a series of questions regarding the original work" (plus a
  Post-Completion version). Also "Registered Report Protocol Preregistration" (after in-principle acceptance).
- Embargo "for up to four years"; a registration "can never be edited or deleted" (it can be withdrawn).
- For a game room that recreates a classic study: the Replication Recipe template fits (each room = a replication
  of a named original); a new-twist room (our own variation) uses OSF Preregistration or AsPredicted.

### 3b. Registered reports (Center for Open Science page)

- https://www.cos.io/initiatives/registered-reports : "methods and proposed analyses are pre-registered and
  peer-reviewed prior to research being conducted". Stage 1 = Introduction, Methods, pilot data, judged on "the
  importance of the research question and the quality of methodology"; on passing, in-principle acceptance: the
  journal "virtually guarantees publication" if the protocol is followed. Stage 2 cannot be rejected because results
  are "surprising, counterintuitive, or unappealing"; unplanned analyses go to "Exploratory Analyses". "over 300"
  journals offer the format.
- For us: the route to publication once a university partner and ethics approval exist; the room's design is fixed
  and reviewed BEFORE data that count are collected.

### 3c. Sample size and power (Lakens, Improving Your Statistical Inferences, ch. 8, online book)

- https://lakens.github.io/statistical_inferences/08-samplesizejustification.html (the journal version, Lakens 2022,
  Collabra: Psychology 8(1):33267, since read from the owner's copy, objekt-papers/lakens-2022.txt: the same six
  approaches, and the questions to answer: "what the smallest effect size of interest is", "which effect sizes they
  expect (and what they base these expectations on)", "which ranges of effects a study has sufficient power to detect").
- Six ways to justify N: "Measure entire population", "Resource constraints", "Accuracy", "A-priori power analysis",
  "Heuristics", "No justification".
- Smallest effect size of interest: "can be based on theoretical predictions or practical considerations".
- Using the original paper's effect for power only if "the previous study is sufficiently similar", "there was a low
  risk of bias", and "the sample size is large enough to yield a relatively accurate effect size estimate"
  (classic small-sample studies usually fail the third: our reading).
- Small telescopes heuristic for replications: "design replication studies that have 2.5 times as large sample
  sizes as the original study, as this provides 80% power for an equivalence test against an equivalence bound set
  to the effect the original study had 33% power to detect, assuming the true effect size is 0."
- Simonsohn (2015), "Small Telescopes: Detectability and the Evaluation of Replication Results", Psychological
  Science 26(5):559-569, doi:10.1177/0956797614567341; abstract (APS page,
  https://www.psychologicalscience.org/journals/psychological-science/0956797614567341/): tests whether replication
  results are consistent with "an effect size big enough to have been detectable in the original study"; separates
  replications "that are too noisy" from those showing the effect is "undetectably different from zero". Its
  supplement (the owner brought it; objekt-papers/simonsohn-2015-supplement.txt): d33% is the effect the original
  had 33% power to detect (for n = 30 per cell, "d=.401"); "replications with 2.5*original sample size have 80% power
  to reject d33%".
- For a game room: N per room = max(2.5 x original N, N from an a-priori power analysis on a smallest effect of
  interest), counted AFTER exclusions and first runs only; then inflate for the expected exclusion rate (2e).

### 3e. Judging a replication: Many Labs 2 (APS Observer report)

- https://www.psychologicalscience.org/observer/replications-dont-hinge-on-sample-and-setting-differences-multilab-project-shows :
  samples "on average were more than 60 times larger than the original samples"; procedures "peer-reviewed in
  advance by experts and, in some cases, authors on the original work"; 14 of 28 replicated, "some at variable
  degrees across the different labs"; framing effect "only half as strong".
- The paper itself (Klein et al. 2018, AMPPS 1(4):443-490; the owner brought it; objekt-papers/klein-2018.txt):
  "There is no simple decision rule for declaring success or failure in replication"; five criteria, each "whether
  the observed effect size would be considered statistically significant": the replication data at p < .05 (54%)
  or p < .0001 (50%), or the observed effect at the original N, at 2.5 x the original N, or at 50 per group, p < .05
  (41%, 44%, 35%). "Ten of the effects (36%) were successfully replicated according to all the criteria", 13 (46%)
  failed all, 5 (18%) varied. Median d in WEIRD samples "0.60 for the original findings and 0.15 for the
  replications"; 21 of 28 replication effects smaller than the original; 9 in the opposite direction.
- Practice to copy: show the room's protocol to an outside expert (ideally an original author) before data count;
  report the effect with its CI next to the original, plus the small-telescopes test (3c).

### 4a. APA Ethics Code, exact text (local objekt-papers/apa-ethics-code-2017.txt; "Effective January 1, 2017")

- 8.02(a) consent tells: "(1) the purpose of the research, expected duration, and procedures; (2) their right to
  decline to participate and to withdraw ... (3) the foreseeable consequences of declining or withdrawing; (4) ...
  potential risks, discomfort, or adverse effects; (5) any prospective research benefits; (6) limits of
  confidentiality; (7) incentives for participation; and (8) whom to contact for questions".
- 8.05: consent may be dispensed with only where research "would not reasonably be assumed to create distress or
  harm" and involves e.g. "only anonymous questionnaires, naturalistic observations, or archival research". A VR
  experiment with a manipulation is not in that list: consent is needed (our reading).
- 8.07(a) deception only if "justified by the study's significant prospective scientific, educational, or applied
  value and that effective nondeceptive alternative procedures are not feasible"; (b) never about research "reasonably
  expected to cause physical pain or severe emotional distress"; (c) explain deception "as early as is feasible,
  preferably at the conclusion of their participation, but no later than at the conclusion of the data collection,
  and permit participants to withdraw their data".
- 8.08(a) "a prompt opportunity for participants to obtain appropriate information about the nature, results, and
  conclusions of the research" and correct misconceptions; (b) if delaying, "reasonable measures to reduce the risk
  of harm"; (c) if harmed, "reasonable steps to minimize the harm".
- For a game room: 8.07(c) maps onto the reveal at the end of the room AND a "withdraw my data from this room" button
  on the reveal screen; 8.08(a) "results and conclusions" = the original study's findings shown in the reveal.

### 4b. BPS (local objekt-papers/bps-2021-code.txt, bps-2021-imr.txt; basics already in 06-science.md)

- Withholding vs lying: "There is a difference between withholding some of the details of the hypothesis under test
  and deliberately falsely informing the participants of the purpose of the research"; if the reveal is "likely to
  lead to discomfort, anger or objections" the deception "is inappropriate".
- Online gaming is named: research on rewards "might include the use of online gaming. There is often a degree of
  deception involved ... Suitable debriefing will be required."
- Mood repair: after inducing negative mood, "it would be ethical to induce a happy mood state before the
  participant leaves".
- IMR: a "Quit study" button "which can lead to a debrief page" so people who leave early still get the debrief; an
  "exit" on each page, then ask "whether their partial data can be used".

### 4c. Suspicion probes and funnel debriefing (Blackhart, Brown, Clark, Pierce & Shell 2012; local objekt-papers/blackhart-2012.txt)

- Behavior Research Methods 44:24-40, doi:10.3758/s13428-011-0132-6. Survey of 77 deception researchers: most ask
  "what they thought the study was about"; 21% also ask whether anything was "weird, strange, odd, or out of place";
  "55%" use "a funnel debriefing, beginning with very basic questions (e.g., 'Do you have any questions about the
  study?') and ending with more specific questions about the study before debriefing participants"; 23% run the
  inquiry "on the computer".
- Their integrity preface (tested on 624 people): "Your answers to these questions will in no way affect the
  research credit you will receive, nor how we use your data. We just want to ensure that the design of the study is
  sound"; the authors say it "could have used stronger language".
- Conclusion: the post-experimental inquiry "does not appear to be able to reliably and accurately assess
  participant suspicion and awareness" (so: measure suspicion, analyse it as a moderator; do not trust it as a filter).
- Bargh & Chartrand (2000), Reis & Judd Handbook pp. 253-285 (READ pp. 7-8 and Table 2 of the scanned manuscript,
  https://acmelab.yale.edu/sites/default/files/2000_studying_the_mind_in_the_middle.pdf; excerpt objekt-papers/bargh-2000.txt):
  "The best way of doing this is through a 'funneled debriefing'"; Table 2 runs from "What do you think the purpose
  of this experiment was?" through "were related in any way?" to the specific stimulus; any answer "in the ballpark"
  excludes the run; alarm if "upwards of 5% or so" show awareness.

### 5. VR practice (5a-5d): moved whole to [study-methods-3.md](study-methods-3.md)

### 3d. Randomisation, counterbalancing, within vs between (from texts read)

- Within-design exposure lowers effects: Chandler et al. 2015 (local): attenuation was strongest when people saw the
  other condition, "analogous to participating once in a within-participant experiment (Greenwald, 1976)". -> a
  deception or one-shot room is between-subjects: one condition per player, first run only.
- Between-design cost: Lumsden et al. 2016: a between design "confounds hardware/individual differences with
  effects caused by the task variant", offset by "the large sample size" online. -> stratify or block by device model.
- Simple randomisation in the wild leaves cells unequal: Steed et al. 2016 (local): "participants are randomly
  assigned and are not matched in any way. Thus the conditions are not balanced." -> assign in shuffled blocks.
  The trial standard asks for exactly this report (CONSORT 2025, Nature Medicine supplement, read,
  doi:10.1038/s41591-025-03635-5): item 17b "Type of randomisation and details of any restriction (e.g.,
  stratification, blocking and block size)" (was 2010 item 8b); also whether block sizes were "fixed or randomly varied".
- Position and order: counterbalance left/right and order of options within the room (the two-phones sketch in
  own-experiments-now.md already does this); log the assigned side/order.
- Charness, Gneezy & Kuhn (2012), J. Economic Behavior & Organization 81(1):1-8, doi:10.1016/j.jebo.2011.08.009:
  abstract read (https://ideas.repec.org/a/eee/jeborg/v81y2012i1p1-8.html): "both designs have their merits, and
  the choice of designs should be carefully considered". "More conservative" and stronger demand effects within:
  not in the abstract; full text for ScienceDirect subscribers only (two PDFs tried were Charness's CV): unverified.

## 6. Checklist: how a lab runs a study, applied to one game room

Each step: what to do -> source (file section; 5a-5d are in study-methods-3.md). "Ours" = our adaptation where no
source sets the detail.

1. Choose the original study and read it in full; note its N, effect size, procedure, exclusions -> project rule;
   Lakens ch. 8 (3c) for whether its effect can drive power.
2. Decide what is replicated exactly and what changes for VR; write it as a Replication Recipe -> OSF template (3a).
3. Fix the design: between-subjects for one-shot or deception rooms; first run per player only; conditions in shuffled
   blocks, stratified by device; counterbalance sides/order -> Chandler 2015, Steed 2016, Lumsden 2016 (3d, 2c).
4. Set N: max(2.5 x original N, a-priori power on a smallest effect of interest), after exclusions; recruit
   1.2-1.35 x for exclusions -> Lakens/Simonsohn (3c), Mottelson 2021, Chandler 2015 (2e).
5. Write exclusion rules before any data: instruction check failed, nonserious answer, felt unwell, "hidden" or
   tracking loss during the critical moment, run ended early, repeat run, admitted trick, prior knowledge of the
   classic -> Aust 2013, AsPredicted Q6, Kennedy 1993, WebXR spec (1a, 3a, 5b, 5c).
6. Preregister (AsPredicted 8 questions or OSF) before the data count; for a journal, a registered report Stage 1
   -> AsPredicted, OSF, COS (3a, 3b).
7. Ethics: approval by an IRB/REC before science use; deception only if justified and no alternative; no pain or
   severe distress -> APA 8.07(a)(b); BPS 7; ethics routes in own-experiments-now.md 4a.
8. Run the room through the VR Protocols checklist (all badges); keep the JSON with the preregistration ->
   Openverse 2026, vrprotocols.org (5a).
9. Consent screen with the eight APA 8.02 elements, stating that some details are withheld until the end -> APA
   8.02(a); BPS 4.1 (4a, 4b).
10. Pre-room health question ("feeling well?") -> Kennedy 1993 (5b).
11. Commitment request ("play it for real?") -> Geisen 2022 (1b); not a pledge -> Kristal 2020 (1b).
12. Practice + playable instruction check that repeats until done right -> Oppenheimer 2009 (1d).
13. The critical moment: same stimulus timing/readability as the paper; no points or decoration on the measured
    response -> Lumsden 2016 (1e).
14. Log: condition, side/order, run number, device model, nominal frame rate and frame times, visibilityState
    changes, emulatedPosition flags, reset events, session end, time on task -> WebXR spec (5c); Mottelson 2021
    checklist (06-science.md).
15. Quit button on every screen that leads to the reveal/debrief -> BPS IMR (4b).
16. Before the reveal: suspicion probe, open first ("what do you think this room was testing?", "anything odd?"),
    then prior knowledge of the classic; with a no-consequence preface -> Blackhart 2012 (4c); Orne 1962 (06-science.md).
17. Seriousness question at the end with "don't count it" -> Aust 2013 (1a); no-blame distraction/trick question +
    comment -> Reinecke & Gajos 2015 (1f).
18. Reveal = debrief: what was hidden and why, the original findings, how the player compares with other players;
    name the specific manipulation; mood repair if needed -> APA 8.07(c), 8.08(a); BPS 10; Greenspan & Loftus 2022
    (06-science.md); LabintheWild feedback (1f).
19. After the reveal: "withdraw my data from this room" -> APA 8.07(c); BPS IMR (4a, 4b).
20. Analyse exactly as preregistered; exploratory analyses labelled; suspicion as a moderator, not a silent filter ->
    COS (3b); Blackhart 2012 (4c).
21. Judge the replication: effect with CI next to the original, plus the small-telescopes test; report exclusions and
    drop-outs per condition -> Simonsohn 2015, Lakens ch. 8 (3c); Mottelson 2021.
22. Treat the sample as players, not people ("you vs other players"); state it is a self-selected convenience
    sample; stay alert to automated runs -> Westwood 2025 (2b); Mottelson 2021 demographics (06-science.md).

## Not reached / unverified (parts 2-3)

- Since read: Hauser & Schwarz 2015, Lakens 2022, Openverse 2026 (5a), CONSORT 2025 (3d), Bargh & Chartrand 2000
  (4c), Skorupska 2021 and VR-Check (5a), AsPredicted price (3a, free).
- Closed access (OpenAlex, 10.10.2026): Simonsohn 2015 full text (abstract and supplement read, 3c); Charness et
  al. 2012 (abstract read, 3d); Meade & Craig 2012. Ward & Meade 2023: open but behind a bot check (owner).
  Curran 2016: open copy https://osf.io/6dkhm, not read (page budget).
