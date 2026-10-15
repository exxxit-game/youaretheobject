# bouquet-2024 — Your partner's button slows you down, even when the partner is a robot (joint Simon effect)

- paper: bouquet-2024.txt
- citation: Bouquet, C. A., Belletier, C., Monceau, S., Chausse, P., Croizet, J.-C., Huguet, P., & Ferrand, L. (2024). Joint action with human and robotic co-actors: Self-other integration is immune to the perceived humanness of the interacting partner. Quarterly Journal of Experimental Psychology, 77(1), 70–89. Université Clermont Auvergne and Université de Poitiers, France. Accepted manuscript, HAL hal-04017274v2 (open archive); page numbers below are PDF pages of that file.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (Exp. 1) | 41 psychology students, within-subject (two robots) | "Forty-one undergraduate psychology students (Mage = 19.12 years, SD = 1.33, 2 males, 6 left-handed) from Université Clermont Auvergne" | 14 |
| Participants (Exp. 2) | 108 students, between-subject: social robot 37, non-social robot 36, human partner 35 | "Participants included 108 undergraduate psychology students from Université Clermont Auvergne, France, who participated for course credit." | 27 |
| Procedure: the task | Coloured dot left or right on a screen; each person presses only for their own colour (go/no-go) | "When the dot was displayed in the target color, the participant had to press the mouse button (Go trial)" | 16 |
| Procedure: the robot partner | A small humanoid robot sat about 80 cm away with its hand on a second mouse; its clicks were triggered by the computer (Wizard of Oz) | "The robot was standing on the other side of the screen, with the left hand resting on a computer mouse." | 15 |
| Procedure: humanness manipulation | A 3-minute chat with the robot (social) or a description task (non-social) | "The presence (vs. absence) of a prior verbal interaction was used to manipulate robot's perceived humanness." | 3 |
| Procedure: human partner (Exp. 2) | A male confederate sat next to the participant | "The human co-actor reentered the room and was seated next to the participant for the joint Go/No-go task." | 28 |
| Procedure: baseline (Exp. 2) | Everyone first did the task alone, then jointly | "all participants performed the individual condition before the joint condition" | 27 |
| Trials | 4 blocks of 84 trials per condition | "Each partner condition (see below) consisted of 4 blocks of 84 trials." | 17 |
| Duration | Not stated in minutes; the chat phase about 3 min; 336 trials per setting at 1.5–2 s fixation each suggests roughly 15 min per setting (estimate) | "The interaction lasted approximately 3 minutes." | 18 |
| Main result (Exp. 1) | Responses were slower when the dot appeared on the partner's side (378 vs 386 ms) | "RTs on compatible trials were significantly faster than RTs on incompatible trials (378 vs. 386 ms" | 23 |
| Main result (Exp. 1): size | About 7.5 ms with either robot | "The Simon effect (mean RT on incompatible trials minus mean RT on compatible trials) in the Social robot condition was 7.47 ms" | 24 |
| Main result (Exp. 2): joint vs alone | The effect was larger when acting jointly than alone | "The Simon effect was larger in the Joint condition than in the Individual condition" | 31 |
| Main result (Exp. 2): alone too | A smaller effect existed even alone | "the Simon effect was significantly greater than zero in both the Individual condition" | 31 |
| Main result: human vs robot | The joint effect with robots did not differ from that with a human | "Experiment 2 further showed that the JSE obtained in robot conditions did not differ from that measured in the human partner condition." | 3 |
| Open data | Data on OSF | "Data are publicly accessible at the Open Science Framework" | 20 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 8–12 minutes for one alone block plus one joint block (shortened from 4 × 84 trials per setting; the effect is small, so the game would pool across many players rather than rely on one player's estimate).
- Task/tension: a fast colour game side by side with a partner: "press only for your colour". The tension is speed; the hidden measure is the slowdown when the dot is on the partner's side.
- Within-person reveal: weak for one player (an effect of a few milliseconds is noisy in one person), strong at crowd level: "players were N ms slower when the dot pointed at their partner, and M ms slower when alone" with the player's own value placed in the distribution.
- Works if the player expects tricks: likely; the effect is automatic, though awareness of the partner's role is part of it.
- Space tier: seated (side by side at about 80 cm).
- VR or mixed reality: VR suits a networked partner (an avatar or a robot-like bot seated beside the player); mixed reality suits two players in the same room. The paper's own question, human versus artificial partner, maps directly onto "live player versus game bot", which the game can run as conditions.
- Quest 3 feasibility: possible but demanding. Reaction-time differences of 3–8 ms are below one display frame (8–14 ms at 72–120 Hz) and controller input timing jitter; they are measurable only as averages over many trials and many players, with input timestamps taken from the XR frame, not from rendering. A live remote partner needs no special latency because the partner's response is never waited for (the original's robot clicks were simulated anyway).
- Replication: the joint Simon effect is widely replicated since Sebanz et al. 2003 (cited in this paper); here a small effect (about 7.5 ms) appeared in both experiments, and the individual baseline in Exp. 2 shows part of it occurs alone. The robot-equals-human result contradicts some earlier studies the authors review.
- Ethics: harmless; the Wizard-of-Oz robot and confederate are mild deceptions; a bot partner in the game should be disclosed in the debrief.
- Verdict: interlude (multiplayer, crowd statistics) — easy to build and a natural live-player versus bot comparison, but the effect is too small for a satisfying personal reveal.
