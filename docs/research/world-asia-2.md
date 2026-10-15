# World research: Asia, part 2 (continues world-asia.md)

Same rules: every claim has its link and a short quote; non-English quotes marked "(our translation)"; English only.

### 3-JP. Japan: how many home participants skip instructions, and what predicts it (satisficing)

- Miura (Kwansei Gakuin University) & Kobayashi (National Institute of Informatics) (2015), Japanese Journal of
  Social Psychology 31(1), 1-12, "An experimental study of satisficing among online survey monitors". Full text
  read (HTML): https://www.jstage.jst.go.jp/article/jssp/31/1/31_892/_html/-char/ja
  - Two commercial panels (company A, company B); 2,872 completed main surveys (A 1,297, B 1,575).
  - Instruction check (IMC, three items preceded by an instruction NOT to answer them): violated by 51.2% (A) and
    83.8% (B), above the original US student rates of 46% and 35%.
  - Inside the scale (two "pick the leftmost/rightmost option" items): 13.3% failed overall (383 of 2,872); 2.9%
    among those who had passed the IMC vs 17.8% among IMC violators.
  - Speed: satisficers were faster in every condition, e.g. 10-item version 130.0 s vs 226.2 s.
  - Longer questionnaire (50 vs 10 items) raised satisficing by about 4-6 points in panel A.
  - Reward: panel A used lottery rewards, panel B paid everyone; authors suggest the reward structure may explain
    the gap (untested).
  - Advice: a strong pre-screen item (IMC) leaves less satisficing later; exclude violators in studies that
    manipulate instructions; but excluding them may cut external validity, since careless respondents "may be the
    majority" (paraphrase).
  - For us: skipping INSTRUCTIONS is the main failure at home (half to four-fifths of panel members), skipping
    ITEMS much rarer. In a room, the instruction is the host's voice: we need a check that the player heard and did
    the instruction, not only a check of answers. Time on the instruction screen is a usable signal.
- Miura, Kobayashi et al. (2018), Behaviormetrika (Kodo Keiryogaku) 45(1), 1-11, "Effects of satisficing on
  response behaviour in online surveys". Full text read (PDF pages as images; text extraction failed on the
  Japanese fonts, so no .txt saved): https://www.jstage.jst.go.jp/article/jbhmk/45/1/45_1/_article/-char/ja
  - Three samples: A = survey-company panel (points per question), B = crowdsourcing (Qualtrics survey on the
    company's task page, "60 yen" reward), C = university students (lottery: 10% got a 500-yen card).
  - Table 1, instruction check (IMC) first-time pass: A 38.1%, B 76.4%, C 84.0%; corrected after a warning:
    26.2 / 16.6 / 11.7%; still violating: 35.8 / 7.1 / 4.3%. N = 6,547 / 1,261 / 162. Scale check (DQS) violation:
    13.7 / 4.7 / 0.7%.
  - The warning: a respondent who failed was shown the same item again with the instruction in red; a respondent
    who failed again was told so and urged to read carefully from then on (our paraphrase). Abstract: the effect of
    not reading instructions "can be reduced by raising respondents' awareness".
  - Earlier work they cite (Miura & Kobayashi 2016): those who corrected after the warning "came close to those
    who complied from the start" (our translation).
  - Devices (Table 2): in the crowd sample, IMC pass 79.0% on PC vs 73.1% on mobile; crowd plus mobile scored lowest
    on the logic task even among compliers.
  - Why the crowd beats the panel (authors' reading): on crowdsourcing "the requester's rating of each task links
    directly to payment, and the task completion rate can be looked up" (a reputation system), while panel points
    give little reason to protect one's record (our translation). Debriefing: "no particular debriefing was done"
    (our translation) for this non-deceptive survey.
  - Careless answers broke scales: among violators, reverse-keyed items did not load as expected (Big Five
    item pairs near zero or positive instead of negative).
  - For us: (1) a one-time, gentle "you missed this, please read" brings most careless people back, and their data
    then look like careful people's: a host's line after a missed instruction is supported by evidence;
    (2) motivation from reputation matters more than money; a player's own result screen (self-knowledge) is our
    nearest equivalent (inference).
- Miura & Kobayashi (2016), Frontiers in Psychology 7:1563, "Survey Satisficing Inflates Stereotypical Responses in
  Online Experiment: The Case of Immigration Study". Full text read:
  https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01563/full
  - Panel: Nikkei Research; Study 1: 40,900 invited, 4,651 analysed; Study 2: 1,309 analysed; "lottery-based
    remuneration"; ethics: Kwansei Gakuin University behavioural IRB, approval 2014-39.
  - Repeated check: failers were sent back to the same item with the instruction "highlighted in red"; at most
    twice. Study 1: 57.7% passed first time, 32.3% passed the second time ("converts"), 10.0% failed both;
    Study 2: 55.9 / 33.6 / 10.6%.
  - Converts behaved like compliers: in Study 2 their "response pattern was not significantly distinguishable from
    compliers'" (summary of the page); satisficers' answers moved the experimental effect (stereotype ratings) in
    some conditions.
  - Recommendation: "Using a repeated IMC is useful to minimize the number of satisficers in a subsequent
    experiment."
  - For us: one in three home participants misses the first instruction, but a single red repeat recovers almost
    all of them; only about 1 in 10 stays careless. Exact match for a host who repeats a missed instruction once.

### 1-CN. China: NaoDao (Brain Island), the academic online-experiment platform

- NaoDao researcher platform, home page read: https://service.naodao.com/ — "providing researchers with a one-stop
  service that integrates online experiments and questionnaire production"; "Personalized subject fee setting";
  quality tools "Duplicate answers and IP restrictions", OS and browser screening, "Human-machine anti-cheating".
  Pool size: the counters on the page were empty placeholders (not found). Ethics or consent rules: not on the page.
- A Zhihu tutorial (search listing only, unverified: https://zhuanlan.zhihu.com/p/484741155) says every project
  published to the NaoDao participant pool must pay a participant fee; unpaid projects can run only by an anonymous
  link the researcher shares.
- Runs PsychoPy and jsPsych tasks (search listing of NaoDao help pages, unverified).

### 1-JP / 5-JP. Japan: experiments at scale outside the lab

- Goto Akira (Tama University; now Meiji University), foundation report "Developing an online game-experiment
  environment" (oTree on Amazon EC2, recruited on Yahoo! Crowdsourcing). Read in full (pages 1-4 as images):
  https://www.taf.or.jp/files/items/1558/File/%E5%BE%8C%E8%97%A4%E6%99%B6.pdf
  - Study 1 (repeated public-goods game, groups of 3): "855 joined ... 790 reached the final survey; completion
    rate 92.4%" (our translation); run 6-7 June 2018 in 3 waves.
  - Pay: a base reward through a code typed into Yahoo! Crowdsourcing plus a result-based bonus, total about
    65,000 yen, "about 75 yen per person"; other tasks there pay "about 5-20 yen", and higher pay "could break the
    crowdsourcing market" (our translation).
  - Study 2: over 1,100 participants, "about 20% dropped out", still nearly 900 completed (our translation).
  - Earlier runs: completion 75.6% for one-player tasks, 34.4% for two-player interactive, 26% for three-player.
    Fix: groups formed from whoever reaches the experiment screen first, not pre-assigned links.
  - Compare the lab route: the largest Japanese lab economic-game study (Yamagishi et al. 2017) mailed about
    180,000 flyers to homes in 2012-2016 to get 1,670 volunteers and 600 participants (as cited in the report).
  - For us: one-player tasks keep people; anything that needs a partner loses most of them. Our rooms are one
    player, the good case.
- Nakamura, Takao, Fukushima & Arakawa (2025), Kyushu University, Proc. ACM IMWUT, DOI 10.1145/3712281,
  "Ethical Disengagement in Mobile Games: The Effects of Loading Delay and Grayscale on User Engagement". Press
  release read: https://www.kyushu-u.ac.jp/ja/researches/view/1368/
  - A randomised experiment inside a shipped commercial game ("Flying Gorilla"): "84,325 players"; "a large-scale
    one-month experiment in which screen display and waiting time were randomly changed"; grayscale plus a 10-second
    wait cut "play time by up to 30.8% and retention by 40.4%" (our translation).
  - Consent and ethics review: not mentioned in the release (not found); paper not read.
  - For us: a university and a game studio ran a between-subjects experiment on 84,000 players without a lab; the
    paper's consent route is the open question (owner: the ACM paper may be paywalled).

### 3-KR. Korea: a mirror on the screen makes home respondents more careful

- Kim Wooyoung (Sogang), Lee Taeheon (Chung-Ang) & Jang Jaeyoon (Sogang) (2019), Korean Journal of Psychology:
  General 38(4), 669-698, "Preventing careless responding in online surveys with a mirror image". Full text read:
  https://accesson.kr/kpageneral/assets/pdf/16081/journal-38-4-669.pdf (saved: objekt-papers/kim-2019.txt)
  - 308 university students from "the panel of a domestic online survey company" (our translation), randomly
    assigned: control 100, mirror 101, warning 107.
  - Mirror condition: normal instructions, but a mirror image lay "like a watermark" behind the questionnaire the
    whole time (objective self-awareness theory). Warning condition: careless answers "are checked afterwards and
    excluded" (our translation).
  - Result: of 10 careless-responding indices, 3 (psychometric antonyms, time, bogus items) dropped in the mirror
    condition vs control; the share of extreme careless respondents (top 10% per index) was lowest with the mirror
    and highest in control (our translation of the results).
  - Players hardly saw it: of a further 118 students in the mirror condition "about 76% said there was nothing on
    the screen, and only 17% noticed the mirror" (our translation).
  - Authors' case for it: warnings can annoy respondents and lower the motivation of those who meant to be careful;
    the mirror needs no warning and costs almost nothing, compared with a video of the researcher reading the
    instructions or an inserted virtual human (both earlier US methods they cite).
  - Ethics approval: not found in the text.
  - For us: a self-awareness cue that players barely notice lowered carelessness at home. A VR room can carry a
    mirror, or the player's own reflection, at no cost; a warning by the host may cost goodwill. (Untested in VR.)

### 5-JP. Japan: the science-branded game that reached tens of millions (Brain Age), and how small its science was

- Famitsu (May 2025) anniversary article, read: https://www.famitsu.com/article/202505/42074 — released 19 May 2005;
  "sold 19,010,000 units worldwide"; with the sequel "33.89 million units" (our translation); sales "gradually grew
  through word of mouth and TV coverage"; many "gave it to their grandparents along with the console" (our
  translation); "supervised by Professor Ryuta Kawashima" (Tohoku University).
- Nintendo's page for the Switch edition, read: https://www.nintendo.com/jp/switch/as3ma/about/index.html —
  Kawashima: his lab tested the DS game on "96 people (48 of them as the control group)" with "a tendency for
  working memory and processing speed scores to go up"; the "brain age" norm was fitted from "a total of 149
  people", about twenty per decade from the 20s to the 70s (our translation).
- For us: the largest science-branded game in Asia reached people through a named scientist, a short daily task,
  a single number about yourself ("brain age"), TV and word of mouth, and gifting to older relatives; it did not
  collect research data from players, and its norm rests on 149 people. A result screen with one personal number is
  what spread (inference from the article).

### 5-CN. China: a game-based cognitive test inside WeChat that reached millions

- Li Y, Cui L, Wu J, Xia H, Chen N (2023), Chinese Journal of Medical Instrumentation 47(5), 492-496, "A Novel
  Three-minute Game-based Cognitive Risk Screening Tool: WeChat Mini-program-based Design and Large-sample
  Feasibility Studies" (company: Shanghai Bestcovered Ltd.). ABSTRACT ONLY read (via Europe PMC record of PMID
  37753885: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=G3%20WeChat%20cognitive%20Bestcovered&format=json&resultType=core);
  full text not read, so the numbers below are the abstract's, not checked against the paper:
  - "three one-minute mini digital games" with "instant access to reports"; "Among natural users aged 50 and older
    (71 179), the G3 initiation and completion rates were 99.55% and 92.28%"; average time "(278.5±73.73) seconds";
    correlation with MoCA-B "r =0.611".
- Wu J, Li Y, Zhou Z, Xia H, Chen N & Guo Q (2024), Alzheimer's & Dementia 20(S10), validation abstract, read:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC11711960/ — 475 adults aged 50-89 (230 impaired, 245 healthy), AUC 0.887
  (95% CI 0.859-0.916), sensitivity 0.913, specificity 0.624 at cut-off 59.5; tests "Number Ordering", "Species
  Sorting", "Gold Finding". Ethics and consent: not in the abstract.
- "More than 11 million users completed G3 by 31 August 2022": search listing of the 2023 A&D abstract only
  (https://alz-journals.onlinelibrary.wiley.com/doi/10.1002/alz.077166, blocked by a bot check): unverified.
- For us: in China the distribution channel is WeChat itself (a mini-program needs no install); three one-minute
  games plus an instant personal report kept 92% of starters to the end (abstract figure). Same pattern as Brain
  Age: short, a number about yourself, shared through the family's everyday app (inference).
### 3-JP (continued). Phones, online consent and debrief in a Japanese crowd study
- Majima (Hokusei Gakuen) & Nakamura (Tokyo Denki) (2022), Japanese Journal of Psychonomic Science 40(2), 147-156,
  "Be careful not to overload study tasks: Mobile devices and multiple presentation formats may compromise data
  quality of studies online". Read: English abstract plus pages 3-5 as images (Japanese text extraction failed, no
  .txt saved): https://www.jstage.jst.go.jp/article/psychono/40/2/40_40.24/_pdf
  - "a total of 1,005 crowd-workers (PC 485, mobile 520)" via CrowdWorks; "75 yen" each; median 7 minutes; run
    17 January 2020 (our translation of method).
  - Table 2: instruction check (IMC) pass PC 75.9% vs mobile 55.0% (chi-square 47.2, p < .001); a second check
    (ACQ, "proceed without selecting anything") passed by only 36.3% vs 34.2% (n.s.). Time with the window out of
    focus was logged (TaskMaster, focus/blur events).
  - Consent and debrief online: approved by the first author's institution's ethics committee; since a signature is
    impossible in anonymous online research, consent was two checkboxes (agree / not agree) and those who did not
    agree could not continue; "after the end, a debriefing about the true purpose of the study was shown" (our
    translation).
  - Abstract: mobile devices "were associated with less attentive responses", worst when all scale items were
    shown at once.
  - For us: in Japan, the online consent-and-debrief pattern is two checkboxes at the start and an automatic
    debrief screen at the end; window-focus logging is the web equivalent of our "headset off" signal.

---

## 6. What Asia adds that the English-language sources did not

1. A state-run IRB that by law takes unaffiliated researchers: Korea's public institutional bioethics committee,
   about 50,000-200,000 KRW per study, five meetings a month (4-KR). China has a written route (entrust a
   qualified committee, Art. 13), Japan a private psychology committee (IdeaLab, 200,000 yen, up to 5 weeks),
   Taiwan paid review by a willing university (NTHU, NT$2,500-19,500).
2. Hard numbers on the home-seriousness problem and its cheapest fixes: in Japanese panels half to four-fifths skip
   an instruction; a single red repeat brings about a third back and they then answer like careful people
   (Miura & Kobayashi 2016, 2018); a mirror image hardly anyone notices lowers carelessness (Kim et al. 2019, Korea).
   A reputation system (crowd rating tied to pay) beats points or money (Miura et al. 2018).
3. The device matters more than the place: phones cut instruction-check passes by 13-24 points in Japan (Majima
   2017, 2022), while Chinese platforms, 95% on phones, still matched US attention rates (Wang et al. posters).
   Students in a Japanese lab-like pool were not always cleaner than paid home workers (Majima 2017).
4. VR experiments run inside an existing VR community on players' own setups, recruited in that community
   (VRChat on X, Discord, Misskey; cluster's research institute), with a lab follow-up when home answers looked
   like "meta" self-reports (Koyanagi 2020; Kawaguchi 2026).
5. Reach in Asia came through the everyday channel and a personal number: Brain Age (19 million copies; TV, word of
   mouth, gifts to grandparents) and a three-minute WeChat game test (92% completion of 71,179 older users, abstract
   figure); a randomised experiment ran inside a shipped mobile game on 84,325 players (Kyushu University).
6. Not found in Asia: a published study with a host or narrator character, or humour, inside a measured task; a
   Hong Kong route for unaffiliated researchers; Korean online-panel attention-check rates.
