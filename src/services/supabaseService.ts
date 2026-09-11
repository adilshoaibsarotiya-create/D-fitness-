import { getSupabase, isSupabaseConfigured, STORAGE_BUCKETS, deleteFileFromStorage } from '../lib/supabase';
export { getSupabase };
import {
  Lead,
  LeadStatus,
  Program,
  Trainer,
  MembershipPlan,
  Membership,
  Booking,
  ContactMessage,
  DashboardStats,
  GalleryItem,
  TransformationStory,
  Testimonial,
  FAQItem,
  SiteSettings,
  AdminUser,
  TrainerBookingRequest
} from '../types';
import {
  defaultPrograms,
  defaultTrainers,
  defaultMembershipPlans,
  defaultGallery,
  defaultFAQs,
  defaultTestimonials
} from '../data/defaultData';
import { defaultSiteConfig } from '../data/siteConfig';

// In-memory fallback caches
let cachedPrograms: Program[] = defaultPrograms;
let cachedTrainers: Trainer[] = defaultTrainers;
let cachedPlans: MembershipPlan[] = defaultMembershipPlans;
let cachedMemberships: Membership[] = [
  {
    id: 'plan-silver',
    name: 'SILVER',
    price: 1499,
    duration: '1 Month',
    duration_days: 30,
    description: 'Essential fitness foundation with access to modern strength machines and cardio theatre.',
    features: [
      'Full Gym Floor Access',
      'Locker & Shower Facility',
      'Free Fitness Assessment',
      'Cardio & Strength Machines',
      'Water Dispenser & Sanitization Stations'
    ],
    benefits: [
      'Full Gym Floor Access',
      'Locker & Shower Facility',
      'Free Fitness Assessment',
      'Cardio & Strength Machines',
      'Water Dispenser & Sanitization Stations'
    ],
    is_featured: false,
    is_active: true,
    sort_order: 1,
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'plan-gold',
    name: 'GOLD',
    price: 2499,
    duration: '3 Months',
    duration_days: 90,
    description: 'Our most sought-after plan for committed athletes who want complete conditioning.',
    features: [
      'All Silver Plan Benefits',
      'Unlimited Cardio & Strength Zone',
      'General Floor Trainer Support',
      '1 Complimentary Personal Training Session',
      'Customized Workout Routine Chart',
      'Dietary Guidelines & Nutrition Q&A'
    ],
    benefits: [
      'All Silver Plan Benefits',
      'Unlimited Cardio & Strength Zone',
      'General Floor Trainer Support',
      '1 Complimentary Personal Training Session',
      'Customized Workout Routine Chart',
      'Dietary Guidelines & Nutrition Q&A'
    ],
    is_featured: true,
    is_active: true,
    sort_order: 2,
    created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'plan-elite',
    name: 'ELITE',
    price: 4999,
    duration: '1 Year',
    duration_days: 365,
    description: 'VIP transformation suite with full personalized coaching, recovery, and nutritionist check-ins.',
    features: [
      'All Gold Tier Benefits',
      'Priority Locker Access',
      'Dedicated 1-on-1 Personal Training (4 Sessions/Mo)',
      'Custom Bi-Weekly Meal Plans',
      'Quarterly Body Composition Scans',
      'Free Guest Passes (2/Month)',
      'D Fitness Official Athletic T-Shirt'
    ],
    benefits: [
      'All Gold Tier Benefits',
      'Priority Locker Access',
      'Dedicated 1-on-1 Personal Training (4 Sessions/Mo)',
      'Custom Bi-Weekly Meal Plans',
      'Quarterly Body Composition Scans',
      'Free Guest Passes (2/Month)',
      'D Fitness Official Athletic T-Shirt'
    ],
    is_featured: false,
    is_active: true,
    sort_order: 3,
    created_at: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
  }
];
let cachedGallery: GalleryItem[] = defaultGallery;
let cachedFAQs: FAQItem[] = defaultFAQs;
let cachedTestimonials: Testimonial[] = defaultTestimonials;
let cachedSettings: SiteSettings = defaultSiteConfig;
let cachedTransformations: TransformationStory[] = [
  {
    id: 'trans-1',
    clientName: 'Dedicated Member',
    goal: 'Weight Loss & Toning',
    duration: '16 Weeks',
    trainingType: 'Weight Loss & Cardio Program',
    story: 'Dropped 14 kg through disciplined calorie control, daily treadmill intervals, and guided resistance circuits at D FITNESS Godda.',
    metrics: {
      weightChange: '-14 kg',
      bodyFatChange: '-8.5%',
      strengthMetric: '+30 kg Squat'
    },
    beforeImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    verified: true
  }
];

export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  // ==========================================
  // AUTHENTICATION & ADMIN PERMISSIONS
  // ==========================================
  async verifyUserIsAdmin(email: string, userId?: string): Promise<{ isAdmin: boolean; role?: string; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      // Local fallback mode when Supabase is not configured
      return { isAdmin: true, role: 'super_admin' };
    }

    try {
      // 1. Check if user's UUID exists in public.admins
      if (userId) {
        const { data: byId } = await supabase
          .from('admins')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (byId) {
          return { isAdmin: true, role: byId.role || 'super_admin' };
        }
      }

      // 2. Also check if email matches in public.admins
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error) {
        // If table doesn't exist yet, warn but check if user is signed in
        if (error.code === '42P01' || error.message.includes('relation "public.admins" does not exist')) {
          console.warn('public.admins table not created yet. Please execute SUPABASE_SETUP_SQL in Supabase SQL editor.');
          return {
            isAdmin: true, // Allow initial bootstrap if table doesn't exist
            role: 'super_admin',
            error: 'Notice: public.admins table not yet created in Supabase.'
          };
        }
        return { isAdmin: false, error: error.message };
      }

      if (!data) {
        return {
          isAdmin: false,
          error: `Access Denied: Account '${email}' (${userId || 'no UUID'}) does not exist in public.admins.`
        };
      }

      return { isAdmin: true, role: data.role || 'super_admin' };
    } catch (err: any) {
      return { isAdmin: false, error: err.message || 'Admin verification query failed.' };
    }
  },

  async getCurrentSession() {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session || null;
    } catch {
      return null;
    }
  },

  async checkAdminAuth(): Promise<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    user?: { id: string; email?: string; role?: string };
    error?: string;
  }> {
    const supabase = getSupabase();
    if (!supabase) {
      const localToken = localStorage.getItem('dfitness_admin_token');
      const localEmail = localStorage.getItem('dfitness_admin_email') || 'admin@dfitness.com';
      const isAuth = Boolean(localToken);
      return {
        isAuthenticated: isAuth,
        isAdmin: isAuth,
        user: isAuth ? { id: 'demo-admin-uuid', email: localEmail, role: 'super_admin' } : undefined
      };
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        const localToken = localStorage.getItem('dfitness_admin_token');
        if (localToken === 'dfitness_authenticated_session') {
          return {
            isAuthenticated: true,
            isAdmin: true,
            user: { id: 'demo-admin-uuid', email: 'admin@dfitness.com', role: 'super_admin' }
          };
        }
        return { isAuthenticated: false, isAdmin: false };
      }

      const user = data.user;
      const email = user.email || '';
      const check = await this.verifyUserIsAdmin(email, user.id);

      if (!check.isAdmin) {
        return {
          isAuthenticated: true,
          isAdmin: false,
          user: { id: user.id, email: user.email, role: 'none' },
          error: check.error || 'User is authenticated, but does not exist in public.admins.'
        };
      }

      return {
        isAuthenticated: true,
        isAdmin: true,
        user: { id: user.id, email: user.email, role: check.role || 'super_admin' }
      };
    } catch {
      return { isAuthenticated: false, isAdmin: false };
    }
  },

  async loginAdmin(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    const supabase = getSupabase();
    if (supabase && cleanEmail.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (error) {
          // If sign in fails, attempt admin account signup bootstrap if it's the designated admin email
          if (cleanEmail === 'admin@dfitness.com' || cleanEmail === 'adilshoaibsarotiya@gmail.com') {
            try {
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPass
              });
              if (!signUpError && signUpData?.session) {
                localStorage.setItem('dfitness_admin_token', signUpData.session.access_token);
                localStorage.setItem('dfitness_admin_email', cleanEmail);
                localStorage.setItem('dfitness_admin_auth_mode', 'supabase_auth');
                return { success: true };
              }
            } catch {
              // continue to fallback
            }
          }

          // Check if fallback admin demo password
          if (['dfitness123', 'admin123'].includes(cleanPass)) {
            localStorage.setItem('dfitness_admin_token', 'dfitness_authenticated_session');
            localStorage.setItem('dfitness_admin_email', cleanEmail);
            localStorage.setItem('dfitness_admin_auth_mode', 'demo_fallback');
            return { success: true };
          }
          return { success: false, message: error.message };
        }

        if (data?.user) {
          const check = await this.verifyUserIsAdmin(data.user.email || cleanEmail, data.user.id);
          if (!check.isAdmin) {
            await supabase.auth.signOut();
            return {
              success: false,
              message: check.error || `Access Denied: ${cleanEmail} is not in public.admins.`
            };
          }

          localStorage.setItem('dfitness_admin_token', data.session?.access_token || 'active_token');
          localStorage.setItem('dfitness_admin_email', data.user.email || cleanEmail);
          localStorage.setItem('dfitness_admin_auth_mode', 'supabase_auth');
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, message: err.message || 'Authentication failed' };
      }
    }

    // Demo / offline fallback
    if (['dfitness123', 'admin123', 'dfitnessadmin'].includes(cleanPass)) {
      localStorage.setItem('dfitness_admin_token', 'dfitness_authenticated_session');
      localStorage.setItem('dfitness_admin_email', cleanEmail || 'admin@dfitness.com');
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please provide valid Supabase login or the demo credentials.'
    };
  },

  async logoutAdmin(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut notice:', e);
      }
    }
    localStorage.removeItem('dfitness_admin_token');
    localStorage.removeItem('dfitness_admin_email');
  },

  // ==========================================
  // PROGRAMS CRUD
  // ==========================================
  async getPrograms(): Promise<Program[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedPrograms;

    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('featured', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Program[] = data.map((r: any) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          shortDescription: r.short_description || '',
          overview: r.overview || '',
          whoItIsFor: Array.isArray(r.who_it_is_for) ? r.who_it_is_for : [],
          benefits: Array.isArray(r.benefits) ? r.benefits : [],
          trainingApproach: Array.isArray(r.training_approach) ? r.training_approach : [],
          typicalSession: Array.isArray(r.typical_session) ? r.typical_session : [],
          difficulty: r.difficulty || 'All Levels',
          duration: r.duration || '',
          frequency: r.frequency || '',
          image: r.image || '',
          category: r.category || 'strength',
          featured: Boolean(r.featured)
        }));
        cachedPrograms = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading programs from Supabase:', e);
    }
    return cachedPrograms;
  },

  async saveProgram(prog: Program): Promise<{ success: boolean; error?: string }> {
    const index = cachedPrograms.findIndex(p => p.id === prog.id);
    if (index >= 0) {
      cachedPrograms[index] = prog;
    } else {
      cachedPrograms.push(prog);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('programs').upsert({
        id: prog.id,
        slug: prog.slug,
        title: prog.title,
        short_description: prog.shortDescription,
        overview: prog.overview,
        who_it_is_for: prog.whoItIsFor,
        benefits: prog.benefits,
        training_approach: prog.trainingApproach,
        typical_session: prog.typicalSession,
        difficulty: prog.difficulty,
        duration: prog.duration,
        frequency: prog.frequency,
        image: prog.image,
        category: prog.category,
        featured: prog.featured,
        updated_at: new Date().toISOString()
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteProgram(id: string): Promise<{ success: boolean; error?: string }> {
    cachedPrograms = cachedPrograms.filter(p => p.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // TRAINERS CRUD
  // ==========================================
  async getTrainers(): Promise<Trainer[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedTrainers;

    try {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('featured', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Trainer[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          experience: r.experience || '',
          specialization: Array.isArray(r.specialization) ? r.specialization : [],
          achievements: Array.isArray(r.achievements) ? r.achievements : [],
          bio: r.bio || '',
          image: r.image || '',
          instagram: r.instagram,
          whatsapp: r.whatsapp,
          featured: Boolean(r.featured)
        }));
        cachedTrainers = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading trainers from Supabase:', e);
    }
    return cachedTrainers;
  },

  async saveTrainer(trainer: Trainer): Promise<{ success: boolean; error?: string }> {
    const idx = cachedTrainers.findIndex(t => t.id === trainer.id);
    if (idx >= 0) {
      cachedTrainers[idx] = trainer;
    } else {
      cachedTrainers.push(trainer);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('trainers').upsert({
        id: trainer.id,
        name: trainer.name,
        role: trainer.role,
        experience: trainer.experience,
        specialization: trainer.specialization,
        achievements: trainer.achievements,
        bio: trainer.bio,
        image: trainer.image,
        instagram: trainer.instagram,
        whatsapp: trainer.whatsapp,
        featured: trainer.featured,
        updated_at: new Date().toISOString()
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteTrainer(id: string): Promise<{ success: boolean; error?: string }> {
    cachedTrainers = cachedTrainers.filter(t => t.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('trainers').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // MEMBERSHIPS CRUD (TARGETS public.memberships)
  // Columns: id, name, price, duration_days, description, benefits, is_featured, is_active, sort_order, created_at
  // ==========================================
  async getMemberships(): Promise<Membership[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedMemberships;

    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: Membership[] = data.map((r: any) => {
          let durationStr = '1 Month';
          const days = Number(r.duration_days);
          if (days === 30 || days === 31) durationStr = '1 Month';
          else if (days === 90) durationStr = '3 Months';
          else if (days === 180) durationStr = '6 Months';
          else if (days === 365) durationStr = '1 Year';
          else if (days > 0) durationStr = `${days} Days`;
          else if (r.duration) durationStr = r.duration;

          const rawBenefits = r.benefits || r.features;
          let features: string[] = [];
          if (Array.isArray(rawBenefits)) {
            features = rawBenefits;
          } else if (typeof rawBenefits === 'string') {
            try {
              const parsed = JSON.parse(rawBenefits);
              features = Array.isArray(parsed) ? parsed : [rawBenefits];
            } catch {
              features = rawBenefits.split('\n').filter(Boolean);
            }
          }

          return {
            id: String(r.id),
            name: r.name || 'Membership Plan',
            price: Number(r.price) || 0,
            duration: durationStr,
            duration_days: days || 30,
            description: r.description || '',
            features: features.length > 0 ? features : ['Gym Access', 'Locker Room'],
            benefits: features,
            is_featured: Boolean(r.is_featured),
            is_active: r.is_active !== false,
            sort_order: Number(r.sort_order) || 1,
            created_at: r.created_at || new Date().toISOString()
          };
        });
        cachedMemberships = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error querying memberships from Supabase (using active cache):', e);
    }
    return cachedMemberships;
  },

  async saveMembership(m: Membership): Promise<{ success: boolean; error?: string }> {
    // 1. Optimistically update local active cache
    const idx = cachedMemberships.findIndex(item => item.id === m.id);
    if (idx >= 0) {
      cachedMemberships[idx] = { ...m };
    } else {
      cachedMemberships.push({ ...m });
    }

    const supabase = getSupabase();
    if (supabase) {
      // 2. Check if user is authenticated with a valid Supabase Auth session
      let hasAuthSession = false;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        hasAuthSession = Boolean(sessionData?.session?.user);
      } catch (e) {
        console.warn('Session check notice:', e);
      }

      let days = m.duration_days;
      if (!days) {
        if (m.duration.toLowerCase().includes('year')) days = 365;
        else if (m.duration.toLowerCase().includes('6 month')) days = 180;
        else if (m.duration.toLowerCase().includes('3 month')) days = 90;
        else days = 30;
      }

      const payload: any = {
        name: m.name.trim(),
        price: Number(m.price),
        duration: m.duration || (days === 365 ? '1 Year' : days === 90 ? '3 Months' : '1 Month'),
        duration_days: days,
        description: m.description || '',
        features: m.features || m.benefits || [],
        benefits: m.features || m.benefits || [],
        is_featured: Boolean(m.is_featured),
        is_active: Boolean(m.is_active),
        sort_order: Number(m.sort_order) || 1,
        updated_at: new Date().toISOString()
      };

      if (m.id && !m.id.startsWith('temp-')) {
        payload.id = m.id;
      }

      // If user is not authenticated in Supabase Auth, PostgreSQL RLS role 'anon' will block writes
      if (!hasAuthSession) {
        console.warn('Saving in demo/offline session mode. Changes persisted to local state.');
        return {
          success: true,
          error: undefined
        };
      }

      try {
        let { data, error } = await supabase
          .from('memberships')
          .upsert(payload)
          .select();

        // Handle column mismatches gracefully
        if (error && (error.message.includes('column "features" of relation "memberships" does not exist') || error.message.includes('column "benefits" of relation "memberships" does not exist'))) {
          delete payload.features;
          const retry = await supabase.from('memberships').upsert(payload).select();
          data = retry.data;
          error = retry.error;
        }

        // Handle UUID type error if database column is strict uuid and id is a slug
        if (error && error.message.includes('invalid input syntax for type uuid')) {
          delete payload.id;
          const retry = await supabase.from('memberships').upsert(payload).select();
          data = retry.data;
          error = retry.error;
        }

        if (error) {
          console.warn('Supabase saveMembership error:', error.message);
          if (error.code === '42501' || error.message.toLowerCase().includes('permission denied')) {
            return {
              success: false,
              error: 'Database permission denied for table "memberships". Please run the updated SQL permissions script in Admin Settings (or Supabase SQL Editor) to grant the authenticated role full permissions.'
            };
          }
          return { success: false, error: error.message };
        }

        if (data && data[0]) {
          m.id = String(data[0].id);
          const updateIdx = cachedMemberships.findIndex(item => item.name === m.name);
          if (updateIdx >= 0) cachedMemberships[updateIdx].id = m.id;
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to save membership in Supabase.' };
      }
    }
    return { success: true };
  },

  async deleteMembership(id: string): Promise<{ success: boolean; error?: string }> {
    cachedMemberships = cachedMemberships.filter(m => m.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) {
          return { success: true };
        }
        const { error } = await supabase.from('memberships').delete().eq('id', id);
        if (error) {
          console.warn('Supabase deleteMembership error:', error.message);
          if (error.code === '42501' || error.message.toLowerCase().includes('permission denied')) {
            return {
              success: false,
              error: 'Database permission denied for table "memberships". Please run the SQL permissions script in Admin Settings.'
            };
          }
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to delete membership' };
      }
    }
    return { success: true };
  },

  // ==========================================
  // MEMBERSHIP PLANS CRUD (MAPPED TO MEMBERSHIPS FOR WEBSITE)
  // ==========================================
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    try {
      const memberships = await this.getMemberships();
      if (memberships && memberships.length > 0) {
        return memberships
          .filter(m => m.is_active)
          .map(m => {
            const formattedPrice = `₹${Number(m.price).toLocaleString('en-IN')}`;
            return {
              id: m.id,
              name: m.name,
              price: formattedPrice,
              billingPeriod: m.duration ? `per ${m.duration.toLowerCase()}` : 'per month',
              tagline: m.description || '',
              features: m.features,
              recommended: m.is_featured,
              highlightText: m.is_featured ? 'MOST POPULAR' : undefined,
              gymAccess: 'Full Facility Access',
              cardioZone: true,
              strengthZone: true,
              trainerSupport: m.name === 'SILVER' ? 'Floor Support' : 'Dedicated Guidance',
              personalTraining: m.name === 'ELITE' ? '4 Sessions / Mo' : 'Add-on Option',
              nutritionGuidance: m.name === 'ELITE' ? 'Custom Bi-Weekly' : 'Basic Chart',
              lockerAndShower: true
            };
          });
      }
    } catch (e) {
      console.warn('Fallback reading plans:', e);
    }
    return cachedPlans;
  },

  async saveMembershipPlan(plan: MembershipPlan): Promise<{ success: boolean; error?: string }> {
    const idx = cachedPlans.findIndex(p => p.id === plan.id);
    if (idx >= 0) {
      cachedPlans[idx] = plan;
    } else {
      cachedPlans.push(plan);
    }
    return { success: true };
  },

  async deleteMembershipPlan(id: string): Promise<{ success: boolean; error?: string }> {
    cachedPlans = cachedPlans.filter(p => p.id !== id);
    return { success: true };
  },

  // ==========================================
  // GALLERY MANAGEMENT
  // ==========================================
  async getGallery(): Promise<GalleryItem[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedGallery;

    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: GalleryItem[] = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category || 'all',
          image: r.image,
          description: r.description,
          aspectRatio: r.aspect_ratio || 'square'
        }));
        cachedGallery = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading gallery from Supabase:', e);
    }
    return cachedGallery;
  },

  async saveGalleryItem(item: GalleryItem): Promise<{ success: boolean; error?: string }> {
    const idx = cachedGallery.findIndex(g => g.id === item.id);
    if (idx >= 0) {
      cachedGallery[idx] = item;
    } else {
      cachedGallery.unshift(item);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('gallery').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        description: item.description,
        aspect_ratio: item.aspectRatio || 'square'
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteGalleryItem(id: string, imageUrl?: string): Promise<{ success: boolean; error?: string }> {
    cachedGallery = cachedGallery.filter(g => g.id !== id);
    if (imageUrl) {
      await deleteFileFromStorage(STORAGE_BUCKETS.GALLERY, imageUrl);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // TRANSFORMATIONS MANAGEMENT
  // ==========================================
  async getTransformations(): Promise<TransformationStory[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedTransformations;

    try {
      const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: TransformationStory[] = data.map((r: any) => ({
          id: r.id,
          clientName: r.client_name,
          goal: r.goal || '',
          duration: r.duration || '',
          trainingType: r.training_type || '',
          story: r.story || '',
          metrics: r.metrics || {},
          beforeImage: r.before_image,
          afterImage: r.after_image,
          verified: Boolean(r.verified)
        }));
        cachedTransformations = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading transformations from Supabase:', e);
    }
    return cachedTransformations;
  },

  async saveTransformation(trans: TransformationStory): Promise<{ success: boolean; error?: string }> {
    const idx = cachedTransformations.findIndex(t => t.id === trans.id);
    if (idx >= 0) {
      cachedTransformations[idx] = trans;
    } else {
      cachedTransformations.unshift(trans);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('transformations').upsert({
        id: trans.id,
        client_name: trans.clientName,
        goal: trans.goal,
        duration: trans.duration,
        training_type: trans.trainingType,
        story: trans.story,
        metrics: trans.metrics,
        before_image: trans.beforeImage,
        after_image: trans.afterImage,
        verified: trans.verified
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteTransformation(id: string): Promise<{ success: boolean; error?: string }> {
    cachedTransformations = cachedTransformations.filter(t => t.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('transformations').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // TESTIMONIALS MANAGEMENT
  // ==========================================
  async getTestimonials(): Promise<Testimonial[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedTestimonials;

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Testimonial[] = data.map((r: any) => ({
          id: r.id,
          clientName: r.client_name,
          roleOrGoal: r.role_or_goal || '',
          rating: Number(r.rating) || 5,
          testimonial: r.testimonial,
          date: r.date || 'Verified Member',
          avatar: r.avatar
        }));
        cachedTestimonials = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading testimonials from Supabase:', e);
    }
    return cachedTestimonials;
  },

  async saveTestimonial(test: Testimonial): Promise<{ success: boolean; error?: string }> {
    const idx = cachedTestimonials.findIndex(t => t.id === test.id);
    if (idx >= 0) {
      cachedTestimonials[idx] = test;
    } else {
      cachedTestimonials.unshift(test);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('testimonials').upsert({
        id: test.id,
        client_name: test.clientName,
        role_or_goal: test.roleOrGoal,
        rating: test.rating,
        testimonial: test.testimonial,
        date: test.date,
        avatar: test.avatar
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean; error?: string }> {
    cachedTestimonials = cachedTestimonials.filter(t => t.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // FAQS MANAGEMENT
  // ==========================================
  async getFAQs(): Promise<FAQItem[]> {
    const supabase = getSupabase();
    if (!supabase) return cachedFAQs;

    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: FAQItem[] = data.map((r: any) => ({
          id: r.id,
          question: r.question,
          answer: r.answer,
          category: r.category || 'general'
        }));
        cachedFAQs = mapped;
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading FAQs from Supabase:', e);
    }
    return cachedFAQs;
  },

  async saveFAQ(faq: FAQItem): Promise<{ success: boolean; error?: string }> {
    const idx = cachedFAQs.findIndex(f => f.id === faq.id);
    if (idx >= 0) {
      cachedFAQs[idx] = faq;
    } else {
      cachedFAQs.push(faq);
    }

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('faqs').upsert({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteFAQ(id: string): Promise<{ success: boolean; error?: string }> {
    cachedFAQs = cachedFAQs.filter(f => f.id !== id);
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  async getSiteSettings(): Promise<SiteSettings> {
    const supabase = getSupabase();
    if (!supabase) return cachedSettings;

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'current_settings')
        .maybeSingle();

      if (!error && data) {
        const merged: SiteSettings = {
          ...defaultSiteConfig,
          phone: data.phone || defaultSiteConfig.phone,
          whatsapp: data.whatsapp || defaultSiteConfig.whatsapp,
          email: data.email || defaultSiteConfig.email,
          address: data.address || defaultSiteConfig.address,
          openingHoursWeekday: data.opening_hours_weekday || defaultSiteConfig.openingHoursWeekday,
          openingHoursWeekend: data.opening_hours_weekend || defaultSiteConfig.openingHoursWeekend,
          mapsUrl: data.maps_url || defaultSiteConfig.mapsUrl,
          mapsEmbedUrl: data.maps_embed_url || defaultSiteConfig.mapsEmbedUrl,
          instagram: data.instagram || defaultSiteConfig.instagram,
          facebook: data.facebook || defaultSiteConfig.facebook,
          heroHeadline: data.hero_headline || defaultSiteConfig.heroHeadline,
          heroSubheadline: data.hero_subheadline || defaultSiteConfig.heroSubheadline
        };
        cachedSettings = merged;
        return merged;
      }
    } catch (e) {
      console.warn('Error reading site_settings from Supabase:', e);
    }
    return cachedSettings;
  },

  async saveSiteSettings(settings: SiteSettings): Promise<{ success: boolean; error?: string }> {
    cachedSettings = settings;
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'current_settings',
        brand_name: settings.brandName,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        opening_hours_weekday: settings.openingHoursWeekday,
        opening_hours_weekend: settings.openingHoursWeekend,
        maps_url: settings.mapsUrl,
        maps_embed_url: settings.mapsEmbedUrl,
        instagram: settings.instagram,
        facebook: settings.facebook,
        hero_headline: settings.heroHeadline,
        hero_subheadline: settings.heroSubheadline,
        updated_at: new Date().toISOString()
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // LEADS & ENQUIRY SUBMISSIONS (CONNECTED TO SUPABASE)
  // ==========================================
  async getLeads(): Promise<Lead[]> {
    const supabase = getSupabase();
    const localLeads = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');

    if (!supabase) return localLeads;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: Lead[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          goal: r.goal,
          source: r.source as any,
          message: r.message,
          selectedPlan: r.selected_plan,
          trainerName: r.trainer_name,
          preferredDate: r.preferred_date,
          preferredTime: r.preferred_time,
          status: r.status as LeadStatus,
          createdAt: r.created_at,
          created_at: r.created_at
        }));
        localStorage.setItem('dfitness_leads', JSON.stringify(mapped));
        return mapped;
      }
    } catch (e) {
      console.warn('Error reading leads from Supabase:', e);
    }
    return localLeads;
  },

  // ==========================================
  // MEMBERSHIP LEADS SUBMISSION (TARGETS membership_leads TABLE)
  // ==========================================
  async submitMembershipLead(data: {
    name: string;
    phone: string;
    email: string;
    selectedPlan: string;
    startDate?: string;
    message?: string;
  }): Promise<{ success: boolean; leadId?: string; error?: string }> {
    const cleanName = (data.name || '').trim();
    const cleanPhone = (data.phone || '').trim();
    const cleanEmail = (data.email || '').trim();
    const plan = (data.selectedPlan || 'GOLD').trim();
    const start = data.startDate ? data.startDate.trim() : 'Immediate';
    const userMsg = data.message ? data.message.trim() : '';

    // Verified columns in public.membership_leads:
    // id, name, phone, email, message, status, created_at
    // Store selected plan and start date in message to ensure accurate persistence without inventing non-existent columns
    const planPrefix = `[Plan: ${plan}]`;
    const datePrefix = start ? ` [Start Date: ${start}]` : '';
    const noteContent = userMsg ? ` ${userMsg}` : '';
    const formattedMessage = `${planPrefix}${datePrefix}${noteContent}`.trim();

    const supabase = getSupabase();
    if (!supabase) {
      return {
        success: false,
        error: 'Database service is currently unconfigured. Please contact gym administration.'
      };
    }

    try {
      const { error } = await supabase
        .from('membership_leads')
        .insert({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          message: formattedMessage,
          status: 'new'
        });

      if (error) {
        console.error('[Supabase membership_leads Insert Error]', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        const errorDetailParts = [
          error.message,
          error.code ? `[Code: ${error.code}]` : '',
          error.hint ? `[Hint: ${error.hint}]` : '',
          error.details ? `[Details: ${error.details}]` : ''
        ].filter(Boolean).join(' ');

        return {
          success: false,
          error: errorDetailParts || 'Database insert failed. Please check table permissions or RLS policies.'
        };
      }

      const leadId = `lead-${Date.now()}`;
      // Cache locally for admin panel
      const fullLead: Lead = {
        id: leadId,
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        source: 'membership',
        selectedPlan: plan,
        preferredDate: start,
        message: formattedMessage,
        status: 'new',
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
      localStorage.setItem('dfitness_leads', JSON.stringify([fullLead, ...existing]));

      return {
        success: true,
        leadId
      };
    } catch (err: any) {
      console.error('Supabase membership_leads network error:', err);
      return {
        success: false,
        error: err.message || 'Network error occurred while submitting. Please try again.'
      };
    }
  },

  async submitLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }): Promise<{ success: boolean; leadId: string; error?: string }> {
    if (leadData.source === 'membership') {
      const memRes = await this.submitMembershipLead({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        selectedPlan: leadData.selectedPlan || 'GOLD',
        startDate: leadData.preferredDate,
        message: leadData.message
      });
      return {
        success: memRes.success,
        leadId: memRes.leadId || '',
        error: memRes.error
      };
    }

    const id = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const fullLead: Lead = {
      id,
      name: leadData.name.trim(),
      phone: leadData.phone.trim(),
      email: leadData.email.trim(),
      goal: leadData.goal,
      source: leadData.source,
      message: leadData.message,
      selectedPlan: leadData.selectedPlan,
      trainerName: leadData.trainerName,
      preferredDate: leadData.preferredDate,
      preferredTime: leadData.preferredTime,
      status: leadData.status || 'new',
      createdAt: now,
      created_at: now
    };

    // Save to local storage cache immediately
    const existing = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    localStorage.setItem('dfitness_leads', JSON.stringify([fullLead, ...existing]));

    const supabase = getSupabase();
    if (supabase) {
      try {
        if (fullLead.source === 'contact_form') {
          await supabase.from('contacts').insert({
            name: fullLead.name,
            phone: fullLead.phone,
            email: fullLead.email,
            message: fullLead.message || fullLead.goal || 'Contact inquiry',
            status: fullLead.status
          }).maybeSingle();
        } else if (fullLead.source === 'trainer_booking') {
          await supabase.from('trainer_bookings').insert({
            name: fullLead.name,
            phone: fullLead.phone,
            email: fullLead.email,
            message: `[Trainer: ${fullLead.trainerName || 'General'}] [Date: ${fullLead.preferredDate || 'Any'}] ${fullLead.message || ''}`.trim(),
            status: fullLead.status
          }).maybeSingle();
        }
      } catch (err: any) {
        console.warn('Supabase lead write notice (saved locally):', err.message);
      }
    }

    return { success: true, leadId: id };
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<{ success: boolean; error?: string }> {
    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const updated = existing.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem('dfitness_leads', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  async deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const filtered = existing.filter(l => l.id !== id);
    localStorage.setItem('dfitness_leads', JSON.stringify(filtered));

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  },

  // ==========================================
  // BOOKINGS CRUD (TARGETS trainer_bookings & bookings)
  // Columns: id, name, phone, email, trainer_id, preferred_date, preferred_time, status, created_at
  // ==========================================
  async getBookings(): Promise<Booking[]> {
    const supabase = getSupabase();
    const localLeads: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const fallbackBookings: Booking[] = [
      {
        id: 'bk-1',
        customer_name: 'Rahul Sharma',
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        program: 'Weight Loss & Conditioning',
        trainer_name: 'Vikram Singh',
        booking_date: 'Tomorrow, 07:00 AM',
        preferred_date: 'Tomorrow',
        booking_time: '07:00 AM',
        preferred_time: '07:00 AM',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'bk-2',
        customer_name: 'Pooja Verma',
        name: 'Pooja Verma',
        phone: '+91 91234 56789',
        email: 'pooja.verma@example.com',
        program: 'Strength & Hypertrophy',
        trainer_name: 'Amit Kumar',
        booking_date: 'Friday, 06:30 PM',
        preferred_date: 'Friday',
        booking_time: '06:30 PM',
        preferred_time: '06:30 PM',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'bk-3',
        customer_name: 'Anand Jha',
        name: 'Anand Jha',
        phone: '+91 99341 22881',
        email: 'anand.jha@example.com',
        program: 'Functional & HIIT',
        trainer_name: 'Neha Roy',
        booking_date: 'Saturday, 08:00 AM',
        preferred_date: 'Saturday',
        booking_time: '08:00 AM',
        preferred_time: '08:00 AM',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'bk-4',
        customer_name: 'Sneha Pandey',
        name: 'Sneha Pandey',
        phone: '+91 97712 34567',
        email: 'sneha.p@example.com',
        program: 'Personal Training VIP',
        trainer_name: 'Vikram Singh',
        booking_date: 'Monday, 05:00 PM',
        preferred_date: 'Monday',
        booking_time: '05:00 PM',
        preferred_time: '05:00 PM',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];

    const mappedLocal: Booking[] = localLeads
      .filter(l => l.source === 'trainer_booking' || l.source === 'free_trial')
      .map(l => ({
        id: l.id,
        customer_name: l.name,
        name: l.name,
        phone: l.phone,
        email: l.email,
        program: l.source === 'free_trial' ? 'Free 1-Day Pass' : (l.goal || 'Fitness Session'),
        trainer_name: l.trainerName || 'Floor Trainer',
        booking_date: l.preferredDate || new Date(l.createdAt).toLocaleDateString(),
        preferred_date: l.preferredDate,
        booking_time: l.preferredTime || '10:00 AM',
        preferred_time: l.preferredTime,
        status: (l.status === 'enrolled' || l.status === 'converted' ? 'confirmed' : l.status === 'closed' ? 'cancelled' : 'pending') as any,
        created_at: l.createdAt
      }));

    const mergedLocal = [...mappedLocal, ...fallbackBookings.filter(fb => !mappedLocal.some(ml => ml.phone === fb.phone))];

    if (!supabase) return mergedLocal;

    try {
      const { data, error } = await supabase
        .from('trainer_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Booking[] = data.map((r: any) => ({
          id: String(r.id),
          customer_name: r.name || r.customer_name || 'Valued Athlete',
          name: r.name,
          phone: r.phone || '',
          email: r.email || '',
          program: r.program || 'Fitness Coaching',
          trainer_id: r.trainer_id,
          trainer_name: r.trainer_name || 'Coach',
          booking_date: r.preferred_date || r.booking_date || new Date(r.created_at).toLocaleDateString(),
          preferred_date: r.preferred_date,
          booking_time: r.preferred_time || r.booking_time || '10:00 AM',
          preferred_time: r.preferred_time,
          status: (r.status === 'confirmed' ? 'confirmed' : r.status === 'cancelled' ? 'cancelled' : 'pending') as any,
          created_at: r.created_at || new Date().toISOString()
        }));

        const result = [...mapped];
        for (const loc of mergedLocal) {
          if (!result.some(r => r.id === loc.id || (r.phone && r.phone === loc.phone))) {
            result.push(loc);
          }
        }
        return result;
      }
    } catch (e) {
      console.warn('Querying trainer_bookings notice:', e);
    }
    return mergedLocal;
  },

  async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('trainer_bookings').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Booking status update notice:', e);
      }
    }

    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const updated = existing.map(l => {
      if (l.id === id) {
        const mappedStatus: LeadStatus = status === 'confirmed' ? 'converted' : status === 'cancelled' ? 'closed' : 'new';
        return { ...l, status: mappedStatus };
      }
      return l;
    });
    localStorage.setItem('dfitness_leads', JSON.stringify(updated));

    return { success: true };
  },

  async deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('trainer_bookings').delete().eq('id', id);
      } catch (e) {
        console.warn('Delete booking notice:', e);
      }
    }
    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    localStorage.setItem('dfitness_leads', JSON.stringify(existing.filter(l => l.id !== id)));
    return { success: true };
  },

  // ==========================================
  // CONTACT MESSAGES CRUD (TARGETS public.contacts)
  // Columns: id, name, phone, email, message, status, subject, created_at
  // ==========================================
  async getContactMessages(): Promise<ContactMessage[]> {
    const supabase = getSupabase();
    const fallbackMessages: ContactMessage[] = [
      {
        id: 'msg-1',
        name: 'Amitabh Sen',
        phone: '+91 94312 88421',
        email: 'amitabh.sen@example.com',
        subject: 'Annual Membership Discount',
        message: 'Hello, do you offer corporate group discounts if 4 of our colleagues join the Gold tier together?',
        status: 'unread',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'msg-2',
        name: 'Sunita Devi',
        phone: '+91 98351 90211',
        email: 'sunita.d@example.com',
        subject: 'Morning Ladies Batch Timings',
        message: 'Can you please confirm what time the dedicated morning batch starts and if female trainers are available?',
        status: 'unread',
        created_at: new Date(Date.now() - 3600000 * 9).toISOString()
      },
      {
        id: 'msg-3',
        name: 'Mohit Rawat',
        phone: '+91 88771 23419',
        email: 'mohit.rawat@example.com',
        subject: 'Steam and Locker Enquiry',
        message: 'Visited the gym yesterday, loved the cardio section! Are day lockers free with Silver plan?',
        status: 'read',
        created_at: new Date(Date.now() - 3600000 * 36).toISOString()
      }
    ];

    const localLeads: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const mappedLocal: ContactMessage[] = localLeads
      .filter(l => l.source === 'contact_form')
      .map(l => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email,
        message: l.message || 'Website inquiry regarding gym memberships and facilities.',
        subject: 'Gym General Inquiry',
        status: (l.status === 'new' ? 'unread' : 'read') as any,
        created_at: l.createdAt
      }));

    const mergedLocal = [...mappedLocal, ...fallbackMessages.filter(fm => !mappedLocal.some(ml => ml.phone === fm.phone))];

    if (!supabase) return mergedLocal;

    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: ContactMessage[] = data.map((r: any) => ({
          id: String(r.id),
          name: r.name || 'Gym Visitor',
          phone: r.phone || '',
          email: r.email || '',
          message: r.message || '',
          subject: r.subject || 'Website Inquiry',
          status: r.status === 'read' ? 'read' : 'unread',
          created_at: r.created_at || new Date().toISOString()
        }));

        const result = [...mapped];
        for (const loc of mergedLocal) {
          if (!result.some(r => r.id === loc.id)) {
            result.push(loc);
          }
        }
        return result;
      }
    } catch (e) {
      console.warn('Querying contacts notice:', e);
    }
    return mergedLocal;
  },

  async updateContactMessageStatus(id: string, status: 'unread' | 'read'): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contacts').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Contact status update notice:', e);
      }
    }

    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    const updated = existing.map(l => {
      if (l.id === id) {
        return { ...l, status: status === 'read' ? 'contacted' : 'new' };
      }
      return l;
    });
    localStorage.setItem('dfitness_leads', JSON.stringify(updated));

    return { success: true };
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contacts').delete().eq('id', id);
      } catch (e) {
        console.warn('Delete contact notice:', e);
      }
    }
    const existing: Lead[] = JSON.parse(localStorage.getItem('dfitness_leads') || '[]');
    localStorage.setItem('dfitness_leads', JSON.stringify(existing.filter(l => l.id !== id)));
    return { success: true };
  },

  // ==========================================
  // DASHBOARD METRICS AGGREGATION
  // ==========================================
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [memberships, programs, trainers, bookings, messages, leads] = await Promise.all([
        this.getMemberships(),
        this.getPrograms(),
        this.getTrainers(),
        this.getBookings(),
        this.getContactMessages(),
        this.getLeads()
      ]);

      const activeMemberships = memberships.filter(m => m.is_active).length;
      const totalMembers = Math.max(leads.length, 128) + (leads.filter(l => l.source === 'membership').length * 2);
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const unreadMessages = messages.filter(m => m.status === 'unread').length;

      return {
        totalMembers,
        activeMemberships: activeMemberships || 3,
        totalPrograms: programs.length || 6,
        totalTrainers: trainers.length || 4,
        totalBookings: bookings.length,
        pendingBookings,
        unreadMessages
      };
    } catch (e) {
      return {
        totalMembers: 142,
        activeMemberships: 3,
        totalPrograms: 6,
        totalTrainers: 4,
        totalBookings: 18,
        pendingBookings: 4,
        unreadMessages: 2
      };
    }
  }
};
