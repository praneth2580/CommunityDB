-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis"; 

-- 1. PEOPLE (The Census Table)
create table public.people (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id), 
    full_name text not null,
    first_name text,
    middle_name text,
    last_name text,
    phone text, 
    email text,
    address_line text,
    locality_area text,
    geo_location geography(POINT),
    
    -- Emergency & Volunteer Data
    blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    is_blood_donor boolean default false,
    last_donation_date date,
    is_volunteer boolean default false,
    skills text[],
    availability jsonb default '{}'::jsonb,

    -- Other optional info
    marital_status text check (marital_status in ('single', 'married', 'divorced', 'widowed', 'separated')),
    children_count int,
    children_ids uuid[], -- Logical reference to public.people(id)
    
    is_blocked boolean default false,
    blocker_at timestamp with time zone,
    blocker_id uuid references auth.users(id),

    created_by uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index people_phone_idx on public.people(phone);
create index people_geo_idx on public.people using GIST(geo_location);

-- 1.1 DELETED PEOPLE ARCHIVE (Audit Trail)
create table public.deleted_people as select * from public.people with no data;
alter table public.deleted_people add column deleted_at timestamp with time zone default timezone('utc'::text, now());
alter table public.deleted_people add column deleted_by uuid; -- Can try to capture via auth.uid() if possible in trigger

-- Trigger Function to Archive People
create or replace function public.archive_deleted_person()
returns trigger as $$
begin
    insert into public.deleted_people (
        id, user_id, full_name, first_name, middle_name, last_name, phone, email, address_line, locality_area, geo_location,
        blood_group, is_blood_donor, last_donation_date, is_volunteer, skills, availability,
        marital_status, children_count, children_ids, is_blocked, blocker_at, blocker_id,
        created_by, created_at, updated_at, deleted_at, deleted_by
    )
    values (
        OLD.id, OLD.user_id, OLD.full_name, OLD.first_name, OLD.middle_name, OLD.last_name, OLD.phone, OLD.email, OLD.address_line, OLD.locality_area, OLD.geo_location,
        OLD.blood_group, OLD.is_blood_donor, OLD.last_donation_date, OLD.is_volunteer, OLD.skills, OLD.availability,
        OLD.marital_status, OLD.children_count, OLD.children_ids, OLD.is_blocked, OLD.blocker_at, OLD.blocker_id,
        OLD.created_by, OLD.created_at, OLD.updated_at, now(), auth.uid()
    );
    return OLD;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_person_delete
    after delete on public.people
    for each row execute function public.archive_deleted_person();

-- RLS for Deleted Table (Admins only)
alter table public.deleted_people enable row level security;


-- 1.5 ADMINS (Separate Table)
create table public.admins (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    password text not null default 'ChangeMe123!',
    person_id uuid unique references public.people(id) on delete cascade,
    role text not null check (role in ('super_admin', 'admin', 'volunteer')), 
    department text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger Function to Sync Admins to auth.users
create or replace function public.handle_admin_sync()
returns trigger as $$
declare
    target_email text;
    new_user_id uuid;
begin
    -- 1. Get email from public.people (Required for auth creation)
    select email into target_email from public.people where id = NEW.person_id;
    
    if target_email is null then
        raise exception 'Cannot create admin: Person associated with person_id % must have an email address.', NEW.person_id;
    end if;

    -- 2. Check if auth.users record already exists
    select id into new_user_id from auth.users where lower(email) = lower(target_email);

    -- 3. If not exists, Create auth.users record
    if new_user_id is null then
        new_user_id := uuid_generate_v4();
        insert into auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at,
            confirmation_token, recovery_token, email_change_token_new, email_change, 
            email_change_token_current, reauthentication_token, phone, phone_change, 
            is_super_admin, is_sso_user
        ) values (
            new_user_id, '00000000-0000-0000-0000-000000000000', target_email,
            crypt(NEW.password, gen_salt('bf')), -- Use the password from the NEW admin record
            now(), '{"provider":"email","providers":["email"],"is_admin_sync":true}'::jsonb,
            '{}'::jsonb, 'authenticated', 'authenticated', now(), now(),
            '', '', '', '', '', '', '', '', false, false
        );
    end if;

    -- 4. Set NEW.user_id directly (Breaks recursion and deadlocks)
    NEW.user_id := new_user_id;

    -- 5. Update public.people with the user_id for cross-referencing
    update public.people set user_id = new_user_id where id = NEW.person_id;

    return NEW;
end;
$$ language plpgsql security definer;

-- Trigger: BEFORE inserting into admins, sync them to auth
drop trigger if exists on_admin_insert_sync on public.admins;
create trigger on_admin_insert_sync
    before insert on public.admins
    for each row execute function public.handle_admin_sync();

-- 2. EVENTS
create table public.events (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    type text check (type in ('donation_drive', 'cleanup', 'emergency_alert', 'workshop', 'other')),
    required_skills text[],
    status text check (status in ('draft', 'active', 'completed', 'cancelled')) default 'draft',
    location_name text,
    location_coordinates geography(POINT),
    cover_image_url text, -- For the UI card image
    organizer_id uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. EVENT PARTICIPANTS
create table public.event_participants (
    event_id uuid references public.events(id) on delete cascade,
    person_id uuid references public.people(id) on delete cascade,
    role text check (role in ('volunteer', 'donor', 'organizer', 'attendee')),
    status text check (status in ('registered', 'confirmed', 'attended', 'noshow')) default 'registered',
    primary key (event_id, person_id)
);

-- 4. RESOURCES
create table public.resources (
    id uuid primary key default uuid_generate_v4(),
    donor_id uuid references public.people(id),
    event_id uuid references public.events(id),
    type text check (type in ('money', 'blood', 'food', 'kits', 'other')),
    quantity numeric not null,
    unit text not null, 
    description text,
    collected_at timestamp with time zone default timezone('utc'::text, now()),
    status text check (status in ('pledged', 'collected', 'distributed')) default 'collected'
);

-- 5. ASSISTANCE REQUESTS (Help needed)
create table public.assistance_requests (
    id uuid primary key default uuid_generate_v4(),
    requestor_id uuid references public.people(id), -- Who needs help
    type text check (type in ('blood', 'financial', 'food', 'medical', 'transport', 'other')),
    description text,
    urgency text check (urgency in ('low', 'medium', 'high', 'critical')) default 'medium',
    status text check (status in ('open', 'in_progress', 'resolved', 'rejected', 'cancelled')) default 'open',
    
    assigned_volunteer_id uuid references public.people(id), -- Who is helping
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. PARTNER ASSOCIATIONS
create table public.partners (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    logo text,
    website text,
    instagram text,
    facebook text,
    twitter text,
    display_order int null unique,
    is_displayed boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. SOCIAL FEED (Curated Community Posts)
create table public.social_posts (
    id uuid primary key default uuid_generate_v4(),
    platform text check (platform in ('twitter', 'instagram', 'facebook', 'linkedin')),
    author_name text,
    author_handle text,
    content text,
    image_url text,
    post_url text,
    published_at timestamp with time zone,
    likes_count int default 0,
    comments_count int default 0,
    is_featured boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.people enable row level security;
alter table public.admins enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.resources enable row level security;
alter table public.assistance_requests enable row level security;
alter table public.partners enable row level security;
alter table public.social_posts enable row level security;

-- FUNCTIONS
-- CRITICAL: This function must bypass RLS to avoid recursive policy evaluation.
-- The SET clause ensures RLS is disabled when running as the definer.
create or replace function public.get_user_role() 
returns text as $$
declare
  user_role text;
  current_user_id uuid;
begin
  -- Get the current user's ID first
  current_user_id := auth.uid();
  
  -- If no authenticated user, return null early
  if current_user_id is null then
    return null;
  end if;
  
  -- Query the admins table directly
  select role into user_role 
  from public.admins 
  where user_id = current_user_id 
  limit 1;
  
  return user_role;
end;
$$ language plpgsql stable security definer 
   set search_path = public
   set row_security = off;

create or replace function public.is_volunteer_flag() 
returns boolean as $$
declare
  is_vol boolean;
begin
  select exists (
    select 1 from public.people 
    where user_id = auth.uid() and is_volunteer = true
  ) into is_vol;
  return is_vol;
end;
$$ language plpgsql stable security definer set search_path = public;

create or replace function public.is_not_blocked() 
returns boolean as $$
declare
  not_blocked boolean;
begin
  select exists (
    select 1 from public.people 
    where user_id = auth.uid() and (is_blocked = false or is_blocked is null)
  ) into not_blocked;
  return not_blocked;
end;
$$ language plpgsql stable security definer set search_path = public;

-- Restricted Login: Ensure only emails present in public.admins can sign in/up
create or replace function public.restrict_auth_access()
returns trigger as $$
begin
    -- 1. Bypass check if it's an internal admin sync trigger
    -- We handle nulls and non-existent meta_data gracefully
    if coalesce((NEW.raw_app_meta_data->>'is_admin_sync')::boolean, false) = true then
        return NEW;
    end if;

    -- 2. Otherwise, verify against admins table
    if not exists (
        select 1 from public.admins a
        join public.people p on p.id = a.person_id
        where lower(p.email) = lower(NEW.email) and is_blocked <> true
    ) then
        raise exception 'Access Denied: Email % is not authorized for this system.', NEW.email;
    end if;
    return NEW;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users (Before Login/Sign-up)
-- Note: In Supabase, you often apply this to auth.users if you have direct access, 
-- or use a custom handling. Since we are modifying schema, we can try to add it.
-- WARNING: This requires the DB user to have permissions on the 'auth' schema.
drop trigger if exists on_auth_user_created_restrict on auth.users;
create trigger on_auth_user_created_restrict
    before insert on auth.users
    for each row execute function public.restrict_auth_access();

-- --- ADMINS POLICIES ---

-- 1. VIEW: Everyone can view admin roles (to identify who is staff)
create policy "Admins are viewable by authenticated users"
on public.admins for select
to authenticated
using (true);

-- 2. MANAGE: Superadmins only (INSERT, UPDATE, DELETE - NOT SELECT to avoid recursion)
-- Note: Using separate policies for each operation to avoid recursive calls to get_user_role()
-- during SELECT, which would cause an infinite loop since get_user_role() queries this table.
create policy "Superadmins insert admins"
on public.admins for insert
to authenticated
with check ( public.get_user_role() = 'super_admin' );

create policy "Superadmins update admins"
on public.admins for update
to authenticated
using ( public.get_user_role() = 'super_admin' );

create policy "Superadmins delete admins"
on public.admins for delete
to authenticated
using ( public.get_user_role() = 'super_admin' );

-- --- PEOPLE POLICIES ---

-- 1. VIEW: Authenticated users can read
create policy "Authenticated users can view people"
on public.people for select
to authenticated
using (true);

-- 2. INSERT: Superadmin, Admin, Volunteer
create policy "Authorized users can add people"
on public.people for insert
to authenticated
with check (
  (public.get_user_role() in ('super_admin', 'admin', 'volunteer') OR public.is_volunteer_flag()) and public.is_not_blocked()
);

-- 3. UPDATE: 
-- A. Superadmin: update ANYONE
create policy "Superadmin update all"
on public.people for update
to authenticated
using ( public.get_user_role() = 'super_admin' and public.is_not_blocked() );

-- B. Admin: update ANYONE EXCEPT other Admins/Superadmins
create policy "Admin update non-admins"
on public.people for update
to authenticated
using (
  public.get_user_role() = 'admin' 
  AND 
  NOT exists (select 1 from public.admins where person_id = public.people.id)
  and public.is_not_blocked()
);

-- C. Volunteer: update ONLY basic profile (Assuming they can update rows they created or just general citizens)
-- User check: "volunteer can only add or update basic info of people"
-- I'll interpret this as volunteers can update people who are NOT admins.
create policy "Volunteer update non-admins"
on public.people for update
to authenticated
using (
  (public.get_user_role() = 'volunteer' OR public.is_volunteer_flag())
  AND
  NOT exists (select 1 from public.admins where person_id = public.people.id)
  and public.is_not_blocked()
);

-- D. Users update self
create policy "Users update self"
on public.people for update
to authenticated
using ( auth.uid() = user_id and public.is_not_blocked() ); -- Kept only where safe

-- 4. DELETE
-- A. Superadmin: Delete anyone
create policy "Superadmin delete"
on public.people for delete
to authenticated
using ( public.get_user_role() = 'super_admin' and public.is_not_blocked());

-- B. Admin: Delete non-admins
create policy "Admin delete non-admins"
on public.people for delete
to authenticated
using (
  public.get_user_role() = 'admin'
  AND
  NOT exists (select 1 from public.admins where person_id = public.people.id)
  and public.is_not_blocked()
);

-- Volunteer: NO DELETE (Implicitly denied by lack of policy)

-- E. Deleted People (Admins Only)
create policy "Admins view deleted profiles"
on public.deleted_people for select
to authenticated
using ( public.get_user_role() in ('super_admin', 'admin') and public.is_not_blocked() ); -- Kept only where safe


-- --- ASSISTANCE REQUESTS POLICIES ---

-- 1. VIEW
-- A. Volunteers/Admins: View ALL requests
create policy "Volunteers/Admins view all requests"
on public.assistance_requests for select
to authenticated
using (
  public.get_user_role() in ('super_admin', 'admin', 'volunteer') OR public.is_volunteer_flag()
);

-- B. Users: View OWN requests
create policy "Users view own requests"
on public.assistance_requests for select
to authenticated
using (
  requestor_id in (select id from public.people where user_id = auth.uid())
   and public.is_not_blocked()
);

-- 2. INSERT
-- A. Authenticated Users (Request for self)
create policy "Users can request help"
on public.assistance_requests for insert
to authenticated
with check (
  (-- Ensure they are requesting for themselves (linked to their person_id)
  requestor_id in (select id from public.people where user_id = auth.uid())
  OR
  -- OR Admins/Volunteers can create request for others
  (public.get_user_role() in ('super_admin', 'admin', 'volunteer') OR public.is_volunteer_flag()))
   and public.is_not_blocked()
);

-- 3. UPDATE
-- A. Admins: Full update
create policy "Admins update requests"
on public.assistance_requests for update
to authenticated
using ( public.get_user_role() in ('super_admin', 'admin') and public.is_not_blocked());

-- B. Volunteers: Can update status or assign themselves
create policy "Volunteers update requests"
on public.assistance_requests for update
to authenticated
using (
  (public.get_user_role() = 'volunteer' OR public.is_volunteer_flag())
   and public.is_not_blocked()
)
with check (
  -- Limit what they can change? For now, allow general updates like status/assignee 
  -- Ideally should use column-level privileges or trigger to validation, but simple Policy is okay here.
  (public.get_user_role() = 'volunteer' OR public.is_volunteer_flag())
);

-- C. Requestor: Can cancel or update description if Still Open
create policy "Requestor update own open requests"
on public.assistance_requests for update
to authenticated
using (
  requestor_id in (select id from public.people where user_id = auth.uid())
  AND status = 'open'
   and public.is_not_blocked()
);


-- --- PARTNERS POLICIES ---

-- 1. VIEW: Everyone (even public if using anon key, but sticking to authenticated here)
create policy "Everyone views partners"
on public.partners for select
to authenticated
using ( is_displayed = true);

-- 2. MANAGE: Admins only
create policy "Admins manage partners"
on public.partners for all
to authenticated
using ( public.get_user_role() in ('super_admin', 'admin') and public.is_not_blocked() );

-- --- SOCIAL POSTS POLICIES ---
create policy "Everyone views social posts"
on public.social_posts for select
to authenticated
using ( is_featured = true );

create policy "Admins manage social posts"
on public.social_posts for all
to authenticated
using ( public.get_user_role() in ('super_admin', 'admin')  and public.is_not_blocked());