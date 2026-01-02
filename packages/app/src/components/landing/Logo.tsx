'use client';

import Image from 'next/image';
import type { LogoProps } from './types';

const SIZES = {
  sm: { width: 32, height: 32, blur: 'blur-sm', rounded: 'rounded-lg' },
  md: { width: 40, height: 40, blur: 'blur-md', rounded: 'rounded-xl' },
  lg: { width: 48, height: 48, blur: 'blur-lg', rounded: 'rounded-xl' },
} as const;

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showGlow = true,
  className = '' 
}) => {
  const { width, height, blur, rounded } = SIZES[size];
  
  return (
    <div className={`relative ${className}`}>
      {showGlow && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-rose-400 to-amber-400 ${rounded} ${blur} opacity-40 group-hover:opacity-60 transition-opacity`} 
        />
      )}
      <Image
        src="/logo.png"
        alt="wdng online"
        width={width}
        height={height}
        className={`${rounded} relative shadow-lg group-hover:scale-105 transition-transform`}
      />
    </div>
  );
};

export default Logo;
