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

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const boMon = BoMonService.getBoMonByIdServer(id);
  const khoa = KhoaService.getAllKhoaServer();
  const [boMonData, khoaData] = await Promise.all([boMon, khoa]);
  console.log('khoa asds ', boMonData, khoaData);
  return (
    <div>
      <Content
        id={id}
        initialData={boMonData}
        anotherData={{
          khoas: khoaData?.data
        }}
      />
    </div>
  );
};

export default page;
