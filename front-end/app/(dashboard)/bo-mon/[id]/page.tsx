'use server';
import React from 'react';
import Content from './contents/Content';
import { KhoaService } from '@/services/KhoaService';
import { BoMonService } from '@/services/BoMonService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const boMon = BoMonService.getBoMonByIdServer(id).catch(() => undefined);
  const khoa = KhoaService.getKhoaNoPageServer().catch(() => []);
  const [boMonData, khoaData] = await Promise.all([boMon, khoa]);
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
