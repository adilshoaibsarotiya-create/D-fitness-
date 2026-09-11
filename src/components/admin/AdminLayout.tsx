import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Dumbbell,
  Users,
  CalendarCheck,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { Logo } from '../common/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
  actions?: React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
  actions
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@dfitness.com');
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.title = `${pageTitle} | D FITNESS Admin Panel`;
    loadAdminHeaderData();
  }, [location.pathname, pageTitle]);

  const loadAdminHeaderData = async () => {
    try {
      const auth = await supabaseService.checkAdminAuth();
      if (auth.user?.email) {
        setAdminEmail(auth.user.email);
      }
      const stats = await supabaseService.getDashboardStats();
      setUnreadCount(stats.unreadMessages);
      setPendingBookingsCount(stats.pendingBookings);
    } catch {
      // fallback
    }
  };

  const handleLogout = async () => {
    await supabaseService.logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Expose toast to window for child pages if needed
  useEffect(() => {
    (window as any).__dfitnessToast = showToast;
    return () => {
      delete (window as any).__dfitnessToast;
    };
  }, []);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      id: 'memberships',
      label: 'Memberships',
      path: '/admin/memberships',
      icon: CreditCard
    },
    {
      id: 'programs',
      label: 'Programs',
      path: '/admin/programs',
      icon: Dumbbell
    },
    {
      id: 'trainers',
      label: 'Trainers',
      path: '/admin/trainers',
      icon: Users
    },
    {
      id: 'bookings',
      label: 'Bookings',
      path: '/admin/bookings',
      icon: CalendarCheck,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/admin/messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#07080E] text-[#FAFAFA] flex flex-col font-sans selection:bg-[#FFD400] selection:text-black">
      {/* ==================================================== */}
      {/* TOP PILL BAR (MATCHING REFERENCE DESIGN LAYOUT)      */}
      {/* ==================================================== */}
      <header className="sticky top-0 z-50 bg-[#07080E]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Gym Badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#FFD400] flex items-center justify-center text-black font-black font-display text-lg shadow-[0_0_15px_rgba(255,212,0,0.3)]">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-sm tracking-wider text-white leading-none group-hover:text-[#FFD400] transition-colors">
                  D FITNESS
                </span>
                <span className="text-[10px] text-[#A0A0A0] tracking-widest uppercase font-semibold">
                  Admin Master
                </span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-[#FFD400]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Godda Main Club
            </span>
          </div>

          {/* Central Pill Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center bg-[#13141F] border border-white/10 p-1 rounded-full shadow-inner">
            {navItems.map((item) => {
              const active = isCurrentPath(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    active
                      ? 'bg-[#FFD400] text-black shadow-[0_2px_10px_rgba(255,212,0,0.3)] font-bold'
                      : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-[#808080]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        active
                          ? 'bg-black text-[#FFD400]'
                          : 'bg-[#FF4C61] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Profile & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Website Button */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
              title="Open Public Gym Website"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FFD400]" />
            </Link>

            {/* Notification Bell with Badge */}
            <Link
              to="/admin/messages"
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
              title={`${unreadCount} unread message(s)`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4C61] text-white rounded-full text-[10px] font-black flex items-center justify-center ring-2 ring-[#07080E]">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 bg-[#13141F] border border-white/10 rounded-full pl-1.5 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-[#FFD400]/20 border border-[#FFD400]/40 flex items-center justify-center text-xs font-bold text-[#FFD400]">
                {adminEmail.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                  {adminEmail.split('@')[0]}
                </span>
                <span className="text-[10px] text-[#A0A0A0] leading-none">
                  Super Admin
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/5 hover:bg-[#FF4C61]/20 hover:text-[#FF4C61] border border-white/10 text-white/60 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const active = isCurrentPath(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#FFD400] text-black font-bold'
                      : 'bg-[#13141F] text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-[#FF4C61] text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ==================================================== */}
      {/* SECONDARY HEADER (PAGE TITLE, BREADCRUMB, ACTIONS)   */}
      {/* ==================================================== */}
      <section className="border-b border-white/5 bg-[#0B0C14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#A0A0A0] uppercase tracking-wider font-semibold mb-1">
              <span>D FITNESS</span>
              <ChevronRight className="w-3 h-3 text-white/30" />
              <span className="text-[#FFD400]">{pageTitle}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight">
              {pageTitle}
            </h1>
            {pageSubtitle && (
              <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">
                {pageSubtitle}
              </p>
            )}
          </div>

          {/* Action Area (e.g. "+ Add Membership", Filter buttons) */}
          {actions && (
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {actions}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================== */}
      {/* MAIN CONTENT WORKSPACE                               */}
      {/* ==================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* ==================================================== */}
      {/* FLOATING TOAST NOTIFICATIONS                         */}
      {/* ==================================================== */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'error'
                ? 'bg-[#1D1115] border-[#FF4C61]/40 text-white'
                : toast.type === 'info'
                ? 'bg-[#121625] border-blue-500/40 text-white'
                : 'bg-[#121C16] border-emerald-500/40 text-white'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[#FF4C61] shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
