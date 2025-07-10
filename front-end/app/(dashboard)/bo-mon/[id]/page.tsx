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
  const boMon = BoMonService.getBoMonByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);

  const [boMonData, khoaData] = await Promise.all([boMon, khoa]);
  console.log('boMon', khoa);
  return (
    <div>
      <Content
        id={id}
        initialData={boMonData}
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined
        }}
      />
    </div>
  );
};

export default page;
