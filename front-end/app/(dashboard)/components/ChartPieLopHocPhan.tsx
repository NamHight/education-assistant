import Pie from '@/components/charts/Pie';
import { Box, Typography } from '@mui/material';
import React from 'react';

interface IChartPieLopHocPhan {
  data: any;
}
const ChartPieLopHocPhan = ({ data }: IChartPieLopHocPhan) => {
  return (
    <Box className='flex flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Typography className='!text-xl !font-bold !text-gray-800'>Số lượt sinh viên rớt môn</Typography>
      <Box className='flex justify-center items-center h-64'>
        <Pie
          data={[
            { id: 1, value: data?.soLuongRot || 20, label: 'Số lượng rớt' },
            { id: 2, value: data?.soLuongKhongRot || 10, label: 'Số lượng không rớt' }
          ]}
          height={250}
          width={250}
        />
      </Box>
    </Box>
  );
};

export default ChartPieLopHocPhan;
