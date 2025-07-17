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
  yearOptions
} from '@/types/options';
import { KhoaService } from '@/services/KhoaService';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { LopHoc } from '@/models/LopHoc';
import { GiangVienService } from '@/services/GiangVienService';
import { NganhService } from '@/services/NganhService';

export interface IFormData {
  MaLopHoc: string;
  SiSo: number;
  NamHoc: IOption;
  GiangVien: IOption;
  Nganh: IOption;
}

interface IContentFormProps {
  data?: LopHoc;
  initialData?: any;
  onSubmit: (data: any) => void;
}

const ContentForm: FC<IContentFormProps> = ({ onSubmit, data, initialData }) => {
  const [getKhoa, setKhoa] = React.useState<string>('');
  const schema = useMemo(() => {
    return yup.object().shape({
      MaLopHoc: yup
        .string()
        .required('Mã lớp học không được để trống')
        .max(50, 'Mã lớp học không được vượt quá 50 ký tự'),
      SiSo: yup
        .number()
        .typeError('Sĩ số phải là số')
        .required('Sĩ số không được để trống')
        .min(1, 'Sĩ số phải lớn hơn 0'),
      NamHoc: yup.object().required('Năm học không được để trống'),
      GiangVien: yup.object().nullable().required('Giảng viên không được để trống'),
      Nganh: yup.object().nullable().required('Ngành không được để trống')
    });
  }, [data]);

  const { data: giangViens, isLoading: isLoadingGiangVien } = useQuery({
    queryKey: ['giangviens', getKhoa],
    queryFn: async () => {
      const response = await GiangVienService.getGiangVienByKhoaId(getKhoa);
      return response;
    },
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.hoTen
      }));
    },
    enabled: Boolean(getKhoa),
    refetchOnWindowFocus: false
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
  const { data: nganhs, isLoading: isLoadingNganh } = useQuery({
    queryKey: ['nganhs', getKhoa],
    queryFn: async () => {
      const response = await NganhService.getNganhByKhoaId(getKhoa);
      return response;
    },
    select: (data) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenNganh
      }));
    },
    enabled: Boolean(getKhoa),
    refetchOnWindowFocus: false
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    getValues,
    setValue
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      MaLopHoc: '',
      SiSo: 0,
      NamHoc: null,
      GiangVien: null,
      Nganh: null
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    if (data?.id) {
      form.append('Id', data.id);
    }
    if (formData.MaLopHoc) {
      form.append('MaLopHoc', formData.MaLopHoc);
    }
    if (formData.SiSo) {
      form.append('SiSo', formData.SiSo.toString());
    }
    if (formData.NamHoc) {
      form.append('NamHoc', formData.NamHoc.id.toString());
    }
    if (formData.GiangVien) {
      form.append('GiangVienId', String(formData.GiangVien?.id));
    }
    if (formData.Nganh) {
      form.append('NganhId', String(formData.Nganh?.id));
    }
    form.append('CreatedAt', moment().toISOString());
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      setKhoa(data.nganh?.khoa?.id || '');
      reset({
        MaLopHoc: data.maLopHoc,
        SiSo: data.siSo,
        NamHoc: yearOptions.find((item: any) => item.id === data.namHoc) || '',
        GiangVien: {
          id: data.giangVien?.id,
          name: data.giangVien?.hoTen
        },
        Khoa: {
          id: data?.nganh?.khoa?.id,
          name: data?.nganh?.khoa?.tenKhoa
        },
        Nganh: {
          id: data.nganh?.id,
          name: data.nganh?.tenNganh
        }
      });
    }
  }, [reset, data]);
  return (
    <FormControl fullWidth component={'form'} onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col gap-4'>
      <Grid container spacing={2} rowSpacing={1}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('MaLopHoc')}
            title='Mã lớp học'
            placeholder='Mã lớp học'
            error={errors.MaLopHoc?.message}
            isDisabled={false}
            type='text'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('SiSo')}
            title='Sĩ số'
            placeholder='Nhập sĩ số'
            error={errors.SiSo?.message}
            isDisabled={false}
            type='number'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className='relative'>
          <InputSelect2
            control={control}
            fullWidth
            name={'Khoa'}
            placeholder={'Chọn khoa'}
            title={'Khoa'}
            data={khoas ?? []}
            isLoading={isLoadingKhoa}
            getOnChangeValue={(option) => {
              setKhoa(option?.id);
              setValue('GiangVien', null);
              setValue('Nganh', null);
            }}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Khoa as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'GiangVien'}
            placeholder={'Chọn giảng viên'}
            title={'Giảng viên'}
            data={giangViens ?? []}
            isLoading={isLoadingGiangVien}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.GiangVien as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          {
            data ? (
              <Box className='flex flex-col gap-1'>
                            <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>Ngành</Typography>
                            <Box
                              className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                              style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
                            >
                              {data.nganh?.tenNganh || ""}
                            </Box>
                          </Box>
            ) : (
              <InputSelect2
            control={control}
            fullWidth
            name={'Nganh'}
            placeholder={'Chọn ngành'}
            title={'Ngành'}
            data={nganhs ?? []}
            isLoading={isLoadingNganh}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.Nganh as any)?.message}
          />
            )
          }
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'NamHoc'}
            placeholder={'Chọn năm học'}
            title={'Năm học'}
            data={yearOptions ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.NamHoc as any)?.message}
          />
        </Grid>
      </Grid>
      <Box>
        <Button
          type={'submit'}
          className='flex items-center gap-3 !bg-blue-500 !px-4 !py-2 rounded !hover:bg-blue-600 transition-all !duration-200 !ease-in-out !shadow-sm !text-white !font-semibold !text-base !leading-6 hover:transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <SaveIcon className='!text-white !w-6 !h-6' />
          <Typography className='!text-lg !text-white !leading-6 !font-semibold'>{data ? 'Lưu' : 'Tạo'}</Typography>
        </Button>
      </Box>
    </FormControl>
  );
};

export default memo(ContentForm);
