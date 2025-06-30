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
  let monHocData = null;
  let gianVienData = null;
  try {
    const monHoc = MonHocService.getAllMonHocServer({
      limit: 99999999999,
      sortBy: 'createdAt',
      sortByOrder: 'desc'
    });
    const giangVien = GiangVienService.danhSachGiangVienServer({
      active: true,
      limit: 99999999999,
      sortBy: 'createdAt',
      sortByOrder: 'desc'
    });
    [monHocData, gianVienData] = await Promise.all([monHoc, giangVien]);
  } catch (e) {
    monHocData = { data: [] };
    gianVienData = { data: [] };
  }
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          monHocs: monHocData?.data?.length ? monHocData?.data : undefined,
          giangViens: gianVienData?.data?.length ? gianVienData?.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
