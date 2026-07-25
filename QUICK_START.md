# Quick Start - Get Project Running

## Issue: Supabase Not Configured

The app is running but Supabase is not set up yet. It will use **fallback JSON data** until you configure it.

---

## Option A: Run with Fallback Data (Quickest - 1 minute)

**Your app is already working!** It's using fallback JSON data from `data/products.json`.

✅ Website displays products  
✅ Admin pages work (but don't persist to database)  
✅ No Supabase setup needed  

**Note:** Admin changes are NOT saved when you refresh (no database).

---

## Option B: Set Up Supabase (Full Database - 10 minutes)

### Step 1: Create Supabase Project
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up / Login
4. Create new project:
   - Organization: Create new or choose existing
   - Project name: `beauty-dokan-bd`
   - Database password: Generate strong password
   - Region: Choose closest to you

### Step 2: Get Your Credentials
1. Go to **Project Settings → API**
2. Copy these values:
   ```
   Project URL: https://xxx.supabase.co
   Anon public key: eyJhbGc...
   Service role key: eyJhbGc...
   ```

### Step 3: Update `.env.local`
Edit `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here
NEXTAUTH_SECRET=generate-random-string
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_SYSTEM_API_KEY=generate-random-string
```

**Note:** Replace `your-actual-*` with real values from Supabase Dashboard

### Step 4: Run Database Migrations
1. Go to **Supabase Dashboard → SQL Editor**
2. Click **"New Query"**
3. Copy each SQL file from `supabase/migrations/` folder:
   - `20260727_create_profiles_table.sql` (run first)
   - `20260722_create_products_table.sql`
   - `20260723_create_categories_table.sql`
   - `20260724_create_brands_table.sql`
   - `20260725_create_coupons_table.sql`
   - `20260726_create_settings_table.sql`
4. Paste each one and click **"Run"**

### Step 5: Create Admin User
In Supabase SQL Editor, run:
```sql
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(), 'admin@ebeautydokan.com',
  crypt('@Aysha@1996@', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}', now(), now()
);

UPDATE public.profiles SET role = 'admin' 
WHERE email = 'admin@ebeautydokan.com';
```

### Step 6: Restart Dev Server
```bash
# Press Ctrl+C to stop
npm run dev
```

---

## Current Status

✅ **Website working** with fallback data  
✅ **Admin panel accessible** at `/admin/login`  
⚠️ **Database not configured** (admin changes not saved)  

---

## What Changes When You Set Up Supabase?

### Before (Fallback Mode)
- ❌ Admin changes don't persist
- ❌ Every page refresh resets data
- ✅ Website displays products from JSON file
- ✅ Fast (no network requests)

### After (Supabase Mode)
- ✅ Admin changes persist in database
- ✅ Admin panel fully functional
- ✅ Real inventory tracking
- ✅ Production-ready

---

## Test Commands

### Check Environment
```bash
# See what values are loaded
node -e "console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

### Check Fallback Data
```bash
# Website should show this data at:
# http://localhost:3001/
# Should display ~20 beauty products
```

### Test Admin Panel
```bash
# Go to http://localhost:3001/admin/login
# Try login (will fail without Supabase)
# Or use fallback mode for testing UI
```

---

## Troubleshooting

### "Port 3000 is in use"
✅ Already handled - using port 3001

### "Supabase credentials not configured"
✅ This is expected - using fallback data. Configure `.env.local` to use Supabase.

### "Can't login to admin"
This requires Supabase. Until then:
- Website works fine (shows products)
- Admin page UI visible but won't save

### "Products don't show"
1. Check `data/products.json` exists
2. Check browser console for errors
3. Restart dev server: `npm run dev`

---

## Next Steps

**Choose one:**

1. **Keep using fallback (for testing)**
   - Website fully works
   - Good for UI testing
   - Admin doesn't save data

2. **Set up Supabase (for production)**
   - Follow Steps 1-6 above
   - Takes ~10 minutes
   - Full database functionality

---

## File Locations

- **Env file:** `C:\Users\Araf Mirza\my-dokan\.env.local`
- **Products data:** `data/products.json`
- **Migrations:** `supabase/migrations/` (7 SQL files)
- **Dev server:** `npm run dev`

---

## Help

If you get stuck:
1. Check the errors in console
2. Verify `.env.local` has correct values
3. Check `SUPABASE_SETUP.md` for detailed guide
4. Ensure all SQL migrations ran successfully

**Your project is ready to use!** 🚀

Choose Option A or B above to proceed.
