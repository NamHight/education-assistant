'use client';
import React from 'react';
import { getQueryClient } from '@/hooks/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotificationsProvider } from '@toolpad/core';
interface ProviderProps {
  children?: React.ReactNode;
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
