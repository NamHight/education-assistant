'use server';
import React from 'react';
import Content from './components/contents/Content';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { NganhService } from '@/services/NganhService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'chuong-trinh-dao-tao-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      const result = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  const nganhs = await NganhService.getAllNganhNoPageServer().catch(() => undefined);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} nganhs={nganhs} />
    </HydrationBoundary>
  );
}
