# Ethics and lawful data, part 3 (parts list and the rest in ethics-law.md)

### 4b. Head and hand motion identifies people (both read in full)
- Nair et al. 2023, "Unique Identification of 50,000+ Virtual Reality Users from Head & Hand Motion Data", 32nd USENIX
  Security Symposium. https://usenix.org/system/files/usenixsecurity23-nair-identification.pdf (read from PDF text;
  NOT saved: objekt-papers/nair-2023.txt already exists and is a different Nair 2023 paper, the Beat Saber census).
  - Abstract: real VR users "(N=55,541) can be uniquely and reliably identified across multiple sessions using just
    their head and hand motion"; after 5 min training data per person, "94.33% accuracy from 100 seconds of motion,
    and with 73.20% accuracy from just 10 seconds of motion"; biomechanics "on par with widely used strong biometrics
    like facial or fingerprint recognition".
  - Features: the two most important "are an obvious proxy for the user's height (and posture)"; next six measure arm
    length; but static measurements "account for only 22.9%"; "Motion features constitute 73.9% of all entropy gain".
  - Ethics (sec 3.4): Berkeley IRB protocol #16120, "deemed IRB-exempt under 45 C.F.R. 46.104(d)(4)(i)" because data
    were already public (BeatLeader replays); they still got written permission from BeatLeader; released only
    "de-identified and normalized data". Conclusion: telemetry "should in fact be considered highly sensitive data".
  - Defences: none tested; future work "methods that intelligently corrupt VR telemetry to obscure identifiable
    properties".
- Miller et al. 2020, "Personal identifiability of user tracking data during observation of 360-degree VR video",
  Scientific Reports 10:17404, doi 10.1038/s41598-020-74486-y. https://pmc.ncbi.nlm.nih.gov/articles/PMC7567078/
  SAVED: C:\Users\admin\Documents\objekt-papers\miller-2020.txt (from Europe PMC full-text XML).
  - "Out of a pool of 511 participants, the system identifies 95% of users correctly when trained on less than 5 min
    of tracking data per person"; "By far, the most important feature is Headset Y".
  - De-identification: "in practice taking one's name off a dataset accomplishes very little."
  - Removing horizontal position: "identification was still 92.5% accurate" (vs 95.3%).
  - Mitigation ideas (not tested): "Tracking fewer channels of data may help"; "displacing positional data by some
    amount may allow one person to reliably appear as the height of another person".
  - Their consent practice: "approved by the Stanford University IRB under protocol number 43879"; "All adult
    participants read and signed an IRB-approved consent form"; under-18s needed "child assent and parental consent";
    museum visitors who opted out "still had the option to view the 360 videos without having their data collected".
- Consequence for us (our reading): raw per-frame head/hand tracks of one player are, by these results, data that can
  single a person out, so under GDPR they are personal data, not anonymous, even with no name attached (see 4a).

### 4a. GDPR text (read on gdpr-info.eu)
- Art 4(14): "'biometric data' means personal data resulting from specific technical processing relating to the
  physical, physiological or behavioural characteristics of a natural person, which allow or confirm the unique
  identification of that natural person". https://gdpr-info.eu/art-4-gdpr/
- Art 4(5) pseudonymisation: data "can no longer be attributed to a specific data subject without the use of additional
  information, provided that such additional information is kept separately". Same page.
- Recital 26: pseudonymised data "should be considered to be information on an identifiable natural person";
  identifiability judged by "all the means reasonably likely to be used, such as singling out"; the rules do "not apply
  to anonymous information ... including for statistical or research purposes." https://gdpr-info.eu/recitals/no-26/
- Art 89(1): research processing "shall be subject to appropriate safeguards"; measures "may include pseudonymisation";
  where purposes can be met without identifying people, "those purposes shall be fulfilled in that manner".
  https://gdpr-info.eu/art-89-gdpr/
- Art 9 (earlier pass): biometric data "for the purpose of uniquely identifying" is special category; explicit consent
  (9(2)(a)) lifts the ban.
- Our reading (lawyer to confirm): (1) a random session ID instead of a name = pseudonymised = still personal data;
  (2) raw head/hand tracks can single a person out (Nair, Miller, 4b), so they are personal data; (3) they become
  "biometric"/special category only when processed to identify someone, which we never do, but explicit consent costs
  us nothing and covers both readings; (4) truly anonymous = only derived numbers (e.g. "reaction time 412 ms",
  "chose B") with raw tracks deleted. Voice recordings are personal data in any reading.

### 2. Industry-university partnership: a worked real example
- Vuorre et al. 2022, "Time spent playing video games is unlikely to impact well-being", Royal Society Open Science,
  doi 10.1098/rsos.220411, https://pmc.ncbi.nlm.nih.gov/articles/PMC9326284/ (read via fetch summariser):
  - Approval held by the university: "granted ethical approval by our institute's Central University Research Ethics
    Committee" "(SSH-OII-CIA-21-011 (underscores in the original))" (Oxford Internet Institute).
  - Recruitment by the companies: "We collaborated with game publishers who recruited players with emails";
    participants "reported being 18 years or older" and consented "to have their game-play behaviour data provided by
    the respective game publisher".
  - Data flow: "the publishers sent the behavioural data of all consented participants to our team"; "The game
    publishers created those hashed IDs for each player account"; "At no point did we collect personally identifiable
    data".
  - Roles: industry partners "reviewed the study design and assisted with play behaviour data collection and
    recruitment" "but had no role in ... data analysis, decision to publish or preparing the manuscript". Funded by
    the Huo Family Foundation. Data open at https://osf.io/fb38n/ . "This study was not preregistered."
  - Pattern to copy: university PI and ethics committee own the protocol and the analysis; the company recruits,
    collects in-game data under the protocol's consent, hands over pseudonymous IDs; no editorial control.
- Nair et al. 2023 (4b): the BeatLeader community service (not a university) supplied public data; the Berkeley IRB
  held the approval; written permission from BeatLeader obtained anyway.
- Sea Hero Quest (Deutsche Telekom + Glitchers + UCL/UEA) and LabintheWild (Harvard): in the earlier pass, 1b.
- Data-sharing agreement text (pass 4): no game company's agreement is published (1 search). Nearest public model:
  van Dijk & Hart 2021, "Data Sharing Agreement Template", CC BY 4.0 (https://ldbase.org/resources/templates/example-data-sharing-agreement,
  via WebFetch): use "for scholarly and research purposes" only; "commercial activities, including marketing and
  advertisement, is prohibited"; no redistribution; "The data requestor is responsible for obtaining approval";
  publications must "maintain the anonymity of the participants". It has no security or deletion clause.
