import { Post } from '@/types/graphql';
export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'elonmusk',
    content:
      'By enabling high-speed, low-latency and affordable Internet globally, Starlink will do more to educate and lift people out of poverty than any NGO ever',
    likes: 19000,
    comments: 2000,
    reposts: 3000,
    views: 4300000,
    timestamp: '2025-08-20T12:00:00Z',
    imageUrl: null,
    isReply: false,
    parentPostId: null,
  },
  {
    id: '2',
    author: 'michelleobama',
    content:
      'Michelle and I send our congratulations to a fellow Chicagoan, His Holiness Pope Leo XIV. This is a historic day for the United States, and we will pray for him as he begins the sacred work of leading the Catholic Church and setting an example for so many, regardless of faith.',
    likes: 429000,
    comments: 8700,
    reposts: 34000,
    views: 58000000,
    timestamp: '2025-08-08T12:00:00Z',
    imageUrl: 'https://example.com/image.jpg',
    isReply: false,
    parentPostId: null,
  },
  {
    id: '3',
    author: 'michelleobama',
    content:
      "It was such a joy speaking with Ms. Tina Knowles at her first book tour stop for Matriarch! Matriarch is more than a memoir—it's a love letter to Black women, to our stories, to our families, and to the unshakeable strength that holds us all together. This is a must-read, and",
    likes: 5200,
    comments: 7800,
    reposts: 597,
    views: 1100000,
    timestamp: '2025-08-20T12:12:00Z',
    imageUrl: 'https://example.com/image2.jpg',
    isReply: true,
    parentPostId: '2',
  },
];