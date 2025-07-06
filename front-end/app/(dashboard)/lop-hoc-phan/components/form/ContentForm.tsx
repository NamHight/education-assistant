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
import { useQuery } from '@tanstack/react-query';
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

export interface IFormData {
  // maHocPhan?: string;
  // hocKy?: IOption;
  siSo?: string;
  trangThai?: IOption;
  // chuongTrinhDaoTao?: IOption;
  giangVien?: IOption;
  // lopHoc?: IOption;
  monHoc?: IOption;
}

interface IContentFormProps {
  data?: LopHocPhan;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      // maHocPhan: yup.string().required('Mã học phần là bắt buộc'),
      // hocKy: data ? yup.object().notRequired() : yup.object().required('Học kỳ là bắt buộc'),
      siSo: yup
        .number()
        .required('Sỉ số là bắt buộc')
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .min(1, 'Sỉ số không được nhỏ hơn 1'),
      trangThai: yup.object().required('Trạng thái là bắt buộc'),
      // chuongTrinhDaoTao: data ? yup.object().notRequired() : yup.object().required('Chương trình đào tạo là bắt buộc'),
      giangVien: yup.object().notRequired(),
      // lopHoc: data ? yup.object().notRequired() : yup.object().required('Lớp học là bắt buộc'),
      monHoc: yup.object().required('Môn học là bắt buộc')
    });
  }, [data]);
  const { data: monHocs, isLoading: isLoadingMonHoc } = useQuery({
    queryKey: ['monHocs'],
    queryFn: async () => {
      const response = await MonHocService.getAllMonHoc();
      return response?.data;
    },
    initialData: initialData?.monHocs,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenMonHoc
      }));
    },
    refetchOnWindowFocus: false
  });
  const { data: giangViens, isLoading: isLoadingGiangVien } = useQuery({
    queryKey: ['giangViens'],
    queryFn: async () => {
      const response = await GiangVienService.getGiangVienNoPage();
      return response;
    },
    initialData: initialData?.giangViens,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.hoTen
      }));
    },
    refetchOnWindowFocus: false
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      hocKy: null,
      maHocPhan: '',
      siSo: 0
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) form.append('id', String(data.id));
    if (formData.giangVien) {
      form.append('giangVienId', String(formData.giangVien?.id));
    }
    if (formData.monHoc) form.append('monHocId', String(formData.monHoc?.id));
    form.append('siSo', String(formData.siSo || 0));
    form.append('trangThai', String(formData.trangThai?.id));
    if (onSubmit) {
      onSubmit(form);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        siSo: data.siSo || 0,
        trangThai: TrangThaiLopHocPhan.find((item) => item.id === data.trangThai) || null,
        giangVien: {
          id: data.giangVien?.id,
          name: data.giangVien?.hoTen
        },
        monHoc: {
          id: data.monHoc?.id,
          name: data.monHoc?.tenMonHoc
        }
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        {/* <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('maHocPhan')}
            name='maHocPhan'
            title='Mã học phần'
            placeholder='Nhập mã học phần'
            error={errors.maHocPhan?.message}
            isDisabled={true}
            type='text'
          />
        </Grid> */}
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('siSo')}
            title='Sỉ số'
            placeholder='Nhập sỉ sổ'
            error={errors.siSo?.message}
            isDisabled={false}
            type='number'
          />
        </Grid>
        {data ? null : (
          <>
            {/* <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <InputSelect2
                control={control}
                fullWidth
                name={'chuongTrinhDaoTao'}
                placeholder={'Chọn chương trình đào tạo'}
                title={'Chương trình đào tạo'}
                isLoading={isLoadingChuongTrinhDaoTao}
                data={chuongTrinhDaoTaos ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                error={(errors.chuongTrinhDaoTao as any)?.message}
              />
            </Grid> */}
            {/* <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <InputSelect2
                control={control}
                fullWidth
                name={'hocKy'}
                placeholder={'Chọn học kỳ'}
                title={'Học kỳ'}
                data={HocKyLopHocPhan ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                error={(errors.hocKy as any)?.message}
              />
            </Grid> */}
            {/* <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <InputSelect2
                control={control}
                fullWidth
                name={'lopHoc'}
                isLoading={isLoadingLopHoc}
                placeholder={'Lớp học'}
                title={'Lớp học'}
                data={lopHocs ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                getOnChangeValue={(value) => setValue('maHocPhan', value?.name)}
                error={(errors.lopHoc as any)?.message}
              />
            </Grid> */}
          </>
        )}
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'giangVien'}
            placeholder={'Giảng viên'}
            title={'Giảng viên'}
            isLoading={isLoadingGiangVien}
            data={giangViens ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name ?? ''}
            error={(errors.giangVien as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'monHoc'}
            placeholder={'Môn học'}
            title={'Môn học'}
            isLoading={isLoadingMonHoc}
            data={monHocs ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name ?? ''}
            error={(errors.monHoc as any)?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'trangThai'}
            placeholder={'Trạng thái'}
            title={'Trạng thái'}
            data={TrangThaiLopHocPhan ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.trangThai as any)?.message}
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
