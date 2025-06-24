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

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const nganh = NganhService.getNganhByIdServer(id);
  const khoa = KhoaService.getAllKhoaServer();
  const [nganhData, khoaData] = await Promise.all([nganh, khoa]);
  console.log('khoa asds ', nganhData, khoaData);
  return (
    <div>
      <Content
        id={id}
        initialData={nganhData}
        anotherData={{
          khoas: khoaData?.data
        }}
      />
    </div>
  );
};

export default page;
