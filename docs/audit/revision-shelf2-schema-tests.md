# Shelf 2, part C: the report schema, the tests that hold the server, and the codebook (12.10)

> Kept as the helper wrote it on 12.10.2026 for the revision (docs/audit/revision.md): shelf 2, part C: the report schema against JSON Schema draft-07 and its validator, the tests that hold the server, the codebook. Russian passages are left out of this English copy; their sources are linked. The pages it read are saved in objekt-files/notes/revision-shelf2-2026-10-12/. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only. Nothing in the repo changed (git status clean after the work). The live database was only read:
three single SELECT statements through the Supabase connector, all pure reads (pg_extension, pg_available_extensions,
app.room_schemas, cron.job, cron.job_run_details, a row count and the oldest age in app.recent) and pure calls of
`extensions.jsonb_matches_schema` on literal reports. No submit function was called, no row was written.

Repo: worktree `continuation-e2af23` (paths relative to it). Sources saved as text, each with its URL and date, in
`scratchpad/shelf2/schema/`:
- pg_jsonschema v0.3.3: `pgjs-v0.3.3-README.md.txt`, `pgjs-v0.3.3-Cargo.toml.txt`, `pgjs-v0.3.3-Cargo.lock.txt`,
  `pgjs-v0.3.3-src_lib.rs.txt`; v0.3.4: `pgjs-v0.3.4-Cargo.toml.txt`, `pgjs-v0.3.4-src_lib.rs.txt`; tags `pgjs-tags.txt`.
- the `jsonschema` crate 0.17.1 (the one 0.3.3 uses): `jsonschema-0.17.1-*.txt` (Cargo.toml, lib.rs, schemas.rs,
  compilation/options.rs, compilation/mod.rs, keywords/type_.rs and others); 0.37.1 (the one 0.3.4 uses):
  `jsonschema-0.37.1-*.txt`.
- JSON Schema draft-07: `draft-07-core.txt`, `draft-07-validation.txt`, `draft-07-metaschema.txt`.
- Supabase docs: `supabase-pg_jsonschema.txt`. PostgreSQL docs: `postgres-ddl-constraints.txt`.
- UK Data Service: `ukds-document-your-data.txt`, `ukds-data-level-documentation.txt`.
- APA 8.14: the local copy `objekt-files/papers/apa-ethics-code-2017.txt:371-373` (not fetched again).
- Our own measures: `live-query.sql`, `live-readonly-results.txt` (the three live reads), `mutation-results.txt`
  (16 mistakes put back on scratch copies, script `scratchpad/scripts/mutate.sh`).

Status key: MATCH; DIFFER-needed (a reason in the owner's words or in a cited source); DIFFER-not-needed (no reason
found); UNVERIFIED (not read or not measured here).

## 1. Table

### A. The schema against JSON Schema draft-07 and its validator

| # | Source (file:line, exact words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| A1 | pgjs-v0.3.3-Cargo.toml.txt:30 `jsonschema = {version = "0.17.1", default-features = false, features = [] }`; pgjs-v0.3.3-src_lib.rs.txt:15 `jsonschema::is_valid(&schema.0, &instance.0)`; README:91 "a (very) thin wrapper around the jsonschema rust crate" | live: pg_jsonschema 0.3.3 installed, the only version offered, PostgreSQL 17.11 (live-readonly-results.txt, queries 1 and 3) | MATCH | | |
| A2 | jsonschema-0.17.1-src_lib.rs.txt:10 "JSON Schema drafts 4, 6, 7"; schemas.rs:195 `"http://json-schema.org/draft-07/schema#" => Some(Draft::Draft7)`; schemas.rs:27-28 default `Draft::Draft7`; Cargo.toml:35-36 `draft201909 = [] `, `draft202012 = [] ` are features pg_jsonschema leaves off | supabase/schemas/01-control-1.json:2 `"$schema": "http://json-schema.org/draft-07/schema#"`, the exact string the crate maps | MATCH | | |
| A3 | draft-07-core.txt:362 "$schema ... is both used as a JSON Schema version identifier"; a 2020-12 URL is not in the 0.17.1 list (schemas.rs:190-198) and would fall back to draft 7 without a word | we declare draft 7, the newest draft the live validator has | MATCH | | add the reason to the schema's `$comment` (one line), so nobody "upgrades" it to 2020-12 |
| A4 | pg_jsonschema 0.3.4 moves to jsonschema 0.37.1 (pgjs-v0.3.4-Cargo.toml.txt:30), whose default is `Draft202012` (jsonschema-0.37.1-...specification_mod.rs.txt:34) but which still reads `"http://json-schema.org/draft-07/schema"` as Draft 7 (:70, the `#` trimmed) | our explicit `$schema` keeps draft-7 rules if Supabase upgrades the extension | MATCH | | |
| A5 | draft-07-validation.txt:527 additionalProperties "applies only to the child values of instance names that do not match any names in properties" | closed at the top (01-control-1.json:5) and inside `answers` (:30). Live: an extra top field and `answers.pos` are refused (`extra_field false`, `answers_extra false`) | MATCH | | |
| A6 | draft-07-validation.txt:497 required: valid "if every item in the array is the name of a property in the instance" | `required` holds only `condition` and `speed` (01-control-1.json:6). A finished run always sends all 21 keys and all 10 answers (report.js:25-50, questions.js:37-49; the Done button appears only after a pick, src/engine/ui/scale.js:94-96). Live: `{"condition","speed"}` alone passes; so does `{"condition":"75-75","speed":1,"answers":{"control":0}}`, a row compare_room would count (0010:47-49) | DIFFER | not needed: no reason found | schema version 2: `required` lists every key the client sends, and `answers.required` all ten |
| A7 | draft-07-validation.txt:347 "integer" matches "any number with a zero fractional part"; jsonschema-0.17.1-src_keywords_type_.rs.txt:378 the same test | counts and choice answers are `"type": "number"` (01-control-1.json:11-18, :32-41). Live: `trials 2.5` and `age 2.5` pass | DIFFER | not needed: no reason found; already on the board, docs/board.md:35 [Russian, at the cited line] ([Russian, at the cited line])" | in version 2, `"type": "integer"` for the 8 counts and the 10 answers |
| A8 | the procedure: 40 trials (src/rooms/01-control/protocol.js:5); a report is sent only after the 40th (trials.js:77-100, room.js:186-192) | `trials`, `presses`, `greens`, `greenIfPress`, `greenIfNoPress`, `confirming` allow 0-1000 (01-control-1.json:11-16), copied from the old whitelist (0008_submit_run_age.sql:38). Live: `trials 999` passes; `presses 400` with `trials 40` passes | DIFFER | not needed: no reason found | version 2: `"trials": {"const": 40}`, the five others `"maximum": 40`. Cross-field sums (presses <= trials) cannot be said in draft-07; they go to the codebook's exclusion rules (D10) |
| A9 | scale answers step 5 (protocol.js:14 "scales marked in units of five, 0 to 100"; scale.js:94 snaps to the step) | answers `control`, `total`, `ifPress`, `ifNoPress`, `certainty`: any number 0-100 (01-control-1.json:32-36). Live: `control 37` passes | DIFFER | not needed: no reason found | version 2: `"multipleOf": 5` on the five scales |
| A10 | `voided` and `strays` have no ceiling in the room: a void repeats the trial (trials.js:80-86), every press outside the window is a stray (trials.js:106) | max 1000 (01-control-1.json:17-18). Live: `strays 1001` is refused, so the whole run is lost without a word (results.js:43 swallows it). The playtest report clamps the same counts (src/app/playtest-report.js:53-54); `analyse` does not | DIFFER | not needed: no reason found | clamp in report.js (`Math.min(1000, …)`), WHY: top-coding, as the playtest report does; the codebook says "top-coded at 1000" |
| A11 | report.js:8 `pct` returns null only when the whole is 0; with 40 trials `total`, `successesOfAll` and `errTotal` are never null | these three allow null (01-control-1.json:19, :23, :25). Live: `total null` passes | DIFFER (looser than the room) | not needed: no reason found | version 2: plain `"number"` for these three |
| A12 | percentages 0-100 to one decimal (report.js:8); differences of two percentages (report.js:9, :36) | 0..100 and -100..100 (01-control-1.json:19-27) | MATCH | | |
| A13 | draft-07-validation.txt:363 const: valid "if its value is equal"; draft-07-core.txt:255 numbers are equal when they "have the same mathematical value" | `"speed": {"const": 1}`, `condition` enum (01-control-1.json:8-9). Live: `"1"` refused, `1.0` accepted, as the spec says | MATCH | | |
| A14 | draft-07-core.txt:392 "The root schema ... SHOULD contain an "$id" keyword with an absolute-URI" | no `$id` | DIFFER (a SHOULD) | not needed: no reason found; no `$ref` uses it, so validation is the same | version 2: an `$id` naming the room and version, so a data file can cite the exact schema |
| A15 | supabase-pg_jsonschema.txt:319 "generally used in tandem with a check constraint"; postgres-ddl-constraints.txt:211 "PostgreSQL does not support CHECK constraints that reference table data other than the new or updated row being checked" | the check runs in `submit_run` (0009_data_protection.sql:188-194), because the schema is looked up per room and version in another table (0009:57-62) | DIFFER-needed | needed: the Postgres docs forbid a CHECK that reads another table | |
| A16 | jsonschema-0.17.1-src_lib.rs.txt:120 is_valid "panics if an invalid schema is passed" | a malformed schema row would break every call of `submit_run` rather than refuse one report. Version 1 is guarded by the migration's self-test (0009:301-319); nothing guards a version 2 row | DIFFER | not needed now (one valid row, checked live) | with version 2: `alter table app.room_schemas add check (extensions.jsonschema_is_valid(schema))` (a check on its own row, allowed), plus the same self-test block per new version |
| A17 | the server's cap: `pg_column_size(p_report) >= 2048` refused (0009:192) | the full report is 744 bytes as jsonb on the live server, 440 as JSON text (query 1) | MATCH (2.75 times under) | | |
| A18 | the live row must be the repo's file | live `app.room_schemas` (01-control, 1) equals supabase/schemas/01-control-1.json (query 1: `true`, 12.10) | MATCH | | |

### B. The client payload against the schema

| # | Source | What we do | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| B1 | the live validator | room.js:192 sends `{ condition, ...analyse(log), seated, speed }`; that report passes live (`good true`). Our test's own checker (tests/sql.mjs:47-69) gives the same verdict as the live validator on all 19 cases tried (live-readonly-results.txt) | MATCH | | |
| B2 | owner: test data never in the statistics | sent only at speed 1 with recording (src/app/session.js:64), and the server refuses `speed` other than 1 (01-control-1.json:9) | MATCH (two guards) | | |
| B3 | src/rooms/01-control/questions.js:47 "pos = where it was shown, so a position effect can be checked later"; docs/rooms/01-control.md:74 says the server gets "every answer with its shown position" | report.js:20 keeps only `value`; the schema refuses `answers.pos` (live `answers_extra false`). The position never leaves the headset. docs/rooms/01-control.md:64 says the opposite ("the log keeps the option, not its position"), while questions.js:48 logs both | DIFFER (two docs against the code) | the docs: not needed. Sending it: for the owner (section 3) | correct docs/rooms/01-control.md:64 and :74; and :75 "The server whitelist must list these fields" is stale (it is a JSON Schema now) |
| B4 | room.js:38 "Bump when a change makes new results not comparable"; src/rooms/01-control/texts.ru.js:74 "New answers go last: the server and old results keep the earlier numbers" | nothing holds the meaning of a code: two age answers swapped in texts.ru.js keep version 1 and every test green (M8) | DIFFER | not needed: no reason found | tests/results.test.mjs pins a hash of each question's answer list per ROOM_VERSION, as it already does for the consent's words (results.test.mjs:51-53) |
| B5 | compare_room reads `condition`, `presses`, `answers.control` (0010:47-68) | all three are schema properties today | MATCH (unguarded, C9) | | |

### C. The tests: what each holds, and whether it fails when its mistake is put back (docs/audit/README.md, cause 4)

All mutations ran on fresh copies in the scratchpad; results in `mutation-results.txt`. RED = caught.

| # | Test (path:line) | What it holds | Mistake put back | Result | Status | Smallest fix |
|---|---|---|---|---|---|---|
| C1 | tests/results.test.mjs:17-18 | the server loads the schema file the repo holds | file changed, migration not (M14) | RED | MATCH | |
| C2 | results.test.mjs:31-33 | the client's report passes the schema | a field added in report.js (M2) | RED | MATCH | |
| C3 | same | same | a field added in room.js's `session.finish` call (M1) | green | DIFFER: the test rebuilds room.js:192 by hand ("exactly what room.js sends", results.test.mjs:31) instead of reading it | move the assembly `{ condition, ...analyse(log), seated, speed }` into one pure function in report.js; room.js and the test both call it (cause 3: one source) |
| C4 | none | the schema accepts no field the client never sends | `rt` added to schema file and migration (M3) | green | DIFFER | results.test: the schema's property names equal the report's keys, top level and `answers` (they are equal today: 21 and 10) |
| C5 | results.test.mjs:35 | each answer's server limit is its last choice | gender max 2 -> 3 (M15) | RED | MATCH | |
| C6 | results.test.mjs:36 | report under 2 KB | server cap lowered to 512 (M10), under the 744 jsonb bytes sent | green | DIFFER: the test measures JSON text (440 bytes); the server measures jsonb (744 bytes, live), and never reads the SQL's cap | assert text < 1024 with the measured ratio as WHY (1.69 on 12.10), or read the cap from the newest submit_run |
| C7 | results.test.mjs:37-40 | refuses a test run, an unknown field, an answer out of range | top-level `additionalProperties: false` removed (M12); trials max under 40 (M7) | RED, RED | MATCH | |
| C8 | same | (no case) a report without `condition` | `required` reduced to `speed` (M11) | green | DIFFER (only the migration's one-time self-test held it, 0009:314) | with C4: `schema.required` equals the report's keys |
| C9 | none | every field compare_room reads exists in the schema | compare_room reads `presess` and `contrl` (M13) | green (all five data tests) | DIFFER: "You vs other players" would go empty without a word | results.test reads `report ->> '(\w+)'` and `report -> 'answers' ->> '(\w+)'` from the newest compare_room and checks each against the schema |
| C10 | results.test.mjs:44-48 | each call sends exactly the function's parameters | sendResult sends `p_extra` (M16) | RED | MATCH | |
| C11 | results.test.mjs:51-55 | consent words pinned to their version; the server knows the version | (by construction) | not mutated | MATCH | |
| C12 | tests/control-report.test.mjs (whole) | the derived measures on small logs | `confirming` formula broken (M9) | RED | MATCH | |
| C13 | tests/playtest.test.mjs:13, :23-25 | keys, phases, devices and the number ranges read from the SQL | phase-time max 7200 -> 3600 in the SQL (M6) | green | DIFFER: the phase limit is not read from the SQL; 7200 is written in the test (playtest.test.mjs:31) and the client (playtest-report.js:47) | read `secs` limit from submit_playtest as `maxOf` does for the others |
| C14 | tests/issues.test.mjs:13-22 | keys, kinds, devices, states read from the SQL | message limit 200 -> 100 in the SQL (M5) | green | DIFFER: 200 is written in the test (:17), not read from the SQL | read the three length limits from submit_issue |
| C15 | none | the IP fingerprint kept 10 minutes (owner's decision) | `interval '10 minutes'` -> `'10 hours'` in 0009 (M4) | green (all four data tests) | DIFFER: no test holds it. Live it is right (cron every minute, 1440 runs in the last day, 0 failed, 0 rows kept; query 2) | a test reads the newest app.allow and the cron command: both `interval '10 minutes'` |
| C16 | package.json:6, .github/workflows/test.yml:8-9, :26-28 | where they run | | | MATCH | |

C16 in words: the five data tests are plain Node scripts in `npm test`, run on every push to room-polish and main and
(the quick ones) by the pre-commit hook (tools/hooks/pre-commit:3-5). None needs a database; none is skipped.
tests/sql.mjs is not a test and touches no Postgres: it reads the migration files with regular expressions and
carries its own checker for ten draft-7 keywords (sql.mjs:47-69). No Postgres, Supabase CLI or pg_jsonschema runs
on GitHub. The real validator runs only in the migrations' self-tests when a migration is applied (0009:301-319,
0010:80-88) and on live calls. ARCHITECTURE.md:45 says the same ("read from the migrations"). The checker agreed
with the live validator on 19 of 19 cases (B1), so a Postgres job is not needed now.

### D. The codebook

| # | Source (exact words) | What we have | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| D1 | docs/research/revision-2-data.md:208 verdict "schema file + human page + errata per version", "ADD"; :238 "Codebook for room 01's current version from the schema; errata log"; docs/audit/premortem.md:39 "a codebook and exclusion rules per room version before testers"; APA 8.14(a) "do not withhold the data on which their conclusions are based" (apa-ethics-code-2017.txt:372) | none. Only the comment "the codebook's machine half" (results.test.mjs:16) and the schema itself. No board line | DIFFER | not needed: no reason found; owner: "what costs more later is decided now" (9.10), "Deferred work is written down now" | one line at the board's end; the codebook goes with schema version 2 (the integer migration, board item 4) |
| D2 | ukds-data-level-documentation.txt:155 "Variable names and descriptive labels"; draft-07-validation.txt:841 "a description will provide explanation about the purpose of the instance" | names only; no `title` or `description` on any of the 31 fields | DIFFER | as D1 | `title` and `description` per property in the schema |
| D3 | ukds:157 "Data types" | present, but `number` where whole numbers are meant (A7) | DIFFER | as A7 | A7 |
| D4 | ukds:159 "Units of measurement" | none written: counts of trials; percent 0-100 to one decimal; percentage points for `actualControl` and `err*`; scale 0-100 step 5 | DIFFER | as D1 | the unit in each `description` |
| D5 | ukds:161 "Value labels and coding schemes"; :149 "“not applicable”, “not known” or “not asked” ... may be represented using similar numeric codes" | the codes are indexes into Russian lists in texts.ru.js (:53-77). `age 6` and `gender 2` mean "prefer not to say" and sit next to real bands: an average of `age` would be wrong | DIFFER | as D1 | per choice field, the codes with an English gloss (`oneOf` of `const` + `title`, or a list in `description`), naming the texts.ru.js list they index |
| D6 | ukds:163 "Definitions of missing data" | `ifPress`, `ifNoPress`, `successes`, `actualControl`, `errIfPress`, `errIfNoPress` are null when the player never pressed, or always pressed (report.js:8-9, control-report.test.mjs:41-48); written nowhere | DIFFER | as D1 | say it in each `description` |
| D7 | ukds:169 "Derived or constructed variables and how they were created" | report.js:31-49 has the formulas with the paper's pages | partly MATCH | | copy each formula and page into its `description` |
| D8 | ukds:165 "Applicability or universe information" | the row's own columns (room, version, first_run, consent, created_on, id: 0001, 0009:26-33, 0010:28) are outside the schema; compare_room uses first runs only | DIFFER | as D1 | the human page covers the whole row, not only the report |
| D9 | ukds:173 "changes in question wording, coding schemes ... across waves should be documented" | versions exist (room_schemas key room+version, 0009:57-62); no errata file; code meanings unguarded (B4) | DIFFER | as D1 | an errata file per room; B4's hash |
| D10 | premortem.md:39 "exclusion rules" | none (presses <= trials, many voids, many strays) | DIFFER | as D1 | a short list on the human page |
| D11 | docs/methodology.md:13 "Store the raw event stream (ms timestamps) next to the derived report"; privacy.html:29 exact action times are not sent; docs/research/projects/data-platforms.md:116 "One of them must change before the codebook is written" | still both stand | DIFFER | for the owner (section 3) | |

What the schema needs to serve as the codebook's machine half: per property a `title` (short English label) and a
`description` (definition, unit, how it is derived with the paper's page, what null means); for each choice the codes
with their meaning; an `$id`; a `$comment` with the version note. The validator ignores these words: 0.17.1 files
unknown keywords as "unmatched" and builds no check for them (jsonschema-0.17.1-src_compilation_mod.rs.txt:207-213),
and the draft-07 meta-schema accepts `title` and `description` as strings (draft-07-metaschema.txt:59-64). One
catch: our test's checker refuses any keyword it does not know (tests/sql.mjs:49, `KNOWN`), so `title`,
`description`, `$id`, `integer`, `multipleOf` and `oneOf` must be taught to it in the same change. A second catch:
the test finds a schema only in an `insert ... values ('01-control', 1, $json$` (sql.mjs:29), so the words come with
version 2, not as an update of version 1. The human page is then written from the schema, with the Russian labels
named by their key in texts.ru.js (the structure test keeps Russian there).

### E. The owner's decisions on data

| # | His decision (docs/owner-decisions.md) | What we do | Status |
|---|---|---|---|
| E1 | "only anonymous numbers go to the server" | numbers, two booleans, one condition name; date only and a random key (0009:26-32); no times, no ids. Age band, gender, seated and date are indirect identifiers for any public file (revision-2-data.md, D4/D7) | MATCH |
| E2 | "Bots: a hashed IP kept 10 minutes ([Russian, at the cited line] IP [Russian, at the cited line])" | 0009:137 and :159; live cron as in the repo, every minute, no failures, no rows kept (query 2); privacy.html:51 [Russian, at the cited line]. A row can live up to about 11 minutes when nobody calls (the cron runs once a minute) | MATCH (unguarded by tests, C15) |
| E3 | "science only after ethics approval and preregistration" and "a separate consent" | no science use; a codebook is what a preregistration and APA 8.14 sharing need (D1) | MATCH |
| E4 | the tool revision: "one live migration (date only, random key, consent version, a schema per room, a rate limit)" | done in 0009 and 0010; schema per room and version | MATCH |
| E5 | "Ethics: consent ... anonymous data"; consent version per row | every row names its consent version, checked against app.consent_versions (0010:28); results.test.mjs:51-55 holds the words | MATCH |
| E6 | "data protection first"; "never sell data" | nothing in this part touches it | MATCH |

## 2. The not-needed differences (fixes), smallest first

Repo only, no live change:
1. docs/rooms/01-control.md:64, :74, :75: say what is true (the position is logged, not sent; a JSON Schema, not a whitelist) (B3).
2. results.test: schema property names equal the report's keys, top level and `answers`; `required` equals them too once version 2 has it (C4, C8).
3. results.test: every field compare_room reads is in the schema (C9).
4. report.js: one pure function builds the whole report; room.js and the test call it (C3).
5. results.test: pin a hash of each answer list per ROOM_VERSION (B4).
6. a test for the 10-minute window: the newest app.allow and the cron command both say `interval '10 minutes'` (C15).
7. playtest.test reads the phase limit, issues.test reads the length limits from the SQL (C13, C14).
8. results.test: the size bound with the measured jsonb ratio (C6).
9. report.js: clamp `voided` and `strays` at 1000, as the playtest report does (A10).
10. the schema's `$comment`: why draft 7 (A3).
11. one line at the board's end: the codebook with schema version 2 (D1).

With schema version 2 (a migration on his word; already on the board, item 4: whole numbers):
12. `integer` types, `trials` const 40, the five other counts max 40, `multipleOf: 5` on the scales, no null where a
    finished run never sends one, `required` complete, an `$id` (A6-A9, A11, A14).
13. `title` and `description` per field with units, codes, missing meaning and derivation (D2-D7); the human page,
    the errata file, the exclusion rules (D8-D10); tests/sql.mjs taught the new keywords.
14. `check (extensions.jsonschema_is_valid(schema))` on app.room_schemas and a self-test block for version 2 (A16).

## 3. For the owner

Two choices no source settles; both decide what goes to the server.
1. The shown position of the "evidence" answer (B3). The room shuffles the six reasons and logs where the chosen one
   stood "so a position effect can be checked later" (questions.js:47), but the position never leaves the headset.
   Options: (a) send it from version 2 as one more number (it fits privacy.html's [Russian, at the cited line]); (b) keep
   it on the headset and drop the claim. With (b) the shuffle still protects the result; only the check is lost.
2. The trial sequence (D11). docs/methodology.md:13 wants the raw events; privacy.html:29 promises no exact times.
   Options: (a) keep sending only the totals (today); (b) add the 40 press/green pairs without any times (anonymous
   numbers, no clock); (c) the full event stream with times (needs the privacy text and consent changed). This was
   flagged on 10.10 (data-platforms.md:116) and is still open.

## 4. Unverified

- How pgrx turns the crate's panic on a bad schema into a database error (A16): the pgrx docs were not read.
- Whether Supabase will move this project to pg_jsonschema 0.3.4: today only 0.3.3 is offered (query 3).
- The number `jsonb 744 bytes` was measured on the test's sample report (integers); a report with decimals
  (for example 66.7) was not measured. The margin to 2048 makes this low risk.
- 0.37.1's handling of the other keywords we use was read only for draft detection (A4), not keyword by keyword.

## 5. Counts

56 rows.
- MATCH: 27 (A1-A5, A12, A13, A17, A18, B1, B2, B5, C1, C2, C5, C7, C10, C11, C12, C16, D7 partly, E1-E6)
- DIFFER-needed: 1 (A15: the check in the function, not a CHECK constraint, by the Postgres docs)
- DIFFER-not-needed: 27 (A6-A11, A14, A16, B3 docs, B4, C3, C4, C6, C8, C9, C13, C14, C15, D1-D6, D8-D10)
- For the owner: 2 choices (B3 sending the position, D11 the trial sequence; D11 is a row of its own)
- UNVERIFIED: 4 points (section 4), none of them a row's verdict
