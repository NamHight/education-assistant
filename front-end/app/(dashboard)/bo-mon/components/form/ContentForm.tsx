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
import { MonHoc } from '@/models/MonHoc';
import TextArea from '@/components/textarea/TextArea';
import { Nganh } from '@/models/Nganh';
import { BoMon } from '@/models/BoMon';

export interface IFormData {
  TenBoMon: string;
  Email: string;
  SoDienThoai: string;
  Khoa: IOption;
}

interface IContentFormProps {
  data?: BoMon;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      TenBoMon: yup.string().required('Mã ngành không được để trống'),
      Email: yup
        .string()
        .matches(emailPattern, 'Email không hợp lệ')
        .email('Email không hợp lệ')
        .required('Tên ngành không được để trống'),
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
      Khoa: yup.object().required('Khoa không được để trống')
    });
  }, [data]);
  const { data: khoas, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoas'],
    queryFn: async () => {
      const response = await KhoaService.getKhoaNoPage();
      return response;
    },
    initialData: initialData?.khoas,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenKhoa
      }));
    },
    refetchOnWindowFocus: false
  });
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
      MaNganh: '',
      TenNganh: '',
      MoTa: '',
      Khoa: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData?.TenBoMon) {
      form.append('TenBoMon', formData.TenBoMon);
    }
    if (formData?.Email) {
      form.append('Email', formData.Email);
    }
    if (formData?.SoDienThoai) {
      form.append('SoDienThoai', formData.SoDienThoai);
    }
    if (formData?.Khoa) {
      form.append('KhoaId', String(formData.Khoa?.id));
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        TenBoMon: data.tenBoMon || '',
        Email: data.email || '',
        SoDienThoai: data.soDienThoai || '',
        Khoa: {
          id: data.khoa?.id || '',
          name: data.khoa?.tenKhoa || ''
        }
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TenBoMon')}
            title='Tên bộ môn'
            placeholder='Nhập tên bộ môn'
            error={errors.TenBoMon?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('Email')}
            title='Email'
            placeholder='Nhập email'
            error={errors.Email?.message}
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
          <InputSelect2
            control={control}
            fullWidth
            name={'Khoa'}
            placeholder={'Chọn khoa'}
            title={'Khoa'}
            isLoading={isLoadingKhoa}
            data={khoas ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Khoa as any)?.message}
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
