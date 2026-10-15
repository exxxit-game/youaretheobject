# Labs running experiments with people outside the lab, 2023-2026: exactly how each does it

Deeper pass after docs/research/own-experiments-now.md (not repeated here). Every claim: link + short quote
from the page read; "unverified" = snippet only or not seen. Fields per lab: who / what / platform /
recruit / pay or reward / consent+debrief flow / what is recorded, where stored / exclusion + quality /
N + drop-out / ethics body / publications / open code / outside partners.

Parts (each gets an answer or "not found"):
1. Ouvrai (Wolpert lab, Columbia)
2. Makransky / Mottelson (Copenhagen; unsupervised VR studies)
3. LabintheWild (Gajos, Harvard; Reinecke, U Washington)
4. Sea Hero Quest (Spiers UCL, Hornberger UEA)
5. Stanford Virtual Human Interaction Lab (Bailenson; large home-VR studies)
6. Mel Slater's EventLab (Barcelona)
7. Anthony Steed (UCL; VR "in the wild")
8. MIT Moral Machine
9. Project Implicit
10. UCL "Great Brain Experiment" app
11. Psychological Science Accelerator and Many Labs
12. Russia: HSE Centre for Cognition & Decision Making, MSU, Institute of Psychology RAS
13. Other active labs of this kind found on the way
14. Common practice to copy; where they differ

---

## Findings

### 2. Makransky / Mottelson (University of Copenhagen, Denmark) - read in full, objekt-papers/mottelson-2021.txt
- Mottelson, Petersen, Lilija & Makransky (2021), Front. Virtual Real. 2:681482 (numbers already in the earlier pass).
- Platform: native app, not browser: "developed in Unity 2020, deployed to Oculus Quest"; installed via SideQuest
  (their checklist step: "Submit APK to SideQuest, and await approval"). Backend: "A Python-based backend
  application running at Google App Engine stored user data and provided unique within-VR confirmation codes".
- Recruit: "The vast majority of participants came from Reddit" (r/OculusQuest, r/oculus, r/sidequest,
  r/virtualreality). Pay: $15 Amazon or Steam gift cards; both "not ideal" (Amazon one country only; Steam needs a
  username, no bulk); they advise a service for "world-wide vouchers in bulk".
- Consent flow: "We acquired informed consent in participants' desktop browser before they installed the
  experimental application" using the WHO consent template; they see no reason it could not be "prompted upon
  opening the application" (in-VR only).
- Quality rules they recommend: "prior objective procedures for excluding participants (e.g., duration, tracking
  quality, verifiable questions)" plus post-hoc cleaning, "prepared as part of the preregistration"; log how often
  the headset was taken off ("OVRManager.HMDUnmounted"); height calibration; hand-tracking screening phase.
- Ethics: "reviewed and approved by Department of Pscyhology [sic], University of Copenhagen" (department-level).

### 7. Anthony Steed (UCL, UK) - VR "in the wild", read in full, objekt-papers/steed-2016.txt (2016, the model flow)
- Steed, Friston, Lopez, Drummond, Pan & Swapp (2016), IEEE TVCG 22(4), doi:10.1109/TVCG.2016.2518135. App
  distributed to the public (Gear VR / Cardboard), consent and debrief INSIDE the app:
  - Consent item PQ0: "I confirm that I am over 18 years old and that I consent to take part in the study";
    those who say No answer only an avatar-setup question, "the answer is not recorded (the voiceover indicates
    this)" - the experience runs either way.
  - "Ethics information was available online prior to the experience"; shortened version in scene 2, read aloud
    by voiceover invitation.
  - Debrief: final scene had "a short debriefing statement and a poster indicating what the eight conditions
    were and which condition they had experienced", plus a link to a longer online statement; non-consenters saw
    the same debrief.
  - Recorded: questionnaire answers, device model, "Anonymous unique identifier from the device", head tracking
    "at 10Hz"; uploaded at scene ends "to a secure server at UCL". Withdrawal: participant emails the anonymous
    device ID to have data removed.
  - Ethics: "approved by the UCL Research Ethics Committee"; stress content ruled out ("virtual pit-style
    experience ... was ruled out") because of "a duty of care to participants and users".
  - Labelling: "it is an experiment, and needs to be labelled as such for ethical reasons" - which itself skews
    who joins (self-selection).
- 2023-2026 activity of Steed's group in home VR: see below (searched).

### 1. Ouvrai (Wolpert lab, Columbia University, USA) - full text read, saved objekt-papers/cesanek-2024.txt
- Cesanek, Shivkumar, Ingram & Wolpert (2024), Nat. Hum. Behav. 8:1209-1224, https://pmc.ncbi.nlm.nih.gov/articles/PMC11199109/
- Platform: browser WebXR + Three.js, data via the researcher's own Firebase; "Unlike other tools, Ouvrai remains
  free, with researchers managing their web hosting and cloud database via personal Firebase accounts". Open code:
  "The GitHub repository is at https://www.github.com/EvanCesanek" (analysis utilities included).
- Built-in parts of every study: "remotely obtaining informed consent and demographic information from
  participants, detecting and blocking users who should not attempt to complete the experiment"; a dev option
  allows "skipping the consent form" (so consent is a standard screen of the template).
- Recruit: Prolific. "VR headset ownership" screener gave "9,297 matching participants, approximately 8% of
  Prolific's pool" (early 2023); 10 participants per experiment "within 90 minutes of posting". Prolific fee "33%"
  on top of pay; they "recommend that researchers prioritize Prolific".
- Screening: "approval rate of at least 95%, age 18-65, fluent in English, normal or corrected-to-normal vision, VR
  headset ownership", no uncontrolled mental illness. Pay $5 (Exp 1-2), $6 (Exp 3).
- Practice: first trial always a guided "practice trial"; "Participants could complete up to three practice
  trials". Exclusion at trial level: "One trial from one participant was excluded because a valid reach angle
  could not be extracted" (no participant-level exclusions reported).
- Ethics: "protocols approved by the Columbia University Institutional Review Board"; Helsinki 1964.
- Consent screen in the code (github.com/EvanCesanek/ouvrai, lib/components/Consent.js): the lab's own form as a
  PDF (a JPG in VR) in a frame, one checkbox "I agree to take part in this study." that enables "Continue". The VR
  template's states run CONSENT, SIGNIN, WELCOME, CALIBRATE ... SURVEY, CODE; the last screen says "Thank you. Exit
  VR to find the submission link on the study web page." No debrief state in the template or the paper (none).
  Outside companies: none named beyond Prolific/MTurk/Firebase.

### 10. UCL "Great Brain Experiment" app (Dolan group, Wellcome Trust Centre for Neuroimaging, UCL, UK)
- Brown, Zeidman, Smittenaar, Adams, McNab, Rutledge & Dolan (2014), PLoS ONE 9(7):e100662, full text read and
  saved objekt-papers/brown-2014.txt. https://pmc.ncbi.nlm.nih.gov/articles/PMC4099129/ (2013-2014 project; no
  2023-2026 activity found for this app - it is the template, not a current lab).
- Who built it: "the games were built for smartphone by an external developer (White Bat Games)"; funded by "a
  Wellcome Trust Engaging Science: Brain Awareness Week Award"; iPhone and Android, March 2013.
- Flow: "On downloading the app, participants filled out a short demographic questionnaire and provided informed
  consent before proceeding to the games." Data sent at the end of each game if online; device gets a server UID;
  "No personal identification of users was possible at any time." A play counter tracked repeats.
- Reward: "participants could compare their scores against those of other users" and read "the background and
  significance of each psychological paradigm".
- Numbers: "44,373 users downloaded the app and 20,800 users ... played at least one game to completion" in the
  first month (about 47% of installs gave data); games about 5 minutes; adults analysed (16,233).
- Exclusion examples: working memory "Data was removed from 832 participants who failed two successive trials";
  attentional blink "Plays which were terminated early were removed". Repeats: users had started about 1.1-1.2
  games before the first submitted score.
- Ethics: "University College London research ethics committee, application number 4354/001".
- Design rule they draw: "a successful smartphone experiment will be short, fast-paced, easy at the beginning,
  and performing the experiment in line with the experimenter's objectives will be rewarded with a high points
  score" (and they warn tasks where points reward feigning, e.g. illusions, break this).

### 3. LabintheWild (Reinecke, now U Washington; Gajos, Harvard; USA)
- Reinecke & Gajos (2015), CSCW '15 pp. 1364-1378, doi:10.1145/2675133.2675246, PDF read pages 1-6 and 8-10:
  https://www.eecs.harvard.edu/~kgajos/papers/2015/reinecke15labinthewild.pdf (PDF only, no text saved)
- Scale: July 2012-April 2014 "visited 2,072,384 times"; "744,739 experimental sessions"; "about 1,000
  participants/day"; visitors from "219 countries"; mean age 29 (range 5-99); about 49% female; 66% outside US.
- No pay, no sign-up: "LabintheWild should work without providing financial compensation"; instead "a
  personalized results page, which explains how they did and how their performance or preferences compare to
  others"; each test sold by a slogan ("Can we guess your age?", "Are you more Eastern or Western?").
- IRB shaped the design: no sign-up "was further reinforced by a request from our Institutional Review Boards
  that we do not track our participants in any way"; so repeats are caught by asking: "the first question we ask
  in all our questionnaires is whether a participant has taken the test before"; those who say yes "are
  typically excluded from the analysis".
- Flow (Exp 2): "The first three screens of the study presented participants with the basic information about the
  study, the informed consent form, and a short demographic questionnaire, which also asked whether participants
  had taken the study before. All questions were optional." Then practice block with feedback, main blocks with
  breaks, then the results page.
- Honesty about the real aim: for the dull Fitts' task they added an age guess, but "Our primary research interest
  was clearly revealed in the informed consent form and again on the personalized results page".
- Length: "we design our experiments to take 5-15 minutes". Studies for everyone: "carefully design studies to be
  appropriate for minors and other vulnerable populations".
- Deception avoided: studies requiring it "could impact the results in the longer term, because the debriefing
  content at the end of the study might be shared with others". Answer keys: only "a summary", full key by email
  on request (to keep the test valid).
- Quality: end-of-study "easy and non-judgmental mechanisms for reporting situations that might have compromised
  the data quality ... whether they cheated in any way". Exclusions: Exp 1 removed 166 (stimulus not shown for
  500 ms) + 75 (technical problems or cheating) = 2.2%; Exp 2 removed 7.6% (self-reported problems/cheating),
  8.4% below 94% accuracy, and blocks with an RT outlier above "median + 3xIQR" (15.2% of blocks). Lab-quality
  result: "unsupervised LabintheWild participants are attending to the task at least as well as in-lab
  participants".
- Recruitment: social sharing buttons on first and last page; "Below their personalized results, we suggest two
  other LabintheWild experiments"; adding "tell ... especially people over 50" raised the average age; 88.4% of
  visitors new.
- Who now (about page read in the browser, https://www.labinthewild.org/about): Katharina Reinecke "Co-Founder &
  Lead Researcher", "Professor of Computer Science at the University of Washington"; Gajos "Co-Founder & Friend
  of LabintheWild" (Harvard SEAS); a lead technologist and a "Science Communicator". Donate page (read in the
  browser, https://www.labinthewild.org/donate): "a tax-deductible donation to the University of Washington's
  LabintheWild fund", an "unrestricted gift", once or monthly, paid through UW's site. Live studies 2026 include frameline (Eastern/Western perception),
  ai-values, socialmedia-ads, privacy expectations, peripheral vision.
- LIVE FLOW WALKED (2026-10-10), study "Is your perception more Eastern or Western?"
  (https://studies.labinthewild.org/frameline/?REF=home). Landing: "This study takes 8-10 minutes" + "Begin
  Study". The slide order in its code: INTRODUCTION -> INFORMED CONSENT -> DEMOGRAPHICS -> random order of two
  tasks (instructions, practice, task) -> comments -> results. Consent text read from the study's own English
  locale file (https://studies.labinthewild.org/frameline/i18n/en.json), four questions and one checkbox:
  - "What is this study all about?" (purpose, "supported by the National Science Foundation", "around 10 minutes")
  - "What data are we going to collect?": "We will not collect your name and contact information. However, we will
    collect the city and country you are located in, what browser you are using, your answers to our questions,
    and data about how you use our website. We will securely store this data."
  - "Do I have to be in this study?": "No, being in this study is up to you. You can leave now or at any time later."
  - Contact: the PI's name and address, and for an independent party "the University of Washington Human
    Subjects Division" (email and phone).
  - Checkbox "I agree to participate in this research." The Next button appears only when ticked ("You must check
    the box to continue.").
  - Demographics include "Have you taken this test before?" (shared template,
    https://studies.labinthewild.org/templates/i18n/lang-en.json).
  - Before results: "Did you encounter any technical difficulties during this study?" and "Did you cheat or in any
    way provide false information?" (+ free comments), then results and "Share this study with your friends!".
  - Practice with a redo: "Too high of an error! Maybe you should try again." / "Practice again".
  - City/country come from a geo-IP service of their own (api.labinthewild.org/service/geoip in litw.data.js).


(continued in field-labs-2.md: parts 4, 5, 6, 7 cont., 8, 9, 11, 12, 13, 14)
