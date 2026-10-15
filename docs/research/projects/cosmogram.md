# Cosmogram: what the owner's earlier game learned

Cosmogram (exxxit-game/cosmogram-app, archived) was the owner's browser game, built with an AI
assistant before this one. The owner: many mistakes there came from the assistant inventing things
and the two not moving together. Read only: the local checkout's skills and card index, and the
repository's history through the GitHub API (1538 commits, 384 touching the card index); the local
git link is broken, and the "Cosmogram Docs" folder holds only an empty notes vault.

## The card index, and how it rotted

- One flat folder of knowledge with an index (320 lines), one "home" per topic, pointer files
  instead of copies, research claims labelled "checked" or "the helper's word". Beside it: an
  error catalog, a known-bugs file (1125 lines), a session-state file that reached 196 KB, a folder
  of 239 tuning cards, and 467 memory files.
- The assistant was told to read it in a written order; later a hook re-injected the session state
  after each compaction and the task list was included in the rules file.
- It rotted: 366 commits in September (102 on one day); the session state was last updated as a
  pile of entries titled "the freshest, no. 19"; their own count found the top root cause of bugs
  (about 25 of about 80) was a **stale record**: a bug already fixed in the code, its record never
  updated. On 30.09 the owner moved 825 files to an archive because the rules, hooks and notes "got
  in the way of the work"; after that the one live decision card linked only into the archive; on
  02.10 the 239 cards went unused because no rule or skill named them.
- The task list was split at 56 KB (to 10.6 KB, commit 7e19629); the session state was abandoned.

## Mistakes and whether the guards held

- **Invented facts reached players**: a "sound radar" for blind players promised in the charter and
  never built, caught on 27.08, footnoted instead of removed, removed on 20.09 (b4a1d01); an
  invented margin, invented translation keys, an explanation given without checking.
- **"Done" claims**: a warning hook fired 9+ times and was never acted on (b3f2b18); moved to
  blocking, it then accepted any fresh log line as proof of any claim (20274a9). The journal of
  02.10: the assistant reported what it meant to do, not what it checked.
- **Lost requests**: the task list reached 56 KB with steps numbered 00, 00a, 000.
- **Security (Supabase)**: on 05.09 four security-definer functions were callable by any anonymous
  user; revoking from anon and authenticated failed because the grant sat on PUBLIC and default
  privileges re-granted each new function; found with Supabase's advisors. Guards: a rule, a
  blocking hook on new functions, and a permissions skill (revoke from public, anon, authenticated
  in the same migration; re-read the live grants; call with the anonymous key, expect error 42501).
- **Releases**: version and cache-buster kept in step by a script and a hook; the assistant never
  pushes (denied in settings); 8 reverts, 5 of them on 20–24.09; the full test suite froze the
  laptop for 40 minutes and moved to CI.
- **The failure behind the others: guard inflation.** Every complaint became a hook (the bar for a
  new hook dropped from 3–5 repeats to 1, commit 1d21896). By 30.09: 54 hooks, about 12 printing to
  a stream the assistant never sees, 4.6 s added to every shell command, some pointing at tools that
  no longer existed; cut to 11–12. 115 of the 1538 commits are about the assistant's own tooling.

## Skills there

- **Miss review**: when an existing tool went unused, find why (trigger wording, file archived, tool
  never named, a rule promising a guard that does not exist, file not opened), fix that cause with
  one small edit, write a journal line, take a third repeat to the owner; it adds no new mechanisms.
- **Supabase permissions**: as above.
- **Release**: saved, sent and live are three states; the version shown to the player.
- **How to report**: "I" as the subject, each claim pointing at its evidence, three states (works,
  broken, don't know).
- **Proofreading**: take the text from the file, not memory; one word per concept; no double
  negatives; non-breaking spaces in numbers; flag doubts instead of fixing them.

## Compared with this project

- Cosmogram did better: every rule said what enforces it ("Mechanism: hook X" or "none"); a guard
  had to go red on the problem before it counted; the rules said which skill to use when.
- This project fixes Cosmogram failures with: size caps checked by a test (docs/state.md 80 lines,
  docs/mistakes.md 60 rows), docs that must name real files, a mistakes row only with a guard,
  independent agents instead of self-checking hooks, quotes checked against the paper text, a
  blocking pre-commit instead of warnings.
- This project is worse in two places: CLAUDE.md has no size cap (1.7 KB to 7.8 KB in 3 days;
  Cosmogram's reached 35 KB before it was cut), and the plan doc (about 170k characters, about 195
  request rows) repeats the task-list and session-state pattern.

## To carry over, ranked by how much each lowers the risk of a Cosmogram mistake

1. Split the plan doc: the queue and the open requests live, closed rows archived, a size limit the
   request auditor reports.
2. Cap CLAUDE.md, and give each rule a "guard" line (a test, a hook, an agent, or "none").
3. A new guard counts only once it has been shown failing on the old mistake.
4. A miss review before any new guard: was an existing tool, agent or doc simply not used? Fix that
   cause with one edit; three repeats go to the owner.
5. A Supabase permissions guard: a test that every migration creating a function revokes it from
   public, anon and authenticated; the live grants re-read in the morning check.
6. Before trusting a plan row or a state line, check it against the live code or game first.
7. Proofreading the player's text; a build stamp on the test copy, so the headset shows which copy
   it is playing.

Every server, data and payment mistake, counted and checked against this project on 12.10: [cosmogram-server.md](cosmogram-server.md).
