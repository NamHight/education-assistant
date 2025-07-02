'use client';
import { handleTextSearch } from '@/lib/string';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import {
  IParamBoMon,
  IParamChiTietLopHocPhan,
  IParamChuongTrinhDaoTao,
  IParamGiangVien,
  IParamLichBieu,
  IParamLopHocPhan,
  IParamLopHocPhan2,
  IParamTuan
} from '@/types/params';
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
import { set, sortBy } from 'lodash';
import { ChiTietLopHocPhanService } from '@/services/ChiTietLopHocPhanService';
import { useUser } from '@/stores/selectors';
import Link from 'next/link';
import { APP_ROUTE } from '@/types/general';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { fi } from 'zod/v4/locales';
import { ChiTietLopHocPhan } from '@/models/ChiTietLopHocPhan';
import { HocBaService } from '@/services/HocBaService';
import { LichBieuService } from '@/services/LichBieuService';
import { BoMonService } from '@/services/BoMonService';
import { TuanService } from '@/services/TuanService';
import ModalAdd from './ModalAdd';
const TableEdit = dynamic(() => import('./TableEdit'), {
  ssr: false
});

interface IContentProps {
  queryKey: string;
  giangVienServer?: any[];
  boMonServer?: any[];
}

const Content = ({ queryKey, giangVienServer, boMonServer }: IContentProps) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const user = useUser();
  const apiRef = useGridApiRef();
  const [giangVienOptions, setGiangVienOptions] = useState<{ [khoaId: string]: any[] }>({});

  const [sortModel, setSortModel] = useState<Record<string, string | null | undefined>>({
    field: '',
    sort: ''
  });
  const [filterWeek, setfilterWeek] = useState<{
    tuanVao: string;
    tuanDen: string;
  } | null>(null);
  const [filter, setfilter] = useState<{
    khoa: number | string;
    tuan: string;
    boMon: {
      id: string;
      name: string;
    };
    giangVien: {
      id: string;
      name: string;
    };
  } | null>(null);
  const filterRef = useRef(filter);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [isOpenPopover, setisOpenPopover] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, filterModel, filter, sortModel],
    queryFn: async () => {
      if (!filter?.boMon?.id || !filter?.tuan || !filter?.giangVien?.id) {
        return [];
      }
      const searchKeyWord = handleTextSearch(filterModel?.quickFilterValues as any[]);
      let params: IParamLichBieu = {
        boMonId: filter.boMon.id,
        giangVienId: filter.giangVien.id,
        tuanId: filter.tuan
      };
      if (sortModel?.field && sortModel?.sort) {
        params = {
          ...params,
          sortBy: sortModel.field,
          sortByOrder: sortModel.sort === 'asc' ? 'asc' : 'desc'
        };
      }
      if (searchKeyWord) {
        params = {
          ...params,
          search: searchKeyWord
        };
      }
      const result = await LichBieuService.getLichBieuByKhoa(params);
      return result;
    },
    enabled: !!filter?.boMon?.id && !!filter?.tuan && !!filter?.giangVien?.id,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    gcTime: 0
  });
  const { data: giangViens, isLoading: isLoadingGV } = useQuery({
    queryKey: ['giang-vien-list', filter?.boMon?.id],
    queryFn: async () => {
      const result = await GiangVienService.getGiangVienByBoMonId(filter?.boMon?.id);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.hoTen,
        boMon: { id: item.boMon?.id, name: item.boMon?.tenBoMon }
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!user && !!filter?.boMon?.id
  });
  const { data: boMon, isLoading: isLoadingBM } = useQuery({
    queryKey: ['bo-mon-list'],
    queryFn: async () => {
      const result = await BoMonService.getAllBoMonNoPage();
      return result;
    },
    initialData: boMonServer,
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.tenBoMon
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!user
  });
  const { data: tuans, isLoading: isLoadingTuan } = useQuery({
    queryKey: ['tuan-list', filter?.khoa],
    queryFn: async () => {
      const params: IParamTuan = {
        namHoc: filter?.khoa
      };
      const result = await TuanService.getAllTuanByNamHoc(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: `${item.soTuan}`
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!filter?.khoa
  });
  const { data: tuanDens, isLoading: isLoadingTuanDen } = useQuery({
    queryKey: ['tuan-den-list', filterWeek?.tuanVao],
    queryFn: async () => {
      const params: IParamTuan = {
        namHoc: filter?.khoa,
        GiangVienId: filter?.giangVien?.id,
        TuanBatDauId: filterWeek?.tuanVao
      };
      const result = await TuanService.getAllTuanDenByTuanVao(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: `${item.soTuan}`
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!user && !!filterWeek?.tuanVao && !!filter?.khoa && !!filter?.giangVien?.id
  });
  const mutationCopy = useMutation({
    mutationFn: async (data: any) => {
      const response = await LichBieuService.copyLichBieu(data);
      return response;
    },
    onSuccess: (data) => {
      notification.show('Sao chép lịch thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || `Lỗi khi sao chép lịch`, {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
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
    onError: (error) => {
      notification.show('Nộp điểm thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const columns = useMemo((): GridColDef[] => {
    const formatDateBirth = (date: string) => {
      return moment(date).format('DD/MM/YYYY');
    };
    const handleFormatType = (type: number | null) => {
      switch (type) {
        case LoaiMonHocEnum.LY_THUYET:
          return 'LT';
        case LoaiMonHocEnum.THUC_HANH:
          return 'TH';
        case LoaiMonHocEnum.MODUN:
          return 'MD';
        case LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP:
          return 'TTTN';
        case LoaiMonHocEnum.KIEN_TAP:
          return 'KT';
        case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
          return 'DATN';
        case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
          return 'KL';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
          return 'TTN-LT';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
          return 'TTN-TH';
        case LoaiMonHocEnum.CHUC_CHUNG_CHI:
          return 'CCC';
        default:
          return '';
      }
    };
    return [
      {
        field: 'phanCong',
        headerName: 'Phân công',
        type: 'string',
        headerAlign: 'left',
        minWidth: 250,
        flex: 2,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params.row?.lopHocPhan ? (
            <Typography variant='body2'>{`${params.row?.lopHocPhan?.maHocPhan} - ${params.row?.lopHocPhan?.monHoc?.tenMonHoc}`}</Typography>
          ) : null;
        }
      },
      {
        field: 'loai',
        headerName: 'Loại',
        type: 'string',
        headerAlign: 'left',
        minWidth: 60,
        flex: 0.4,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return handleFormatType(params.row?.lopHocPhan?.monHoc?.chiTietChuongTrinhDaoTao?.loaiMonHoc);
        }
      },
      {
        field: 'SiSo',
        headerName: 'Sĩ số',
        type: 'number',
        headerAlign: 'left',
        minWidth: 60,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.lopHocPhan?.siSo ? (
            <Typography variant='body2'>{params?.row?.lopHocPhan?.siSo}</Typography>
          ) : (
            <Typography variant='body2'>0</Typography>
          );
        }
      },
      {
        field: 'phongHoc',
        headerName: 'Phòng',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params: any) => {
          return params.row?.phongHoc?.tenPhong ? (
            <Typography variant='body2'>{params.row?.phongHoc?.tenPhong}</Typography>
          ) : (
            <Typography variant='body2'></Typography>
          );
        }
      },
      {
        field: 't2',
        headerName: 'Thứ 2',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 2 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't3',
        headerName: 'Thứ 3',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 3 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't4',
        headerName: 'Thứ 4',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 4 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't5',
        headerName: 'Thứ 5',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 5 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't6',
        headerName: 'Thứ 6',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 6 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't7',
        headerName: 'Thứ 7',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 7 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 't8',
        headerName: 'Thứ 8',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 0.5,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return params?.row?.thu === 8 ? (
            <Typography variant='body2'>{`${params.row?.tietBatDau} - ${params.row?.tietKetThuc}`}</Typography>
          ) : (
            <Typography variant='body2'>-</Typography>
          );
        }
      },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'string',
        headerAlign: 'left',
        minWidth: 80,
        flex: 1,
        sortable: false,
        display: 'flex',
        align: 'left',
        editable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          return null;
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
    const currentFilter = filterRef.current;
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
    return;
    mutateSaving.mutate({});
  };
  const handleCopy = () => {
    if (!user || !filterWeek?.tuanVao || !filterWeek?.tuanDen || !filter?.giangVien?.id || !filter?.khoa) {
      notification.show('Vui lòng chọn đầy đủ thông tin để sao chép lịch', {
        severity: 'warning',
        autoHideDuration: 6000
      });
      return;
    }
    const allRowValues = Array.from(apiRef.current?.getRowModels().values() || []);
    const lichBieus = allRowValues.map((item) => ({
      id: item?.id,
      tietBatDau: item?.tietBatDau || 0,
      tietKetThuc: item?.tietKetThuc || 0,
      thu: item?.thu || 0,
      tuanId: item?.tuanId || null,
      lopHocPhanId: item?.lopHocPhanId || null,
      phongHocId: item?.phongHocId || null
    }));
    const finalResult = {
      lichBieus: lichBieus,
      namHoc: filter?.khoa,
      vaoTuanId: filterWeek?.tuanVao,
      denTuanId: filterWeek?.tuanDen,
      giangVienId: filter?.giangVien?.id
    };
    console.log('finalResult', finalResult);
    mutationCopy.mutate(finalResult);
  };
  return (
    <Box className='flex flex-col gap-4'>
      <TableEdit
        boMon={boMon}
        isLoadingBM={isLoadingBM}
        queryKey={queryKey}
        apiRef={apiRef}
        giangViens={giangViens}
        isLoadingGV={isLoadingGV}
        setFilterModel={setFilterModel}
        handleSave={handleSave}
        row={data}
        columns={columns}
        isLoading={isLoading}
        setfilter={setfilter}
        setSortModel={setSortModel}
        filter={filter}
        tuans={tuans}
        tuanDens={tuanDens}
        filterWeek={filterWeek}
        isLoadingTuanDen={isLoadingTuanDen}
        isLoadingTuan={isLoadingTuan}
        setfilterWeek={setfilterWeek}
        handleCopy={handleCopy}
        handleOpenModal={handleClickOpen}
        // contentPopover={handleShowFilter}
        // isOpen={isOpenPopover}
        // handleClick={handleOpenPopover}
        // onClose={handleClosePopover}
      />
      <ModalAdd open={open} handleClose={handleClose} queryKey={queryKey} />
    </Box>
  );
};

export default memo(Content);
