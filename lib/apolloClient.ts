'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({ 
  uri: '/api/graphql',
});

// Apollo Client configuration
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


