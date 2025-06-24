import React from 'react';
import Content from './contents/Content';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';

const page = async () => {
  const queryKey = 'phan-cong-list';
  const ctdt = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
    sortBy: 'createdat',
    sortByOrder: 'desc'
  });
  return (
    <Box>
      <Content queryKey={queryKey} ctdtServer={ctdt?.data} />
    </Box>
  );
};

export default page;
