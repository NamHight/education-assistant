import { Box } from '@mui/material';
import React, { Fragment } from 'react';
import Content from './components/contents/Content';
import ChangePassword from './components/contents/ChangePassword';
const Page = () => {
  return (
    <Box className='flex flex-col gap-2'>
      <ChangePassword />
      <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Content />
      </Box>
    </Box>
  );
};

export default Page;
