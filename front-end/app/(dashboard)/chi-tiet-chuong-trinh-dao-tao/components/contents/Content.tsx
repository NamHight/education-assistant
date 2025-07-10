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
  IParamChiTietChuongTrinhDaoTao,
  IParamGiangVien,
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
import { LoaiChuongTrinhDaoTaoEnum, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import { LoaiMonHocEnum } from '@/models/MonHoc';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
}

const Content = ({ queryKey }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
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
    queryKey: [queryKey, paginationModel, sortModel, filterModel],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamChiTietChuongTrinhDaoTao = {
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
      const result = await ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTao(params);
      return result;
    },
    placeholderData: (prev) => prev,
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
      const result = await ChitietChuongTrinhDaoTaoService.deleteChiTietChuongTrinhDaoTao(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá chi tiết chương trình đào tạo thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá chi tiết chương trình đào tạo thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };

  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).utc().format('DD/MM/YYYY');
    };
    const formatType = (value: any) => {
      switch (value) {
        case LoaiMonHocEnum.CHUC_CHUNG_CHI:
          return <Typography variant='body2'>CCH</Typography>;
        case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
          return <Typography variant='body2'>ĐATN</Typography>;
        case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
          return <Typography variant='body2'>KLTN</Typography>;
        case LoaiMonHocEnum.KIEN_TAP:
          return <Typography variant='body2'>KT</Typography>;
        case LoaiMonHocEnum.MODUN:
          return <Typography variant='body2'>Md</Typography>;
        case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
          return <Typography variant='body2'>TTNLT</Typography>;
        case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
          return <Typography variant='body2'>TTNTH</Typography>;
        case LoaiMonHocEnum.THUC_HANH:
          return <Typography variant='body2'>TH</Typography>;
        case LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP:
          return <Typography variant='body2'>TTTN</Typography>;
        case LoaiMonHocEnum.LY_THUYET:
          return <Typography variant='body2'>LT</Typography>;
        default:
          return null;
      }
    };
    return [
      {
        field: 'id',
        headerName: 'ID',
        type: 'string',
        headerAlign: 'left',
        minWidth: 50,
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
        field: 'monHoc',
        headerName: 'Môn học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 2,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link href={`${APP_ROUTE.MON_HOC.ROOT}/${params.value?.id}`} className='text-blue-500 hover:underline'>
              {params.value?.tenMonHoc || ''}
            </Link>
          );
        }
      },
      {
        field: 'chuongTrinhDaoTao',
        headerName: 'Chương trình đào tạo',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link
              href={`${APP_ROUTE.CHUONG_TRINH_DAO_TAO.ROOT}/${params.value?.id}`}
              className='text-blue-500 hover:underline'
            >
              {params.value?.tenChuongTrinh || ''}
            </Link>
          );
        }
      },
      {
        field: 'boMon',
        headerName: 'Bộ môn',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link href={`${APP_ROUTE.BO_MON.ROOT}/${params.value?.id}`} className='text-blue-500 hover:underline'>
              {params.value?.tenBoMon || ''}
            </Link>
          );
        }
      },
      {
        field: 'soTinChi',
        headerName: 'Tín chỉ',
        headerAlign: 'left',
        type: 'number',
        minWidth: 70,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'hocKy',
        headerName: 'Học kỳ',
        headerAlign: 'left',
        type: 'number',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'loaiMonHoc',
        headerName: 'Loại',
        type: 'string',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatType(params.value);
        }
      },
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-start'>
        <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.CHI_TIET_CHUONG_TRINH_DAO_TAO.ADD)} />
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
        urlNavigate='chi-tiet-chuong-trinh-dao-tao'
        placeholderSearch='Tìm kiếm chi tiết chương trình đào tạo...'
      />
    </Box>
  );
};

export default Content;
