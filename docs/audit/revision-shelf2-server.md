# Shelf 2, part A: our server against Supabase's and PostgreSQL 17's own docs (12.10.2026)

> Kept as the helper wrote it on 12.10.2026 for the revision (docs/audit/revision.md): shelf 2, part A: our server (supabase/migrations, the live project) against the Supabase and PostgreSQL 17 docs of 12.10. Russian passages are left out of this English copy; their sources are linked. The pages it read are saved in objekt-files/notes/revision-shelf2-2026-10-12/. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only. Nothing in the repo changed. The live database was read with SELECTs on catalogs, get_advisors,
get_project and get_publishable_keys, plus one HTTP GET that the Data API refuses before any function runs.
Docs: saved today in `scratchpad/shelf2/docs/` (list with URLs: objekt-files/notes/revision-shelf2-2026-10-12/docs/INDEX.md; Supabase pages as their `.md`
form, PostgreSQL 17 pages as text from the HTML, two extension READMEs). Short names below: `securing` =
guides_api_securing-your-api.md, `rls` = guides_database_postgres_row-level-security.md, `functions` =
guides_database_functions.md, `advisors` = guides_database_database-advisors.md, `keys` =
guides_getting-started_api-keys.md, `prod` = guides_deployment_going-into-prod.md, `backups` =
guides_platform_backups.md, `migrations` = guides_deployment_database-migrations.md, `PG <page>` = pg17_<page>.txt.
Live readings: `scratchpad/shelf2/live-part-a-2026-10-12.md` (today's) and `live-2026-10-12.md` (the caller's).
Our files: repo `continuation-e2af23`, paths relative to it.

Status key: MATCH; DIFFER-needed (our difference has a reason in the owner's words or in a doc);
DIFFER-not-needed (no reason found: the fix is to follow the doc); UNVERIFIED (not readable from here).

## 1. Table

### A. Exposure, grants, row level security

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| A1 | securing:41 "Internal tables and helper functions remain in schemas that aren't exposed." | all tables in `app` (0001:6, 0004:7, 0007:5, 0009:57, :116, :121, 0010:17). Measured: the API answers PGRST106 "Only the following schemas are exposed: public, graphql_public" | MATCH | | |
| A2 | rls:117 "Revoke any existing grants from both client roles."; securing:193 "Bundle grants with your RLS setup in the same migration." | each table gets RLS and `revoke all ... from public, anon, authenticated` in its own migration (0001:18-20, 0004:14-16, 0007:12-14, 0009:63-64, :118-119, :130-131, 0010:21-23). Live: every app table's ACL is `{postgres=arwdDxtm/postgres}` | MATCH | | |
| A3 | PG ddl-priv:213 "No privileges are granted to PUBLIC by default on ... schemas" | 0001:7 `revoke all on schema app from public, anon, authenticated`. Live: app ACL `{postgres=UC/postgres}`, anon has no USAGE | MATCH | | |
| A4 | rls:7 "Enable RLS on every table in an exposed schema." | `app` is not exposed; RLS is on for all 7 tables anyway (live) | MATCH (more than asked) | | |
| A5 | advisors:660 "some users may enable RLS with no policies intentionally to restrict access over APIs. In those cases we recommend making that intent explicit with a rejection policy."; PG ddl-rowsecurity:71 "If no policy exists for the table, a default-deny policy is used" | no policy on any app table (live: none in app or public) | DIFFER | not needed: no reason found. Deny already holds (PG :71); the doc only asks to say it | one migration: per app table `create policy <t>_none on app.<t> for select to anon, authenticated using (false);` (the doc's own form, advisors:663-665). The owner `postgres` has BYPASSRLS (live), and PG ddl-rowsecurity:77 "roles with the BYPASSRLS attribute always bypass the row security system", so the functions, the foreign keys and the cron job are unaffected. Clears the 7 INFO findings |
| A6 | rls:98 "Create a `.sql` file under `supabase/tests/` that asserts allow and deny for `select`, `insert`, `update`, and `delete`, for `anon` and `authenticated`."; rls:101 "Until the suite passes, you don't know whether the policies do what you intended." | no test touches a database: tests/sql.mjs:1-2 reads the migration text; tools/health.mjs:295-323 only checks that compare_room answers | DIFFER | not needed: owner-decisions.md:14 "What matters is kept by checks the machine runs by itself, stage by stage, not by memory" | a read-only grant probe (the catalog SELECTs of today's live file): anon executes exactly the 4 RPCs; no grant to anon, authenticated or PUBLIC on any app or public table; RLS on for every app table; no function ACL with PUBLIC. Where it runs: the connector at session start, or a GitHub job with the database password as a secret (the owner adds it). A pgTAP file on a local stack is the doc's way; it waits for F5-F7 |
| A7 | rls:90 "Views bypass RLS by default" | no view (live: app holds tables and indexes only; public holds no relation) | MATCH | | |
| A8 | prod:18 "Enable replication on tables containing sensitive data by enabling RLS and setting row security policies" | publication `supabase_realtime` holds no table (live) | MATCH | | |
| A9 | securing:31 "tables created in `public` receive `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges for `anon`... Functions receive `EXECUTE`."; securing:33 "Supabase is changing the platform default to revoke these automatic grants"; securing:212-213 `alter default privileges for role postgres in schema public revoke execute on functions from public;`; PG sql-alterdefaultprivileges:161 "you cannot revoke privileges per-schema if they are granted globally"; :199 "This command has no effect, unless it is undoing a matching GRANT" | live pg_default_acl for postgres in public: tables `anon=Dxtm` (select, insert, update, delete already gone), functions `{postgres=X}`, sequences `{postgres=rwU}`; no global entry, so a new function still gets EXECUTE for PUBLIC (PG ddl-priv:213 "EXECUTE privilege for functions and procedures"). None of this is in our migrations (platform state). Every migration revokes from PUBLIC per function (0001:47, 0003:51, 0004:71, 0005:74, 0006:47, 0007:57, 0008:73, 0009:168, :199, :253, :295, 0010:75) | MATCH for what we create | | none needed. Note: the doc's 4th statement is a no-op by PG 17; a future table in public would still give anon TRUNCATE, REFERENCES, TRIGGER, MAINTAIN (`Dxtm`), and PG ddl-rowsecurity:71 "Operations that apply to the whole table, such as TRUNCATE and REFERENCES, are not subject to row security". The A6 probe catches a missed revoke |

### B. Functions

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| B1 | functions:346 "When you use `security definer`, you must set the `search_path`."; advisors:763 "We recommend pinning functions' `search_path` to an empty string" | `set search_path = ''` on all five (0009:151, :183, :207, :261; 0010:38); live proconfig `search_path=""` | MATCH | | |
| B2 | PG sql-createfunction:379 "write pg_temp as the last entry in search_path"; PG runtime-config-client:122 "If it is not listed in the path then it is searched first (even before pg_catalog). However, the temporary schema is only searched for relation (table, view, sequence, etc.) and data type names." | with `''` the temp schema is searched first for relation and type names. All relations are qualified (`app.*`); types are not (`jsonb`, `json`, `text`, `bytea`, `numeric`) | DIFFER (from PG; MATCH Supabase) | needed: Supabase's own rule picks `''` (advisors:763). The PG risk needs a caller who creates temp objects in the same session; anon reaches the database only through RPCs and can execute only the 4 RPCs and the platform's graphql_public.graphql (live) | none now. If a role ever gets plain SQL: `set search_path = pg_catalog, pg_temp` |
| B3 | PG sql-createfunction:400 "you must revoke the default PUBLIC privileges and then grant execute privilege selectively. To avoid having a window where the new function is accessible to all, create it and set the privileges within a single transaction."; functions:355 "Revoke it from `public` and from each role holding a direct grant, such as `anon`. Then grant it to the roles that need it." | after each create: `revoke ... from public, anon, authenticated; grant ... to anon` (0009:199-200, :253-254, :295-296; 0010:75-76); app.allow revoked only (0009:168). 0009 and 0010 are one transaction each (0009:18, :329; 0010:14, :96). Live ACLs: `{postgres=X, anon=X}` on the 4 RPCs, `{postgres=X}` on app.allow and rls_auto_enable; authenticated and service role have no EXECUTE | MATCH | | |
| B4 | rls:653 'Never create one in a schema listed under "Exposed schemas"'; advisors:2011 "Some functions are deliberately exposed: a "submit contact form" function that `INSERT`s into a table the caller cannot otherwise write to, a public RPC that returns the count of public posts, etc. ... The function should validate inputs and limit what it does" | four SECURITY DEFINER functions in `public`, executable by anon: submit_run (0009:179-200), submit_playtest (0009:203-254), submit_issue (0009:257-296), compare_room (0010:33-76) | DIFFER (from rls:653) | needed: the lint 0028 page names this case as intended (advisors:2011, :2045); anon holds no table grant at all (0001:2-4) | none; record the 4 findings as accepted (G1) |
| B5 | advisors:2045 "Confirm the function validates input and limits what it does, then suppress." | submit_run: the room version must exist in app.room_schemas, consent 1..1000 and known (FK, 0010:28), size under 2048 bytes, JSON Schema (0009:188-194). submit_playtest and submit_issue: field lists, ranges, sizes (0009:209-248, :263-290). All three: per-source and game-wide caps (0009:195, :249, :291). compare_room: one room, aggregates only, a mean only at 10 or more (0010:45-50) | MATCH | | |
| B6 | functions:62 "Overloaded functions aren't supported. Give every function a unique name." | old signatures dropped (0009:175-177); live: no overloaded name in public | MATCH | | |
| B7 | functions:346 "Prefer `security invoker`, which is also the default." | app.allow is invoker (0009:148-152), not callable by any API role, run by the definer callers as postgres | MATCH | | |
| B8 | guides_database_postgres_event-triggers.md:73 the auto-RLS trigger acts only on `cmd.schema_name IN ('public')` | platform function public.rls_auto_enable with event trigger ensure_rls (live); 0002:5 revokes its EXECUTE from public, anon, authenticated (live ACL `{postgres=X}`). It never covers `app`; each migration enables RLS itself | MATCH | | |
| B9 | advisors:1963 "If you are not using `pg_graphql`, disable it"; :1965 "Disabling `pg_graphql` closes the `/graphql/v1` Query/Mutation surface" | pg_graphql is not installed (live pg_extension) | MATCH | | |
| B10 | advisors:1959 "Address findings from both lints together." (0028 anon, 0029 authenticated) | authenticated has no EXECUTE on any of ours (live); lint 0029 does not fire | MATCH | | |

### C. Abuse and rate limits

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| C1 | securing:294 "The `private.rate_limits` table records the IP address and timestamp of each write request."; :295 "more than 100 write requests in 5 minutes"; :116 X-Forwarded-For "takes the client IP before the first comma" | inside each submit function, not a pre-request hook (live: no `pgrst.db_pre_request`): per source 30 in 5 minutes (issues 60), game-wide 300 a minute (issues 600) (0009:195, :249, :291). Source = HMAC-SHA256 of CF-Connecting-IP under a 32-byte key (0009:116-117, :154-160); X-Forwarded-For not read (0009:143-145); rows gone after 10 minutes (0009:159, :136-137) | DIFFER | needed: owner-decisions.md:27 "Bots: a hashed IP kept 10 minutes"; the first X-Forwarded-For entry is written by the client (docs/research/forums-data.md:56-62, Supabase discussion #34647) | none. Open: U1 (does CF-Connecting-IP reach the database) |
| C2 | securing:290 "You can only rate-limit `POST`, `PUT`, `PATCH`, and `DELETE` requests. `GET` and `HEAD` requests run in read-only mode." | compare_room is STABLE (0010:36) and has no cap; anon's statement_timeout 3 s (live) bounds one call | MATCH (the doc's limit) | | none now; risk R2 |
| C3 | securing:360 a `pg_cron` "job to delete old entries from `private.rate_limits`" | job forget-recent-sources every minute (0009:136-137); live: 2,400 runs succeeded since 10.10 15:15 UTC, none failed | MATCH | | |
| C4 | prod:35 "Consider how *you* might abuse your service as an attacker, and take steps to mitigate it." | the design in B5 and C1; no recorded run of the attacks as anon against the live endpoints (docs/research/forums-data-2.md:23-24) | DIFFER | not needed: same reason as A6 | a scripted set of bad calls as anon inside begin...rollback on the live project. It calls the write functions, so only on his word (CLAUDE.md:40 "The live database is read only") |
| C5 | prod:45 "Perform load testing (preferably on a staging env)" | none | DIFFER | the owner's: a staging copy is Pro branching, paid (prod:71); owner-decisions.md:19 "Paid tools only when they help decisively" | see section 4 |

### D. Keys

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| D1 | keys:20 "Anyone can read it, so it only reaches what Row Level Security allows"; keys:334 "Send publishable and secret keys on the `apikey` header, not on `Authorization: Bearer`." | src/engine/results.js:7 a `sb_publishable_` key, sent as `apikey` (results.js:30, :40). Measured: GET /rest/v1/ with it answers 401 | MATCH | | |
| D2 | keys:27 "Supabase is deprecating the `anon` and the service role keys by the end of 2026."; keys:63 "They stay valid until you disable them"; keys:273 "Deactivation is reversible" | the legacy anon JWT key is still enabled (get_publishable_keys: `disabled: false`); no file in src, tools or tests uses it (grep) | DIFFER | not needed: no reason found | the owner deactivates the legacy keys in Settings > API Keys |
| D3 | keys:108 "A project doesn't need any secret keys if nothing uses them." | the repo uses none and forbids them (tools/secrets.mjs:21, tests/structure.test.mjs:206); which secret keys exist is not listed by the connector | UNVERIFIED | | the owner looks at Settings > API Keys |

### E. pg_cron, pg_jsonschema, Postgres details

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| E1 | guides_cron_install.md:13-16 `create extension pg_cron with schema pg_catalog; grant usage on schema cron to postgres; grant all privileges on all tables in schema cron to postgres;` | 0009:21-23, the same three lines | MATCH | | |
| E2 | guides_cron_quickstart.md:131 "not cleaned up automatically"; :155 `delete from cron.job_run_details where end_time < now() - interval '7 days'` | 0009:138-139, the same delete, daily at 03:17 GMT; live: active, 2 runs succeeded | MATCH | | |
| E3 | guides_cron.md:13 "we recommend no more than 8 Jobs run concurrently. Each Job should run no more than 10 minutes." | 2 jobs, each one short delete | MATCH | | |
| E4 | guides_database_extensions_pg_jsonschema.md:28 "create the extension within a separate schema (like `extensions`)" | 0009:20; live 0.3.3 in `extensions` | MATCH | | |
| E5 | pg_jsonschema:47 "generally used in tandem with a check constraint"; PG ddl-constraints:195 "PostgreSQL does not support CHECK constraints that reference table data other than the new or updated row being checked." | the check runs in submit_run against the schema row of that room version (0009:188-194) | DIFFER | needed: one schema per room version in a table (docs/research/revision-2-data.md:137-140, D5), and a CHECK may not read another table (PG :195) | none |
| E6 | github_pg_jsonschema_README.md:127 "Visit their docs for full details on which drafts of the JSON Schema spec are supported." | the schema says draft-07 (supabase/schemas/01-control-1.json:2); 0009's self-test (0009:301-319) passed on the live server, so the full report is taken and five bad ones refused | MATCH (by test) | | |
| E7 | PG ddl-system-columns:113 xmin "The identity (transaction ID) of the inserting transaction" | 0009:14-16 says the transaction number still shows which row came first | MATCH (our comment is right) | | |
| E8 | PG explicit-locking:364 transaction-level advisory locks "are automatically released at the end of the transaction" | pg_advisory_xact_lock with the same key in app.allow (0009:158) and in the cron job (0009:137) | MATCH | | |

### F. Backups, migrations, drift

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| F1 | backups:7 "Pro Plan projects can access the last 7 days of daily backups." | privacy.html:51 says the IP fingerprint may stay up to 7 days in the daily backups | MATCH | | |
| F2 | backups:9 "When you delete a project, we permanently remove all associated data, including any backups"; backups:7 free-tier projects should "regularly export their data" with the CLI `db dump` command "and maintain off-site backups" | no own dump: .github/workflows holds test.yml and reviewed.yml only. The accepted verdict docs/research/revision-2-data.md:210 "+ weekly own dump" is not done | DIFFER | not needed: the verdict was accepted with the tool revision (owner-decisions.md:77) | a weekly GitHub job: `supabase db dump` and `db dump --data-only`, kept off Supabase; the owner adds the database password as a GitHub secret. Keep app.limit_key out of any copy that leaves the project (it is the HMAC key); whether `db dump` can exclude a table: unverified |
| F3 | prod:49 "If you expect your database size to be > 4 GB, enable the Point in Time Recovery (PITR) add-on" | not on; the tables hold 3 rows | MATCH | | |
| F4 | migrations:196 "never change the remote database directly... Using the Dashboard's SQL editor ... bypasses the migration history" | 0009 and 0010 were run in the SQL editor (docs/state.md:11-14) and record themselves by an insert into supabase_migrations.schema_migrations (0009:321-325, 0010:90-92). Live: those 2 rows hold no statements; rows 0001-0008 hold statements equal to the files | DIFFER | the owner's: how he applies a migration (section 4) | |
| F5 | reference_cli_supabase-migration-list.txt "Only the timestamps are compared to identify any differences."; migrations:29 `supabase/migrations/<timestamp>_create_employees_table.sql` | files are `0001_runs.sql` ... `0010_consent_versions_compare_gate.sql`; the live versions are 14-digit timestamps | DIFFER | not needed: no reason found (tests/sql.mjs:6 sorts by name; timestamp names sort the same way) | rename each file to `<live version>_<live name>.sql`, e.g. `20261007121228_0001_runs.sql`; 4 code files name the old files (src/app/issue-report.js, src/app/playtest-report.js, src/engine/results.js, tests/results.test.mjs) and 9 docs. How the CLI parses the name: unverified until it runs |
| F6 | supabase-db-push (same file) "After successfully applying a migration, a new row will be inserted into the migration history table with timestamp as its unique id." | 0009 and 0010 write their own history row and wrap themselves in begin/commit (0009:18, :324-329; 0010:14, :91-96) | DIFFER | needed only while they run in the SQL editor (F4); under the CLI each would be recorded twice (inference from the quote) | decided with F4 |
| F7 | guides_local-development_declarative-database-schemas.md:233 "When `supabase/schemas/` contains files, it compares them against your migrations instead of reading the live database." | supabase/schemas/01-control-1.json sits in the CLI's declarative folder | UNVERIFIED (whether the CLI reads a .json file there) | not needed: no reason found to keep it there | move it to a folder the CLI does not read (e.g. `supabase/room-schemas/`); update tests/results.test.mjs and the file's `$comment` |
| F8 | docs/research/revision-2-data.md:211 "Drift check \| none \| GitHub job `db diff --linked` \| ADD" | not done; this file's section 3 is today's drift check by hand | DIFFER | not needed: accepted verdict (owner-decisions.md:77) | after F5-F7, the F2 job also runs `supabase migration list` and `db diff --linked` and fails on a difference |

### G. Platform and account (production checklist)

| # | Doc (file:line, words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| G1 | prod:13 "Check and review issues in your database using" the Security Advisor; keys:292 "Review each finding carefully before you dismiss it."; advisors:14 "Some findings may be intentional" | read today (section 2); the expected 11 findings are written nowhere (docs/research/forums-data-2.md:32-35) | DIFFER | not needed: owner-decisions.md:14 (checks the machine runs by itself) | write the 11 expected findings next to the A6 probe so a 12th one stands out; suppress per object once the dashboard shows how (advisors:2011 says it "can be suppressed"; how: not on the saved page) |
| G2 | prod:21 asks to turn on SSL Enforcement (Database > Settings > SSL Configuration); guides_platform_ssl-enforcement.md:7 the HTTP APIs "automatically enforce SSL on all incoming connections" | the game uses only HTTPS (results.js:6); the direct-connection setting is not readable here | UNVERIFIED | | owner: Database > Settings > SSL Configuration |
| G3 | prod:22 asks to enable Network Restrictions; guides_platform_network-restrictions.md:5 "control which IP ranges can connect to Postgres and its pooler" | not readable here | UNVERIFIED | | owner's dashboard; a GitHub job (F2) would need its runner's addresses allowed |
| G4 | prod:23 "protect your Supabase Account with multi-factor authentication (MFA)"; prod:28 "Consider adding multiple owners" | not readable here | UNVERIFIED | | owner's account |
| G5 | prod:69 "enable **Deploy to production** ... from your `main` branch"; prod:71 branching "to test migrations in a preview environment before they reach production" | migrations applied by hand on his word | DIFFER | the owner's: CLAUDE.md:39 "main is the live site: only on his word"; branching is paid (owner-decisions.md:19) | section 4 |
| G6 | prod:29-34 Auth items (email confirmations, OTP, SMTP, MFA for users) | the game never calls Auth (src: only `rest/v1/rpc`); a signed-up user would get `authenticated`, which holds no EXECUTE and no table grant (live) | not applicable | | whether sign-ups are open: UNVERIFIED (Authentication settings) |

## 2. The 11 advisor findings: what the doc says, and whether ours is the intended case

| Finding | Level | What the doc says it means | Ours the intended case? |
|---|---|---|---|
| anon_security_definer_function_executable: public.submit_run | WARN | advisors 0028: anyone with the public key can call it through `/rest/v1/rpc/<name>`; advisors:2009 "Option 3: Keep both `SECURITY DEFINER` and the `EXECUTE` grant — intentional", e.g. "a "submit contact form" function that `INSERT`s into a table the caller cannot otherwise write to" (advisors:2011) | yes: insert-only into app.runs, which anon cannot reach; validates and caps (B5). The owner is postgres (BYPASSRLS), so the "low-privilege owner" false positive (advisors:2046) does not apply: the finding is real and accepted, not mistaken |
| same: public.submit_playtest | WARN | as above | yes, same pattern (0009:203-254) |
| same: public.submit_issue | WARN | as above | yes, same pattern (0009:257-296) |
| same: public.compare_room | WARN | advisors:2011 "a public RPC that returns the count of public posts" | yes: returns aggregates of app.runs only, a mean only at 10 or more (0010:45-50); STABLE, cannot write |
| rls_enabled_no_policy: app.runs, app.playtests, app.issues, app.room_schemas, app.limit_key, app.recent, app.consent_versions | INFO x7 | advisors:622 with RLS on and no policy "no data will be selectable via Supabase APIs"; advisors:660 some do it "intentionally to restrict access over APIs" and should make it "explicit with a rejection policy" | yes, intended (deny by default, schema not exposed, no grants). The doc's recommended form is missing: A5 |
| unindexed_foreign_keys: runs_consent_known, playtests_consent_known, issues_consent_known | INFO x3 | advisors:78 "indexing foreign key columns is a standard practice for improving query performance"; the benefit named is joins along the relationship | not a doc case of "intended". No query of ours joins or filters on `consent` (0009:179-296, 0010:33-73) and app.consent_versions rows are never deleted, so the index buys nothing now. DIFFER-not-needed by the key: fix = three indexes in the next migration (`create index runs_consent_idx on app.runs (consent);` and the same for playtests, issues); low value |
| auth_db_connections_absolute | INFO | finding text: Auth "is configured to use at most 10 connections"; its remediation link (going-into-prod) has no text on Auth connections (grep of the saved page) | not applicable: Auth is unused. The doc's meaning beyond the finding text: UNVERIFIED |

## 3. Drift: migrations against the live server (12.10, about 07:10-07:30 UTC)

No drift found in any object our migrations create.
- History: the same 10 names (list_migrations). Rows 0001-0008 hold one statement each, byte-equal to the repo file
  without its last newline (md5 per file in the live readings). Rows 0009 and 0010 hold no statement (F4).
- Functions: the bodies of app.allow, submit_run, submit_playtest, submit_issue (last defined in 0009) and
  compare_room (0010) have the same md5 as the migrations' last bodies once CRLF is read as LF. Owner, SECURITY
  DEFINER, STABLE on compare_room, `search_path=""` and ACLs all as the migrations leave them. No old signature left.
- Tables: columns, defaults, NOT NULL, checks, primary keys, the three consent foreign keys and the indexes of all
  7 app tables are as 0001-0010 leave them; the old `created_at` indexes and identity sequences are gone (0009:25).
- Data the migrations load: app.room_schemas holds the exact text of 0009:66-112 (supabase/schemas/01-control-1.json
  is the same JSON value); app.consent_versions holds 0010:24-26; app.limit_key 1 row of 32 bytes (0009:117).
- Cron: both commands equal 0009:137 and :139; extensions as 0009:20-21.
- On the server but not from our files (platform or project settings): public.rls_auto_enable and the ensure_rls
  trigger, the pg_default_acl rows (A9), the role timeouts (anon 3 s). A rebuild from our files alone depends on
  them: 0002:5 fails where rls_auto_enable does not exist (U5).
- Small: the live bodies carry CRLF (pasted from a Windows checkout; the repo index is LF, `git ls-files --eol`).
  A text diff tool may show them as changed.

## 4. Checks of docs/research/revision-2-data.md's verdicts for the server (read in the code today)

| Verdict (revision-2-data.md line) | Done? | Where |
|---|---|---|
| Time and order: date only, random key (:203) | done | 0009:26-54; live `created_on date`, `id uuid` |
| Consent version in every row (:205) | done | 0009:33, 0010:17-30; live FKs |
| Validation: JSON Schema per room version (:207) | done | 0009:57-112, :188-194; live text equal |
| Bots: hashed-IP limit + schema checks + alert (:209) | partly: the limit and checks done; the "alert" is not (no row-count alert in tools/ or .github/workflows/) | 0009:114-167 |
| Backups: weekly own dump (:210) | not done | F2 |
| Drift check: `db diff --linked` job (:211) | not done | F8 |
| Retention clocks written (:212) | done in text | privacy.html:48-51, :58 |
| What is sent: "plus a test that no submit takes arrays" (:202) | not done as a test. The room 01 schema allows no array; submit_issue does not check the JSON type of `message`, `file`, `browser` (0009:283-285 checks only their text length) | |
| Send moment: keep/discard after the reveal (:206) | client side, outside part A; nothing in src matches keep/discard (grep) | |
| Codebook (:208) | the schema file only; no human page or errata | outside part A |

## 5. Risks the docs name that apply to us

1. R1. If CF-Connecting-IP does not reach `request.headers`, every call shares one source (0009:145-146), and the
   per-source cap becomes a game-wide cap of 30 runs in 5 minutes: the lock-out the design meant to prevent (U1).
2. R2. compare_room has no cap (C2). Each call reads app.runs; cheap at 1 row, grows with the table.
3. R3. A future table or function made in `public` gets platform defaults: PUBLIC EXECUTE for functions, TRUNCATE
   and three more for anon on tables (A9). Only our per-object revokes stand in the way; nothing checks them (A6).
4. R4. Deleting the project deletes its backups (backups:9); no copy exists outside Supabase (F2).
5. R5. The migration files cannot be used with the CLI as they are (F5-F7), so the planned drift job and a local
   pgTAP test cannot start until they are renamed and moved.

## 6. Results

DIFFER rows that are not needed (the fixes):
- A5: a rejection policy per app table (`for select to anon, authenticated using (false)`); clears 7 INFO.
- A6 with G1: a read-only grant probe plus the written list of the 11 expected advisor findings.
- C4: the attacks as anon inside begin...rollback on the live project, on his word (it calls the write functions).
- D2: the owner deactivates the legacy anon key (reversible).
- F2: a weekly own dump by a GitHub job (the owner adds the database password as a secret; keep app.limit_key out).
- F5: rename the migration files to `<live version>_<live name>.sql`.
- F7: move 01-control-1.json out of `supabase/schemas/`.
- F8: the drift job (`migration list`, `db diff --linked`) after F5-F7, in the F2 job.
- unindexed foreign keys (section 2): three indexes on `consent`; low value.

The owner's to decide (no source settles them):
- F4/F6: how a migration reaches the live server. (a) SQL editor and the file's own history insert, as 0009-0010
  (works; history rows without text; CLI-incompatible). (b) `supabase db push` run by him from the laptop (doc's
  way; needs the CLI linked with the database password; the files must be renamed first, F5). (c) the connector's
  apply_migration on his word (how 0001-0008 went in, with their text kept); today a hook refuses it.
- C5/G5: a load test and migration previews need a staging copy: Pro branching (paid) or none.
- G5: the GitHub integration's "Deploy to production" from main, against CLAUDE.md:39 "main is the live site: only on his word."

Could not verify:
- U1. Whether CF-Connecting-IP reaches `request.headers` on our project (app.recent forgets in 10 minutes; reading
  it needs one real call and a read within 10 minutes: his word).
- U2. SSL enforcement, network restrictions, account MFA, a second org owner, Auth sign-ups open or not, secret
  keys present (dashboard only: G2-G4, G6, D3).
- U3. How an advisor finding is suppressed (the saved page says it can be, not how).
- U4. How the CLI parses our file names and whether it reads a .json in `supabase/schemas/` (F5, F7); no CLI run.
- U5. Whether a fresh `supabase db reset` from our files runs: 0002 needs the platform's rls_auto_enable; 0009 and
  0010 hold begin/commit and their own history insert.
- U6. What auth_db_connections_absolute asks for beyond its text (its link has nothing on it).
- U7. Whether `db dump` can leave out one table (app.limit_key).

## 7. Counts

- MATCH: 27 (A1-A4, A7-A9, B1, B3, B5-B10, C2, C3, D1, E1-E4, E6-E8, F1, F3)
- DIFFER-needed: 5 (B2, B4, C1, E5, F6 while F4 stands)
- DIFFER-not-needed: 9 (A5, A6, C4, D2, F2, F5, F8, G1, unindexed foreign keys)
- DIFFER, the owner's: 3 (C5, F4, G5)
- UNVERIFIED: 6 (D3, F7, G2, G3, G4, G6's sign-ups)
- Not applicable: G6 (Auth unused), auth_db_connections_absolute
