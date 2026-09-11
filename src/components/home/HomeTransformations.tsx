import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export const HomeTransformations: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(10, Math.min(90, position)));
  };

  return (
    <section id="home-transformations" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CLIENT TRANSFORMATIONS"
          title="Results Built On Consistency"
          subtitle="We celebrate real, disciplined fitness journeys. True physical recomposition is earned set by set."
        />

        <div className="max-w-4xl mx-auto">
          {/* Interactive Before / After Visual Showcase Container */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-[#121212] p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Slider Visual */}
              <div className="lg:col-span-7">
                <div
                  className="relative h-[340px] sm:h-[400px] rounded-xl overflow-hidden cursor-ew-resize select-none border border-white/10"
                  onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
                  onClick={handleSliderMove}
                  onTouchMove={handleSliderMove}
                >
                  {/* "After" / Goal Image (Bottom Layer) */}
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop"
                    alt="Strength & Conditioning Target"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded text-xs font-heading font-bold text-[#00FF84] border border-[#00FF84]/30">
                    GOAL PHYSIQUE
                  </div>

                  {/* "Before" Image (Top Layer clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop"
                      alt="Initial Training Baseline"
                      className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-110"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded text-xs font-heading font-bold text-[#FFD400] border border-[#FFD400]/30">
                      STARTING BASELINE
                    </div>
                  </div>

                  {/* Vertical Divider Bar */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#FFD400] shadow-[0_0_15px_#FFD400]"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FFD400] text-black font-bold flex items-center justify-center text-xs shadow-xl">
                      ↔
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-[#BDBDBD] mt-3">
                  Drag slider horizontally to compare training progress states
                </p>
              </div>

              {/* Verified Information Notice & Commitment */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-xl bg-[#181818] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-[#00FF84] text-xs font-semibold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    Verified Transformation Policy
                  </div>
                  <h4 className="text-white font-heading font-bold text-lg">
                    Real transformation stories coming soon
                  </h4>
                  <p className="text-xs text-[#BDBDBD] leading-relaxed">
                    At D FITNESS Godda, we maintain strict integrity. We do not use stock internet before/after photos or fabricated weight loss statistics. Our inaugural batch member transformations are currently underway.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-[#BDBDBD]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                    <span>Structured 12-week body recomposition tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                    <span>In-gym measurements and body fat calibration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                    <span>Real members, genuine sweat, zero false claims</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/transformations"
                    className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#FFD400] hover:text-[#FFE600] uppercase tracking-wider group"
                  >
                    <span>View Transformation Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
