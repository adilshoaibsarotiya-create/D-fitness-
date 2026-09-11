import React, { useState, useEffect } from 'react';
import { Sparkles, X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { defaultGallery } from '../data/defaultData';
import { supabaseService } from '../services/supabaseService';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Facility Gallery | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getGallery().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setGallery(loaded);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'gym', label: 'Gym Interior' },
    { id: 'equipment', label: 'Equipment & Racks' },
    { id: 'trainers', label: 'Trainers In Action' },
    { id: 'workouts', label: 'Workouts & Sessions' },
    { id: 'members', label: 'Community' },
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentItem: GalleryItem | null = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            VISUAL TOUR
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Facility Gallery
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Take a visual tour through our heavy dumbbell arena, commercial cardio floor, power racks, and training floor in Godda.
          </p>
        </div>
      </section>

      {/* Main Gallery Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#FFD400] text-black shadow-[0_0_15px_rgba(255,212,0,0.3)]'
                  : 'bg-[#151515] text-[#BDBDBD] hover:text-white border border-white/10 hover:border-[#FFD400]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid (Responsive 2-col on mobile, asymmetric masonry style on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, idx) => {
            const isWide = item.aspectRatio === 'wide';
            const isTall = item.aspectRatio === 'tall';

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className={`group relative rounded-2xl overflow-hidden bg-[#151515] border border-white/10 hover:border-[#FFD400]/60 transition-all duration-300 cursor-pointer shadow-xl ${
                  isWide ? 'col-span-2' : ''
                } ${isTall ? 'row-span-2' : ''} h-56 sm:h-72 ${isTall ? 'sm:h-[600px]' : ''}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6">
                  <div className="flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-[#FFD400]">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD400] font-heading block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-[#BDBDBD] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close Lightbox"
              className="absolute -top-12 right-0 sm:right-4 p-2 rounded-full bg-[#151515] border border-white/20 text-white hover:text-[#FFD400] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 sm:-left-12 p-3 rounded-full bg-[#151515]/80 border border-white/20 text-white hover:text-[#FFD400] transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 sm:-right-12 p-3 rounded-full bg-[#151515]/80 border border-white/20 text-white hover:text-[#FFD400] transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black max-h-[75vh] flex items-center justify-center">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center">
              <h3 className="font-heading font-bold text-lg text-white">
                {currentItem.title}
              </h3>
              {currentItem.description && (
                <p className="text-xs sm:text-sm text-[#BDBDBD] mt-1">
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
