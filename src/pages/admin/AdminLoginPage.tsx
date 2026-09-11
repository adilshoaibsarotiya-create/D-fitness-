import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Database, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Logo } from '../../components/common/Logo';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailOrUsername, setEmailOrUsername] = useState('admin@dfitness.com');
  const [password, setPassword] = useState('dfitness123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingInitial, setCheckingInitial] = useState(true);
  const isCloudReady = isSupabaseConfigured();

  useEffect(() => {
    document.title = "Admin Login | D FITNESS Godda";

    let mounted = true;
    async function checkExistingSession() {
      try {
        const authResult = await supabaseService.checkAdminAuth();
        if (mounted && authResult.isAuthenticated && authResult.isAdmin) {
          navigate('/admin', { replace: true });
          return;
        }
      } catch {
        // Proceed to login form
      } finally {
        if (mounted) {
          setCheckingInitial(false);
        }
      }
    }

    checkExistingSession();

    // If redirected with an error
    if (location.state && (location.state as any).error) {
      setError((location.state as any).error);
    }

    return () => {
      mounted = false;
    };
  }, [location.state, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await supabaseService.loginAdmin(emailOrUsername.trim(), password.trim());

      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setError(res.message || 'Invalid credentials or account is not in public.admins.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Login attempt failed.');
      setIsSubmitting(false);
    }
  };

  if (checkingInitial) {
    return (
      <div className="min-h-screen bg-[#07080E] flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#FFD400] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080E] flex items-center justify-center px-4 py-12 relative overflow-hidden text-[#FAFAFA]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD400]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
            Gym Management Portal
          </h1>
          <p className="text-xs text-[#BDBDBD] mt-1">
            Godda Facility Lead Management & Site Operations
          </p>

          {/* Supabase Status Indicator */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121320] border border-white/10 text-[11px]">
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="text-[#BDBDBD]">Backend:</span>
            {isCloudReady ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Supabase Connected
              </span>
            ) : (
              <span className="text-[#FFD400] font-semibold">
                Local Active (Ready for Supabase Keys)
              </span>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-[#10111A] border border-[#FFD400]/30 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#FF4C61]/15 border border-[#FF4C61]/40 flex items-center gap-2.5 text-xs text-[#FF4C61]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#BDBDBD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="admin@dfitness.com or admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161724] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#BDBDBD] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#BDBDBD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#161724] border border-white/10 focus:border-[#FFD400] text-white text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="button-shine w-full py-3.5 rounded-xl bg-[#FFD400] hover:bg-[#FFE600] text-black font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'AUTHENTICATING...' : 'ACCESS ADMIN DASHBOARD'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access & Info */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#161724] border border-white/5 space-y-1.5 text-xs text-[#BDBDBD]">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Credentials Info:</span>
              </div>
              <p className="text-[11px] text-[#BDBDBD]">
                Log in using your <strong>Supabase Auth user credentials</strong> or the master demo key:
              </p>
              <div className="bg-[#10111A] p-2 rounded-lg font-mono text-[11px] text-white/90">
                User: <span className="text-[#FFD400]">admin</span> / Pass: <span className="text-[#FFD400]">dfitness123</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="text-xs text-[#888888] hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
