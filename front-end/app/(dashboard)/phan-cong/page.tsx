import React from 'react';
import Content from './contents/Content';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';

const page = async () => {
  const queryKey = 'phan-cong-list';
  let ctdt = null;
  try {
    ctdt = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
      sortBy: 'createdAt',
      sortByOrder: 'desc',
      limit: 999999
    });
  } catch (error) {
    ctdt = { data: undefined };
  }
  return (
    <PopoverLockProvider>
      <Box>
        <Content queryKey={queryKey} ctdtServer={ctdt?.data} />
      </Box>
    </PopoverLockProvider>
  );
};

export default page;
