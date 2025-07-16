'use server';
import React from 'react';
import Content from './contents/Content';
import { PhongHocService } from '@/services/PhongHocService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const phongHoc = await PhongHocService.getPhongHocByIdServer(id).catch(() => undefined);
  return (
    <div>
      <Content id={id} initialData={phongHoc} />
    </div>
  );
};

export default page;
