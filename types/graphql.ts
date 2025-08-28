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
}