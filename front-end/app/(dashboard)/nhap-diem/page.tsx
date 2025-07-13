import React from 'react';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import Content from './components/Content';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';
import { cookies } from 'next/headers';
import { LoaiTaiKhoanEnum } from '@/types/options';
import ContentAdmin from './components/ContentAdmin';

const page = async () => {
  const queryKey = 'nhap-diem-list';
  const cookie = await cookies();
  const role = cookie.get('role')?.value || '';
  console.log('role', role);
  return (
    <Box>
      {
        Number(role) === LoaiTaiKhoanEnum.ADMIN ? (
          <ContentAdmin />
        ) : (
      <PopoverLockProvider>
        <Content queryKey={queryKey} />
      </PopoverLockProvider>
        )
      }
   
    </Box>
  );
};

export default page;
