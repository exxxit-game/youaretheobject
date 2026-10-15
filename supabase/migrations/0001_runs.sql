-- Anonymous results of finished runs, for "you vs other players".
-- Design: the table lives in a private schema that the Data API does not expose.
-- The only way in from the browser is public.submit_run(), which validates the
-- input and can only INSERT. Nobody can read, change or delete rows through the API.

create schema if not exists app;
revoke all on schema app from public, anon, authenticated;

create table app.runs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  room text not null check (room ~ '^[0-9]{2}-[a-z0-9-]{1,30}$'),
  version int not null check (version between 1 and 1000),
  first_run boolean not null,
  report jsonb not null check (jsonb_typeof(report) = 'object' and pg_column_size(report) < 4096)
);
-- No policies on purpose: with RLS on and no policy, API roles see nothing.
alter table app.runs enable row level security;
revoke all on table app.runs from public, anon, authenticated;
revoke all on sequence app.runs_id_seq from public, anon, authenticated;

-- The single public entry point. No personal data is accepted: only room id,
-- room version, first/repeat flag and the analysis report (numbers).
create or replace function public.submit_run(p_room text, p_version int, p_first boolean, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_room is distinct from '01-ono' then
    raise exception 'unknown room';
  end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object'
     or jsonb_typeof(p_report -> 'r1') <> 'object' then
    raise exception 'bad report';
  end if;
  -- Flood guard: the whole game accepts at most 120 results per minute.
  if (select count(*) from app.runs where created_at > now() - interval '1 minute') >= 120 then
    raise exception 'busy';
  end if;
  insert into app.runs (room, version, first_run, report)
  values (p_room, p_version, p_first, p_report);
end;
$$;

revoke execute on function public.submit_run(text, int, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.submit_run(text, int, boolean, jsonb) to anon;
