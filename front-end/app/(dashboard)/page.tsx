import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import ChartPieLopHocPhan from './components/ChartPieLopHocPhan';
import { Box, Grid } from '@mui/material';

const page = () => {
  return (
    <Grid container spacing={2} className='p-4'>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
        <ChartPieLopHocPhan data={{ maHocPhan: 'MH001' }} />
      </Grid>
    </Grid>
  );
};

export default page;
