'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/lib/apolloClient';

type Props = { children: React.ReactNode };

export default function Providers({ children }: Props) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}


