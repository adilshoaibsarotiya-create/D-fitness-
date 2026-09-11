import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, MessageSquare, Award, CheckCircle2 } from 'lucide-react';
import { defaultTrainers } from '../../data/defaultData';
import { SectionHeading } from '../common/SectionHeading';
import { supabaseService } from '../../services/supabaseService';
import { Trainer } from '../../types';

export const FeaturedTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(defaultTrainers);

  useEffect(() => {
    supabaseService.getTrainers().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setTrainers(loaded);
      }
    });
  }, []);

  return (
    <section id="home-featured-trainers" className="py-24 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            badge="ELITE COACHING"
            title="Guided by Certified Coaches"
            subtitle="Experienced fitness mentors dedicated to lifting form, injury prevention, and relentless consistency."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <Link
            to="/trainers"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-heading font-bold text-[#FFD400] hover:text-[#FFE600] uppercase tracking-wider group"
          >
            <span>Meet All Trainers</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="glass-card rounded-2xl overflow-hidden bg-[#121212] border border-white/10 group hover:border-[#FFD400]/40 transition-all duration-300 flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden bg-[#181818]">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

                {/* Experience Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-semibold text-[#FFD400] border border-[#FFD400]/30 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {trainer.experience}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#FFD400] transition-colors">
                    {trainer.name}
                  </h3>
                  <p className="text-xs text-[#FFD400] font-semibold uppercase tracking-wider mt-1 mb-3">
                    {trainer.role}
                  </p>

                  <p className="text-xs text-[#BDBDBD] line-clamp-3 leading-relaxed mb-4">
                    {trainer.bio}
                  </p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {trainer.specialization.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#1c1c1c] text-[#BDBDBD] border border-white/5"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to="/trainers"
                    className="text-xs font-semibold text-white hover:text-[#FFD400] transition-colors"
                  >
                    View Profile
                  </Link>

                  <Link
                    to="/free-trial"
                    className="px-3.5 py-1.5 rounded bg-[#FFD400] text-black font-heading font-bold text-xs tracking-wide hover:bg-[#FFE600] transition-colors"
                  >
                    Book Session
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
