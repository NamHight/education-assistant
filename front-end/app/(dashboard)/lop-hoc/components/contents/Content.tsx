'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, MenuItem, Popover, Typography } from '@mui/material';
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
  IParamKhoa,
  IParamLopHoc,
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
import { TrangThaiPhongHoc, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { LopHocService } from '@/services/LopHocService';
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
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLopHoc = {
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
      const result = await LopHocService.getAllLopHoc(params);
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    refTable.current?.handleClose();
  };

  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await LopHocService.deleteLopHoc(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá lớp học thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá lớp học thất bại', {
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
    const formatStatus = (status: number) => {
      switch (status) {
        case TrangThaiPhongHocEnum.BAO_TRI:
          return <ChipOption title='Bảo trì' color='info' />;
        case TrangThaiPhongHocEnum.HOAT_DONG:
          return <ChipOption title='Hoạt động' color='success' />;
        case TrangThaiPhongHocEnum.KHONG_SU_DUNG:
          return <ChipOption title='Không sử dụng' color='error' />;
        default:
          return '';
      }
    };
    const formatType = (status: number) => {
      switch (status) {
        case LoaiPhongHocEnum.HOI_TRUONG:
          return (
            <Typography variant='body2' color='primary'>
              Hội trường
            </Typography>
          );
        case LoaiPhongHocEnum.LY_THIET:
          return (
            <Typography variant='body2' color='primary'>
              Lý thuyết
            </Typography>
          );
        case LoaiPhongHocEnum.THUC_HANH:
          return (
            <Typography variant='body2' color='primary'>
              Thực hành
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
        field: 'maLopHoc',
        headerName: 'Mã lớp học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return (
            <Link href={`${APP_ROUTE.LOP_HOC.EDIT(params.row.id)}`} className='text-blue-500 hover:underline'>
              {params.value}
            </Link>
          );
        }
      },
      {
        field: 'namHoc',
        headerName: 'Năm học',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.6
      },
      {
        field: 'nganh',
        headerName: 'Ngành',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        renderCell: (params: any) => {
          return (
            <Link href={`${APP_ROUTE.NGANH.EDIT(params.row.nganh.id)}`} className='text-blue-500 hover:underline'>
              {params.row.nganh?.tenNganh}
            </Link>
          );
        }
      },
      {
        field: 'giangVien',
        headerName: 'Giảng viên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        renderCell: (params: any) => {
          return (
            <Link
              href={`${APP_ROUTE.GIANG_VIEN.EDIT(params.row?.giangVien?.id)}`}
              className='text-blue-500 hover:underline'
            >
              {params.row.giangVien?.hoTen}
            </Link>
          );
        }
      },
      {
        field: 'siSo',
        headerName: 'Sĩ số',
        type: 'number',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        headerAlign: 'left',
        flex: 0.7
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
        urlNavigate='lop-hoc'
        placeholderSearch='Tìm kiếm lớp học...'
      />
    </Box>
  );
};

export default Content;
