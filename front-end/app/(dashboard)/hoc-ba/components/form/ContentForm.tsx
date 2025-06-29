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
  KetQuaHocBa,
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
import { HocBa } from '@/models/HocBa';
import { SinhVienService } from '@/services/SinhVienService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { TrangThaiLopHocPhanEnum } from '@/models/LopHocPhan';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';

export interface IFormData {
  DiemTongKet: number;
  KetQua: IOption;
  SinhVien: IOption;
  LopHocPhan: IOption;
  ChiTietChuongTrinhDaoTao: IOption;
}

interface IContentFormProps {
  data?: HocBa;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      DiemTongKet: yup
        .number()
        .min(0, 'Điểm tổng kết không hợp lệ')
        .max(10, 'Điểm tổng kết tối đa 10')
        .required('Điểm tổng kết không được để trống')
        .min(0, 'Điểm tổng kết không hợp lệ'),
      KetQua: yup.object().required('Kết quả không được để trống'),
      SinhVien: yup.object().required('Sinh viên không được để trống'),
      LopHocPhan: yup.object().required('Lớp học phần không được để trống'),
      ChiTietChuongTrinhDaoTao: yup.object().required('Chi tiết chương trình đào tạo không được để trống')
    });
  }, [data]);
  const { data: sinhViens, isLoading: isLoadingSinhVien } = useQuery({
    queryKey: ['sinh-viens'],
    queryFn: async () => {
      const response = await SinhVienService.getAllSinhVien({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.sinhViens,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.hoTen
      }));
    },
    refetchOnWindowFocus: false
  });
  const { data: lopHocPhans, isLoading: isLoadingLopHoc } = useQuery({
    queryKey: ['lop-hoc-phans'],
    queryFn: async () => {
      const response = await LopHocPhanService.getAllLopHocPhan({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc',
        trangThai: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG
      });
      return response?.data;
    },
    initialData: initialData?.lopHocPhans,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.maHocPhan
      }));
    },
    refetchOnWindowFocus: false
  });
  const { data: chiTietChuongTrinhDaoTaos, isLoading: isLoadingChiTiet } = useQuery({
    queryKey: ['chi-tiet-chuong-trinh-dao-taos'],
    queryFn: async () => {
      const response = await ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTao({
        limit: 9999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.chiTietChuongTrinhDaoTaos,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item?.chuongTrinhDaoTao?.tenChuongTrinh
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
      DiemTongKet: 0,
      KetQua: null,
      SinhVien: null,
      LopHocPhan: null,
      ChiTietChuongTrinhDaoTao: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    console.log('formData', formData);
    if (data) {
      form.append('Id', String(data.id));
    }
    if (formData.ChiTietChuongTrinhDaoTao) {
      form.append('ChiTietChuongTrinhDaoTaoId', String(formData.ChiTietChuongTrinhDaoTao.id));
    }
    if (formData.DiemTongKet >= 0) form.append('DiemTongKet', String(formData.DiemTongKet));
    if (formData.KetQua) form.append('KetQua', String(formData.KetQua.id));
    if (formData.SinhVien) form.append('SinhVienId', String(formData.SinhVien.id));
    if (formData.LopHocPhan) form.append('LopHocPhanId', String(formData.LopHocPhan.id));
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        DiemTongKet: data.diemTongKet,
        KetQua: KetQuaHocBa.find((item) => item.id === data.ketQua) || null,
        SinhVien: {
          id: data.sinhVien?.id,
          name: data.sinhVien?.hoTen
        },
        LopHocPhan: {
          id: data.lopHocPhan?.id,
          name: data.lopHocPhan?.maHocPhan
        },
        ChiTietChuongTrinhDaoTao: {
          id: data.chiTietChuongTrinhDaoTao?.id,
          name: data.chiTietChuongTrinhDaoTao?.chuongTrinhDaoTao?.tenChuongTrinh
        }
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'SinhVien'}
            placeholder={'Chọn sinh viên'}
            title={'Sinh viên'}
            isLoading={isLoadingSinhVien}
            data={sinhViens ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.SinhVien as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'LopHocPhan'}
            placeholder={'Chọn lớp học phần'}
            title={'Lớp học phần'}
            isLoading={isLoadingLopHoc}
            data={lopHocPhans ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.LopHocPhan as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'ChiTietChuongTrinhDaoTao'}
            placeholder={'Chọn chi tiết chương trình đào tạo'}
            title={'Chi tiết chương trình đào tạo'}
            isLoading={isLoadingChiTiet}
            data={chiTietChuongTrinhDaoTaos ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.ChiTietChuongTrinhDaoTao as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'KetQua'}
            placeholder={'Chọn kết quả'}
            title={'Kết quả'}
            data={KetQuaHocBa ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.KetQua as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('DiemTongKet')}
            title='Điểm tổng kết'
            placeholder='Nhập điểm tổng kết'
            error={errors.DiemTongKet?.message}
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
