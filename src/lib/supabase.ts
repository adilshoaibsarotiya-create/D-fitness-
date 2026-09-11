import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) ||
  ''
).trim();

// Strip any trailing /rest/v1 or trailing slashes so Supabase JS constructs valid URLs
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

const supabaseKey = (
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)) ||
  (typeof process !== 'undefined' && process.env && (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)) ||
  ''
).trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl.includes('supabase.co')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
};

// Storage buckets matching prompt requirements
export const STORAGE_BUCKETS = {
  GALLERY: 'gym-gallery',
  TRAINERS: 'trainer-images',
  TRANSFORMATIONS: 'transformation-images',
  TESTIMONIALS: 'testimonial-images',
} as const;

export type StorageBucketKey = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// Storage upload helper
export const uploadFileToStorage = async (
  bucket: string,
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string | null; error: string | null }> => {
  const client = getSupabase();
  if (!client) {
    return { url: null, error: 'Supabase is not configured yet.' };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${cleanFolder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

    const { error: uploadError } = await client.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = client.storage.from(bucket).getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Storage upload failed' };
  }
};

// Storage deletion helper
export const deleteFileFromStorage = async (
  bucket: string,
  pathOrUrl: string
): Promise<{ success: boolean; error: string | null }> => {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Supabase is not configured yet.' };
  }

  try {
    // Extract relative path inside bucket if full public URL was passed
    let filePath = pathOrUrl;
    if (pathOrUrl.includes(`/storage/v1/object/public/${bucket}/`)) {
      filePath = pathOrUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
    } else if (pathOrUrl.startsWith('http')) {
      const parts = pathOrUrl.split(`/${bucket}/`);
      if (parts.length > 1) {
        filePath = parts[1];
      }
    }

    const { error } = await client.storage.from(bucket).remove([filePath]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Storage delete failed' };
  }
};

// List files in bucket
export const listStorageFiles = async (
  bucket: string,
  path: string = ''
): Promise<{ files: any[]; error: string | null }> => {
  const client = getSupabase();
  if (!client) {
    return { files: [], error: 'Supabase is not configured yet.' };
  }

  try {
    const { data, error } = await client.storage.from(bucket).list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) {
      return { files: [], error: error.message };
    }
    return { files: data || [], error: null };
  } catch (err: any) {
    return { files: [], error: err.message || 'Failed to list bucket files' };
  }
};

// Ready-to-copy SQL Schema for the user's Supabase project
export const SUPABASE_SETUP_SQL = `-- ==========================================================
-- D FITNESS Godda Database Schema for Supabase
-- Run this in Supabase Dashboard -> SQL Editor
-- ==========================================================

-- 1. Admins Table (Role-based admin access control)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial admin (replace with your admin email if needed)
INSERT INTO public.admins (email, role) 
VALUES ('admin@dfitness.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 2. Unified Leads & Specific Enquiry Tables
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    goal TEXT,
    source TEXT NOT NULL,
    message TEXT,
    selected_plan TEXT,
    trainer_name TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.free_trial_requests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    goal TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.membership_enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    selected_plan TEXT,
    preferred_date TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing membership_leads table
CREATE TABLE IF NOT EXISTS public.membership_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trainer_bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    trainer_name TEXT NOT NULL,
    preferred_date TEXT,
    preferred_time TEXT,
    fitness_goal TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Content Management Tables
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.trainers (
    id TEXT PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS public.membership_plans (
    id TEXT PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    aspect_ratio TEXT DEFAULT 'square',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transformations (
    id TEXT PRIMARY KEY,
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
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    role_or_goal TEXT,
    rating INT DEFAULT 5,
    testimonial TEXT NOT NULL,
    date TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
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

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_trial_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4b. Explicit Table Grants for Roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.membership_leads TO anon;
GRANT ALL ON public.membership_leads TO authenticated;

-- 5. Row Level Security Policies
-- Admins table: allow authenticated to read
CREATE POLICY "Allow authenticated read admins" ON public.admins FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated manage admins" ON public.admins FOR ALL TO authenticated USING (true);

-- Public Forms: Anyone can insert leads/enquiries
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert membership_leads" ON public.membership_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin manage membership_leads" ON public.membership_leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Public insert contact" ON public.contact_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert trial" ON public.free_trial_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert membership" ON public.membership_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert trainer booking" ON public.trainer_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Leads Read/Update: Public read for site checks, admin all
CREATE POLICY "Allow read on leads" ON public.leads FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow manage on leads" ON public.leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow manage contact" ON public.contact_enquiries FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow manage trial" ON public.free_trial_requests FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow manage membership" ON public.membership_enquiries FOR ALL TO anon, authenticated USING (true);
CREATE POLICY "Allow manage trainer booking" ON public.trainer_bookings FOR ALL TO anon, authenticated USING (true);

-- Public Read for Content (Programs, Trainers, Plans, Gallery, Testimonials, FAQs, Settings)
CREATE POLICY "Public read programs" ON public.programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read trainers" ON public.trainers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read membership_plans" ON public.membership_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- Authenticated Manage for Content
CREATE POLICY "Admin manage programs" ON public.programs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage trainers" ON public.trainers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage membership_plans" ON public.membership_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage transformations" ON public.transformations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage faqs" ON public.faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- 6. Storage Buckets (Create public buckets if not existing)
INSERT INTO storage.buckets (id, name, public) VALUES ('gym-gallery', 'gym-gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('trainer-images', 'trainer-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('transformation-images', 'transformation-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-images', 'testimonial-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Public read, authenticated upload/delete)
CREATE POLICY "Public read gym-gallery" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gym-gallery');
CREATE POLICY "Public read trainer-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'trainer-images');
CREATE POLICY "Public read transformation-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'transformation-images');
CREATE POLICY "Public read testimonial-images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'testimonial-images');

CREATE POLICY "Admin upload objects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update objects" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete objects" ON storage.objects FOR DELETE TO authenticated USING (true);
`;
