'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import { NganhService } from '@/services/NganhService';

const page = async () => {
  const nganh = await NganhService.getAllNganhServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{
          nganhs: nganh.data?.length > 0 ? nganh.data : undefined
        }}
      />
    </Box>
  );
};

export default page;
