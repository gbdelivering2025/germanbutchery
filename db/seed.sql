-- Sample data for German Butchery

-- Insert categories
INSERT INTO categories (id, name, slug, description, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Beef', 'beef', 'Premium quality beef cuts', 1),
  ('22222222-2222-2222-2222-222222222222', 'Pork', 'pork', 'Fresh pork products', 2),
  ('33333333-3333-3333-3333-333333333333', 'Chicken', 'chicken', 'Farm fresh chicken', 3),
  ('44444444-4444-4444-4444-444444444444', 'Sausages', 'sausages', 'German-style sausages', 4),
  ('55555555-5555-5555-5555-555555555555', 'Deli', 'deli', 'Deli meats and cold cuts', 5),
  ('66666666-6666-6666-6666-666666666666', 'Lamb', 'lamb', 'Premium lamb cuts', 6);

-- Insert sample products
INSERT INTO products (id, sku, title, description, base_unit, base_unit_in_grams, price_per_base_unit, currency) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'BEEF-RIB-001', 'Beef Ribeye Steak', 'Premium ribeye steak, well-marbled', 'kg', 1000, 8500.00, 'RWF'),
  ('a2222222-2222-2222-2222-222222222222', 'BEEF-TEN-001', 'Beef Tenderloin', 'Tender beef tenderloin', 'kg', 1000, 12000.00, 'RWF'),
  ('a3333333-3333-3333-3333-333333333333', 'PORK-CHOP-001', 'Pork Chops', 'Fresh pork chops', 'kg', 1000, 4500.00, 'RWF'),
  ('a4444444-4444-4444-4444-444444444444', 'CHICK-BRS-001', 'Chicken Breast', 'Boneless chicken breast', 'kg', 1000, 3200.00, 'RWF'),
  ('a5555555-5555-5555-5555-555555555555', 'SAUS-BRAT-001', 'Bratwurst', 'Traditional German bratwurst', 'pkt', 500, 2500.00, 'RWF'),
  ('a6666666-6666-6666-6666-666666666666', 'SAUS-FRANK-001', 'Frankfurters', 'Classic frankfurters', 'pkt', 400, 2000.00, 'RWF'),
  ('a7777777-7777-7777-7777-777777777777', 'LAMB-RACK-001', 'Lamb Rack', 'Premium lamb rack', 'kg', 1000, 9500.00, 'RWF'),
  ('a8888888-8888-8888-8888-888888888888', 'DELI-HAM-001', 'Smoked Ham', 'German-style smoked ham', 'g', 100, 850.00, 'RWF');

-- Link products to categories
INSERT INTO product_categories (product_id, category_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222'),
  ('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333'),
  ('a5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444'),
  ('a6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444'),
  ('a7777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666'),
  ('a8888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555');

-- Insert product units (flexible quantity options)
INSERT INTO product_units (product_id, unit, multiplier, is_default) VALUES
  -- Beef ribeye: kg (default), g
  ('a1111111-1111-1111-1111-111111111111', 'kg', 1.0, true),
  ('a1111111-1111-1111-1111-111111111111', 'g', 0.001, false),
  -- Beef tenderloin: kg (default), g
  ('a2222222-2222-2222-2222-222222222222', 'kg', 1.0, true),
  ('a2222222-2222-2222-2222-222222222222', 'g', 0.001, false),
  -- Pork chops: kg (default), g
  ('a3333333-3333-3333-3333-333333333333', 'kg', 1.0, true),
  ('a3333333-3333-3333-3333-333333333333', 'g', 0.001, false),
  -- Chicken breast: kg (default), g
  ('a4444444-4444-4444-4444-444444444444', 'kg', 1.0, true),
  ('a4444444-4444-4444-4444-444444444444', 'g', 0.001, false),
  -- Bratwurst: pkt (default)
  ('a5555555-5555-5555-5555-555555555555', 'pkt', 1.0, true),
  -- Frankfurters: pkt (default)
  ('a6666666-6666-6666-6666-666666666666', 'pkt', 1.0, true),
  -- Lamb rack: kg (default), g
  ('a7777777-7777-7777-7777-777777777777', 'kg', 1.0, true),
  ('a7777777-7777-7777-7777-777777777777', 'g', 0.001, false),
  -- Smoked ham: g (default), kg
  ('a8888888-8888-8888-8888-888888888888', 'g', 1.0, true),
  ('a8888888-8888-8888-8888-888888888888', 'kg', 1000.0, false);

-- Insert site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('store_info', '{"name": "German Butchery", "address": "Kigali, Rwanda", "phone": "+250 123 456 789", "whatsapp": "+250123456789", "email": "info@germanbutchery.rw"}'),
  ('business_hours', '{"monday": "8:00 AM - 6:00 PM", "tuesday": "8:00 AM - 6:00 PM", "wednesday": "8:00 AM - 6:00 PM", "thursday": "8:00 AM - 6:00 PM", "friday": "8:00 AM - 6:00 PM", "saturday": "8:00 AM - 4:00 PM", "sunday": "Closed"}'),
  ('theme', '{"primaryColor": "#8B0000", "secondaryColor": "#B22222", "fontFamily": "Inter, system-ui", "logoUrl": "/logo.png"}'),
  ('delivery_zones', '{"zones": [{"name": "Kigali Center", "fee": 2000}, {"name": "Kigali Suburbs", "fee": 3000}, {"name": "Outside Kigali", "fee": 5000}]}'),
  ('whatsapp_templates', '{"order_confirmation": "Thank you for your order! Order #{{orderId}} - Total: RWF {{total}}. We will contact you soon.", "status_update": "Order #{{orderId}} status updated to: {{status}}"}');

-- Insert sample banners
INSERT INTO banners (title, link_url, display_order, is_active) VALUES
  ('Premium Beef Collection', '/products?category=beef', 1, true),
  ('Fresh Sausages Daily', '/products?category=sausages', 2, true),
  ('Special Offer: Chicken', '/products?category=chicken', 3, true);

-- Insert default admin user (password: admin123 - hashed with bcrypt)
-- Note: In production, this should be changed immediately
INSERT INTO admin_users (email, password_hash, name, role) VALUES
  ('admin@germanbutchery.rw', '$2b$10$K8XqGwqPPz5PqQf5yQn5QeGxqW5qB7yJZQvN5qPwZwYqEwQqwQqwQ', 'Admin User', 'super_admin');

-- Insert custom pages
INSERT INTO pages (title, slug, content, is_published) VALUES
  ('About Us', 'about', '<h1>About German Butchery</h1><p>We are a premium butchery in Kigali, Rwanda, offering the finest quality meats and German-style sausages.</p>', true),
  ('Contact Us', 'contact', '<h1>Contact Us</h1><p>Get in touch with us via WhatsApp or visit our store in Kigali.</p>', true);
