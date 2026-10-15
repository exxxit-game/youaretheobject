# jones-2008 — Is a virtual target farther in the real hallway than in a virtual one? (blind walking in VR vs AR vs real)

- paper: jones-2008.txt
- citation: Jones, Swan II, Singh, Kolstad & Ellis (2008). The effects of virtual reality, augmented reality, and motion parallax on egocentric depth perception. APGV 2008 (Symposium on Applied Perception in Graphics and Visualization), Los Angeles, pp. 9–14.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 16 students and staff (7 men, 9 women), aged 19–37 | "We recruited 16 observers from a population of university students (undergraduate and graduate), faculty, and staff." | 10 |
| Procedure | Blind walking: look at the target, then walk to it without vision | "In this task, observers view a target object for a period of time and then attempt to walk to the object's location without vision." | 9 |
| Procedure: conditions | Real target with naked eye; real target through the headset; virtual target in the real hallway (AR); virtual target in a virtual copy of the hallway (VR) | "observers were presented with four viewing conditions: Real, Real+HMD, AR, and VR." | 10 |
| Procedure: VR condition | A photorealistic model of the same hallway | "In the VR condition, observers viewed a virtual target object in a completely virtual, photorealistic model of the hallway." | 10 |
| Procedure: AR condition | Virtual target in the real hallway | "in the AR condition, observers viewed a virtual target object in the real-world hallway." | 10 |
| Procedure: distances | 3, 5 and 7 m (plus 25% filler trials between 2 and 8 m) | "observers saw target objects placed at distances of 3, 5, and 7 meters." | 10 |
| Procedure: parallax | Head still vs swaying from foot to foot, crossed with all conditions | "motion parallax did not make depth judgments more accurate" | 13 |
| Target | White wireframe pyramid, 23.5 cm | "The target object was a white, wireframe pyramid measuring 23.5 cm in width and height." | 9 |
| Space | Hallway, targets on the floor 2–8 m away | "The experiment took place in a hallway where observers viewed a target object placed along the ground plane anywhere from 2 to 8 meters away." | 9 |
| Equipment | Optical see-through headset (nVisor ST) that a black strip turned into a VR headset | "An NVIS nVisor ST optical see-through AR HMD was used for this experiment." | 9 |
| Equipment: cart | The computer rolled on a cart pushed behind the walker | "it was necessary to place the equipment on a rolling cart that was pushed behind the observers during the experimental tasks" | 9 |
| Procedure: practice | Five practice walks first, because pilots hesitated to walk blind | "all observers were given five practice trials in a hallway adjacent to the experimental location prior to beginning the experiment" | 9 |
| Procedure: calibration | Headset calibrated before every AR and VR block | "Observers were required to perform this calibration before every block of trials in the AR and VR viewing conditions." | 12 |
| Procedure: trials | 1024 walks in total (64 per person) | "collected a total of 1024 data points (16 observers × 4 viewing conditions × 2 parallax conditions" | 11 |
| Duration | 2.25 hours per person on average | "Observers spent an average of 2.25 hours completing the experiment." | 10 |
| Result: real | Naked eye: 94.1% of the true distance | "In the Real condition, observers underestimated the distance slightly (normalized error = 94.1%; N = 1024)" | 12 |
| Result: AR | AR: 96.0% | "Observers performed similarly in the AR condition (96.0%)." | 12 |
| Result: VR | VR: 91.1%, significantly short | "In the VR condition, observers showed an underestimation effect (91.1%), which is significantly different than 100%" | 12 |
| Main result | AR and VR differ significantly | "The difference between the AR and VR environments was also significant (F (1, 15) = 5.86, p = .029, N = 512)." | 12 |
| Result: three outliers | Three observers walked far short of everything | "observers 1, 6, and 13 underestimated to a much greater degree than the rest of the observers" | 12 |
| Result: without them | Without those three: real 97.9%, AR 98.9% | "Real (97.9%; N = 832 including noise trials) and AR (98.9%) environments." | 13 |
| Result: AR vs VR without them | Only a trend once filler trials are included | "There is trend of significance between the AR and VR environments (F (1, 12) = 4.08, p = .066, N = 416)" | 13 |
| Result: small VR effect | VR shortfall smaller than most earlier studies | "The amount of underestimation for the VR environment is low compared to most previous studies" | 13 |
| Explanation offered | The VR mode could be calibrated against the real world in AR mode | "A likely reason for the relatively small amount of observed VR underestimation is the ability of the nVis nVisor display to be calibrated in AR" | 13 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: 2.25 hours in the original. A game version with only VR and mixed reality (3 distances × 2 repeats each) would be 12 blind walks, about 10–15 minutes with the session switch. That is an estimate.
- Task/tension: as in philbeck-loomis-1997: look, go blind, walk, stop. A small dare with your own legs; no psychological surprise beyond "you stopped short".
- Within-person reveal: yes. The same player in VR and in mixed reality, with stop points against the targets. But the paper's gap is small (91% vs 96%, about 25 cm at 5 m), and 3 of 16 people fell far short in every condition, so one player's 12 walks may not show it.
- Works if the player expects tricks: yes; nothing is hidden.
- Space tier: large, at least 8 m long (targets up to 7 m, filler trials up to 8 m); the hallway width is not stated.
- VR or mixed reality: the paper compares optical see-through AR (the real hallway seen directly through glass) with VR. Quest 3 mixed reality is video passthrough, a different kind of AR, and pfeil-2021 found distances seen through cameras judged short. So this paper's "no shortfall in AR" may not hold on Quest 3; testing that would be a new result, not a replication. The paper's VR hallway was a photorealistic copy of the real one; at home the VR room would be a different room, which is another change.
- Quest 3 feasibility: the measure is automatic (head position where the player stops, with a black screen replacing closed eyes). The Real condition needs the headset off and the Real+HMD condition needs a real target at a measured distance, so only VR vs mixed reality is possible. Eight metres of clear straight floor is rare at home, and the boundary must still warn during the blind walk (to check).
- Replication: one within-person study of 16. The direction (VR short, AR and real close to accurate) matches philbeck-loomis-1997 for the real condition and the authors' table of earlier VR studies. The AR-vs-VR difference weakens to a trend without three outlying observers. wang-2023 cites this paper but finds the opposite pattern for size judgments (worse in video AR than in VR).
- Comparison with philbeck-loomis-1997: that card asked whether mixed reality brings blind walking back to real-world accuracy. This paper answers it for optical see-through AR (96% vs 91% in VR) but not for Quest 3's video passthrough, where pfeil-2021 points the other way.
- Ethics: blind walking up to 8 m at home risks collisions; the original had experimenters and a cart behind the walker. A cleared floor and a working boundary are required.
- Verdict: room (large space only, about 8 m) — an automatic within-person VR-vs-AR test, but it needs a very long clear floor, its AR was optical rather than video passthrough, and its effect is small and partly carried by three people. philbeck-loomis-1997's 5 m version is the more practical base.
