'use server';
import { Box, Button } from '@mui/material';
import React from 'react';
import { clsx as cn } from 'clsx';
import Content from './components/contents/Content';

import { GiangVienService } from '@/services/GiangVienService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/hooks/getQueryClient';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { LopHocService } from '@/services/LopHocService';
import { redirect } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import ButtonRedirect from './components/buttons/ButtonRedirect';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'lop-hoc-list';
  await queryClient.prefetchQuery({
    queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      const result = await LopHocService.getAllLopHocServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }).catch(() => ({ data: [] }));
      return result?.data?.length > 0 ? result : undefined;
    }
  });
  return (
    <Box className='flex flex-col gap-3'>
      <Box className={cn('flex border border-gray-200 rounded-lg p-4 shadow-sm')}>
        <ButtonRedirect />
      </Box>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Content queryKey={queryKey} />
      </HydrationBoundary>
    </Box>
  );
}
