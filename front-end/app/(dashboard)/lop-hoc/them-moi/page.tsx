'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import { KhoaService } from '@/services/KhoaService';

const page = async () => {
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);
  const [khoaData] = await Promise.all([khoa]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined
        }}
      />
    </Box>
  );
};

export default page;
