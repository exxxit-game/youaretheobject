// Yesterday's commits by what they touched, for his brake line at a new window's start
// (tools/claude-guard.mjs, start): when the process takes more commits than the game, he sees it first
const GAME = /^(src\/|css\/|index\.html$|vendor\/)/;
const PROCESS = /^(tools\/|tests\/|docs\/|\.claude\/|\.github\/|CLAUDE\.md$|package\.json$)/;
export function split(log) {
  let game = 0, process = 0;
  for (const commit of String(log).split(/\n(?=@@)/)) {
    const files = commit.split('\n').slice(1).map((f) => f.trim()).filter(Boolean);
    if (!files.length) continue;
    if (files.some((f) => GAME.test(f))) game++;
    if (files.some((f) => PROCESS.test(f))) process++;
  }
  return { game, process };
}
