import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './schema.ts';
import { MOCK_POSTS } from '../api/mockData.ts';
import type { Post } from '../types/graphql.ts';

// --- Data ---
let posts: Post[] = [...MOCK_POSTS];

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
    repostPost: (_: any, { id }: { id: string }) => {
      const postIndex = posts.findIndex((p) => p.id === id);
      if (postIndex === -1) {
        throw new Error(`Post with ID ${id} not found.`);
      }
      const updatedPost = { ...posts[postIndex], reposts: posts[postIndex].reposts + 1 };
      posts[postIndex] = updatedPost;
      return updatedPost;
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

export default server;