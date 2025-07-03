'use server';
import { Box } from '@mui/material';
import React from 'react';
import { clsx as cn } from 'clsx';
import Content from './components/contents/Content';

import { GiangVienService } from '@/services/GiangVienService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import ButtonRedirect from './components/buttons/ButtonRedirect';
import { KhoaService } from '@/services/KhoaService';
import { BoMonService } from '@/services/BoMonService';

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
  const khoas = KhoaService.getAllKhoaServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  }).catch(() => ({ data: [] }));
  const boMons = BoMonService.getAllBoMonNoPageServer().catch(() => []);

  const [khoaData, boMonData] = await Promise.all([khoas, boMons]);
  return (
    <Box className='flex flex-col gap-3'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Content queryKey={queryKey} khoaData={khoaData} boMonData={boMonData} />
      </HydrationBoundary>
    </Box>
  );
}
