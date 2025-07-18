'use client';

import { Box, MenuItem, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import Button from '@/components/buttons/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IParamPhongHoc } from '@/types/params';
import dynamic from 'next/dynamic';
import { handleTextSearch } from '@/lib/string';
import { useRouter } from 'next/navigation';
import { APP_ROUTE } from '@/types/general';
import { useNotifications } from '@toolpad/core';
import Link from 'next/link';
import { LoaiChuongTrinhDaoTaoEnum } from '@/types/options';
import { NganhService } from '@/services/NganhService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import InputSelect2 from '@/components/selects/InputSelect2';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
import { CircleEllipsis } from 'lucide-react';

const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  nganhs?: any[];
}

const Content = ({ queryKey, nganhs }: ContentProps) => {
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
  const [nganhOption, setNganhOption] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const { setTitle } = useBreadcrumb();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel, nganhOption],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamPhongHoc = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdat',
        sortByOrder: 'desc'
      };
      if (nganhOption) {
        params.nganhId = nganhOption.id;
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
      const result = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTao(params);
      return result;
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: "always"
  });
  const { data: nganhss, isLoading: loadingNganhs } = useQuery({
    queryKey: ['nganhs'],
    queryFn: async () => {
      const result = await NganhService.getAllNganhNoPage();
      return result;
    },
    select: (data: any) => {
      return data?.map((item: any) => ({
        id: item?.id,
        name: item?.tenNganh
      }));
    },
    initialData: nganhs,
    refetchOnWindowFocus: false
  });
  const rowCountRef = useRef(data?.meta?.TotalCount || 0);
  const rowCount = useMemo(() => {
    if (data?.meta?.TotalCount !== undefined) {
      rowCountRef.current = data?.meta?.TotalCount;
    }
    return rowCountRef.current;
  }, [data?.meta?.TotalCount]);
  const moreActions = useCallback((id: string | number | null, row: any) => {
    return [
      <MenuItem
        key='change-status'
        onClick={(e: React.MouseEvent<HTMLLIElement>) => {
          router.push(APP_ROUTE.CHUONG_TRINH_DAO_TAO.CHI_TIET(id));
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <CircleEllipsis className='text-green-500' />
        <Typography
          className={'!text-[14px] !font-[500] !leading-6 group-hover:!text-blue-800 group-hover:!font-semibold'}
          variant={'body1'}
          sx={{ width: '100%' }}
        >
          Xem chi tiết
        </Typography>
      </MenuItem>
    ];
  }, []);
  useEffect(() => {
    setTitle('Chương trình đào tạo');
    return () => setTitle('');
  }, []);
  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).utc().format('DD/MM/YYYY');
    };
    const formatType = (status: number) => {
      switch (status) {
        case LoaiChuongTrinhDaoTaoEnum.CAO_DANG:
          return (
            <Typography variant='body2' color='textPrimary'>
              Cao đẳng
            </Typography>
          );
        case LoaiChuongTrinhDaoTaoEnum.CAO_DANG_NGHE:
          return (
            <Typography variant='body2' color='textPrimary'>
              Cao đẳng nghề
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
        disableColumnMenu: true
      },
      {
        field: 'maChuongTrinh',
        headerName: 'Mã chương trình',
        headerAlign: 'left',
        type: 'string',
        minWidth: 150,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return !params.row?.deletedAt ? (
            <Link
              href={`${APP_ROUTE.CHUONG_TRINH_DAO_TAO.EDIT(params.row?.id)}`}
              className='text-blue-500 hover:underline'
            >
              {params.value}
            </Link>
          ) : (
            <span>{params.value}</span>
          );
        }
      },
      {
        field: 'tenChuongTrinh',
        headerName: 'Tên',
        headerAlign: 'left',
        type: 'string',
        minWidth: 180,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1
      },
      {
        field: 'thoiGianDaoTao',
        headerName: 'Thời gian',
        headerAlign: 'center',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        align: 'center',
        flex: 1
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
          return !params?.value ? null : (
            <Link href={`${APP_ROUTE.NGANH.ROOT}/${params.value?.id}`} className='text-blue-500 hover:underline'>
              {params.value?.tenNganh || ''}
            </Link>
          );
        }
      },
      {
        field: 'khoa',
        headerName: 'Khóa',
        headerAlign: 'left',
        type: 'string',
        minWidth: 70,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1,
        valueFormatter: (params: any) => params
      },
      {
        field: 'tongSoTinChi',
        headerName: 'tín chỉ',
        headerAlign: 'left',
        type: 'number',
        minWidth: 50,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'loaiChuonTrinhDaoTao',
        headerName: 'Loại',
        type: 'string',
        minWidth: 100,
        disableColumnMenu: true,
        sortable: true,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return formatType(params.value);
        }
      }
    ];
  }, [data?.data]);
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-end gap-4 border border-gray-200 rounded-lg p-4 shadow-sm'>
        <Box className='flex w-full justify-start items-center gap-2'>
          <Box className=' w-1/3 gap-1 flex flex-col'>
            <Typography className='!font-semibold'>Ngành</Typography>
            <InputSelect2
              fullWidth
              name={'nganh'}
              placeholder={'Chọn ngành'}
              data={nganhss ?? []}
              isLoading={loadingNganhs}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              getOnChangeValue={(value) => {
                setNganhOption({
                  id: value?.id || null,
                  name: value?.name || null
                });
              }}
            />
          </Box>
        </Box>
        <Box className='flex items-center w-1/3 justify-end gap-2'>
          <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.CHUONG_TRINH_DAO_TAO.ADD)} />
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
        isDisableDelete
        moreActions={moreActions}
        urlNavigate='chuong-trinh-dao-tao'
        placeholderSearch='Tìm kiếm chương trình đào tạo...'
      />
    </Box>
  );
};

export default Content;
