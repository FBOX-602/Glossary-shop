-- ============================================================================
-- FreshMart Grocery eCommerce - Clean & Idempotent Supabase Database Schema
-- Project ID: hlrmvpbpqcjcmgithaff
-- ============================================================================

-- Step 1: Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 3: Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    brand TEXT DEFAULT 'FreshMart',
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    stock_quantity INT DEFAULT 100,
    in_stock BOOLEAN DEFAULT true,
    sku TEXT,
    image TEXT NOT NULL,
    weight_variants JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 4: Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    tag TEXT,
    button_text TEXT DEFAULT 'Shop Now',
    link TEXT DEFAULT 'pages/products/product-list/index.html',
    image TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 5: Settings & Contact Info Table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'global_settings',
    site_name TEXT DEFAULT 'FreshMart',
    currency TEXT DEFAULT '৳',
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 1000.00,
    delivery_fee NUMERIC(10, 2) DEFAULT 60.00,
    phone TEXT DEFAULT '+880 1700-000000',
    whatsapp TEXT DEFAULT '+880 1700-000001',
    email TEXT DEFAULT 'support@freshmart.bd',
    address TEXT DEFAULT 'House 42, Road 11, Block D, Banani, Dhaka-1213',
    business_hours TEXT DEFAULT '7:00 AM - 11:00 PM (Everyday)',
    facebook TEXT DEFAULT 'https://facebook.com/freshmart.bd',
    instagram TEXT DEFAULT 'https://instagram.com/freshmart.bd',
    twitter TEXT DEFAULT 'https://twitter.com/freshmart.bd',
    admin_password TEXT DEFAULT 'admin123',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 6: Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 7: Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT NOT NULL UNIQUE,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_address TEXT NOT NULL,
    customer_city TEXT DEFAULT 'Dhaka',
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    payment_status TEXT NOT NULL DEFAULT 'Pending',
    order_status TEXT NOT NULL DEFAULT 'Pending',
    subtotal NUMERIC(10, 2) NOT NULL,
    savings NUMERIC(10, 2) DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) DEFAULT 60.00,
    total NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 8: Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id TEXT NOT NULL REFERENCES public.orders(order_id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    quantity INT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 9: Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Step 10: Clean Drop Existing Policies if Re-running
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Banners" ON public.banners;
DROP POLICY IF EXISTS "Public Read Settings" ON public.settings;
DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Create/Update Customers" ON public.customers;
DROP POLICY IF EXISTS "Admin Full Access Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
DROP POLICY IF EXISTS "Admin Full Access Banners" ON public.banners;
DROP POLICY IF EXISTS "Admin Full Access Settings" ON public.settings;
DROP POLICY IF EXISTS "Admin Full Access Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Full Access Order Items" ON public.order_items;

-- Step 11: Create RLS Policies
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT USING (true);

CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create/Update Customers" ON public.customers FOR ALL USING (true);

CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin Full Access Banners" ON public.banners FOR ALL USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.settings FOR ALL USING (true);
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL USING (true);

-- Step 12: Initialize Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('banners', 'banners', true),
    ('products', 'products', true),
    ('categories', 'categories', true),
    ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Step 13: Storage RLS Policies
DROP POLICY IF EXISTS "Public Read Storage Banners" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Storage Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Storage Categories" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Storage Branding" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Storage Banners" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Storage Products" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Storage Categories" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Storage Branding" ON storage.objects;

CREATE POLICY "Public Read Storage Banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public Read Storage Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Read Storage Categories" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Public Read Storage Branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');

CREATE POLICY "Public Upload Storage Banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');
CREATE POLICY "Public Upload Storage Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Public Upload Storage Categories" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories');
CREATE POLICY "Public Upload Storage Branding" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'branding');
