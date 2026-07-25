# 🚀 Supabase Setup - Complete Guide

## ✅ Your Credentials Are Set
- **Project URL:** https://dqegyoezhrquynhyykwt.supabase.co
- **Credentials:** Added to `.env.local`
- **Status:** Ready to deploy migrations

---

## 📋 Step 1: Run SQL Migrations

Go to your Supabase Dashboard:
1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"** button
3. Copy each SQL below and run them **IN THIS ORDER**

---

## 🗃️ Migration 1: Create Profiles Table
**Run this FIRST**

```sql
-- Create profiles table (for user roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid()
      AND p2.role = 'admin'
    )
  );

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer');

-- RLS Policy: Admins can update profiles
CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.id = auth.uid()
      AND p2.role = 'admin'
    )
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

✅ **Wait for success message, then continue to Migration 2**

---

## 🗃️ Migration 2: Create Products Table

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  image TEXT,
  category TEXT,
  brand TEXT,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read products
CREATE POLICY "Anyone can read products"
  ON public.products
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update products
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **Wait for success, then continue to Migration 3**

---

## 🗃️ Migration 3: Create Categories Table

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT DEFAULT '/placeholder.png',
  icon TEXT DEFAULT '🛍️',
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read categories
CREATE POLICY "Anyone can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **Continue to Migration 4**

---

## 🗃️ Migration 4: Create Brands Table

```sql
-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT DEFAULT '/placeholder.png',
  country TEXT,
  description TEXT,
  is_korean BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_is_korean ON public.brands(is_korean);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read brands
CREATE POLICY "Anyone can read brands"
  ON public.brands
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert brands
CREATE POLICY "Admins can insert brands"
  ON public.brands
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update brands
CREATE POLICY "Admins can update brands"
  ON public.brands
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete brands
CREATE POLICY "Admins can delete brands"
  ON public.brands
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **Continue to Migration 5**

---

## 🗃️ Migration 5: Create Coupons Table

```sql
-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(active);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read active coupons
CREATE POLICY "Anyone can read active coupons"
  ON public.coupons
  FOR SELECT
  USING (active = true);

-- RLS Policy: Only admins can read all coupons
CREATE POLICY "Admins can read all coupons"
  ON public.coupons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can insert coupons
CREATE POLICY "Admins can insert coupons"
  ON public.coupons
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can update coupons
CREATE POLICY "Admins can update coupons"
  ON public.coupons
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policy: Only admins can delete coupons
CREATE POLICY "Admins can delete coupons"
  ON public.coupons
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **Continue to Migration 6**

---

## 🗃️ Migration 6: Create Settings Table

```sql
-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(setting_key);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read settings
CREATE POLICY "Anyone can read settings"
  ON public.settings
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert/update/delete settings
CREATE POLICY "Admins can modify settings"
  ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **Continue to Migration 7 (Final)**

---

## 🗃️ Migration 7: Create SMS Templates Table

```sql
-- Create SMS templates table
CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  template_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default SMS templates
INSERT INTO public.sms_templates (template_key, template_text) VALUES
  ('ORDER_CONFIRMATION', 'Hi {customerName}! Your order #{orderId} has been confirmed. Total: ৳{amount}. Thank you for shopping with Beauty Dokan BD!'),
  ('PAYMENT_SUCCESS', 'Payment received! Your order #{orderId} (৳{amount}) will be processed shortly. Tracking info coming soon!'),
  ('SHIPMENT', 'Great news! Your order #{orderId} has shipped. Track it here: {trackingUrl}'),
  ('DELIVERY', 'Your order #{orderId} is out for delivery today. Please keep your phone available!')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read templates
CREATE POLICY "Anyone can read SMS templates"
  ON public.sms_templates
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can modify templates
CREATE POLICY "Admins can modify SMS templates"
  ON public.sms_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

✅ **All migrations complete!**

---

## 👤 Step 2: Create Admin User

Run this in SQL Editor:

```sql
-- Create admin user
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

-- Update role to admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@ebeautydokan.com';
```

✅ **Admin user created!**

---

## 🧪 Step 3: Test Setup

```bash
# 1. Start dev server
npm run dev

# 2. Visit website
http://localhost:3001

# 3. Admin login
http://localhost:3001/admin/login
Email: admin@ebeautydokan.com
Password: @Aysha@1996@

# 4. Test admin panel
- Add a product
- Check if it appears on website
- Edit product price
- Delete product
```

---

## ✅ Verification Checklist

- [ ] All 7 SQL migrations ran successfully
- [ ] Admin user created
- [ ] `npm run dev` starts without errors
- [ ] Website shows at http://localhost:3001
- [ ] Admin login works
- [ ] Can add products
- [ ] Products appear on website
- [ ] Product edits save to database
- [ ] Inventory tracking works

---

## 🎯 What Happens Next

1. **When you add a product in admin:**
   - Saved to Supabase `products` table
   - Appears on website instantly
   - Stock tracked in real-time

2. **When customer checks out:**
   - Inventory decreases
   - Order saved to database
   - Admin can see order

3. **Admin operations:**
   - Brands manage Korean & International
   - Categories auto-group products
   - Coupons apply discounts

---

## 🐛 Troubleshooting

### "Query returned no rows"
- Normal for first migration - tables don't exist yet

### "Duplicate key value"
- Policy/trigger already exists - safe to ignore

### "Permission denied"
- RLS policy working correctly - expected

### Admin can't login
- Make sure profiles table has admin's role set to 'admin'
- Verify user exists in auth.users table

### Products not showing
- Check `products` table has data
- Verify RLS policy allows SELECT
- Check browser console for fetch errors

---

## 📞 Support

1. Check Supabase Dashboard → Database → Tables
2. Verify all 7 tables created
3. Check Data tab for records
4. Review Logs for errors

---

**Your Supabase setup is ready!** 🚀

Next: Run all 7 migrations above in order, then test the admin panel.
