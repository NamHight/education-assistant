'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, MenuItem, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import moment from 'moment';
import ChipOption from '@/components/chips/ChipOption';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@/components/buttons/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { IParamGiangVien, IParamKhoa, IParamMonHoc, IParamSinhVien } from '@/types/params';
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
import InputSelect2 from '@/components/selects/InputSelect2';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  khoas?: any[];
}

const Content = ({ queryKey, khoas }: ContentProps) => {
  const router = useRouter();
  const [khoaSelected, setKhoaSelected] = useState<any>(null);
  const { setTitle } = useBreadcrumb();
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
    queryKey: [queryKey, paginationModel, sortModel, filterModel, khoaSelected],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamMonHoc = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdat',
        sortByOrder: 'desc'
      };
      if (khoaSelected) {
        params.khoaId = khoaSelected;
      }
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
      const result = await MonHocService.getAllMonHoc(params);
      return result;
    },
    select: (data: any) => {
      const rows = data?.data?.map((row: any, idx: number) => ({ ...row, stt: idx + 1 }));
      return {
        ...data,
        data: rows
      };
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  const { data: khoass, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoas'],
    queryFn: async () => {
      const response = await KhoaService.getKhoaNoPage();
      return response;
    },
    initialData: khoas,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenKhoa
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
  useEffect(() => {
    setTitle('Danh sách môn học');
    return () => setTitle('');
  }, [setTitle]);
  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await MonHocService.deleteMonHoc(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá môn học thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá môn học thất bại', {
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
        field: 'stt',
        headerName: 'STT',
        type: 'number',
        headerAlign: 'center',
        minWidth: 50,
        flex: 0.4,
        sortable: false,
        display: 'flex',
        align: 'center',
        disableColumnMenu: true,
        renderCell: (params) => {
          return <Typography variant='body2'>{params.row?.stt}</Typography>;
        }
      },
      {
        field: 'tenMonHoc',
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
            <Link href={`${APP_ROUTE.MON_HOC.EDIT(params.row?.id)}`} className='text-blue-500 hover:underline'>
              {params.value}
            </Link>
          ) : (
            <span>{params.value}</span>
          );
        }
      },
      {
        field: 'maMonHoc',
        headerName: 'Mã môn học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
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
      <Box className='flex justify-end gap-4 border border-gray-200 rounded-lg p-4 shadow-sm '>
        <Box className='flex w-full items-center gap-2'>
          <Box className='flex items-center gap-2 w-1/2 justify-start'>
            <Typography className='!font-semibold !text-lg'> khoa</Typography>
            <InputSelect2
              fullWidth
              name={'Khoa'}
              placeholder={'Chọn khoa'}
              isLoading={isLoadingKhoa}
              data={khoass ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              getOnChangeValue={(value) => {
                setKhoaSelected(value?.id);
              }}
            />
          </Box>
        </Box>
        <Box className='flex items-center gap-2 w-1/3 justify-end'>
          <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.MON_HOC.ADD)} />
        </Box>
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
        urlNavigate='mon-hoc'
        placeholderSearch='Tìm kiếm môn học...'
      />
    </Box>
  );
};

export default Content;
