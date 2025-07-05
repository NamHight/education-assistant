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
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const chiTietChuongTrinhDaoTao = ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTaoByIdServer(id).catch(
    () => undefined
  );
  const boMon = authApiServer
    .get(`${API.BO_MON.GET_ALL}`, {
      params: {
        limit: 99999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      }
    })
    .catch(() => ({ data: [] }));
  const chuongTrinhDaoTao = ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTaoServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const monHoc = MonHocService.getAllMonHocServer({
    limit: 99999999999,
    sortBy: 'createdAt',
    sortByOrder: 'desc'
  }).catch(() => ({ data: [] }));
  const [boMonData, chuongTrinhDaoTaoData, monHocData, chiTietChuongTrinhDaoTaoData] = await Promise.all([
    boMon,
    chuongTrinhDaoTao,
    monHoc,
    chiTietChuongTrinhDaoTao
  ]);
  console.log('Chi tiết chương trình đào tạo:', chiTietChuongTrinhDaoTaoData);
  return (
    <div>
      <Content
        id={id}
        initialData={chiTietChuongTrinhDaoTaoData}
        anotherData={{
          boMons: boMonData.data?.length > 0 ? boMonData.data : undefined,
          chuongTrinhDaoTaos: chuongTrinhDaoTaoData.data?.length > 0 ? chuongTrinhDaoTaoData.data : undefined,
          monHocs: monHocData.data?.length > 0 ? monHocData.data : undefined
        }}
      />
    </div>
  );
};

export default page;
