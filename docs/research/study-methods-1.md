# How a lab runs a study, applied to one game room: the field's method, step by step

Builds on docs/research/own-experiments-now.md and docs/research/vr/06-science.md (not repeated here: APA 8.02/8.07/8.08
basics, BPS IMR, Orne 1962, Blackhart 2012, Mottelson 2017/2021, Steed 2016, SSQ/IPQ basics, Greenspan & Loftus 2022).
Every claim: link + short quote from the page read. "Unverified" = seen only in a snippet or not opened.

Parts (each gets an answer or "not found"):
1. Players take a game less seriously than a lab: 1a seriousness checks (Aust et al. 2013); 1b commitment requests
   and honesty pledges; 1c "please take part seriously" instructions; 1d instructional manipulation / attention checks
   (Oppenheimer et al. 2009) and their critics; 1e gamified vs plain experiments: data quality; 1f unpaid volunteers'
   motivation (LabintheWild); 1g what a game can say at the start; fun vs rigour.
2. Data quality outside the lab: 2a careless responding and its indices; 2b bots and AI agents (Westwood 2025);
   2c repeat and non-naive participants (Chandler et al. 2015); 2d exclusion rules fixed in advance; 2e over-recruitment.
3. Study plan: 3a preregistration (AsPredicted questions, OSF templates); 3b registered reports; 3c sample size and
   power; 3d randomisation, counterbalancing, within vs between; 3e judging a replication (Many Labs, small telescopes).
4. Deception and debriefing: 4a APA 8.02, 8.07, 8.08 exact text; 4b BPS code; 4c funnel debriefing and suspicion
   probes; 4d automated debriefing.
5. VR practice: 5a reporting guidelines for VR studies; 5b simulator sickness (SSQ) and presence questionnaires;
   5c hardware and frame-rate differences; 5d tracking loss and play area; 5e what to log.
6. Checklist: how a lab runs a study, applied to a game room (each step with its source).
Parts 3, 4 and 6 are in study-methods-2.md; part 5 in study-methods-3.md.

---

## Findings

### 1a. Seriousness check (Aust, Diedenhofen, Ullrich & Musch 2013) -- full text read, saved objekt-papers/aust-2013.txt

- Behavior Research Methods 45, 527-535, doi:10.3758/s13428-012-0265-2.
  https://link.springer.com/article/10.3758/s13428-012-0265-2
- Why: "Nonserious answering behavior increases noise and reduces experimental power".
- Sample: 3,786 recruited by Google AdWords, 3,490 analysed, unpaid ("were not incentivized").
- Wording (asked once, on its own page, AT THE END): "It would be very helpful if you could tell us at this point
  whether you have taken part seriously, so that we can use your answers for our scientific analysis, or whether
  you were just clicking through to take a look at the survey?" Two answers: "I have taken part seriously" /
  "I have just clicked through, please throw my data away."
- Result: 112 of 3,490 (3.2%) said nonserious. Vote 2005 vs intention 2009 agreed 66.7% (serious) vs 51.5%
  (nonserious). Even after IP, speed and consistency filters together: 66.9% vs 44.1%.
- Other filters did less: the fastest 10% gave "only a marginal effect on data validity"; shared IPs were not worse.
- Rates in earlier studies: "from 5 % - 6 % (Musch & Klauer, 2002) to 30 % - 50 % Reips (2009)".
- Timing: end of study chosen because only then can it "reflect a potential change of mind"; Reips argues asking
  early raises motivation and lowers drop-out, but early asking "may signal that nonserious responses are being
  expected" (open question in the paper).
- Fix exclusions in advance: researchers must "decide a priori on their exclusion criteria and, subsequently,
  adhere to these decisions".
- Paid samples hide nonseriousness: paid people "will probably be reluctant to admit nonserious responding"; the
  check works best unpaid, i.e. our case.
- For a game room: one end-of-room question, two plain answers, the "throw my data away" answer drops the run from
  science data with no penalty in the game.

### 1d. Instructional manipulation check (Oppenheimer, Meyvis & Davidenko 2009) -- full text read, saved objekt-papers/oppenheimer-2009.txt

- J. Experimental Social Psychology 45, 867-872, doi:10.1016/j.jesp.2009.03.009. PDF read:
  https://bpb-us-e1.wpmucdn.com/sites.ucsc.edu/dist/6/210/files/2015/06/Oppenheimer_2009_Journal-of-Experimental-Social-Psychology.pdf
- What it is: a question that looks like the others but asks participants "to ignore the standard response format
  and instead provide a confirmation that they have read the instruction".
- Failure rates: paper pilot 28.7% (unmotivated) vs 17.5% (motivated) vs 14.0% (supervised); Study 1 (n = 213,
  paid or course credit): "Overall, 46% of the sample failed the IMC"; Study 2 (n = 144): "50 of the 144
  participants (35%) failed"; the short blue-dot version: "approximately 7% fail" (n > 1,000).
- Effect: in the soda-price task the effect was absent in the full sample and appeared only among passers
  (store $2.05 vs resort $3.04); failers spent less time (153 s vs 191 s).
- Self-report did not detect it: failers "reported statistically the same level of motivation" (5.5 vs 5.6 of 9).
- The better use: not exclusion but forcing a re-read. In Study 2 failers could not go on until they passed (35 on the
  2nd try, 9 on the 3rd, 5 on the 4th, 1 on the 5th); afterwards they "became indistinguishable from those who
  initially passed". Authors: "We recommend using IMCs early in a study to convert satisficing participants into
  diligent participants", which keeps the sample whole.
- Caveats in the paper itself: exclusion can harm external validity ("could lead to issues regarding
  generalizability"); "participant backlash" (diligent people "may feel insulted"); an IMC may suggest "a norm of
  non-diligence". No backlash seen in their studies.
- For a game room: the VR analogue is a short, playable instruction check before the critical task (do the
  practice action correctly before going on), not a trick question; this is the "force re-read" variant.

### 1b/1c. Warnings, "take this seriously" statements and typed commitments (Bruhlmann et al. 2024) -- full text read, saved objekt-papers/bruhlmann-2024.txt

- Bruhlmann, Memeti, Aeschbach, Perrig & Opwis (2024), Behavior Research Methods 56, doi:10.3758/s13428-023-02321-z,
  preregistered RCT, 812 MTurk workers. https://pmc.ncbi.nlm.nih.gov/articles/PMC11335820/
- Prevalence they cite: "estimates ranging from 3% to almost 50% of participants in online surveys being inattentive".
- Result: "presenting a warning statement is not effective in reducing carelessness. However, requiring
  participants to actively type the warning statement statistically significantly reduced carelessness" -- but the
  typed version "led to statistically significantly more attrition" (careless people may simply leave).
- Self-reported diligence higher with the typed warning, but small: "d = 0.18"; no change in page time.
- 37.1% to 48% missed at least one of six attention items in every condition (paid, experienced MTurk sample).
- Prior evidence they summarise (secondary; originals checked on OpenAlex 10.10.2026: Berinsky 2016, Huang 2012 and
  Meade & Craig 2012 closed access; Ward & Meade 2023, Annu. Rev. Psychol., open but behind a bot check: owner;
  Curran 2016 has an open copy, https://osf.io/6dkhm, not read): Berinsky et al. 2016, a warning raised pass rates "by
  eight percentage points"; Huang et al. 2012 warnings "reduce the severity"; Meade & Craig 2012 warnings gave "no
  benefit" and "decreased respondent self-reported attitude toward the study"; Ward & Meade 2023 review: positive
  approaches (rewards for care) "have been less effective than warnings" (as summarised by Bruhlmann et al.).
- Measures of carelessness they used (field standard): instructed-response items, infrequency items, nine
  self-report diligence items (Meade & Craig 2012, e.g. "I carefully read every survey item"), response time,
  longstring, Mahalanobis distance, even-odd consistency, psychometric synonyms/antonyms, response variability.
- For a game: warnings with penalties do not fit a free game and did not work when passive; an active, typed (in VR:
  performed) commitment works but loses people. Not tested on unpaid players: all these samples were paid.

### 1b. Commitment request instead of attention checks (Geisen 2022, Qualtrics; industry test, not peer-reviewed)

- https://www.qualtrics.com/articles/strategy-research/attention-checks-and-data-quality/ (Emily Geisen, 4 Aug 2022).
- About 4,000 respondents, 5 online panels, 5 random groups (commitment 776; factual check 803; textual check 780;
  speed check 798; control 799). Full screen (read from the article's screenshot, Picture-1_0.png): "We care about
  the quality of our survey data. For us to get the most accurate measures of your opinions, it is important that
  you provide thoughtful answers to each question in this survey." / "Do you commit to providing thoughtful answers
  to the questions in this survey?" [I can't promise either way] [Yes, I will] [No, I will not]; pass = "Yes, I will".
- Share with 2+ of 11 quality problems among those who passed: commitment 4.6%, factual 6.7%, textual 7.5%,
  speed 9.7%, control 11.0% (commitment, factual, textual significant vs control).
- 5.2% did not commit (highest "failure" of all arms).
- Warning in the same article: "Too many attention checks can cause break offs or frustrate respondents".
- Older roots (Cannell, Michigan, 1970s-80s interviewer studies; Vannette, 14-country web test): named only in
  search results; the article itself cites neither (re-read): unverified, not needed for the tested numbers above.
- For a game room: a one-tap "I'll do this one for real" before the critical task is the cheapest tested lever; a
  "just looking" answer routes the run out of science data, not out of the game.

### 1b. Honesty pledges ("sign first"): the landmark result is retracted and did not replicate

- Shu, Mazar, Gino, Ariely & Bazerman (2012), PNAS 109:15197-15200, "Signing at the beginning makes ethics salient
  and decreases dishonest self-reports in comparison to signing at the end": Europe PMC lists it as "Retracted
  Publication" (PMC3458378). https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1073/pnas.1209746109&format=json&resultType=core
- Kristal, Whillans, Bazerman, Gino, Shu, Mazar & Ariely (2020), PNAS 117(13):7103-7107 (PMC7132248): "Across five
  conceptual replications (n = 4,559) and one highly powered, preregistered, direct replication (n = 1,235) ... we
  observed no effect of signing first on honest reporting."
  https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1073/pnas.1911695117&format=json&resultType=core
- Why retracted (notice read, PNAS 13 Sep 2021, doi:10.1073/pnas.2115397118, https://pmc.ncbi.nlm.nih.gov/articles/PMC8463784/):
  "The editors are retracting this article and note that Simonsohn, Simmons, and Nelson" "have provided evidence to
  question the validity of the data", citing datacolada.org/98. CORRECTED: the notice does not say "fabricated".
- For a game room: do not build an "honesty pledge" on that evidence; a commitment request (1b above) and the
  seriousness check (1a) are the tested tools.

### 1f. Unpaid volunteers: LabintheWild's model (Reinecke & Gajos 2015) -- full text read, saved objekt-papers/reinecke-2015.txt

- CSCW '15, pp. 1364-1378. PDF: https://iis.seas.harvard.edu/papers/reinecke15labinthewild.pdf
- Scale: "visited more than 2 million times, and nearly 750,000 visitors completed an experiment"; "88.4% of its
  visitors are new to the site"; experiments "5-15 minutes long".
- Reward instead of pay: "a personalized results page, which explains how they did and how their performance or
  preferences compare to others"; each study has a slogan ("Can we guess your age?"). A boring task can be framed by
  a more interesting by-product, but the real aim stays honest: "Our primary research interest was clearly revealed
  in the informed consent form and again on the personalized results page."
- Why people came (tweets and comments): "(1) an urge to compare themselves to others, (2) a general curiosity
  about themselves, (3) a fascination with the idea that their own characteristics could be predicted, and (4) the
  desire for improving particular skills".
- Honesty tools: demographics optional ("To ensure honest answers"); at the end "easy and non-judgmental mechanisms"
  asking about "technical difficulties or distractions and whether they cheated in any way"; open comment box used
  by "About 5%"; self-reported problems/cheating excluded 2.2% (aesthetics, n = 10,976) and 7.6% (memory, 1,319).
- Data quality: "data obtained in online studies with uncompensated study participants can be as reliable as data
  collected in lab"; but "we currently do not know how many participants ... cheat without revealing it later".
- Repeat takers: they ask whether people took the test before; in the memory task "no significant main effect of
  prior exposure" (F(1,9667) = 0.01). (Task-specific: a performance task, not a deception study.)
- For a game room: the reveal ("how you compare to other players") is the field's tested replacement for pay; end
  each room with a no-blame "anything get in the way? did you peek or try a trick?" question and an optional comment.

### 1e. Gamified vs plain tasks: data quality (Lumsden et al. 2016) -- full text read, saved objekt-papers/lumsden-2016.txt

- Lumsden, Skinner, Woods, Lawrence & Munafo (2016), PeerJ 4:e2184, doi:10.7717/peerj.2184. Go/No-Go task in three
  versions (plain, points, cowboy theme), lab (n = 84) and MTurk (n = 203). https://pmc.ncbi.nlm.nih.gov/articles/PMC4941792/
- Points: "did not disrupt the validity of the data collected but increased participant enjoyment".
- No gain in data: "no evidence that gamelike features could increase engagement to the point where participant
  performance improved".
- Theme hurt: the cowboy theme was enjoyed, but harder-to-read game stimuli raised "No-Go error rates by 28%".
  Authors: "our results highlight the need to limit the impact of these features".
- Plain task rated "far more boring, far less enjoyable" than either game version.
- Online vs lab: "slightly longer reaction times but were otherwise very similar".
- Hawkins, Rae, Nesbitt & Brown (2013), "Gamelike features might not improve data", Behavior Research Methods 45,
  301-318 (READ, https://link.springer.com/article/10.3758/s13428-012-0264-3, objekt-papers/hawkins-2013.txt):
  students for credit (200 online; 127, 31 lab + 96 online); "Response latency, accuracy, and overall task
  performance were unchanged by gamelike features in both experiments"; the game version "provided a more positive
  and enjoyable experience", which "did not translate into data effects".
- For a game room: fun is fine as long as the scene does not change what is measured (the stimulus the paper used
  must stay as readable and as timed as in the paper); keep decoration out of the critical stimulus, keep points/
  feedback away from the measured response until after it is recorded.

### 2b. Bots and AI agents (Westwood 2025) -- full text read, saved objekt-papers/westwood-2025.txt

- Westwood, S. J. (2025), "The potential existential threat of large language models to online survey research",
  PNAS 122(47), doi:10.1073/pnas.2518075122. Full text: https://pmc.ncbi.nlm.nih.gov/articles/PMC12663962/
- Agent passed checks: "achieving a 99.8% pass rate on 6,000 trials of standard attention checks"; it simulates
  reading time, "human-like mouse movements", typing with typos; it got past a page with a "protected by reCAPTCHA"
  badge.
- It guesses hypotheses: "correctly inferred the directional hypothesis ... in over 84%" and shifted the effect
  toward it (a machine form of demand effects).
- Cost: "approximately $0.05" per survey. Polls: "between just 10 and 52" fake respondents could have flipped which
  2024 candidate led.
- Recommendations: question-based or behaviour-based countermeasures are "fighting a losing battle"; harder trick
  tasks risk "filtering out human respondents"; treat "low-barrier convenience samples" with skepticism; options
  (identity validation, locked-down software) each have "significant trade-offs".
- Scope: web surveys (Qualtrics pages). Not tested: an immersive WebXR task with tracked head and hands. That such a
  run is harder to fake is our inference; no source tested it. Practical reading for us: no pay = no profit motive (his main
  threat model is "financially motivated fraud"); log per-frame head/hand pose so a run can be checked for physical
  plausibility; still treat it as a convenience sample.

### 2c. Repeat and non-naive participants (Chandler, Paolacci, Peer, Mueller & Ratliff 2015) -- local full text (objekt-papers/chandler-2015.txt)

- Psychological Science 26(7), 1131-1139, doi:10.1177/0956797615585115 (in-press text). Same 12 Many Labs tasks taken
  twice on MTurk (687 people both waves; days, a week or a month apart).
- "Effect sizes decreased by about 25%, when they were replicated on the same sample"; "most pronounced when
  participants were assigned to a different condition in the second wave", but also seen in the same condition.
- Asking does not fix it: memory of the earlier task ranged "between 35% and 80%", and "self-reported memory for
  prior participation is at best a poor indicator" of who shows the attenuated effect. They used a never-run decoy
  task (sorting "dinosaur fossils") to check yes-saying: near zero.
- Power cost example: a 25% drop in a quarter of the sample takes d = .43 to .40; an 80%-power two-group study then
  needs N = 200 instead of 172 (+15%).
- For a game (players replay rooms, "Revolver" model): the science datum is the FIRST run per device/player only,
  decided in the code (stored run counter), not by asking; replays are logged but analysed separately; never put a
  replayer in the other condition and count it.

### 2a/2d/2e. Careless responding, exclusions fixed in advance, over-recruitment (from the sources above)

- Indices the field uses (Bruhlmann et al. 2024, after Curran 2016 and Meade & Craig 2012): instructed-response and
  infrequency items, self-reported diligence, response time, longstring, Mahalanobis distance, even-odd consistency,
  psychometric synonyms/antonyms, response variability. Most are for long questionnaires; a 5-10 min VR room has
  few items, so the usable ones are: time on task, a playable instruction check, the seriousness question, the
  no-blame "anything get in the way / did you try a trick" question, and tracking/visibility flags (5c).
- Rates to expect: self-declared nonserious 3.2% (Aust 2013, unpaid, high-interest topic) to "30 % - 50 %" (Reips
  2009 as cited there); IMC failures 7% to 46% (Oppenheimer 2009); self-reported problems/cheating 2.2-7.6%
  (LabintheWild); inattentive online VR about 13% vs 3% lab and "approximate 10% ill-intended" (Mottelson 2021, in
  06-science.md); in-the-wild VR yield about 15% of installs (Steed 2016, in 06-science.md).
- Fixed in advance: Aust 2013: "decide a priori on their exclusion criteria and, subsequently, adhere to these
  decisions"; AsPredicted Q6 asks for the "precise rule(s) for excluding observations" (study-methods-2.md, 3a).
- Over-recruit: Mottelson 2021: "over-recruitment is necessary because of the number of aberrant responses";
  Chandler 2015: +15% N just for a quarter of non-naive people. Working rule from these numbers (our arithmetic, not a
  published rule): target N after exclusions / (1 - expected exclusion rate); with 15-25% exclusions, recruit
  1.2-1.35 x the target, counting first runs only.

### 1g. What a game can say at the start, and fun vs rigour (synthesis of 1a-1f; our reading where marked)

- What the evidence supports:
  - Ask for commitment, do not threaten: a one-tap commitment cut quality problems from 11.0% to 4.6% (Geisen 2022,
    industry); passive warnings did nothing and penalty warnings do not fit a free game (Bruhlmann 2024); "sign first"
    pledges did not replicate (Kristal 2020).
  - Make the instruction check playable and repeatable, not a trap: forcing a re-read made failers "indistinguishable"
    (Oppenheimer 2009); traps may insult ("participant backlash"). A trap BEFORE the task changes the task (Hauser &
    Schwarz 2015, SAGE Open, full text from the owner, objekt-papers/hauser-2015.txt; 380 MTurk workers, 92% passed):
    after the check correct CRT answers rose from 1.33 to 1.76 (d = .38) and intuitive ones fell (d = .31); "IMCs could
    eliminate effects one might otherwise observe or create effects", most where intuition and reflection disagree.
    So no trap question before a room's measured moment: the classic rooms measure intuitive errors.
  - Ask seriousness at the END, with a no-cost "throw my data away" answer (Aust 2013); unpaid people admit it.
  - Offer a no-blame end question on distractions, tech trouble and "did you cheat" plus a comment box (LabintheWild).
  - Pay in self-knowledge: the reveal comparing the player with others is LabintheWild's tested reward; it also
    gives a reason to play seriously (a result only means something if you played it straight: our reading).
  - Keep the measured moment plain: game styling did not improve data and a theme that made stimuli harder raised
    errors by 28% (Lumsden 2016).
- Possible opening wording, taken from the tested items (our adaptation, to be translated in texts.ru.js): "This
  room is a real experiment. Your result only means something if you play it for real. Will you?" [I will] [Just
  looking]. "Just looking" plays the same room; the run is marked non-science. At the end: "Did you play that one
  for real, so we can count it? [Yes, count it] [No, I was just clicking around - don't count it]" (Aust wording
  shape) and "Did anything get in the way, or did you try a trick? (it is fine, it helps us)" (LabintheWild shape).
- Do not tell the hypothesis at the start (APA 8.07, BPS: withholding is allowed if the reveal explains it).

