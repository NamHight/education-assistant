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
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
  ToaNha,
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
import { Close } from '@mui/icons-material';
import { useNotifications } from '@toolpad/core';

export interface IFormData {
  ToaNha: IOption;
  Lau: number;
  SoPhong: number;
  SucChua: number;
  LoaiPhongHoc: IOption;
}

export interface IFormTenPhong {
  phongHoc: [
    {
      id: number;
      name: string;
    }
  ];
}

interface IContentFormProps {
  data?: PhongHoc;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const notification = useNotifications();
  const schema = useMemo(() => {
    return yup.object().shape({
      ToaNha: yup.object().typeError('Tòa nhà không được để trống').required('Tòa nhà không được để trống'),
      Lau: yup.number().typeError('Lầu phải là một số').required('Lầu không được để trống'),
      SoPhong: yup
        .number()
        .min(1, 'Số phòng phải là một số dương')
        .typeError('Số phòng phải là một số')
        .required('Số phòng không được để trống'),
      SucChua: yup
        .number()
        .min(1, 'Sức chứa phải lớn hơn 1')
        .typeError('Sức chứa phải là một số')
        .required('Sức chứa không được để trống'),
      LoaiPhongHoc: yup.object().required('Loại phòng học không được để trống')
    });
  }, [data]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
    watch
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
  const { fields, append, remove, insert, replace } = useFieldArray<IFormTenPhong>({
    control,
    name: 'phongHoc'
  });
  const handleSubmitForm = (formData: IFormData) => {
    if (fields.length === 0) {
      notification.show('Vui lòng thêm ít nhất một phòng học', {
        severity: 'error',
        autoHideDuration: 5000
      });
      return;
    }
    const convertData = {
      TenPhongs: fields.map((item) => item.name),
      ToaNha: formData.ToaNha.id,
      SucChua: formData.SucChua,
      LoaiPhongHoc: formData.LoaiPhongHoc.id
    };
    console.log('convertData', convertData);
    if (onSubmit) {
      onSubmit(convertData);
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
  const soLuongPhongHoc = watch('SoPhong');
  useEffect(() => {
    const toaNha = getValues('ToaNha').name;
    const lau = getValues('Lau');
    const convertName = (phong: number) => {
      return `${toaNha}${lau}.${phong}`;
    };
    const phongHoc = Array.from({ length: soLuongPhongHoc }, (_, index) => ({
      id: index + 1,
      name: convertName(index + 1)
    }));
    replace(phongHoc);
  }, [soLuongPhongHoc]);
  const handleRemovePhongHoc = (index: number) => {
    remove(index);
  };
  console.log(
    'fields',
    fields.map((item) => item.name)
  );
  return (
    <Grid container spacing={2} rowSpacing={1}>
      <Grid size={8}>
        <FormControl
          fullWidth
          component={'form'}
          onSubmit={handleSubmit(handleSubmitForm)}
          className='flex flex-col gap-4'
        >
          <Grid
            container
            spacing={2}
            rowSpacing={1}
            className='flex flex-col border border-gray-200 rounded-lg p-4 shadow-sm'
          >
            <Grid size={12} container>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <InputSelect2
                  fullWidth
                  name={'ToaNha'}
                  control={control}
                  title='Tòa nhà'
                  placeholder={'Chọn tòa nhà'}
                  data={ToaNha ?? []}
                  getOptionKey={(option) => option.id}
                  getOptionLabel={(option: any) => option.name}
                  error={(errors.ToaNha as any)?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <Input2
                  {...register('Lau')}
                  title='Lầu'
                  placeholder='Nhập lầu'
                  error={errors.Lau?.message}
                  isDisabled={false}
                  type='number'
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <Input2
                  {...register('SoPhong')}
                  title='Số lượng phòng học'
                  placeholder='Nhập số lượng phòng học'
                  error={errors.SoPhong?.message}
                  isDisabled={false}
                  type='text'
                />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <Input2
                {...register('SucChua')}
                title='Sức chứa'
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
            <Grid className='flex justify-end' size={12}>
              <Button
                type={'submit'}
                className='flex items-center gap-3 !bg-blue-500 !px-4 !py-2 rounded !hover:bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-white !font-semibold !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <SaveIcon className='!text-white !w-6 !h-6' />
                <Typography className='!text-lg !text-white !leading-6 !font-semibold'>Tạo</Typography>
              </Button>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      <Grid
        size={4}
        direction='row'
        spacing={0}
        container
        className='h-auto max-h-[238px] border overflow-y-hidden border-gray-300 rounded-lg shadow-sm'
      >
        <Grid size={12} className='p-2 overflow-hidden max-h-[40px] h-full'>
          <Typography className='!font-semibold !text-[15px]'>Danh sách phòng học</Typography>
        </Grid>
        <Grid size={12} className='flex flex-col gap-2 w-full h-full max-h-[198px] overflow-y-auto px-2 pb-3'>
          {fields.map((item, idx) => (
            <Box
              key={item.id}
              className='max-h-12 flex w-full items-center justify-between gap-4 border border-gray-500 rounded-lg p-4 shadow-sm'
            >
              <Box className='flex gap-2 items-center justify-center'>
                <Typography className='!font-semibold !text-[15px]'>Tên phòng:</Typography>
                <Typography>{item.name}</Typography>
              </Box>
              <Button
                onClick={() => handleRemovePhongHoc(idx)}
                className='!p-1 !min-h-0 !min-w-0 !h-auto hover:!px-1 !rounded-full'
              >
                <Close className='h-3 w-3' />
              </Button>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(ContentForm);
