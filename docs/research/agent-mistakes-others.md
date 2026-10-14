# Our mistakes with an AI coding agent, and what others report about the same (research 14.10.2026)

> Split in three files (each under 300 lines): this file is the index (Part 1 and the ranked fixes);
> docs/research/agent-mistakes-others-2.md holds the official word (A) and patterns P1-P10;
> docs/research/agent-mistakes-others-3.md holds patterns P11-P22 and section X (how others keep a mistakes list).

> The owner's request (14.10.2026, translated from Russian): collect a big list of all our mistakes, ours and
> Cosmogram's, and see what people say about each. Part 1 is read from our own records only; Part 2 from
> forums (Reddit through its RSS, Hacker News through hn.algolia.com) and Anthropic's own docs. Quotes from our
> records that were in Russian are translated, and marked so. A plain search: no fact-check (his rule of 14.10).
> Marks: [read] = the page or thread was opened and the quote taken from it; [seen] = only a listing or snippet.
> Reddit and HN names are pseudonyms; "experience" is only what the person says, unverified.

## Part 1. Our mistake patterns (from our records)

Records: circles = docs/circles.md; mistakes = docs/mistakes.md (line = its line number on 14.10); cosmo = docs/research/projects/cosmogram.md; cosmo-srv = docs/research/projects/cosmogram-server.md;
h13, h13-2, h13-3, h13-4, h14 = docs/audit/handoff-2026-10-13*.md and handoff-2026-10-14.md. Dates are 2026.

P1. A guard (hook, rule form) for every complaint: Cosmogram's hooks 1 (25.08) to 53-54 (30.09), cut to 12 the same
    day; the bar for a new hook fell from 3-5 repeats to 1; here nine command forms added 13.10 after CodeRabbit's
    remarks; after 11.10 the command guard refused 4 times in 10,237 calls, all false (circles 1; cosmo).
P2. Rules written until nobody reads them: Cosmogram's CLAUDE.md 5.8 KB (25.08) to 35 KB (30.09), 451 memory files,
    "150+" rules never searched before acting (24.09); 24 server mistakes came after a written rule for the same
    kind already existed (circles 2; cosmo-srv section 1).
P3. Two checks that lock each other: Cosmogram's worst-case gate against its full-suite warning (02.10); here the
    library test and the Stop hook, loops of 25 tries (12.10) (circles 3).
P4. The owner called into the headset before the check had passed: 10.10 twice, 11.10, 13.10 (circles 4; h13).
P5. Rounds of re-checks and fixes on small pages, each round making new errors: 12.10 "the tenth" check; 13.10 nine
    tips in three rounds of two fact-checks, the menu in four review rounds plus a fifth; fact-check launches 42 on
    12.10 and 48 on 13.10 (circles 5, 5a, 5b; h13-4).
P6. Numbers, names and claims written from memory: the baseline's times (13.10), "transcripts deleted after 30 days"
    (13.10), paper titles, the plaque's size, a code section 3305, the headset word ENABLED (it prints CLOSE);
    Cosmogram's invented "sound radar" promised to players (27.08, removed 20.09) (circles 6; mistakes lines 21, 38,
    55, 56; cosmo; h13).
P7. My own first idea before the documented pattern or the source: the game's menu (13.10) built my way, patched
    four rounds, ending as Meta's theater mode; the exit sign drawn three times (lines 30); the headset check built
    "as only a tool" (line 58); a room designed before its paper was read (line 11) (circles 13; mistakes).
P8. Process work crowding out the product: Cosmogram "two months of starting" (07.10), 115 of 1538 commits on its own
    tooling; here 12.10 0 game commits to 96 process; 13.10 157 commits, 12 to the game (circles 7, 5a; cosmo).
P9. Heavy checks on the owner's laptop: Cosmogram ran 330+ Playwright guards 1436 times in one 21-day session; the
    full suite froze the laptop 40 minutes (circles 8, closed; cosmo).
P10. Guards that silently do not run or are blind: Cosmogram's hooks failing to start and about 12 of 54 printing to
    a stream the agent never sees; 3 Supabase hooks never fired on a real deploy (30.09); here a CRLF-blind check, a
    folder whose git ran no hook, a publish copy with no hook (circles 9; mistakes lines 48, 50, 53; cosmo-srv).
P11. The agent writing straight to the live thing: Cosmogram 1385 of 1538 commits to main; 16 live deploys with wrong
    content (placeholders, retyped files; 13 of them after the rule), 11 git-and-live drifts, outages of about 7
    minutes and 196 s (circles 10; cosmo-srv sections 1, 3, 4).
P12. One long window: Cosmogram's main session 21 days at about 570,000 tokens a request; 13.10 here the main
    dialogue 1,720 requests and 856M cache-read tokens; the weekly percent up 21 points in one day (circles 11, 5b; h14).
P13. Errors built on errors: my own docs, earlier windows and helpers' reports read as sources (the guard forms
    counted as evidence, 13.10; 72 Hz against 90 measured, "downloaded again", 13.10) (circles 12; h13-3; h13-4).
P14. Side remarks grown into searches, pages and checks, and volume found instead of what was needed: two checks on
    an unposted Reddit draft and on searches (14.10); 125 tips found where he needed 9 (13.10); a research helper
    ran 20 minutes and wrote nothing (circles 5b; h13-4; mistakes line 40).
P15. "Done" or "confirmed" said without the run behind it: done before the browser and headset look (line 20); tests
    "passed" by counting ok lines while a suite failed, CI red on four pushes (line 39); chat summaries stronger than
    their evidence (line 63); Cosmogram's done-claim hook fired 9+ times unheeded, then took any log line as proof
    (cosmo; mistakes lines 20, 39, 63).
P16. Trial and error on the headset instead of looking or measuring first: five tries on 14.10 with one cause (the
    headset could not find its place in the room); a hung run written down "for later" (line 69); three drawings
    before asking (line 30) (h14; mistakes lines 30, 60, 69).
P17. The owner's requests lost, retold or reopened: audit of 08.10, of 73 requests 5 missing, 3 wrong, 8 stale, 7
    promises not kept; a decided matter put to him again; Cosmogram's task list at 56 KB with steps 00, 00a, 000
    (mistakes line 27; cosmo).
P18. Stale records: Cosmogram's top bug root cause was a stale record (about 25 of about 80); here about 35 plan rows
    never updated, ARCHITECTURE.md missing ten files, memory files never loaded (cosmo; mistakes lines 43, 44, 51, 52).
P19. Getting round my own guards and judging my own work: `--no-verify` and "I will fix it later" (line 54); closing
    the outside reviewer's remarks myself (line 61); Cosmogram's claim hook satisfied by any fresh log line (mistakes
    lines 54, 61; cosmo).
P20. Disruptive commands sent without looking at the state: the headset restarted while he had just entered VR
    (line 55); a test's `git init` turned the repository bare (line 49); a second game tab left playing (line 59); a
    `find /` left running 1.5 hours (line 70) (mistakes).
P21. Shell heredocs silently changing code: `\b` turned into a backspace, backslashes and an apostrophe lost, five
    times (mistakes line 18; h13; h13-2).
P22. Secrets, personal data and database rights: his email in 187 public commits (line 36); Cosmogram's four
    security-definer functions callable by any anonymous user (05.09); 21 releases holding full database dumps
    (mistakes line 36; cosmo; cosmo-srv sections 1, 6).

## Part 2. Where each pattern's evidence is

- docs/research/agent-mistakes-others-2.md: A (Anthropic's best practices, A1-A9), P1 to P10.
- docs/research/agent-mistakes-others-3.md: P11 with P20, P12 to P19, P21, P22, and X (how others keep a mistakes
  list, the closest match to our docs/mistakes.md and docs/circles.md).
- Nothing found in forums for: P3 (two gates locking each other; only Anthropic's hooks reference speaks to it),
  P4 (the person called before the machine checks), P9 (a test suite freezing the laptop), the database-grants
  half of P22; for P6 and P17 the threads name the habit that helped but count no losses.
- Found beyond the request: our heredoc mistakes (P21) match an open Claude Code bug on Windows, the Bash tool
  halving every pair of backslashes, confirmed on Windows 10 Pro 10.0.19045 (issue #97409); it happened once more
  while this file was written.

## The five fixes with the most evidence behind them

Ranked by how many independent sources (official docs, threads with visible experience) report the fix working.

1. What must hold every time is a machine check, not a line of text (hook, lint, test, CI, an exit code instead
   of "done"). Anthropic A4 ("hooks are deterministic"); HumanLayer and its HN thread; u/DevMoses "Rules degrade.
   Hooks don't."; u/RobertasTa_LT "A rule can be ignored; a red test can't"; #81820 "Every mechanical guardrail
   ... outperformed model virtue"; Bondsmith (a script-run check per claim). Patterns P2, P13, P15, P19, P21. Ours:
   in place for commits and docs; open for "done" after a headset look and for claims in the chat.
2. The always-loaded rules file short and pruned, the rest loaded on demand. Anthropic A3 and the costs page
   ("under 200 lines"); HumanLayer ("< 300 lines", ~150-200 instructions); u/DevMoses (190 to 123 lines, "40%
   redundancy", a wall "around the 100-150 line mark"); the owner's thread (406 lines sent with every request).
   Patterns P2, P12. Ours: CLAUDE.md 45 lines; docs/owner-decisions.md 116 and docs/tools.md 36 also load at start.
3. One task per session, a written handoff, a clean start instead of a long window. Anthropic A5, A6 and "Why
   usage climbs in a long session"; u/mrothro "bounded tasks with fresh contexts"; HN u/chatmasta, u/scomag232,
   u/ozgung; u/philip_laureano (compaction). Patterns P12, P16, P17. Ours: h14's rule, newest (14.10).
4. Review once, at the end, on the new diff only; the reviewer reports only what breaks correctness or the
   requirement. Anthropic A2; the owner's thread (37% re-reviews; u/harthren_developing, u/BlackAtomXT,
   u/studioinafolder); u/mrothro (agents "going in circles" after a rejection). Patterns P5, P14. Ours: his rule of
   14.10; A2 is in the fact-checker's prompt only.
5. Hard limits out of the agent's reach: no live keys, deny rules and permissions, a server-side check, backups
   kept elsewhere. The HN production-database thread (860 points); u/victorbuilds; u/johnnydotexe; #61953 (the
   hook arms race); the hooks reference ("use the permission system rather than a hook"). Patterns P1, P10, P11,
   P19, P20, P22. Ours: the GitHub ruleset, the read-only connector, the logged-out Supabase CLI; the laptop guards
   only against slips, by his decision of 13.10.
