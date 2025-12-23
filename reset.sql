-- 1️⃣ Disable RLS only on your tables
do $$
declare
  r record;
begin
  for r in (
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tableowner = current_user
  ) loop
    execute format('alter table public.%I disable row level security', r.tablename);
  end loop;
end $$;

-- 2️⃣ Drop only triggers you own
do $$
declare
  r record;
begin
  for r in (
    select trigger_name, event_object_table
    from information_schema.triggers
    where trigger_schema = 'public'
      and (select tableowner from pg_tables where tablename = event_object_table) = current_user
  ) loop
    execute format(
      'drop trigger if exists %I on public.%I cascade',
      r.trigger_name,
      r.event_object_table
    );
  end loop;
end $$;

-- Drop only functions owned by current_user
do $$
declare
  r record;
begin
  for r in (
    select p.oid::regprocedure as func_name
    from pg_proc p
    join pg_namespace n on p.pronamespace = n.oid
    where n.nspname = 'public'
      and pg_catalog.pg_get_userbyid(p.proowner) = current_user
  ) loop
    execute format('drop function if exists %s cascade', r.func_name);
  end loop;
end $$;

-- 4️⃣ Drop only tables you own
do $$
declare
  r record;
begin
  for r in (
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tableowner = current_user
  ) loop
    execute format('drop table if exists public.%I cascade', r.tablename);
  end loop;
end $$;

-- 5️⃣ Drop only sequences you own
do $$
declare
  r record;
begin
  for r in (
    select c.relname as seq_name
    from pg_class c
    join pg_namespace n on c.relnamespace = n.oid
    where c.relkind = 'S'               -- only sequences
      and n.nspname = 'public'         -- public schema
      and pg_get_userbyid(c.relowner) = current_user  -- owned by current user
  ) loop
    execute format('drop sequence if exists public.%I cascade', r.seq_name);
  end loop;
end $$;
