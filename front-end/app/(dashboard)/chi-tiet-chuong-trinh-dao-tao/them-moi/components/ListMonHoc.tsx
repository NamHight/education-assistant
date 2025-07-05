'use client';
import { handleTextSearch } from '@/lib/string';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import { APP_ROUTE } from '@/types/general';
import { IParamChiTietChuongTrinhDaoTao } from '@/types/params';
import { MenuItem, Typography } from '@mui/material';
import { GridColDef, GridFilterModel, useGridApiRef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { EditIcon } from 'lucide-react';

import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import PopupEdit from './PopupEdit';

const Table = dynamic(() => import('@/components/tables/Table'), {
  ssr: false
});

interface IListMonHoc {
  queryKey: string;
  chuongTrinhDaoTaoId?: string;
  monHocId?: string | null;
  hocKy?: string | number | null;
  khoas?: any[];
}

const ListMonHoc = ({ queryKey, chuongTrinhDaoTaoId, monHocId, hocKy, khoas }: IListMonHoc) => {
  const router = useRouter();
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [getId, setGetId] = useState<string | null>(null);

  const [openEdit, setOpenEdit] = React.useState(false);

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
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, paginationModel, sortModel, filterModel],
    queryFn: async () => {
      if (!chuongTrinhDaoTaoId) {
        return { data: [], meta: { TotalCount: 0 } };
      }
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamChiTietChuongTrinhDaoTao = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        hocKy: Number(hocKy),
        chuongTrinhDaoTaoId: chuongTrinhDaoTaoId
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
    refetchOnWindowFocus: false,
    enabled: !!chuongTrinhDaoTaoId,
    staleTime: 0,
    gcTime: 0
  });
  const rowCountRef = useRef(data?.meta?.TotalCount || 0);
  const rowCount = useMemo(() => {
    if (data?.meta?.TotalCount !== undefined) {
      rowCountRef.current = data?.meta?.TotalCount;
    }
    return rowCountRef.current;
  }, [data?.meta?.TotalCount]);
  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
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
  const moreActions = useCallback((id: string | number | null, row: any) => {
    return [
      <MenuItem
        key='edit'
        onClick={() => {
          handleClickOpenEdit();
          setGetId(id as string);
          refTable.current?.handleClose();
        }}
        sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <EditIcon className='!text-blue-500' />
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
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };

  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).utc().format('DD/MM/YYYY');
    };
    const formatType = (value: any) => {
      switch (value) {
        case LoaiMonHocEnum.CHUC_CHUNG_CHI:
          return <Typography variant='body2'>Chức chung chi</Typography>;
        case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
          return <Typography variant='body2'>Đồ án tốt nghiệp</Typography>;
        case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
          return <Typography variant='body2'>Khóa luận tốt nghiệp</Typography>;
        case LoaiMonHocEnum.KIEN_TAP:
          return <Typography variant='body2'>Kiến tập</Typography>;
        case LoaiMonHocEnum.MODUN:
          return <Typography variant='body2'>Modun</Typography>;
        case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
          return <Typography variant='body2'>Thi tốt nghiệp lý thuyết</Typography>;
        case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
          return <Typography variant='body2'>Thi tốt nghiệp thực hành</Typography>;
        case LoaiMonHocEnum.THUC_HANH:
          return <Typography variant='body2'>Thực hành</Typography>;
        case LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP:
          return <Typography variant='body2'>Thực tập tốt nghiệp</Typography>;
        case LoaiMonHocEnum.LY_THUYET:
          return <Typography variant='body2'>Lý thuyết</Typography>;
        default:
          return null;
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
        headerAlign: 'left',
        type: 'number',
        minWidth: 70,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'hocKy',
        headerName: 'Học kỳ',
        headerAlign: 'left',
        type: 'number',
        minWidth: 50,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'left',
        flex: 1
      },
      {
        field: 'loaiMonHoc',
        headerName: 'Loại Môn',
        type: 'string',
        minWidth: 130,
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
      }
    ];
  }, [data?.data]);
  return (
    <>
      <Typography className='!font-semibold !text-[18px]'>Danh sách môn học thuộc chương trình đào tạo</Typography>
      <Table
        ref={refTable}
        isDisableEdit
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
        urlNavigate='chi-tiet-chuong-trinh-dao-tao'
        placeholderSearch='Tìm kiếm chi tiết chương trình đào tạo...'
      />
      <PopupEdit queryKey={queryKey} onClose={handleCloseEdit} open={openEdit} khoas={khoas} getId={getId} />
    </>
  );
};

export default ListMonHoc;
