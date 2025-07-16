'use server';
import { Box } from '@mui/material';
import React from 'react';
import Content from './components/contents/Content';

import { GiangVienService } from '@/services/GiangVienService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { KhoaService } from '@/services/KhoaService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'giang-vien-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }, null],
    queryFn: async () => {
      const result = await GiangVienService.danhSachGiangVienServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  const tinhTrangServer = GiangVienService.getGiangVienTinhTrangServer({});

  const khoas = KhoaService.getKhoaNoPageServer().catch((error: any) => {
    console.log('Lỗi khi lấy danh sách khoa', error);
    return [];
  });
  const [khoaData, tinhTrangData] = await Promise.all([khoas, tinhTrangServer]);
  console.log('test tinh trang giang vien:', tinhTrangData);
  return (
    <Box className='flex flex-col gap-3'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Content
          queryKey={queryKey}
          tinhTrangServer={tinhTrangData ? tinhTrangData : undefined}
          khoaData={khoaData?.length > 0 ? khoaData : undefined}
        />
      </HydrationBoundary>
    </Box>
  );
}
