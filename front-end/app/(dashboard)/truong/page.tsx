'use server';
import getQueryClient from '@/hooks/getQueryClient';
import { TruongService } from '@/services/TruongService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import Content from './components/contents/Content';

const Page = async () => {
  const queryClient = getQueryClient();
  const queryKey = 'truong-key-value';
  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const result = await TruongService.getAllTruongServer();
      console.log("test query server: ", result);
      return result;
    }

  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} />
    </HydrationBoundary>
  );
};

export default Page;
