'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';

const page = async () => {
  const lopHoc = await LopHocService.getLopHocNoPageServer().catch(() => []);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          lopHocs: lopHoc?.length > 0 ? lopHoc : undefined
        }}
      />
    </Box>
  );
};

export default page;
