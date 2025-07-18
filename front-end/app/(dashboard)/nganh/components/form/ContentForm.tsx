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
import TextArea from '@/components/textarea/TextArea';
import { Nganh } from '@/models/Nganh';
import { NganhService } from '@/services/NganhService';

export interface IFormData {
  TenNganh: string;
  MoTa: string;
  Khoa: IOption;
  Nganh?: IOption;
}

interface IContentFormProps {
  data?: Nganh;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const [khoaId, setKhoaId] = React.useState<number | string | null>(null); // State to hold the selected Khoa ID

  const schema = useMemo(() => {
    return yup.object().shape({
      TenNganh: yup.string().max(200, 'Tên ngành không được quá 200 ký tự').required('Tên ngành không được để trống'),
      MoTa: yup.string().notRequired(),
      Khoa: yup.object().required('Khoa không được để trống')
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
      MaNganh: '',
      TenNganh: '',
      MoTa: '',
      Khoa: null,
      Nganh: null
    }
  });
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
  const selectedKhoa = watch('Khoa')?.id;
  useEffect(() => {
    setKhoaId(selectedKhoa);
  }, [selectedKhoa]);
  const { data: nganhs, isLoading: isLoadingNganh } = useQuery({
    queryKey: ['nganhs', khoaId],
    queryFn: async () => {
      const response = await NganhService.getAllNganhByKhoaId(khoaId);
      return response;
    },
    initialData: initialData?.nganhs,
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenNganh
      }));
    },
    refetchOnWindowFocus: false,
    enabled: !!khoaId
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData?.TenNganh) {
      form.append('TenNganh', formData.TenNganh);
    }
    if (formData?.MoTa) {
      form.append('MoTa', formData.MoTa);
    }
    if (formData?.Khoa) {
      form.append('KhoaId', String(formData.Khoa?.id));
    }
    if (formData?.Nganh) {
      form.append('NganhChaId', String(formData.Nganh?.id));
    }
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        MaNganh: data.maNganh || '',
        TenNganh: data.tenNganh || '',
        MoTa: data.moTa || '',
        Khoa: {
          id: data.khoa?.id || '',
          name: data.khoa?.tenKhoa || ''
        },
        Nganh: data.nganhCha
          ? {
              id: data.nganhCha.id,
              name: data.nganhCha.tenNganh
            }
          : null
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('TenNganh')}
            title='Tên ngành'
            placeholder='Nhập tên ngành'
            error={errors.TenNganh?.message}
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
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'Nganh'}
            placeholder={'Chọn ngành'}
            title={'Ngành'}
            isLoading={isLoadingNganh}
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
