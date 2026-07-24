# 🔧 Complete SQL Fix Guide - Step by Step

## ⚠️ Problem
Email `beautydokanbd@gmail.com` already exists in the database, so we need to clean up and recreate it properly.

---

## ✅ Solution: Run These SQL Commands

### COMMAND 1: Delete all old admin users
**Run this FIRST**

```sql
DELETE FROM public.profiles WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
DELETE FROM auth.users WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
```

**Wait for:** ✅ Success message

---

### COMMAND 2: Create brand new admin user
**Run this SECOND**

```sql
-- Insert new admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
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
```

**Wait for:** ✅ Success message (should insert 1 row)

---

### COMMAND 3: Set admin role
**Run this THIRD**

```sql
-- Set admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'beautydokanbd@gmail.com';
```

**Wait for:** ✅ Success message

---

## 🎯 Step-by-Step Instructions

### In Supabase Dashboard:

1. **Go to:** https://dqegyoezhrquynhyykwt.supabase.co

2. **Click:** "SQL Editor" (left sidebar)

3. **Click:** "New Query" (blue button)

4. **COMMAND 1:**
   - Copy the first SQL block above
   - Paste in query editor
   - Click "Run"
   - Wait for ✅ success

5. **COMMAND 2:**
   - Click "New Query" again
   - Copy the second SQL block
   - Paste in query editor
   - Click "Run"
   - Wait for ✅ success message (should say "1 row affected")

6. **COMMAND 3:**
   - Click "New Query" again
   - Copy the third SQL block
   - Paste in query editor
   - Click "Run"
   - Wait for ✅ success

---

## ✨ Test After SQL

### In your terminal:
```bash
npm run dev
```

### In browser:
```
URL: http://localhost:3001/admin/login
Email: beautydokanbd@gmail.com
Password: @Araf@2024@
```

✅ Should login successfully!

---

## 🐛 If You Get Errors

### Error: "duplicate key value violates unique constraint"
- Delete wasn't successful
- Run COMMAND 1 again
- Make sure you see "X rows deleted"

### Error: "null value in column id"
- UUID not generating
- Copy COMMAND 2 exactly as shown above

### Error: "column role does not exist"
- Profiles table might not have role column
- Make sure you ran the profiles migration

---

## ✅ Success Indicators

After running all 3 commands:

- ✅ COMMAND 1: Shows "X rows deleted"
- ✅ COMMAND 2: Shows "1 row inserted"
- ✅ COMMAND 3: Shows "1 row updated"
- ✅ Can login with new credentials
- ✅ No errors in browser console

---

## 📋 Your Credentials (After SQL)

```
Email:    beautydokanbd@gmail.com
Password: @Araf@2024@
```

---

## 🆘 Still Having Issues?

Try this complete cleanup:

```sql
-- Nuclear option - delete everything and start fresh
DELETE FROM public.profiles;
DELETE FROM auth.users WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');

-- Then create fresh
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(), 'beautydokanbd@gmail.com',
  crypt('@Araf@2024@', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}', now(), now()
);

-- Auto-create profile (via trigger)
-- If trigger doesn't work, insert manually:
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
FROM auth.users WHERE email = 'beautydokanbd@gmail.com'
ON CONFLICT DO NOTHING;
```

---

**Run the 3 commands above and reply when done!** ✨
