'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, Grid, MenuItem, Popover, Typography } from '@mui/material';
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
import { LoaiPhongHoc, ToaNha, TrangThaiPhongHoc, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import ModalEdit from '@/app/(dashboard)/phong-hoc/components/Modals/ModalEdit';
import InputSelect2 from '@/components/selects/InputSelect2';

const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
}

const Content = ({ queryKey }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const [idHocBa, setIdHocBa] = useState<string | null>(null);
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [filterOption, setFilterOption] = useState<{
    toaNha: string | null;
    trangThai: string | null;
    loaiPhongHoc: string | null;
  }>({
    toaNha: null,
    trangThai: null,
    loaiPhongHoc: null
  });
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

  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpen = () => {
    setOpenEdit(true);
  };

  const handleClickClose = () => {
    setOpenEdit(false);
    refTable.current?.handleClose();
  };
  const { setTitle } = useBreadcrumb();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      queryKey,
      paginationModel,
      sortModel,
      filterModel,
      filterOption?.loaiPhongHoc,
      filterOption?.toaNha,
      filterOption?.trangThai
    ],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamPhongHoc = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdat',
        sortByOrder: 'desc'
      };
      if (filterOption?.toaNha) {
        params.toaNha = filterOption?.toaNha;
      }
      if (filterOption?.loaiPhongHoc) {
        params.loaiPhongHoc = filterOption?.loaiPhongHoc;
      }
      if (filterOption?.trangThai) {
        params.trangThai = filterOption?.trangThai;
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
  useEffect(() => {
    setTitle('Danh sách phòng học');
    return () => {
      setTitle('');
    };
  }, []);
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
  const handleChangeStatus = (id: string | number | null, trangThai: number | string) => {
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
      </MenuItem>,
      <MenuItem
        key='edit-phong-hoc'
        onClick={() => {
          handleClickOpen();
          setItemRow({ id, row });
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
        field: 'stt',
        headerName: 'STT',
        type: 'string',
        headerAlign: 'center',
        minWidth: 80,
        flex: 0.4,
        sortable: true,
        display: 'flex',
        align: 'center',
        disableColumnMenu: true,
        valueFormatter: (params: any) => {
          return params;
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
        flex: 1
      },
      {
        field: 'toaNha',
        headerName: 'Tòa nhà',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1
      },
      {
        field: 'sucChua',
        headerName: 'Sức chứa',
        headerAlign: 'center',
        align: 'center',
        type: 'number',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',

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
            key={item?.id}
            disabled={item.id === itemRow?.row?.trangThaiPhongHoc}
            className='px-2 py-1 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => {
              handleChangeStatus(itemRow?.id, item?.id);
              handleClose();
            }}
          >
            <Typography>{item.name}</Typography>
          </button>
        ))}
      </Popover>
      <ModalEdit
        queryKey={queryKey}
        open={openEdit}
        handleClose={handleClickClose}
        id={itemRow?.id}
        name={itemRow?.row?.tenPhong}
      />
      <Box className='flex justify-end w-full gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Box className='flex items-center gap-3 w-full'>
          <Grid container className='w-full flex items-center gap-2'>
            <Grid size={3}>
              <Typography className='!font-semibold !text-gray-700'>Tòa nhà</Typography>
            </Grid>
            <Grid size={9}>
              <InputSelect2
                fullWidth
                name={'ToaNha'}
                placeholder={'Tòa nhà'}
                data={ToaNha ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value: any) => {
                  setFilterOption((prev) => ({
                    ...prev,
                    toaNha: value?.id || null
                  }));
                }}
              />
            </Grid>
          </Grid>
          <Grid container className='w-full flex items-center gap-2'>
            <Grid size={2}>
              <Typography className='!font-semibold !text-gray-700'>Loại</Typography>
            </Grid>
            <Grid size={10}>
              <InputSelect2
                fullWidth
                name={'LoaiPhongHoc'}
                placeholder={'Loại phòng học'}
                data={LoaiPhongHoc ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value: any) => {
                  setFilterOption((prev) => ({
                    ...prev,
                    loaiPhongHoc: value?.id || null
                  }));
                }}
              />
            </Grid>
          </Grid>
          <Grid container className='w-full flex items-center gap-2'>
            <Grid size={4}>
              <Typography className='!font-semibold !text-gray-700'>Trạng Thái</Typography>
            </Grid>
            <Grid size={8}>
              <InputSelect2
                fullWidth
                name={'TrangThaiPhongHoc'}
                placeholder={'Trạng thái'}
                data={TrangThaiPhongHoc ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value: any) => {
                  setFilterOption((prev) => ({
                    ...prev,
                    trangThai: value?.id || null
                  }));
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className='flex items-center gap-2 w-1/3 justify-end'>
          <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.PHONG_HOC.ADD)} />
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
        isDisableEdit
        moreActions={moreActions}
        urlNavigate='phong-hoc'
        placeholderSearch='Tìm kiếm phòng học...'
      />
    </Box>
  );
};

export default Content;
