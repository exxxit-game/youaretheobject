# rigoni-2010 — A late beep moves your moment of decision (Libet clock with delayed feedback)

- paper: rigoni-2010.txt
- citation: Rigoni, Brass & Sartori (2010). Post-action determinants of the reported time of conscious intentions. Frontiers in Human Neuroscience, 4, 38. (open access)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 16 students (one later excluded) | "Sixteen undergraduates (7 females, 9 males; age range 19-24 years) from the University of Padova volunteered for the present study." | 3 |
| Procedure: the clock | Libet clock: a dot circles the clock face, 3 turns in 8.1 s | "a cursor on the computer screen moved in a clockwise direction around a clock face, completing three revolutions in 8.1 s." | 3 |
| Procedure: posture | Look at the clock centre, finger on the space bar, hand hidden | "Participants were requested to fixate the center of the clock and to rest their right index finger on the response button" | 3 |
| Procedure: free press | Press whenever you like, without planning | "Participants were instructed to press the button spontaneously and suddenly at a time of their own choosing, following at least one rotation of the cursor." | 3 |
| Procedure: the cover story | Told the beep is simultaneous with the press | "Participants were explicitly told that an auditory feedback was delivered simultaneously with each button press." | 3 |
| Procedure: the manipulation | Beep actually 5, 20, 40 or 60 ms after the press | "In fact, the computer emitted a 200-ms beep by a computer-generated random sequence at 5, 20, 40, or 60 ms right after the button press." | 3 |
| Procedure: the report (W) | Where was the dot when you decided? | "Then, participants were asked to report the position of the cursor at the instant they made the decision to respond." | 3 |
| Procedure: trials | 40 per delay, 160 in total | "There were 40 trials at each delay, for a total of 160 trials, administered in two separate blocks." | 4 |
| Duration | Not stated; 16 practice + 160 trials | "Participants performed a practice session of 16 trials." | 4 |
| Measures: brain | 59-channel EEG and forearm EMG were recorded | "Scalp voltages were recorded using a 59-channel electrocap with Ag/AgCL electrodes" | 4 |
| Main result | Reported decision moved later as the beep was delayed: −127 → −101 ms | "The averaged reported Ws at delays of 5, 20, 40, and 60 ms were -127, -111, -102, and -101 ms" | 4 |
| Main result: statistics | Significant effect of delay | "We found a significant effect of the delay factor (F(3,42) = 8.26, p = 0.004" | 4 |
| Main result: partial | The shift is smaller than the delay | "However, the feedback delay was not completely reflected in the reported W." | 7 |
| Nobody noticed | No one detected the delay | "None of the participants acknowledged a temporal mismatch between the two events." | 4 |
| Not the real movement | W did not follow the EMG movement onset | "suggesting that the W is not related to the actual onset of the movement." | 6 |
| Replication | Replicates Banks & Isham (2009) behaviourally | "At a behavioral level, we replicated the finding that the delay of the feedbacks did influence the reported W" | 7 |
| Caveat | Participants may use a strategy relative to the beep | "It is not possible to exclude that people use systematic strategies in this task, either consciously or in an automatic manner" | 8 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated. 160 trials of about 3–5 s of clock plus a report suggest 20–30 min. A game version with 4 delays × 10 trials would take about 6–8 min, too few for a stable personal result (see below).
- Task/tension: an attractive "free will" scene for a psychology game: press whenever you feel like it, then say where the dot was when you decided. There is no story tension, only curiosity.
- Within-person reveal: weak. The group shift is 26 ms (from −127 to −101 ms) and does not follow the full 55 ms range of delays. Clock-reading error in single trials is likely tens of milliseconds, so with 40 trials one player's shift will often be noise. Show it as "you vs everyone", not as a personal proof.
- Works if the player expects tricks: partly. A 60 ms delay was noticed by no one here, so even a suspicious player cannot hear it. The paper itself notes that people may judge "just before the beep", and that strategy is part of the effect.
- Space tier: seated (screen and keyboard, hand hidden).
- VR or mixed reality: neither is closer; the original is a clock on a screen. VR gives a dark, distraction-free clock, which is closer to a lab cubicle. Mixed reality could put the clock on the player's real table with no gain for this effect.
- Quest 3 feasibility: the behavioural part is feasible (a clock dot at 72–90 Hz, the trigger as the button, reporting by pointing at the clock rim). The famous Libet part (readiness potential before the decision) needs EEG, and the movement check needs EMG; neither is available, so the room cannot show "your brain decided before you". The 5–60 ms delays require knowing the browser's press-to-sound delay and its jitter. A constant base delay can be subtracted, but jitter of ±20 ms would blur the conditions. Measure on the headset first (microphone plus button log).
- Replication: replicates Banks & Isham (2009) with the same paradigm. My search found no failed replication of the delay shift. The W measure itself is fragile: Ivanof et al. 2022 (Sci Rep, read) found W judgments change with clock speed and number of markings.
- Ethics: mild deception (the beep is called simultaneous); debrief after.
- Verdict: interlude. The free-will theme is strong but the effect is small, the personal reveal is unreliable, and the brain half of Libet is impossible. Build only after the headset's sound delay is measured, and present the result as a group result.
