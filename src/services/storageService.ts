import {
  Lead,
  LeadStatus,
  Program,
  Trainer,
  MembershipPlan,
  GalleryItem,
  FAQItem,
  Testimonial,
  SiteSettings
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
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  LEADS: 'dfitness_leads',
  PROGRAMS: 'dfitness_programs',
  TRAINERS: 'dfitness_trainers',
  MEMBERSHIPS: 'dfitness_memberships',
  GALLERY: 'dfitness_gallery',
  FAQS: 'dfitness_faqs',
  TESTIMONIALS: 'dfitness_testimonials',
  SETTINGS: 'dfitness_settings',
  ADMIN_TOKEN: 'dfitness_admin_token',
  ADMIN_EMAIL: 'dfitness_admin_email'
};

// Helper for safe localStorage access
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const storageService = {
  // CHECK SUPABASE STATUS
  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  },

  // LEADS
  getLeads(): Lead[] {
    const initialLeads: Lead[] = [
      {
        id: 'lead-101',
        name: 'Rahul Sharma',
        phone: '+91 98351 23456',
        email: 'rahul.s@example.com',
        goal: 'Weight Loss',
        source: 'free_trial',
        message: 'Interested in morning batch workout and weight loss diet plan.',
        status: 'new',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        preferredDate: 'Tomorrow',
        preferredTime: '06:30 AM'
      },
      {
        id: 'lead-102',
        name: 'Amit Kumar',
        phone: '+91 94311 87654',
        email: 'amit.k@example.com',
        goal: 'Muscle Gain',
        source: 'membership',
        selectedPlan: 'GOLD',
        message: 'Want to register for 3 months Gold package.',
        status: 'contacted',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    return getStored<Lead[]>(STORAGE_KEYS.LEADS, initialLeads);
  },

  // Sync leads from Supabase Database if online & configured
  async syncLeadsFromSupabase(): Promise<Lead[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return this.getLeads();
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase leads fetch notice:', error.message);
        return this.getLeads();
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedLeads: Lead[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email,
          goal: row.goal || undefined,
          source: row.source || 'contact_form',
          message: row.message || undefined,
          selectedPlan: row.selected_plan || undefined,
          preferredDate: row.preferred_date || undefined,
          preferredTime: row.preferred_time || undefined,
          status: (row.status as LeadStatus) || 'new',
          createdAt: row.created_at || new Date().toISOString(),
          created_at: row.created_at || new Date().toISOString(),
        }));

        setStored(STORAGE_KEYS.LEADS, mappedLeads);
        return mappedLeads;
      }
    } catch (err) {
      console.warn('Could not sync leads from Supabase, utilizing cached records:', err);
    }

    return this.getLeads();
  },

  saveLead(leadInput: Omit<Lead, 'id' | 'createdAt' | 'created_at' | 'status'> & { status?: LeadStatus }): Lead {
    const leads = this.getLeads();
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadInput,
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      status: leadInput.status || 'new',
      createdAt: now,
      created_at: now
    };

    // Save locally first
    const updated = [newLead, ...leads];
    setStored(STORAGE_KEYS.LEADS, updated);

    // Asynchronously insert into Supabase
    const supabase = getSupabase();
    if (supabase) {
      if (newLead.source === 'membership') {
        const planMsg = `[Plan: ${newLead.selectedPlan || 'GOLD'}]${newLead.preferredDate ? ` [Start Date: ${newLead.preferredDate}]` : ''} ${newLead.message || ''}`.trim();
        supabase
          .from('membership_leads')
          .insert({
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email,
            message: planMsg,
            status: newLead.status
          })
          .then(
            ({ error }) => {
              if (error) {
                console.warn('Notice: Membership lead saved locally. Supabase insert response:', error.message);
              }
            },
            (err) => {
              console.warn('Supabase membership lead insert failed (stored locally):', err);
            }
          );
      }
    }

    return newLead;
  },

  updateLeadStatus(leadId: string, status: LeadStatus): void {
    const leads = this.getLeads();
    const updated = leads.map(l => l.id === leadId ? { ...l, status } : l);
    setStored(STORAGE_KEYS.LEADS, updated);

    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId)
        .then(({ error }) => {
          if (error) console.warn('Supabase status update error:', error.message);
        });
    }
  },

  deleteLead(leadId: string): void {
    const leads = this.getLeads();
    const updated = leads.filter(l => l.id !== leadId);
    setStored(STORAGE_KEYS.LEADS, updated);

    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .then(({ error }) => {
          if (error) console.warn('Supabase lead delete notice:', error.message);
        });
    }
  },

  exportLeadsCSV(): void {
    const leads = this.getLeads();
    if (leads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Goal', 'Source', 'Plan', 'Status', 'Date', 'Message'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.goal || ''}"`,
      `"${l.source}"`,
      `"${l.selectedPlan || ''}"`,
      `"${l.status}"`,
      `"${new Date(l.createdAt || l.created_at || '').toLocaleDateString()}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dfitness-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // PROGRAMS
  getPrograms(): Program[] {
    return getStored<Program[]>(STORAGE_KEYS.PROGRAMS, defaultPrograms);
  },

  getProgramBySlug(slug: string): Program | undefined {
    return this.getPrograms().find(p => p.slug === slug);
  },

  saveProgram(program: Program): void {
    const list = this.getPrograms();
    const index = list.findIndex(p => p.id === program.id);
    if (index >= 0) {
      list[index] = program;
    } else {
      list.push(program);
    }
    setStored(STORAGE_KEYS.PROGRAMS, list);
  },

  deleteProgram(id: string): void {
    const list = this.getPrograms().filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PROGRAMS, list);
  },

  // TRAINERS
  getTrainers(): Trainer[] {
    return getStored<Trainer[]>(STORAGE_KEYS.TRAINERS, defaultTrainers);
  },

  saveTrainer(trainer: Trainer): void {
    const list = this.getTrainers();
    const index = list.findIndex(t => t.id === trainer.id);
    if (index >= 0) {
      list[index] = trainer;
    } else {
      list.push(trainer);
    }
    setStored(STORAGE_KEYS.TRAINERS, list);
  },

  deleteTrainer(id: string): void {
    const list = this.getTrainers().filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TRAINERS, list);
  },

  // MEMBERSHIP PLANS
  getMembershipPlans(): MembershipPlan[] {
    return getStored<MembershipPlan[]>(STORAGE_KEYS.MEMBERSHIPS, defaultMembershipPlans);
  },

  async syncMembershipPlansFromSupabase(): Promise<MembershipPlan[]> {
    const supabase = getSupabase();
    if (!supabase) return this.getMembershipPlans();

    try {
      const { data, error } = await supabase.from('membership_plans').select('*');
      if (error) {
        console.warn('Supabase membership_plans notice:', error.message);
        return this.getMembershipPlans();
      }
      if (data && data.length > 0) {
        const currentPlans = this.getMembershipPlans();
        const mapped: MembershipPlan[] = data.map((r: any) => {
          const matched = currentPlans.find(cp => cp.id === r.id);
          return {
            id: r.id,
            name: r.name,
            price: r.price,
            billingPeriod: r.billing_period || '/ Month',
            tagline: r.tagline || (matched?.tagline || ''),
            features: Array.isArray(r.features) ? r.features : (matched?.features || []),
            recommended: Boolean(r.recommended),
            highlightText: r.highlight_text || matched?.highlightText,
            gymAccess: matched?.gymAccess || 'Full Facility Access',
            cardioZone: matched?.cardioZone ?? true,
            strengthZone: matched?.strengthZone ?? true,
            trainerSupport: matched?.trainerSupport || 'Floor Trainer Support',
            personalTraining: matched?.personalTraining || 'Optional Add-on',
            nutritionGuidance: matched?.nutritionGuidance || 'Basic Guidance',
            lockerAndShower: matched?.lockerAndShower ?? true
          };
        });
        setStored(STORAGE_KEYS.MEMBERSHIPS, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Error fetching membership plans from Supabase:', e);
    }
    return this.getMembershipPlans();
  },

  saveMembershipPlan(plan: MembershipPlan): void {
    const list = this.getMembershipPlans();
    const index = list.findIndex(p => p.id === plan.id);
    if (index >= 0) {
      list[index] = plan;
    } else {
      list.push(plan);
    }
    setStored(STORAGE_KEYS.MEMBERSHIPS, list);

    const supabase = getSupabase();
    if (supabase) {
      supabase.from('membership_plans').upsert({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        billing_period: plan.billingPeriod,
        tagline: plan.tagline,
        features: plan.features,
        recommended: plan.recommended,
        highlight_text: plan.highlightText || null,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn('Supabase membership plan upsert notice:', error.message);
      });
    }
  },

  saveMembershipPlans(plans: MembershipPlan[]): void {
    setStored(STORAGE_KEYS.MEMBERSHIPS, plans);

    const supabase = getSupabase();
    if (supabase) {
      const payload = plans.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        billing_period: p.billingPeriod,
        tagline: p.tagline,
        features: p.features,
        recommended: p.recommended,
        highlight_text: p.highlightText || null,
        updated_at: new Date().toISOString()
      }));
      supabase.from('membership_plans').upsert(payload).then(({ error }) => {
        if (error) console.warn('Supabase membership plans batch update notice:', error.message);
      });
    }
  },

  deleteMembershipPlan(id: string): void {
    const list = this.getMembershipPlans().filter(p => p.id !== id);
    setStored(STORAGE_KEYS.MEMBERSHIPS, list);

    const supabase = getSupabase();
    if (supabase) {
      supabase.from('membership_plans').delete().eq('id', id).then();
    }
  },

  // GALLERY
  getGallery(): GalleryItem[] {
    return getStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, defaultGallery);
  },

  saveGalleryItem(item: GalleryItem): void {
    const list = this.getGallery();
    const index = list.findIndex(g => g.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    setStored(STORAGE_KEYS.GALLERY, list);
  },

  deleteGalleryItem(id: string): void {
    const list = this.getGallery().filter(g => g.id !== id);
    setStored(STORAGE_KEYS.GALLERY, list);
  },

  // TESTIMONIALS
  getTestimonials(): Testimonial[] {
    return getStored<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, defaultTestimonials);
  },

  saveTestimonial(item: Testimonial): void {
    const list = this.getTestimonials();
    const index = list.findIndex(t => t.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    setStored(STORAGE_KEYS.TESTIMONIALS, list);
  },

  deleteTestimonial(id: string): void {
    const list = this.getTestimonials().filter(t => t.id !== id);
    setStored(STORAGE_KEYS.TESTIMONIALS, list);
  },

  // FAQS
  getFAQs(): FAQItem[] {
    return getStored<FAQItem[]>(STORAGE_KEYS.FAQS, defaultFAQs);
  },

  saveFAQ(faq: FAQItem): void {
    const list = this.getFAQs();
    const index = list.findIndex(f => f.id === faq.id);
    if (index >= 0) {
      list[index] = faq;
    } else {
      list.push(faq);
    }
    setStored(STORAGE_KEYS.FAQS, list);
  },

  deleteFAQ(id: string): void {
    const list = this.getFAQs().filter(f => f.id !== id);
    setStored(STORAGE_KEYS.FAQS, list);
  },

  // SETTINGS
  getSettings(): SiteSettings {
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, defaultSiteConfig);
  },

  async syncSettingsFromSupabase(): Promise<SiteSettings> {
    const supabase = getSupabase();
    if (!supabase) return this.getSettings();

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'current_settings')
        .single();

      if (!error && data) {
        const current = this.getSettings();
        const merged: SiteSettings = {
          ...current,
          phone: data.phone || current.phone,
          whatsapp: data.whatsapp || current.whatsapp,
          email: data.email || current.email,
          address: data.address || current.address,
          openingHoursWeekday: data.opening_hours_weekday || current.openingHoursWeekday,
          openingHoursWeekend: data.opening_hours_weekend || current.openingHoursWeekend,
          mapsUrl: data.maps_url || current.mapsUrl,
          mapsEmbedUrl: data.maps_embed_url || current.mapsEmbedUrl,
          instagram: data.instagram || current.instagram,
          facebook: data.facebook || current.facebook,
        };
        setStored(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch (e) {
      console.warn('Error syncing site_settings from Supabase:', e);
    }
    return this.getSettings();
  },

  saveSettings(settings: SiteSettings): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);

    const supabase = getSupabase();
    if (supabase) {
      supabase.from('site_settings').upsert({
        id: 'current_settings',
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
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn('Supabase site_settings upsert notice:', error.message);
      });
    }
  },

  // ADMIN AUTHENTICATION
  isAdminAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
    return Boolean(token);
  },

  getAdminEmail(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || 'admin@dfitness.com';
  },

  async loginAdmin(usernameOrEmail?: string, password?: string): Promise<{ success: boolean; message?: string }> {
    const emailInput = (usernameOrEmail || '').trim();
    const passInput = (password || '').trim();

    // Check Supabase Auth first if configured
    const supabase = getSupabase();
    if (supabase && emailInput.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput,
          password: passInput,
        });

        if (!error && data?.session) {
          localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.session.access_token);
          localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, data.user?.email || emailInput);
          return { success: true };
        } else if (error) {
          console.warn('Supabase Auth attempt result:', error.message);
          // If Supabase gave an error, but user used demo pass, allow fallback
        }
      } catch (err: any) {
        console.warn('Supabase Auth error:', err);
      }
    }

    // Standard Demo Credentials Check / Offline Fallback
    const validPasswords = ['dfitness123', 'dfitnessadmin', 'admin123'];
    const enteredPass = passInput || emailInput;
    if (validPasswords.includes(enteredPass) || validPasswords.includes(passInput)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'dfitness_authenticated_session');
      localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, emailInput || 'admin@dfitness.com');
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please enter valid Supabase credentials or the admin demo key.'
    };
  },

  adminLogin(password: string): boolean {
    const validPass = password.trim();
    if (['dfitness123', 'dfitnessadmin', 'admin123'].includes(validPass)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'dfitness_authenticated_session');
      localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, 'admin@dfitness.com');
      return true;
    }
    return false;
  },

  async logoutAdmin(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_EMAIL);
  },

  adminLogout(): void {
    this.logoutAdmin();
  }
};
