import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../../services/supabaseService';
import { ShieldAlert, Loader2, LogOut, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    user?: { id: string; email?: string; role?: string };
    error?: string;
  }>({
    isAuthenticated: false,
    isAdmin: false
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const result = await supabaseService.checkAdminAuth();
        if (mounted) {
          setAuthState(result);
        }
      } catch (err: any) {
        if (mounted) {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            error: err.message || 'Authentication check failed.'
          });
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabaseService.logoutAdmin();
    navigate('/admin/login', { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/30 flex items-center justify-center text-[#FFD400]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-white">
              Authenticating Admin Session
            </h3>
            <p className="text-xs text-[#888888]">
              Verifying UUID credentials against public.admins...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 1. If not authenticated at all -> redirect to /admin/login
  if (!authState.isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ error: authState.error, from: location.pathname }}
        replace
      />
    );
  }

  // 2. If authenticated but not an admin in public.admins -> show Access Denied
  if (!authState.isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-[#FAFAFA]">
        <div className="max-w-md w-full bg-[#121212] border border-[#FF4C61]/30 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4C61]/10 border border-[#FF4C61]/30 flex items-center justify-center text-[#FF4C61] mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-heading font-black tracking-widest text-[#FF4C61] uppercase px-3 py-1 rounded-full bg-[#FF4C61]/10 border border-[#FF4C61]/20">
              403 Forbidden
            </span>
            <h2 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
              Access Denied
            </h2>
            <p className="text-xs text-[#BDBDBD] leading-relaxed">
              Your Supabase account is authenticated, but your user UUID is not authorized in the{' '}
              <code className="text-[#FFD400] bg-black/60 px-1.5 py-0.5 rounded font-mono">
                public.admins
              </code>{' '}
              table.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-left text-xs font-mono space-y-2">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">User Email:</span>
              <span className="text-white break-all">{authState.user?.email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">User UUID:</span>
              <span className="text-[#FFD400] break-all">{authState.user?.id || 'N/A'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#181818] border border-white/5 text-left text-[11px] text-[#888888] space-y-1">
            <span className="text-[#00FF84] font-semibold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              How to Grant Access
            </span>
            <p className="text-white/80">
              Run this query in your Supabase SQL Editor:
            </p>
            <pre className="bg-black p-2 rounded text-[10px] font-mono text-[#FFD400] overflow-x-auto">
              {`INSERT INTO public.admins (id, email, role) VALUES ('${authState.user?.id || 'USER_UUID'}', '${authState.user?.email || 'admin@dfitness.com'}', 'super_admin');`}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-[#281418] hover:bg-[#38181e] text-[#FF4C61] border border-[#FF4C61]/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out / Switch Account</span>
            </button>
            <Link
              to="/"
              className="w-full py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated AND verified in public.admins
  return <>{children}</>;
};

