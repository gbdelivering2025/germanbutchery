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
  description text,
  base_unit text NOT NULL, -- 'g', 'kg', 'pc', 'pkt'
  base_unit_in_grams integer,
  price_per_base_unit numeric(12,2) NOT NULL,
  currency char(3) DEFAULT 'RWF',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
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
  user_id uuid REFERENCES users(id),
  phone text,
  total_amount numeric(12,2) NOT NULL,
  currency char(3) DEFAULT 'RWF',
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  notes text,
  created_at timestamptz DEFAULT now()
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
