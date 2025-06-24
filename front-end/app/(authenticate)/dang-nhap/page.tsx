import React from 'react';
import Content from './components/Content';
import Image from 'next/image';
import { Paper } from '@mui/material';

const page = async () => {
  return (
    <Paper className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 max-w-md w-full mx-auto bg-white'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <Image
          width={300}
          height={100}
          className='mx-auto h-24 w-auto'
          priority
          quality={100}
          src='/assets/images/logo.png'
          alt='Cao Thắng'
        />
        <h2 className='mt-5 text-2xl/9 font-bold tracking-tight text-gray-900 text-center'>Đăng nhập</h2>
      </div>
      <Content />
    </Paper>
  );
};

export default page;
