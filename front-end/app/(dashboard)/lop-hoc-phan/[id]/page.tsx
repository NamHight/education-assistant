'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { GiangVienService } from '@/services/GiangVienService';
import { Box, Divider, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import ListClass from './contents/ListClass';
import getQueryClient from '@/hooks/getQueryClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Add from './contents/Add';
import Search from './contents/Search';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const query = 'sinh-vien-lop-hoc-phan-list';
  const initQuery = 'lop-hoc-phan';
  await queryClient.prefetchQuery({
    queryKey: [initQuery, { id: id }],
    queryFn: async () => await LopHocPhanService.getLopHocPhanByIdServer(id).catch(() => undefined)
  });
  await queryClient.prefetchQuery({
    queryKey: [query, id, { page: 0, pageSize: 10 }, { field: '', sort: '' }, { items: [] }],
    queryFn: async () => {
      const result = await SinhVienService.getAllSinhVienByLopHocPhanServer({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        lopHocPhanId: id
      }).catch(() => undefined);
      return result;
    }
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <div className='flex flex-col gap-4'>
      <HydrationBoundary state={dehydratedState}>
        <Content id={id} query={initQuery} />
      </HydrationBoundary>
      <Divider />
      <Box className='flex flex-col gap-3'>
        <Box className='flex gap-2 justify-start items-center'>
          <Typography className='!text-xl !font-semibold'>Danh sách hiện tại sinh viên lớp học phần</Typography>
          <Add />
        </Box>
        <Search id={id} query={query} />
        <HydrationBoundary state={dehydratedState}>
          <ListClass id={id} queryKey={query} />
        </HydrationBoundary>
      </Box>
    </div>
  );
};

export default page;
