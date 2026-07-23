# Beauty Dokan BD - Supabase Complete Setup Guide

## Overview
This document covers the complete setup for integrating Supabase as the database backend for Beauty Dokan BD. All admin CRUD operations now persist to Supabase instead of localStorage.

---

## 1. Environment Setup

### Step 1: Create `.env.local` file
Copy the `.env.local` template and fill in your Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Authentication
NEXTAUTH_SECRET=generate-a-random-32-character-string
NEXTAUTH_URL=http://localhost:3000

# System API Key (generate a random 32-character string)
SYSTEM_API_KEY=your-32-character-random-system-api-key

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
TWILIO_WEBHOOK_AUTH_TOKEN=your-twilio-webhook-auth-token
```

### Step 2: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy `Project URL` and `anon public key`
5. Also copy `service_role key` (keep it secret!)

---

## 2. Database Migration

### Step 1: Run SQL Migrations in Supabase

Go to **Supabase Dashboard → SQL Editor → New Query** and run each migration file from `supabase/migrations/`:

**Files to run (in order):**
1. `20260727_create_profiles_table.sql` - Create user profiles & roles
2. `20260722_create_products_table.sql` - Create products table
3. `20260723_create_categories_table.sql` - Create categories table
4. `20260724_create_brands_table.sql` - Create brands table
5. `20260725_create_coupons_table.sql` - Create coupons table
6. `20260726_create_settings_table.sql` - Create settings table
7. `20260728_create_sms_templates.sql` - Create SMS templates (optional, already exists)

### Step 2: Verify Tables Created

Go to **Supabase Dashboard → Database → Tables** and confirm:
- `auth.users` (system table)
- `public.profiles`
- `public.products`
- `public.categories`
- `public.brands`
- `public.coupons`
- `public.settings`
- `public.sms_logs` (existing)
- `public.sms_queue` (existing)
- `public.sms_templates` (existing)

---

## 3. Create Admin User

### Step 1: Create Admin Account in Supabase Auth

```sql
-- Run in Supabase SQL Editor
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
  'admin@ebeautydokan.com',
  crypt('@Aysha@1996@', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Beauty Dokan Admin"}',
  now(),
  now()
);
```

### Step 2: Set Admin Role in Profiles

```sql
-- Run in Supabase SQL Editor after creating auth user
-- Get the user ID from the INSERT result, then:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@ebeautydokan.com';
```

**Alternative:** Use Supabase Auth UI in Dashboard:
1. Go to **Authentication → Users**
2. Click **Add User**
3. Email: `admin@ebeautydokan.com`
4. Password: `@Aysha@1996@`
5. Then update role to 'admin' in profiles table

---

## 4. Insert Sample Data (Optional)

### Products
```sql
INSERT INTO public.products (
  name, slug, price, stock, category, brand, description, image, active
) VALUES
  ('COSRX Advanced Snail 96 Mucin Power Essence', 'cosrx-snail-essence', 1200, 50, 'Korean Skincare', 'COSRX', 'Hydrating essence with snail secretion filtrate', '/placeholder.png', true),
  ('Beauty of Joseon Dynasty Cream', 'beauty-joseon-cream', 2500, 30, 'Korean Skincare', 'Beauty of Joseon', 'Rich cream with traditional Korean herbs', '/placeholder.png', true);
```

### Categories
```sql
INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Korean Skincare', 'korean-skincare', 'Authentic K-beauty products', '🌸'),
  ('Makeup', 'makeup', 'Cosmetics and makeup products', '💄'),
  ('Hair Care', 'hair-care', 'Shampoos, conditioners, and treatments', '💆');
```

### Brands
```sql
INSERT INTO public.brands (name, slug, country, description, is_korean) VALUES
  ('COSRX', 'cosrx', 'South Korea', 'Science-driven Korean skincare', true),
  ('Beauty of Joseon', 'beauty-of-joseon', 'South Korea', 'Traditional Korean beauty secrets', true);
```

---

## 5. API Routes Overview

All admin operations use these API endpoints:

### Products
- **GET** `/api/admin/products` - Get all products
- **POST** `/api/admin/products` - Create product (requires auth)
- **PATCH** `/api/admin/products` - Update product (requires auth)
- **DELETE** `/api/admin/products?id=<id>` - Delete product (requires auth)

### Brands
- **GET** `/api/admin/brands` - Get all brands
- **POST** `/api/admin/brands` - Create brand (requires auth)
- **PATCH** `/api/admin/brands` - Update brand (requires auth)
- **DELETE** `/api/admin/brands?id=<id>` - Delete brand (requires auth)

### Categories
- **GET** `/api/admin/categories` - Get all categories
- **POST** `/api/admin/categories` - Create category (requires auth)
- **PATCH** `/api/admin/categories` - Update category (requires auth)
- **DELETE** `/api/admin/categories?id=<id>` - Delete category (requires auth)

### Coupons
- **GET** `/api/admin/coupons` - Get all coupons (requires auth)
- **POST** `/api/admin/coupons` - Create coupon (requires auth)
- **PATCH** `/api/admin/coupons` - Update coupon (requires auth)
- **DELETE** `/api/admin/coupons?id=<id>` - Delete coupon (requires auth)

### Settings
- **GET** `/api/admin/settings` - Get all settings
- **PATCH** `/api/admin/settings` - Update setting (requires auth)

---

## 6. Authentication Flow

### Admin Login
1. User navigates to `/admin/login`
2. Enters credentials: `admin@ebeautydokan.com` / `@Aysha@1996@`
3. System validates with Supabase Auth
4. JWT token stored in session
5. All API calls include token in `Authorization: Bearer <token>` header

### Request Headers Required
```javascript
{
  'Content-Type': 'application/json',
  'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY,
  'Authorization': `Bearer ${token}` // From auth context
}
```

---

## 7. Admin Pages Features

### Products Page (`/admin/products`)
- ✅ View all products with search & filters
- ✅ Add new products with image upload
- ✅ Edit product details (name, price, stock, brand, category)
- ✅ Delete products
- ✅ Bulk operations
- ✅ Real-time stock tracking

### Brands Page (`/admin/brands`)
- ✅ View Korean & International brands
- ✅ Add new brands
- ✅ Edit brand details
- ✅ Delete brands
- ✅ Auto-categorization by country

### Categories Page (`/admin/categories`)
- ✅ View all categories
- ✅ Add new categories
- ✅ Edit category names & descriptions
- ✅ Delete categories

### Coupons Page (`/admin/coupons`)
- ✅ Create percentage & fixed discounts
- ✅ Set minimum order values
- ✅ Set usage limits & expiry dates
- ✅ Track coupon usage
- ✅ Enable/disable coupons

### Settings Page (`/admin/settings`)
- ✅ Store configuration (shipping, payments, etc)
- ✅ Manage SMS templates
- ✅ Store policies and terms

---

## 8. Data Flow

```
Admin Page
    ↓
User Submit Form
    ↓
API Route (POST/PATCH/DELETE)
    ↓
Authentication Check (token + role)
    ↓
Supabase Query (lib/supabase/db.ts)
    ↓
Database (Supabase)
    ↓
Response to Frontend
    ↓
Update UI State
    ↓
Data visible on website
```

---

## 9. Website Data Loading

### Products on Homepage
```typescript
// app/page.tsx or similar
const products = await getProducts(); // Fetches from Supabase
// Displays products with live stock levels
```

### Inventory Tracking
When customer purchases:
1. Product stock decremented in Supabase
2. Order created with product IDs
3. Website shows updated stock
4. Admin sees new order in orders page

---

## 10. Troubleshooting

### Issue: "Unauthorized: Invalid system key"
**Solution:** Check `NEXT_PUBLIC_SYSTEM_API_KEY` in `.env.local` matches your generated key

### Issue: "Unauthorized: Admin access required"
**Solution:** 
- Verify user role is 'admin' in `profiles` table
- Check JWT token is valid and includes user ID

### Issue: Products not showing on website
**Solution:**
- Check products table has `active = true`
- Verify `getProducts()` function in `lib/data/products.ts`
- Check browser console for fetch errors

### Issue: API returns 403 Forbidden
**Solution:**
- Verify RLS (Row Level Security) policies allow admin access
- Check Supabase Database → Policies tab
- Re-run migration SQL

### Issue: Cannot create admin user
**Solution:**
- Use Supabase Dashboard → Authentication → Users → Add User
- Set email & password
- Update role in profiles table to 'admin'

---

## 11. Production Checklist

- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Generate strong random strings for `NEXTAUTH_SECRET` and `SYSTEM_API_KEY`
- [ ] Enable Supabase backups
- [ ] Set up CORS policies in Supabase
- [ ] Enable RLS on all tables (already done in migrations)
- [ ] Test all admin CRUD operations
- [ ] Test checkout with inventory deduction
- [ ] Set up email notifications for orders
- [ ] Monitor Supabase usage & quotas
- [ ] Implement database backup strategy

---

## 12. File Structure

```
project/
├── supabase/migrations/
│   ├── 20260722_create_products_table.sql
│   ├── 20260723_create_categories_table.sql
│   ├── 20260724_create_brands_table.sql
│   ├── 20260725_create_coupons_table.sql
│   ├── 20260726_create_settings_table.sql
│   └── 20260727_create_profiles_table.sql
├── lib/supabase/
│   ├── client.ts (Supabase client)
│   ├── server.ts (Admin client)
│   └── db.ts (Database helpers)
├── app/api/admin/
│   ├── products/route.ts
│   ├── brands/route.ts
│   ├── categories/route.ts
│   ├── coupons/route.ts
│   └── settings/route.ts
├── app/admin/
│   ├── products/page.tsx
│   ├── brands/page.tsx
│   ├── categories/page.tsx
│   ├── coupons/page.tsx
│   └── settings/page.tsx
└── .env.local (your config)
```

---

## 13. Support & References

- **Supabase Docs:** https://supabase.com/docs
- **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **PostgreSQL Functions:** https://www.postgresql.org/docs/current/sql-createfunction.html

---

**Last Updated:** 2024
**Status:** Production Ready with Supabase Backend
