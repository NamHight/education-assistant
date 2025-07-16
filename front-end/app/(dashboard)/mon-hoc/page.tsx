'use server';
import React from 'react';
import Content from './components/contents/Content';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'mon-hoc-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      const result = await MonHocService.getAllMonHocServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  const khoa = await KhoaService.getKhoaNoPageServer().catch(() => []);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} khoas={khoa?.length > 0 ? khoa : undefined} />
    </HydrationBoundary>
  );
}
