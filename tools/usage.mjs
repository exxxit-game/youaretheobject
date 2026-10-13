// Where the Claude plan's usage goes, and whether a week gives the same amount: the plan shows only percentages
// (Settings > Usage), so every Claude Code transcript on this laptop is summed per week of the plan's limit and
// per day, by model, project and session, and set beside the plan's own percentages, as tokens per percent.
// Read only; prints sums, never a message's text. Transcripts are private: nothing leaves the laptop.
//   node tools/usage.mjs                                  the report
//   node tools/usage.mjs snap <weekly %> <5-hour %> [--at <ISO time the card was read>]
//                                                         one reading of the card into the snapshot log
// What the files can and cannot tell, as read from them:
// - Claude Code writes one line per content block of a response, each with the response's message id and a
//   copy of its usage, so a response is counted once by its message id (on every line; requestId, its 1:1
//   twin, is missing on a few). Input and cache are the same on all its lines; the output count grows as
//   the stream goes, so the largest is kept.
// - A helper's (subagent's) lines are mostly written before the final count arrives (stop_reason stays
//   null): its output is then the stream's first count, a lower bound ("open" below). The main
//   conversation's are final. Where Claude Code's own session totals (its cost-state lines) cover the same
//   calls, they equal these sums on input and cache, and on output too in sessions with no open response;
//   with open ones theirs is higher, by about a thousand tokens per open response.
// - Some of Claude Code's side calls (the small model that reads web pages) and Claude chat on the web,
//   desktop or phone write no transcript here, yet the plan counts them ("all activity in both tools
//   counts against the same limits", support.claude.com/en/articles/11145838).
// - A session deleted in Claude Desktop takes its transcript with it.
// - The plan's tier is read from Claude Code's account file (~/.claude.json) into each reading: a larger
//   tier gives more tokens per percent, so readings compare only within one tier.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const HOME = os.homedir();
const PROJECTS = path.join(HOME, '.claude', 'projects');
// Claude Desktop's own record of the plan's percentages, read as found (version 2): samples {t, org, u}
// where u.fh is the five-hour percent and u.sd the seven-day one (sd falls to 0 at each weekly reset)
const HISTORY = path.join(process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming'), 'Claude', 'plan-usage-history.json');
// outside the repository, which is public: the readings are private records
const SNAPS = path.join(HOME, 'Documents', 'objekt-files', 'notes', 'usage', 'snapshots.jsonl');
// only the tier's name is read from the account file, nothing else in it
const tier = () => { try { return JSON.parse(fs.readFileSync(path.join(HOME, '.claude.json'), 'utf8')).oauthAccount?.organizationRateLimitTier ?? null; } catch { return null; } };

// The weekly limit "resets at a fixed time each week that is assigned to your account"
// (support.claude.com/en/articles/11049741). This account's: Tuesday 06:00 UTC, the card's reset time;
// the files agree (a "hit your weekly limit · resets 9am (Europe/Chisinau)" notice, and the app's
// seven-day percent falling to 0 at that hour).
const RESET = Date.parse('2026-10-20T06:00:00Z');
const WEEK = 7 * 864e5;
export const weekStart = (t) => RESET + Math.floor((t - RESET) / WEEK) * WEEK;

// One weighting for comparing kinds: the API's list price, which is how Claude Code itself prices tokens
// for its own figure ("computes the dollar figure locally from token counts at list price",
// code.claude.com/docs/en/costs). How the plan's percent weighs them is not published; Anthropic says
// only that "cached portions count less against your limits than new content" (support article 9797557).
// USD per million tokens: input, 5-minute cache write, 1-hour cache write, cache read, output
// (platform.claude.com/docs/en/about-claude/pricing, the model pricing table)
export const PRICES = {
  'claude-fable-5-1': [10, 12.5, 20, 0.25, 50],
  'claude-opus-5-5': [4, 5, 8, 0.2, 20],
  'claude-sonnet-5-5': [2, 2.5, 4, 0.1, 10],
  'claude-sonnet-5': [2, 2.5, 4, 0.2, 10],
  'claude-haiku-5-5': [0.1, 0.125, 0.2, 0.01, 0.5],
  'claude-haiku-5-5 long': [0.5, 0.625, 1, 0.05, 2.5],   // a prompt over 100,000 tokens, cache included
  'claude-haiku-4-5': [1, 1.25, 2, 0.1, 5]
};
const modelName = (m) => String(m || '?').replace(/\[[^\]]*\]$/, '').replace(/-\d{8}$/, '');
export function usd(r) {
  const prompt = r.input + r.write5m + r.write1h + r.read;
  const p = PRICES[r.model === 'claude-haiku-5-5' && prompt > 100000 ? 'claude-haiku-5-5 long' : r.model];
  return p ? (r.input * p[0] + r.write5m * p[1] + r.write1h * p[2] + r.read * p[3] + r.output * p[4]) / 1e6 : null;
}

export const fresh = () => ({ byId: new Map(), custom: new Map(), named: new Map(), notices: [], files: 0 });
// one transcript's lines into the tally: responses by message id, session titles, limit notices
export function readText(text, where = {}, acc = fresh()) {
  acc.files++;
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.type === 'custom-title' && o.customTitle) acc.custom.set(o.sessionId, o.customTitle);
    if (o.type === 'agent-name' && o.agentName) acc.named.set(o.sessionId, o.agentName);
    const m = o.message;
    if (o.type !== 'assistant' || !m?.usage || !m.id) continue;
    // Claude Code's own notices (a limit hit, an error) come as model <synthetic>: no call to the model
    if (m.model === '<synthetic>') {
      const said = (m.content || []).map((c) => c.text || '').join(' ');
      if (/hit your .*limit/i.test(said)) acc.notices.push({ at: o.timestamp, said: said.slice(0, 120) });
      continue;
    }
    const u = m.usage, cc = u.cache_creation, write = u.cache_creation_input_tokens || 0;
    const r = { id: m.id, at: Date.parse(o.timestamp), model: modelName(m.model), session: o.sessionId, project: where.project || '?',
      sub: !!o.isSidechain, input: u.input_tokens || 0, write5m: cc ? cc.ephemeral_5m_input_tokens || 0 : write,
      write1h: cc ? cc.ephemeral_1h_input_tokens || 0 : 0, read: u.cache_read_input_tokens || 0, output: u.output_tokens || 0,
      final: !!m.stop_reason, fast: u.speed === 'fast' };
    const was = acc.byId.get(r.id);
    if (!was) { acc.byId.set(r.id, r); continue; }
    for (const k of ['input', 'write5m', 'write1h', 'read', 'output']) was[k] = Math.max(was[k], r[k]);
    was.at = Math.min(was.at, r.at); was.final ||= r.final;
  }
  return acc;
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.jsonl') ? [path.join(dir, e.name)] : []));
// a worktree's folder is counted with its repository's; the user's own path is cut from the name
const projectOf = (folder) => folder.replace(/--claude-worktrees-.+$/, '').replace(/^[A-Za-z]--Users-[^-]+-/, '').replace(/^Documents-GitHub-/, '');
export function readAll(root = PROJECTS) {
  const acc = fresh();
  for (const f of walk(root)) readText(fs.readFileSync(f, 'utf8'), { project: projectOf(path.relative(root, f).split(path.sep)[0]) }, acc);
  acc.list = [...acc.byId.values()].sort((a, b) => a.at - b.at);
  return acc;
}

const zero = () => ({ n: 0, input: 0, write: 0, read: 0, output: 0, usd: 0, open: 0, unpriced: 0, fast: 0 });
function add(s, r) {
  s.n++; s.input += r.input; s.write += r.write5m + r.write1h; s.read += r.read; s.output += r.output;
  const d = usd(r); if (d === null) s.unpriced++; else s.usd += d;
  if (!r.final) s.open++; if (r.fast) s.fast++;
  return s;
}
export const sum = (rs) => rs.reduce(add, zero());
const group = (rs, key) => { const g = new Map(); for (const r of rs) { const k = key(r); g.set(k, add(g.get(k) || zero(), r)); } return g; };
const bucket = (rs, key) => { const g = new Map(); for (const r of rs) { const k = key(r); if (!g.has(k)) g.set(k, []); g.get(k).push(r); } return g; };
const day = (r) => new Date(r.at).toISOString().slice(0, 10);
const between = (rs, t0, t1) => rs.filter((r) => r.at >= t0 && r.at < t1);

const fmt = (n) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));
const iso = (t) => new Date(t).toISOString().slice(0, 16).replace('T', ' ');
const tokens = (s) => s.input + s.write + s.read + s.output;
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)} %` : '-');
const HEAD = `${'model'.padEnd(26)}${'resp'.padStart(7)}${'input'.padStart(9)}${'cache wr'.padStart(10)}${'cache rd'.padStart(10)}${'output'.padStart(9)}${'open'.padStart(7)}${'$ list'.padStart(11)}`;
const row = (label, s) => `${label.padEnd(26)}${String(s.n).padStart(7)}${fmt(s.input).padStart(9)}${fmt(s.write).padStart(10)}${fmt(s.read).padStart(10)}${fmt(s.output).padStart(9)}${String(s.open).padStart(7)}${s.usd.toFixed(2).padStart(11)}`;

function title(acc, id) { return acc.custom.get(id) || acc.named.get(id) || `(untitled ${String(id).slice(0, 8)})`; }

function printWeek(acc, rs, w0) {
  const all = sum(rs);
  console.log(`\n=== Week ${iso(w0)} -> ${iso(w0 + WEEK)} UTC${w0 + WEEK > Date.now() ? ' (so far)' : ''}`);
  console.log(HEAD);
  for (const [m, s] of [...group(rs, (r) => r.model)].sort((a, b) => b[1].usd - a[1].usd)) console.log(row(m, s));
  console.log(row('all', all), `  tokens of all kinds ${fmt(tokens(all))}`);
  console.log('by day (UTC):');
  for (const [d, one] of bucket(rs, day)) {
    for (const [m, s] of group(one, (r) => r.model)) console.log(row(`  ${d} ${m.replace(/^claude-/, '')}`, s));
  }
  const share = (g) => [...g].sort((a, b) => b[1].usd - a[1].usd);
  console.log(`main conversations ${pct(sum(rs.filter((r) => !r.sub)).usd, all.usd)} of $ list, helpers (subagents) ${pct(sum(rs.filter((r) => r.sub)).usd, all.usd)}`);
  console.log('by project ($ list | tokens):', share(group(rs, (r) => r.project)).map(([p, s]) => `${p} ${pct(s.usd, all.usd)} | ${pct(tokens(s), tokens(all))}`).join(' · '));
  console.log('by session ($ list | tokens), the 10 largest:');
  for (const [id, s] of share(group(rs, (r) => r.session)).slice(0, 10)) {
    const p = rs.find((r) => r.session === id).project;
    console.log(`  ${pct(s.usd, all.usd).padStart(7)} | ${pct(tokens(s), tokens(all)).padStart(7)}  ${title(acc, id)} [${p}]`);
  }
  if (all.unpriced) console.log(`  ${all.unpriced} responses of a model with no list price here: left out of $ list`);
  if (all.fast) console.log(`  ${all.fast} responses in fast mode: priced here at the standard rate, which is lower`);
}

// The percentages as the plan reports them: Claude Desktop's samples and the snapshot log
export function samples(history = HISTORY, snaps = SNAPS) {
  const out = [];
  try { for (const s of JSON.parse(fs.readFileSync(history, 'utf8')).samples || []) if (Number.isFinite(s.u?.sd)) out.push({ t: s.t, sd: s.u.sd, fh: s.u.fh, from: 'app' }); } catch { /* no Desktop record here */ }
  try { for (const l of fs.readFileSync(snaps, 'utf8').split('\n')) if (l.trim()) { const s = JSON.parse(l); out.push({ t: Date.parse(s.at), sd: s.weeklyPct, fh: s.fiveHourPct, from: 'snap' }); } } catch { /* no reading yet */ }
  return out.sort((a, b) => a.t - b.t);
}
// runs of samples in one week whose weekly percent never falls: between two samples of a run the tokens
// spent and the points gained belong to the same allowance (a fall means a reset, given or weekly)
export function runs(ss) {
  const out = [];
  for (const s of ss) {
    const cur = out.at(-1), last = cur?.at(-1);
    if (!last || weekStart(s.t) !== weekStart(last.t) || s.sd < last.sd) out.push([s]); else cur.push(s);
  }
  return out;
}

function printPercent(rs) {
  const ss = samples();
  if (!ss.length) { console.log('\nNo record of the plan\'s percentages on this laptop.'); return; }
  console.log(`\n=== The plan's weekly percent (${ss.length} readings: Claude Desktop's own record, ${iso(ss[0].t)} on, and the snapshots)`);
  // a lone reading is no rise: one taken the second the week turns can still show the old week's percent
  const peaks = new Map();
  for (const s of runs(ss).filter((r) => r.length > 1).flat()) { const w = weekStart(s.t), p = peaks.get(w); if (!p || s.sd > p.sd) peaks.set(w, s); }
  console.log('highest reading each week:', [...peaks].map(([w, s]) => `${iso(w).slice(5, 10)}: ${s.sd} % (${iso(s.t).slice(5)})`).join(' · '));
  console.log('rises in the weekly percent and the tokens these transcripts spent over them:');
  let bare = 0;
  for (const run of runs(ss)) {
    // the run ends where it first reaches its top: at a full limit the plan refuses, nothing more is spent
    const top = Math.max(...run.map((s) => s.sd)), end = run.find((s) => s.sd === top);
    const spent = between(rs, run[0].t, end.t);
    if (end.sd - run[0].sd < 3) continue;   // a point or two is the rounding of a whole percent
    if (!spent.length) { bare++; continue; }
    // points gained before the run's first transcript were spent where no transcript is: left out of the rate
    let k = 0; while (run[k + 1].t <= spent[0].at) k++;
    const a = run[k], d = end.sd - a.sd, s = sum(spent), lost = a.sd - run[0].sd;
    console.log(`  ${iso(a.t)} ${String(a.sd).padStart(3)} % -> ${iso(end.t)} ${String(end.sd).padStart(3)} %: +${d} points; ${fmt(tokens(s))} tokens`
      + ` (${fmt(s.input + s.write + s.output)} without cache reads), $ list ${s.usd.toFixed(2)}, ${s.open} open; per point: $ ${(s.usd / d).toFixed(2)},`
      + ` ${fmt(tokens(s) / d)} tokens${lost ? ` (and +${lost} points before it with no transcript here)` : ''}`);
  }
  if (bare) console.log(`  ${bare} rises with no transcript at all here (sessions deleted in Claude Desktop, chat, or another device)`);
}

export function report(acc = readAll()) {
  const rs = acc.list;
  if (!rs.length) { console.log('No Claude Code transcripts under', PROJECTS); return; }
  console.log(`Claude Code on this laptop: ${acc.files} transcript files, ${rs.length} API responses, each counted once by its message id;`);
  console.log(`${iso(rs[0].at)} to ${iso(rs.at(-1).at)} UTC. Weeks run from the plan's reset, Tuesday 06:00 UTC. Tier now: ${tier() || 'unknown'}.`);
  console.log('Kinds as written; "$ list" weighs them by the API list price (the plan\'s own weighting is not published).');
  console.log('"open": responses whose output count is only the stream\'s first (mostly helpers): output is a lower bound.');
  for (const [w, wRs] of bucket(rs, (r) => weekStart(r.at))) printWeek(acc, wRs, w);
  if (acc.notices.length) console.log('\nlimit notices in the transcripts:', acc.notices.sort((a, b) => (a.at < b.at ? -1 : 1)).map((n) => `${n.at.slice(0, 16)} UTC "${n.said}"`).join('; '));
  printPercent(rs);
}

// one reading of the card, with the tokens spent so far in its week, so later weeks compare as tokens per percent
export function snap(weeklyPct, fiveHourPct, at = Date.now(), acc = readAll(), file = SNAPS) {
  const w0 = weekStart(at), s = sum(between(acc.list, w0, at));
  const entry = { at: new Date(at).toISOString(), weeklyPct, fiveHourPct, tier: tier(), weekStart: new Date(w0).toISOString(),
    tokens: { responses: s.n, input: s.input, cacheWrite: s.write, cacheRead: s.read, output: s.output, open: s.open, usdList: Number(s.usd.toFixed(2)) } };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`);
  return entry;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'snap') {
    const [weekly, five] = rest.map(Number), i = rest.indexOf('--at');
    const at = i >= 0 ? Date.parse(rest[i + 1]) : Date.now();
    if (![weekly, five, at].every(Number.isFinite)) { console.error('usage: node tools/usage.mjs snap <weekly %> <5-hour %> [--at <ISO time>]'); process.exit(1); }
    const e = snap(weekly, five, at);
    console.log(`snapshot added to ${SNAPS}:`, JSON.stringify(e));
    console.log(`this week so far: ${fmt(e.tokens.input + e.tokens.cacheWrite + e.tokens.cacheRead + e.tokens.output)} tokens, $ list ${e.tokens.usdList}; per weekly point: $ ${(e.tokens.usdList / weekly).toFixed(2)}`);
  } else report();
}
