# maruhn-2021 — Is this gap big enough? (road-crossing decisions at home in VR vs a real test track)

- paper: maruhn-2021.txt
- citation: Maruhn (2021). VR pedestrian simulator studies at home: comparing Google Cardboards to simulators in the lab and reality. Frontiers in Virtual Reality, 2, 746971. https://doi.org/10.3389/frvir.2021.746971 (open access, CC BY)
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 60 young adults (30 women, 30 men), half in the lab, half at home with no experimenter | "A total of 60 subjects (30 female and 30 male) were provided with a Google Cardboard." | 1 |
| Participants: age | Lab group mean age 26.5, home group 29.1 | "The age distributions under the laboratory condition (M 26.53, SD 3.15, N 30) and under the remote condition (M 29.13, SD 3.60, N 30)" | 6 |
| Comparison data | Same protocol earlier on a real test track, in a CAVE, in an HTC Vive headset and in AR (other papers) | "crossing decisions were recorded on a test track with real vehicles and compared with the results obtained using a CAVE, HMD" | 3 |
| Procedure | Stand at the kerb of a single-lane road; two cars come from the right | "the subjects stood at the edge of a single-lane road at a distance of 0.65 m" | 3 |
| Procedure: conditions | Gaps of 1–5 s between the two cars; 30 or 50 km/h | "two vehicles approached with gaps of 1-5 s and at speeds of either 30 or 50 km/h" | 1 |
| Procedure: trials | 2 practice trials, then each speed × gap once in random order: 10 trials | "every possible combination of the two speeds and five gap sizes was presented once in a random order, resulting in a total of 10 trials" | 3 |
| Procedure: response | Signal the moment you would start crossing; in the headset and on the track by a step forward, here by a button | "In Maruhn et al. (2020) and Schneider et al. (2021), this was signaled by taking a step forward towards the street." | 5 |
| Procedure: no real crossing | Only the intention to cross was measured, for safety | "Since it was not possible to cross the actual test track for safety reasons, only the intention to cross was assessed." | 5 |
| Duration | About 30 min in total, about 10 min in VR | "The overall experiment lasted about 30 min, including about 10 min of VR exposure." | 4 |
| Measures | Gap accepted or not, and crossing initiation time after the first car passes | "Crossing initiation time (CIT) and gap acceptance were recorded as objective dependent measures." | 5 |
| Main result: acceptance | Real track accepted most gaps (48%), simulators fewer (Vive headset 34%) | "Acceptance rates were highest in the real environment on the test track (M 0.48, SD 0.5)" | 7 |
| Main result: speed | More gaps accepted at 50 km/h than at 30 km/h (pooled over settings) | "More gaps were accepted overall at 50 km/h (M 0.43, SD 0.5) than at 30 km/h (M 0.37, SD 0.48)." | 7 |
| Main result: speed only in VR | The speed effect appeared in the CAVE and headset, not on the real track (the sentence continues "but not on the test track") | "an influence of vehicle speed on gap acceptance could only be demonstrated in the two simulator environments (CAVE and HMD)" | 14 |
| Main result: timing | Every simulator started crossings later than people on the real track | "The Bayesian analysis confirmed that in all simulated environments, the crossing was initiated later than in the real-world setting on the test track." | 14 |
| Main result: home vs lab | Home and lab results similar; no practical equivalence shown; more messy data at home | "the data in the two settings are very similar, and a remote setting can be considered comparable to a laboratory one" | 15 |
| Replication | This study replicates the same protocol a fifth time (real, CAVE, headset, AR, Cardboard) | "this work replicates the study design by Maruhn et al. (2020) and Schneider et al. (2021) in a Google Cardboard setting" | 3 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 10 trials, about 10 minutes in VR (the paper notes long waits while distant cars approach; a game could keep them, as the protocol did).
- Task/tension: real and familiar: is this gap safe? Step forward at the moment you would go. Mild tension, no deception.
- Within-person reveal: medium, and unusual. Each player sees both speeds at every gap, so the game can show whether they accepted more gaps from faster cars (the same time gap is a longer distance). The honest reveal is double: people in VR do this, and on a real road (the paper's test track) they did not, so it is partly an effect of the headset itself. With one trial per cell the per-player speed effect is noisy.
- Works if the player expects tricks: yes; there is nothing to see through, the player just decides.
- Space tier: standing (one step forward at the kerb; no actual crossing).
- VR or mixed reality: VR suits the original (a virtual road; the earlier headset condition used an HTC Vive). Mixed reality would put a road through the player's room, which is a different scene; the paper's own AR condition accepted the fewest gaps (28%).
- Quest 3 feasibility: good. The step forward is detectable from head position (as in the earlier headset study), so gap acceptance and initiation time are automatic; speeds, gaps, the 0.65 m kerb distance and the 4.8 m road are given in the paper. Cars start 320 m away, which is a few pixels on Quest 3, as the paper warns for headsets in general.
- Replication: the protocol has been run in five settings including real cars on a test track; the speed effect is consistent across simulators but absent on the real track, and acceptance and timing differ between VR and reality. It is a good example of an effect the headset partly creates.
- Ethics: a crossing game must not teach unsafe habits; the reveal should say the virtual distances are misjudged and should never present VR gap choices as safe for real roads.
- Verdict: interlude: short, automatic, deception-free, with a true and unusual reveal (your headset made you judge by distance); the per-player effect from 10 trials is weak, so more trials per speed would be a change to pilot.
