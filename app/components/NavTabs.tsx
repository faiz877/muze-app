'use client';

import React, { useState } from 'react';
import type { NavTabsProps } from '@/types/graphql';

type Tab = {
  id: 'for-you' | 'following' | 'discover';
  label: string;
  shortLabel?: string;
};

type Filter = {
  id: 'latest' | 'worldwide';
  label: string;
};

const tabs: Tab[] = [
  { id: 'for-you', label: 'For You', shortLabel: 'For You' },
  { id: 'following', label: 'Following', shortLabel: 'Following' },
  { id: 'discover', label: 'Discover Feeds', shortLabel: 'Discover' }
];

const filters: Filter[] = [
  { id: 'latest', label: 'Latest' },
  { id: 'worldwide', label: 'Worldwide' }
];

export const NavTabs: React.FC<NavTabsProps> = ({
  activeTab = 'for-you',
  onTabChange,
  activeFilter = 'latest',
  onFilterChange,
  className = ''
}) => {
  const [localActiveTab, setLocalActiveTab] = useState<string>(activeTab);
  const [localActiveFilter, setLocalActiveFilter] = useState<string>(activeFilter);

  const handleTabChange = (tabId: string) => {
    setLocalActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleFilterChange = (filterId: string) => {
    setLocalActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <nav className={`border-b border-gray-200 bg-white ${className}`} role="navigation" aria-label="Content navigation">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-0">
            {tabs.map((tab) => {
              const isActive = localActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    relative px-4 py-3 text-[15px] font-medium transition-all duration-200 border-b-2
                    ${
                      isActive
                        ? 'text-gray-900 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-200'
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Switch to ${tab.label} feed`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-4">
            {filters.map((filter) => {
              const isActive = localActiveFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 text-[15px] rounded-full transition-all duration-200
                    ${
                      isActive
                        ? 'text-orange-600 bg-orange-50 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${filter.label}`}
                >
                  {filter.label}
                  <svg 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive ? 'rotate-180' : 'rotate-0'
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};



