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
import { HocBaService } from '@/services/HocBaService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const hocBa = HocBaService.getHocBaByIdServer(id).catch(() => undefined);
  const SinhViens = SinhVienService.getAllSinhVienServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  }).catch((error) => ({ data: [] }));
  const LopHocPhans = LopHocPhanService.getAllLopHocPhanServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999,
    trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
  }).catch((error) => ({ data: [] }));
  const ChiTietChuongTrinhDaoTaos = ChitietChuongTrinhDaoTaoService.getChitietChuongTrinhDaoTaoServer({
    sortBy: 'createdAt',
    sortByOrder: 'desc',
    limit: 99999999999
  }).catch((error) => ({ data: [] }));
  const [sinhVienData, lopHocPhanData, chiTietChuongTrinhDaoTaoData, hocBaData] = await Promise.all([
    SinhViens,
    LopHocPhans,
    ChiTietChuongTrinhDaoTaos,
    hocBa
  ]);
  return (
    <div>
      <Content
        id={id}
        initialData={hocBaData}
        anotherData={{
          sinhViens: sinhVienData?.data?.length > 0 ? sinhVienData?.data : undefined,
          lopHocPhans: lopHocPhanData?.data?.length > 0 ? lopHocPhanData?.data : undefined,
          chiTietChuongTrinhDaoTaos:
            chiTietChuongTrinhDaoTaoData?.data?.length > 0 ? chiTietChuongTrinhDaoTaoData?.data : undefined
        }}
      />
    </div>
  );
};

export default page;
