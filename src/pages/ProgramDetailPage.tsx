import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Gauge,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { defaultPrograms } from '../data/defaultData';
import { SectionHeading } from '../components/common/SectionHeading';

export const ProgramDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const program = defaultPrograms.find((p) => p.slug === slug);

  useEffect(() => {
    if (program) {
      document.title = `${program.title} | D FITNESS Godda`;
    } else {
      document.title = 'Program Not Found | D FITNESS';
    }
    window.scrollTo(0, 0);
  }, [program]);

  if (!program) {
    return (
      <div className="pt-32 pb-24 text-center max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-white mb-4">Program Not Found</h1>
        <p className="text-[#BDBDBD] text-sm mb-6">
          The requested training program does not exist or has been moved.
        </p>
        <Link
          to="/programs"
          className="px-6 py-2.5 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm"
        >
          View All Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#050505]">
      {/* Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-[#BDBDBD] hover:text-[#FFD400] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Programs</span>
        </Link>
      </div>

      {/* Hero Header */}
      <section className="relative py-12 sm:py-16 bg-[#0A0A0A] border-y border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151515] border border-[#FFD400]/30 text-[#FFD400] text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                D FITNESS SPECIALIZED TRACK
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
                {program.title}
              </h1>

              <p className="text-base sm:text-lg text-[#BDBDBD] leading-relaxed">
                {program.shortDescription}
              </p>

              {/* Key Meta Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                <div className="p-3 rounded-lg bg-[#151515] border border-white/5">
                  <span className="text-[#BDBDBD] block text-[10px] uppercase">Difficulty</span>
                  <div className="flex items-center gap-1.5 text-white font-semibold mt-1">
                    <Gauge className="w-4 h-4 text-[#FFD400]" />
                    <span>{program.difficulty}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#151515] border border-white/5">
                  <span className="text-[#BDBDBD] block text-[10px] uppercase">Duration</span>
                  <div className="flex items-center gap-1.5 text-white font-semibold mt-1">
                    <Clock className="w-4 h-4 text-[#FFD400]" />
                    <span>{program.duration}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#151515] border border-white/5">
                  <span className="text-[#BDBDBD] block text-[10px] uppercase">Frequency</span>
                  <div className="flex items-center gap-1.5 text-white font-semibold mt-1">
                    <Calendar className="w-4 h-4 text-[#FFD400]" />
                    <span>{program.frequency}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/free-trial"
                  className="button-shine px-6 py-3 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-colors flex items-center gap-2"
                >
                  <span>BOOK FREE TRIAL SESSION</span>
                  <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                </Link>

                <Link
                  to="/membership"
                  className="px-6 py-3 rounded-lg bg-[#151515] text-white font-semibold text-sm border border-white/20 hover:border-[#FFD400] transition-colors"
                >
                  View Membership Options
                </Link>
              </div>
            </div>

            {/* Visual Cover */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#121212]">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-semibold text-[#FFD400] uppercase font-heading">
                    Location
                  </span>
                  <p className="text-white text-sm font-semibold">
                    D FITNESS Gym Floor • Godda, Jharkhand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Deep Dive Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Section 1: Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white sticky top-28">
              Program Overview
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <p className="text-white/90 text-base sm:text-lg leading-relaxed bg-[#121212] p-6 sm:p-8 rounded-2xl border border-white/10">
              {program.overview}
            </p>
          </div>
        </div>

        {/* Section 2: Who It Is For */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12 border-t border-white/10">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white sticky top-28">
              Who It Is For
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.whoItIsFor.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#121212] border border-white/10 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#BDBDBD] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12 border-t border-white/10">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white sticky top-28">
              Program Benefits
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#121212] border border-white/10 flex items-start gap-3"
                >
                  <Sparkles className="w-5 h-5 text-[#00FF84] shrink-0 mt-0.5" />
                  <span className="text-sm text-white/90 leading-relaxed font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Training Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12 border-t border-white/10">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white sticky top-28">
              Training Approach
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {program.trainingApproach.map((approach, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#121212] border border-white/5 flex items-start gap-3 text-sm text-[#BDBDBD]"
              >
                <span className="text-xs font-mono text-[#FFD400] font-bold mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{approach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Typical Session Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-12 border-t border-white/10">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white sticky top-28">
              Typical Session Breakdown
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {program.typicalSession.map((session, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#151515] border border-white/10 flex items-center justify-between"
                >
                  <span className="text-sm text-white font-medium">{session}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#FFD400] font-mono">
                    Phase {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 rounded-xl bg-[#101010] border border-white/10 flex items-start gap-3 text-xs text-[#BDBDBD]/80">
          <AlertCircle className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
          <p>
            Educational Disclaimer: All training programs at D FITNESS are physical conditioning guidelines designed for general fitness. Individual results vary based on adherence, recovery, nutrition, and medical history. Consult a physician before beginning any strenuous workout routine if you have existing health conditions.
          </p>
        </div>

        {/* Bottom CTA Card */}
        <div className="rounded-3xl bg-[#0E0E0E] border border-[#FFD400]/30 p-8 sm:p-12 text-center">
          <h3 className="font-heading font-black text-2xl sm:text-4xl text-white uppercase mb-4">
            Ready to Start {program.title}?
          </h3>
          <p className="text-sm sm:text-base text-[#BDBDBD] max-w-lg mx-auto mb-8">
            Claim your free trial pass and test this program under coach supervision on the D FITNESS floor in Godda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/free-trial"
              className="button-shine px-8 py-3.5 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-sm tracking-wider hover:bg-[#FFE600] transition-colors"
            >
              BOOK COMPLIMENTARY TRIAL
            </Link>
            <Link
              to="/membership"
              className="px-6 py-3.5 rounded-lg bg-[#1a1a1a] text-white font-semibold text-sm border border-white/20 hover:border-[#FFD400] transition-colors"
            >
              View Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
