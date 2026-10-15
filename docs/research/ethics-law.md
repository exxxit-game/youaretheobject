# Ethics approval and lawful data for an independent team (research pass, 2026-10-10)

Builds on docs/research/own-experiments-now.md part 4 (USM fees, RPO committee does not review projects).
Rule: every claim with link and short quote; "unverified" = seen only in a snippet.
Parts 2, 4a and 4b live in [ethics-law-3.md](ethics-law-3.md) (moved there to keep this file under 300 lines).

## Parts (each gets an answer or "not found")
1a. US university IRBs reviewing independent investigators (fee schedules)
1b. Commercial IRBs (Advarra, BRANY, WCG, Pearl, others): social-behavioural minimal-risk online studies
1c. EU and UK options (DGPs ethics committee, national bodies, independent committees)
1d. Russia: institute/university committees reviewing outside projects (IP RAS, HSE, MSU, others)
1e. Which routes journals and preregistration accept
2.  Partnering with a university lab: agreements, PI, who holds approval, real examples
3a. Meta Horizon Store / Quest data-use and privacy policy rules for research data
3b. Meta account age rules and the 18+ recording rule
4a. GDPR: consent, special categories, anonymous vs pseudonymous
4b. Motion identifies people: Nair et al. 2023 (USENIX Sec), Miller et al. 2020 (Sci Rep)
4c. Russia 152-FZ: biometrics, localisation, cross-border transfer
4d. How labs anonymise motion/voice/gaze in practice
4e. Consent-form examples from real labs (online or VR)
5.  Shortest lawful path for us

## Findings

### 1c. EU: German Psychological Society (DGPs) ethics committee
- Source: "Hinweise zur Antragstellung an die Ethikkommission der DGPs", V13, dated 30.01.2022 (read from PDF text).
  https://zwpd.transmit.de/images/zwpd/dienstleistungen/ethikkommission/hinweise_zum_ethikantrag_v13.pdf
- Who: voluntary ("ehrenamtliche") reviewers, "nur fuer die Forschung an Hochschulen und anderen oeffentlichen
  Forschungsinstitutionen" (only for research at universities and other public research institutions, our
  translation); "Rein kommerzielle Forschung wird durch die Kommission nicht beraten" (purely commercial research
  is not reviewed). => A private game team on its own does NOT qualify; it qualifies only as part of a project
  run by a university/public-institute researcher (our reading).
- How: applications via the ZWPD online portal https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission ;
  form "Ethikantrag" (Word template, submitted as PDF). Opinion written when "mindestens zwei unabhaengige Voten"
  (at least two independent votes) are in.
- Time: "in der Regel vier bis sechs Wochen nach dem Eingang der vollstaendigen Unterlagen" (usually 4-6 weeks after
  complete documents).
- Why people apply: funders (DFG, EU) or "mit Blick auf die Anforderungen von Publikationsorganen" (journals).
- Fee, CORRECTED (portal page "Gebuehrenordnung", Stand 15.01.2021, read via curl,
  https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission/gebuehrenordnung): "Die Durchfuehrung der
  Ethik-Begutachtung ist kostenpflichtig" (the review is charged): 253.00 EUR for DGPs members, 953.00 EUR for
  non-members, net plus VAT; amendment or resubmission 142.00 / 555.50 EUR. So "ehrenamtlich" = unpaid reviewers,
  not a free review.
- Who may apply (https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission/wer-stellt-einen-ethikantrag):
  applicants "muessen in Psychologie promoviert sein" (must hold a doctorate in psychology); usually researchers
  "aus dem deutschsprachigen Raum" (German-speaking region); "Fuer Vorhaben, die bereits begonnen wurden, nimmt die
  Ethikkommission keine Antraege entgegen" (no applications for projects already begun) (our translations).
- Contrast: German Linguistics Society (DGfS), "Hinweise ... (Stand: Maerz 2025)" and Ordnung April 2024, both read
  with pdftotext (https://dgfs.de/wp-content/uploads/2026/02/ethikvotum_hinweise.pdf, .../ordnung-april2024.pdf;
  the old dgfs.de/de/assets links now 404): 100 EUR members / 300 EUR non-members per project vote; only for
  linguistics projects "die in Deutschland durchgefuehrt werden" (conducted in Germany). Not a route for us.

### 4b. Motion identifies people: moved whole to ethics-law-3.md (Nair 2023, Miller 2020, both read in full).

### 3a. Meta Horizon platform: Developer Data Use Policy (last updated 2026-07-02; clauses re-read verbatim, pass 4)
https://developers.meta.com/horizon/policy/data-use/
- 2.1: developers must "obtain any permissions/consents from the end user and/or rely on any appropriate legal basis".
- 2.2: "You must clearly articulate your collection, use and processing of Developer User Data" (public privacy policy).
- 2.3: "you may not sell User Data even if you disclose your intention to do so in your privacy policy." 4.3 bans
  "Selling, licensing, purchasing, renting, or lending User Data". 5.2: written agreement with any Service Provider.
- 11A (definitions): covered data "includes data from sensors such as a microphone or camera and the position of a
  user's headset", "data calculated about a user's hands and body", "face (i.e., abstracted facial expressions data),
  and eyes (i.e., abstracted gaze data)".
- 4.6 prohibits "Using User Data to ascertain the identity of a natural person, including real name".
- 4.13 prohibits "Using any permanent or persistent, device-based identifier (e.g., device serial number)".
- Research: no rule on research or academic use found on the page; nearest is 3.1(b) analytics to improve content,
  insights "aggregated, de-identified, or anonymized".
- Deletion: 6.3 requires "an easily accessible and clearly marked way to ask for their User Data to be corrected or
  deleted"; 6.2 delete when user asks or data "no longer necessary".
- Wording re-checked verbatim (pass 4, WebFetch asked for word-for-word pieces): 2.1, 2.2, 4.3, 4.6, 4.13, 6.3 as
  quoted; 2.3 reads "This Policy applies to all User Data regardless of the disclosures you include in your
  privacy policy. For example, you may not sell User Data even if you disclose your intention to do so"; 3.1(b)
  ends "aggregated, de-identified, or anonymized such that you cannot identify individual users or devices".
- Scope for a WebXR page: "User Data" = Meta Horizon User Data ("that you obtain from Meta Horizon, such as data
  collected from our SDK") + Device User Data ("that you obtain directly from a Meta Quest device", incl. "the
  position of a user's headset"; "does not include IP address"). "Content" = "any application or other technical
  integration with the Meta Horizon platform"; web apps or websites are not named. The text does not settle whether
  a site opened in the Quest Browser is covered (open; our reading: follow it anyway, it costs us nothing).

### 3b. Age rules (Meta)
- https://developers.meta.com/horizon/resources/age-groups/ (last updated 2026-04-02): "Users under the age of 10 are
  not permitted on the Meta Horizon platform." Self-certified groups: "Teens and Adults (13+)"; "Mixed Ages" (10-12 and
  13+); "Children (under 13)". For 13+ the Get Age Category API is not required. No 18+ option and no rule on
  developer-run age gates on the page.
- https://developers.meta.com/horizon/documentation/spatial-sdk/ps-get-age-category-api/ (last updated 2026-04-27):
  returns "CH (child, ages 10-12)", "TN (teen, ages 13-17)", "AD (adult, ages 18+)", "UNKNOWN"; "exclusive to apps
  built on the Android Platform" (so not available to a WebXR page in the Quest Browser).
- What it means for us (our reading): a Quest account can belong to a 10-17-year-old, so "18+ for recording" cannot be
  assumed from the platform. In the browser we must ask age ourselves (self-declared gate before any recording); in a
  future native store build we could also read AD/TN/CH from the API (Android builds only). Self-declared age is what
  Miller 2020 and most online studies rely on plus consent; parental consent route not needed if under-18s simply
  play without recording.

### 1a/1b. US IRBs: published prices (read on the pages unless marked)
- Solutions IRB (commercial, US), https://www.solutionsirb.com/fees/ (page shows only "(c) 2025 Solutions IRB"):
  "Initial Exempt Review Base Fee": $1200.00 ("if not exempt, the fee is applied toward the higher level of review");
  exempt studies "do not require annual check-ins"; "Initial Review- Social Behavioral" (expedited): $2100.00, plus
  annual "Continuation report" $1300.00; full board non-clinical $2950.00; "International Review - Any Research
  Outside of the US": "Expedited International Initial Review- Non-Clinical": $2570.00; "Each Additional Country":
  $500.00; modifications $550 (exempt) / $600 (expedited). Independent researchers not mentioned (not excluded).
- Health Media Lab IRB (HML IRB), https://www.healthmedialabirb.com/irb-fees-and-payment : "Exemption Review -
  US$1500"; "Expedited Review - US$1500"; full board "US$2,500 for 1st hour"; substantive amendments US$500.
  Home page (https://www.healthmedialabirb.com/, via WebFetch): "international social & behavioral science
  research", "We review studies from all over the world"; independent researchers and turnaround: not stated.
- Rutgers, https://research.rutgers.edu/faculty-staff/compliance/human-research-protection/irb-fees (via WebFetch):
  Exempt $250, Expedited $750, Full Board $2,500 when the "PI is unaffiliated with Rutgers" or for corporate/industry
  studies; invoiced "to the Rutgers PI" (so a Rutgers co-PI is still needed); "Fees (last update, 10/16/20)".
- IPA IRB fee update (PDF read with pdftotext, link below): from March 1, 2025 "Expedited or exempt" initial $2,100,
  plus $600 "for applications from non-IPA projects"; it "exists primarily to serve investigators who hold an IPA
  grant". Its comparison table lists BRANY at "$1050 + $155 for each additional informed consent" (expedited or
  exempt) and HML at $1,500. https://poverty-action.org/sites/default/files/2025-01/IPA%20IRB%20Fee%20Update%20-%20March%201%202025.pdf
- Cheapest found: Rutgers $250 exempt (needs a Rutgers PI), USM $500 exempt (earlier pass), BRANY about $1,050
  (IPA's table), Solutions IRB $1,200, HML IRB $1,500.
- Pearl IRB, https://www.pearlirb.com/irb-services/ : social-behavioural welcome: "We regularly review studies involving
  interviews, surveys, focus groups, observational methods"; "Pearl IRB is an AAHRPP-accredited independent IRB";
  offers "Exemption Determination"; fees not published: https://www.pearlirb.com/fee-schedule/ says "Complete this
  form to receive our Fee Schedule and a quote" (a form only the owner may fill). Independent researchers: not stated. Advarra / WCG / BRANY: only general exemption guidance seen (https://www.wcgclinical.com/insights/irb-exemption/ ,
  https://www.advarra.com/blog/beginners-guide-to-minimal-risk-research/); Advarra and WCG publish no prices (BRANY's
  via IPA's table above); the Advarra blog was not opened.
- US rule (WCG page read via WebFetch): category 2 = "Research that involves only educational tests, surveys,
  interviews, or observation of public behavior", "provided that certain conditions are met to protect participant
  privacy"; the call "should be made by an authorized individual or the IRB itself - not by the investigator
  alone". CORRECTED: the page says nothing about retroactive exemption (that came from the snippet only).

### 1d. Russia
- HSE (Higher School of Economics), Department of Psychology, "Commission for ethical assessment of empirical research
  projects": https://social.hse.ru/psy/ethics/ says it was created "to give staff and students of the Department of
  Psychology the opportunity to obtain an official opinion" (our translation) and to relieve the university-wide
  survey commission; external applicants not mentioned; no fee mentioned. Contact: commission secretary
  mhachaturova@hse.ru (public page). Procedure https://social.hse.ru/psy/ethics/algorithm : supervisor sends a signed
  application ("Zayavlenie") and a study-description table ("Prilozhenie A"); review "within 14 days"; signed
  conclusion "in Russian and English" e-mailed "within seven working days" (our translation). => Open to us only
  through an HSE psychology co-investigator (our reading; asking the secretary is the only way to confirm).
- MGPPU (Moscow State University of Psychology and Education) ethics committee, https://mgppu.ru/project/459 (region
  block for our tools; the owner opened it and sent its text). Set up by the Academic Council on 31 March 2021 to
  review research by the university's staff and students, "and also (when needed) carried out by them jointly with
  other organisations, and other research using the University's infrastructure" (our translation). Members serve
  "on a voluntary basis" (no fee is named). Among those who may submit: "an employee of the University acting as
  representative of a research lead who is not an employee of the University" (our translation). Documents: an
  application, a list of appendices, information about the study (Appendix 1 to its Regulation), the study
  protocol, the lead's training and research experience. Decision "not later than 15 calendar days" after the
  materials arrive. => Open to us as a joint study with an MGPPU employee as our representative (e.g. its VR lab).
- SPbU ethics committee for social, humanitarian and natural sciences, Regulation of 15.08.2013
  (https://spbu.ru/openuniversity/documents/ob-eticheskom-komitete-spbgu; region block, text sent by the owner; all
  quotes our translation). Registered with US HHS as "IRB00003875 St.Petersburg State University IRB#1 - Behavioral"
  (1.2). Applicants may be individual researchers and "representatives of commercial and non-commercial organisations"
  (1.6); free for SPbU staff, outside organisations pay "administrative costs" set by the first vice-rector for
  economics, whatever the decision (1.7; amount not on the page); it signs agreements to review, "including remotely",
  with individuals and legal entities (1.9). Documents (5.6): request, study protocol (international projects in
  Russian and English), methods, consent form, the applicant's consent to processing his personal data; electronic and
  printed. Review "within 1 month" (4.1.5); yearly review of running studies (4.1.2). => The one route found that takes
  a team like ours directly, with an IRB number US-registered; fee to ask the secretary.
- Institute of Psychology RAS (ipras.ru): no page on its own ethics committee found; its draft code points to the RPO
  ethics committee (http://www.ipras.ru/cntnt/rus/novosti/rus_psy/n3353.html: connection refused from our tools,
  region block). Not found.
- urniif.ru regulation ("no fee to study organisers", a law institute, not psychology): connection refused from our
  tools (region block); stays a snippet, not used.

### 4a. GDPR text: moved whole to ethics-law-3.md (Art 4(14), 4(5), Recital 26, Art 89, Art 9; our reading).

### 4c. Russia, 152-FZ (read on consultant.ru; page notes an edition with changes not yet in force)
- Art 3(1): personal data = "any information relating to a directly or indirectly identified or identifiable natural
  person" (our translation). Art 3(9): "depersonalisation" = actions after which it is impossible "without the use of
  additional information" to tell whose data they are (our translation) => like GDPR pseudonymisation, still personal.
  https://www.consultant.ru/document/cons_doc_LAW_61801/4f41fe599ce341751e4e34dc50a4b676674c1416/
- Art 12 (cross-border, as amended by 266-FZ of 14.07.2022 and 265-FZ of 26.07.2026):
  https://www.consultant.ru/document/cons_doc_LAW_61801/e4ebbe1780de623c7cf32a59ca82a7bb523a25dd/
  12(2) (re-read verbatim, edition of 26.07.2026): Roskomnadzor "approves the list of foreign states that ensure
  adequate protection"; states are included whose rules "correspond to the provisions of the Council of Europe
  Convention" on automated processing (our translation). The list: Roskomnadzor Order of 05.08.2022 N 128,
  registered with the Ministry of Justice 20.09.2022 N 70152 (consultant.ru subject page, via WebFetch). Ireland on
  it: the order's list itself was not opened (open); a 2021 Roskomnadzor notice (Garant, base.garant.ru/403017226,
  read via curl) shows the older scheme: Convention parties by law, plus a list of 29 non-parties.
  12(3): "before starting cross-border transfer the operator must notify" Roskomnadzor (our translation); 12(4)-(5):
  contents (legal basis and purpose, list of countries, the assessment of the foreign recipient's protection).
  12(9): a decision to ban/limit is taken "within ten working days" of the notice; 12(10): to listed countries the
  operator may transfer right after notifying; 12(11): to unlisted countries not before that period ends.
- Art 22(1): "Before starting to process personal data the operator must notify" Roskomnadzor (our translation),
  except the cases in 22(2) (manual-only processing etc., none fits us).
  https://www.consultant.ru/document/cons_doc_LAW_61801/d996966e22e1320c9de1ab82d9f6be12c3d9d765/
- Combined with Art 18(5) localisation (earlier pass): personal data of Russian citizens must first be recorded in a
  database in Russia; only then may a copy go abroad after the Art 12 notice. Foreign team with no Russian presence:
  the Ministry of Communications' 2015 clarifications, as summarised by GRATA International (Mondaq, 24 Aug 2015,
  https://www.mondaq.com/russianfederation/data-protection/422058/, via WebFetch): localisation binds non-Russian
  operators "only if they conduct activity targeting Russia"; a site is not covered merely because "it is available
  in Russia"; signs: a Russia-linked domain, "a Russian language version", plus roubles, performance in Russia or
  "advertisement in Russia". A Russian-language game promoted to Russians would likely count (our reading; the
  Ministry's own text not opened; lawyer to confirm). Anonymous derived numbers (not "personal
  data" under Art 3(1)) are outside the law (our reading).

### 1e. What journals accept
- PLOS ONE, https://journals.plos.org/plosone/s/human-subjects-research : "Obtain prior approval for human subjects
  research by an institutional review board (IRB) or equivalent ethics committee(s)"; "Submit documentation from the
  review board or ethics committee confirming approval"; exempt only "per applicable IRB/ethics committee regulations".
  No rule on independent/commercial IRBs (so an OHRP-registered commercial IRB or fee-for-service university IRB is the
  "IRB" route; whether a given body is accepted is judged per paper: the documents "are evaluated by journal staff
  before peer review", Hoch 2023 below). "Report details on how informed consent
  for the research was obtained".
- Hoch & Chenette 2023, PLOS ONE editorial, read in full, saved objekt-papers/hoch-2023.txt (PMC10411757): policy
  "effective 1 March 2023": "authors are required to provide original ethics approval documentation at the time of
  submission"; without it, or if it shows non-compliance, "the manuscript is rejected without external review"; in a
  pilot cohort "nearly two-thirds of submissions" failed and were rejected. CORRECTED: the editorial says nothing
  about retractions over a committee's independence (that part of the snippet is not in the text).
  => Approval documents must exist before we submit, and before data collection ("prior approval", above).
- Preregistration, both read via WebFetch: AsPredicted (https://aspredicted.org/): "Pre-registration remains private
  until an author makes it public", "Coauthors get an email asking for approval", public ones "cannot be modified";
  OSF/COS (https://www.cos.io/initiatives/prereg): "Right before your next round of data collection" or "Before you
  begin analysis of an existing data set"; "At least one confirmatory test must be specified"; embargo "for up to 4
  years". Neither page asks for ethics approval; cost is not stated on either page.

### 2. Industry-university partnership: moved whole to ethics-law-3.md (Vuorre 2022 worked example).

### 4d/4e. How a psychology ethics committee wants data handled and consent written (DGPs guidance V13, same PDF as 1c)
- Data: either a participant-chosen code word, or "Pseudonymisierung" first and, for long-term storage, "Anonymisierung
  ohne Kenntnis der untersuchten Person" (anonymisation without knowledge of the person, our translation); the code list
  "ist nach der Datenerhebung oder der Datenauswertung zu vernichten" (must be destroyed after collection or analysis);
  after that a person's record "kann ... nicht mehr identifiziert und eine Loeschung ... nicht mehr durchgefuehrt
  werden, auch wenn dies verlangt wird" (can no longer be identified or deleted, even on request). The participant
  sheet must say which variant is used.
- Participant information must state: voluntariness and "jederzeit von der Teilnahme zuruecktreten" (withdraw at any
  time) with no disadvantage; "in welcher Form und wie lange die Daten gespeichert werden" (form and duration of
  storage); that deletion can be requested "bis zu einem definierten Zeitpunkt" (until a defined point); a named
  contact person.
- Consent statement: must show "worin genau die unterzeichnende Person einwilligt"; avoid stock phrases like "Ich habe
  verstanden"; templates page read (https://zwpd.transmit.de/zwpd-dienstleistungen/zwpd-ethikkommission/vorlagen-antragstellung):
  17 files incl. "Vorlage Allgemeine Informationen fuer Teilnehmer/-innen" (v7), "Vorlage Einwilligungserklaerung"
  (v10), consent "bei Bild- und Tonaufnahmen" (v6), "Vorlage Erstellung eines persoenlichen Codeworts" (v4) and
  data-protection advice for consent forms (0.1a PDF); Word files themselves not opened.
- Real-lab consent practice for a VR tracking study (Miller 2020, 4b): signed IRB-approved form for adults; opting out
  of research still let people watch without data being collected. Online game data study (Vuorre 2022, 2): info page
  first, then "the option to consent", 18+ self-report.
- Fit for us (our reading): this matches the owner's rules almost one to one (consent, quit any time, debrief,
  anonymous). Our in-game version: session ID only (pseudonymous), raw tracks kept only until the derived numbers are
  computed, then deleted; tell the player that from then on his record cannot be found or deleted.
- Motion anonymisation tools: MetaGuard, Nair, Munilla Garrido, Song, "Going Incognito in the Metaverse", UIST 2023,
  https://arxiv.org/abs/2208.05604 (full PDF read with pdftotext; not saved, the name nair-2023.txt is taken):
  "leverages local differential privacy to quantifiably obscure sensitive user data attributes"; conclusion: "the
  ability of an attacker to deanonymize a VR user was degraded by as much as 96.0%". Nair's Berkeley report
  EECS-2023-232, 14 Nov 2023 (https://www2.eecs.berkeley.edu/Pubs/TechRpts/2023/EECS-2023-232.html, abstract via
  WebFetch): a newer identification model "can convincingly bypass this anonymization technique"; proposes "deep
  motion masking", claimed to achieve "cross-session unlinkability and indistinguishability" (no numbers on that page).
  => Noise on height/arm length helps but is not a guarantee; the safe practice is not to keep raw tracks at all.

### 1c (cont.) UK
- No UK committee that reviews unaffiliated researchers for a fee was found (search only). ESRC ethics-review page
  (https://www.ukri.org/councils/esrc/guidance-for-applicants/research-ethics-guidance/ethics-reviews/, via WebFetch):
  review by the research organisation's "principal REC, secondary REC, or NHS REC"; "Light-touch reviews can be
  delegated by a principal REC"; more than minimal risk "should receive a full REC review"; no word on independent
  or commercial researchers. So a UK route also needs a university partner.

## 5. Shortest lawful path for us (our synthesis from the sources above; a lawyer should confirm the legal readings)
Phase A, the game now (no publication, no ethics approval needed for the in-game "you vs other players" view):
 1. Keep raw head/hand tracks and voice on the headset; compute the room's numbers there; send only derived numbers
    plus a random session ID. Raw tracks single people out (Nair 2023: 94.33% from 100 s; Miller 2020: 95% of 511),
    so never upload them in Phase A. Cost 0, our code time.
 2. Self-declared 18+ question before anything is recorded (Meta accounts start at 10; the age API is Android-only).
    Under 18: play, nothing recorded (Miller 2020 did the same for opt-outs).
 3. Public privacy policy and a clear delete-my-data path (Meta Data Use Policy 2.2, 6.3); no selling (2.3).
 4. Russian players: with only anonymous derived numbers, 152-FZ localisation (18(5)) and notices (22(1), 12(3)) should
    not bite (Art 3(1) reading). If any personal data of Russian citizens is kept (raw tracks, voice, e-mail), it must
    first land in a database in Russia, Roskomnadzor notified before processing, and a cross-border notice filed (10
    working days wait for non-listed countries). EU/Supabase Ireland is fine under GDPR with consent.
Phase B, a publishable study (the owner's "science only after approval, preregistration, separate consent"):
 5. Get approval BEFORE collecting (PLOS ONE: "prior approval", documents at submission). Cheapest routes found:
    a) a university co-investigator: HSE psychology commission (free, 14 days review + 7 working days; staff/students
       only, so via a co-PI), DGPs (253 EUR members / 953 EUR others + VAT, 4-6 weeks; a psychology PhD at a
       university or public institute must apply, before the study starts); the co-PI's committee holds
       the approval, we build and run the game, like Vuorre 2022 (Oxford approval, publishers recruited and passed
       hashed IDs, no editorial control);
    b) SPbU IRB#1 (1d): takes outside organisations directly, remote, fee on request, 1 month;
    c) pay an IRB alone: USM $500 exempt / $750 expedited; Solutions IRB $1,200 exempt, $2,570 international expedited
       + $1,300/yr; HML IRB $1,500. Turnaround: not published by any IRB page read (Pearl's page 404).
 6. Preregister before data collection (OSF: embargo up to 4 years, one confirmatory test; AsPredicted: private
    until made public, co-authors approve; no ethics approval asked by either; 1e).
 7. Separate in-game consent screen for science use (what is recorded, for how long, quit any time with no loss,
    delete until a stated point, then anonymised and undeletable: DGPs template logic), debrief after.
 8. If raw tracks are needed for the science: explicit consent (GDPR 9(2)(a) covers the biometric reading), keep only
    until derived numbers are computed, then delete; state the deletion point in the consent.

## Not reached / still open (updated in pass 4, 2026-10-10)
- Closed in pass 4: Meta clause wording (verbatim), Rutgers / IPA / BRANY / HML fees, Pearl (quote by form only),
  WCG wording, DGPs fee (CORRECTED: charged) and templates, DGfS fee, PLOS 2023 rule (retraction claim CORRECTED),
  OSF / AsPredicted rules, MetaGuard 96.0% and the bypass report, ESRC review route, 152-FZ 12(2) and the
  "targeting Russia" test, a public data-sharing template.
- Still open: whether a website in the Quest Browser falls under Meta's policy (text silent); Ireland on
  Roskomnadzor Order N 128's list (order text region-blocked); IRB turnaround times (none published); Advarra
  prices; IP RAS committee (region block); the SPbU fee (its secretary); legal readings (lawyer).
