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
import { IParamGiangVien, IParamSinhVien } from '@/types/params';
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
      let params: IParamSinhVien = {
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
      const result = await SinhVienService.getAllSinhVien(params);
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
      const result = await SinhVienService.deleteSinhVien(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá sinh viên thành công', {
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
      const result = await SinhVienService.restoreSinhVien(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Khôi phục sinh viên thành công', {
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
        case TrangThaiSinhVienEnum.DANG_HOC:
          return <ChipOption title='Đang học' color='info' />;
        case TrangThaiSinhVienEnum.TAM_NGHI:
          return <ChipOption title='Nghỉ việc' color='warning' />;
        case TrangThaiSinhVienEnum.DA_TOT_NGHIEP:
          return <ChipOption title='Nghỉ hưu' color='success' />;
        case TrangThaiSinhVienEnum.BO_HOC:
          return <ChipOption title='Nghỉ phép' color='error' />;
        case TrangThaiSinhVienEnum.BUOC_THOI_HOC:
          return <ChipOption title='Buộc thôi học' color='error' />;
        default:
          return '';
      }
    };
    const formatGender = (status: number) => {
      switch (status) {
        case GioiTinhEnum.NAM:
          return <Typography>Nam</Typography>;
        case GioiTinhEnum.NU:
          return <Typography>Nữ</Typography>;
        case GioiTinhEnum.KHAC:
          return <Typography>Khác</Typography>;
        default:
          return '';
      }
    };
    return [
      {
        field: 'id',
        headerName: 'ID',
        type: 'string',
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
        type: 'number',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.8,
        sortable: true,
        display: 'flex',
        align: 'left',
        disableColumnMenu: true,
        valueFormatter: (params: any) => {
          return params;
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
            <Link href={`${APP_ROUTE.SINH_VIEN.EDIT(params.row?.id)}`} className='text-blue-500 hover:underline'>
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
        field: 'lopHoc',
        headerName: 'Lớp học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params?.value ? (
            <Link href={`/lop-hoc/${params.value?.id}`} className={'text-blue-500 hover:underline'}>
              {params.value?.maLopHoc}
            </Link>
          ) : null;
        }
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
        field: 'gioiTinh',
        headerName: 'Giới tính',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatGender(params);
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
        field: 'ngayNhapHoc',
        headerName: 'Ngày nhập học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 130,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        flex: 0.8,
        valueFormatter: (params: any) => {
          return formatDateBirth(params.value);
        }
      },
      {
        field: 'trangThaiSinhVien',
        headerName: 'Trạng thái',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatStatus(params.value);
        }
      },
      {
        field: 'deletedAt',
        headerName: 'Đã xóa',
        type: 'string',
        minWidth: 80,
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
      <Box className='flex justify-start gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.SINH_VIEN.ADD)} />
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
        urlNavigate='sinh-vien'
        placeholderSearch='Tìm kiếm sinh viên...'
      />
    </Box>
  );
};

export default Content;
