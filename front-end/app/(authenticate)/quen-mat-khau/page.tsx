import { Box } from '@mui/material';
import React from 'react';
import Content from './components/Content';

const page = () => {
  return (
    <Box className='flex flex-col'>
      <h2 className='mt-5 text-2xl/9 font-bold tracking-tight text-gray-900 text-center'>Quên mật khẩu</h2>
      <Content />
    </Box>
  );
};

export default page;
