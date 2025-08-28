import { MOCK_POSTS, MOCK_POSTS_POOL } from '@/api/mockData';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client/react';
import { GET_POSTS_QUERY } from '@/graphql/operations/queries';
import { LIKE_POST_MUTATION, REPOST_POST_MUTATION } from '@/graphql/operations/mutations';
import type { Post, FeedListProps } from '@/types/graphql';
import { useFeedStore } from '@/store/feedStore';
import { PostCard } from './PostCard';
import { Loading, FeedSkeleton } from './ui/Loading';
import { EmptyFeed, APIError, NetworkError, ErrorBoundary } from './ui/ErrorStates';

const PAGE_SIZE = 5; // Show fewer posts initially to make infinite scroll more noticeable
const INTERSECTION_THRESHOLD = 0.1;
const DEBOUNCE_MS = 300;

export const FeedList: React.FC<FeedListProps> = ({ className = '' }) => {
  // ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL - NO CONDITIONAL CALLS
  const { posts, setPosts, prependPost, updatePost, page, nextPage, hasMore, setError, setLoading } = useFeedStore();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [networkError, setNetworkError] = useState<ApolloError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  

  

  

  // Like mutation with optimistic updates
  const [likePost, { loading: liking }] = useMutation(LIKE_POST_MUTATION, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Like mutation error:', error);
    }
  });

  // Repost mutation with optimistic updates
  const [repostPost, { loading: reposting }] = useMutation(REPOST_POST_MUTATION, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Repost mutation error:', error);
    }
  });

  // Track liked posts state locally
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  // Track reposted posts state locally
  const [repostedPosts, setRepostedPosts] = useState<Set<string>>(new Set());

  // Event handlers - defined with useCallback to prevent unnecessary re-renders
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setNetworkError(null);
    // refetch(); // Removed as useQuery is no longer used
  }, []);

  const handleNewPost = useCallback(() => {
    console.log('New post clicked');
  }, []);

  // Simulate real-time updates with polling
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_POSTS_POOL.length);
      const newPost = {
        ...MOCK_POSTS_POOL[randomIndex],
        id: String(Math.random()),
        timestamp: new Date().toISOString(),
      };
      prependPost(newPost);
    }, 6500);
    return () => clearInterval(interval);
  }, [prependPost]);

  const handleLike = useCallback(async (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    
    const isCurrentlyLiked = likedPosts.has(id);
    const newLikesCount = isCurrentlyLiked ? target.likes - 1 : target.likes + 1;
    
    // Optimistic UI update
    const optimistic: Post = { ...target, likes: newLikesCount };
    updatePost(optimistic);
    
    // Update liked posts state
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    
    try {
      const response = await likePost({ variables: { id } });
      const updated = response.data?.likePost as Post | undefined;
      if (updated) {
        // In a real app, the server would return the correct like count
        // For now, we'll trust our optimistic update
        updatePost({ ...updated, likes: newLikesCount });
      }
    } catch (error) {
      console.error('Like error:', error);
      // Revert optimistic changes on error
      updatePost(target);
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(id); // Revert: add back if we tried to remove
        } else {
          newSet.delete(id); // Revert: remove if we tried to add
        }
        return newSet;
      });
    }
  }, [posts, updatePost, likePost, likedPosts]);

  const handleRepost = useCallback(async (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    
    const isCurrentlyReposted = repostedPosts.has(id);
    const newRepostsCount = isCurrentlyReposted ? target.reposts - 1 : target.reposts + 1;
    
    // Optimistic UI update
    const optimistic: Post = { ...target, reposts: newRepostsCount };
    updatePost(optimistic);
    
    // Update reposted posts state
    setRepostedPosts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyReposted) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    
    try {
      const response = await repostPost({ variables: { id } });
      const updated = response.data?.repostPost as Post | undefined;
      if (updated) {
        // In a real app, the server would return the correct repost count
        // For now, we'll trust our optimistic update
        updatePost({ ...updated, reposts: newRepostsCount });
      }
    } catch (error) {
      console.error('Repost error:', error);
      // Revert optimistic changes on error
      updatePost(target);
      setRepostedPosts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyReposted) {
          newSet.add(id); // Revert: add back if we tried to remove
        } else {
          newSet.delete(id); // Revert: remove if we tried to add
        }
        return newSet;
      });
    }
  }, [posts, updatePost, repostPost, repostedPosts]);

  // Initial load of posts from MOCK_POSTS
  useEffect(() => {
    if (posts.length === 0 && !isLoadingMore) { // Only load if no posts are present and not already loading
      const initialPosts = MOCK_POSTS.slice(0, PAGE_SIZE);
      setPosts(initialPosts, { reset: true });
      nextPage(); // Increment page for next load
      setLoading(false);
    }
  }, [posts.length, isLoadingMore, setPosts, nextPage, setLoading]);

  // Infinite scroll with debouncing
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return;

    const loadMorePosts = async () => {
      setIsLoadingMore(true);
      try {
        const startIndex = page * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const newPosts = MOCK_POSTS.slice(startIndex, endIndex);

        if (newPosts.length > 0) {
          setPosts(newPosts);
          nextPage();
        } else {
          // No more posts to load
          // This will stop the infinite scroll
          // We need to update the hasMore state in the store
          // For now, we'll just let the IntersectionObserver stop observing
        }
      } catch (error) {
        console.error('Failed to load more posts:', error);
        setError('Failed to load more posts');
      } finally {
        setIsLoadingMore(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(loadMorePosts, DEBOUNCE_MS);
          }
        });
      },
      {
        threshold: INTERSECTION_THRESHOLD,
        rootMargin: '100px'
      }
    );

    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [hasMore, isLoadingMore, page, setPosts, nextPage, setError]);

  // Memoized content
  const content = useMemo(() => (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="flex gap-8">
        {/* Left Sidebar - Empty for now */}
        <div className="hidden lg:block w-[250px] flex-shrink-0">
          {/* Left sidebar content can go here */}
        </div>
        
        {/* Main Feed */}
        <div className="flex-1 max-w-[600px]">
          <div className="bg-white border-x border-gray-200 min-h-screen">
            {posts.map((post, index) => (
              <div 
                key={post.id}
                data-post-id={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard 
                  post={post} 
                  onLike={handleLike}
                  onComment={(id) => console.log('Comment on:', id)}
                  onRepost={handleRepost}
                  onShare={(id) => console.log('Share:', id)}
                  isLiking={liking}
                  isLiked={likedPosts.has(post.id)}
                  isReposting={reposting}
                  isReposted={repostedPosts.has(post.id)}
                />
              </div>
            ))}
            
            {isLoadingMore && (
              <div className="py-8 animate-fade-in border-b border-gray-100">
                <Loading 
                  variant="dots" 
                  text="Loading more posts..." 
                  className="text-center"
                />
              </div>
            )}
            
            <div 
              ref={sentinelRef} 
              className="h-4 flex items-center justify-center"
              aria-hidden="true"
            >
              {hasMore && !isLoadingMore && (
                <div className="text-xs text-gray-400 animate-pulse">
                  Scroll for more
                </div>
              )}
            </div>
            
            {!hasMore && posts.length > 0 && (
              <div className="py-8 text-center animate-fade-in border-b border-gray-100">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You've reached the end!
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Empty for now */}
        <div className="hidden xl:block w-[300px] flex-shrink-0">
          {/* Right sidebar content can go here */}
        </div>
      </div>
    </div>
  ), [posts, liking, reposting, isLoadingMore, hasMore, handleLike, handleRepost, likedPosts, repostedPosts]);

  // CONDITIONAL RETURNS MUST COME AFTER ALL HOOKS
  if (networkError && posts.length === 0) {
    return (
      <div className="container-responsive py-8">
        {navigator.onLine === false ? (
          <NetworkError onRetry={handleRetry} />
        ) : (
          <APIError onRetry={handleRetry} message={networkError.message} />
        )}
      </div>
    );
  }

  if (posts.length === 0 && isLoadingMore) { // Show skeleton only if no posts and still loading
    return (
      <div className="container-responsive py-4">
        <FeedSkeleton count={5} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container-responsive py-8">
        <EmptyFeed onNewPost={handleNewPost} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className={`min-h-screen bg-gray-50 ${className}`}
        aria-busy={isLoadingMore} 
        aria-live="polite"
      >
        {content}
        
        {networkError && posts.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 animate-slide-in-up">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-lg max-w-sm">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Connection Error</p>
                  <p className="text-xs text-red-600">Failed to load new posts</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};



