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
import { IParamBoMon, IParamGiangVien, IParamKhoa, IParamNganh, IParamSinhVien } from '@/types/params';
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
import { TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
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
      let params: IParamBoMon = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdat',
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
      const result = await BoMonService.getAllBoMon(params);
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
      const result = await BoMonService.deleteBoMon(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá bộ môn thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá bộ môn thất bại', {
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
        field: 'tenBoMon',
        headerName: 'Tên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params) => {
          return !params.row?.deletedAt ? (
            <Link href={`${APP_ROUTE.BO_MON.EDIT(params.row?.id)}`} className='text-blue-500 hover:underline'>
              {params.value}
            </Link>
          ) : (
            <span>{params.value}</span>
          );
        }
      },
      {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1
      },
      {
        field: 'soDienThoai',
        headerName: 'Số điện thoại',
        headerAlign: 'left',
        type: 'number',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'khoa',
        headerName: 'Khoa',
        headerAlign: 'left',
        type: 'string',
        minWidth: 130,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params) => {
          return !params.value ? null : (
            <Link
              href={`${APP_ROUTE.KHOA.ROOT}/${params.value.id}`}
              className='flex items-center gap-2 text-blue-500 hover:text-blue-700 hover:underline'
            >
              <Typography variant='body2'>{params.value.tenKhoa}</Typography>
            </Link>
          );
        }
      },
      {
        field: 'createdAt',
        headerName: 'Ngày tạo',
        headerAlign: 'left',
        type: 'string',
        minWidth: 130,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        flex: 1,
        valueFormatter: (params: any) => {
          return formatDateBirth(params);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-start gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.BO_MON.ADD)} />
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
        urlNavigate='bo-mon'
        placeholderSearch='Tìm kiếm bộ môn...'
      />
    </Box>
  );
};

export default Content;
