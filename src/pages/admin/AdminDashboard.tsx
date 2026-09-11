import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Dumbbell,
  CalendarCheck,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Membership, Booking, ContactMessage, DashboardStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMemberships: 0,
    totalPrograms: 0,
    totalTrainers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    unreadMessages: 0
  });
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, membershipsData, bookingsData, messagesData] = await Promise.all([
        supabaseService.getDashboardStats(),
        supabaseService.getMemberships(),
        supabaseService.getBookings(),
        supabaseService.getContactMessages()
      ]);

      setStats(statsData);
      setMemberships(membershipsData);
      setRecentBookings(bookingsData.slice(0, 5));
      setRecentMessages(messagesData.slice(0, 5));
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    if ((window as any).__dfitnessToast) {
      (window as any).__dfitnessToast('Dashboard stats updated from Supabase.', 'info');
    }
  };

  const handleQuickStatusChange = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    const res = await supabaseService.updateBookingStatus(bookingId, status);
    if (res.success) {
      setRecentBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast(`Booking marked as ${status}.`, 'success');
      }
    }
  };

  return (
    <AdminLayout
      pageTitle="Overview Dashboard"
      pageSubtitle="Real-time fitness club operations, member enrollments, and live metrics."
      actions={
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FFD400] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          <Link
            to="/admin/memberships"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_20px_rgba(255,212,0,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Plans</span>
          </Link>
        </div>
      }
    >
      {/* ==================================================== */}
      {/* 4 METRIC CARDS (MATCHING REFERENCE UI)               */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Total Members */}
        <div className="bg-[#13141F] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#FFD400]/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center text-[#FFD400]">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#A0A0A0] font-semibold">
            Total Members & Leads
          </div>
          <div className="text-3xl font-black font-heading text-white mt-1">
            {loading ? '...' : stats.totalMembers}
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] text-[#A0A0A0] pt-3 border-t border-white/5">
            <span>Godda District Club</span>
            <span className="text-white/60">Active Athletes</span>
          </div>
        </div>

        {/* Metric 2: Active Memberships with Mini Bar Graphic */}
        <div className="bg-[#13141F] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#FFD400]/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            {/* Mini Activity Bars */}
            <div className="flex items-end gap-1 h-5">
              <div className="w-1.5 h-2.5 bg-blue-500/40 rounded-t" />
              <div className="w-1.5 h-4 bg-blue-500/60 rounded-t" />
              <div className="w-1.5 h-3 bg-blue-500/50 rounded-t" />
              <div className="w-1.5 h-5 bg-[#FFD400] rounded-t" />
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#A0A0A0] font-semibold">
            Active Membership Plans
          </div>
          <div className="text-3xl font-black font-heading text-white mt-1">
            {loading ? '...' : `${stats.activeMemberships} Tiers`}
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] text-[#A0A0A0] pt-3 border-t border-white/5">
            <span>Dynamic Supabase Sync</span>
            <span className="text-emerald-400 font-semibold">Live on Site</span>
          </div>
        </div>

        {/* Metric 3: Total Bookings with Sparkline */}
        <div className="bg-[#13141F] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#FFD400]/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            {stats.pendingBookings > 0 ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#FFD400] bg-[#FFD400]/10 px-2 py-0.5 rounded-full border border-[#FFD400]/20">
                <Clock className="w-3 h-3" />
                {stats.pendingBookings} Pending
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                All Cleared
              </span>
            )}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#A0A0A0] font-semibold">
            Trainer & Trial Bookings
          </div>
          <div className="text-3xl font-black font-heading text-white mt-1">
            {loading ? '...' : stats.totalBookings}
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] text-[#A0A0A0] pt-3 border-t border-white/5">
            <span>Sessions Scheduled</span>
            <Link to="/admin/bookings" className="text-[#FFD400] hover:underline">
              Review &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Unread Messages / Quick Actions */}
        <div className="bg-[#13141F] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-[#FFD400]/40 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            {stats.unreadMessages > 0 && (
              <span className="text-[11px] font-black text-white bg-[#FF4C61] px-2 py-0.5 rounded-full">
                {stats.unreadMessages} Unread
              </span>
            )}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-[#A0A0A0] font-semibold">
            Customer Inquiries
          </div>
          <div className="text-3xl font-black font-heading text-white mt-1">
            {loading ? '...' : `${stats.unreadMessages} New`}
          </div>
          <div className="flex items-center justify-between mt-4 text-[11px] text-[#A0A0A0] pt-3 border-t border-white/5">
            <span>Direct Website Contact</span>
            <Link to="/admin/messages" className="text-[#FFD400] hover:underline">
              Open Inbox &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* QUICK ACTIONS ROW (MATCHING REFERENCE UI BUTTONS)    */}
      {/* ==================================================== */}
      <div className="bg-[#10111A] border border-white/10 rounded-2xl p-4 mb-8 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <Sparkles className="w-4 h-4 text-[#FFD400]" />
          <span>Quick Administrative Actions:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/memberships"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>Edit Membership Pricing</span>
          </Link>

          <Link
            to="/admin/programs"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-1.5"
          >
            <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
            <span>Add Fitness Program</span>
          </Link>

          <Link
            to="/admin/trainers"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Trainer</span>
          </Link>

          <Link
            to="/admin/bookings"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Review Bookings</span>
          </Link>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MEMBERSHIPS LIVE PREVIEW CONTAINER                   */}
      {/* ==================================================== */}
      <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-black font-heading text-white flex items-center gap-2">
              <span>Live Membership Plans & Pricing</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/30 text-[#FFD400] font-semibold">
                Supabase Live
              </span>
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Prices stored in <code className="text-[#FFD400] font-mono">memberships.price</code> dynamically feed the public website.
            </p>
          </div>

          <Link
            to="/admin/memberships"
            className="text-xs font-bold text-[#FFD400] hover:underline flex items-center gap-1"
          >
            <span>Configure Plans</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {memberships.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl p-5 border transition-all ${
                m.is_featured
                  ? 'bg-[#151624] border-[#FFD400] shadow-[0_0_20px_rgba(255,212,0,0.15)]'
                  : 'bg-[#13141F] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-black text-lg text-white">
                  {m.name}
                </span>
                {m.is_featured ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FFD400] text-black">
                    Featured
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-semibold text-[#A0A0A0]">
                    {m.duration}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl sm:text-3xl font-black font-display text-[#FFD400]">
                  ₹{Number(m.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#A0A0A0]">/ {m.duration}</span>
              </div>

              <p className="text-xs text-[#A0A0A0] line-clamp-2 mb-4 leading-relaxed">
                {m.description}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    m.is_active ? 'text-emerald-400' : 'text-[#A0A0A0]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      m.is_active ? 'bg-emerald-400' : 'bg-gray-500'
                    }`}
                  />
                  {m.is_active ? 'Publicly Active' : 'Inactive'}
                </span>

                <Link
                  to="/admin/memberships"
                  className="text-xs font-semibold text-white/80 hover:text-[#FFD400] transition-colors"
                >
                  Edit &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2-COLUMN SPLIT: RECENT BOOKINGS & RECENT MESSAGES    */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: Recent Bookings */}
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-black font-heading text-white">
                Recent Bookings & Trials
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Customer requests for trainer sessions and gym passes
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-[#FFD400] hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#808080]">
              No booking requests received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-[#13141F] border border-white/5 hover:border-white/20 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        {bk.customer_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          bk.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : bk.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {bk.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A0A0A0] truncate">
                      {bk.program} &bull; {bk.booking_date}
                    </div>
                    <div className="text-[10px] text-white/50 font-mono mt-0.5">
                      {bk.phone}
                    </div>
                  </div>

                  {bk.status === 'pending' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleQuickStatusChange(bk.id, 'confirmed')}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        title="Confirm Booking"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleQuickStatusChange(bk.id, 'cancelled')}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Recent Messages */}
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-black font-heading text-white">
                Recent Inquiries
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Contact form messages and general member questions
              </p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-bold text-[#FFD400] hover:underline"
            >
              Open Inbox &rarr;
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#808080]">
              No contact messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-[#13141F] border rounded-2xl p-4 transition-all ${
                    msg.status === 'unread'
                      ? 'border-[#FFD400]/40 shadow-sm'
                      : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {msg.name}
                    </span>
                    {msg.status === 'unread' ? (
                      <span className="text-[10px] font-black text-black bg-[#FFD400] px-2 py-0.5 rounded-full">
                        New
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#808080]">Read</span>
                    )}
                  </div>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    "{msg.message}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-[#A0A0A0]">
                    <span>{msg.phone || msg.email}</span>
                    <Link
                      to="/admin/messages"
                      className="text-[#FFD400] hover:underline"
                    >
                      Reply &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
