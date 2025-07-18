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
  IOption
} from '@/types/options';
import { KhoaService } from '@/services/KhoaService';
import { useQuery } from '@tanstack/react-query';
import { MonHoc } from '@/models/MonHoc';
import TextArea from '@/components/textarea/TextArea';

export interface IFormData {
  TenMonHoc: string;
  MoTa: string;
  Khoa: IOption;
}

interface IContentFormProps {
  data?: MonHoc;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const schema = useMemo(() => {
    return yup.object().shape({
      TenMonHoc: yup
        .string()
        .max(200, 'Tên môn học không được quá 200 ký tự')
        .required('Tên môn học không được để trống'),
      MoTa: yup.string().notRequired(),
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
      MaMonHoc: '',
      TenMonHoc: '',
      MoTa: '',
      Khoa: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData?.TenMonHoc) {
      form.append('TenMonHoc', formData.TenMonHoc);
    }
    if (formData?.MoTa) {
      form.append('MoTa', formData.MoTa);
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
        MaMonHoc: data.maMonHoc || '',
        TenMonHoc: data.tenMonHoc || '',
        MoTa: data.moTa || '',
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
            {...register('TenMonHoc')}
            title='Tên môn học'
            placeholder='Nhập tên môn học'
            error={errors.TenMonHoc?.message}
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
        <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
          <TextArea
            {...register('MoTa')}
            placeholder={'Nhập mô tả'}
            title={'Mô tả'}
            errorMessage={errors?.MoTa?.message?.toString()}
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
