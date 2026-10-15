# Precision, part 2: the table of fixes, what our instrument allows, and the order of fixes
(Parts list and the findings with quotes: data-precision.md. Earlier passes: docs/research/study-methods-1.md and -2.md.)

## 3. Fixes and their measured effect on data quality

Rows marked "local" were read in full in the earlier pass (texts in objekt-papers/); key numbers re-checked in the
text files for this pass. "Not measured" = no number for the fix's own effect in any source read.

| Fix | Measured effect | Source |
|---|---|---|
| Who is tested (pool) | Share of people passing all quality checks: lab students 87.6%, web students 72.6%, Prolific 71.3%, MTurk 34.7% | Uittenhove 2023 (data-precision.md 2c) |
| Unpaid volunteers with feedback (our model) | Web alphas equal to lab (e.g. CFMT .88 vs .87); twin registry vs web VPAM .72 vs .82 | Germine 2012 (2a) |
| Comprehension check with forced retry (IMC variant) | IMC failure 7% to 46%; the effect showed only in passers; after forced re-reading failers "became indistinguishable" | Oppenheimer 2009 (local) |
| Instruction quiz before the task | Category learning moved closer to lab ("increased the congruence"); shown in a figure, no single number | Crump 2013 (2b) |
| Bigger pay | "little impact on overall learning rates" | Crump 2013 (2b) |
| Seriousness check at the end | 3.2% said "just clicked through"; their answers agreed with a validity criterion 51.5% vs 66.7% for the serious | Aust 2013 (local) |
| Speed filter (fastest 10%) | "only a marginal effect on data validity" | Aust 2013 (local) |
| Commitment request ("Do you commit...") | Share with 2+ quality problems: 4.6% vs 11.0% control (industry test, not peer-reviewed) | Geisen 2022 (local summary) |
| Passive warning | "not effective in reducing carelessness" | Bruhlmann 2024 (local) |
| Typed warning | Reduced carelessness; self-rated diligence d = 0.18; but "significantly more attrition" | Bruhlmann 2024 (local) |
| Honesty pledge (sign first) | No effect in n = 4,559 + 1,235; original retracted | Kristal 2020 (local summary) |
| First run only | Effects on repeat players "decreased by about 25%"; power example N 172 -> 200 | Chandler 2015 (local) |
| Exclusion rules | What they remove: 6.9-13% self-reported problems/cheating/repeat/device (web); about 10-13% aberrant in home VR. Gain from fixing rules IN ADVANCE: not measured as a separate number in the sources read | Germine 2012; Mottelson 2021 |
| Over-recruitment | No quality gain; it buys back N: +20% for web vs lab; plan for about 10% aberrant in home VR | Uittenhove 2023; Mottelson 2021 |
| Preregistration / registered reports | Positive results 96% (standard) vs 44% (registered reports); median effect r = 0.36 vs 0.16 | Scheel 2021; Schafer 2019 |
| Bot defences | An AI agent passed standard attention checks 99.8% of the time and got past a reCAPTCHA page. A bot defence that works: not measured. Head/hand physical-plausibility checks in VR: not measured anywhere found | Westwood 2025 (local) |

## 4. What the instrument allows (Quest + WebXR in the browser)

| Measure | Published precision | What we can use it for |
|---|---|---|
| Clock | performance.now() at 100 us, or 5 us if cross-origin isolated | Not a limit |
| Frame sampling | one pose per frame: 13.9 / 11.1 / 8.3 ms at 72 / 90 / 120 Hz; Vive ran at 89.53, not 90 | Log measured frame times, not the nominal rate |
| Motion-to-photon, mid-movement | 8.3 ms (Quest 2, browser, with prediction) | Smooth movement display is lab-grade |
| Motion-to-photon, movement onset | 21-42 ms on PC headsets; no Quest onset figure published (searched 10.10.2026) | Measure once with a 240 fps phone video |
| Keyboard/browser RT offset on home PCs | about 70-120 ms, SD about 8 ms (Gorilla); Bridges: 8-67 ms | Offset cancels between conditions on the same device; do not compare absolute RTs across device models |
| RT effects online | ~20 ms effects found with many trials; primes of 64 ms or shorter failed | RT differences of 20-30 ms or more between conditions, many trials, many players |
| Engine time stamps | "highly variable" in a game engine until fixed | Check our timing against an external measurement first |
| Head position | Quest 2 RMSE 3.17-3.19 mm, max 9.5-10.5 mm; Quest 3 RMSE 0.35 mm, 0.14 deg (robots, native apps) | Head position, leaning, distance kept: yes |
| Controller | 13.5 mm worst static error at 500 mm; rotation 1.11 deg worst | Reach paths at cm level, pointing direction: yes |
| Hand tracking | Fingertip 1.1 cm, joint angle 9.6 deg, delay 45 ms, lost above about 3.2 m/s (Quest 2) | Coarse gestures and grasp; not fast or latency-sensitive motor tasks |
| Gaze from head pose | Eye sits on average about 11.7 deg off head direction while fixating; head-only map CC 0.50 | Which region or large object (targets more than about 25 deg apart); not which small object |

## 5. How precise our data can be, part by part (our reading of the sources above)

1. The group effect (condition A vs B, one condition per player): precise enough, and the reliability paradox
   does not touch it (Hedge 2018: tasks stay fit for "between-group differences"). Precision is set by N: CI width
   falls with the square root of N (Lakens). Expect the home-VR effect at about 60-80% of the lab effect (Mottelson
   2021, d 1.6 vs 2.6 and 0.7 vs 0.9) and published effects at about half their true size or worse (OSC 2015: r
   .403 -> .197; Schafer 2019: .36 vs .16). So size the sample on half the original effect.
2. One player's own result: not reliable. Classic tasks give test-retest ICC from 0 to .82; difference scores are
   lower (flanker .40). Show "you vs everyone", never a verdict on one person.
3. Reaction times: fine for differences between conditions of 20-30 ms or more, averaged over many trials and
   players, on the same device model. Not fine for very short displays (64 ms or less), absolute RT norms, or
   mixing device models without logging the model.
4. Head pose: millimetre-level position and about 1 deg rotation: good for posture, approach, turning. As gaze:
   region-level only (about 12 deg mean error).
5. Hand paths: controllers good to about 1-1.5 cm with 8 ms latency mid-movement. Hand tracking: about 1 cm,
   45 ms late, fails on fast moves.
6. Seriousness and attention: expect 10-15% bad runs at home (Mottelson 2021 about 10-13%; Germine 7-13%;
   Uittenhove web students 72.6% fully clean vs 87.6% lab).

## 6. Fixes ordered by what each buys
The sizes are on different scales, so this order is our judgement from the measured numbers, not a published ranking.
1. Preregister the room, and power it on a halved effect: the largest measured gap in the field (96% vs 44%
   positive; r .36 vs .16).
2. Pick the pool: the largest measured gap in data quality (34.7% vs 71-88% clean). Unpaid volunteers with
   feedback matched the lab (Germine 2012). Players at home are our pool, so never mix in paid crowd panels
   without screening.
3. First run per player only: avoids effects about 25% smaller.
4. A playable comprehension check with retry before the critical task: brings the effect back (Oppenheimer:
   IMC failures up to 46%; Crump: closer to lab).
5. Exclusion rules fixed before data, plus the end-of-room seriousness question: removes the 3-13% bad runs;
   validity criterion 66.7% vs 51.5%.
6. Recruit 20-35% more players than the target: no quality gain, keeps the power.
7. A one-tap commitment: 11.0% -> 4.6% low-quality (industry evidence only).
8. A typed (in VR: performed) warning: small gain (d = 0.18) and people leave. A passive warning: nothing.
9. Honesty pledge: nothing (do not use).
10. Bots: attention checks no longer stop them (99.8% pass). For VR, log every frame's head and hand pose so runs
    can be checked for physical plausibility (no measurement of how well this works was found).
Instrument steps that cost little: log device model, measured frame times, and WebXR tracking flags. Measure the
Quest's motion-to-photon latency once with a 240 fps phone video (Cesanek 2024 method).

## Not reached / unverified
- Many Labs 2 criteria: since read (study-methods-2.md 3e); Scheel 2021 since read (data-precision.md); Quest 3 tracking:
  Sensors 2026 robot study since read (headset RMSE 0.346 mm, 0.143 deg; data-precision.md 4c); TVCG 2025 hand
  tracking: citation only, full text paid (owner); Holzwarth et al. 2021
  since read (data-precision.md); Quest motion-to-photon latency at movement onset: none published (searched again;
  OptoFidelity's Quest 3 test is mid-movement only, data-precision.md 4b).
- Validity as a concept (construct, external) was not covered by a separate source in this pass; reliability types
  appear only through Hedge 2018 (test-retest ICC) and Germine 2012 (Cronbach alpha, split-half).
