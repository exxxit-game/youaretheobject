# pfeil-2021 — Is your room shorter through the cameras? (distance perception in video passthrough vs the naked eye)

- paper: pfeil-2021.txt
- citation: Pfeil, Masnadi, Belga, Sera-Josef & LaViola (2021). Distance perception with a video see-through head-mounted display. Proceedings of CHI 2021, Yokohama. https://doi.org/10.1145/3411764.3445223 (author copy, UCF)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 26 students, almost all men | "Our final participant pool consisted of 26 individuals (24 male, 2 female)." | 4 |
| Participants: design | Everyone did every condition | "We conducted a 3x4 within-subjects study with two independent variables - Headgear and Distance." | 3 |
| Procedure: conditions | No headset; video passthrough headset; an empty headset shell with the same narrow view | "where the users wore just a plastic casing from a stripped-down HMD, effectively emulating the reduced field of view in the VST HMD condition" | 3 |
| Equipment | HTC Vive with a ZED Mini stereo camera; view cut to 90° × 60° | "inclusion of the pass-through camera reduced the FOV to 90 vertically, and 60 horizontally" | 4 |
| Procedure: distances | Targets at 3, 4, 5, 6 m | "The Distance variable had four levels - 3m, 4m, 5m, and 6m." | 3 |
| Procedure: task | Look at the target, close eyes, throw a beanbag at it | "close their eyes and attempt to hit the target as close as they could with the beanbag" | 5 |
| Procedure: blind in passthrough | Screen blacked out before each throw | "for the VST conditions, we blacked out the screen, to verify that the user could not see" | 5 |
| Procedure: practice | 16 practice throws with eyes open | "Prior to starting the trials, we had the user practice throwing 4 bean bags at 4 different targets without closing their eyes" | 5 |
| Procedure: trials | 36 throws | "the participants performed a blind throwing task 3 times each, for a total of 36 trials per participant" | 3 |
| Procedure: why throwing | Throwing instead of blind walking (COVID); comparable per earlier work | "we elect to use blind throwing, as it has been shown to elicit responses comparable to blind-walking" | 3 |
| Measure | Landing point measured by hand with a tape | "a researcher used a tape measure to log the distance from the target to the spot where the beanbag first made contact with the ground" | 5 |
| Space | Room long enough for a 6 m throw | "Our space was large enough to accommodate the furthest distance of our study, 6m." | 4 |
| Space: margins | 1.8 m beyond the far target, 1.3 m each side | "There was approximately 1.8m of buffer from the 6m target to the closest non-study object" | 4 |
| Space: margins | (sides) | "there was at least 1.3m on either side of the targets" | 4 |
| Duration | About 30 min | "The time to complete the study was approximately 30 minutes." | 5 |
| Main result | Throws fell shorter through the passthrough headset than with the naked eye | "the inclusion of a ZED Mini pass-through camera causes a significant difference between normal, unrestricted viewing and that through a VST HMD" | 1 |
| Main result: naked eye best | Most accurate without headgear | "participants threw the beanbags more accurately when not wearing any headgear" | 6 |
| Main result: size at 6 m | Short by 67 cm through passthrough vs 45 cm with the naked eye | "M = -66.7, SD = 53.3" | 6 |
| Main result: size at 6 m | (naked eye, 6 m) | "M = -44.8, SD = 50.5" | 6 |
| Main result: shell = passthrough | The empty shell gave the same error as passthrough | "we did not find a significant difference between the Shell and VST conditions" | 6 |
| Main result: cause | Narrow view, not the video itself, seems to drive the error | "Regardless of device, viewing the room with a reduced field of view induced more error." | 6 |
| Authors' caveat | Throwing results cannot be compared directly with walking studies | "we are unable to make direct comparisons with previous literature" | 8 |
| Authors' caveat: sample | Almost only men | "our sample is male dominated" | 8 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 36 throws in about 30 min in the original. A game version would need fewer, but see feasibility.
- Task/tension: a throwing game with eyes closed. It is fun, but there is no psychological surprise beyond "you throw short".
- Within-person reveal: yes in principle: naked eye vs passthrough for the same person. But the "naked eye" condition needs the headset off, so the game cannot measure it.
- Works if the player expects tricks: yes. There is no deception; it is a perception measurement.
- Space tier: large about 2.6 × 7.8 m (throwing to 6 m with 1.8 m beyond and 1.3 m on each side, standing at the start).
- VR or mixed reality: the study is about video passthrough itself (ZED Mini, 90° × 60°). Quest 3 passthrough has a different camera and field of view, so the size of the error may not transfer. Its lesson for the game is a caution: distances seen through passthrough may be judged short, and the narrow view seemed to matter most.
- Quest 3 feasibility: poor as an experiment. Real beanbags thrown blind in a home room are a hazard, and the landing point cannot be measured automatically (it was a tape measure). A virtual throw with a controller is a different measure with its own biases. The no-headset baseline cannot be recorded by the headset.
- Replication: one study of 26 with throwing instead of the standard blind walking. The direction matches older optical see-through findings (cited by the authors), not a direct replication.
- Ethics: blind throwing at home risks damage and injury; no deception.
- Verdict: reject: measured with a tape and a real beanbag over 6 m, and the baseline needs the headset off. It is useful only as a warning that distances in passthrough may look shorter.
