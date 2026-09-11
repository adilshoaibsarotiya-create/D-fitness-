import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, MapPin, Zap } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export const ShortAbout: React.FC = () => {
  return (
    <section id="home-short-about" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Asset Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#151515]">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop"
                alt="D FITNESS Gym Floor Godda"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0E0E0E]/90 backdrop-blur-md border border-[#FFD400]/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[#FFD400] text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-4 h-4 fill-[#FFD400]" />
                    Godda Fitness Benchmark
                  </div>
                  <p className="text-white text-sm font-semibold mt-0.5">
                    Premium Strength & Cardio Training Facility
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#BDBDBD] block">Location</span>
                  <span className="text-xs text-white font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FFD400]" /> Godda
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative ambient glow */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              badge="WHO WE ARE"
              title="A Serious Gym Built for Serious Transformations"
              align="left"
              className="mb-6"
            />

            <p className="text-white/85 text-base sm:text-lg leading-relaxed">
              D FITNESS was founded to bring a world-class fitness experience to Godda, Jharkhand. We believe high performance begins with the right atmosphere, pristine biomechanical equipment, and no-nonsense coaching.
            </p>

            <p className="text-[#BDBDBD] text-sm sm:text-base leading-relaxed">
              Whether you are taking your first steps toward losing excess weight, conditioning for athletic sports, or sculpting dense muscular strength, D FITNESS provides the community, structure, and accountability you need to succeed.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#151515] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">Ergonomic Machinery</h4>
                  <p className="text-xs text-[#BDBDBD]">Smooth cables and pin-loaded stations for safe joint mechanics.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#151515] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">Structured Programs</h4>
                  <p className="text-xs text-[#BDBDBD]">Scientific workout splits for fat burn, hypertrophy, and stamina.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#151515] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">Hygiene & Discipline</h4>
                  <p className="text-xs text-[#BDBDBD]">Clean floor, sanitised racks, and focused training etiquette.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#151515] border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-semibold">Coach Supervision</h4>
                  <p className="text-xs text-[#BDBDBD]">Personal attention so you always train with proper lifting posture.</p>
                </div>
              </div>
            </div>

            {/* Link to Full About Page */}
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#FFD400] hover:text-[#FFE600] font-heading font-semibold text-sm tracking-wider uppercase group"
              >
                <span>Read Full D FITNESS Story</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
