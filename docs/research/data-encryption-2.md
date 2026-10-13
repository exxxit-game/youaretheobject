# Encrypting players' results, part 2: what we lose, how others do it, the options (research of 2026-10-13)

> Continues docs/research/data-encryption.md (parts 1-4: Prio and DAP, homomorphic encryption, public-key and
> post-quantum encryption, Monero). Same rules: quotes only from what was read; "full text" or "abstract" marked;
> "inference" marks my own reasoning. Nothing here is acted on until it goes to the owner on a checked page.

## Part 5. What we lose if the report is sealed on the headset

### Server-side schema check (inference from 0009 and the Prio quotes in part 1)
- Today `submit_run` reads the report and runs `jsonb_matches_schema` on it. A sealed report is random bytes to the
  server: it can still check the envelope (room, version, consent version, size), not the values.
- The check moves to two places: the game before sealing (an attacker skips it) and the owner's decryption step
  (a row out of range is dropped there). A fake run with in-range values passes both, as it passes today.
- Prio keeps a server check without reading: its proofs let servers "reject x with overwhelming probability"
  when the input is invalid (part 1). A sealed box (libsodium, HPKE, age) has nothing like that.

### The live average "you and other players"
- A sealed report cannot feed `compare_room`. Four ways out, from the sources: (a) a second, unsealed channel
  carrying only the one number the average needs; (b) Prio/DAP with a second organisation (Divvi Up) holding the
  other share; (c) the owner decrypts batches offline and publishes the new averages as a static file; (d) no
  live average. HE alone fails here (part 2: who holds the key; published decryptions leak keys).

### The rate limit: kept
- `app.allow` (0009) hashes the CF-Connecting-IP header with a key and counts calls; it never reads the report.
  Sealing the report changes nothing in it (read from the code).

### Key custody for one owner
- Loss = data gone, and it is a breach: EDPB Guidelines 9/2022 v2.0 (library edpb-2023-breach.txt, full text),
  para 19: an availability breach includes "securely encrypted data, the decryption key has been lost"; para 79:
  "if there is a breach where there are no backups of the encrypted personal data then there will have been an
  availability breach". So the key needs at least two copies in two places.
- Theft with the key safe: para 76: if "the confidentiality of the key is intact ... then the data are in principle
  unintelligible", so the breach "is unlikely to adversely affect individuals"; para 78: but "if the key is
  subsequently found to be compromised, or a vulnerability in the encryption software is exposed, then
  notification may still be required".
- A tool for the owner's side: age, https://github.com/FiloSottile/age (README, full text): "a simple, modern and
  secure file encryption tool"; hybrid post-quantum keys with `age-keygen -pq` (recipient type mlkem768x25519);
  "Support for post-quantum keys is built into age v1.3.0 and later"; a passphrase-encrypted identity file "will
  be automatically decrypted"; "Hardware PIV tokens such as YubiKeys are supported through the" age-plugin-yubikey
  plugin. Whether a YubiKey can hold the post-quantum key: not found -> unverified.
- The headset side of the same format: typage, https://github.com/FiloSottile/typage (README): "A TypeScript
  implementation of the age file encryption format"; works in "all recent browsers"; "depends only on the noble
  cryptography libraries"; has a section on "post-quantum hybrid keys". No audit claim on the page; its noble
  base "has not been independently audited yet" (part 3).
- Where the key lives (inference, with the owner's rule that no key sits in the repo and the worry that an AI on the
  laptop reads files): the private key never on the laptop's disk in clear; one copy as a passphrase-protected age
  file on a USB stick kept apart, one printed copy (or a second stick) elsewhere; the passphrase only in his head
  and his password manager. The three ways of keeping two copies were already listed for the store key
  (revision-1-store.md, D4).

### The analysis workflow (inference)
- He exports the sealed rows (Supabase's table export), decrypts the file with age and his key, and gets the plain
  table. Wherever that happens, the plain table exists there: on the laptop an AI helper could read it. Clean
  answer: decrypt on another computer (or a live USB system) and bring back only the aggregate tables. Cheaper
  answer: decrypt on the laptop with no AI session open and delete the plain file after.

### Do Supabase Vault, pgsodium or column encryption protect against Supabase itself? No.
- Vault, https://supabase.com/docs/guides/database/vault.md (full text): Supabase "creates and manages a unique
  encryption key for each project in our secured backend systems"; "the encryption key is never stored in the
  database alongside the encrypted data"; backups and replication "preserve this encryption"; "anyone that has
  access to the view has access to decrypted secrets". So it guards a stolen dump, not the platform that holds the
  key, nor anyone (or any AI) running SQL with full rights.
- pgsodium, https://supabase.com/docs/guides/database/extensions/pgsodium.md (full text): "Supabase does not
  recommend the usage of pgsodium as it will be deprecated"; for Server Key Management and Transparent Column
  Encryption "we do not recommend using either on the Supabase platform due to their high level of operational
  complexity and misconfiguration risk"; Vault and pgsodium "share the same per-project root encryption key".
- Encryption at rest of the whole platform: not stated on https://supabase.com/docs/guides/security/platform-security.md
  (only TLS 1.2/1.3 in transit) -> unverified here.

## Part 6. How labs, statistics offices and guidance handle it

### A real statistical study on secret-shared data (full text; Bogdanov et al. 2016, PoPETs 2016(3):117-135, https://petsymposium.org/popets/2016/popets-2016-0019.pdf; saved bogdanov-2016.pdf/.txt)
- Abstract: tax and education registers of Estonia linked and analysed in Sharemind, which "provided end-to-end
  cryptographic protection to the analysis"; "ten million tax records and half a million education records".
- Who held the shares: "hosted by three computing parties, the Estonian Information System's Authority, the
  Ministry of Finance Information Technology Centre and Cybernetica"; "Each used their own data centres".
- The regulator: the Data Protection Inspectorate replied "we were not actually processing personal data and,
  thus, would not need permission for an MPC-based analysis with only statistical summary output"; a later legal
  analysis agreed but "no general guidance can be given".
- The cost of mistakes: one script error lost "about 6 days worth of computation time", a second "more than 8
  days"; once Sharemind was taken offline "the statisticians were unable to fix the missing plots".
- What it gave: "MPC gave the data owner real technical control over their data"; the extra step was "reviewing
  the Sharemind and Rmind source code" before the study (code review as part of trust).
- Lesson for us (inference): the method works for official statistics, but needs several independent hosts and
  makes every analysis error expensive; for a one-person lab the sealed-rows design keeps analysis ordinary.

### Survey and form tools
- CryptPad Forms, https://docs.cryptpad.org/en/user_guide/apps/form.html (full text): mentions "end-to-end
  encryption" only for spreadsheet export; whether the server can read responses is not stated -> unverified.
- The research platforms we compared (DataPipe, JATOS, Pavlovia, Gorilla, Cognition.run; data-architectures.md)
  were not found to encrypt responses so that the platform cannot read them (none of the pages read said so).

### Guidance
- GDPR Art. 32(1), https://gdpr-info.eu/art-32-gdpr/ : measures "appropriate to the risk", "including inter alia
  as appropriate: (a) the pseudonymisation and encryption of personal data"; (c) "the ability to restore the
  availability and access to personal data in a timely manner". Art. 34(3)(a) (quoted in data-purchases.md): no
  notice to people where measures "render the personal data unintelligible to any person who is not authorised".
  Art. 89(1) and Recital 26: ethics-law-3.md (research needs "appropriate safeguards"; anonymous data are outside
  the GDPR).
- EDPB Guidelines 01/2025 on pseudonymisation (library), para 108: secrets "may also be divided up, e.g. by secret
  sharing, and stored by different entities".
- AEPD (Spain), "Recommendations and best practices for data protection in video games", June 2026 (library
  aepd-2026-videogames.txt), checklist rows: "Encrypt service payloads end-to-end"; "Use field-level encryption on
  profile stores".
- BPS guidance on internet-mediated research 2021 (library bps-2021-imr.txt): third parties' "compliance with
  local data protection laws" to be weighed; "the security of unencrypted email is low". The BPS Code 2021 asks
  for storage and disposal procedures (section 13 of its form); no encryption rule found in its text (grep).
- APA Ethics Code (library apa-ethics-code-2017.txt), 4.01: "take reasonable precautions to protect confidential
  information obtained through or stored in any medium". No encryption rule named.
- Meta, "Data security best practices" (quoted in data-purchases.md): "Meta generally expects that all User Data
  and/or Device User Data stored at rest is encrypted."

### Public code as part of the trust argument, and its limit
- Meta's Code Verify, https://engineering.fb.com/2022/03/10/security/code-verify/ (10 Mar 2022, full text): "a web
  app is usually served directly to users, without a third party reviewing and auditing the code"; their answer:
  "We've given Cloudflare a cryptographic hash source of truth for WhatsApp Web's JavaScript code."
- For us (inference): a public repository lets anyone see that the headset seals the report with our public key
  before sending. Its limit is the same as WhatsApp Web's: whoever controls the site could serve other code. A
  release that publishes the hash of the sealing file, plus GitHub's public build log, narrows that gap.

## Part 7. People who have done it (read 2026-10-13)
- LWN, Daroc Alden, "Divvi Up: privacy-respecting telemetry aggregation", 2 Aug 2024, https://lwn.net/Articles/983843/
  (full text): "any project wishing to use Divvi Up's solution would host one aggregation server, and the Divvi Up
  project would host another"; "the whole scheme is still vulnerable to Sybil attacks, where someone invents large
  numbers of fictitious users". Comments: no commenter with stated hands-on experience of it; one reader is
  "warry of this techno-solution of throwing cypto at a privacy problem".
- A small user's devlog: Horizontal's Tella (an app to "document human rights violations"), Caro Hadad, 22 Aug 2024,
  https://divviup.org/blog/horizontal-tella/ (full text): users "can choose to share anonymous usage data"; two
  processors, one "hosted by ISRG and one hosted by us". Effort, cost and lessons: not on the page.
- The TypeScript client, https://github.com/divviup/divviup-ts (README): npm `@divviup/dap`; "bundled and minified
  builds suitable for use from a script tag" (fits our no-build rule); its main branch implements
  "draft-ietf-ppm-dap-09" while the spec is at draft-19 (part 1): whether today's Divvi Up servers accept it is
  unverified. Divvi Up's page https://docs.divviup.org/how-it-works : "Often, Divvi Up will act as the leader,
  while another organization operates as a helper"; batch defaults and prices not stated.
- Russian practitioner (Habr), Alexey Mikhailov (@lex_coder, "Principal AppSec Engineer / Security Architect"),
  "How I built a zero-knowledge password manager: three architectures, a threat model and eight bugs",
  https://habr.com/ru/articles/1082586/ (full text, read in Russian, given here in translation): the server should
  receive neither the master password, the plaintext records nor the keys; client-side encryption protects a
  stolen database and backups, but if the server can swap the JavaScript the browser receives, encrypting the
  database no longer helps; the first public key must be checked through an independent channel; his own
  conclusion: the phrase "protected from server compromise" was too broad for his product. Eight bugs, none in the
  cipher itself (header injection, a missing rate limit, fast PIN hashing, account enumeration and others).
- A Supabase maintainer's thread on client-side encryption: not found (one search); third-party blog posts and
  small chat packages only -> not used.
- Japanese (Zenn): a developer reports node-seal was easy to make work for a hackathon (search summary only,
  https://zenn.dev/mameta29/articles/c3079aaab8cba8, not opened) -> unverified; nothing found on an encrypted
  average in a browser in production.
- Lesson across them (inference): the cryptography is the easy part; the failures people report are around it
  (keys, swapped code, rate limits, fake users, analysis errors that cannot be redone).

## Part 8. Options for the owner (from the best protection to today's)

All four keep the rate limit (it reads the request's address, not the result) and the rule "a kept result
cannot be taken back". "Sealed" = sealed on the headset with our public key in the age format with the
post-quantum hybrid (ML-KEM-768 + X25519, part 3); only the private key opens it. Quest 2 costs are inference
from desktop and phone numbers (parts 1-3); nothing was measured on the Quest 2 yet.

### A. Sealed rows, and the average computed by two independent parties (Prio/DAP with Divvi Up)
- Player sees: the same "you and others", refreshed per batch (DAP's minimum batch = his batches of 10).
- Supabase sees: sealed rows plus room, version, consent version and date; nothing it can read.
- A thief gets: of Supabase, sealed bytes; of one aggregator, random shares; he needs both aggregators.
- Science gets: every row, after the owner decrypts; the live average as now.
- We build: sealing on the headset (typage); a second sending path with `@divviup/dap`; our own helper server
  (Janus in a container, a host besides Supabase); a collector job publishing the average; new tables.
- Quest 2: one seal and one Prio encoding at the end of a room ("sub-millisecond" by Divvi Up; 0.112 s for 10
  numbers on a 2012 phone by Prio's paper); some tens of KB more script (unverified).
- Owner: makes the key by steps on a computer that is not the laptop and keeps two copies; signs and pays Divvi Up
  (price only on request); decrypts the export when science is done.
- Risks: a paid outside partner and a server of our own to keep alive; the client library at draft 09 vs the
  spec at 19; drafts not yet RFCs; fake runs still possible (DAP 8.1); key loss = rows lost.

### B. Sealed rows; the average published by the owner after he decrypts a batch
- Player sees: the comparison, but updated only when the owner publishes (days, not minutes).
- Supabase sees: sealed rows and the envelope only. A thief gets: sealed bytes only.
- Science gets: every row after decryption.
- We build: sealing on the headset; a sealed-rows table; a decrypt-and-average script he runs on the separate
  computer; the averages as a file in the site.
- Quest 2: one seal per room end (milliseconds, inference).
- Owner: the key as in A; a recurring step (export, decrypt, run, send the averages file) each batch.
- Risks: stale averages; his recurring work; key loss = rows lost; the plain table exists on that computer.

### C. Sealed rows, plus one clear number for the live average, folded into sums (my most reasonable now)
- Player sees: the same live "you and others" as today, batches of 10.
- Supabase sees: sealed rows with the envelope; per condition only a count, a sum and a count of zeros, plus at
  most 9 waiting answers (one number each, no other field) until the batch folds them in and deletes them.
- A thief gets: sealed bytes; the sums (what every player already sees); at most 9 lone numbers 0..100.
- Science gets: every row after decryption; exact averages live.
- We build: sealing on the headset (typage); a migration: sealed table, waiting table, fold function,
  `compare_room` reading the sums (dropping the histogram and presses already planned); the schema check kept on
  the one clear number; his decrypt steps.
- Quest 2: one seal per room end (milliseconds, inference); a report of about 1.5-2 KB, so the 2 KB cap rises.
- Owner: the key as in A (two copies; never on the laptop in clear); runs the migration by copy, paste, run;
  decrypts when science is done.
- Risks: key loss = rows lost (averages survive); the full schema check moves to the game and to decryption; the
  libraries are not independently audited (noble's own words); whoever serves the site could swap the sealing
  code (Code Verify's problem; a published hash of the file narrows it); fake runs as today.

### D. Today (0009, 0010)
- Player sees: the live comparison, batches of 10. Supabase sees: every report in clear.
- A thief, or anyone with full database rights (an AI with the service role included), gets every result,
  anonymous but complete. Science gets: every row at once, no key to lose.
- We build: nothing new; the planned hardening (explicit deny on the tables, a daily IP-hash key).
- Quest 2: nothing. Owner: nothing. Risks: the theft he fears most ("all the data") yields everything.

### Why not homomorphic encryption alone
Whoever decrypts a shown average can decrypt any single row; shown decryptions leak keys (Li & Micciancio 2021,
Checri 2024, Guo 2024); ciphertexts of about 110 KB; no range check (part 2). It solves none of A-C's problems.

## Part 9. What Meta's browser sees (read 2026-10-13)
Only Meta's own documents, read 2026-10-13 through a fetch that returns short exact quotes; nothing inferred.
- Meta Quest Browser Privacy Notice, https://www.meta.com/legal/quest/browser-privacy-notice/ ("Effective August
  15, 2025"). Sites: "We collect the domain name of each website visited (e.g., Meta.com), the amount of time people
  spend on that domain"; "We only collect the domain name and not the full URL of pages visited."; "This information
  is disassociated from your account." Crashes: "We collect crash reports to help fix and improve product stability."
  Usage: "We collect information related to your usage of the following:" New Tab Page, domains, Browser features
  and technical data; "Technical data includes Browser version, device type (e.g., what VR headset you're using), your
  country and language," then OS, network information, update results. Private mode: "In private browsing mode, we do
  not collect information about the websites you visit"; "We still collect other usage statistics, such as browser
  features and technical data, and crash reports in private mode" ... "unless you opt out."
- Supplemental Meta Platforms Technologies Privacy Policy, https://www.meta.com/legal/privacy-policy/ ("Effective
  October 12, 2026"), under "Meta VR Product activity": "For example, we collect information about your Meta Quest
  browser usage"; under "Device information": "When a Meta VR Product experiences a crash, a log about the crash is
  sent to Meta." (the log: time, user ID, device ID, IP address, per the fetch's summary, not quoted); "You may
  choose to share additional data with Meta about how you use your device".
- Help "Use the Browser with Meta Quest", https://www.meta.com/help/quest/1095931284237787/ ("Updated: 7 weeks ago"):
  "Sharing usage statistics and crash reports is on by default."; off: "select Settings in the Browser menu and toggle
  the switch next to Analytics to Off"; still: "your Meta Quest device collects information about how often and how
  long you use applications, including Browser."
- Help "Control what additional data you share...", https://www.meta.com/help/quest/614185856801362/ ("Updated: 39
  weeks ago"): headset Settings > "Privacy and safety" > "Data and Analytics" > "Share additional data"; the Browser
  is among the apps it covers (example: "if you use full-screen mode in the browser").
- Developer docs, https://developers.meta.com/horizon/documentation/web/browser-specs/ (2026-07-21): "Browser uses
  the Chromium rendering engine, but both products change over time."; nothing on privacy or telemetry. Chromium's
  own docs not read: they describe Google's browser, not what Meta collects.
- Not found in any of these: full URLs (expressly not collected), page content, form input or JavaScript data, a
  "browsing history" setting or Meta's steps to clear history or site data, Safe Browsing or URL checks, sync.
- Unverified: release notes of Oculus Browser 6.2 add a telemetry opt-out (search snippet only,
  https://developers.meta.com/horizon/release-notes/web/ not opened).

## Not done or unverified
- Divvi Up's price and whether it takes a one-person lab: only by writing to their contact address (his choice).
- A Quest 2 measure of sealing (typage + noble) before any choice: the quest-look tool, by me.
- Whether a YubiKey can hold the post-quantum age key; Supabase's own encryption at rest; OpenFHE-WASM's state.
