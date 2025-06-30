import React from 'react';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import Content from './components/Content';

const page = async () => {
  const queryKey = 'nhap-diem-list';
  const giangViens = await GiangVienService.danhSachGiangVienServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999,
    active: true
  }).catch((error) => ({ data: [] }));
  return (
    <Box>
      <Content queryKey={queryKey} giangVienServer={giangViens?.data.length > 0 ? giangViens.data : undefined} />
    </Box>
  );
};

export default page;
