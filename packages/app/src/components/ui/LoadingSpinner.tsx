'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-stone-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-t-amber-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="text-amber-500 animate-pulse" size={size === 'sm' ? 12 : size === 'md' ? 20 : 28} />
        </div>
      </div>
      {message && (
        <p className="text-stone-500 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
