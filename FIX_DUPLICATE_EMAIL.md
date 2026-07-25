# ✅ Fix Duplicate Email Error

## Solution: Run This SQL (In Order)

### Step 1: Delete old admin user completely
```sql
DELETE FROM public.profiles WHERE email = 'admin@ebeautydokan.com';
DELETE FROM auth.users WHERE email = 'admin@ebeautydokan.com';
```

### Step 2: Check if new email exists and delete if needed
```sql
DELETE FROM public.profiles WHERE email = 'beautydokanbd@gmail.com';
DELETE FROM auth.users WHERE email = 'beautydokanbd@gmail.com';
```

### Step 3: Create new admin user with new email
```sql
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(), 
  'beautydokanbd@gmail.com', 
  crypt('@Araf@2024@', gen_salt('bf')), 
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}', 
  now(), 
  now()
);

-- Set role to admin
UPDATE public.profiles SET role = 'admin' 
WHERE email = 'beautydokanbd@gmail.com';
```

---

## 🎯 Instructions

1. Go to: https://dqegyoezhrquynhyykwt.supabase.co
2. Click **SQL Editor**
3. Click **New Query**
4. **Copy & run STEP 1** first (wait for success ✅)
5. **Copy & run STEP 2** (wait for success ✅)
6. **Copy & run STEP 3** (wait for success ✅)
7. Done!

---

## ✅ After Running SQL

```bash
npm run dev
# Then test:
# http://localhost:3001/admin/login
# Email: beautydokanbd@gmail.com
# Password: @Araf@2024@
```

---

**Run all 3 steps and it will work!** ✨
