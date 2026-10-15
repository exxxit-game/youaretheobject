# burger-2025 — The red ball on the right sends your hand left (Simon effect in VR, controller movements)

- paper: burger-2025.txt
- citation: Bürger, Peintner, Heilmann, Pastel & Witte (2025). Examination of the influence of stimuli eccentricity on the inhibitory control in a Simon task within virtual reality. PLoS ONE, 20(12), e0338792. (CC BY)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 30 recruited, 26 analysed | "30 participants (14 females, 16 males, age: M=24.8 years, SD=3.2 years) were recruited for the study" | 3 |
| Participants: analysed | 26 after exclusions | "Two participants were excluded due to tracking issues, leaving data from 26 participants for analysis" | 6 |
| Participants: VR experience | Most had used VR before | "Of the 30 participants, 26 had prior experiences with VR" | 3 |
| Equipment | Pimax 5k Super (200° diagonal field of view), Vive controller | "The virtual environment was presented using the Pimax Vision 5k Super headset" | 4 |
| Procedure: posture | Seated | "All tests were conducted with participants seated on a chair" | 4 |
| Procedure: head-locked | Display did not follow head movements | "In this study, the HMD served more as a monitor since the environments were not responsive to head movements." | 4 |
| Procedure: spheres | Two spheres placed symmetrically at 22°, 45° or 60° | "Both spheres were always positioned symmetrically at the same eccentricity on either side" | 5 |
| Procedure: the change | After 2.5–6.5 s one sphere turns red or green | "after a time interval (between 2.5-6.5 seconds), one of the spheres changed color to either green or red, while the other remained white." | 5 |
| Procedure: rule | Red: move the controller left; green: right; side irrelevant | "Participants were instructed to move the controller to the left when a sphere turned red and to the right when a sphere turned green" | 5 |
| Procedure: response window | 1.5 s to respond | "Participants then had 1.5 seconds to respond" | 5 |
| Procedure: trials | 60 trials (3 eccentricities × 2 colours × 2 conditions × 5) | "participants completed five trials, resulting in 60 trials in total" | 6 |
| Procedure: measure | Time until the controller moved 10 cm (movement time later subtracted) | "the response time, as the time between one sphere changing color and the controller being moved 10cm toward a side" | 6 |
| Duration | Not stated for the Simon task; the VR questionnaires took about 5 min | "Both questionnaires served to acclimatize participants to VR and lasted together approximately five minutes." | 3 |
| Main result | Simon effect at all eccentricities | "In all eccentricity categories, significantly shorter RTs were observed in the congruent condition compared to the incongruent condition." | 7 |
| Main result: size | 44 ms (22°), 49 ms (45°), 77 ms (60°) | "with a greater effect for far-peripheral trials (M=77ms, SD=44ms) than for near-peripheral trials (M=44ms, SD=48ms" | 7 |
| Main result: mid | 49 ms at 45° | "mid-peripheral trials (M=49ms, SD=57ms" | 7 |
| Sickness | No change in simulator sickness | "No significant changes were observed in the SSQ scores before and after the VR tests" | 7 |
| Enjoyment | High | "enjoyment levels were high, with a rating of M=7.3, SD=1.9" | 8 |
| Earlier VR Simon (replication) | VR and 2D gave a similar Simon effect | "compared a conventional 2D Simon task with a VR version and found faster reactions in the 2D version, but a similar Simon effect" | 3 |
| Earlier VR Simon: depth | No effect of 3D depth | "Qian and colleagues [33] investigated the influence of stimulus 3D depth on the Simon effect, observing no effect of depth." | 3 |
| Limitation | No eye tracking | "Additionally, the absence of eye tracking prevents us from fully ruling out the use of saccades to verify the stimulus colors." | 11 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated for the task. 60 trials of 2.5–6.5 s waiting plus a 1.5 s window come to about 4–8 min (my calculation), plus a 28-trial central reaction test used to correct for left/right speed differences.
- Task/tension: mild. A reaction game: sweep left for red, right for green.
- Within-person reveal: moderate. "The side where the colour appeared, which you were told did not matter, cost you about 50 ms." With 10 trials per cell the player's own difference is noisy (SD of the effect 44–57 ms between people). It is better shown as a group comparison or with more trials.
- Works if the player expects tricks: yes. The Simon effect is automatic and appears although the rule says to ignore position.
- Space tier: seated (chair; the movement is a 10 cm sweep of the controller).
- VR or mixed reality: either. The original used the headset as a large head-locked screen with no scene. Mixed reality would add the real room behind the spheres, a small change. VR is closer to the grey background.
- Quest 3 feasibility: feasible for 22° and probably 45°. The 60° condition, which gave the largest effect, does not fit: the Quest 3 horizontal field of view is about 110°, so 60° to each side is outside the display (the paper used a 200° headset). Controller sweeps and 10 cm movement detection are easy. Response onset was found offline from 1 mm movement; the game can do the same from controller positions. No eye tracking, the same as the paper.
- Replication: the Simon effect is one of the most replicated reaction-time effects. In VR, an earlier study (Rocabado & Duñabeitia, cited) found a similar Simon effect in VR and 2D, and another (Qian et al.) found no effect of depth. The eccentricity increase is one new study with 26 people.
- Ethics: none.
- Verdict: interlude. It is robust and seated, the body movement is natural for a game, and it takes 5–8 min. The reveal is a modest delay, and the strongest condition (60°) cannot be shown on Quest 3.
