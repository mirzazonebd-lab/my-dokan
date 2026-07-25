# 🔐 Admin Credentials Changed ✅

## Your New Admin Login

```
📧 Email:    beautydokanbd@gmail.com
🔑 Password: @Araf@2024@
```

---

## ✅ What's Done

- ✅ Code updated (`app/admin/login/page.tsx`)
- ✅ Ready for Supabase update

---

## 🎯 Final Step: Update Supabase

### Copy This SQL:

```sql
DELETE FROM auth.users WHERE email = 'admin@ebeautydokan.com';

INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(), 'beautydokanbd@gmail.com', 
  crypt('@Araf@2024@', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}', now(), now()
);

UPDATE public.profiles SET role = 'admin' 
WHERE email = 'beautydokanbd@gmail.com';
```

### Then:

1. Go to: https://dqegyoezhrquynhyykwt.supabase.co
2. SQL Editor → New Query
3. Paste the SQL above
4. Click "Run"
5. Done! ✅

---

## 🚀 Test New Login

```
npm run dev
# Then visit: http://localhost:3001/admin/login
```

**Email:** beautydokanbd@gmail.com  
**Password:** @Araf@2024@

---

**All Set!** 🎉
