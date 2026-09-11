import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';
import { defaultTestimonials } from '../../data/defaultData';
import { SectionHeading } from '../common/SectionHeading';
import { defaultSiteConfig } from '../../data/siteConfig';
import { supabaseService } from '../../services/supabaseService';
import { Testimonial, SiteSettings } from '../../types';

export const HomeTestimonials: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    supabaseService.getTestimonials().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setTestimonials(loaded);
      }
    });

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  return (
    <section id="home-testimonials" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="MEMBER VOICES"
          title="What Our Athletes Say"
          subtitle="Real impressions from fitness enthusiasts training on the D FITNESS floor in Godda."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 bg-[#121212] border border-white/10 flex flex-col justify-between hover:border-[#FFD400]/40 transition-all duration-300"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD400] fill-[#FFD400]" />
                  ))}
                </div>

                <p className="text-sm text-white/90 leading-relaxed italic mb-6">
                  "{item.testimonial}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">
                    {item.clientName}
                  </h4>
                  <span className="text-[11px] text-[#FFD400] font-medium">
                    {item.roleOrGoal}
                  </span>
                </div>

                <span className="text-[10px] text-[#BDBDBD]/60">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Banner & CTA */}
        <div className="max-w-3xl mx-auto rounded-xl bg-[#121212] border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">
                Share Your Experience On Google
              </h4>
              <p className="text-xs text-[#BDBDBD]">
                Trained with us at D FITNESS Godda? Help our community grow by leaving an honest review.
              </p>
            </div>
          </div>

          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Write a Review</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FFD400]" />
          </a>
        </div>
      </div>
    </section>
  );
};
