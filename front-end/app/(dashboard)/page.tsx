import React from 'react';
import ChartPieLopHocPhan from './components/ChartPieLopHocPhan';
import { Box } from '@mui/material';
import { ThongKeService } from '@/services/ThongKeService';
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

  return (
    <Box className='flex flex-col gap-4 w-full'>
      <Box className='flex flex-wrap gap-3 max-h-[400px] '>
        <Box className='flex-1 h-full'>
          <ChartPieLopHocPhan data={chartData?.length > 0 ? chartData : []} />
        </Box>
        <Box className='flex-1 h-full'>
          <ChartPieThiLai data={tyLeTL?.length > 0 ? tyLeTL : []} />
        </Box>
      </Box>
    </Box>
  );
};

export default page;
