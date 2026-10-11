// Helpers' commands left running. A shell command that outlives its tool's time limit is moved to the
// background, not stopped (measured 11.10 on the laptop: a 4 s limit left `node -e setTimeout(...)`
// running under the session's bash); one a background helper started "keeps running after a final
// response", and the desktop app "has no time limit on background commands" (code.claude.com/docs/en/
// tools-reference): a reviewing agent's `find /` ran an hour and a half after the review ended
// (docs/mistakes.md). The stop hook
// (tools/claude-guard.mjs) lists what runs under a Claude Code session longer than LIMIT_MS, and the turn
// does not end until each is stopped or waited for (the owner's yes, 11.10).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

export const LIMIT_MS = 10 * 60 * 1000;
// Claude Code itself: the desktop app runs it from %APPDATA%\Claude\claude-code\<version> (measured
// 11.10); npm's install runs node on @anthropic-ai/claude-code; the native one sits in ~/.local/bin
const SESSION = /claude-code|[\\/]\.local[\\/]bin[\\/]claude/i;
const isSession = (p) => /^(claude|node)(\.exe)?$/i.test(p.name) && SESSION.test(p.cmd || '');
// what Claude Code keeps for the whole session and starts itself, beside the tool shells: MCP and
// language servers. A tool shell's line holds the command it runs, so it is told apart by Claude
// Code's own marks (measured 11.10: bash sources ~/.claude/shell-snapshots, PowerShell's cmd.exe reads
// CLAUDE_CODE_SHELL_LAUNCHER_SCRIPT), or `grep mcp` would pass for a server. A console host lives as
// long as the process it serves and runs nothing.
const SERVER = /\bmcp\b|language-?server|\blsp\b/i;
const TOOL_SHELL = /shell-snapshots|CLAUDE_CODE_SHELL/i;
const QUIET = /^conhost(\.exe)?$/i;

// list: { pid, ppid, name, start (ms), cmd } for every process. A parent id outlives its process and
// may be reused, so a child counts only if it began after its parent did (learn.microsoft.com,
// Win32_Process, ParentProcessId: "use the CreationDate property to determine whether the specified
// parent was created after the process"). What is named is the deepest old one in each line, the
// command itself rather than the shells waiting for it.
export function leftovers(list, now, limit = LIMIT_MS) {
  const kids = new Map();
  for (const p of list) kids.set(p.ppid, [...(kids.get(p.ppid) ?? []), p]);
  const seen = new Set(), old = new Set();
  const walk = (p, top) => {
    for (const k of kids.get(p.pid) ?? []) {
      if (seen.has(k.pid) || k.pid === p.pid || k.start < p.start) continue;
      seen.add(k.pid);
      if (QUIET.test(k.name) || (top && SERVER.test(k.cmd || '') && !TOOL_SHELL.test(k.cmd || ''))) continue;
      if (now - k.start > limit) old.add(k);
      walk(k, false);
    }
  };
  for (const root of list.filter(isSession)) { seen.add(root.pid); walk(root, true); }
  return [...old].filter((p) => !(kids.get(p.pid) ?? []).some((k) => old.has(k) && k.start >= p.start));
}

// Every process on this machine, or why not. Windows: CIM's Win32_Process (wmic is deprecated);
// elsewhere ps, whose etimes is seconds since start. OBJECT_PROCESS_LIST names a JSON file of the same
// list instead, for the tests and tools/prove-guards.mjs, which cannot make a process ten minutes old.
export function processes() {
  if (process.env.OBJECT_PROCESS_LIST) return JSON.parse(fs.readFileSync(process.env.OBJECT_PROCESS_LIST, 'utf8'));
  const opts = { encoding: 'utf8', timeout: 20000, windowsHide: true, maxBuffer: 64 * 1024 * 1024 };
  if (process.platform === 'win32') {
    const ps = 'Get-CimInstance Win32_Process | ForEach-Object { [pscustomobject]@{ pid = $_.ProcessId; ppid = $_.ParentProcessId; name = $_.Name; start = $(if ($_.CreationDate) { ([DateTimeOffset]$_.CreationDate).ToUnixTimeMilliseconds() } else { 0 }); cmd = $_.CommandLine } } | ConvertTo-Json -Compress';
    return JSON.parse(execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', ps], opts).replace(/^﻿/, ''));
  }
  const now = Date.now();
  return execFileSync('ps', ['-eo', 'pid=,ppid=,etimes=,comm=,args='], opts).split('\n').filter(Boolean).map((l) => {
    const [, pid, ppid, secs, name, cmd] = l.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s*(.*)$/) ?? [];
    return { pid: Number(pid), ppid: Number(ppid), name, start: now - Number(secs) * 1000, cmd };
  }).filter((p) => p.name);
}

// The stop hook's line, or null when nothing is left running
export function leftoverLine(now = Date.now()) {
  let found;
  try { found = leftovers(processes(), now); } catch (e) { return `the check for helpers' commands left running could not list the processes (${String(e.message).split('\n')[0]}): mend it (tools/leftovers.mjs)`; }
  if (!found.length) return null;
  const rows = found.map((p) => `  ${p.pid} ${p.name}, ${Math.round((now - p.start) / 60000)} min: ${(p.cmd || '').slice(0, 160)}`);
  return `commands running longer than ${LIMIT_MS / 60000} minutes under Claude Code (a command past its time limit goes on in the background, and outlives the helper that started it): stop each one no longer needed (PowerShell: Stop-Process -Id <id>), or wait for it:\n${rows.join('\n')}`;
}
