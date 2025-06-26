'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box } from '@mui/material';
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
import { IParamGiangVien, IParamLopHocPhan } from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import EditIcon from '@mui/icons-material/Edit';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { useNotifications } from '@toolpad/core';
import Link from 'next/link';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
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
      let params: IParamLopHocPhan = {
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
      const result = await LopHocPhanService.getAllLopHocPhan(params);
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
      const result = await LopHocPhanService.deleteLopHocPhan(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá lớp học phần thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá lớp học phần thất bại', {
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
      return moment(date).format('DD/MM/YYYY');
    };
    const formatStatus = (status: number) => {
      switch (status) {
        case TrangThaiLopHocPhanEnum.DANG_HOAT_DONG:
          return <ChipOption title='Đang hoạt động' color='success' />;
        case TrangThaiLopHocPhanEnum.KHONG_HOAT_DONG:
          return <ChipOption title='Không hoạt động' color='error' />;
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
        field: 'maHocPhan',
        headerName: 'Mã học phần',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.8,
        sortable: true,
        display: 'flex',
        align: 'left',
        disableColumnMenu: true,
        valueFormatter: (value: any) => {
          return value ? value : '';
        }
      },
      {
        field: 'giangVien',
        headerName: 'Tên giản viên',
        headerAlign: 'left',
        minWidth: 140,
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        align: 'left',
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params?.value ? (
            <Link href={`/giang-vien/${params.value?.id}`} className={'text-blue-500 hover:underline'}>
              {params.value?.hoTen}
            </Link>
          ) : null;
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
        flex: 1,
        renderCell: (params: any) => {
          return params?.value ? (
            <Link className={'text-blue-500 hover:underline'} href={`/mon-hoc/${params.value?.id}`}>
              {params.value?.tenMonHoc}
            </Link>
          ) : null;
        }
      },
      {
        field: 'siSo',
        headerName: 'Sỉ số',
        headerAlign: 'left',
        type: 'number',
        align: 'left',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.5,
        valueFormatter: (value: any) => {
          return value ? value : 0;
        }
      },
      {
        field: 'createdAt',
        headerName: 'Ngày tạo',
        headerAlign: 'left',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        flex: 0.8,
        valueFormatter: (params: any) => {
          return formatDateBirth(params);
        }
      },
      {
        field: 'trangThai',
        headerName: 'Trạng thái',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatStatus(params.value);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-start gap-4'>
        <Button title={'Thêm mới học phần'} onClick={() => router.push(APP_ROUTE.LOP_HOC_PHAN.ADD)} />
        <Button title={'Thêm mới học kỳ phụ'} onClick={() => router.push(APP_ROUTE.LOP_HOC_PHAN.ADD_HOC_KY_PHU)} />
      </Box>
      <Table
        ref={refTable}
        rows={data?.data || []}
        columns={columns}
        rowCount={rowCount}
        isFetching={isFetching}
        isLoading={isLoading}
        setFilterModel={setFilterModel}
        setSortModel={setSortModel}
        setPaginationModel={setPaginationModel}
        paginationModel={paginationModel}
        customToolBar
        urlNavigate='lop-hoc-phan'
        handleDeleteCallBack={handleDelete}
        placeholderSearch='Tìm kiếm mã lớp học phần...'
      />
    </Box>
  );
};

export default Content;
