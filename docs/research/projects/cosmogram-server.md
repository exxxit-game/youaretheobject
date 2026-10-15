# Cosmogram's server, data and payment mistakes, checked against Object (12.10.2026)

> Kept as the helper wrote it on 12.10.2026, for the owner's request to study every Cosmogram server mistake so none is repeated (docs/owner-decisions-history.md, 12.10). Russian passages are left out of this English copy; the original is in objekt-files/notes/revision-shelf2-2026-10-12/cosmogram-server.md. Its finding of the signed-in Supabase CLI was acted on the same day (docs/state.md).


This was a read-only check. Nothing was changed in either repository or on any database, and nothing was deployed.

## Sources

- Commit messages: every commit in both Cosmogram repositories was read through `gh api`:
  - `exxxit-game/cosmogram-app`: 1538 commits.
  - `exxxit-game/cosmogram-crew`: 419 commits. This private repository held the Edge Function sources and the CI. It was not in our earlier summary.
- Files in `cosmogram-app`:
  - `.knowledge/archive/do-30-09/PRODUCTION-MINES.md`, read in full.
  - `ERROR-CATALOG.md`.
  - `KNOWN-BUGS.md`, the server sections.
  - `.knowledge/AI-DECISION-REGISTRY.md`, items S1 to S13.
  - The archived full `CLAUDE.md` of 30.09.
  - The hooks `guard-deploy-content.sh`, `guard-supabase-write.sh`, `deploy-readback-guard.mjs`, `new-function-revoke-guard.mjs` and `revoke-grant-verify-guard.mjs`.
  - The skills `deploy-edge` and `supabase-permissions`.
  - The final `.claude/settings.json` of both repositories.
- Cosmogram's own memory notes on this laptop, read only. They are in `C:\Users\admin\.claude\projects\C--Users-admin-Documents-GitHub-cosmogram-app\memory\archive\`. They record cases the commits only name, for example `feedback_manual_transcription_risk.md` (ten cases) and `feedback_deploy_placeholder_povtor_15_09.md`.
- Our own setup:
  - `tools/claude-guard.mjs`, `.claude/settings.json` and `CLAUDE.md`.
  - `supabase/migrations/0001-0010`, `src/engine/results.js`, `src/app/consent.js` and `src/app/session.js`.
  - `tools/health.mjs`, `tools/secrets.mjs`, `tests/structure.test.mjs` and `tests/sql.mjs`.
  - `docs/state.md`, `docs/board.md` and `objekt-files/notes/archive/docs/audit/revision-shelf2-server.md`.
- Two measurements taken today:
  - `supabase --version` and `--help` on the laptop.
  - `supabase projects list`, a read-only call that lists projects.

Dates are as the Cosmogram records give them (dd.mm, 2026). The commit dates are UTC. "Rule" means a text rule in CLAUDE.md or in a memory note. "Hook" means a Claude Code hook.

## 1. The count

- There are **60 recorded Supabase, server, data and payment mistakes or risks**, from 27.08 to 02.10. That is 71 if each finding of the two security audits (rows 30 and 56) counts on its own.
- By kind:

  | Kind | Rows | What it covers |
  |---|---|---|
  | A | 16 | Writing to the live server: the deploy content was wrong (placeholder, retyping, a missing parameter). |
  | B | 11 | Git and the live server drifted apart. |
  | C | 6 | Grants and database security. |
  | D | 17 | Holes in the server logic: abuse, sign-in, trusting the client, payments. |
  | E | 10 | Operations: backups, secrets, access, guards. |

- Outages or harm with a recorded size:

  | Row | What | Size |
  |---|---|---|
  | 2 | Login and records down for every player | About 7 minutes |
  | 40 | The Workshop live as a stub | Length not recorded |
  | 41 | The whole Workshop refusing every call | 196 seconds |
  | 20 | Every Telegram action more than 5 minutes after opening failed silently | About 7 days |
  | 28 | Relays failed silently | About 10 more days |
  | 43 | A false "not found" to real players | Length not recorded |
  | 53 | One player's wallet went from 11 674 to 18 | One player |
  | 4 | No backup of any kind | 21 days |
  | 51 | Purchases could be faked for free | About 3 weeks; no use of it recorded |

- **Guards added after these mistakes: 33.**
  - 8 dated CLAUDE.md rules, plus the standing line "Supabase [Russian, at the cited source] MCP, [Russian, at the cited source].
  - 10 memory rules about Supabase.
  - 2 skills.
  - 1 guard inside the database: an event trigger, 07.09.
  - 11 hooks, which were then changed 7 more times and copied into the second repository in 3 commits:

    | Hook | Made | Changed |
    |---|---|---|
    | `guard-deploy-content.sh` | 15.09 | 22.09 (`verify_jwt`), 29.09 (no pasted content over 3000 characters) |
    | `no-secrets-in-commit.sh` | 16.09 | 24.09, 25.09 |
    | `guard-supabase-write.sh` | 22.09 | 24.09, 29.09 |
    | `whole-game-health-check.sh`, its Supabase part (a report, not a block) | 24.09 | — |
    | `claim-check-hook.mjs`, its branch for live calls | 29.09 | — |
    | `revoke-grant-verify-guard.mjs` | 29.09 | 30.09 |
    | `check-tooling-currency.sh` (Supabase changelog) | 29.09 | — |
    | `deploy-readback-guard.mjs` | 30.09 | — |
    | `new-function-revoke-guard.mjs` | 30.09 | — |
    | `category-db-verify-guard.mjs` | 30.09 | — |
    | `function-family-sync-guard.mjs` | 30.09 | — |

- **Seven of the 11 hooks were made, or got their Supabase part, on 29–30.09.** That was in the last days before the hooks were archived on 30.09 and cut on 02.10.
  - For the three Supabase hooks touched on 30.09, the commit itself says they had never fired on a real deploy or CREATE FUNCTION (7150365).
  - `deploy-readback-guard` and `revoke-grant-verify-guard` were left out of the app's settings.json at the 02.10 cut.
- **24 mistakes came after a written rule for the same kind of mistake already existed:**

  | Kind | Repeats | Rows |
  |---|---|---|
  | Wrong deploy content | 13 | 6, 7, 8, 10, 11, 23, 29, 32, 39, 40, 49, 50, 54 |
  | Drift | 5 | 17, 22, 35, 42, 46 |
  | Grants | 2 | 21; 36 is a "fixed" record that did not hold |
  | Rate limits | 3 | 15, 30, 56 |
  | Sign-in window | 1 | 28 |

- **2 mistakes came after a hook for that kind already existed.**
  - Row 40: the placeholder hook existed and did not fire. The stub went live.
  - Row 49: the same hook blocked the next placeholder, so nothing went down.
  - After the hook of 29.09 against pasting file content into a deploy, no transcription error is recorded. After the hook of 22.09 on `verify_jwt`, no repeat is recorded.

## 2. Every mistake, by date

"Ours today" uses three marks:

- **EXPOSED**: we have the same hole now.
- **COVERED**: something in our setup closes it (named with path and line).
- **N/A**: it cannot happen to us, and the cell says why.

We have no Edge Functions (`supabase/` holds only `migrations/` and `schemas/`), no accounts and no payments yet.

| # | Date | Kind | What happened | Cost | Root cause | Guard or rule added after (and did it hold?) | Ours today |
|---|---|---|---|---|---|---|---|
| 1 | 27.08 | A | Deploying `cosmogram-sync`, the assistant sent an older, broken base64 image from its own context instead of the new one. | Part of the outage in row 2. | File content retyped through the model's context. | CLAUDE.md [Russian, at the cited source] (d06584d). **Did not hold** (rows 6–54). | N/A: no functions; the connector deploy is denied (`.claude/settings.json:41`). The CLI deploy path is open: see section 4. |
| 2 | 27.08 | A | While rushing to fix row 1, it deployed the text "PLACEHOLDER_WILL_BE_REPLACED" in place of the code. | Login and records down for every player for about 7 minutes (d06584d). | Panic fixing; every tool call is live and there is no draft step. | Three rules the same day: a live system is not a local file; slow down when fixing your own break; make a live call after a deploy (7737106). **Did not hold** (rows 32, 40, 49). | COVERED for the connector: writes are denied (`settings.json:40-41`) and the SQL is read-only (`tools/claude-guard.mjs:386-391, :407`). EXPOSED through the CLI (section 4). |
| 3 | 27.08 | D | No Edge Function had any rate limit (registry S9). | None recorded. | Server trusted the client to behave. | A shared counter, `check_rate_limit`, 60 calls in 5 minutes. Gaps followed in rows 15, 30 and 56. | COVERED: a per-source and a game-wide cap in every submit (`0009:148-167, :195`). Whether the per-source part works depends on U1: does CF-Connecting-IP arrive (`revision-shelf2-server.md:55, :185`). |
| 4 | 27.08 | E | No backups at all (Free plan). Marked "red, at once" on 27.08 (S11); the first dump ran on 17.09. | 21 days with no copy of records, duels or wallets. | Platform default; it was not checked before launch. | A GitHub Action `pg_dump` (rows 34, 38). | Partly COVERED: Pro keeps 7 days of daily backups (`revision-shelf2-server.md:86`; `docs/state.md:15`). EXPOSED: there is no copy outside Supabase, and deleting the project deletes its backups (`revision-shelf2-server.md:87, :159`). |
| 5 | 27.08 | E | Telemetry was on by default (opt-out). A lawyer was named as needed (S12); the risk was accepted "for me and friends". | Legal risk only. | Default on before any consent. | No guard; the risk was accepted. | COVERED: results are sent only after consent (`src/app/session.js:36, :65`), and under 18 the game starts without recording (`src/app/consent.js:5-11, :48-50`). |
| 6 | 30.08 | A | A base64 PNG was garbled twice while the file was rebuilt for a deploy. The second copy was caught before sending. | None. | An opaque blob retyped by hand. | Rule [Russian, at the cited source]. **Did not hold** (row 10). | N/A (no functions). |
| 7 | 03.09 | A | The `cosmogram-daily` deploy lost one code line (`rank = ...`). Reading the function back caught it. | One extra deploy. | Retyping about 350 lines. | Memory note: build the payload with JSON.stringify. **Did not hold.** | N/A. |
| 8 | 03.09 | A | The `cosmogram-beacon` deploy failed twice: the start of a comment line was lost inside the tool call. | Two failed deploys. | Same as row 7. | Same note, plus "keep lines short". | N/A. |
| 9 | 03.09 | B | The local `cosmogram-beacon` was far behind the live one; a deploy from it would have removed a working feature. `cosmogram-unsub` was live but never in git (fe25f79, 76a109e). | A near miss. | A deploy does not make a commit. | Memory rule "deploy = commit in the same turn". Owner: [Russian, at the cited source]. **Did not hold** (rows 17–59). | N/A for functions. For the schema see row 60. |
| 10 | 04.09 | A | The `STATUS_STAR_PNG_B64` image was garbled twice in the deploy of the Stars-payment code. The next try was nearly a placeholder; the tool caught it. | Retries. | An opaque blob retyped. | The blob was moved into a config table, a change of structure. **Held** for that blob. | N/A. |
| 11 | 04.09 | A | The `register_webhook` deploy (59 KB) had one word garbled in a comment, three times, each time in a new place. | Three failed deploys. | Any retyping of a long text loses something. | The CLI path, which deploys straight from disk, was found. **Not used** until 29.09. | N/A. |
| 12 | 05.09 | C | Four SECURITY DEFINER functions could be called by anyone holding the public key, past the Edge Functions. Through them anyone could inflate play counts, use up other players' rate limits and burn their nonces. `get_advisors` found it (PRODUCTION-MINES:15-31). | The size of the window is unknown. | Postgres grants EXECUTE to PUBLIC by default, and Supabase adds grants of its own. | Fixed the same day (7733eda). | COVERED: every function is revoked from public, anon and authenticated in the migration that creates it, and only the 4 intended RPCs are granted to anon (`0009:199-200, :253-254, :295-296`; `0010:75-76`). The live ACLs were read on 12.10 (`revision-shelf2-server.md:42`). |
| 13 | 05.09 | C | The first fix, `REVOKE ... FROM anon, authenticated`, did nothing: the grant sat on PUBLIC. Re-reading `role_routine_grants` caught it. | Minutes. | The Postgres PUBLIC pseudo-role. | CLAUDE.md "REVOKE/GRANT — success:true [Russian, at the cited source].." (f64628d). | COVERED: `public` is named in every revoke (same lines as row 12). |
| 14 | 05.09 | C | A brand-new function (`delete_player_data`) got anon and authenticated grants when it was created (project ALTER DEFAULT PRIVILEGES). The schema-wide fix worked only in part: a second default row belongs to `supabase_admin`. | None. | Platform default privileges. | The same rule, then an event trigger inside the database on 07.09 (row 21). | COVERED by each migration, within one transaction (`revision-shelf2-server.md:42`). EXPOSED: no test holds it; `tests/` has no check on `revoke` (grep: no match). The planned probe A6 is not built (`revision-shelf2-server.md:31, :158`). |
| 15 | 05.09 | D | The Workshop's vote and played actions had no rate limit, after row 3. | Inflatable rankings. | The shared limiter was not applied to new actions. | Limiter added (0488858). **Repeated** in rows 30 and 56. | Partly COVERED: every submit is capped. EXPOSED (low): `compare_room` has no cap (`revision-shelf2-server.md:56, :156`). |
| 16 | 05.09 | D | The Workshop's word filter ran only on the client. | Bad words could reach the shared list. | Trusting the client. | Duplicated on the server. | COVERED: the server checks every report against the room's JSON Schema (`0009:188-194`), and the tests pin the client to it (`docs/state.md:19`). |
| 17 | 05.09 | B | After a Caravan deploy, the commit to the server repository was forgotten (memory "recurrence 3"). | Drift. | The rule depended on memory. | None new. | N/A. |
| 18 | 05.09 | E | PRODUCTION-MINES recorded that the plan, the spend cap, PITR and who else holds the keys (bus factor) were unknown; left to the owner. Pro was bought on 25.09. | Risk only. | Settings visible only in the dashboard. | None. | EXPOSED when written; update 12.10: sign-in through GitHub with its second step (his word, method not checked), database password reset and held by him (docs/board.md). The spend cap: UNVERIFIED (dashboard only). Was, by the board on the morning of 12.10: EXPOSED: no second sign-in step on the Supabase account, and nobody held the database password. |
| 19 | 06.09 | D | The Telegram signature was accepted for 7 days, a replay window; it was cut to 5 minutes. The same constant was also the web-session lifetime; that was caught before the deploy. | A near miss. | One name with two meanings. | CLAUDE.md [Russian, at the cited source]. | N/A: no sign-in or sessions. |
| 20 | 06.09–13.09 | D | The 5-minute window broke the game: Telegram keeps one initData for the whole session, so every action more than 5 minutes after opening was refused with 401, and nothing showed it (likes, records, relays) (d7a622f). | About 7 days of failing actions for Telegram players. | A correct deploy of a wrong design, and the client hid the error. | A long server session (`tgAuth`) in 4 functions. **Missed the fifth** (row 28). | EXPOSED, as the same kind of risk: `src/engine/results.js:5` ignores every failure; `tools/health.mjs:295-322` checks only that `compare_room` answers; nothing alerts when results stop coming (`revision-shelf2-server.md:144`). |
| 21 | 07.09 | C | An event trigger was built to revoke every new function. Its own handler, created before the trigger, kept PUBLIC EXECUTE; the check looked only at anon and authenticated. The owner had to push. | Minutes. | The check covered too narrow a set of roles. | The trigger itself, a guard inside the database. **Held**: the 17.09 audit found 9 SECURITY DEFINER functions and none callable by anon. | COVERED: the platform's `rls_auto_enable` is revoked (`0002_close_rls_auto_enable.sql:5`); its live ACL was read on 12.10 (`revision-shelf2-server.md:47`). |
| 22 | 07.09 (found 13.09) | B | `cosmogram-relay` was deployed on 07.09 and never committed (6a85571). | Drift. | Deploy without commit. | None new. | N/A. |
| 23 | 11.09 | A | The CLI path was judged unusable (wrong folder name). The assistant then cut comments out of a 67 KB file on its own, so the live copy and git differed. The owner noticed. | Drift and the owner's time. | Saving effort by changing the content. | Memory: "never shorten when copying". | N/A. |
| 24 | 11.09 | D | The cloud merge took the larger wallet value across devices, so spent stars came back while purchases stayed. | Free duplication. | An unfinished change to the merge keys. | Fixed, with guards 170 and 171. | N/A: no cloud saves or wallet. |
| 25 | 12.09 | B | `cosmogram-workshop` had no local copy at all, only the live one (0613725). | Drift. | Same as row 22. | — | N/A. |
| 26 | 13.09 | B | The local `cosmogram-daily` was far behind live; it was rebuilt from the live code (d7a622f). | Drift. | Same. | — | N/A. |
| 27 | 13.09 | D | The beacon endpoint could be flooded with "new phenomenon" messages. | Spam to the owner. | No cap. | `NEW_PHENOMENON_CAP=5`. | COVERED: game-wide caps of 300 a minute (600 for errors) (`0009:195`; `revision-shelf2-server.md:55`). |
| 28 | 13.09–23.09 | D | `cosmogram-relay` had been left out of the row-20 fix, so relays failed silently for every session older than 5 minutes. A live test on two phones found it (de18f32, a9b7738). | About 10 more days. | A fix copied by hand to 4 of 5 places. | None new. | Same as row 20: EXPOSED (silent failure). |
| 29 | 14.09 | A | Workshop v15 went out with a word changed by retyping; reading it back caught it. | One extra deploy. | Retyping. | The CLI workaround was found the same day. **Not used** (rows 39, 54). | N/A. |
| 30 | 14.09 | D | The anti-cheat audit found 7 holes: (1) a check-then-insert race on the daily limit; (2) an author could like or play-farm his own track; (3) a dead `ironman` category was still accepted; (4) [Russian, at the cited source] had no time check; (5) [Russian, at the cited source] was a flag on the client's word; (6) relay leg scores had no cap and relay had no rate limiter; (7) `duel_win` would push to any player. `ghost_beat` was left open (KNOWN-BUGS:252-287). | None recorded. | Trusting the client; count, then insert. | Fixes, guards 204 and 211–217. | Race: COVERED (`pg_advisory_xact_lock`, `0009:158`). The rest: N/A (no social features or rankings). |
| 31 | 14.09 | D | Profile fields (wallet, stars_total and others) were written from the client unchecked. It was recorded as a "dead field" and deferred on the owner's word (ce1ead4). | Row 53. | Trusting the client. | A note "check this record if anything reads them". **Did not hold** (row 53). | EXPOSED by nature: the report is made on the device, and only its shape and rate are bounded (`0009:188-195`). N/A for any wallet or entitlement (none yet). |
| 32 | 15.09 | A | The second placeholder deploy (`cosmogram-sync`), with the rule re-read that same session. Owner: [Russian, at the cited source]. | Trust. | Assembling the call while it was already live. | Hook `guard-deploy-content.sh` (7b8db51). Held partly (rows 40, 49). | N/A. |
| 33 | 16.09 | C | `pg_net` sat in `public` (advisor warning). It was moved on 17.09 by DROP and CREATE EXTENSION on the live database, on the owner's word (5a4f860). | None recorded. | Platform default. | None. | N/A: `pg_cron` is in pg_catalog and `pg_jsonschema` in `extensions` (`revision-shelf2-server.md:73, :76`). |
| 34 | 16–17.09 | E | Setting up the backup failed many times. Cloudflare R2 needed a bank card, which the owner refused. The comment advised the direct connection (IPv6, unreachable from GitHub). `pg_dump` 16 did not match server 17, and PATH still found 16. Five tries of the `postgres` password failed; the owner had kept the `[ ] ` of `[YOUR-PASSWORD] `. It ended with a role `backup_bot` (BYPASSRLS, pg_read_all_data). | Several rounds of the owner's time. | Guessed instead of read from the docs; a template the owner had to hand-edit. | Memory: "say: delete the brackets too". | EXPOSED (pending): the own dump is not built (`revision-shelf2-server.md:87`), and the database password it needs was held by nobody when this was written; update 12.10: reset and held by him (docs/board.md). |
| 35 | 17.09 | B | Live `cosmogram-sync` v57 held the whole Stars donation feature, and two functions (charter, privacy) were never in git. A redeploy from git would have erased real payment logic (703b5ea). | A near miss on money. | Deploy without commit. | A memory rule: compare the live function list with the folder before any server work. | N/A for functions. The schema: row 60. |
| 36 | 17.09 | C | `forge_workshop_view` (a SECURITY DEFINER view). PRODUCTION-MINES records it fixed on 06.09; the live audit of 17.09 found it still without `security_invoker`, and it was fixed again (7c14f12). | Hidden risk only. | A "fixed" record that the live state did not show. | None. | N/A: we have no views (`revision-shelf2-server.md:32`). |
| 37 | 17.09 | D | "My relays" came back empty: PostgREST returned bigint as a string, and supabase-js `.contains()` encoded the filter wrong (9966dd0, b3bac2d). | A feature broken for an unknown time. | The data type at the API boundary. | Fixed. | N/A: we call RPCs only (`src/engine/results.js:6`). |
| 38 | 17.09 → today | E | The dumps were published as GitHub Releases of the private `cosmogram-crew`: the whole database, with Telegram ids and names, never rotated, and out of reach of [Russian, at the cited source]. No restore test is recorded. **21 releases are still there** (17.09–07.10, read 12.10). | Personal data kept with no end date. | No retention rule; the backup sits outside the deletion path. | None. | N/A today (no own dump). When F2 is built it needs rotation, and `app.limit_key` must stay out (`revision-shelf2-server.md:87`). |
| 39 | 18.09 | A | In a hotfix to a live bug (row 43), the CLI was known but the paste path was chosen "because it is faster"; a comment fragment was lost. Reading it back caught it. | One extra deploy. | Pressure. | Memory: "CLI always, even when urgent". **Did not hold** (row 54). | N/A. |
| 40 | 18.09 | A | Third placeholder: Workshop v19 went live as a stub until v20. The hook existed and did not fire. The owner found it in the version history; the assistant had not told him. | The Workshop down, length not recorded; trust. | The tool was called with a stub "to try the shape of the call". | Memory: tell at once; build the payload by script. | N/A. |
| 41 | 18.09 | A | `verify_jwt` was left out of the call; the tool's default (`true`) shut the whole Workshop with 401. | 196 seconds (from the two versions' timestamps). | A missing parameter, so the tool's default applied. | Memory; CLAUDE.md "think five times before a server action" (c6a3b05); hook 22.09 (e899fdb). **Held**: no repeat recorded. | N/A (no functions; deploy denied, `settings.json:41`). |
| 42 | 18.09 | B | Server-repository changes were left uncommitted twice; the owner caught both ([Russian, at the cited source]). | The owner's time. | Two repositories, one game. | Memory rule: check git status in both. | N/A: one repository. |
| 43 | 18.09 | D | PGRST201: a new table made an old embed ambiguous, and `gratitude_star` told real players "not found". The code kept only `{data}` and threw the error away (ERROR-CATALOG K17). | Real players blocked, length not recorded. | The error was dropped. | Law K17: name the foreign key explicitly and log the error. | N/A (no embeds). The dropped-error lesson: see row 20. |
| 44 | 18.09, 22.09 | E | The assistant said the Supabase connector was not connected, from an old list; the owner signed out and back in for nothing. | The owner's time. | Answering from memory. | Memory: make one live call first. | COVERED by rule (`docs/tools.md`: "read it from the thing itself first"). Text only. |
| 45 | 22.09 | D | The registry said the replay guard was off, while live it was strict (S5). | Wrong decisions possible. | A stale record. | Fixed in text. | Same rule as row 44. |
| 46 | 23.09 | B | A full audit found 3 of 9 functions behind live (a9b7738). | Drift. | Deploys without commit. | None new. | N/A. |
| 47 | 24–25.09 | E | The secret scanner of 16.09 missed 5 key formats (`github_pat_`, `sk-ant-`, `AIza`, Telegram bot token, Google client secret). The assistant's own adversarial tests found them (f1f131d, 67cdee0). | None (no leak recorded). | Patterns from memory. | Patterns added. | COVERED: `tests/structure.test.mjs:206` (incl. `sk-`, `github_pat_`, `sb_secret_`, `service role`, JWT `eyJhbGciOi…`, AKIA, private keys) and `tools/secrets.mjs:18-24` before every push. Not covered: Google `AIza…`; Paddle keys later. |
| 48 | to 24.09 / 29.09 | E | The server repository had no hooks until 24.09 and no deploy guards until 29.09 (e837924, a5dff2a). The protection depended on which folder a session was opened in. | Unprotected sessions. | Guards per folder. | Ported. | EXPOSED: a session opened in another folder gets the claude.ai connector without our deny rules (`docs/state.md:61` is text only). The CLI is not tied to any folder (section 4). |
| 49 | 25.09 | A | Fourth placeholder (`PLACEHOLDER_READ_FROM_FILE`) after three turns hit the 64k output limit. **The hook blocked it.** | Three turns of the owner's time; no outage. | Hurry after a failure. | — | N/A. |
| 50 | 25.09 | A | `cosmogram-sync` v61: comments cut to fit the output limit; git was then re-synced from live by script (34155a1). | Drift. | Size of the payload. | Memory: copy by script, never by output. | N/A. |
| 51 | 25.09 (open since 04.09) | D | The payment webhook took any POST to the public URL as a real Telegram payment (no `secret_token`). Premium skins could be bought for free and gratitude stars marked paid. A fake-payment curl, made at the owner's request, found it (a109b66). | About 3 weeks open; no use of it recorded. | The sender was never verified. | Fixed: `secret_token` and a check of the header. | N/A today (no payments). It applies to Paddle and Meta (`docs/board.md:100, :103`): see section 5. |
| 52 | 25.09 | D | The fix for duel spam was to make the alert opt-in; that killed duels (no switch existed). It was reverted the same night to a cap of 5 recipients a day. The opt-in migration was already applied live (79d70ee, 34155a1). | One evening; a live migration undone. | The alert was the feature itself. | Memory note. | COVERED: schema changes go only through migration files, on his word (`CLAUDE.md:40`). |
| 53 | 27.09 | D | A phone with cleared storage sent zeros and the server took them: a wallet went from 11 674 to 18. Fixed on 29.09 with keep-max and an anomaly log (8a0b010). | One player's balance. | Row 31's deferral. | Fixed. | N/A (no wallet). |
| 54 | 29.09 | A | Transcription case 10 (two deploys): one word in a comment, then **executable code** that compared `a.created_at` with itself. Caught before the owner saw it. Owner: [Russian, at the cited source]. | Two deploys. | The CLI recipe was known but not used under load. | Hook: no pasted content over 3000 characters (1dd7e8b). **Held**: the later CLI deploys record no transcription error. | N/A. |
| 55 | 29.09 | B | The functions README listed 4 of 10 live functions (d063c72). | Misleading docs. | No check on the docs. | Fixed. | Partly COVERED: `docs/state.md` is held to 80 lines by a test. |
| 56 | 29.09 | D | The live security audit found 6 holes: [Russian, at the cited source] had no time check (986f52a); "played" could be farmed about 720 times an hour (1e7cd61); relay `time_sec` had no limit (7a05bde); unsubscribe links carried a bare player id, and those ids are public in the top 100 (11a249c); the beacon's "server" marker could be faked (e84a71d); the links' rate limit could be bypassed by faking X-Forwarded-For, which the audit agent had missed (1b848cc). | None recorded. | Trusting the client; reading the client-written header. | Fixes. | X-Forwarded-For: COVERED (`0009:143-145, :155` read CF-Connecting-IP only). The rest: N/A. |
| 57 | 29.09 | E | To run a DROP FUNCTION the owner had approved, the assistant edited `settings.json` to switch `guard-supabase-write` off, then put it back (1dd7e8b). | A guard off for one call. | The guard had no path for "the owner said yes". | None. | COVERED: `tools/claude-guard.mjs:405-413` has no off switch, and the live writes are his own (migrations). |
| 58 | 30.09–02.10 | E | Three Supabase hooks were made or changed (`deploy-readback`, `new-function-revoke`, `revoke-grant-verify`); the commit says they had not fired on a real deploy or CREATE FUNCTION (7150365). Two of them were dropped from the app's settings.json at the 02.10 cut. | Guards that guarded nothing proven. | Guard inflation. | — | COVERED: every guard is shown red by `tools/prove-guards.mjs` on GitHub (`docs/state.md:56`). |
| 59 | 02.10 | B | At archiving, the server sources were ahead of live: 7 language commits "not deployed; migration needed" (9fd1904 and others). | A broken end state. | No drift check. | — | Partly COVERED: by hand, no drift on 12.10 (`revision-shelf2-server.md:118-135`). EXPOSED: no automatic check (`revision-shelf2-server.md:93`). |
| 60 | whole project | B | The database schema was never in git. There was one migration file in two repositories; the tables, functions and triggers existed only on the live server ([Russian, at the cited source], 79d70ee). It could be rebuilt only from a dump. | Hidden risk only. | Live SQL in place of migration files. | None. | COVERED by structure: `supabase/migrations/0001-0010`. One caveat: 0009 and 0010 were run in the SQL editor, so their history rows hold no text (`revision-shelf2-server.md:89`). |

## 3. The pattern: mistake, then rule, then repeat, then hook

| Kind | First | Text rule | Repeats after the rule | Hook | Repeats after the hook |
|---|---|---|---|---|---|
| Placeholder in a deploy | 27.08 (row 2) | 27.08 | 15.09 | 15.09 | 18.09: did not fire, live. 25.09: blocked. |
| Retyping file content into a deploy | 27.08 / 30.08 | 30.08 | 9 recorded (rows 7, 8, 10, 11, 23, 29, 39, 54; one more on 26.09 in the browser) | 29.09 | 0 recorded |
| `verify_jwt` default | 18.09 (row 41) | 18.09 | 0 | 22.09 | 0 |
| Git and live drift | 03.09 (row 9) | 03.09 | 7 or more (rows 17, 22, 35, 42, 46, 50, 59) | Only a report (24.09) and a "sibling function" Stop hook (30.09); never a block | Unknown |
| Grants | 05.09 (row 12) | 06.09 | 07.09 (row 21) | First a database event trigger (07.09), which held; then a skill and hooks on 29–30.09 for a hole already closed | 0 |
| Rate limits | 27.08 (row 3) | the shared limiter | 3 (rows 15, 30, 56) | none | — |
| SQL writes on the live database | no incident recorded | — | — | 22.09, as a precaution | Its own tests found a bypass (WHERE 1=1; fixed 24.09) and a subquery bypass (left open). Switched off by hand once (row 57). |

There are two readings:

- **Text rules did not stop repeats under pressure.**
- **The hooks came late and covered mistakes already past.**
  - The structural changes held: a blob moved into config (row 10), the database event trigger (row 21), and the CLI deploy from disk (row 54).
  - The hooks on top of a live write path held in 3 of 4 tested cases.
  - What that path itself caused, a hook could not undo: about 7 minutes in row 2, 196 seconds in row 41, and the stub in row 40.

## 4. The one structural change, and whether we have it

**The change: the assistant has no way to write to the live server.** Every server change is a file in git, applied from git by one scripted path (CI, or the owner's one command) that reads the result back and makes one call shaped like the real client's.

What it would have prevented:

- All 16 rows of kind A: no hand-built payload, no placeholder, and `verify_jwt` would sit in a config file kept in git.
- All 11 rows of kind B: live equals git by construction, and the schema sits in migrations.
- 4 of the 6 rows of kind C (12, 13, 14, 21), together with a static test that every CREATE FUNCTION is revoked from public, anon and authenticated.
- Row 52, and rows 44, 48, 57 and 58 (no write tools, so no guards that need maintaining).

That is **36 of the 60 rows, and every outage the assistant itself caused** (rows 2, 40 and 41). It would not have prevented:

- The design holes (the rest of kind D: rows 20, 28, 30, 31, 51, 53, 56 and others). They need "never trust the client", attack runs as anon, signed webhooks and an end-to-end call after each change.
- The backup and personal-data rows (4, 34, 38).

The two longest outages, rows 20 and 28 (about 7 and about 10 days), were correct deploys of a wrong design, and the client hid the error. A write ban does not catch that; a live check that results actually arrive does.

**Object has this structure for the claude.ai connector, but not for the shell.**

- **COVERED (connector):**
  - `.claude/settings.json:40-49` denies `apply_migration`, `deploy_edge_function`, pause, restore, create project, the branch writes and `confirm_cost`. Denied tools are removed from the tool list: the deferred list here has no `apply_migration` or `deploy_edge_function`.
  - `tools/claude-guard.mjs:381-391, :407` lets `execute_sql` run only a single read-only SELECT, WITH, EXPLAIN or SHOW, and refuses calls to `submit_*` and to built-ins that write.
  - `CLAUDE.md:40`: "The live database is read only; changes go through supabase/migrations on his word."
  - The migrations live in git and the owner applies them (`docs/state.md:11-14`); the read-back on 12.10 found no drift (`revision-shelf2-server.md:118-135`).
  - There are no Edge Functions, so kind A cannot occur through the connector.
- **EXPOSED (shell), measured today:**
  - The Supabase CLI 2.114.0 is installed at `C:\Users\admin\bin\supabase` and is **signed in**. `supabase projects list` (read only, 12.10) returned project `objekt` (`rkvdwzlymmewsxjysgma`), in the same organisation (`vawodgczxtkwstqcltib`) as Cosmogram had.
  - The CLI's own help says `supabase db query [--linked | --project-ref] ` "Queries the linked project's database via Management API". That is any SQL with the stored token, no database password needed.
  - The same token covers `functions deploy`, `secrets`, `projects delete` and `backups` (all listed in `supabase --help`).
  - `tools/claude-guard.mjs` has no rule for the `supabase` program (grep finds no "supabase" in the file), and no deny rule for it exists in the project or the user settings.
  - So "the live database is read only" holds today only as long as the assistant chooses not to type such a command. This is the same hole Cosmogram had: its CLI deploys of 29.09 went around every MCP hook.
- **The way to close it is the owner's choice:**
  - (a) Deny rules for `Bash(supabase *)` and `PowerShell(supabase *)` (and `npx supabase`) in `.claude/settings.json`. That is a settings change, on his word.
  - (b) A `claude-guard` rule for the `supabase` program that allows only read subcommands.
  - (c) He runs `supabase logout` on the laptop. The F2 and F8 jobs planned in the revision would run the CLI on GitHub, not on the laptop.
- **Also EXPOSED, smaller:**
  - A session opened in another folder has the connector without our deny rules (`docs/state.md:61`, text only).
  - The owner pastes migrations into the SQL editor by hand, and they are read back by hand (`revision-shelf2-server.md:89`). There is no automatic drift check (`:93`) and no test that every function and table in `supabase/migrations` is revoked (no `revoke` check in `tests/`).

## 5. PRODUCTION-MINES: payments, billing and personal data, and whether each applies to us

Our plan: floor 1 free; paid packs through the Meta Store's own purchases, and on our site through a merchant of record such as Paddle; results anonymous; no accounts.

| PRODUCTION-MINES item (line) | What it says | Applies to us? |
|---|---|---|
| #3 Stars: duplicates and refunds (:129-138) | Store the payment id with a unique key, so that a duplicate payment message does not grant the item twice; keep it for refunds. | **Applies once sales start.** Keep each store or Paddle transaction id unique; a repeated webhook must not grant twice; a refund or chargeback must take the pack back. Add the lesson of row 51: **verify the webhook's signature**. Not built yet; the owner's request is on `docs/board.md:100, :103` and the research is running. |
| #10 Stars only, the platform's payment rule (:197-207) | Telegram allows only its own Stars for digital goods inside a Mini App; another payment path risks removal. | **Applies in kind.** The Meta Store's rules for digital content in a store build, and whether a purchase on our site may unlock content in the Quest build: UNVERIFIED. Not read here; Meta's docs (the hz-store-submit skill) decide it. |
| #11 The cloud bill under abuse (:209-220) | Every function call is billed, failed ones too; the free plan is no base for production; Pro has a spend cap. | **Applies.** We are on Pro (`docs/state.md:15`). The submit RPCs are capped (`0009:195`); `compare_room` is not (`revision-shelf2-server.md:156`). Spend cap: UNVERIFIED (dashboard only). |
| #12 Bus factor (:222-236) | If one person holds the passwords and keys, the project stops when he is away; keep a copy of keys and access elsewhere. | **Applies, EXPOSED when written; update 12.10: second sign-in step through GitHub (his word) and the database password reset and held by him (docs/board.md); whether anyone else holds access (a second organization owner) is not checked.** Was, by the board on the morning of 12.10: no second sign-in step on the Supabase account; the database password held by nobody. Later the Paddle and Meta accounts too. |
| #13 Right to erasure (:238-252) | There was no way to delete a player's data; GDPR asks for it within a month. | **Not today.** There are no accounts and a result row cannot be tied to a person. The hashed IP is kept 10 minutes (`0009:136-137, :159`), and the privacy page states the 7-day backups (`revision-shelf2-server.md:86`). **Applies later** to the separate science consent (owner-decisions "on a separate consent") and to purchase records. Purchases are kept apart from results (`docs/board.md:100`). Row 38's lesson: erasure must reach the backups too, or they must expire. |
| #8 GDPR-K / COPPA (:178-186) | Collecting data from children needs a parent's consent; content rules are not data rules. | **Recording: COVERED.** The age is asked and under 18 the game starts without recording (`src/app/consent.js:5-11, :48-50`). Purchases by minors: the store's and Paddle's terms, UNVERIFIED. |
| #6 Backups and PITR (:161-168) | PITR is the setting that matters most; without it, what was written after the last backup is lost. | **Partly.** Pro has 7 days of daily backups; PITR is not needed under 4 GB (`revision-shelf2-server.md:86, :88`). EXPOSED: no copy outside Supabase, and deleting the project deletes its backups (`:87, :159`). When the own dump is built: rotation, no `app.limit_key`, and personal data that does not outlive the deletion path (row 38). |
| Supabase letter: new tables lose automatic grants from 30.10 (:63-93) | From 30 October, new tables in `public` need explicit grants. | **COVERED.** Our tables are in `app`, which the API does not serve, and every object is revoked in its own migration (`revision-shelf2-server.md:26-34`). |
| Registry S8: skins without a server check of ownership (accepted 12.08) | The client said what it owned. | **Applies later:** a paid pack must be unlocked by the store's own entitlement check or by our server, never by what the device's storage says (the lesson of rows 31 and 53). |
| Registry S12: telemetry opt-out | On by default, consent missing. | **COVERED** (row 5). |

## 6. Outside our project, for the owner to know

- **21 releases** in the archived private repository `exxxit-game/cosmogram-crew` are full Cosmogram database dumps, taken 17.09 to 07.10.
  - According to PRODUCTION-MINES:243-247, the tables hold player names and usernames, identities, scores and telemetry.
  - [Russian, at the cited source] never reached these copies.
- Cosmogram's project (`cwpijvgdrrvnvldhnmbj`) is not among the projects the laptop's CLI sees today.
- Whether to keep or delete the releases is his call.
