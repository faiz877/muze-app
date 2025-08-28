'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar'; // Added Avatar import
import type { HeaderProps } from '@/types/graphql';

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onNewPost, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  // Auto-focus search when expanded on mobile
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <>
      <header className={`sticky top-0 z-20 border-b border-gray-200 bg-white backdrop-blur-sm ${className}`}>
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold text-gray-900 cursor-pointer">
                Muze
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-[600px] mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search or find something..."
                  className="w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-2.5 text-[15px] placeholder:text-gray-500 hover:bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
                  aria-label="Search posts"
                />
                <svg 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* New Post Button */}
              <button
                onClick={onNewPost}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-full text-[15px] transition-colors duration-200"
              >
                New Post
              </button>
              
              {/* Profile Avatar */}
              <Avatar
                src="/profile2.jpg"
                alt="User Profile"
                fallbackText="User"
                size="md" // Assuming 'md' size is appropriate for header
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Expansion */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 border-b border-gray-200 bg-white ${
        isSearchExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container-responsive py-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or find something..."
              className="focus-ring w-full rounded-full border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-500 hover:bg-gray-50 focus:bg-white focus:border-orange-300 transition-all duration-200"
              aria-label="Search posts"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};


