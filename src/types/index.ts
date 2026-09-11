export type LeadStatus = 'new' | 'contacted' | 'converted' | 'enrolled' | 'closed';

export type LeadSource = 'contact_form' | 'free_trial' | 'membership' | 'trainer_booking' | 'whatsapp';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  goal?: string;
  source: LeadSource;
  message?: string;
  selectedPlan?: string;
  trainerName?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: LeadStatus;
  createdAt: string;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role?: string;
  created_at?: string;
}

export interface TrainerBookingRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  trainerName: string;
  preferredDate: string;
  preferredTime: string;
  fitnessGoal?: string;
  message?: string;
  status: LeadStatus;
  created_at?: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  whoItIsFor: string[];
  benefits: string[];
  trainingApproach: string[];
  typicalSession: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  frequency: string;
  image: string;
  category: 'strength' | 'cardio' | 'fat-loss' | 'hypertrophy' | 'functional';
  featured?: boolean;
  // Database compatibility properties
  name?: string;
  description?: string;
  image_url?: string;
  difficulty_level?: string;
  duration_weeks?: number;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialization: string[];
  achievements?: string[];
  bio: string;
  image: string;
  instagram?: string;
  whatsapp?: string;
  featured?: boolean;
  // Database compatibility properties
  specialty?: string;
  experience_years?: number;
  image_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface MembershipPlan {
  id: string;
  name: 'SILVER' | 'GOLD' | 'ELITE' | string;
  price: string;
  billingPeriod: string;
  tagline: string;
  features: string[];
  recommended?: boolean;
  highlightText?: string;
  gymAccess: string;
  cardioZone: boolean;
  strengthZone: boolean;
  trainerSupport: string;
  personalTraining: string;
  nutritionGuidance: string;
  lockerAndShower: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'gym' | 'equipment' | 'trainers' | 'members' | 'events' | 'workouts';
  image: string;
  description?: string;
  aspectRatio?: 'square' | 'tall' | 'wide';
}

export interface TransformationStory {
  id: string;
  clientName: string;
  goal: string;
  duration: string;
  trainingType: string;
  story: string;
  metrics: {
    weightChange?: string;
    bodyFatChange?: string;
    strengthMetric?: string;
  };
  beforeImage: string;
  afterImage: string;
  verified: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  roleOrGoal?: string;
  rating: number;
  testimonial: string;
  date: string;
  avatar?: string;
  isDemo?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'membership' | 'training' | 'facilities';
}

// Master Admin Data Models
export interface Membership {
  id: string;
  name: string;
  price: number;
  duration: string; // e.g. "1 Month", "3 Months", "1 Year"
  duration_days?: number;
  description: string;
  features: string[];
  benefits?: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  name?: string;
  phone: string;
  email: string;
  program?: string;
  trainer_id?: string;
  trainer_name?: string;
  booking_date?: string;
  preferred_date?: string;
  booking_time?: string;
  preferred_time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  subject?: string;
  status: 'unread' | 'read';
  created_at: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  totalPrograms: number;
  totalTrainers: number;
  totalBookings: number;
  pendingBookings: number;
  unreadMessages: number;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  locationCity: string;
  locationState: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  instagram: string;
  facebook: string;
  openingHoursWeekday: string;
  openingHoursWeekend: string;
  heroHeadline: string;
  heroSubheadline: string;
}
