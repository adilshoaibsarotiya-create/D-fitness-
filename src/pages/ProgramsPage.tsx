import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Clock, ArrowRight, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { defaultPrograms } from '../data/defaultData';
import { SectionHeading } from '../components/common/SectionHeading';
import { supabaseService } from '../services/supabaseService';
import { Program } from '../types';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    document.title = "Training Programs | D FITNESS Godda | Cardio, Strength & Weight Loss";
    window.scrollTo(0, 0);

    supabaseService.getPrograms().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setPrograms(loaded);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'fat-loss', label: 'Weight Loss & Fat Burn' },
    { id: 'strength', label: 'Strength & Power' },
    { id: 'hypertrophy', label: 'Muscle Gain & Physique' },
    { id: 'cardio', label: 'Cardio & Conditioning' },
    { id: 'functional', label: 'Functional & Mobility' },
  ];

  const filtered = selectedCategory === 'all'
    ? programs
    : programs.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            TARGETED DISCIPLINE
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Training Programs
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Every workout program at D FITNESS is grounded in biomechanics, progressive overload, and real physiological results.
          </p>
        </div>
      </section>

      {/* Main Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-[#FFD400] text-black shadow-[0_0_15px_rgba(255,212,0,0.3)]'
                  : 'bg-[#151515] text-[#BDBDBD] hover:text-white border border-white/10 hover:border-[#FFD400]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((program) => (
            <div
              key={program.id}
              className="glass-card rounded-2xl overflow-hidden bg-[#121212] border border-white/10 flex flex-col group hover:border-[#FFD400]/50 transition-all duration-300 shadow-xl"
            >
              {/* Image Preview */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#FFD400] border border-[#FFD400]/30">
                    {program.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-[#FFD400] transition-colors">
                    {program.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed mb-6">
                    {program.shortDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs text-[#BDBDBD] mb-6">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-[#FFD400]" />
                      <span>{program.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FFD400]" />
                      <span>{program.duration}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {program.benefits.slice(0, 2).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF84] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                  <Link
                    to={`/programs/${program.slug}`}
                    className="flex-1 text-center py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-white font-medium text-xs border border-white/10 hover:border-[#FFD400] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Program</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFD400]" />
                  </Link>

                  <Link
                    to="/free-trial"
                    className="px-4 py-2.5 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-xs hover:bg-[#FFE600] transition-colors whitespace-nowrap"
                  >
                    Try Free
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
