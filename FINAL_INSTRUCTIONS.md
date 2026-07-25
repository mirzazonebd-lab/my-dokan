# 🎯 FINAL INSTRUCTIONS - Admin Credentials Update

## Your New Admin Credentials
```
📧 Email:    beautydokanbd@gmail.com
🔑 Password: @Araf@2024@
```

---

## ✅ What's Already Done
- ✅ Code updated (`app/admin/login/page.tsx`)
- ✅ All guides created
- ⏳ Waiting for you to run SQL

---

## 🚀 WHAT YOU NEED TO DO NOW

### Open Supabase
```
1. Go to: https://dqegyoezhrquynhyykwt.supabase.co
2. Login
3. Click "SQL Editor"
4. Click "New Query"
```

---

### ⏱️ RUN 3 QUERIES (Takes 2 minutes)

**QUERY 1️⃣ - Delete old data**
```sql
DELETE FROM public.profiles WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
DELETE FROM auth.users WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
```
- Paste in SQL Editor
- Click **Run**
- Wait for ✅ Success

---

**QUERY 2️⃣ - Create new admin**
```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES (gen_random_uuid(), 'beautydokanbd@gmail.com', crypt('@Araf@2024@', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Beauty Dokan Admin"}', now(), now());
```
- Click **New Query** (blue button)
- Paste this SQL
- Click **Run**
- Wait for ✅ Success (should say "1 row inserted")

---

**QUERY 3️⃣ - Set admin role**
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'beautydokanbd@gmail.com';
```
- Click **New Query** (blue button)
- Paste this SQL
- Click **Run**
- Wait for ✅ Success

---

## 🔄 Restart & Test

After all 3 SQL queries succeed:

```bash
# In terminal, restart dev server
npm run dev
```

Then visit:
```
🌐 http://localhost:3001/admin/login

Login with:
📧 Email: beautydokanbd@gmail.com
🔑 Password: @Araf@2024@
```

✅ Should login successfully!

---

## 📋 Checklist

- [ ] Query 1 ran successfully
- [ ] Query 2 ran successfully (1 row inserted)
- [ ] Query 3 ran successfully (1 row updated)
- [ ] Restarted npm with `npm run dev`
- [ ] Can login with new credentials
- [ ] No errors in browser console

---

## 🎊 When It Works

You should see:
- ✅ Login page accepts new email
- ✅ Admin dashboard loads
- ✅ Can see products, orders, etc.
- ✅ No error messages

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Still getting "duplicate key" error | Run Query 1 again, make sure rows deleted |
| Can't insert new user | Copy Query 2 exactly (no edits) |
| "role does not exist" error | Make sure profiles migration was run |
| Can't login after SQL | Restart dev server with `npm run dev` |
| Wrong password error | Check password is exactly `@Araf@2024@` |

---

## 📞 Help Files

- `QUICK_SQL_FIX.md` - Just the SQL commands
- `COMPLETE_SQL_FIX.md` - Detailed step-by-step
- `ADMIN_FIX_SUMMARY.md` - Full explanation

---

## ⏰ Timeline

- **Copy QUERY 1:** 30 seconds
- **Run QUERY 1:** 30 seconds  
- **Copy QUERY 2:** 30 seconds
- **Run QUERY 2:** 30 seconds
- **Copy QUERY 3:** 30 seconds
- **Run QUERY 3:** 30 seconds
- **Restart dev server:** 30 seconds
- **Test login:** 1 minute

**TOTAL: ~5 minutes** ⏱️

---

## ✨ Ready?

1. Open Supabase
2. Copy Query 1 → Run
3. Copy Query 2 → Run
4. Copy Query 3 → Run
5. Restart dev server
6. Test login

**Let me know when it's done!** 🚀
