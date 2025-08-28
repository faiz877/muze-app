'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create HTTP link for GraphQL API
const httpLink = new HttpLink({ 
  uri: '/api/graphql',
  // Add some useful headers
  headers: {
    'Content-Type': 'application/json',
  }
});

// Apollo Client configuration
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Configure caching behavior for posts
            keyArgs: false, // Don't cache by arguments to allow infinite scroll
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  // Enable network only for development to see real-time changes
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});


