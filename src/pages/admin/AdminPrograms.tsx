import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Flame
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService } from '../../services/supabaseService';
import { Program } from '../../types';

export const AdminPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    image_url: string;
    difficulty_level: string;
    duration_weeks: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
  }>({
    title: '',
    description: '',
    category: 'Strength',
    image_url: '',
    difficulty_level: 'All Levels',
    duration_weeks: 12,
    is_active: true,
    is_featured: false,
    sort_order: 1
  });

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getPrograms();
      setPrograms(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDrawer = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      description: '',
      category: 'Strength',
      image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      difficulty_level: 'Intermediate',
      duration_weeks: 12,
      is_active: true,
      is_featured: false,
      sort_order: (programs.length || 0) + 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (prog: Program) => {
    setEditingProgram(prog);
    setFormData({
      title: prog.title,
      description: prog.description || '',
      category: prog.category || 'General Fitness',
      image_url: prog.image_url || '',
      difficulty_level: prog.difficulty_level || 'All Levels',
      duration_weeks: prog.duration_weeks || 12,
      is_active: Boolean(prog.is_active),
      is_featured: Boolean(prog.is_featured),
      sort_order: prog.sort_order || 1
    });
    setFormError(null);
    setIsDrawerOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Program title is required.');
      return;
    }

    setFormSubmitting(true);

    const programPayload: Program = {
      id: editingProgram ? editingProgram.id : `prog-${Date.now()}`,
      slug: editingProgram?.slug || formData.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: formData.title.trim(),
      name: formData.title.trim(),
      shortDescription: formData.description.trim() || 'Comprehensive workout program tailored for real gym results.',
      overview: formData.description.trim() || 'Comprehensive workout program tailored for real gym results.',
      description: formData.description.trim(),
      whoItIsFor: editingProgram?.whoItIsFor || ['Fitness Enthusiasts', 'Beginners & Athletes'],
      benefits: editingProgram?.benefits || ['Strength Building', 'Conditioning', 'Performance'],
      trainingApproach: editingProgram?.trainingApproach || ['Progressive Overload', 'Form First'],
      typicalSession: editingProgram?.typicalSession || ['Warmup', 'Compound Lift', 'Accessories', 'Cool down'],
      difficulty: (formData.difficulty_level as any) || 'Intermediate',
      category: (formData.category as any) || 'strength',
      image: formData.image_url.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
      image_url: formData.image_url.trim(),
      difficulty_level: formData.difficulty_level,
      duration_weeks: Number(formData.duration_weeks) || 12,
      duration: `${formData.duration_weeks} Weeks`,
      frequency: '5 Days / Week',
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      featured: formData.is_featured,
      sort_order: Number(formData.sort_order) || 1,
      created_at: editingProgram?.created_at || new Date().toISOString()
    };

    const res = await supabaseService.saveProgram(programPayload);
    setFormSubmitting(false);

    if (res.success) {
      setIsDrawerOpen(false);
      await loadPrograms();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast(
          editingProgram
            ? `Program "${programPayload.title}" updated!`
            : `New program "${programPayload.title}" created!`,
          'success'
        );
      }
    } else {
      setFormError(res.error || 'Failed to save fitness program.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const res = await supabaseService.deleteProgram(deletingId);
    setDeletingId(null);
    if (res.success) {
      await loadPrograms();
      if ((window as any).__dfitnessToast) {
        (window as any).__dfitnessToast('Program removed successfully.', 'info');
      }
    }
  };

  const handleToggleActive = async (item: Program) => {
    const updated = { ...item, is_active: !item.is_active };
    await supabaseService.saveProgram(updated);
    setPrograms((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
  };

  const handleToggleFeatured = async (item: Program) => {
    const updated = { ...item, is_featured: !item.is_featured };
    await supabaseService.saveProgram(updated);
    setPrograms((prev) => prev.map((p) => (p.id === item.id ? updated : p)));
  };

  // Filter calculation
  const filteredPrograms = programs.filter((p) => {
    const titleMatch = (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch;
    if (!matchesSearch) return false;
    if (filterCategory !== 'all' && (p.category || '').toLowerCase() !== filterCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  const categories = ['all', ...Array.from(new Set(programs.map((p) => p.category || 'General').filter(Boolean)))];

  return (
    <AdminLayout
      pageTitle="Fitness Programs"
      pageSubtitle="Curate training programs, difficulty tiers, workout modalities, and hero images."
      actions={
        <button
          onClick={handleOpenAddDrawer}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_20px_rgba(255,212,0,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
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
            placeholder="Search programs by title or description..."
            className="w-full bg-[#161724] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-[#808080] focus:outline-none focus:border-[#FFD400]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Category Tabs */}
          <div className="flex items-center bg-[#161724] border border-white/10 rounded-full p-1 text-xs overflow-x-auto">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-[#FFD400] text-black font-bold'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {cat === 'all' ? `All (${programs.length})` : cat}
              </button>
            ))}
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-[#161724] border border-white/10 rounded-full p-1 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-[#A0A0A0]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                viewMode === 'table' ? 'bg-white/20 text-white' : 'text-[#A0A0A0]'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* PROGRAMS LIST OR GRID                                */}
      {/* ==================================================== */}
      {loading ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <RefreshCw className="w-6 h-6 text-[#FFD400] animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#A0A0A0]">Loading programs from Supabase...</p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="bg-[#10111A] border border-white/10 rounded-3xl p-12 text-center">
          <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No programs found</h3>
          <p className="text-xs text-[#A0A0A0] mb-4">
            Try adjusting your search criteria or add your first training program.
          </p>
          <button
            onClick={handleOpenAddDrawer}
            className="px-4 py-2 rounded-full text-xs font-bold bg-[#FFD400] text-black inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((p) => (
            <div
              key={p.id}
              className="bg-[#10111A] border border-white/10 hover:border-[#FFD400]/40 rounded-3xl overflow-hidden flex flex-col group transition-all shadow-xl"
            >
              {/* Image Preview Container */}
              <div className="relative h-48 w-full bg-[#161724] overflow-hidden">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                {/* Category Badge & Duration Pill */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#FFD400] border border-white/10">
                    {p.category || 'Fitness'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {p.duration_weeks} Wks
                  </span>
                </div>

                {/* Action Buttons Floating on Image */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEditDrawer(p)}
                    className="p-1.5 rounded-full bg-black/80 text-white hover:text-[#FFD400] backdrop-blur-md border border-white/20"
                    title="Edit Program"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(p.id)}
                    className="p-1.5 rounded-full bg-black/80 text-white hover:text-rose-400 backdrop-blur-md border border-white/20"
                    title="Delete Program"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-heading font-black text-base text-white group-hover:text-[#FFD400] transition-colors">
                      {p.title}
                    </h4>
                    <span className="text-[10px] font-bold text-[#A0A0A0] bg-white/5 px-2 py-0.5 rounded-full">
                      {p.difficulty_level || 'All Levels'}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A0A0] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Status & Featured Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      p.is_active ? 'text-emerald-400' : 'text-[#808080]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.is_active ? 'bg-emerald-400' : 'bg-gray-500'
                      }`}
                    />
                    {p.is_active ? 'Active' : 'Inactive'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1 rounded text-xs transition-colors ${
                        p.is_featured ? 'text-[#FFD400]' : 'text-white/30 hover:text-white/60'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className={`w-4 h-4 ${p.is_featured ? 'fill-[#FFD400]' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleOpenEditDrawer(p)}
                      className="text-xs font-semibold text-white/80 hover:text-[#FFD400]"
                    >
                      Edit &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#10111A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#141522] text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                <th className="py-3.5 px-6">Program</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white">
              {filteredPrograms.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#161724] border border-white/10 overflow-hidden shrink-0">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-heading font-black text-sm text-white">
                          {p.title}
                        </div>
                        <p className="text-[11px] text-[#A0A0A0] max-w-xs truncate">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#FFD400] font-semibold">
                    {p.category}
                  </td>
                  <td className="py-4 px-4 text-[#A0A0A0]">
                    {p.duration_weeks} Weeks
                  </td>
                  <td className="py-4 px-4 text-[#A0A0A0]">
                    {p.difficulty_level}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        p.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-[#808080]'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditDrawer(p)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(p.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400"
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
      )}

      {/* ==================================================== */}
      {/* DRAWER FOR ADD / EDIT PROGRAM                        */}
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
                  {editingProgram ? 'Edit Fitness Program' : 'Create Fitness Program'}
                </h3>
                <p className="text-xs text-[#A0A0A0] mt-0.5">
                  Synchronizes directly with <code className="text-[#FFD400]">programs</code> in Supabase.
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

            <form onSubmit={handleSaveProgram} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hypertrophy & Strength Mastery"
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  >
                    <option value="Strength">Strength & Power</option>
                    <option value="Cardio & HIIT">Cardio & HIIT</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Functional">Functional Training</option>
                    <option value="Bodybuilding">Bodybuilding</option>
                    <option value="Mobility">Mobility & Rehab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: Number(e.target.value) })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                >
                  <option value="Beginner Friendly">Beginner Friendly</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced / Elite">Advanced / Elite</option>
                  <option value="All Levels">All Levels Welcome</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Cover Photo URL (Unsplash or CDN)
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
                  Program Description & Objectives
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed breakdown of workout days, targeted muscle groups, nutrition guidance..."
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
                    <span className="text-xs font-bold text-white block">Featured Program</span>
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
                    <span className="text-[10px] text-[#A0A0A0]">Visible to Public</span>
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
                    <span>{editingProgram ? 'Update Program' : 'Create Program'}</span>
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
                Delete Fitness Program?
              </h4>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Are you sure you want to delete this program from the database?
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
                Delete Program
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
