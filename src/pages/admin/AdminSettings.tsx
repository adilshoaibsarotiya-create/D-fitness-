import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  Building,
  Key,
  Copy,
  Check,
  RefreshCw,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Code
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabaseService, getSupabase } from '../../services/supabaseService';

export const AdminSettings: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState('admin@dfitness.com');
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Gym info fields
  const [gymInfo, setGymInfo] = useState({
    name: 'D FITNESS GODDA',
    address: 'Near Gandhi Maidan, Main Road, Godda, Jharkhand 814133',
    phone: '+91 94312 88000',
    email: 'info@dfitnessgodda.com',
    weekdayHours: '05:30 AM – 10:00 PM',
    weekendHours: '06:00 AM – 01:00 PM'
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const auth = await supabaseService.checkAdminAuth();
      if (auth.user?.email) {
        setAdminEmail(auth.user.email);
      }
      const client = getSupabase();
      setSupabaseConnected(Boolean(client));
    } catch {
      setSupabaseConnected(false);
    }
  };

  const sqlPermissionsScript = `-- =========================================================
-- D FITNESS GYM: SUPABASE SCHEMA & RLS GRANTS
-- Run this in your Supabase Project -> SQL Editor
-- =========================================================

-- 1. Ensure authenticated users have full table privileges
GRANT ALL ON TABLE public.memberships TO authenticated;
GRANT ALL ON TABLE public.programs TO authenticated;
GRANT ALL ON TABLE public.trainers TO authenticated;
GRANT ALL ON TABLE public.trainer_bookings TO authenticated;
GRANT ALL ON TABLE public.contacts TO authenticated;
GRANT ALL ON TABLE public.membership_leads TO authenticated;

-- 2. Allow public/anon to view active content & submit leads
GRANT SELECT ON TABLE public.memberships TO anon;
GRANT SELECT ON TABLE public.programs TO anon;
GRANT SELECT ON TABLE public.trainers TO anon;
GRANT INSERT ON TABLE public.membership_leads TO anon;
GRANT INSERT ON TABLE public.trainer_bookings TO anon;
GRANT INSERT ON TABLE public.contacts TO anon;

-- 3. RLS Policies for Admin Access
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view memberships" ON public.memberships;
CREATE POLICY "Public can view memberships" ON public.memberships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage memberships" ON public.memberships;
CREATE POLICY "Admins can manage memberships" ON public.memberships FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view programs" ON public.programs;
CREATE POLICY "Public can view programs" ON public.programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;
CREATE POLICY "Admins can manage programs" ON public.programs FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view trainers" ON public.trainers;
CREATE POLICY "Public can view trainers" ON public.trainers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage trainers" ON public.trainers;
CREATE POLICY "Admins can manage trainers" ON public.trainers FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.trainer_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert booking" ON public.trainer_bookings;
CREATE POLICY "Anyone can insert booking" ON public.trainer_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage bookings" ON public.trainer_bookings;
CREATE POLICY "Admins can manage bookings" ON public.trainer_bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert contact" ON public.contacts;
CREATE POLICY "Anyone can insert contact" ON public.contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
CREATE POLICY "Admins can manage contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert membership lead" ON public.membership_leads;
CREATE POLICY "Anyone can insert membership lead" ON public.membership_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view leads" ON public.membership_leads;
CREATE POLICY "Admins can view leads" ON public.membership_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlPermissionsScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    if ((window as any).__dfitnessToast) {
      (window as any).__dfitnessToast('SQL Script copied to clipboard!', 'success');
    }
  };

  return (
    <AdminLayout
      pageTitle="System Settings"
      pageSubtitle="Configure administrator credentials, club hours, and Supabase database permissions."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Admin Profile & Gym Config */}
        <div className="lg:col-span-2 space-y-8">
          {/* Admin Profile */}
          <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center text-[#FFD400]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-white">
                  Administrator Profile
                </h3>
                <p className="text-xs text-[#A0A0A0]">
                  Authenticated Supabase session and access level
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#161724] border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Active Email
                  </span>
                  <div className="text-sm font-bold text-white mt-1">
                    {adminEmail}
                  </div>
                </div>

                <div className="bg-[#161724] border border-white/10 rounded-2xl p-4">
                  <span className="text-[10px] text-[#A0A0A0] uppercase font-bold tracking-wider">
                    Privilege Role
                  </span>
                  <div className="text-sm font-bold text-[#FFD400] mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFD400]" />
                    Super Administrator
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#A0A0A0]">Session Auth Provider:</span>
                <span className="font-mono text-white font-bold">Supabase GoTrue</span>
              </div>
            </div>
          </div>

          {/* Gym Information & Operating Hours */}
          <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-white">
                  Gym Location & Operating Hours
                </h3>
                <p className="text-xs text-[#A0A0A0]">
                  Public facility information displayed across the website
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Gym Facility Name
                </label>
                <input
                  type="text"
                  value={gymInfo.name}
                  onChange={(e) => setGymInfo({ ...gymInfo, name: e.target.value })}
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={gymInfo.address}
                  onChange={(e) => setGymInfo({ ...gymInfo, address: e.target.value })}
                  className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Phone / Reception Desk
                  </label>
                  <input
                    type="text"
                    value={gymInfo.phone}
                    onChange={(e) => setGymInfo({ ...gymInfo, phone: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={gymInfo.email}
                    onChange={(e) => setGymInfo({ ...gymInfo, email: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Monday – Saturday Hours
                  </label>
                  <input
                    type="text"
                    value={gymInfo.weekdayHours}
                    onChange={(e) => setGymInfo({ ...gymInfo, weekdayHours: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                    Sunday Hours
                  </label>
                  <input
                    type="text"
                    value={gymInfo.weekendHours}
                    onChange={(e) => setGymInfo({ ...gymInfo, weekendHours: e.target.value })}
                    className="w-full bg-[#161724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Supabase Connection & SQL Permissions Assistant */}
        <div className="space-y-8">
          {/* Connection Status Card */}
          <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Database Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#161724] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-semibold">
                  Host Service
                </span>
                <div className="font-mono text-white text-[11px] truncate">
                  Supabase PostgreSQL Cloud
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161724] border border-white/5 space-y-1">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-semibold">
                  Managed Tables
                </span>
                <div className="font-mono text-[#FFD400] text-[11px]">
                  memberships, programs, trainers, trainer_bookings, contacts, membership_leads
                </div>
              </div>
            </div>
          </div>

          {/* Database Permissions Assistant (Copyable SQL) */}
          <div className="bg-[#10111A] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-[#FFD400]" />
              <h4 className="font-heading font-black text-sm text-white">
                SQL Permissions Script
              </h4>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
              If Supabase returns <code className="text-[#FFD400]">42501 permission denied</code>, run this SQL script in your Supabase SQL Editor to grant authenticated roles full access.
            </p>

            <button
              onClick={copySqlToClipboard}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FFD400] hover:bg-[#FFE033] text-black transition-all shadow-[0_0_15px_rgba(255,212,0,0.2)] mb-3"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>SQL Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Script</span>
                </>
              )}
            </button>

            <div className="h-44 overflow-y-auto bg-[#0A0B10] p-3 rounded-xl border border-white/10 text-[10px] font-mono text-[#A0A0A0] leading-normal select-all">
              <pre>{sqlPermissionsScript}</pre>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
