'use server';
import React from 'react';
import Content from './components/contents/Content';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { KhoaService } from '@/services/KhoaService';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: IPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const queryKey = 'chi-tiet-chuong-trinh-dao-tao-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }, id],
    queryFn: async () => {
      const result = await ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTaoServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        chuongTrinhDaoTaoId: id
      }).catch(() => ({ data: [] }));

      return result?.data?.length > 0 ? result : undefined;
    }
  });
  const khoas = await KhoaService.getKhoaNoPageServer().catch(() => undefined);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} id={id} khoas={khoas} />
    </HydrationBoundary>
  );
}
