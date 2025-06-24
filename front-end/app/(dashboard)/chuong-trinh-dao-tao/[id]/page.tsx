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
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const chuongTrinhDaoTao = await ChuongTrinhDaoTaoService.getChuongTrinhDaoTaoByIdServer(id);
  const nganh = await NganhService.getAllNganhServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  });
  return (
    <div>
      <Content
        id={id}
        initialData={chuongTrinhDaoTao}
        anotherData={{
          nganhs: nganh.data || []
        }}
      />
    </div>
  );
};

export default page;
