# steptoe-2014 — Real or virtual? Objects and boxes in your own room seen through cameras (presence in video passthrough)

- paper: steptoe-2014.txt
- citation: Steptoe, Julier & Steed (2014). Presence and discernability in conventional and non-photorealistic immersive augmented reality. IEEE International Symposium on Mixed and Augmented Reality (ISMAR 2014). (author copy, UCL)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 30 students and staff, no prior headset experience | "Thirty participants (14 female) with normal or corrected-to-normal vision and no previous immersive HMD experience were recruited from UCL's student and staff population." | 4 |
| Participants: design | Three image styles, between subjects, 10 per group | "The experiment used a between-subjects design with the three rendering modes as the independent variable, resulting in ten participants per condition." | 4 |
| Participants: naive | Not told the image style was the manipulation | "Participants were not told about the rendering mode being a manipulation." | 4 |
| Equipment | Video passthrough built from a Rift DK1 and two webcams | "a low-cost video see-through AR system using an Oculus Rift and consumer webcams" | 1 |
| Equipment: lag | Camera image lagged 100 ms, tracking 60 ms | "The latency of camera images and tracking data are 100ms and 60ms respectively." | 3 |
| Space | Seated at the centre of a 6 × 4 m lab | "seated in a chair at the center of the 6×4×3m lab" | 4 |
| Procedure (task 1) | Judge ten objects around you: real or virtual? | "participants are required to judge each of ten objects as real or virtual. Five objects were real and five were virtual" | 3 |
| Procedure (task 1): set-up | Display off and headphones on while the experimenter laid out the real objects | "The experimenter placed five physical objects at predefined marked positions on the floor (the remaining five would be virtual)." | 4 |
| Procedure (task 2) | Walk to a chair about 2 m away and sit | "Participants are given the task of walking from their current seated position to sit on a chair located around 2m opposite them." | 3 |
| Procedure (task 2): the trick | Boxes on the floor and the chair were all virtual | "These boxes and also the target chair are virtual" | 3 |
| Procedure (task 2): cover | A believable 2-minute pause, as if real boxes were being set out | "waited for two minutes (a plausible amount of time needed to arrange the chair and boxes had they been real)" | 4 |
| Procedure (task 2): safety | The experimenter stopped anyone trying to sit on the virtual chair | "The experimenter stopped the participant in the event they actually tried to sit on the virtual chair." | 4 |
| Measure (task 2) | Foot positions tracked automatically | "We capture behavior in this task by tracking foot position using a pair of shoes fitted with reflective markers at 60 Hz" | 3 |
| Duration | About 20 minutes in total | "The experimental procedure was around 20 minutes." | 4 |
| Main result (task 1) | Correct real/virtual judgments: 73% normal video, 56% edge-filtered (chance), 38% edge-filtered grey | "The overall mean accuracy for conventional rendering is 73%, for stylized it is 56%, and for virtualized rendering it is 38%." | 4 |
| Main result (task 2) | Almost everyone walked around the virtual boxes | "participants navigated the environment similarly in all conditions by walking around the (virtual) boxes scattered around the environment to reach the (also virtual) chair" | 6 |
| Main result (task 2): exception | One person walked straight through | "One participant in the conventional mode walked directly through the boxes" | 6 |
| Main result: belief vs behaviour | Normal-video group believed the boxes were virtual, yet walked around them too | "Participants in the conventional mode generally believed the objects were virtual, and those in the virtualized mode to be real." | 6 |
| Main result (task 2): speed | Normal-video group walked faster with fewer steps | "Participants in the conventional rendering condition took fewer steps and moved more quickly than those in the stylized and particularly the virtualized conditions." | 4 |
| Strategy | Lag and parallax were used to unmask virtual objects | "This refers to the strategy of using fast head movements or observation of optical distortions to determine variations between real and virtual objects." | 5 |
| Strategy: who | Mostly in the filtered groups; only 3/10 with normal video | "this strategy was used heavily by participants in both the stylized (7/10) and virtualized (8/10) conditions" | 5 |
| Strategy: shadows | Shadows were a key cue | "Post-experimental interviews mentioned shadows as an important cue relied on by participants in all conditions." | 5 |
| Replication | Earlier non-immersive study (Fischer et al. 2006) found the same order | "Fischer et al.'s 2006 study reported 94% and 69% accuracy for conventional and stylized modes respectively" | 5 |
| Sickness | No unsteadiness or sickness reported in the warm-up walk | "None of the 30 participants reported unsteadiness or sickness during this period" | 4 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: the boxes walk takes under a minute. The ten-object judgment takes a few minutes. The full original was about 20 minutes, including set-up and questionnaires.
- Task/tension: task 1 is a guessing game ("which of these is real?"). Task 2 is a hidden behavioural measure: do you walk around boxes you know are fake?
- Within-person reveal: task 2 is good. The player's own head path can be shown winding around boxes that were never there, next to their own verdict that the boxes were virtual (as in the paper, belief and behaviour came apart). Task 1 gives a personal score (x of 10 correct).
- Works if the player expects tricks: task 2 is fairly robust. Even people who believed the boxes were virtual walked around them. Task 1 is the trick itself, so expecting it is fine.
- Space tier: task 1 seated. Task 2 roomscale (a chair about 2 m away through scattered boxes, in a 6 × 4 m lab; the paths plotted span about 1.5 m forward). A 2 m walk does not fit straight in 1.8 × 1.8 m, only along its diagonal (2.5 m).
- VR or mixed reality: mixed reality is the original (video passthrough, as on Quest 3). The edge-filter conditions need access to the camera image, which Quest Browser WebXR is not known to give, so only the "normal video" condition can be reproduced.
- Quest 3 feasibility: task 2 is feasible with virtual boxes on the detected floor and the head path instead of foot tracking. But the goal must not be a virtual chair to sit on: at home nobody can stop a player who tries to sit, and they would fall. A different goal (touch a real wall or window) changes the task. Task 1 is not solo: someone else must lay out real objects while the player cannot see.
- Replication: one small study (10 per group). The real/virtual judgment order matches Fischer et al. 2006. The walking result is descriptive (path plots, no statistics).
- Ethics: fall risk if a virtual chair is the target (the original had an experimenter to stop people). No recording of the passthrough image.
- Verdict: interlude: "walk around boxes that are not there" is a quick, automatic presence check inside an MR room. But its original ending (sitting on a virtual chair) is unsafe at home, and the real-or-virtual quiz needs a helper.
