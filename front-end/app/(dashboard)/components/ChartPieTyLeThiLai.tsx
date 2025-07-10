'use client';
import Pie from '@/components/charts/Pie';
import InputSelect2 from '@/components/selects/InputSelect2';
import { ThongKeService } from '@/services/ThongKeService';
import { yearOptions, yearOptionsCurrent } from '@/types/options';
import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { useQuery } from '@tanstack/react-query';
import React, { use, useMemo } from 'react';
import { useForm } from 'react-hook-form';

interface IChartPieThiLai {
  data: any;
}
const ChartPieThiLai = ({ data }: IChartPieThiLai) => {
  const { control, watch } = useForm({
    defaultValues: {
      nam: yearOptionsCurrent?.[yearOptionsCurrent.length - 1] ?? null
    }
  });
  const nam = watch('nam');
  const { data: chartData } = useQuery({
    queryKey: ['ty-le-thi-lai-trong-nam', nam],
    queryFn: async () => {
      const response = ThongKeService.getThongKeTyLeThiLaiTrongNam(Number(nam.id));
      return response;
    },
    initialData: nam ? undefined : data,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });

  const pieData = useMemo(() => {
    return Array.isArray(chartData)
      ? chartData?.map((item: any) => ({
          id: item.key,
          value: item.value,
          label: item.label,
          color: item.label === 'Không thi lại' ? '#4CAF50' : '#FF5722'
        }))
      : [];
  }, [chartData]);

  return (
    <Box className='flex h-full flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Box className='flex justify-between'>
        <Box>
          <Typography className='!text-xl !font-bold !text-gray-800'>Thống kê thi lại trong năm</Typography>
          <Typography className='!text-sm !text-gray-600'>Tỷ lệ thi lại của sinh viên trong năm học</Typography>
        </Box>
        <Box className='w-1/3'>
          <InputSelect2
            fullWidth
            name={'nam'}
            control={control}
            placeholder={'Chọn năm'}
            data={yearOptionsCurrent ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            getOnChangeValue={(value) => {}}
          />
        </Box>
      </Box>
      <Box className='flex justify-center items-center h-auto'>
        <PieChart
          height={250}
          width={250}
          series={[
            {
              arcLabel: (item) => '', // Ẩn value trên chart
              data: pieData,
              innerRadius: 60,
              outerRadius: 120,
              paddingAngle: 2,
              cornerRadius: 5,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
            }
          ]}
          slotProps={{
            legend: {
              direction: 'vertical',
              position: { vertical: 'middle', horizontal: 'end' }
            }
          }}
        />
      </Box>
      <Box className='flex justify-center mt-2'>
        {pieData.map((item) => (
          <Box key={item.id} className='flex items-center mr-4'>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: item.color,
                mr: 1
              }}
            />
            <Typography variant='body2' sx={{ color: '#333', fontWeight: 500 }}>
              {item.label}: {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChartPieThiLai;
