-- ============================================
-- BEAUTY DOKAN BD - SUPABASE SETUP SCRIPT
-- ============================================
-- This script sets up the complete database schema
-- and creates the admin user
-- ============================================

-- ============================================
-- 1. MIGRATE 1: Create Profiles Table & Auth
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  dark_mode BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
  );

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer');

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
  );

-- Auto-create profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, dark_mode, email_notifications)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer', FALSE, TRUE);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- 2. Clean Up: Remove Existing Admin User
-- ============================================
-- This prevents duplicate key errors
-- Delete old admin if it exists
DELETE FROM public.profiles WHERE email = 'beautydokanbd@gmail.com';
DELETE FROM auth.users WHERE email = 'beautydokanbd@gmail.com';

-- ============================================
-- 3. Create Admin User
-- ============================================
-- Create auth user with correct credentials
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  confirmed_at
) VALUES (
  gen_random_uuid(),
  'beautydokanbd@gmail.com',
  crypt('@Araf@2024@', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}',
  now(),
  now(),
  '',
  now()
);

-- ============================================
-- 4. Create Admin Profile & Set Role
-- ============================================
-- Get the newly created user ID and create/update profile
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users 
WHERE email = 'beautydokanbd@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- ============================================
-- 5. Verify Setup
-- ============================================
-- Check that admin user was created successfully
SELECT 'Admin user created' as status;
SELECT email, role FROM public.profiles WHERE email = 'beautydokanbd@gmail.com';
SELECT 'Setup complete' as status;

-- ============================================
-- END SETUP SCRIPT
-- ============================================
