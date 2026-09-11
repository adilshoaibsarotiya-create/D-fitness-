import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  Layers,
  Database,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Activity,
  UserCheck,
  Dumbbell,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  User,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Lead } from '../../types';
import { AdminLeadsTab } from '../../components/admin/AdminLeadsTab';
import { AdminContentTab } from '../../components/admin/AdminContentTab';
import { AdminSettingsTab } from '../../components/admin/AdminSettingsTab';
import { AdminStorageTab } from '../../components/admin/AdminStorageTab';
import { AdminProfileTab } from '../../components/admin/AdminProfileTab';
import { Logo } from '../../components/common/Logo';

export type AdminViewType =
  | 'dashboard'
  | 'leads'
  | 'free-trials'
  | 'memberships'
  | 'trainer-bookings'
  | 'programs'
  | 'trainers'
  | 'gallery'
  | 'transformations'
  | 'testimonials'
  | 'faqs'
  | 'settings'
  | 'storage'
  | 'profile';

interface AdminDashboardPageProps {
  view?: AdminViewType;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ view = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@dfitness.com');
  const isCloudConnected = isSupabaseConfigured();

  // Determine active view from props or URL pathname
  const getCurrentView = (): AdminViewType => {
    if (view && view !== 'dashboard') return view as AdminViewType;
    const path = location.pathname.replace(/\/$/, '');
    if (path === '/admin/free-trials') return 'free-trials';
    if (path === '/admin/memberships') return 'memberships';
    if (path === '/admin/trainer-bookings') return 'trainer-bookings';
    if (path === '/admin/leads') return 'leads';
    if (path === '/admin/programs') return 'programs';
    if (path === '/admin/trainers') return 'trainers';
    if (path === '/admin/gallery') return 'gallery';
    if (path === '/admin/transformations') return 'transformations';
    if (path === '/admin/testimonials') return 'testimonials';
    if (path === '/admin/faqs') return 'faqs';
    if (path === '/admin/settings') return 'settings';
    if (path === '/admin/storage') return 'storage';
    if (path === '/admin/profile') return 'profile';
    return 'dashboard';
  };
  const currentView = getCurrentView();

  useEffect(() => {
    document.title = `Admin ${currentView.charAt(0).toUpperCase() + currentView.slice(1).replace('-', ' ')} | D FITNESS Godda`;
    loadData();
    fetchAdminUser();
  }, [currentView]);

  const fetchAdminUser = async () => {
    try {
      const auth = await supabaseService.checkAdminAuth();
      if (auth.user?.email) {
        setAdminEmail(auth.user.email);
      }
    } catch {
      // fallback
    }
  };

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const freshLeads = await supabaseService.getLeads();
      setLeads(freshLeads);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await supabaseService.logoutAdmin();
    navigate('/admin', { replace: true });
  };

  // KPI Calculations
  const totalLeads = leads.length;
  const trialLeads = leads.filter((l) => l.source === 'free_trial').length;
  const membershipLeads = leads.filter((l) => l.source === 'membership').length;
  const trainerBookingLeads = leads.filter((l) => l.source === 'trainer_booking').length;
  const contactLeads = leads.filter((l) => l.source === 'contact_form').length;

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const navItems = [
    { id: 'dashboard', label: 'Overview', path: '/admin/dashboard', icon: Activity },
    { id: 'leads', label: 'All Leads', path: '/admin/leads', icon: Users, badge: totalLeads },
    { id: 'free-trials', label: 'Free Trials', path: '/admin/free-trials', icon: Sparkles, badge: trialLeads },
    { id: 'memberships', label: 'Memberships', path: '/admin/memberships', icon: CreditCard, badge: membershipLeads },
    { id: 'trainer-bookings', label: 'Trainer Bookings', path: '/admin/trainer-bookings', icon: UserCheck, badge: trainerBookingLeads },
    { id: 'programs', label: 'Programs', path: '/admin/programs', icon: Dumbbell },
    { id: 'trainers', label: 'Trainers', path: '/admin/trainers', icon: Users },
    { id: 'gallery', label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { id: 'transformations', label: 'Transformations', path: '/admin/transformations', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: Settings },
    { id: 'storage', label: 'Storage & SQL', path: '/admin/storage', icon: Database },
    { id: 'profile', label: 'Profile', path: '/admin/profile', icon: User }
  ];

  return (
    <div className="bg-[#070707] min-h-screen text-[#FAFAFA] flex flex-col selection:bg-[#FFD400] selection:text-black">
      {/* Top Admin Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0E0E0E] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Logo size="sm" />
              <div className="h-5 w-px bg-white/15 hidden sm:block" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFD400] font-bold hidden sm:inline-block">
                GODDA GYM OPS
              </span>
            </Link>

            {/* Supabase Status Badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isCloudConnected
                  ? 'bg-[#00FF84]/15 border-[#00FF84]/40 text-[#00FF84]'
                  : 'bg-[#FFD400]/10 border-[#FFD400]/30 text-[#FFD400]'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{isCloudConnected ? 'Supabase Active' : 'Local Fallback'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222] border border-white/10 text-xs text-[#BDBDBD] hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Sync leads with Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FFD400] ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Cloud</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222] border border-white/10 text-xs text-[#BDBDBD] hover:text-white flex items-center gap-1.5 transition-colors"
              title="Open public website in new tab"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/admin/profile"
              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#222] border border-white/10 text-xs text-[#BDBDBD] hover:text-white hidden lg:flex items-center gap-1.5 transition-colors"
              title="Admin Profile"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FF84]" />
              <span className="font-mono text-[11px] text-white/80">{adminEmail}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-[#221013] hover:bg-[#33151a] border border-[#FF4C61]/30 text-[#FF4C61] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Log out from Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar for All Admin Sections */}
        <div className="bg-[#121212] border border-white/10 p-2 rounded-2xl overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FFD400] text-black shadow-[0_0_12px_rgba(255,212,0,0.25)]'
                      : 'bg-[#181818] text-[#BDBDBD] hover:text-white hover:bg-[#222222] border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* View Portals */}
        <main>
          {/* 1. OVERVIEW DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              {/* KPI Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link
                  to="/admin/leads"
                  className="glass-card rounded-2xl p-5 bg-[#121212] border border-white/10 hover:border-[#FFD400]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-semibold text-[#BDBDBD] uppercase">
                      Total Enquiries
                    </span>
                    <Users className="w-4 h-4 text-[#FFD400]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-3xl sm:text-4xl text-white block">
                      {totalLeads}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] block mt-1">All site submissions</span>
                  </div>
                </Link>

                <Link
                  to="/admin/free-trials"
                  className="glass-card rounded-2xl p-5 bg-[#121212] border border-white/10 hover:border-[#00FF84]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-semibold text-[#BDBDBD] uppercase">
                      Free Trials
                    </span>
                    <Sparkles className="w-4 h-4 text-[#00FF84]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#00FF84] block">
                      {trialLeads}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] block mt-1">Free workout passes</span>
                  </div>
                </Link>

                <Link
                  to="/admin/memberships"
                  className="glass-card rounded-2xl p-5 bg-[#121212] border border-white/10 hover:border-[#FFD400]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-semibold text-[#BDBDBD] uppercase">
                      Membership Apps
                    </span>
                    <CreditCard className="w-4 h-4 text-[#FFD400]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#FFD400] block">
                      {membershipLeads}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] block mt-1">Silver, Gold, Elite</span>
                  </div>
                </Link>

                <Link
                  to="/admin/trainer-bookings"
                  className="glass-card rounded-2xl p-5 bg-[#121212] border border-white/10 hover:border-[#00E5FF]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-semibold text-[#BDBDBD] uppercase">
                      Trainer Bookings
                    </span>
                    <UserCheck className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#00E5FF] block">
                      {trainerBookingLeads}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] block mt-1">Coach consultations</span>
                  </div>
                </Link>

                <div className="glass-card rounded-2xl p-5 bg-[#121212] border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-semibold text-[#BDBDBD] uppercase">
                      Contact Messages
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-[#E040FB]" />
                  </div>
                  <div>
                    <span className="font-display font-black text-3xl sm:text-4xl text-[#E040FB] block">
                      {contactLeads}
                    </span>
                    <span className="text-[10px] text-[#BDBDBD] block mt-1">Direct inquiries</span>
                  </div>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                  Gym Management Quick Access
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link
                    to="/admin/programs"
                    className="p-3.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-white/5 flex items-center gap-3 transition-colors"
                  >
                    <Dumbbell className="w-4 h-4 text-[#FFD400]" />
                    <span className="text-xs font-semibold text-white">Programs</span>
                  </Link>
                  <Link
                    to="/admin/trainers"
                    className="p-3.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-white/5 flex items-center gap-3 transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#00FF84]" />
                    <span className="text-xs font-semibold text-white">Trainers</span>
                  </Link>
                  <Link
                    to="/admin/gallery"
                    className="p-3.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-white/5 flex items-center gap-3 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-[#00E5FF]" />
                    <span className="text-xs font-semibold text-white">Gym Gallery</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="p-3.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-white/5 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#FFD400]" />
                    <span className="text-xs font-semibold text-white">Site Settings</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#FFD400]" />
                    <h3 className="font-heading font-bold text-lg text-white">
                      Recent Activity & Inquiries
                    </h3>
                  </div>

                  <Link
                    to="/admin/leads"
                    className="text-xs text-[#FFD400] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View All {totalLeads} Leads</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {recentLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#888888]">
                    No inquiries recorded yet. Form submissions will appear here instantly.
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentLeads.map((item) => {
                      const badgeColor =
                        item.source === 'free_trial'
                          ? 'bg-[#00FF84]/15 text-[#00FF84] border-[#00FF84]/30'
                          : item.source === 'membership'
                          ? 'bg-[#FFD400]/15 text-[#FFD400] border-[#FFD400]/30'
                          : item.source === 'trainer_booking'
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30'
                          : 'bg-white/10 text-white border-white/20';

                      const sourceLabel =
                        item.source === 'free_trial'
                          ? 'Free Trial Pass'
                          : item.source === 'membership'
                          ? 'Membership App'
                          : item.source === 'trainer_booking'
                          ? 'Trainer Booking'
                          : 'Contact Message';

                      return (
                        <div
                          key={item.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${badgeColor}`}
                              >
                                {sourceLabel}
                              </span>
                              <span className="font-bold text-white text-sm">{item.name}</span>
                              <span className="text-[#888888] text-[11px]">
                                • {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-[#BDBDBD] text-[11px]">
                              <span>📞 {item.phone}</span>
                              {item.email && <span>✉️ {item.email}</span>}
                              {(item.goal || item.selectedPlan) && (
                                <span className="text-[#FFD400]">
                                  Target: {item.goal || item.selectedPlan}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span
                              className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold ${
                                item.status === 'new'
                                  ? 'bg-[#FF4C61]/20 text-[#FF4C61] border border-[#FF4C61]/40'
                                  : item.status === 'contacted'
                                  ? 'bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/40'
                                  : item.status === 'enrolled'
                                  ? 'bg-[#00FF84]/20 text-[#00FF84] border border-[#00FF84]/40'
                                  : 'bg-white/10 text-white/60'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ALL LEADS */}
          {currentView === 'leads' && (
            <AdminLeadsTab leads={leads} onRefresh={loadData} initialSource="all" title="All Leads & Inquiries" />
          )}

          {/* 3. FREE TRIALS */}
          {currentView === 'free-trials' && (
            <AdminLeadsTab
              leads={leads}
              onRefresh={loadData}
              initialSource="free_trial"
              title="Free Trial Workout Passes"
            />
          )}

          {/* 4. MEMBERSHIPS */}
          {currentView === 'memberships' && (
            <div className="space-y-6">
              <AdminLeadsTab
                leads={leads}
                onRefresh={loadData}
                initialSource="membership"
                title="Membership Applications"
              />
              <div className="pt-4 border-t border-white/10">
                <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
                  Membership Plans Configuration
                </h3>
                <AdminContentTab initialSubTab="plans" />
              </div>
            </div>
          )}

          {/* 5. TRAINER BOOKINGS */}
          {currentView === 'trainer-bookings' && (
            <AdminLeadsTab
              leads={leads}
              onRefresh={loadData}
              initialSource="trainer_booking"
              title="Personal Trainer Booking Requests"
            />
          )}

          {/* 6. PROGRAMS */}
          {currentView === 'programs' && (
            <AdminContentTab initialSubTab="programs" />
          )}

          {/* 7. TRAINERS */}
          {currentView === 'trainers' && (
            <AdminContentTab initialSubTab="trainers" />
          )}

          {/* 8. GALLERY */}
          {currentView === 'gallery' && (
            <AdminContentTab initialSubTab="gallery" />
          )}

          {/* 9. TRANSFORMATIONS */}
          {currentView === 'transformations' && (
            <AdminContentTab initialSubTab="transformations" />
          )}

          {/* 10. TESTIMONIALS */}
          {currentView === 'testimonials' && (
            <AdminContentTab initialSubTab="testimonials" />
          )}

          {/* 11. FAQS */}
          {currentView === 'faqs' && (
            <AdminContentTab initialSubTab="faqs" />
          )}

          {/* 12. SETTINGS */}
          {currentView === 'settings' && (
            <AdminSettingsTab />
          )}

          {/* 13. STORAGE */}
          {currentView === 'storage' && (
            <AdminStorageTab />
          )}

          {/* 14. PROFILE */}
          {currentView === 'profile' && (
            <AdminProfileTab />
          )}
        </main>
      </div>
    </div>
  );
};
