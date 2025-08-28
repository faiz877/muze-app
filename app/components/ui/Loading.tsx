'use client';

import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Spinner: React.FC<{ size: string; className: string }> = ({ size, className }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <svg
      className={`animate-spin text-orange-500 ${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

const PostSkeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`card p-4 animate-pulse ${className}`}>
    <div className="flex gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 rounded bg-gray-200"></div>
          <div className="h-3 w-16 rounded bg-gray-200"></div>
        </div>
        <div className="space-y-1">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="h-3 w-12 rounded bg-gray-200"></div>
          <div className="h-3 w-12 rounded bg-gray-200"></div>
          <div className="h-3 w-12 rounded bg-gray-200"></div>
          <div className="ml-auto h-3 w-12 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const Dots: React.FC<{ size: string; className: string }> = ({ size, className }) => {
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  
  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className={`${dotSize} rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`${dotSize} rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`${dotSize} rounded-full bg-orange-500 animate-bounce`}></div>
    </div>
  );
};

const Pulse: React.FC<{ className: string }> = ({ className }) => (
  <div className={`h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
    <div className="h-full bg-orange-500 animate-pulse-bar"></div>
  </div>
);

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  className = '',
  text
}) => {
  const baseClassName = `flex items-center justify-center ${className}`;

  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner size={size} className={baseClassName} />;
      case 'skeleton':
        return <PostSkeleton className={className} />;
      case 'dots':
        return <Dots size={size} className={baseClassName} />;
      case 'pulse':
        return <Pulse className={className} />;
      default:
        return <Spinner size={size} className={baseClassName} />;
    }
  };

  return (
    <div className={text ? 'space-y-2' : ''}>
      {renderLoading()}
      {text && (
        <p className="text-center text-sm text-gray-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton wrapper for multiple post skeletons
export const FeedSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <Loading key={i} variant="skeleton" />
    ))}
  </div>
);
