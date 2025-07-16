'use server';
import { Box } from '@mui/material';
import React from 'react';
import Content from './components/contents/Content';
import { LopHocService } from '@/services/LopHocService';
export default async function Page() {
  const lopHoc = await LopHocService.getLopHocNoPageServer().catch(() => []);
  return (
    <Box className='flex flex-col gap-3'>
      <Content
        initialData={{
          lopHocs: lopHoc?.length > 0 ? lopHoc : undefined
        }}
      />
    </Box>
  );
}
