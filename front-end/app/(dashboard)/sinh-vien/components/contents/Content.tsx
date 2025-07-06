'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { Box, MenuItem, Modal, Typography } from '@mui/material';
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
import { TinhTrangHocTapSinhVienEnum, TrangThaiSinhVien, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import {
  Book,
  BookAlert,
  BookCheck,
  BookOpenCheck,
  BookPlus,
  BookX,
  CirclePlus,
  Download,
  Funnel,
  GraduationCap,
  Import,
  TrendingUp
} from 'lucide-react';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocService } from '@/services/LopHocService';
import { saveAs } from 'file-saver';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
  transition: 'all 0.3s ease-in-out'
};
interface ContentProps {
  queryKey: string;
  lopHocServers?: any[];
  tinhTrangHocTapServer?: any;
}
interface ImportFileProps {
  lopHocId: string | number | null;
  File: File | null;
}
const Content = ({ queryKey, lopHocServers, tinhTrangHocTapServer }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [getItem, setGetItem] = useState<{
    id: string;
    row: any;
  } | null>(null);
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
  const [filterOption, setFilterOption] = useState<{
    tinhTrang: number | null;
    lopId: number | null;
    lopName: string | null;
  }>({
    tinhTrang: null,
    lopId: null,
    lopName: null
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, filterOption?.lopId, filterOption?.tinhTrang],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamSinhVien = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      };
      if (filterOption?.tinhTrang) {
        params = {
          ...params,
          tinhTrangHocTap: filterOption.tinhTrang
        };
      }
      if (filterOption?.lopId) {
        params = {
          ...params,
          lopId: filterOption.lopId
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
      const result = await SinhVienService.getAllSinhVien(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  const { data: lopHocs, isLoading: isLoadingLopHoc } = useQuery({
    queryKey: ['lop-hoc-list'],
    queryFn: async () => {
      const result = await LopHocService.getAllLopHoc({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return result?.data;
    },
    initialData: lopHocServers,
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.maLopHoc
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
  const { data: tinhTrangHocTap } = useQuery({
    queryKey: ['tinh-trang-hoc-tap', filterOption?.lopId],
    queryFn: async () => {
      let params: IParamSinhVien = {};
      if (filterOption.lopId) {
        params = {
          ...params,
          lopId: filterOption.lopId
        };
      }
      const result = await SinhVienService.getAllTinhTrangHocTap(params);
      return result;
    },
    initialData: !filterOption?.lopId ? tinhTrangHocTapServer : undefined,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
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
      queryClient.invalidateQueries({ queryKey: ['tinh-trang-hoc-tap'], exact: false });
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
  const mutationExportFile = useMutation({
    mutationFn: async (data: { lopId: string }) => {
      const response = await SinhVienService.exportSinhVien(data.lopId);
      return response;
    },
    onSuccess: async (data) => {
      await saveAs(data, `danh_sach_sinh_vien_${filterOption?.lopName}_${moment().format('DDMMYY')}.xlsx`);
      notification.show('Xuất file thành công!', {
        severity: 'success',
        autoHideDuration: 4000
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Đã xảy ra lỗi khi xuất file.', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const mutationImport = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await SinhVienService.importSinhVien(data);
      return response;
    },
    onSuccess: async (data) => {
      notification.show('Import file thành công!', {
        severity: 'success',
        autoHideDuration: 4000
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Đã xảy ra lỗi khi import file.', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleImportFileClick = (data: ImportFileProps) => {
    if (!data?.lopHocId || !data?.File) {
      return;
    }
    const formData = new FormData();
    formData.append('lopHocId', String(data?.lopHocId));
    if (data.File && data.File instanceof File) {
      formData.append('file', data?.File);
    }
    mutationImport.mutate(formData);
  };
  const handleExportFile = () => {
    if (!filterOption?.lopId) {
      notification.show('Vui lòng chọn lớp học để xuất file.', {
        severity: 'warning',
        autoHideDuration: 4000
      });
      return;
    }
    mutationExportFile.mutate({ lopId: String(filterOption?.lopId) });
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (event.target.files[0]?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      notification.show('Vui lòng chọn file Excel (.xlsx) để import.', {
        severity: 'warning',
        autoHideDuration: 4000
      });
      return;
    }
    if (!filterOption?.lopId) {
      return;
    }
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      handleImportFileClick({ lopHocId: filterOption?.lopId || '', File: fileList[0] });
    }
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
  const formatDateBirth = (date: string) => {
    return moment(date).format('DD/MM/YYYY');
  };
  const formatGioiTinh = (gioiTinh: number) => {
    switch (gioiTinh) {
      case GioiTinhEnum.NAM:
        return 'Nam';
      case GioiTinhEnum.NU:
        return 'Nữ';
      case GioiTinhEnum.KHAC:
        return 'Khác';
      default:
        return '';
    }
  };
  const columns = useMemo((): GridColDef[] => {
    const formatStatus = (status: number) => {
      switch (status) {
        case TrangThaiSinhVienEnum.DANG_HOC:
          return <ChipOption title='Đang học' color='info' />;
        case TrangThaiSinhVienEnum.TAM_NGHI:
          return <ChipOption title='Tạm việc' color='warning' />;
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
        flex: 0.7,
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
        field: 'gpa',
        headerName: 'GPA',
        headerAlign: 'left',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return params.value ? <Typography className='!font-semibold'>{`${params.value}`}</Typography> : '';
        }
      },
      {
        field: 'diemDanh',
        headerName: 'Điểm danh',
        headerAlign: 'left',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return params.value ? <Typography className='!font-semibold'>{`${params.value}%`}</Typography> : '';
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
  const handleChooseRow = (id: string | number | null, row: any) => {
    setGetItem({ id: String(id), row });
  };
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-start gap-4  '>
        <Box className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Tổng số sinh viên</Typography>
              <PeopleAltOutlinedIcon />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{rowCount}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Xuất sắc</Typography>
              <GraduationCap className='!text-green-500' />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soXuatSac || 0}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Giỏi</Typography>
              <TrendingUp className={'!text-blue-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soGioi || 0}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>khá</Typography>
              <Book className={'!text-yellow-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soKha || 0}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full relative'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Cần cải thiện</Typography>
              <BookX className={'!text-yellow-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>
                {tinhTrangHocTap?.soCanCaiThien || 0}
              </Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Đang học</Typography>
              <BookCheck className={'!text-green-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soDangHoc}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Đã tốt nghiệp</Typography>
              <BookOpenCheck className={'!text-blue-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soDaTotNghiep}</Typography>
            </Box>
          </Box>
          <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
            <Box className='flex items-center justify-between gap-5'>
              <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Cảnh báo</Typography>
              <BookAlert className={'!text-yellow-500'} />
            </Box>
            <Box>
              <Typography className='text-blue-500 !font-bold !text-xl'>{tinhTrangHocTap?.soTamNghi}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className='flex flex-[3] flex-col lg:flex-row gap-5 sm:gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Box className='w-full flex flex-col sm:flex-row gap-3 col-span-'>
          <Box className='flex gap-3 justify-start items-center'>
            <Funnel className='w-4 h-4' />
            <Typography className='!font-semibold !text-gray-700 !leading-6 !text-lg'>Lọc</Typography>
          </Box>
          <Box className='w-full flex items-center gap-3 flex-col sm:flex-row'>
            <Box className='w-full'>
              <Box className='w-full'>
                <InputSelect2
                  fullWidth
                  name={'TrangThai'}
                  placeholder={'Trạng thái'}
                  data={TrangThaiSinhVien ?? []}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option: any) => option.name}
                  getOnChangeValue={(value: any) => {
                    setFilterOption((prev) => ({
                      ...prev,
                      tinhTrang: value?.id || null
                    }));
                  }}
                />
              </Box>
            </Box>
            <Box className='w-full'>
              <InputSelect2
                fullWidth
                name={'LopHoc'}
                isLoading={isLoadingLopHoc}
                placeholder={'Lớp học'}
                data={lopHocs ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value: any) => {
                  setFilterOption((prev) => ({
                    ...prev,
                    lopId: value?.id || null,
                    lopName: value?.name || null
                  }));
                  setPaginationModel({
                    page: 0,
                    pageSize: paginationModel.pageSize
                  });
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box className='w-full flex flex-col sm:flex-row justify-end gap-4 items-center flex-1'>
          <Box className='w-full'>
            <Button
              className='flex items-center gap-3 w-full justify-center'
              icon={<Import className='h-5 w-5 text-white' />}
              title={'Export'}
              onClick={() => handleExportFile()}
            />
          </Box>
          <Box className='w-full'>
            <input
              id='import-file'
              accept='.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
              type='file'
              className='hidden'
              onChange={handleFileChange}
            />
            <Button
              className='flex items-center gap-3 w-full justify-center'
              icon={<Download className='h-5 w-5 text-white' />}
              title={'Import'}
              onClick={() => {
                if (!filterOption?.lopId) {
                  notification.show('Vui lòng chọn lớp học để import', {
                    severity: 'warning',
                    autoHideDuration: 4000
                  });
                  return;
                }
                document.getElementById('import-file')?.click();
              }}
            />
          </Box>
          <Box className='w-full'>
            <Button
              title={'Thêm'}
              icon={<CirclePlus className='h-5 w-5 text-white' />}
              onClick={() => router.push(APP_ROUTE.SINH_VIEN.ADD)}
              className='flex items-center gap-1 w-full justify-center'
            />
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
        isOpenOption={handleOpen}
        isMoreCellAction
        handleChooseRow={handleChooseRow}
        urlNavigate='sinh-vien'
        placeholderSearch='Tìm kiếm sinh viên...'
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} className='relative'>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            className='!font-bold !text-2xl !text-blue-700 mb-2 text-center'
          >
            Thông tin sinh viên
          </Typography>
          {getItem?.row?.deletedAt && (
            <Box
              className='absolute top-4 right-4 flex items-center gap-2 px-4 py-1 rounded-full'
              sx={{
                background: 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
                border: 'none',
                boxShadow: '0 2px 8px 0 rgba(255,71,87,0.15)'
              }}
            >
              <Typography
                sx={{
                  color: '#ff4757',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  fontFamily: 'inherit'
                }}
              >
                Đã xóa
              </Typography>
            </Box>
          )}
          <Box className='flex flex-col gap-6 mt-6 px-4'>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Họ và tên:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.hoTen}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>MSSV:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.mssv}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Lớp học:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Link
                  href={`/lop-hoc/${getItem?.row?.lopHoc?.id}`}
                  className='!text-blue-600 hover:underline !text-base !font-medium'
                >
                  {getItem?.row?.lopHoc?.maLopHoc}
                </Link>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>
                  Số điện thoại:
                </Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.soDienThoai}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Email:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.email}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>CCCD:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.cccd}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Giới tính:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>
                  {formatGioiTinh(getItem?.row?.gioiTinh)}
                </Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Ngày sinh:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>
                  {formatDateBirth(getItem?.row?.ngaySinh)}
                </Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>
                  Ngày nhập học:
                </Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>
                  {formatDateBirth(getItem?.row?.ngayNhapHoc)}
                </Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>GPA:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.gpa}</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Điểm danh:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.diemDanh}%</Typography>
              </Box>
            </Box>
            <Box className='grid grid-cols-12 items-center gap-4'>
              <Box className='col-span-4 w-full flex items-center justify-end'>
                <Typography className='!font-semibold !text-gray-700 !leading-6 !text-[17px]'>Địa chỉ:</Typography>
              </Box>
              <Box className='col-span-8 w-full flex items-center justify-start'>
                <Typography className='!text-gray-800 !text-base !font-medium'>{getItem?.row?.diaChi}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Content;
