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
import { IParamGiangVien } from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import EditIcon from '@mui/icons-material/Edit';
import { useNotifications } from '@toolpad/core';
import ClearIcon from '@mui/icons-material/Clear';
import RestoreIcon from '@mui/icons-material/Restore';
import Link from 'next/link';
import ButtonRedirect from '../buttons/ButtonRedirect';
import { clsx as cn } from 'clsx';
import InputSelect2 from '@/components/selects/InputSelect2';
import { KhoaService } from '@/services/KhoaService';
import { BoMonService } from '@/services/BoMonService';
import { Funnel } from 'lucide-react';
import { TrangThaiGiangVien } from '@/types/options';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  khoaData: any;
  boMonData: any;
}

const Content = ({ queryKey, khoaData, boMonData }: ContentProps) => {
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
  const [filterOption, setFilterOption] = useState<{
    khoa?: { id: string; name: string };
    trangThai?: { id: string; name: string };
  } | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, filterOption],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamGiangVien = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      };
      if (filterOption?.khoa) {
        params = {
          ...params,
          khoaId: filterOption?.khoa?.id
        };
      }
      if (filterOption?.trangThai) {
        params = {
          ...params,
          trangThai: Number(filterOption?.trangThai?.id)
        };
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
      const result = await GiangVienService.danhSachGiangVien(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  const { data: khoas, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoa-list'],
    queryFn: async () => {
      const result = await KhoaService.getAllKhoa({
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        limit: 99999999999
      });
      return result?.data;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.tenKhoa
      }));
    },
    initialData: khoaData,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  const { data: boMons, isLoading: isLoadingBoMon } = useQuery({
    queryKey: ['bo-mon-list'],
    queryFn: async () => {
      const result = await BoMonService.getAllBoMonNoPage();
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.tenBoMon
      }));
    },
    initialData: khoaData,
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
      const result = await GiangVienService.deleteGiangVien(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá giảng viên thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.message || 'Xoá giảng viên thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const mutationRestore = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await GiangVienService.restoreGiangVien(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Khôi phục giảng viên thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.message || 'Khôi phục giảng viên thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  const handleRestore = (id: string | number | null) => {
    mutationRestore.mutate(id);
  };
  const moreActions = useCallback((id: string | number | null, row: any) => {
    return (
      <MenuItem
        disabled={!row?.deletedAt}
        onClick={() => {
          handleRestore(id);
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <RestoreIcon sx={{ color: 'green' }} />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Khôi phục
        </Typography>
      </MenuItem>
    );
  }, []);
  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).format('DD/MM/YYYY');
    };
    const formatStatus = (status: number) => {
      switch (status) {
        case 1:
          return <ChipOption title='Đang công tác' color='success' />;
        case 2:
          return <ChipOption title='Nghỉ việc' color='error' />;
        case 3:
          return <ChipOption title='Nghỉ hưu' color='warning' />;
        case 4:
          return <ChipOption title='Nghỉ phép' color='default' />;
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
        field: 'anhDaiDien',
        headerName: 'Ảnh đại diện',
        headerAlign: 'left',
        minWidth: 140,
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        align: 'center',
        display: 'flex',
        flex: 0.5,
        renderCell: (params: any) => {
          return (
            params.value && (
              <ToolTipImage
                title={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className={'bg-white rounded-full flex justify-center items-center'}
                  >
                    <Image
                      src={params?.value || '/'}
                      alt={params?.row?.hoTen}
                      height={100}
                      width={100}
                      className={'object-cover rounded-md'}
                    />
                  </motion.div>
                }
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className={'flex items-center justify-center'}
                >
                  <Image
                    src={params.value || '/'}
                    alt={params?.row?.hoTen}
                    height={50}
                    width={50}
                    className={'object-contain rounded-full h-[50px] w-[50px]'}
                  />
                </motion.div>
              </ToolTipImage>
            )
          );
        }
      },
      {
        field: 'hoTen',
        headerName: 'Họ và tên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return !params.row?.deletedAt ? (
            <Link href={`${APP_ROUTE.GIANG_VIEN.EDIT(params.row?.id)}`} className='text-blue-500 hover:underline'>
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
        field: 'ngaySinh',
        headerName: 'Ngày sinh',
        headerAlign: 'left',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        valueFormatter: (params: any) => {
          return formatDateBirth(params);
        }
      },
      {
        field: 'soDienThoai',
        headerName: 'Số điện thoại',
        headerAlign: 'left',
        type: 'number',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
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
      },
      {
        field: 'deletedAt',
        headerName: 'Đã xóa',
        type: 'string',
        minWidth: 60,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        flex: 0.5,
        renderCell: (params: any) => {
          return params.value ? <ClearIcon className='text-red-500' /> : '';
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex gap-4'>
        <Box className={cn('flex flex-[5] border border-gray-200 rounded-lg p-4 shadow-sm gap-4 ')}>
          <Box>
            <ButtonRedirect />
          </Box>
        </Box>
        <Box className={cn('flex flex-col flex-[5] border border-gray-200 rounded-lg p-4 shadow-sm gap-4 ')}>
          <Box className='flex items-center gap-2'>
            <Funnel className='h-5 w-5' />
            <Typography className='!text-[16px] !font-semibold'>Lọc </Typography>
          </Box>
          <Box className='flex gap-3'>
            <Box className='flex-2 gap-1 flex flex-col'>
              <Typography className='!font-semibold'>Khoa</Typography>
              <InputSelect2
                fullWidth
                name={'khoas'}
                placeholder={'Chọn khóa'}
                data={khoas ?? []}
                isLoading={isLoadingKhoa}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => {
                  setFilterOption((prev: any) => ({
                    ...prev,
                    khoa: {
                      id: value?.id,
                      name: value?.name
                    }
                  }));
                }}
              />
            </Box>
            <Box className='flex-2 gap-1 flex flex-col'>
              <Typography className='!font-semibold'>Trạng thái</Typography>
              <InputSelect2
                fullWidth
                name={'trangThai'}
                placeholder={'Chọn trạng thái'}
                data={TrangThaiGiangVien ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => {
                  setFilterOption((prev: any) => ({
                    ...prev,
                    trangThai: {
                      id: value?.id,
                      name: value?.name
                    }
                  }));
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Table
        ref={refTable}
        moreActions={moreActions}
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
        urlNavigate='giang-vien'
        placeholderSearch='Tìm kiếm giảng viên...'
      />
    </Box>
  );
};

export default Content;
