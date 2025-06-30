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
import { HocBaService } from '@/services/HocBaService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { TrangThaiLopHocPhanEnum } from '@/types/options';

export default async function Page() {
  const queryClient = getQueryClient();
  const queryKey = 'hoc-ba-list';
  const lopHocPhans = await LopHocPhanService.getAllLopHocPhanServer({
    trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG,
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  })
    .then((res) => res?.data)
    .catch((error) => {
      return [];
    });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content queryKey={queryKey} lopHocPhanServer={lopHocPhans?.length > 0 ? lopHocPhans : undefined} />
    </HydrationBoundary>
  );
}
