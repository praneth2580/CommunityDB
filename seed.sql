create or replace function public.bootstrap_existing_auth_user(
  p_email text,
  p_full_name text,
  p_role text default 'super_admin'
)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_person_id uuid;
begin
  -- 🔍 Find auth user
  select id
  into v_user_id
  from auth.users
  where lower(email) = lower(p_email);

  if v_user_id is null then
    raise exception 'Auth user with email % not found', p_email;
  end if;

  -- 🚫 Prevent duplicate bootstrap
  if exists (select 1 from public.admins where user_id = v_user_id) then
    raise exception 'Admin already exists for this user';
  end if;

  -- 👤 Create people FIRST (email is mandatory)
  insert into public.people (
    user_id,
    full_name,
    email
  )
  values (
    v_user_id,
    p_full_name,
    lower(p_email)
  )
  returning id into v_person_id;

  -- 🛡️ Now create admin (trigger will pass)
  insert into public.admins (
    user_id,
    person_id,
    role
  )
  values (
    v_user_id,
    v_person_id,
    p_role
  );

end;
$$;


select public.bootstrap_existing_auth_user(
  'praneth.v.poojary25800@gmail.com',
  'Praneth V Pujari',
  'super_admin'
);
