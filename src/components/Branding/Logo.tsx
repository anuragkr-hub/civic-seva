import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  inverse?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  inverse = false
}) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 64
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const dim = iconSizes[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Minimal Vector Mark */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {/* Open Circular "C" Shape */}
        <path
          d="M 68 18 A 40 40 0 1 0 74 76"
          stroke="#0F172A"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Bridge Suspension Cables & Skyline Silhouette */}
        {/* Bridge Towers */}
        <path
          d="M 38 48 L 48 24 L 58 48"
          stroke="#EA580C"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stay Cables */}
        <line x1="48" y1="26" x2="32" y2="48" stroke="#EA580C" strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1="48" y1="26" x2="64" y2="48" stroke="#EA580C" strokeWidth="1.5" strokeOpacity="0.8" />

        {/* Roadway leading inwards */}
        <path
          d="M 28 50 C 42 50, 44 60, 68 62"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Road center dashes */}
        <path
          d="M 36 50.5 C 44 51, 50 56, 62 58"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />

        {/* Subtle Eco / Leaf Element */}
        <path
          d="M 74 24 C 82 20, 88 24, 86 32 C 84 38, 76 34, 74 24 Z"
          fill="#16A34A"
        />
        <path
          d="M 74 24 Q 78 30 84 32"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-bold tracking-tight ${textSizes[size]} flex items-center`}>
          <span className={inverse ? 'text-white' : 'text-slate-900'}>Civic</span>
          <span className="text-orange-600 ml-0.5">Seva</span>
        </div>
        {showTagline && (
          <span
            className={`font-medium tracking-wide mt-0.5 ${taglineSizes[size]} ${
              inverse ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            See. Report. Resolve.
          </span>
        )}
      </div>
    </div>
  );
};
