'use server';
import { Box } from '@mui/material';
import React, { Suspense } from 'react';
import { clsx as cn } from 'clsx';
import Content from './components/contents/Content';

import { GiangVienService } from '@/services/GiangVienService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { SinhVienService } from '@/services/SinhVienService';
import { LopHocService } from '@/services/LopHocService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'sinh-vien-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }, null, null],
    queryFn: async () => {
      const result = await SinhVienService.getAllSinhVienServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  const lopHoc = await LopHocService.getAllLopHocServer({
    limit: 9999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const tinhTrangHocTap = await SinhVienService.getAllTinhTrangHocTapServer().catch(() => undefined);
  const [lopHocData, tinhTrangHocTapData] = await Promise.all([lopHoc, tinhTrangHocTap]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content
        queryKey={queryKey}
        lopHocServers={lopHocData?.data?.length > 0 ? lopHocData.data : undefined}
        tinhTrangHocTapServer={tinhTrangHocTapData}
      />
    </HydrationBoundary>
  );
}
