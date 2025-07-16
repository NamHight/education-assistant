'use server';
import React from 'react';
import Content from './contents/Content';
import { KhoaService } from '@/services/KhoaService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const khoa = await KhoaService.getKhoaByIdServer(id).catch(() => undefined);
  return (
    <div>
      <Content id={id} initialData={khoa} />
    </div>
  );
};

export default page;
