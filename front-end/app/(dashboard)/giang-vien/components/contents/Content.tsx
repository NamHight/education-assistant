'use client';
import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, MenuItem, Popover, Typography } from '@mui/material';
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
import { IParamGiangVien } from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { API, APP_ROUTE } from '@/types/general';
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
import {
  Book,
  BookAlert,
  BookCheck,
  BookOpenCheck,
  BookX,
  Funnel,
  GraduationCap,
  LampDesk,
  PenLine,
  RotateCcw,
  TrendingUp,
  Unplug
} from 'lucide-react';
import { LoaiTaiKhoanEnum, loaiTaiKhoanOptions, TrangThaiGiangVien } from '@/types/options';
import { PeopleAltTwoTone } from '@mui/icons-material';
import authApi from '@/lib/authAxios';
import { filter } from 'lodash';
import { useUser } from '@/stores/selectors';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  khoaData: any;
  tinhTrangServer?: any;
}

const Content = ({ queryKey, khoaData, tinhTrangServer }: ContentProps) => {
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
    vaiTro?: { id: number; name: string };
  } | null>(null);
   const [itemRow, setItemRow] = useState<Record<string, any>>({
      id: null,
      row: {}
    });
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { setTitle } = useBreadcrumb();
  const queryClient = useQueryClient();
  const user = useUser();
   const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, filterOption],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamGiangVien = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortByOrder: 'desc'
      };
      if (filterOption?.khoa) {
        params = {
          ...params,
          khoaId: filterOption?.khoa?.id
        };
      }
      if(filterOption?.vaiTro){
        params = {
          ...params,
          vaiTro: filterOption?.vaiTro?.id
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
    select: (data: any) => {
      const rows = data?.data?.map((row: any, idx: number) => ({ ...row, stt: idx + 1 }));
      return {
        ...data,
        data:rows
      }
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  const { data: tinhTrangs } = useQuery({
    queryKey: ['tinh-trang-giang-vien', filterOption?.khoa?.id],
    queryFn: async () => {
      const params: IParamGiangVien = {};
      if (filterOption?.khoa?.id) {
        params.khoaId = filterOption?.khoa?.id;
      }
      const result = await GiangVienService.getGiangVienTinhTrang(params);
      console.log('tinh trang giang vien:', result);
      return result;
    },
    initialData: filterOption?.khoa?.id ? undefined : tinhTrangServer,
    refetchOnWindowFocus: false
  });
  const { data: khoas, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoa-list'],
    queryFn: async () => {
      const result = await KhoaService.getKhoaNoPage();
      return result;
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
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
      refTable.current?.handleClose();
    };
    useEffect(() => {
    setTitle('Danh sách giảng viên');
    return () => setTitle('');
    },[])
  const rowCountRef = useRef(data?.meta?.TotalCount || 0);
  const rowCount = useMemo(() => {
    if (data?.meta?.TotalCount !== undefined) {
      rowCountRef.current = data?.meta?.TotalCount;
    }
    return rowCountRef.current;
  }, [data?.meta?.TotalCount]);
  const mutationStatus = useMutation({
    mutationFn: async (data: {id: string | number | null, trangThai: number | string}) => {
      const result = await GiangVienService.changeStatusGiangVien(data.id,data.trangThai);
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
      notification.show(error?.message || 'Thay đổi trạng thái giảng viên thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });

  const handleChangeStatus = (id: string | number | null, trangThai: number |string) => {
      mutationStatus.mutate({ id, trangThai });
  }
  const moreActions = useCallback((id: string | number | null, row: any) => {
    return (
      <MenuItem
        onClick={(event: any) => {
          setItemRow({
            id,
            row
          });
          handleClick(event);
   
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <RotateCcw className="text-green-500" />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Thay đổi trạng thái
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
    const formatRole = (role: number) => {
      switch (role) {
        case LoaiTaiKhoanEnum.ADMIN:
          return 'Admin';
        case LoaiTaiKhoanEnum.QUAN_LY_KHOA_BO_MON:
          return 'Quản lý khoa bộ môn';
        case LoaiTaiKhoanEnum.GIANG_VIEN:
          return 'Giảng viên';
        default:
          return '';
      }
    };
    return [
      {
        field: 'stt',
        headerName: 'STT',
        type: 'number',
        headerAlign: 'center',
        minWidth: 60,
        flex: 0.4,
        sortable: true,
        display: 'flex',
        align: 'center',
        disableColumnMenu: true,
      },
      {
        field: 'anhDaiDien',
        headerName: 'Ảnh',
        headerAlign: 'center',
        minWidth: 100,
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
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return (
                !(user?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoanEnum.ADMIN) &&
                !(params?.row?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoanEnum.ADMIN)
              ) ||
              (
                !(user?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoanEnum.QUAN_LY_KHOA_BO_MON) &&
                !(params?.row?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoanEnum.ADMIN)
              ) ? (
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
        field: 'role',
        headerName: 'Vai trò',
        type: 'string',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatRole(params.row?.taiKhoan?.loaiTaiKhoan);
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
    ];
  }, [data?.data,user]);
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
              {TrangThaiGiangVien.map((item) => (
                <button
                  key={item?.id}
                  disabled={item.id === itemRow?.row?.trangThaiGiangVien}
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
      <Box className='flex justify-start gap-4  '>
        <Box className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 w-full'>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>
                Tổng số giảng viên
              </Typography>
              <PeopleAltTwoTone />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{rowCount}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Đang công tác</Typography>
              <LampDesk className='!text-green-500' />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangs?.dangCongTac || 0}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Nghỉ việc</Typography>
              <Unplug className={'!text-blue-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangs?.nghiViec || 0}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className='flex gap-4'>
        <Box className={cn('flex flex-col flex-[5] border border-gray-200 rounded-lg p-4 shadow-sm gap-4 ')}>
          <Box className='flex items-center justify-between'>
            <Box className='flex items-center gap-2'>
              <Funnel className='h-5 w-5' />
              <Typography className='!text-[16px] !font-semibold'>Lọc </Typography>
            </Box>
            <ButtonRedirect />
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
            <Box className='flex-2 gap-1 flex flex-col'>
              <Typography className='!font-semibold'>Vai trò</Typography>
              <InputSelect2
                fullWidth
                name={'vaiTro'}
                placeholder={'Chọn vai trò'}
                data={loaiTaiKhoanOptions ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => {
                  setFilterOption((prev: any) => ({
                    ...prev,
                    vaiTro: {
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
      user={user}
        ref={refTable}
        isDisableDelete
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
        customToolBar
        urlNavigate='giang-vien'
        placeholderSearch='Tìm kiếm giảng viên...'
      />
    </Box>
  );
};

export default Content;
