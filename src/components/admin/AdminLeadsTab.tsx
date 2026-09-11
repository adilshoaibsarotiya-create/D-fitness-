import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Trash2,
  Download,
  Calendar,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Lead } from '../../types';
import { supabaseService } from '../../services/supabaseService';

interface AdminLeadsTabProps {
  leads: Lead[];
  onRefresh: () => void;
  initialSource?: string;
  title?: string;
}

export const AdminLeadsTab: React.FC<AdminLeadsTabProps> = ({
  leads,
  onRefresh,
  initialSource = 'all',
  title
}) => {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState(initialSource);
  const [statusFilter, setStatusFilter] = useState('all');

  React.useEffect(() => {
    if (initialSource) {
      setSourceFilter(initialSource);
    }
  }, [initialSource]);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.goal && lead.goal.toLowerCase().includes(search.toLowerCase())) ||
      (lead.selectedPlan && lead.selectedPlan.toLowerCase().includes(search.toLowerCase()));

    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const handleStatusChange = async (leadId: string, newStatus: 'new' | 'contacted' | 'enrolled' | 'closed') => {
    await supabaseService.updateLeadStatus(leadId, newStatus);
    onRefresh();
  };

  const handleDelete = async (leadId: string) => {
    if (window.confirm('Are you sure you want to remove this lead record?')) {
      await supabaseService.deleteLead(leadId);
      onRefresh();
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Source', 'Goal/Plan', 'Preferred Date', 'Status', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleDateString(),
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      l.source,
      `"${(l.goal || l.selectedPlan || '').replace(/"/g, '""')}"`,
      `"${(l.preferredDate || '').replace(/"/g, '""')}"`,
      l.status,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `d_fitness_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#121212] p-6 rounded-2xl border border-white/10">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#BDBDBD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or goal..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
            />
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-[#BDBDBD] text-xs outline-none focus:border-[#FFD400]"
          >
            <option value="all">All Sources</option>
            <option value="free_trial">Free Trial Passes</option>
            <option value="membership">Membership Applications</option>
            <option value="contact_form">Contact Enquiries</option>
            <option value="trainer_booking">Trainer Bookings</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-[#BDBDBD] text-xs outline-none focus:border-[#FFD400]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* CSV Export */}
        <button
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="px-4 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4 text-[#FFD400]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121212] overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-[#BDBDBD]/40 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No Leads Found</h4>
            <p className="text-xs text-[#BDBDBD]">
              {leads.length === 0
                ? 'Submissions through Free Trial, Membership, or Contact forms will display here in real-time.'
                : 'No leads match the active search or filter selection.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead>
                <tr className="border-b border-white/10 bg-[#181818] text-[#BDBDBD] uppercase tracking-wider font-semibold">
                  <th className="p-4">Date</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Source & Type</th>
                  <th className="p-4">Goal / Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#BDBDBD]">
                {filteredLeads.map((lead) => {
                  const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20D%20FITNESS%20Godda%20following%20up%20on%20your%20inquiry.`;
                  const callUrl = `tel:${lead.phone.replace(/\s+/g, '')}`;

                  return (
                    <tr key={lead.id} className="hover:bg-[#161616] transition-colors">
                      <td className="p-4 whitespace-nowrap text-white/70">
                        {new Date(lead.createdAt).toLocaleDateString()}
                        <span className="block text-[10px] text-[#BDBDBD]/60">
                          {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block text-sm">
                          {lead.name}
                        </span>
                        <span className="text-white/80 block">{lead.phone}</span>
                        <span className="text-[10px] text-[#BDBDBD]/80">{lead.email}</span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          lead.source === 'free_trial'
                            ? 'bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30'
                            : lead.source === 'membership'
                            ? 'bg-[#00FF84]/15 text-[#00FF84] border border-[#00FF84]/30'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}>
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-white block">
                          {lead.goal || lead.selectedPlan || 'General inquiry'}
                        </span>
                        {lead.preferredDate && (
                          <span className="text-[10px] text-[#BDBDBD] block mt-0.5">
                            Pref Date: {lead.preferredDate} ({lead.preferredTime || 'Anytime'})
                          </span>
                        )}
                        {lead.message && (
                          <span className="text-[10px] text-white/60 block line-clamp-1 italic mt-0.5">
                            "{lead.message}"
                          </span>
                        )}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border outline-none bg-[#1a1a1a] ${
                            lead.status === 'new'
                              ? 'text-[#FFD400] border-[#FFD400]/40'
                              : lead.status === 'contacted'
                              ? 'text-[#4ea8de] border-[#4ea8de]/40'
                              : lead.status === 'enrolled'
                              ? 'text-[#00FF84] border-[#00FF84]/40'
                              : 'text-[#BDBDBD] border-white/20'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={callUrl}
                            className="p-2 rounded-lg bg-[#1c1c1c] text-[#FFD400] hover:bg-[#FFD400] hover:text-black transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#1c1c1c] text-[#00FF84] hover:bg-[#00FF84] hover:text-black transition-colors"
                            title="WhatsApp Lead"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 rounded-lg bg-[#1c1c1c] text-[#FF4C61] hover:bg-[#FF4C61] hover:text-white transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
