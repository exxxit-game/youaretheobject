# Running our own experiments now, part 2: running and publishing, data-quality risks, what is still open

Continues own-experiments-now.md (parts 1-3 and the candidate list are there). Same rule: claim, link, short
quote; "unverified" marks what was not confirmed on a primary page.

## 4. Running and publishing our own study

### 4a. Ethics review without our own university

- US, a university IRB reviewing outsiders for a fee. University of Southern Maine (schedule "Updated
  06/30/2026"), reviews "non-USM research projects as a service to the general community" for any "institution or
  individual investigator who needs a review by a federally registered IRB with a Federalwide Assurance":
  "Exempt determination: $500.00"; "Expedited IRB review: $750.00"; "Full Board convened IRB review: $1,500.00";
  exempt renewal "$250.00" at least every 3 years.
  https://usm.maine.edu/orio/wp-content/uploads/sites/361/2022/07/IRB-External-Reviews-Fee-Schedule.pdf
  (read from the PDF text).
- Rutgers (read, https://research.rutgers.edu/node/5291): fees apply when the "PI is unaffiliated with Rutgers":
  exempt "$250", expedited "$750", full board "$2,500", continuing review "$250" (expedited) / "$750" (full
  board); table "last update, 10/16/20".
- Washington State IRB (read, https://www.dshs.wa.gov/ffa/human-research-review-section/wsirb-fees): a board of
  the state's social and health department (DSHS); new expedited application 2,000 USD, full board "$3,000", exempt
  determination 750 USD, continuation 500 USD; fees since December 1, 2015, paid "from the investigator or their home
  institution". Whether it takes private studies with no state link: not stated on the page.
- Commercial IRBs. Fee schedules once hosted by Rutgers, BRANY single-site 2025
  (https://research.rutgers.edu/system/files/2025-10/brany-single-site-irb-fee-schedule.pdf) and Advarra 2025
  (.../2025-04/advarra-standard-irb-fee-schedule.pdf), now return "Page Not Found" (site rebuilt; checked
  10.10.2026, also the 2024 copies). Listings only (unverified): BRANY exempt determination $1,105 (2025), Advarra
  single-site initial review $3,100 (2025). BRANY's own page (read, https://www.brany.com/?p=7702) is a "Request an
  IRB Fee Schedule" form with the options "Independent Investigator/Researcher" and "Social Behavioral and
  Educational (SBER) study for single site studies"; no amounts: the schedule comes only through that form (owner).
- Russia: the Russian Psychological Society's Ethics Committee (https://psyrus.ru/rpo/structure/ethics.php refused
  our tools; the owner downloaded its documents). Its Regulation (pologenie_etick_kodeks_16.10.2013.doc, read in
  full) makes it "a standing consultative and regulating body of the RPO on the psychologist's professional ethics"
  (1.2, our translation); its functions (2.2) are explaining the code, complaints against psychologists, sanctions
  and changes to the code, not reviewing research projects. The other file (materiali_efpa.doc: EFPA guidance on
  complaints and forensic work) has no project review either. So ethics approval goes to a university or an IRB.
- EU: no central review body. The European Network of Research Ethics Committees' position paper (15 March 2021,
  read in full, objekt-papers/eurec-2021.txt,
  https://lumsa.it/sites/default/files/ricerca/EUREC%20Positionpaper%20on%20ethics%20reviews%20outside%20biomedical%20research_March-2021.pdf):
  outside biomedicine "Often an ethics review for such studies is not required either by national laws or by
  professional laws or guidelines", yet "funding organisations and peer-reviewed journals are requesting ethics
  review"; "In some jurisdictions it is difficult for these researchers to find an ethics committee"; in some
  countries medical RECs review such projects too. EUREC is a network that "could serve as a European umbrella",
  not a review body; no fees named. Country profiles (https://icss.ecrin.org/en/node/425): site unreachable on
  10.10.2026 (fetch cut mid-response, browser refused), not read.

### 4b. Preregistration

- AsPredicted (home page read in the browser, https://aspredicted.org/): "All pre-registrations can be downloaded
  as single page PDFs that are time-stamped"; "Pre-registration remains private until an author makes it public";
  "Public pre-registrations cannot be modified"; Wharton CredLab (UPenn) logos. Its example
  (read, https://aspredicted.org/kv692.pdf) has 8 questions: data already collected?; main question; key dependent
  variable; conditions; analyses; outliers and exclusions; sample size; anything else. Price (Help page, read,
  https://aspredicted.org/help): "we are a free service and receive about 200 submissions a day"; "funded by the
  Wharton School" (https://aspredicted.org/about@). The Help page still names "Question 8" as the free-text one, so
  the third-party "nine simple questions" is not borne out (CORRECTED: eight, as in the example).
- OSF (read, https://help.osf.io/article/158-create-a-preregistration): "a time-stamped, read-only version of your
  study plan"; 14 templates, among them "Preregistration Template from AsPredicted.org" and "Registered Report
  Protocol Preregistration"; "You can embargo it for up to four years"; "Once you submit a registration, you will
  not be able to edit"; withdrawal is "irreversible". Cost (COS page, read, https://www.cos.io/products/osf): "A
  free, open-source platform".

### 4c. Data rules

- GDPR Art. 9(1): special categories include biometric data processed "for the purpose of uniquely identifying a
  natural person" and "data concerning health"; Art. 9(2)(a) allows them with "explicit consent ... for one or
  more specified purposes"; 9(2)(j) allows research use only when based on Union or Member State law.
  https://gdpr-info.eu/art-9-gdpr/
- GDPR Art. 4 (read, https://gdpr-info.eu/art-4-gdpr/): (14) biometric data come from "specific technical
  processing relating to the physical, physiological or behavioural characteristics of a natural person, which
  allow or confirm the unique identification"; (1) a person is identifiable "directly or indirectly".
- Motion identifies people (read, https://arxiv.org/abs/2302.08927): Nair et al. 2023, USENIX Security, pp.
  895-910: 55,541 VR users; one "can be uniquely identified amongst the entire pool of 50,000+ with 94.33% accuracy
  from 100 seconds of motion" (73.20% from 10 s).
- Our reading (not a lawyer's): head and hand motion is a "behavioural characteristic" that can identify a player,
  so stored motion logs are likely personal data even if we never identify anyone; they become special-category
  (Art. 9) only when processed to identify. Consent and data minimisation follow from that. The UK regulator reads
  it the same way (ICO, "Key data protection concepts", biometric recognition guidance, read,
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/biometric-data-guidance-biometric-recognition/key-data-protection-concepts/):
  behavioural examples include "the way someone types"; special category "only ... if you use it to uniquely
  identify someone". UK guidance, not an EU ruling: for us a lawyer still has the last word.
- Russia, 152-FZ Art. 11(1): biometric data are data on physiological and biological features "on the basis of
  which his identity can be established" (our translation); when used to identify, they "may be processed only with
  the written consent of the data subject" (our translation). https://www.consultant.ru/document/cons_doc_LAW_61801/7336c78762a98b5f4f698b8c3800dca1111acc16/
- Russia, 152-FZ Art. 18(5) (as amended by 23-FZ of 28.02.2025): collecting data of Russian citizens, including
  over the internet, "using databases located outside the territory of the Russian Federation is not allowed"
  (our translation; except listed cases). https://www.consultant.ru/document/cons_doc_LAW_61801/cbf4e15b7c330f9372e876cdf2bc928bad7950ef/
  Consequence for us: personal data of Russian players must first land in a database in Russia; anonymous data
  that cannot identify anyone is outside the law's scope (that reading is ours: a lawyer should confirm). Given
  Nair et al., raw motion logs may not count as anonymous (ours).

### 4d. Partnering with a university (examples from the pages read)

- Sea Hero Quest: a company (Deutsche Telekom) contacted UCL and hired a studio (Glitchers) (1b). LabintheWild is
  run by Reinecke's lab at the University of Washington with Gajos at Harvard (1b). A university IRB can review an
  outside investigator for a fee (USM, Rutgers; 4a). The KLI many-labs grant (up to 9,000 euros) is for its
  members only (1a). Costs of a partnership itself: not found.

## 5. Risks to data quality and how studies handle them

- Inattention: about 13% online vs 3% in the lab; "approximate 10% ill-intended"; over-recruit and fix an
  objective exclusion rule in advance (Mottelson et al. 2021, 1c). Hand tracking: a screening step cut bad data
  from 27% to 8% (same).
- Drop-out: one in-the-wild VR study kept 59 of about 400 installs, "a rate of return of 15%" (Steed et al. 2016,
  06-science.md). Accidental one-shot choices: 5 of 33 (Kissel et al. 2023).
- Repeat players (READ, objekt-papers/chandler-2015.txt, in-press version): Chandler, Paolacci, Peer, Mueller &
  Ratliff (2015), Psychological Science 26(7):1131-1139, doi:10.1177/0956797615585115. Many Labs tasks repeated
  days to a month later on MTurk: "effect sizes declined from T1 (weighted d = .82) to T2 (weighted d = .63) by
  d = .19, a drop of about 25%"; the drop was larger in a changed condition (d 0.23) than the same one (d 0.14);
  self-reported memory of taking part was "at best a poor indicator". Handling: log first vs repeat run; analyse
  first runs; keep the condition per device (do not rely on asking players).
- Bots: Westwood (2025), PNAS, https://www.pnas.org/doi/10.1073/pnas.2518075122 (prize news: Dartmouth,
  https://fas.dartmouth.edu/news/2026/04/sean-westwood-wins-pnas-prize-ai-polling-study). Paper since read in full
  (objekt-papers/westwood-2025.txt; study-methods-1.md 2b): "a 99.8% pass rate on 6,000 trials of standard
  attention checks", "rendering most current detection methods obsolete"; "between just 10 and 52" fake
  respondents could flip a 2024 poll. CORRECTED: "evade nearly all existing detection methods" is not the paper's
  wording. A WebXR run with tracked head and hands is harder
  to fake than a web form: our inference; no source tested it.
- Suspicion: 68% in VR thought the alarm staged (Kinateder & Warren 2016); suspicion probes miss about half
  (Blackhart et al. 2012; both in 06-science.md); Johansson et al. expect "most participants" to spot a switch if
  told to look (card johansson-2005.md). Hall et al. 2010 used a cover story (quality surveyors) and asked at the
  end whether anything felt "odd or unusual" before debriefing (hall-2010.txt). Handling: open-first suspicion and
  prior-knowledge probe before the reveal, analysed as a moderator, preregistered.
- Self-selection: 86% male, median 26 (Mottelson et al. 2021). Report "you vs other players", never "vs people".

## Still open (with why)

- Wilson & Nisbett 1978 (stocking per-position shares and reasons): DeepBlue copy restricted to U-M campus; JSTOR
  needs a login (owner).
- Shiv, Carmon & Ariely 2005 full text (drink, prices, puzzle counts): SAGE paywall (owner).
- Westwood 2025: since read in full ([study-methods-1.md](study-methods-1.md), part 2: 99.8% of attention checks
  passed by an AI agent).
- Closed on 10.10.2026: Yee & Bailenson 2007, McFadyen 2021 samples, Remington 2024, McKay 2025 (religious
  attitudes), EUREC paper, AsPredicted and OSF price (both free), PSA count (2022 figure; dashboard host down).
- BRANY and Advarra fee PDFs: gone from Rutgers (404); BRANY gives its schedule only through a request form (owner).
- Olson open-label report (BIAL): both PDFs 404; a Wayback copy exists but is an embedded PDF (owner).
- Not found (searched again where marked): a 2024 pension choice-blindness study; an online choice-blindness study
  of 498 (again: none; closest a 2025 Prolific dataset of 330); the "$10 billion" Sea Hero Quest figure; costs of a
  university partnership. A central EU review body: none exists (EUREC 2021, 4a).

## Pages only the owner can open (region block, bot check, paywall, clicks), and what to bring back

Bot checks, forms or embedded files (open in a browser):
- https://web.archive.org/web/20250809104404/https://www.fundacaobial.com/media/4353/2020-open-label-choice-blindness.pdf:
  Olson's open-label choice-blindness report: N, conditions, share who noticed, one-week result.
- https://www.brany.com/?p=7702: request form for BRANY's fee schedule (choose "Independent Investigator/
  Researcher" and SBER single site): only if a US commercial IRB is considered; needs the owner's contact details.
Paywalls (need access):
- https://www.nature.com/articles/s41586-018-0637-6: opened by the owner; supplement read (field-labs-2.md 8); its
  ethics and consent are only in the paid Methods (EUR 39.95), not bought.
- https://hdl.handle.net/2027.42/92172: Wilson & Nisbett 1978, Social Psychology 41:118-131 (record opened by the
  owner: "Access restricted to U-M campus"); needed only if the two-phones room is chosen, then via a library.
- https://doi.org/10.1509/jmkr.2005.42.4.383: Shiv et al. 2005: opened by the owner, abstract only (three experiments,
  discounted price, fewer puzzles); the numbers are in the paid full text, needed only if the two-phones room is chosen.
- https://doi.org/10.1007/978-3-319-21996-7_47: "Virtual Blindness" 2015: the owner opened it; abstract and citation
  agree with part 3b (38 people, 16 pairs, 8 justified, 4 swapped); the full text with detection per condition costs
  EUR 29.95 at Springer, not bought: needed only if a choice-blindness room is chosen.

Later research passes (optional, none blocks the work):
- https://www.annualreviews.org/content/journals/10.1146/annurev-psych-040422-045007 (bot check): Ward & Meade 2023,
  warnings vs rewards for careless responding.
- https://web.archive.org/web/20250809104404/https://www.fundacaobial.com/media/4353/2020-open-label-choice-blindness.pdf:
  Olson's open-label choice blindness: N, conditions, share who noticed, one-week result.
- https://www.tandfonline.com/doi/full/10.1080/2153599X.2025.2557482 (bot check): McKay 2025 published version.
- https://alz-journals.onlinelibrary.wiley.com/doi/10.1002/alz.077166 (bot check): the G3 WeChat test abstract.
- https://academic.oup.com/book/26677: "Games User Research" chapters 22 (play as at home), 30 (VR sickness), 12.
- https://www.soc4m.ru/index.php/soc4m/article/view/9355 (region): Toloka attention check, the 36% figure.
- https://psyjournals.ru/journals/exppsy/archive/2019_n1/exppsy_2019_n1_Selivanov.pdf and
  https://psyjournals.ru/journals/exppsy/archive/exppsy_2022_n2.pdf (region): Russian VR studies, samples, headsets.
- https://www.alexandria.unisg.ch/handle/20.500.14171/78586: Herrmann et al. 2008 PDF, Samara and Minsk numbers.
- https://www.academia.edu/32909519/User_centered_Game_Design (login): Pagulayan, Microsoft playtest methods.
- https://www.brany.com/?p=7702: BRANY fee request form; only if a US commercial ethics board is chosen.
- https://legalacts.ru/doc/prikaz-roskomnadzora-ot-05082022-n-128-ob-utverzhdenii-perechnja/ (region): is Ireland on
  Roskomnadzor's list (Order 128), how many states, from when.
- http://www.ipras.ru/cntnt/rus/novosti/rus_psy/n3353.html (region): does the Institute of Psychology RAS have its own
  ethics committee.
- https://eprints.soton.ac.uk/404286/1/2017_CIHB_Citizen_Science_with_authors.pdf (bot check): EyeWire players, recruiting.
- https://www.lovethework.com/en/work/campaigns/sea-hero-quest-34191 (paid login): the Cannes entry's figures.
- https://www.pearlirb.com/fee-schedule/ (form with personal details): Pearl IRB fees, only if a US board is chosen.
