'use client';

import React, { useState } from 'react';
import type { FooterActionsProps } from '@/types/graphql';

type ActionButtonProps = {
  icon: React.ReactNode;
  count: number;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
  variant?: 'like' | 'comment' | 'repost' | 'share';
  className?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  count,
  label,
  onClick,
  isActive = false,
  isLoading = false,
  variant = 'comment',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);

  const handleClick = () => {
    if (onClick && !isLoading) {
      setWasClicked(true);
      onClick();
      setTimeout(() => setWasClicked(false), 300);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'like':
        return isActive 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-gray-600 hover:text-red-500 hover:bg-red-50';
      case 'comment':
        return 'text-gray-600 hover:text-blue-500 hover:bg-blue-50';
      case 'repost':
        return isActive 
          ? 'text-green-500 hover:text-green-600 hover:bg-green-50' 
          : 'text-gray-600 hover:text-green-500 hover:bg-green-50';
      case 'share':
        return 'text-gray-600 hover:text-purple-500 hover:bg-purple-50';
      default:
        return 'text-gray-600 hover:text-gray-700 hover:bg-gray-100';
    }
  };

  const baseClasses = `
    focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium 
    transition-all duration-200 touch-target group relative overflow-hidden
    ${getVariantClasses()}
    ${onClick ? 'cursor-pointer' : 'cursor-default'}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${wasClicked && variant === 'like' ? 'animate-wiggle' : ''}
    ${className}
  `;

  if (!onClick) {
    return (
      <div className={baseClasses}>
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
        <span className="transition-all duration-200">
          {count.toLocaleString()}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      className={baseClasses}
      aria-label={`${label} (${count})`}
      aria-pressed={isActive}
    >
      <span className={`
        transition-all duration-200 
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${wasClicked ? 'animate-bounce-gentle' : ''}
      `}>
        {icon}
      </span>
      <span className="transition-all duration-200">
        {count.toLocaleString()}
      </span>
      
      {/* Ripple effect on click */}
      {wasClicked && (
        <div className="absolute inset-0 bg-current opacity-10 animate-ping rounded-lg" />
      )}
    </button>
  );
};

export const FooterActions: React.FC<FooterActionsProps> = ({ 
  likes, 
  comments, 
  reposts, 
  views, 
  onLike, 
  onComment, 
  onRepost, 
  onShare,
  isLiking = false,
  isLiked = false,
  className = ''
}) => {
  return (
    <div className={`mt-3 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${className}`}>
      {/* Like Button */}
      <ActionButton
        icon={
          <svg className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
        count={likes}
        label="Like post"
        onClick={onLike}
        isActive={isLiked}
        isLoading={isLiking}
        variant="like"
      />

      {/* Comment Button */}
      <ActionButton
        icon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
        count={comments}
        label="Comments"
        onClick={onComment}
        variant="comment"
      />

      {/* Repost Button */}
      <ActionButton
        icon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        }
        count={reposts}
        label="Repost"
        onClick={onRepost}
        variant="repost"
      />

      {/* Share Button */}
      <ActionButton
        icon={
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        }
        count={0}
        label="Share post"
        onClick={onShare}
        variant="share"
        className="sm:flex hidden"
      />

      {/* Views Counter (Read-only) */}
      <div className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>{views.toLocaleString()}</span>
      </div>

      {/* Thanks Button */}
      <button className="hidden sm:flex focus-ring items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 hover:scale-105 active:scale-95 touch-target">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Thanks
      </button>
    </div>
  );
};



