'use server';
import React from 'react';
import Content from './contents/Content';
import { NganhService } from '@/services/NganhService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const chuongTrinhDaoTao = await ChuongTrinhDaoTaoService.getChuongTrinhDaoTaoByIdServer(id).catch(() => undefined);
  const nganh = await NganhService.getAllNganhServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  })?.catch(() => ({ data: [] }));
  return (
    <div>
      <Content
        id={id}
        initialData={chuongTrinhDaoTao}
        anotherData={{
          nganhs: nganh.data?.length > 0 ? nganh.data : undefined
        }}
      />
    </div>
  );
};

export default page;
