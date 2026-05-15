-- ============================================
-- Floréa E-Commerce Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  code_product TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  note TEXT,
  total_price INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders: Users can view their own orders, admin can view all
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Order Items: Users can view items of their own orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: Categories
-- ============================================
INSERT INTO categories (name, slug) VALUES
  ('Buket Bunga', 'buket-bunga'),
  ('Buket Uang', 'buket-uang'),
  ('Karangan Bunga', 'karangan-bunga')
ON CONFLICT (slug) DO NOTHING;
