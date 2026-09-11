import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  RefreshCw,
  X,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Trainer } from '../../types';

export const AdminTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    experience_years: number;
    bio: string;
    image_url: string;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
  }>({
    name: '',
    role: 'Strength & Conditioning Coach',
    experience_years: 5,
    bio: '',
    image_url: '',
    is_active: true,
    is_featured: false,
    sort_order: 1
  });

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getTrainers();
      setTrainers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      role: 'Strength & Conditioning Coach',
      experience_years: 5,
      bio: '',
      image_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
      is_active: true,
      is_featured: false,
      sort_order: (trainers.length || 0) + 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      role: trainer.role || trainer.specialty || 'Fitness Coach',
      experience_years: trainer.experience_years || 5,
      bio: trainer.bio || '',
      image_url: trainer.image_url || '',
      is_active: Boolean(trainer.is_active),
      is_featured: Boolean(trainer.is_featured),
      sort_order: trainer.sort_order || 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleSaveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Trainer name is required.');
      return;
    }

    setFormSubmitting(true);

    const trainerPayload: Trainer = {
      id: editingTrainer ? editingTrainer.id : `trainer-${Date.now()}`,
      name: formData.name.trim(),
      role: formData.role.trim(),
      specialty: formData.role.trim(),
      specialization: editingTrainer?.specialization || [formData.role.trim(), 'Personal Training'],
      experience_years: Number(formData.experience_years) || 1,
      experience: `${formData.experience_years} Years`,
      bio: formData.bio.trim() || 'Certified gym trainer dedicated to personal growth, technique, and peak fitness results.',
      image: formData.image_url.trim() || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800',
      image_url: formData.image_url.trim(),
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      featured: formData.is_featured,
      sort_order: Number(formData.sort_order) || 1,
      created_at: editingTrainer?.created_at || new Date().toISOString()
    };

    const res = await supabaseService.saveTrainer(trainerPayload);
    setFormSubmitting(false);

    if (res.success) {
      setIsDrawerOpen(false);
      await loadTrainers();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast(
          editingTrainer
            ? `Trainer "${trainerPayload.name}" updated successfully!`
            : `New trainer "${trainerPayload.name}" added!`,
          'success'
        );
      }
    } else {
      setFormError(res.error || 'Failed to save trainer profile.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const res = await supabaseService.deleteTrainer(deletingId);
    setDeletingId(null);
    if (res.success) {
      await loadTrainers();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast('Trainer profile removed.', 'info');
      }
    }
  };

  const handleToggleActive = async (item: Trainer) => {
    const updated = { ...item, is_active: !item.is_active };
    await supabaseService.saveTrainer(updated);
    setTrainers((prev) => prev.map((t) => (t.id === item.id ? updated : t)));
  };

  const filteredTrainers = trainers.filter((t) => {
    const nameMatch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = (t.role || t.specialty || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatch && !roleMatch) return false;
    if (filterSpecialty !== 'all' && (t.role || t.specialty || '').toLowerCase() !== filterSpecialty.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout
      pageTitle="Trainers & Coaches"
      pageSubtitle="Manage coaching staff, credentials, specializations, and booking availability."
      actions={
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_20px_rgba(255,212,0,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer</span>
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
            placeholder="Search trainers by name or specialty..."
            className="w-full bg-[#161724] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#FFD400]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A0A0A0]">Total Active Coaches:</span>
          <span className="font-bold text-[#FFD400]">
            {trainers.filter((t) => t.is_active).length} / {trainers.length}
          </span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TRAINERS CARD GRID                                   */}
      {/* ==================================================== */}
      {loading ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#FFD400] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#A0A0A0]">Loading coaches from Supabase...</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No trainers found</h3>
          <p className="text-xs text-[#A0A0A0] mb-4">
            Add your gym's certified personal trainers and fitness instructors.
          </p>
          <button
            onClick={handleOpenAddDrawer}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] text-black inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trainer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrainers.map((t) => (
            <div
              key={t.id}
              className="bg-[#10111A] border border-white/10 hover:border-[#FFD400]/40 rounded-3xl overflow-hidden flex flex-col group transition-all shadow-xl"
            >
              {/* Photo Area */}
              <div className="relative h-64 w-full bg-[#161724] overflow-hidden">
                {t.image_url ? (
                  <img
                    src={t.image_url}
                    alt={t.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Users className="w-16 h-16" />
                  </div>
                )}

                {/* Floating Experience Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-[#FFD400] border border-white/10 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {t.experience_years} Years Exp
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditDrawer(t)}
                    className="p-1.5 rounded-full bg-black/80 text-white hover:text-[#FFD400] backdrop-blur-md border border-white/20"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(t.id)}
                    className="p-1.5 rounded-full bg-black/80 text-white hover:text-rose-400 backdrop-blur-md border border-white/20"
                    title="Delete Trainer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-black text-base text-white group-hover:text-[#FFD400] transition-colors">
                    {t.name}
                  </h4>
                  <div className="text-xs text-[#FFD400] font-semibold mt-0.5">
                    {t.role || t.specialty || 'Head Fitness Coach'}
                  </div>

                  <p className="text-xs text-[#A0A0A0] line-clamp-3 mt-2.5 leading-relaxed">
                    {t.bio || 'Specializes in high-intensity functional training, body recomposition, and sports conditioning.'}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(t)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      t.is_active ? 'text-emerald-400' : 'text-[#808080]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.is_active ? 'bg-emerald-400' : 'bg-gray-500'
                      }`}
                    />
                    {t.is_active ? 'Available' : 'On Leave'}
                  </button>

                  <button
                    onClick={() => handleOpenEditDrawer(t)}
                    className="text-xs font-semibold text-white/80 hover:text-[#FFD400]"
                  >
                    Edit &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* DRAWER FOR ADD / EDIT TRAINER                        */}
      {/* ==================================================== */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
          <div
            onClick={() => !formSubmitting && setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-[#10111A] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-black font-heading text-white">
                  {editingTrainer ? 'Edit Trainer Profile' : 'Add New Coach'}
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-0.5">
                  Synchronizes directly with <code className="text-[#FFD400]">trainers</code> in Supabase.
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

            <form onSubmit={handleSaveTrainer} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Trainer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Singh"
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Specialty / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Strength & Conditioning"
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Portrait Photo URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Certified personal trainer with extensive background in powerlifting, mobility, and client transformations..."
                  className="w-full bg-[#161724] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-[#161724] border border-white/10 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FFD400] bg-black/40 border-white/20"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Featured Coach</span>
                    <span className="text-[10px] text-[#A0A0A0]">Highlighted on Home</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#161724] border border-white/10 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-400 bg-black/40 border-white/20"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Active Status</span>
                    <span className="text-[10px] text-[#A0A0A0]">Available for Booking</span>
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-white"
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
                    <span>{editingTrainer ? 'Update Coach' : 'Add Coach'}</span>
                  )}
                </button>
              </div>
            </form>
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
                Remove Coach Profile?
              </h4>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Are you sure you want to delete this trainer profile from the database?
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
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
