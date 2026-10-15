-- Harden public.submit_run(): accept only the fields the game sends, with sane
-- number ranges and at most 2 KB, so a script with the public key cannot fill
-- the database or inject arbitrary data. Index for the flood-guard count.

create index if not exists runs_created_at_idx on app.runs (created_at);

alter table app.runs drop constraint if exists runs_report_check;
alter table app.runs add constraint runs_report_check
  check (jsonb_typeof(report) = 'object' and pg_column_size(report) < 2048);

create or replace function public.submit_run(p_room text, p_version int, p_first boolean, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['r1', 'r2', 'answer', 'repeats', 'looks', 'reaches', 'seated', 'prods', 'roundSecs'];
  round_keys constant text[] := array['pulls', 'per', 'pts', 'idle', 'best', 'looks', 'reaches', 'dur'];
  k text;
  r text;
begin
  if p_room is distinct from '01-ono' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 2048 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  foreach r in array array['r1', 'r2'] loop
    if p_report ? r and jsonb_typeof(p_report -> r) <> 'null' then
      if jsonb_typeof(p_report -> r) <> 'object' then raise exception 'bad %', r; end if;
      for k in select jsonb_object_keys(p_report -> r) loop
        if not (k = any (round_keys)) then raise exception 'unexpected field %.%', r, k; end if;
      end loop;
      if coalesce((p_report -> r ->> 'pulls')::numeric, 0) not between 0 and 5000
         or coalesce((p_report -> r ->> 'pts')::numeric, 0) not between 0 and 500 then
        raise exception 'out of range';
      end if;
    end if;
  end loop;
  if jsonb_typeof(p_report -> 'r1') <> 'object' then raise exception 'bad report'; end if;
  if (select count(*) from app.runs where created_at > now() - interval '1 minute') >= 120 then
    raise exception 'busy';
  end if;
  insert into app.runs (room, version, first_run, report) values (p_room, p_version, p_first, p_report);
end;
$$;

revoke execute on function public.submit_run(text, int, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.submit_run(text, int, boolean, jsonb) to anon;
