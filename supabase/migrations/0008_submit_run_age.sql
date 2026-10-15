-- Room 01 asks two more things: the age group (6 groups + "prefer not to say") and a
-- fourth answer to "did you know this experiment" ("saw someone else play it").
-- The function is 0005 with only the answer limits changed.

create or replace function public.submit_run(p_room text, p_version int, p_first boolean, p_report jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  allowed constant text[] := array['condition', 'trials', 'presses', 'greens', 'greenIfPress', 'greenIfNoPress',
    'total', 'ifPress', 'ifNoPress', 'actualControl', 'successes', 'successesOfAll', 'confirming',
    'voided', 'strays', 'answers', 'errTotal', 'errIfPress', 'errIfNoPress', 'seated', 'speed'];
  counts constant text[] := array['trials', 'presses', 'greens', 'greenIfPress', 'greenIfNoPress', 'confirming', 'voided', 'strays'];
  percents constant text[] := array['total', 'ifPress', 'ifNoPress', 'successes', 'successesOfAll'];
  signed constant text[] := array['actualControl', 'errTotal', 'errIfPress', 'errIfNoPress'];
  answer_max constant jsonb := '{"control":100,"total":100,"ifPress":100,"ifNoPress":100,"certainty":100,"evidence":5,"hypotheses":1,"gender":2,"age":6,"knew":3}';
  k text;
  v jsonb;
begin
  if p_room is distinct from '01-control' then raise exception 'unknown room'; end if;
  if p_version is null or p_version < 1 or p_version > 1000 then raise exception 'bad version'; end if;
  if p_first is null then raise exception 'bad first'; end if;
  if p_report is null or jsonb_typeof(p_report) <> 'object' or pg_column_size(p_report) >= 2048 then
    raise exception 'bad report';
  end if;
  for k in select jsonb_object_keys(p_report) loop
    if not (k = any (allowed)) then raise exception 'unexpected field %', k; end if;
  end loop;
  if (p_report ->> 'condition') is null or not ((p_report ->> 'condition') = any (array['25-25', '75-75'])) then
    raise exception 'bad condition';
  end if;
  if coalesce((p_report ->> 'speed')::numeric, 0) <> 1 then raise exception 'test runs are not stored'; end if;
  if p_report ? 'seated' and jsonb_typeof(p_report -> 'seated') <> 'boolean' then raise exception 'bad seated'; end if;
  foreach k in array counts loop
    v := p_report -> k;
    if v is not null and (jsonb_typeof(v) <> 'number' or (v #>> '{}')::numeric not between 0 and 1000) then
      raise exception 'bad %', k;
    end if;
  end loop;
  foreach k in array percents loop
    v := p_report -> k;
    if v is not null and jsonb_typeof(v) <> 'null'
       and (jsonb_typeof(v) <> 'number' or (v #>> '{}')::numeric not between 0 and 100) then
      raise exception 'bad %', k;
    end if;
  end loop;
  foreach k in array signed loop
    v := p_report -> k;
    if v is not null and jsonb_typeof(v) <> 'null'
       and (jsonb_typeof(v) <> 'number' or (v #>> '{}')::numeric not between -100 and 100) then
      raise exception 'bad %', k;
    end if;
  end loop;
  if p_report ? 'answers' then
    if jsonb_typeof(p_report -> 'answers') <> 'object' then raise exception 'bad answers'; end if;
    for k in select jsonb_object_keys(p_report -> 'answers') loop
      if not (answer_max ? k) then raise exception 'unexpected answer %', k; end if;
      v := p_report -> 'answers' -> k;
      if jsonb_typeof(v) <> 'number' or (v #>> '{}')::numeric not between 0 and (answer_max ->> k)::numeric then
        raise exception 'bad answer %', k;
      end if;
    end loop;
  end if;
  if (select count(*) from app.runs where created_at > now() - interval '1 minute') >= 120 then
    raise exception 'busy';
  end if;
  insert into app.runs (room, version, first_run, report) values (p_room, p_version, p_first, p_report);
end;
$$;

revoke execute on function public.submit_run(text, int, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.submit_run(text, int, boolean, jsonb) to anon;
