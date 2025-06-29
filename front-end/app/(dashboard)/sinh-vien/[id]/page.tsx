'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { SinhVienService } from '@/services/SinhVienService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const lopHoc = LopHocService.getAllLopHocServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const sinhVien = SinhVienService.getSinhVienByIdServer(id).catch(() => ({ data: undefined }));
  const [lopHocData, sinhVienData] = await Promise.all([lopHoc, sinhVien]);
  return (
    <div>
      <Content
        anotherData={{ lopHocs: lopHocData?.data?.length > 0 ? lopHocData?.data : undefined }}
        id={id}
        initialData={sinhVienData}
      />
    </div>
  );
};

export default page;
