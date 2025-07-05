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
  const lopHoc = LopHocService.getLopHocNoPageServer().catch(() => ( [] ));
  const sinhVien = SinhVienService.getSinhVienByIdServer(id).catch(() => ({ data: undefined }));
  const [lopHocData, sinhVienData] = await Promise.all([lopHoc, sinhVien]);
  return (
    <div>
      <Content
        anotherData={{ lopHocs: lopHocData?.length > 0 ? lopHocData : undefined }}
        id={id}
        initialData={sinhVienData}
      />
    </div>
  );
};

export default page;
