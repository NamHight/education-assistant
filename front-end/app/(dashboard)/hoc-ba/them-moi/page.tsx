'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import { SinhVienService } from '@/services/SinhVienService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { TrangThaiLopHocPhanEnum } from '@/types/options';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

const page = async () => {
  const SinhViens = SinhVienService.getAllSinhVienServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  }).catch((error) => ({ data: [] }));
  const LopHocPhans = LopHocPhanService.getAllLopHocPhanServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999,
    trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
  }).catch((error) => ({ data: [] }));
  const ChiTietChuongTrinhDaoTaos = ChitietChuongTrinhDaoTaoService.getChitietChuongTrinhDaoTaoServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  }).catch((error) => ({ data: [] }));
  const [sinhVienData, lopHocPhanData, chiTietChuongTrinhDaoTaoData] = await Promise.all([
    SinhViens,
    LopHocPhans,
    ChiTietChuongTrinhDaoTaos
  ]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          sinhViens: sinhVienData?.data?.length > 0 ? sinhVienData?.data : undefined,
          lopHocPhans: lopHocPhanData?.data?.length > 0 ? lopHocPhanData?.data : undefined,
          chiTietChuongTrinhDaoTaos:
            chiTietChuongTrinhDaoTaoData?.data?.length > 0 ? chiTietChuongTrinhDaoTaoData?.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
