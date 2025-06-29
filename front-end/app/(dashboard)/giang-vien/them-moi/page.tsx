'use server';
import React from 'react';
import Content from './components/Content';
import { Box } from '@mui/material';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';

const page = async () => {
  const khoa = authApiServer
    .get(`${API.KHOA.GET_ALL}`, {
      params: {
        limit: 99999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }
    })
    .catch(() => ({ data: [] }));
  const boMon = authApiServer
    .get(`${API.BO_MON.GET_ALL}`, {
      params: {
        limit: 99999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }
    })
    .catch(() => ({ data: [] }));
  const [khoaData, boMonData] = await Promise.all([khoa, boMon]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        khoas={khoaData?.data?.length > 0 ? khoaData.data : undefined}
        boMons={boMonData?.data?.length > 0 ? boMonData.data : undefined}
      />
    </Box>
  );
};

export default page;
