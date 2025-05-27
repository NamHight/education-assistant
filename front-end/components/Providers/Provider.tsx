"use client"
import React from 'react';
import {getQueryClient} from "@/hooks/getQueryClient";
import {QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
interface ProviderProps {
  children?: React.ReactNode;
}
const Provider = ({children}: ProviderProps) => {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Provider;