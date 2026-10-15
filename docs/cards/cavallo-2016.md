# cavallo-2016 — Pour or drink? Reading an intention from a reach (intention from movement kinematics)

- paper: cavallo-2016.txt
- citation: Cavallo, A., Koul, A., Ansuini, C., Capozzi, F., & Becchio, C. (2016). Decoding intentions from movement kinematics. Scientific Reports, 6, 37036. University of Turin and Istituto Italiano di Tecnologia, Genoa. Open access (CC BY).
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (actors) | 17 naive people filmed and motion-captured while reaching for a bottle | "we first obtained a set of natural grasping movements by filming 17 naïve participants reaching towards and grasping a bottle" | 2 |
| Procedure: the two intentions | Grasp the same bottle either to pour into a glass or to drink | "with the intent either to pour some water into a small glass (grasp-to-pour) or to drink water from the bottle (grasp-to-drink)" | 2 |
| Equipment | Hand markers, 9-camera motion capture at 100 Hz, plus video | "A near-infrared camera motion capture system with nine cameras (frame rate, 100Hz; Vicon System) was used to track the hand kinematics." | 5 |
| Information in the movement | A classifier separated the two intentions from the reach alone | "Leave-one-out cross-validation confirmed that 92.3% of movements were correctly classified into the corresponding intention." | 2 |
| Participants (observers, Exp. 1) | 18 new observers; 17 + 17 more in Exps. 2 and 3 | "In this experiment, 18 new participants watched videos of grasping movements." | 2 |
| Procedure: occlusion | Videos stopped when the fingers touched the bottle | "All videos were occluded at the time of contact of the fingers with the bottle." | 2 |
| Procedure: judgement | Observers chose drink or pour, then rated confidence 1–4 | "whether the observed movement was performed with the intention to drink or to pour from the bottle" | 2 |
| Duration | Observation experiment about 50 min (400 trials) | "The entire main experiment lasted approximately 50 minutes." | 6 |
| Main result (Exp. 1) | Observers were above chance (AUC 0.608) on representative movements | "AUC values thus generated were significantly above the 0.5 chance threshold" | 2 |
| Main result (Exp. 2) | On the full, unselected set of movements observers were at chance | "when considering the entire Subset 1 distribution, decoding scores did not exceed the chance level" | 3 |
| Main result (Exp. 3) | Choosing movements that show the telling features raised accuracy (to about 0.68) | "intention visibility can indeed be directly manipulated by modifying the kinematic parameters of the movements being viewed" | 4 |
| Telling feature | Wrist height mid-reach mattered most; a low wrist read as "pour" | "the probability that the observed movement was classified as grasp-to-pour was indeed highest when wrist height was lower than 142.56mm from the table surface" | 2 |
| Replication status | Earlier positive findings had failed to replicate in another lab | "Other investigators, however, had difficulties replicating these initial findings." | 1 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: two parts. Acting: 3–5 minutes of reaching for a real or virtual bottle with a hidden instruction (pour or drink). Watching: 5–10 minutes of judging other players' reaches (the original 400 trials took 50 minutes; 60–100 trials are enough per player when pooled across players).
- Task/tension: a guessing game between people: "can others tell what you meant to do before you did it?" and "can you tell what they meant?"
- Within-person reveal: yes, two-sided: "your reaches gave away your intention to X% of other players", and "you read others correctly Y% of the time"; the player can also see their own wrist-height curve for pour vs drink.
- Works if the player expects tricks: partly. Actors who know they are watched may exaggerate or hide their intention; the original actors did not know. The game should record the acting part before explaining the game.
- Space tier: seated (at a table, reaching about 46 cm).
- VR or mixed reality: mixed reality suits the acting part better: the player can grasp a real bottle on their own table (plane detection or a tap marks where it stands), so the reach is natural and the hand tracking records it. Observers can watch in VR or on a desktop (an avatar hand replaying the tracked joints, occluded at contact).
- Quest 3 feasibility: good for the main cue: wrist height and wrist path at 72–90 Hz from hand tracking (precision around a centimetre, enough for a 14-cm wrist-height cue); finger-plane features are noisier. Observers see an avatar hand rather than a video of a real hand, which is itself a change from the original. Statistics across players make this a natural crowd experiment: each player is both actor and observer.
- Replication: contested. The paper itself shows observers at chance on the full movement set (Exp. 2) and above chance only on selected movements, and cites a failed replication (Naish et al. 2013). New data from many players would genuinely help.
- Ethics: harmless; recordings are hand-joint trajectories only, anonymous.
- Verdict: room (multiplayer/crowd) — uses hands, real objects in mixed reality and many live players, and the result is an open question rather than a known trick.
