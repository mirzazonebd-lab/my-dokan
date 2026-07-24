CREATE TABLE products (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  compare_price numeric DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  image text,
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_products" ON products FOR DELETE
  TO authenticated USING (true);

CREATE INDEX idx_products_slug ON products (slug);
CREATE INDEX idx_products_category ON products (category);
CREATE INDEX idx_products_brand ON products (brand);
CREATE INDEX idx_products_active ON products (active);
