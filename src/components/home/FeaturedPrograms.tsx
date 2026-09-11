import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gauge, Flame, Sparkles } from 'lucide-react';
import { defaultPrograms } from '../../data/defaultData';
import { SectionHeading } from '../common/SectionHeading';
import { supabaseService } from '../../services/supabaseService';
import { Program } from '../../types';

export const FeaturedPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  useEffect(() => {
    supabaseService.getPrograms().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setPrograms(loaded);
      }
    });
  }, []);

  // Select top featured programs for home highlights
  const featured = programs.filter(p => p.featured).slice(0, 4);

  return (
    <section id="home-featured-programs" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            badge="TRAINING DISCIPLINES"
            title="Signature Training Programs"
            subtitle="Targeted regimens designed around biomechanics, progressive overload, and high metabolic burn."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <Link
            to="/programs"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-heading font-bold text-[#FFD400] hover:text-[#FFE600] uppercase tracking-wider group"
          >
            <span>View All 8 Programs</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((prog) => (
            <div
              key={prog.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col bg-[#151515] border border-white/10 group hover:border-[#FFD400]/40 transition-all duration-300"
            >
              {/* Program Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/30" />
                
                {/* Category Pill */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#FFD400] border border-[#FFD400]/30">
                    {prog.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-[#FFD400] transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-[#BDBDBD] line-clamp-2 leading-relaxed mb-4">
                    {prog.shortDescription}
                  </p>

                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/5 text-[11px] text-[#BDBDBD] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-[#FFD400]" />
                      <span>{prog.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FFD400]" />
                      <span>{prog.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    to={`/programs/${prog.slug}`}
                    className="text-xs font-semibold text-white hover:text-[#FFD400] transition-colors flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/free-trial"
                    className="px-3 py-1.5 rounded-md bg-[#FFD400]/10 hover:bg-[#FFD400] text-[#FFD400] hover:text-black font-semibold text-xs transition-colors duration-200"
                  >
                    Try Free
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
