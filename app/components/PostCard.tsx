'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { PostCardProps } from '@/types/graphql';
import { FooterActions } from './FooterActions';
import { Avatar } from './ui/Avatar';
import { ErrorState } from './ui/ErrorStates';

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment,
  onRepost,
  onShare,
  isLiking = false,
  className = ''
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  
  // Truncate long content
  const shouldTruncate = post.content.length > 280;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.slice(0, 280) + '...' 
    : post.content;

  // Handle like with optimistic UI
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  // Add entrance animation when component mounts
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add('animate-slide-in-up');
    }
  }, []);

  return (
    <article 
      ref={cardRef}
      aria-label={`Post by ${post.author}`} 
      className={`
        bg-white p-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer
        border-b border-gray-100 last:border-b-0
        ${post.isReply ? 'ml-6' : ''}
        ${className}
      `}
      onClick={() => {/* Handle post navigation */}}
    >
      <div className="flex gap-3">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <Avatar 
            src={null}
            alt={post.author}
            fallbackText={post.author}
            size="md"
            className="transition-transform duration-200 hover:scale-105"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Author Info and Timestamp */}
          <div className="flex items-center gap-1 mb-1">
            <span className="font-bold text-gray-900 text-[15px] hover:underline cursor-pointer">
              {post.author}
            </span>
            <span className="text-gray-500 text-[15px]">@{post.author.toLowerCase().replace(' ', '')}</span>
            <span className="text-gray-500 text-[15px]">·</span>
            <time 
              dateTime={post.timestamp}
              className="text-gray-500 text-[15px] hover:underline cursor-pointer"
              title={new Date(post.timestamp).toLocaleString()}
            >
              {formatTimestamp(post.timestamp)}
            </time>
          </div>

          {/* Post Content */}
          <div className="mb-3">
            <div className="text-[15px] leading-[20px] text-gray-900">
              {displayContent}
              
              {/* Read more/less button */}
              {shouldTruncate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-blue-500 hover:underline ml-1"
                  aria-label={isExpanded ? 'Show less' : 'Show more'}
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-2xl border border-gray-200">
              {hasImageError ? (
                <div className="bg-gray-100 p-8 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Image could not be loaded</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}
                  <img 
                    src={post.imageUrl} 
                    alt="Post media" 
                    className={`
                      h-auto w-full max-h-[512px] object-cover
                      ${isImageLoading ? 'opacity-0' : 'opacity-100'}
                    `}
                    loading="lazy"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => {
                      setIsImageLoading(false);
                      setHasImageError(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle image modal/lightbox if needed
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Engagement Actions */}
          <div className="flex items-center justify-between max-w-md text-gray-500 text-[13px]">
            {/* Like */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="flex items-center gap-2 hover:text-red-600 transition-colors group"
              disabled={isLiking}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span>{post.likes.toLocaleString()}</span>
            </button>

            {/* Comment */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onComment?.(post.id);
              }}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span>{post.comments.toLocaleString()}</span>
            </button>

            {/* Repost */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRepost?.(post.id);
              }}
              className="flex items-center gap-2 hover:text-green-600 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>{post.reposts.toLocaleString()}</span>
            </button>

            {/* Share */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(post.id);
              }}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </button>

            {/* Views */}
            <div className="flex items-center gap-2 ml-auto">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};



