'use client';
import { handleTextSearch } from '@/lib/string';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { IParamChuongTrinhDaoTao, IParamLopHocPhan } from '@/types/params';
import { Box, Typography } from '@mui/material';
import { GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import React, { memo, useEffect, useMemo, useState } from 'react';

import { GiangVienService } from '@/services/GiangVienService';
import SelectEditCell from '../selects/SelectEditCell';
import dynamic from 'next/dynamic';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import moment from 'moment';
import { useNotifications } from '@toolpad/core';
import { TrangThaiLopHocPhanEnum } from '@/types/options';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';

const TableEdit = dynamic(() => import('@/app/(dashboard)/phan-cong/tables/TableEdit'), {
  ssr: false
});

interface IContentProps {
  queryKey: string;
  ctdtServer?: any;
}

const Content = ({ queryKey, ctdtServer }: IContentProps) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [giangVienOptions, setGiangVienOptions] = useState<{ [khoaId: string]: any[] }>({});
  // const [loaiLopHocPhan, setloaiLopHocPhan] = useState<number | null>(null);
  const [filter, setfilter] = useState<{
    hocKy: number;
    loaiChuongTrinh: number;
    chuongTrinh: string;
    khoa: number;
  } | null>(null);
  const [sortModel, setSortModel] = useState<Record<string, string | null | undefined>>({
    field: '',
    sort: ''
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const { setTitle } = useBreadcrumb();
  const [isOpenPopover, setisOpenPopover] = useState<boolean>(false);
  const { data, isLoading } = useQuery({
    queryKey: [
      queryKey,
      sortModel,
      filterModel,
      filter?.hocKy,
      filter?.loaiChuongTrinh,
      filter?.chuongTrinh,
      filter?.khoa
    ],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLopHocPhan = {
        trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG,
        chuongTrinhDaoTaoId: filter?.chuongTrinh,
        hocKy: filter?.hocKy,
        khoa: filter?.khoa,
        loaiChuongTrinhDaoTao: filter?.loaiChuongTrinh,
        limit: 99999999
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
      const result = await LopHocPhanService.getAllLopHocPhan(params);
      return result;
    },
    enabled: !!filter?.chuongTrinh && !!filter?.khoa && !!filter?.hocKy && !!filter?.loaiChuongTrinh,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
  const { data: ctdt, isLoading: isLoadingCtdt } = useQuery({
    queryKey: ['ctdt-list'],
    queryFn: async () => {
      const params: IParamChuongTrinhDaoTao = {
        limit: 999999,
        sortBy: 'createdat',
        sortByOrder: 'desc'
      };
      const result = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTao(params);
      return result?.data;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.tenChuongTrinh
      }));
    },
    initialData: ctdtServer,
    refetchOnWindowFocus: false
  });
  const mutateSaving = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await LopHocPhanService.phanCongLopHocPhan(data);
      return result;
    },
    onSuccess: async (data) => {
      notification.show('Phân công thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error) => {
      notification.show('Phân công thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  useEffect(() => {
    setTitle('Phân công');
    return () => setTitle('');
  }, []);
  const fetchGiangVienByKhoaId = async (khoaId: string) => {
    if (giangVienOptions[khoaId]) return giangVienOptions[khoaId];
    const result = await GiangVienService.getGiangVienByKhoaId(khoaId);
    const options =
      result?.map((item: any) => ({
        value: item.id,
        label: item.hoTen
      })) || [];
    setGiangVienOptions((prev) => ({ ...prev, [khoaId]: options }));
    return options;
  };

  const columns = useMemo((): GridColDef[] => {
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
        field: 'maHocPhan',
        headerName: 'Mã học phần',
        type: 'string',
        headerAlign: 'left',
        minWidth: 100,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return <Typography variant='body2'>{`${params.value}`}</Typography>;
        }
      },
      {
        field: 'monHoc',
        headerName: 'Môn học',
        headerAlign: 'left',
        minWidth: 200,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.value ? <Typography>{`${params.value?.tenMonHoc}`}</Typography> : null;
        }
      },
      {
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.8,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.row?.monHoc ? formatType(params.row?.monHoc?.chiTietChuongTrinhDaoTao?.loaiMonHoc) : null;
        }
      },
      {
        field: 'giangVienId',
        headerName: 'Giảng viên',
        headerAlign: 'left',
        minWidth: 160,
        sortable: false,
        filterable: false,
        type: 'singleSelect',
        hideable: false,
        disableColumnMenu: true,
        align: 'left',
        display: 'flex',
        editable: true,
        flex: 1,
        cellClassName: (params) => {
          return 'cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out';
        },
        renderEditCell: (params) => (
          <SelectEditCell
            params={params}
            giangVienOptions={giangVienOptions}
            fetchGiangVienByKhoaId={fetchGiangVienByKhoaId}
          />
        ),
        renderCell: (params) => {
          if (!params.value) return null;
          const khoaId = params.row?.monHoc?.khoaId;
          const giangVien = giangVienOptions[khoaId]?.find((item: any) => item.value === params.value);
          return giangVien ? (
            <Typography variant='body2' className='text-blue-500 hover:underline'>
              {giangVien.label}
            </Typography>
          ) : params.row?.giangVien ? (
            <Typography variant='body2' className='text-blue-500 hover:underline'>
              {params.row?.giangVien?.hoTen}
            </Typography>
          ) : null;
        }
      }
    ];
  }, [data?.data, giangVienOptions]);
  const handleOpenPopover = () => {
    setisOpenPopover(true);
  };
  const handleClosePopover = () => {
    setisOpenPopover(false);
  };
  // const handleShowFilter = useMemo((): ReactNode => {
  //   return (
  //     <Fragment>
  //       <Select
  //         fullWidth
  //         displayEmpty
  //         value={loaiLopHocPhan ?? ''}
  //         onChange={(e) => {
  //           setloaiLopHocPhan(Number(e.target.value) || null);
  //         }}
  //         renderValue={(selected) => {
  //           if (!selected) return <em>Chọn loại lớp học phần</em>;
  //           const selectedOption = (LoaiLopHocPhan ?? []).find((option) => option.id === Number(selected));
  //           return selectedOption ? selectedOption.name : '';
  //         }}
  //       >
  //         <MenuItem value=''>
  //           <em>Chọn loại lớp học phần</em>
  //         </MenuItem>
  //         {(LoaiLopHocPhan ?? []).map((option) => (
  //           <MenuItem key={option.id} value={option.id}>
  //             {option.name}
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </Fragment>
  //   );
  // }, [loaiLopHocPhan]);
  const handleSave = (item: any) => {
    if (item && item.length === 0) {
      notification.show('Không có dữ liệu để lưu', {
        severity: 'warning',
        autoHideDuration: 5000
      });
      return;
    }
    const convertData = item?.map((item: any) => ({
      id: item.id,
      maHocPhan: item.maHocPhan,
      siSo: item.siSo,
      trangThai: item.trangThai,
      monHocId: item.monHoc?.id,
      giangVienId: item?.giangVienId,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }));
    console.log('convertData', convertData);
    mutateSaving.mutate(convertData);
  };
  return (
    <Box className='flex flex-col gap-4'>
      <TableEdit
        chuongTrinhDaotao={ctdt}
        isLoadingCtdt={isLoadingCtdt}
        setSortModel={setSortModel}
        setFilterModel={setFilterModel}
        handleSave={handleSave}
        row={data?.data}
        columns={columns}
        isLoading={isLoading}
        setfilter={setfilter}
        // contentPopover={handleShowFilter}
        // isOpen={isOpenPopover}
        // handleClick={handleOpenPopover}
        // onClose={handleClosePopover}
      />
    </Box>
  );
};

export default memo(Content);
