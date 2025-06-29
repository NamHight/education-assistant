'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { KhoaService } from '@/services/KhoaService';

const page = async () => {
  const khoa = await KhoaService.getAllKhoaServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          khoas: khoa?.data?.length > 0 ? khoa?.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
