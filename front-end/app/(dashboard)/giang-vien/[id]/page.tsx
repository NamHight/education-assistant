'use server';
import React from 'react';
import Content from './contents/Content';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IPageProps) => {
  const { id } = await params;
  const khoa = authApiServer.get(`${API.KHOA.GET_ALL}`, {
    params: {
      limit: 99999999999,
      sortBy: 'createdAt',
      sortByOrder: 'desc'
    }
  });
  const boMon = authApiServer.get(`${API.BO_MON.GET_ALL}`, {
    params: {
      limit: 99999999999,
      sortBy: 'createdAt',
      sortByOrder: 'desc'
    }
  });
  const giangVien = authApiServer.get(`${API.GIANG_VIEN.GET_ONE}`.replace(':id', id));
  const [khoaData, boMonData, initialData] = await Promise.all([khoa, boMon, giangVien]);

  return (
    <div>
      <Content
        anotherData={{ Khoas: khoaData?.data, BoMons: boMonData?.data }}
        id={id}
        initialData={initialData?.data}
      />
    </div>
  );
};

export default page;
