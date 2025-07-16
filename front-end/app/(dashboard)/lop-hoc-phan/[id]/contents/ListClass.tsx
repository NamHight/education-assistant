'use client';
import ChipOption from '@/components/chips/ChipOption';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { handleTextSearch } from '@/lib/string';
import { TinhTrangHocTapSinhVienEnum, TrangThaiSinhVienEnum } from '@/models/SinhVien';
import { SinhVienService } from '@/services/SinhVienService';
import { IParamSinhVien } from '@/types/params';
import { Box, Link, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { APP_ROUTE } from '@/types/general';
import moment from 'moment';
import dynamic from 'next/dynamic';

const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface IListtClassProps {
  id: string | number | null;
  queryKey: string;
}

const ListClass = ({ id, queryKey }: IListtClassProps) => {
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
    queryKey: [queryKey, id, paginationModel, sortModel, filterModel],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamSinhVien = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        lopHocPhanId: id as any
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
      const result = await SinhVienService.getAllSinhVienByLopHocPhan(params);
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
    mutationFn: async (idSV: string | number | null) => {
      const result = await SinhVienService.deleteSinhVienByLHP(idSV, { lopHocPhanId: id });
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
        case TrangThaiSinhVienEnum.DANG_HOC:
          return <ChipOption title='Đang học' color='info' />;
        case TrangThaiSinhVienEnum.DA_TOT_NGHIEP:
          return <ChipOption title='Đã tốt nghiệp' color='success' />;
        case TrangThaiSinhVienEnum.BO_HOC:
          return <ChipOption title='Bỏ học' color='error' />;
        case TrangThaiSinhVienEnum.BUOC_THOI_HOC:
          return <ChipOption title='Buộc thôi học' color='error' />;
        default:
          return '';
      }
    };
    const formatTinhTrang = (status: number) => {
      switch (status) {
        case TinhTrangHocTapSinhVienEnum.YEU:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-red-400 !bg-red-50 !text-red-600 !font-semibold !text-xs !shadow-sm'>
              Yếu
            </Typography>
          );
        case TinhTrangHocTapSinhVienEnum.TRUNG_BINH:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-yellow-400 !bg-yellow-50 !text-yellow-700 !font-semibold !text-xs !shadow-sm'>
              Trung bình
            </Typography>
          );
        case TinhTrangHocTapSinhVienEnum.KHA:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-blue-400 !bg-blue-50 !text-blue-700 !font-semibold !text-xs !shadow-sm'>
              Khá
            </Typography>
          );
        case TinhTrangHocTapSinhVienEnum.GIOI:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-green-400 !bg-green-50 !text-green-700 !font-semibold !text-xs !shadow-sm'>
              Giỏi
            </Typography>
          );
        case TinhTrangHocTapSinhVienEnum.XUAT_SAC:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-teal-400 !bg-teal-50 !text-teal-700 !font-semibold !text-xs !shadow-sm'>
              Xuất sắc
            </Typography>
          );
        case TinhTrangHocTapSinhVienEnum.DINH_CHI:
          return (
            <Typography className='!px-3 !py-1 !rounded-full !border !border-red-400 !bg-red-100 !text-red-700 !font-semibold !text-xs !shadow-sm'>
              Đình chỉ
            </Typography>
          );
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
        field: 'anhDaiDien',
        headerName: 'Ảnh đại diện',
        headerAlign: 'left',
        minWidth: 100,
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        align: 'center',
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return (
            params.value && (
              <ToolTipImage
                title={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className='bg-white rounded-full flex justify-center items-center border-2 border-blue-300 shadow-lg p-2'
                  >
                    <Image
                      src={params?.value || '/'}
                      alt={params?.row?.hoTen}
                      height={100}
                      width={100}
                      className='object-cover rounded-full border-2 border-blue-400'
                    />
                  </motion.div>
                }
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className='flex items-center justify-start'
                >
                  <Image
                    src={params.value || '/'}
                    alt={params?.row?.hoTen}
                    height={50}
                    width={50}
                    className='object-cover rounded-full h-[50px] w-[50px] border-2 border-blue-300 shadow'
                  />
                </motion.div>
              </ToolTipImage>
            )
          );
          return params;
        }
      },
      {
        field: 'mssv',
        headerName: 'MSSV',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 1,
        sortable: true,
        display: 'flex',
        align: 'left',
        disableColumnMenu: true
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
            <Link href={`${APP_ROUTE.SINH_VIEN.EDIT(params.row?.id)}`} className='!text-blue-500 hover:!underline'>
              {params.value}
            </Link>
          ) : (
            <span>{params.value}</span>
          );
        }
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
            <Link href={`/lop-hoc/${params.value?.id}`} className={'!text-blue-500 hover:!underline'}>
              {params.value?.maLopHoc}
            </Link>
          ) : null;
        }
      },
      {
        field: 'soDienThoai',
        headerName: 'Số điện thoại',
        headerAlign: 'left',
        type: 'number',
        minWidth: 100,
        align: 'left',
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1
      },
      {
        field: 'ngaySinh',
        headerName: 'Ngày sinh',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params.value ? formatDateBirth(params.value) : null;
        }
      },
      {
        field: 'tinhTrangHocTap',
        headerName: 'Tình Trạng',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatTinhTrang(params.value);
        }
      },
      {
        field: 'trangThaiSinhVien',
        headerName: 'Trạng thái',
        type: 'string',
        minWidth: 120,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatStatus(params.value);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box>
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
        isDisableEdit
        urlNavigate='sinh-vien'
        placeholderSearch='Tìm kiếm sinh viên...'
      />
    </Box>
  );
};

export default ListClass;
