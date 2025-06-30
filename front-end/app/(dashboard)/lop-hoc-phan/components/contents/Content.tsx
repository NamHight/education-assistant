'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Typography } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { IOption, LoaiLopHocEnum, TrangThaiLopHocPhan } from '@/types/options';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import Input2 from '@/components/inputs/Input2';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import InputSelect2 from '@/components/selects/InputSelect2';
import { MonHocService } from '@/services/MonHocService';
import EditModal from '../modals/EditModal';
import AddModal from '../modals/AddModal';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
}

const Content = ({ queryKey }: ContentProps) => {
  const router = useRouter();
  const [getId, setGetId] = useState<string | null>(null);

  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const notification = useNotifications();
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
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

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
  const mutationChangeStatus = useMutation({
    mutationFn: async ({ id, data }: { id: string | number | null; data: any }) => {
      const formData = new FormData();
      formData.append('trangThai', data.trangThai.toString());
      const result = await LopHocPhanService.changeStatusLopHocPhan(id, formData);
      return result;
    },
    onSuccess: () => {
      notification.show('Thay đổi trạng thái thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Thay đổi trạng thái thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  const handleChangeStatus = (id: string | number | null, trangThai: number) => {
    mutationChangeStatus.mutate({ id, data: { trangThai: trangThai } });
  };

  const moreActions = useCallback((id: string | number | null, row: any) => {
    return [
      <MenuItem
        key='change-status'
        onClick={() => {
          handleChangeStatus(
            id,
            row.trangThai === TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
              ? TrangThaiLopHocPhanEnum.KHONG_HOAT_DONG
              : TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
          );
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <ChangeCircleOutlinedIcon sx={{ color: 'green' }} />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Thay đổi trạng thái
        </Typography>
      </MenuItem>,
      <MenuItem
        key='edit'
        onClick={() => {
          handleClickOpenEdit();
          setGetId(id as string);
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <EditIcon sx={{ color: 'blue' }} />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Chỉnh sửa
        </Typography>
      </MenuItem>
    ];
  }, []);
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
    const formatType = (type: number) => {
      switch (type) {
        case LoaiLopHocEnum.LOP_HOC_KY_PHU:
          return <ChipOption title='Lớp học kỳ phụ' color='success' />;
        case LoaiLopHocEnum.LOP_HOC_PHAN:
          return <ChipOption title='Lớp học phần' color='info' />;
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
        renderCell: (params: any) => {
          return params?.value ? (
            <Link href={`${APP_ROUTE.LOP_HOC_PHAN.EDIT(params.row?.id)}`} className='text-blue-500 hover:underline'>
              {params.value}
            </Link>
          ) : null;
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
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatType(params.value);
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
      <Box className='flex justify-start gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Button title={'Thêm mới học phần'} onClick={() => handleClickOpenAdd()} />
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
        isDisableEdit
        placeholderSearch='Tìm kiếm mã lớp học phần...'
        moreActions={moreActions}
      />
      <AddModal openAdd={openAdd} handleCloseAdd={handleCloseAdd} />
      <EditModal open={openEdit} onClose={handleCloseEdit} id={getId} />
    </Box>
  );
};

export default Content;
