# Boris Cherny at YC Startup School 2026: what it says about how we steer the agent

Read 2026-10-14 in full from Y Combinator's own transcript (Root Access, "Boris Cherny: Building Claude Code",
posted 2026-07-27, https://www.ycrootaccess.com/p/boris-cherny-building-claude-code), linked from the video's
description (Y Combinator, "Boris Cherny: We Cut 80% of Claude Code's Prompt", 2026-07-27,
https://www.youtube.com/watch?v=qyPCVqFUyDo). Cherny made Claude Code; Diana Hu (YC) asks. Said the day after
Opus 5 shipped; we run Opus 5.5: that his advice holds for it too is my inference, not his words. Below: his points in my words, timestamps from YC's
page, short quotes only.

## His points
1. Instructions are deleted and earned back (03:21, 06:37, 07:20). Each new model, his team deletes most of the
   system prompt and brings lines back one at a time, measuring each line ("ablation"). For Claude Code users he
   advises: every six months delete CLAUDE.md, skills and hooks and see what the model does; for Opus 5 especially,
   since it "might not need all those instructions" written for past models. (The transcript writes CLAUDE.md as
   "quantum D", a mishearing.) An instruction comes back only when the model repeatedly stumbles on the same thing,
   because the model reads it every single time.
2. What stays in their own harness (06:37): almost all of it is safety, permissions and static analysis, plus UI.
3. Do not over-specify (14:26, 19:32): describe the task, the guardrails and the exit criteria, then let the model
   work. Spelling out every step is the common failure of experienced engineers.
4. Verification matters most (19:32): "the single most important thing" people get wrong. Give the model a way to
   check its own work as a person would; his example has the agent screenshot the old app and the new one and
   compare them pixel by pixel.
5. Evals live a few model generations (07:20): kept until the model saturates them, then replaced; built from where
   the model struggles in real use.
6. Daily maintenance routines (24:42): agents that delete dead code, delete useless tests added by older models or
   people, and unify near-duplicate abstractions, each from a one-sentence prompt.
7. His caveat (30:15): verifying a UI to the pixel is still where Claude is "not perfect".

## Where this meets our setup (docs/research/docs-practice-agents.md, the page of 2026-10-14)
- Point 1 is a periodic test of every steering file, ours included (CLAUDE.md, its imports, .claude/rules, the
  guards). Our size limit only goes down (.claude/process-size.json) but nothing ever re-tests a line. Changing
  that is a process change: his permission first.
- Point 2 matches what we hold by machine (main's ruleset, room-polish's ruleset, tools/secrets.mjs, the database
  read only): those are the kind that stays.
- Point 4 is item 8 of the wall's plan (screenshots compared against his approved ones).
- Point 6 is the kind of routine that would keep changeable facts honest (a version written in 35 files, dates
  without a year), see the board's line of 2026-10-14.
