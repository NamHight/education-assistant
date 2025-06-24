'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';

const page = async () => {
  const lopHoc = await LopHocService.getAllLopHocServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  });
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          lopHocs: lopHoc?.data || []
        }}
      />
    </Box>
  );
};

export default page;
