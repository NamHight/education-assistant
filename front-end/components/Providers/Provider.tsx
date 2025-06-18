'use client';
import React from 'react';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotificationsProvider } from '@toolpad/core';
interface ProviderProps {
  children?: React.ReactNode;
}
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error: any) => error.response?.status !== 400 && failureCount < 3
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
const Provider = ({ children }: ProviderProps) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        {children}
        <ReactQueryDevtools />
      </NotificationsProvider>
    </QueryClientProvider>
  );
};

export default Provider;
