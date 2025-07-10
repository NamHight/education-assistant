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
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => ( [] ));
  const [khoaData] = await Promise.all([khoa]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined,
        }}
      />
    </Box>
  );
};

export default page;
