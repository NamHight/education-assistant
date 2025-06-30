import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import ChartPieLopHocPhan from './components/ChartPieLopHocPhan';
import { Box, Grid } from '@mui/material';
import { ThongKeService } from '@/services/ThongKeService';

const page = async () => {
  const xepLoaiHocLuc = await ThongKeService.getXepLoaiHocLucServer();
  const chartData = Object.entries(xepLoaiHocLuc).map(([key, value]) => ({
    id: key,
    value: value,
    label: key
  }));
  return (
    <Grid container spacing={2} className='p-4'>
      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
        <ChartPieLopHocPhan data={chartData} />
      </Grid>
    </Grid>
  );
};

export default page;
