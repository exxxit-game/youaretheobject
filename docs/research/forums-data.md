# Practitioners on anonymous results into Supabase / public-key Postgres (shelf 2)

> Kept as the helper wrote it on 11.10.2026 for the revision (docs/audit/revision.md): practitioners on anonymous results in Supabase, abuse, hashed IPs, withdrawal, ethics approval (shelf 9). Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


Started 2026-10-11. Every point: link, date, short exact quote, author's visible experience,
weight (a) several / (b) one / (c) contradicted; pre-2023 = possibly stale. One line: our setup.

## Parts
1. RLS and insert-only functions with the anon key: what went wrong for people
2. Abuse: bots, spam, rate limits, captcha-free defences
3. Is a hashed IP personal data; keeping it 10 minutes
4. Consent and withdrawal for anonymous data (can an anonymous player withdraw?)
5. Per-player profiles on the device vs the server
6. Ethics approval for an independent team (no university)
7. Monitoring the database (advisors, logs)

## Findings

### 4. Consent and withdrawal (library first)
- BPS, Ethics Guidelines for Internet-mediated Research (2021), library objekt-files/papers/bps-2021-imr.txt
  (lines 204, 210). Author: the British Psychological Society (professional body guideline, not a forum). (a) as a
  guideline. Quotes: retrospective withdrawal may need "additional mechanisms for storing large data sets in ways that
  would identify (to the researcher only) individual contributions"; "they should ask participants to provide a
  memorable code or ID number"; time limit reasonable "where, for example, aggregate data may be produced";
  "A button at the very end of a study confirming consent to use the data".
  Ours: no withdrawal key in app.runs (0009_data_protection.sql: random uuid, no code shown to the player); the
  "keep / discard after the reveal" plan is in revision-2-data.md D2. Differs: no retrospective withdrawal path.

### 1. RLS and the anon key: what went wrong
- Matt Palmer (and co-authors), "Statement on CVE-2025-48757", 2025-05-29, https://mattpalmer.io/posts/statement-on-CVE-2025-48757/ .
  Author: "DevRel & Product", ran the scan himself. (a) echoed by many write-ups. Scanned 1,645 Lovable projects:
  303 vulnerable endpoints in 170 projects (10.3%); unauthenticated reads of user data and API keys, writes on one.
  Quote: "misaligned RLS policies between the client-side logic and backend enforcement frequently result in
  vulnerabilities"; the scanner "merely checks for the existence of any RLS policy, not its correctness".
  Ours: no table is reachable by anon; tables have RLS on and `revoke all ... from public, anon, authenticated`
  (0009_data_protection.sql), the only path is `grant execute ... to anon` on submit_* functions. Matches the lesson
  (no reliance on a policy's correctness), but the functions are the new surface (see below).
- Khaled Hassan, DeepStrike, "Hacking thousands of misconfigured Supabase instances at scale", 2025-09-21 (updated
  2026-07-27), https://deepstrike.io/blog/hacking-thousands-of-misconfigured-supabase-instances-at-scale . Author: a
  penetration tester writing from a client engagement; numbers are an estimate ("hundreds to thousands"), no method:
  (b). Quote: a "view or function that selects from that table must also have RLS"; RLS enabled with no policy:
  "by default nobody" can read or write. Ours: matches (no select path for anon at all).
- Secondary, unverified against the original: UpGuard (2026) >16,000 readable Supabase databases among ~300,000
  domains, via https://startwithidentity.com/blog/2026-09-28-16000-supabase-databases-readable-because-row-level-security-was-off.md
  (not opened; the UpGuard original not read).

- seandy (WeWeb community member), 2026-04-23, https://community.weweb.io/t/bug-feature-request-supabase-insert-action-always-sends-select-with-no-way-to-disable-it/21104 .
  A builder of a public form on Supabase: the insert always adds `select=*`, so anon got 42501; he "had to add a
  SELECT RLS policy for `anon` users", "a security concern since it exposes rows to unauthenticated users". Staff
  reply 2026-04-24: a feedback ticket only. (b). Lesson: insert-only via RLS breaks when a client asks for the row
  back; people open SELECT to fix it. Ours: no table policy for anon, `returns void` functions only
  (0009_data_protection.sql): the trap cannot arise.

### 2. Abuse, rate limits, which IP to trust
- jacobrobertsbaca, "Is `x-forwarded-for` safe?", Supabase GitHub discussion #34647, 2025-04-02,
  https://github.com/orgs/supabase/discussions/34647 . A developer testing it himself; no Supabase reply
  ("Unanswered"). (b). Found the docs' header "can be spoofed": a client-sent value arrives first,
  `x-forwarded-for: spoofed,68.65.164.215`, while `cf-connecting-ip` held the real IP. His question "is this header
  reliable?" unanswered. Ours: 0009_data_protection.sql reads cf-connecting-ip and ignores X-Forwarded-For, the same
  conclusion; our comment says arrival "not yet seen": this thread is one outside observation that it arrives in
  request.headers on Supabase's hosted API (unverified on our project).
- GaryAustin1 (Supabase "Collaborator", long-time community answerer), discussion #27002, answer 2025-03-30,
  https://github.com/orgs/supabase/discussions/27002 : "Yes you can get the ip address if the call is to the
  database", via `current_setting('request.headers', true)`. (b). Ours: same mechanism (app.allow).

- Rodrigo Mansueli "for Supabase" (Supabase support engineer, published under the Supabase org on DEV),
  "Rate limiting Supabase requests with PostgreSQL and pg_headerkit", 2023-09-05 (edited 2024-02-07),
  https://dev.to/supabase/rate-limiting-supabase-requests-with-postgresql-and-pgheaderkit-409j . (b), 2023.
  A pre-request function logs IP + time in an UNLOGGED table, cap 5/minute as an example, entries over 12 hours
  deleted nightly; "Only log non-GET requests because they are run in read-only transactions". Stores the raw IP
  (`inet`); no privacy discussion. Ours differs on purpose: a keyed HMAC of the IP, deleted after 10 minutes, checked
  inside the submit functions, not a pre-request hook (0009_data_protection.sql, app.allow).
- younessquick, Supabase Discord via answeroverflow, ~2026-02 ("8mo ago" on 2026-10-11),
  https://www.answeroverflow.com/m/1474794234040029497 : asks "Is there any rate limit on DB / RPC calls in
  Supabase?"; the 5 replies are hidden behind a Discord join. Not read: unverified.

### 3. Is a hashed IP personal data; 10 minutes
- EDPB, Guidelines 01/2025 on Pseudonymisation (version for public consultation, adopted 2025-01-16),
  https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf (copy:
  C:\Users\admin\Downloads\objekt-research\). Official, not a forum: the yardstick the practitioners argue about.
  p.3: pseudonymised data "is therefore personal"; "Even if all additional information retained by the pseudonymising
  controller has been erased, the pseudonymised data can be considered anonymous only if the conditions for anonymity
  are met." p.24: suitable building blocks include keyed one-way functions "(like HMACs)". p.41 (example): IP
  addresses "transformed by a keyed cryptographic one-way function (provided the information contains sufficient
  entropy) or removed (otherwise)". Final version after consultation: not checked (unverified).
  Ours: app.allow keeps HMAC-SHA256(IP, secret key) 10 minutes (0009_data_protection.sql) = pseudonymous personal
  data for those minutes, not anonymous; the key sits in app.limit_key in the same database (so it is "additional
  information" held by us). privacy.html should call it a security measure on personal data, not "anonymous".
- Plausible Analytics (a company running cookieless analytics at scale), "Data policy", "Last updated: September
  2026", https://plausible.io/data-policy . (b) as a vendor's own claim. `hash(daily_salt + website_domain +
  ip_address + user_agent)`; "The salt is rotated and deleted every 24 hours."; "Raw IP addresses and User-Agent data
  are never stored." It does not say whether the hash is personal data. Ours: same family (secret key + IP), but
  shorter (10 minutes for the hash) and our key is never rotated: a fixed key means a hash from today equals one
  from next month, if any were kept; only the 10-minute delete prevents linking. Differs: rotation not done.
- rewis.io "Hashing, Encryption und Anonymisierung" (German legal-tech blog): Cloudflare check, not read
  (https://rewis.io/blog/hashing-encryption-und-anonymisierung/). Search snippet only says hashes are not
  anonymisation: unverified.

- Hacker News thread on Plausible's daily-salted hash, 2024-07-09..11, https://news.ycombinator.com/item?id=40912833 .
  Developers, none claims legal or DPO experience ("I am not a lawyer", janosd). (c) contradicted: number6 "IP
  Addresses are personal data. So the data and the hash is subject to GDPR."; dgroshev (cites Breyer) "IP addresses
  only allow to identify a natural person _when combined with other data_"; janosd "Legitimate interest still
  requires the data subject to be informed under Art 13." Ours: privacy.html must inform about the hash whatever
  its status (matches the Art 13 point if privacy.html names it; check the wording).

### 4 (cont.). Online-experiment platforms
- Jon (Jon Peirce, PsychoPy's author, posting the Pavlovia team's email), "Important: policy change on Pavlovia",
  2020-07-03, https://discourse.psychopy.org/t/important-policy-change-on-pavlovia-for/14778 . Pre-2023: possibly
  stale. (b) platform practice. Before: "when a participant closed the browser tab we treated that action as consent
  withdrawal" (no data saved); after: partial data saved, "by default this is turned on", per-project switch; he
  warns participants may need telling that quitting does not delete their data. Ours: a run is sent only when
  finished (submit_run takes a finished report; revision-2-data.md D2 plans "keep / discard" after the reveal):
  matches the old Pavlovia default (quitting = withdrawal).
- wakecarter (Wakefield Morys-Carter, the PsychoPy forum's most active helper), 2023-07-03,
  https://discourse.psychopy.org/t/participants-ip-addresses/35594 : "Pavlovia (including surveys) doesn't save
  participant IP addresses." (b), no documentation cited. Ours: we do not store IPs in rows either, only the
  10-minute HMAC (0009_data_protection.sql); Supabase's edge logs still hold the IP 7 days (revision-2-data.md L5).

- Loughborough University, Ethics Review Sub-Committee, "Questionnaires and Online Questionnaires" (no date; page
  copyright 2026), https://www.lboro.ac.uk/internal/research-ethics-integrity/research-ethics/guidance-investigators/questionnaires/ .
  An ethics committee's working guidance. CONTRADICTS BPS IMR on codes: "We do not recommend the use of unique or
  self-created codes to allow otherwise anonymous participants to withdraw their data." "Use of such codes means
  that the data collected is no longer anonymous". Withdrawal = "closing the browser during completion"; after
  submission "the data cannot be withdraw[n]". (c) vs BPS IMR line 204.
- Trinity College Dublin, Data Protection Office, "Anonymous research studies", updated 2024-11-26,
  https://www.tcd.ie/dataprotection/anonymousresearchstudies/ . "once submitted the survey cannot be withdrawn";
  "Always ensure that the survey tool is configured to not collect IP addresses and location data"; if truly
  anonymous "no data protection rights apply to the project". (a) with Loughborough, Smith College IRB, Aberdeen
  (search results, not opened). Ours: differs on the condition: Supabase's edge logs collect the IP and city for 7
  days (revision-2-data.md L5) and app.allow takes an IP hash, so the TCD "anonymous" route is not fully ours; our
  rows become anonymous only after the logs expire.

### 5. Profile on the device vs the server
- Pete LePage (Google Chrome DevRel), "Storage for the web", last updated 2024-09-23,
  https://web.dev/articles/storage-for-the-web . (b) official-practitioner. "Best effort means the storage can be
  cleared by the browser without interrupting the user"; "Persistent storage is not automatically cleared when
  storage is low"; Chromium evicts "clearing all site data from the least recently used origin first". Quest's
  browser is Chromium-based (not checked in Meta's docs here: unverified for Quest).
  Ours: the profile/flags live in localStorage (src/app/consent.js, left-early.js, lobby/opening.js,
  engine/results.js); no `navigator.storage.persist()` call in src (grep, 2026-10-11): a full headset could evict
  the player's profile silently. Differs.
- Scott (web-game developer moving games to itch.io), "Web browser game randomly losing localStorage data?",
  2025-10-26, https://itch.io/t/5464689/web-browser-game-randomly-losing-localstorage-data . (b). Saves gone "every
  half hour or so"; a reply: "The problem appears to be this 'ephemeral site storage' feature in Brave."; Scott:
  "I don't think this is being caused by itch." Lesson: local profiles vanish for reasons outside the game; the
  game must survive a missing profile. Ours: every read is wrapped in try/catch and defaults to 0/false (the files
  above): matches for robustness, but the player is not told his profile is device-only and can vanish.
- ePrivacy Art 5(3) covers localStorage regardless of personal data (search result summaries citing EDPB Guidelines
  2/2023; not opened here): the exemption is storage "strictly necessary" for a service the user asked for.
  Unverified in this pass. Ours: src/app/consent.js stores the consent form's name and signature in localStorage
  (`name: short(name), sign: short(sign)`): personal data on the device only; whether privacy.html names it: not
  checked.

### 6. Ethics approval for an independent team
- BPS Code of Human Research Ethics (2021), section 12 "Independent researchers seeking ethics review", library
  objekt-files/papers/bps-2021-code.txt line 477. Professional body. "Some university research ethics committees are
  open to receiving applications for review from researchers who are not affiliated in any way with the university";
  "some universities will charge for this service"; easier "by finding an academic member of a university who is
  prepared to join the research as a co-investigator"; also "larger charities and commercial organisations" with
  their own committees. Ours: no route chosen yet (owner-decisions.md: science only after ethics approval; "university
  partners"). Matches the plan; the route itself: open.
- BERA blog special issue, "Independent researchers: The challenges of accessing ethical approval", 2020-02-12,
  https://www.bera.ac.uk/blog-series/independent-researchers-the-challenges-of-accessing-ethical-approval . Carrie
  Birch and Sarah Hamilton (Independent Researchers' Forum, education). Pre-2023. Independent researchers are
  "unable to access an ethics panel for approval to carry out research"; "the gap faced by researchers working outside
  academic institutions". (a) with BPS.
- Ron Wallace PhD (a Solutions IRB board member, i.e. a seller of the service), Sage Research Methods Community,
  September 2022, https://researchmethodscommunity.sagepub.com/blog/independent-research-and-irb-reviews . Pre-2023,
  interested party: (b). A private IRB is the US route; "The researcher has a responsibility to determine whether or
  not IRB review and approval are required." No costs given.

- GfeW (Gesellschaft für experimentelle Wirtschaftsforschung), "Ethik" page (no date; mentions a 2025 survey file),
  https://gfew.de/ethik . A society's online ethics certificate: "Die Gebühr für ein Ethikzertifikat der GfeW im
  verkürzten Evaluationsverfahren beträgt 30 Euro" (members 25); but it "steht experimentellen Ökonominnen und
  Ökonomen zur Verfügung, die an Universitäten oder anerkannten Forschungseinrichtungen tätig sind": closed to an
  independent team. (b). Ours: not a route unless a university co-investigator joins (BPS route above).

- Ukraine: Institute of Social and Political Psychology (NAES of Ukraine), research ethics commission,
  https://ispp.org.ua/naukova-diyalnist/doslidzhennya/eksperimentalna-robota/ : a request "(Russian text: see the source) Google form), regulation "(Russian text: see the source) whether outsiders
  may apply, fees, time: not on the page (unverified; the regulation .docx not read).
- Ukraine: National Psychological Association, Ethics Committee, https://npa-ua.org/ethics/ : lists a "(Russian text: see the source) contact "(Russian text: see the source) ethics.npa@gmail.com). Review of non-members' studies: unverified (the regulation not read).
  Ours: no Ukrainian route recorded in docs/research (ethics-law.md checked only by title). Open.

### 1 (cont.) and 7. SECURITY DEFINER functions, grants, drift checks
- Michel Faure (director of a Paris ceramics school, builds its ERP himself; production system with personal data),
  "3 Supabase security incidents, one shared root cause", DEV, posted July 5 (2026; migrations dated 2026-05-11..13),
  https://dev.to/michelfaure/3-supabase-security-incidents-one-shared-root-cause-security-definer-inherits-execute-to-public-coa .
  (b) first-hand. "`EXECUTE` defaults to `TO PUBLIC` at `CREATE` time."; "Supabase defaults are not neutral — they
  add GRANTs the author never wrote."; "every migration ends with an explicit REVOKE block, or it lies about its
  invariants." Found 86 SECURITY DEFINER functions, 4 callable by anon; a `CREATE TABLE ... AS SELECT` backup gave anon
  full rights. Fix + a daily `aclexplode` probe flagging any table or definer function granted to anon/public.
  Ours: matches the REVOKE rule (0009: `revoke execute ... from public, anon, authenticated; grant execute ... to
  anon` on each submit_*; app.allow revoked from all). Differs: no recurring drift probe of grants on the live
  database (see the grep line below).
- Mateusz Ingano ("Shipsealed"; family-finance app Zingui with paying subscribers), "Two exploits, one public API key:
  the day I attacked my own Supabase app", DEV, posted Jul 28 (2026, Summer Bug Smash),
  https://dev.to/mateuszingano/two-exploits-one-public-api-key-the-day-i-attacked-my-own-supabase-app-2gno . (b)
  first-hand. A `security definer` RPC granted to anon: "Anyone, with no account at all, could call" it and change a
  subscription; the bugs were silent: "no error, no log, no stack trace". A commenter (Cenk Kurtoğlu): the advisor
  checks RLS on / policy exists, so would not catch these (commenter's claim). Fixed by revoking, pinning
  search_path, and re-running both exploits as anon against production inside begin…rollback + a regression test.
  Ours: submit_* are definer functions granted to anon by design, with `set search_path = ''`, schema checks and
  caps (0009): matches; an "attack as anon" test of our own endpoints: not seen in tests/ (unverified).

- Supabase docs, Database Advisors, lint 0028 "anon_security_definer_function_executable" (WARN), read 2026-10-11,
  https://supabase.com/docs/guides/database/database-advisors?queryGroups=lint&lint=0028_anon_security_definer_function_executable .
  Official (the yardstick). "This `SECURITY DEFINER` function is callable without signing in."; Postgres grants
  EXECUTE to PUBLIC by default "and Supabase also grants it to anon, authenticated, and service-role"; when meant
  to be public, "such as a contact form handler", suppress it and make sure it "validates inputs and limits what it
  does". Also lint 0008_rls_enabled_no_policy exists.
  Ours: submit_run / submit_playtest / submit_issue will raise 0028 by design (0009); our app.* tables with RLS on
  and no policy may raise 0008 (intended). Nothing in the repo records running the advisors (grep for "advisor" in
  supabase/, tools/, tests/: only pg_advisory locks, 2026-10-11). Differs: the expected findings are not written
  down, so a new, real finding would not stand out.

### 2 (cont.). Bots in open online studies (researchers who ran them)
- McDuff K, ... O'Brien KK (University of Toronto team + patient groups; ran the survey themselves), "Battling the
  Bots and Defending Against Fraudulent Responses in an International Community-Engaged Web-Based Survey With People
  Living With Long COVID", J Med Internet Res 2026;28:e88838, https://doi.org/10.2196/88838 (PMC13395426, full text
  saved objekt-files/papers/mcduff-2026.txt). According to PubMed/PMC: "we retained 798 of 4663 (17%) responses for
  Time 1 and 629 of 1281 (49%) responses for Time 2"; bots linked to "alias fraud ... to take advantage of participant
  incentives"; flags included identical start/end times "to the min" and non-unique IP addresses; Qualtrics
  protections (a cookie against repeats, reCAPTCHA) did not prevent it. (a) with Hamovitch 2026
  (https://doi.org/10.2196/73622, 58% suspected bots; abstract only, number unverified from full text) and Ng 2025
  (https://doi.org/10.2196/68092, review).
  Ours: no incentive is offered (owner-decisions.md: floor 1 free), the motive these papers name is absent; but our
  date-only rows (0009) remove the timestamps these teams used to spot bursts, and the IP hash is gone after 10
  minutes, so junk can be refused at the door (caps, JSON Schema) but not found later in the data. Trade-off, to
  write down in the codebook.

### 4/5 (cont.). Researchers' own storage practice
- Center for Open Science, "Open source ecosystem project spotlight: DataPipe", 2025-09-15,
  https://www.cos.io/blog/open-source-ecosystem-project-spotlight-datapipe . About Joshua de Leeuw (jsPsych's
  maintainer, Vassar). (b). "over 300,000 files to the OSF with DataPipe"; "When the experiment generates data, it
  shows up on the OSF immediately"; "born-open" data = "made publicly accessible as soon as it is generated".
  Ours: rows stay in our closed database; publication only after ethics approval and a separate consent
  (owner-decisions.md). A born-open route would need its own consent text (consent version, 0010).
- Max Lovell (University of Sussex; page contact m.lovell@sussex.ac.uk), "Saving Data" guide for jsPsych + Qualtrics
  (no date; written during "the current pandemic", so 2020-2022: possibly stale),
  https://users.sussex.ac.uk/mel29/online_experiments/saving.html . (b). "this data is anonymous and not sensitive"
  only if no identifying information is asked; the file name holds "the Qualtrics participant ID and nothing else";
  IPs and server logs not discussed. Ours: we go further (logs and the IP hash named in privacy.html lines 51-58).

### 3/5 (cont.). Regulators on games (the yardstick for the practitioners above)
- AEPD (Spain) and Belgian DPA, "Recommendations and best practices for data protection in video games", June 2026,
  https://www.aepd.es/en/guides/videogames-recommendations-industry.pdf (copy C:\Users\admin\Downloads\objekt-research\);
  reported by GRC Report 2026-06-22. Official. p.13: pseudoidentifiers include "hashed combinations (for example,
  username + timestamp)"; "full IP addresses" are direct identifiers. p.14: "Even anonymised play patterns ... can
  single out individuals when analysed using behavioural fingerprinting." p.38: "If achievement validation or skill
  assessment can be performed locally (e.g. via device-stored data) rather than through continuous telemetry
  uploads, the design must favour the less intrusive option." p.40: retention tiers, "indefinite only for anonymised
  aggregates". p.17 lists head pose, eye movement and body movement as gameplay-monitoring personal data.
  Ours: matches the owner's decision (profile on the headset, only anonymous numbers to the server;
  owner-decisions.md "What the game keeps") and the "no trace leaves the headset" rule (revision-2-data.md L4).
  The 10-minute HMAC is a pseudoidentifier in their terms (0009). Our rows hold derived per-room numbers plus age
  group, gender, seated, date (01-control-1.json): the "singling out" risk is for rare combinations (UKDS check in
  revision-2-data.md D4).

### 1/2 (cont.). The public key itself
- Supabase docs, "API keys", read 2026-10-11, https://supabase.com/docs/guides/getting-started/api-keys . Official.
  "Supabase is deprecating the `anon` and `service-role` keys by the end of 2026."; publishable keys are "Safe to
  expose online"; it "only reaches what Row Level Security allows". Nothing on rate limits for the key.
  Ours: the game already ships a `sb_publishable_` key (src/engine/results.js line 7): matches; whether the legacy
  anon key is deactivated in the dashboard: unverified (owner's dashboard).
- VibeEval (a security-testing vendor; its own honeypot study), "Honeypot Supabase: How Long Does a Public Anon Key
  Survive Before Abuse? (2026)", cited May 2026, window March-April 2026,
  https://vibe-eval.com/data-studies/honeypot-supabase-anon-key-abuse/ . (b), vendor, honeypot count not given.
  Frontend bundle: first abuse in "single-digit minutes"; first request typically `/rest/v1/?select=*` (the OpenAPI
  schema), then table-name loops, bulk reads, test inserts into writable tables; "about 90% were automated credential
  harvesters running boilerplate enumeration". Ours: expect our submit_* RPCs to be found and called by scanners
  from day one; the JSON Schema check and caps (0009) are what stops junk rows. Matches, if the caps hold.

### 3 (cont.). Ukraine
- Kostiantyn Zerov, "IP-(Russian text: see the source) Protocol.ua,
  2018-01-09, https://protocol.ua/ua/ip_adresi_kintsevih_koristuvachiv_veb_saytiv_yak_personalni_dani_ukrainski_realii/ .
  Pre-2023: possibly stale; author's profession not stated. (b). Cites the Ombudsman's letter of 16.11.2016:
  "(Russian text: see the source) IP-(Russian text: see the source) and of 12.12.2016: the Art 9 notice duty
  arises "(Russian text: see the source) No court practice. Ours: a 10-minute HMAC kept only for flood control,
  never linked to a person, is not "systematised about individuals" on our reading (unverified with a Ukrainian
  lawyer); revision-2-data.md L1 holds the official texts.

### 2/4 (cont.). Labs that ran anonymous, unpaid, public web experiments (closest to us; library)
- Reinecke & Gajos 2015, "LabintheWild: Conducting Large-Scale Online Experiments With Uncompensated Samples",
  library objekt-files/papers/reinecke-2015.txt (lines 54, 471, 597, 608-609). Ran LabintheWild themselves. Pre-2023
  (2015). Data quality without identity: an end-of-study, "non-judgmental" question on technical difficulties or
  cheating; a demographic question "whether participants had taken the study before". Numbers: "completed 1,319 times
  (198 repeat participants)"; exclusions "7.6% of the 1,319"; in another study "2.2% of the 10,976 participants".
- Germine et al. 2012 (TestMyBrain), library objekt-files/papers/germine-2012.txt (lines 92-93, 500-515). Ran it
  themselves; anonymous, uncompensated. Excluded "self-reported technical problems, self-reported cheating, repeat
  participation, age less than 10 years or greater than 70 years", wrong device; battery of 4,427: "150(3.4%)"
  technical/cheating, "126(2.8%)" repeat. "Informed consent was obtained ... in accordance with the guidelines set by
  the Committee for the Use of Human Subjects at Harvard University and Wellesley College."
  (a) both. Ours: `first_run` sent with every run (0009 submit_run p_first) and the device's own visit count
  (src/app/lobby/opening.js) match the repeat flag; a self-report "anything went wrong / did you cheat" question:
  room 01 has `knew` (0-3) in 01-control-1.json, no technical-problem item (differs). Both labs had a university
  ethics board: the route an independent team lacks (topic 6).

### 7. Monitoring (what the people above actually did)
- McDuff et al. 2026 (above, full text): "We monitored the rate and quality of incoming responses"; launched
  2024-01-11, "a rapid influx of fraudulent responses within the first 24 hours of launch", link closed 2024-01-12.
  Lesson: watch the first day by hand, have a way to close the door at once. Ours: the game-wide caps per minute
  (0009: run 300, playtest/issue caps) are the door; a way to switch submission off without a migration, and a
  first-day watch: not written in the repo (unverified).
- Faure 2026 (above): a daily `aclexplode` probe of grants to anon/public returns zero rows after the fix.
  Ingano 2026 (above): re-run the exploits as anon against production in begin…rollback; a regression test.
  Supabase lint 0028 doc (above): accept/suppress intended public definer functions, so the advisor list stays a
  signal. Ours: none of the three is recorded as a recurring check (tools/health.mjs checks the laptop; grep
  2026-10-11 shows no advisor or grant probe). Differs.
- Reports (unverified, search summary only): Supabase now lets a project turn off single advisor rules
  (createwith.com aggregator citing a LinkedIn post), https://www.createwith.com/tool/supabase/updates/supabase-adds-configurable-lint-rules-to-security-and-performance-advisors .

### 1/2 (cont.). Japanese practice: insert-only with a rate limit (GitHub)
- kosei-doi, PR #63 "口コミ・スポット投稿のテーブル・RLS・荒らし対策（DB 側）を作る", opened 2026-09-24, merged 2026-09-25,
  https://github.com/poker-hack-stage/anaba/pull/63 . A developer shipping anonymous public reviews on Supabase. (b).
  Design: revoke default grants from anon/authenticated; column-limited `grant insert` for anon; a policy re-checking
  `status`; a `security definer` `check_rate_limit` with fixed search_path, keyed by a client hash salted with
  the rate-limit salt. Limitations written by the author: 「`anon` が公開キーで直接呼べるので、その形のでたらめなキーで行を
  増やすことはまだできる」; 「他人の枠を使い切るには the rate-limit salt を知る必要がある」; and 「`anon` は `reviews` を読めな
  いので、supabase-js で `.insert(...).select()` にすると 42501 になる。」 (same trap as WeWeb above).
  Ours: stronger on the key: our hash is computed in the database from CF-Connecting-IP, the client cannot choose it
  (0009 app.allow); same as theirs: a script with many IPs passes the per-source cap, only the game-wide caps hold.

### 4 (cont.). The law on withdrawal when we cannot identify the player
- GDPR Art 11, https://gdpr-info.eu/art-11-gdpr/ (read 2026-10-11). Official text. 11(1): the controller "shall
  not be obliged to maintain, acquire or process additional information in order to identify the data subject for
  the sole purpose of complying with this Regulation"; 11(2): then "Articles 15 to 20 shall not apply except where
  the data subject ... provides additional information enabling his or her identification." Ours: we keep no key
  linking a row to a player (0009: random uuid, date only), so we need not create one; but if the game ever offers
  "delete my result" by a code kept on the headset, that code is the "additional information" (and Loughborough's
  warning applies). An informed choice for the owner, not a gap.

### 6 (cont.)
- BPS, "Statement on ethics review and independent research with human participants", BRE33w, 2023-09-07,
  https://cms.bps.org.uk/sites/default/files/2022-07/Statement%20on%20ethics%20review%20and%20independent%20research%20with%20human%20participants.pdf
  (saved objekt-files/papers/bps-2023-independent.txt). Professional body. "a sponsor that provides approval for
  research to proceed – an ethics committee can only provide an ethics opinion"; about itself: "Nor are we able to
  provide independent ethics review"; offers informal advice at researchteam@bps.org.uk; same university-committee
  route as the 2021 Code. Ours: an independent team needs both a committee's opinion and a sponsor (the team itself
  as a company?): unverified who can sponsor; a question for the owner's later step, not now.
- Tricia Cerone and Dr Philippa Smales (RDI Network, Australia; mapped committees themselves), Devpolicy Blog,
  2019-02-07, https://devpolicy.org/navigating-ethics-approval-processes-20190207/ . Pre-2023, Australia. Of 31
  university committees mapped, six accepted non-affiliated applications; fees A$1,650-3,300 (university) and
  A$3,000-6,000 (private); more-than-low-risk review takes "between 20 days and several months". (a) with BPS/BERA
  on scarcity. Ours: cost and time not in the plan yet (owner-decisions.md: university partners).
- Prolific's own article "IRB applications and ethics approval"
  (https://researcher-help.prolific.com/en/articles/449628-irb-applications-and-ethics-approval): not read.

Library copies made this pass: objekt-files/papers/mcduff-2026.txt, bps-2023-independent.txt,
edpb-2025-pseudonymisation.txt, aepd-2026-videogames.txt.

### 1 (cont.)
- Supabase docs, "Database Functions", read 2026-10-11, https://supabase.com/docs/guides/database/functions .
  "When you use `security definer`, you must set the `search_path`"; "Revoke it from `public` and from each role
  holding a direct grant, such as `anon`"; "Pinning the `search_path` doesn't change who can call the function."
  Ours: 0009 submit_* have `set search_path = ''`, revoke from public/anon/authenticated, then grant to anon: matches.

## Not read / left
- https://www.answeroverflow.com/m/1474794234040029497 (Supabase Discord, rate limits on DB/RPC): replies behind a
  Discord join after a Vercel bot check.
- https://rewis.io/blog/hashing-encryption-und-anonymisierung/ : Cloudflare bot check.
- https://construct.net/en/forum/construct-3/how-do-i-8/rgpd-cookies-159252/page-2 : 403.
- UpGuard's original report on 16,000 readable Supabase databases: not found; only a secondary write-up.
- EDPB Guidelines 2/2023 (Art 5(3) ePrivacy and localStorage): not opened this pass.
- ISPP and NPA (Ukraine) ethics regulations (.docx): not read; whether outsiders may apply: unverified.
- Whether Quest Browser evicts localStorage like Chromium: not checked in Meta's docs.
- Live database: not queried (read only rule). Which advisor lints fire on our project, and whether the legacy anon
  key is deactivated: owner's dashboard.

Finished 2026-10-11, about 28 searches and 63 page reads.
