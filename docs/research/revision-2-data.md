# Tool revision, area 2 of 5: data, server and data-protection law (research pass, 2026-10-10)

Rule: every claim has its link and a short quote; "unverified" = not read in the source itself; "our reading" = an
inference a lawyer must confirm. Builds on ethics-law.md (+ ethics-law-3.md), projects/data-platforms.md,
vr/06-science.md, study-methods-1..3.md, audit/premortem.md. Nothing installed; the live database not queried.
Quotes from Ukrainian and Russian laws are our translation; the originals are at the links.

Parts: L1 Ukraine law; L2 does the GDPR apply; L3 Russia 152-FZ; L4 head/hand traces; L5 timestamps and IP logs;
D1 consent version per row; D2 send after the reveal; D3 retention; D4 codebook; D5 per-room validation; D6 bots and
rate limits; D7 what science partners require; S1 backups; S2 live server vs migrations; S3 Supabase as processor;
S4 Supabase for later needs; S5 cost. The verdicts are in the table at the end.

## Findings

### L1. Ukraine (official texts, read 10.10)
- Law No. 2297-VI "On Personal Data Protection", https://zakon.rada.gov.ua/laws/show/2297-17 , edition "of
  14.06.2025". Art 2: personal data = about a person "who is identified or can be specifically identified";
  controller = "a natural or legal person who determines the purpose of processing" (the owner). Art 25(2) excludes
  only processing "exclusively for personal or household needs"; a public game is not that (our reading).
- Art 7(1): special categories include "biometric or genetic data". Art 9(1): notify the Ombudsman of processing that
  "poses a special risk" "within thirty working days from the start of such processing". Regulator (Art 22-23):
  "1) the Commissioner; 2) the courts" (the Parliament Commissioner for Human Rights). Art 11(1): grounds incl. consent
  and legitimate interests. Art 8(2): right to object and to demand "change or destruction". Art 6(8): "no longer
  than necessary for lawful purposes"; further processing "for historical, statistical or scientific purposes".
- Art 29 (cross-border): adequate = "member states of the European Economic Area, and states that signed the Council of
  Europe Convention" (No. 108): Ireland qualifies; also with the person's "unambiguous consent".
- "Special risk", the Ombudsman's clarification (official PDF, read in full, saved objekt-files/papers/ombudsman-2014.txt,
  https://www.ombudsman.gov.ua/storage/app/media/uploaded-files/rozyasnennya__3.pdf): the list includes "biometric
  data" and "location and/or routes of movement of a person"; biometric examples: "a digitised image of the face,
  digitised fingerprints, a digitised retina pattern"; "routes" = where a person is at a given time (cash machines,
  phone billing), not motion inside a virtual room (our reading).
- Our reading: our anonymous derived numbers are not personal data (Art 2); raw tracks or voice would be, and arguably
  "biometric" -> notice within 30 working days. Lawyer: does the law reach a Ukrainian person whose players are
  abroad (no territorial article found).
- GDPR-aligned bill No. 8153: adopted "as a basis" in first reading, to align with "Regulation (EU) 2016/679", with
  "financial liability, administrative-economic sanctions" (Rada committee, 25.11.2024,
  https://comeuroint.rada.gov.ua/news/main_news/75033.html); Cabinet page: "Being prepared for the second reading"
  (https://www.kmu.gov.ua/bills/proekt-zakonu-pro-zakhyst-personalnykh-danykh). Passed by 10.10.2026: unverified.

### L2. Does the GDPR apply? (EDPB Guidelines 3/2018, v2.1, read in full, saved objekt-files/papers/edpb-2019.txt,
https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_3_2018_territorial_scope_after_public_consultation_en_1.pdf)
- The EU region alone does not pull the owner in: a non-EU controller "will not become subject to the GDPR simply
  because it chooses to use a processor in the Union"; Supabase has its own processor duties.
- Offering (Art 3(2)(a)) counts "irrespective of whether a payment ... is required"; "mere accessibility" is
  "insufficient"; signs: "a language or currency of one or more EU Member states", "an international clientele".
  Our reading: Russian-only and free = weak targeting; an English version, euro prices or EU store sales = targeting.
- Monitoring (Art 3(2)(b)): "implies that the controller has a specific purpose in mind"; key is "the tracking of
  natural persons on the Internet, including ... profiling". Recording behaviour for analysis could count if the data
  are personal (our reading).
- If it applies: an EU representative unless processing is "occasional" ("not carried out regularly"); a game that
  records every run is not (our reading); the representative is named in the privacy notice (EDPB example 24).
- The way out, already in our design: Recital 26, the rules do "not apply to anonymous information" (ethics-law-3.md).

### L3. Russia, 152-FZ
- Read earlier (ethics-law.md 4c): Art 3(1) personal data; Art 18(5) Russian citizens' data "using databases located
  outside the territory of the Russian Federation is not allowed"; Art 22(1) notify Roskomnadzor "before starting to
  process"; Art 12(3) notice before cross-border transfer. Targeting: only via a law firm's summary of the 2015 Ministry
  clarification ("only if they conduct activity targeting Russia"; signs "a Russian language version", roubles,
  advertising); Roskomnadzor's FAQ is region-blocked for our tools and the browser pane: unverified.
- Fines, Administrative Code Art 13.11 (edition of 04.08.2026, read in the browser pane,
  https://www.consultant.ru/document/cons_doc_LAW_34661/1f421640c6775ff67079ebde06a7d2f6d17b96db/): part 8 (localisation)
  citizens "from thirty thousand to fifty thousand roubles", legal entities "from one million to six million roubles";
  part 9 (repeat) legal entities "from six million to eighteen million"; part 10 (no notice "of the intention to
  process", law 420-FZ of 30.11.2024) citizens 5,000-10,000, legal entities 100,000-300,000; individual entrepreneurs
  answer "as legal entities" (note 1).
- Our reading: a Russian-language game promoted in Russian communities is the textbook targeting case; so store NO
  personal data of players (then Art 3(1) is not met). Enforcement against a person abroad: not researched.

### L4. Head and hand traces
- Read in full earlier (ethics-law-3.md 4b): Nair et al. 2023, 55,541 users, "94.33% accuracy from 100 seconds of
  motion"; Miller et al. 2020, "95% of users" of 511. GDPR Art 4(14): biometric = "specific technical processing" that
  "allow or confirm the unique identification"; special category only "for the purpose of uniquely identifying"; UK
  ICO the same (own-experiments-now-2.md). 152-FZ Art 11(1): features "on the basis of which his identity can be
  established". Ukraine: biometric is special (Art 7(1)).
- Verdict (our reading): raw tracks are personal data under all three laws; "biometric" only if used to identify, but
  Ukraine's notice and Russia's written-consent rule make even the argument costly. Derived numbers are not traces.
  Keep: no trace leaves the headset.

### L5. Full timestamps and IP logs vs "anonymous"
- CJEU Breyer C-582/14 (https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62014CJ0582): a dynamic IP is
  personal data for a site operator "where the latter has the legal means which enable it to identify the data
  subject"; not reasonably likely only if "prohibited by law or practically impossible" (para 46).
- CJEU EDPS v SRB C-413/23 P, 4.9.2025 (https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62023CJ0413):
  pseudonymised data are not personal "in all cases and for every person" (para 86), but for whoever holds the means
  "still personal in nature" (para 76); judged "at the time of collection ... from the point of view of the
  controller" (para 111).
- Supabase edge logs (https://supabase.com/docs/guides/observability/log-field-reference) hold
  `request.headers.cf_connecting_ip`, `request.cf.city` and `request.path`; kept: "Pro plan users 7 days"
  (https://supabase.com/docs/guides/troubleshooting/check-usage-for-monthly-active-users-mau-MwZaBs); no switch to
  stop collection (https://supabase.com/docs/guides/platform/logs).
- Our server: `created_at` to the microsecond and an increasing `id` in every row (0001_runs.sql). Our reading: for 7
  days the owner can match a row to an IP by time or order in the dashboard: pseudonymous, not anonymous; after the
  logs expire nothing links it. privacy.html names the logs but calls the result "anonymous".
- Cheap fix now: date only (no time) and a random key instead of the ordered id, written by submit_run; privacy.html:
  "for up to 7 days our provider's logs could link it to your IP; after that it is anonymous". Lawyer: the wording.

### D1. Consent version on every row
- GDPR Art 7(1) (https://gdpr-info.eu/art-7-gdpr/): "the controller shall be able to demonstrate that the data
  subject has consented"; Art 7(3): "as easy to withdraw as to give consent"; Art 5(2): "be able to demonstrate
  compliance" (https://gdpr-info.eu/art-5-gdpr/). With anonymous rows the only proof is which text a row was
  collected under: a consent-version number in every row. Rows under "statistics only" can never become science
  (data-platforms.md, decision 1).

### D2. Send only after the reveal
- vr/06-science.md (sources read in full): APA 8.07(c) "permit participants to withdraw their data"; BPS IMR "A button
  at the very end of a study confirming consent"; Greenspan & Loftus 2022: "nine participants" withdrew after the
  debrief. Today the room sends before the reveal pages (06-science.md finding 3; premortem lens 2 #3).
- Verdict: "keep / discard my result" after the reveal; discard sends nothing.

### D3. Retention
- GDPR Art 5(1)(e): identifiable data "for no longer than is necessary", longer only "solely for ... scientific or
  historical research purposes or statistical purposes" under Art 89(1). Ukraine Art 6(8) the same (L1). Anonymous
  data: no limit (Recital 26). BPS Code 2021 (objekt-files/papers/bps-2021-code.txt, application template): data
  management "including retention, archiving, destruction and publishing open datasets"; "write a Data Management
  Plan (DMP)".
- Verdict: three clocks, written: provider logs 7 days; rate-limit records minutes (D6); anonymous rows without limit
  plus a frozen yearly snapshot.

### D4/D7. Codebook, and what science partners and ethics boards will ask
- Ask: preregistration before collection (OSF, AsPredicted; ethics-law.md 1e); approval documents at submission (PLOS
  ONE "prior approval"); a DMP (D3); vrprotocols: "csv with a codebook", head orientation "in a separate file",
  "Prevent Reidentification" (study-methods-3.md); APA 8.14(a) (objekt-files/papers/apa-ethics-code-2017.txt): after
  publication "do not withhold the data on which their conclusions are based", "provided that the confidentiality of
  the participants can be protected". Codebooks per version and an errata log: Project Implicit's recode errors
  (data-platforms.md, decision 7).
- De-identification standard: UK Data Service 2025 slides (read in full, saved objekt-files/papers/ukds-2025.txt,
  https://ukdataservice.ac.uk/app/uploads/introanonymisation2025-05-22.pdf): de-identified data stay "identifiable,
  hence data protection legislation applies"; anonymisation = risk "negligible", "generally by treating indirect
  identifiers"; techniques "recoding, banding, top/bottom coding, generalisation"; tools "sdcMicro" and "QAMyData".
  Our indirect identifiers: age group, gender, seated, device, date; check rare combinations before any public file.

### D5. Per-room validation
- Done by migration 0009 (applied 10.10): one JSON Schema per room version, supabase/schemas/01-control-1.json.
  Before it, submit_run held room 01's whitelist inline (0008_submit_run_age.sql, about 70 lines); nine rooms a floor
  would grow one function where an edit for one room can break another.
- https://supabase.com/docs/guides/database/extensions/pg_jsonschema : "validate ... json and jsonb data types
  against JSON Schema documents"; `jsonb_matches_schema(schema json, instance jsonb)`; "generally used in tandem
  with a check constraint". Best (our design): one JSON Schema per room version, loaded into a private table;
  submit_run looks it up and checks; the same file is the machine half of the codebook (D4) and what the test that
  pins client fields reads.

### D6. Bots and flooding
- Now one global count per table (120 a minute in 0008); a script can fill it and lock out real players (premortem
  lens 2 #5). https://supabase.com/docs/guides/api/securing-your-api : a pre-request function where "The
  private.rate_limits table records the IP address and timestamp of each write request", rejecting "more than 100
  write requests in 5 minutes"; it "only works with the Data API (PostgREST)".
- Conflict: that stores IPs. Our design: a keyed hash of the IP, deleted after 10 minutes, named in privacy.html as a
  security measure; which header to trust on our project: unverified. Plus the schema checks (D5) and an hourly
  row-count alert. With date-only rows (L5) the per-minute counts move to that short-lived table.

### S1. Backups (https://supabase.com/docs/guides/platform/backups)
- "Pro Plan projects can access the last 7 days of daily backups"; physical backups "are not available for direct
  download". PITR "depends on the recovery retention period": 7 days about $100/month, 14 days $200, 28 days $400.
- Our reading: same provider, up to a day lost, nothing in our hands. Missing: our own logical dump (CLI or pg_dump)
  kept with objekt-files (F: and Google Drive). PITR is not worth $100/month for a few insert-only rows a day.

### S2. Live server vs supabase/migrations
- https://supabase.com/docs/reference/cli/supabase-db-diff : `db diff --linked` "Diffs local migration files against
  the linked project" using a shadow database "in a separate container" (Docker: not on the laptop); `migration list`
  "Lists migration history in both local and remote databases" ("Only the timestamps are compared"). Whether 0001-0008
  are recorded in the remote history: unverified.
- Best (our design): a GitHub Actions job (its runner has Docker) running the diff weekly and on each migration, the
  database password as a GitHub secret; a non-empty diff fails. The same job makes the weekly dump (S1).

### S3. Supabase as processor (https://supabase.com/docs/guides/security/gdpr-compliance)
- A region "does not make your application GDPR compliant on its own"; "Backups, logs, data exported to external
  systems" matter; "you're responsible for your application's data processing activities, consent flows, and access
  controls". The DPA ("Request or view the DPA", supabase.com/legal/dpa) is a legal page, outside the docs we may read:
  unverified (owner).

### S4. Supabase for later needs
- Realtime, Pro (https://supabase.com/docs/guides/realtime/limits): "Concurrent connections" 500, "Messages per second"
  500 (2,500 without spend cap), presence 50/s; "All limits are configurable per project". Billing
  (https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages): broadcast = "one message sent plus
  one message per subscribed client"; 5 million a month included; "$2.50 per 1 million messages".
- Our arithmetic: two live players sending head and hands to each other at 20 Hz = 80 messages/s; a 10-minute room
  48,000; 5 million = about 100 pair-sessions a month, then about $0.12 each; 500/s = about 6 pairs at once. So Realtime
  fits lobbies and signalling; pose goes peer to peer: WebRTC "bidirectional peer-to-peer transfers of arbitrary
  data", "Widely available" since January 2020 (https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel),
  which also keeps motion off our server. Peers seeing each other's IP: unverified, to check at that design.
- Edge Functions (https://supabase.com/docs/guides/functions/limits): "Maximum Memory: 256MB", "Maximum CPU Time: 2s",
  paid wall clock "400s": enough for a consent check, a captcha check or an export. Analytics: SQL views and exported
  files suffice at our size; no case found for another service.

### S5. Cost (https://supabase.com/docs/guides/platform/manage-your-usage/compute)
- "Paid plans include $10 in Compute Credits" covering "one project running on the Micro/Nano Compute size"; Micro
  "~$10" a month; its worked example adds the Pro plan fee of $25 (wording not quoted: seen through the fetch tool's summary). Our arithmetic: about $25/month now and after five rooms;
  extra only for PITR, log drains or a second project. What grows with rooms is the rework cost, not the bill.

### Outside this area, flagged for the owner (one finding)
- Ukrainian language law No. 2704-VIII, Art 27 (read in the browser pane, https://zakon.rada.gov.ua/laws/show/2704-19/print):
  (1) a program "with a user interface distributed in Ukraine" must have it "in the state language and/or English, or
  other official languages of the European Union"; (6) websites of businesses "registered in Ukraine" selling there
  are "in the state language", other versions allowed, the Ukrainian one loading "by default for users in Ukraine".
  A Russian-only game run by a Ukrainian owner: a lawyer's question (our translation; our reading).

## Verdicts (now -> best; why; cost now vs after five rooms; owner)

| Choice | Now | Best | Verdict | Why | Cost now / after 5 rooms | Owner |
|---|---|---|---|---|---|---|
| Server | Supabase Pro, eu-west-1 | same | KEEP | private schema + insert-only RPCs fit; EEA is "adequate" for Ukraine (L1); about $25/month (S5) | 0 / a move later = rewrite of results.js and all migrations | nothing |
| What is sent | derived numbers, no traces | same, plus a test that no submit takes arrays | KEEP | traces identify (L4) and pull in three laws | 1 test / same | nothing |
| Time and order | microsecond `created_at`, ordered `id` | date only, random key | CHANGE | 7-day IP logs make rows linkable (L5) | 1 migration / same, but rows already stored stay linkable for 7 days only | word on the wording |
| "Anonymous" wording | "anonymous" | "anonymous after 7 days; provider logs IP" | CHANGE | Breyer, SRB (L5) | text / same | decision A, lawyer |
| Consent version | none | a number in every row | ADD | Art 7(1), science later (D1) | 1 field / rows without it never usable for papers | decision B |
| Send moment | before the reveal | keep/discard after the reveal | CHANGE | APA 8.07(c), BPS (D2) | 1 screen / 5 rooms changed | nothing |
| Validation | JSON Schema per room version (migration 0009) | same | KEEP | pg_jsonschema (D5) | 1 room rewritten / 5 rewritten and a shared function at risk | nothing |
| Codebook | none | schema file + human page + errata per version | ADD | APA 8.14, vrprotocols, UKDS (D4/D7) | 1 / 5 written after the fact | nothing |
| Bots | one global count | hashed-IP limit + schema checks + alert | CHANGE | lock-out risk (D6) | 1 migration / same | decision C |
| Backups | 7 daily at Supabase | + weekly own dump, no PITR | ADD | same provider only (S1) | a GitHub job / same | adds the DB password as a GitHub secret |
| Drift check | none | GitHub job `db diff --linked` | ADD | S2 | same job / same | same secret |
| Retention | rows without limit, logs unwritten | three clocks written | CHANGE (text) | Art 5(1)(e), BPS DMP (D3) | text / same | nothing |
| Live players | none | Realtime for lobby, WebRTC for pose | LATER | limits and price (S4) | 0 / 0 | nothing now |
| Supabase DPA | not checked | read and keep a copy | ADD | S3 | 10 minutes | opens the legal page |
| Ukraine law | not researched | controller under 2297-VI; notice only if traces/voice | KEEP design | L1 | 0 / 0 | lawyer (decision D) |
| GDPR | assumed | weak today; English or EU sales -> representative if any personal data | KEEP design | L2 | 0 / a representative if personal data | decision D |
| Russia | anonymous only | never store personal data of players | KEEP design | L3 | 0 / localisation and fines if broken | nothing |

## Decisions for the owner (real options; my pick and why)
A. What "anonymous" means on the privacy page: (1) date only + random key + "your provider's logs may link a result
   to your IP for up to 7 days, then it is anonymous" (pick: true, cheap, keeps the word); (2) keep exact times and
   call the results "pseudonymous" (more science detail, weaker promise, GDPR applies in full while logs exist).
B. Whether results may become science: settled by the owner on 10.10 (docs/owner-decisions.md, "What the game
   keeps"): first the player's own profile and anonymous numbers, science later and only on a separate consent of
   the player (his words are quoted there). The option of a research clause in today's consent is closed.
C. Bot defence: (1) a hash of the IP kept 10 minutes for a per-source limit (pick: stops lock-outs; named as a
   security measure); (2) no IP at all: global limit + schema checks + alert (purest, a script can still lock out).
D. A lawyer, when: (1) one consultation with a Ukrainian data-protection lawyer now, before testers (controller
   identity on the privacy page, Ukrainian scope, the language-law question, wording of A and B); (2) at the English
   version or the first paid floor, when GDPR targeting starts. Price: not researched.

## What to do first (after his word; main untouched)
1. Done 10.10, migration 0009: date-only time, random key, consent-version field, JSON Schema validation for room 01,
   hashed-IP limit; written and reviewed on a branch, applied on his word.
2. The client: keep/discard after the reveal, consent version sent; the test that pins fields reads the schema.
3. privacy.html and the consent text after A and B; the three retention clocks.
4. The GitHub job: weekly logical dump + `db diff --linked` (he adds the secret).
5. Codebook for room 01's current version from the schema; errata log.
6. He opens the four owner links below; the lawyer per D.

## Not reached / unverified
- Bill 8153 status in 2026; its regulator. Roskomnadzor's own targeting criteria (region block). Enforcement against a
  person abroad (Russia, Ukraine). Supabase DPA text. Which header carries the real IP on our project. Whether WebRTC
  exposes peers' IPs. EU-representative prices. Lawyer fees. Captcha options (Cloudflare Turnstile) not opened.

FOR THE OWNER (pages only he can open):
- https://supabase.com/legal/dpa : the Data Processing Addendum: does it bind his organisation, is a signature needed.
- https://supabase.com/dashboard/project/rkvdwzlymmewsxjysgma/database/migrations : are 0001-0008 listed (login).
- https://rkn.gov.ru/treatments/chasto-zadavaemye-voprosy/zashchita-prav-subektov-personalnykh-dannykh/ : answers on
  foreign operators and sites aimed at Russia (region block).
- https://itd.rada.gov.ua/billInfo : bill 8153, its stage in 2026 (the card did not load for our tools).

## Checked by the owner (10.10)
- Supabase's Data Processing Addendum (version 1, August 1, 2026; text pasted by the owner from
  https://supabase.com/legal/customer-resources/data-processing-addendum): it "supplements and forms part of the
  Supabase Terms of Service" and "is effective as of the Effective Date of the Agreement"; "acceptance of the
  Agreement shall have the same effect as signing the SCCs". No separate signature: it binds his organisation. Roles:
  "Supabase acts as a processor/service provider, and Customer as controller/business". Its biometric data is data
  "used to identify a natural person"; security incidents are notified "where feasible, within forty-eight (48) hours".
- The live migration history (his dashboard screenshot): 0002 to 0008 listed with their dates, 0001_runs at the foot
  of the list: the server's history matches supabase/migrations.
