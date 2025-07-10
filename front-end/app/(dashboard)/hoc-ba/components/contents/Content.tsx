'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { alpha, Autocomplete, Box, MenuItem, TextField, Typography } from '@mui/material';
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
import {
  IParamBoMon,
  IParamGiangVien,
  IParamHocBa,
  IParamKhoa,
  IParamNganh,
  IParamPhongHoc,
  IParamSinhVien
} from '@/types/params';
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
import { HocKyLopHocPhan, IOption, TrangThaiLopHocPhanEnum, TrangThaiPhongHocEnum, TrangThaiSinhVienEnum } from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { HocBaService } from '@/services/HocBaService';
import { KetQuaHocBaEnum } from '@/models/HocBa';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import Input2 from '@/components/inputs/Input2';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { LoaiMonHocEnum } from '@/models/MonHoc';
const Table = dynamic(() => import('../tables/Table'), {
  ssr: false
});
interface ContentProps {
  queryKey: string;
  lopHocPhanServer?: any;
}
interface IFormData {
  mssv: string;
  hocky: IOption;
}
const Content = ({ queryKey, lopHocPhanServer }: ContentProps) => {
  const router = useRouter();
  const notification = useNotifications();
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [getMssv, setMssv] = useState<string>('');
  const queryClient = useQueryClient();
  const {register, handleSubmit, watch,control} = useForm<IFormData>({
    defaultValues: {
      mssv: '',
      hocky: HocKyLopHocPhan[0]
    }
  });
  const hocKy = watch('hocky');
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey, getMssv,hocKy?.id],
    queryFn: async () => {
      let params: IParamHocBa = {
        sortBy: 'hocky',
        sortByOrder: 'asc',
        mssv: getMssv
      };
      const result = await HocBaService.getAllHocBaByMssv(params);
      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!getMssv
  });
  const mutationDelete = useMutation({
    mutationFn: async (id: string | number | null) => {
      const result = await HocBaService.deleteHocBa(id);
      return result;
    },
    onSuccess: () => {
      notification.show('Xoá học bạ thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Xoá học bạ thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  console.log("data", data);
  const columns = useMemo((): GridColDef[] => {
    const formatKetQua = (status: number) => {
      switch (status) {
        case KetQuaHocBaEnum.DAT:
          return <ChipOption title='Đạt' color='info' />;
        case KetQuaHocBaEnum.KHONG_DAT:
          return <ChipOption title='Không đạt' color='error' />;
        default:
          return '';
      }
    };
    const formatLoaiMonHoc = (loaiMonHoc: number) => {
      switch (loaiMonHoc) {
        case LoaiMonHocEnum.CHUC_CHUNG_CHI:
          return 'CCC';
        case LoaiMonHocEnum.DO_AN_TOT_NGHIEP:
          return 'DATN';
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
        case LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP:
          return 'KL';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET:
          return 'TTN LT';
        case LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH:
          return 'TTN TH';
        default:
          return '';
      }
    }
    return [
      {
        field: 'mssv',
        headerName: 'MSSV',
        headerAlign: 'left',
        type: 'string',
        minWidth: 200,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        flex: 1,
        renderCell: (params: any) => {
          return params.row?.sinhVien?.mssv ? <Typography>{params.row?.sinhVien?.mssv}</Typography> : null;
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
        flex: 2,
        renderCell: (params: any) => {
          return params.row.chiTietChuongTrinhDaoTao.monHoc ? (
            <Typography>
              {params.row.chiTietChuongTrinhDaoTao.monHoc.tenMonHoc}
            </Typography>
          ) : null;
        }
      },
      {
        field: 'loaiMonHoc',
        headerName: 'Loại',
        type: 'string',
        minWidth: 50,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'center',
        headerAlign: 'center',
        flex: 0.6,
        renderCell: (params: any) => {  
          return formatLoaiMonHoc(params.row?.chiTietChuongTrinhDaoTao.loaiMonHoc)
        }
      },
      {
        field: 'chiTietChuongTrinhDaoTao',
        headerName: 'ĐVHP',
        type: 'string',
        minWidth: 50,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'center',
        headerAlign: 'center',
        flex: 0.6,
        renderCell: (params: any) => {
          return params.row.chiTietChuongTrinhDaoTao ? (
            <Typography>
              {params.row.chiTietChuongTrinhDaoTao.soTinChi}
            </Typography>
          ) : null;
        }
      },
      {
        field: 'diemTongKet',
        headerName: 'Tổng kết',
        type: 'number',
        minWidth: 50,
        disableColumnMenu: true,
        sortable: false,
        display: 'flex',
        align: 'center',
        headerAlign: 'center',
        flex: 1,
      }
    ];
  }, [data?.data]);
  const handleSubmitSearch = (data:IFormData) => {
    if (data.mssv) {
      setMssv(data.mssv);
    } else {
      setMssv('');
    }
    if (refTable.current) {
      refTable.current.handleClose();
    }
  }
  return (
    <Box className='flex flex-col gap-4'>
      <Box className='flex justify-between gap-4 flex-row  border border-gray-200 rounded-lg py-3 px-4 shadow-sm'>
        <form className='max-w-md w-full flex justify-center gap-2 items-center'  onSubmit={handleSubmit(handleSubmitSearch)}>
          <Input2
          className='flex-1'
            {...register('mssv')}
            placeholder='Nhập mã số sinh viên'
            isDisabled={false}
            type='number'
          />
          <LoadingButton type='submit' className='!border !border-solid !text-[14px] !leading-6' >Tìm kiếm</LoadingButton>
        </form>
        <Box className='flex justify-end items-center gap-4 w-full'>
          <Box className='max-w-[150px] w-full'>
             <Controller
            name={'hocky'}
            control={control}
            render={({ field }) => (
              <Autocomplete
                noOptionsText='Không có dữ liệu'
                value={field.value}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                }}
                clearIcon={<ClearIcon className={'w-4 h-4'} />}
                slotProps={{
                  clearIndicator: {
                    sx: {
                      padding: '8px !important',
                      color: (theme) => theme.palette.text.secondary,
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&:hover': {
                        color: (theme) => theme.palette.error.main,
                        backgroundColor: (theme) => `${alpha(theme.palette.error.main, 0.08)} !important`
                      },

                      '& svg': {
                        fontSize: '1.125rem !important'
                      }
                    }
                  },
                  popupIndicator: {
                    sx: {
                      padding: '8px !important',
                      color: (theme) => theme.palette.text.secondary,
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&:hover': {
                        color: (theme) => theme.palette.primary.main,
                        backgroundColor: (theme) => `${alpha(theme.palette.primary.main, 0.08)} !important`
                      },

                      // Target icon SVG
                      '& svg': {
                        fontSize: '1.25rem !important',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }
                  },

                  chip: {
                    className: 'mr-1',
                    sx: {
                      '& .MuiSvgIcon-root': {
                        color: alpha('#dd1313', 0.7),
                        '&:hover': {
                          color: '#dd1313'
                        }
                      }
                    }
                  }
                }}
                fullWidth
                id={`multiple-limit-hoc-ky`}
                options={HocKyLopHocPhan ?? []}
                getOptionLabel={(option) => option?.name || ''}
                getOptionKey={(option) => option?.id || ''}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option.id === value.id;
                }}
                renderInput={(params) => {
                  return <TextField {...params} placeholder={"Chọn học kỳ"} />;
                }}
                sx={(theme) => ({
                  mb: '3px',
                  '& .MuiOutlinedInput-root': {
                    height: 'unset',
                    margin: '0px',
                    padding: '4.573px 10px',
                    borderRadius: '8px !important',
                    borderColor:  alpha(theme.palette.grey[600], 0.5),
                    '& fieldset': {
                      borderColor: alpha(theme.palette.divider, 0.5)
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.5)
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: alpha(theme.palette.primary.main, 0.5)
                    }
                  },

                  '& .MuiAutocomplete-endAdornment': {
                    '& .MuiIconButton-root': {
                      padding: '8px !important',
                      border: 'none !important',
                      backgroundColor: 'transparent !important',

                      '&[title="Open"]': {
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: `${theme.palette.primary.main} !important`,
                          backgroundColor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
                          transform: 'rotate(180deg)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      },
                      '&[title="Clear"]': {
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: `${theme.palette.error.main} !important`,
                          backgroundColor: `${alpha(theme.palette.error.main, 0.08)} !important`,
                          transform: 'scale(1.1)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      },

                      '& svg': {
                        fontSize: '1.25rem !important',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }
                  }
                })}
              />
            )}
          />
          </Box>
              <Box className="flex items-center justify-center">
          <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.HOC_BA.ADD)} />
        </Box>
        </Box>
      </Box>
      <Table
        ref={refTable}
        rows={data?.listHocBa}
        columns={columns}
        isFetching={isFetching}
        isLoading={isLoading}
        handleDeleteCallBack={handleDelete}
        customToolBar
        urlNavigate='hoc-ba'
        placeholderSearch='Tìm kiếm học bạ...'
      />
    </Box>
  );
};

export default Content;
