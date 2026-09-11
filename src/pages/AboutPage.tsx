import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, Compass, Dumbbell, Award, Flame, HeartPulse, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { defaultSiteConfig } from '../data/siteConfig';
import { supabaseService } from '../services/supabaseService';
import { SiteSettings } from '../types';

export const AboutPage: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);

  useEffect(() => {
    document.title = "About D FITNESS | Premium Gym in Godda, Jharkhand";
    window.scrollTo(0, 0);

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const coreValues = [
    {
      title: 'Technique Over Ego',
      desc: 'We prioritize joint longevity and biomechanical integrity before adding load. Safe lifting produces lasting strength.',
      icon: Dumbbell
    },
    {
      title: 'Relentless Consistency',
      desc: 'Real transformations are not born from shortcuts. We foster the daily discipline that builds lifelong athleticism.',
      icon: Target
    },
    {
      title: 'Supportive Intensity',
      desc: 'Whether you are an absolute beginner or an advanced lifter, our floor is welcoming, focused, and free of intimidation.',
      icon: Shield
    },
    {
      title: 'Evidence-Based Training',
      desc: 'Our routines are built around progressive overload, caloric balance, and cardiovascular health — no fitness fads.',
      icon: Award
    }
  ];

  const facilities = [
    {
      title: 'Strength & Power Zone',
      desc: 'Full Olympic power racks, deadlift platforms, bumper plates, and dumbbell pairs ranging up to 50 kg.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'High-Performance Cardio Deck',
      desc: 'Commercial shock-absorbing treadmills, cross-trainers, and spin bikes with live telemetry monitoring.',
      image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Cable Multi-Stations & Hypertrophy',
      desc: 'Dual adjustable pulleys, lat pulldown towers, seated cable rows, and precision plate-loaded machines.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Hygiene & Clean Facilities',
      desc: 'Sanitized locker rooms, dedicated changing spaces, clean drinking water, and air-conditioned workout floors.',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Page Header */}
      <section className="relative py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FFD400]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
            THE D FITNESS STORY
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Elevating Fitness In <br />
            <span className="text-[#FFD400]">Godda, Jharkhand</span>
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Founded with a singular vision: to bring a modern, high-standard, no-compromise training atmosphere to Godda.
          </p>
        </div>
      </section>

      {/* The Story & Mission */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              Why We Built <span className="text-[#FFD400]">D FITNESS</span>
            </h2>

            <p className="text-white/90 text-base leading-relaxed">
              For years, fitness enthusiasts in Godda had to compromise between cramped basements, outdated weights, and unguided training. D FITNESS was conceived to change that narrative completely.
            </p>

            <p className="text-[#BDBDBD] text-sm sm:text-base leading-relaxed">
              We invested in commercial biomechanical machinery, high-grip Olympic barbells, imported treadmills, and certified coaches who care deeply about movement execution. We believe that when you step onto our floor, the environment alone should elevate your focus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#121212] border border-white/10">
                <Target className="w-6 h-6 text-[#FFD400] mb-2" />
                <h3 className="font-heading font-bold text-white text-base">Our Mission</h3>
                <p className="text-xs text-[#BDBDBD] mt-1 leading-relaxed">
                  To empower Godda with accessible, elite-tier strength, cardiovascular fitness, and sustainable weight management coaching.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121212] border border-white/10">
                <Compass className="w-6 h-6 text-[#00FF84] mb-2" />
                <h3 className="font-heading font-bold text-white text-base">Our Vision</h3>
                <p className="text-xs text-[#BDBDBD] mt-1 leading-relaxed">
                  To become Eastern Jharkhand’s benchmark fitness facility known for integrity, coaching excellence, and genuine community results.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#FFD400]/20 shadow-2xl bg-[#151515]">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                alt="D FITNESS Gym Floor Overview"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold text-[#FFD400] tracking-wider uppercase font-heading">
                  D FITNESS FACILITY
                </span>
                <p className="text-white text-base font-semibold">
                  Main Road, Near Gandhi Chowk, Godda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="OUR CODE"
            title="Core Training Values"
            subtitle="The fundamental pillars that govern our gym floor and coaching methodology every single day."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 rounded-xl bg-[#151515] border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#202020] border border-white/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#FFD400]" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 text-[11px] text-[#FFD400] font-mono">
                    PILLAR 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* World-Class Facilities */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="OUR FLOOR"
          title="World-Class Equipment & Facilities"
          subtitle="Engineered for serious lifters, runners, and newcomers seeking peak performance."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl overflow-hidden bg-[#151515] border border-white/10 flex flex-col group"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-white mb-2 group-hover:text-[#FFD400] transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-[#BDBDBD] leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-16 rounded-2xl bg-[#121212] border border-[#FFD400]/25 p-8 sm:p-12 text-center">
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
            Experience D FITNESS In Person
          </h3>
          <p className="text-sm text-[#BDBDBD] max-w-xl mx-auto mb-6">
            Visit our Godda facility, meet our coaches, and test drive the equipment with a free trial workout.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/free-trial"
              className="button-shine px-6 py-3 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-all flex items-center gap-2"
            >
              <span>BOOK FREE TRIAL</span>
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg bg-[#1a1a1a] text-white font-medium text-sm border border-white/20 hover:border-[#FFD400] transition-colors"
            >
              Contact & Location
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
