# ✅ Admin Credentials Updated

## New Admin Login

**Email:** beautydokanbd@gmail.com  
**Password:** @Araf@2024@

---

## 🔧 What Was Changed

### ✅ Code Updated
- **File:** `app/admin/login/page.tsx`
- Updated ADMIN_EMAIL constant
- Updated ADMIN_PASSWORD constant
- Updated placeholder in form

### ✅ To Update Supabase Database

Run this SQL in your Supabase Dashboard:

```sql
-- Delete old admin user
DELETE FROM auth.users WHERE email = 'admin@ebeautydokan.com';

-- Create new admin user
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

-- Set role to admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'beautydokanbd@gmail.com';
```

---

## 📋 Next Steps

1. **Copy the SQL above**
2. **Go to:** https://dqegyoezhrquynhyykwt.supabase.co
3. **Click:** SQL Editor → New Query
4. **Paste & Run** the SQL
5. **Restart** dev server: `npm run dev`

---

## ✨ Test New Credentials

```
URL: http://localhost:3001/admin/login
Email: beautydokanbd@gmail.com
Password: @Araf@2024@
```

---

## ✅ Complete!

Both the code and database are ready. Just run the SQL and you're all set!
