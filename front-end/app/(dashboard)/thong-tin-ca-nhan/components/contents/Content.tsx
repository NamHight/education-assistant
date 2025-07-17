'use client';
import DatePicke from '@/components/datepickes/DatePicke';
import Input2 from '@/components/inputs/Input2';
import UploadImage from '@/components/uploads/UploadImage';
import { Box, FormControl, Grid, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { GiangVien } from '@/models/GiangVien';
import {
  chucVuOptions,
  gioiTinhOptions,
  loaiTaiKhoanOptions
} from '@/types/options';
import moment from 'moment';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GiangVienService } from '@/services/GiangVienService';
import { AuthenticateService } from '@/services/AuthenticateService';
import TextArea from '@/components/textarea/TextArea';
import { useNotifications } from '@toolpad/core';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';
export interface IFormData {
  HoTen: string;
  NgaySinh?: string;
  CCCD?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  File?: File;
}

interface IContentProps {
  data?: GiangVien | null;
}
const Content = ({ data }: IContentProps) => {
  const [editAble, seteditAble] = useState<{ [key: string]: boolean }>({
    HoTen: true,
    NgaySinh: true,
    CCCD: true,
    SoDienThoai: true,
    DiaChi: true
  });
  const notification = useNotifications();
  const queryClient = useQueryClient();
   const { setTitle } = useBreadcrumb();
  const schema = useMemo(() => {
    return yup.object().shape({
      HoTen: yup.string().when([], {
        is: () => editAble.HoTen,
        then: (schema) => schema.required('Họ và tên là bắt buộc'),
        otherwise: (schema) => schema.notRequired()
      }),
      CCCD: yup
        .string()
        .when([], {
          is: () => editAble.CCCD,
          then: (schema) => schema.required('CCCD là bắt buộc'),
          otherwise: (schema) => schema.notRequired()
        })
        .matches(/^\d+$/, 'CCCD chỉ được chứa chữ số')
        .min(9, 'CCCD phải có ít nhất 9 ký tự')
        .max(12, 'CCCD không được quá 12 ký tự'),
      SoDienThoai: yup
        .string()
        .when([], {
          is: () => editAble.SoDienThoai,
          then: (schema) => schema.required('Số điện thoại là bắt buộc'),
          otherwise: (schema) => schema.notRequired()
        })
        .matches(/^\d+$/, 'Số điện thoại chỉ được chứa chữ số')
        .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
        .max(11, 'Số điện thoại không được quá 11 ký tự')
        .test('is-valid-phone', 'Số điện thoại không hợp lệ', (value) => {
          if (!value) return false;
          return /^0[0-9]{9,10}$/.test(value);
        }),
      NgaySinh: yup.date().when({
        is: () => editAble.NgaySinh,
        then: (schema) => schema.required('Ngày sinh là bắt buộc'),
        otherwise: (schema) => schema.notRequired()
      }),
      DiaChi: yup.string().when({
        is: () => editAble.DiaChi,
        then: (schema) => schema.required('Địa chỉ là bắt buộc'),
        otherwise: (schema) => schema.notRequired()
      })
    });
  }, [editAble]);
  const { data: giangVien } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await AuthenticateService.getMe();
      return response;
    },
    refetchOnWindowFocus: false,
    gcTime: Infinity,
    staleTime: Infinity
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
  useEffect(() => {
    setTitle('Thông tin cá nhân');
    return () => setTitle('');
  }, []);
  const mutationUpdateProfile = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await GiangVienService.updateProfile(giangVien?.id, data);
      return response;
    },
    onSuccess: (data: any) => {
      notification.show('Cập nhật thông tin thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({ queryKey: ['user'], exact: false });
    },
    onError: (error: any) => {
      notification.show(error.Message || 'Cập nhật thông tin thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    if (!giangVien) return;
    const form = new FormData();
    if (formData.HoTen) form.append('HoTen', formData.HoTen);
    if (formData.CCCD) form.append('CCCD', formData.CCCD);
    if (formData.SoDienThoai) form.append('SoDienThoai', formData.SoDienThoai);
    if (formData.DiaChi) form.append('DiaChi', formData.DiaChi);
    if (formData.NgaySinh) form.append('NgaySinh', moment(formData.NgaySinh).toISOString());
    if (formData.File && formData.File instanceof File) {
      form.append('File', formData.File);
    }
    mutationUpdateProfile.mutate(form);
  };
  useEffect(() => {
    if (giangVien) {
      reset({
        HoTen: giangVien?.hoTen || '',
        CCCD: giangVien?.cccd || '',
        SoDienThoai: giangVien?.soDienThoai || '',
        DiaChi: giangVien?.diaChi || '',
        NgaySinh: giangVien?.ngaySinh ? moment(giangVien.ngaySinh) : null,
        File: giangVien?.anhDaiDien
      });
    }
  }, [reset, giangVien]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid container size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
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
          <Grid></Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 6, md: 9, lg: 9 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Input2
              {...register('HoTen')}
              title='Họ và tên'
              placeholder='Nhập họ và tên'
              error={errors.HoTen?.message}
              isDisabled={editAble.HoTen}
              editAble={editAble.HoTen}
              onClickEdit={() => {
                seteditAble({ ...editAble, HoTen: !editAble.HoTen });
                if (!editAble.HoTen) {
                  handleSubmit(handleSubmitForm)();
                }
              }}
              isEditAble
              type='text'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Email</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {giangVien?.email || <span className='text-gray-400'>Chưa cập nhật</span>}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Input2
              {...register('CCCD')}
              title='Căn cước công dân'
              placeholder='Nhập CCCD'
              error={errors.CCCD?.message}
              isDisabled={editAble.CCCD}
              editAble={editAble.CCCD}
              onClickEdit={() => {
                seteditAble({ ...editAble, CCCD: !editAble.CCCD });
                if (!editAble.CCCD) {
                  handleSubmit(handleSubmitForm)();
                }
              }}
              isEditAble
              type='text'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Input2
              {...register('SoDienThoai')}
              title='Số điện thoại'
              placeholder='Nhập số điện thoại'
              error={errors.SoDienThoai?.message}
              isDisabled={editAble.SoDienThoai}
              editAble={editAble.SoDienThoai}
              onClickEdit={() => {
                seteditAble({ ...editAble, SoDienThoai: !editAble.SoDienThoai });
                if (!editAble.SoDienThoai) {
                  handleSubmit(handleSubmitForm)();
                }
              }}
              isEditAble
              type='text'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Trình độ</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {giangVien?.trinhDo || <span className='text-gray-400'>Chưa cập nhật</span>}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Chuyên ngành</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {giangVien?.chuyenNganh || <span className='text-gray-400'>Chưa cập nhật</span>}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} container>
            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
              <DatePicke
                control={control}
                name='NgaySinh'
                title='Ngày sinh'
                isEditAble
                placeholder='Chọn ngày sinh'
                error={errors.NgaySinh?.message}
                isDisabled={editAble.NgaySinh}
                editAble={editAble.NgaySinh}
                onClickEdit={() => {
                  seteditAble({ ...editAble, NgaySinh: !editAble.NgaySinh });
                  if (!editAble.NgaySinh) {
                    handleSubmit(handleSubmitForm)();
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
              <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>
                  Ngày vào trường
                </Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {moment(giangVien?.ngayVaoTruong).format('DD/MM/YYYY') || (
                    <span className='text-gray-400'>Chưa cập nhật</span>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
              <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Giới tính</Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {gioiTinhOptions.find((option) => option.id === giangVien?.gioiTinh)?.name || (
                    <span className='text-gray-400'>Chưa cập nhật</span>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Chức vụ</Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {chucVuOptions.find((option) => option.id === giangVien?.chucVu)?.name || (
                  <span className='text-gray-400'>Chưa cập nhật</span>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} container>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>
                  Loại tài khoản
                </Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {loaiTaiKhoanOptions.find((option) => option.id === giangVien?.taiKhoan?.loaiTaiKhoan)?.name || (
                    <span className='text-gray-400'>Chưa cập nhật</span>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
              <Box className='flex flex-col gap-1'>
                <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Bộ môn</Typography>
                <Box
                  className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                  style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                >
                  {giangVien?.boMon?.tenBoMon || <span className='text-gray-400'>Chưa cập nhật</span>}
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <TextArea
              {...register('DiaChi')}
              placeholder={'Nhập địa chỉ'}
              title={'Địa chỉ'}
              editAble={editAble.DiaChi}
              onClickEdit={() => {
                seteditAble({ ...editAble, DiaChi: !editAble.DiaChi });
                if (!editAble.DiaChi) {
                  handleSubmit(handleSubmitForm)();
                }
              }}
              disabled={editAble.DiaChi}
              isEditAble
              errorMessage={errors?.DiaChi?.message?.toString()}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default Content;
