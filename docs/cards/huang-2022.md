# huang-2022 — How close you walk up to a person who is not there (proxemics with AR agents)

- paper: huang-2022.txt
- citation: Huang, Knierim, Chiossi, Chuang & Welsch (2022). Proxemics for human-agent interaction in augmented reality. CHI '22, New Orleans, 13 pages. https://doi.org/10.1145/3491102.3517593. Page numbers are PDF pages. The extracted text drops "fi", "fl" and "ff" (for example "signifcant", "efect").
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 54 university people (34 women, 20 men), aged 20–43 | "We invited 54 participants (34 female, 20 male) from local universities" | 3 |
| Agents | Six: two men, two women, a humanoid robot and a pillar | "six virtual agents (i.e., two males, two females, a humanoid robot, and a pillar)" | 1 |
| Agents: height | Women 172 cm; men, robot and pillar 180 cm | "Female agents are 172 cm in size, while male, robot, and pillar are 180 cm tall." | 5 |
| Procedure | Start 2.5 m away and walk up to the agent until the distance feels comfortable for talking | "the participants were required to approach, or walk towards the agent from an initial distance of 2.5 m" | 4 |
| Procedure: errand | Saying "Hello" makes the agent's voice send you to rate an artwork | "This triggered the voice response of the agent instructing the participant to walk past him/her/it in order to examine and verbally rate the art exhibit" | 4 |
| Procedure: walk-through block | Block 2: after the greeting, walk straight through the agent | "after greeting and listening to the agent's instruction, the participant had to walk-through the body of the agent" | 4 |
| Procedure: barriers | Real chairs on both sides force the walk-through | "Two physical chairs were placed on both sides of the agent to ensure that the participant would in fact walk through the agent." | 4 |
| Procedure: trials | 12 trials per block, 24 approaches in total | "In total, there were 12 trials with 24 approaches (2 approaches x 6 virtual agents x 2 blocks)" | 4 |
| Space | Start distance 2.5 m (Hall's "public" distance); room size not stated | "the initial distance was set to 2.5 m to mimic real-life interaction with strangers from a public distance outlined by Hall" | 4 |
| Equipment | HoloLens 2 (optical see-through AR) plus a skin-conductance kit | "The apparatus for this study comprised the BITalino biomedical toolkit for measuring the electrodermal activity (EDA), a Microsoft HoloLens 2 to render the AR environment" | 5 |
| Measure | Distance from the headset camera to the centre of the agent, logged automatically | "the distance was an Euclidean distance computed in Euclidean space between the device's camera position and the center of the virtual agent." | 6 |
| Duration | Not stated; the only time given is a 10-minute wait for the skin electrodes | "waited for 10 minutes for optimal hydration of the skin" | 4 |
| Data loss: approaches | 21% of approaches excluded for stopping beyond 2.0 m or closer than 0.4 m | "Distances that were above 2.0 m and below 0.40 m (244 trials, 21%) were excluded" | 6 |
| Data loss: crashes | 12 people did not finish a block (speech or app failures) | "the trials removed included participants (n = 12) who did not complete the full block of 12 trials of the experiment due to technical errors" | 6 |
| Main result | 31 of 42 kept a "personal" distance (0.46–1.22 m), the rest a "social" one | "Out of the 42 participants, 31 individuals kept a personal distance [23] with respect to the virtual objects." | 7 |
| Result: gender of agent | More distance from the male agents (who were also 8 cm taller) | "Participants preferred larger IPD towards male agents as compared to female agents" | 7 |
| Result: pillar | More distance from the talking pillar than from the female agents | "show that participants prefer larger IPD towards the pillar as compared to both female agents, each p < .001." | 8 |
| Result: passing | One participant's paths curve around a circle of about 1 m (figure of one person) | "In Block 1: Passing participants respected a roughly circular area of 1 m around the VHA" | 7 |
| Data loss: passing | 8 of 42 skipped passing the agent | "8 participants had to be excluded out of the 42 participants (15%), as they did not pass the agent but directly started the next trial." | 7 |
| Data loss: skin conductance | 23 of 54 removed for movement artefacts and noise | "From the 54 participants, 23 had to be removed due to movement artifacts and excessive noise, leaving 31 for analysis." | 8 |
| Main result (walk-through arousal) | Walking through vs passing: not significant ("signifcant efect" = "significant effect", letters lost in extraction) | "no signifcant efect of Block, F(1, 30) = 0.836, p = .368" | 8 |
| Result: how the authors read it | Higher arousal when walking through is described only descriptively | "walking through the virtual agents descriptively produced higher physiological arousal in the participants" | 10 |
| Explanation: pillar | The pillar also spoke, which the authors think made it social | "the pillar also gave a speech response when the participant greeted it" | 11 |
| Reaction | One participant walked through with eyes closed | "I was kind of afraid to walk through the agent when wearing the HoloLens. In fact I did not open my eyes." | 9 |
| Ethics | Approved by the local ethics committee | "The local ethics committee approved the study." | 4 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated. If each trial (walk up, greet, rate, turn) takes about 30–45 s, one block of 12 is about 6–9 minutes and both blocks 12–18 minutes. That is an estimate.
- Task/tension: a museum errand (greet the guide, rate a picture). The real measure is hidden: where you stop. Block 2 adds a small dare, walking through a person.
- Within-person reveal: yes. The player can see their own stopping distance for each agent and a top view of their path bending around a person who is not there. The text gives the differences between agents only as test statistics and figures, so how large they are for one player is unknown.
- Works if the player expects tricks: probably. Stopping distance is hard to steer on purpose, but a player who knows the topic can walk right up. In the paper 21% of approaches already fell outside 0.4–2.0 m and were discarded.
- Space tier: large, at least 2.5 m long (the start distance), plus the walk past the agent to the artworks; the paper does not give the room size.
- VR or mixed reality: mixed reality is the original. But it was HoloLens 2 optical see-through with a limited window, which the authors list as a limitation. Quest 3 passthrough is video with a wide view, and distances seen through cameras may look shorter (pfeil-2021), so stopping distances may differ.
- Quest 3 feasibility: the distance measure is the same as the paper's (head position to agent) and automatic. Agents can stand on the real floor. The greeting needs the microphone (unverified on our headset) or a button instead. Skin conductance is impossible on Quest 3, so the walk-through arousal part cannot be measured; it was not significant in the paper anyway. Real chairs as barriers are a trip hazard at home, so virtual barriers would be a change from the original.
- Replication: one study with heavy data loss (42 of 54 for distance, 31 for skin conductance). Its secondary results conflict with earlier studies. bailenson-2003 found more distance from the female virtual human, while here the male agents got more. The male agents here were also taller. Bailenson's VR work, as cited here, gave more room to humans than to objects, while here the pillar got the most; the authors say this matches another VR study they cite (Iachini et al. 2014). Only "people keep roughly a personal-space distance from AR agents" looks stable.
- Ethics: approved; some participants disliked walking through human-like agents, and one did it with eyes closed, which is a hazard in a furnished home. A reveal like "you kept more distance from men" should be worded carefully.
- Verdict: room (large space only) — an automatic, hidden distance measure in the player's own room with a personal "bubble" replay, and mixed reality is the original setting; but it needs more than 2.5 m, its walk-through arousal result is not significant and cannot be measured on Quest 3, and its gender and pillar effects contradict earlier studies.
