# herrmann-2008 — Punishing the generous (public goods with punishment in 16 cities)

- paper: herrmann-2008.txt
- citation: Herrmann, Thöni & Gächter (2008). Antisocial punishment across societies. Science, 319(5868), 1362–1367. Text: the published article plus the Supporting Online Material, PDF from the University of St. Gallen repository (Alexandria). SOM page numbers are the SOM's own.
- status: read

## Facts
| What | Value | Quote (verbatim from the .txt) | Page |
|---|---|---|---|
| Participants | 1,120 undergraduates, similar age and background, mostly strangers to each other | "we conducted all experiments with university undergraduates (n = 1120) who were similar in age, shared an (upper) middle class background" | 1363 |
| Participants: pools | 16 pools in 15 countries (Boston to Riyadh, Athens, Seoul, Minsk, Muscat...) | "Our experimental data stems from 1120 participants in sixteen subject pools from fifteen countries" | SOM 2 |
| Procedure | Fixed groups of four; each period everyone gets 20 tokens and chooses how many to put into a group project | "Groups of four members played the following public goods game in both conditions: Each member received an endowment of 20 tokens." | 1363 |
| Procedure: payoff | Every token in the project pays 0.4 to each of the four, so keeping everything is always selfishly best | "Each of the four group members earned 0.4 tokens for each token invested in the project, regardless of whether he or she contributed any." | 1363 |
| Procedure: punishment | After seeing the others' contributions, each can assign 0–10 deduction points to each other member; 1 point costs the punisher 1 and the target 3 | "Each deduction point assigned reduced the punished member's earnings by three tokens and cost the punishing member one token." | 1363 |
| Procedure: repetitions | 10 periods without punishment (N) and 10 with punishment (P), same group throughout | "we therefore repeated the experiment 10 times under both conditions, keeping the group composition constant." | 1363 |
| Procedure: order | Most sessions N then P; three cities also ran P then N | "We conducted the majority of our experiments (45 out of 53 sessions) in the N-P sequence." | SOM 5 |
| Procedure: anonymity | Computer-mediated, anonymous, simultaneous decisions; punishers not revealed | "All the interactions in the experiment were computer-mediated (17) and took place anonymously." | 1363 |
| Procedure: no talking | Communication banned for the whole session | "during the whole experiment communication is not allowed." | SOM 18 |
| Live group size | About 21 people per session, split into fours | "in a given session we had on average 21 participants" | SOM 4 |
| Equipment | Networked lab computers, z-Tree software, partitions between seats | "In all subject pools we used in the software "Zurich toolbox for ready-made economic experiments (z-Tree)"" | SOM 19 |
| Duration | Not stated; 2 × 10 periods plus instructions, control questions and a questionnaire | "This experiment lasts 10 periods. You are always in the same group." | SOM 18 |
| Space | Seated at a lab computer behind partitions | "participants in all sixteen laboratories were separated by partitions that ensured their anonymity" | SOM 19 |
| Main result (antisocial punishment) | People in every pool punished some cooperators, by very different amounts | "Antisocial punishment of cooperators existed in all our participant pools, but its importance and detrimental consequences varied strongly across them." | 1366 |
| Main result (cooperation) | With punishment, the best pool contributed 90% and the worst 29% of the endowment | "The most-cooperative participant pool (in which people contributed 90% of their endowment, on average) contributed 3.1 times as much as the least-cooperative participant pool" | 1364 |
| Main result (punishment can fail) | In some pools punishment did not raise cooperation | "in some participant pools, punishment had no cooperation-enhancing effect at all." | 1364 |
| Main result (society) | Antisocial punishment is harsher where civic norms and rule of law are weak | "antisocial punishment is harsher in participant pools from societies with weak norms of civic cooperation and a weak rule of law." | 1366 |
| Mechanism (revenge) | Antisocial punishment rises with punishment received in the previous period | "we find a highly significant increase in antisocial punishment across all participant pools as a function of the amount of punishment received" | 1363 |
| Order check | N-P and P-N orders gave the same results where both were run | "We do not find any evidence for order effects." | SOM 5 |
| Replication (within UK) | Nottingham matched an earlier Royal Holloway study with the same design | "Contributions were not significantly different in both treatments (group averages as independent observations, Mann-Whitney tests, p-values > 0.71)." | SOM 5 |

## Fit for Object (reviewer's judgment, not facts)
- Participant time: not stated. Two 10-period blocks with instructions and control questions is a long lab session. One 10-period P block with a short timer per decision could take about 10–15 minutes. Starting with the P block is not a new design: the paper ran P-then-N in three cities and found no order effects.
- Task/tension: real tension. You are tempted to free-ride, you can pay to hurt others, and you can be hurt for giving a lot. All of it happens between real people.
- Within-person reveal: good. The reveal can show whom the player punished (lower or higher contributors), how much antisocial punishment they received, and their group's curve next to the 16 city curves in the paper (Boston 18 tokens on average down to Athens 5.7).
- Works if the player expects tricks: yes. There is no deception: the others are real players and the rules are told in full. Knowing about the study may make players nicer. The paper cannot say how much.
- Live players needed: 4 at the same time, in a fixed group for all 10 periods. If one leaves mid-game the group breaks. Replacing them with a bot changes the design and must be flagged in the data.
- Space tier: seated.
- VR or mixed reality: neither matches better. The original is a screen in a cubicle, so a desktop or flat panel in VR is closest. Anonymity is central: avatars must not reveal who the others are, and voice must be off, because the original banned all communication.
- Quest 3 feasibility: easy to build. Entering numbers with controllers, four players over Supabase realtime, and every contribution and punishment is logged automatically. Hard parts: getting four players online at once, and points instead of the real money the paper paid. The cross-society claim also rests on comparable undergraduate pools; game players from different countries are not comparable samples, so a game can show "your group vs. the paper's cities" but cannot claim a new country difference.
- Replication: inside the paper, two Swiss pools did not differ, Nottingham matched an independent Royal Holloway study, and order did not matter. Independent replications are not checked here.
- Ethics: no deception. Being punished by strangers can upset some players, so a short debrief is needed. If the player's country is used, ask for it with consent and record only the country.
- Verdict: room (multiplayer, 4 live players) — deception-free, every measure automatic, and a strong reveal against 16 cities; it needs four simultaneous players and replaces money with points.
