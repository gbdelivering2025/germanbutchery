-- Core schema (Postgres) - starter example
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  name text,
  role text NOT NULL DEFAULT 'customer',
  password_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  base_unit text NOT NULL, -- 'g', 'kg', 'pc', 'pkt'
  base_unit_in_grams integer,
  price_per_base_unit numeric(12,2) NOT NULL,
  compare_price numeric(12,2), -- Original price for sale comparison
  currency char(3) DEFAULT 'RWF',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  stock_status text DEFAULT 'in_stock', -- 'in_stock', 'out_of_stock', 'low_stock'
  badge text, -- 'new', 'popular', 'sale'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  title text,
  sku text,
  additional_price numeric(12,2) DEFAULT 0,
  stock_in_base_units bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE,
  user_id uuid REFERENCES users(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  phone text,
  delivery_address text,
  delivery_zone text,
  delivery_fee numeric(12,2) DEFAULT 0,
  delivery_type text DEFAULT 'delivery', -- 'delivery', 'pickup'
  delivery_time text,
  payment_method text,
  payment_status text DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  total_amount numeric(12,2) NOT NULL,
  subtotal numeric(12,2) NOT NULL,
  currency char(3) DEFAULT 'RWF',
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  requested_quantity numeric(12,3) NOT NULL,
  unit text NOT NULL,
  unit_in_base integer,
  unit_price numeric(12,2) NOT NULL,
  total_price numeric(12,2) NOT NULL
);

CREATE TABLE themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  json_config jsonb,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text,
  status text DEFAULT 'queued',
  result jsonb,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Categories for products
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text, -- Emoji or icon identifier
  image_url text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Product images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Link products to categories
CREATE TABLE product_categories (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Product units configuration
CREATE TABLE product_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  unit text NOT NULL, -- 'g', 'kg', 'pc', 'pkt'
  multiplier numeric(12,3) NOT NULL, -- conversion to base unit
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Site settings (theme, store info, etc.)
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Promotional banners
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  link_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Custom pages (About, Contact, etc.)
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  meta_description text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Delivery zones
CREATE TABLE delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  fee numeric(12,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Store settings (updated structure)
CREATE TABLE store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- Admin users
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Order delivery info
CREATE TABLE order_delivery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  customer_name text NOT NULL,
  delivery_address text NOT NULL,
  delivery_phone text,
  delivery_fee numeric(12,2) DEFAULT 0,
  delivery_zone text,
  created_at timestamptz DEFAULT now()
);
