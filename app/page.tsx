'use client';

import React, { Suspense } from 'react';
import { Header } from './components/Header';
import { NavTabs } from './components/NavTabs';
import { FeedList } from './components/FeedList';
import { ErrorBoundary } from './components/ui/ErrorStates';
import { Loading } from './components/ui/Loading';
import { useFeedStore } from '@/store/feedStore';

/**
 * Main application page containing the social media feed
 * 
 * Features:
 * - Responsive header with search and new post functionality
 * - Navigation tabs for feed filtering (For You, Following, Discover)
 * - Infinite scroll feed with loading states and error handling
 * - Real-time updates via GraphQL subscriptions
 * - Optimistic UI updates for user interactions
 */
export default function Home() {
  const { activeTab, activeFilter, setActiveTab, setActiveFilter } = useFeedStore();

  // Handle search functionality
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, this would trigger a search query
    // For now, we'll just log the search term
  };

  // Handle new post creation
  const handleNewPost = () => {
    console.log('Creating new post');
    // In a real app, this would open a modal or navigate to create post page
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    console.log('Tab changed to:', tab);
    setActiveTab(tab as 'for-you' | 'following' | 'discover');
  };

  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    console.log('Filter changed to:', filter);
    setActiveFilter(filter as 'latest' | 'worldwide');
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gray-50 scroll-smooth">
        {/* Header with search and actions */}
        <Header 
          onSearch={handleSearch}
          onNewPost={handleNewPost}
        />
        
        {/* Navigation tabs with filtering */}
        <NavTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        
        {/* Main feed content */}
        <Suspense 
          fallback={
            <div className="container-responsive py-8">
              <Loading variant="skeleton" text="Loading your feed..." />
            </div>
          }
        >
          <FeedList />
        </Suspense>
        
      </main>
    </ErrorBoundary>
  );
}
