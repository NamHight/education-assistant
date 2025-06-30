'use client';
import Pie from '@/components/charts/Pie';
import { ThongKeService } from '@/services/ThongKeService';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface IChartPieLopHocPhan {
  data: any;
}
const ChartPieLopHocPhan = ({ data }: IChartPieLopHocPhan) => {
  const { data: pieData } = useQuery({
    queryKey: ['xep-loai-hoc-luc'],
    queryFn: async () => {
      const response = ThongKeService.getXepLoaiHocLuc();
      return response;
    },
    initialData: data,
    refetchOnWindowFocus: false
  });
  return (
    <Box className='flex flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Typography className='!text-xl !font-bold !text-gray-800'>Xếp loại học lực</Typography>
      <Box className='flex justify-center items-center h-64'>
        <Pie data={pieData} height={250} width={250} />
      </Box>
    </Box>
  );
};

export default ChartPieLopHocPhan;
