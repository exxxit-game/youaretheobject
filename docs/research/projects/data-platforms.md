# How large online psychology platforms handle participant data, and what went wrong

Research for "You are the object" (data path design). Session date 2026-10-09. Budget used: 8 web searches, 15 page fetches (several blocked: Nature paywall, MIT DSpace 405, OSF pages render empty for the fetch tool, scispace empty).

Markers:
- **[read]**: I opened the source in this session and the claim is in its text (quote copied from it).
- **[search summary]**: seen only in a search-engine summary of that page; the page itself was not opened. Treat as unverified detail.
- **[unverified]**: from memory or inference; not checked in this session.

Repo context read first: `docs/research/vr/06-science.md`, `docs/methodology.md`, `privacy.html`, `supabase/migrations/0001_runs.sql`, `0004_playtests.sql`, `0006_compare_room.sql`, `0008_submit_run_age.sql`.

---

## 1. Project Implicit (Harvard / UVA; demo site implicit.harvard.edu, public datasets on OSF)

Sources: Ratliff & Smith (2024), "The Implicit Association Test", *Daedalus* 153(1), https://www.amacad.org/sites/default/files/publication/downloads/Daedalus_Wi24_06_Ratliff_Smith.pdf **[read, full text via pdftotext, grepped for data passages]**; Xu, Nosek & Greenwald (2014), "Psychology data from the Race Implicit Association Test on the Project Implicit Demo website", *Journal of Open Psychology Data* 2(1):e3, doi:10.5334/jopd.ac, page https://reference-global.com/article/10.5334/jopd.ac **[read, abstract-level page only]**; OSF umbrella project https://osf.io/y9hiq and Race IAT archive https://osf.io/52qxl **[search summary; the OSF pages rendered empty for the fetch tool]**.

1. **Recorded per session; anonymity and repeats.**
   - Scale: "more than eighty million study sessions have been launched", over 40 million IATs, "an IAT every twenty-one seconds" (Daedalus) **[read]**. The site is built "in the model of an interactive exhibit at a science museum" **[read]**.
   - Per session: IAT score (computed), self-report attitude items, demographics, sometimes extra measures (JOPD page) **[read]**. Individual fields (session id, date, "number of previous IATs" item) **[unverified]**.
   - Repeats: no account; I could not confirm how repeat takers are flagged (a "how many IATs have you taken before" item is my memory) **[unverified]**. Daedalus warns repeated sessions drift: "IAT scores tend to move toward zero from one test session to the next" **[read]**, so repeat status matters for analysis.
2. **Storage, retention, access.** Data kept since 2002 and still collected; per-year files online (Race IAT components 2002–2024 listed) **[search summary]**. Hosting region and internal access control not found **[gap]**.
3. **Consent, IRB.** Not found in what I could open. University IRB oversight is my assumption **[unverified]**.
4. **Publication.** Per-year files plus an all-years file, "with IAT score computed, self-report data labeled, and demographic information"; codebooks give "the variable labels and value labels, and changes of variables over years" **[search summary of OSF wiki]**; JOPD page confirms codebooks per yearly file and for the full set, open download via OSF **[read]**. Data-paper route: the 2014 JOPD paper is the citation for the Race data (2,355,303 volunteers, 2002–2012) **[read]**. Licence: the OSF umbrella is described as CC0 **[search summary]**, while the JOPD page names CC BY 4.0 (possibly the article's own licence) **[read]**: the licence picture is inconsistent.
5. **Outside scientists' access.** Open download; users agree to "strictly non-commercial research purposes" and not to attempt re-identification **[search summary]**. Postcodes are removed from public files; state, county and metro area remain; zip-level data needs "ethical approval from your institution" and verification (Religion IAT page) **[search summary]**. Researchers use the public data at scale: geographic-bias work comes "primarily through research using publicly available data from Project Implicit" (Daedalus) **[read]**.
6. **Data-quality problems.**
   - Released-file errors: race-feeling variables coded 0–10 for 2002–2013 but 1–11 for 2014–2015; corrected files posted 17 Oct 2016; some IAT scores missing Sept–Dec 2016 **[search summary of OSF wiki]**.
   - Self-selected sample: they argue it works for trends, with "growing evidence" PI samples perform like nationally representative ones (Hehman et al., cited) **[read]**.
   - Fast-response exclusions inside the D-score algorithm (Greenwald, Nosek & Banaji 2003: sessions with >10% trials under 300 ms) **[unverified]**.
7. **Legal / reputational trouble.** The IAT's meaning and validity are "still under vigorous debate" (Daedalus) **[read]**; critics argue it adds little beyond self-report (cited there) **[read]**. Public criticism of giving individuals a "your bias" result from a measure with modest test-retest reliability (press, e.g. 2017) **[unverified]**. No legal case found.

## 2. LabintheWild (Reinecke & Gajos; now University of Washington)

Source: Reinecke & Gajos (2015), "LabintheWild: Conducting Large-Scale Online Experiments With Uncompensated Samples", *CSCW '15*, 1364–1378, https://wildlab.cs.washington.edu/Publications_files/Reinecke_Gajos_LabintheWild.pdf **[read: text extracted with pdftotext; design, participants, data-quality sections and three replications read]**.

1. **Recorded; anonymity; repeats.**
   - No sign-up and no tracking, at the IRB's request: "we do not track our participants in any way" **[read]**. Consequence stated by the authors: no longitudinal studies, no linking across studies, no automatic repeat detection **[read]**.
   - Repeats handled by self-report: the first questionnaire item asks "whether a participant has taken the test before"; those answering yes are "typically excluded" **[read]**. In one study 198 of 1,319 completions were repeats; repeaters were analysed separately and showed no main effect of prior exposure there **[read]**.
   - Demographics optional, to get honest answers: "we chose to make the questions optional wherever possible" **[read]**.
   - Scale: "Visitors completed 744,739 experimental sessions" (about 1,000 a day); unique people unknown because of no tracking **[read]**.
2. **Storage, retention, access.** Not described in the paper **[gap]**.
3. **Consent, IRB.** Informed-consent page at the start of every study; the research goal is disclosed even when the slogan is a hook: "Our primary research interest was clearly revealed in the informed consent form" **[read]**. Studies are designed "to be appropriate for minors" because anyone can join **[read]**.
4. **Publication.** Results published as papers; a public dataset page is my memory **[unverified]**.
5. **Outside access.** Not described in the paper **[gap]**.
6. **Data-quality problems and remedies.**
   - End-of-study, non-judgemental questions on distractions, technical trouble, cheating; open comment box; "About 5% of participants" leave comments **[read]**.
   - Exclusions: 166 sessions where the stimulus was not shown for 500 ms plus 75 self-reported problems = 2.2% of 10,976; 2.3% in the 42,171 set; 7.6% of 1,319 for cheating or technical trouble; 15.2% of blocks dropped for extreme response-time outliers (distraction, up to 1.5 min) **[read]**.
   - Dishonest demographics happen even when optional: "I said I was 99." **[read, participant comment]**.
   - Answer-sharing risk: they give a summary result, and "the full answer key" only on email request **[read]**.
   - Sample: about 73% in or done college; "not representative of the general population" **[read]**.
   - Device/environment noise: pop-ups, pets, other people (comments) **[read]**.
7. **Legal / reputational.** None found.

## 3. The Moral Machine (MIT Media Lab; Awad et al. 2018, *Nature* 563, 59–64)

Sources: MIT DSpace record https://dspace.mit.edu/handle/1721.1/125065 **[read: abstract only; PDF blocked]**; Nature page https://www.nature.com/articles/s41586-018-0637-6 **[blocked by login redirect]**; paper text, reporting summary and repository records **[search summary only]**; Bigman & Gray (2020) *Nature* 579, E1–E2 and Awad et al. reply https://www.nature.com/articles/s41586-020-1988-3 **[search summary]**.

1. **Recorded; anonymity; repeats.**
   - 40 million decisions, 10 languages, 233 countries and territories (DSpace abstract) **[read]**.
   - 13 dilemmas per session (12 sampled from about 26 million combinations); country from IP geolocation; an optional demographic survey answered by about 492,921 users **[search summary]**.
   - Repeats: argued away by design (the same dilemma twice is improbable); released data carry "anonymized IDs" **[search summary]**; how IDs were made (cookie?) not found **[gap]**.
2. **Storage, retention, access.** Not found **[gap]**.
3. **Consent, IRB.** MIT IRB approval is stated only by Wikipedia **[search summary, secondary]**.
4. **Publication.** One-off release with the paper: individual-level (anonymized IDs) and country-level data, for "follow-up research" (Exeter repository record) **[search summary]**; reuse papers point to osf.io/3hvt2; about 7.6 GB compressed, main CSV 70.3 million rows **[search summary]**. No regular release cadence found.
5. **Outside access.** Open download. Licence: a 2025 benchmark paper (SimBench) says "no formal open license is declared" **[search summary]**.
6. **Data-quality problems.**
   - Responses over 30 minutes excluded (33,838 of 39.6 M); the rule was "established after collecting the data" (Nature reporting summary) **[search summary]**.
   - Countries analysed only with at least 100 participants **[search summary]**.
   - Sample skewed: mostly male, college-educated, 20s–30s; demographics for only part of users **[search summary]**.
   - IP geolocation vs VPNs raised by a reader, unanswered **[search summary]**.
7. **Reputational trouble.**
   - Bigman & Gray (2020): the forced choice had no "treat equally" option; with that option most people chose it, so forced choice "does not reveal true wishes" **[search summary]**. The authors' reply accepted that the measure shapes the result **[search summary]**.
   - Nature correspondence (2019): "'Moral machine' experiment is no basis for policymaking" (https://www.nature.com/articles/d41586-019-00766-x) **[title only, search result]**.

## 4. Pavlovia (PsychoPy hosting, Open Science Tools Ltd) and Gorilla (Cauldron Science)

### Pavlovia
Sources: PsychoPy forum thread "Server and data storage security?" https://discourse.psychopy.org/t/server-and-data-storage-security/17978 (developer reply, 10 Nov 2020) **[read]**; forum threads on server move and datacenter fire **[search summary]**.

1. **Recorded; anonymity; repeats.** Whatever the researcher's experiment saves; the platform itself: "we don't store PII like IP addresses on your behalf"; IPs sit in security logs and "aren't combined with participant data" **[read]**. De-duplication is the researcher's job (e.g. recruiter IDs in the URL) **[unverified]**. Data saved as CSV in the project's GitLab repository or in a database **[unverified]**.
2. **Storage.** Datacenter with ISO 27001; admin access to the server "currently only 2 people" **[read]**. Privacy page once said UK hardware under UK law; in 2021 the site and all data moved to a server in France; later the developers said the servers are in OVH's Strasbourg datacenter **[search summary]**. A forum user asked for the privacy page to be updated after the move; no confirmation it was **[search summary]**.
3. **Consent, IRB.** Researcher's own institution; Pavlovia is "happy to sign privacy and data-sharing agreements", offers HECVAT-type documents **[read]**; University of Michigan published its signed DPA **[search summary]**.
4.–5. **Publication / access.** None by the platform; researcher downloads data **[unverified]**.
6. **Quality.** Not covered by what I read.
7. **What went wrong.** "Pavlovia is currently down: fire at datacenter" (OVH Strasbourg); the Pavlovia building was not hit, but the service went down **[search summary]**. Lesson: one datacenter = one point of failure; privacy pages lag behind infrastructure changes.

### Gorilla
Source: Gorilla "Due Diligence" support page https://support.gorilla.sc/support/due-diligence **[read; no page date, contains "2020 Update" and "2021 Brexit Update" sections, so parts may be stale]**.

1. **Recorded; anonymity; repeats.** Two IDs: a Public ID to track the participant, and "The Private ID is randomly generated by Gorilla and stored separately" from it **[read]**; identity, demographics and performance kept in separate stores (BPS requirement) **[search summary]**. "Gorilla does not collect or store IP addresses by default" **[read]**.
2. **Storage.** "hosted on Microsoft Azure within the EU (Republic of Ireland)"; "Our backups are located in the Netherlands" **[read]**. "Deleted data is cleared from our backups within 14 days" **[read]**. Access "based on least-privilege"; TLS on all traffic **[read]**. Gorilla is processor, the researcher is controller **[read]**.
3. **Consent, IRB.** Template text for ethics applications; anonymous data: "once data is collected it cannot be deleted as it cannot be identified"; withdrawal during the study "by closing their browser" **[read]**. A unique non-identifying key per participant is offered as the way to allow later withdrawal **[search summary]**.
4.–5. **Publication / access.** Researcher exports spreadsheets; none by the platform **[search summary]**.
6. **Quality.** Timing differs by browser and device (Anwyl-Irvine et al. 2021, *BRM* 53, 1407–1425, read by another session, see `docs/research/vr/06-science.md` §8) **[read earlier, not this session]**.
7. **Trouble.** None found.

## 5. Many Labs and the Psychological Science Accelerator (PSA)

Source: Moshontz et al. (2018), "The Psychological Science Accelerator: Advancing psychology through a distributed collaborative network", *AMPPS* 1(4), 501–515, https://pmc.ncbi.nlm.nih.gov/articles/PMC6934079/ **[read, first 100,000 of 128,521 characters]**. Many Labs papers **[not opened this session]**.

1. **Recorded; anonymity.** Per study protocol; "each lab's data and final materials are anonymized" before sharing **[read]**.
2. **Storage.** "on the OSF by default or on another independent repository" **[read]**.
3. **Consent, ethics.** "All PSA projects require pre-registration of the research" **[read]**; Stage 1 Registered Report encouraged, not required **[read]**. Ethics is local at every site with central help: "the Ethics Review Committee aids and oversees securing ethics approval at all study sites"; labs adapt template ethics materials **[read]**. "Different countries and institutions have different guidelines and requirements" **[read]**. The director recalled sending one study to about 120 IRBs with widely different responses (SPSP interview) **[search summary]**.
4. **Publication.** "all data, analytic code and meta-data are posted in full" **[read]**. Phased release: an exploratory part first, then "the remaining 'test' dataset is released several months later" **[read]**. A separate Data Management Bylaws preprint exists (Forscher et al. 2019, doi:10.31234/osf.io/buqyc) **[citation only]**.
5. **Outside access.** Open: "anyone can use PSA-generated data to make such discoveries" **[read]**; new studies come in by proposal: "Proposing authors submit a description of the proposed study" **[read]**.
6. **Quality.** Procedural fidelity checks across sites, back-translation, a team that reviews analysis code **[read]**. Labs concentrated in "North America and Europe" **[read]**.
7. **Trouble.** Funding limits; coordinating "hundreds of people is difficult" **[read]**.
- Many Labs: ML1 (Klein et al. 2014, *Social Psychology* 45, 142–152; 36 samples, about 6,300 people, run largely on Project Implicit's infrastructure) and ML2 (Klein et al. 2018, *AMPPS* 1, 443–490; 28 effects, 125 samples, about 15,000 people, preregistered, data and code on OSF) **[unverified, from memory]**.

---

## What this means for us

### Where we stand (from the repo)
- One row per finished run in `app.runs`: `id`, `created_at` (full timestamp), `room`, `version`, `first_run` (local flag), `report` (whitelisted numbers and answers incl. optional gender, age group, "knew"). Insert-only `submit_run`; `compare_room` returns aggregates only when a condition has at least 10 first runs. Playtests and errors in separate tables. EU (eu-west-1, Ireland). Retention: indefinite. No player id. Science use: "only after ethics approval and only with separate consent" (privacy.html).
- **Conflict found:** `docs/methodology.md` (line 13) says "Store the raw event stream (ms timestamps) next to the derived report"; `privacy.html` says exact action times are not sent. One of them must change before the codebook is written.
- **Missing per row:** the consent-text version, device class (only playtests have it), a duration or duration bucket, and the self-report quality items (interrupted? was that what you meant?).

### The common end-to-end path (what the five platforms do between them)
1. **Record** one row per session with: study and version, condition, repeat status (self-report or flag), answers, derived scores, optional demographics, self-reported quality items (LabintheWild; Project Implicit publishes computed scores, not raw traces).
2. **Store** in one region with a backup copy elsewhere (Gorilla: Ireland + Netherlands backups), least-privilege access, no IPs with the data (Gorilla, Pavlovia), rows never edited.
3. **Check quality** with rules fixed before data (PSA preregistration; Moral Machine's after-the-fact 30-minute rule is the counter-example): self-report distraction/cheating, technical checks, outliers. Flag; don't delete. Expect 2–8% session exclusions (LabintheWild) and more at home in VR (about 13% inattentive, Mottelson et al. 2021, in 06-science).
4. **Aggregate** with a minimum cell size (Moral Machine and LabintheWild: at least 100 participants per country for country analyses; Project Implicit strips postcodes from public files).
5. **Report** regularly. Project Implicit's per-year files are the model for yearly reports; monthly is an internal practice I did not find documented anywhere **[gap]**.
6. **Publish** frozen, versioned files with a codebook that records variable changes over time, an errata log, a citable data paper or DOI, and a stated licence (Project Implicit; PSA posts data + code + metadata on OSF).
7. **Give scientists access** in up to three tiers: open download of anonymous data; finer fields only with the requester's ethics approval (Project Implicit zip-level); and a proposal route for new studies on the platform (PSA). PSA also holds back a confirmatory "test" part for months.

### Decisions to take now (expensive to change later)
1. **Consent wording for research use, plus a consent version on every row.** Today's text promises science use only with a future, separate consent. Rows collected under it may never become science or open data. Decide whether "with recording" covers anonymous research use and open publication. Then store `consent_version` with each run, so every row knows which wording it was collected under. (PSA: ethics at every site; LabintheWild: research aim in the consent form.)
2. **Ethics approval first, then the data that counts.** LabintheWild's IRB shaped its whole design (no tracking), and PSA needs approval at every site. Get a partner's approval before the data meant for papers is collected. Retrospective approval is often refused **[unverified, general practice]**.
3. **Identity and repeats.** Choose either no ids with self-report repeats (the LabintheWild model, approved by an IRB and matching our local flag and "knew" item), or a random device token (pseudonymous under WP29, which changes the privacy page and the "anonymous" claim). Switching later breaks comparability and the privacy promise. Recommended: stay id-less. Keep the local first/repeat flag and add "played this room before on any device?". By default, analyse and publish first runs only (as `compare_room` already does).
4. **Level of detail.** Choose either derived numbers only or the raw event stream; this is the methodology vs privacy conflict above. Also coarsen `created_at` to the date or hour. Monthly and yearly reports don't need seconds, and full timestamps can be linked to provider IP logs (GDPR Recital 26, "means reasonably likely").
5. **Drop-out per condition.** We send only at the end, so per-condition drop-out is invisible (06-science: Steed 2016, Mottelson 2021 report it). Decide whether a consented minimal "started" row exists. It has to be in the consent text from the start.
6. **Exclusion rules and quality items before data.** Add to every room the end-of-room items LabintheWild relies on (interrupted? technical trouble? did it do what you meant?). Write the exclusion rules into the preregistration. Apply them as a versioned view or flag table, never by deleting rows. Bots: the anon key is public, so plausible fake rows are possible. None of the five sources reported bot problems **[gap]**. Add internal-consistency checks in `submit_run` and flags at analysis.
7. **Codebook per room version, written before the version goes live, plus an errata log.** Project Implicit's 0–10 vs 1–11 recode and its missing months show that errors will happen. Documentation is what lets users catch them.
8. **Retention and backups.** Indefinite keeping of anonymous research data is the norm (Project Implicit since 2002). Still, write it down, and keep a second copy outside Supabase (Pavlovia's datacenter-fire outage; Gorilla's backups in another country). Keep privacy.html in sync with any region or provider change (Pavlovia's page lagged after its move).
9. **Licence and terms of use, fixed before the first release.** Moral Machine's data had no formal licence, and Project Implicit mixes a CC0 label with "non-commercial" and "no re-identification" terms. Pick one: CC BY 4.0 (credit, simple) or CC0 plus a citation request. Add a "do not attempt re-identification" norm, and mint a DOI for each yearly snapshot.
10. **Minimum cell sizes for anything public.** In-game we use 10; for published tables (age group × gender × room × version × condition) pick a higher threshold and suppress smaller cells. Moral Machine and LabintheWild used 100 per country.
11. **Hold-out for confirmatory tests (PSA).** If scientists will test hypotheses on our data, decide before the first public release which part stays unreleased until preregistrations are in.
12. **Say what the measure could not capture.** Moral Machine's forced choice was attacked because "treat equally" was not offered. Every room's codebook states the answer options and the deviations from the paper. Results say "other players" (LabintheWild: 73% college; Moral Machine: young men; home Quest owners 86% male per Mottelson 2021).

### Gaps
- Moral Machine Methods, consent and ID mechanism not read (paywall; DSpace PDF blocked). Project Implicit IRB, consent, hosting and repeat item not read (OSF pages empty to the fetch tool). Many Labs papers not opened. LabintheWild's data-sharing page not checked. No source found on bot attacks at any of the five platforms, or on monthly reporting practice.
