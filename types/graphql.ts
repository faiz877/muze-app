// Core GraphQL interfaces
export interface Post {
    id: string;
    author: string;
    content: string;
    likes: number;
    comments: number;
    reposts: number;
    views: number;
    timestamp: string; 
    imageUrl: string | null;
    isReply: boolean;
    parentPostId: string | null;
    profileImageUrl: string | null;
}

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
}

// Component prop interfaces
export interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onComment?: (id: string) => void;
    onRepost?: (id: string) => void;
    onShare?: (id: string) => void;
    isLiking?: boolean;
    isLiked?: boolean;
    isReposting?: boolean;
    isReposted?: boolean;
    className?: string;
}

export interface FooterActionsProps {
    likes: number;
    comments: number;
    reposts: number;
    views: number;
    onLike: () => void;
    onComment?: () => void;
    onRepost?: () => void;
    onShare?: () => void;
    isLiking?: boolean;
    isLiked?: boolean;
    className?: string;
}

export interface HeaderProps {
    onSearch?: (query: string) => void;
    onNewPost?: () => void;
    className?: string;
}

export interface NavTabsProps {
    activeTab?: 'for-you' | 'following' | 'discover';
    onTabChange?: (tab: string) => void;
    activeFilter?: 'latest' | 'worldwide';
    onFilterChange?: (filter: string) => void;
    className?: string;
}

export interface FeedListProps {
    className?: string;
}

// UI State interfaces
export interface FeedState {
    posts: Post[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
    error: string | null;
    activeTab: 'for-you' | 'following' | 'discover';
    activeFilter: 'latest' | 'worldwide';
}

export interface AnimationState {
    isAnimating: boolean;
    animationType: 'slide-in' | 'fade-in' | 'scale-in' | null;
}

// API response interfaces
export interface PostsResponse {
    posts: Post[];
    hasMore: boolean;
    totalCount: number;
}

export interface LikeResponse {
    success: boolean;
    post: Post;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type DeviceSize = 'mobile' | 'tablet' | 'desktop';
export type Theme = 'light' | 'dark' | 'system';
