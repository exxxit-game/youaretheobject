# samad-2019 — Same cube, different weight (pseudo-haptic weight by slowing the shown hand)

- paper: samad-2019.txt
- citation: Samad, Gatti, Hermes, Benko & Parise (2019). Pseudo-haptic weight: Changing the perceived weight of virtual objects by manipulating control-display ratio. Proceedings of CHI 2019, Glasgow. https://doi.org/10.1145/3290605.3300550
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (Exp. 1) | 8 adults from the general population | "A total of 8 participants (age: {M = 29, SD = 8.4}, 3 female, 7 right handed)" | 3 |
| Participants (Exp. 2) | 14 adults from the general population | "We enrolled 14 participants from the general population using ads placed by recruitment agencies" | 8 |
| Procedure: objects | Two real, tracked wooden cubes of equal mass, shown as a black and a white cube | "Two wooden cubes with linear dimension 6.23 cm and mass of 185 g each" | 4 |
| Procedure: the change | Shown movement scaled: one cube C/D 1.25 (moves more = lighter), the other 0.75 (moves less = heavier) | "one of them had a C/D ratio of 1.25 and the other had a C/D ratio of 0.75, counterbalanced across participants" | 4 |
| Procedure: no cue | Free exploration and thinking aloud, weight never mentioned first | "If participants experienced a phenomenology of weight, they should spontaneously report it even if not cued to do so" | 4 |
| Procedure: choice task | 24 trials: lift two grey cubes, put the heavier one in the middle; comparison C/D 0.7–1.3 | "the C/D ratio was manipulated across trials (N = 24)" | 5 |
| Procedure: after debrief | Told the cubes were identical, then explored again and asked if the effect persisted | "were specifcally probed to report on whether the efect persisted despite their knowledge of the fact that the cubes were physically identical" | 5 |
| Procedure (Exp. 2) | Match the felt mass with a PHANToM force-feedback device; 7 C/D levels × 12 | "and each was repeated 12 times, in a randomized order" | 8 |
| Equipment (Exp. 2) | PHANToM force-feedback arm | "but also incorporated a PHANToM force feedback device" | 8 |
| Physical space / equipment | Table inside a 1.83-m cage, 17 OptiTrack cameras, Oculus Rift, marker gloves | "a cubic aluminum cage with linear dimension of 183 cm" | 3 |
| Duration | Not stated; free exploration "a couple of minutes" | "After they had explored the cubes for a couple of minutes" | 4 |
| Main result (Exp. 1) | 4 of 8 mentioned a weight difference without being asked | "four of the eight participants spontaneously made mention of any weight diferences between the cubes during the frst Free Exploration phase" | 6 |
| Main result (after debrief) | 7 of 8 after being told and asked directly about weight | "This number increased to seven of the eight during the second Free Exploration phase" | 6 |
| Main result (Exp. 2) | Smaller C/D ratio = cube felt heavier, and vice versa | "lower values of C/D ratio caused the cube to be perceived as heavier and vice versa for higher values" | 10 |
| Main result: size of effect | 185 g felt about 5 g heavier or lighter at 5–10 cm hand offsets; small but consistent | "it is strongly systematic and robust across participants" | 12 |
| Measure: ownership | The virtual hand still felt like one's own | "C/D-ratio induces a genuine perception of weight, while preserving ownership over the virtual hand" | 1 |
| Controllers | Authors note controllers weigh about as much as their cube | "The intrinsic weight of the controller--which in most cases is close to the weight of the cube used in this study" | 12 |
| Limitation | Only one reference mass tested | "it is a limitation of the current study that we made use of only one reference mass, namely 185 g" | 12 |
| Replication | Exp. 1 replicates earlier C/D-ratio findings | "Here we replicate the results from the literature" | 12 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: Exp. 1 is a couple of minutes of free exploration plus 24 lifts — about 5–10 min (estimate). Exp. 2 (84 trials of up to 25 s plus pauses) is too long and needs force feedback.
- Task/tension: compare two identical-looking boxes and put the heavier one aside — simple, physical, the player feels sure of the answer.
- Within-person reveal: yes — after the choices, show that both boxes were the same object in the hand and replay the real vs shown hand height.
- Works if the player expects tricks: partly — after being told the cubes were identical, 7 of 8 still reported a weight difference, but they were then asked directly (suggestion possible) and n = 8.
- Space tier: standing (a table-top task inside a 1.83 m cage; whether participants sat is not stated).
- Quest 3 feasibility: the C/D trick itself is pure software. The original used a real tracked wooden cube and marker gloves; on Quest 3 the held controller would be the object — the authors suggest this but did not test it, and bare hands without a held object are untested. Exp. 2 needs force feedback, which Quest 3 lacks.
- Replication: the paper reports replicating earlier C/D-ratio work; its own samples are small (8 and 14) and from one lab.
- Ethics: none special; repeated lifting to eye level may tire the arm.
- Verdict: room — short, automatic two-choice measure with a real within-person reveal, but the effect is small in grams and has not been tested with Quest controllers as the held object.
