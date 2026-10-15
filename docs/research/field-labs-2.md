# Labs running experiments outside the lab, part 2 (parts list and part 1 in field-labs-1.md)

### 9. Project Implicit (non-profit; IAT demo site at Harvard's domain; IRB at University of Virginia; USA)
- LIVE FLOW WALKED: "Preliminary Information" page before choosing a test,
  https://implicit.harvard.edu/implicit/takeatest.html (read 2026-10-10):
  - Why extra questions: optional attitude questions because "the IAT can be more valuable if you also describe
    your own self-understanding"; warning up front: "Your IAT results may depart from your personal beliefs."
  - Age gate: "You must be 18 years of age or older to participate. Visitors between 14-17 years of age may visit
    Project Implicit Youth." (a separate youth site).
  - Data: "IP addresses are routinely recorded but are completely confidential. For research purposes, data
    without directly identifying information is made publicly available."
  - Disclaimer: the universities "make no claims about the validity of these suggested interpretations. If you are
    unprepared to encounter interpretations you might find objectionable, please do not proceed further."
  - Contact for leaving early: "Share why you left before completing a study"; independent contact: "Chair,
    Institutional Review Board for the Social and Behavioral Sciences ... University of Virginia".
  - Consent = one button sentence: "I am aware of the possibility of encountering interpretations of my IAT test
    performance with which I may not agree. Knowing this, I wish to proceed" (touchscreen or keyboard).
  - Geo-routing to country sites ("It looks like you are taking this from Canada. Click here to go to our Canadian
    site."); the menu has "Donate".
- About page (https://www.projectimplicit.net/about/, via WebFetch): "Schedule a call ... to discuss your research,
  education, or consulting needs"; whether paid is not stated there or on the Perception Institute page, which is a
  partner's "Hair Implicit Association Test (IAT)" (https://www.projectimplicit.net/perception-institute-collaboration/).
- Founders and data (OSF archive wiki, read via the OSF API, https://osf.io/y9hiq/wiki): "founded as a
  multi-university research collaboration in 1998 by three scientists - Tony Greenwald (University of Washington),
  Mahzarin Banaji (Harvard University), and Brian Nosek (University of Virginia), and was incorporated as a
  non-profit in 2001" (Ratliff & Smith 2024 say "In 2003 ... incorporated"; sources differ); "15 IAT studies"; yearly data sets with codebooks;
  users must agree to "strictly non-commercial research purposes" and "not attempt to identify or re-identify".
  Total test count: see science-reach.md A3.

### 8. MIT Moral Machine (Awad, Dsouza, Rahwan - MIT Media Lab; Shariff, UBC; Bonnefon, Toulouse; USA/Canada/France)
- Awad et al. (2018), Nature 563:59-64, doi:10.1038/s41586-018-0637-6; full text with Methods read and saved
  objekt-papers/awad-2018.txt (open copy https://cdn.vanderbilt.edu/vu-my/wp-content/uploads/sites/2688/2020/01/11235711/The_Moral_Machine_experiment.pdf).
  Ethics: "This study was approved by the Institute Review Board (IRB) at Massachusetts Institute of Technology
  (MIT)"; no consent wording in the paper. Reporting summary: "the sample is self-selected". Other facts: "40 million decisions in ten languages from millions of
  people in 233 countries and territories"; "data, both at the individual level (anonymized IDs) and the country
  level, can be used beyond replication". Robustness checks used "only first completed (13-scenario) session by
  any user" because those respondents "had not seen their summary of results yet" (repeat-play handling).
  Sample skew: "over-representation of males and younger individuals" vs US census data.
- Its open Supplementary Information (read in full, objekt-papers/awad-2018-supplement.txt): "A Moral Machine session
  comprises 13 scenarios, after which the user is presented with a summary of their choices along with how they
  compare to other users", then "an optional survey"; "Users can go through as many sessions as they wish";
  ten languages incl. Russian "through a process of forward-translation and back-translation"; country from
  "approximate geo-location information ... through the IP addresses". The first-session data set exists because
  repeat sessions bring "adapting respondents, who upon seeing a summary of their results decided to make different
  decisions". Checks: scenario order, left-right position, device, description seen. No ethics or consent wording in
  the supplement (the IRB sentence is in the Methods, above).
- Awad, Dsouza, Shariff, Rahwan & Bonnefon (2020), PNAS 117(5):2332-2337, full text read and saved
  objekt-papers/awad-2020.txt (Europe PMC PMC7007553):
  - Flow: 3 dilemmas ("Classic" mode, from June 2017), text translated "using a translation and back-translation
    process" into 10 languages incl. Russian; "The country ... was geolocalized through the IP address"; after the
    session "users had an opportunity to share the link ... and were presented with an optional survey of their
    demographic, political, and religious characteristics."
  - N: 70,000 participants, 42 countries, "a lower bound of 200 responses per scenario and country"; "About 20,000
    users opted to fill out that survey"; "75% of survey takers were men, 75% were younger than 32".
  - Self-critique: "We relied on voluntary participation in a viral online experiment, and our sample shows clear
    signs of self-selection." Data and code: "deposited in the Open Science Framework".
  - Ethics body: not in the main text; its SI could not be fetched (PMC bot check, Europe PMC archive cut off).
    Same website as the 2018 study, whose Methods name the MIT IRB (above).
- Platform: a plain website (moralmachine.mit.edu), no pay; the reward is a summary of your choices vs others
  (the Nature extended data mention the "summary of results").

### 4. Sea Hero Quest (original: Spiers UCL, Hornberger UEA, Deutsche Telekom, studio Glitchers; NOW: St Andrews + Glitchers)
- The CURRENT study on the app (participant information sheet read in full in the browser 2026-10-10,
  https://seaheroquest.com/ethics): "Understanding episodic memory through the lifespan", "James Ainge
  (University of St. Andrews) & Maxwell Scott-Slade (Glitchers Ltd)". Spiers/Hornberger are not named there.
  - Task: daily "quest" of "2-3 sub-games", "about 2-5 minutes each day", play as many or few as you like.
  - Recorded: "anonymous gameplay data only" - "navigation paths and decisions, time taken to complete tasks,
    scores", optional "year of birth, gender, and country", device type and OS; "We do not collect your name,
    email address, precise location". Longitudinal link: "an anonymous linking ID will allow data across days to
    be analysed longitudinally". Withdrawal after submission impossible: "it cannot be withdrawn once submitted".
  - Stored "on a drive on the University of St Andrews network and on UK-based Amazon Web Services cloud servers";
    "retained indefinitely"; "The University of St Andrews and Glitchers Limited are joint controllers".
  - MONEY AND DATA (differs from our rules): "Glitchers Limited offers an optional paid subscription within the Sea
    Hero Quest app that allows you to track your own performance over time and see how it compares to global
    benchmarks" ("not part of this research study"); the anonymous dataset "may also be used by Glitchers Limited
    for commercial purposes, including ... licensing to academic and commercial third parties, such as
    universities, pharmaceutical companies, and digital health companies" and "training ... machine-learning
    systems (including large language models)".
  - Ethics: "granted ethical approval by the University of St Andrews Teaching and Research Ethics Committee" (no
    number); complaints also to the UK ICO, "although note that anonymous research data is generally outside the
    scope of UK data protection law".
  - Benefits: "There are no direct benefits to taking part in the research." Age limit: none stated.
- Original data deal, Telekom launch release of May 04, 2016 (live page 404; Wayback copy read,
  http://web.archive.org/web/20160723230306/http://www.telekom.com:80/media/company/311740): "All of the gameplay
  data collected will be anonymised and stored securely within T-Systems data center in Germany"; design "led by
  Saatchi & Saatchi London".
- Sea Hero Quest VR, Telekom release (Wayback copy, http://web.archive.org/web/20250921114157/https://www.telekom.com/en/media/media-information/archive/revolutionary-virtual-reality-game-that-aids-dementia-research-501354):
  "developed to work with the Samsung Gear VR", free "from 29th August 2017 via the Oculus mobile platform"; "The
  project was initiated and led by Deutsche Telekom"; data "stored in a secure T-Systems server in Germany an [sic]
  all analysis by the UCL / UEA team is conducted on entirely anonymous data"; mobile game "downloaded nearly 3
  million times". (lbbonline.com article on the VR launch: the page shows no text in our browser; not needed now.)

### 5. Stanford Virtual Human Interaction Lab (Bailenson, Stanford, USA)
- Han, Miller, DeVeaux, Jun, Nowak, Hancock, Ram & Bailenson (2023), "People, places, and time: a large-scale,
  longitudinal study of transformed avatars and environmental context in group interaction in the metaverse",
  J. Computer-Mediated Communication 28(2) zmac031, doi:10.1093/jcmc/zmac031. Publication page read
  (https://sml.stanford.edu/publications/hancock-jt/people-places-and-time-large-scale-longitudinal-study-transformed-avatars,
  gives only the DOI). Full text read from the owner's copy (objekt-papers/han-2023.txt).
- Inside a 10-week course on VR: "all students who were part of the course took part in all the VR activities, only
  those who consented to participate in the study had their data included"; Study 1: 93 of 101 consented, 81 kept
  (five or more of eight sessions), 59% new to VR; Study 2: 158 of 171 consented, 137 kept. Headsets: "Oculus Quest 2
  ... for use in their personal environment" (worn at home). Oversight: "review both by the IRB and a second
  university ethics organization, and third-party oversight of the consent process and data collection" (teachers
  were the researchers). Two training sessions first, a Zoom call open in every session for technical help.
  Recorded: "18 degrees of freedom of movement ... (e.g., pitch, yaw, and roll of head and both hands)" for
  synchrony, plus weekly surveys.
- Model: everyone plays the same, only consenters' data counts; this is the same split as our "start without
  recording".

### 11. Psychological Science Accelerator and Many Labs (global networks)
- PSA 004 (with CREP): Hall et al. (2024), "Registered Replication Report: A Large Multilab Cross-Cultural
  Conceptual Replication of Turri et al. (2015)", AMPPS 7(4), read from objekt-papers/psa004-gettier.txt.
  - How a network handles ethics: "All contributing project teams were required to submit their local
    institutional ethics approval (if applicable) before data collection as part of their preregistration" -
    i.e. no central ethics board; each site's own committee.
  - Quality gate per site: "Teams could not contribute to data collection until their protocol was approved";
    65 teams signed up, 51 approved, 47 contributed, 45 teams / 37 sites in the final data.
  - Plan: Stage 1 Registered Report, "preregistered on OSF"; "Study materials, de-identified raw data, de-identified
    data with exclusions, and analysis code and output are available" on OSF.
  - Exclusions (preregistered except one): of 9,440 completers "48.88% (n = 4,614) were excluded": missing or
    under-age (age of majority by region: 18; "Taiwan, where the age of majority is 20"); "Prior participation"
    2.52%; failed all three comprehension questions 46.36%; "Knowledge of hypothesis" 2.15% (explicitly stated the
    hypothesis when asked); low language proficiency 22.17%. Final N = 4,826; site median 81 (28-588).
- Network size (PSA's own Patreon page, undated, via WebFetch, https://www.patreon.com/psysciacc/about): "currently
  over 500" labs "representing over 60 countries"; money goes to "Grants to support data collection costs in
  under-resourced labs" and staff stipends. Home page (https://psysciacc.org/): "12+ projects in our study
  portfolio"; its join page returned 404 (whether membership is free: not stated).

### 12. Russia (possible partners)
- HSE Centre for Cognition & Decision Making (Institute for Cognitive Neuroscience, HSE University, Moscow).
  Participant page read (https://www.hse.ru/cdm-centre/cdm_exp_ru): it invites people "to take part in experiments
  run by staff and students of our Centre" and points to a VKontakte group and a Telegram channel
  (https://t.me/experimentshse) "with current information about experiments" (our translation). No pay, consent
  or ethics details on that page (none). Corrected from snippets: the centre's home page
  (https://www.hse.ru/cdm-centre/, via WebFetch) lists only groups - "Neuroeconomics", "mechanisms of impulsive and
  risky decisions", "neurobiology of adaptive decisions", "dynamics of neuronal processes", "mathematical
  modelling", "motor control", an "MEG group" (our translation); persuasion, dissonance, trust, neuromarketing are
  not named there. No VR or at-home study found for this centre.
- MSU Faculty of Psychology, "VR centre of MSU" page (https://vrmsu.ru/departments/psihfak/; region block, text sent
  by the owner, our translation): founded 1966, "13 departments and 5 research laboratories"; a programme on the
  psychological aspects of VR run by the Department of Methodology of Psychology, the "Perception" laboratory and
  the Department of Psychophysiology; coordinator G. Ya. Menshikova (DSc), lead executive A. I. Kovalev (PhD); an online course "Psychology of virtual reality and cyberpsychology"
  (lk.msu.ru/course/view?id=2079). No home-VR or online-at-scale study found.
- MSUPE (Moscow State University of Psychology and Education, MGPPU; region block, news page sent by the owner, our
  translation): the "laboratory of virtual technologies and reserve capacities of the personality" of the Faculty of
  Extreme Psychology hosted on 11 March 2024 a presentation of "PsyTechVR" by the company Kore Partners Soft, for
  training psychologists in managing stress and phobias, "more than 50 VR scenes of a phobic nature", EMDR for PTSD;
  organised by Prof. T. N. Berezina (mgppu.ru/news/13972). A company working with the lab: the partner model exists.
  MSUPE Institute of Experimental Psychology (Barabanshchikov, Selivanov; journal "Experimental Psychology"), two
  lab studies on VIVE headsets, both via WebFetch (our translation): anxiety, 1 Dec 2023
  (https://naked-science.ru/article/column/psihtualnoj-realnosti-pom): 44 people, programs "Anxiety: no-1/-2"
  (third- vs first-person avatar, EMDR elements), Spielberger-Khanin and Beck scales, "training in a VR environment
  significantly lowers anxiety"; creativity, 23 Nov 2023 (https://naked-science.ru/article/column/v-mgppna-psihiku-i-kreati):
  "1st-2nd year students" of MSUPE and SmolGU, VR groups of 40, 23 and 10 vs 46 on monitors. The master's course
  "Practicum ... with a VR headset": search listing only, not opened. All lab or clinical; no home-VR study.
- Institute of Psychology RAS: no VR or online-at-scale project found in three searches (not found).
- RUDN "Laboratory of Virtual Reality" (https://www.rudn.ru/science/laboratories-and-centers/laboratoriya-virtualnoy-realnosti,
  via WebFetch): a unit of the centre for digital technologies in education, to "ensure effective use of VR
  technologies in teaching students" (our translation); VR trainers for courses; no experiments with people. Not
  a psychology lab.
- Summary for Russia: lab and clinical VR work exists (MSU "Perception" lab, MSUPE); the field model we copy
  (public, unpaid, home, consent screens, open data) was not found at any Russian institution in this pass.

### 6. Mel Slater's EventLab (Universitat de Barcelona, Spain)
- One search for a 2023-2025 EventLab study on participants' own headsets at home found none (not found). The
  lab's recent work in objekt-papers is lab-based (Slater et al. 2022, "A Separate Reality", Front. Virtual Real.,
  "Event Lab, Faculty of Psychology, Universitat de Barcelona", objekt-papers/slater-2022.txt). QuickVR: Oliva,
  Beacco, Navarro & Slater (2022), Front. Virtual Real. 3:937191, read in full, saved objekt-papers/oliva-2022.txt:
  "publicly available and free for non-profit and research projects" (https://github.com/eventlab-projects/com.quickvr.quickbase),
  setups for "Meta Quest, Pico Neo 2/3, OpenXR"; the paper says nothing of remote or at-home studies. A second
  search (2026-10-10) again found no EventLab home-headset study (not found).

### 13. Other active labs of this kind (found on the way)
- Bundeswehr University Munich / LMU Munich (Radiah, Makela, Prange, Delgado Rodriguez, Alt): "Remote VR Studies -
  A Framework for Running Virtual Reality Studies Remotely Via Participant-Owned HMDs" (arXiv:2102.11207, read
  locally, objekt-papers/rivu-2021.txt). Survey of headset owners: "227 complete surveys (out of 276)", recruited
  via "Prolific (97), Reddit (95), mailing lists (14), Facebook (12), Discord (4)"; 67% willing to join VR studies
  after the pandemic. Pay: "mostly willing to accept cash (= 189, 83%), but also game vouchers (= 103, 45%). A
  total of 77 participants (34%) stated that they would do so voluntarily without any compensation."
  2022 follow-up, read in full, saved objekt-papers/rivu-2022.txt (Rivu, Bayerl, Knierim & Alt, MUM 2022,
  doi:10.1145/3568444.3568462): 21 people without own headsets set up an HTC VIVE at home; "12 participants
  successfully assembled the hardware without assistance"; longest setup 47 minutes; "it is harder to recruit
  participants who do not have prior VR experience" (many declined "thinking they were not tech-savvy enough").
- TestMyBrain (Germine; McLean Hospital / Mass General Brigham + non-profit Many Brains; USA). Who-we-are page
  read (https://v5.testmybrain.org/dashboard/who-we-are.html): "co-supported by Many Brains and the Laboratory for
  Brain and Cognitive Health Technology (BaCH Tech Lab) at McLean Hospital. Since 2005, we have collected data
  from over 3.7 million participants in a citizen science framework, as well as supporting over 2,200 research
  studies in over 240 countries"; funded by NIH grants; lists partner "Organizations that we have partnered with to
  build or develop specific cognitive tests or cognitive testing infrastructure". Citizen-science page
  (https://v5.testmybrain.org/using-tmb/citizen-science.html): "a not-for-profit initiative ... providing
  cognitive testing tools that allow people to engage in science and learn about themselves". Model: a university
  lab + a non-profit that hosts other researchers' studies (the "platform for others" route). Ethics in Germine et
  al. 2012 (objekt-papers/germine-2012.txt): "Informed consent was obtained from all participants in accordance with
  the guidelines set by the Committee for the Use of Human Subjects at Harvard University and Wellesley College";
  exclusions: "self-reported technical problems, self-reported cheating, repeat participation", age <10 or >70. LabintheWild's 2015 paper credits it: about 15-minute tests "proven to successfully
  engage participants on TestMyBrain.org".

### 7 (cont.). Steed group, lessons from running out of the lab (UCL), full text saved objekt-papers/steed-2021.txt
- Steed, Archer, Congdon, Friston, Swapp & Thiel (2021), "Some Lessons Learned Running Virtual Reality Experiments
  Out of the Laboratory", arXiv:2104.05359 (https://ar5iv.labs.arxiv.org/html/2104.05359). No 2023-2026 home-VR
  study of this group was found in two searches (not found); nearest, Bovo, Giunchi, Costanza, Steed & Heinis
  2022, Front. Comput. Sci. doi:10.3389/fcomp.2022.928269, on no-shows in remote collaborative VR (not opened).
  - The 2016 study's live participant sheet (https://vr.cs.ucl.ac.uk/vrjam/information-for-participants, via
    WebFetch): for owners of "Samsung Gear VR" or Cardboard; "You do not need to consent to data collection";
    "No data is sent from the device until the experiment is completed"; removal by emailing the device used;
    UCL Research Ethics Committee approval 0439/002.
  - Consent: "fully on the web as part of the download experience or from within the app. Our ethics approval
    allows for short-form instruction and consent in-app as long as participants can also access a long-form
    version online if they wish."
  - Debrief: "We direct participants to debriefing and often provide a simple summary of what happened within the
    applications at the end."
  - Distribution: "extensive use of the SideQuest platform"; on PC "participants rely on our word that the
    application is not dangerous".
  - Quality: monitored participants "to make sure that they were active and looking in plausible directions";
    removed questionnaires "answered too quickly or answered the same value for each question"; reversed items.
  - Pay without linking: the app "generates a unique code on completion that can be redeemed if emailed to us.
    This unique code can't be matched to the data we received."
  - Scale: very large numbers need the experiment "attractive to run on its own; it is unlikely that this would be
    compensated". Lab-side loss: "participants can still ask these questions (via email) but are less likely to".

---

## 14. What is common (the practice to copy) and where they differ - drawn only from the entries above

Common to (nearly) all:
1. A named ethics body approves before any data: Copenhagen psychology dept (Mottelson); UCL Research Ethics
   Committee (Steed; Great Brain Experiment, no. 4354/001); Columbia IRB (Ouvrai); UW Human Subjects Division named
   on the consent screen (LabintheWild); UVA IRB named before every IAT (Project Implicit); St Andrews TREC (Sea Hero
   Quest now); networks: each site's own approval filed with the preregistration (PSA); MIT IRB (Moral Machine).
2. Consent is a short screen before the task, with an independent contact and a long version online: LITW's four
   questions + one checkbox; Project Implicit's one-sentence "I wish to proceed"; Great Brain Experiment "on
   downloading the app"; Steed: "short-form ... consent in-app as long as participants can also access a long-form
   version online".
3. No names: anonymous device or session ID; location only coarse from the IP (LITW city/country; Moral Machine
   country; Project Implicit "IP addresses are routinely recorded but are completely confidential"; Sea Hero Quest
   "no ... precise location").
4. Short: 5-15 min (LITW), about 5 min (Great Brain Experiment), 8-10 min (frameline), 2-5 min a day (Sea Hero
   Quest), median 18 min (Ouvrai, paid).
5. A practice trial that can be repeated (Ouvrai up to three; LITW "Practice again").
6. Repeat players handled explicitly: asked ("Have you taken this test before?", excluded; PSA "Prior
   participation" 2.52%), counted (Great Brain Experiment play counter), or analysed on first sessions only (Moral
   Machine "first completed (13-scenario) session").
7. Quality rules fixed in advance plus honest self-report: objective exclusions in the preregistration (Mottelson;
   PSA); "Did you cheat or in any way provide false information?" and "technical difficulties" asked before results
   (LITW); too-fast and same-answer filters, plausible head direction (Steed 2021); tracking screening (Mottelson).
8. The end shows the person something: results compared with others (LITW; Great Brain Experiment scores; Moral
   Machine summary) and/or a debrief of the condition they had (Steed's poster; LITW reveals "Our primary research
   interest" on the results page).
9. Open materials: Ouvrai code on GitHub; Moral Machine and PSA data and code on OSF; Project Implicit "data
   without directly identifying information is made publicly available".
10. Built with outside makers and funders: White Bat Games (Great Brain Experiment, Wellcome); Glitchers and Deutsche
   Telekom (Sea Hero Quest); NSF (LITW), NIH (TestMyBrain).

Where they differ:
- Pay: Prolific $5-6 with a 33% fee (Ouvrai) or $15 gift cards (Mottelson) - small, fast, screened samples; versus
  no pay and feedback about yourself (LITW about 1,000 a day; Moral Machine 40 million decisions) - huge,
  self-selected (Moral Machine survey takers 75% men). Headset owners: 34% would take part with no pay (Radiah).
- Platform: browser (LITW, Project Implicit, Moral Machine, Ouvrai via WebXR) vs native app through SideQuest or
  stores (Mottelson, Steed, Great Brain Experiment, Sea Hero Quest).
- Where consent sits: desktop browser before install (Mottelson); in-app short + online long (Steed); web
  checkbox that gates the Next button (LITW).
- Saying no: Steed lets non-consenters play with nothing recorded; LITW and Project Implicit stop at the gate.
- Withdrawal: Steed deletes on request by emailed anonymous device ID; Sea Hero Quest says anonymous data "cannot
  be withdrawn once submitted".
- Age: Project Implicit 18+ with a separate 14-17 youth site; Steed "over 18" confirm; PSA age of majority by
  region (Taiwan 20); LITW designs studies "appropriate for minors"; Sea Hero Quest states none.
- Following a person over time: LITW's IRB asked them "not track our participants in any way" (no longitudinal);
  Sea Hero Quest keeps "an anonymous linking ID" across days.
- Money from data: Sea Hero Quest now pairs a paid subscription with licensing the anonymous dataset to
  "pharmaceutical companies" and for training "large language models"; Project Implicit offers "consulting";
  the others publish data openly and sell nothing (on the pages read). The owner's "never sell data" rule matches
  the second group.
- Exclusion rates: 2.2% (LITW Exp 1) to 48.88% (PSA Gettier, mostly comprehension and missing age).

## Not reached / still open (updated in pass 4, 2026-10-10)
- Closed in pass 4: Ouvrai consent screen; LabintheWild donate page; Project Implicit founders, OSF archive and
  counts; Moral Machine ethics (MIT IRB); Sea Hero Quest data deal and VR version; Stanford VHIL (owner's copy);
  TestMyBrain ethics (2012 paper); PSA size; HSE centre groups; MSUPE studies; RUDN lab; QuickVR; Rivu 2022.
- Still open: TestMyBrain's current consent wording (not opened); Moral Machine PNAS 2020 SI (PMC bot check);
  EventLab and Steed-group home-VR studies 2023-2026 (none in two searches each); Institute of Psychology RAS
  (nothing in three searches); whether PSA membership costs anything (join page 404).

## Pages only a person can open
- Done: JCMC (owner's copy), vrmsu.ru and mgppu.ru/news/13972 (text sent by the owner), Nature Moral Machine (open
  copy found); mgppu.ru/news/11095 no longer needed (the same studies read on naked-science.ru).
