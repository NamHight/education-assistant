'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { MonHocService } from '@/services/MonHocService';
import { GiangVienService } from '@/services/GiangVienService';
import { LopHocService } from '@/services/LopHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { LopHocPhanService } from '@/services/LopHocPhanService';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const initialData = await LopHocPhanService.getLopHocPhanByIdServer(id);
  const monHoc = MonHocService.getAllMonHocServer();
  const giangVien = GiangVienService.danhSachGiangVienServer({ active: true });
  const [monHocData, gianVienData] = await Promise.all([monHoc, giangVien]);
  return (
    <div>
      <Content
        anotherData={{
          monHocs: monHocData,
          giangViens: gianVienData?.data
        }}
        id={id}
        initialData={initialData}
      />
    </div>
  );
};

export default page;
