'use client';
import React, { FC, memo, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import {
  IOption,
  LoaiChuongTrinhDaoTao,
  yearOptions
} from '@/types/options';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import TextArea from '@/components/textarea/TextArea';
import { ChuongTrinhDaoTao } from '@/models/ChuongTrinhDaoTao';
import { NganhService } from '@/services/NganhService';
import { useBreadcrumb } from '@/hooks/context/BreadCrumbContext';

export interface IFormData {
  MaChuongTrinh: string;
  TenChuongTrinh: string;
  LoaiChuonTrinhDaoTao: IOption;
  ThoiGianDaoTao: number;
  MoTa: string;
  TongSoTinChi: number;
  Khoa: IOption;
  Nganh: IOption;
}

interface IContentFormProps {
  data?: ChuongTrinhDaoTao;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const { setBreadcrumbs, setTitle } = useBreadcrumb();
  const schema = useMemo(() => {
    return yup.object().shape({
      MaChuongTrinh: yup.string().notRequired(),
      TenChuongTrinh: yup
        .string()
        .max(255, 'Tên chương trình không được vượt quá 255 ký tự')
        .required('Tên chương trình không được để trống'),
      LoaiChuonTrinhDaoTao: yup.object().required('Loại chương trình đào tạo không được để trống'),
      ThoiGianDaoTao: yup
        .number()
        .min(1, 'Thời gian đào tạo phải lớn hơn hoặc bằng 1')
        .required('Thời gian đào tạo không được để trống'),
      MoTa: yup.string().optional(),
      TongSoTinChi: yup
        .number()
        .required('Tổng số tín chỉ không được để trống')
        .min(1, 'Tổng số tín chỉ phải lớn hơn hoặc bằng 1')
        .transform((value, originalValue) => (originalValue === '' ? null : value)),
      Khoa: yup.object().required('Khóa không được để trống'),
      Nganh: yup.object().required('Ngành không được để trống')
    });
  }, [data]);
  const { data: nganhs, isLoading: isLoadingNganh } = useQuery({
    queryKey: ['nganhs'],
    queryFn: async () => {
      const response = await NganhService.getAllNganh({
        limit: 99999999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.nganhs,
    select: (data: any) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenNganh
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
      TenChuongTrinh: '',
      LoaiChuonTrinhDaoTao: null,
      ThoiGianDaoTao: 0,
      MoTa: '',
      TongSoTinChi: 0,
      Khoa: null,
      Nganh: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData?.TenChuongTrinh) {
      form.append('TenChuongTrinh', formData.TenChuongTrinh);
    }
    if (formData?.ThoiGianDaoTao) {
      form.append('ThoiGianDaoTao', String(formData.ThoiGianDaoTao));
    }
    if (formData?.TongSoTinChi) {
      form.append('TongSoTinChi', formData.TongSoTinChi.toString());
    }
    if (formData?.LoaiChuonTrinhDaoTao) {
      form.append('LoaiChuonTrinhDaoTao', String(formData.LoaiChuonTrinhDaoTao.id));
    }
    if (formData?.Khoa) {
      form.append('Khoa', String(formData.Khoa?.id));
    }
    if (formData?.Nganh) {
      form.append('NganhId', String(formData.Nganh?.id));
      const initials = formData.Nganh?.name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase())
        .join('');
      const year = moment().format('YYYY');
      form.append('MaChuongTrinh', initials + year);
    }
    if (formData?.MoTa) {
      form.append('MoTa', formData.MoTa);
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        TenChuongTrinh: data.tenChuongTrinh || '',
        ThoiGianDaoTao: data.thoiGianDaoTao || '',
        MoTa: data.moTa || '',
        TongSoTinChi: data.tongSoTinChi || 0,
        LoaiChuonTrinhDaoTao: LoaiChuongTrinhDaoTao.find((item) => item.id === data.loaiChuonTrinhDaoTao) || null,
        Khoa: yearOptions.find((item) => item.id === data.khoa),
        Nganh: {
          id: data.nganh?.id || '',
          name: data.nganh?.tenNganh || ''
        }
      });
    }
  }, [reset, data]);
  useEffect(() => {
    if (data) {
      setBreadcrumbs(
        [
          <Typography key={data?.id} className='relative text-[14px] flex gap-1 items-center'>
            <Typography
              component={'span'}
              sx={(theme) => ({
                color: theme.palette.mode === 'dark' ? 'white !important' : 'black !important',
                fontWeight: 500
            })}
          >
            {data?.tenChuongTrinh}
          </Typography>
        </Typography>

        ]
      );
      setTitle(`Chỉnh sửa ${data?.tenChuongTrinh}`);
      return () => {
        setBreadcrumbs([]);
        setTitle('');
      };
    }
  }, [data, setBreadcrumbs]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TenChuongTrinh')}
            title='Tên chương trình'
            placeholder='Nhập tên chương trình'
            error={errors.TenChuongTrinh?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('ThoiGianDaoTao')}
            title='Thời gian đào tạo'
            placeholder='Nhập thời gian đào tạo'
            error={errors.ThoiGianDaoTao?.message}
            isDisabled={false}
            type='number'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'Khoa'}
            placeholder={'Chọn khóa'}
            title={'Khóa'}
            data={yearOptions ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Khoa as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TongSoTinChi')}
            title='Tổng số tín chỉ'
            placeholder='Nhập tổng số tín chỉ'
            error={errors.TongSoTinChi?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'LoaiChuonTrinhDaoTao'}
            placeholder={'Chọn loại chương trình đào tạo'}
            title={'Loại chương trình đào tạo'}
            data={LoaiChuongTrinhDaoTao ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.LoaiChuonTrinhDaoTao as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'Nganh'}
            placeholder={'Chọn ngành'}
            isLoading={isLoadingNganh}
            title={'Ngành'}
            data={nganhs ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Nganh as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
          <TextArea
            {...register('MoTa')}
            placeholder={'Nhập mô tả'}
            title={'Mô tả'}
            errorMessage={errors?.MoTa?.message?.toString()}
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
