-- Playtest feedback: what testers answer after a room and a few automatic
-- measures of the run (phase times, time looking away, finished or not).
-- Same design as app.runs: private schema, RLS on with no policies, one
-- insert-only entry point with a field whitelist, size cap and flood guard.
-- No personal data: no name, account, address or free text.

create table app.playtests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  room text not null check (room ~ '^[0-9]{2}-[a-z0-9-]{1,30}$'),
  version int not null check (version between 1 and 1000),
  report jsonb not null check (jsonb_typeof(report) = 'object' and pg_column_size(report) < 2048)
);
alter table app.playtests enable row level security;
revoke all on table app.playtests from public, anon, authenticated;
revoke all on sequence app.playtests_id_seq from public, anon, authenticated;
create index playtests_created_at_idx on app.playtests (created_at);

create or replace function public.submit_playtest(p_room text, p_version int, p_report jsonb)
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
  if (select count(*) from app.playtests where created_at > now() - interval '1 minute') >= 60 then
    raise exception 'busy';
  end if;
  insert into app.playtests (room, version, report) values (p_room, p_version, p_report);
end;
$$;

revoke execute on function public.submit_playtest(text, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_playtest(text, int, jsonb) to anon;
