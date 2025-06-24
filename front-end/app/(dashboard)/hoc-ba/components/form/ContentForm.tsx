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
  LoaiPhongHoc,
  loaiTaiKhoanOptions,
  TrangThaiGiangVien,
  TrangThaiPhongHoc,
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
import { PhongHoc } from '@/models/PhongHoc';

export interface IFormData {
  TenPhong: string;
  ToaNha: string;
  SucChua: number;
  LoaiPhongHoc: IOption;
  TrangThai: IOption;
}

interface IContentFormProps {
  data?: PhongHoc;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      TenPhong: yup.string().required('Tên phòng học không được để trống'),
      ToaNha: yup.string().required('Tòa nhà không được để trống'),
      SucChua: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .typeError('Sức chứa phải là một số')
        .required('Sức chứa không được để trống'),
      LoaiPhongHoc: yup.object().required('Loại phòng học không được để trống'),
      TrangThai: yup.object().required('Trạng thái không được để trống')
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
      TenPhong: '',
      ToaNha: '',
      SucChua: 0,
      LoaiPhongHoc: null,
      TrangThai: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    console.log('formData', formData);
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData.TenPhong) {
      form.append('TenPhong', formData.TenPhong);
    }
    if (formData.ToaNha) {
      form.append('ToaNha', formData.ToaNha);
    }
    if (formData.SucChua) {
      form.append('SucChua', formData.SucChua.toString());
    }
    if (formData.LoaiPhongHoc) {
      form.append('LoaiPhongHoc', formData.LoaiPhongHoc.id.toString());
    }
    if (formData.TrangThai) {
      form.append('TrangThaiPhongHoc', formData.TrangThai.id.toString());
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        TenPhong: data.tenPhong || '',
        ToaNha: data.toaNha || '',
        SucChua: data.sucChua || 0,
        LoaiPhongHoc: LoaiPhongHoc.find((item) => item.id === data.loaiPhongHoc),
        TrangThai: TrangThaiPhongHoc.find((item) => item.id === data.trangThaiPhongHoc)
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TenPhong')}
            title='Tên phòng học'
            placeholder='Nhập tên phòng học'
            error={errors.TenPhong?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('ToaNha')}
            title='Tòa nhà'
            placeholder='Nhập tòa nhà'
            error={errors.ToaNha?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('SucChua')}
            title='Số lượng sức chứa'
            placeholder='Nhập sức chứa'
            error={errors.SucChua?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'LoaiPhongHoc'}
            placeholder={'Chọn loại phòng học'}
            title={'Loại phòng học'}
            data={LoaiPhongHoc ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.LoaiPhongHoc as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'TrangThai'}
            placeholder={'Chọn trạng thái phòng học'}
            title={'Trạng thái phòng học'}
            data={TrangThaiPhongHoc ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.TrangThai as any)?.message}
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
