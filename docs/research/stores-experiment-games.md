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
  Interaction Lab), app 738100, 29 Jan 2018, VR Only, 54 reviews [read: appdetails]. "spend days in the life of
  someone who can no longer afford a home": an empathy experience from a research lab; the store text names no
  experiment and promises no reveal (whether the lab used it in its own studies: unverified here). Context only.
- Checked and not related (appdetails read, all VR): Memory Illusions (1315220, shooter), Holoception (1064160,
  physics game), MINDFIELD (2587250, PTSD film), Body of Mine (2995970, gender embodiment piece, 11 reviews), Our
  Mind (1663920, horror), Human Delusion (1216720), Bodyless (1202100), Theater of the Mind (3868830, simulated
  hallucinations), Brain-training Game Cerevrum (613550), Conscious Existence (1093330, 360 film, 634 reviews),
  Distortion VR (1610990), Blind Spot VR (1112360), Sea of memories (863660, optical-illusion puzzle), The Social
  Engineer (2746510), A Clever Label (1627660), Mind VR Exploration (1383450), Project Third Eye (2425290).
- Steam, not VR, nearest in form (appdetails read 14.10.2026):
  - Trolley Problem, Inc., Samuel Read-Graves (ReadGraves), app 1582680, 21 Apr 2022, 1602 reviews, Mixed [read].
    https://store.steampowered.com/app/1582680/ . "Questions are based on genuine philosophical papers, complete with
    references"; "Compare your choices with other players"; "a tightly-wound, two-hour narrative experience". The
    closest flat game in form (a real paper behind each scene, you vs the world), but its scenes are moral-philosophy
    dilemmas you answer knowingly, not psychology experiments that catch you; no hidden manipulation to reveal.
  - Dr. Trolley's Problem, Wero, app 773830, 25 Apr 2019, 35 reviews [read]: 50 trolley situations; "We eventually
    want to collect accurate statistics about the choices people make (de-identified data, of course)". Same kind.
  - Thought Experiment Simulator, HoHo Game Studio, app 2696320, 22 Jul 2024, 731 reviews, Very Positive [read]:
    "Trolley Problem, Ship of Theseus, Brain in a Vat, Infinite Monkey, Sisyphus, Prisoner's Dilemma, Schrodinger's
    Cat"; philosophy and physics thought experiments as comic scenes; not psychology studies, no data.
  - Refind Self: The Personality Test Game, Lizardry, app 2514960, 13 Nov 2023, 3811 reviews, Very Positive [read].
    "this data-science game analyzes your actions to estimate your personality"; "Your personality results will then
    be revealed"; results "stored in an online database" with a results ID to compare with others, "does not include
    any personal identifiable information". The largest-reach title where the player is measured by how he plays
    and gets a reveal; differs: one personality estimate across a story game, no published experiment re-created.
  - Know Your Anima, Jadsa Games, app 4249010, release 28 Oct 2026, 0 reviews [read]: "There are no tests - only your
    choices. The game interprets your actions to reveal your personality". Same kind as Refind Self.
  - Personality Psychology Premium, Crazysoft, app 710360, 25 Sep 2017, 15 reviews [read]: "35+ serious in-depth
    tests" as questionnaires; quizzes, not experiments.
  - Dependency Psychological Test, Siying Wu, app 3665930, 16 May 2025, 16 reviews [read]: a narrative game about
    dependent personality "through interactive psychological testing"; fiction plus questionnaire.
  - Soul Sorter: A Morality Personality Test, Alomy, app 3926220, 14 Oct 2025, 29 reviews [read]: point-and-click
    moral sorting with a personality result.
  - MindTesting, patrickbutsmart, app 4925480, 22 Jul 2026, 2 reviews [read]: "minigames focused on cognitive
    abilities such as reaction, memory and timing"; no named study.
  - PROJECT 13 Perception Test, DRYBREAD, app 3077130, 25 Jul 2024, 30 reviews [read]: an anomaly-spotting game
    ("Spot and report anomalies"), not a perception study.
  - Fiction using experiment names, the player not a subject [read]: The Obedience Experiment (Teddybar5, app
    4777470, 3 Aug 2026, horror); Bystander (674860, surveillance fiction); Granite Noir: The Social Experiment
    (4078640) and WHAT NOW? The Social Experiment Game (3722320): community-vote games; Ministry of Truth: False
    Memory (3492150); Psychological Challenge (3357270, platformer); Conformity Cubed (3487450, puzzle); Secret
    Psychology (2961340, hypnosis story).
  - Name hits that are noise [seen in results]: "Asch" matched only Train Sim World "Aschaffenburg" add-ons;
    "gorilla" matched Gorilla Tag and animal games; "placebo" matched visual novels; "Milgram" matched only The
    Milgram Experiment and its demo (already known).
  - Zero results: Stanford prison and Libet (all three searches, rerun once). The first pass gave 0 for neuroscience,
    Stroop, cognitive, optical illusion and psychology experiment (non-VR) because of a rate limit; the rerun with
    pauses returned 21, 4, 326, 50 and 3104 titles, first 30 each looked through: nothing new (Stroop matched no
    Stroop task; optical illusion gave puzzle games such as Superliminal and Monument Valley).

### 3. Meta Horizon Store (Quest store and former App Lab)

Method (14.10.2026): (a) web search `site:meta.com/experiences` with "psychology experiment", "psychological
experiment yourself VR app results", "illusion perception brain test" (two returned no meta.com page); (b) the
store's own search in the browser pane, https://www.meta.com/experiences/search/?q=<term>, for "psychology" (3
shown: LIMINAL, Innerworld, The Signifier) and "experiment" (3 shown: Hand Physics Lab, Slime Lab, FREAKY LAB VR);
the page shows only the top 3 without a click on "See all", so (c) OculusDB, a public mirror of the Quest, Go, Gear
VR and Rift stores including App Lab, through its search API https://oculusdb.rui2015.me/api/v1/search/<term>
(matches app names), 38 terms: psychology, psychological, experiment, psychological experiment, social experiment,
cognitive bias, illusion, perception, Milgram, Asch, Stanford prison, rubber hand, change blindness, placebo,
conformity, obedience, bystander, know yourself, self-knowledge, brain test, mind test, behavioral, citizen science,
research, study, scientific, cognitive, neuroscience, personality, test subject, psychologist, bias, decision,
trolley, embodiment, empathy, illusion of control, Stroop. 171 unique apps, all names and descriptions looked
through ("experiment" alone gave 99, mostly ContentsDa school science labs).

- HURRAH - Helsinki University Research, developer Virtual Dawn, publisher Helsinki University, Quest 3/3S, free,
  released 14 Aug 2025, version 0.0.3.70, "No reviews are currently available" [read: store page].
  https://www.meta.com/experiences/hurrah-helsinki-university-research/9807551096009384/ . "a library of
  evidence-based immersive VR encounters that invite you to explore yourself"; "Developed by social psychologists at
  the University of Helsinki as part of the Era-VR project"; "All data is collected completely anonymously ... used
  solely for educational and research purposes". The nearest Quest app in intent: a public VR app from a psychology
  lab, player as participant, anonymous data for science. Differs on the page: social-change encounters
  (inequality, stigma), not named classic experiments re-created; no reveal of how the player was caught is
  promised. No reviews so far.
- Teacher's Lens Beta, Debias VR, an "Oculus Launch Pad winning project" (OculusDB lists it for Rift, hmd 0)
  [seen: OculusDB description]. "the first virtual reality app to translate the Harvard Implicit Association Test
  (IAT) into a game play simulation"; aimed at teachers' unconscious bias. A published test (the IAT) turned into a
  VR game with the player as the subject; release date, reach and whether a result is shown: unverified.
- LIMINAL ("Relax. Unwind. Engage. Explore."), Quest app, store search shows 4.5 from 1.9K ratings; its page read
  by WebFetch showed 185 reviews, 3.8 (the two counts disagree; page not reread) [read].
  https://www.meta.com/experiences/liminal/1645146858877576/ . "apply research by neuroscientists and
  psychologists to induce and augment emotional and cognitive states"; "You can also take part in interesting lab
  experiments to earn credits and unlock more content!"; "We track and display how effective each experience is
  based on user feedback". Wellness experiences with optional lab experiments inside; which experiments, and whether
  they are re-created published ones: unverified.
- Being a Bystander, British Red Cross, Gear VR 360 video (hmd 3) [seen: OculusDB description]: "a five minute
  360 degree video experience about the bystander effect"; teaches the effect, the player is an observer.
- vBAT, Cognitive Leap Solutions, Quest [seen: OculusDB]: "a 13-minute attention test inside a virtual reality
  classroom" with a paid report; a clinical test, not a game.
- Research apps where the player is a participant in a new study [seen: OculusDB]: Pirate's Quest - Research
  Experience (University of Duisburg-Essen HPC group: "part of a research project to develop novel interaction
  techniques", "optional post-game questionnaire"); Running Studies In The Wild (an academic seminar project to
  "evaluate and document the deployment and distribution process of VR applications for remote VR studies").
  Not psychology classics, no reveal.
- Name hits that are fiction or noise [seen]: The Phinx Experiment ("conducted by Dr. Harris Phinx in 1965": a
  made-up experiment, horror); The Gorilla Experiment (Gorilla Tag horror); The Brookhaven Experiment (shooter);
  Perspectives on Bias (workplace empathy video); Augmented Life Suite / Experience (tools for therapists);
  Placebo communicatie (Dutch: practice for clinicians in placebo/nocebo communication); cognitive-training apps
  (NEUROFY, Oroi Cognitive, Cognitive Assessment, Mastermind Cognitive Training, We Train Your Brain).
- HURRAH, more (14.10.2026): the research group page (https://www.helsinki.fi/en/researchgroups/equality-through-research-and-art-in-vr/our-research
  [read]) describes the ERA-VR group's aims ("identity and inequality in virtual environments") but names no HURRAH
  experience, no re-created experiment and no debrief. What each HURRAH encounter does: unverified.
- LIMINAL's "lab experiments", more: a web search found no official description of what they are; unverified.

### 4. SideQuest

Method (14.10.2026): SideQuest's own search API `https://api.sidequestvr.com/v2/apps?search=<term>&limit=40`, 35
terms: psychology, psychological experiment, experiment, social experiment, cognitive bias, illusion, perception,
Milgram, Asch, rubber hand, change blindness, placebo, conformity, obedience, bystander, self-knowledge, know
yourself, brain test, cognitive, neuroscience, research study, study, science, citizen science, test subject, bias,
personality, embodiment, body ownership, full body illusion, presence, stroop, reaction time, memory test, decision.
The search is fuzzy (40 results for "Milgram", none about Milgram). 984 unique apps; the 152 whose name or summary
holds psycholog-, experiment, study, research, university, illusion, bias, participant, thesis, perception, embodi-,
ownership, cognitive, neuroscien- or self-knowledge were read [seen: API summaries].

- No app re-creating a named psychology experiment for the public with a reveal.
- Remote university studies, the player a participant [seen]: "Comfortable spaces in VR (University Experiment)"
  (6 Apr 2020, 138 downloads, "Experiment is now over"); "Hand-tracking interactions (University experiment)"
  (2083 dl); "Hand Guidance Experiment" ("A remote experiment by University of Copenhagen", 2021); a Brown
  University group "conducting an experiment on how people move in VR" with an Amazon gift card (2020, 2058 dl);
  "Research Study in VR" (2021, 802 dl); "Whac-A-Mole Research Game" ("win $100!", 2022); "VR_Experiment" ("A
  scientific Experiment about cognitive performance from the University of Goettingen", 17 Nov 2023, 111 dl); "VR
  Work Study" (University of Notre Dame "through Prolific", 2024); "VR Body Experiment" ("Experiment on the
  perception of avatars and movements in VR", 19 Aug 2024, 1273 dl); "SDP Study 2 - Passthrough Camera Effects"
  (2025, 14102 dl). These are new studies run on volunteers, mostly HCI; no reveal promised.
- "VPRL Presents Life and Death Moral Dilemmas" (16 Jul 2021, 546 dl) [seen]: "An academic research project that
  studies decision making in life-and-death moral dilemmas". A research app on moral dilemmas; the player a
  participant; reveal unverified.
- "High school - the world of sight" (ContentsDa, 17 Jan 2025, 12 dl) [seen]: "Experience different optical
  illusions in virtual reality and learn how they work". The player undergoes illusions and is told how they work:
  the reveal pattern, for textbook illusions, not published experiments with results; school content.
- "Lost in Place" (2 Feb 2022, 937 dl) [seen]: "Dear Volunteer ... We'll be testing your cognitive and motor
  functions": a fictional framing in a game.
- Clinical or training tools [seen]: VREW Psychology - Phobias, PsyTech VR (for clinicians), Enhance VR (106482 dl,
  brain training "designed by neuroscientists"), Upgrade VR, cognitive-rehabilitation games; dyslexia-empathy
  pieces ("The Magic Potion. In the shoes of dyslexic students", 2024).
