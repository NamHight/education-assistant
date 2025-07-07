'use client';
import Pie from '@/components/charts/Pie';
import { ThongKeService } from '@/services/ThongKeService';
import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import React, { use, useMemo } from 'react';

interface IChartPieThiLai {
  data: any;
}
const ChartPieThiLai = ({ data }: IChartPieThiLai) => {
  const { data: chartData } = useQuery({
    queryKey: ['ty-le-thi-lai-trong-nam'],
    queryFn: async () => {
      const response = ThongKeService.getThongKeTyLeThiLaiTrongNam();
      return response;
    },
    initialData: data,
    refetchOnWindowFocus: false
  });
 
    const pieData = useMemo(() => {

      return Array.isArray(chartData) ?  chartData?.map((item: any) => ({
    id: item.key,
    value: item.value,
    label: item.label,
    color: item.label === 'Không thi lại' ? '#4CAF50' : '#FF5722'
  })) : []
    },[chartData]);
  return (
    <Box className='flex h-auto flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Typography className='!text-xl !font-bold !text-gray-800'>Thống kê thi lại trong năm</Typography>
      <Box className='flex justify-center items-center h-auto'>
        <PieChart
        height={250} width={250}
        series={[
          {
             arcLabel: (item) => `${item.value}`,
            data: pieData,
            innerRadius: 60, // ✅ Tạo doughnut effect
            outerRadius: 120,
            paddingAngle: 2,
            cornerRadius: 5,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { vertical: 'middle', horizontal: 'end' }
          },
        }}
      />
      </Box>
    </Box>
  );
};

export default ChartPieThiLai;
