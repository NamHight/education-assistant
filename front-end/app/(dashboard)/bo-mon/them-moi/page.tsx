'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { KhoaService } from '@/services/KhoaService';

const page = async () => {
  const khoa = await KhoaService.getKhoaNoPageServer().catch(() => []);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          khoas: khoa?.length > 0 ? khoa : undefined
        }}
      />
    </Box>
  );
};

export default page;
