'use client';
import { ThongKeService } from '@/services/ThongKeService';
import { Avatar, Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface IChartRankSinhVien {
  data: any[];
}
const ChartRankSinhVien = ({ data }: IChartRankSinhVien) => {
  const { data: rankData } = useQuery({
    queryKey: ['top-sinh-vien-gpa'],
    queryFn: async () => {
      const response = await ThongKeService.getXepHangSinhVien();
      return response;
    },
    initialData: data,
    refetchOnWindowFocus: false
  });
  return (
    <Box className='flex h-auto flex-col border border-gray-200 rounded-xl p-6 shadow-md bg-white w-full gap-4'>
      <Box className='flex flex-col gap-1'>
        <Typography className='!text-xl !font-bold !text-gray-800'>Top sinh viên xuất sắc</Typography>
        <Typography>
          5 sinh viên có <span className='!font-bold'>GPA</span> cao nhất!
        </Typography>
      </Box>
      <Box className='flex justify-start gap-3 items-center flex-col'>
        {rankData?.map((item: any, index: number) => (
          <Box
            key={index}
            className={clsx(
              `flex items-center justify-between w-full gap-[3px] bg-gradient-to-r px-4 py-2 rounded-xl shadow-sm border border-gray-200`,
              index === 0
                ? 'border-yellow-400 shadow-lg from-yellow-100 via-orange-50 to-white'
                : index === 1
                  ? ' border-orange-200 from-orange-50 via-yellow-100 to-white'
                  : index === 2
                    ? 'border-gray-300 from-gray-100 via-gray-300 to-white'
                    : 'border-gray-200 from-gray-50 via-gray-100 to-white'
            )}
          >
            <Box className='flex items-center gap-2 md:gap-4'>
              <Box>
                <Typography
                  className={clsx('!font-bold text-lg drop-shadow-lg')}
                  sx={(theme) => ({
                    color: index === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                    textShadow: index === 0 ? '1px 1px 2px rgba(0, 0, 0, 0.2)' : 'none'
                  })}
                >
                  {index + 1}
                </Typography>
              </Box>
              <Box className='flex items-center relative'>
                <Avatar
                  src={item.anhDaiDien}
                  className={clsx(`!w-11 !h-11 shadow border-2 border-gray-300`, {
                    [clsx('border-yellow-400')]: index === 0,
                    [clsx('border-orange-200')]: index === 1,
                    [clsx('border-gray-300')]: index === 2
                  })}
                />
                {index === 0 && (
                  <Image
                    height={30}
                    width={30}
                    src={'/assets/images/crown.png'}
                    alt='Crown'
                    priority
                    className='absolute -top-5 left-[7px] z-20'
                  />
                )}
              </Box>
              <Box className='flex flex-col justify-center ml-2'>
                <Typography className='!font-semibold !text-gray-900 !text-[13px] sm:!text-base !leading-tight'>
                  {item.hoTen}
                </Typography>
                <Typography className='!text-[11px] sm:!text-xs !text-gray-500 !mt-0.5 !tracking-wide'>
                  {item.khoa}
                </Typography>
              </Box>
            </Box>
            <Box className='flex flex-col items-end justify-center px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 shadow'>
              <Typography
                className=' !font-semibold !text-yellow-700 flex items-center gap-1'
                sx={{
                  fontSize: { xs: '12px', md: '15px' }
                }}
              >
                GPA: <span className='text-gray-900 !text-[12px] sm:!text-[15px]'>{item.gpa}</span>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChartRankSinhVien;
