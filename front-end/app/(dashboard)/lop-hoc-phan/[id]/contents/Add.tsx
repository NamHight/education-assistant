'use client';
import { useOpenLHP, useOptionActions } from '@/stores/selectors';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { CirclePlus } from 'lucide-react';
import React from 'react';

const Add = () => {
  const openLopHocPhan = useOpenLHP();
  const actionOpenLopHocPhan = useOptionActions();
  console.log('openLopHocPhan', openLopHocPhan);
  return (
    <Box className='flex items-center gap-3'>
      <Tooltip title='Thêm' placement='right'>
        <IconButton
          className='!p-0 !border-0 hover:!bg-gray-100 hover:scale-110 hover:!text-blue-500 w-5 h-5 transition-all duration-200 ease-in-out'
          onClick={() => actionOpenLopHocPhan?.toggleLHP()}
        >
          <CirclePlus />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Add;
