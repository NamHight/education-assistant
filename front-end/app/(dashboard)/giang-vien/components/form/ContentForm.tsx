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
  trinhDoOptions
} from '@/types/options';
import DatePicke from '@/components/datepickes/DatePicke';
import { KhoaService } from '@/services/KhoaService';
import { useQuery } from '@tanstack/react-query';
import { BoMonService } from '@/services/BoMonService';
import UploadImage from '@/components/uploads/UploadImage';
import clsx from 'clsx';
import moment from 'moment';
import { useUser } from '@/stores/selectors';
import { LoaiTaiKhoaEnum } from '@/models/TaiKhoan';

export interface IFormData {
  HoTen: string;
  Email: string;
  ChucVu?: IOption;
  GioiTinh?: IOption;
  NgaySinh?: string;
  CCCD?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  NgayVaoTruong?: string;
  TrinhDo?: IOption;
  ChuyenNganh?: string;
  TrangThai?: IOption;
  LoaiTaiKhoan?: IOption;
  Khoa?: IOption;
  BoMon?: IOption;
  File?: File;
}

interface IContentFormProps {
  data?: GiangVien;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const user = useUser();
  const schema = useMemo(() => {
    return yup.object().shape({
      HoTen: yup.string().required('Họ và tên là bắt buộc'),
      Email: yup
        .string()
        .required('Email là bắt buộc')
        .test('is-caothang-email', 'Email phải có đuôi @caothang.edu.vn', (value) => {
          return value ? value.endsWith('@caothang.edu.vn') : false;
        })
        .test('valid-username', 'Tên người dùng không hợp lệ', (value) => {
          if (!value) return false;
          const username = value.split('@')[0];
          return /^[a-zA-Z0-9._-]+$/.test(username) && username.length >= 3;
        }),
      CCCD: yup
        .string()
        .required('CCCD là bắt buộc')
        .matches(/^\d+$/, 'CCCD chỉ được chứa chữ số')
        .min(9, 'CCCD phải có ít nhất 9 ký tự')
        .max(12, 'CCCD không được quá 12 ký tự'),
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
      TrinhDo: yup.object().required('Trình độ là bắt buộc'),
      ChuyenNganh: yup.string().required('Chuyên ngành là bắt buộc'),
      NgaySinh: yup.date().required('Ngày sinh là bắt buộc'),
      NgayVaoTruong: yup.date().required('Ngày vào trường là bắt buộc'),
      GioiTinh: yup.object().required('Giới tính là bắt buộc'),
      ChucVu: yup.object().required('Chức vụ là bắt buộc'),
      Khoa: yup.object().required('Khoa là bắt buộc'),
      BoMon: yup.object().required('Bộ môn là bắt buộc'),
      LoaiTaiKhoan: yup.object().required('Loại tài khoản là bắt buộc'),
      TrangThai: yup.object().required('Trạng thái là bắt buộc')
    });
  }, [data]);
  const { data: khoas, isLoading: isLoadingKhoa } = useQuery({
    queryKey: ['khoas'],
    queryFn: async () => {
      const response = await KhoaService.getAllKhoa({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.Khoas,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenKhoa
      }));
    },
    refetchOnWindowFocus: false
  });
  const { data: boMons, isLoading: isLoadingBoMon } = useQuery({
    queryKey: ['bomons'],
    queryFn: async () => {
      const response = await BoMonService.getAllBoMon({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.BoMons,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenBoMon
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
      HoTen: '',
      Email: '',
      ChucVu: null,
      Khoa: null,
      BoMon: null,
      LoaiTaiKhoan: null,
      TrangThai: null,
      NgaySinh: null,
      NgayVaoTruong: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (formData.HoTen) form.append('HoTen', formData.HoTen);
    if (formData.Email) form.append('Email', formData.Email);
    if (formData.CCCD) form.append('CCCD', formData.CCCD);
    if (formData.SoDienThoai) form.append('SoDienThoai', formData.SoDienThoai);
    if (formData.DiaChi) form.append('DiaChi', formData.DiaChi);
    if (formData.ChuyenNganh) form.append('ChuyenNganh', formData.ChuyenNganh);
    if (formData.NgaySinh) form.append('NgaySinh', moment(formData.NgaySinh).toISOString());
    if (formData.NgayVaoTruong) form.append('NgayVaoTruong', moment(formData.NgayVaoTruong).toISOString());
    if (formData.TrinhDo) form.append('TrinhDo', String(formData.TrinhDo?.name));
    if (formData.GioiTinh) form.append('GioiTinh', String(formData.GioiTinh?.id));
    if (formData.ChucVu) form.append('ChucVu', String(formData.ChucVu?.id));
    if (formData.Khoa) form.append('KhoaId', String(formData.Khoa?.id));
    if (formData.BoMon) form.append('BoMonId', String(formData.BoMon?.id));
    if (formData.LoaiTaiKhoan) form.append('LoaiTaiKhoan', String(formData.LoaiTaiKhoan?.id));
    if (formData.TrangThai) form.append('TrangThai', String(formData.TrangThai?.id));
    if (formData.File && formData.File instanceof File) {
      form.append('File', formData.File);
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        HoTen: data?.hoTen || '',
        Email: data?.email || '',
        CCCD: data?.cccd || '',
        SoDienThoai: data?.soDienThoai || '',
        DiaChi: data?.diaChi || '',
        ChuyenNganh: data?.chuyenNganh || '',
        NgaySinh: data?.ngaySinh ? moment(data.ngaySinh) : null,
        NgayVaoTruong: data?.ngayVaoTruong ? moment(data.ngayVaoTruong) : null,
        TrinhDo: trinhDoOptions.find((item: any) => item.name === data.trinhDo) || null,
        GioiTinh: gioiTinhOptions.find((item: any) => item.id === data.gioiTinh) || null,
        ChucVu: chucVuOptions.find((item) => item.id === data.chucVu) || null,
        Khoa: khoas?.find((item: any) => item.id === data.khoaId) || null,
        BoMon: boMons?.find((item: any) => item.id === data.boMonId) || null,
        LoaiTaiKhoan: loaiTaiKhoanOptions.find((item) => item.id === data?.taiKhoan?.loaiTaiKhoan) || null,
        TrangThai: TrangThaiGiangVien.find((item) => item.id === data.trangThai) || null,
        File: data?.anhDaiDien
      });
    }
  }, [reset, data]);
  const isAdmin = user?.taiKhoan?.loaiTaiKhoan === 1;
  const filteredLoaiTaiKhoanOptions = useMemo(() => {

  if (isAdmin) {
    return loaiTaiKhoanOptions;
  }
  if(!user){
    return loaiTaiKhoanOptions;
  }
  if(user?.taiKhoan?.loaiTaiKhoan === LoaiTaiKhoaEnum.QUAN_LY_KHOA_BO_MON){
      return loaiTaiKhoanOptions.filter(
        (item: any) =>
          !(item?.id === LoaiTaiKhoaEnum.ADMIN)
      );
    }
  return loaiTaiKhoanOptions;
}, [user, loaiTaiKhoanOptions]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }} container>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box>
              <Typography
                className={clsx('!text-[16px] !font-[500] !leading-6', {
                  '!text-gray-500': !errors.File?.message,
                  '!text-red-600': !!errors.File?.message
                })}
              >
                {'Ảnh đại diện'}
              </Typography>
            </Box>
            <Controller
              name='File'
              control={control}
              render={({ field }) => (
                <UploadImage
                  w60
                  isSvg
                  file={field.value}
                  errorMessage={errors.File?.message?.toString()}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('HoTen')}
            title='Họ và tên'
            placeholder='Nhập họ và tên'
            error={errors.HoTen?.message}
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
            {...register('CCCD')}
            title='Căn cước công dân'
            placeholder='Nhập CCCD'
            error={errors.CCCD?.message}
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
            name={'TrinhDo'}
            placeholder={'Trình độ'}
            title={'Trình độ'}
            data={trinhDoOptions ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.TrinhDo as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('ChuyenNganh')}
            title='Chuyên ngành'
            placeholder='Nhập chuyên ngành'
            error={errors.ChuyenNganh?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} container>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <DatePicke
              control={control}
              name='NgaySinh'
              title='Ngày sinh'
              placeholder='Chọn ngày sinh'
              error={errors.NgaySinh?.message}
              isDisabled={false}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <DatePicke
              control={control}
              name='NgayVaoTruong'
              title='Ngày vào trường'
              placeholder='Chọn ngày vào trường'
              error={errors.NgayVaoTruong?.message}
              isDisabled={false}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'GioiTinh'}
              placeholder={'Giới tính'}
              title={'Giới tính'}
              data={gioiTinhOptions ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.GioiTinh as any)?.message}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'ChucVu'}
            placeholder={'Chức vụ'}
            title={'Chức vụ'}
            data={chucVuOptions ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.ChucVu as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'Khoa'}
            isLoading={isLoadingKhoa}
            placeholder={'Khoa'}
            title={'Khoa'}
            data={khoas ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Khoa as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'BoMon'}
            isLoading={isLoadingBoMon}
            placeholder={'Bộ môn'}
            title={'Bộ môn'}
            data={boMons ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.BoMon as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} container>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'LoaiTaiKhoan'}
              placeholder={'Loại tài khoản'}
              title={'Loại tài khoản'}
              data={filteredLoaiTaiKhoanOptions ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.LoaiTaiKhoan as any)?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'TrangThai'}
              placeholder={'Trạng thái'}
              title={'Trạng thái'}
              data={TrangThaiGiangVien ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.TrangThai as any)?.message}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <Input2
            {...register('DiaChi')}
            title='Địa chỉ'
            placeholder='Nhập địa chỉ'
            error={errors.DiaChi?.message}
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
