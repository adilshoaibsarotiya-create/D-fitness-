import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, Sparkles, ChevronDown, ShieldCheck, Flame, Dumbbell } from 'lucide-react';
import { GymTourModal } from '../common/GymTourModal';

export const HeroSection: React.FC = () => {
  const [tourOpen, setTourOpen] = useState(false);

  const scrollToNext = () => {
    const nextSection = document.getElementById('home-short-about');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section
        id="home-hero-section"
        className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#050505]"
      >
        {/* Cinematic Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1920&auto=format&fit=crop"
            alt="D FITNESS Gym Floor in Godda"
            className="w-full h-full object-cover object-center scale-105 transform animate-pulse-slow filter brightness-45 contrast-125"
            loading="eager"
          />
          {/* Multi-layered dark gradient & subtle yellow atmospheric glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#FFD400]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Top Brand Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515]/90 border border-[#FFD400]/30 text-white text-xs sm:text-sm font-medium mb-6 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD400]"></span>
            </span>
            <span className="text-[#FFD400] font-semibold tracking-wider uppercase font-heading">
              D FITNESS
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[#BDBDBD]">Godda's Premier Gym Destination</span>
          </div>

          {/* Main Cinematic Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[1.02] mb-6">
            BUILD YOUR <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-[#FFE600] to-white drop-shadow-[0_0_35px_rgba(255,212,0,0.3)]">
              STRONGEST SELF
            </span>
          </h1>

          {/* Subheading & Tagline */}
          <p className="font-heading font-semibold text-lg sm:text-2xl text-white/90 tracking-wide uppercase mb-3">
            Godda's Premium Fitness Destination
          </p>

          <p className="text-base sm:text-lg text-[#FFD400] font-heading font-bold tracking-[0.2em] uppercase mb-8">
            Cardio <span className="text-white/40">|</span> Strength <span className="text-white/40">|</span> Weight Loss
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 w-full max-w-xl mb-12">
            <Link
              to="/membership"
              id="hero-join-now-button"
              className="button-shine w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-base tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,212,0,0.45)] flex items-center justify-center gap-2"
            >
              <span>JOIN NOW</span>
              <ArrowUpRight className="w-5 h-5 text-black stroke-[2.5]" />
            </Link>

            <Link
              to="/free-trial"
              id="hero-free-trial-button"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#151515] hover:bg-white/10 text-white font-heading font-semibold text-base tracking-wide border border-white/20 hover:border-[#FFD400] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FFD400]" />
              <span>BOOK FREE TRIAL</span>
            </Link>

            <button
              onClick={() => setTourOpen(true)}
              id="hero-gym-tour-button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-transparent hover:bg-white/5 text-[#BDBDBD] hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 hover:border-white/30"
            >
              <div className="w-6 h-6 rounded-full bg-[#FFD400]/20 flex items-center justify-center">
                <Play className="w-3 h-3 text-[#FFD400] fill-[#FFD400] ml-0.5" />
              </div>
              <span>WATCH GYM TOUR</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 border-t border-white/10 w-full max-w-2xl text-center">
            <div className="flex flex-col items-center">
              <Dumbbell className="w-5 h-5 text-[#FFD400] mb-1" />
              <span className="text-white font-heading font-bold text-sm sm:text-base">Modern Equipment</span>
              <span className="text-[11px] text-[#BDBDBD]">Imported Biomechanics</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-[#00FF84] mb-1" />
              <span className="text-white font-heading font-bold text-sm sm:text-base">Certified Coaches</span>
              <span className="text-[11px] text-[#BDBDBD]">1-on-1 Guidance</span>
            </div>
            <div className="flex flex-col items-center">
              <Flame className="w-5 h-5 text-[#FFE600] mb-1" />
              <span className="text-white font-heading font-bold text-sm sm:text-base">Targeted Programs</span>
              <span className="text-[11px] text-[#BDBDBD]">Fat Loss & Strength</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToNext}
          aria-label="Scroll to about section"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[#BDBDBD] hover:text-[#FFD400] transition-colors p-2 flex flex-col items-center animate-bounce"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest mb-1 text-white/50">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </section>

      {/* Gym Tour Modal */}
      <GymTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  );
};
