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
  IOption,
  loaiTaiKhoanOptions,
  TrangThaiGiangVien,
  TrangThaiSinhVien,
  trinhDoOptions
} from '@/types/options';
import DatePicke from '@/components/datepickes/DatePicke';
import { KhoaService } from '@/services/KhoaService';
import { useQuery } from '@tanstack/react-query';
import { BoMonService } from '@/services/BoMonService';
import UploadImage from '@/components/uploads/UploadImage';
import clsx from 'clsx';
import moment from 'moment';
import { SinhVien } from '@/models/SinhVien';
import { LopHocService } from '@/services/LopHocService';
import { Khoa } from '@/models/Khoa';

export interface IFormData {
  TenKhoa: string;
  SoDienThoai: string;
  Email: string;
  ViTriPhong: string;
  Website: string;
}

interface IContentFormProps {
  data?: Khoa;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      TenKhoa: yup.string().required('Tên khoa không được để trống').max(200, 'Tên khoa không được quá 200 ký tự'),
      SoDienThoai: yup
        .string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số')
        .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
        .max(11, 'Số điện thoại không được quá 11 ký tự')
        .test('is-valid-phone', 'Số điện thoại không hợp lệ', (value) => {
          if (!value) return false;
          return /^0[0-9]{9,10}$/.test(value);
        }),
      Email: yup
        .string()
        .required('Email là bắt buộc')
        .max(220, 'Email không được quá 220 ký tự')
        .test('is-caothang-email', 'Email phải có đuôi @caothang.edu.vn', (value) => {
          return value ? value.endsWith('@caothang.edu.vn') : false;
        })
        .test('valid-username', 'Tên người dùng không hợp lệ', (value) => {
          if (!value) return false;
          const username = value.split('@')[0];
          return /^[a-zA-Z0-9._-]+$/.test(username) && username.length >= 3;
        }),
      ViTriPhong: yup
        .string()
        .required('Vị trí phòng không được để trống')
        .max(100, 'Vị trí phòng không được quá 100 ký tự'),
      Website: yup.string().notRequired().max(200, 'Website không được quá 200 ký tự')
    });
  }, [data]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      HoTen: '',
      Email: '',
      LoaiTaiKhoan: null,
      TrangThai: null,
      NgaySinh: null,
      NgayNhapHoc: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData?.Email) {
      form.append('Email', formData.Email);
    }
    if (formData?.TenKhoa) {
      form.append('TenKhoa', formData.TenKhoa);
    }
    if (formData?.SoDienThoai) {
      form.append('SoDienThoai', formData.SoDienThoai);
    }
    if (formData?.ViTriPhong) {
      form.append('ViTriPhong', formData.ViTriPhong);
    }
    if (formData?.Website) {
      form.append('Website', formData.Website);
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        TenKhoa: data?.tenKhoa,
        SoDienThoai: data?.soDienThoai,
        Email: data?.email,
        ViTriPhong: data?.viTriPhong,
        Website: data?.website
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TenKhoa')}
            title='Tên khoa'
            placeholder='Nhập tên khoa'
            error={errors.TenKhoa?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('ViTriPhong')}
            title='Vị trí phòng'
            placeholder='Nhập mã vị trí phòng'
            error={errors.ViTriPhong?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('SoDienThoai')}
            title='Số điện thoại'
            placeholder='Nhập số điện thoại'
            error={errors.SoDienThoai?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Controller
            name='Email'
            control={control}
            render={({ field }) => (
              <CustomEmailInput
                title='Email'
                placeholder='Nhập tên người dùng (VD: nguyenvana)'
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.Email?.message}
                isDisabled={false}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('Website')}
            title='Website'
            placeholder='Nhập mã website'
            error={errors.Website?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
      </Grid>
      <Box>
        <Button
          type={'submit'}
          className='flex items-center gap-3 !bg-blue-500 !px-4 !py-2 rounded !hover:bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-white !font-semibold !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <SaveIcon className='!text-white !w-6 !h-6' />
          <Typography className='!text-lg !text-white !leading-6 !font-semibold'>Lưu</Typography>
        </Button>
      </Box>
    </FormControl>
  );
};

export default memo(ContentForm);
