import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PubSub } from 'graphql-subscriptions';
import { typeDefs } from '@/graphql/schema'; 
import { MOCK_POSTS } from '@/api/mockData'; 
import { Post } from '@/types/graphql';

// Create a single PubSub instance for the entire application
const pubsub = new PubSub();
let posts: Post[] = [...MOCK_POSTS];

// Topics for subscriptions
const NEW_POST_TOPIC = 'NEW_POST';
const POST_LIKED_TOPIC = 'POST_LIKED';

// Auto-generate new posts every 30 seconds for demo purposes (less frequent for better UX)
let postIdCounter = posts.length + 1;
const demoAuthors = [
  'Elon Musk', 'Michelle Obama', 'Tim Cook', 'Oprah Winfrey', 
  'Bill Gates', 'Satya Nadella', 'Ryan Reynolds', 'Neil deGrasse Tyson',
  'Malala Yousafzai', 'Trevor Noah', 'Stephen King', 'Lin-Manuel Miranda'
];

const demoContents = [
  '🌟 Innovation happens when we dare to dream bigger than yesterday.',
  '📱 The future is being built today, one line of code at a time.',
  '🌍 Small acts of kindness can change the world. What will you do today?',
  '💡 The best ideas often come from the most unexpected places.',
  '🚀 Progress isn\'t just about technology—it\'s about improving human lives.',
  '📚 Learning never stops. What new skill are you working on?',
  '🎭 Creativity is the bridge between what is and what could be.',
  '🌱 Sustainability isn\'t a trend—it\'s our responsibility to future generations.',
  '🤝 Collaboration beats competition every time.',
  '✨ Every expert was once a beginner. Keep pushing forward!'
];

const demoImages = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&crop=center'
];

if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    const randomAuthor = demoAuthors[Math.floor(Math.random() * demoAuthors.length)];
    const randomContent = demoContents[Math.floor(Math.random() * demoContents.length)];
    const randomImage = Math.random() > 0.6 ? demoImages[Math.floor(Math.random() * demoImages.length)] : null;
    
    const newPost: Post = {
      id: String(postIdCounter++),
      author: randomAuthor,
      content: randomContent,
      likes: Math.floor(Math.random() * 1000) + 10,
      comments: Math.floor(Math.random() * 100) + 5,
      reposts: Math.floor(Math.random() * 50) + 2,
      views: Math.floor(Math.random() * 50000) + 1000,
      timestamp: new Date().toISOString(),
      imageUrl: randomImage,
      isReply: false,
      parentPostId: null,
    };
    
    posts.unshift(newPost); // Add to beginning
    
    // Keep only the latest 50 posts to prevent memory issues
    if (posts.length > 50) {
      posts = posts.slice(0, 50);
    }
    
    // Publish the new post to subscribers
    pubsub.publish(NEW_POST_TOPIC, { newPost });
    console.log(`📡 Published new post by ${randomAuthor}: ${newPost.id}`);
  }, 30000); // Every 30 seconds
}

const resolvers = {
  Query: {
    posts: (_: any, { page, limit }: { page: number; limit: number }) => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = posts.slice(startIndex, endIndex);
      console.log(`📖 Query: Returning ${paginatedPosts.length} posts for page ${page}`);
      return paginatedPosts;
    },
  },
  Mutation: {
    likePost: (_: any, { id }: { id: string }) => {
      const postIndex = posts.findIndex((p) => p.id === id);
      if (postIndex === -1) {
        throw new Error(`Post with ID ${id} not found.`);
      }
      const updatedPost = { ...posts[postIndex], likes: posts[postIndex].likes + 1 };
      posts[postIndex] = updatedPost;
      
      // Publish the liked post update
      pubsub.publish(POST_LIKED_TOPIC, { postLiked: updatedPost });
      console.log(`👍 Post liked: ${id}, new likes: ${updatedPost.likes}`);
      
      return updatedPost; 
    },
  },
  Subscription: {
    newPost: {
      // Use the PubSub instance to create an async iterator
      subscribe: () => {
        console.log('🔔 New subscription to newPost created');
        return pubsub.asyncIterator([NEW_POST_TOPIC]);
      },
    },
  },
};

// Initialize Apollo Server with our schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable introspection and playground in development
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation(requestContext) {
            console.log(`🔍 GraphQL Operation: ${requestContext.request.operationName || 'Anonymous'}`);
          },
        };
      },
    },
  ],
});

// Create a Next.js handler for the Apollo Server
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ 
    req, 
    res, 
    pubsub 
  }),
});

export { handler as GET, handler as POST };
