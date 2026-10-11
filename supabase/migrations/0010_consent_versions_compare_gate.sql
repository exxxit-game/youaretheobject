-- Two remarks of the outside reviewer (CodeRabbit, pull request 10), on the owner's word of 11.10.
-- 1. A row names only a consent text that exists: the entry points took any version from 1 to 1000
--    while one consent text exists, so a row could claim words no player was shown (GDPR Art 7(1): the
--    controller "shall be able to demonstrate that the data subject has consented"; D1). The known
--    versions are a table, and every row's version must be in it: a new consent text adds its row in
--    the migration that ships it, as CONSENT_VERSION rises in src/app/consent.js (tests/results.test.mjs).
--    Version 0 is "unknown": the rows from before migration 0009.
-- 2. "You vs other players" shows a mean only when at least 10 players stand behind it: the gate counted
--    every first run of the condition while the mean takes only the runs that hold the control answer,
--    so nine runs without it and one with it showed one person's answer as everyone's mean. The gate
--    now counts the runs the mean is made of.
-- In one transaction: an error anywhere leaves the server as it was.

begin;

-- 1: the consent texts that exist
create table app.consent_versions (
  version smallint primary key check (version between 0 and 1000),
  what text not null
);
revoke all on table app.consent_versions from public, anon, authenticated;
insert into app.consent_versions (version, what) values
  (0, 'unknown: rows from before migration 0009'),
  (1, 'the consent of src/app/texts.ru.js, version 1 (CONSENT_VERSION = 1)');

alter table app.runs add constraint runs_consent_known foreign key (consent) references app.consent_versions (version);
alter table app.playtests add constraint playtests_consent_known foreign key (consent) references app.consent_versions (version);
alter table app.issues add constraint issues_consent_known foreign key (consent) references app.consent_versions (version);

-- 2: the gate counts the runs the statistics use
create or replace function public.compare_room(p_room text, p_version int)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb := '{}'::jsonb;
  c text;
  n int;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
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
          'zero', round(100.0 * avg(case when (report -> 'answers' ->> 'control')::numeric = 0 then 1 else 0 end), 1),
          'presses', round(avg((report ->> 'presses')::numeric), 1),
          'hist', (select jsonb_agg(coalesce(h.k, 0) order by b.bin)
                   from generate_series(0, 10) as b(bin)
                   left join (select least(((r2.report -> 'answers' ->> 'control')::numeric / 10)::int, 10) as bin, count(*) as k
                              from app.runs r2
                              where r2.room = p_room and r2.version = p_version and r2.first_run
                                and r2.report ->> 'condition' = c and r2.report -> 'answers' ? 'control'
                              group by 1) h on h.bin = b.bin))
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

-- Self-test: an unknown consent version is refused by the tables themselves. If it is not, the whole
-- migration is undone.
do $$
begin
  begin
    insert into app.issues (room, version, consent, report) values ('01-control', 1, 2, '{}'::jsonb);
    raise exception 'self-test: a row with an unknown consent version was taken';
  exception when foreign_key_violation then null;
  end;
end;
$$;

-- recorded in the migration history as 0009 was (the SQL editor bypasses it)
insert into supabase_migrations.schema_migrations (version, name)
values (to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISS'), '0010_consent_versions_compare_gate');

notify pgrst, 'reload schema';

commit;
