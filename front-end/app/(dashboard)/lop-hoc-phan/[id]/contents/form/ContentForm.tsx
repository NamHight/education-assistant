'use client';
import React, { FC, memo, useEffect, useMemo } from 'react';
import {
  alpha,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import { yupResolver } from '@hookform/resolvers/yup';
import { GiangVien } from '@/models/GiangVien';
import * as yup from 'yup';
import Input2 from '@/components/inputs/Input2';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailPattern } from '@/lib/pattern';
import CustomEmailInput from '@/components/inputs/InputEmail';
import InputSelect2 from '@/components/selects/InputSelect2';
import {
  chucVuOptions,
  gioiTinhOptions,
  HocKyLopHocPhan,
  IOption,
  loaiTaiKhoanOptions,
  TrangThaiGiangVien,
  TrangThaiLopHocPhan,
  trinhDoOptions
} from '@/types/options';
import DatePicke from '@/components/datepickes/DatePicke';
import { KhoaService } from '@/services/KhoaService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BoMonService } from '@/services/BoMonService';
import UploadImage from '@/components/uploads/UploadImage';
import clsx from 'clsx';
import moment from 'moment';
import { LopHocPhan } from '@/models/LopHocPhan';
import { MonHocService } from '@/services/MonHocService';
import { GiangVienService } from '@/services/GiangVienService';
import { LopHocService } from '@/services/LopHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import Table from '@/components/tables/Table';
import { SinhVienService } from '@/services/SinhVienService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { useNotifications } from '@toolpad/core';

export interface IFormData {
  siSo?: string;
  trangThai?: IOption;
  giangVien?: IOption;
  monHoc?: IOption;
}

interface IContentFormProps {
  data: LopHocPhan;
  queryKey?: string;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData, queryKey }) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const mutationChangeStatus = useMutation({
    mutationFn: async ({ id, data }: { id: string | number | null; data: any }) => {
      const result = await LopHocPhanService.changeStatusLopHocPhan(id, data);
      return result;
    },
    onSuccess: async () => {
      queryClient.setQueryData([queryKey, { id: data?.id }], (oldData: any) => {
        if (oldData) {
          return {
            ...oldData,
            trangThai: Number(oldData.trangThai) === 1 ? 2 : 1
          };
        }
        return oldData;
      });

      notification.show('Thay đổi trạng thái thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Thay đổi trạng thái thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleChangeStatus = () => {
    const formData = new FormData();
    formData.append('trangThai', Number(data?.trangThai) === 1 ? '2' : '1');
    mutationChangeStatus.mutate({ id: data?.id, data: formData });
  };
  return (
    <FormControl fullWidth component={'form'} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Sỉ số</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {data?.siSo || 0}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Giảng viên</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {data?.giangVien?.hoTen || ''}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Môn học</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {data?.monHoc?.tenMonHoc || ''}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className='relative'>
          <Button
            className='!absolute !top-3 right-0 !p-0 !h-0 hover:!underline !text-blue-500'
            onClick={() => handleChangeStatus()}
          >
            Thay đổi
          </Button>
          <Box className='flex flex-col gap-1'>
            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Trạng thái</Typography>
            <Box
              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
            >
              {TrangThaiLopHocPhan.find((item) => item.id === data?.trangThai)?.name || ''}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default memo(ContentForm);
