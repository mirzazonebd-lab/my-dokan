-- Safe additive migration for the existing BeautyDokan schema.
-- This keeps the storefront and admin app working while adding supplier and profit data support.

CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  supplier_product_id TEXT,
  supplier_sku TEXT,
  supplier_cost NUMERIC(12,2),
  supplier_stock INTEGER,
  supplier_product_url TEXT,
  supplier_notes TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, supplier_id)
);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS supplier_cost NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS supplier_sku TEXT,
  ADD COLUMN IF NOT EXISTS supplier_product_id TEXT,
  ADD COLUMN IF NOT EXISTS supplier_product_url TEXT,
  ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS supplier_notes TEXT,
  ADD COLUMN IF NOT EXISTS supplier_id UUID,
  ADD COLUMN IF NOT EXISTS product_status TEXT DEFAULT 'active' CHECK (product_status IN ('active', 'inactive', 'draft')),
  ADD COLUMN IF NOT EXISTS profit_margin NUMERIC(5,2);

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS supplier_id UUID,
  ADD COLUMN IF NOT EXISTS supplier_cost NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS other_cost NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS estimated_profit NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS supplier_order_status TEXT DEFAULT 'Not Assigned' CHECK (
    supplier_order_status IN (
      'Not Assigned',
      'Assigned',
      'Supplier Ordered',
      'Supplier Confirmed',
      'Ready for Dispatch',
      'Dispatched',
      'Completed',
      'Cancelled'
    )
  ),
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(12,2);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON public.suppliers(is_active);
CREATE INDEX IF NOT EXISTS idx_product_suppliers_product_id ON public.product_suppliers(product_id);
CREATE INDEX IF NOT EXISTS idx_product_suppliers_supplier_id ON public.product_suppliers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_order_status ON public.orders(supplier_order_status);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active suppliers"
  ON public.suppliers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage suppliers"
  ON public.suppliers
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

CREATE POLICY "Anyone can read active product supplier mappings"
  ON public.product_suppliers
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product supplier mappings"
  ON public.product_suppliers
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

-- Use the existing settings table as the production shipping settings store.
-- These keys can coexist with current JSON settings entries without duplication.
INSERT INTO public.settings (setting_key, setting_value)
VALUES
  ('inside_dhaka_shipping_fee', jsonb_build_object('zone', 'Inside Dhaka', 'shipping_fee', 60, 'is_active', true)),
  ('outside_dhaka_shipping_fee', jsonb_build_object('zone', 'Outside Dhaka', 'shipping_fee', 120, 'is_active', true)),
  ('free_shipping_threshold', jsonb_build_object('threshold', 2026, 'is_active', true))
ON CONFLICT (setting_key) DO NOTHING;
