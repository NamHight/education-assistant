'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';

const page = async () => {
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content />
    </Box>
  );
};

export default page;
