'use server';
import React from 'react';
import Content from './contents/Content';
import { KhoaService } from '@/services/KhoaService';
import { NganhService } from '@/services/NganhService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const nganh = NganhService.getNganhByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);
  const [nganhData, khoaData] = await Promise.all([nganh, khoa]);
  return (
    <div>
      <Content
        id={id}
        initialData={nganhData}
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined
        }}
      />
    </div>
  );
};

export default page;
