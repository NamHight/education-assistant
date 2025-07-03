import React from 'react';
import { Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

const ButtonBack = () => {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.back()}
      className={`flex justify-center items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 px-3 sm:px-4 cursor-pointer border-0 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <ArrowBackIcon className={'sm:!text-[22px] !text-[20px]'} />
      <Typography
        variant={'body1'}
        className={'sm:text-[18px] text-[13px] items-center flex justify-center font-bold tracking-wide text-white'}
      >
        Trở về
      </Typography>
    </motion.button>
  );
};

export default ButtonBack;
