import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, MessageSquare, Phone } from 'lucide-react';
import { defaultSiteConfig } from '../../data/siteConfig';

export const HomeCta: React.FC = () => {
  const config = defaultSiteConfig;
  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS%20Godda,%20I%20am%20interested%20in%20joining%20the%20gym.`;

  return (
    <section id="home-cta-banner" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Graphic Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FFD400]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-[#0E0E0E] border border-[#FFD400]/25 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          {/* Top accent badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            START YOUR FITNESS JOURNEY TODAY
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Train Hard. Move Better. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD400] via-[#FFE600] to-white">
              Become Stronger.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join D FITNESS in Godda today. Experience world-class equipment, tailored fat loss protocols, and supportive coaching designed around your goals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/membership"
              className="button-shine w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-extrabold text-base tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(255,212,0,0.35)] flex items-center justify-center gap-2"
            >
              <span>JOIN NOW</span>
              <ArrowUpRight className="w-5 h-5 text-black stroke-[2.5]" />
            </Link>

            <Link
              to="/free-trial"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#151515] hover:bg-white/10 text-white font-heading font-semibold text-base tracking-wide border border-white/20 hover:border-[#FFD400] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#FFD400]" />
              <span>BOOK FREE TRIAL</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#00FF84]/10 hover:bg-[#00FF84]/20 text-[#00FF84] font-semibold text-sm border border-[#00FF84]/30 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

          <p className="text-xs text-[#BDBDBD]/60 mt-8">
            Flexible timings: Mon–Sat 5:30 AM – 10:00 PM • Sun 6:00 AM – 1:00 PM • Godda, Jharkhand
          </p>
        </div>
      </div>
    </section>
  );
};
