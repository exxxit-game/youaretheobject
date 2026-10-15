-- Game errors from players' devices (only with consent): what broke, where, on which
-- headset and browser. Same design as app.runs: private, insert-only, whitelist,
-- size cap, flood guard. Messages come from the game's own code, cut to 200 chars.

create table app.issues (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  room text not null check (room ~ '^[0-9]{2}-[a-z0-9-]{1,30}$'),
  version int not null check (version between 1 and 1000),
  report jsonb not null check (jsonb_typeof(report) = 'object' and pg_column_size(report) < 1024)
);
alter table app.issues enable row level security;
revoke all on table app.issues from public, anon, authenticated;
revoke all on sequence app.issues_id_seq from public, anon, authenticated;
create index issues_created_at_idx on app.issues (created_at);

create or replace function public.submit_issue(p_room text, p_version int, p_report jsonb)
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
  if (select count(*) from app.issues where created_at > now() - interval '1 minute') >= 60 then
    raise exception 'busy';
  end if;
  insert into app.issues (room, version, report) values (p_room, p_version, p_report);
end;
$$;

revoke execute on function public.submit_issue(text, int, jsonb) from public, anon, authenticated;
grant execute on function public.submit_issue(text, int, jsonb) to anon;
