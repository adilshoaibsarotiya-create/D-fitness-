import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Navigation,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { defaultSiteConfig } from '../data/siteConfig';
import { supabaseService } from '../services/supabaseService';
import { contactFormSchema } from '../lib/validators';
import { SiteSettings } from '../types';
import { sanitizeMapsEmbedUrl } from '../lib/mapUtils';

export const ContactPage: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Gym Membership Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Contact & Location | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = contactFormSchema.safeParse({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please verify form inputs.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await supabaseService.submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal: subject,
        message: message.trim(),
        source: 'contact_form',
        status: 'new'
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to send your message. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to send your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const callUrl = `tel:${config.phone.replace(/\s+/g, '')}`;
  const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS%20Godda,%20I%20have%20an%20enquiry.`;

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <MapPin className="w-3.5 h-3.5" />
            VISIT D FITNESS IN GODDA
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Contact & Location
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Have a question about membership, personal training, or timings? Get in touch with our team or drop by our facility in Godda.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Quick Action Buttons */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={callUrl}
                className="p-4 rounded-xl bg-[#151515] border border-white/10 hover:border-[#FFD400] flex flex-col items-center justify-center text-center group transition-colors"
              >
                <Phone className="w-6 h-6 text-[#FFD400] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  CALL NOW
                </span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#151515] border border-white/10 hover:border-[#00FF84] flex flex-col items-center justify-center text-center group transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-[#00FF84] mb-2 group-hover:scale-110 transition-transform fill-[#00FF84]" />
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  WHATSAPP
                </span>
              </a>

              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#151515] border border-white/10 hover:border-[#FFD400] flex flex-col items-center justify-center text-center group transition-colors"
              >
                <Navigation className="w-6 h-6 text-[#FFE600] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                  DIRECTIONS
                </span>
              </a>
            </div>

            {/* Address & Timings Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 bg-[#121212] border border-white/10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#FFD400] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#FFD400]">
                      Facility Address
                    </h4>
                    <p className="text-sm text-white font-medium mt-1 leading-snug">
                      {config.address}
                    </p>
                    <span className="text-xs text-[#BDBDBD] block mt-0.5">
                      Prominent road frontage with two-wheeler and car parking.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#FFD400] shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#FFD400]">
                      Opening Timings
                    </h4>
                    <p className="text-sm text-white mt-1">
                      <strong className="text-white">Mon – Sat:</strong> {config.openingHoursWeekday}
                    </p>
                    <p className="text-sm text-white mt-0.5">
                      <strong className="text-white">Sunday:</strong> {config.openingHoursWeekend}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[#FFD400] shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#FFD400]">
                      Email Enquiries
                    </h4>
                    <p className="text-sm text-white mt-1">
                      {config.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-semibold text-[#BDBDBD] uppercase tracking-wider block mb-3">
                  Follow Our Athletic Community
                </span>
                <div className="flex items-center space-x-3">
                  <a
                    href={config.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#181818] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 hover:border-[#FFD400] hover:text-[#FFD400] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={config.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#181818] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 hover:border-[#FFD400] hover:text-[#FFD400] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#121212] border border-white/10 p-6 sm:p-10 shadow-2xl">
              <div className="mb-6">
                <span className="text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider block mb-1">
                  DIRECT ENQUIRY
                </span>
                <h3 className="font-heading font-bold text-2xl text-white">
                  Send Us A Direct Message
                </h3>
                <p className="text-xs text-[#BDBDBD] mt-1">
                  Our management team in Godda reviews every message and responds within 2 business hours.
                </p>
              </div>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-[#00FF84]/10 border border-[#00FF84]/30 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#00FF84] mx-auto" />
                  <h4 className="font-heading font-bold text-xl text-white">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-sm text-[#BDBDBD]">
                    Thank you, <strong className="text-white">{name}</strong>. Our front desk has logged your enquiry and will be in touch shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#151515] border border-white/20 text-xs font-semibold text-white hover:border-[#FFD400]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 rounded-lg bg-[#FF4C61]/15 border border-[#FF4C61]/40 flex items-center gap-2 text-xs text-[#FF4C61]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                        Mobile Number *
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                        Inquiry Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                      >
                        <option value="Gym Membership Inquiry">Gym Membership Inquiry</option>
                        <option value="Personal Training Package">Personal Training Package</option>
                        <option value="Weight Loss Program">Weight Loss Program</option>
                        <option value="Facility Tour Booking">Facility Tour Booking</option>
                        <option value="Corporate / Group Batch">Corporate / Group Batch</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help your fitness journey in Godda?"
                      className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-shine w-full py-4 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-black text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'SENDING INQUIRY...' : 'SEND INQUIRY'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Maps Embed Section */}
        <div className="mt-16 rounded-3xl overflow-hidden border border-white/10 bg-[#121212]">
          <div className="p-6 bg-[#161616] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Find D FITNESS in Godda
              </h3>
              <p className="text-xs text-[#BDBDBD]">
                Located at Main Road, Near Gandhi Chowk, Godda, Jharkhand
              </p>
            </div>

            <a
              href={config.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-xs flex items-center gap-1.5 hover:bg-[#FFE600] transition-colors shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 relative bg-[#181818]">
            <iframe
              title="D FITNESS Location Godda"
              src={sanitizeMapsEmbedUrl(config.mapsEmbedUrl)}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
