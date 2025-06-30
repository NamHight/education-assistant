'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { KhoaService } from '@/services/KhoaService';
import { GiangVienService } from '@/services/GiangVienService';
import { NganhService } from '@/services/NganhService';

const page = async () => {
  const giangViens = GiangVienService.danhSachGiangVienServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    active: true
  }).catch(() => ({ data: [] }));
  const nganhs = NganhService.getAllNganhServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const [giangVienData, nganhData] = await Promise.all([giangViens, nganhs]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          giangViens: giangVienData.data?.length > 0 ? giangVienData.data : undefined,
          nganhs: nganhData.data?.length > 0 ? nganhData.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
