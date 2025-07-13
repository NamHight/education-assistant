'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { SinhVienService } from '@/services/SinhVienService';
import { Box } from '@mui/material';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const lopHoc = LopHocService.getLopHocNoPageServer().catch(() => []);
  const sinhVien = SinhVienService.getSinhVienByIdServer(id).catch(() => undefined);
  const [lopHocData, sinhVienData] = await Promise.all([lopHoc, sinhVien]);
  return (
    <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Content
        anotherData={{ lopHocs: lopHocData?.length > 0 ? lopHocData : undefined }}
        id={id}
        initialData={sinhVienData}
      />
    </Box>
  );
};

export default page;
