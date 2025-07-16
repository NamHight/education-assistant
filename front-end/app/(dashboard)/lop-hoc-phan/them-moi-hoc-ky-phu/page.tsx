'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import { MonHocService } from '@/services/MonHocService';
import { GiangVienService } from '@/services/GiangVienService';

const page = async () => {
  const monHoc = MonHocService.getAllMonHocServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const giangVien = GiangVienService.getGiangVienNoPageServer().catch(() => []);
  const [monHocData, gianVienData] = await Promise.all([monHoc, giangVien]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          monHocs: monHocData?.data?.length ? monHocData?.data : undefined,
          giangViens: gianVienData?.length ? gianVienData : undefined
        }}
      />
    </Box>
  );
};

export default page;
