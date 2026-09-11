import React from 'react';
import { X, Play, MapPin, CheckCircle2 } from 'lucide-react';

interface GymTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GymTourModal: React.FC<GymTourModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0E0E0E] border border-[#FFD400]/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#151515]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD400]" />
            <h3 className="font-heading font-bold text-lg text-white">
              D FITNESS Facility Tour • Godda
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#BDBDBD] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Visual Tour Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
            alt="D FITNESS Gym Floor Overview"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-black/40" />

          <div className="relative z-10 text-center max-w-lg px-4">
            <div className="w-16 h-16 rounded-full bg-[#FFD400] text-black flex items-center justify-center mx-auto mb-4 yellow-glow shadow-lg">
              <Play className="w-7 h-7 ml-1 fill-black" />
            </div>
            <h4 className="text-xl font-heading font-bold text-white mb-2">
              Virtual Walkthrough & Facility Showcase
            </h4>
            <p className="text-sm text-[#BDBDBD] mb-4">
              Tour the free weights zone, Olympic racks, commercial cardio deck, and locker facilities.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151515]/90 border border-white/15 text-xs text-[#FFD400]">
              <MapPin className="w-3.5 h-3.5" />
              Main Road, Near Gandhi Chowk, Godda
            </div>
          </div>
        </div>

        {/* Facility Highlights Footer */}
        <div className="px-6 py-4 bg-[#151515] border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#BDBDBD]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF84] shrink-0" />
            <span>Olympic Barbells</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF84] shrink-0" />
            <span>Shock-absorb Treadmills</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF84] shrink-0" />
            <span>Dual Cable Stacks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF84] shrink-0" />
            <span>Clean Changing Areas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
