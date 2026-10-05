-- 1. Alter the products table to match the new schema constraints
-- Safely convert text ID to UUID, drop NOT NULLs, add badge column
ALTER TABLE public.products 
  ALTER COLUMN id DROP DEFAULT,
  ALTER COLUMN id TYPE UUID USING id::uuid,
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN category DROP NOT NULL,
  ALTER COLUMN brand DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS badge TEXT;

-- 2. Drop the old insecure permissive policies established in 20260716
DROP POLICY IF EXISTS "select_products" ON public.products;
DROP POLICY IF EXISTS "insert_products" ON public.products;
DROP POLICY IF EXISTS "update_products" ON public.products;
DROP POLICY IF EXISTS "delete_products" ON public.products;

-- 3. Recreate the precise secure RLS policies intended by the original 20260722 requirements
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
