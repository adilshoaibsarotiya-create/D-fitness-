import React from 'react';

interface BrandMarkProps {
  className?: string;
  size?: number;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ className = '', size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="D FITNESS Symbol"
    >
      {/* Background Subtle Accent Shield */}
      <rect width="100" height="100" rx="22" fill="#0E0E0E" stroke="rgba(255, 212, 0, 0.3)" strokeWidth="2.5" />
      
      {/* Left Dumbbell Plate */}
      <rect x="20" y="38" width="6" height="24" rx="2" fill="#FFE600" />
      <rect x="26" y="44" width="4" height="12" rx="1.5" fill="#FFD400" />

      {/* Main Stylized Athletic D Body (Integrating central grip) */}
      <path
        d="M30 26H52C67.5 26 78 36.5 78 50C78 63.5 67.5 74 52 74H30V26Z"
        fill="#FFD400"
      />

      {/* Inner Cutout with Center Dumbbell Grip Bar */}
      <path
        d="M42 38H50C58 38 64 43.5 64 50C64 56.5 58 62 50 62H42V38Z"
        fill="#0E0E0E"
      />

      {/* Center Bar Highlight */}
      <rect x="42" y="47" width="16" height="6" rx="2" fill="#FFE600" />

      {/* Right Dumbbell Plate Cut Accent */}
      <rect x="74" y="42" width="6" height="16" rx="2" fill="#FFE600" />
    </svg>
  );
};
