-- ====================================================================
-- D FITNESS GYM: COMPLETE SUPABASE PERMISSIONS & RLS REPAIR MIGRATION
-- Run this script in: Supabase Dashboard -> SQL Editor -> Run
-- ====================================================================

-- 1. Ensure schema usage privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 2. Ensure Admin Table & Helper Authorization Function
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Administrator Accounts (Add your admin email here if different)
INSERT INTO public.admins (email, role)
VALUES 
  ('admin@dfitness.com', 'super_admin'),
  ('adilshoaibsarotiya@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Create secure SECURITY DEFINER function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  curr_email TEXT;
BEGIN
  -- Must be an authenticated user in Supabase Auth
  IF auth.role() <> 'authenticated' THEN
    RETURN FALSE;
  END IF;

  curr_email := LOWER(COALESCE(auth.jwt() ->> 'email', ''));

  -- 1. Check if user email or UUID exists in public.admins
  IF EXISTS (
    SELECT 1 FROM public.admins
    WHERE LOWER(admins.email) = curr_email
       OR admins.id = auth.uid()
  ) THEN
    RETURN TRUE;
  END IF;

  -- 2. Check user_metadata or app_metadata role in JWT
  IF (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'super_admin')
     OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'super_admin') THEN
    RETURN TRUE;
  END IF;

  -- 3. Predefined administrator emails fallback
  IF curr_email IN ('admin@dfitness.com', 'adilshoaibsarotiya@gmail.com') THEN
    RETURN TRUE;
  END IF;

  -- 4. If public.admins has zero rows, allow initial authenticated user bootstrap
  IF NOT EXISTS (SELECT 1 FROM public.admins) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- Grant execution on helper function
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- --------------------------------------------------------------------
-- 3. Ensure All Core Managed Tables Exist with Correct Columns
-- --------------------------------------------------------------------

-- MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.memberships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration TEXT DEFAULT '1 Month',
    duration_days INT DEFAULT 30,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all expected columns exist if table was created previously
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '1 Month';
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS duration_days INT DEFAULT 30;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 1;
ALTER TABLE public.memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Also support membership_plans table if present
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    billing_period TEXT NOT NULL,
    tagline TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended BOOLEAN DEFAULT false,
    highlight_text TEXT,
    gym_access TEXT,
    cardio_zone BOOLEAN DEFAULT true,
    strength_zone BOOLEAN DEFAULT true,
    trainer_support TEXT,
    personal_training TEXT,
    nutrition_guidance TEXT,
    locker_and_shower BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT,
    title TEXT NOT NULL,
    short_description TEXT,
    overview TEXT,
    who_it_is_for JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    training_approach JSONB DEFAULT '[]'::jsonb,
    typical_session JSONB DEFAULT '[]'::jsonb,
    difficulty TEXT,
    duration TEXT,
    frequency TEXT,
    image TEXT,
    category TEXT,
    featured BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRAINERS TABLE
CREATE TABLE IF NOT EXISTS public.trainers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    experience TEXT,
    specialization JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    bio TEXT,
    image TEXT,
    instagram TEXT,
    whatsapp TEXT,
    featured BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS & TRAINER_BOOKINGS TABLES
CREATE TABLE IF NOT EXISTS public.trainer_bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    trainer_id TEXT,
    trainer_name TEXT,
    program TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    fitness_goal TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    trainer_id TEXT,
    trainer_name TEXT,
    program TEXT,
    booking_date TEXT,
    preferred_date TEXT,
    booking_time TEXT,
    preferred_time TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CONTACTS & CONTACT_MESSAGES TABLES
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- LEADS & MEMBERSHIP_LEADS TABLES
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    goal TEXT,
    source TEXT DEFAULT 'website',
    message TEXT,
    selected_plan TEXT,
    trainer_name TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.membership_leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GALLERY, TRANSFORMATIONS, TESTIMONIALS, FAQS, SITE_SETTINGS
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    aspect_ratio TEXT DEFAULT 'square',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transformations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    goal TEXT,
    duration TEXT,
    training_type TEXT,
    story TEXT,
    metrics JSONB DEFAULT '{}'::jsonb,
    before_image TEXT NOT NULL,
    after_image TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_name TEXT NOT NULL,
    role_or_goal TEXT,
    rating INT DEFAULT 5,
    testimonial TEXT NOT NULL,
    date TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_settings',
    brand_name TEXT DEFAULT 'D FITNESS',
    tagline TEXT DEFAULT 'CARDIO | STRENGTH | WEIGHT LOSS',
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    opening_hours_weekday TEXT,
    opening_hours_weekend TEXT,
    maps_url TEXT,
    maps_embed_url TEXT,
    instagram TEXT,
    facebook TEXT,
    hero_headline TEXT,
    hero_subheadline TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. Explicit Table Permissions (GRANT) - Solves "permission denied"
-- --------------------------------------------------------------------
-- Authenticated role (logged in admins) gets full CRUD on all tables:
GRANT ALL ON TABLE public.memberships TO authenticated;
GRANT ALL ON TABLE public.membership_plans TO authenticated;
GRANT ALL ON TABLE public.programs TO authenticated;
GRANT ALL ON TABLE public.trainers TO authenticated;
GRANT ALL ON TABLE public.trainer_bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.contacts TO authenticated;
GRANT ALL ON TABLE public.contact_messages TO authenticated;
GRANT ALL ON TABLE public.leads TO authenticated;
GRANT ALL ON TABLE public.membership_leads TO authenticated;
GRANT ALL ON TABLE public.gallery TO authenticated;
GRANT ALL ON TABLE public.transformations TO authenticated;
GRANT ALL ON TABLE public.testimonials TO authenticated;
GRANT ALL ON TABLE public.faqs TO authenticated;
GRANT ALL ON TABLE public.site_settings TO authenticated;
GRANT ALL ON TABLE public.admins TO authenticated;

-- Grant sequence privileges to prevent serial ID generation errors
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- Anon role (public website visitors):
-- READ-ONLY for website content:
GRANT SELECT ON TABLE public.memberships TO anon;
GRANT SELECT ON TABLE public.membership_plans TO anon;
GRANT SELECT ON TABLE public.programs TO anon;
GRANT SELECT ON TABLE public.trainers TO anon;
GRANT SELECT ON TABLE public.gallery TO anon;
GRANT SELECT ON TABLE public.transformations TO anon;
GRANT SELECT ON TABLE public.testimonials TO anon;
GRANT SELECT ON TABLE public.faqs TO anon;
GRANT SELECT ON TABLE public.site_settings TO anon;

-- INSERT-ONLY for public lead/enquiry forms:
GRANT INSERT ON TABLE public.trainer_bookings TO anon;
GRANT INSERT ON TABLE public.bookings TO anon;
GRANT INSERT ON TABLE public.contacts TO anon;
GRANT INSERT ON TABLE public.contact_messages TO anon;
GRANT INSERT ON TABLE public.leads TO anon;
GRANT INSERT ON TABLE public.membership_leads TO anon;

-- --------------------------------------------------------------------
-- 5. Enable Row Level Security (RLS) & Define Granular Policies
-- --------------------------------------------------------------------

-- === MEMBERSHIPS ===
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view memberships" ON public.memberships;
DROP POLICY IF EXISTS "Public read memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow anon read memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admin manage memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admin select memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admin insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admin update memberships" ON public.memberships;
DROP POLICY IF EXISTS "Admin delete memberships" ON public.memberships;

-- 1. Public SELECT: Anyone (anonymous visitor or authenticated) can view memberships
CREATE POLICY "Public read memberships"
ON public.memberships FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Admin INSERT: Authenticated admin can insert new memberships
CREATE POLICY "Admin insert memberships"
ON public.memberships FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- 3. Admin UPDATE: Authenticated admin can update existing memberships
CREATE POLICY "Admin update memberships"
ON public.memberships FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Admin DELETE: Authenticated admin can delete memberships
CREATE POLICY "Admin delete memberships"
ON public.memberships FOR DELETE
TO authenticated
USING (public.is_admin());


-- === PROGRAMS ===
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view programs" ON public.programs;
DROP POLICY IF EXISTS "Public read programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;
DROP POLICY IF EXISTS "Admin manage programs" ON public.programs;
DROP POLICY IF EXISTS "Admin insert programs" ON public.programs;
DROP POLICY IF EXISTS "Admin update programs" ON public.programs;
DROP POLICY IF EXISTS "Admin delete programs" ON public.programs;

CREATE POLICY "Public read programs"
ON public.programs FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin insert programs"
ON public.programs FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update programs"
ON public.programs FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete programs"
ON public.programs FOR DELETE
TO authenticated
USING (public.is_admin());


-- === TRAINERS ===
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view trainers" ON public.trainers;
DROP POLICY IF EXISTS "Public read trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admins can manage trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admin manage trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admin insert trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admin update trainers" ON public.trainers;
DROP POLICY IF EXISTS "Admin delete trainers" ON public.trainers;

CREATE POLICY "Public read trainers"
ON public.trainers FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin insert trainers"
ON public.trainers FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update trainers"
ON public.trainers FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete trainers"
ON public.trainers FOR DELETE
TO authenticated
USING (public.is_admin());


-- === TRAINER BOOKINGS & BOOKINGS ===
ALTER TABLE public.trainer_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert booking" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Public insert trainer booking" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Admin manage trainer_bookings" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Admin select trainer_bookings" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Admin update trainer_bookings" ON public.trainer_bookings;
DROP POLICY IF EXISTS "Admin delete trainer_bookings" ON public.trainer_bookings;

-- Public can submit trial & trainer bookings
CREATE POLICY "Public insert trainer booking"
ON public.trainer_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin can read, update status, and delete bookings
CREATE POLICY "Admin select trainer_bookings"
ON public.trainer_bookings FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin update trainer_bookings"
ON public.trainer_bookings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete trainer_bookings"
ON public.trainer_bookings FOR DELETE
TO authenticated
USING (public.is_admin());

-- Bookings table policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin select bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin delete bookings" ON public.bookings;

CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin select bookings" ON public.bookings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.is_admin());


-- === CONTACTS & CONTACT_MESSAGES ===
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert contact" ON public.contacts;
DROP POLICY IF EXISTS "Public insert contact" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin select contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin update contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin delete contacts" ON public.contacts;

-- Public can submit enquiry messages
CREATE POLICY "Public insert contact"
ON public.contacts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admin can read, mark read/unread, and delete contacts
CREATE POLICY "Admin select contacts"
ON public.contacts FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin update contacts"
ON public.contacts FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete contacts"
ON public.contacts FOR DELETE
TO authenticated
USING (public.is_admin());

-- Contact messages policies
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin select contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin delete contact_messages" ON public.contact_messages;

CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin select contact_messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update contact_messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete contact_messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());


-- === LEADS & MEMBERSHIP LEADS ===
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
DROP POLICY IF EXISTS "Admin manage leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin manage leads" ON public.leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert membership_leads" ON public.membership_leads;
DROP POLICY IF EXISTS "Admin manage membership_leads" ON public.membership_leads;
CREATE POLICY "Public insert membership_leads" ON public.membership_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin manage membership_leads" ON public.membership_leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- === CONTENT TABLES (Gallery, Transformations, Testimonials, FAQs, Site Settings) ===
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin manage gallery" ON public.gallery;
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read transformations" ON public.transformations;
DROP POLICY IF EXISTS "Admin manage transformations" ON public.transformations;
CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage transformations" ON public.transformations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin manage testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Admin manage faqs" ON public.faqs;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin manage site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- === ADMINS TABLE ===
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin select admins" ON public.admins;
DROP POLICY IF EXISTS "Admin manage admins" ON public.admins;
CREATE POLICY "Admin select admins" ON public.admins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage admins" ON public.admins FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- --------------------------------------------------------------------
-- 6. Storage Buckets (Create public buckets if not existing)
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('gym-gallery', 'gym-gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('trainer-images', 'trainer-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('transformation-images', 'transformation-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-images', 'testimonial-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public read gym-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read trainer-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read transformation-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read testimonial-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin update objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete objects" ON storage.objects;

CREATE POLICY "Public read gym-gallery" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-gallery');
CREATE POLICY "Public read trainer-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'trainer-images');
CREATE POLICY "Public read transformation-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'transformation-images');
CREATE POLICY "Public read testimonial-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'testimonial-images');

CREATE POLICY "Admin upload objects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update objects" ON storage.objects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete objects" ON storage.objects FOR DELETE TO authenticated USING (public.is_admin());
