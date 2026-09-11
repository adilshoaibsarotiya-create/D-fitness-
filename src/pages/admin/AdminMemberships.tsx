import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Star,
  RefreshCw,
  X,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Membership } from '../../types';

export const AdminMemberships: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'sort_order' | 'price' | 'name'>('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    name: string;
    price: string | number;
    duration: string;
    description: string;
    features: string;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
  }>({
    name: '',
    price: '',
    duration: '1 Month',
    description: '',
    features: '',
    is_featured: false,
    is_active: true,
    sort_order: 1
  });

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getMemberships();
      setMemberships(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingMembership(null);
    setFormData({
      name: '',
      price: '',
      duration: '1 Month',
      description: '',
      features: 'Full Gym Access\nLocker Room Facility\nFitness Assessment',
      is_featured: false,
      is_active: true,
      sort_order: (memberships.length || 0) + 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (item: Membership) => {
    setEditingMembership(item);
    setFormData({
      name: item.name,
      price: item.price,
      duration: item.duration || '1 Month',
      description: item.description || '',
      features: (item.features || item.benefits || []).join('\n'),
      is_featured: Boolean(item.is_featured),
      is_active: Boolean(item.is_active),
      sort_order: item.sort_order || 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleSaveMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Membership plan name is required.');
      return;
    }
    const parsedPrice = Number(formData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Please provide a valid price (e.g. 1499).');
      return;
    }

    setFormSubmitting(true);

    const featureList = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const membershipPayload: Membership = {
      id: editingMembership ? editingMembership.id : `plan-${Date.now()}`,
      name: formData.name.trim().toUpperCase(),
      price: parsedPrice,
      duration: formData.duration.trim(),
      description: formData.description.trim(),
      features: featureList,
      benefits: featureList,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      sort_order: Number(formData.sort_order) || 1,
      created_at: editingMembership?.created_at || new Date().toISOString()
    };

    const res = await supabaseService.saveMembership(membershipPayload);
    setFormSubmitting(false);

    if (res.success) {
      setIsDrawerOpen(false);
      await loadMemberships();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast(
          editingMembership
            ? `Membership ${membershipPayload.name} updated successfully!`
            : `New plan ${membershipPayload.name} created successfully!`,
          'success'
        );
      }
    } else {
      setFormError(res.error || 'Failed to save membership plan.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const res = await supabaseService.deleteMembership(deletingId);
    setDeletingId(null);
    if (res.success) {
      await loadMemberships();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast('Membership plan deleted.', 'info');
      }
    }
  };

  const handleToggleActive = async (item: Membership) => {
    const updated = { ...item, is_active: !item.is_active };
    await supabaseService.saveMembership(updated);
    setMemberships((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
    if ((window as any).__dfitnessToast) {
      (window as any).__dfitnessToast(
        `Plan ${item.name} is now ${updated.is_active ? 'Active' : 'Inactive'}.`,
        'info'
      );
    }
  };

  const handleToggleFeatured = async (item: Membership) => {
    const updated = { ...item, is_featured: !item.is_featured };
    await supabaseService.saveMembership(updated);
    setMemberships((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
    if ((window as any).__dfitnessToast) {
      (window as any).__dfitnessToast(
        `Plan ${item.name} featured status updated.`,
        'info'
      );
    }
  };

  // Filter and Sort calculations
  const filteredMemberships = memberships
    .filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.duration.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterStatus === 'active') return m.is_active;
      if (filterStatus === 'inactive') return !m.is_active;
      return true;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === 'price') {
        comp = Number(a.price) - Number(b.price);
      } else if (sortBy === 'name') {
        comp = a.name.localeCompare(b.name);
      } else {
        comp = Number(a.sort_order) - Number(b.sort_order);
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

  return (
    <AdminLayout
      pageTitle="Memberships Management"
      pageSubtitle="Configure tier names, dynamic pricing, access features, and active plans on the public website."
      actions={
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_20px_rgba(255,212,0,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Membership</span>
        </button>
      }
    >
      {/* ==================================================== */}
      {/* FILTER & SEARCH BAR (MATCHING REFERENCE UI)          */}
      {/* ==================================================== */}
      <div className="bg-[#10111A] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, duration, keyword..."
            className="w-full bg-[#161724] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#FFD400]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center bg-[#161724] border border-white/10 rounded-full p-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-[#FFD400] text-black'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              All ({memberships.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                filterStatus === 'active'
                  ? 'bg-emerald-400 text-black font-bold'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Active ({memberships.filter((m) => m.is_active).length})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                filterStatus === 'inactive'
                  ? 'bg-gray-400 text-black font-bold'
                  : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Inactive
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#161724] border border-white/10 rounded-full px-3 py-1 text-xs text-[#A0A0A0]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD400]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="sort_order" className="bg-[#13141F]">Sort Order</option>
              <option value="price" className="bg-[#13141F]">Price</option>
              <option value="name" className="bg-[#13141F]">Plan Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-xs text-[#FFD400] font-bold ml-1 hover:underline"
              title="Toggle sort direction"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MEMBERSHIPS TABLE & CARDS VIEW                       */}
      {/* ==================================================== */}
      {loading ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#FFD400] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#A0A0A0]">Loading memberships from Supabase...</p>
        </div>
      ) : filteredMemberships.length === 0 ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No memberships found</h3>
          <p className="text-xs text-[#A0A0A0] mb-4">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Add your first membership tier to show on the public website.'}
          </p>
          <button
            onClick={handleOpenAddDrawer}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] text-black inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Membership</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#141522] text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Plan Name</th>
                  <th className="py-3.5 px-4">Dynamic Price</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Features</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Sort</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white">
                {filteredMemberships.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Plan Name & Tagline */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center text-xs font-black font-heading text-[#FFD400]">
                          {item.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-heading font-black text-sm text-white tracking-wider flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.is_featured && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FFD400] text-black">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#A0A0A0] max-w-xs truncate mt-0.5">
                            {item.description || 'Standard membership package'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price (Dynamic from memberships.price) */}
                    <td className="py-4 px-4 font-display font-black text-sm text-[#FFD400]">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-[#A0A0A0] font-medium">
                      {item.duration}
                    </td>

                    {/* Features Count */}
                    <td className="py-4 px-4 text-[#A0A0A0]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white">
                        {(item.features || item.benefits || []).length} Privileges
                      </span>
                    </td>

                    {/* Status Pill (Active / Inactive) */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all ${
                          item.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-[#808080] border border-white/10'
                        }`}
                        title="Click to toggle active state"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.is_active ? 'bg-emerald-400' : 'bg-gray-500'
                          }`}
                        />
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.is_featured
                            ? 'bg-[#FFD400]/20 text-[#FFD400] border-[#FFD400]/40 shadow-sm'
                            : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                        title="Click to toggle featured tier badge"
                      >
                        <Star className={`w-4 h-4 ${item.is_featured ? 'fill-[#FFD400]' : ''}`} />
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-4 text-center text-[#A0A0A0] font-mono font-bold text-xs">
                      #{item.sort_order}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditDrawer(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/10 text-white/60 hover:text-rose-400 transition-all"
                          title="Delete Plan"
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
      {/* SLIDE-OVER DRAWER FOR ADD / EDIT MEMBERSHIP          */}
      {/* ==================================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => !formSubmitting && setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-lg bg-[#10111A] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-black font-heading text-white">
                  {editingMembership ? 'Edit Membership Plan' : 'Create New Membership'}
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-0.5">
                  Synchronizes directly with <code className="text-[#FFD400]">memberships</code> in Supabase.
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMembership} className="space-y-4 flex-1">
              {/* Plan Name */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. SILVER, GOLD, ELITE, PLATINUM"
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              {/* Price & Duration Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1499"
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#FFD400] placeholder-[#707070] focus:outline-none focus:border-[#FFD400]"
                  />
                  <p className="text-[10px] text-[#A0A0A0] mt-1">
                    Updates <span className="text-[#FFD400]">memberships.price</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Duration *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400] cursor-pointer"
                  >
                    <option value="1 Month">1 Month (30 Days)</option>
                    <option value="3 Months">3 Months (90 Days)</option>
                    <option value="6 Months">6 Months (180 Days)</option>
                    <option value="1 Year">1 Year (365 Days)</option>
                    <option value="Day Pass">1 Day Pass</option>
                  </select>
                </div>
              </div>

              {/* Description / Tagline */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Plan Description / Tagline
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary of this fitness tier..."
                  className="w-full bg-[#161724] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#707070] focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              {/* Features (One per line) */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Included Privileges / Features (One per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Full Gym Floor Access&#10;Locker & Shower Facility&#10;Fitness Assessment&#10;Cardio Theatre"
                  className="w-full bg-[#161724] border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder-[#707070] focus:outline-none focus:border-[#FFD400]"
                />
                <p className="text-[10px] text-[#A0A0A0] mt-1">
                  Each line appears as a checkmark privilege item on the public website.
                </p>
              </div>

              {/* Featured & Active Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-[#161724] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FFD400] focus:ring-0 focus:ring-offset-0 bg-black/40 border-white/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Featured Plan</span>
                    <span className="text-[10px] text-[#A0A0A0]">Highlighted on site</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#161724] border border-white/10 rounded-xl cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-400 focus:ring-0 focus:ring-offset-0 bg-black/40 border-white/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Active Status</span>
                    <span className="text-[10px] text-[#A0A0A0]">Available to public</span>
                  </div>
                </label>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={formSubmitting}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_20px_rgba(255,212,0,0.3)] disabled:opacity-50 flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <span>{editingMembership ? 'Update Membership' : 'Create Membership'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DELETE CONFIRMATION MODAL                            */}
      {/* ==================================================== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#12131D] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-heading font-black text-lg text-white">
                Delete Membership Plan?
              </h4>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Are you sure you want to permanently delete this plan from <code className="text-white">memberships</code>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
