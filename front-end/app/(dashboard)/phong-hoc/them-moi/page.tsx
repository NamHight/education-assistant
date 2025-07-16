'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';

const page = async () => {
  return (
    <Box>
      <Content />
    </Box>
  );
};

export default page;
