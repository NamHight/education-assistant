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
  const boMon = authApiServer
    .get(`${API.BO_MON.GET_ALL}`, {
      params: {
        limit: 99999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }
    })
    .catch(() => ({ data: [] }));
  const chuongTrinhDaoTao = ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const monHoc = MonHocService.getAllMonHocServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const [boMonData, chuongTrinhDaoTaoData, monHocData] = await Promise.all([boMon, chuongTrinhDaoTao, monHoc]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          boMons: boMonData.data?.length > 0 ? boMonData.data : undefined,
          chuongTrinhDaoTaos: chuongTrinhDaoTaoData.data?.length > 0 ? chuongTrinhDaoTaoData.data : undefined,
          monHocs: monHocData.data?.length > 0 ? monHocData.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
