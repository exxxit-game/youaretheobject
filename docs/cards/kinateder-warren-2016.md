# kinateder-warren-2016 — Fire alarm with a bystander, real room vs. VR

- paper: kinateder-warren-2016.txt
- citation: Kinateder & Warren (2016). Social influence on evacuation behavior in real and virtual environments. Frontiers in Robotics and AI, 3, 43.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 150 adults (74 female), mean age 21.45 | "One hundred fifty participants [74 female, M(age) = 21.45 years, SD = 4.3] completed the experiment." | 2 |
| Participants: design | 6 groups of 25, between subjects (real/VR × control/passive/active); one trial each | "Participants were randomly assigned to one of six experimental groups (25 per group), while attempting to balance for gender" | 3 |
| Participants: naive | Naive to the purpose | "participants who were naive as to the purpose of the experiment" | 2 |
| Procedure: cover story | Recruited for a "visual attention and head movement" study | "Volunteers were recruited to participate in a study on "visual attention and head movement."" | 4 |
| Procedure: task | Bogus image-matching task, three blocks of 40 trials | "Participants received three blocks of 40 trials each." | 4 |
| Procedure: the alarm | Fire alarm after about 10 min | "Ten minutes into the bogus task (shortly after the beginning of the third block), the fire alarm sounded." | 4 |
| Procedure: passive bystander | Bystander glances at the alarm and keeps working | "In the Passive bystander condition, the confederate briefly looked at the alarm but continued performing the bogus task." | 4 |
| Procedure: active bystander | Bystander walks out (about 10 s) | "In the Active bystander condition, the confederate (real or virtual) looked at the fire alarm and then turned, walked to the door, and exited." | 4 |
| Procedure: virtual bystander | VR participants told the virtual human was a recording of the previous participant | "participants in these groups were told that the virtual human was a recording of the previous participant" | 4 |
| Duration | About 10 min of task before the alarm; ends at the door or at the end of block 3; total not stated | "The experiment ended after the participant either walked to the exit door or completed the third block of trials." | 4 |
| Space | Table about 3 m from the door, participant 1 m in front of the table; real walking to the door | "were positioned about 3 m from the entrance door, near the center of the room" | 3 |
| Space: position | Participant stood 1 m in front of the table | "The participant stood 1 m in front of the table, facing the screen" | 3 |
| Equipment | Wireless Oculus Rift DK1, tracked walking | "participant viewed a computer-generated replica of the VENLab in a wireless head-mounted display (HMD, Rift DK1, Oculus, Irvine, CA, USA)" | 3 |
| Main result | Evacuated: active 38, control 26, passive 9 (of 50 each, real + VR) | "Overall, more participants evacuated in the active bystander condition (38) and fewer in the passive bystander condition (9) compared to the control condition (26)" | 4 |
| Main result: VR vs real | Fewer evacuated in VR (30 vs 43 of 75) | "fewer participants evacuated in the virtual environment (30) than in the real environment (43), overall" | 4 |
| Main result: passive effect in VR | The passive bystander effect was weaker in VR | "the negative influence of the passive bystander was attenuated in VR" | 4 |
| Measure: timing | No condition or environment effect on pre-movement time | "There were no effects of bystander condition or environment on pre-movement time" | 5 |
| Suspicion | 68% in VR (20% real) thought the alarm was part of the experiment | "68% in the virtual environment reported that they thought the simulated fire alarm was part of the experiment" | 6 |
| Overall VR rate | 40% left in VR vs 57% in the real room | "The fact that 40% of VR participants did so (compared to 57% in the real room)" | 7 |
| Debrief | Full debrief after a questionnaire | "Following testing, participants completed a questionnaire about the scenario and were fully debriefed." | 4 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: about 10 minutes of a dull filler task before the alarm, then up to the end of block 3, so about 12–14 minutes. It fits 5–15 min, but most of that time is boring by design.
- Task/tension: image matching, then a fire alarm. Does the player walk to the exit? The tension in VR is low: perceived risk was lower in VR, and the paper notes that no one took the headset off.
- Within-person reveal: weak. It is a single trial in a between-subjects design. A player gets one condition, and the reveal can only place their choice next to the paper's split (in VR overall 40% left). A second trial in another condition is not valid once the player knows.
- Works if the player expects tricks: badly. Even naive recruits under a cover story mostly (68%) saw the VR alarm as part of the experiment. The original needed naive participants. A psychology-game player will expect the alarm, so the "control" rate will be meaningless. The active-bystander pull survived in VR better than the passive one did.
- Space tier: large. The player needs about 4 m of straight free walking to the door (table about 3 m from the door, player 1 m in front of the table). The paper gives no width. The lab tracked 12 × 14 m. Offer it only to players whose boundary allows a walk of at least 4 m; do not shrink it.
- VR or mixed reality: VR, matching the paper's VR arm. The paper compared only a real room with VR. Whether mixed reality (the player's real room plus a virtual bystander) lands between the two is not tested here.
- Quest 3 feasibility: straightforward: a virtual lab, one NPC bystander, alarm audio from above the door, and a door trigger. Leaving and movement onset (head displacement over 0.5 m, as in the paper) are logged automatically. No eye tracking is needed. The real alarm's strobe light was replaced in their VR by sound only.
- Replication: the study is itself a conceptual replication of Latané & Darley's passive-bystander effect (with an alarm instead of smoke), and its VR arm repeats its real arm. One lab, 25 per cell; the effects were smaller in VR.
- Ethics: deception (cover story about head movement, and the claim that the virtual human is a recording of an earlier participant). The original fully debriefed participants; a debrief is needed. A loud alarm can startle. There is no real hazard.
- Verdict: room (large space only) — the only paper here that tests the bystander effect in VR against a matched real room, but it needs naive players, a 10-minute filler and about 4 m of walking. Not a first room.
