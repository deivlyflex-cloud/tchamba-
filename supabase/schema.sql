/**
 * SUPABASE MIGRATION SCRIPT — TCHEMBA FAST-FOOD
 * Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
 * It sets up tables, constraints, indexes, RLS policies, storage bucket,
 * and initial data.
 */

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL DEFAULT '',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(100) DEFAULT '',
    badge VARCHAR(100) DEFAULT NULL,
    badge_type VARCHAR(50) DEFAULT NULL,
    pieces VARCHAR(100) DEFAULT NULL,
    is_consultation BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    neighborhood VARCHAR(255) DEFAULT NULL,
    total_orders INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0,
    last_order_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    notes TEXT DEFAULT '',
    status VARCHAR(50) NOT NULL DEFAULT 'Novo', -- 'Novo', 'Confirmado', 'Em preparação', 'Pronto', 'Concluído', 'Cancelado'
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EVENT ORDERS (Produção para Eventos)
CREATE TABLE IF NOT EXISTS public.event_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity_packages INT NOT NULL DEFAULT 1,
    package_type VARCHAR(100) NOT NULL, -- e.g. '20 Cheese Drum', '30 Cheese Drum', etc.
    total_pieces INT NOT NULL DEFAULT 20,
    location TEXT NOT NULL,
    neighborhood VARCHAR(255) DEFAULT '',
    notes TEXT DEFAULT '',
    total_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Novo', -- 'Novo', 'Confirmado', 'Em produção', 'Concluído', 'Cancelado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name VARCHAR(255) NOT NULL DEFAULT 'Tchemba',
    slogan VARCHAR(255) NOT NULL DEFAULT 'O Sabor que derrete.',
    phone VARCHAR(50) NOT NULL DEFAULT '+244 939 779 057',
    whatsapp VARCHAR(50) NOT NULL DEFAULT '+244 939 779 057',
    email VARCHAR(255) NOT NULL DEFAULT 'tchembacrispy@gmail.com',
    address TEXT NOT NULL DEFAULT '6PHR+VH8, R. Silva Porto, Huambo, Angola',
    opening_time VARCHAR(20) NOT NULL DEFAULT '10:00',
    closing_time VARCHAR(20) NOT NULL DEFAULT '23:30',
    logo_url TEXT DEFAULT '',
    banner_url TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PROFILES / ADMIN METADATA
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) DEFAULT 'Administrador Tchemba',
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_event_orders_event_date ON public.event_orders(event_date);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. CATEGORIES: Anyone can view active categories; Authenticated users can manage
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. PRODUCTS: Anyone can view active products; Authenticated users can manage all
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. CUSTOMERS: Public can insert their own customer record (or upsert on checkout); Admins can view/edit
DROP POLICY IF EXISTS "Public can insert customer on checkout" ON public.customers;
CREATE POLICY "Public can insert customer on checkout" ON public.customers
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins have full access to customers" ON public.customers;
CREATE POLICY "Admins have full access to customers" ON public.customers
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. ORDERS: Anyone can insert orders (public checkout); Only Admins can view/update/delete
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage all orders" ON public.orders;
CREATE POLICY "Admins can view and manage all orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. ORDER ITEMS: Anyone can insert items with their order; Only Admins can view/manage
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage order items" ON public.order_items;
CREATE POLICY "Admins can view and manage order items" ON public.order_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. EVENT ORDERS: Anyone can insert event inquiry; Only Admins can manage
DROP POLICY IF EXISTS "Anyone can submit event order" ON public.event_orders;
CREATE POLICY "Anyone can submit event order" ON public.event_orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage event orders" ON public.event_orders;
CREATE POLICY "Admins can manage event orders" ON public.event_orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. STORE SETTINGS: Public can read; Admins can update
DROP POLICY IF EXISTS "Anyone can view store settings" ON public.store_settings;
CREATE POLICY "Anyone can view store settings" ON public.store_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings" ON public.store_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. PROFILES: Authenticated users can view their profile; Admins can manage
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
CREATE POLICY "Admins can view profiles" ON public.profiles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- REALTIME CONFIGURATION
-- Enable realtime publication on orders and event_orders
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_orders;

-- SEED INITIAL DATA IF TABLES ARE EMPTY
-- Initial Store Settings
INSERT INTO public.store_settings (store_name, slogan, phone, whatsapp, email, address, opening_time, closing_time)
SELECT 'Tchemba', 'O Sabor que derrete.', '+244 939 779 057', '+244 939 779 057', 'tchembacrispy@gmail.com', '6PHR+VH8, R. Silva Porto, Huambo, Angola', '10:00', '23:30'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);

-- Initial Categories
INSERT INTO public.categories (id, name, slug, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Combos', 'combos', 1),
('c0000000-0000-0000-0000-000000000002', 'Cheese Drums', 'cheese-drums', 2),
('c0000000-0000-0000-0000-000000000003', 'Acompanhamentos', 'acompanhamentos', 3),
('c0000000-0000-0000-0000-000000000004', 'Bebidas', 'bebidas', 4),
('c0000000-0000-0000-0000-000000000005', 'Eventos', 'eventos', 5)
ON CONFLICT (slug) DO NOTHING;

-- Initial Products
INSERT INTO public.products (name, description, price, category_id, category_slug, badge, badge_type, pieces, is_consultation, is_featured, is_active) VALUES
('Crispy Alcides', '5 Cheese Drums + Refrigerante 500ml', 5100.00, 'c0000000-0000-0000-0000-000000000001', 'combos', 'Mais Pedido', 'top', '5 Peças', false, true, true),
('Crispy Cangahi', '5 Cheese Drums + Batata + Refrigerante 500ml', 5850.00, 'c0000000-0000-0000-0000-000000000001', 'combos', 'Popular', 'favorito', '5 Peças', false, true, true),
('Crispy Executivo', '8 Cheese Drums + Batata + Refrigerante 500ml', 8350.00, 'c0000000-0000-0000-0000-000000000001', 'combos', 'Executivo', 'especial', '8 Peças', false, true, true),
('Crispy Real', '10 Cheese Drums + 2 Refrigerantes 500ml + 3 Batatas', 12650.00, 'c0000000-0000-0000-0000-000000000001', 'combos', 'Combo Família', 'familia', '10 Peças', false, true, true),
('Cheese Drumstick', '4 unidades de coxas empanadas crocantes recheadas com queijo derretido no ponto perfeito.', 3700.00, 'c0000000-0000-0000-0000-000000000002', 'cheese-drums', 'Original Tchemba', 'original', '4 Peças', false, true, true),
('Frango Artesanal', 'Crocante e cremoso. Preparação artesanal com tempero especial da casa.', 0.00, 'c0000000-0000-0000-0000-000000000002', 'cheese-drums', 'Artesanal', 'especial', 'Especial', true, false, true),
('Batatas Fritas', 'Batatas cortadas e fritas na perfeição, estaladiças por fora e macias por dentro.', 900.00, 'c0000000-0000-0000-0000-000000000003', 'acompanhamentos', 'Acompanhamento', 'original', 'Porção', false, false, true),
('Coca-Cola 500ml', '500ml bem gelada para acompanhar a sua refeição com máxima refrescância.', 700.00, 'c0000000-0000-0000-0000-000000000004', 'bebidas', NULL, NULL, '500ml', false, false, true),
('Fanta Laranja 500ml', '500ml bem fresca, sabor frutada e efervescente.', 700.00, 'c0000000-0000-0000-0000-000000000004', 'bebidas', NULL, NULL, '500ml', false, false, true),
('Sprite 500ml', '500ml bem gelada com aquele toque cítrico revigorante.', 700.00, 'c0000000-0000-0000-0000-000000000004', 'bebidas', NULL, NULL, '500ml', false, false, true),
('Produção para Eventos – 20 Cheese Drums', 'Produção sob encomenda para aniversários, reuniões e convívios familiares. Entregue quente e estaladiço no Huambo.', 18100.00, 'c0000000-0000-0000-0000-000000000005', 'eventos', 'Por Encomenda', 'evento', '20 Peças', false, false, true),
('Produção para Eventos – 30 Cheese Drums', 'Bandeja generosa de 30 unidades artesanais com queijo derretido por dentro e crocância única.', 27500.00, 'c0000000-0000-0000-0000-000000000005', 'eventos', 'Por Encomenda', 'evento', '30 Peças', false, false, true),
('Produção para Eventos – 40 Cheese Drums', 'Perfeito para grandes confraternizações, aniversários e celebrações de amigos no Huambo.', 36600.00, 'c0000000-0000-0000-0000-000000000005', 'eventos', 'Por Encomenda', 'evento', '40 Peças', false, false, true),
('Produção para Eventos – 50 Cheese Drums', 'Produção em grande escala para celebrações com a máxima qualidade e entrega pontual.', 46000.00, 'c0000000-0000-0000-0000-000000000005', 'eventos', 'Por Encomenda', 'evento', '50 Peças', false, false, true)
ON CONFLICT DO NOTHING;

-- STORAGE BUCKET CREATION (Product Images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public view for product-images" ON storage.objects;
CREATE POLICY "Public view for product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product-images" ON storage.objects;
CREATE POLICY "Admins can upload product-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can update product-images" ON storage.objects;
CREATE POLICY "Admins can update product-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can delete product-images" ON storage.objects;
CREATE POLICY "Admins can delete product-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');
