'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  inverse?: boolean;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  inverse = false,
  iconOnly = false
}) => {
  const heights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24'
  };

  const containerSizes = {
    sm: 'w-24',
    md: 'w-32 sm:w-36',
    lg: 'w-48',
    xl: 'w-64'
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className={`relative ${heights[size]} flex items-center`}>
        <img
          src="/logo.png"
          alt="CivicSeva - See. Report. Resolve."
          className={`${heights[size]} w-auto object-contain rounded-lg transition-transform duration-200 hover:scale-105 ${
            inverse ? 'brightness-105 contrast-105 p-0.5 bg-white/95 rounded-xl shadow-sm' : ''
          }`}
        />
      </div>
    </div>
  );
};
