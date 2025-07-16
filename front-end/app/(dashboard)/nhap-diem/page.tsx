import React from 'react';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box, Button } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import Content from './components/Content';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';
import { cookies } from 'next/headers';
import { LoaiTaiKhoanEnum } from '@/types/options';
import ContentAdmin from './components/ContentAdmin';
import { AuthenticateService } from '@/services/AuthenticateService';
import Container from './components/Container';

const page = async () => {
  const queryKey = 'nhap-diem-list';
  const user = await AuthenticateService.getMeServer();
  const role = user?.taiKhoan?.loaiTaiKhoan;
  console.log('user', role);
  return (
      <Container role={role} queryKey={queryKey} />
  );
};

export default page;
