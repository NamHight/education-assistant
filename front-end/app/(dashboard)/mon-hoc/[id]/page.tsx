'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { LopHocService } from '@/services/LopHocService';
import { SinhVienService } from '@/services/SinhVienService';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const monHoc = MonHocService.getMonHocByIdServer(id);
  const khoa = KhoaService.getAllKhoaServer();
  const [monHocData, khoaData] = await Promise.all([monHoc, khoa]);
  console.log('khoa asds ', monHocData, khoaData);
  return (
    <div>
      <Content
        id={id}
        initialData={monHocData}
        anotherData={{
          khoas: khoaData?.data
        }}
      />
    </div>
  );
};

export default page;
