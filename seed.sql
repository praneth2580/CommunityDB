-- Enable pgcrypto for password hashing
create extension if not exists pgcrypto;

-- 1. Insert into auth.users (The Login User)
-- We use a fixed UUID for the admin so we can reference it easily
DO $$
DECLARE
    new_user_id uuid := uuid_generate_v4();
    new_person_id uuid := uuid_generate_v4();
BEGIN
    -- Check if user already exists to avoid duplicates
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@community.org') THEN
        
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            new_user_id,
            '00000000-0000-0000-0000-000000000000', -- Default instance_id
            'authenticated',
            'authenticated',
            'admin@community.org',
            crypt('admin', gen_salt('bf')), -- Password: 'admin'
            now(),
            null,
            null,
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );

        -- 2. Insert into public.people (The Census Profile)
        INSERT INTO public.people (
            id,
            user_id,
            full_name,
            first_name,
            last_name,
            email,
            phone,
            is_volunteer
        ) VALUES (
            new_person_id,
            new_user_id,
            'Super Admin',
            'Super',
            'Admin',
            'admin@community.org',
            '+0000000000', -- Dummy phone
            true
        );

        -- 3. Insert into public.admins (The Admin Role)
        INSERT INTO public.admins (
            user_id,
            person_id,
            role
        ) VALUES (
            new_user_id,
            new_person_id,
            'super_admin'
        );
        
    END IF;
END $$;
