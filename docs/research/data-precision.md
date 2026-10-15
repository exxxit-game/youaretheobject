# How precise and trustworthy are the data: how the field measures it, and what each fix buys

Earlier passes (not repeated): docs/research/study-methods-1.md, study-methods-2.md, field-labs-1.md, field-labs-2.md.

## Parts (each gets an answer or "not found")
1a. Reliability (test-retest, split-half, internal consistency) vs validity: definitions as the field uses them
1b. Precision of an effect: CI width and sample size
1c. Reliability paradox (Hedge, Powell & Sumner 2018): what it means for condition-comparing vs individual-measuring
1d. How replication projects judge "held": Many Labs, RRR, Open Science Collaboration 2015
2a. Germine et al. 2012 web vs lab, figures
2b. Crump, McDonnell & Gureckis 2013, figures
2c. Newer online vs lab comparisons
2d. VR at home vs VR in the lab, figures
3.  Table of fixes and their measured effect: seriousness check, IMC, commitment, warnings, honesty pledge,
    exclusion rules, first-run-only, over-recruitment, preregistration/registered reports (Scheel 2021), bot defences
4a. Browser timing precision (Anwyl-Irvine et al. 2021 and others)
4b. Quest motion-to-photon latency (Ouvrai 8.3 ms; Warburton et al. 2022)
4c. Quest head tracking accuracy/jitter
4d. Quest controller and hand tracking accuracy/jitter
4e. What this allows: RTs, gaze from head pose, hand paths
5.  Synthesis: precision part by part; fixes ordered by what each buys

## Findings

### 4b. Motion-to-photon latency in a WebXR experiment (local full text objekt-papers/cesanek-2024.txt)
- Cesanek et al. 2024, Nat Hum Behav 8:1209-1224, https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/
- "we computed a latency of 8.3 ms" (Quest 2, controller to image, 240 fps phone video, R2 = 0.96), "achieved with
  motion prediction within the VR software"; "running VR applications in the web browser does not add lag".
- Data are per render frame: "In VR, refresh rates are typically 90-120 Hz" (so one sample every 8.3-11.1 ms).

### 4d. Quest 2 hand tracking (no controllers) vs motion capture (local full text objekt-papers/abdlkarim-2024.txt)
- Abdlkarim et al. 2024, Behav Res Methods 56:1052-1063, https://doi.org/10.3758/s13428-022-02051-8
- "average fingertip positional error of 1.1cm, an average finger joint angle error of 9.6 and an average temporal
  delay of 45.0 ms" (degrees); errors larger "in the periphery of the Quest's visual field"; delay "unaffected by
  motion speed or location"; pilot: hand movements faster than about 3.2 m/s broke tracking (text cut there).

### 1a/1c. Reliability, and the reliability paradox (Hedge, Powell & Sumner 2018) - full text read, saved objekt-papers/hedge-2018.txt
- Behav Res Methods 50(3):1166-1186, doi:10.3758/s13428-017-0935-1, https://pmc.ncbi.nlm.nih.gov/articles/PMC5990556/ (CC BY)
- Definition used: reliability "refers to the extent to which a measure consistently ranks individuals"; assessed by
  the intraclass correlation, ICC = between-person variance / (between-person + error + between-session variance).
- Method: N = 50, 62, 42 undergraduates; tasks in "two 90-min sessions taking place 3 weeks apart" (test-retest).
- Result: seven classic tasks (flanker, Stroop, stop-signal, go/no-go, Posner, Navon, SNARC) "Reliabilities ranged from
  0 to .82"; low because of "low variance between individuals rather than high measurement variance".
- Benchmarks it uses: "excellent (.8), good/substantial (.6), and moderate (.4)" (Cicchetti & Sparrow 1981).
- Difference scores are weaker: "the flanker RT cost in Study 1 has a reliably of .4, whereas the RTs for congruent
  and incongruent trials have reliabilities of .74 and .66".
- The paradox: "homogeneity is the ideal for experimental research"; between-person variance is the numerator of
  the ICC but "appears as the denominator in the t-test". Tasks remain fit for "between-group differences in
  experimental designs"; they "do not consistently distinguish between individuals".
- Cost: at reliability "good" (>.6) "the required sample sizes are about three times higher" for correlations.
- For us: a room compares conditions (group means), so a low test-retest reliability does not hurt it; the room's
  per-player result ("you were caught") is an individual score and is NOT reliable enough to judge one person.
  Show the player the group effect, not a verdict on him (our reading).

### 4a. Browser timing on home computers (Anwyl-Irvine, Dalmaijer, Hodges & Evershed 2021) - full text read, saved objekt-papers/anwyl-irvine-2021.txt
- Behav Res Methods 53:1407-1425, https://pmc.ncbi.nlm.nih.gov/articles/PMC8367876/
- Accuracy vs precision as the field uses them: accuracy = mean closeness to the true time; precision = its
  variability; "a delayed-but consistent-reaction time record permits comparisons between trials and conditions,
  whereas variability in this can potentially obscure small differences between conditions".
- Method: robot actuator pressing real desktop and laptop keyboards, photodiode on screen, 4,350 presentations per
  set-up; Chrome, Firefox, Edge, Safari on Windows 10 and macOS.
- Keyboard RT delay: Gorilla "around 80 ms of delay" with "the lowest overall standard deviation ... (8.25 ms";
  jsPsych "around 70 ms" on Chrome/Safari desktop, up to "around 120 ms" (Edge laptop).
- Concurrent study (Bridges et al. 2020, as cited here): "RT lags of 8-67 ms, precision of < 1 ms to 8 ms, visual
  lagging of 0-2 frames"; audio delays "in the hundreds of milliseconds".
- Conclusion: "modern web platforms provide reasonable accuracy and precision for display duration and manual
  response time"; "timing could change substantially in the future".
- Not a headset: no Quest or other headset browser was among the set-ups tested (checked in the full text).

### 2a. Web vs lab, unpaid volunteers (Germine et al. 2012) - full text and Tables 1, 3 read, saved objekt-papers/germine-2012.txt
- Psychon Bull Rev 19:847-857, https://link.springer.com/article/10.3758/s13423-012-0296-9 (tables: .../tables/1, /tables/3)
- TestMyBrain.org volunteers, paid only with "personalized performance feedback"; tests: face memory (CFMT), Eyes
  test (RMIE), abstract art memory (AAM), word pairs (VPAM), digit span (FDS).
- How quality was judged: "mean performance, performance variance, and internal reliability" (Cronbach alpha;
  split-half for FDS) - the three should all drop if web data were noisier.
- Result: "did not differ systematically"; "the Web data were as reliable as the lab data in all comparisons".
- Alphas web vs lab (Table 3): CFMT .90 vs .86/.88/.86; age-sex matched: CFMT .88 vs .87, RMIE .55 vs .52, VPAM .82
  vs .85, FDS .67 vs .68; web vs twin registry: VPAM .82 vs .72 (web significantly MORE reliable).
- Means: differences both ways (web higher than one lab, lower than another); lower on IQ-loaded tests vs Wellesley
  students - "not consistent with widespread cheating". Unmatched web samples had larger SDs (FDS p < .05).
- Exclusions, all self-reported (Table 1): technical problems/cheating 2.9-5%, repeat participation ("Is this your
  first time taking this test?") 2.1-5.8%, age out of range 1-1.6%, wrong device 1-1.9%; total 6.9-13%.
- Caveat: "it is the responsibility of individual researchers to conduct their own assessments of data quality".

### 3 (row). Preregistration / registered reports: share of positive results (Scheel, Schijen & Lakens 2021)
- AMPPS 4(2), doi:10.1177/25152459211007467; repository page read: https://research.tue.nl/en/publications/an-excess-of-positive-results-comparing-the-standard-psychology-l/
- 71 registered reports vs 152 standard hypothesis-testing papers, first hypothesis each: "we found 96% positive
  results in standard reports, but only 44% positive results in Registered Reports"; 96% vs 50% without direct
  replications (page summary); the authors note the study did not test directly whether RRs reduce bias.
- Full text read from the owner's copy (objekt-papers/scheel-2021.txt). Coding: "The main dependent variable was
  whether the first hypothesis was supported, as reported by the authors", following Fanelli (2010); in RRs "the
  first preregistered hypothesis". Result: "Thirty-one out of 71 RRs and 146 out of 152 SRs had positive results",
  43.66% (95% CI 31.91-55.95) vs 96.05% (91.61-98.54). Original studies only: RRs 15 of 30 (50.00%), SRs 142 of
  148 (95.95%); replications: RRs 39.02% of 41. Replications were 57.75% of RRs and 2.63% of SRs.

### 2b. Paid online workers vs lab (Crump, McDonnell & Gureckis 2013) - full text read, saved objekt-papers/crump-2013.txt
- PLoS ONE 8(3):e57410, https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0057410
- Replicated online (MTurk, browser): Stroop "large (293 ms) Stroop effect" (859 vs 1,152 ms; lab reference 809 vs
  1,023 ms); task switch 225 ms; flanker 612 vs 682 ms (lab 604 vs 647); Simon 556 vs 603 ms; Posner cuing:
  "even small RT effects (~20 ms) can be reliably measured despite unknown timing variability", the error "small or
  random and washes out in the averaging over multiple trials"; attentional blink replicated.
- Failed where timing must be very short: masked priming "compatibility effects for prime durations 64 ms and shorter
  were not observed" (presentation in 16 ms steps).
- Failed at first where instructions were complex: category learning, error "asymptote near .2" vs below .1 in the
  lab; online took "nearly double the number of blocks". Pay did not fix it: "The incentive structure of the task
  had little impact on overall learning rates". An instruction comprehension quiz did: "the instruction manipulation
  increased the congruence between the online and laboratory data" (Exp 10; effect shown in a figure, no single
  number given).
- Lesson for us: comprehension check of the task before the trial counts > more reward (their data).

### 1d. How a replication is judged: Open Science Collaboration 2015 - authors' accepted text read, saved objekt-papers/open-science-collaboration-2015.txt
- Science 349(6251):aac4716, doi:10.1126/science.aac4716; author copy https://www.pure.ed.ac.uk/ws/files/21474290/RPP.pdf
- Five yardsticks used side by side (abstract): "Thirty-six percent of replications had significant results; 47% of
  original effect sizes were in the 95% confidence interval of the replication effect size; 39% of effects were
  subjectively rated to have replicated"; original+replication meta-analysis "left 68% with significant effects".
- Effect sizes (r): original "M = 0.403, SD = 0.188" vs replication "M = 0.197, SD = 0.257" - about half.
- Replication power averaged "M = 0.92": about 89 successes expected if all effects were true, "there were just 35".
- By field: "14 of 55 (25%) of social psychology effects replicated by the P < 0.05 criterion, whereas 21 of 42
  (50%) of cognitive psychology effects did so".
- Predictor: original p < 0.001 replicated "20 of 32, 63%"; p between .02 and .04: 26%; p > .04: 18%; "Surprising
  effects were less reproducible".
- For us: report each room the way they do - effect with 95% CI next to the original's, plus whether the original
  falls in our CI; expect social-psychology effects to come out about half their published size.

### 4b (cont.). Motion-to-photon latency with and without prediction (Warburton et al. 2022) - full text read, saved objekt-papers/warburton-2022.txt
- Behav Res Methods 55(7):3658-3678, doi:10.3758/s13428-022-01983-5, https://pmc.ncbi.nlm.nih.gov/articles/PMC10616216/
- Headsets tested: HTC Vive, Oculus Rift CV1, Rift S, Valve Index (NOT Quest). Controller latency "at the start of the
  movement ... between 21 and 42 ms on average", "at the middle of the movement ... 2-13 ms on average";
  "motion-prediction algorithms reduce this latency within the first 25-58 ms of the movement".
- Context they cite: errors in handwriting/tracing rise with "delays as little as 40 ms".
- For us: Ouvrai's 8.3 ms (Quest 2, browser) was measured on a back-and-forth (continuous) movement, so it is the
  predicted, mid-movement figure; the onset of a sudden movement is likely 20-40 ms late (by analogy with the
  headsets Warburton measured). Quest onset latency: searched again (10.10.2026), no measurement published. The
  one industry test with Quest 3 (OptoFidelity, 15 Feb 2024, read, https://www.optofidelity.com/insights/blogs/apple-vision-pro-bencmark-test-2.-angular-motion-to-photon-latency-in-vr)
  moves "in a back-and-forth sequence" (mid-movement again), says "Quest Pro and Quest 3 excel", numbers only in
  charts. So our own 240 fps measurement stays the only way to get the onset figure.

### 4d (cont.). Quest 2 controller position and rotation vs optical motion capture (Carnevale et al. 2022) - full text read, saved objekt-papers/carnevale-2022.txt
- Sensors 22(15):5511, doi:10.3390/s22155511, https://pmc.ncbi.nlm.nih.gov/articles/PMC9332705/ (CC BY)
- Static controller on a rig, 200-700 mm from the headset, Qualisys reference: "mean absolute error of 13.52 +- 6.57 mm
  at a distance of 500 mm from the head-mounted display along the x-direction"; rotation "1.11 +- 0.37 deg for a
  rotation of 40 deg around the z-axis" (worst cases reported). Native Unity app, not the browser.

### 2d. VR at home (own headset, unsupervised) vs the same VR study in the lab (Mottelson et al. 2021) - local full text objekt-papers/mottelson-2021.txt
- Front. Virtual Real., doi:10.3389/frvir.2021.681482 (local text; the earlier pass used it for practice, not figures)
- Same VR lesson run unsupervised online (161 people, own standalone headsets) and supervised in the lab: factual
  learning "d 1.6 and 2.6", conceptual "d 0.7 and 0.9" (online, lab); "the laboratory study resulted in the largest
  effect sizes, presumably because of a reduced number of aberrant responses, and because of demographic
  differences". So the home effect came out about 60-80% of the lab effect, same direction (our arithmetic).
- In-VR questionnaire reliability: alphas comparable, all "Good consistency" (.9 > alpha > .8).
- Noise: "about 13% of the cohort did not pay an ideal am[ount of attention]" (negative or identical pre/post);
  "an approximate 10% ill-intended user participation"; advice "Estimate about 10% aberrant responses",
  "For hand tracking, count low confidence frames and jitter", "Define objective exclusion criteria before".
- Summary line: "good reliability of collected data, which requires only slightly more sanitation than a comparable
  laboratory study".

### 2c. Newer: modality vs who is tested (Uittenhove, Jeanneret & Vergauwe 2023) - full text read, saved objekt-papers/uittenhove-2023.txt
- J. Cognition 6(1), doi:10.5334/joc.259, https://pmc.ncbi.nlm.nih.gov/articles/PMC9854315/ (CC BY)
- Same working-memory task: lab students 40, web students 215, Prolific 300, MTurk 196. Quality = no anomalous RT
  pattern + both benchmark effects present per person.
- Passed all criteria (Table 2, same column order as N): lab students 87.6%, web students 72.6%, Prolific 71.3%,
  MTurk 34.7% ("Only 34.7% (95% CI [28.4, 41.6]) of MTurk patterns passed").
- Anomalous patterns: web students 8.4% vs lab 7.5%, "not significantly higher".
- Their rule: "recruiting 20% more participants should allow for the same quantity of high-quality data patterns as
  lab-testing would". Practice block repeated until 75% correct was part of the protocol.

### 3 (row, cont.). Preregistration and the size of published effects (Schafer & Schwarz 2019) - full text read, saved objekt-papers/schafer-2019.txt
- Front. Psychol. 10:813, doi:10.3389/fpsyg.2019.00813, https://pmc.ncbi.nlm.nih.gov/articles/PMC6470248/ (CC BY)
- 900 random published effects without preregistration vs all 93 found with it: "Effects from the former (median
  r = 0.36) were much larger than effects from the latter (median r = 0.16)"; "The likelihood of obtaining a
  significant result was considerably smaller in studies published with pre-registration".
- Median N: 89 (not preregistered) vs 267 (preregistered).
- For us: power a room on preregistered/replication effect sizes (about half the classic ones), never on the classic
  paper's number alone.

### 4e. Head direction as a stand-in for gaze (Sitzmann et al., IEEE TVCG 2018; arXiv v2 read, saved objekt-papers/sitzmann-2018.txt)
- https://arxiv.org/pdf/1612.04335 ; 169 users, 1,980 head and gaze trajectories, Oculus DK2 with a Pupil Labs eye
  tracker "recording at 120 Hz", static 360 panoramas, seated.
- Eye-in-head offset: the eye's angle relative to the head "is significantly smaller when users are fixating"; they
  blur head-based maps with "a Gaussian kernel of size 11.7 of visual angle, to take into account the mean eye
  offset while fixating" (degrees).
- Head-only saliency map: "CC score of 0.50 places our approximation on par with the performance of both saliency
  predictors tested"; head orientation "may be sufficient to predict saliency with reasonable accuracy".
- For us (Quest 2/3 have no eye tracker): head pose tells which REGION a player looked at (about 12 deg mean error
  while fixating), not which small object; a room may score "turned toward X" for targets wider than about 25 deg
  apart (our arithmetic from the 11.7 deg mean offset), never fine gaze.

### 4c. Quest head (headset) position accuracy on real game head movements (Banaszczyk et al. 2024) - full text read, saved objekt-papers/banaszczyk-2024.txt
- arXiv:2412.06116 (CC BY), https://arxiv.org/html/2412.06116 ; Quest 2 and Quest Pro on a UR5e robot arm replaying a
  head path recorded in a real game, OptiTrack reference ("expected error smaller than 0.2 mm"); native Unity app.
- Calibration motion: "3.17 mm and 3.23 mm of RMSE for Quest 2 and Quest Pro, respectively, with max errors of
  10.48 mm and 11.97 mm". Repeated real-game path (Table 2): Quest 2 RMSE 3.19 mm, mean 2.85, SD 1.46, max 9.51 mm.
- A later two-hour run after re-calibration showed "42.74 mm translation error and 3.96 deg rotation error",
  attributed by the authors to "an accidental movement" (of the mount): long sessions need a drift check.
- Quest 3 headset on a robot (Lopez-Xarbau et al. 2026, Sensors 26(8):2285, doi:10.3390/s26082285, read,
  https://pmc.ncbi.nlm.nih.gov/articles/PMC13119968/; Unity app, robot as repeatable reference, not metrology):
  "a mean translational RMSE of 0.346 mm (3D RMSE = 0.621 mm)" and "a mean rotational RMSE of 0.143" deg, yaw
  worst (0.259 deg); no controller or hand data. CORRECTED: the "below 0.4 deg" snippet is consistent but not the
  paper's wording. Quest 3 hand tracking 1.73 cm error, 1.11 cm jitter,
  latency 14.4-220.5 ms (Godden, Steedman & Pan 2025, IEEE TVCG 31(5):3025-3034, doi:10.1109/tvcg.2025.3549182;
  citation confirmed by the owner, full text paid: the numbers stay unverified).
- Quest 2 in a 5 m x 5 m room (Holzwarth, Gisler, Hirt & Kunz 2021, ICVARS, CC BY 4.0; full text from the owner,
  objekt-papers/holzwarth-2021.txt): mean height error of the headset "-0.001m" against "0.007m" for a Vive Tracker;
  jitter "0.06mm for the Oculus Quest 2 HMD and 0.18mm for the HTC VIVE Tracker" (RMS, static); height (y) only.

### 4a (cont.). Browser clock resolution (W3C High Resolution Time, Editor's Draft 1 September 2026, read)
- https://w3c.github.io/hr-time/ : performance.now() is coarsened to "100 microseconds, or a higher
  implementation-defined value" (normal pages) or "5 microseconds" (cross-origin isolated), to prevent timing attacks.
- So the clock itself is not the limit (0.1 ms); in WebXR the limit is the frame: poses arrive once per frame
  ("Each row is one render frame", Cesanek 2024), i.e. every 13.9 / 11.1 / 8.3 ms at 72 / 90 / 120 Hz (our arithmetic).

### 1b. Precision of an effect: CI width and N (Lakens, Improving Your Statistical Inferences, ch. 8 sec. 8.7, online book, read)
- https://lakens.github.io/statistical_inferences/08-samplesizejustification.html
- Width depends on SD and N: N = (z x sd / error)^2; IQ example "(1.96 x 15 / 2)^2 = 216.1 observations", so "217
  observations should be collected" for +-2 IQ points.
- Correlation example: N = 50, true r = 0.3 -> 95% CI "from r = 0.024 to r = 0.534" (CI half-width shrinks with
  the square root of N: 4 x the players for half the width - standard statistics, our wording).
- "There is no literature that helps researchers to choose a desired width of the confidence interval"; if the goal
  is to tell an effect from others, "the inferential goal is actually a hypothesis test" (power analysis).

### 1d (cont.). A Registered Replication Report judges by the pooled effect and its CI (Hagger et al. 2016, repository page read)
- Perspect. Psychol. Sci. 11(4):546-573; https://mro.massey.ac.nz/items/4a1951d7-6022-4d0e-bbb6-fc336ecd4792/full
- "Multiple laboratories (k = 23, total N = 2,141) conducted replications of a standardized ego-depletion protocol";
  "d = 0.04, 95% CI [-0.07, 0.15]" - CI includes zero, so the effect was judged small/absent. The original's d,
  confirmed in the full text (Lirias submitted version, objekt-papers/hagger-2016.txt): "Sripada et al.'s (2014)
  study adopting the current methods (d = 0.69)"; the 2010 meta-analysis "(d = 0.62)".
- Many Labs 2 (APS report, earlier pass study-methods-2.md 3e): 14 of 28 replicated, samples "more than 60 times
  larger"; criterion since read in the paper (objekt-papers/klein-2018.txt, study-methods-2.md 3e): "no simple
  decision rule", five significance criteria side by side; 10 of 28 passed all, 13 failed all.

### 4a (cont.). Reaction times inside a VR engine (Wiesing, Fink & Weidner 2020) - local full text objekt-papers/wiesing-2020.txt
- PLOS ONE, "Accuracy and precision of stimulus timing and reaction times with Unreal Engine and SteamVR" (HTC Vive).
- "stimulus durations were highly accurate" but "built-in timing procedures revealed highly variable reaction time
  measurements and inaccurate determination of stimulus onsets"; fixed by moving time capture to a background app,
  then "precision and accuracy in the millisecond range". True refresh "89.53 Hz rather than 90 Hz".
- For us: the engine's built-in time stamps are not trusted without an external check (photodiode or phone video at
  240 fps, the Ouvrai/Warburton method); log frame times and use the measured, not nominal, frame rate.

### 2d (cont.). Out-of-lab VR vs lab (Mottelson & Hornbaek 2017) - local full text objekt-papers/mottelson-2017.txt
- Proc. VRST '17, doi:10.1145/3139131.3139141: pointing, 3D tracing, body illusions; lab 31 (state-of-the-art VR) vs
  57 out of lab (cardboard). Re-read: leaf task "out-of-lab, d = 1.11, 95% CIs [.45, 1.80]; in-lab, d = 1.40, 95% CIs
  [.40, 2.77]", "the effect of the experimental condition was the same"; a follow-up found speed and accuracy gaps
  "were likely due to the hardware used", while for body ownership "the place of study seems to be of more concern".
