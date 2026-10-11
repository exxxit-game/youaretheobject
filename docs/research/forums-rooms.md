# Running psychology experiments in VR and in the browser: what practitioners write (2026-10-11)

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): researchers who ran experiments in VR and in the browser (shelf 7, rooms). Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Weight: (a) several practitioners agree, (b) one source, (c) contradicted. Pre-2018 = possibly stale.
Each point: link, date, short quote, then "For us:" one line naming our file.

## Parts (each gets an answer or "not found")
1. What changes when a lab experiment moves to VR / unsupervised browser (attention, timing, demand characteristics, presence)
2. Keeping it short and engaging without breaking the procedure
3. Instructions and comprehension checks without an experimenter
4. Deception and debriefing done remotely
5. Measures that survive VR (reaction times; questionnaires in VR vs after)
6. Consent and age checks in a game
7. What made participants quit (dropout, cybersickness)
8. Replications in VR that failed or succeeded, and why

Sources to cover: library (objekt-files/papers, docs/cards), PsychoPy/Pavlovia discourse, jsPsych GitHub discussions,
Gorilla/Prolific blogs, BRM methods papers' lessons-learned, VR research toolkits (UXF, VREX, Toggle, OpenXR kits) and
issue trackers, VR lab talks, open-science posts; other languages (German, Dutch, Japanese).

## Findings

### F1. Steed et al. (UCL VR lab), "Some Lessons Learned Running VR Experiments Out of the Laboratory", arXiv 2104.05359, April 2021 — library: steed-2021.txt; https://arxiv.org/abs/2104.05359
Experience: UCL Computer Science VR group (Steed: decades of VR experiments; ran the 2016 in-the-wild Gear VR study). Weight (a) with Mottelson/Rivu below.
- Parts 1/3: "protocols have to be self-running, self-documenting and robust to user behaviour"; "we cannot directly observe the participant as they go through any pre-trial tutorial phase". Apps "must include their own tutorials".
- Part 3/5: "User interfaces, especially if they involve questionnaires or other data entry need extensive testing."
- Part 4: "We direct participants to debriefing and often provide a simple summary of what happened within the applications at the end."
- Part 6: ethics approval "allows for short-form instruction and consent in-app as long as participants can also access a long-form version online".
- Part 1 (compliance): monitored that participants "were active and looking in plausible directions"; removed questionnaires "answered too quickly or answered the same value for each question"; balanced (reversed) questions.
- Part 1 (space/sickness): experiments "designed to be used sat down" because room size unknown; "avoided travel techniques whenever possible".
- Part 1 (timing bug): "make sure you use the correct clock"; "Unity pauses the default timer when the HMD is removed, so logged time might not match elapsed absolute time"; "we don't make the experiments too long".
- Part 8/sampling: "we no longer plan any experiment where we expect participants to be naive" (owners of headsets skew to early adopters).
- Repeat players: cannot prevent repeats, "but we can ensure that we iterate through different conditions"; server distributes condition config to balance cells.
For us: docs/rooms/01-control.md already voids trials when the headset menu hides the page; check that every room logs wall-clock (performance.now + Date) not only the XR frame clock (docs/rooms.md, report.js of each room); the room recipe's "playable practice step" (.claude/skills/new-room/SKILL.md) matches "must include their own tutorials".

### F2. Mottelson, Petersen, Lilija & Makransky (Univ. Copenhagen, Psychology + CS), "Conducting Unsupervised VR User Studies Online", Frontiers in VR, 28 May 2021 — library: mottelson-2021.txt; https://doi.org/10.3389/frvir.2021.681482
Experience: two unsupervised Quest studies with an identical lab replication (Study I). Weight (a).
- Part 1/7 (inattention): online "about 13% of the cohort did not pay an ideal amount of attention" vs "3%" in the lab; "We estimate an approximate 10% ill-intended user participation".
- Part 5 (questionnaires in VR): in-VR survey reliability (Cronbach's alpha) online, lab and original validation "all fall into the category 'Good consistency'"; lab gave the largest effect sizes "presumably because of a reduced number of aberrant responses".
- Part 1/7 checklist (quoted list): "Check if HMD was taken off"; "Store ... (or hash of) to avoid multiple participation"; "Report the number of drop-outs ... and ensure these are not skewed by experimental manipulation"; "Measure duration and flag outliers, e.g., M ± 3 SD"; "Define objective exclusion criteria before collecting data based on the pilot study"; "Ask about tracking issues, distractions, or completion".
- Part 6: consent taken in the desktop browser before install; "We do not see any technical reason why informed consent could not be prompted upon opening the application".
- Part 8/sample: participants mostly "expert users with more than fifty previous uses"; Peck et al. 2020: female under-representation biases sickness results; "claims about generalizability should be avoided".
- Condition assignment on device vs server: server balancing "could however have implications for validity if certain conditions lead to higher drop-out rate".
For us: docs/methodology.md "Technical quality / exclusions" row already logs pauses; add "dropouts per condition reported" and "duration outliers M±3SD" to the preregistration plan (SKILL.md recipe step 8); hashed device id fits the owner's hashed-IP rule (docs/owner-decisions.md, Data).

### F3. Steed, Frlston, Lopez, Drummond, Pan & Swapp (UCL), "An 'In the Wild' Experiment on Presence and Embodiment using Consumer VR Equipment", IEEE TVCG 22(4), April 2016 — library: steed-2016.txt; https://doi.org/10.1109/TVCG.2016.2518135  [pre-2018: possibly stale; Gear VR/Cardboard era]
Weight (b) on boredom; (a) on long in-VR questionnaires (with F1, F4).
- Part 7 (who quit): "115 people agreed to data collection ... Of these, 85 formed complete sets"; 26 more rejected (test versions, control question, "making the same score repeatedly"); 59 sets, "a rate of approximately 15%" of installs.
- Part 2/7 (boredom): feedback "that the song was quite long and there was not much to do"; "some participants who did not complete the second questionnaire had actually become bored and stopped"; "we already made the performance quite short by shortening the song".
- Part 5: "feedback that the second questionnaire was quite long"; and authors "do not recommend adopting only those questions we found useful" (do not cut validated scales ad hoc).
- Part 1/3: "They can choose not to follow instructions, or might not have understood them completely ... Logging and examining behaviour data will be necessary."
- Part 4/ethics: "we chose a non-threatening environment partly because of the risk of scaring an individual who might react negatively or even injure themselves".
- Competition: participants choosing experiences on consumer devices means "an issue of competition" with commercial content.
For us: room 01's fate (docs/rooms/01-control.md, set aside as long and boring) is the same failure Steed saw: passive waiting + long post-questionnaire = the drop point; keep room questionnaires short (docs/rooms.md "scale.js") and count completion per step in report.js.

### F4. Ratcliffe, Soave, Bryan-Kinns, Tokarchuk & Farkhatdinov (Queen Mary Univ. London), "Extended Reality (XR) Remote Research: a Survey of Drawbacks and Opportunities", CHI 2021, May 2021 — library: ratcliffe-2021.txt; https://doi.org/10.1145/3411764.3445170
Experience: survey of 46 XR researchers (30 items). Weight (a) as a survey of practitioners.
- Part 3: "Twenty-four respondents felt that guidance would be better provided ... in a lab setting that also allows ad-hoc guidance and real-time corrections."
- Part 1: remote participants "may not take it seriously"; but others: in-lab experience "overly formal and uncomfortable" (R32) (c: contested).
- Part 1 (environment): "one user reported walking into their whiteboard multiple times, causing low presence scores."
- Part 4 (debriefing): R31: "Debriefing is such a good space to collect unstructured interview data"; unsupervised participants rarely give feedback: "few took the initiative" (R20).
- Part 5: "a difference on the variability of presence when participants recorded it from inside the VR experience versus outside" (citing Schwind et al. 2019).
- Part 1 (hardware): "frame-rates, graphic fidelity, tracking quality and even resolution can vary dramatically".
- Part 7 (safety): "questions about the responsibility of researchers to be present to aid participants who could be made to feel unwell".
For us: the open "what did you notice" debrief has no human to pull answers: keep funnel questions as tap choices (docs/methodology.md, funnel debriefing row); log frame rate per trial (docs/methodology.md VR reporting row already says so).

### F5. Cesanek, Shivkumar, Ingram & Wolpert (Columbia, Wolpert lab), "Ouvrai opens access to remote VR studies of human behavioural neuroscience", Nature Human Behaviour 8:1209-1224, 2024 — library: cesanek-2024.txt; https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/ ; tool: https://github.com/evancesanek/ouvrai
Experience: maintainers of an open WebXR (browser) study toolkit; three remote motor-learning experiments via Prolific. Weight (b) for browser WebXR (the closest to our stack), (a) with F1/F2 on remote viability.
- Part 1 (why the browser): app-based kits "must either be distributed ... as executables ... or ... APK files to be sideloaded"; store deployment "can add considerable delays"; Unity "was not a viable solution for online studies".
- Part 5 (timing): logging per rendered frame: "if there are no dropped frames, sampling frequency will match the device refresh rate"; "Desktop and mobile refresh rates are typically 60 Hz, but dropped frames are common in practice."
- Part 5 (latency): Quest 2 running an Ouvrai (browser) experiment: "a latency of 8.3 ms" motion-to-photon, "achieved with motion prediction".
- Part 8 (succeeded): remote browser-VR reproduced classic motor-learning signatures (spontaneous recovery, dual adaptation) with 30 Prolific participants from "14 different countries".
For us: our stack (A-Frame/WebXR in the Quest browser) is the same class as Ouvrai; log a frame timestamp and dropped-frame count with every measured event (docs/methodology.md "Raw data" row); its open code is a reference for per-frame logging (docs/rooms.md report.js).

### F6. Part 8 — VR replications of classic social experiments (library)
(a) Kyrlitsias & Michael-Grigoriou (GET Lab, Cyprus Univ. of Technology), Asch in immersive VR with agents, Comput Anim Virtual Worlds 2018 (library kyrlitsias-2018.txt, https://doi.org/10.1002/cav.1804) and the follow-up Kyrlitsias et al., Frontiers in Psychology, 8 Sep 2020 (kyrlitsias-2020.txt, https://doi.org/10.3389/fpsyg.2020.02254). Weight (b) one lab, two studies.
- Failed first: Exp. 1 "participants' response time was affected by the virtual agents' answers ... but the participants' judgments were not affected"; "only 7.69% of participants in Kyrlitsias and Michael-Grigoriou (2018) conformed".
- Worked after changes to the procedure: "we increased the task difficulty and also reduced the sense of anonymity" ("we limited the trial card projection duration") -> "63.16% of this study".
- Exclusion: "two participants were excluded as they were aware of the original Asch experiment".
For us: a scripted-agent version of a social classic may not reproduce the effect at the original's task difficulty; a change made to rescue it is a deviation for the room's spec table (docs/rooms/NN.md "deviations"), and prior knowledge must be asked (already: docs/rooms/01-control.md deviation 8).

(b) Gonzalez-Franco, Slater, Birney, Swapp, Haslam & Reicher, "Participant concerns for the Learner in a VR replication of the Milgram obedience study", PLOS ONE, 31 Dec 2018 (gonzalez-franco-2018.txt, https://doi.org/10.1371/journal.pone.0209704); builds on Slater et al. 2006 PLoS ONE (slater-2006.txt) [2006: possibly stale]. Weight (b).
- Earlier VR study: participants respond "in ways that mirror the experience and behaviour of those in Milgram's original studies—albeit with somewhat lesser level of intensity and higher absolute levels of obedience".
- Quit: "In an earlier VR study [18] 6 out of 23 participants ... withdrew"; "In the present study 6 of the 40 participants withdrew early".
- Consent/withdrawal: told they could withdraw "several times, in writing and verbally"; debrief = "semi-structured interview".
For us: VR gives the direction of a classic effect with weaker intensity; reveal pages comparing the player to the original (SKILL.md recipe step 7) should say so where the VR replication literature shows it.

### F7. Gottsacker, Bruder, Zielasko, ... Coles, Peck, Bailenson, Welch, "Beyond the Lab: Large-Scale Remote Cybersickness Research in VR Using the VERA Platform", arXiv:2609.26203, 4 Sep 2026 (preprint, IEEE TVCG format) — library: gottsacker-2026.txt; https://arxiv.org/abs/2609.26203
Experience: UCF/Stanford/DTU VR labs; VERA = NSF-funded remote VR research platform; WebXR or Quest builds via Prolific. Weight (b) (one study) but large N; preprint = not yet peer reviewed.
- Part 7 (where people quit): "912 completed the pre-experiment questionnaire"; "381 participants launched the VR experience"; "288 completed the full session"; "Of the 93 participants who launched the experience but did not complete the full session, 81 exited before the motion stimulation began"; "only 4 participants quit during the motion stimulation itself". Final sample 263 of 912 = "28.8%".
- Part 8 (succeeded remotely): remote vs in-lab "cybersickness outcomes were consistent in direction and temporal pattern"; deviations from the lab protocol listed openly ("deviating from its protocol in two respects").
- Part 5 (in-VR questionnaires): SSQ "in VR using their hand-held controller" before and after; FMS 0-10 every 30 s, original "0 to 20 range" adapted "to make it more intuitive".
- Part 1 (data quality): 10 removed for "an explicit attention-check question or a demographic response that was out of range or impossible (including one age value in the tens of thousands ...)".
- Part 6/7 safety: "If they reported a score of 10, the experiment would be stopped immediately, and they were made aware of this."
For us: the biggest loss is between the 2D page and putting the headset on and before the measured part starts, not during it: our corridor (src/app/lobby/lobby.js arrival, consent) is that stretch; log a step counter for each arrival step so the drop point is visible (docs/methodology.md, Technical quality row). Range-check typed or picked demographics in report.js.

### F8. Prolific researcher help (platform rules distilled from running thousands of online studies)
Weight (a) as a platform norm (not a study). Pages read 2026-10-11.
(a) "Why do you need checks in your study?" last updated 19 Nov 2025 — https://researcher-help.prolific.com/en/article/fb63bb
- Part 3: comprehension checks "cannot involve free-text responses"; "Participants must be given at least two chances to get a correct answer"; "Comprehension checks must be given at the start of the study"; "Participants must be free to re-read the key information at the time the comprehension check is presented"; "Time limits or internal measures are not permitted for attention or comprehension checks"; use only when "without it, the task couldn't be completed properly".
- Part 1/3: attention checks allowed are only IMCs and nonsensical questions; for studies of 5 minutes or longer "participants must fail at least two checks to be rejected"; checks "shouldn't rely on speed".
(b) "Can I run studies that deceive participants?" last updated 13 Mar 2026 — https://researcher-help.prolific.com/en/articles/445176-can-i-run-studies-that-deceive-participants
- Part 4: deception only when "methodologically necessary"; debriefs must explain the true purpose and how deception was used; participants "should also be given the opportunity to withdraw consent after debriefing"; those who "withdraw or time out must still be debriefed".
- Part 6: studies "must not collect or simulate the collection of personally identifiable information" (fake age verification named as an example of what is not allowed).
For us: room 01's "(Russian text: see the source) / (Russian text: see the source) buttons with re-reading (docs/rooms/01-control.md deviation 4) already fit; add: re-read allowed while the check is shown, no timer on the check, at least two tries. The reveal (SKILL.md step 7) must offer "remove my data" after the deception is explained, and a player who quits mid-room must still get the debrief (src/app/lobby left-early choice).

### F9. Huber & Gajos (Harvard, LabintheWild), "Conducting online virtual environment experiments with uncompensated, unsupervised samples", PLOS ONE 15(1): e0227629, 30 Jan 2020 — saved to library as huber-2020.txt; https://doi.org/10.1371/journal.pone.0227629 (PMC6992162)
Experience: LabintheWild maintainers (Gajos), two replications of lab VR studies with volunteers. Weight (a) with F5/F7 on "replicates online"; (b) on the effect-size drop.
- Part 2 (short): "required us to keep the maze experience rather short. Instead of five trials per maze as in the original paper [], we used three trials per maze"; the negotiation test "took about 5 minutes to complete".
- Part 2 (motivation without pay): "we provided people an assessment of their navigation style"; "we told participants they would learn about their negotiation skills"; "designing the incentive structures is even more crucial in such experiments".
- Part 3: tutorial before the task: "Users could then test the motion controls in a tutorial environment"; "each participant first went through a tutorial about the Ultimatum Game and was asked to pass two test rounds of the game to make sure they understood the rules".
- Part 8 (succeeded, smaller): maze gender effect replicated (n = 311, "52 different countries"); Proteus effect partly: "in the original negotiation study, Cohen's d was 1.23, while in our study, Cohen's d is 0.34"; the unfair-offer result did not replicate; authors suspect "less immersion and the simplified experiment".
- Part 8 (scripted confederate): "We used a virtual confederate that was programmed to make specific bids ... according to consistent guidelines not revealed to participants."
- Part 6: consent at the start ("When participants ... clicked on a button to enter the test, they were asked to provide their informed consent"); ages "between 12 and 71" in Study 1 (no age gate stated).
For us: matches the room recipe (practice step, feedback as reward: .claude/skills/new-room/SKILL.md steps 2 and 7); plan samples for a smaller effect than the original (docs/methodology.md "Sample size" row: 2.5x may be too few if d falls by two thirds); shortening trials is a deviation for the spec table (docs/rooms/NN.md).

(Note 2026-10-11: on the coordinator's word, nothing more is written into objekt-files/papers; huber-2020.txt stays there, its record added by the coordinator. New texts go to scratchpad/ only.)

### F10. Part 5 — questionnaires inside the headset vs after (HCI labs that measured it)
(a) Schwind, Knierim, Haas & Henze (Univ. Stuttgart/LMU/Regensburg), "Using Presence Questionnaires in Virtual Reality", CHI 2019 — https://doi.org/10.1145/3290605.3300590 ; full text read via a mirror https://www.readkong.com/page/using-presence-questionnaires-in-virtual-reality-6353984 (author PDF https://www.rz.unibw-muenchen.de/usable-security-and-privacy/publikationen/pdf/schwind2019chi.pdf could not be reached). n = 36. Weight (a) with Putze 2020, Feick 2026; (c) partly by Graf & Schwind 2020.
- "no effect on the questionnaires' mean scores"; "the variance of those measures significantly depends on the realism of the virtual scene" and whether the subject left VR.
- "Leaving VR can cause BIPs which distort the phenomenon that presence questionnaires measure"; "we recommend using presence questionnaires in VR".
- Times in VR: SUS 1.107 min, IPQ 2.449 min, WS 5.982 min (not changed by leaving VR).
(b) Putze, Alexandrovsky, Putze, Höffner, Smeddinck & Malaka (Univ. Bremen/Newcastle), "Breaking The Experience: Effects of Questionnaires in VR User Studies", CHI 2020 — https://doi.org/10.1145/3313831.3376144 ; open accepted manuscript listed at https://openlab.ncl.ac.uk/research/breaking-the-experience-effects-of-questionnaires-in-vr-user-studies (not opened). Abstract only: "a reduced BIP for the employed inVRQ without affecting the self-reported player experience" (n = 50, physiological measure). UNVERIFIED beyond abstract.
(c) Contradiction: Graf & Schwind, "Inconsistencies of Presence Questionnaires in Virtual Reality", VRST 2020 — https://doi.org/10.1145/3385956.3422105 (abstract only via Consensus): "main scores, as well as subscales of the presence measures are significantly affected by the subjects' environment"; "we recommend revising those tools". UNVERIFIED beyond abstract.
(d) Feick et al., IEEE TVCG 2026 (abstract only via Consensus, https://consensus.app/papers/details/1cd0e0973bb054288529d6116e501555/): n = 43, three in-VR questionnaire interfaces; presence and flow "showed no practically relevant differences across interfaces"; usability and task load differed. UNVERIFIED beyond abstract. Wei et al. 2023 (abstract): performance better and workload lower "outside VR using a PC".
For us: our rooms ask everything in the headset (docs/rooms/01-control.md flow "questions"; src/engine/ui/scale.js): supported by Schwind/Putze; the open question is that answering inside the same scene can shift scores (Graf & Schwind): ask in the same place for every player (room recipe step 4, SKILL.md) and never compare our in-VR numbers to an original's paper-form numbers without saying so in the reveal.

### F11. Part 7 — dropout that differs by condition (browser studies)
Zhou & Fishbach (Chicago Booth), "The pitfall of experimenting on the web: How unattended selective attrition leads to surprising (yet false) research conclusions", JPSP 111(4):493-504, 2016 — https://doi.org/10.1037/pspa0000056 (paywalled; full text NOT read). [2016: possibly stale on MTurk specifics; the logic is not.] Weight (a) with Mottelson 2021 (F2: "ensure these are not skewed by experimental manipulation").
- Secondary, read in the library (Gavrilov 2021, Sotsiologiya 4M no. 53, in Russian, gavrilov-2021.txt, doi:10.19181/4m.2021.53.5): Zhou & Fishbach, having analysed 88 MTurk studies, found that in 20% of them the share of incomplete questionnaires was over 30%, while in 96% of lab studies with students every questionnaire was complete («(Russian text: see the source) % (Russian text: see the source) %»). Search-snippet claims (attrition 30-50% in their paradigms; a "do not quit" request roughly halving attrition; the "eyeliner leads to weight loss" false result) = UNVERIFIED (no full text).
- Gorilla/Prolific "One Million Participants" (https://gorilla.sc/blog/one-million-participants, no date on page, refers to "The State of Online Behavioral Research 2023") promises study length and attrition metrics but only behind an email form: not read (FOR THE OWNER).
For us: a room whose two conditions differ in how boring or uncomfortable they are (room 01: 25-25 vs 75-75, docs/rooms/01-control.md) can lose more players in one condition; report completion per condition in report.js and compare before any analysis (docs/methodology.md, add to "Technical quality / exclusions").

### F12. Part 5 — reaction times and timing (toolkit makers who measured it)
(a) Bridges, Pitiot, MacAskill & Peirce (PsychoPy's makers, Nottingham), "The timing mega-study", PeerJ 8:e9414, 2020 — https://doi.org/10.7717/peerj.9414 (PMC7512138; text kept in scratchpad/bridges-2020.txt; not in the library). Weight (a) with Anwyl-Irvine 2021 (library) and Cesanek 2024.
- Browser: "For response times ... most of the packages achieved precision at least under 10 ms in all browsers, with PsychoPy achieving a precision under 3.5 ms in all."
- "There was considerable variability between OS/browser combinations, especially in audio-visual synchrony which is the least precise aspect of the browser-based experiments."
- Lags "were constant within any one browser/operating system combination" but "varied a great deal between different combinations".
- "We stress the importance of scientists making their own timing validation measurements for their own stimuli and computer configuration."
(b) Wiesing, Fink & Weidner (Jülich), "Accuracy and precision of stimulus timing and reaction times with Unreal Engine and SteamVR", PLOS ONE, 8 Apr 2020 — library wiesing-2020.txt; https://doi.org/10.1371/journal.pone.0231152
- Game-engine built-in timing "revealed highly variable reaction time measurements and inaccurate determination of stimulus onsets"; fixed by moving time acquisition "to a background application"; requires "a constant frame rate without dropped or reprojected frames"; "We recommend turning off Motion Smoothing completely."
(c) jsPsych docs, "Record browser interactions" (https://www.jspsych.org/latest/overview/record-browser-interactions/, read 2026-10-11): jsPsych logs 'blur'/'focus' and 'fullscreenexit' with "the time in milliseconds since the experiment started" separately from trial data.
For us: a room that measures speed (catalog first-room candidates shams-2000, moharramipour-2022: docs/catalog.md) needs its own measured onset/RT check on the Quest browser before it is built (the catalog already says so for shams-2000); compare within a player (condition differences), never absolute RTs against a lab paper; audio-visual sync is the weakest part in browsers.

### F13. Part 4 — does a debrief without an experimenter work?
Greenspan & Loftus (UC Irvine, Loftus lab: decades of misinformation research), "What happens after debriefing? The effectiveness and benefits of postexperimental debriefing", Memory & Cognition 50:696-709, published online 10 Aug 2021 — library greenspan-2022.txt; https://doi.org/10.3758/s13421-021-01223-9. Weight (b) one lab, two studies; consistent with Miketta & Friese 2019 (cited there, not read).
- Study 1: "after debriefing, some participants continued to endorse misinformation"; "Five days after debriefing, the majority of participants who endorsed the misinformation at Session 1 continued to do so postdebriefing."
- Study 2 "was conducted fully online to explore whether debriefing without the presence of an experimenter would impact the results"; the enhanced debrief "specifically named one of the two pieces of misinformation ... and assured participants that memory errors were normal"; for the named item "No statistically significant misinformation effect" remained; "for the item that was not specifically named ... a significant misinformation effect persisted over time".
- Format: debriefs "broken into small chunks across several pages and participants were required to stay on each page for several seconds"; benefits "were found both during in-person and online settings"; longer debrief "did not reduce attention".
For us: the reveal (SKILL.md recipe step 7; room 01 "done" state in docs/rooms/01-control.md) must name the exact trick the player met (e.g. "the green light came on 75% of the time whatever you pressed"), say the error is normal, and come in short screens; a general "this was about illusions" is not enough. Rooms with a false-memory design (catalog roediger-mcdermott-1995) need the named-item debrief most.

### F14. Part 6 — consent without an experimenter: do people read it?
(a) Grant et al., "Improving Comprehension of Consent Forms in Online Research: An Empirical Test of Four Interventions", J Empirical Research on Human Research Ethics 20 (Feb-Apr 2025) — https://doi.org/10.1177/15562646251321132 (PMC12048739, open; text kept in scratchpad/grant-2025.txt). Weight (a) with the abstracts below.
- "Consent form comprehension can be increased by: 1) Controlling how much time participants spend ... 2) Briefly quizzing participants about the content of the consent form, and 3) Delivering consent form content live via virtual conference call (or audio recording), in addition to the written form."
- Audio "performed nearly as well" as live; written only was worst; "Overall, 39.9% (n = 117) of participants correctly answered all four questions"; even live: "61% of participants correctly followed instructions".
- Length: "consent form length had no effect" (abstract; both experiments).
(b) Abstract-only (numbers UNVERIFIED): Douglas et al., Psychological Methods 2020 ("Some researchers wear yellow pants...", https://consensus.app/papers/details/5c38fdf725a756df8cb557d450f7382a/): "removing the researcher from the room ... decreased recall"; Perrault et al. 2019 JERHRE: with a 71-word consent and an option to learn more, "All participants (100%, N = 429) decided to continue directly to the study"; Knepp 2014: about 12% online vs 38% in the lab followed the embedded procedure.
- Steed 2021 (F1): short in-app consent with a long form online accepted by the UCL ethics board; Mottelson 2021 (F2): no technical reason not to consent in-app.
For us: our consent is in the corridor (src/app/consent.js; docs/rooms.md "arrival ... consent"): spoken voice plus the clipboard text matches the audio+written format that worked; one tap-question on the key point (recording, quit any time) fits "briefly quizzing"; keep a long-form privacy page reachable (privacy.html, docs/rooms/01-control.md "Data sent"). Age rules are already in docs/research/ethics-law.md (Meta accounts from 10; self-declared 18+ before recording); practitioners add: range-check self-reported age (VERA's "age value in the tens of thousands", F7).

### F15. Part 7 — sickness as a reason to quit
Saredakis, Szpak, Birckhead, Keage, Rizzo & Loetscher, "Factors Associated With Virtual Reality Sickness in Head-Mounted Displays: A Systematic Review and Meta-Analysis", Frontiers in Human Neuroscience 14:96, 31 Mar 2020 — library saredakis-2020.txt; https://doi.org/10.3389/fnhum.2020.00096. Weight (a) (meta-analysis; with VERA F7 and Steed F1 "avoided travel techniques").
- "The mean dropout rate reported across 46 experiments due to VR sickness was 15.6%."
- "previous studies using gaming content reported the highest dropout rates, ranging from 44 to 100%"; rollercoaster example: "almost 67% of participants ... were unable to complete an exposure time of 14 min".
- Low motion and head movement "concordant with what the user would experience in the real world" less likely to sicken.
For us: seated or standing rooms with no artificial locomotion (docs/catalog.md "Space" column; the thumbsticks move the player in the corridor only, docs/rooms.md) are the low-dropout case; a room with forced camera motion would carry a dropout risk that also biases its sample (F11).

### F16. Part 4 — a debrief behind a link is mostly not read
McCambridge, Kypri, Wilson et al., "How Should Debriefing Be Undertaken in Web-Based Studies? Findings From a Randomized Controlled Trial", J Med Internet Res 14(6):e157, 2012 — https://doi.org/10.2196/jmir.2186 (PMC3510731, read in full via PubMed Central). [2012: possibly stale; the measure is behavioural, not opinion.] Weight (b), N = 11,943.
- "Only one quarter of Group B actually accessed debriefing information" (debrief behind a link: visited 1427 of 5892, 24.2%; median 36.1 s on the page); results link clicked by 4.1% vs 8.7%.
- "Approximately three-quarters of these participants have received no debriefing information at all, and this appears to be a much bigger problem than we would have expected."
- Background guidance: "debriefing information be kept very short, with further information including study results made available if requested".
- Related practice on early exits (search snippets, pages not opened; UNVERIFIED): Oxford CUREC AP07 (https://researchsupport.admin.ox.ac.uk/sitefiles/ap07-curec-approved-procedure-deception) advises a debrief page also "if they choose to withdraw early"; PsychoPy forum thread "New web app. VESPR Study Portal" (https://discourse.psychopy.org/t/new-web-app-vespr-study-portal/22251/27) shows a researcher passing participants to an external debrief page.
For us: the reveal must sit inside the flow before "done" (docs/rooms/01-control.md flow), never behind an optional button; a player who quits the room early must still get a two-line debrief on the way out (src/app/lobby/lobby.js left-early choice; docs/rooms.md arrival).

### F17. PsychoPy/Pavlovia forum — frame rate in the browser is not what the log says (practitioner threads)
- "Incorrect frame rate logs on Pavlovia" (https://discourse.psychopy.org/t/incorrect-frame-rate-logs-on-pavlovia/15255): search snippet says PsychoJS getActualFrameRate() was a placeholder returning 60 and that "if it cannot be measured reliably ... a 60Hz rate is assumed" — page not opened: UNVERIFIED (date unknown, about 2020 by thread id).
- PsychoPy docs "Detecting dropped frames" (https://devdocs.psychopy.org/general/timing/detectingFrameDrops.html): not opened.
For us: measure our own frame times per trial (we run on Quest at 72-120 Hz; the logged rate must be measured, not assumed): docs/methodology.md "VR reporting" row.

### F18. Part 4 — deception online without a debrief for those who quit (German labs)
Hilbig & Thielmann (Univ. Koblenz-Landau / MPI Freiburg; authors of the 770-study prosociality meta-analysis), "On the (Mis)Use of Deception in Web-Based Research: Challenges and Recommendations", Zeitschrift für Psychologie 229(4), published online 17 Dec 2021, OPEN ACCESS — https://doi.org/10.1027/2151-2604/a000466 (read in full in the browser pane; WebFetch got 403). Weight (a) with F16, Prolific F8; consistent with Reips & Birnbaum 2011 quoted there.
- Problem: participants can drop out "by simply closing the browser window ... in which case full debriefing and an option to withdraw one's data are no longer available."
- Data: of 42 online deception studies, debriefing mentioned in "14 of the 42 studies (33%)", always only after completion; authors who replied confirmed "Participants who dropped out were not debriefed"; no study had safeguards for withdrawal after the deception was explained.
- Quoted older advice: "avoid deception in any Web-based research, at all costs" (Reips & Birnbaum 2011, p. 582).
- Safeguards weighed: a "leave the study" button on every page "dependent on participants' compliance"; automatic debrief on closing the window needs scripts to run; preferred: a separate contact channel with a random code usable "both for study participation and data withdrawal".
- Definition used: withholding hypotheses is not deception; "intentional and explicit provision of erroneous information" is.
For us: most rooms withhold the purpose (omission, allowed) rather than lie; where a room lies (a fake partner, false feedback), it needs: the debrief on every exit path (headset menu, door, left-early: src/app/lobby/lobby.js), and data withdrawal after the reveal through the anonymous random key we already store (docs/owner-decisions.md "a random key"; docs/methodology.md). The card's "deception" field should say omission or commission (docs/cards/).

### F19. Part 2 — game features: what helped and what broke the measure
Lumsden, Skinner, Woods, Lawrence & Munafò (Bristol, TARG), "The effects of gamelike features and test location on cognitive test performance and participant enjoyment", PeerJ 4:e2184, 2016 — library lumsden-2016.txt; https://doi.org/10.7717/peerj.2184. [2016: possibly stale; finding consistent with Hawkins 2013 in the library.] Weight (a) with Hawkins 2013 ("Gamelike features might not improve data").
- "points to be a highly suitable game mechanic ... they did not disrupt the validity of the data collected but increased participant enjoyment"; "no evidence that gamelike features could increase engagement to the point where participant performance improved".
- Theme broke the measure: "the difficulty of categorising the gamelike stimuli adversely affected participant performance, increasing No-Go error rates by 28% compared to the non-game control".
- Online vs lab: "slightly longer reaction times but were otherwise very similar".
For us: the "host" humour and game framing go around the measured moment, never into the stimuli themselves (SKILL.md recipe step 4 already cites Lumsden 2016); a themed stimulus (a prop instead of the paper's plain stimulus) is a deviation to test, not decoration (docs/rooms/NN.md deviations table).

### F20. Part 7/2 — put the drop point before the manipulation (Web Experimental Psychology Lab, Zurich/Konstanz)
Reips, "Standards for Internet-Based Experimenting", Experimental Psychology 49(4):243-256, 2002 — https://doi.org/10.1026//1618-3169.49.4.243 ; open reprint https://iscience.uni-konstanz.de/archive/reips/papers/exppsy/ExPsyReipsReprint.pdf (read in full; text in scratchpad/reips-2002.txt). [2002: possibly stale on technology; the dropout logic is confirmed by VERA 2026 (F7: most quit before the stimulus).] Weight (a) for warm-up; (c) for parts of the high hurdle (see below).
- "Dropout curves ... should be reported for all studies conducted on the Internet, separately for all between-subjects experimental conditions."
- Motivational confounding: "if the impact of two different tasks is to be measured, one of which is more boring, then participants are more likely to drop from that condition."
- Warm-up: "most dropout will take place at the beginning of an online study"; "it is wise to place its beginning several Web pages deep into the study. The warm-up period can be used for practice trials ... and assurance that participants are complying with instructions"; Figure 1: "very low dropout after introduction of the experimental manipulation".
- High hurdle: "motivationally adverse factors are announced or concentrated as close to the beginning ... as possible"; checklist includes "Give an estimate of how long participation ... will take" and "Tell participants participation is serious".
- Contradicted for us (c): the same checklist's "Ask for e-mail address" and "Tell participants that their identity can be traced" clash with anonymous play (docs/owner-decisions.md, Data) and current data-protection rules.
- Seriousness check: "If it is pre-determined that only data sets from persons with a motivation for serious participation will be analyzed, then the resulting dropout rate is usually much lower."
For us: the corridor (welcome, consent, clipboard: docs/rooms.md arrival) is the natural warm-up, and the room's practice step (SKILL.md recipe step 2) must come before random assignment takes effect, so that quitting during practice cannot differ by condition; say the room's length on the door or clipboard (room 01 is about 10 min: docs/rooms/01-control.md).

### F21. Japanese practitioners (partly read)
(a) Kobayashi Masanori (小林正法, Memory and Emotion Lab), "オンライン実験の倫理（2020年版）", Online Psychological Experiment Advent Calendar 2020, 7 Dec 2020 (updated 29 Dec 2020) — https://mklab.info/post/2020-12-07-onlineexpethics2020/ . Weight (b).
- «ネガティブな気分が喚起されるような実験はオンライン実験は避ける方がよいと思います» (experiments that evoke negative moods are better avoided online); in the lab one takes care «実験後にネガティブな状態が継続しないように配慮する», which is hard to reproduce online.
- As of 7 Dec 2020, no Japanese psychology association guideline for online experiments; points to the BPS internet-mediated research guidelines (in our library: bps-2021-imr) and Barchard & Williams 2008.
(b) Tachibana & Matsumiya (Tohoku Univ.), "VRによる視聴覚実験 (Visual and Auditory Psychological Experiments in VR: Accuracy and Precision of Stimulus Presentation)", Japanese Journal of Psychonomic Science 41(1):69-76, 2022 — https://doi.org/10.14947/psychono.41.13 . Only the English abstract was readable (pdftotext lacks the Japanese font data); a search snippet says visual latency about 18 ms with SD under 1 ms and that audio is harder to control: UNVERIFIED. Text in Japanese needs a reader with the fonts (FOR THE OWNER or a later pass).
- Also found, not opened: Kawahara Shigeto (note, linguist) "オンライン実験の信頼性に関するまとめ" https://note.com/keiophonetics/n/n512367ae682e ; Fukuta Junya (note) "オンライン実験での取得データの質を上げるために" https://note.com/fukuta_j/n/ndcffa385c1f8 ; Inoue K. "オンラインの反応時間実験は信頼できるのか" https://k-inoue.info/?p=562 .
For us: rooms that induce fear, shame or sadness (catalog cards tagged emotion) need an in-headset recovery step after the reveal, since no person is there to notice (SKILL.md recipe step 6/7).

### F22. Part 1/8 — demand characteristics in VR body and presence measures (German lab; an open dispute)
Forster, Karimpur & Fiehler (Justus Liebig Univ. Giessen, Fiehler lab: makers of vexptoolbox), "Demand characteristics challenge effects in embodiment and presence", Scientific Reports, 18 Aug 2022 — https://doi.org/10.1038/s41598-022-18160-5 (PMC9387424, read in full; text in scratchpad/forster-2022.txt). Weight (c): contested.
- Design: an online group only watched a video of the VR task and rated what they would feel (n = 111, "at least 18 years old"); a VR group did the task.
- "participants' ratings in the online experiment were similar to the responses in the VR experiment indicating that participants were aware of the research hypotheses"; "Ratings differed between online and VR experiments, with generally higher ratings in the VR experiment".
- "Clearly, hypotheses should not be known to participants, as their knowledge can influence their behaviour."
- Same side: Lush 2020 (Collabra) "Demand characteristics confound the rubber hand illusion"; Lush et al. 2021 (R Soc Open Sci) — abstracts via Consensus.
- Other side (c): Slater & Ehrsson 2022 (Frontiers in Human Neuroscience, abstract via Consensus https://consensus.app/papers/details/a769c393683856ecae2d44d4a05765a3/): "at every level of SWASH, the synchronous stimulation results in greater levels of the illusion than the asynchronous condition"; "expectations negligibly". UNVERIFIED beyond abstract.
For us: body-ownership and presence rooms (catalog sections "body and space"; card kohnstamm-1915, lenggenhager-2007 etc. in docs/catalog.md) must not reveal the expected feeling in the instructions or the questionnaire order, and should prefer a behavioural measure (drift, reaching, threat reaction) over agreement ratings; the reveal can honestly say the field disputes how much is expectation.

### F23. Toolkit issue trackers — data lost when the player quits the headset app
Unity Experiment Framework (UXF; maintainer Jack Brookes, Immersive Cognition lab, Leeds; paper Brookes et al. 2020 BRM), GitHub issues read via gh 2026-10-11. Weight (b) per thread, maintainer answers.
- Issue #119, 23 Mar 2022 (https://github.com/immersivecognition/unity-experiment-framework/issues/119): the UXF wiki says on standalone Quest it "seems currently to only save data if you do not quit mid-way through the experiment". Maintainer (24 Mar 2022): "Oculus Quest does not allow Unity apps to cleanly shut down"; advice: "(a) split into smaller trials" or "(b) have some button the user presses/holds to cleanly exit"; per-trial files "get saved at the end of each trial".
- Issue #118, 16 Mar 2022 (https://github.com/immersivecognition/unity-experiment-framework/issues/118): maintainer: "system time is not the same as display time. If a frame takes 20ms to run, the system time could vary anywhere in that range, but everything is displayed at the same time."
- Ouvrai's own tracker (https://github.com/evancesanek/ouvrai/issues) has 6 issues, none about participants or Quest behaviour (checked 2026-10-11): nothing to learn there.
For us: send or store each trial's record as it ends, not only at the room's end, so a player who takes the headset off mid-room leaves usable partial data and a dropout point (docs/rooms/01-control.md "Data sent": today only the whole result is sent; docs/methodology.md "Technical quality"); timestamp events with the XR frame time for what was shown and performance.now() for when input arrived.

### F24. Part 8 — the same dilemma gives a different answer when it is done, not judged
Francis, Howard, Howard, Gummerum, Ganis, Anderson & Terbeck (Plymouth), "Virtual Morality: Transitioning from Moral Judgment to Moral Action?", PLOS ONE 11(10):e0164374, 10 Oct 2016 — library francis-2016.txt; https://doi.org/10.1371/journal.pone.0164374. [2016: possibly stale; Navarrete 2012 in the library is the earlier VR switch dilemma.] Weight (b), two studies, n = 40 in Study 1.
- Study 1: text judgment "20% of participants endorsed a utilitarian response"; VR action "70%"; Study 2: "10%" vs "63.3%".
- Authors' own caveat: "salient auditory cues in the virtual dilemma" (victims yelling at a fixed time) may have produced the difference.
For us: a VR re-creation of a questionnaire-based classic is a new measure, not a replication of the number; the reveal should compare the player with VR samples where they exist and show the paper's number as "what people said on paper" (card emotion-morality-culture section; docs/catalog.md trolley cards; SKILL.md recipe step 7).

### F25. Part 3/7 — six remote XR studies from one HCI lab (Carleton)
Kroma, Grinyer, Scavarelli, Samimi, Kyian & Teather (Carleton Univ., Teather lab), "The reality of remote extended reality research: Practical case studies and taxonomy", Frontiers in Computer Science 4, 9 Sep 2022 — https://doi.org/10.3389/fcomp.2022.954038 (read in full via WebFetch in two parts). Weight (a) with F1/F2/F4.
- Part 3: participants "appreciated the video instructions that guided them through the required activities"; guideline 5.3.1: "Procedural instructions should be easy to follow through clear visuals, flowcharts, and instructions"; "minimize the number of steps required of participants when possible".
- Part 7: "two of our HMD participants gave up in frustration and just used their desktop machines"; "the setup process took roughly twice as long as a similar set-up in person".
- Part 1: "only two out of 25 participants 'cheated' and provided inaccurate data"; "the absence of a researcher did not substantially compromise data integrity"; but in another case "large variance in all data collected, likely due to the lack of a controlled environment".
- Apparatus: "The apparatus has to be 'bullet-proof'—hardware should work well and software should be virtually bug-free."
- Also named in this Frontiers research topic, not opened: Steed et al. 2022, "Lessons learned running distributed and remote mixed reality experiments" (Frontiers in Computer Science; DOI not confirmed); Paneva & Alt 2024 "Exploring Vulnerabilities in Remote VR User Studies" (arXiv 2404.17588; snippet: "comprehensive onboarding, prioritized informed consent, implementing privacy-by-design").
Supporting, library: Rivu et al. 2022 (rivu-2022.txt, MUM 2022, https://doi.org/10.1145/3568444.3568462): "The majority of the participants (18 users) found the manual too extensive and complex"; "Almost all participants (16 users) wanted a quick start guide with pictures and short, concise steps" (n = 21, hardware setup at home).
For us: instructions shown and done, not read: the room's practice step and the voice + wall screen of room 01 (docs/rooms/01-control.md deviation 5) fit; any instruction longer than a screen is a dropout point (docs/rooms.md texts.ru.js; SKILL.md recipe step 2).

### F26. Steed et al. (UCL), "Lessons learnt running distributed and remote mixed reality experiments", Frontiers in Computer Science 4, 5 Jan 2023, open — https://doi.org/10.3389/fcomp.2022.966319 (read in full in the browser pane; text in scratchpad/steed-2023.txt). Eleven remote experiments; extends F1. Weight (a) with F1, F25.
- Part 8/3 (a remote replication that changed behaviour): in a trust-in-advisors replication on Quest, "a large number of participants never asked either advisor for help. This could be because these participants never realised it was an option; the ability to ask advisors was only described in the instructions page of the app, which participants may have skipped through." 45 completed; "28 results were usable"; "our server did not record partial completions".
- Part 3: "A form of real-time feedback on user interaction during this tutorial phase is recommended so that participants can be guided back to the protocol"; "Simply denying them the ability to continue with an experiment can prove jarring and result in premature termination".
- Part 5: questionnaire UIs need "a back-button to cope with situations with inadvertent clicks"; in-app questionnaires: "reduces risk of non-compliance, since the user is led through the process linearly"; off-headset questionnaires risk that users "click through to the next stage without doing the questionnaire".
- Part 1 (non-compliance detected from logs): seated/standing checked by "headset height data"; headset taken off mid-run found by "discrepancies between the experiment time recorded (Unity time, which is paused when the application is interrupted) and the real-world time (Unix time)".
- Part 6: "instructions and consent were baked in to the app itself"; a demographics form opened in the Oculus browser from a link in the app.
- Durations of their remote studies: "very short studies (5 min) through to long studies (60+ min)".
For us: every option the original gave the participant (e.g. "do nothing" in room 01: press or not, docs/rooms/01-control.md "Trial") must be practised in the tutorial, not only stated in text, or players will not use it; answer buttons need an undo/back (src/engine/ui/choice.js, scale.js); log head height to check seated/standing rooms (docs/catalog.md "Space").

## Status per part (2026-10-11)
1. VR / unsupervised browser changes: answered (F1, F2, F4, F7, F17, F22, F25, F26).
2. Short and engaging: answered (F3, F9, F19, F20); no Gorilla/Prolific length data (behind a form).
3. Instructions and comprehension checks: answered (F1, F8, F9, F25, F26).
4. Deception and debriefing remotely: answered (F8, F13, F16, F18).
5. Measures in VR (RT; questionnaires in vs after): answered (F5, F10, F12, F26); Putze 2020, Graf & Schwind 2020, Feick 2026 abstract only.
6. Consent and age checks in a game: answered for consent (F14, F1, F2, F26); age rules already in docs/research/ethics-law.md; practitioner age-gate evidence: not found beyond range checks (F7) and LabintheWild's ages 12-71 with no gate stated (F9).
7. What made participants quit: answered (F3, F7, F11, F15, F20, F23, F25).
8. VR replications that failed or succeeded: answered (F6, F7, F9, F24, F26, F5).
Forums: PsychoPy discourse (F17, one thread read), UXF issues (F23), Ouvrai issues (empty); jsPsych GitHub discussions: no relevant thread found by search (docs page only, F12c); Gorilla blog: nothing readable without the form; Dutch-language methods blogs: not searched (time).

## Texts kept in scratchpad (not in the library; coordinator adds)
bridges-2020.txt (10.7717/peerj.9414, OA), grant-2025.txt (10.1177/15562646251321132, OA PMC12048739), forster-2022.txt (10.1038/s41598-022-18160-5, OA), reips-2002.txt (10.1026//1618-3169.49.4.243, free reprint), steed-2023.txt (10.3389/fcomp.2022.966319, OA).
Read but not saved: Hilbig & Thielmann 2021 (10.1027/2151-2604/a000466, OA), Kroma et al. 2022 (10.3389/fcomp.2022.954038, OA), McCambridge et al. 2012 (10.2196/jmir.2186, OA PMC3510731), Schwind et al. 2019 (10.1145/3290605.3300590, via a mirror), Kobayashi 2020 blog.
