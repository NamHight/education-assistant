'use client';

import ToolTipImage from '@/components/tooltips/ToolTipImage';
import { alpha, Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
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
import {
  HocKyLopHocPhan,
  IOption,
  TrangThaiLopHocPhanEnum,
  TrangThaiPhongHocEnum,
  TrangThaiSinhVienEnum
} from '@/types/options';
import { GioiTinhEnum } from '@/models/GiangVien';
import { KhoaService } from '@/services/KhoaService';
import { MonHocService } from '@/services/MonHocService';
import { NganhService } from '@/services/NganhService';
import { BoMonService } from '@/services/BoMonService';
import { PhongHocService } from '@/services/PhongHocService';
import { LoaiPhongHocEnum } from '@/models/PhongHoc';
import { HocBaService } from '@/services/HocBaService';
import { HocBa, KetQuaHocBaEnum } from '@/models/HocBa';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import Input2 from '@/components/inputs/Input2';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { LoaiMonHocEnum } from '@/models/MonHoc';
import { Trash2 } from 'lucide-react';
import useCheckPermission from '@/helper/useCheckPermission';
import ModalEdit from '../Modals/ModalEdit';

interface ContentProps {
  queryKey: string;
}
interface IFormData {
  mssv: string;
  hocky: IOption;
}
const Content = ({ queryKey }: ContentProps) => {
  const router = useRouter();
  const [idHocBa, setIdHocBa] = useState<string | null>(null);
  const notification = useNotifications();
  const { isAdmin } = useCheckPermission();
  const refTable = useRef<{ handleClose: () => void; handleOpenDelete: () => void; handleCloseDelete: () => void }>(
    null
  );
  const [getMssv, setMssv] = useState<string>('');
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch } = useForm<IFormData>({
    defaultValues: {
      mssv: '',
      hocky: HocKyLopHocPhan[0]
    }
  });
    const [open, setOpen] = React.useState(false);
  const hocKy = watch('hocky');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, getMssv, hocKy?.id],
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
    };

  console.log('data', data);
  const handleDelete = (id: string | number | null) => {
    mutationDelete.mutate(id);
  };
  const handleSubmitSearch = (data: IFormData) => {
    if (data.mssv) {
      setMssv(data.mssv);
    } else {
      setMssv('');
    }
    if (refTable.current) {
      refTable.current.handleClose();
    }
  };
  return (
    <Box className='flex flex-col gap-4'>
      <ModalEdit open={open} handleClose={handleClose} idHocBa={idHocBa} />
      <Box className='flex justify-between gap-4 flex-row  border border-gray-200 rounded-lg py-3 px-4 shadow-sm'>
        <form
          className='max-w-md w-full flex justify-center gap-2 items-center'
          onSubmit={handleSubmit(handleSubmitSearch)}
        >
          <Input2
            className='flex-1'
            {...register('mssv')}
            placeholder='Nhập mã số sinh viên'
            isDisabled={false}
            type='number'
          />
          <LoadingButton type='submit' className='!border !border-solid !text-[14px] !leading-6'>
            Tìm kiếm
          </LoadingButton>
        </form>
        {
          isAdmin && (
            <Box className='flex justify-end items-center gap-4 w-full'>
          <Box className='flex items-center justify-center'>
            <Button title={'Thêm mới'} onClick={() => router.push(APP_ROUTE.HOC_BA.ADD)} />
          </Box>
        </Box>
          )
        }
      </Box>
      <Grid container spacing={2} sx={{ width: '100%' }}>
      {
      isLoading ?  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              border: '6px solid #e0e0e0',
              borderTop: '6px solid #1976d2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </Box> : data?.length > 0 ?  data?.map((item: any, index: number) => (
          <Grid size={12} key={item.hocKy}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
        Học Kỳ {item.hocKy}
      </Typography>
      <TableContainer
        component={Paper}
        className="group"
        sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          border: '1px solid #e5e7eb !important',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          px: 0,
          py: 0,
        }}
      >
        <Table
          size="small"
          sx={{
            '& th, & td': {
              padding: '6px 10px',
              fontSize: 14,
              whiteSpace: 'nowrap',
            },
            '& th': {
              background: '#f9fafb',
              fontWeight: 700,
              borderBottom: '1px solid #e5e7eb',
            },
            '& td': {
              borderBottom: '1px solid #f3f4f6',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: 40 }}>TT</TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  minWidth: 140,
                  maxWidth: 280,
                  width: '40%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                Tên Môn
              </TableCell>
              <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>Loại</TableCell>
              <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>ĐVHP</TableCell>
              <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>Tổng Kết</TableCell>
              <TableCell align="center" sx={{ width: 80, fontWeight: 700 }}>Ghi Chú</TableCell>
             {
                isAdmin && (
                  <TableCell align="center" sx={{ width: 80, fontWeight: 700 }}>Hành Động</TableCell>
                )
             }
            </TableRow>
          </TableHead>
          <TableBody>
            {item?.listHocBa?.map((row: HocBa, idx: number) => (
              <TableRow key={idx}  sx={{
                    '&:hover': {
                      backgroundColor: '#f3f4f6', // hoặc màu bạn muốn
                    },
                  }}>
                <TableCell align="center" >{idx + 1}</TableCell>
                <TableCell
                  sx={{
                    minWidth: 180,
                    maxWidth: 320,
                    width: '40%',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    fontWeight: 500,
                  }}
                >
                  {row?.chiTietChuongTrinhDaoTao?.monHoc?.tenMonHoc}
                </TableCell>
                <TableCell align="center">
                  {formatLoaiMonHoc(Number(row?.chiTietChuongTrinhDaoTao?.loaiMonHoc))}
                </TableCell>
                <TableCell align="center">
                  {row?.chiTietChuongTrinhDaoTao?.soTinChi}
                </TableCell>
                <TableCell align="center">{row?.diemTongKet}</TableCell>
                <TableCell align="center">{row?.moTa}</TableCell>
                {
                  isAdmin && (
<TableCell align="center" className="!flex !justify-center !items-center !gap-3">
                  <button onClick={() => {
                    console.log('row', row);
                    setIdHocBa(row.id);
                    handleClickOpen();
                  }} className="p-1 cursor-pointer hover:text-blue-600 bg-gray-100 border-amber-50 hover:bg-gray-200 border rounded-md flex items-center justify-center">
                    <EditIcon className="!h-4 !w-4 text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="p-1 cursor-pointer hover:text-blue-600 bg-gray-100 border-amber-50 hover:bg-gray-200 border rounded-md flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </TableCell>
              
                  )
                }
                </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Typography sx={{ fontWeight: 700, color: '#d32f2f' }}>
                  Điểm TB HK{item?.hocKy}:
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontWeight: 700, color: '#d32f2f' }}>
                  {item?.diemTongKet}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
           {
            item?.hocKy % 2 === 0 && (
               <TableRow>
              <TableCell colSpan={4} align="right">
                <Typography sx={{ fontWeight: 700, color: '#d32f2f' }}>
                  Điểm TB Năm {item?.hocKy - 1}:
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography sx={{ fontWeight: 700, color: '#d32f2f' }}>
                    {
                    (() => {
                      const prevOddHocKy = item?.hocKy - 1;
                      const prevOddItem = data?.find((d: any) => d.hocKy === prevOddHocKy);
                      if (prevOddItem?.diemTongKet != null && item?.diemTongKet != null) {
                        const avg = (Number(prevOddItem.diemTongKet) + Number(item.diemTongKet)) / 2;
                        return avg.toFixed(2);
                      }
                      return '';
                    })()
                    }
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>
            )
           }
          </TableBody>
        </Table>
      </TableContainer>
      </Grid>
        )) : (
          <Grid size={12} className="flex flex-col items-center justify-center h-full mt-20">
            <Typography variant="body1" color="textSecondary" align="center">
              Không có dữ liệu học bạ cho sinh viên này.
            </Typography>
          </Grid>
        )
      }

      </Grid>
    </Box>
  );
};

export default Content;
