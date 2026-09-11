import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  asLink = true
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      <BrandMark size={iconSize} />
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-extrabold tracking-tight text-[#FFD400] ${textSize}`}>
              D
            </span>
            <span className={`font-heading font-black tracking-wider text-white ${textSize}`}>
              FITNESS
            </span>
          </div>
          <span className="text-[9px] tracking-[0.25em] text-[#BDBDBD] uppercase font-semibold mt-0.5 group-hover:text-[#FFD400] transition-colors duration-200">
            GODDA
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
