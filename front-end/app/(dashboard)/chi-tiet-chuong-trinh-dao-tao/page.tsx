'use server';
import { Box } from '@mui/material';
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
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'chi-tiet-chuong-trinh-dao-tao-list';
  try {
    const result = await ChitietChuongTrinhDaoTaoService.getChitietChuongTrinhDaoTaoServer({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortByOrder: 'desc'
    }).catch(() => ({ data: [] }));
    await queryClient.prefetchQuery({
      queryKey: [queryKey, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
      queryFn: async () => {
        console.log('Fetching Chuong Trinh Dao Tao:', result);
        return result?.data?.length > 0 ? result : undefined;
      }
    });
  } catch (error) {
    console.log('Error fetching Chuong Trinh Dao Tao:', error);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} />
    </HydrationBoundary>
  );
}
