import React from 'react';
import { Box } from '@mui/material';
import Content from './components/Content';
import { LopHocService } from '@/services/LopHocService';
import { PopoverLockProvider } from '@/hooks/context/PopoverLock';

const page = async () => {
  const queryKey = 'lich-cong-tac-tuan-list';
  const lopHocs = LopHocService.getLopHocNoPageServer().catch(() => []);

  const [lopHocData] = await Promise.all([lopHocs]);
  return (
    <Box>
      <PopoverLockProvider>
        <Content queryKey={queryKey} lopHocServer={lopHocData?.length > 0 ? lopHocData : undefined} />
      </PopoverLockProvider>
    </Box>
  );
};

export default page;
