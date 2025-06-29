import { Paper } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
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
      </div>
      {children}
    </Paper>
  );
};

export default layout;
