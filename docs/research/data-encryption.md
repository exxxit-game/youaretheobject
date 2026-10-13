# Encrypting players' results so that only we can read them (research of 2026-10-12)

> For the owner's request of 12.10 (board, "Ciphering the results"; his words in docs/owner-decisions-history.md):
> nobody but us reads a player's individual data (not Supabase, not Meta, not a thief, not a later quantum
> computer), while players still see "you and other players". Nothing here is acted on until it goes to him
> on a checked page. "Full text" = the page or paper itself was read; "abstract" = only its summary was read.
> Continued in data-encryption-2.md when this file reaches 300 lines.

## Parts (each gets an answer or "not found")
1. Aggregation without seeing single values: Prio (NSDI 2017); IETF DAP and VDAF/Prio3 (status, RFC numbers,
   minimum batch size, validity proofs); deployments (Firefox telemetry, ISRG Divvi Up: who, small projects, cost;
   Exposure Notifications Private Analytics); two non-colluding servers and what it means for us.
2. Homomorphic encryption: Paillier (additive), BFV/CKKS (lattice); JS/WASM libraries (node-seal / SEAL, OpenFHE,
   tfhe-rs); speed in a browser on a phone chip; who holds the key for a live average (the crux).
3. Data only the owner can read: HPKE (RFC 9180), libsodium sealed boxes; post-quantum: FIPS 203 ML-KEM, hybrid
   X25519+ML-KEM (X-Wing), JS libraries (@noble/post-quantum), maturity and audits; "harvest now, decrypt later";
   AES-256 under Grover; why additive secret sharing is information-theoretically secure.
4. Monero (Pedersen commitments, RingCT, Bulletproofs): how sums are checked while amounts stay hidden; relevance.
5. What we lose: server-side schema check; the live average; the rate limit; key custody for one owner; the
   analysis workflow; whether Supabase Vault / pgsodium / column encryption protect against Supabase itself.
6. How labs, survey tools and statistics offices do it: end-to-end encrypted forms and surveys; ethics guidance
   (BPS, APA, GDPR pseudonymisation and encryption, Art. 32); a public, verifiable code base as trust.
7. Practitioners in forums and devlogs, any language, with visible work.
8. Options for the owner (3-4 designs, best protection to today's).

## What we have today (read from the code, 2026-10-12)
- supabase/migrations/0009_data_protection.sql: `submit_run` (security definer) checks the report against the
  room's JSON Schema (`extensions.jsonb_matches_schema`) and size (< 2048 bytes), then `app.allow` (a keyed
  HMAC-SHA256 of CF-Connecting-IP, kept 10 minutes; 30 a source per 5 minutes, 300 game-wide per minute), then
  stores the report as plain jsonb in app.runs.
- supabase/migrations/0010_consent_versions_compare_gate.sql: `compare_room` returns per condition n, the mean of
  the control answer to 0.1, the share of 0, the mean presses and an 11-bin histogram, only when n >= 10.
- So today Supabase (and anyone with its service role or a database dump) reads every report in clear.

## Findings (appended as found)

### Part 1. IETF DAP and VDAF: status (full text of the datatracker pages, read 2026-10-12)
- DAP, https://datatracker.ietf.org/doc/draft-ietf-ppm-dap/ : latest draft-ietf-ppm-dap-19, last updated
  2026-07-06; "Active Internet-Draft (ppm WG)"; WG state "WG Consensus: Waiting for Write-Up"; IESG state
  "I-D Exists"; no RFC number. So DAP is NOT an RFC yet.
- VDAF (Prio3 lives here), https://datatracker.ietf.org/doc/draft-irtf-cfrg-vdaf/ : latest draft-irtf-cfrg-vdaf-22,
  2026-08-14; IRTF stream; IRTF state "Awaiting IRSG Reviews"; no RFC number. NOT an RFC yet.
- The RFC it builds on: HPKE, RFC 9180 (part 3). DAP-19 section 4.4.2.1: each input share is sealed with
  `SealBase(pk, ...)` "as specified in [HPKE], Section 6.1"; section 2.1: "Each share is encrypted to only one of
  the two Aggregators."

### Part 1. DAP draft-19: what the two servers guarantee (full text, https://datatracker.ietf.org/doc/html/draft-ietf-ppm-dap-19)
- Section 1: "as long as at least one of them executes the protocol honestly, no measurement is ever seen in the
  clear by any aggregator."
- Section 8 (threat model): an attacker controlling "a subset of the Clients, one of the Aggregators, and the
  Collector learns nothing about the honest Clients' measurements beyond their aggregate result."
- Section 8: "Both Aggregators together can, purposefully or accidentally, share unencrypted input shares";
  "DAP follows VDAF in providing privacy only if at least one Aggregator honestly follows the protocol."
- Minimum batch: section 4.2 `min_batch_size` "is the smallest number of reports a batch is allowed to include";
  section 8.6.3: "this document does not specify how to choose an appropriate minimum batch size"; "A larger
  minimum batch size will yield a higher degree of privacy".
- Sybil (our "nine fake runs" problem, revision-shelf2-fixes.md question 3): section 8.1 "sending known
  measurements to the Aggregators can allow a Collector to shrink the effective anonymity set"; mitigations named:
  Client authentication "likely paired with rate-limiting uploads", anonymizing proxies, and differential privacy
  (section 8.5, noise added by each Aggregator: "privacy can be guaranteed even if all but one of the Aggregators
  is malicious").
- For us (inference): DAP does not fix the "nine fake runs" weakness of a live average either; it names the same
  remedies we have (a rate limit) plus noise.

### Part 1. Prio (full text; Corrigan-Gibbs & Boneh, NSDI 2017, https://www.usenix.org/system/files/conference/nsdi17/nsdi17-corrigan-gibbs.pdf; saved objekt-files/papers/corrigan-gibbs-2017.pdf/.txt)
- Abstract: "As long as at least one server is honest, the Prio servers learn nearly nothing about the clients'
  private data, except what they can infer from the aggregate statistics".
- How (section 3): the client splits x into s random shares that add up to x and sends one to each server; each
  server adds what it gets; the published sums add up to the total. "An adversary who gets hold of any subset of
  up to s - 1 shares of x learns nothing, in an information-theoretic sense, about x from the shares."
- Without proofs it is not robust: "A single malicious client can completely corrupt the protocol output by
  submitting (for example), a random integer r in Fp to each server." SNIPs fix that: if all servers are honest
  and the input is invalid, "the servers will reject x with overwhelming probability"; if the client and one
  server are honest, the servers learn nothing "except that Valid(x) = 1". So a range check (our JSON Schema's
  0..100) can be done on shares, not on clear values.
- "Prio is robust only against adversarial clients--not against adversarial servers."
- "Prio does not natively provide differential privacy ... since the system adds no noise".
- Cost: a 434-question true/false survey: "the client performs only 26 ms of computation"; servers process
  "each client submission in under 2 ms"; overall "a 5.7x slowdown over a naive data-collection" system. Table 3
  (phone = "Samsung Galaxy SIII, 1.4 GHz Cortex A9"): 10 four-bit integers 0.112 s, 100 integers 1.059 s (87-bit
  field). Our report is about 12 numbers (inference: well under a second even on a 2012 phone; Quest 2 not measured).

### Part 1. Deployments: Divvi Up (ISRG), Firefox, Exposure Notifications (full text of each page, read 2026-10-12)
- Who: https://divviup.org/about/ "Divvi Up is a privacy-respecting telemetry service brought to you by the
  nonprofit Internet Security Research Group (ISRG)" (the Let's Encrypt people); "you will need a second data
  share processor server"; "The second data share processor can be operated by your organization or another
  provider." No price on the page.
- Price: https://divviup.org/ "contact our team to learn more about a paid pilot or pricing on our production
  environments". No free tier and no public price found -> cost for us: unverified (an e-mail to them).
- Firefox: https://divviup.org/blog/divvi-up-in-firefox/ (12 Oct 2023): "One goes to a Divvi Up aggregator and
  the other goes to an aggregator run by Mozilla." Mozilla's own page on it (firefox-source-docs .../dap/) gave 404.
- Scale and small users: https://divviup.org/blog/pepr-26/ (22 Jul 2026): "over 4.5 billion reports" in more than
  three years; "ISRG operates one aggregator as a service; you operate the other, or vice versa"; "If you can
  instrument your application to send telemetry to a REST endpoint, you can use DAP"; client libraries for
  TypeScript, Rust, Java; client encoding "sub-millisecond" on constrained devices; Janus (their server) "does not
  require exotic infrastructure to run"; a Docker tutorial "in 5 minutes". It also says one still needs data
  science and privacy engineering skill (summary of the page, not a quote).
- Exposure Notifications Private Analytics: https://divviup.org/blog/lessons-from-running-mpc-at-scale/ (5 May
  2022): servers "run by ISRG, NCI, MITRE, Apple and Google", on AWS and Google Cloud; clients "millions of Apple
  and Google mobile devices"; ran "over the last two years". Lessons: cross-cloud credential federation was
  complex and each misstep "a potential security gap"; end-to-end testing across organisations was hard; corrupt
  outputs look like valid ones. Report counts and cost: not on the page. Whether it still runs: not stated.

### Part 1. Two non-colluding servers: what it means for us (inference from the quotes above)
- The guarantee holds only if the two servers belong to two parties that do not share data. If we run both (two
  Supabase projects, or Supabase plus Cloudflare under our one account), the owner of that account can join the
  shares: privacy against us is gone, and against a thief only if he breaks into both.
- What it still buys if we run one side and Divvi Up the other: Supabase alone (or a thief of our database) holds
  only random-looking shares; no single party sees a player's numbers. The aggregate (the live average) is the
  only thing anyone learns. Individual rows for science are then never available to us either: Prio gives aggregates
  (sums, histograms, even "a least-squares regression", its abstract), not rows; per-player analysis needs a second, separate channel (part 3).

### Part 2. Homomorphic encryption (HE): libraries and speed (read 2026-10-13)
- node-seal, https://github.com/s0l0ist/node-seal (README, full text): "an ESM-first, WebAssembly-powered wrapper
  around the C++ Microsoft SEAL homomorphic encryption library"; "Currently aligned with Microsoft SEAL 4.1.2";
  runs "anywhere WASM is allowed" (browsers named). No audit statement on the page.
- Its benchmark, https://raw.githubusercontent.com/s0l0ist/node-seal/main/BENCHMARK.md (full text): Apple M1 Pro,
  poly degree n=4096 (log q = 109), in microseconds; in Chrome: public key generation 5540, BFV encrypt with the
  public key 5240, adding two ciphertexts 20, BFV decrypt 750. No phone or headset numbers.
  Arithmetic (mine): one BFV ciphertext at n=4096 holds 2 x 4096 coefficients of 109 bits = about 110 KB before
  compression, against our server's limit of 2048 bytes a report (0009).
- tfhe-rs (Zama), https://docs.zama.org/tfhe-rs/integration/js-on-wasm-api.md (full text): browser WASM client
  "includes functionality for key generation, encryption, and decryption. However, it does not support FHE
  computations"; "Due to a lack of threading support in WASM, key generation can be too slow to be practical for
  bigger parameter sets"; multithreading needs COOP/COEP headers for SharedArrayBuffer.
- OpenFHE: https://github.com/openfheorg/OpenFHE-WASM — the search summary says an "Official Webassembly (NodeJS)
  port", work in progress, dev branch only "as of April 2023"; the repository itself not opened -> unverified.
- Paillier (additive only): Paillier 1999, "Public-Key Cryptosystems Based on Composite Degree Residuosity
  Classes" (EUROCRYPT 1999; title only read). It rests on factoring, the problem Shor's algorithm solves on a
  large quantum computer (see part 3 for NIST's wording), so it fails the owner's "later quantum computer" test.
  BFV/BGV/CKKS rest on lattices (Ring-LWE), the same family as ML-KEM (inference from the schemes' families).

### Part 2. HE's known weak points for an average that is shown to people (abstracts only, via Consensus)
- No range check by itself: Prio's text (above) on encrypted sums: "a malicious client can send the servers an
  encryption of a large integer value v instead of a zero/one bit"; "the servers cannot tell from inspecting the
  ciphertext that v > 1". With HE alone our JSON Schema check (0..100) is gone; it needs zero-knowledge proofs.
- Publishing decrypted results can leak the key: Li & Micciancio, EUROCRYPT 2021, "On the Security of Homomorphic
  Encryption on Approximate Numbers" (abstract): passive attacks on CKKS "leading to complete key recovery with
  high probability", tested on "HEAAN, SEAL, HElib and PALISADE", including "mean and variance computations".
- Not only CKKS: Checri et al. 2024 (abstract): a key recovery attack "easily generalizes to other xHE schemes such
  as BFV, BGV and TFHE"; "existing threshold variants of BFV, BGV and CKKS are particularly exposed"; it "typically
  takes less than an hour on an average laptop PC". Guo et al. 2024 (USENIX Security, abstract): on OpenFHE
  "recover the secret key using just one shared decryption output" when the noise flooding is estimated on average.
- Lesson (inference): a live "you and others" average decrypted and shown to every player is exactly the
  "shared decryption output" these attacks use; HE for our case needs expert parameter choice we cannot check.

### Part 2. Who holds the decryption key: the crux (inference from the sources above)
- Whoever can decrypt the sum can decrypt any single ciphertext too: HE keys do not tell a sum from a row.
- If the server holds the key (to show a live average), Supabase, its staff and a thief of the server hold it:
  nothing is gained over today. If only the owner holds it, no live average can be shown until he decrypts each
  batch by hand. The only way out is splitting the key between two parties (threshold decryption), which is again
  the two non-colluding servers of Prio/DAP, with more cost and the threshold attacks above.

### Part 3. Data only the owner can read: public-key encryption on the headset (full texts, read 2026-10-13)
- libsodium sealed boxes, https://doc.libsodium.org/public-key_cryptography/sealed_boxes : "designed to anonymously
  send messages to a recipient given their public key"; "Without knowing the secret key used for a given message,
  the sender cannot decrypt the message later"; uses "X25519 and XSalsa20-Poly1305"; the recipient "cannot verify
  the identity of the sender". (Same primitive GitHub uses for its secrets: data-purchases.md.)
- HPKE, RFC 9180, https://www.rfc-editor.org/rfc/rfc9180.html : February 2022, Informational, from the IRTF CFRG;
  base mode "enable[s] encryption to the holder of a given KEM private key"; its analyses "do not consider
  adversaries capable of quantum computation". So both sealed boxes and HPKE with X25519 are classical only.
- How a game would use it (inference): the headset holds only the owner's PUBLIC key (in the public code, which is
  fine); it seals the report; Supabase stores the sealed bytes; only the owner's private key opens them.

### Part 3. Post-quantum (full texts unless marked)
- FIPS 203, https://csrc.nist.gov/pubs/fips/203/final : "Module-Lattice-Based Key-Encapsulation Mechanism Standard",
  published August 13, 2024; "At present, ML-KEM is believed to be secure, even against adversaries who possess a
  quantum computer"; sets "ML-KEM-512, ML-KEM-768, and ML-KEM-1024".
- X-Wing, https://datatracker.ietf.org/doc/draft-connolly-cfrg-xwing-kem/ : draft-11, 2026-09-23, "Active
  Internet-Draft (individual)", Independent Submission, no RFC; "a general-purpose post-quantum/traditional hybrid
  key encapsulation mechanism (PQ/T KEM) built on X25519 and ML-KEM-768."
- HPKE with post-quantum KEMs, https://datatracker.ietf.org/doc/draft-ietf-hpke-pq/ : draft-05, 6 July 2026,
  "WG Document", no RFC; lists ML-KEM-512/768/1024 and hybrids incl. X25519 with ML-KEM-768.
- JS library, https://github.com/paulmillr/noble-post-quantum (README): ML-KEM per FIPS 203; "ml_kem768_x25519:
  ML-KEM-768 + X25519, implementing X-Wing"; "The library has not been independently audited yet"; "This pure
  JavaScript implementation does not claim constant-time execution". (Timing leaks matter where an attacker
  measures the device; our headset encrypts once with a public key, no secret on it: inference.)
- Harvest now, decrypt later: UK NCSC, https://www.ncsc.gov.uk/whitepaper/next-steps-preparing-for-post-quantum-cryptography
  (v2.0, 14 Aug 2024): "there is a risk from an attacker collecting and storing data today and decrypting it at
  some point in the future"; vulnerable: "algorithms based on integer factorisation (such as RSA)" and on "the
  discrete logarithm problem (such as Finite Field Diffie-Hellman, ECDH, DSA, ECDSA, EdDSA)" (X25519 is such an
  ECDH: inference); "existing symmetric algorithms with at least 128-bit keys (such as AES) can continue to be used".
- AES-256 under Grover: NIST PQC FAQ, https://csrc.nist.gov/projects/post-quantum-cryptography/faqs : "Grover's
  algorithm allows a quantum computer to perform a brute force key search"; "it is quite likely that Grover's
  algorithm will provide little or no advantage in attacking AES"; "both AES 192 and AES 256 will still be safe for
  a very long time".
- Why secret shares are safe even from a quantum computer: Prio (above): "any subset of up to s - 1 shares of x
  learns nothing, in an information-theoretic sense" — no key exists to break; each share alone is random.
  EDPB Guidelines 01/2025 (library edpb-2025-pseudonymisation.txt, para 108): pseudonymisation secrets "may also be
  divided up, e.g. by secret sharing, and stored by different entities". The weak link is the transport: DAP seals
  each share with HPKE (classical X25519 today), so a recorded share could be opened later unless the HPKE KEM is
  post-quantum (inference from DAP 4.4.2.1 and RFC 9180).

### Part 4. Monero: how sums are checked while amounts stay hidden
- Source: koe, Alonso & Noether, "Zero to Monero: Second Edition" v2.0.0, 4 Apr 2020, public domain, full text,
  https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf (saved objekt-files/papers/koe-2020.pdf/.txt).
- Section 5.2: "A Pedersen commitment is a commitment that has the property of being additively homomorphic. If C(a)
  and C(b) denote the commitments for values a and b respectively, then C(a + b) = C(a) + C(b)"; useful "to prove,
  for instance, that inputs equal outputs, without revealing the amounts at hand." Verifiers check the commitments
  sum to zero (inputs minus outputs minus the fee).
- Section 5.5: without a range proof a negative amount would pass ("we have effectively created l more Moneroj");
  each output is proven to lie in 0..2^64-1 with Bulletproofs. Bulletproofs, https://eprint.iacr.org/2017/1066
  (abstract page): "they enable proving that a committed value is in a range"; "the proof size is only logarithmic
  in the witness size"; "without a trusted setup".
- RingCT, https://www.getmonero.org/resources/moneropedia/ringCT.html : "how transaction amounts are hidden in
  Monero"; "After September 2017, this feature became mandatory".
- Relevance for us (inference): Monero proves that hidden sums balance; it never computes or reveals a sum. Our
  need is the opposite: reveal one number (the average) and nothing else. The same two ideas reappear in Prio:
  additive hiding (shares instead of commitments) and a range proof per entry (Prio's SNIP / FLP instead of
  Bulletproofs). So Monero is the right picture for the player ("hidden numbers whose total still adds up"), and
  Prio/DAP is the tool that actually opens the total. The quantum question for Monero's commitments was not found
  in the text read -> not claimed.
