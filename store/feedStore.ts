import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Post, FeedState, LoadingState } from '@/types/graphql';

type FeedActions = {
  // Posts management
  setPosts: (posts: Post[], opts?: { reset?: boolean }) => void;
  prependPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  removePost: (id: string) => void;
  
  // Pagination
  nextPage: () => void;
  resetPagination: () => void;
  
  // Loading state
  setLoading: (loading: boolean) => void;
  setLoadingState: (state: LoadingState) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  
  // User preferences
  setActiveTab: (tab: 'for-you' | 'following' | 'discover') => void;
  setActiveFilter: (filter: 'latest' | 'worldwide') => void;
  
  // Reset entire store
  reset: () => void;
};

const initialState: FeedState = {
  posts: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
  activeTab: 'for-you',
  activeFilter: 'latest',
};

export const useFeedStore = create<FeedState & FeedActions>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Posts management
        setPosts: (incoming, opts) =>
          set((state) => {
            // If we're resetting or this is the first page
            if (opts?.reset) {
              return {
                posts: incoming,
                hasMore: incoming.length > 0,
                error: null,
              };
            }
            
            // Deduplicate posts when adding more
            const existingIds = new Set(state.posts.map(p => p.id));
            const uniqueNewPosts = incoming.filter(p => !existingIds.has(p.id));
            
            return {
              posts: [...state.posts, ...uniqueNewPosts],
              hasMore: uniqueNewPosts.length > 0,
              error: uniqueNewPosts.length === 0 && incoming.length > 0 ? 'No new posts to load' : null,
            };
          }),

        prependPost: (post) =>
          set((state) => {
            // Avoid duplicates when prepending
            if (state.posts.some(p => p.id === post.id)) {
              return state;
            }
            return { 
              posts: [post, ...state.posts],
              error: null 
            };
          }),

        updatePost: (post) =>
          set((state) => ({
            posts: state.posts.map((p) => (p.id === post.id ? { ...p, ...post } : p)),
          })),
          
        removePost: (id) =>
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
          })),

        // Pagination
        nextPage: () => set((state) => ({ page: state.page + 1 })),
        resetPagination: () => set({ page: 1, hasMore: true }),

        // Loading state
        setLoading: (loading) => set({ isLoading: loading }),
        setLoadingState: (loadingState) => 
          set({ 
            isLoading: loadingState === 'loading',
            error: loadingState === 'error' ? get().error || 'An error occurred' : null
          }),

        // Error handling
        setError: (error) => set({ error }),

        // User preferences
        setActiveTab: (activeTab) => set({ 
          activeTab,
          // Reset pagination when changing tabs
          page: 1,
          hasMore: true,
          posts: [],
          isLoading: true
        }),
        
        setActiveFilter: (activeFilter) => set({ 
          activeFilter,
          // Reset pagination when changing filters
          page: 1,
          hasMore: true,
          posts: [],
          isLoading: true
        }),

        // Reset entire store
        reset: () => set(initialState),
      }),
      {
        name: 'muze-feed-storage',
        partialize: (state) => ({ 
          // Only persist user preferences
          activeTab: state.activeTab,
          activeFilter: state.activeFilter,
        }),
      }
    )
  )
);


