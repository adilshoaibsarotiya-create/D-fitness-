import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { defaultSiteConfig } from '../data/siteConfig';

export const PrivacyPolicyPage: React.FC = () => {
  const config = defaultSiteConfig;

  useEffect(() => {
    document.title = "Privacy Policy | D FITNESS Godda";
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
              <Shield className="w-3.5 h-3.5" />
              LEGAL DOCUMENTATION
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-white/50 mt-2 font-mono">
              Last Updated: March 2025 • D FITNESS (Godda, Jharkhand)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">1. Information We Collect</h2>
            <p>
              When you interact with D FITNESS through our website, free trial pass requests, contact forms, or membership applications, we may collect personal identifying information including your full name, phone number, email address, fitness objectives, and scheduling preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">2. How We Use Your Information</h2>
            <p>
              Your contact details are used strictly to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/80">
              <li>Coordinate and confirm complimentary trial workout sessions.</li>
              <li>Provide membership pricing details, facility updates, and training batch schedules.</li>
              <li>Respond to direct customer service and personal training inquiries.</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information with any third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">3. Data Security & Storage</h2>
            <p>
              We maintain technical precautions to safeguard member submissions. Submissions through this web application are safely processed to our authorized gym management interface.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-white">4. Contacting Our Data Officer</h2>
            <p>
              If you have any questions or would like your contact details removed from our inquiry register, contact our facility desk at:
            </p>
            <div className="p-4 rounded-xl bg-[#181818] text-xs space-y-1 text-white/90">
              <p><strong>D FITNESS Godda</strong></p>
              <p>{config.address}</p>
              <p>Phone: {config.phone}</p>
              <p>Email: {config.email}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
