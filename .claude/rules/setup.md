---
paths:
  - ".claude/**"
  - ".github/**"
  - "tools/claude-guard.mjs"
  - "tools/hooks/**"
  - "tools/prove-guards.mjs"
  - "tools/secrets.mjs"
  - "tools/publish-preview.mjs"
  - "tools/usage.mjs"
  - "package.json"
  - "docs/tools.md"
---
# The owner's decisions on the setup: connectors, plugins, models, GitHub, CodeRabbit, updates

Settled like every line of docs/owner-decisions.md (never re-asked, never argued against; a change only from him).
Claude Code loads this file when a file of the paths above is read or edited.

- Two empty PATH entries in Windows stay («Вообще не хочу туда лезть» 10.10).
- Google Drive is the papers' cloud copy; the old Dropbox files stay («мы выбираем Google Driver» 10.10).
- The strongest model («взял самую-самую умную» 9.10), the search helpers too («вернуть Opus» 12.10).
- Paid tools only when they help decisively («не готов платить за лишнюю херню» 10.10).
- CodeRabbit kept only if useful («А если он нам будет очень полезен, я, может, и дальше за него буду платить» 10.10); it replaces the PR review toolkit («делай» 10.10) and reviews each window's pull request into room-polish; the robot that moved its baseline retired on his word («reviewed, делай что нужно, если это самое умное решение» 14.10); its trial: docs/state.md.
- The dialogues are kept whole as the archive of why each path was taken, to check against («чтобы оставалась память, по которой мы понимаем, почему мы так поступали… чтобы мы могли всегда свериться» 13.10); Claude Desktop keeps them at any age (Claude Code's docs).
- He sets up and connects; I check it all as one whole («Все, что надо настроить, подключить, я настрою и подключу» 10.10).
- No separate GitHub account for the agent («создавать отдельную учетную запись под тебя я просто в рот ебал» 13.10).
- Lessons on our code (10 minutes, a piece he saw in the headset, plain words, one number changed by him) only when he wants; he never re-checks code («эти перепроверки за тобой мне вообще не нравятся» 11.10).
- GitHub done properly, releases and all («каждый этот шаг сделаем правильно» 9.10); the live site gets one thing only once polished («оттачиваем одну вещь» 9.10).
- Install first, the site second («а сайт это уже второй шаг» 9.10); what costs more later is decided now (9.10).
- I am not the judge of my own work («ты сам себя можешь оправдать» 11.10).
- Everything found gets put in, fixed and improved («нужно всё вносить и исправлять, улучшать» 10.10).
