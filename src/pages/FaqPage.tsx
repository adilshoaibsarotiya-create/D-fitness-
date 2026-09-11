import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, HelpCircle, MessageSquare, Phone } from 'lucide-react';
import { defaultFAQs } from '../data/defaultData';
import { SectionHeading } from '../components/common/SectionHeading';
import { defaultSiteConfig } from '../data/siteConfig';
import { supabaseService } from '../services/supabaseService';
import { FAQItem, SiteSettings } from '../types';

export const FaqPage: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(defaultFAQs[0]?.id || null);

  useEffect(() => {
    document.title = "Frequently Asked Questions | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getFAQs().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setFaqs(loaded);
        setOpenId(loaded[0].id);
      }
    });

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS%20Godda,%20I%20have%20a%20question%20regarding%20the%20gym.`;

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            CLEAR ANSWERS
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our timings, equipment, personal training, membership options, and facilities in Godda.
          </p>

          {/* Search input */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="w-4 h-4 text-[#BDBDBD] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. timings, parking, fee)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#151515] border border-white/15 focus:border-[#FFD400] text-white text-sm outline-none transition-colors shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Accordion Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-[#121212] rounded-2xl border border-white/10 p-8">
            <p className="text-[#BDBDBD] text-sm mb-4">
              No questions found matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-lg bg-[#FFD400] text-black font-semibold text-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl transition-all duration-200 border ${
                    isOpen
                      ? 'bg-[#121212] border-[#FFD400]/40 shadow-[0_0_20px_rgba(255,212,0,0.08)]'
                      : 'bg-[#0E0E0E] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-heading font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#FFD400] text-black' : 'bg-[#1a1a1a] text-[#BDBDBD]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-[#BDBDBD] leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-16 rounded-2xl bg-[#121212] border border-white/10 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-white">
              Still have questions about D FITNESS?
            </h3>
            <p className="text-xs sm:text-sm text-[#BDBDBD] mt-1">
              Our front desk team in Godda is ready to help you directly on WhatsApp or over a quick phone call.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#00FF84] text-black font-semibold text-xs flex items-center gap-2 hover:bg-[#00e676] transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${config.phone.replace(/\s+/g, '')}`}
              className="px-5 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/20 text-white font-semibold text-xs hover:border-[#FFD400] transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#FFD400]" />
              <span>Call Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
