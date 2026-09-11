import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Sparkles, ArrowRight, AlertCircle, Scale, Target } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { supabaseService } from '../services/supabaseService';
import { TransformationStory } from '../types';

export const TransformationsPage: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [transformations, setTransformations] = useState<TransformationStory[]>([]);

  useEffect(() => {
    document.title = "Transformations | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getTransformations().then((data) => {
      if (data) {
        setTransformations(data);
      }
    });
  }, []);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(5, Math.min(95, position)));
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            GENUINE RESULTS POLICY
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Client Transformations
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Real discipline. Measured body composition. Honest, verified milestones from everyday athletes training in Godda.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Verification Policy Card */}
        <div className="rounded-2xl bg-[#121212] border border-[#00FF84]/30 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#00FF84]/15 border border-[#00FF84]/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-[#00FF84]" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading font-bold text-lg text-white">
              Zero Fabricated Claims Policy
            </h3>
            <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed">
              Unlike many fitness clubs that download random model photos or quote exaggerated 10-day miracles, D FITNESS documents real member journeys with explicit consent, verified in-gym body composition scans, and authentic timeline tracking.
            </p>
          </div>
        </div>

        {/* Dynamic Transformations Grid if any exist */}
        {transformations.length > 0 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-heading font-semibold text-[#FFD400] uppercase tracking-wider block mb-1">
                VERIFIED MEMBER JOURNEYS
              </span>
              <h3 className="text-2xl font-heading font-bold text-white">
                Documented Client Results
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {transformations.map((t) => (
                <div key={t.id} className="glass-card rounded-2xl p-6 bg-[#121212] border border-white/10 space-y-4">
                  <div className="grid grid-cols-2 gap-3 rounded-xl overflow-hidden">
                    <div className="relative h-56 bg-[#181818]">
                      <img src={t.beforeImage} alt={`${t.clientName} Before`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#FFD400] font-bold">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative h-56 bg-[#181818]">
                      <img src={t.afterImage} alt={`${t.clientName} After`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#00FF84] text-black text-[10px] font-bold">
                        AFTER
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-lg text-white">{t.clientName}</h4>
                      <span className="text-xs text-[#00FF84] font-bold">{t.duration}</span>
                    </div>
                    <p className="text-xs text-[#BDBDBD]">{t.story || t.goal}</p>
                    {t.metrics?.weightChange && (
                      <p className="text-[11px] text-[#FFD400]">Result: {t.metrics.weightChange}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Before/After Demonstration Showcase */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 bg-[#101010] border border-white/10 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-heading font-semibold text-[#FFD400] uppercase tracking-wider block mb-1">
              DEMONSTRATION VIEWER
            </span>
            <h3 className="text-2xl font-heading font-bold text-white">
              Interactive Progress Comparison Tool
            </h3>
            <p className="text-xs text-[#BDBDBD] mt-1">
              Drag the yellow control slider to observe postural changes, muscular tone, and body fat reduction.
            </p>
          </div>

          <div
            className="relative h-[380px] sm:h-[480px] max-w-3xl mx-auto rounded-2xl overflow-hidden cursor-ew-resize select-none border-2 border-white/10 shadow-2xl"
            onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
            onClick={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* Goal Physique / After State */}
            <img
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop"
              alt="Goal Physique / Progress Target"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold text-[#00FF84] border border-[#00FF84]/30 shadow-lg">
              16 WEEKS PROGRAM GOAL
            </div>

            {/* Baseline / Before State */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
                alt="Baseline Fitness State"
                className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
              />
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold text-[#FFD400] border border-[#FFD400]/30 shadow-lg">
                INITIAL STARTING BASELINE
              </div>
            </div>

            {/* Slider Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#FFD400] shadow-[0_0_20px_#FFD400]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#FFD400] text-black font-extrabold flex items-center justify-center text-sm shadow-2xl">
                ↔
              </div>
            </div>
          </div>
        </div>

        {/* Real Transformation Stories Coming Soon Banner */}
        <div className="rounded-3xl bg-[#0E0E0E] border-2 border-dashed border-[#FFD400]/40 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFD400]/15 flex items-center justify-center mx-auto text-[#FFD400]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Real Transformation Stories Ongoing
          </h3>
          <p className="text-sm text-[#BDBDBD] max-w-lg mx-auto leading-relaxed">
            Our training cohorts in Godda are currently progressing through their 12-week and 24-week customized programs. Verified case studies and photo documentation are published here with athlete consent.
          </p>
          <div className="pt-2">
            <Link
              to="/free-trial"
              className="button-shine inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-colors"
            >
              <span>BECOME OUR NEXT SUCCESS STORY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
