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
import { IParamBoMon, IParamGiangVien, IParamKhoa, IParamLopHocPhan, IParamLopHocPhan2, IParamNganh, IParamPhongHoc, IParamSinhVien } from '@/types/params';
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
import { HocKyLopHocPhan, IOption, LoaiChuongTrinhDaoTao, LoaiLopHocEnum, LoaiPhongHoc, ToaNha, TrangThaiPhongHoc, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
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
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { useForm } from 'react-hook-form';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import { ArrowUpWideNarrow, Lock } from 'lucide-react';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';

const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey?: string;
}

export interface IFilter {
  hocKy: IOption | null;
  loaiChuongTrinh: IOption | null;
  lopHocPhan: {
    id: string | null;
    name: string | null;
    monHocId: string | null;
    chuongTrinhDaoTaoId: string | null;
    loaiMonHoc: number | null;
  } | null;
  khoa: IOption | null;
}

const ContentAdmin = ({ queryKey }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
   const [idHocBa, setIdHocBa] = useState<string | null>(null);
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [filterOption, setFilterOption] = useState<{
    hocKy: number | null;
    khoaId: string | null;
    loaiChuongTrinhDaoTao: number | null;
  }>({
    hocKy: null,
    khoaId: null,
    loaiChuongTrinhDaoTao: null
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });
  const [sortModel, setSortModel] = useState<Record<string, string | null | undefined>>({
    field: '',
    sort: ''
  });
  const { control, getValues, setValue } = useForm<IFilter>({
      defaultValues: {
        hocKy: null,
        loaiChuongTrinh: null,
        lopHocPhan: null,
        khoa: null
      }
    });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [itemRow, setItemRow] = useState<Record<string, any>>({
    id: null,
    row: {}
  });
  const {setTitle} = useBreadcrumb();
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterOption.hocKy, filterOption.khoaId, filterOption.loaiChuongTrinhDaoTao],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLopHocPhan = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdat',
        sortByOrder: 'desc'
      };
    if (filterOption.hocKy) {
        params.hocKy = filterOption.hocKy;
    }
    if (filterOption.khoaId) {
        params.khoaId = filterOption.khoaId;
    }
    if (filterOption.loaiChuongTrinhDaoTao) {
        params.loaiChuongTrinhDaoTao = filterOption.loaiChuongTrinhDaoTao;
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
      const result = await LopHocPhanService.getLopHocPhanDaNop(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!filterOption.hocKy && !!filterOption.khoaId && !!filterOption.loaiChuongTrinhDaoTao
  });
   const { data: khoas, isLoading: isLoadingKhoa } = useQuery({
      queryKey: ['khoas'],
      queryFn: async () => {
        const response = await KhoaService.getKhoaNoPage();
        return response;
      },
      select: (data) => {
        return data.map((item: any) => ({
          id: item.id,
          name: item.tenKhoa
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
 
  useEffect(() => {
    setTitle('Danh sách lớp học phần đã nộp');
    return () => {
      setTitle('');
    };
  },[])


  const mutationChangeStatus = useMutation({
    mutationFn: async (data: { id: string | number | null }) => {
      const result = await ChiTietLopHocPhanService.updateNopDiem(data.id);
      return result;
    },
    onSuccess: () => {
      notification.show('mở khóa thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Mở khóa thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleChangeStatus = (id: string | number | null) => {
    mutationChangeStatus.mutate({ id });
  };

  const moreActions = useCallback((id: string | number | null, row: any) => {
    return [
      <MenuItem
        key='unlock-lop-hoc-phan'
        onClick={() => {
          handleChangeStatus(id)
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Lock className="text-blue-500" />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Mở khóa
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
            case TrangThaiLopHocPhanEnum.DANG_HOAT_DONG:
              return <ChipOption title='Đang hoạt động' color='success' />;
            case TrangThaiLopHocPhanEnum.KHONG_HOAT_DONG:
              return <ChipOption title='Không hoạt động' color='error' />;
            default:
              return '';
          }
        };
        const formatType = (value: any) => {
              switch (value) {
                case LoaiMonHocEnum.CHUC_CHUNG_CHI:
                  return <Typography variant='body2'>CCH</Typography>;
                case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
                  return <Typography variant='body2'>ĐATN</Typography>;
                case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
                  return <Typography variant='body2'>KLTN</Typography>;
                case LoaiMonHocEnum.KIEN_TAP:
                  return <Typography variant='body2'>KT</Typography>;
                case LoaiMonHocEnum.MODUN:
                  return <Typography variant='body2'>Md</Typography>;
                case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
                  return <Typography variant='body2'>TTNLT</Typography>;
                case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
                  return <Typography variant='body2'>TTNTH</Typography>;
                case LoaiMonHocEnum.THUC_HANH:
                  return <Typography variant='body2'>TH</Typography>;
                case LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP:
                  return <Typography variant='body2'>TTTN</Typography>;
                case LoaiMonHocEnum.LY_THUYET:
                  return <Typography variant='body2'>LT</Typography>;
                default:
                  return null;
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
        field: 'maHocPhan',
        headerName: 'Mã học phần',
        type: 'string',
        headerAlign: 'left',
        minWidth: 130,
        flex: 1.2,
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
        headerName: 'Tên giảng viên',
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
        headerAlign: 'center',
        type: 'number',
        align: 'center',
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
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        minWidth: 60,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatType(params.row?.monHoc?.chiTietChuongTrinhDaoTao?.loaiMonHoc);
        }
      },
      {
        field: 'trangThai',
        headerName: 'Trạng thái',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: true,
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
        <Box className='flex justify-start gap-4  '>
            <Box className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
            <Box className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm gap-3 w-full'>
                <Box className='flex items-center justify-between gap-5'>
                <Typography className={'!font-semibold !text-gray-700 !leading-6 !text-lg'}>Lớp học phần đã nộp</Typography>
                <ArrowUpWideNarrow />
                </Box>
                <Box>
                <Typography className='text-blue-500 !font-bold !text-xl'>{rowCount}</Typography>
                </Box>
            </Box>
            </Box>
        </Box>
      <Box className='flex justify-end w-full gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Box className="flex items-center gap-3 w-full">
          <Grid container className="w-full flex items-center gap-2" spacing={1}>
            <Grid size={2}>
            <Typography className="!font-semibold !text-gray-700">
              Bậc
            </Typography>
            </Grid>
           <Grid size={10}>
              <InputSelect2
                fullWidth
                control={control}
                name={'loaiChuongTrinh'}
                placeholder={'Chọn bậc'}
                data={LoaiChuongTrinhDaoTao ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => {
                setFilterOption((prev: any) => ({
                    ...prev,
                    loaiChuongTrinhDaoTao: value?.id,
                }));
                }}
            />
           </Grid>
          </Grid>
          <Grid container className="w-full flex items-center gap-2">
            <Grid size={2}>
              <Typography className="!font-semibold !text-gray-700">
              Khoa
            </Typography>
            </Grid>
           <Grid size={10}>
              <InputSelect2
              fullWidth
              name={'Khoa'}
              placeholder={'Chọn khoa'}
              data={khoas ?? []}
            isLoading={isLoadingKhoa}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              getOnChangeValue={(value: any) => {
                setFilterOption((prev) => ({
                  ...prev,
                  khoaId: value?.id || null
                }));
              }}
            />
           </Grid>
          </Grid>
          <Grid container className="w-full flex items-center gap-2">
            <Grid size={2}>
              <Typography className="!font-semibold !text-gray-700">
              Học kỳ
            </Typography>
            </Grid>
           <Grid size={10}>
               <InputSelect2
                fullWidth
                name={'hocKy'}
                control={control}
                placeholder={'Chọn học kỳ'}
                data={HocKyLopHocPhan ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => {
                setFilterOption((prev: any) => ({
                    ...prev,
                    hocKy: value?.id,
                }));
                }}
            />
           </Grid>
          </Grid>
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
        customToolBar
        isDisableEdit
        isDisableDelete
        moreActions={moreActions}
        urlNavigate='phong-hoc'
        placeholderSearch='Tìm kiếm phòng học...'
      />
    </Box>
  );
};

export default ContentAdmin;
