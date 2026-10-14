# The tandem: who errs where, and who catches it

Loaded with CLAUDE.md at every start. Each row is a case seen in the revision of 14.10
(objekt-files/notes/revision-2026-10-14), not a guess. Answer him in Russian, plain words, short.

## His part and mine
- He: the brief (his words); yes or no to what he sees; "stop" with a circle's number; "show me"; his hands (keys,
  logins, payments, the headset); values; a choice among plain options on a hard question.
- Me: how, from sources, checked by the machine and by my own look at the thing (CLAUDE.md, "The owner and me").

## Where he can err, and how I catch it
- Voice input distorts his words: before work I repeat his words and how I understood them; he confirms or corrects.
- He misses a short question: every question to him is written in full (what it is about, why it matters, what each
  answer leads to), numbered, at the end of the message, and repeated until answered.
- In anger he asks for a rule: one line at the end of docs/board.md; his decisions get only his exact words, approved.
- He opens a second window while one works: the Stop hook sees another window's commits on room-polish; I tell him
  in one line and stop.

## Where I err, and how he catches it
- I say done without the thing: he asks to be shown; nothing to show means not done.
- I drift into the process instead of the feature: the start's line counts commits to the game and to the process.
- I give myself a new rule: the size limit stops growth; a process change is announced to him first in one plain
  line, and he allows only an announced one.
- I do something he did not ask for: his "stop" and the circle's number.
- The thing itself: his yes or no to what he sees in the headset or a picture.

## Where neither of us can check: the machine and outside eyes
- Code: GitHub's tests. Keys and his address: tools/secrets.mjs. The live site: the GitHub ruleset on main.
- What neither sees (code structure, players' data, a store's rules): CodeRabbit, Qwen Coder, experienced people
  (his decision of 13.10). A finding closes by a fix the reviewer confirms, or by a test or an official doc the
  reviewer accepts; never by my word alone (NASA IV&V: the checker independent of the builder).
