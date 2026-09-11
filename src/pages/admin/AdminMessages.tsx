import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  Trash2,
  RefreshCw,
  Clock,
  MessageCircle,
  X,
  ExternalLink,
  Inbox
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { ContactMessage } from '../../types';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getContactMessages();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    const nextStatus = msg.status === 'read' ? 'unread' : 'read';
    const res = await supabaseService.updateContactMessageStatus(msg.id, nextStatus);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, status: nextStatus });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const res = await supabaseService.deleteContactMessage(deletingId);
    setDeletingId(null);
    if (selectedMessage?.id === deletingId) {
      setSelectedMessage(null);
    }
    if (res.success) {
      await loadMessages();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast('Message deleted.', 'info');
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      (m.name || '').toLowerCase().includes(term) ||
      (m.email || '').toLowerCase().includes(term) ||
      (m.phone || '').toLowerCase().includes(term) ||
      (m.message || '').toLowerCase().includes(term) ||
      (m.subject || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (filterStatus === 'unread' && m.status !== 'unread') return false;
    if (filterStatus === 'read' && m.status !== 'read') return false;
    return true;
  });

  return (
    <AdminLayout
      pageTitle="Contact Inquiries"
      pageSubtitle="Customer inquiries, membership questions, and direct messages sent from the gym website."
      actions={
        <button
          onClick={loadMessages}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FFD400]" />
          <span>Refresh</span>
        </button>
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
            placeholder="Search inquiries by name, phone, keywords..."
            className="w-full bg-[#161724] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#FFD400]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-[#161724] border border-white/10 rounded-full p-1 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#FFD400] text-black font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              filterStatus === 'unread'
                ? 'bg-[#FF4C61] text-white font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Unread ({messages.filter((m) => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              filterStatus === 'read'
                ? 'bg-white/20 text-white font-bold'
                : 'text-[#A0A0A0] hover:text-white'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MESSAGES LIST & INBOX VIEW                           */}
      {/* ==================================================== */}
      {loading ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#FFD400] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#A0A0A0]">Loading messages from Supabase...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <Inbox className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Inbox is empty</h3>
          <p className="text-xs text-[#A0A0A0]">
            {searchQuery
              ? 'No messages matched your query.'
              : 'Website inquiries will be collected and organized here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (msg.status === 'unread') {
                  handleToggleRead(msg);
                }
              }}
              className={`bg-[#10111A] border rounded-2xl p-5 cursor-pointer transition-all hover:border-[#FFD400]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
                msg.status === 'unread'
                  ? 'border-[#FFD400]/40 bg-[#121320]'
                  : 'border-white/10'
              }`}
            >
              {/* Left Column: Sender, Subject & Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-heading font-black text-sm text-white truncate">
                    {msg.name}
                  </span>

                  {msg.status === 'unread' && (
                    <span className="text-[10px] font-black text-black bg-[#FFD400] px-2 py-0.5 rounded-full uppercase">
                      New
                    </span>
                  )}

                  <span className="text-[11px] text-[#808080] ml-auto md:ml-2">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#FFD400] mb-1">
                  {msg.subject || 'Website Inquiry'}
                </div>

                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-[#A0A0A0]">
                  {msg.phone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#FFD400]" />
                      {msg.phone}
                    </span>
                  )}
                  {msg.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-blue-400" />
                      {msg.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div
                className="flex items-center gap-2 shrink-0 self-end md:self-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleToggleRead(msg)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    msg.status === 'unread'
                      ? 'bg-[#FFD400]/10 text-[#FFD400] border-[#FFD400]/30 hover:bg-[#FFD400]/20'
                      : 'bg-white/5 text-[#A0A0A0] border-white/10 hover:text-white'
                  }`}
                >
                  {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                </button>

                <button
                  onClick={() => setDeletingId(msg.id)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-400"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* MESSAGE DETAIL SLIDE-OVER DRAWER                     */}
      {/* ==================================================== */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
          <div
            onClick={() => setSelectedMessage(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-[#10111A] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-black font-heading text-white">
                  Message Details
                </h3>
                <span className="text-xs text-[#A0A0A0]">
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 flex-1">
              {/* Sender Details */}
              <div className="bg-[#161724] border border-white/10 rounded-2xl p-4">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                  Sender
                </span>
                <h4 className="text-base font-black font-heading text-white mt-1">
                  {selectedMessage.name}
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex items-center gap-2 text-white/80 hover:text-[#FFD400]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FFD400]" />
                      <span>{selectedMessage.phone}</span>
                    </a>
                  )}

                  {selectedMessage.email && (
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="flex items-center gap-2 text-white/80 hover:text-[#FFD400]"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedMessage.email}</span>
                    </a>
                  )}
                </div>

                {/* WhatsApp button */}
                {selectedMessage.phone && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply via WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Subject & Full Content */}
              <div className="bg-[#161724] border border-white/10 rounded-2xl p-5 space-y-3">
                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Subject Line
                  </span>
                  <div className="text-sm font-bold text-[#FFD400] mt-0.5">
                    {selectedMessage.subject || 'Gym General Inquiry'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Full Message
                  </span>
                  <div className="mt-2 text-xs text-white/90 leading-relaxed whitespace-pre-wrap bg-[#10111A] p-4 rounded-xl border border-white/5 font-sans">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setDeletingId(selectedMessage.id)}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Message</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
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
                Delete Inbound Message?
              </h4>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Are you sure you want to delete this message record?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
