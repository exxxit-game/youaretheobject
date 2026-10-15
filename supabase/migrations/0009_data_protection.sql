-- The data revision as one whole (docs/research/revision-2-data.md; docs/owner-decisions.md: "one
-- migration of the live database now"), in one transaction: an error anywhere leaves the server as it was.
-- 1. A row keeps the date only and a random key. A time to the microsecond and an increasing id let
--    a row be matched to an IP in the provider's logs, kept 7 days (revision-2-data.md, L5).
-- 2. Every row names the consent text it was given under: the controller "shall be able to demonstrate
--    that the data subject has consented" (GDPR Art 7(1); D1). Rows from before carry 0: unknown.
-- 3. A room's report is checked against its JSON Schema, one per room version (pg_jsonschema; D5): the
--    same file the game's test reads (supabase/schemas/01-control-1.json), so a room's checks are data,
--    and a new room cannot break another's.
-- 4. Floods are limited per source, as Supabase's own example does ("Securing your API": 100 writes in
--    5 minutes from one IP), but without the IP: a hash of it under a secret key, forgotten after 10
--    minutes (D6). Per source and kind the cap is a real player's need, so one script cannot take the
--    whole game's cap from everyone; the game-wide caps per minute stay, raised above one source's reach.
-- What it does not hide: rows are only added, so a row's place in its table and its transaction number
-- still show which came first (Postgres, "System Columns": xmin). With the provider's logs, kept 7 days,
-- a row can therefore still be linked to an IP for those days; privacy.html says so.

begin;

create extension if not exists pg_jsonschema with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- 1 and 2: the three tables (the old id's sequence and the created_at indexes go with their columns)
alter table app.runs add column created_on date;
update app.runs set created_on = (created_at at time zone 'utc')::date;
alter table app.runs alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.runs drop column created_at;
alter table app.runs drop column id;
alter table app.runs add column id uuid not null default gen_random_uuid() primary key;
alter table app.runs add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.runs alter column consent drop default;

alter table app.playtests add column created_on date;
update app.playtests set created_on = (created_at at time zone 'utc')::date;
alter table app.playtests alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.playtests drop column created_at;
alter table app.playtests drop column id;
alter table app.playtests add column id uuid not null default gen_random_uuid() primary key;
alter table app.playtests add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.playtests alter column consent drop default;

alter table app.issues add column created_on date;
update app.issues set created_on = (created_at at time zone 'utc')::date;
alter table app.issues alter column created_on set not null,
  alter column created_on set default (now() at time zone 'utc')::date;
alter table app.issues drop column created_at;
alter table app.issues drop column id;
alter table app.issues add column id uuid not null default gen_random_uuid() primary key;
alter table app.issues add column consent smallint not null default 0 check (consent between 0 and 1000);
alter table app.issues alter column consent drop default;

-- 3: one schema per room version
create table app.room_schemas (
  room text not null check (room ~ '^[0-9]{2}-[a-z0-9-]{1,30}$'),
  version int not null check (version between 1 and 1000),
  schema json not null,
  primary key (room, version)
);
alter table app.room_schemas enable row level security;
revoke all on table app.room_schemas from public, anon, authenticated;

insert into app.room_schemas (room, version, schema) values ('01-control', 1, $json$
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$comment": "Room 01 (illusion of control), version 1: the report of a finished run (src/rooms/01-control/report.js, room.js). The server checks every report against it (supabase/migrations/0009_data_protection.sql); tests/results.test.mjs checks the game against it.",
  "type": "object",
  "additionalProperties": false,
  "required": ["condition", "speed"],
  "properties": {
    "condition": { "enum": ["25-25", "75-75"] },
    "speed": { "const": 1 },
    "seated": { "type": "boolean" },
    "trials": { "type": "number", "minimum": 0, "maximum": 1000 },
    "presses": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greens": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greenIfPress": { "type": "number", "minimum": 0, "maximum": 1000 },
    "greenIfNoPress": { "type": "number", "minimum": 0, "maximum": 1000 },
    "confirming": { "type": "number", "minimum": 0, "maximum": 1000 },
    "voided": { "type": "number", "minimum": 0, "maximum": 1000 },
    "strays": { "type": "number", "minimum": 0, "maximum": 1000 },
    "total": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "ifPress": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "ifNoPress": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "successes": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "successesOfAll": { "type": ["number", "null"], "minimum": 0, "maximum": 100 },
    "actualControl": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errTotal": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errIfPress": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "errIfNoPress": { "type": ["number", "null"], "minimum": -100, "maximum": 100 },
    "answers": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "control": { "type": "number", "minimum": 0, "maximum": 100 },
        "total": { "type": "number", "minimum": 0, "maximum": 100 },
        "ifPress": { "type": "number", "minimum": 0, "maximum": 100 },
        "ifNoPress": { "type": "number", "minimum": 0, "maximum": 100 },
        "certainty": { "type": "number", "minimum": 0, "maximum": 100 },
        "evidence": { "type": "number", "minimum": 0, "maximum": 5 },
        "hypotheses": { "type": "number", "minimum": 0, "maximum": 1 },
        "gender": { "type": "number", "minimum": 0, "maximum": 2 },
        "age": { "type": "number", "minimum": 0, "maximum": 6 },
        "knew": { "type": "number", "minimum": 0, "maximum": 3 }
      }
    }
  }
}
$json$);

-- 4: who sent lately, as a keyed hash only, for 10 minutes. One key, one row: without it every hash
-- would be null and every result refused.
create table app.limit_key (one boolean primary key default true check (one), key bytea not null);
insert into app.limit_key (key) values (extensions.gen_random_bytes(32));
alter table app.limit_key enable row level security;
revoke all on table app.limit_key from public, anon, authenticated;

create table app.recent (
  id uuid primary key default gen_random_uuid(),
  source bytea not null,
  kind text not null check (kind in ('run', 'playtest', 'issue')),
  trusted boolean not null,
  at timestamptz not null default now()
);
create index recent_source_at_idx on app.recent (source, kind, at);
create index recent_at_idx on app.recent (at);
alter table app.recent enable row level security;
revoke all on table app.recent from public, anon, authenticated;

-- forgotten by every call and, when nobody calls, by a job every minute, which waits for the same lock
-- as the calls (two deletes of the same rows in another order could deadlock and lose a result); the
-- jobs' own log is kept a week (Supabase Cron: cron.job_run_details grows by a row a run)
select cron.schedule('forget-recent-sources', '* * * * *',
  $job$select pg_advisory_xact_lock(hashtext('app.allow')); delete from app.recent where at < now() - interval '10 minutes'$job$);
select cron.schedule('forget-cron-runs', '17 3 * * *',
  $job$delete from cron.job_run_details where end_time < now() - interval '7 days'$job$);

-- Called by the submit functions (their owner runs it): busy when this source sent p_source of this kind
-- in 5 minutes, or the game received p_global of this kind in the last minute. The client's address is
-- Cloudflare's CF-Connecting-IP (Cloudflare sets it, a client cannot). X-Forwarded-For is not read: its
-- first entry is whatever the client wrote. Whether CF-Connecting-IP reaches the database is not yet
-- seen, so a call without it is not refused (that would lose every result) but shares one source with
-- all such calls, and app.recent.trusted shows whether it came. Calls wait in turn, so ones arriving
-- together cannot pass a cap at once.
create function app.allow(p_kind text, p_source int, p_global int)
returns void
language plpgsql
set search_path = ''
as $$
declare
  headers json := nullif(current_setting('request.headers', true), '')::json;
  ip text := nullif(trim(headers ->> 'cf-connecting-ip'), '');
  src bytea;
begin
  perform pg_advisory_xact_lock(hashtext('app.allow'));
  delete from app.recent where at < now() - interval '10 minutes';
  select extensions.hmac(convert_to(coalesce(ip, ''), 'UTF8'), key, 'sha256') into src from app.limit_key;
  if (select count(*) from app.recent where source = src and kind = p_kind and at > now() - interval '5 minutes') >= p_source
     or (select count(*) from app.recent where kind = p_kind and at > now() - interval '1 minute') >= p_global then
    raise exception 'busy';
  end if;
  insert into app.recent (source, kind, trusted) values (src, p_kind, ip is not null);
end;
$$;
revoke execute on function app.allow(text, int, int) from public, anon, authenticated;

-- The caps. A room takes minutes, so one player sends a result rarely; a class behind one address (the
-- education licences, docs/owner-decisions.md) sends about 30 at once. Errors: at most 5 a page load
-- (src/app/session.js), so 60 covers a class. The game-wide caps are ten one-source bursts.

-- The entry points, each now with the consent version. The old ones go: they wrote the old columns.
drop function public.submit_run(text, int, boolean, jsonb);
drop function public.submit_playtest(text, int, jsonb);
drop function public.submit_issue(text, int, jsonb);

create function public.submit_run(p_room text, p_version int, p_first boolean, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  s json;
begin
  select schema into s from app.room_schemas where room = p_room and version = p_version;
  if s is null then raise exception 'unknown room'; end if;
  if p_first is null then raise exception 'bad first'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or pg_column_size(p_report) >= 2048 or not extensions.jsonb_matches_schema(s, p_report) then
    raise exception 'bad report';
  end if;
  perform app.allow('run', 30, 300);
  insert into app.runs (room, version, first_run, consent, report) values (p_room, p_version, p_first, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_run(text, int, boolean, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_run(text, int, boolean, int, jsonb) to anon;

-- 0004's checks, unchanged
create function public.submit_playtest(p_room text, p_version int, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['finished', 'secs', 'away', 'presses', 'voided', 'seated', 'device',
                                   'next', 'boring', 'guessed', 'trouble', 'psych'];
  phases constant text[] := array['intro', 'run', 'questions', 'reveal'];
  devices constant text[] := array['quest2', 'quest3', 'quest3s', 'questpro', 'desktop', 'other'];
  k text;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 2048 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  if jsonb_typeof(p_report -> 'finished') is distinct from 'boolean' then raise exception 'bad finished'; end if;
  if p_report ? 'seated' and jsonb_typeof(p_report -> 'seated') <> 'boolean' then raise exception 'bad seated'; end if;
  if p_report ? 'device' and not ((p_report ->> 'device') = any (devices)) then raise exception 'bad device'; end if;
  if p_report ? 'secs' then
    if jsonb_typeof(p_report -> 'secs') <> 'object' then raise exception 'bad secs'; end if;
    for k in select jsonb_object_keys(p_report -> 'secs') loop
      if not (k = any (phases)) then raise exception 'unexpected phase %', k; end if;
      if jsonb_typeof(p_report -> 'secs' -> k) <> 'number'
         or (p_report -> 'secs' ->> k)::numeric not between 0 and 7200 then
        raise exception 'bad phase time %', k;
      end if;
    end loop;
  end if;
  -- small whole numbers in fixed ranges
  if coalesce((p_report ->> 'away')::numeric, 0) not between 0 and 7200
     or coalesce((p_report ->> 'presses')::numeric, 0) not between 0 and 1000
     or coalesce((p_report ->> 'voided')::numeric, 0) not between 0 and 1000
     or coalesce((p_report ->> 'next')::numeric, 0) not between 0 and 10
     or coalesce((p_report ->> 'boring')::numeric, 0) not between 0 and 4
     or coalesce((p_report ->> 'guessed')::numeric, 0) not between 0 and 2
     or coalesce((p_report ->> 'trouble')::numeric, 0) not between 0 and 4
     or coalesce((p_report ->> 'psych')::numeric, 0) not between 0 and 2 then
    raise exception 'out of range';
  end if;
  perform app.allow('playtest', 30, 300);
  insert into app.playtests (room, version, consent, report) values (p_room, p_version, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_playtest(text, int, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_playtest(text, int, int, jsonb) to anon;

-- 0007's checks, unchanged
create function public.submit_issue(p_room text, p_version int, p_consent int, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['kind', 'message', 'file', 'line', 'device', 'browser', 'state', 'xr'];
  kinds constant text[] := array['error', 'rejection'];
  devices constant text[] := array['quest2', 'quest3', 'quest3s', 'questpro', 'desktop', 'other'];
  states constant text[] := array['idle', 'intro', 'run', 'questions', 'done'];
  k text;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_consent is null or p_consent not between 1 and 1000 then raise exception 'bad consent'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 1024 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  if not ((p_report ->> 'kind') = any (kinds)) then raise exception 'bad kind'; end if;
  if p_report ? 'device' and not ((p_report ->> 'device') = any (devices)) then raise exception 'bad device'; end if;
  if p_report ? 'state' and not ((p_report ->> 'state') = any (states)) then raise exception 'bad state'; end if;
  if p_report ? 'xr' and not ((p_report ->> 'xr') = any (array['vr', 'none'])) then raise exception 'bad xr'; end if;
  if length(coalesce(p_report ->> 'message', '')) > 200 or length(coalesce(p_report ->> 'file', '')) > 60
     or length(coalesce(p_report ->> 'browser', '')) > 40 then
    raise exception 'too long';
  end if;
  if p_report ? 'line' and (jsonb_typeof(p_report -> 'line') <> 'number'
     or (p_report ->> 'line')::numeric not between 0 and 100000) then
    raise exception 'bad line';
  end if;
  perform app.allow('issue', 60, 600);
  insert into app.issues (room, version, consent, report) values (p_room, p_version, p_consent, p_report);
end;
$$;
revoke execute on function public.submit_issue(text, int, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_issue(text, int, int, jsonb) to anon;

-- The server's own schema check must agree with the game's test (tests/sql.mjs reads the same file): a
-- full report passes; a test run, an unknown field, an answer past its last choice, a report without its
-- condition and a count left empty fail. If they disagree, the whole migration is undone.
do $$
declare
  s json := (select schema from app.room_schemas where room = '01-control' and version = 1);
  good jsonb := '{"condition": "75-75", "speed": 1, "seated": true, "trials": 40, "presses": 20, "greens": 30,
    "greenIfPress": 15, "greenIfNoPress": 15, "confirming": 10, "voided": 3, "strays": 1, "total": 75, "ifPress": 75,
    "ifNoPress": null, "successes": 50, "successesOfAll": 40, "actualControl": 0, "errTotal": null, "errIfPress": -5,
    "errIfNoPress": 100, "answers": {"control": 100, "total": 0, "ifPress": 50, "ifNoPress": 50, "certainty": 100,
    "evidence": 5, "hypotheses": 1, "gender": 2, "age": 6, "knew": 3}}';
begin
  if not extensions.jsonb_matches_schema(s, good) then raise exception 'self-test: a full report is refused'; end if;
  if extensions.jsonb_matches_schema(s, good || '{"speed": 20}')
     or extensions.jsonb_matches_schema(s, good || '{"name": "x"}')
     or extensions.jsonb_matches_schema(s, jsonb_set(good, '{answers,age}', '7'))
     or extensions.jsonb_matches_schema(s, good - 'condition')
     or extensions.jsonb_matches_schema(s, jsonb_set(good, '{trials}', 'null')) then
    raise exception 'self-test: a bad report is accepted';
  end if;
end;
$$;

-- A file run in the SQL editor is not recorded in the migration history (Supabase, "Database migrations":
-- the editor "bypasses the migration history"): recorded here as the earlier ones are, so the dashboard's
-- list and a later drift check see it.
insert into supabase_migrations.schema_migrations (version, name)
values (to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISS'), '0009_data_protection');

notify pgrst, 'reload schema';

commit;
