# 🚀 QUICK FIX - Copy & Paste These 3 Commands

## ⏱️ Takes 2 minutes

---

## COMMAND 1 (Copy & Paste This)

```sql
DELETE FROM public.profiles WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
DELETE FROM auth.users WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
```

✅ Click Run → Wait for success

---

## COMMAND 2 (Copy & Paste This)

```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES (gen_random_uuid(), 'beautydokanbd@gmail.com', crypt('@Araf@2024@', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Beauty Dokan Admin"}', now(), now());
```

✅ Click Run → Wait for success

---

## COMMAND 3 (Copy & Paste This)

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'beautydokanbd@gmail.com';
```

✅ Click Run → Wait for success

---

## 📍 Where to Run

1. Go to: https://dqegyoezhrquynhyykwt.supabase.co
2. Click: **SQL Editor**
3. Click: **New Query**
4. Paste each command above (one at a time)
5. Click: **Run**
6. Wait for ✅
7. Repeat for next command

---

## ✨ After Running All 3

```bash
npm run dev
# Visit: http://localhost:3001/admin/login
# Email: beautydokanbd@gmail.com
# Password: @Araf@2024@
```

---

**Done!** ✅
