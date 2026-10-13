# Stores: games and apps where the player undergoes re-created published psychology experiments

Searched 14.10.2026 by the deep-research agent. Question: does any game or app (VR or flat) make the player the
subject of re-created, published psychology experiments and then reveal how he was caught or what the study found?
Marks: [read] the page was opened; [seen] only in search results. Already known and not re-reported (see
docs/research/ai-and-vr.md part B): PsychLabVR, The Milgram Experiment (Theseus), Sea Hero Quest VR, VERA, Ouvrai.

## Parts (each gets an answer or "not found")

1. Steam: JSON store search over the listed terms; app details for VR; tags Psychological / Science / Education x VR.
2. Self-knowledge VR (Aerolito, Steam 2019): its exact tasks, named experiments or not.
3. Meta Horizon Store (incl. former App Lab).
4. SideQuest.
5. itch.io (tag vr x psychology / experiment / science).
6. PICO Store, Viveport, PlayStation Store (PS VR2), Apple Vision Pro App Store.
7. Non-VR: Steam flat games, App Store / Google Play, browser collections of classic experiments with explanation;
   TV/YouTube formats (context only).
8. Exhibitions and museums with VR psychology-experiment installations (if found on the way).

## Findings (appended as found)

### 1. Steam

Method (14.10.2026): for each term, three requests: the JSON API
`https://store.steampowered.com/api/storesearch/?term=<term>&l=english&cc=US` (name search, at most 10 hits), the
full store search `https://store.steampowered.com/search/results/?term=<term>&infinite=1&count=100` once with
`vrsupport=401` (VR supported) and once without (first 50). 46 terms: psychology, psychological experiment, social
experiment, experiment on yourself, cognitive bias, illusion, perception, Milgram, Asch, Stanford prison, Libet,
rubber hand, change blindness, inattentional blindness, gorilla, placebo, conformity, obedience, bystander, priming,
know yourself, self-knowledge, brain test, mind test, behavioral science, citizen science, research study,
scientific experiment, experiment, psychology experiment, optical illusion, cognitive, neuroscience, Stroop, Monty
Hall, trolley problem, false memory, decision making, personality test, behavioral economics, mind games, human
experiment, test subject, psychologist, cognitive science, illusion of control. Unique titles looked through: 903
VR, 1458 non-VR (first 50 per term), 117 from the name API. Tags crossed with VR (search `tags=<id>&vrsupport=401`):
Psychological (5186) 111 titles, Science (5794) 111, Education (1036) 400 of 482, Experimental (13782) 99,
Philosophical (15277) 61. The full search matches tags and text loosely, so most hits are horror games tagged
"Psychological Horror". Candidates were then opened through `api/appdetails?appids=<id>` (description,
categories, date) and `appreviews/<id>?json=1` (review count).

- Self-knowledge VR, Aerolito (a "futurism startup based in Brazil"), Steam app 958680, 9 Jan 2019, VR Only, free
  [read: appdetails JSON and all 29 user reviews]. https://store.steampowered.com/app/958680/ . Store text: "a
  series of tasks based on real-world psychological theories that collect and interpret your data while playing";
  "This is done locally and no personal information is required"; "several minigames". No experiment, author or
  paper is named anywhere in the store text. What the tasks are, from the reviews: "four VR experiences that you can
  do with score that are interpreted as psychological trait insights" with "a report about what it gleans from your
  choices at the end" (review 19 Jun 2020); the four are a rowing boat, hitting a hole in the ice ("apparently I am
  VERY persistent", 24 Apr 2022), an animal choice ("choose one: dog or cat ... you must be a dog person!", 31 Jul
  2020); a German review (19 Jan 2019, translated): "based on studies and normal psychological tests ... in 4 small
  tests". Reviews: 29, "Mostly Positive" (23 up, 6 down); playtime mostly 6-25 minutes. Verdict: the player is the
  subject and gets a trait report at the end, but the tasks are personality-style mini-games, not re-created named
  experiments; no "how you were caught", no comparison with a paper's result, no data sent (local only).
- Virtual Reality Experiment Framework (VREF), Scott Howie, app 847650, 13 Jun 2018, VR Only, free [read:
  appdetails]. https://store.steampowered.com/app/847650/ . "a framework for academic experiments in virtual
  reality. Download now and take part in academic experiments to aid VR research"; studies of fire-extinguisher
  training and of VR locomotion (three teams by movement method), with "in-game consent forms" and data "anonymously
  used" for "academic publication". 17 reviews, Mixed; page says "currently under maintenance". The player is a
  research participant on Steam, but the studies are new HCI/training studies, not re-created psychology classics;
  no reveal.
- CogVR, Empyrean / VirtualMind, app 577240, "Coming soon", VR Only, 0 reviews [read: appdetails].
  https://store.steampowered.com/app/577240/ . "Exercises inspired by clinical cognitive tests"; "All of the tests
  was prepared based on cognitive and rehabilitative clinical trials in cooperation with Medical Doctors"; "compare
  your scores with the players from the whole world". Cognitive-test mini-games with a world comparison; no named
  experiment, no reveal; never released.
- Becoming Homeless: A Human Experience, Elise Ogle, Tobin Asher, Jeremy Bailenson (Stanford Virtual Human
  Interaction Lab), app 738100, 29 Jan 2018, VR Only, 54 reviews [read: appdetails]. An empathy experience used
  in the lab's own studies; the player is not told he is in an experiment and there is no reveal. Context only.
- Checked and not related (appdetails read, all VR): Memory Illusions (1315220, shooter), Holoception (1064160,
  physics game), MINDFIELD (2587250, PTSD film), Body of Mine (2995970, gender embodiment piece, 11 reviews), Our
  Mind (1663920, horror), Human Delusion (1216720), Bodyless (1202100), Theater of the Mind (3868830, simulated
  hallucinations), Brain-training Game Cerevrum (613550), Conscious Existence (1093330, 360 film, 634 reviews),
  Distortion VR (1610990), Blind Spot VR (1112360), Sea of memories (863660, optical-illusion puzzle), The Social
  Engineer (2746510), A Clever Label (1627660), Mind VR Exploration (1383450), Project Third Eye (2425290).
