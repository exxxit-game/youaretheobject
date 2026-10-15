# morehead-2017 — Told to ignore the cursor, your hand drifts anyway (task-irrelevant error clamp)

- paper: morehead-2017.txt
- citation: Morehead, Taylor, Parvin & Ivry (2017). Characteristics of implicit sensorimotor adaptation revealed by task-irrelevant clamped feedback. Journal of Cognitive Neuroscience, 29(6), 1061–1074.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 160 Berkeley undergraduates (plus 10 cerebellar patients and 10 controls in Exp. 3) | "Undergraduate students (n = 160, 115 women, age = 22 ± 2 years) were recruited" | 1062 |
| Participants: group size | 10 per condition (20 in Exp. 2) | "leading us to choose a standard group size for the field, with 10 participants per condition" | 1062 |
| Procedure: setup | Seated, centre-out reaches on a tablet; hand hidden under a monitor, room dark | "All participants performed center-out reaches on a horizontal surface while seated at a custom-made tabletop." | 1062 |
| Procedure: hand hidden | Only a cursor shows the hand | "Direct vision of the hand was occluded by the monitor, and the lights were extinguished in the room" | 1063 |
| Procedure: reach size | 8 cm reaches to 8 targets | "Participants made reaches from the center of the workspace to targets positioned at a radial distance of 8 cm." | 1063 |
| Procedure: the clamp | Cursor always travels at a fixed angle from the target, whatever the hand does | "For clamped visual feedback trials, the feedback followed a trajectory that was fixed along a specific heading angle" | 1063 |
| Procedure: instruction | Fully informed, told to ignore the cursor | "ignore the cursor and move your hand directly to the target location" | 1063 |
| Procedure: trials (Exp. 1, 4) | 40 no-feedback + 40 veridical baseline, 240 clamp trials, 8 no-feedback aftereffect, 40 washout | "The session started with two baseline blocks of 40 trials without visual feedback, and then 40 more trials with veridical feedback." | 1063 |
| Procedure: clamp block | 240 trials | "The perturbation block was composed of 240 trials, 30 to each of the eight target locations." | 1063 |
| Duration | Not stated; 368 trials in Exp. 1 (nearest timing quote: inter-trial hold) | "Once the participant maintained the digitizing stylus within the central start position for 200 msec, the target for the next trial was displayed." | 1063 |
| Main result | 45° clamp: hand moved 15.5° away from the target despite the instruction | "The Clamp group showed an adaptation profile that was remarkably similar to the Ignore group (Figure 1C), with a 15.5° change in hand angle" | 1066 |
| Main result: aftereffect | 14.6° aftereffect with no cursor | "a significant aftereffect when asked to reach directly to the target without any visual feedback (14.6°" | 1066 |
| Main result: unaware | Every clamp participant was surprised at the end | "all of the Clamp participants changed their behavior implicitly, reporting surprise that their hands were not traveling directly to the target" | 1066 |
| Main result: size does not matter | Same drift for clamps from 7.5° to 95°; none at 135° and 175° | "Surprisingly, we failed to observe dose-dependent adaptation for clamped feedback offsets between 7.5° and 95°" | 1068 |
| Ceiling | About 12° on average across conditions | "Regardless of the size of the perturbation, the average change in hand angle was only around 12° across our various conditions." | 1072 |
| Exp. 4 design | 9 groups of 10, clamp 0°–175° | "Participants (n = 90, 10/group) were randomly assigned to one of nine groups" | 1064 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated; 368 trials of 8-cm reaches in Exp. 1. The online replication (Tsay et al. 2021, Ivry lab, read in full in scratch) used 178 trials at home; a 15° clamp with about 150–200 trials is likely 8–12 min.
- Task/tension: weak as a task (reach to a dot, ignore a dot that goes its own way); the tension is the promise "you will not be fooled, you know the cursor is fake".
- Within-person reveal: strong — the game draws each of the player's reaches; the player sees their hand sliding 10–20° away while they were sure they went straight, then the no-cursor aftereffect.
- Works if the player expects tricks: yes, by design — the player is told exactly what the cursor does and still adapts; the paper reports surprise in every clamp participant.
- Space tier: seated (table-top, 8-cm reaches; a VR version can use short reaches in front of the chest).
- VR or mixed reality: VR. The hand must be invisible and replaced by a cursor; in mixed reality the real hand and controller show through passthrough and would give true feedback, breaking the manipulation.
- Quest 3 feasibility: good — hide the controller model, show a start disk, a target ring and a cursor on a virtual table or vertical board; the cursor's angle is fixed, its distance follows the controller. Hand direction is logged automatically every trial. Anglin et al. (2017, Sci Rep, HMD-VR rotation study) found overall adaptation similar in a headset but more explicit aiming; with the clamp and "ignore it" instruction explicit aiming should matter less, but the size in a headset is untested.
- Replication: replicated online at home with trackpads (Tsay et al. 2021, N = 80, asymptote about 15°), and the clamp is now a standard method used in many later Ivry and Taylor lab studies.
- Ethics: harmless; a short veridical washout removes the aftereffect, as in the paper.
- Verdict: first-room candidate — seated, automatic, informed-player-proof and replicated at home; the build must keep the controller invisible, and the size of the drift in a headset needs a pilot.
