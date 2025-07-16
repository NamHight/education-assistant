'use client';

import { Box, MenuItem, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import ChipOption from '@/components/chips/ChipOption';
import Button from '@/components/buttons/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IParamLopHocPhan } from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import EditIcon from '@mui/icons-material/Edit';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { useNotifications } from '@toolpad/core';
import Link from 'next/link';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
import { TrangThaiLopHocPhan } from '@/types/options';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';

import InputSelect2 from '@/components/selects/InputSelect2';
import EditModal from '../modals/EditModal';
import AddModal from '../modals/AddModal';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import { LoaiMonHocEnum } from '@/models/MonHoc';
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
  const [filterOption, setFilterOption] = useState<{
    trangThai: number | null;
  }>({
    trangThai: null
  });
  const { setTitle, setBreadcrumbs } = useBreadcrumb();
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
    queryKey: [queryKey, paginationModel, sortModel, filterModel, filterOption],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLopHocPhan = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      };
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
      const result = await LopHocPhanService.getAllLopHocPhan(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    setTitle('Danh sách lớp học phần');
    return () => {
      setTitle('');
    };
  }, []);
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
          router.push(APP_ROUTE.LOP_HOC_PHAN.EDIT(id as string));
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
        disableColumnMenu: true
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
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        minWidth: 100,
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
        <Box className='flex-1'>
          <InputSelect2
            fullWidth
            name={'TrangThai'}
            placeholder={'Trạng thái'}
            data={TrangThaiLopHocPhan ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            getOnChangeValue={(value: any) => {
              setFilterOption((prev) => ({
                ...prev,
                trangThai: value?.id || null
              }));
            }}
          />
        </Box>
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
