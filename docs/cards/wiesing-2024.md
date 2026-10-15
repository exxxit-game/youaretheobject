# wiesing-2024 — Your own press makes the beep come sooner (intentional binding in VR, replication of Suzuki 2019)

- paper: wiesing-2024.txt
- citation: Wiesing & Zimmermann (2024). Intentional binding – Is it just causal binding? A replication study of Suzuki et al. (2019). Consciousness and Cognition, 119, 103665. (CC BY 4.0, Düsseldorf repository)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (Exp. 1) | 26 adults | "26 participants (five males, mean age: 25.77 years, age range: 19 -54 years, two left-handed) took part in Experiment 1." | 2 |
| Participants (Exp. 3) | 26 adults; Exp. 2 also 26 | "26 participants (8 men, mean age: 26.8 years, age range: 18-30, one left-handed) took part in Experiment 3." | 7 |
| Procedure: setup | Seated, headset, controllers strapped to both hands | "Participants were seated in a chair wearing a head-mounted display (HMD) and had motion-controllers attached to each hand." | 2 |
| Procedure: real table | Virtual table and rest mat placed on a real table and real mat | "A tangible rubber mat was placed at the same location in the real world." | 3 |
| Procedure: the button | A red buzzer pressed with the right hand | "A red buzzer was centrally positioned for participants that could be pressed with either their palm or index finger of the right hand." | 3 |
| Procedure: touch feedback | Controller vibrates 200 ms on every press | "Once fully pressed, the controller vibrated for 200 ms, to provide tactile feedback." | 3 |
| Procedure: the task | Tone after 200, 400 or 800 ms; estimate the interval | "a tone (880 HZ) followed, and participants had to estimate the duration between the button press and the tone." | 3 |
| Procedure: answer | Typed in ms on a virtual keypad | "a numeric keypad was available for participants to input their interval estimates using their right index finger." | 3 |
| Procedure: fake hand | A recorded virtual hand presses the button; own hand hidden | "In the fake hand condition, participants observed the prerecorded hand movements pressing the button." | 4 |
| Procedure: no hand | Button goes down by itself, nothing visible presses it | "For the no-hand condition, the same prerecorded hand movements from the fake hand condition were used, but the virtual hand remained invisible." | 4 |
| Procedure: trials | 2 blocks × 3 conditions × 51 trials | "Each block consisted of 51 trials consisting of 3 sub-blocks, one for each interval duration." | 4 |
| Duration | About 1 hour with instructions and debriefing | "The experiment lasted about 1 h including instructions an debriefing and a short break." | 4 |
| Main result (Exp. 1) | Active 271 ms vs no hand 308 ms | "For the comparison between active (Mean = 270.71 ms, SD = 91.33 ms) and no hand (Mean = 307.77 ms, SD = 101.67 ms)" | 5 |
| Main result (Exp. 1): fake hand | Fake hand 335 ms, longer than active | "Next, we compared the fake hand (Mean = 334.94 ms, SD = 112.36 ms) and no hand condition" | 5 |
| Main result (Exp. 3, direct replication) | No hand 411 ms vs active 378 ms | "the no hand condition (Mean = 410.80 ms, SD = 104.82 ms) yielded longer interval estimations compared to the active condition (Mean = 377.77 ms" | 7 |
| Main result: summary | Own action compresses time more than a passive press | "Indeed, we found systematically greater compression for active than passive trials, in contrast to Suzuki et al. (2019)." | 1 |
| Replication of the original | Suzuki's "fake hand = active" not reproduced, also in a direct replication | "In a subsequent attempt at a direct replication, we did not observe the same findings as the original study." | 1 |
| Original claim | Suzuki 2019: compression without intentional action | "Suzuki et al. (2019) recently showed that temporal compression can be observed without intentional actions." | 1 |
| All intervals | Binding similar at 200, 400 and 800 ms | "across all three experiments in our study, we observed similar magnitudes of temporal binding across the three interval durations." | 9 |
| Equipment difference | Original used Leap Motion hand tracking | "In Suzuki et al. (2019), the Leap Motion Controller (LMC) was used for tracking hand movements" | 9 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: the original took about an hour (306 trials). One block per condition with about 20 trials each, after a short training with feedback, would take about 10 min, but with fewer trials each player's numbers are noisier.
- Task/tension: dry. Press a big red button, hear a beep, type how many milliseconds passed. The interest comes only from the reveal.
- Within-person reveal: yes, but small. Across the three experiments the gap between own press and a press with no hand was about 30–40 ms on average, while people differed from each other by about 100 ms (SD). For a single player with about 20 trials per condition the gap may be lost in noise, so the honest reveal is "your gap" next to "everyone's gap".
- Works if the player expects tricks: probably. The player is not told which way the effect goes, and estimating milliseconds is hard to steer on purpose. A player could still type the same numbers in every condition, which would hide the effect.
- Space tier: seated (chair, real table).
- VR or mixed reality: VR suits the original better. The fake-hand condition needs the player's real hand hidden and replaced by a recorded virtual hand, which mixed reality cannot do because passthrough shows the real hand. Mixed reality could only run "own press vs no hand", with the button placed on the player's real table, which would give real touch as the original's matched real table did.
- Quest 3 feasibility: feasible. The press can be detected with controller or hand-tracking fingertips. Controller vibration matches the original's 200 ms buzz, but hand tracking has no vibration. Recording and replaying a hand animation works with WebXR hand joints, and the virtual keypad is easy. Risk: the time from press to sound in the Quest browser must be measured. A constant delay is the same in all conditions, but jitter of tens of milliseconds would swamp a 30–40 ms effect.
- Replication: the basic finding (own press shorter than a passive press) held in all three of these experiments and in Suzuki 2019. Suzuki's stronger claim (a watched fake hand binds just as much) failed in two conceptual replications and one direct replication. What the effect means is disputed: Gutzeit et al. 2023 (JEP:HPP, preprint read) lost the difference once action and perceptual change were present in both conditions, and Kirsch et al. 2019 also link it to things other than intention. So the reveal may say "your own press shortened the interval", but not "this proves your sense of agency".
- Ethics: none special.
- Verdict: room. It is seated and VR-native, the numbers are collected automatically, and the fake-hand condition is something only VR can do. The effect is small, per-player noise is high, and the meaning is disputed, so it is not a first room.
