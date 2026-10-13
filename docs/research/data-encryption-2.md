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
