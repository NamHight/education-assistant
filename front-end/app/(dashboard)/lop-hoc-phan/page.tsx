'use server';
import { Box } from '@mui/material';
import React from 'react';
import { clsx as cn } from 'clsx';
import Content from './components/contents/Content';

import { GiangVienService } from '@/services/GiangVienService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'lop-hoc-phan-list';
  const result = await LopHocPhanService.getAllLopHocPhanServer({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} />
    </HydrationBoundary>
  );
}
