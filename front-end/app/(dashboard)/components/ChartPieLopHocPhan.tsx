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
    <Box className='flex h-full  flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Box>
        <Typography className='!text-xl !font-bold !text-gray-800'>Xếp loại học lực</Typography>
        <Typography className='!text-sm !text-gray-600'>
          Tỷ lệ sinh viên theo từng xếp loại học lực trong học kỳ
        </Typography>
      </Box>

      <Box className='flex justify-center items-center h-full'>
        <Pie data={pieData || []} height={250} width={250} />
      </Box>
    </Box>
  );
};

export default ChartPieLopHocPhan;
