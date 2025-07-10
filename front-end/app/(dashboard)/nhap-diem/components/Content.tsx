'use client';
import { handleTextSearch } from '@/lib/string';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { IParamChiTietLopHocPhan, IParamChuongTrinhDaoTao, IParamLopHocPhan, IParamLopHocPhan2 } from '@/types/params';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { GridColDef, GridFilterModel, useGridApiRef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import React, { Fragment, memo, ReactNode, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GiangVienService } from '@/services/GiangVienService';
import SelectEditCell from '../selects/SelectEditCell';
import dynamic from 'next/dynamic';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import moment from 'moment';
import { useNotifications } from '@toolpad/core';
import { IOption, LoaiLopHocPhan, TrangThaiLopHocPhanEnum } from '@/types/options';
import InputSelect2 from '@/components/selects/InputSelect2';
import { usePopoverLock } from '@/hooks/context/PopoverLock';
import { get, set, sortBy } from 'lodash';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import { useUser } from '@/stores/selectors';
import Link from 'next/link';
import { APP_ROUTE } from '@/types/general';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { fi } from 'zod/v4/locales';
import { ChiTietLopHocPhan } from '@/models/ChiTietLopHocPhan';
import { HocBaService } from '@/services/HocBaService';
import { useForm } from 'react-hook-form';
const TableEdit = dynamic(() => import('./TableEdit'), {
  ssr: false
});

interface IContentProps {
  queryKey: string;
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

const Content = ({ queryKey }: IContentProps) => {
    const { control, getValues,setValue } = useForm<IFilter>({
    defaultValues: {
      hocKy: null,
      loaiChuongTrinh: null,
      lopHocPhan:  null,
      khoa: null
    }
  });
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const user = useUser();
  const apiRef = useGridApiRef();
  const [giangVienOptions, setGiangVienOptions] = useState<{ [khoaId: string]: any[] }>({});
  // const [loaiLopHocPhan, setloaiLopHocPhan] = useState<number | null>(null);
  const [filter, setfilter] = useState<{
    hocKy: number;
    loaiChuongTrinh: number;
    lopHocPhan: {
      id: string;
      name: string;
      monHocId: string;
      chuongTrinhDaoTaoId: string;
      loaiMonHoc: number;
    } | null;
    khoa: number;
  } | null>(null);
  const filterRef = useRef(filter);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [isOpenPopover, setisOpenPopover] = useState<boolean>(false);
  const { data:queryData, isLoading } = useQuery({
    queryKey: [queryKey, filterModel,filter?.lopHocPhan?.id],
    queryFn: async () => {
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamChiTietLopHocPhan = {
        lopHocPhanId: filter?.lopHocPhan?.id as any,
      };
      if (searchKeyWord) {
        params = {
          ...params,
          search: searchKeyWord
        };
      }
      const result = await ChiTietLopHocPhanService.getAllChiTietLopHocPhanByLopHocPhanId(
        getValues("lopHocPhan")?.id as any,
        params
      );
      return result;
    },
    enabled: !!filter?.lopHocPhan?.id && !!filter?.khoa && !!filter?.hocKy && !!filter?.loaiChuongTrinh,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
  const data = useMemo(() => {
  const hasRequiredValues = !!filter?.lopHocPhan?.id && 
                           !!filter?.khoa && 
                           !!filter?.hocKy && 
                           !!filter?.loaiChuongTrinh;

  if (!hasRequiredValues) {
    return { data: [] };
  }
  return queryData || [];
}, [queryData, filter?.lopHocPhan?.id, filter?.khoa, filter?.hocKy, filter?.loaiChuongTrinh]);
  const { data: lhp, isLoading: isLoadingLHP } = useQuery({
    queryKey: ['lhp-list',filter?.khoa, filter?.hocKy, filter?.loaiChuongTrinh, user?.id],
    queryFn: async () => {
      const params: IParamLopHocPhan2 = {
        khoa: filter?.khoa,
        hocky: filter?.hocKy,
        loaiChuongTrinhDaoTao: filter?.loaiChuongTrinh,
        giangVienId: user?.id
      };
      const result = await LopHocPhanService.getLopHocPhanByGiangVienId(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.maHocPhan.split("_")[0],
        loaiMonHoc: item.monHoc?.chiTietChuongTrinhDaoTao?.loaiMonHoc,
        monHocId: item.monHocId,
        chuongTrinhDaoTaoId: item.monHoc?.chiTietChuongTrinhDaoTao?.chuongTrinhDaoTao?.id
      }));
    },
    refetchOnWindowFocus: false,
    enabled: !!user && !!filter?.khoa && !!filter?.hocKy && !!filter?.loaiChuongTrinh
  });

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);
  const mutateSaving = useMutation({
    mutationFn: async (data: any) => {
      const result = await ChiTietLopHocPhanService.nhapDiemLopHocPhan(data);
      return result;
    },
    onSuccess: async (data) => {
      notification.show('Sửa điểm thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error) => {
      notification.show('Sửa điểm thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const mutationNopDiem = useMutation({
    mutationFn: async (data: any) => {
      const result = await HocBaService.nopDiemHocBa(data);
      return result;
    },
    onSuccess: async (data) => {
      notification.show('Nộp điểm thành công ', {
        severity: 'success',
        autoHideDuration: 5000
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Nộp điểm thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).format('DD/MM/YYYY');
    };
    return [
      {
        field: 'stt',
        headerName: 'STT',
        type: 'number',
        headerAlign: 'left',
        minWidth: 50,
        flex: 0.4,
        sortable: false,
        display: 'flex',
        align: 'center',
        editable: false,
        disableColumnMenu: true
      },
      {
        field: 'sinhVien',
        headerName: 'Mã số',
        type: 'string',
        headerAlign: 'left',
        minWidth: 120,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.value?.mssv ? (
            <Link
              href={APP_ROUTE.SINH_VIEN.EDIT(params.value?.id)}
              className='hover:underline text-blue-600 hover:text-blue-500 transition-colors duration-200 ease-in-out'
            >{`${params.value?.mssv}`}</Link>
          ) : null;
        }
      },
      {
        field: 'hoTen',
        headerName: 'Họ tên',
        type: 'string',
        headerAlign: 'left',
        minWidth: 120,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.row?.sinhVien?.hoTen ? (
            <Typography variant='body2'>{`${params.row?.sinhVien?.hoTen}`}</Typography>
          ) : null;
        }
      },
      {
        field: 'ngaySinh',
        headerName: 'Ngày sinh',
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
          return <Typography variant='body2'>{formatDateBirth(params.row?.sinhVien?.ngaySinh)}</Typography>;
        }
      },
      {
        field: 'lopHocPhan',
        headerName: 'Lớp học',
        headerAlign: 'left',
        minWidth: 120,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.value ? <Typography>{`${params.value?.maHocPhan?.split('_')[0]}`}</Typography> : null;
        }
      },
      {
        field: 'diemChuyenCan',
        headerName: 'C.Cần',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
      align: 'center',
        editable: true,
        disableColumnMenu: true,
        preProcessEditCellProps: (params) => {
           const rawValue = params.props.value;
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
              return { ...params.props, value: null, error: false };
            }
            const value = Number(rawValue);
            console.log('value', params.hasChanged);
          if (isNaN(value) || value < 1 || value > 10) {
              return { ...params.props, value: null, error: false };
            }
            return { ...params.props, value, error: false };
        },
        valueGetter: (params) => {
          if(params === null || params === '' || params === undefined){
            return null;
          }
          const convertNumber = Number(params);
          if (isNaN(convertNumber) || convertNumber < 1 || convertNumber > 10) {
            return null;
          }
          return params
        },
        cellClassName: (params) => {
          return 'cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out';
        }
      },
      {
        field: 'diemTrungBinh',
        headerName: 'ĐTB',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
         align: 'center',
        editable: true,
        disableColumnMenu: true,
        cellClassName: (params) => {
          return 'cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out';
        },
            preProcessEditCellProps: (params) => {
           const rawValue = params.props.value;
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
              return { ...params.props, value: null, error: false };
            }
            const value = Number(rawValue);
            console.log('value', params.hasChanged);
          if (isNaN(value) || value < 1 || value > 10) {
              return { ...params.props, value: null, error: false };
            }
            return { ...params.props, value, error: false };
        },
        valueGetter: (params) => {
          if(params === null || params === '' || params === undefined){
            return null;
          }
          const convertNumber = Number(params);
          if (isNaN(convertNumber) || convertNumber < 1 || convertNumber > 10) {
            return null;
          }
          return params
        }
      },
      {
        field: 'diemThi1',
        headerName: 'Đ.Thi 1',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
         align: 'center',
        editable: true,
        disableColumnMenu: true,
           preProcessEditCellProps: (params) => {
           const rawValue = params.props.value;
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
              return { ...params.props, value: null, error: false };
            }
            const value = Number(rawValue);
            console.log('value', params.hasChanged);
          if (isNaN(value) || value < 1 || value > 10) {
              return { ...params.props, value: null, error: false };
            }
            return { ...params.props, value, error: false };
        },
        valueGetter: (params) => {
          if(params === null || params === '' || params === undefined){
            return null;
          }
          const convertNumber = Number(params);
          if (isNaN(convertNumber) || convertNumber < 1 || convertNumber > 10) {
            return null;
          }
          return params
        },
        cellClassName: (params) => {
          return 'cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out';
        }
      },
      {
        field: 'diemThi2',
        headerName: 'Đ.Thi 2',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
          align: 'center',
        editable: true,
        disableColumnMenu: true,
            preProcessEditCellProps: (params) => {
           const rawValue = params.props.value;
            if (rawValue === '' || rawValue === null || rawValue === undefined) {
              return { ...params.props, value: null, error: false };
            }
            const value = Number(rawValue);
            console.log('value', params.hasChanged);
          if (isNaN(value) || value < 1 || value > 10) {
              return { ...params.props, value: null, error: false };
            }
            return { ...params.props, value, error: false };
        },
        valueGetter: (params) => {
          if(params === null || params === '' || params === undefined){
            return null;
          }
          const convertNumber = Number(params);
          if (isNaN(convertNumber) || convertNumber < 1 || convertNumber > 10) {
            return null;
          }
          return params
        },
        cellClassName: (params) => {
          return 'cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out';
        }
      },
      {
        field: 'diemTongKet1',
        headerName: 'T.Kết lần 1',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
        align: 'center',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          let total = null;
          if (filter?.lopHocPhan?.loaiMonHoc === LoaiMonHocEnum.LY_THUYET) {
            if (params.row?.diemThi1) {
              total = (
                params.row?.diemChuyenCan * 0.1 +
                params.row?.diemTrungBinh * 0.4 +
                params.row?.diemThi1 * 0.5
              ).toFixed(1);
            }
          }
          if (filter?.lopHocPhan?.loaiMonHoc === LoaiMonHocEnum.MODUN) {
            if (params.row?.diemThi1) {
              total = (params.row?.diemTrungBinh * 0.4 + params.row?.diemThi1 * 0.5).toFixed(1);
            }
          }
          return total;
        }
      },
      {
        field: 'diemTongKet2',
        headerName: 'T.Kết lần 2',
        headerAlign: 'left',
        minWidth: 50,
        flex: 1,
        type: 'number',
        sortable: false,
        display: 'flex',
         align: 'center',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          let total = null;
          if (params.row?.diemThi2) {
            total = (
              params.row?.diemChuyenCan * 0.1 +
              params.row?.diemTrungBinh * 0.4 +
              params.row?.diemThi2 * 0.5
            ).toFixed(1);
          }
          return total;
        }
      },
      {
        field: 'ghiChu',
        headerName: 'Ghi chú',
        headerAlign: 'left',
        minWidth: 100,
        flex: 1,
        type: 'string',
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: true,
        disableColumnMenu: true,
        renderCell: (params) => {
          // Hiển thị text ngắn gọn khi chưa edit
          return (
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
                width: '100%'
              }}
            >
              {params.value}
            </span>
          );
        },
        renderEditCell: (params) => (
          <Box className='w-full h-full relative'>
            <input
              type='text'
              value={params.value ?? ''}
              onChange={(e) =>
                params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value })
              }
              className="
              !border-0 outline-none w-full h-full bg-transparent"
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                MozAppearance: 'textfield'
              }}
            />
          </Box>
        )
      }
    ];
  }, [data?.data, giangVienOptions, filter?.lopHocPhan?.loaiMonHoc]);
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
  const handleSave = useCallback((item: any) => {
      const lopHocPhan = getValues('lopHocPhan');
      const khoa = getValues('khoa');
      const hocKy = getValues('hocKy');
      const loaiChuongTrinh = getValues('loaiChuongTrinh');
     if (
      !lopHocPhan?.id ||
      !khoa?.id ||
      !hocKy?.id ||
      !loaiChuongTrinh?.id ||
      !lopHocPhan?.monHocId ||
      !lopHocPhan?.chuongTrinhDaoTaoId
    ) {
      notification.show('Vui lòng chọn đầy đủ thông tin trước khi lưu điểm', {
        severity: 'warning',
        autoHideDuration: 5000
      });
      return;
    }
    if (item && item.length === 0) {
      notification.show('Không có dữ liệu để lưu', {
        severity: 'warning',
        autoHideDuration: 5000
      });
      return;
    }
    const convertData = item?.map((item: any) => ({
      id: item.id,
      diemChuyenCan: item.diemChuyenCan,
      diemTrungBinh: item.diemTrungBinh,
      diemThi1: item.diemThi1,
      diemThi2: item.diemThi2,
      diemTongKet1: item.diemTongKet1,
      diemTongKet2: item.diemTongKet2,
      ghiChu: item?.ghiChu || ''
    }));
    const finalData = {
      listDiemSo: convertData,
      loaiMonHoc: lopHocPhan?.loaiMonHoc 
    };
    mutateSaving.mutate(finalData);
  }, [data, notification, mutateSaving]);

  const handleNopDiem = async () => {
const lopHocPhan = getValues('lopHocPhan');
    const khoa = getValues('khoa');
    const hocKy = getValues('hocKy');
    const loaiChuongTrinh = getValues('loaiChuongTrinh');
    if (
      !lopHocPhan?.id ||
      !khoa?.id ||
      !hocKy?.id ||
      !loaiChuongTrinh?.id ||
      !lopHocPhan?.monHocId ||
      !lopHocPhan?.chuongTrinhDaoTaoId ||
      (data && data?.data?.length === 0)
    ) {
      notification.show('Vui lòng chọn đầy đủ thông tin trước khi nộp điểm', {
        severity: 'warning',
        autoHideDuration: 5000
      });
      return;
    }
    const rowIds = apiRef.current?.getRowModels();
    const allRows = Array.from(rowIds?.values() || []);
    const convertData = allRows?.filter(item => item?.sinhVienId)?.map((item) => ({
      DiemTongKet1: item?.diemTongKet1 || 0,
      DiemTongKet2: item?.diemTongKet2 || 0,
      SinhVienId: item?.sinhVienId
    }));
    const checkIsDiemTongKet1 = convertData?.some((item) => item?.DiemTongKet1 === 0 || item?.DiemTongKet1 === undefined);
    if (checkIsDiemTongKet1) {
      notification.show('Vui lòng nhập điểm tổng kết hoặc lưu điểm trước khi nộp', {
        severity: 'warning',
        autoHideDuration: 4000
      });
      return;
    } 
    if (convertData.length === 0) {
      notification.show('Không có dữ liệu để nộp điểm', {
        severity: 'warning',
        autoHideDuration: 4000
      });
      return;
    }
    const finalData = {
      ListDiemSo: convertData,
      LopHocPhanId: lopHocPhan?.id,
      MonHocId: lopHocPhan?.monHocId,
    };
    mutationNopDiem.mutate(finalData);
  };
  return (
    <Box className='flex flex-col gap-4'>
      <TableEdit
        queryKey={queryKey}
        apiRef={apiRef}
        lopHocPhan={lhp}
        isLoadingLHP={isLoadingLHP}
        setFilterModel={setFilterModel}
        handleSave={handleSave}
        row={data}
        columns={columns}
        isLoading={isLoading}
        handleNopDiem={handleNopDiem}
        setfilter={setfilter}
        filter={filter}
        control={control}
        setValue={setValue}
        isMutateSavingPending={mutateSaving.isPending}
        isMutateNopDiemPending={mutationNopDiem.isPending}
        // contentPopover={handleShowFilter}
        // isOpen={isOpenPopover}
        // handleClick={handleOpenPopover}
        // onClose={handleClosePopover}
      />
    </Box>
  );
};

export default memo(Content);
