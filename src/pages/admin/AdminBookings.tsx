import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  User,
  X,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Booking } from '../../types';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Drawer / details modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const res = await supabaseService.updateBookingStatus(id, status);
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast(`Booking marked as ${status}.`, 'success');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const res = await supabaseService.deleteBooking(deletingId);
    setDeletingId(null);
    if (selectedBooking?.id === deletingId) {
      setSelectedBooking(null);
    }
    if (res.success) {
      await loadBookings();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast('Booking removed.', 'info');
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      (b.customer_name || b.name || '').toLowerCase().includes(term) ||
      (b.phone || '').toLowerCase().includes(term) ||
      (b.email || '').toLowerCase().includes(term) ||
      (b.program || '').toLowerCase().includes(term) ||
      (b.trainer_name || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <AdminLayout
      pageTitle="Trainer & Trial Bookings"
      pageSubtitle="Review session requests, approve trial workouts, and coordinate coach assignments."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={loadBookings}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>Refresh</span>
          </button>
        </div>
      }
    >
      {/* ==================================================== */}
      {/* SEARCH & FILTER CONTROLS                             */}
      {/* ==================================================== */}
      <div className="bg-[#10111A] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, program..."
            className="w-full bg-[#161724] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#FFD400]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center bg-[#161724] border border-white/10 rounded-full p-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#FFD400] text-black font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-400 text-black font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-rose-400 text-black font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* BOOKINGS TABLE                                       */}
      {/* ==================================================== */}
      {loading ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#FFD400] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#A0A0A0]">Loading bookings from Supabase...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <CalendarCheck className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No bookings found</h3>
          <p className="text-xs text-[#A0A0A0]">
            {searchQuery
              ? 'No bookings matched your filter.'
              : 'When members book a session on the website, they appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#141522] text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Program / Focus</th>
                  <th className="py-3.5 px-4">Trainer</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => setSelectedBooking(b)}
                  >
                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#161724] border border-white/10 flex items-center justify-center text-xs font-bold text-[#FFD400]">
                          {(b.customer_name || b.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-heading font-black text-sm text-white">
                            {b.customer_name || b.name}
                          </div>
                          <div className="text-[11px] text-[#A0A0A0] font-mono">
                            {b.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Program */}
                    <td className="py-4 px-4 font-semibold text-white">
                      {b.program}
                    </td>

                    {/* Trainer */}
                    <td className="py-4 px-4 text-[#FFD400]">
                      {b.trainer_name || 'Floor Coach'}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">
                        {b.preferred_date || b.booking_date}
                      </div>
                      <div className="text-[10px] text-[#A0A0A0]">
                        {b.preferred_time || b.booking_time}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Actions: Quick Confirm/Cancel/Delete */}
                    <td
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            title="Confirm Booking"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'cancelled')}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingId(b.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* BOOKING DETAIL SLIDE-OVER DRAWER                     */}
      {/* ==================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
          <div
            onClick={() => setSelectedBooking(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-[#10111A] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-lg font-black font-heading text-white">
                Booking Information
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 flex-1">
              {/* Member Card */}
              <div className="bg-[#161724] border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                  Client Profile
                </span>
                <h4 className="text-base font-black font-heading text-white mt-1">
                  {selectedBooking.customer_name || selectedBooking.name}
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <a
                    href={`tel:${selectedBooking.phone}`}
                    className="flex items-center gap-2 text-white/80 hover:text-[#FFD400]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FFD400]" />
                    <span>{selectedBooking.phone}</span>
                  </a>

                  {selectedBooking.email && (
                    <a
                      href={`mailto:${selectedBooking.email}`}
                      className="flex items-center gap-2 text-white/80 hover:text-[#FFD400]"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedBooking.email}</span>
                    </a>
                  )}
                </div>

                {/* Direct WhatsApp Callout */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contact on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-[#161724] border border-white/10 rounded-2xl p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Requested Program
                  </span>
                  <div className="text-white font-bold mt-0.5">
                    {selectedBooking.program}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Assigned Trainer
                  </span>
                  <div className="text-[#FFD400] font-bold mt-0.5">
                    {selectedBooking.trainer_name || 'Floor Coach'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Preferred Date & Time
                  </span>
                  <div className="text-white font-bold mt-0.5">
                    {selectedBooking.preferred_date || selectedBooking.booking_date} at {selectedBooking.preferred_time || selectedBooking.booking_time}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Current Status
                  </span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        selectedBooking.status === 'confirmed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : selectedBooking.status === 'cancelled'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Update Booking Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'pending')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedBooking.status === 'pending'
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'bg-white/5 text-amber-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-emerald-400 text-black border-emerald-400'
                        : 'bg-white/5 text-emerald-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedBooking.status === 'cancelled'
                        ? 'bg-rose-400 text-black border-rose-400'
                        : 'bg-white/5 text-rose-400 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setDeletingId(selectedBooking.id)}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Booking</span>
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DELETE MODAL                                         */}
      {/* ==================================================== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#12131D] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-black text-lg text-white">
                Delete Booking Request?
              </h4>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Are you sure you want to permanently delete this booking record?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
