# ✅ Admin Credentials Fix - Complete Summary

## 🎯 What You Need To Do

Your new admin credentials are:
- **Email:** beautydokanbd@gmail.com
- **Password:** @Araf@2024@

But there's a duplicate email in the database. Here's how to fix it:

---

## 3-STEP FIX (2 minutes)

### STEP 1️⃣: Open Supabase Dashboard
```
1. Go to: https://dqegyoezhrquynhyykwt.supabase.co
2. Login
3. Click "SQL Editor" on left
4. Click "New Query" (blue button)
```

### STEP 2️⃣: Run These 3 SQL Commands (One After Another)

**Query 1 - Clean up old data:**
```sql
DELETE FROM public.profiles WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
DELETE FROM auth.users WHERE email IN ('admin@ebeautydokan.com', 'beautydokanbd@gmail.com');
```
- Click "Run"
- Wait for ✅ "Success"

---

**Query 2 - Create new admin:**
```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES (gen_random_uuid(), 'beautydokanbd@gmail.com', crypt('@Araf@2024@', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Beauty Dokan Admin"}', now(), now());
```
- Click "New Query" (blue button again)
- Paste this SQL
- Click "Run"
- Wait for ✅ "Success" (should say "1 row inserted")

---

**Query 3 - Set admin role:**
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'beautydokanbd@gmail.com';
```
- Click "New Query" (blue button again)
- Paste this SQL
- Click "Run"
- Wait for ✅ "Success"

### STEP 3️⃣: Restart and Test

```bash
# Stop dev server (press Ctrl+C)
# Then start again
npm run dev

# Visit: http://localhost:3001/admin/login
# Use these credentials:
# Email: beautydokanbd@gmail.com
# Password: @Araf@2024@
```

✅ Should login successfully!

---

## 🎊 What Should Happen

| Step | Action | Result |
|------|--------|--------|
| 1 | Delete old data | "X rows deleted" ✅ |
| 2 | Create new user | "1 row inserted" ✅ |
| 3 | Set admin role | "1 row updated" ✅ |
| 4 | Login | Works! ✅ |

---

## ⚠️ If You Get Errors

### "still getting duplicate key error"
- Make sure Query 1 deleted the rows
- Check the deletion message shows rows were deleted
- If not, run Query 1 again

### "INSERT failed"
- Copy Query 2 exactly as shown (no line breaks)
- Make sure you're in a "New Query"

### "Can't login"
- Make sure Query 3 ran successfully
- Check your email/password are correct
- Restart browser (clear cache)

---

## ✨ Summary

Your code is already updated. Just need to:
1. Run Query 1, 2, 3 in Supabase
2. Restart dev server
3. Login with new credentials!

**That's it!** 🚀

---

## 📞 Support

See these files for more help:
- `COMPLETE_SQL_FIX.md` - Detailed version
- `QUICK_SQL_FIX.md` - Just the commands
- `FIX_DUPLICATE_EMAIL.md` - Original fix guide

---

**Ready? Start with Step 1 above!** 💪
