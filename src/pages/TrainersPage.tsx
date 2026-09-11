import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  MessageSquare,
  Instagram,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  X,
  UserCheck,
  AlertCircle,
  Clock
} from 'lucide-react';
import { defaultTrainers } from '../data/defaultData';
import { defaultSiteConfig } from '../data/siteConfig';
import { supabaseService } from '../services/supabaseService';
import { trainerBookingSchema } from '../lib/validators';
import { Trainer, SiteSettings } from '../types';

export const TrainersPage: React.FC = () => {
  const [config, setConfig] = useState<SiteSettings | typeof defaultSiteConfig>(defaultSiteConfig);
  const [trainers, setTrainers] = useState<Trainer[]>(defaultTrainers);

  // Booking Modal State
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('Personal Training & Technique');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (07:00 AM – 09:00 AM)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Certified Coaches & Trainers | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getTrainers().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setTrainers(loaded);
      }
    });

    supabaseService.getSiteSettings().then((settings) => {
      if (settings) {
        setConfig(settings);
      }
    });
  }, []);

  const openBookingModal = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsSuccess(false);
    setErrorMsg('');
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTrainer(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    setErrorMsg('');

    const validation = trainerBookingSchema.safeParse({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      goal,
      preferredDate: preferredDate || 'Flexible',
      preferredTime,
      notes: notes.trim()
    });

    if (!validation.success) {
      setErrorMsg(validation.error.issues[0]?.message || 'Please check the required form inputs.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await supabaseService.submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        goal: `${goal} (with Coach ${selectedTrainer.name})`,
        preferredDate: preferredDate || 'Flexible',
        preferredTime,
        message: notes.trim() || `Booking request for Coach ${selectedTrainer.name}`,
        source: 'trainer_booking',
        status: 'new'
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit booking request. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            PROFESSIONAL GUIDANCE
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Certified Trainers
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Our coaching team in Godda is dedicated to teaching movement mechanics, preventing injury, and keeping you accountable to your fitness targets.
          </p>
        </div>
      </section>

      {/* Trainers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer) => {
            const whatsappUrl = `https://wa.me/${config.whatsapp}?text=Hello%20D%20FITNESS,%20I%20would%20like%20to%20book%20a%20training%20session%20with%20${encodeURIComponent(trainer.name)}.`;

            return (
              <div
                key={trainer.id}
                className="glass-card rounded-2xl overflow-hidden bg-[#121212] border border-white/10 group hover:border-[#FFD400]/50 transition-all duration-300 shadow-2xl flex flex-col"
              >
                {/* Photo with hover zoom and yellow border glow */}
                <div className="relative h-80 overflow-hidden bg-[#181818]">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter grayscale contrast-125 group-hover:grayscale-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-semibold text-[#FFD400] border border-[#FFD400]/30 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      {trainer.experience}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-white group-hover:text-[#FFD400] transition-colors">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-[#FFD400] font-semibold uppercase tracking-wider mt-1 mb-4">
                      {trainer.role}
                    </p>

                    <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed mb-5">
                      {trainer.bio}
                    </p>

                    {/* Specializations */}
                    <div className="mb-5">
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest block mb-2">
                        Specializations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.specialization.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] px-2.5 py-1 rounded-md bg-[#1c1c1c] text-white/90 border border-white/5"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    {trainer.achievements && trainer.achievements.length > 0 && (
                      <div className="mb-6 space-y-1.5">
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest block mb-2">
                          Credentials & Experience
                        </span>
                        {trainer.achievements.map((ach, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2 text-xs text-[#BDBDBD]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF84] shrink-0" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Socials */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {trainer.instagram && (
                          <a
                            href={trainer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#1a1a1a] text-[#BDBDBD] hover:text-[#FFD400] border border-white/5 transition-colors"
                            aria-label={`Instagram for ${trainer.name}`}
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#1a1a1a] text-[#BDBDBD] hover:text-[#00FF84] border border-white/5 transition-colors"
                          aria-label={`WhatsApp for ${trainer.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>

                      <button
                        onClick={() => openBookingModal(trainer)}
                        className="button-shine px-4 py-2 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-xs tracking-wide hover:bg-[#FFE600] transition-colors"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Policy Note */}
        <div className="mt-16 p-6 rounded-2xl bg-[#121212] border border-white/10 text-center max-w-2xl mx-auto">
          <p className="text-xs text-[#BDBDBD] leading-relaxed">
            Note: D FITNESS verifies all coaching staff on exercise biomechanics, CPR safety, and fitness induction. Coach assignments for 1-on-1 personal training can be scheduled directly here or at our gym desk during your consultation.
          </p>
        </div>
      </div>

      {/* Trainer Booking Modal */}
      {isBookingModalOpen && selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-[#FFD400]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTrainer.image}
                  alt={selectedTrainer.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#FFD400]/50"
                />
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    Book Session with {selectedTrainer.name}
                  </h3>
                  <p className="text-[11px] text-[#FFD400] font-semibold">{selectedTrainer.role}</p>
                </div>
              </div>

              <button
                onClick={closeBookingModal}
                className="p-1.5 rounded-lg bg-[#202020] text-[#BDBDBD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-[#00FF84]/15 border border-[#00FF84]/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#00FF84] mx-auto" />
                <h4 className="font-heading font-black text-xl text-white">
                  Booking Request Received!
                </h4>
                <p className="text-xs text-[#BDBDBD]">
                  Thank you, <strong>{name}</strong>. Your session request with Coach {selectedTrainer.name} has been sent to our Godda front desk team. We will confirm your timing shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={closeBookingModal}
                    className="px-6 py-2.5 rounded-xl bg-[#00FF84] text-black font-heading font-bold text-xs uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#FF4C61]/15 border border-[#FF4C61]/30 text-xs text-[#FF4C61] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                    Primary Goal
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                  >
                    <option value="Personal Training & Technique">Personal Training & Technique</option>
                    <option value="Strength & Powerlifting">Strength & Powerlifting</option>
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="Hypertrophy & Muscle Building">Hypertrophy & Muscle Building</option>
                    <option value="Injury Rehabilitation & Posture">Injury Rehabilitation & Posture</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                      Preferred Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                    >
                      <option value="Morning (06:00 AM – 09:00 AM)">Morning (6 AM - 9 AM)</option>
                      <option value="Mid-day (10:00 AM – 01:00 PM)">Mid-day (10 AM - 1 PM)</option>
                      <option value="Evening (05:00 PM – 08:00 PM)">Evening (5 PM - 8 PM)</option>
                      <option value="Night (08:00 PM – 10:00 PM)">Night (8 PM - 10 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase mb-1">
                    Notes or Questions for Coach
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell the trainer about any past injuries or specific goals..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1c1c1c] border border-white/10 text-white text-xs outline-none focus:border-[#FFD400]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="px-4 py-2.5 rounded-xl bg-[#202020] text-white text-xs font-semibold hover:bg-[#2a2a2a] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-shine px-6 py-2.5 rounded-xl bg-[#FFD400] text-black font-heading font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
