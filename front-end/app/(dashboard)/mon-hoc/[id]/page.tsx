'use server';
import React from 'react';
import Content from './contents/Content';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const monHoc = MonHocService.getMonHocByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);
  const [monHocData, khoaData] = await Promise.all([monHoc, khoa]);
  return (
    <div>
      <Content
        id={id}
        initialData={monHocData}
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined
        }}
      />
    </div>
  );
};

export default page;
