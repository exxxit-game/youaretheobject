-- "You vs other players": averages of first runs of room 01, per condition. Returns
-- only aggregates (counts, means, a 0–100 histogram of the control rating), never a
-- row. Means are given only when at least 10 players are in the condition, so a
-- single early answer cannot be read back. Name avoids "stats": ad blockers block it.

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
      where room = p_room and version = p_version and first_run and report ->> 'condition' = c;
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
