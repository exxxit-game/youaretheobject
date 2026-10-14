# Context for Claude 5 models: Anthropic's own rules, and six Reddit threads beside them

Read 2026-10-14. We run Opus 5.5, so all of this is about the models we use now. Points in my words, short quotes
only. Reddit threads were saved by the owner as JSON (Reddit is closed to my tools) and read post plus most upvoted
comments; a comment is one person's report, not a measurement.

## Anthropic, "The new rules of context engineering for Claude 5 generation models"
Thariq Shihipar (Anthropic), claude.com blog, 2026-07-24,
https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
- They removed over 80% of Claude Code's system prompt for Opus 5 and Fable 5 "with no measurable loss" on their
  coding evaluations. Their own transcripts showed conflicting messages from the system prompt, skills and the
  request in one turn, which the model has to reconcile.
- Then and now: rules give way to judgment; examples to well designed tools and files; everything up front to
  progressive disclosure (a tree of files loaded when needed); repeating yourself to one plain description; memory
  in CLAUDE.md to auto-memory; simple specs to rich references (HTML artifacts, test suites, code).
- CLAUDE.md: keep it light, say briefly what the repository is for, spend most of it on the codebase's gotchas,
  leave out what the model sees in the files. Skills: light guides, overconstrained only where it really matters.
- `/doctor` in Claude Code audits CLAUDE.md and skills against these practices ("rightsize").

## Reddit, r/ClaudeAI (saved by the owner 2026-10-14)
1. "Anthropic cut 80% of Claude Code's system prompt for the Claude 5 models..." (2026-07-24, 1,558 points, 86
   comments), https://www.reddit.com/r/ClaudeAI/comments/1v5mhhl/anthropic_cut_80_of_claude_codes_system_prompt/ :
   points to the article above. A commenter's middle way: keep a short section of non-negotiables in CLAUDE.md and
   let judgment cover the rest.
2. "What happens when you stop adding rules to CLAUDE.md and start building infrastructure instead" (2026-03-20,
   537 points, 166 comments), https://www.reddit.com/r/ClaudeAI/comments/1rz2oo3/what_happens_when_you_stop_adding_rules_to/ :
   the author's file grew from 45 to 190 lines as each slip got a rule, and compliance fell; an audit found 40%
   redundancy (same rule twice, rules contradicting, rules no longer true); trimming to 123 lines helped; the real fix
   was moving enforcement into the environment (a hook that typechecks on every edit): "Rules degrade. Hooks don't."
3. "What's the one line in your CLAUDE.md that made the biggest difference?" (2026-09-30, 1,364 points, 185
   comments), https://www.reddit.com/r/ClaudeAI/comments/1wu40t8/whats_the_one_line_in_your_claudemd_that_made_the/ :
   the top answer (464): if the request is ambiguous, ask one clarifying question first; another (66): do not trust
   assumptions when verifiable information exists.
4. "Anyone else feel like Claude drifts from its instructions a bit more since Opus 5?" (2026-08-12, 28 points, 22
   comments), https://www.reddit.com/r/ClaudeAI/comments/1vmjjnz/anyone_else_feel_like_claude_drifts_from_its/ :
   rules slip later in long sessions; trimming CLAUDE.md and restating the rule in the chat helped one commenter.
5. "Claude ignores its own plans, memory, and guardrails — 22 documented failures in 19 days" (2026-04-06, 24
   points, 58 comments), https://www.reddit.com/r/ClaudeAI/comments/1se1olb/claude_ignores_its_own_plans_memory_and/ :
   the cycle break, write more process, ignored, break again; the answers: markdown rules are suggestions, gates must
   be code ("have the AI write the code, but have the code do the checking"). Two commenters report the agent getting
   round a hook (editing it; writing a fake "Human:" turn); unverified anecdotes.
6. "Wondering why code quality fell off the cliff, then found this in CLAUDE.md." (2026-04-15, 699 points),
   https://www.reddit.com/r/ClaudeAI/comments/1smkde5/wondering_why_code_quality_fell_off_the_cliff/ : a joke about
   a typo in CLAUDE.md; commenters disagree whether typos matter. Nothing to take.

## Where this meets our setup
- Our always-loaded set (CLAUDE.md and its three imports, 18,652 characters) and the circles printed again at start
  are "put it all upfront" and "repeat yourself" in the article's terms. Both are his decisions (docs/owner-decisions.md:
  the start rules shortened, the circles kept in two places), so this goes to him as facts and options, not as a
  change.
- What the article and threads 2 and 5 keep is what we already hold by machine: hooks, rulesets, tests. Our hooks
  themselves change only through his permission (.claude/settings.json ask rules), which answers thread 5's reports
  of an agent editing its own hook.
- `/doctor` is a ready tool for the audit the owner asked for; it is a terminal command, not available inside the
  desktop app's session.
