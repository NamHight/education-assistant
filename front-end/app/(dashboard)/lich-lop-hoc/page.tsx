import React from 'react';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import Content from './components/Content';
import { BoMonService } from '@/services/BoMonService';
import { LopHocService } from '@/services/LopHocService';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';

const page = async () => {
  const queryKey = 'lich-cong-tac-tuan-list';
  const lopHocs = LopHocService.getLopHocNoPageServer().catch(() => []);

  const [lopHocData] = await Promise.all([lopHocs]);
  return (
    <Box>
      <PopoverLockProvider>
        <Content queryKey={queryKey} lopHocServer={lopHocData?.length > 0 ? lopHocData : undefined} />
      </PopoverLockProvider>
    </Box>
  );
};

export default page;
