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
  const giangViensPromise = GiangVienService.danhSachGiangVienServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    active: true
  }).catch(() => ({ data: [] }));
  const nganhsPromise = NganhService.getAllNganhServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const [giangVienData, nganhData, lopHocData] = await Promise.all([giangViensPromise, nganhsPromise, lopHocPromise]);
  return (
    <div>
      <Content
        id={id}
        initialData={lopHocData}
        anotherData={{
          giangViens: giangVienData.data?.length > 0 ? giangVienData.data : undefined,
          nganhs: nganhData.data?.length > 0 ? nganhData.data : undefined
        }}
      />
    </div>
  );
};

export default page;
