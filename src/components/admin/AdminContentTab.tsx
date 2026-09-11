import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Users,
  CreditCard,
  Image as ImageIcon,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud,
  Search,
  Check,
  Star
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import {
  Program,
  Trainer,
  MembershipPlan,
  GalleryItem,
  TransformationStory,
  Testimonial,
  FAQItem
} from '../../types';
import { uploadFileToStorage, STORAGE_BUCKETS } from '../../lib/supabase';

export type ContentSubTab = 'programs' | 'trainers' | 'plans' | 'gallery' | 'transformations' | 'testimonials' | 'faqs';

interface AdminContentTabProps {
  initialSubTab?: ContentSubTab;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({ initialSubTab = 'plans' }) => {
  const [activeSubTab, setActiveSubTab] = useState<ContentSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState('');

  // Data states
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [transformations, setTransformations] = useState<TransformationStory[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for Create/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ContentSubTab | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [
        pList,
        tList,
        mList,
        gList,
        trList,
        testList,
        faqList
      ] = await Promise.all([
        supabaseService.getPrograms(),
        supabaseService.getTrainers(),
        supabaseService.getMembershipPlans(),
        supabaseService.getGallery(),
        supabaseService.getTransformations(),
        supabaseService.getTestimonials(),
        supabaseService.getFAQs()
      ]);

      setPrograms(pList);
      setTrainers(tList);
      setPlans(mList);
      setGallery(gList);
      setTransformations(trList);
      setTestimonials(testList);
      setFaqs(faqList);
    } catch (err: any) {
      console.warn('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Open modal for Create or Edit
  const openCreateModal = (type: ContentSubTab) => {
    setModalType(type);
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (type: ContentSubTab, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setEditingItem(null);
  };

  // Generic Image Upload to designated bucket
  const handleImageUpload = async (bucket: string, file: File, callback: (url: string) => void) => {
    setUploadingImage(true);
    try {
      const res = await uploadFileToStorage(bucket, file, 'content');
      if (res.url) {
        callback(res.url);
        showNotification('success', 'Image uploaded to Supabase Storage!');
      } else {
        showNotification('error', res.error || 'Image upload failed');
      }
    } catch (e: any) {
      showNotification('error', e.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // ----------------------------------------------------
  // DELETE HANDLERS
  // ----------------------------------------------------
  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Delete this program? This cannot be undone.')) return;
    const res = await supabaseService.deleteProgram(id);
    if (res.success) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      showNotification('success', 'Program removed successfully.');
    } else {
      showNotification('error', res.error || 'Failed to delete program.');
    }
  };

  const handleDeleteTrainer = async (id: string) => {
    if (!window.confirm('Remove this coach? This cannot be undone.')) return;
    const res = await supabaseService.deleteTrainer(id);
    if (res.success) {
      setTrainers(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'Coach removed successfully.');
    } else {
      showNotification('error', res.error || 'Failed to remove coach.');
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm('Delete this membership tier?')) return;
    const res = await supabaseService.deleteMembershipPlan(id);
    if (res.success) {
      setPlans(prev => prev.filter(p => p.id !== id));
      showNotification('success', 'Membership plan deleted.');
    } else {
      showNotification('error', res.error || 'Failed to delete plan.');
    }
  };

  const handleDeleteGallery = async (id: string, imageUrl?: string) => {
    if (!window.confirm('Remove this photo from the gallery?')) return;
    const res = await supabaseService.deleteGalleryItem(id, imageUrl);
    if (res.success) {
      setGallery(prev => prev.filter(g => g.id !== id));
      showNotification('success', 'Gallery item removed.');
    } else {
      showNotification('error', res.error || 'Failed to delete gallery item.');
    }
  };

  const handleDeleteTransformation = async (id: string) => {
    if (!window.confirm('Remove this transformation story?')) return;
    const res = await supabaseService.deleteTransformation(id);
    if (res.success) {
      setTransformations(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'Transformation removed.');
    } else {
      showNotification('error', res.error || 'Failed to delete.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    const res = await supabaseService.deleteTestimonial(id);
    if (res.success) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      showNotification('success', 'Review deleted.');
    } else {
      showNotification('error', res.error || 'Failed to delete testimonial.');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!window.confirm('Delete this FAQ item?')) return;
    const res = await supabaseService.deleteFAQ(id);
    if (res.success) {
      setFaqs(prev => prev.filter(f => f.id !== id));
      showNotification('success', 'FAQ item removed.');
    } else {
      showNotification('error', res.error || 'Failed to delete FAQ.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-[#121212] p-2 rounded-xl border border-white/10">
        {[
          { id: 'plans' as ContentSubTab, label: 'Memberships', icon: CreditCard, count: plans.length },
          { id: 'programs' as ContentSubTab, label: 'Programs', icon: Dumbbell, count: programs.length },
          { id: 'trainers' as ContentSubTab, label: 'Trainers', icon: Users, count: trainers.length },
          { id: 'gallery' as ContentSubTab, label: 'Gallery', icon: ImageIcon, count: gallery.length },
          { id: 'transformations' as ContentSubTab, label: 'Transformations', icon: Sparkles, count: transformations.length },
          { id: 'testimonials' as ContentSubTab, label: 'Testimonials', icon: MessageSquare, count: testimonials.length },
          { id: 'faqs' as ContentSubTab, label: 'FAQs', icon: HelpCircle, count: faqs.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setSearch('');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-[#FFD400] text-black'
                  : 'text-[#BDBDBD] hover:text-white bg-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Notification */}
      {notice && (
        <div className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs ${
          notice.type === 'success'
            ? 'bg-[#00FF84]/15 border-[#00FF84]/40 text-[#00FF84]'
            : 'bg-[#FF4C61]/15 border-[#FF4C61]/40 text-[#FF4C61]'
        }`}>
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Top Bar for Current Subtab */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#121212] p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Filter ${activeSubTab}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181818] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
          />
        </div>

        <button
          onClick={() => openCreateModal(activeSubTab)}
          className="button-shine px-4 py-2 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeSubTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. MEMBERSHIP PLANS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans
            .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
            .map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#FFD400]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-white text-base">
                      {plan.name}
                    </span>
                    {plan.recommended && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFD400] text-black font-bold uppercase">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-heading font-black text-[#FFD400]">
                    {plan.price}
                    <span className="text-xs text-[#888888] font-normal ml-1">
                      /{plan.billingPeriod}
                    </span>
                  </div>

                  <p className="text-xs text-[#BDBDBD] line-clamp-2">
                    {plan.tagline}
                  </p>

                  <div className="space-y-1 text-xs text-[#888888] pt-2 border-t border-white/5">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-[#00FF84] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => openEditModal('plans', plan)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. PROGRAMS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs
            .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
            .map((program) => (
              <div
                key={program.id}
                className="p-4 rounded-xl bg-[#121212] border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div className="truncate">
                    <h4 className="font-heading font-bold text-white text-sm truncate">
                      {program.title}
                    </h4>
                    <p className="text-[11px] text-[#FFD400] font-semibold">
                      {program.category} • {program.difficulty} • {program.duration}
                    </p>
                    <p className="text-xs text-[#888888] truncate mt-0.5">
                      {program.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal('programs', program)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs transition-colors"
                    title="Edit program"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(program.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                    title="Delete program"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. TRAINERS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers
            .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
            .map((trainer) => (
              <div
                key={trainer.id}
                className="p-5 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#FFD400]/40"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-white text-base">
                        {trainer.name}
                      </h4>
                      <p className="text-xs text-[#FFD400] font-semibold uppercase">
                        {trainer.role}
                      </p>
                      <span className="text-[10px] text-[#888888]">
                        Exp: {trainer.experience}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#BDBDBD] line-clamp-2">
                    {trainer.bio}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {trainer.specialization.map((spec, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-[#181818] border border-white/5 text-white/80">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => openEditModal('trainers', trainer)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTrainer(trainer.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. GALLERY TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'gallery' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery
            .filter(g => !search || g.title.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-between">
                  <span className="self-start text-[10px] px-2 py-0.5 rounded bg-black/70 text-[#FFD400] uppercase font-bold">
                    {item.category}
                  </span>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => openEditModal('gallery', item)}
                        className="p-1.5 rounded bg-black/60 hover:bg-black text-white text-xs transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id, item.image)}
                        className="p-1.5 rounded bg-[#FF4C61]/80 hover:bg-[#FF4C61] text-white text-xs transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. TRANSFORMATIONS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'transformations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transformations
            .filter(t => !search || t.clientName.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-white text-base">
                        {item.clientName}
                      </h4>
                      <p className="text-xs text-[#FFD400]">
                        {item.goal} • {item.duration}
                      </p>
                    </div>
                    {item.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00FF84]/15 text-[#00FF84] border border-[#00FF84]/30 font-bold uppercase">
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-[#888888] block mb-1">Before</span>
                      <img
                        src={item.beforeImage}
                        alt="Before"
                        className="w-full h-28 object-cover rounded-lg border border-white/10"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#00FF84] block mb-1">After</span>
                      <img
                        src={item.afterImage}
                        alt="After"
                        className="w-full h-28 object-cover rounded-lg border border-[#00FF84]/30"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-[#BDBDBD] line-clamp-2">
                    {item.story}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => openEditModal('transformations', item)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTransformation(item.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. TESTIMONIALS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'testimonials' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials
            .filter(t => !search || t.clientName.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#121212] border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm">
                        {item.clientName}
                      </h4>
                      <p className="text-[11px] text-[#888888]">
                        {item.roleOrGoal || 'Member'}
                      </p>
                    </div>

                    <div className="flex items-center text-[#FFD400]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFD400]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#BDBDBD] italic line-clamp-4">
                    "{item.testimonial}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => openEditModal('testimonials', item)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(item.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. FAQS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-3">
          {faqs
            .filter(f => !search || f.question.toLowerCase().includes(search.toLowerCase()))
            .map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl bg-[#121212] border border-white/10 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1f1f1f] text-[#FFD400]">
                      {faq.category}
                    </span>
                    <h4 className="font-heading font-bold text-white text-sm">
                      {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-[#BDBDBD] pl-2 border-l-2 border-white/10">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal('faqs', faq)}
                    className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] text-white text-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="p-2 rounded-lg bg-[#281418] hover:bg-[#3a1a20] text-[#FF4C61] text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: CREATE / EDIT FORM */}
      {/* ==================================================== */}
      {modalOpen && modalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#FFD400]/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                {editingItem ? 'Edit' : 'Create New'} {modalType.slice(0, -1)}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg bg-[#202020] text-[#BDBDBD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM BODY BASED ON MODAL TYPE */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                if (modalType === 'plans') {
                  const planData: MembershipPlan = {
                    id: editingItem?.id || `plan-${Date.now()}`,
                    name: (formData.get('name') as string) || 'CUSTOM',
                    price: (formData.get('price') as string) || '₹[PRICE]',
                    billingPeriod: (formData.get('billingPeriod') as string) || 'per month',
                    tagline: (formData.get('tagline') as string) || '',
                    features: (formData.get('features') as string).split('\n').filter(Boolean),
                    recommended: formData.get('recommended') === 'on',
                    gymAccess: 'Full Facility Access',
                    cardioZone: true,
                    strengthZone: true,
                    trainerSupport: 'Included',
                    personalTraining: 'Optional',
                    nutritionGuidance: 'Basic',
                    lockerAndShower: true
                  };
                  await supabaseService.saveMembershipPlan(planData);
                  setPlans(prev => {
                    const idx = prev.findIndex(p => p.id === planData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = planData;
                      return updated;
                    }
                    return [...prev, planData];
                  });
                  showNotification('success', 'Membership plan saved successfully!');
                } else if (modalType === 'programs') {
                  const progData: Program = {
                    id: editingItem?.id || `prog-${Date.now()}`,
                    slug: (formData.get('slug') as string) || `prog-${Date.now()}`,
                    title: (formData.get('title') as string) || 'New Program',
                    shortDescription: (formData.get('shortDescription') as string) || '',
                    overview: (formData.get('overview') as string) || '',
                    whoItIsFor: ['Beginners & Intermediate Athletes in Godda'],
                    benefits: ['Strength conditioning', 'Body recomposition'],
                    trainingApproach: ['Progressive Overload'],
                    typicalSession: ['Warmup 10m', 'Working sets 40m', 'Cooldown 10m'],
                    difficulty: (formData.get('difficulty') as any) || 'All Levels',
                    duration: (formData.get('duration') as string) || '45-60 Mins',
                    frequency: (formData.get('frequency') as string) || '4-5 Days/Week',
                    image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
                    category: (formData.get('category') as any) || 'strength',
                    featured: formData.get('featured') === 'on'
                  };
                  await supabaseService.saveProgram(progData);
                  setPrograms(prev => {
                    const idx = prev.findIndex(p => p.id === progData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = progData;
                      return updated;
                    }
                    return [...prev, progData];
                  });
                  showNotification('success', 'Program saved successfully!');
                } else if (modalType === 'trainers') {
                  const trainerData: Trainer = {
                    id: editingItem?.id || `trainer-${Date.now()}`,
                    name: (formData.get('name') as string) || 'Coach',
                    role: (formData.get('role') as string) || 'Floor Trainer',
                    experience: (formData.get('experience') as string) || '3+ Years',
                    specialization: (formData.get('specialization') as string).split(',').map(s => s.trim()).filter(Boolean),
                    achievements: ['Certified Coach'],
                    bio: (formData.get('bio') as string) || '',
                    image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600',
                    featured: true
                  };
                  await supabaseService.saveTrainer(trainerData);
                  setTrainers(prev => {
                    const idx = prev.findIndex(t => t.id === trainerData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = trainerData;
                      return updated;
                    }
                    return [...prev, trainerData];
                  });
                  showNotification('success', 'Coach profile updated successfully!');
                } else if (modalType === 'gallery') {
                  const galleryData: GalleryItem = {
                    id: editingItem?.id || `gal-${Date.now()}`,
                    title: (formData.get('title') as string) || 'Gym Facility',
                    category: (formData.get('category') as any) || 'gym',
                    image: (formData.get('image') as string) || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200',
                    description: (formData.get('description') as string) || '',
                    aspectRatio: 'square'
                  };
                  await supabaseService.saveGalleryItem(galleryData);
                  setGallery(prev => {
                    const idx = prev.findIndex(g => g.id === galleryData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = galleryData;
                      return updated;
                    }
                    return [galleryData, ...prev];
                  });
                  showNotification('success', 'Gallery photo added!');
                } else if (modalType === 'transformations') {
                  const transData: TransformationStory = {
                    id: editingItem?.id || `trans-${Date.now()}`,
                    clientName: (formData.get('clientName') as string) || 'Member',
                    goal: (formData.get('goal') as string) || 'Fat Loss',
                    duration: (formData.get('duration') as string) || '12 Weeks',
                    trainingType: (formData.get('trainingType') as string) || 'Strength & Cardio',
                    story: (formData.get('story') as string) || '',
                    metrics: {
                      weightChange: (formData.get('weightChange') as string) || '-10 kg',
                      bodyFatChange: (formData.get('bodyFatChange') as string) || '-6%'
                    },
                    beforeImage: (formData.get('beforeImage') as string) || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800',
                    afterImage: (formData.get('afterImage') as string) || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800',
                    verified: true
                  };
                  await supabaseService.saveTransformation(transData);
                  setTransformations(prev => {
                    const idx = prev.findIndex(t => t.id === transData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = transData;
                      return updated;
                    }
                    return [transData, ...prev];
                  });
                  showNotification('success', 'Transformation story saved!');
                } else if (modalType === 'testimonials') {
                  const testData: Testimonial = {
                    id: editingItem?.id || `test-${Date.now()}`,
                    clientName: (formData.get('clientName') as string) || 'Member',
                    roleOrGoal: (formData.get('roleOrGoal') as string) || 'Strength & Conditioning',
                    rating: Number(formData.get('rating')) || 5,
                    testimonial: (formData.get('testimonial') as string) || '',
                    date: 'Recent Member Review',
                    isDemo: false
                  };
                  await supabaseService.saveTestimonial(testData);
                  setTestimonials(prev => {
                    const idx = prev.findIndex(t => t.id === testData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = testData;
                      return updated;
                    }
                    return [testData, ...prev];
                  });
                  showNotification('success', 'Review saved!');
                } else if (modalType === 'faqs') {
                  const faqData: FAQItem = {
                    id: editingItem?.id || `faq-${Date.now()}`,
                    question: (formData.get('question') as string) || '',
                    answer: (formData.get('answer') as string) || '',
                    category: (formData.get('category') as any) || 'general'
                  };
                  await supabaseService.saveFAQ(faqData);
                  setFaqs(prev => {
                    const idx = prev.findIndex(f => f.id === faqData.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = faqData;
                      return updated;
                    }
                    return [...prev, faqData];
                  });
                  showNotification('success', 'FAQ saved!');
                }

                closeModal();
              }}
              className="space-y-4"
            >
              {/* MEMBERSHIP PLAN FORM */}
              {modalType === 'plans' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Plan Name</label>
                    <input
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      required
                      placeholder="e.g. SILVER, GOLD, ELITE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Price</label>
                      <input
                        name="price"
                        defaultValue={editingItem?.price || '₹[PRICE]'}
                        required
                        placeholder="e.g. ₹1,499 / Month"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Billing Period</label>
                      <input
                        name="billingPeriod"
                        defaultValue={editingItem?.billingPeriod || 'per month'}
                        placeholder="e.g. per month, 3 months"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Tagline</label>
                    <input
                      name="tagline"
                      defaultValue={editingItem?.tagline || ''}
                      placeholder="e.g. Complete Strength & Conditioning Access"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Features (One per line)</label>
                    <textarea
                      name="features"
                      rows={4}
                      defaultValue={editingItem?.features?.join('\n') || 'Full gym equipment access\nCardio & strength zones\nLocker & shower facilities'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="plan-rec"
                      name="recommended"
                      defaultChecked={editingItem?.recommended}
                      className="rounded accent-[#FFD400]"
                    />
                    <label htmlFor="plan-rec" className="text-xs text-white">Mark as Popular / Recommended</label>
                  </div>
                </>
              )}

              {/* PROGRAM FORM */}
              {modalType === 'programs' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Program Title</label>
                    <input
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      required
                      placeholder="e.g. Weight Loss & Fat Burn"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Slug</label>
                      <input
                        name="slug"
                        defaultValue={editingItem?.slug || ''}
                        required
                        placeholder="e.g. weight-loss-fat-burn"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Category</label>
                      <select
                        name="category"
                        defaultValue={editingItem?.category || 'strength'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      >
                        <option value="strength">Strength</option>
                        <option value="cardio">Cardio</option>
                        <option value="fat-loss">Fat Loss</option>
                        <option value="hypertrophy">Hypertrophy</option>
                        <option value="functional">Functional</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Short Description</label>
                    <input
                      name="shortDescription"
                      defaultValue={editingItem?.shortDescription || ''}
                      placeholder="Brief headline summary for cards"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Image URL</label>
                    <input
                      name="image"
                      id="prog-image-input"
                      defaultValue={editingItem?.image || ''}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                    <div className="mt-2">
                      <label className="text-[11px] text-[#FFD400] flex items-center gap-1.5 cursor-pointer">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Or upload image to gym-gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(STORAGE_BUCKETS.GALLERY, e.target.files[0], (url) => {
                                const input = document.getElementById('prog-image-input') as HTMLInputElement;
                                if (input) input.value = url;
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* TRAINER FORM */}
              {modalType === 'trainers' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Trainer Name</label>
                    <input
                      name="name"
                      defaultValue={editingItem?.name || ''}
                      required
                      placeholder="e.g. Coach Vikram Singh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Role</label>
                      <input
                        name="role"
                        defaultValue={editingItem?.role || 'Head Strength Coach'}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Experience</label>
                      <input
                        name="experience"
                        defaultValue={editingItem?.experience || '5+ Years'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Specializations (comma separated)</label>
                    <input
                      name="specialization"
                      defaultValue={editingItem?.specialization?.join(', ') || 'Hypertrophy, Form Correction, Powerlifting'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Bio</label>
                    <textarea
                      name="bio"
                      rows={3}
                      defaultValue={editingItem?.bio || ''}
                      placeholder="Coaching philosophy and background in Godda"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Photo URL</label>
                    <input
                      name="image"
                      id="trainer-image-input"
                      defaultValue={editingItem?.image || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                    <div className="mt-2">
                      <label className="text-[11px] text-[#FFD400] flex items-center gap-1.5 cursor-pointer">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload photo to trainer-images bucket</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(STORAGE_BUCKETS.TRAINERS, e.target.files[0], (url) => {
                                const input = document.getElementById('trainer-image-input') as HTMLInputElement;
                                if (input) input.value = url;
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* GALLERY FORM */}
              {modalType === 'gallery' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Photo Title</label>
                    <input
                      name="title"
                      defaultValue={editingItem?.title || ''}
                      required
                      placeholder="e.g. Olympic Barbells & Strength Arena"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || 'gym'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    >
                      <option value="gym">Gym Arena</option>
                      <option value="equipment">Equipment</option>
                      <option value="trainers">Trainers</option>
                      <option value="members">Members</option>
                      <option value="workouts">Workouts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Image URL</label>
                    <input
                      name="image"
                      id="gal-image-input"
                      defaultValue={editingItem?.image || ''}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                    <div className="mt-2">
                      <label className="text-[11px] text-[#FFD400] flex items-center gap-1.5 cursor-pointer">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload photo to gym-gallery bucket</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(STORAGE_BUCKETS.GALLERY, e.target.files[0], (url) => {
                                const input = document.getElementById('gal-image-input') as HTMLInputElement;
                                if (input) input.value = url;
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* TRANSFORMATIONS FORM */}
              {modalType === 'transformations' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Client Name</label>
                    <input
                      name="clientName"
                      defaultValue={editingItem?.clientName || ''}
                      required
                      placeholder="e.g. Dedicated Member"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Goal</label>
                      <input
                        name="goal"
                        defaultValue={editingItem?.goal || 'Weight Loss & Toning'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Duration</label>
                      <input
                        name="duration"
                        defaultValue={editingItem?.duration || '16 Weeks'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Before Image URL</label>
                      <input
                        name="beforeImage"
                        id="trans-before-input"
                        defaultValue={editingItem?.beforeImage || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">After Image URL</label>
                      <input
                        name="afterImage"
                        id="trans-after-input"
                        defaultValue={editingItem?.afterImage || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <label className="text-[11px] text-[#FFD400] flex items-center gap-1.5 cursor-pointer">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload photos to transformation-images bucket</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleImageUpload(STORAGE_BUCKETS.TRANSFORMATIONS, e.target.files[0], (url) => {
                              const beforeInput = document.getElementById('trans-before-input') as HTMLInputElement;
                              const afterInput = document.getElementById('trans-after-input') as HTMLInputElement;
                              if (!beforeInput.value) {
                                beforeInput.value = url;
                              } else {
                                afterInput.value = url;
                              }
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Story & Testimonial</label>
                    <textarea
                      name="story"
                      rows={3}
                      defaultValue={editingItem?.story || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                </>
              )}

              {/* TESTIMONIAL FORM */}
              {modalType === 'testimonials' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Member Name</label>
                    <input
                      name="clientName"
                      defaultValue={editingItem?.clientName || ''}
                      required
                      placeholder="e.g. Dedicated Regular"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Role / Goal</label>
                      <input
                        name="roleOrGoal"
                        defaultValue={editingItem?.roleOrGoal || 'Strength & Conditioning'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Rating (1 to 5)</label>
                      <select
                        name="rating"
                        defaultValue={editingItem?.rating || 5}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Review Text</label>
                    <textarea
                      name="testimonial"
                      rows={4}
                      defaultValue={editingItem?.testimonial || ''}
                      required
                      placeholder="Genuine member feedback about D FITNESS Godda..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                </>
              )}

              {/* FAQ FORM */}
              {modalType === 'faqs' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Question</label>
                    <input
                      name="question"
                      defaultValue={editingItem?.question || ''}
                      required
                      placeholder="e.g. What are gym timings on Sundays?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category || 'general'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    >
                      <option value="general">General</option>
                      <option value="membership">Membership</option>
                      <option value="training">Training & Coaching</option>
                      <option value="facilities">Facilities & Parking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">Answer</label>
                    <textarea
                      name="answer"
                      rows={4}
                      defaultValue={editingItem?.answer || ''}
                      required
                      placeholder="Detailed factual answer..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-[#202020] text-white text-xs font-semibold hover:bg-[#2a2a2a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="button-shine px-6 py-2 rounded-xl bg-[#FFD400] text-black font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {uploadingImage ? 'Uploading...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
