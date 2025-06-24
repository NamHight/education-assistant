'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { MonHocService } from '@/services/MonHocService';
import { GiangVienService } from '@/services/GiangVienService';
import { LopHocService } from '@/services/LopHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';

const page = async () => {
  const monHoc = MonHocService.getAllMonHocServer();
  const giangVien = GiangVienService.danhSachGiangVienServer({ active: true });
  const lopHoc = LopHocService.getAllLopHocServer();
  const chuongTrinhDaoTao = ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  });
  const [monHocData, gianVienData, lopHocData, chuongTrinhDaoTaoData] = await Promise.all([
    monHoc,
    giangVien,
    lopHoc,
    chuongTrinhDaoTao
  ]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          monHocs: monHocData?.data,
          giangViens: gianVienData?.data,
          lopHocs: lopHocData?.data,
          chuongTrinhDaoTaos: chuongTrinhDaoTaoData?.data
        }}
      />
    </Box>
  );
};

export default page;
