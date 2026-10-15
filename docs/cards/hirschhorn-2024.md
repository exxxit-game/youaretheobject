# hirschhorn-2024 — The pictures on every bus stop (repeated inattentional blindness in VR)

- paper: hirschhorn-2024.txt
- citation: Hirschhorn, Biderman, Biderman, Yaron, Bennet, Plotnik & Mudrik (2024). Using virtual reality to induce multi-trial inattentional blindness despite trial-by-trial measures of awareness. Behavior Research Methods, 56, 3452–3468. (CC BY 4.0)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 60 in three experiments (20 each) | "Sixty participants were included in this study overall." | 3455 |
| Participants (preregistered experiment) | 20 adults | "Twenty participants (14 female, aged 20-34, M=25.77, SD=3.96) were run in the preregistered experiment." | 3455 |
| Procedure: the scene | Riding on top of a bus through a city, three bees in front | "They are riding a bus in the city, while a group of three bees is flying around in front of them." | 3454 |
| Procedure: the hidden pictures | One picture on 3 of 10 bus stops, scrambled on the other 7 | "three bus stops present intact instances of the stimulus, and the other seven present the scrambled version of that stimulus." | 3454 |
| Procedure: the task | Track one marked bee for money | "in the first phase (IB phase; 40 trials), the task is to follow a single target bee out of the three bees." | 3454 |
| Procedure: probe every trial | After each ride: visibility rating (PAS), then pick the picture from four | "then they were asked to select the stimulus image from an array of four images" | 3457 |
| Procedure: attended phase | Replays of own rides, now looking at the bus stops | "In the second phase (attended phase; ten trials), they are presented with playbacks of selected trials they had previously played" | 3454 |
| Procedure: pictures | 40 IAPS pictures, half aversive | "The target stimuli were 40 images selected from the International Affective Picture System database" | 3455 |
| Duration | Each ride about 1 min; 40 + 10 rides (total session not stated) | "After 1:03 minutes, when the bus ride ended, the cluster of bees returned to the center and stopped moving." | 3457 |
| Equipment | HTC Vive Pro Eye with controller | "Participants viewed the environment via an HTC VIVE Pro Eye headset and interacted with it using the HTC VIVE Pro Eye controller" | 3455 |
| Equipment: eye tracking | Gaze on bus stops logged by the headset's eye tracker | "Binocular gaze measurements were recorded using the eye-tracking technology embedded in the headset." | 3457 |
| Main result | Pictures rated "not seen at all" on 91.5% of bee trials | "participants rated stimuli as mostly unseen in the IB phase (PAS 1, corresponding to not having any experience of the stimulus: M=91.5%, SD=8.64)." | 3459 |
| Main result: attended | Same pictures clearly seen when attended | "in the attended phase (ten trials), stimuli were easily seen (PAS 4, corresponding to having a clear experience of the stimulus: M=97.5%, SD=7.86" | 3459 |
| Main result: exploratory experiments | 74% and 78% unseen | "PAS 1 in the IB phase: Exploratory E1: M=73.75%, SD=22.31; Exploratory E2: M=78%, SD=19.93" | 3459 |
| Main result: objective check | Picking the picture was at chance (25%) when "unseen" | "Performance in visibility 1 trials was not different from chance level (M=23.42%, SD=6.37, t-test against 25%" | 3460 |
| Main result: looked but missed | Gaze rested on the unseen pictures about 1.4 s | "the average gaze duration on intact stimuli during visibility 1 trials was larger than zero, and relatively long (Fig. 4; M=1.37 sec" | 3460 |
| Main result: despite knowing | Blindness repeated although asked every trial | "Our results show that even though participants knew that they would be asked about the unattended stimulus at the end of each trial" | 3463 |
| Over time | Visibility rose slightly across trials | "as the experiments progressed, stimulus visibility increased slightly, as might be expected" | 3461 |
| Main task performance | Bee chosen correctly 78% of the time | "Their performance on the main task (i.e., the bee task during the IB phase) was relatively high (M=78%" | 3460 |
| Sickness | None reported | "none reported having motion sickness during the experiment" | 3460 |
| Replication (other VR study) | An earlier VR gorilla study failed | "While a previous attempt to induce IB in VR did not replicate the gorilla effect" | 3464 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: total not stated; 50 rides of about 1 min plus questions is about an hour. A game version of 5–6 bee rides plus 2 attended replays would take about 8–10 min. The first rides are probably the strongest, since visibility rose slightly over trials.
- Task/tension: strong. Following one bee among three for points is a real game task with a score; the player wants to win.
- Within-person reveal: very strong. Replay the player's own ride with "now look at the bus stops": the picture was on three stops in every ride. The game can show that the player's head was turned toward those stops while they reported seeing nothing.
- Works if the player expects tricks: yes, and this is the paper's main point. Participants were asked about the pictures after every ride and still missed them on most rides (91.5% in the preregistered experiment, 74–78% in the exploratory ones), and their four-way choice was at chance.
- Space tier: seated or standing in place (posture not stated; the player only rides and tracks the bees).
- VR or mixed reality: VR, as in the original: a full virtual city and a moving bus. Mixed reality would show the player's real room instead of the street.
- Quest 3 feasibility: the main measures (the 1–4 visibility rating and the four-picture choice) need no eye tracking and are collected automatically. The "looked but missed" proof (1.37 s of gaze) cannot be reproduced on Quest 3, which has no eye tracker; head direction toward the stop is a weaker substitute. Riding a moving bus may cause motion sickness in some players. The paper reports none, but the Quest browser at a lower frame rate should be tested. IAPS pictures (half of them gruesome) must be replaced with neutral pictures, which also avoids IAPS licensing. The Unity code is public but would have to be rewritten for WebXR.
- Replication: three experiments in one lab (two exploratory, one preregistered), all showing strong blindness; no independent replication yet. Inattentional blindness in general is among the best-replicated attention effects. But the paper reports that a VR gorilla version (Schöne et al. 2021) failed to replicate, so in VR the effect seems to need a demanding, engaging main task like the bees.
- Ethics: use neutral pictures, not aversive IAPS images. Players are told in advance that they will be asked about the pictures, so there is no deception.
- Verdict: first-room candidate. It is VR-native, has a game-like task, its awareness measures need no eye tracking, and the blindness survives being asked every trial, which matters for players who expect tricks. Check motion sickness from the moving bus and swap the pictures before building.
