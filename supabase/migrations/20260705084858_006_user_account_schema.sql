/*
# User Account, Cart, and Orders Schema

1. Purpose
- Enable user authentication with Supabase Auth
- Shopping cart persistence per user
- Order management and history
- Address book for shipping
- Wishlist functionality
- User profiles

2. New Tables
- `profiles` - User profile data (name, phone, avatar)
  - id: uuid, primary key, references auth.users
  - full_name: text
  - phone: text
  - avatar_url: text
  - created_at, updated_at: timestamps

- `addresses` - User shipping addresses
  - id: uuid, primary key
  - user_id: uuid, references auth.users
  - name, phone, address, city, district, postal_code
  - is_default: boolean
  - created_at: timestamp

- `cart_items` - Shopping cart
  - id: uuid, primary key
  - user_id: uuid, references auth.users
  - product_id: text (references our product IDs)
  - quantity: integer
  - created_at, updated_at: timestamps

- `wishlists` - User wishlist
  - id: uuid, primary key
  - user_id: uuid, references auth.users
  - product_id: text
  - created_at: timestamp

- `orders` - Order records
  - id: uuid, primary key
  - user_id: uuid, references auth.users
  - order_number: text, unique
  - status: text (pending, confirmed, processing, shipped, delivered, cancelled)
  - subtotal, discount, shipping, total: decimal
  - coupon_code: text
  - payment_method: text (cod, bkash, nagad)
  - payment_status: text (pending, paid, failed)
  - shipping_address: jsonb
  - notes: text
  - created_at, updated_at: timestamps

- `order_items` - Items within orders
  - id: uuid, primary key
  - order_id: uuid, references orders
  - product_id: text
  - product_name: text
  - product_image: text
  - price: decimal
  - quantity: integer
  - subtotal: decimal
  - created_at: timestamp

3. Security
- RLS enabled on all tables
- Owner-scoped policies: users can only access their own data
- user_id defaults to auth.uid() for automatic owner assignment

4. Indexes
- user_id indexes for all user-scoped tables
- order_number index for order lookups
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  dark_mode boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  district text NOT NULL,
  postal_code text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_addresses" ON addresses;
CREATE POLICY "users_read_own_addresses" ON addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_addresses" ON addresses;
CREATE POLICY "users_insert_own_addresses" ON addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_addresses" ON addresses;
CREATE POLICY "users_update_own_addresses" ON addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_addresses" ON addresses;
CREATE POLICY "users_delete_own_addresses" ON addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_cart" ON cart_items;
CREATE POLICY "users_read_own_cart" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_cart" ON cart_items;
CREATE POLICY "users_insert_own_cart" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_cart" ON cart_items;
CREATE POLICY "users_update_own_cart" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_cart" ON cart_items;
CREATE POLICY "users_delete_own_cart" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_wishlist" ON wishlists;
CREATE POLICY "users_read_own_wishlist" ON wishlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_wishlist" ON wishlists;
CREATE POLICY "users_insert_own_wishlist" ON wishlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete_own_wishlist" ON wishlists;
CREATE POLICY "users_delete_own_wishlist" ON wishlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  coupon_code text,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_orders" ON orders;
CREATE POLICY "users_read_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_orders" ON orders;
CREATE POLICY "users_insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update_own_orders" ON orders;
CREATE POLICY "users_update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text NOT NULL,
  brand text NOT NULL,
  price numeric(12,2) NOT NULL,
  quantity integer NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_order_items" ON order_items;
CREATE POLICY "users_read_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  seq_num integer;
  order_num text;
BEGIN
  seq_num := nextval('order_seq'::regclass) 
    FROM (SELECT 1) t 
    WHERE to_regclass('order_seq') IS NOT NULL;
  
  IF seq_num IS NULL THEN
    CREATE SEQUENCE IF NOT EXISTS order_seq;
    seq_num := nextval('order_seq');
  END IF;
  
  order_num := 'SV' || to_char(now(), 'YYYYMM') || lpad(seq_num::text, 5, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
