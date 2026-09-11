import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Phone, ArrowUp, Sparkles, ChevronRight } from 'lucide-react';
import { defaultSiteConfig } from '../../data/siteConfig';
import { supabaseService } from '../../services/supabaseService';
import { SiteSettings } from '../../types';

export const FloatingActions: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);
  const location = useLocation();

  // Do not show floating buttons on admin routes to prevent UI clutter
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAdminRoute) return null;

  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS%20Godda,%20I%20am%20interested%20in%20joining%20the%20gym.`;
  const callUrl = `tel:${config.phone.replace(/\s+/g, '')}`;

  return (
    <>
      {/* Desktop Floating Action Stack (Bottom Right) */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col items-end space-y-3">
        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            aria-label="Back to Top"
            className="w-11 h-11 rounded-full bg-[#151515] border border-white/20 text-[#BDBDBD] hover:text-[#FFD400] hover:border-[#FFD400] flex items-center justify-center transition-all duration-200 shadow-xl hover:-translate-y-1 focus:outline-none"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Floating Call Button */}
        <a
          href={callUrl}
          aria-label="Call D FITNESS Gym"
          className="w-12 h-12 rounded-full bg-[#151515] border border-[#FFD400]/40 text-[#FFD400] hover:bg-[#FFD400] hover:text-black flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105 group"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute right-14 bg-[#151515] text-white text-xs font-semibold px-3 py-1.5 rounded-md border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg whitespace-nowrap">
            Call Gym Desk
          </span>
        </a>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-13 h-13 rounded-full bg-[#00FF84] text-black flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,132,0.5)] group relative"
        >
          <MessageSquare className="w-6 h-6 fill-black" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF84] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#050505] border-2 border-[#00FF84]"></span>
          </span>
          <span className="absolute right-15 bg-[#151515] text-white text-xs font-semibold px-3 py-1.5 rounded-md border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity shadow-lg whitespace-nowrap">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#FFD400]/25 px-3 py-2.5 flex items-center justify-between gap-2 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <a
          href={callUrl}
          className="flex-1 py-2.5 rounded-lg bg-[#151515] border border-white/15 text-white font-medium text-xs flex items-center justify-center gap-1.5 active:bg-white/10"
        >
          <Phone className="w-4 h-4 text-[#FFD400]" />
          <span>CALL</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-lg bg-[#00FF84]/15 border border-[#00FF84]/40 text-[#00FF84] font-medium text-xs flex items-center justify-center gap-1.5 active:bg-[#00FF84]/30"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>WHATSAPP</span>
        </a>

        <Link
          to="/membership"
          className="flex-1.2 py-2.5 px-3 rounded-lg bg-[#FFD400] text-black font-heading font-extrabold text-xs tracking-wider flex items-center justify-center gap-1 active:bg-[#FFE600] shadow-[0_0_15px_rgba(255,212,0,0.4)]"
        >
          <span>JOIN NOW</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        </Link>
      </div>
    </>
  );
};
