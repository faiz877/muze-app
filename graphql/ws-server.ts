// graphql/ws-server.ts (This is a standalone WebSocket server for subscriptions)

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { ApolloServer } from '@apollo/server';
import { PubSub } from 'graphql-subscriptions';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './schema.ts';
import { MOCK_POSTS } from '../api/mockData.ts';
import type { Post } from '../types/graphql.ts';

// --- Data and PubSub setup (copied from route.ts for simplicity of this separate server) ---
let posts: Post[] = [...MOCK_POSTS];
const pubsub = new PubSub();
const NEW_POST_TOPIC = 'NEW_POST';
const POST_LIKED_TOPIC = 'POST_LIKED';

// --- Subscription publishing logic ---
let postIdCounter = posts.length + 1;
setInterval(() => {
  const newPost: Post = {
    id: String(postIdCounter++),
    author: `NewUser${postIdCounter}`,
    content: `Real-time update from WS server at ${new Date().toLocaleTimeString()}!`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 50),
    reposts: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 100000),
    timestamp: new Date().toISOString(),
    imageUrl: null,
    isReply: false,
    parentPostId: null,
  };

  pubsub.publish(NEW_POST_TOPIC, newPost);
  console.log('[WS Server] Published new post:', newPost.id);
}, 5000);

// --- Resolvers ---
const resolvers = {
  Query: {
    posts: (_: any, { page, limit }: { page: number; limit: number }) => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return posts.slice(startIndex, endIndex);
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
      return updatedPost;
    },
  },
  Subscription: {
    newPost: {
      subscribe: () => (pubsub as any).asyncIterator([NEW_POST_TOPIC]),
      resolve: (payload: any) => payload,
    },
  },
};

// --- WebSocket Server Setup ---
const WS_PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });
server.start().then(() => {
  const wsServer = new WebSocketServer({
    port: WS_PORT,
    path: '/graphql/subscriptions',
  });
  console.log(`🚀 WebSocket Server ready at ws://localhost:${WS_PORT}/graphql/subscriptions`);

  useServer(
    {
      schema,
      context: async () => ({ pubsub }),
    },
    wsServer
  );
});