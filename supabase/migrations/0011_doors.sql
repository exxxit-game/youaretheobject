-- The doors to the results, on the owner's word of 13.10: doors now, encryption later (docs/owner-decisions.md).
-- 1. An explicit rejection policy on each of the 7 tables. Row level security is on and no table has a
--    policy, so the deny already holds ("If no policy exists for the table, a default-deny policy is
--    used", PostgreSQL 17, ddl-rowsecurity); Supabase's advisors ask to say it: "some users may enable
--    RLS with no policies intentionally to restrict access over APIs. In those cases we recommend making
--    that intent explicit with a rejection policy" (Supabase docs, database-advisors, lint 0008), in the
--    doc's own form (for select, using false). The owner postgres (live 12.10, docs/audit/revision-shelf2-server.md
--    A5) and the chat's read-only role (live 13.10) bypass row level security, and the functions run as
--    their owner, so the functions, the foreign keys and the cron jobs are unaffected.
-- 2. The key of the IP fingerprint replaced every day: one key since 10.10 made a fingerprint of today equal
--    one of next month; Plausible: "The salt is rotated and deleted every 24 hours" (plausible.io/data-policy,
--    docs/research/forums-data.md). A fingerprint lives 10 minutes (0009), so the job only makes those of
--    different days unlinkable, the daily backups' among them; a source's 5-minute count restarts at the change.
-- 3. The question for the average ("you and other players") gets the same cap as a result: anyone with the
--    game's public key could ask it without end, and every call reads app.runs (CodeRabbit on pull request 10,
--    13.10; docs/audit/revision-shelf2-server.md R2). A reveal asks once, so a class behind one address asks
--    about 30 times, as it sends 30 results (0009). The fingerprint it leaves is the one the owner decided
--    for bots (a keyed hash of the address, 10 minutes). The answer loses the histogram and the mean of
--    presses, as the shelf-2 fixes list asks: the game reads neither (src/rooms/01-control/reveal.js reads
--    n, control and zero), so they are not given out (docs/audit/revision-shelf2-fixes.md).
-- In one transaction: an error anywhere leaves the server as it was.

begin;

-- 1
create policy runs_none on app.runs for select using (false);
create policy playtests_none on app.playtests for select using (false);
create policy issues_none on app.issues for select using (false);
create policy limit_key_none on app.limit_key for select using (false);
create policy recent_none on app.recent for select using (false);
create policy room_schemas_none on app.room_schemas for select using (false);
create policy consent_versions_none on app.consent_versions for select using (false);

-- 2: daily at 00:00 GMT (pg_cron's clock: cron.timezone GMT, read live 13.10); and once now, so the key of 10.10 goes
select cron.schedule('new-limit-key', '0 0 * * *',
  $job$update app.limit_key set key = extensions.gen_random_bytes(32)$job$);
update app.limit_key set key = extensions.gen_random_bytes(32);

-- 3: a kind of its own for the cap, then the function; volatile now, since the cap writes app.recent
alter table app.recent drop constraint recent_kind_check;
alter table app.recent add constraint recent_kind_check check (kind in ('run', 'playtest', 'issue', 'compare'));

create or replace function public.compare_room(p_room text, p_version int)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  result jsonb := '{}'::jsonb;
  c text;
  n int;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  perform app.allow('compare', 30, 300);
  foreach c in array array['25-25', '75-75'] loop
    select count(*) into n from app.runs
      where room = p_room and version = p_version and first_run and report ->> 'condition' = c
        and report -> 'answers' ? 'control';
    if n < 10 then
      result := result || jsonb_build_object(c, jsonb_build_object('n', n));
    else
      result := result || jsonb_build_object(c, (
        select jsonb_build_object(
          'n', count(*),
          'control', round(avg((report -> 'answers' ->> 'control')::numeric), 1),
          'zero', round(100.0 * avg(case when (report -> 'answers' ->> 'control')::numeric = 0 then 1 else 0 end), 1))
        from app.runs
        where room = p_room and version = p_version and first_run and report ->> 'condition' = c
          and report -> 'answers' ? 'control'));
    end if;
  end loop;
  return result;
end;
$$;

revoke execute on function public.compare_room(text, int) from public, anon, authenticated;
grant execute on function public.compare_room(text, int) to anon;

-- self-test: every table of app has a policy, and the job is there
do $$
begin
  if exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
             where n.nspname = 'app' and c.relkind = 'r'
               and not exists (select 1 from pg_policies p where p.schemaname = 'app' and p.tablename = c.relname)) then
    raise exception 'self-test: a table of app has no policy';
  end if;
  if not exists (select 1 from cron.job where jobname = 'new-limit-key' and active) then
    raise exception 'self-test: the daily key job is missing';
  end if;
  if (select provolatile from pg_proc where oid = 'public.compare_room(text, int)'::regprocedure) <> 'v' then
    raise exception 'self-test: compare_room cannot write its cap';
  end if;
end;
$$;

-- recorded in the migration history as 0009 and 0010 were (the SQL editor bypasses it)
insert into supabase_migrations.schema_migrations (version, name)
values (to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISS'), '0011_doors');

notify pgrst, 'reload schema';

commit;
