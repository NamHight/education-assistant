import React from 'react';
import getQueryClient from '@/hooks/getQueryClient';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { Box } from '@mui/material';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import Content from './components/Content';
import { BoMonService } from '@/services/BoMonService';

const page = async () => {
  const queryKey = 'lich-cong-tac-tuan-list';
  // const giangViens = GiangVienService.danhSachGiangVienServer({
  //   sortBy: 'createdAt',
  //   sortByOrder: 'desc',
  //   limit: 99999999999,
  //   active: true
  // }).catch((error) => ({ data: [] }));
  const boMons = await BoMonService.getAllBoMonNoPageServer();
  const [boMonData] = await Promise.all([boMons]);
  return (
    <Box>
      <Content
        queryKey={queryKey}
        //giangVienServer={giangVienData?.data.length > 0 ? giangVienData.data : undefined}
        boMonServer={boMonData?.length > 0 ? boMonData : undefined}
      />
    </Box>
  );
};

export default page;
