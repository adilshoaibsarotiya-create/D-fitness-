import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageSquare, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { defaultSiteConfig } from '../../data/siteConfig';
import { supabaseService } from '../../services/supabaseService';
import { SiteSettings } from '../../types';

export const Footer: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const programs = [
    { name: 'Weight Loss & Fat Burn', path: '/programs/weight-loss' },
    { name: 'Muscle Gain & Hypertrophy', path: '/programs/muscle-gain' },
    { name: 'Advanced Bodybuilding', path: '/programs/bodybuilding' },
    { name: 'High-Performance Cardio', path: '/programs/cardio' },
    { name: 'Strength & Powerlifting', path: '/programs/strength-training' },
    { name: 'HIIT Interval Training', path: '/programs/hiit' },
    { name: 'Functional Fitness', path: '/programs/functional-training' },
    { name: '1-on-1 Personal Training', path: '/programs/personal-training' },
  ];

  const quickLinks = [
    { name: 'About D FITNESS', path: '/about' },
    { name: 'All Programs', path: '/programs' },
    { name: 'Certified Trainers', path: '/trainers' },
    { name: 'Membership Packages', path: '/membership' },
    { name: 'Facility Gallery', path: '/gallery' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'Frequently Asked Questions', path: '/faq' },
    { name: 'Contact & Directions', path: '/contact' },
  ];

  const tools = [
    { name: 'BMI Calculator', path: '/bmi-calculator' },
    { name: 'Calorie Calculator', path: '/calorie-calculator' },
    { name: 'Workout Split Planner', path: '/workout-planner' },
    { name: 'Book Free Trial Pass', path: '/free-trial' },
  ];

  return (
    <footer id="main-site-footer" className="bg-[#0A0A0A] border-t border-[#FFD400]/15 relative overflow-hidden">
      {/* Subtle top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFD400]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-[#FFD400] font-heading font-medium tracking-wide text-sm uppercase">
              {config.tagline}
            </p>
            <p className="text-[#BDBDBD] text-sm leading-relaxed max-w-sm">
              Godda's premier fitness destination engineered for strength, transformation, and cardiovascular performance. Built for people who take fitness seriously.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#151515] border border-white/10 flex items-center justify-center text-white hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
                aria-label="D FITNESS Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={config.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#151515] border border-white/10 flex items-center justify-center text-white hover:text-[#FFD400] hover:border-[#FFD400] transition-colors"
                aria-label="D FITNESS Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS%20Godda,%20I%20am%20interested%20in%20joining%20the%20gym.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#151515] border border-white/10 flex items-center justify-center text-white hover:text-[#00FF84] hover:border-[#00FF84] transition-colors"
                aria-label="D FITNESS WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#00FF84]/30 text-[#00FF84] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00FF84] animate-pulse" />
                Admissions Open in Godda
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-[#BDBDBD]">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-[#FFD400] transition-colors duration-150 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div className="space-y-4">
            <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase border-b border-white/10 pb-2">
              Programs
            </h3>
            <ul className="space-y-2 text-sm text-[#BDBDBD]">
              {programs.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-[#FFD400] transition-colors duration-150 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Timings */}
          <div className="space-y-4">
            <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase border-b border-white/10 pb-2">
              Facility Info
            </h3>
            <div className="space-y-3 text-xs text-[#BDBDBD]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFD400] shrink-0 mt-0.5" />
                <span>{config.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD400] shrink-0" />
                <a href={`tel:${config.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {config.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FFD400] shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-white transition-colors">
                  {config.email}
                </a>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-start gap-2 text-[11px] mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#FFD400] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Mon - Sat:</span> {config.openingHoursWeekday}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[11px] pl-5">
                  <div>
                    <span className="text-white font-medium">Sunday:</span> {config.openingHoursWeekend}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-2">
                Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tools.map(tool => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="text-[11px] px-2.5 py-1 rounded bg-[#151515] text-[#BDBDBD] hover:text-[#FFD400] border border-white/5 hover:border-[#FFD400]/30 transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#BDBDBD]">
          <div className="flex items-center gap-2">
            <span>© {currentYear} D FITNESS Godda. All rights reserved.</span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">Cardio • Strength • Weight Loss</span>
          </div>

          <div className="flex items-center space-x-5">
            <Link to="/privacy-policy" className="hover:text-[#FFD400] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#FFD400] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/admin" className="text-[#FFD400]/70 hover:text-[#FFD400] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
