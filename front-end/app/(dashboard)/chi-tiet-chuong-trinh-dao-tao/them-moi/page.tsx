'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { KhoaService } from '@/services/KhoaService';
import { NganhService } from '@/services/NganhService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { MonHocService } from '@/services/MonHocService';

const page = async () => {
  const khoa = KhoaService.getAllKhoaServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const chuongTrinhDaoTao = ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));

  const [khoaData, chuongTrinhDaoTaoData] = await Promise.all([khoa, chuongTrinhDaoTao]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          khoas: khoaData.data?.length > 0 ? khoaData.data : undefined,
          chuongTrinhDaoTaos: chuongTrinhDaoTaoData.data?.length > 0 ? chuongTrinhDaoTaoData.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
