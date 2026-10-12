# Shelf 2, part B: what leaves the headset and what the player is told (12.10)

> Kept as the helper wrote it on 12.10.2026 for the revision (docs/audit/revision.md): shelf 2, part B: what leaves the headset and what the player is told, against the data-protection and research-ethics texts, the practitioners and his decisions. Russian passages are left out of this English copy; their sources are linked. The pages it read are saved in objekt-files/notes/revision-shelf2-2026-10-12/. Nothing here is acted on until it is checked against our code and shown to the owner.


Read only. Nothing in the repo changed; the live database was not written (two reads through the Supabase
connector: get_project, get_organization). Branch read: the worktree `continuation-e2af23` (paths relative to it).

Read in full: src/engine/results.js, src/app/consent.js, issue-report.js, left-early.js, playtest-report.js,
session.js, lab.js, stage.js, lobby/opening.js, lobby/exit.js, lobby.js (the consent part), rooms/01-control/room.js,
reveal.js, report.js, questions.js, engine/log.js, index.html, privacy.html, the three texts.ru.js, migrations 0007,
0009, 0010; docs/research/revision-2-data.md, ethics-law.md, ethics-law-3.md, forums-data.md, forums-data-2.md.

Official texts opened today, saved as text in `scratchpad/shelf2/law/`:
- `gdpr-extract.txt`: GDPR Recital 26, Art 4(1), 5, 6(1), 7, 8, 11, 12(1-2), 13, 17, 25, 89(1);
  https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 (browser pane; curl meets a WAF check).
- `eprivacy-art5.txt`: Directive 2002/58/EC Art 5, consolidated 19.12.2009;
  https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:02002L0058-20091219
- `edpb-2020-consent.pdf` / `.txt`: EDPB Guidelines 05/2020 on consent, v1.1;
  https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf
- `apa-2017-8.02-8.08.txt`: APA Ethics Code, library copy; checked current today at https://www.apa.org/ethics/code
  ("amendments effective June 1, 2010 and January 1, 2017"; no newer code listed).
- `bps-2021-code-extract.txt`, `bps-2021-imr-extract.txt`: BPS Code of Human Research Ethics 2021 and BPS
  Internet-mediated Research guidelines 2021, library copies (objekt-files/papers), cited by line.
- `github-pages-what-is.txt`: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

Live facts read today: Supabase project region `eu-west-1`, organisation plan `pro` (connector). The live site
youaretheobject.com still serves the old build (title "Objekt", A-Frame 1.7.1; `git grep origin/main` finds no
Supabase call), so `/privacy` answers 404 there and nothing below is live yet. The preview serves `/privacy`
without `.html` (200), so the consent's link will work once privacy.html is on main.

Status key: MATCH; DIFFER (with "needed" and a quoted reason, or "not needed: no reason found");
UNVERIFIED (the text that settles it was not read, or only a lawyer can say). "Our reading" marks an inference.

## 0. Every value that leaves the headset

| # | Value | Built at | Leaves when | Goes to | Can it single a person out? |
|---|---|---|---|---|---|
| V1 | `p_room`, `p_version`, `p_consent`, `speed` (always 1) | room.js:39-40, consent.js:21, room.js:192 → results.js:11 | at the start of the reveal, recording only (session.js:63-66) | Supabase `submit_run` → app.runs | no |
| V2 | `p_first` | results.js:53-57 (a device mark) | same | same | no |
| V3 | `condition` | room.js:162 | same | same | no |
| V4 | answers on scales: control, total, ifPress, ifNoPress, certainty | questions.js:41 | same | same | no |
| V5 | answers by choice: evidence, hypotheses, knew | questions.js:48 (position `pos` dropped, report.js:20) | same | same | no |
| V6 | answers: gender, age band | questions.js:48; texts 66-73 (both allow [Russian, at the cited line]) | same | same | not alone; with the date, in a small known group (playtest testers), yes (A2) |
| V7 | 17 counts and percentages (trials … errIfNoPress) | report.js:25-50 | same | same | no; nothing links them to a person |
| V8 | `seated` (head below 1.35 m at recentre) | recenter.js:15, room.js:266 | same | same | not alone; an indirect identifier with V6 |
| V9 | `created_on` (date only), random uuid | server, 0009:26-32 | at insert | app.runs | the date is the link key with V6 and with the logs |
| V10 | issue: kind, message (200 chars), file (last path part, no query), line, state, xr | issue-report.js:10-19 | as errors happen, recording only, at most 5 a page load (session.js:26, 34-37) | `submit_issue` → app.issues | no |
| V11 | issue: device (enum), browser token with full version (not the whole user agent) | issue-report.js:9, 14-15; playtest-report.js:9-17 | same | same | not alone; device + browser version + date can point to one tester |
| V12 | playtest: finished, secs per phase, away, presses, voided, seated, device, 5 answers | playtest-report.js:23-42, room.js:211-214 | after the reveal and the 5 questions, `?playtest=1` and recording (session.js:68-71) | `submit_playtest` → app.playtests | device: indirect |
| V13 | `compare_room` call `{p_room, p_version}` | results.js:26-34, room.js:195 | at every real-speed reveal, **with or without recording**, the preview too | Supabase (stores nothing: 0010:33-73) | no; the call itself sits in the provider's logs |
| V14 | request envelope: IP, User-Agent, Accept-Language, Origin (Referer: origin only, the browser default; index.html sets no policy) | the browser | every request | Supabase/Cloudflare edge logs, 7 days, with "city" and path (revision-2-data.md:87-90); GitHub Pages for game files; **cdn.aframe.io for the controller models** (A5) | the IP is personal data for whoever can identify (Breyer, revision-2-data.md:80-82) |
| V15 | keyed hash of the IP | server, 0009:154-165 (from CF-Connecting-IP) | each submit | app.recent, 10 minutes; daily backups up to 7 days | pseudonymous (EDPB 01/2025, forums-data.md:79-89) |

Never leaves (checked): event times (log.js:16; not in report.js), answer positions, the hand-drawn name and
signature (consent.js:28), head and hand tracks (only `away` seconds and `seated` are derived), voice and cameras
(no getUserMedia or MediaRecorder in src). No cookies, sessionStorage, IndexedDB, sendBeacon or service worker in src.

Kept on the headset (localStorage; cleared only by clearing site data in the browser; no in-game control):

| Key | Written at | When | Holds | Told |
|---|---|---|---|---|
| `object.signVisits` | opening.js:15, :24 | every visit, when the sign starts, before any consent | a count | privacy.html:19 |
| `object.played.<room>` | results.js:54-56 via session.js:43 | every run start, with or without recording (test runs too) | "1" | privacy.html:19 |
| `object.left.<room>` | left-early.js:7-9 via room.js:220 | set at run start; removed at the reveal (room.js:189) or when asked (left-early.js:26, :56) | "1" | privacy.html:19 |
| `object.form` | consent.js:23-28, :55 | after "18+: [Russian, at the cited line], before the recording choice | name strokes, signature strokes, local date | privacy.html:52; never read by any code (grep) |

## 1. Table

### A. Data-protection texts

| # | Source (exact words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| A1 | GDPR Recital 26: identifiability by "all the means reasonably likely to be used, such as singling out, either by the controller or by another person"; rules "not apply to anonymous information"; Breyer, SRB (revision-2-data.md:80-86) | rows: numbers, date, random uuid (0009:26-32, :66-112); the provider logs hold IP, city, path 7 days and row order shows sequence (0009:14-16) | DIFFER: pseudonymous for 7 days, anonymous after | needed as is: told on privacy.html:58; the owner's "only anonymous numbers go to the server" holds after the 7 days | none in code; the word [Russian, at the cited line] is revision-2-data.md decision A (C20) |
| A2 | Recital 26 "singling out"; UKDS: anonymisation "generally by treating indirect identifiers" (revision-2-data.md:126-130) | gender, age band, seated, knew, condition, date in every row (0009:74-108). Owner: "Playtest: 5–10 testers from his Telegram VR community": among them date + gender + age band can point to one person | DIFFER | for the owner: no source settles what to send (section 3, O3); "personal data or not" is a lawyer's call | section 3 |
| A3 | Art 5(1)(c) "limited to what is necessary"; Art 25(2) "by default personal data are not made accessible … to an indefinite number of natural persons" | `compare_room`, callable with the public key, returns n, control, zero, presses and an 11-bin histogram per condition once n ≥ 10 (0010:50-65). The game reads only n, control, zero (reveal.js:52-57); tools/health.mjs:311 reads only `r.ok`. A bin can hold one player. Calling before and after a known person's run gives his answer from the two means (our arithmetic: with n = 10, error about ±1 point) | DIFFER | presses and hist: not needed, no reason found. The mean: owner (O4) | drop `presses` and `hist` from compare_room (a migration on his word; server side, part A) |
| A4 | Art 13(1)(a) "the identity and the contact details of the controller"; 13(1)(c) "the legal basis"; 13(2)(b) the rights; 13(2)(d) "the right to lodge a complaint with a supervisory authority"; EDPB 05/2020 para 64 "(i) the controller's identity" | privacy.html:64-65 has only [Russian, at the cited line]: t.me/exxxit"; no basis, no rights list, no complaint route | DIFFER | needed; on the board already: item 4 [Russian, at the cited line] ([Russian, at the cited line] D)" | after decision D; whether the GDPR applies at all: lawyer (revision-2-data.md L2) |
| A5 | Art 13(1)(e) "the recipients or categories of recipients of the personal data"; Art 25(1) data protection by design | in VR with controllers, every player's headset fetches the controller models from cdn.aframe.io before any consent: stage.js:30-31 `laser-controls` keeps A-Frame's default `model: true` (vendor/aframe-1.8.0.min.js: `laser-controls",{schema:{hand:{default:"right"},model:{default:!0}`; `window.AFRAME_CDN_ROOT\|\|"https://cdn.aframe.io/"`; `kE+"controllers/meta/"`); controller-batch.js:18 waits for that model. The request carries IP and user agent. privacy.html:55-58 names only GitHub, Supabase, Cloudflare | DIFFER | not needed: no reason found; the owner: data protection [Russian, at the cited line] (owner-decisions.md, Data) | host the Meta controller files with the game and set `window.AFRAME_CDN_ROOT` before A-Frame loads (index.html:10), after checking the models' licence; or at least one line on privacy.html naming cdn.aframe.io |
| A6 | Art 7(3) "the right to withdraw his or her consent at any time … as easy to withdraw as to give consent"; Art 17(3)(d) erasure yields for statistics "in so far as the right … is likely to render impossible or seriously impair" them; Art 11(2) | a sent run cannot be found or removed (privacy.html:50); it is sent at the first moment of the reveal (room.js:192) with no way back | DIFFER in part | needed: the board, item 4: [Russian, at the cited line] / [Russian, at the cited line] " | the board item (B1); whether Art 11 and 17(3)(d) cover the 7 days: lawyer |
| A7 | ePrivacy Art 5(3): storing on the terminal "only allowed on condition that the subscriber or user concerned has given his or her consent, having been provided with clear and comprehensive information … about the purposes", except "as strictly necessary in order for the provider of an information society service explicitly requested by the subscriber or user to provide the service" | four keys (section 0): signVisits before any consent; played and left with or without recording; the form after "18+". Purposes told for three (privacy.html:19); for the form only where it stays, not why (:52) | UNVERIFIED | lawyer: which keys are "strictly necessary", and whether the EU rule reaches us | if needed: the form's purpose on privacy.html:52 (corridor item 6: the signed form hangs on the board) |
| A8 | Art 8(1): a child's consent from 16 (states may lower it to 13); EDPB 05/2020 para 135: "In some low-risk situations, it may be appropriate to … fill out a form stating they are (not) a minor" | recording only after [Russian, at the cited line] (consent.js:48; texts.ru.js:31); [Russian, at the cited line]: no recording, no form kept (consent.js:49-51), queued errors dropped (session.js:44) | MATCH (stricter) | | |
| A9 | Art 7(1) "able to demonstrate that the data subject has consented" (revision-2-data.md D1) | CONSENT_VERSION sent with every row (consent.js:21; session.js:36, :65, :70); the server takes only known versions (0010:17-30); tests/results.test.mjs:52-55 pins the words | MATCH | | |
| A10 | EDPB 05/2020 para 42: "data subjects should be free to choose which purpose they accept, rather than having to consent to a bundle of processing purposes" | one button [Russian, at the cited line] (texts.ru.js:28) covers the results and the error reports (session.js:34-37, :63-66) | UNVERIFIED | lawyer: whether error reports need their own choice or another basis; today's path (no error without consent) is the stricter | none now |
| A11 | Art 5(1)(e) "for no longer than is necessary"; Art 13(2)(a) the storage period | rows without limit (privacy.html:50), the hash 10 minutes (0009:136-137, :159), logs 7 days (privacy.html:58) | MATCH (all three told) | | |

### B. Research-ethics texts

| # | Source (exact words) | What we do (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| B1 | APA 8.07(c): "explain any deception … preferably at the conclusion of their participation … and permit participants to withdraw their data"; BPS IMR 2021 (line 192): withholding "may arguably be seen as involving some level of deception"; (line 210) "A button at the very end of a study confirming consent to use the data" | room.js:186-193: state done, analyse, `session.finish` sends; then [Russian, at the cited line] (:193), the comparison (:195), then the pages with [Russian, at the cited line] (reveal.js:34). The result leaves before the player learns what was withheld; no button after | DIFFER | needed: owner "debrief" and "quit any time"; board item 4 [Russian, at the cited line] / [Russian, at the cited line] "; revision-2-data.md:104-108 (D2, verdict CHANGE, "nothing" for the owner) | move `session.finish` after the last reveal page and ask [Russian, at the cited line] / [Russian, at the cited line] there (one screen) |
| B2 | BPS Code 2021 (line 93): "Where there are necessary time limits on data withdrawal … these limits should always be made clear to participants as part of the consenting process"; (line 200) "destroyed on request (up to a specified date)"; BPS IMR (line 204): "details about any necessary time limits on data withdrawal" | the consent's data page (texts.ru.js:24-25) says what goes and links to privacy; that a sent result cannot be removed is only on privacy.html:50 | DIFFER | needed: same reasons as B1 | with B1, one clause on that page (for example [Russian, at the cited line]); raises CONSENT_VERSION to 2 and needs its row in app.consent_versions (tests/results.test.mjs:53-55; a live migration on his word) |
| B3 | APA 8.02(a)(2) "their right to decline to participate and to withdraw from the research once participation has begun"; (3) "the foreseeable consequences" | form: [Russian, at the cited line] (texts.ru.js:13); the corridor poster (exit.js:27-31; lobby texts.ru.js:26-31); nothing is sent before the reveal (room.js:192; exit.js:9-10) | MATCH up to the reveal; after it see B1 | | |
| B4 | APA 8.02(a)(8) "whom to contact for questions about the research and research participants' rights"; BPS Code (line 203) "The name and contact details of the Principal Investigator" | no contact on the consent pages (texts.ru.js:10-33); privacy.html:65 Telegram only | DIFFER | needed: board item 4 (decision D) | with decision D |
| B5 | BPS Code (line 194): when information is withheld "it should be made clear that this is the case … and the means by which the withheld information will be given" | [Russian, at the cited line] (texts.ru.js:13); the reveal pages (reveal.js:27-58) | MATCH | | |
| B6 | APA 8.08(a) "a prompt opportunity … to obtain appropriate information"; BPS IMR (line 194) "a 'Quit study' button which can lead to a debrief page" | leaving VR mid-room opens [Russian, at the cited line] (left-early.js:34-63, room.js:262-265); a closed page is asked about on the next visit (lobby.js:190-192, left-early.js:23-30); the corridor's exit needs no debrief, nothing has happened yet (exit.js:40-49) | MATCH | | |
| B7 | BPS 2021 section 12 and BPS 2023 (forums-data.md:156-162, forums-data-2.md:154-160): research needs a committee's opinion and a sponsor; owner: science only after approval | the form says [Russian, at the cited line] (texts.ru.js:12), while privacy.html:42 says [Russian, at the cited line] | DIFFER (wording) | owner: the form is the experiment's frame (docs/decisions.md:117-119) | section 3, O5 |

### C. What the player reads, sentence by sentence

| # | Sentence (path:line) | Code (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| C1 | privacy.html:14 [Russian, at the cited line] | `compare_room` is called at every real-speed reveal without looking at the choice or the preview flag (room.js:195 checks only SPEED; session.js:14 not used there); the controller models (A5) | DIFFER | not needed: no reason found | keep the call (the welcome promises the comparison to everyone, lobby texts.ru.js:15) and say it: [Russian, at the cited line] |
| C2 | privacy.html:18 [Russian, at the cited line] | same | DIFFER | same | same sentence here |
| C3 | privacy.html:19 the three marks, their purposes, [Russian, at the cited line], cleared with site data | results.js:53-57, left-early.js:7-19, opening.js:15-25; the played mark leaves only as `p_first` with recording (session.js:65) | MATCH | | Quest Browser clearing: UNVERIFIED |
| C4 | privacy.html:23 [Russian, at the cited line] | sent at the start of the reveal (room.js:192) | DIFFER (timing) | covered by B1 | after B1 it is true |
| C5 | privacy.html:25-28 the field list | results.js:11; report.js:25-50; room.js:192 (condition, seated, speed) | MATCH (`speed`, always 1, unnamed: harmless) | | |
| C6 | privacy.html:30 [Russian, at the cited line] | times stay in log.js:16; schema `additionalProperties: false` (0009:71, :96); no mic or camera API in src | MATCH | | |
| C7 | privacy.html:33 errors: text, file and line, stage, headset, browser version, [Russian, at the cited line], none without recording | issue-report.js:10-19; session.js:26, :34-37, :44 (5 a page load, which is never more than 5 a run) | MATCH (kind and xr unnamed: harmless) | | |
| C8 | privacy.html:36 playtest | playtest-report.js:23-42; sent after the reveal (room.js:204, :211); session.js:69 | MATCH | | |
| C9 | privacy.html:40-42 purposes, no science yet | room.js:195; session.js:48-58; no science path | MATCH | | |
| C10 | privacy.html:44 [Russian, at the cited line] | no counters in src | MATCH (the third-party request in A5 is not a counter, but is not named) | | |
| C11 | privacy.html:48 "eu-west-1, [Russian, at the cited line] / [Russian, at the cited line] | region read today: "eu-west-1"; no grant on any table (0009:63-64, :118-119, :130-131); but `compare_room` hands averages and a histogram to anyone (0010:53-65) | MATCH / DIFFER in part | the second: not needed (A3) | [Russian, at the cited line] 10" and drop hist (A3) |
| C12 | privacy.html:49 [Russian, at the cited line] | 0009:26-31 | MATCH (order is told on :58) | | |
| C13 | privacy.html:50 [Russian, at the cited line] against :58 [Russian, at the cited line] IP-[Russian, at the cited line] | the page contradicts itself for 7 days | DIFFER | owner (O2); Art 11(2) and 17(3)(d): lawyer | section 3 |
| C14 | privacy.html:51 the IP fingerprint, 10 minutes, backups 7 days | 0009:154-165, cron :136-137; backups: "Pro Plan projects can access the last 7 days of daily backups" (shelf2/docs/guides_platform_backups.md:7); plan read today: "pro" | MATCH | | |
| C15 | privacy.html:52 the form stays in the browser only, only from 18, never sent | consent.js:26-29, :48-55; in no payload; never read (grep) | MATCH (purpose unsaid: A7) | | |
| C16 | privacy.html:57 GitHub [Russian, at the cited line] IP-[Russian, at the cited line] | GitHub Docs: "the visitor's IP address is logged and stored for security purposes" (law/github-pages-what-is.txt) | MATCH | | |
| C17 | privacy.html:58 Supabase and Cloudflare logs, 7 days, a result linkable meanwhile | revision-2-data.md:87-90 (IP, "city", path; "Pro plan users 7 days") | MATCH; the logs' city and request path unnamed | not needed: no reason found | "IP-[Russian, at the cited line] |
| C18 | privacy.html:12 [Russian, at the cited line] | the page changed on 11.10 (commit 9e8e735, the 18+ clause at :52) | DIFFER | not needed | "11 [Russian, at the cited line] |
| C19 | privacy.html:62 recording from 18 | consent.js:48 | MATCH | | |
| C20 | texts.ru.js:24 [Russian, at the cited line] | as A1; error reports also go with recording (session.js:34-37), not named here | DIFFER (minor) | needed as layered notice: EDPB 05/2020 para 69 "Layered and granular information can be an appropriate way", the link is on :25; [Russian, at the cited line] is decision A (revision-2-data.md:220-222, not recorded as decided) | none now |
| C21 | texts.ru.js:24 [Russian, at the cited line] | an adult's hand-drawn name and signature are already kept when this page shows (consent.js:55, then :56), whatever he picks; the three marks are kept too (results.js:56, left-early.js:9, opening.js:24) | DIFFER | not needed: no reason found | [Russian, at the cited line] (with B2 in one change: CONSENT_VERSION 2 and its migration row) |
| C22 | texts.ru.js:32 to a minor: [Russian, at the cited line] | the form is not kept (consent.js:49-51); the marks are (session.js:43 → results.js:56; room.js:220; opening.js:24) | DIFFER (minor) | not needed | [Russian, at the cited line] |
| C23 | texts.ru.js:37 playtest: [Russian, at the cited line] | playtest-report.js:23-42 (also `away`, told on privacy.html:36) | MATCH | | |
| C24 | lobby texts.ru.js:13-15 the welcome: [Russian, at the cited line] | room.js:195 for every player | MATCH; it says nothing about data | | |
| C25 | room texts.ru.js:67, :71 why gender and age are asked; [Russian, at the cited line] | gender used in the reveal (reveal.js:41-44); age only stored | MATCH | | |

### D. Practitioners (forums-data.md, forums-data-2.md, parts 3-6)

| # | Advice (source line) | Ours (path:line) | Status | Needed? | Smallest fix |
|---|---|---|---|---|---|
| D1 | EDPB 01/2025: an HMAC of an IP is still personal; call it a security measure, not "anonymous" (forums-data.md:79-89) | privacy.html:51 [Russian, at the cited line] | FOLLOWED | | |
| D2 | Plausible: "The salt is rotated and deleted every 24 hours" (forums-data.md:90-95) | one fixed key (0009:116-117); backups keep key and hashes 7 days | NOT FOLLOWED | not needed: no reason found | a daily job that replaces the key (server, part A) |
| D3 | HN, janosd: "Legitimate interest still requires the data subject to be informed under Art 13" (forums-data.md:100-105) | the hash is told; its basis is not | IN PART | with decision D (A4) | |
| D4 | BPS IMR: "a memorable code or ID number" for later withdrawal (forums-data.md:20-28) against Loughborough: "We do not recommend the use of unique or self-created codes" (forums-data.md:120-125); GDPR Art 11 (forums-data-2.md:144-151) | no code | follows Loughborough, not BPS | owner (O1) | |
| D5 | BPS IMR: a confirm button at the very end (forums-data.md:26) | none | NOT FOLLOWED | needed: board item 4 | B1 |
| D6 | Pavlovia's old default: closing the tab = withdrawal (forums-data.md:108-114) | only a finished run is sent (room.js:192); leaving earlier sends nothing (exit.js:9-10, left-early.js) | FOLLOWED | | |
| D7 | Trinity College Dublin: "configure the survey tool to not collect IP addresses and location data" (forums-data.md:126-132) | Supabase's edge logs keep IP and city 7 days; "no switch to stop collection" (revision-2-data.md:87-90) | NOT FOLLOWED (not possible on Supabase) | not needed: told on privacy.html:58 | |
| D8 | wakecarter: no IPs saved (forums-data.md:115-118) | no IP in any row | FOLLOWED (the logs aside) | | |
| D9 | web.dev: best-effort storage can be evicted; `navigator.storage.persist()` (forums-data.md:135-142) | no persist() in src | NOT FOLLOWED | not needed now: every read survives a missing key (try/catch), and the room's [Russian, at the cited line] (room texts.ru.js:75-78) backs the first/repeat mark | ask persist() when the profile across rooms is built (owner: "the player's own profile across rooms stays on his headset") |
| D10 | itch.io: the game must survive a lost profile (forums-data.md:143-148) | try/catch on every read and write | FOLLOWED | | |
| D11 | ePrivacy 5(3) covers localStorage (forums-data.md:149-153) | A7 | UNVERIFIED | lawyer | |
| D12 | AEPD 2026 p.38 "the design must favour the less intrusive option"; p.14 play patterns can "single out" (forums-data-2.md:65-78) | only derived numbers leave; no traces | FOLLOWED | | |
| D13 | Reinecke 2015, Germine 2012: ask about repeats and technical trouble (forums-data-2.md:103-117) | "knew" in every run; trouble only in playtest (texts.ru.js:42) | IN PART | not needed: the owner's "5 approved questions" | |
| D14 | BPS 2023: an independent team needs an opinion and a sponsor (forums-data-2.md:154-160) | nothing used for science; privacy.html:42 | FOLLOWED | | |

### E. The owner's decisions

| # | His words (owner-decisions.md) | Code | Status |
|---|---|---|---|
| E1 | "the player's profile stays on his headset, only anonymous numbers go to the server" | four device keys (section 0); numbers only (0009 schema) | MATCH, with A1 (7 days) and A2 (small groups) |
| E2 | "later, on a separate consent … science only after ethics approval and preregistration" | nothing goes for science; privacy.html:42 | MATCH |
| E3 | "Bots: a hashed IP kept 10 minutes" | 0009:114-167 | MATCH |
| E4 | "consent, 18+ for recording" | consent.js:36-58 | MATCH |
| E5 | "start without recording" | no result, playtest or error report is sent (session.js:34, :44, :64, :69) | MATCH for our rows; the comparison call (C1) and the controller models (A5) still leave |
| E6 | "quit any time" | nothing is sent before the reveal | MATCH up to room.js:192; after it B1 |
| E7 | "debrief" | reveal pages; the short debrief for leavers | MATCH; but the send comes before it (B1) |
| E8 | "anonymous data" | A1, A2 | DIFFER in part |
| E9 | "never sell data" | privacy.html:44 | MATCH |

## 2. Differences with no reason found (fixes, mine)

1. C1, C2: privacy.html:14 and :18 say nothing is sent without recording; the comparison call is sent. One sentence (C1).
2. A5: controller models from cdn.aframe.io for every player in VR with controllers, before consent, unnamed. Host them with the game
   (`window.AFRAME_CDN_ROOT`, licence first) or name the CDN on privacy.html.
3. A3, C11: `compare_room` returns `presses` and a histogram nobody reads; drop them (a migration on his word, part A);
   reword privacy.html:48.
4. C21, C22: [Russian, at the cited line] / [Russian, at the cited line] are false on the device. "…[Russian, at the cited line]. Do it together with B2 (one CONSENT_VERSION step, one migration row).
5. C17: name the logs' city and path. C18: the page's date.
6. D2: rotate the hash key daily (part A).

## 3. For the owner (real options)

- O1. Withdrawal after the keep/discard screen (B1 is already his board item 4): (a) no code: once kept, a result
  cannot be removed (Loughborough, Trinity College Dublin; GDPR Art 11); (b) a short code shown at the end and kept on
  the headset, to remove one's result until a stated date (BPS IMR; the code makes the row pseudonymous).
- O2. privacy.html:50 vs :58 (C13): (a) offer removal within 7 days by date and time through Telegram, then say it is
  impossible; (b) say plainly that we never match logs to rows, so removal is not offered. Lawyer: Art 11(2), 17(3)(d).
- O3. Small groups (A2): (a) keep, and say on privacy.html that in a small group the date, gender and age band can
  point to a person; (b) leave gender and age out of playtest runs; (c) store the week, not the date.
- O4. The live mean (A3): (a) as now, live from 10 players; (b) from a daily snapshot, so one run cannot be read off;
  (c) a higher threshold before the mean shows.
- O5. The form's word [Russian, at the cited line] (B7): (a) keep (the frame; privacy.html explains); (b) [Russian, at the cited line], as the welcome
  says ([Russian, at the cited line], lobby texts.ru.js:14).

## 4. Unverified, or only a lawyer can settle

- Whether the GDPR reaches the game, and so Art 13's full list (basis, rights, complaint): revision-2-data.md L2;
  board item 4, decision D.
- ePrivacy Art 5(3) and the four device keys (A7); bundling results and error reports in one consent (A10);
  Art 11 and 17(3)(d) for the 7-day window (A6, C13).
- Russia 152-FZ: the 10-minute IP hash and the provider logs hold data of players in Russia outside Russia;
  revision-2-data.md L3 says "store NO personal data of players". A lawyer, before Russian-speaking testers.
- Meta Developer Data Use Policy 6.3 (a deletion path) and 11A ("data calculated about a user's hands and body":
  `seated`, `away`): does it cover a website in the Quest Browser? Open (ethics-law.md:74-78).
- Quest Browser: can a player clear one site's data, and does it evict localStorage? Meta's docs not read.
- cdn.aframe.io: who runs it and what it logs; whether a Draco decoder is also fetched from www.gstatic.com
  (the URL is in the vendored file). A network log from the headset (tools/quest-look.mjs) would settle both.

## 5. Noticed in passing (outside this shelf)

- In playtest mode the run also goes to app.runs as an ordinary first run (room.js:192 does not look at PLAYTEST):
  testers enter "you and other players". Board item 4 says [Russian, at the cited line].
- Test runs (`?speed`) still write the played mark (session.js:43) on the test device.
- When the site is published by GitHub Actions with "only the game's files public" (owner, tool revision),
  privacy.html and css/privacy.css must be in that set.
- The preview's privacy page is one change behind (the 18+ clause at :52 is missing there).
