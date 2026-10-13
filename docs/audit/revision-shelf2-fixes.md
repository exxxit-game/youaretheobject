# Shelf 2: the fixes and the open checks (12.10)

The owner's word on these (12.10): fix all that is needed (his words in docs/owner-decisions-history.md). Done one at a time,
those that do not touch the live database first; the player's wording goes to him as options. The live
database changes only by a migration he runs, except the one real call below. Sources for each item: the three
checks of shelf 2 (revision-shelf2-server.md, -client-law.md, -schema-tests.md) and the page's fact-checks.

## What the player is told
- privacy.html says the game sends nothing without recording, but the end of a room always asks the server for
  the average, recording or not (only the room and version in the request; Supabase keeps the IP in its logs
  7 days). Say so.
- In the headset with controllers, A-Frame loads their models from cdn.aframe.io before consent; privacy.html
  does not name that address. Ship the models with the game (licence first) or name the address.
- Consent (src/app/texts.ru.js:24): without recording nothing is kept [Russian, at the cited line], yet the headset keeps marks and, for an adult, the drawn name
  and signature. In meaning: "…nothing goes into the statistics".
- privacy.html says in one place a result cannot be found, in another that while Supabase keeps its logs
  (7 days) it could in principle be linked to the IP address (privacy.html:58 [Russian, at the cited line]). Say one thing: a kept result cannot be taken back; we
  do not match the logs with results.
- privacy.html's date (10 October; changed on the 11th); what the logs hold besides the IP (city, request path).
- Science (his decision 6, 12.10): privacy.html:42 still says science only after an ethics committee and
  that no such study exists yet [Russian, at the cited line]. Rewrite to science now in our lab after the preregistration; the separate
  consent mark for science goes into consent version 2 (a migration).

- What Meta's headset browser collects, from its own Browser Privacy Notice (data-encryption-2.md, Part 9): the domain
  of each site and time on it, technical data, crash reports; page content not named. Say it on privacy.html.

## Tests and code
- The tests miss 9 of 16 mutations made one at a time in a copy of the code: teach them to read the fields
  and limits from the schema and the migrations.
- A run with more than 1000 presses outside the window or more than 1000 repeats is rejected whole by the
  server and lost silently: clamp at 1000, as the playtest report does.
- A tester's run goes as an ordinary one today (into the statistics, the first one into "you and others").
  His decision 2 (B): only into the testers' table.
- Room 101's description confuses whether the chosen answer's position goes to the server (it does not).
- The test copy (object-preview) sends no results (src/app/session.js:14, SENDING_ENABLED) but still asks the live
  compare_room: src/rooms/01-control/room.js:195 checks SPEED, not PREVIEW (found by the map's fact-check, 13.10).

## With the next migration
- Schema 2: whole numbers, exactly 40 trials, scales in steps of 5, required fields; a data dictionary.
- WRITTEN 13.10 in supabase/migrations/0011_doors.sql, not run yet: an explicit deny on the 7 tables (Supabase's
  advice); drop the histogram and the presses mean from compare_room (the game reads neither).
- WRITTEN 13.10 in 0011_doors.sql, not run yet: the IP-hash key changed daily, as Plausible does, so hashes of
  different days cannot be linked.
- The testers' table takes the whole run without gender and age (today 12 fields: 5 answers, 7 measures;
  0009:210-211, the same list as 0004).
- The consent's science mark (above).

## Server and migrations
- compare_room has no rate cap (revision-shelf2-server.md R2; Cosmogram, exposed, low). WRITTEN 13.10 in
  0011_doors.sql, not run yet: the result's cap (30 per 5 minutes an address, 300 a minute), before any read.
- Auth sign-ups are open (read 13.10: the project's public Auth settings say "disable_signup":false, email
  sign-in on, "mailer_autoconfirm":false; auth.users holds 0 rows). The game never calls Auth and a signed-up
  user holds no right on our data, but anyone with the public key can create accounts and make Supabase send
  mail. Closed by the owner's click: "Allow new users to sign up" off ("If this config is disabled, only
  existing users can sign in", supabase.com/docs/guides/auth/general-configuration).
- Rename the migration files, move the schema JSON, add the drift job (revision-shelf2-server.md section 6, F5, F7,
  F8); the deploy task of step 3 needs them; Supabase's guide also uses a separate staging project.
- Every migration one transaction (begin…commit): 0009 and 0010 are, 0001–0008 are not; a test that every new
  migration is.
- privacy.html:48 says results cannot be read through the internet, yet compare_room gives averages to anyone
  (revision-shelf2-client-law.md C11).
- The statistics handbook (Hundepool et al. 2025, 2nd ed., p. 122) into the library; today its text is only in a
  session scratch folder.

## Signals (Cosmogram's lessons)
- Know when results stop arriving: Cosmogram's longest outages, about 7 and 10 days, went unnoticed.
- A test per migration that every new function is closed to outsiders (its mistake of 05.09), and after each
  migration a read-back of the rights.

## Keys and access
- Replace both GitHub logins on the laptop (gh: gist, read:org, repo; git's own login: gist, repo, workflow; read 12.10) with one
  narrow key without Deployments, Workflows or Administration (the last covers repository settings, main's rule among them); workflow files then go in by the owner on
  GitHub's site, step by step.
- ElevenLabs: done 12.10. He set the key's cap to 20000 per refresh period himself; sound effects access is set
  by the steps, not confirmed by a probe.
- The real call to learn whether the player's real IP reaches the database (his yes of 12.10): one row through
  the player's path. It must stay out of the statistics and "you and others" (src/app/session.js: our own
  checks must not reach the statistics); design that first. What it decides: if the player's real address
  (CF-Connecting-IP) does not arrive, the limit of 30 per 5 minutes applies to the whole game at once.

## Question 3 in detail (batched updates of the shown average)
Anyone can ask the server for the average before and after a friend's run (the game key is public); the
server answers to 0.1 (0010:56), so at 10 players the friend's answer shows to about a point; the share of
«0» shows whether the friend answered «0». The game itself shows the average rounded to a whole number
(reveal.js:56). Option B, a batch of at least 10 new first runs with the control answer in the condition,
usually stops a simple subtraction. It fails where the answers fall into one pattern (all «0», or all but
one; all who did not answer «0» answered «100»): the friend's answer is then seen exactly only if all
answered the same, otherwise narrowed to two or three values, and the batch's sum is exact while the
condition has fewer than about 50 players (average to 0.1, answers in steps of 5 in the real game); if all
or none answered «0», whether the friend did is seen. Nine deliberate fake runs beat it, and the limit of
30 results in 5 minutes per address does not stop them (0009); the handbook raises the threshold where
people can pool their data. All this is my inference from the server's arithmetic and the handbook's
minimum rule (Hundepool 2025), not a published method for a live average.

## Not checked
- Russia's 152-FZ: a lawyer, before Russian-speaking testers (revision-shelf2-client-law.md section 4).
- Meta's rules 11A on data computed from body and hands (seated, away).
- ePrivacy and the four keys the game keeps on the device.
- Whether the Quest Browser keeps or clears a site's data.
- What cdn.aframe.io logs. CHECKED 13.10, the Draco decoder: www.gstatic.com is never asked. The game loads no glTF of its
  own (src, index.html); the 8 models A-Frame 1.8.0 fetches for Quest controllers and hands (meta/quest-touch-plus and
  -pro, oculus touch v3, oculus-hands v4) declare no glTF extension (read whole from cdn.aframe.io), and the vendored
  GLTFLoader builds its Draco extension, whose constructor preloads the decoder, only for KHR_draco_mesh_compression
  (vendor/aframe-1.8.0.min.js; gltf-model's setDecoderPath only stores the path).
- CHECKED 13.10 in the code, A-Frame's inspector: the scene adds it always (setupRendererAndLoadingScreen); it loads
  https://unpkg.com/aframe-inspector@1.8.x on keydown I with Ctrl+Alt or AltGraph, on ?inspector= with any value but
  false, or on a window message INJECT_AFRAME_INSPECTOR from any origin; the component has no remove handler, so
  removing the attribute leaves the listeners; its README sets the source with inspector="url: ...". A paired
  keyboard on the headset: not tried.
- The project's secret API keys: visible only in the Supabase panel (Settings, API Keys); the owner's screenshot.
- OVR Metrics Tool, installed by the owner on 13.10 (Meta: "highly recommended that you keep this HUD up and running
  throughout development", webxr-perf-tools): installed or not, the HUD over adb (ENABLE_OVERLAY broadcast, Meta's
  ts-ovrmetricstool page), and whether its CSV records the Browser (one forum report says HUD only) - measure.
- Whether GDPR applies to the game; one consent for the result and for error reports or two: a lawyer
  (decision D).
- CHECKED 13.10, the role the Supabase connector in the chat runs as: supabase_read_only_user, transaction
  read-only, no write grants, bypasses row level security (reads every row); docs/state.md.
- In the Supabase panel: SSL enforced, network restrictions, a second organisation owner, the spend cap.
- Meta's rules (6.3) ask for a clear way to request deletion: whether that concerns us in the Meta store,
  given his decision that a kept result cannot be taken back.

## Encryption (his request 12.10)
- What exists for reading results only ourselves, its costs and the options: docs/research/data-encryption.md (continued in data-encryption-2.md).
