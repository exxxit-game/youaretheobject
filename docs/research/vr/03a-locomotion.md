# 03-sub: What reduces VR sickness in locomotion (teleport vs smooth, vignette, speed, acceleration, turning)

Scope: the locomotion defaults in `src/engine/locomotion-math.js` (teleport + snap 45° by default; smooth moving optional at 1.4 m/s with no ramp-up; smooth turn 180°/s; vignette full at 1.4 m/s or 180°/s, down to 50°).
Every number below comes from a text read in this session. Page/section refers to the saved text. "Full text read: yes" means the body was read end to end (reference lists skimmed).
I stopped early on the coordinator's instruction (cost), so some sources are only partly covered. They are listed under "Could not open / not read".

## Teleport vs smooth

- **Steering was sicker than teleporting on average, but 9 of 25 people were sicker when teleporting. 24 of 25 got sick in at least one trial.** Exposure: 16 min per trial, 4 trials over 2 days, HTC Vive. Players had to keep moving (steering) or teleport every 2 s. Turning was physical. Mean FMS (0–20): steering 2.970 vs teleport 2.064, F(1,23)=5.196, p=.03 (§3.1.1.1). 15 people were "STEERsick" and 9 "TELEsick" (§3.1.1.2). Mean peak FMS was 6.28/20 (§4.1). Standing vs sitting made no difference to sickness. Steering gave more spatial presence (IPQ 3.832 vs 3.324, p=.039) and more realism (§3.2.1). — Clifton & Palmisano, "Effects of steering locomotion and teleporting on cybersickness and presence in HMD-based virtual reality", Virtual Reality 24:453–468 (2020), doi:10.1007/s10055-019-00407-8 (UOW accepted manuscript) — verified yes, full text read yes — "teleportation is not a complete solution to the problem of cybersickness" — For us: teleport as the default is right, but some players do worse with it. Keep smooth moving as a real option, not a hidden one.
- **Joystick moving raised sickness; teleport did not, and players preferred teleport.** n=33 (11 per group), HTC Vive (about 110° diagonal), about 15 min in the headset, default VRTK joystick and teleport code. SSQ before → after: joystick 6.07 → 14.73 (significant rise, p=.035); teleport 12.15 → 7.01; redirected walking 5.61 → 6.78 (Table 15.2, p.160). Preference: teleport and redirected walking both beat joystick (p=.0077 and p=.0031). Presence did not differ. — Langbehn, Lubos & Steinicke, "Evaluation of Locomotion Techniques for Room-Scale VR: Joystick, Teleportation, and Redirected Walking", VRIC 2018, doi:10.1145/3234253.3234291. Read as Chapter 15 of Langbehn's 2019 dissertation (Univ. Hamburg, ediss 6074), which the dissertation says is this paper — verified yes (dissertation version), full text read yes (Ch. 15) — "VR sickness significantly increased for participants from the JS group" — For us: supports teleport as the default. Very short exposure (travel time about 1 min), small groups.
- **Review count: 12 of 21 "movement" papers found significant sickness reductions.** Teleport beat steering in Habgood 2018, Clifton 2020, Christou 2017, Lugrin 2019 and Mayor 2019. Kwok 2018 found 24 m/s sicker than 10 m/s (§5.8, pp.12–13). — Ang & Quarles, "Reduction of cybersickness in head mounted displays use: A systematic review and taxonomy of current strategies", Frontiers in Virtual Reality 4:1027552 (2023), doi:10.3389/frvir.2023.1027552 — verified yes, full text read yes — "teleportation reduced total SSQ scores the most" (on Mayor et al. 2019) — For us: the pooled picture backs teleport-first. The primary studies it lists were not read.

## Vignette / FOV restriction

- **Al Zayer (CHI 2019): dynamic circular restrictor, smallest FOV 50° on a Vive with about 100° horizontal; full at 1.4 m/s or 180°/s; it lowered sickness in BOTH sexes.**
  - Settings (§5.3.3, pp.96–97): RFmax = 0.75, which the authors say equals a minimum FOV of 50° on the HTC Vive (about 100° horizontal, 110° diagonal, 90 Hz). vmax = 1.4 m/s, chosen as average preferred walking speed. ωmax = 180°/s, "empirically found" to give frequent restriction during the head movement their task needed. The restriction was applied gradually with feathered edges (SixWays UnityVrTunnelling).
  - Important difference from our game: participants stood and turned with their body. There was NO stick turning (§5.3.7, p.101), so the 180°/s trigger was real head/body rotation, not virtual turning. The stick only moved them, at 0–1.4 m/s (p.98), and they moved at a fixed speed more than 87% of the time (p.105).
  - Sample (§5.3.1, p.94): 30 recruited; 2 women quit from severe discomfort (one in each condition); 28 analysed (14 women). Sessions of 25 min (p.100).
  - Relative SSQ total, no restrictor → restrictor (Table 5.2, p.103): all 30.59 → 9.62; women 32.32 → 3.74; men 28.85 → 15.49.
  - Effects (§5.4.2, pp.105–107): the restrictor lowered average discomfort (F=9.30), end discomfort (F=7.23), SSQ total (F=5.04) and SSQ oculomotor (F=6.01), all p<.05. Nausea (p=.062) and disorientation (p=.074) were not significant. There was no sex × restrictor interaction and no sex difference. Navigation error did not change.
  - 6 of 28 (21%) had no symptoms (p.110).
  - Source: Al Zayer, Adhanom, MacNeilage & Folmer, "The Effect of Field-of-View Restriction on Sex Bias in VR Sickness and Spatial Navigation Performance", CHI 2019, doi:10.1145/3290605.3300584. Read as Chapter 5 of Al Zayer's 2019 UNR dissertation, which says that chapter "resulted in" the CHI paper (p.8). — verified yes (dissertation version; the CHI PDF itself was not opened), full text read yes (Ch. 5) — "effective in mitigating VR sickness symptoms in both sexes" — For us: our 1.4 m/s / 180°/s / 50° match Al Zayer exactly. But their 180°/s was head/body turning, not stick turning, and the benefit was for both sexes, not mainly women.
- **Fernandes & Feiner (2016): a much milder vignette (smallest 80° or 90°), contracting slowly and subtly. It lowered discomfort and kept people in longer, but SSQ did not change.**
  - Setup: Oculus DK2, seated, gamepad for moving and turning, speed capped at 1.5 m/s, 75 fps (§3, §4.2, pp.203–204). The restrictors reacted only to gamepad moving and turning, not to head motion (p.204).
  - Edge: soft edge, clear inner zone 43° at the 90° setting and 36° at the 80° setting (Fig. 3).
  - Contraction rate: CRate = |angular velocity|/20 + speed×4, slowed further near the minimum. When standing still it re-opened at 3°/s or 9°/s (§4.2).
  - Pilot, 8 people (§4.1): the change was first noticed at 95° (mode); 80° "detracted"; 90° was preferred.
  - Sample: 32 recruited, 30 did both sessions; 6 with discomfort <1 in both sessions were dropped, leaving 24 (§6, p.206).
  - First session, no restrictor vs restrictor (Table 1): average discomfort 4.95 vs 2.97 (p=0.00057); SSQ 61.1 vs 57.7 (not significant, p=0.370); finished the route 1/12 vs 6/12 (p.206).
  - 80° vs 90°: no difference (p.208). Presence did not change (149.3 vs 150.7, p=0.554). 11 of 15 at 90° did not notice the vignette at all (p.209).
  - Players said gamepad rotation caused the most nausea (p.208).
  - Source: Fernandes & Feiner, "Combating VR Sickness through Subtle Dynamic Field-Of-View Modification", IEEE 3DUI 2016, pp.201–210, doi:10.1109/3DUI.2016.7460053 (author copy, cs.columbia.edu) — verified yes, full text read yes — "FOV restrictors helped participants stay in the VE longer and feel more comfortable" — For us: our 50° minimum is far stronger than theirs. Their benefit showed in discomfort ratings and in staying in, not in SSQ.
- **Quest 2, consumer game, N=201: a vignette alone and snap alone each lowered sickness. Together they were no better, and on SSQ worse than snap alone.**
  - Setup: seated, up to 20 min of Jurassic World Aftermath (§4.1–4.4).
  - Vignette: translation only, ~100 ms onset regardless of speed, all-or-nothing. Clear central 40°, a see-through band from 40° to 60°, black beyond 60° horizontal; display about 104°×98°.
  - Smooth turn about 180°/s. Snap 22.5° with a brief black screen.
  - Results by condition (Table 1):

    | Condition | SSQ total | Average discomfort (0–10) | Minutes in VR (of 20) |
    |---|---|---|---|
    | None | 64.37 | 3.48 | 14.46 |
    | Vignette only | 45.48 | 2.63 | 16.69 |
    | Snap only | 33.73 | 1.90 | 18.66 |
    | Both | 58.11 | 2.64 | 17.46 |

  - Statistics: none > vignette only (discomfort p=.013, SSQ p=.013); none > snap only (p<.001); both > snap only on SSQ (p=.011) (§5.1–5.2).
  - Immersion was lower with the vignette (p=.05) and with both tools (p=.013). Enjoyment was highest with snap only (§5.3).
  - Source: Kelly, Doty, Gilbert & Dorneich, "Field of view restriction and snap turning as cybersickness mitigation tools", IEEE TVCG (2024; in-press manuscript on NSF PAR 10591601) — verified yes, full text read yes — "caution is warranted when combining multiple cybersickness mitigation tools" — For us: the closest match to our hardware. Do not assume vignette + snap adds up; test the combination.
- **Review: only 4 of 10 vignette papers found a significant reduction** (§6.8, p.15; the conclusion says "three"). The authors blame small samples and unusual scenes, not the method. — Ang & Quarles 2023 (as above) — verified yes, full text read yes — "these results do not indicate that FOV is a dead-end" — For us: a vignette helps but the evidence is mixed. Keep it optional and adjustable.
- **Teixeira & Palmisano 2021: 40 people, Marvel Powers United VR, 10 min × 3 sessions. Dynamic restriction lowered sickness, and presence rose with vection.** — Teixeira & Palmisano, "Effects of dynamic field-of-view restriction on cybersickness and presence in HMD-based virtual reality", Virtual Reality 25:433–445 (2021), doi:10.1007/s10055-020-00466-2 — verified NO (abstract only, from the Springer page), full text read no — "significantly reduced by dynamic FOV restriction" — For us: do not cite its numbers. Restriction amount and triggers are unknown.
- **Meta-analysis (97 studies): peripheral FOV restriction was consistently linked to less cybersickness.** — Allison, Palmisano et al., "Visual Factors in Cybersickness: A Literature Survey and Meta-Analysis", Multisensory Research (2025), doi:10.1163/22134808-bja10181 — verified NO (abstract only, Europe PMC), full text read no — For us: the pooled direction matches. Effect sizes are not verified.

## Speed and acceleration

- **Bonato (2008) compared steady forward flow with flow that kept reversing direction and pausing. It did NOT compare a speed ramp with an instant start.**
  - Exp. 1: n=14 (7 M / 7 F), monitor not HMD, 45°×53°, one eye, chin rest, 5 min viewing (§2.1).
  - Conditions: "steady" = the flow kept expanding at a constant rate. "Alternating" = expanding and contracting, with every 5 s of flow interrupted by 1 s of a still pattern.
  - SSQ total (§2.2, pp.287–288): steady 21.6 (SD 21.4) vs alternating 36.9 (SD 29.6), t(13)=2.94, p=.006. Nausea, oculomotor and disorientation scores were all lower with steady flow.
  - Exp. 2 (n=14): steady flow gave more vection overall (21.1 vs 10.3) and fewer vection drops.
  - Source: Bonato, Bubka, Palmisano, Phillip & Moreno, "Vection change exacerbates simulator sickness in virtual environments", Presence 17(3):283–292 (2008), doi:10.1162/pres.17.3.283 (UOW repository copy) — verified yes, full text read yes — "these results suggest that changing vection exacerbates SS" — For us: supports a steady speed with no stop-start or back-and-forth flicker. It is not direct evidence that an instant start beats a short ramp.
- **Onset thresholds: steady forward motion caused first unease at about 1.2 m/s on average; turning thresholds were lower; the effect of acceleration was unclear.**
  - Setup: HTC Vive Pro (110°), 3–5 s exposures of a dense particle field, staircase method. 18 participants (17 listed, 11 M / 6 F) (§IV.E).
  - Forward steady threshold: mean multiplier 1.183, SD 0.836 (Table 4), "approximately 1.2 m s-1, which is close to walking speed" (§VI.B). Rotation thresholds were significantly lower than translation (p<.001). A sustained roll of 20°/s was enough to cause unease.
  - Acceleration: the authors could not separate it from vection build-up. They say developer advice to jump straight to speed is "not backed by strong evidence" (§II, §VI.C).
  - Source: Terenzi & Zaal, "Rotational and Translational Velocity and Acceleration Thresholds for the Onset of Cybersickness in Virtual Reality", NASA NTRS 20200000787 (2020; venue not stated in the PDF) — verified yes, full text read yes — "not backed by strong evidence" — For us: 1.4 m/s sits near the average onset threshold, with wide spread between people. Instant start has no strong evidence for or against. Turning is the more sickening axis.
- **Speed in the vignette studies:** Al Zayer 0–1.4 m/s by stick (p.98); Fernandes up to 1.5 m/s (p.204). Ang & Quarles summarise Kwok 2018: 24 m/s sicker than 10 m/s, and Widdowson 2019 (constant vs ramp vs polynomial speed profiles): not significant (§5.8). — verified yes for the papers read; the Kwok and Widdowson primaries were not read — For us: walking pace is the studied range. No read source tested a speed ramp in an HMD with a clear result.

## Turning (snap vs smooth, snap angle)

- **Snap turning lowered SSQ by about 40% (Farmani & Teather 2020).**
  - Setup: Oculus Rift CV1, seated, MOUSE turning, 20 min zombie shooter, 14 vs 14 between groups (§3.2).
  - Snap: 22.5° steps with a ~800 ms fade to black, only above 25°/s (slower turning stayed smooth).
  - SSQ total: snap 29.8 vs smooth 48.1, t(26)=2.3, p=.026 (§3.2.5). Presence 4.16 vs 4.89 (p=.06, not significant).
  - Dropouts: 2 smooth-turn players quit at 4 and 7 min; 1 snap player quit at 14 min (§3.2.6).
  - Translation snapping (1 m jumps every 416 ms, n=20): SSQ 27.1 vs 52.1 (47% lower); 2 quit, both without snapping (§4.2.5).
  - Pilot of turn speeds (n=12, passive turning, 1.2 min per speed, always slow to fast): preferred 15–35°/s; nausea became notable from about 25°/s; 3 quit at 100°/s and 2 at 200°/s (§3.1.5, Table 1).
  - Source: Farmani & Teather, "Evaluating discrete viewpoint control to reduce cybersickness in virtual reality", Virtual Reality 24:645–664 (2020), doi:10.1007/s10055-020-00425-x (author copy via Wayback of csit.carleton.ca) — verified yes, full text read yes — "rotation snapping significantly reduced participant cybersickness levels (per the SSQ) by about 40%" — For us: supports snap by default. Note: 22.5°, mouse input, and a long fade, not a 45° stick snap.
- **Snap angle: no read study compares angles.** In Farmani's pilot (6 lab members), 45° and 30° were tried first and "pilot participants found them disorienting", so 22.5° was chosen (§3.2). They note the Oculus best-practice guide proposed 30°, apparently from informal testing (§2.3). Kelly 2024 used 22.5°, picked as an "intermediate" value to avoid floor and ceiling effects (§4.2). Kelly also summarises Ryge 2018 (30° snaps, about 5 min): no difference from smooth turning, possibly a floor effect (§2.2). — verified yes (Farmani, Kelly), full text read yes; Ryge 2018 and Sargunam & Ragan 2018 not read — For us: our 45° comes from Meta, not from a study. The only data point (an informal pilot) called 45° disorienting. Studies used 22.5°. Consider offering 22.5/30/45 and saying the default is a choice, not a finding.
- **Smooth turn at about 180°/s is what a commercial game used as the no-mitigation control, and that control was the sickest condition** (Kelly 2024 §4.2, Table 1). Turning thresholds are lower than moving thresholds (Terenzi §VI.B). — verified yes, full text read yes — For us: 180°/s smooth turn is a sickening setting. Keep snap as the default even in smooth-move mode, or tie the vignette to turning as well (Kelly did not test that).

## What defaults suit most players

The evidence read supports **teleport + snap turn as the default**.
- In the 16-minute Clifton study, 24 of 25 people got sick, with steering worse than teleport on average (FMS 2.97 vs 2.06).
- Joystick moving raised SSQ (6.1 → 14.7) while teleport did not (Langbehn).
- On a Quest 2, snap turning alone cut SSQ from 64.4 to 33.7 and kept people in VR 18.7 of 20 min instead of 14.5 (Kelly, N=201).
- Snap turning also cut SSQ by about 40% with a mouse (Farmani).

Smooth moving should stay available because some people do worse with teleport (9/25 in Clifton) and steering gives more presence (Clifton). When it is on, a vignette helps but not dramatically:
- Kelly, Quest 2: SSQ 64.4 → 45.5, discomfort 3.48 → 2.63, minutes in VR 14.5 → 16.7.
- Al Zayer: relative SSQ 30.6 → 9.6, for both sexes alike; 2 of 30 still quit.
- Fernandes: discomfort 4.95 → 2.97, finishing 1/12 → 6/12, but no SSQ change.

A vignette costs immersion (Kelly p=.05). Stacking vignette + snap gave no extra benefit and was worse than snap alone on SSQ (58.1 vs 33.7, Kelly). That argues for letting players toggle the vignette rather than forcing it on top of snap.

How many get sick: in hard continuous-movement tasks most people get some symptoms:
- 24/25 in Clifton.
- Only 21% symptom-free in Al Zayer; 6/30 essentially unaffected in Fernandes.

How many quit:
- 2/30 in Al Zayer.
- 11/12 (no vignette) vs 6/12 (vignette) of the sick-prone subset failed to finish in Fernandes.
- 2/14 without snap vs 1/14 with snap in Farmani.

Speed: 1.4 m/s is the walking pace these studies used and lies near the mean onset threshold (about 1.2 m/s, Terenzi). No read paper tested instant start against a short ramp in an HMD.

## Fade on a scene change (read)

- **No platform gives a duration**: Meta, "Locomotion best practices" (updated 2025-12-17, opened):
  only "Keep acceleration events brief and infrequent" and sound "to aid orientation during
  transitions"; Unity XRI's vignette has an "Ease In Time" setting with no default stated; Google
  Daydream Elements (2017): after "an instant jump or a fade to black, you need a few seconds to get
  your bearings again", no duration.
- **Preferred fade about 0.3 s** — Wölwer & Zielasko 2024, arXiv 2406.19895 (opened), a teleport
  prestudy with 9 people: "M=0.31 s, SD=0.13 s, Md=0.30 s, Min=0.10 s, Max=0.70 s"; three preferred
  0 s; "a too-long animation uncomfortable because it triggers blinking". A weak source: small, and
  a teleport rather than a door. Our door passage fades in 0.45 s, inside that range.

## Check of our values

| Our value | Cited source | What the paper says | Agrees |
|---|---|---|---|
| Teleport + snap turn by default | Meta guidance (not checked here) | Clifton: teleport less sickening on average (FMS 2.06 vs 2.97) but 9/25 sicker with teleport. Langbehn: joystick SSQ rose significantly, teleport did not, teleport preferred. Kelly/Farmani: snap lowers sickness. | yes (keep smooth available) |
| Snap 45° | Meta design/locomotion-user-preferences (not checked here) | No read study compares angles. Farmani's informal pilot found 45° and 30° disorienting and chose 22.5°. Kelly used 22.5°. | not supported by any paper; weak evidence against |
| Smooth speed 1.4 m/s | Meta ("about 3 mph") | Al Zayer used 0–1.4 m/s (preferred walking speed). Fernandes capped at 1.5 m/s. Terenzi's mean onset threshold was about 1.2 m/s (SD large). | yes as a studied value; it is not shown to be comfortable for all |
| Instant speed, no acceleration, "speed changes sicken more (Bonato 2008)" | Bonato et al. 2008 | Bonato compared steady expanding flow with flow that reversed direction and paused every 5 s (monitor, one eye, 5 min, n=14): SSQ 21.6 vs 36.9. It did not test speed ramps or instant start. Terenzi: acceleration effect unclear; instant-start advice "not backed by strong evidence". | partly: supports steady vection, not specifically "instant start" |
| Smooth turn 180°/s | Meta IWSDK default | Kelly: about 180°/s smooth turn was the no-mitigation control, the sickest condition. Farmani pilot: preferred 15–35°/s, quits at 100 and 200°/s. Turning is the more sickening axis (Terenzi). | the value matches common practice; research does not support it as comfortable |
| Vignette fullAtSpeed 1.4 m/s | Al Zayer 2019 | vmax = 1.4 m/s (§5.3.3) | yes |
| Vignette fullAtDegPerS 180 | Al Zayer 2019 | ωmax = 180°/s, but it applied to physical head/body turning (players stood and turned their bodies; no stick turning) | number yes; context no (we apply it to stick turning) |
| Vignette minFovDeg 50 "of a 100° view" | Al Zayer 2019 | RFmax 0.75 = min FOV 50° on a Vive with about 100° horizontal; gradual, feathered edge | yes (Quest 3 is wider, so 50° there is a stronger cut) |
| "after Fernandes & Feiner (2016)" | Fernandes & Feiner 2016 | Fernandes: minimum 80° or 90°, soft edge, slow subtle contraction, DK2, n=30 (24 analysed). Discomfort lowered, SSQ not. | lineage yes; Fernandes' vignette was much milder than our 50° |
| "and it lowered sickness" | Al Zayer 2019 | Lowered average discomfort, end discomfort, SSQ total and SSQ oculomotor; not nausea or disorientation. Effective in both sexes, no sex interaction (not mainly women). | yes |
| "snap turning cut sickness in Farmani & Teather 2020" | Farmani & Teather 2020 | SSQ 29.8 vs 48.1 (~40%), n=28, 22.5° snaps with ~800 ms fade, mouse input, above 25°/s | yes (different angle, input and fade from ours) |

## Local files saved

All files are in C:\Users\admin\Documents\objekt-papers\
- fernandes-2016.pdf/.txt — read in full
- al-zayer-2019-dissertation.pdf/.txt — Ch. 5 read in full; it is the CHI 2019 study
- bonato-2008.pdf/.txt — read in full
- clifton-2020.pdf/.txt — read in full
- farmani-2020.pdf/.txt — read in full
- kelly-2024.pdf/.txt — read in full
- terenzi-2020.pdf/.txt — read in full
- langbehn-2019-dissertation.pdf/.txt — Ch. 15 read in full; it is VRIC 2018
- ang-2023.pdf/.txt — read in full
- horejsi-2025.pdf/.txt (Hořejší et al., Sci Rep 2025, locomotion methods in mazes, n=15) — saved but NOT read

## Could not open / not read

- **Teixeira & Palmisano 2021**: paywalled; UOW lists it "not open access"; not on figshare; Joel Teixeira's PhD thesis (figshare) does not contain it. Abstract only.
- **Al Zayer et al. CHI 2019 PDF itself**: ACM 403 and ResearchGate blocked. The dissertation chapter was used instead.
- **So, Lo & Ho 2001** (Human Factors 43:452–461): Sage paywall; the HKUST repository is behind a CAPTCHA (not bypassed). Not read. No speed study read beyond Terenzi and the review summaries.
- **Langbehn 2018 VRIC PDF**: ACM closed; the dissertation version was used instead.
- **Frommel et al. 2017**: not searched (stopped for cost).
- **Allison & Palmisano 2025 meta-analysis**: Brill blocks automated download (202 challenge). Abstract only.
- **Adhanom et al. FOV-restriction review**: none found under that name. Ang & Quarles 2023 was used as the review.
- **Snap-angle comparisons**: none found. Sargunam & Ragan 2018 (IWISC, 30° discrete turning) and Ryge et al. 2018 (IEEE VR poster, 30°) are closed access and the UF lab site timed out. Not read.
- **Wu & Suma Rosenberg 2022** (VRST, adaptive FOV restrictor, N=38): downloaded to the scratchpad from NSF PAR 10470533 but not read or saved.
- **Hořejší et al. 2025**: saved, not read.
- **Gaps on acceleration**: Widdowson 2019 (constant/ramp/polynomial speed profiles) and Dorado & Figueroa 2014 were not read. They are known only through the Ang & Quarles summary (both not significant).
