create extension if not exists "uuid-ossp";
create extension if not exists "postgis";

-- PEOPLE TABLE
create table public.people (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,

  full_name text not null,
  first_name text,
  middle_name text,
  last_name text,

  email text unique,
  phone text,

  address_line text,
  locality_area text,
  geo_location geography(POINT),

  blood_group text check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  is_blood_donor boolean default false,
  last_donation_date date,

  is_volunteer boolean default false,
  skills text[],
  availability jsonb default '{}'::jsonb,

  marital_status text check (marital_status in ('single','married','divorced','widowed','separated')),
  children_count int,
  children_ids uuid[],

  is_blocked boolean default false,
  blocked_at timestamptz,
  blocked_by uuid references auth.users(id),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index people_user_id_idx on public.people(user_id);
create index people_geo_idx on public.people using gist (geo_location);

-- ADMINS TABLE
create table public.admins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,
  person_id uuid unique references public.people(id) on delete cascade,

  role text not null check (role in ('super_admin','admin','volunteer')),
  department text,

  created_at timestamptz default now()
);

-- FETCH LOGGED IN USER ROLE
create or replace function public.get_user_role()
returns text
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare r text;
begin
  select role into r
  from public.admins
  where user_id = auth.uid()
  limit 1;

  return r;
end;
$$;

-- CHECK IF THE CURRENT USER IS NOT BLOCKED
create or replace function public.is_not_blocked()
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.people
    where user_id = auth.uid()
      and (is_blocked = false or is_blocked is null)
  );
end;
$$;

-- PROMOTE TO ADMIN
create or replace function public.promote_to_admin(
  target_person_id uuid,
  target_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.get_user_role() <> 'super_admin' then
    raise exception 'Unauthorized';
  end if;

  insert into public.admins (user_id, person_id, role)
  select user_id, id, target_role
  from public.people
  where id = target_person_id;
end;
$$;

-- EVENTS TABLE
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,

  type text check (type in ('donation_drive','cleanup','emergency','workshop','other')),
  status text check (status in ('draft','active','completed','cancelled')) default 'draft',

  location_name text,
  location_coordinates geography(POINT),

  organizer_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- EVENT PARTICIPANTS TABLE
create table public.event_participants (
  event_id uuid references public.events(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,

  role text check (role in ('volunteer','donor','organizer','attendee')),
  status text check (status in ('registered','confirmed','attended','noshow')) default 'registered',

  primary key (event_id, person_id)
);

-- RESOURCES TABLE
create table public.resources (
  id uuid primary key default uuid_generate_v4(),
  donor_id uuid references public.people(id),
  event_id uuid references public.events(id),

  type text check (type in ('money','blood','food','kits','other')),
  quantity numeric not null,
  unit text not null,

  status text check (status in ('pledged','collected','distributed')) default 'collected',
  collected_at timestamptz default now()
);

-- ASSISTANCE REQUESTS TABLE
create table public.assistance_requests (
  id uuid primary key default uuid_generate_v4(),
  requestor_id uuid references public.people(id),
  assigned_volunteer_id uuid references public.people(id),

  type text check (type in ('blood','financial','food','medical','transport','other')),
  urgency text check (urgency in ('low','medium','high','critical')) default 'medium',
  status text check (status in ('open','in_progress','resolved','rejected','cancelled')) default 'open',

  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ASSISTANCE REQUESTS TABLE
create table public.assistance_requests (
  id uuid primary key default uuid_generate_v4(),
  requestor_id uuid references public.people(id),
  assigned_volunteer_id uuid references public.people(id),

  type text check (type in ('blood','financial','food','medical','transport','other')),
  urgency text check (urgency in ('low','medium','high','critical')) default 'medium',
  status text check (status in ('open','in_progress','resolved','rejected','cancelled')) default 'open',

  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PARTNERS TABLE
create table public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  logo text,
  website text,

  is_displayed boolean default true,
  created_at timestamptz default now()
);

-- SOCIAL POSTS TABLE
create table public.social_posts (
  id uuid primary key default uuid_generate_v4(),
  platform text check (platform in ('twitter','instagram','facebook','linkedin')),
  author_name text,
  content text,
  image_url text,
  post_url text,

  is_featured boolean default true,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.people enable row level security;
alter table public.admins enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.resources enable row level security;
alter table public.assistance_requests enable row level security;
alter table public.partners enable row level security;
alter table public.social_posts enable row level security;


-- PEOPLE TABLE POLICIES
create policy "Users view people"
on public.people for select
to authenticated
using (true);

-- Anyone with a role (admin/volunteer) can add new people (user_id can be null for non-users)
create policy "Admins create people"
on public.people for insert
to authenticated
with check (
  public.get_user_role() in ('super_admin', 'admin', 'volunteer')
);

-- Users can also create their own profile (self-registration)
create policy "Users create own profile"
on public.people for insert
to authenticated
with check (auth.uid() = user_id);

-- Super admins can update anyone
create policy "Super admin update all"
on public.people for update
to authenticated
using (public.get_user_role() = 'super_admin');

-- Regular admins can update non-admin people
create policy "Admins update non-admins"
on public.people for update
to authenticated
using (
  public.get_user_role() = 'admin'
  and not exists (select 1 from public.admins where person_id = people.id)
);

-- Users can update their own profile
create policy "Users update self"
on public.people for update
to authenticated
using (auth.uid() = user_id and public.is_not_blocked());

-- Super admins can delete anyone
create policy "Super admin delete"
on public.people for delete
to authenticated
using (public.get_user_role() = 'super_admin');

-- Regular admins can delete non-admin people
create policy "Admins delete non-admins"
on public.people for delete
to authenticated
using (
  public.get_user_role() = 'admin'
  and not exists (select 1 from public.admins where person_id = people.id)
);


-- ADMINS TABLE POLICIES
create policy "View admins"
on public.admins for select
to authenticated
using (true);

create policy "Super admin manages admins"
on public.admins for all
to authenticated
using (public.get_user_role() = 'super_admin');


-- DELETED PEOPLE TABLE
create table public.deleted_people (
    id uuid primary key, -- same as the original person
    user_id uuid,
    full_name text not null,
    first_name text,
    middle_name text,
    last_name text,
    email text,
    phone text,
    address_line text,
    locality_area text,
    geo_location geography(POINT),
    blood_group text check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
    is_blood_donor boolean default false,
    last_donation_date date,
    is_volunteer boolean default false,
    skills text[],
    availability jsonb default '{}'::jsonb,
    marital_status text check (marital_status in ('single','married','divorced','widowed','separated')),
    children_count int,
    children_ids uuid[],
    is_blocked boolean default false,
    blocked_at timestamptz,
    blocked_by uuid,
    admins jsonb, -- store role info as JSON
    created_at timestamptz,
    updated_at timestamptz,
    deleted_at timestamptz default now(),
    deleted_by uuid references auth.users(id)
);

create index deleted_people_user_id_idx on public.deleted_people(user_id);
create index deleted_people_geo_idx on public.deleted_people using gist (geo_location);

-- FUNCTION: archive deleted people
create or replace function public.archive_deleted_people()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.deleted_people (
        id, user_id, full_name, first_name, middle_name, last_name,
        email, phone, address_line, locality_area, geo_location,
        blood_group, is_blood_donor, last_donation_date,
        is_volunteer, skills, availability,
        marital_status, children_count, children_ids,
        is_blocked, blocked_at, blocked_by, admins,
        created_at, updated_at, deleted_by
    )
    values (
        old.id, old.user_id, old.full_name, old.first_name, old.middle_name, old.last_name,
        old.email, old.phone, old.address_line, old.locality_area, old.geo_location,
        old.blood_group, old.is_blood_donor, old.last_donation_date,
        old.is_volunteer, old.skills, old.availability,
        old.marital_status, old.children_count, old.children_ids,
        old.is_blocked, old.blocked_at, old.blocked_by,
        (select jsonb_agg(jsonb_build_object('role', role)) from admins where person_id = old.id),
        old.created_at, old.updated_at, auth.uid()
    );

    return old;
end;
$$;

-- TRIGGER
create trigger trigger_archive_deleted_people
before delete on public.people
for each row
execute function public.archive_deleted_people();

