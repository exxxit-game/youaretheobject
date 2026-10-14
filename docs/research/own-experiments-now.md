# Running our own experiments now: what the field does, what fits us, how to do it properly

Research for the owner's idea of new experiments with real players, in the present (docs/ideas/owner-experiments.md).
Every claim has its link and a short quote from the page read. "Unverified" marks what was not confirmed on a
primary page. Parts 4 (running and publishing), 5 (data-quality risks) and the list of what is still open are in
[own-experiments-now-2.md](own-experiments-now-2.md). How working labs run studies outside the lab, lab by lab:
[field-labs-1.md](field-labs-1.md), [field-labs-2.md](field-labs-2.md); ethics review and data law for a team without a
university: [ethics-law.md](ethics-law.md); how a lab runs a study, step by step, applied to a room:
[study-methods.md](study-methods.md); how science projects reached millions, and fun without spoiling data: [science-reach.md](science-reach.md); how precise our data can be, and how much each fix buys: [data-precision.md](data-precision.md); continental Europe, Israel and Latin America in their own languages: [world-europe.md](world-europe.md), [world-europe-2.md](world-europe-2.md); the games industry's own player research and Russian-language science: [world-industry-russia.md](world-industry-russia.md), [world-industry-russia-2.md](world-industry-russia-2.md); Asia (China, Japan, Korea, Taiwan, Singapore): [world-asia.md](world-asia.md), [world-asia-2.md](world-asia-2.md); papers the owner brought (Re-Search, the Portal 2 re-creations; citizen science review 2026; Colombia 8430): [owner-brought.md](owner-brought.md), [owner-brought-2.md](owner-brought-2.md) (Ward & Meade, Olson, McKay, Pagulayan, Herrmann, Wu, Gavrilov, Russian VR studies). Parts, each answered or marked "not found":

The owner's questions about rooms (his words, our translation) and where each is answered; a question stays here
until its answer is read and sourced:
- "How did they collect data, what did they count as valid, what did they screen out?": field-labs-1/2, study-methods-1 part 2.
- "At home you play for fun, you don't try like in a lab": study-methods-1 part 1 (commitment, playable practice,
  end-of-run seriousness and no-blame questions, self-knowledge as the reward).
- "Start with a minute of fun, then: let's take this seriously": study-methods-1 1g (practice trial, then commitment).
- "Without humour you are a lab rat; a host leads you through the story": owner's decision (.claude/rules/game.md);
  fun around the measured moment, plain inside it (Lumsden 2016); science-reach.md part 3 (Sea Hero Quest, Portal).
- "How did those projects get millions of users?": science-reach.md parts 1-2.
- "Take all they solved, check how far it solves the problem; how precise can our data be, how do they measure
  precision?": data-precision.md (fixes table and order: [data-precision-2.md](data-precision-2.md)).
- "Who approves our ethics?": ethics-law.md 1; SPbU IRB#1 takes outside organisations for a fee; MGPPU reviews joint studies (ethics-law.md 1d) (owner's pages, [own-experiments-now-2.md](own-experiments-now-2.md)).
- "Which labs work now, and in Russia?": field-labs-1/2; Russia: MSU and MGPPU VR labs (field-labs-2.md).
- Two phones: part 3 here; open: Shiv 2005, Wilson & Nisbett 1978 (owner's pages).

1. What psychology runs now (2023-2026) that a home VR game could join or run: 1a multi-site studies and registered
   reports; 1b citizen science and game-based research; 1c VR studies outside the lab; 1d open questions.
2. 8-12 candidate experiments for our setup (one player, 5-10 min, body and head data, Russian-speaking first).
3. The two-phones idea: 3a confabulation (Nisbett & Wilson 1977); 3b choice blindness; 3c price as a quality cue;
   3d what our version adds.
4. Running and publishing: 4a ethics review without a university; 4b preregistration; 4c data rules; 4d partners.
5. Risks to data quality (inattention, repeat players, bots, suspicion) and how studies handle them.

---

## Findings

### 1b. Game-based citizen science: Sea Hero Quest

- Spiers, Coutrot & Hornberger (2023), Topics in Cognitive Science 15(1), 120-138, "Explaining world-wide variation
  in navigation ability from millions of people: Citizen science project Sea Hero Quest".
  https://ueaeprints.uea.ac.uk/id/eprint/86715 — the game was used to "test 3.9 million people on their navigation
  ability", players "from 18 to 99 years of age", analysis over "all countries sufficiently sampled (N = 63)";
  "All countries showed a male advantage"; city upbringing linked to worse navigation.
- Origin (CNRS News, read): Koppe, "A Video Game for Detecting Alzheimer's Disease", 27 May 2019,
  https://news.cnrs.fr/print/1460 — "The initiative came in 2015 from the company Deutsche Telekom, which contacted
  University College London"; "called on a professional developer, Glitchers"; "released in May 2016"; data sent
  "with the participant's consent"; "four million players". CORRECTED: the page gives no cost or time figure; the
  "$10 billion" was found nowhere. CNRS press release of 24 April 2019 (read,
  https://www.cnrs.fr/en/press/video-game-aids-research-alzheimers-disease): the players' strategies "represent the
  equivalent of 10,000 years of data", from "over 4 million players"; no cost figure.
- Lesson for us: a game made by a studio with a university partner, data with consent, published in top venues.

### 1c. VR studies run outside the lab, on players' own headsets

- Mottelson, Petersen, Lilija & Makransky (2021), Frontiers in Virtual Reality 2:681482, "Conducting Unsupervised
  Virtual Reality User Studies Online". https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2021.681482/full
  - Own Oculus Quest headsets, recruited mainly on Reddit, $15 gift card. Study I: 161 online vs 185 in lab,
    collected over 11 days; about 13% online showed no or negative learning gain vs 3% in the lab.
  - Hand tracking: a screening test cut rejected hand data from 27% (8 of 30, pilot) to 8% (3 of 39).
  - Quotes: "a good reliability of collected data, which requires only slightly more sanitation than a comparable
    laboratory study"; "We estimate an approximate 10% ill-intended user participation which can be mitigated with
    appropriate practices"; "over-recruitment is necessary because of the number of aberrant responses".
- Cesanek, Shivkumar, Ingram & Wolpert (2024), Nature Human Behaviour 8(6):1209-1224, "Ouvrai opening access to
  remote VR studies of human behavioral neuroscience". https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/
  - Open-source, runs in the headset's web browser through the WebXR Device API with Three.js (same family of
    technology as our A-Frame game); Firebase hosting; recruits on Prolific with a "VR headset ownership" screener.
  - 30 participants from 14 countries; paid $5-6; about 10 participants per experiment within 90 minutes of
    posting; median about 18 minutes; latency 8.3 ms on a Meta Quest 2.
  - Claim: "immersion, interactivity, and data quality rivaling what is currently achievable in a physical
    laboratory" (their comparison to lab results was qualitative, no direct lab dataset).
- Lesson for us: a browser WebXR study on home Quests is published in Nature Human Behaviour; our tech stack is
  already the kind the field uses. Paid recruitment (Prolific) is the norm for these small studies; our free
  floor could give far larger and more natural samples, but self-selected.

### 1b (cont.). Unpaid volunteers who play for feedback about themselves: LabintheWild

- LabintheWild home page lists 19 current online tests (self-image, Eastern vs Western perception, peripheral
  vision, multitasking, decision-making style, reading emotions from eyes, comparing your values with a chatbot's,
  and more); the reward is a comparison of yourself with others: "Find out how the image you have of yourself
  compares to other people across the globe". https://www.labinthewild.org/
- Who runs it (read): University of Washington, https://wildlab.cs.washington.edu/Project_LabintheWild.html —
  built "in 2012 (together with Krzysztof Gajos at Harvard)" by Katharina Reinecke's lab; "visited by more than 5
  million volunteer participants" from "more than 200 countries"; "more than 50 peer-reviewed publications".
- Huber & Gajos (2020), PLoS One 15(1):e0227629, "Conducting online virtual environment experiments with
  uncompensated, unsupervised samples" (Harvard), run on LabintheWild. https://pmc.ncbi.nlm.nih.gov/articles/PMC6992162/
  - Study 1 (maze navigation): 311 completers; "Our results replicate findings previously obtained in conventional
    laboratory settings".
  - Study 2 (Proteus effect: taller avatar, negotiation): 1,334 volunteers in two months; taller avatars made more
    self-favouring splits, but the effect was smaller than the original (Cohen's d 0.34 vs 1.23) and the
    acceptance effect did not replicate.
  - Pay was replaced by feedback about yourself (navigation style; negotiation skill). Only 27 of 1,645 used a
    headset: home VR was still rare then.
- Lesson for us: the "MythBusters, you are the subject" reveal is the same reward LabintheWild uses instead of money.

### 1a. Large multi-site studies and registered reports

- Psychological Science Accelerator: "a globally distributed network of researchers that pool intellectual and
  material resources to accelerate the accumulation of rigorous knowledge in psychological science"; proposals by
  open call. https://psysciacc.org/ — About (read, https://psysciacc.org/about.html): "The PSA began in August
  2017"; "100 labs signed up for the consortium one month after the post went live". No count on either page; the
  home page's member dashboard (https://shiny.thedoomlab.com/psadata/MemberMap) refuses connections (checked
  10.10.2026). Latest count read: "2,468 members in 73 countries" (Einstein Foundation 2022 award page,
  https://award.einsteinfoundation.de/award-winners-finalists/recipients-2022/psychological-science-accelerator).
- PSA projects (read, https://psysciacc.org/projects.html): 15 projects, PSA001-009, PSA-CR 001-003, PSA-JTF1-3;
  e.g. PSA001 Face Perception "11 world regions, 41 countries and 11,570 participants"; PSA006 Trolley Problem
  "in 45 countries"; PSA-CR 003 "n = 25,718 from 89 countries". No VR study on the page.
- Many Labs 2 (APS Observer, 28 Dec 2018): 28 classic and contemporary findings, "more than 60 labs across 36
  nations and territories", 14 of 28 replicated; population characteristics had "little to no bearing on the
  failure of a finding to replicate".
  https://www.psychologicalscience.org/observer/replications-dont-hinge-on-sample-and-setting-differences-multilab-project-shows
- Kurt Lewin Institute Many Labs grant (read, April 2025 PDF,
  https://kurtlewininstituut.nl/wp-content/uploads/sites/426/2025/04/KLI-Many-Labs-grant-information.pdf): "The
  maximum amount of the grant is 9.000 euros"; it invites "all KLI members" (a Dutch graduate school) and expects at
  least two university/lab groups; deadline May 15, 2025. Confirmed: members only, not open to us.
- What it means for us: the field's current answer to the replication crisis is many sites, big samples and plans
  fixed in advance. A game with thousands of players is "one site, very many people"; joining the PSA as a member
  lab, or offering a VR version of a PSA study, is the route in (no PSA VR study exists on its projects page).

## 3. The owner's two-phones idea: closest published work

### 3a. Reasons given for a choice not made for those reasons (Nisbett & Wilson 1977)

- Nisbett, R. E. & Wilson, T. D. (1977). Telling more than we can know: Verbal reports on mental processes.
  Psychological Review 84, 231-259. Record: https://deepblue.lib.umich.edu/handle/2027.42/92167?show=full
  READ pp. 243-244 from the page images of the scan (its text layer is garbled):
  https://web.math.princeton.edu/~sswang/literature_general_unsorted/Nisbett-Wilson-PsychologicalReview1977.pdf
  (excerpt saved: objekt-papers/nisbett-1977.txt). Two studies in shops, "under the guise of a consumer survey":
  "four different nightgowns in one study (378 subjects) and four identical pairs of nylon stockings in the other
  (52 subjects)"; asked which was "the best quality"; "the right-most stockings being preferred over the left-most
  by a factor of almost four to one"; "no subject ever mentioned spontaneously the position"; asked directly,
  "virtually all subjects denied it". Their guess: the shopper's habit of "shopping around".
- CORRECTED: the paper names no reasons; "knit" or "sheerness" are not in it. Newell & Shanks say "more details
  of the original experiments are given in Wilson & Nisbett 1978" (Social Psychology 41:118-131,
  https://hdl.handle.net/2027.42/92172, "Access restricted to U-M campus"): per-position shares and the reasons
  shoppers gave stay unverified until that paper is read (owner).
- Its reach (read, objekt-papers/johansson-2006.txt): Johansson, Hall, Sikström, Tärning & Lind (2006),
  Consciousness and Cognition 15:673-692, https://www.lucs.lu.se/fileadmin/user_upload/lucs/2011/01/Johansson-et-al.-2006-How-Something-Can-Be-Said-About-Telling-More-Than-We-Can-Know.pdf
  — "perhaps the most cited article in the recent history of consciousness studies, yet no empirical research
  program currently exists" that continues it. Their own data: 80 participants, 15 face pairs, 4 s each, 480
  reasons; reasons for swapped and real choices showed "very few differences".
- Critique (read, objekt-papers/newell-2014.txt): Newell & Shanks (2014), Behavioral and Brain Sciences
  37(1):1-19, preprint https://discovery.ucl.ac.uk/id/eprint/1419217/ — asking about position "fails the relevance
  criterion"; a rule "if the current item is no worse in terms of quality than the previous item, then prefer the
  current item" yields the right-most pick without position causing it. CORRECTED: the umn.edu PDF cited before is
  a page of BBS commentaries on their article, not the review itself.

### 3b. Choice blindness (Johansson, Hall and colleagues; read from objekt-papers)

- Johansson, Hall, Sikström & Olsson (2005), Science 310:116-119 (text: objekt-papers/johansson-2005.txt; card
  docs/cards/johansson-2005.md). 120 participants, faces swapped by a card trick: "With a total of 354
  manipulated trials performed, only 46 (13%) were detected concurrently"; reasons for the swapped face did not
  differ from reasons for real choices; 13.3% of them named features only the swapped face had.
- Hall, Johansson & Strandberg (2012), "Lifting the Veil of Morality: Choice Blindness and Attitude Reversals on a
  Self-Transforming Survey", PLoS ONE (text: objekt-papers/hall-2012.txt). 160 volunteers; "a full 69% of the
  participants failed to detect at least one of two changes"; people "often constructed coherent and unequivocal
  arguments supporting the opposite of their original position".
- Hall, Johansson, Tärning, Sikström & Deutgen (2010), "Magic at the marketplace", Cognition 117(1):54-61 (READ,
  objekt-papers/hall-2010.txt; https://www.lucs.lu.se/fileadmin/user_upload/lucs/2011/01/Hall-et-al.-2010-Magic-at-the-Marketplace-Choice-Blindness-for-the-Taste-of-Jam-and-the-Smell-of-Tea.pdf):
  "180 consumers (118 female) at a supermarket in Lund, Sweden", ages 16-80, posing as quality surveyors; 3 jam and
  3 tea pairs, "30 M and 30 NM trials" per pair; a two-sided jar turned over secretly. "In total, 33.3% of the
  manipulated jam trials, and 32.2% of the manipulated tea trials were detected" (concurrently 14.4% and 13.8%).
  Half were promised the chosen item as a gift: tea detection was 19.6% with the gift vs 46.3% without.
- Recent work. Read on PubMed (titles only, https://pubmed.ncbi.nlm.nih.gov/?term=%22choice+blindness%22&sort=date):
  "Choice Blindness in a Military Setting" (Patterson, Hum Factors, Sep 2026, PMID 42041049); pupillometry
  "evidence of covert detection" (Grassi, Front Psychol, Dec 2025, PMID 41426389); "Social cues for experimenter
  incompetence influence choice blindness" (Marchant, Conscious Cogn, Jul 2025, PMID 40381527).
  Remington et al., J. Cognitive Psychology 2024, doi:10.1080/20445911.2024.2356283 (READ, CC BY,
  https://discovery.ucl.ac.uk/id/eprint/10192819/, objekt-papers/remington-2024.txt): computer task at UCL, 5 of 25
  face trials swapped; detections per person 1.06 (autistic) vs 1.34 of 5, "no significant difference" (U = 300,
  p = .797), "a floor effect might be present". CORRECTED: the abstract says 16 and 21 adults, the method "A
  total of 50 individuals took part: 18 autistic adults ... and 32 non-autistic". A preregistered no-deception arm
  with a one-week retest (Olson, BIAL grant 347/20; listings: 145 or 147 students, 80% missed the swap): both BIAL
  PDFs now return 404 (https://www.fundacaobial.com/media/4353/2020-open-label-choice-blindness.pdf, .../4654/grant-347-20-jeremy-olson.pdf);
  a Wayback copy of 9 Aug 2025 shows only as an embedded PDF our tools cannot read (owner); no journal version
  found (OpenAlex): unverified. Religious attitudes: McKay, Hall, Strandberg et al. 2025, Religion, Brain &
  Behavior, doi:10.1080/2153599X.2025.2557482 (CC BY; journal page behind a bot check; authors' manuscript READ
  from OSF https://osf.io/nwr49, objekt-papers/mckay-2025.txt): three iPad studies with students (final 130, 98,
  110); of manipulated trials "105 (40%) were corrected", 52% and 44% in studies 2-3; "a large effect (d > 1)" on
  later attitudes; religious people "no less likely" to detect.
  CORRECTED: no 2024 pension study was found; the pension study found is McLaughlin & Somerville (2013), Judgment
  and Decision Making 8(5):577-588 (listing: 100 people, at most 37.2% detected). The "online study of 498" was not
  found (an online paper with 955 people, Strandberg et al. 2020, was listed instead; searched again 10.10.2026).
- VR versions (both read). Lingonblad et al., "Virtual Blindness", IVA 2015, LNCS 9238:442-451 (Lund record
  https://lup.lub.lu.se/search/publication/282f44a7-04a9-4755-b818-2388a93809cd; Springer's page needs a login):
  38 participants, a virtual experimenter, 16 portrait pairs, 4 swapped; more and earlier detections in the
  low-immersion condition; head-mounted displays named only as future work (CORRECTED: not a headset study).
  Arora, Gupta & Parnami, UIST 2019 Adjunct, pp. 84-86 (poster, free, https://dl.acm.org/doi/10.1145/3332167.3357123):
  racial-bias choices; "92% of subjects failed to notice a mismatch in their choices, while 75% exhibited choice
  blindness"; N not given in the abstract.

### 3c. Price as a cue to quality: marketing placebo (read)

- Plassmann, O'Doherty, Shiv & Rangel (2008), "Marketing actions can modulate neural representations of
  experienced pleasantness", PNAS 105(3):1050-1054. https://rnl.caltech.edu/publications/pdf/plassmann2008.pdf
  - 20 subjects; three wines shown as five: wine 1 at "$5 real retail price, $45 fictitious price", wine 2 at
    "$90 real retail price, $10 fictitious price", a $35 distracter.
  - "increasing the price of a wine increases subjective reports of flavor pleasantness as well as
    blood-oxygen-level-dependent activity in medial orbitofrontal cortex"; pleasantness correlated with price
    (r = 0.59); no effect on taste intensity.
  - Blind retasting 8 weeks later without prices: "there were no reported differences among the wines".
  - The authors' own caveat: "some subjects might deem it inappropriate to report to the experimenter that a
    cheaper wine tastes better" (experimenter demand). Subjects "were not debriefed" (Caltech's small pool): we
    would debrief everyone.
- Shiv, Carmon & Ariely (2005), "Placebo effects of marketing actions: Consumers may get what they pay for",
  Journal of Marketing Research 42(4):383-393, DOI 10.1509/jmkr.2005.42.4.383. Abstract (Duke record, read,
  https://scholars.duke.edu/publication/861346): "marketing actions, such as pricing, can alter the actual efficacy
  of products"; people who paid a discounted price for an energy drink solved fewer puzzles. No open full text
  (SAGE paywall; Duke lists no PDF): the drink, prices ($1.89 vs $0.89 in retellings) and puzzle counts stay
  UNVERIFIED (owner).

### 3d. What our version would test that is new (our design reasoning, not a published finding)

- Known: people give confident reasons for choices driven by things they do not report (3a, 3b); a price label
  changes reported quality of the same thing (3c).
- Not covered by the work read here: (1) a price on an object that is worthless to everyone, since a VR phone
  cannot be owned or used; taking the "$10,000" phone costs nothing, so it isolates the price cue from any real
  gain; (2) whether the reasons name the price or invent features ("calls better"), coded from the player's own
  words, which is Nisbett & Wilson's question asked of thousands; (3) a Plassmann-style quality test inside VR:
  both phones play the SAME call audio and the player rates the sound; does the "$10,000" phone sound better?
  (4) left/right position counterbalanced, so the position effect is measured on the side; head data give the
  order the phones were looked at, the very thing Newell & Shanks say position stands in for (ours).
- Hall et al. 2010 found fewer detections when the chosen item was a gift (19.6% vs 46.3%): a free "take it" may
  matter (ours, from 3b).
- Sketch: two identical phones, labels $10,000 / $10 (sides random) → "take one" (grab with hand) → "why?"
  (voice optional, else pick from reasons incl. "the price") → "call someone" on each, same audio, rate sound →
  reveal: same phone, same sound, your reason, and the share of players who said the same.
- Before design (rule 16): Nisbett & Wilson 1977 (pp. 243-244) and Hall et al. 2010 are now in objekt-papers;
  still missing: Wilson & Nisbett 1978 (stocking details) and Shiv et al. 2005 (both behind logins: owner).

## 1d. Open questions the field says need data (from the pages read; no published "agenda list" was found)

- Robustness: Many Labs 2 replicated 14 of 28 (link in 1a). A VR doorway study "call[s] into question the
  generalisability and robustness of this effect" (McFadyen et al. 2021, below). Online VR effects come out
  smaller (Huber & Gajos 2020: d 0.34 vs 1.23).
- Who is sampled: home Quest owners were 86% male, median age 26; "claims about generalizability should be avoided"
  (Mottelson et al. 2021, verified in docs/research/vr/06-science.md). Cultures: the PSA runs moral-dilemma
  judgments across countries (PSA006, 45 countries). Russian-speaking VR players are a sample none of the papers
  read had.

## 2. Candidate experiments for our setup (one player, 5-10 min, hands and head tracked, voice optional)

Format: builds on / still unknown / what VR at scale adds / sketch. "Unknown" is from the paper where quoted,
otherwise our reading (marked). Fit rules from 06-science.md: no high-stress or startle content unsupervised at
home (Steed et al. 2016, doi:10.1109/TVCG.2016.2518135); compare conditions within our players only.

1. Two phones (the owner's idea). Plassmann et al. 2008; Shiv et al. 2005; Nisbett & Wilson 1977 (part 3). / A
   price cue on an object worth nothing to anyone; whether stated reasons name the price (ours). / Thousands of
   choices, the grab itself, head-direction dwell on each phone before choosing. / Part 3d.
2. Choice blindness with the hand. Johansson et al. 2005; Hall et al. 2010, 2012 (objekt-papers). / VR versions:
   one screen study (38 people) and one poster (3b); trick-aware players are the authors' own failure case. / Choice
   by grasp, detection measured at scale, prior knowledge logged. / Pick the nicer of two objects 10 times; 2 are
   swapped when pocketed; "why this one?"
3. Moral action vs judgment. Francis et al. 2016, PLoS ONE 11(10):e0164374 (objekt-papers/francis-2016.txt):
   "a greater endorsement of utilitarian responses ... when action was required" than in judgment. At home:
   Kissel et al. 2023, Societies 13:69 (33 valid; 5 said their logged action was accidental; 06-science.md). /
   Does the gap hold in thousands, across cultures? (ours) / Hesitation time, aborted hand movements. / Judge a
   (non-gory) dilemma in words, then meet it with a lever; ask "was that what you meant?"
4. Proteus effect (avatar height and bargaining). Huber & Gajos 2020 (1b): online replication with d 0.34 vs
   1.23, only 27 headset users; the original, Yee & Bailenson 2007, Human Communication Research 33:271-290 (READ,
   https://vhil.stanford.edu/sites/g/files/sbiybj29011/files/media/file/yee-proteus-effect.pdf, objekt-papers/yee-2007.txt):
   "50 undergraduate students at Stanford", paid $10; shorter, equal or taller avatar; ultimatum game over a
   hypothetical $100; tall split "more in their own favor (M = 60.63 ...)" than short (M = 52.06), F(2, 46) = 5.64,
   eta2 = .20; the abstract's "behaved more confidently in a negotiation task" confirmed. / Its size
   with a tracked first-person body (ours). / Real embodiment, many players. / Random avatar height seen in a
   mirror, then split 100 points with an agent.
5. Doorway effect. McFadyen et al. (2021), "Doorways do not always cause forgetting: a multimodal investigation",
   BMC Psychology 9:41, https://link.springer.com/article/10.1186/s40359-021-00536-3 (read in the browser, earlier
   pass; open copy https://pmc.ncbi.nlm.nih.gov/articles/PMC7938580): "we observed no significant effect of doorways
   on forgetting", except under working-memory load in VR. Samples (re-read on PMC): VR "final sample of 29" and,
   with a counting load, "45" (Fig. 4 says N = 40); video 26; real walk 26. / Whether the effect exists; the paper asks "what factors contributed to the effect observed in
   previous studies". / Our building is a corridor of doors; huge N settles a small effect. / Carry an object
   through a door vs the same distance in one room; a memory probe halfway.
6. Cheating with a virtual observer. Mol, van der Heijden & Potters (2020), Experimental Economics,
   https://doi.org/10.1007/s10683-020-09644-0 (READ, objekt-papers/mol-2020.txt): 118 analysed, 30 rounds of a
   slot-machine "mind game", one round paid in euros; "60% (71/118)" cheated beyond chance; cheating rate Passive
   0.74 > No avatar 0.71 > Active 0.66; only Passive vs Active differed (p = 0.029): "not less cheating than in a
   control condition without an avatar". / Whether it holds with points instead of money (ours). / Lying is seen
   only in the distribution, never per person: no one is accused. / A private pick, then report it for points;
   observer watching, looking at a phone, or absent.
7. Navigation with the body. Spiers et al. 2023 (1b): 3.9 million players, male advantage in all 63 countries. /
   Whether phone-game scores hold when the body turns in VR (ours). / Head and body turns logged. / Study a map,
   then reach three targets in a building.
8. Social influence in an emergency. Kinateder & Warren 2016, doi:10.3389/frobt.2016.00043 (06-science.md): 68%
   of VR participants thought the alarm was staged; responses smaller than real. / Plausibility when players
   expect tricks. / Weak fit: startle at home (Steed et al.).
9. Conformity to virtual agents. Kyrlitsias & Michael-Grigoriou 2018; Kyrlitsias et al. 2020,
   doi:10.3389/fpsyg.2020.02254 (06-science.md): unambiguous task 1.14% wrong; ambiguous 5-s task 63% conformed
   at least once. / What makes agents count as a group. / Ambiguous judgment after agents answer aloud.
10. Obedience (Slater et al. 2006; Gonzalez-Franco et al. 2018, 06-science.md): obedience higher in VR. Not
   recommended for home play: distress without a supervisor.
