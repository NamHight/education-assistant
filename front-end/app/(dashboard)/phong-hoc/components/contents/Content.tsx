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
import { IParamBoMon, IParamGiangVien, IParamKhoa, IParamNganh, IParamPhongHoc, IParamSinhVien } from '@/types/params';
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
  const [itemRow, setItemRow] = useState<Record<string, any>>({
    id: null,
    row: {}
  });
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamPhongHoc = {
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
      const result = await PhongHocService.getAllPhongHoc(params);
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
      const result = await PhongHocService.deletePhongHoc(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá phòng học thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá phòng học thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const mutationChangeStatus = useMutation({
    mutationFn: async ({ id, data }: { id: string | number | null; data: any }) => {
      const formData = new FormData();
      formData.append('trangThai', data.trangThai.toString());
      const result = await PhongHocService.changeStatusPhongHoc(id, formData);
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
        onClick={(e: React.MouseEvent<HTMLLIElement>) => {
          handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          setItemRow({ id, row });
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
      </MenuItem>
    ];
  }, []);

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
        field: 'tenPhong',
        headerName: 'Tên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return (
            <Link href={`${APP_ROUTE.PHONG_HOC.EDIT}/${params.row.id}`} className='text-blue-600 hover:underline'>
              {params.value}
            </Link>
          );
        }
      },
      {
        field: 'toaNha',
        headerName: 'Tòa nhà',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1
      },
      {
        field: 'sucChua',
        headerName: 'Sức chứa',
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
        field: 'loaiPhongHoc',
        headerName: 'Loại phòng học',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatType(params.value);
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
      },
      {
        field: 'trangThaiPhongHoc',
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
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        slotProps={{
          paper: {
            className: '!bg-white flex flex-col gap-2 p-2 shadow-lg rounded-lg'
          }
        }}
      >
        {TrangThaiPhongHoc.map((item) => (
          <button
            key={item.id}
            disabled={item.id === itemRow?.row?.trangThaiPhongHoc}
            className='px-2 py-1 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => {
              handleChangeStatus(itemRow.id, item.id);
              handleClose();
            }}
          >
            <Typography>{item.name}</Typography>
          </button>
        ))}
      </Popover>
      <Box className='flex justify-start gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.PHONG_HOC.ADD)} />
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
        moreActions={moreActions}
        urlNavigate='phong-hoc'
        placeholderSearch='Tìm kiếm phòng học...'
      />
    </Box>
  );
};

export default Content;
