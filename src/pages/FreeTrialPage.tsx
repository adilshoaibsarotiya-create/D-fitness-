import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Phone, CheckCircle2, AlertCircle, Calendar, Clock } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { defaultSiteConfig } from '../data/siteConfig';
import { freeTrialFormSchema } from '../lib/validators';
import { SiteSettings } from '../types';

export const FreeTrialPage: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('Weight Loss');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (06:00 AM – 09:00 AM)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Book Free Trial Pass | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const goals = [
    'Weight Loss',
    'Muscle Gain',
    'Strength',
    'General Fitness',
    'Bodybuilding',
    'Cardio',
    'Other'
  ];

  const times = [
    'Early Morning (05:30 AM – 07:30 AM)',
    'Morning (07:30 AM – 10:00 AM)',
    'Afternoon (12:00 PM – 04:00 PM)',
    'Evening (04:30 PM – 07:30 PM)',
    'Night (07:30 PM – 10:00 PM)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = freeTrialFormSchema.safeParse({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      goal,
      preferredDate: preferredDate || 'Flexible',
      preferredTime,
      message: message.trim()
    });

    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please check the required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await supabaseService.submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal,
        preferredDate: preferredDate || 'Flexible',
        preferredTime,
        message: message.trim(),
        source: 'free_trial',
        status: 'new'
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Error submitting free trial request. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error submitting free trial request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello D FITNESS Godda, I just requested a free trial pass on your website for ${name || 'myself'} (Goal: ${goal}). Please confirm my trial slot.`
  );
  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${whatsappMessage}`;
  const callUrl = `tel:${config.phone.replace(/\s+/g, '')}`;

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            COMPLIMENTARY ACCESS PASS
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            START YOUR FITNESS JOURNEY
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-xl mx-auto leading-relaxed">
            Experience our imported strength machinery, commercial cardio zone, and meet our floor trainers before you decide to join.
          </p>
        </div>
      </section>

      {/* Main Trial Form & Details */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-[#121212] border border-[#FFD400]/30 p-6 sm:p-12 shadow-2xl">
          {isSuccess ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#00FF84]/20 border border-[#00FF84] text-[#00FF84] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
                  Trial Pass Request Received!
                </h3>
                <p className="text-sm text-[#BDBDBD] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Our front desk has logged your preferred slot. A representative will contact you via phone or WhatsApp to finalize your trial pass.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#181818] border border-white/10 text-xs text-[#BDBDBD] max-w-md mx-auto">
                Note: To ensure gym floor safety and trainer availability, trial passes are confirmed once our team verifies your time slot with you directly.
              </div>

              {/* Direct Next Step CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#00FF84] text-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#00e575] transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>CONFIRM FASTER VIA WHATSAPP</span>
                </a>

                <a
                  href={callUrl}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#1a1a1a] text-white font-semibold text-xs border border-white/20 hover:border-[#FFD400] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#FFD400]" />
                  <span>CALL GYM DESK</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-xs text-[#BDBDBD] hover:text-white underline"
                >
                  Submit for another family member or friend
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-[#FF4C61]/15 border border-[#FF4C61]/40 flex items-center gap-2 text-xs text-[#FF4C61]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Primary Fitness Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                >
                  {goals.map((g) => (
                    <option key={g} value={g} className="bg-[#1a1a1a] text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                  >
                    {times.map((t) => (
                      <option key={t} value={t} className="bg-[#1a1a1a] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Any previous injuries or comments (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. beginner, recovering from shoulder tightness, interested in evening workout..."
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-shine w-full py-4 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-black text-sm tracking-wider uppercase transition-all shadow-lg mt-3"
              >
                {isSubmitting ? 'RESERVING TRIAL PASS...' : 'CLAIM FREE WORKOUT PASS'}
              </button>

              <p className="text-center text-[11px] text-[#BDBDBD]/60 pt-2">
                By submitting, you agree to receive trial pass details from D FITNESS Godda. We respect your privacy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
