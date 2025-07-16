'use client';
import React, { useEffect } from 'react';
import AddTuan from './components/AddTuan';
import { Box } from '@mui/material';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';

const page = () => {
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    setTitle('Cài đặt');
    return () => setTitle('');
  }, []);
  return (
    <Box className='flex flex-col gap-3'>
      <AddTuan />
    </Box>
  );
};

export default page;
