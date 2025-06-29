import { Box } from '@mui/material';
import React from 'react';
import Content from './contents/Content';

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
const page = async ({ searchParams }: Props) => {
  const search = await searchParams;
  const email = search['email'] as string | undefined;
  const token = search['token'] as string | undefined;
  console.log('searchParams', {
    email,
    token,
    search
  });
  return (
    <Box className='flex flex-col'>
      <h2 className='mt-5 text-2xl/9 font-bold tracking-tight text-gray-900 text-center'>Thay đổi mật khẩu</h2>
      <Content email={email} token={token} />
    </Box>
  );
};

export default page;
