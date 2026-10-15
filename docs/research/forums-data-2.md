# Practitioners on anonymous results into Supabase / public-key Postgres (shelf 2) (part 2)

Part 1: [forums-data.md](forums-data.md).

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

