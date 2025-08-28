'use client';

import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fallbackText?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base'
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  fallbackText 
}) => {
  const [hasError, setHasError] = useState(false);
  
  const baseClasses = `${sizeClasses[size]} flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center font-medium text-white shadow-sm`;
  
  if (!src || hasError) {
    const initials = fallbackText?.substring(0, 2).toUpperCase() || alt.substring(0, 2).toUpperCase();
    return (
      <div 
        className={`${baseClasses} ${className}`}
        role="img"
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${baseClasses} object-cover ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};
