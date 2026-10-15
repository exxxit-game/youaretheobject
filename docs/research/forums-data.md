# Practitioners on anonymous results into Supabase / public-key Postgres (shelf 2)

> Kept as the helper wrote it on 11.10.2026 for the revision (objekt-files/notes/archive/docs/audit/revision.md): practitioners on anonymous results in Supabase, abuse, hashed IPs, withdrawal, ethics approval (shelf 9). Russian passages are left out of this English copy; their sources are linked. Nothing here is acted on until it is checked against our code and shown to the owner.


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


Continued in [forums-data-2.md](forums-data-2.md).
