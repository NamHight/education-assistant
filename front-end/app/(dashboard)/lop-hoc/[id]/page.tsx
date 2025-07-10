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
import { GiangVienService } from '@/services/GiangVienService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const lopHocPromise = LopHocService.getLopHocByIdServer(id).catch(() => undefined);
    const khoa = KhoaService.getKhoaNoPageServer().catch(() => ( [] ));
  const [khoaData, lopHocData] = await Promise.all([khoa, lopHocPromise]);
  return (
    <div>
      <Content
        id={id}
        initialData={lopHocData}
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined,
        }}
      />
    </div>
  );
};

export default page;
