// Adapt the existing tool policy to Codex; actual callbacks, not imports, establish activation.
// Wire format: https://learn.chatgpt.com/docs/hooks#pretooluse .
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { refusal } from './claude-guard.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SETTINGS = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude/settings.json'), 'utf8'));
const inside = (root, candidate) => {
  if (typeof candidate !== 'string' || !path.isAbsolute(candidate)) return false;
  try {
    const rel = path.relative(fs.realpathSync.native(root), fs.realpathSync.native(candidate));
    return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
  } catch { return false; }
};
const glob = pattern => new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*') + '$');
const denied = reason => ({ hookSpecificOutput: { hookEventName: 'PreToolUse',
  permissionDecision: 'deny', permissionDecisionReason: reason } });

export function checkTool(event, { root = ROOT, cwd = process.cwd(), settings = SETTINGS } = {}) {
  if (!inside(root, cwd) || !inside(root, event?.cwd)) return {};
  if (event.hook_event_name !== 'PreToolUse') return {};
  const name = event.tool_name, input = event.tool_input;
  if (typeof name !== 'string' || !input || typeof input !== 'object') return denied('Invalid tool policy input');
  const aliases = [name, name.replace(/^mcp__codex_apps__github_/, 'mcp__github__')];
  if (name === 'mcp__codex_apps__github_update_file') aliases.push('mcp__github__create_or_update_file');
  if (name === 'mcp__codex_apps__github_enable_auto_merge') aliases.push('mcp__github__merge_pull_request');
  for (const pattern of settings.permissions?.deny || []) {
    if (pattern.startsWith('mcp__') && aliases.some(alias => glob(pattern).test(alias)))
      return denied('Existing project tool restriction: ' + pattern);
  }
  if (['Bash', 'PowerShell', 'exec_command'].includes(name)) {
    const command = input.command ?? input.cmd;
    if (typeof command !== 'string') return denied('Shell policy requires the actual command');
    const inLibrary = /[\\/]objekt-files(?:[\\/]|$)/i.test(input.workdir || event.cwd);
    // Unified exec reports Bash even when the host shell is PowerShell.
    const why = refusal(command, false, inLibrary) || refusal(command, true, inLibrary);
    if (why) return denied('Project policy: this command ' + why);
  }
  if (['apply_patch', 'Edit', 'Write'].includes(name)) {
    const targets = typeof input.command === 'string'
      ? [...input.command.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)].map(m => m[1])
      : [input.file_path || input.notebook_path || ''];
    if (targets.some(target => /practice-reviews|owner-messages|OBJECT_REVIEW_RECORD/i.test(target)))
      return denied('Only lifecycle callbacks may write review and owner journals');
  }
  return {};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let result;
  try {
    let text = '';
    for await (const part of process.stdin) {
      text += part; if (text.length > 4000000) throw Error('Tool event too large');
    }
    const event = JSON.parse(text);
    result = checkTool(event);

  } catch (error) { result = denied('Tool policy could not validate input: ' + error.message); }
  console.log(JSON.stringify(result));
}
