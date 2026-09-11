import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = "Page Not Found | D FITNESS Godda";
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-[75vh] flex items-center justify-center bg-[#050505] px-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="font-display font-black text-8xl sm:text-9xl text-[#FFD400] block tracking-tighter">
          404
        </span>

        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm text-[#BDBDBD] leading-relaxed">
          The page you were looking for doesn't exist or has moved. Return to the D FITNESS home page to explore programs and membership in Godda.
        </p>

        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="button-shine inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FFD400] text-black font-heading font-bold text-xs tracking-wider uppercase hover:bg-[#FFE600] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#181818] border border-white/20 text-white font-heading font-bold text-xs tracking-wider uppercase hover:border-[#FFD400] transition-colors"
          >
            <span>View Programs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
