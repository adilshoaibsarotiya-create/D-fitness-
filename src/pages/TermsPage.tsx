import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { defaultSiteConfig } from '../data/siteConfig';

export const TermsPage: React.FC = () => {
  const config = defaultSiteConfig;

  useEffect(() => {
    document.title = "Terms & Conditions | D FITNESS Godda";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-heading font-semibold uppercase tracking-wider text-[#BDBDBD] hover:text-[#FFD400] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl bg-[#121212] border border-white/10 p-8 sm:p-12 space-y-8 text-[#BDBDBD] text-sm leading-relaxed">
          <div className="border-b border-white/10 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a1a] text-[#FFD400] text-xs font-semibold uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5" />
              GYM FLOOR PROTOCOLS
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Terms & Gym Floor Rules
            </h1>
            <p className="text-xs text-white/50 mt-2 font-mono">
              Operational Protocols • D FITNESS (Godda, Jharkhand)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">1. Facility Etiquette & Safety</h2>
            <p>
              To maintain our premier training standard, all members and trial visitors must adhere to safety protocols:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/80">
              <li>Clean, dedicated gym shoes (non-street footwear) are mandatory on the workout floor.</li>
              <li>Free weights, dumbbells, and plates must be reracked in designated holders after completion of sets.</li>
              <li>Always wipe down equipment upholstery with sanitizer towels provided on the floor.</li>
              <li>Use weight collars on Olympic barbells during heavy working sets.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">2. Health & Medical Clearance</h2>
            <p>
              Physical resistance training and cardiovascular exertion carry inherent risks. Members confirm that they are in adequate physical condition to engage in exercise. Individuals with known cardiovascular, orthopedic, or metabolic issues should seek physician approval prior to intensive training.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">3. Membership & Trial Pass Validity</h2>
            <p>
              Trial passes are single-session vouchers intended for prospective members exploring D FITNESS facilities. Membership renewals, fee structures, and locker assignments are handled directly at our front desk in Godda.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
