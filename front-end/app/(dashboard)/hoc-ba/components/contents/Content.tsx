'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, MenuItem, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import moment from 'moment';
import ChipOption from '@/components/chips/ChipOption';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@/components/buttons/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import {
  IParamBoMon,
  IParamGiangVien,
  IParamHocBa,
  IParamKhoa,
  IParamNganh,
  IParamPhongHoc,
  IParamSinhVien
} from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import EditIcon from '@mui/icons-material/Edit';
import { useNotifications } from '@toolpad/core';
import ClearIcon from '@mui/icons-material/Clear';
import RestoreIcon from '@mui/icons-material/Restore';
import { SinhVienService } from '@/services/SinhVienService';
import Link from 'next/link';
import { TrangThaiLopHocPhanEnum, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { HocBaService } from '@/services/HocBaService';
import { KetQuaHocBaEnum } from '@/models/HocBa';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocPhanService } from '@/services/LopHocPhanService';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  lopHocPhanServer?: any;
}

const Content = ({ queryKey, lopHocPhanServer }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [lopHocPhan, setlopHocPhan] = useState<string | undefined>(undefined);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [sortModel, setSortModel] = useState<Record<string, string | null | undefined>>({
    field: '',
    sort: ''
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, lopHocPhan],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamHocBa = {
        lopHocPhanId: lopHocPhan,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      };

      if (sortModel.field && sortModel.sort) {
        params.sortBy = sortModel.field;
        params.sortByOrder = sortModel.sort === 'asc' ? 'asc' : 'desc';
      }
      if (searchKeyWord) {
        params = {
          ...params,
          search: searchKeyWord
        };
      }
      const result = await HocBaService.getAllHocBa(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!lopHocPhan
  });
  const { data: lopHocPhans, isLoading: isLoadingLHP } = useQuery({
    queryKey: ['lop-hoc-phan-list'],
    queryFn: async () => {
      const response = await LopHocPhanService.getAllLopHocPhan({
        trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG,
        page: 1,
        limit: 99999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: lopHocPhanServer,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.maHocPhan
      }));
    },
    refetchOnWindowFocus: false
  });
  const rowCountRef = useRef(data?.meta?.TotalCount || 0);
  const rowCount = useMemo(() => {
    if (data?.meta?.TotalCount !== undefined) {
      rowCountRef.current = data?.meta?.TotalCount;
    }
    return rowCountRef.current;
  }, [data?.meta?.TotalCount]);
  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await HocBaService.deleteHocBa(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá học bạ thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá học bạ thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  console.log("data", data);
  const columns = useMemo((): GridColDef[] => {
    const formatKetQua = (status: number) => {
      switch (status) {
        case KetQuaHocBaEnum.DAT:
          return <ChipOption title='Đạt' color='info' />;
        case KetQuaHocBaEnum.KHONG_DAT:
          return <ChipOption title='Không đạt' color='error' />;
        default:
          return '';
      }
    };
    return [
      {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.4,
        sortable: true,
        display: 'flex',
        align: 'left',
        disableColumnMenu: true,
        valueFormatter: (params: any) => {
          return `#${params.slice(0, 2)}`;
        }
      },
      {
        field: 'mssv',
        headerName: 'MSSV',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params.row?.sinhVien?.mssv ? <Typography>{params.row?.sinhVien?.mssv}</Typography> : null;
        }
      },
      {
        field: 'sinhVien',
        headerName: 'Sinh Viên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params.value ? (
            <Link
              href={`${APP_ROUTE.SINH_VIEN.EDIT(params.row.sinhVien.id)}`}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-500'
            >
              {params.value?.hoTen}
            </Link>
          ) : null;
        }
      },
      {
        field: 'lopHocPhan',
        headerName: 'Lớp học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params.value ? (
            <Link
              href={`${APP_ROUTE.LOP_HOC_PHAN.EDIT(params.row.lopHocPhan.id)}`}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-500'
            >
              {params.value?.maHocPhan}
            </Link>
          ) : null;
        }
      },
      {
        field: 'chiTietChuongTrinhDaoTao',
        headerName: 'Chương trình đào tạo',
        headerAlign: 'left',
        type: 'number',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        renderCell: (params: any) => {
          return params.value ? (
            <Link
              href={`${APP_ROUTE.CHI_TIET_CHUONG_TRINH_DAO_TAO.EDIT(params.row.chiTietChuongTrinhDaoTao.id)}`}
              className='flex items-center gap-2 text-blue-600 hover:text-blue-500'
            >
              {params.value?.chuongTrinhDaoTao?.tenChuongTrinh}
            </Link>
          ) : null;
        }
      },
      {
        field: 'diemTongKet',
        headerName: 'Điểm tổng kết',
        type: 'number',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        headerAlign: 'left',
        flex: 1
      },
      {
        field: 'ketQua',
        headerName: 'Kết quả',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatKetQua(params.value);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-start gap-4 flex-row  border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Box className='max-w-sm w-full'>
          <InputSelect2
            fullWidth
            name={'LopHocPhan'}
            placeholder={'Chọn lớp'}
            isLoading={isLoadingLHP}
            data={lopHocPhans ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            getOnChangeValue={(value) => {
              setlopHocPhan(value?.id);
            }}
          />
        </Box>
        <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.HOC_BA.ADD)} />
      </Box>
      <Table
        ref={refTable}
        rows={data?.data}
        columns={columns}
        rowCount={rowCount}
        isFetching={isFetching}
        isLoading={isLoading}
        setFilterModel={setFilterModel}
        setSortModel={setSortModel}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        handleDeleteCallBack={handleDelete}
        customToolBar
        urlNavigate='hoc-ba'
        placeholderSearch='Tìm kiếm học bạ...'
      />
    </Box>
  );
};

export default Content;
