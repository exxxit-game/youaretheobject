// What the server accepts, read from supabase/migrations for the tests that pin the game to it: a
// mismatch between what the game sends and what the server takes loses every result without a word.
import fs from 'node:fs';

const DIR = new URL('../supabase/migrations/', import.meta.url);
const files = () => fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();

// The newest definition of public.<name>: its text from "create" to the end of its body.
export function definition(name) {
  const start = new RegExp(`create (or replace )?function public\\.${name}\\(`);
  for (const f of files().reverse()) {
    const sql = fs.readFileSync(new URL(f, DIR), 'utf8'), m = sql.match(start);
    if (!m) continue;
    const open = sql.indexOf('$$', m.index), close = sql.indexOf('$$', open + 2);
    return { file: f, text: sql.slice(m.index, close + 2) };
  }
  throw new Error(`no migration defines public.${name}`);
}

// its parameters' names, in order
export const params = (def) => [...def.text.match(/\(([^)]*)\)/)[1].matchAll(/\b(p_\w+)/g)].map((m) => m[1]);

// a "<name> constant text[] := array[...]" list inside it
export const list = (def, name) => [...def.text.match(new RegExp(`${name} constant text\\[\\] := array\\[([^\\]]+)\\]`))[1]
  .matchAll(/'([^']+)'/g)].map((m) => m[1]);

// The JSON Schema the newest migration loads for a room version (app.room_schemas).
export function roomSchema(room, version) {
  const row = new RegExp(`values \\('${room}', ${version}, \\$json\\$([\\s\\S]*?)\\$json\\$\\)`);
  for (const f of files().reverse()) {
    const m = fs.readFileSync(new URL(f, DIR), 'utf8').match(row);
    if (m) return { file: f, schema: JSON.parse(m[1]) };
  }
  throw new Error(`no migration loads a schema for ${room} version ${version}`);
}

// The consent versions the server knows (app.consent_versions): every version any migration adds.
export function consentVersions() {
  const known = new Set();
  for (const f of files()) {
    const m = fs.readFileSync(new URL(f, DIR), 'utf8').match(/insert into app\.consent_versions \(version, what\) values([\s\S]*?);/);
    if (m) for (const [, v] of m[1].matchAll(/\(\s*(\d+)\s*,/g)) known.add(Number(v));
  }
  return known;
}

// Enough of JSON Schema (draft 7) for the keywords our room schemas use; anything else is refused, so a
// schema cannot quietly mean more on the server than here. Returns the list of what breaks it.
const KNOWN = new Set(['$schema', '$comment', 'type', 'enum', 'const', 'minimum', 'maximum', 'required', 'properties', 'additionalProperties']);
const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
export function check(schema, value, at = 'report') {
  const bad = [];
  for (const k of Object.keys(schema)) if (!KNOWN.has(k)) bad.push(`${at}: the schema uses ${k}, which this check does not know`);
  if (schema.type && ![].concat(schema.type).includes(typeOf(value))) bad.push(`${at}: ${typeOf(value)}, not ${schema.type}`);
  if (schema.enum && !schema.enum.includes(value)) bad.push(`${at}: ${value} is not one of ${schema.enum}`);
  if ('const' in schema && value !== schema.const) bad.push(`${at}: ${value} is not ${schema.const}`);
  if (typeof value === 'number') {
    if ('minimum' in schema && value < schema.minimum) bad.push(`${at}: ${value} under ${schema.minimum}`);
    if ('maximum' in schema && value > schema.maximum) bad.push(`${at}: ${value} over ${schema.maximum}`);
  }
  if (typeOf(value) === 'object') {
    for (const k of schema.required || []) if (!(k in value)) bad.push(`${at}: ${k} missing`);
    for (const [k, v] of Object.entries(value)) {
      if (schema.properties && k in schema.properties) bad.push(...check(schema.properties[k], v, `${at}.${k}`));
      else if (schema.additionalProperties === false) bad.push(`${at}: ${k} is not accepted`);
    }
  }
  return bad;
}
