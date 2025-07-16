'use server';
import React from 'react';
import Content from './components/contents/Content';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { NganhService } from '@/services/NganhService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'nganh-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      const result = await NganhService.getAllNganhServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} />
    </HydrationBoundary>
  );
}
