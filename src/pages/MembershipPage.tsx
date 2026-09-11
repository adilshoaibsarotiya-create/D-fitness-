import React, { useState, useEffect } from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { defaultMembershipPlans } from '../data/defaultData';
import { SectionHeading } from '../components/common/SectionHeading';
import { supabaseService } from '../services/supabaseService';
import { membershipFormSchema } from '../lib/validators';
import { MembershipPlan } from '../types';

export const MembershipPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>(defaultMembershipPlans);
  const [selectedPlan, setSelectedPlan] = useState<string>('GOLD');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = "Membership Plans & Pricing | D FITNESS Godda";
    window.scrollTo(0, 0);

    supabaseService.getMembershipPlans().then((loadedPlans) => {
      if (loadedPlans && loadedPlans.length > 0) {
        setPlans(loadedPlans);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    const validation = membershipFormSchema.safeParse({
      fullName: (fullName || '').trim(),
      phone: (phone || '').trim(),
      email: (email || '').trim(),
      selectedPlan: (selectedPlan || 'GOLD').trim(),
      startDate: startDate ? startDate.trim() : undefined,
      message: message ? message.trim() : undefined
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      setErrorMsg(validation.error.issues[0]?.message || 'Please check highlighted form fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await supabaseService.submitMembershipLead({
        name: validation.data.fullName,
        phone: validation.data.phone,
        email: validation.data.email,
        selectedPlan: validation.data.selectedPlan,
        startDate: validation.data.startDate || 'Immediate',
        message: validation.data.message || `Interested in ${validation.data.selectedPlan} membership.`
      });

      if (res.success) {
        setIsSuccess(true);
        setFullName('');
        setPhone('');
        setEmail('');
        setStartDate('');
        setMessage('');
        setErrorMsg('');
        setFieldErrors({});
      } else {
        setErrorMsg(res.error || 'An error occurred while submitting your application. Please retry.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg('An error occurred while submitting your application. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = (planName: string) => {
    setSelectedPlan(planName);
    const formEl = document.getElementById('membership-application-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Page Header */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A] border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-heading font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            TRANSPARENT VALUE
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-[1.08] mb-6">
            Membership Plans
          </h1>

          <p className="text-base sm:text-xl text-[#BDBDBD] max-w-2xl mx-auto leading-relaxed">
            Choose the membership package that matches your fitness commitment. Built for long-term health, strength, and transformation in Godda.
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.recommended
                  ? 'bg-[#121212] border-2 border-[#FFD400] shadow-[0_0_35px_rgba(255,212,0,0.18)] -translate-y-2'
                  : 'bg-[#121212] border border-white/10 hover:border-white/30'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD400] text-black font-heading font-bold text-xs tracking-wider uppercase shadow-md">
                  {plan.highlightText || 'MOST POPULAR'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-black text-2xl text-white tracking-wider">
                    {plan.name}
                  </h3>
                  <span className="text-[11px] text-[#BDBDBD] uppercase font-semibold">
                    {plan.billingPeriod}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-black text-[#FFD400]">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#BDBDBD] mt-2 leading-relaxed">
                    {plan.tagline}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 py-6 border-t border-white/10 mb-8">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs text-white/90">
                      <div className="w-4 h-4 rounded-full bg-[#FFD400]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#FFD400]" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollToForm(plan.name)}
                className={`w-full py-3.5 rounded-xl font-heading font-bold text-sm tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                  plan.recommended
                    ? 'button-shine bg-[#FFD400] hover:bg-[#FFE600] text-black shadow-lg hover:shadow-[0_0_20px_rgba(255,212,0,0.5)]'
                    : 'bg-[#1e1e1e] hover:bg-[#FFD400] text-white hover:text-black border border-white/10 hover:border-[#FFD400]'
                }`}
              >
                <span>JOIN NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Plan Comparison Table */}
        <div className="mb-20">
          <SectionHeading
            badge="FEATURE BREAKDOWN"
            title="Detailed Plan Comparison"
            subtitle="Evaluate the exact privileges, trainer access, and facility permissions included with each tier."
          />

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#101010]">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/10 bg-[#161616]">
                  <th className="p-4 sm:p-5 text-sm font-heading font-bold text-white uppercase tracking-wider">
                    Features & Access
                  </th>
                  <th className="p-4 sm:p-5 text-sm font-heading font-bold text-white text-center">
                    SILVER
                  </th>
                  <th className="p-4 sm:p-5 text-sm font-heading font-bold text-[#FFD400] text-center bg-[#FFD400]/5">
                    GOLD (POPULAR)
                  </th>
                  <th className="p-4 sm:p-5 text-sm font-heading font-bold text-white text-center">
                    ELITE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm text-[#BDBDBD]">
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Price</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-white">₹[PRICE]</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-[#FFD400] bg-[#FFD400]/5">₹[PRICE]</td>
                  <td className="p-4 sm:p-5 text-center font-bold text-white">₹[PRICE]</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Gym Access Hours</td>
                  <td className="p-4 sm:p-5 text-center">Standard Operating Hours</td>
                  <td className="p-4 sm:p-5 text-center text-white bg-[#FFD400]/5">Unlimited Full Access</td>
                  <td className="p-4 sm:p-5 text-center text-white">All-Access VIP Priority</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Cardio Zone & Treadmills</td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#FFD400]/5"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Strength & Free Weights Arena</td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#FFD400]/5"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Floor Trainer Guidance</td>
                  <td className="p-4 sm:p-5 text-center">General Assistance</td>
                  <td className="p-4 sm:p-5 text-center text-white bg-[#FFD400]/5">Active Floor Coaching</td>
                  <td className="p-4 sm:p-5 text-center text-white">Priority Coach Support</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">1-on-1 Personal Training</td>
                  <td className="p-4 sm:p-5 text-center text-white/40"><X className="w-4 h-4 text-white/30 mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center text-white bg-[#FFD400]/5">2 Intro Sessions Included</td>
                  <td className="p-4 sm:p-5 text-center text-white font-semibold">Weekly PT Included</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Nutrition & Diet Breakdown</td>
                  <td className="p-4 sm:p-5 text-center">Standard Diet Guidelines</td>
                  <td className="p-4 sm:p-5 text-center text-white bg-[#FFD400]/5">Custom Macro Calculation</td>
                  <td className="p-4 sm:p-5 text-center text-white font-semibold">Comprehensive Diet Coaching</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-white font-medium">Locker & Changing Room Access</td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center bg-[#FFD400]/5"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                  <td className="p-4 sm:p-5 text-center"><Check className="w-4 h-4 text-[#00FF84] mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Membership Application Form */}
        <div id="membership-application-form" className="max-w-2xl mx-auto rounded-3xl bg-[#121212] border border-[#FFD400]/30 p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs font-heading font-bold text-[#FFD400] uppercase tracking-wider block mb-2">
              APPLY FOR MEMBERSHIP
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Lock In Your Plan at D FITNESS Godda
            </h3>
            <p className="text-xs sm:text-sm text-[#BDBDBD] mt-2">
              Submit your details and our team will contact you with exact registration fee, timings, and payment procedures.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-6 rounded-2xl bg-[#00FF84]/10 border border-[#00FF84]/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#00FF84] mx-auto" />
              <h4 className="font-heading font-bold text-xl text-white">
                Thank You! Your Enquiry Has Been Received.
              </h4>
              <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed">
                We have registered your interest for the <strong className="text-white">{selectedPlan}</strong> plan. Our front desk will reach out via call/WhatsApp shortly.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-5 py-2.5 rounded-lg bg-[#151515] border border-white/20 text-xs font-semibold text-white hover:border-[#FFD400] transition-colors"
              >
                Submit Another Application
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

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Selected Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['SILVER', 'GOLD', 'ELITE'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan);
                        if (fieldErrors.selectedPlan) {
                          setFieldErrors((prev) => ({ ...prev, selectedPlan: '' }));
                        }
                      }}
                      className={`py-2.5 rounded-lg text-xs font-heading font-bold tracking-wider transition-colors border ${
                        selectedPlan === plan
                          ? 'bg-[#FFD400] text-black border-[#FFD400]'
                          : 'bg-[#1a1a1a] text-[#BDBDBD] border-white/10 hover:border-white/30'
                      }`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
                {fieldErrors.selectedPlan && (
                  <p className="text-xs text-[#FF4C61] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.selectedPlan}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (fieldErrors.fullName) {
                      setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                    }
                  }}
                  placeholder="e.g. Adarsh Sharma"
                  className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border ${
                    fieldErrors.fullName ? 'border-[#FF4C61] focus:ring-[#FF4C61]' : 'border-white/10 focus:border-[#FFD400] focus:ring-[#FFD400]'
                  } focus:ring-1 text-white text-sm outline-none transition-colors`}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs text-[#FF4C61] mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.fullName}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border ${
                      fieldErrors.phone ? 'border-[#FF4C61] focus:ring-[#FF4C61]' : 'border-white/10 focus:border-[#FFD400] focus:ring-[#FFD400]'
                    } focus:ring-1 text-white text-sm outline-none transition-colors`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-[#FF4C61] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: '' }));
                      }
                    }}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border ${
                      fieldErrors.email ? 'border-[#FF4C61] focus:ring-[#FF4C61]' : 'border-white/10 focus:border-[#FFD400] focus:ring-[#FFD400]'
                    } focus:ring-1 text-white text-sm outline-none transition-colors`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-[#FF4C61] mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                  Message or Specific Fitness Goal (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your target (e.g. weight loss, strength, timings)..."
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400] text-white text-sm outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-shine w-full py-3.5 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-sm tracking-wider uppercase transition-all shadow-lg mt-2"
              >
                {isSubmitting ? 'PROCESSING APPLICATION...' : 'SUBMIT MEMBERSHIP APPLICATION'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
