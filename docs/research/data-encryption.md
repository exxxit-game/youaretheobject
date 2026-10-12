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
