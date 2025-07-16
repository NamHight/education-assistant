"use server"
import React from 'react';
import { AuthenticateService } from '@/services/AuthenticateService';
import Container from './components/Container';

const page = async () => {
  const queryKey = 'nhap-diem-list';
  const user = await AuthenticateService.getMeServer().catch(() => undefined);
  const role = user?.taiKhoan?.loaiTaiKhoan;
  return (
      <Container role={role} queryKey={queryKey} user={user} />
  );
};

export default page;
