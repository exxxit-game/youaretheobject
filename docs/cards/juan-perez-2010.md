# juan-perez-2010 — The floor of your own room falls away (acrophobic pit in AR vs VR)

- paper: juan-perez-2010.txt
- citation: Juan & Pérez (2010). Using augmented and virtual reality for the development of acrophobic scenarios. Comparison of the levels of presence and anxiety. Computers & Graphics, 34(6), 756–766. (authors' manuscript from the first author's university page)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 20 adults (university staff and students), unpaid | "Twenty participants took part in the study (16 males, 4 females)." | 6 |
| Participants: screening | People with fear of heights excluded | "All the participants filled out the Acrophobia Questionnaire [25] in order to exclude people suffering from acrophobia." | 6 |
| Participants: design | Both systems for everyone, order counterbalanced | "Participants were counterbalanced and randomly assigned to one of two conditions" | 6 |
| Equipment (AR) | Video passthrough: one camera on the headset plus ARToolKit markers | "A Dragonfly camera of Point Grey Research was used as a video source." | 6 |
| Equipment (AR): tracking | Floor markers | "The AR capabilities were provided by ARToolKit" | 4 |
| Procedure: the pit | Floor in the middle of a real mat opens into a deep hole | "A hole appears in the center of the mat, the blocks of the floor fall away" | 4 |
| Procedure: camouflage | Before it opens, the hole looks exactly like the real mat | "The surface of this hole was a brown square which was the same color and texture as the mat" | 4 |
| Space | Mat 2.3 × 2.3 m on the floor | "a square brown mat (2.3 meters each side)" | 4 |
| Procedure: sequence | Wander the room, then are placed at the hole | "They first wander around the room for a few minutes" | 7 |
| Procedure: placement | The experimenter placed the person on the spot and ran the animations | "the person in charge of the study placed them in the area where the floor could fall away (the hole)" | 7 |
| Procedure: animation 1 | Three of four blocks drop; you stand on the last one | "The first one consisted of dropping three of the four blocks sequentially, leaving the user standing on the only block that did not fall away." | 5 |
| Procedure: animation 3 | All blocks drop together, walls rise: a falling "elevator" | "In the third animation, the four blocks dropped simultaneously, and the user had the sensation of falling into the hole (elevator effect)." | 5 |
| Procedure: fixed order | Same animation order for everyone | "The order of execution of these animations was always the same during the experiment." | 7 |
| Procedure: confound | Joystick flying in VR, real walking in AR | "as the navigation is different in the two systems (joystick flying in the VR condition and actual walking in the AR condition)" | 14 |
| Duration | 5–10 min in each system | "The participants stayed in each system from 5 to 10 minutes." | 7 |
| Measure: presence | Questionnaire after each system | "After using each system (AR or VR), the participants were asked to fill out an adapted SUS questionnaire" | 1 |
| Measure: anxiety | Self-rated 0–10 at six moments | "rate their anxiety level (scores from 0 = not anxious at all, to 10 = very anxious) at 6 different moments" | 7 |
| Main result | No difference between AR and VR in presence or anxiety | "For the sense of presence and anxiety levels, we did not find differences between the systems" | 1 |
| Main result: AR presence | 4.66 of 7 | "with an average score of about 4.66 for the AR system for all the questions on a scale of 1 to 7" | 13 |
| Main result: VR presence | 4.8 of 7 | "For the VR system, the average score was about 4.8 on the same scale." | 13 |
| Main result: anxiety | Rose from baseline during the pit events, but stayed low overall | "there is a significant difference between the level of anxiety felt at the moment before starting the experiment and the level felt" | 1 |
| Main result: anxiety level | Very little anxiety in non-phobic people | "First, the participants did not show hardly any anxiety." | 11 |
| Main result: presence–anxiety | No real link | "all the correlation coefficients are near 0, indicating that the correlations are very low" | 12 |
| Main result: own feet | Seeing one's own feet at the edge rated important (AR advantage) | "participants consider it important to see their feet next to the hole where the floor falls away" | 13 |
| Power | Could detect only medium-to-large differences | "this experiment could detect differences as large as d = .66" | 8 |
| Authors' caveat | Only self-report was used | "self-reporting is known to have a number of limitations" | 14 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 5–10 min per system. A single MR pit sequence is about 5 min.
- Task/tension: a cover story (a security guard searching for a bomb), then the floor collapses under you. The tension is strong in principle, but non-phobic participants reported hardly any anxiety.
- Within-person reveal: weak. Everything was self-report, and AR and VR came out the same. Nothing behavioural was recorded that could be shown back to the player.
- Works if the player expects tricks: poorly. A psychology-game player will expect the floor to open. The original also used the same fixed animation order for everyone.
- Space tier: large 2.3 × 2.3 m (the mat holding the hole). Participants also wandered the room first in AR; the room size is not stated.
- VR or mixed reality: mixed reality is the interesting arm. The hole opens in the player's real floor and they see their own feet at the edge, which participants rated as important. The original AR was video passthrough with one camera, so like Quest 3 in kind but much cruder.
- Quest 3 feasibility: easy to build. The floor comes from plane detection or the depth hit-test, and the pit is rendered over passthrough. But the original measures were questionnaires. An automatic measure (stepping back from the edge, head height, refusing to step on) would be the game's own addition, not the paper's.
- Replication: one small study (n = 20). It matches the authors' earlier HMD-vs-CAVE study in direction; no independent replication is in the text.
- Ethics: fear-of-heights content; exclude or warn people with acrophobia. The "elevator" fall can make players stagger or lose balance at home with nobody to catch them. Use it standing still, ideally near a wall or seated, and never ask the player to step into the hole.
- Verdict: interlude: an MR floor-collapse moment is easy and vivid on Quest 3, and the paper says AR felt as present as VR. But it measured nothing automatically, non-phobic users barely felt anxious, and there is a balance risk at home.
