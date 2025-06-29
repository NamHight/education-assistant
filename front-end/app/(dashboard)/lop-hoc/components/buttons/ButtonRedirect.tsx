'use client';
import Button from '@/components/buttons/Button';
import { APP_ROUTE } from '@/types/general';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

const ButtonRedirect = () => {
  const router = useRouter();
  return (
    <Box className='flex justify-start gap-2'>
      <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.LOP_HOC.ADD)} />
    </Box>
  );
};

export default ButtonRedirect;
