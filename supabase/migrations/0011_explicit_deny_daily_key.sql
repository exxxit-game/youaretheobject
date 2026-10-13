-- The doors to the results, on the owner's word of 13.10: doors now, encryption later (docs/owner-decisions.md).
-- 1. An explicit rejection policy on each of the 7 tables. Row level security is on and no table has a
--    policy, so the deny already holds ("If no policy exists for the table, a default-deny policy is
--    used", PostgreSQL 17, ddl-rowsecurity); Supabase's advisors ask to say it: "some users may enable
--    RLS with no policies intentionally to restrict access over APIs. In those cases we recommend making
--    that intent explicit with a rejection policy" (Supabase docs, database-advisors, lint 0008), in the
--    doc's own form (for select, using false). The owner role and the read-only role bypass row level
--    security (live 13.10: rolbypassrls), so the functions, the foreign keys and the cron jobs are unaffected.
-- 2. The key of the IP fingerprint replaced every day: one key since 10.10 made a fingerprint of today equal
--    one of next month; Plausible: "The salt is rotated and deleted every 24 hours" (plausible.io/data-policy,
--    docs/research/forums-data.md). A fingerprint lives 10 minutes (0009), so the job only makes those of
--    different days unlinkable, the daily backups' among them; a source's 5-minute count restarts at the change.
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
end;
$$;

-- recorded in the migration history as 0009 and 0010 were (the SQL editor bypasses it)
insert into supabase_migrations.schema_migrations (version, name)
values (to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISS'), '0011_explicit_deny_daily_key');

commit;
