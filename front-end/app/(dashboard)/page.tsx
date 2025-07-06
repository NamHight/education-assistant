import { useAuthStore } from '@/stores/authStore';
import React from 'react';
import ChartPieLopHocPhan from './components/ChartPieLopHocPhan';
import { Box, Grid } from '@mui/material';
import { ThongKeService } from '@/services/ThongKeService';
import ChartRankSinhVien from './components/ChartRankSinhVien';
import ChartPieThiLai from './components/ChartPieTyLeThiLai';

const page = async () => {
  const xepLoaiHocLuc = ThongKeService.getXepLoaiHocLucServer().catch(() => ({}));
  const xepHangSinhVien = ThongKeService.getXepHangSinhVienServer().catch(() => []);
  const tyLeThiLai = ThongKeService.getThongKeTyLeThiLaiTrongNamServer().catch(() => []);
  const [xepLoaiHL, xepHangSV, tyLeTL] = await Promise.all([xepLoaiHocLuc, xepHangSinhVien, tyLeThiLai]);
  const chartData = xepLoaiHL
    ? Object.entries(xepLoaiHL)?.map(([key, value]) => ({
        id: key,
        value: value,
        label: key
      }))
    : [];
      console.log('test' , chartData, xepHangSV, tyLeTL);
  return (
    <Box className="flex flex-col gap-4 w-full">
        <Box className="flex flex-wrap gap-3">
          <Box className="flex-1">
          <ChartPieLopHocPhan data={chartData?.length > 0 ? chartData : undefined} />
        </Box>
        <Box className="flex-1">
          <ChartPieThiLai data={tyLeTL?.length > 0 ? tyLeTL : undefined} />
        </Box>
        </Box>
         <Box>
          <ChartRankSinhVien data={xepHangSV?.length > 0 ? xepHangSV : undefined} />
        </Box>
    </Box>
  );
};

export default page;
