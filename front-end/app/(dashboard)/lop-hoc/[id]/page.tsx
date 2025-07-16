'use server';
import React from 'react';
import Content from './contents/Content';
import { LopHocService } from '@/services/LopHocService';
import { KhoaService } from '@/services/KhoaService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const lopHocPromise = LopHocService.getLopHocByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);
  const [khoaData, lopHocData] = await Promise.all([khoa, lopHocPromise]);
  return (
    <div>
      <Content
        id={id}
        initialData={lopHocData}
        anotherData={{
          khoas: khoaData?.length > 0 ? khoaData : undefined
        }}
      />
    </div>
  );
};

export default page;
