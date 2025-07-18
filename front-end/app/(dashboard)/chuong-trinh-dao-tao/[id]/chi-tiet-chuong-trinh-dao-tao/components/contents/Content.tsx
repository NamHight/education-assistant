'use client';

import { Box, MenuItem, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@/components/buttons/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IParamChiTietChuongTrinhDaoTao
} from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import EditIcon from '@mui/icons-material/Edit';
import { useNotifications } from '@toolpad/core';
import Link from 'next/link';
import { KhoaService } from '@/services/KhoaService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import PopupEdit from '../popup/PopupEdit';
const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  id?: string;
  khoas?: any[];
}

const Content = ({ queryKey, id, khoas }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [getId, setGetId] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [nameDaoTao, setNameDaoTao] = useState<{
    id: string;
    name: string;
  } | null>(null);
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
  const { setTitle, setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, id],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamChiTietChuongTrinhDaoTao = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        chuongTrinhDaoTaoId: id
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
      const result = await ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTao(params);
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
  const {data: chuongTrinhDaoTao} = useQuery({
    queryKey: ['chuongtrinhdaotao', id],
    queryFn: async () => {
      const result = await ChuongTrinhDaoTaoService.getChuongTrinhDaoTaoById(id as string);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  useEffect(() => {
    if (chuongTrinhDaoTao) {
      setNameDaoTao({
        id: chuongTrinhDaoTao?.id || '',
        name: chuongTrinhDaoTao?.tenChuongTrinh || ''
      });
    }
  }, [chuongTrinhDaoTao]);
  const { data: khoass, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoas'],
    queryFn: async () => {
      const result = await KhoaService.getKhoaNoPage();
      return result;
    },
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenKhoa
      }));
    },
    initialData: khoas,
    refetchOnWindowFocus: false
  });
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setGetId(null);
  };
  useEffect(() => {
    if (nameDaoTao) {
      setBreadcrumbs(
        [
          <Link
          href={APP_ROUTE.CHUONG_TRINH_DAO_TAO.EDIT(id)}
          className='relative text-[14px] flex gap-1 items-center
    before:absolute before:left-0 before:bottom-0 before:h-[2px] before:bg-blue-500
    before:w-0 hover:before:w-full before:transition-all before:duration-400'
        >
          <Typography
            sx={(theme) => ({
              color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
              fontWeight: 500
            })}
          >
            {nameDaoTao?.name}
          </Typography>
        </Link>
        ]
      );
      setTitle(`Chi tiết chương trình đào tạo ${nameDaoTao?.name}`);
      return () => {
        setBreadcrumbs([]);
        setTitle('');
      };
    }
  }, [nameDaoTao, setBreadcrumbs]);
  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await ChitietChuongTrinhDaoTaoService.deleteChiTietChuongTrinhDaoTao(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá chi tiết chương trình đào tạo thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá chi tiết chương trình đào tạo thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  const moreActions = useCallback((id: string | number | null, row: any) => {
    return [
      <MenuItem
        key='edit'
        onClick={() => {
          handleClickOpenEdit();
          setGetId(id as string);
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
      >
        <EditIcon className='!text-blue-500 !h-5 !w-5' />
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
        type: 'string',
        headerAlign: 'center',
        minWidth: 50,
        flex: 0.4,
        sortable: true,
        display: 'flex',
        align: 'center',
        disableColumnMenu: true
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
        flex: 2,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link href={`${APP_ROUTE.MON_HOC.ROOT}/${params.value?.id}`} className='text-blue-500 hover:underline'>
              {params.value?.tenMonHoc || ''}
            </Link>
          );
        }
      },
      {
        field: 'chuongTrinhDaoTao',
        headerName: 'Chương trình đào tạo',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link
              href={`${APP_ROUTE.CHUONG_TRINH_DAO_TAO.ROOT}/${params.value?.id}`}
              className='text-blue-500 hover:underline'
            >
              {params.value?.tenChuongTrinh || ''}
            </Link>
          );
        }
      },
      {
        field: 'boMon',
        headerName: 'Bộ môn',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        renderCell: (params: any) => {
          return !params?.value ? null : (
            <Link href={`${APP_ROUTE.BO_MON.ROOT}/${params.value?.id}`} className='text-blue-500 hover:underline'>
              {params.value?.tenBoMon || ''}
            </Link>
          );
        }
      },
      {
        field: 'soTinChi',
        headerName: 'Tín chỉ',
        headerAlign: 'center',
        type: 'number',
        minWidth: 70,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'center',
        flex: 0.7
      },
      {
        field: 'hocKy',
        headerName: 'Học kỳ',
        headerAlign: 'center',
        type: 'number',
        minWidth: 80,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'center',
        flex: 1
      },
      {
        field: 'loaiMonHoc',
        headerName: 'Loại',
        type: 'string',
        minWidth: 80,
        headerAlign: 'center',
        align: 'center',
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 0.8,
        renderCell: (params: any) => {
          return formatType(params.value);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-end w-full items-center gap-2 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Button title={'Thêm mới'} onClick={() => handleClickOpenEdit()} />
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
        urlNavigate='chi-tiet-chuong-trinh-dao-tao'
        placeholderSearch='Tìm kiếm chi tiết chương trình đào tạo...'
      />
      <PopupEdit
        queryKey={queryKey}
        chuongTrinhDaoTao={nameDaoTao}
        onClose={handleCloseEdit}
        open={openEdit}
        khoas={khoass}
        isLoadingKhoa={isLoadingKhoa}
        getId={getId}
      />
    </Box>
  );
};

export default Content;
