# sebanz-2003 — Half a task, but your partner's button still slows you (joint Simon effect, the original)

- paper: sebanz-2003.txt
- citation: Sebanz, Knoblich & Prinz (2003). Representing others' actions: just like one's own? Cognition, 88(3), B11–B21. In the extracted text "=" appears as "¼" and "×" as "£".
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants (Exp. 1) | 40 people (27 women), aged 18–35, Munich | "Forty participants (27 female) recruited by advertising at the University of Munich" | B13 |
| Participants (Exp. 2) | 36 people (26 women) | "Thirty-six participants (26 female) took part in Experiment 2." | B17 |
| Participants: Exp. 2 groups | 20 with an idle confederate, 16 without any feedback from the partner | "Twenty were assigned to the presence group, and 16 to the no-feedback group." | B17 |
| Procedure | Photo of a hand pointing left, right or straight; the ring on the finger is red or green; colour decides the response, pointing is irrelevant | "Participants responded to digital photographs of a right hand pointing to the left, to the right or straight." | B14 |
| Procedure: joint condition | Two people share the task, each answering only one colour | "In the joint go-nogo condition, the task was distributed among two individuals. Each person responded to only one of the two colors" | B13 |
| Procedure: seating | Side by side in front of one monitor | "In the joint go-nogo condition, they sat side-by-side in front of a monitor." | B14 |
| Procedure: alone condition | Same one-colour task with an empty chair beside | "In the individual go-nogo condition, an empty chair remained beside each participant." | B14 |
| Procedure: order | Joint and alone order counterbalanced; the other 20 did the full two-button task alone | "The order of condition (joint go-nogo vs. individual go-nogo) was counter-balanced across pairs of participants." | B14 |
| Duration | Not stated; 4 blocks of 126 trials per condition (go-nogo people did two conditions) | "In each condition, participants completed four blocks of 126 trials presented in random order." | B15 |
| Equipment | Button box on an Apple computer, 21-inch monitor; picture about 15 × 13 degrees ("£" is the extracted "×") | "Picture size was about 15 £ 13 visual degrees horizontally and vertically." | B14 |
| Main result | A compatibility effect only when a partner held the other response | "There was a spatial compatibility effect in the group setting only." | B11 |
| Result: joint RTs | Compatible 325, neutral 331, incompatible 336 ms (an 11 ms effect; "¼" is the extracted "=") | "in the joint go-nogo condition 325 ms (SD ¼ 32 ms), 331 ms (SD ¼ 32 ms), and 336 ms (SD ¼ 32 ms)" | B16 |
| Result: alone RTs | 323, 319, 326 ms: no compatibility pattern ("¼" is "=") | "in the individual go-nogo condition 323 ms (SD ¼ 32 ms), 319 ms (SD ¼ 30 ms), and 326 ms (SD ¼ 28 ms)" | B16 |
| Result: no speed-up | Social facilitation (being faster with company) did not appear | "The predictions from social facilitation theory were not confirmed." | B15 |
| Procedure (Exp. 2, presence) | A confederate sat beside the participant without acting | "Participants in the presence group carried out their part of the joint go-nogo task while a confederate sat beside without acting." | B18 |
| Procedure (Exp. 2, no feedback) | Partners could not hear (ear-plugs, headphones) or see (hand in a box) each other's presses | "Participants in the no-feedback group wore ear-plugs and headphones to make button presses inaudible." | B18 |
| Result (Exp. 2) | Effect only in the no-feedback joint condition; none with an idle confederate | "Post-hoc tests (Newman-Keuls) confirmed that the only significant difference between compatible and incompatible trials was present in the joint go-nogo condition of the no-feedback group." | B18 |
| Result (Exp. 2, no-feedback joint RTs) | Compatible 387, neutral 380, incompatible 395 ms (an 8 ms effect; "¼" is "=") | "they were 387 ms (SD ¼ 34 ms), 380 ms (SD ¼ 30 ms), and 395 ms (SD ¼ 34 ms)" | B17 |
| Result: presence not enough | A person merely sitting there does not produce it | "The pattern of results suggests that the mere presence of another is not enough to obtain a joint compatibility effect." | B18 |
| Result: seeing not needed | The partner's presses need not be seen or heard | "However, continuous feedback about the other's actions is not necessary." | B18 |
| Generality | Pilots suggest arrows work as well as pointing hands | "Pilot studies indicate that joint compatibility effects can also be obtained for arrows" | B19 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated. 504 trials per condition at roughly 1–1.5 s each would be about 8–13 minutes per condition, so alone plus joint is close to the limit. A game version would need fewer trials, which makes each player's number noisier.
- Task/tension: a dry colour-reaction task; the only interest is the hidden slowdown when the hand points at the partner.
- Within-person reveal: weak. The joint effect is about 11 ms (8 ms in the Exp. 2 no-feedback group), against within-person spread of tens of milliseconds. As in li-2025 and bouquet-2024, it is honest only as "players with a partner vs alone" across many players, with the player's own value placed in that spread.
- Works if the player expects tricks: probably. The effect is automatic and appeared even when the partner could not be seen or heard.
- Live players needed: 2 at the same time for the joint condition. Exp. 2 matters for a networked game. A partner who is invisible and inaudible still produced the effect, so a remote partner whose presses are never shown should be enough. A person who sits there without a task did not produce it, so a bot that does nothing is a proper control, not a substitute. Whether a partner who is only believed to exist works is not tested in this paper. li-2025 used a recorded partner that participants believed was live, and reports the effect even when that partner was invisible.
- Space tier: seated.
- VR or mixed reality: two players at one real table in mixed reality is closest to the original. Because of the no-feedback result, VR with a remote partner is also faithful, even without showing the partner's hands.
- Quest 3 feasibility: easy to build (photos or arrows, one button per player, all responses logged). Timing is the limit: an effect of 8–11 ms is about one display frame (8–14 ms at 72–120 Hz), and Quest Browser input timing is unverified. It is measurable only as an average over many trials and many players.
- Replication: this is the founding paper. Later cards confirm small effects with other partners: about 7.5 ms with human and robot partners (bouquet-2024) and 10–15 ms with avatars in VR (li-2025). The Exp. 2 presence group (n = 20) and no-feedback group (n = 16) are small.
- Ethics: the original used a confederate (mild deception); with real players no deception is needed. A bot partner must be disclosed in the debrief.
- Verdict: interlude (2 live players, crowd statistics) — the original joint Simon effect, deception-free with real partners and workable over a network because the partner need not be seen, but at 8–11 ms it is too small and too timing-sensitive for a personal reveal.
