import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import ChartPieLopHocPhan from './components/ChartPieLopHocPhan';
import { Box, Grid } from '@mui/material';
import { ThongKeService } from '@/services/ThongKeService';
import ChartRankSinhVien from './components/ChartRankSinhVien';

const page = async () => {
  const xepLoaiHocLuc = ThongKeService.getXepLoaiHocLucServer().catch(() => ({}));
  const xepHangSinhVien = ThongKeService.getXepHangSinhVienServer().catch(() => []);
  const [xepLoaiHL, xepHangSV] = await Promise.all([xepLoaiHocLuc, xepHangSinhVien]);
  const chartData = xepLoaiHL
    ? Object.entries(xepLoaiHL)?.map(([key, value]) => ({
        id: key,
        value: value,
        label: key
      }))
    : [];
  return (
    <Grid container spacing={2}>
      {chartData?.length > 0 && (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <ChartPieLopHocPhan data={chartData} />
        </Grid>
      )}
      {xepHangSV?.length > 0 && (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <ChartRankSinhVien data={xepHangSV} />
        </Grid>
      )}
    </Grid>
  );
};

export default page;
