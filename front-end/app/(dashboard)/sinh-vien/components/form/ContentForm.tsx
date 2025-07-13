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
  TrangThaiSinhVien2,
  TrangThaiSinhVienEnum,
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
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';

export interface IFormData {
  MSSV: string;
  HoTen: string;
  Email: string;
  GioiTinh?: IOption;
  NgaySinh?: string;
  CCCD?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  NgayNhapHoc?: string;
  TrangThaiSinhVienEnum?: IOption;
  LopHoc?: IOption;
  File?: File;
}

interface IContentFormProps {
  data?: SinhVien;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const {setBreadcrumbs,setTitle} = useBreadcrumb();
  const schema = useMemo(() => {
    return yup.object().shape({
      HoTen: yup.string().max(200, 'Họ và tên không được quá 220 ký tự').required('Họ và tên là bắt buộc'),
      Email: yup
        .string()
        .required('Email là bắt buộc')
        .test('is-caothang-email', 'Email phải có đuôi @caothang.edu.vn', (value) => {
          return value ? value.endsWith('@caothang.edu.vn') : false;
        })
        .max(200, 'Email không được quá 220 ký tự')
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
      NgaySinh: yup.date().required('Ngày sinh là bắt buộc'),
      NgayNhapHoc: yup.date().required('Ngày vào trường là bắt buộc'),
      GioiTinh: yup.object().required('Giới tính là bắt buộc'),
      TrangThaiSinhVienEnum: yup.object().required('Trạng thái là bắt buộc'),
      LopHoc: yup.object().required('Lớp học là bắt buộc'),
      DiaChi: yup.string().max(225, 'Địa chỉ không được quá 225 ký tự').notRequired(),
      MSSV: yup.string().required('Mã số sinh viên là bắt buộc').max(20, 'Mã số sinh viên không được quá 20 ký tự')
    });
  }, [data]);
  const { data: lopHocs, isLoading: isLoadingLopHoc } = useQuery({
    queryKey: ['lophocs'],
    queryFn: async () => {
      const response = await LopHocService.getLopHocNoPage();
      return response;
    },
    initialData: initialData?.lopHocs,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.maLopHoc
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
      LoaiTaiKhoan: null,
      TrangThai: null,
      NgaySinh: null,
      NgayNhapHoc: null,
      CCCD: '',
      SoDienThoai: '',
      DiaChi: '',
      MSSV: ''
    }
  });
  useEffect(() => {
    setTitle(`Chỉnh sửa sinh viên: ${data?.hoTen || ''}`);
    setBreadcrumbs(<Typography className="relative text-[14px] flex gap-1 items-center">
              <Typography component={'span'} sx={(theme) => ({
                color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
                fontWeight: 500
              })}>
               {data?.hoTen}
              </Typography>
              </Typography>)
    return () => {
      setTitle('');
      setBreadcrumbs(null);
    }
  },[data?.hoTen]);
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) form.append('Id', data.id);
    if (formData.MSSV) form.append('MSSV', String(formData.MSSV));
    if (formData.HoTen) form.append('HoTen', formData.HoTen);
    if (formData.Email) form.append('Email', formData.Email);
    if (formData.CCCD) form.append('CCCD', formData.CCCD);
    if (formData.SoDienThoai) form.append('SoDienThoai', formData.SoDienThoai);
    if (formData.DiaChi) form.append('DiaChi', formData.DiaChi);
    if (formData.NgaySinh) form.append('NgaySinh', moment(formData.NgaySinh).toISOString());
    if (formData.GioiTinh) form.append('GioiTinhEnum', String(formData.GioiTinh?.id));
    if (formData.NgayNhapHoc) {
      form.append('NgayNhapHoc', moment(formData.NgayNhapHoc).toISOString());
    }
    if (formData.LopHoc) {
      form.append('LopHocId', String(formData.LopHoc?.id));
    }
    if (formData.TrangThaiSinhVienEnum) {
      form.append('TrangThaiSinhVienEnum', String(formData.TrangThaiSinhVienEnum?.id));
    }
    if (formData.File && formData.File instanceof File && formData.File.size > 0) {
      form.append('File', formData.File);
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        MSSV: data?.mssv || '',
        HoTen: data?.hoTen || '',
        Email: data?.email || '',
        GioiTinh: gioiTinhOptions.find((item) => item.id === data?.gioiTinh) || null,
        NgaySinh: data?.ngaySinh ? moment(data?.ngaySinh) : null,
        CCCD: data?.cccd || '',
        SoDienThoai: data?.soDienThoai || '',
        DiaChi: data?.diaChi || '',
        NgayNhapHoc: data?.ngayNhapHoc ? moment(data?.ngayNhapHoc) : null,
        LopHoc: {
          id: data?.lopHoc?.id,
          name: data?.lopHoc?.maLopHoc
        },
        TrangThaiSinhVienEnum: TrangThaiSinhVien.find((item) => item.id === data?.trangThaiSinhVien) || null,
        File: data?.anhDaiDien
      });
    }
  }, [reset, data]);
  const eighteenYearsAgo = moment().subtract(18, 'year');
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
            {...register('MSSV')}
            title='Mã số sinh viên'
            placeholder='Nhập mã số sinh viên'
            error={errors.MSSV?.message}
            isDisabled={false}
            type='number'
          />
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
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} container>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <DatePicke
              control={control}
              name='NgaySinh'
              title='Ngày sinh'
              placeholder='Chọn ngày sinh'
              error={errors.NgaySinh?.message}
              isDisabled={false}
              maxDate={eighteenYearsAgo}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
            <DatePicke
              control={control}
              name='NgayNhapHoc'
              title='Ngày nhập học'
              placeholder='Chọn ngày nhập học'
              error={errors.NgayNhapHoc?.message}
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
            name={'LopHoc'}
            isLoading={isLoadingLopHoc}
            placeholder={'Lớp học'}
            title={'Lớp học'}
            data={lopHocs ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.LopHoc as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {
            data?.trangThaiSinhVien === TrangThaiSinhVienEnum.DA_TOT_NGHIEP ? (
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Trình độ</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                Đã tốt nghiệp
              </Box>
            </Box>
            ) : (
              <InputSelect2
                control={control}
                fullWidth
                name={'TrangThaiSinhVienEnum'}
                placeholder={'Trạng thái'}
                title={'Trạng thái'}
                data={TrangThaiSinhVien2 ?? []}
                getOptionKey={(option) => option.id}
                getOptionLabel={(option: any) => option.name}
                error={(errors.TrangThaiSinhVienEnum as any)?.message}
              />
            )
          }
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
      <Box className='flex justify-end w-full'>
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
