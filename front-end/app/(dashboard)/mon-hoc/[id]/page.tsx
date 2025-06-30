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
  const monHoc = MonHocService.getMonHocByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getAllKhoaServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const [monHocData, khoaData] = await Promise.all([monHoc, khoa]);
  return (
    <div>
      <Content
        id={id}
        initialData={monHocData}
        anotherData={{
          khoas: khoaData?.data?.length > 0 ? khoaData?.data : undefined
        }}
      />
    </div>
  );
};

export default page;
