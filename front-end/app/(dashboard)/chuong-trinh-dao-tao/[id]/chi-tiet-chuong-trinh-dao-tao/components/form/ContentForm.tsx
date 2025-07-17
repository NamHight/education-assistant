'use client';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SaveIcon from '@mui/icons-material/Save';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import {
  HocKyLopHocPhan,
  IOption,
  LoaiMonHoc
} from '@/types/options';
import { KhoaService } from '@/services/KhoaService';
import { useQuery } from '@tanstack/react-query';
import { BoMonService } from '@/services/BoMonService';
import { ChiTietChuongTrinhDaoTao } from '@/models/ChiTietChuongTrinhDaoTao';
import { MonHocService } from '@/services/MonHocService';
import { ChuongTrinhDaoTaoService } from '@/services/ChuongTrinhDaoTaoService';
import { TriangleAlert } from 'lucide-react';


export interface IFormData {
  MonHoc: IOption;
  ChuongTrinhDaoTao: IOption;
  BoMon: IOption;
  SoTinChi: number;
  DiemTichLuy: boolean;
  LoaiMonHoc: IOption;
  HocKy: IOption;
  Khoa: IOption;
}

interface IContentFormProps {
  data?: ChiTietChuongTrinhDaoTao;
  initialData?: any;
  onSubmit: (data: any) => void;
  setKhoas?: any;
}

const ContentForm = forwardRef(({ onSubmit, data, initialData, setKhoas }: IContentFormProps, ref) => {
  const [khoa, setkhoa] = useState<{
    id: string | number | null;
    name: string;
  } | null>(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      MonHoc: yup.object().required('Vui lòng chọn môn học'),
      ChuongTrinhDaoTao: yup.object().required('Vui lòng chọn chương trình đào tạo'),
      BoMon: yup.object().required('Vui lòng chọn bộ môn'),
      SoTinChi: yup
        .number()
        .required('Số tín chỉ là bắt buộc')
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .min(1, 'Số tín chỉ không được nhỏ hơn 1')
        .max(10, 'Số tín chỉ không được lớn hơn 10'),
      DiemTichLuy: yup.boolean().notRequired(),
      LoaiMonHoc: yup.object().required('Vui lòng chọn loại môn học'),
      HocKy: yup.object().required('Vui lòng chọn học kỳ'),
      Khoa: yup.object().required('Vui lòng chọn khoa')
    });
  }, [data]);
  const { data: monHocs, isLoading: isLoadingMonHoc } = useQuery({
    queryKey: ['monhocs', khoa?.id],
    queryFn: async () => {
      if (!khoa?.id) return [];
      const response = await MonHocService.getAllMonHocByKhoaId(khoa?.id).catch(() => []);
      return response;
    },
    select: (data: any) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenMonHoc
      }));
    },
    refetchOnWindowFocus: false,
    enabled: !!khoa?.id || !!khoa
  });
  const { data: boMons, isLoading: isLoadingBoMon } = useQuery({
    queryKey: ['boMons', khoa?.id],
    queryFn: async () => {
      if (!khoa?.id) return [];
      const response = await BoMonService.getAllBoHocByKhoa(khoa?.id).catch(() => []);
      return response;
    },
    select: (data: any) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenBoMon
      }));
    },
    enabled: !!khoa?.id || !!khoa,
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
  const { data: chuongTrinhDaoTaos, isLoading: isLoadingChuongTrinh } = useQuery({
    queryKey: ['chuongTrinhDaoTaos'],
    queryFn: async () => {
      const response = await ChuongTrinhDaoTaoService.getAllChuongTrinhDaoTao({
        limit: 99999999,
        sortBy: 'createdAt',
        sortByOrder: 'desc'
      });
      return response?.data;
    },
    initialData: initialData?.chuongTrinhDaoTaos,
    select: (data: any) => {
      return data.map((item: any) => ({
        id: item.id,
        name: item.tenChuongTrinh
      }));
    },
    refetchOnWindowFocus: false
  });
  useEffect(() => {
    if (setKhoas && khoas) {
      setKhoas(khoas);
    }
  }, [setKhoas, khoas]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      MonHoc: null,
      ChuongTrinhDaoTao: null,
      BoMon: null,
      DiemTichLuy: true,
      LoaiMonHoc: null,
      HocKy: null,
      SoTinChi: 0
    }
  });

  useImperativeHandle(
    ref,
    () => ({
      handleResetForm: (data: any) => reset(data),
      setValue: (name: string, value: any) => setValue(name, value)
    }),
    [reset]
  );
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();

    if (data?.id) form.append('id', String(data.id));
    if (formData.BoMon) form.append('BoMonId', String(formData.BoMon?.id));
    if (formData.MonHoc) form.append('MonHocId', String(formData.MonHoc?.id));
    if (formData.ChuongTrinhDaoTao) form.append('ChuongTrinhDaoTaoId', String(formData.ChuongTrinhDaoTao?.id));
    form.append('SoTinChi', String(formData.SoTinChi || 0));
    form.append('DiemTichLuy', String(formData.DiemTichLuy || false));
    if (formData.LoaiMonHoc) form.append('LoaiMonHoc', String(formData.LoaiMonHoc?.id));
    if (formData.HocKy) form.append('HocKy', String(formData.HocKy?.id));
    if (onSubmit) {
      onSubmit(form);
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        MonHoc: {
          id: data.monHoc?.id || '',
          name: data.monHoc?.tenMonHoc || ''
        },
        ChuongTrinhDaoTao: {
          id: data.chuongTrinhDaoTao?.id || '',
          name: data.chuongTrinhDaoTao?.tenChuongTrinh || ''
        },
        BoMon: {
          id: data.boMon?.id || '',
          name: data.boMon?.tenBoMon || ''
        },
        Khoa: {
          id: data.monHoc?.khoa?.id || '',
          name: data.monHoc?.khoa?.tenKhoa || ''
        },
        SoTinChi: data.soTinChi || '',
        DiemTichLuy: data.diemTichLuy || false,
        LoaiMonHoc: LoaiMonHoc.find((item) => item.id === data.loaiMonHoc) || null,
        HocKy: HocKyLopHocPhan.find((item) => item.id === data.hocKy) || null
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
            name={'ChuongTrinhDaoTao'}
            placeholder={'Chọn chương trình đào tạo'}
            isLoading={isLoadingChuongTrinh}
            title={'Chương trình đào tạo'}
            data={chuongTrinhDaoTaos ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.ChuongTrinhDaoTao as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Input2
            {...register('SoTinChi')}
            title='Số tín chỉ'
            placeholder='Nhập số tín chỉ'
            error={errors.SoTinChi?.message}
            isDisabled={false}
            type='number'
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className='relative'>
          <Box className='flex absolute items-center gap-1 left-11 top-[2px] text-amber-300'>
            <TriangleAlert className='h-3 w-3' />
            <Typography>Bắt buộc</Typography>
          </Box>
          <InputSelect2
            control={control}
            fullWidth
            name={'Khoa'}
            placeholder={'Chọn khoa'}
            isLoading={isLoadingKhoa}
            title={'Khoa'}
            data={khoas ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            getOnChangeValue={(option) => {
              setkhoa(option);
              setValue('BoMon', null);
              setValue('MonHoc', null);
            }}
            error={(errors.Khoa as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'BoMon'}
            placeholder={'Chọn bộ môn'}
            isLoading={isLoadingBoMon}
            title={'Bộ môn'}
            data={boMons ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.BoMon as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'MonHoc'}
            placeholder={'Chọn môn học'}
            isLoading={isLoadingMonHoc}
            title={'Môn học'}
            data={monHocs ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.MonHoc as any)?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'LoaiMonHoc'}
            placeholder={'Chọn loại môn học'}
            title={'Loại môn học'}
            data={LoaiMonHoc ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.LoaiMonHoc as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <InputSelect2
            control={control}
            fullWidth
            name={'HocKy'}
            placeholder={'Chọn học kỳ'}
            title={'Học kỳ'}
            data={HocKyLopHocPhan ?? []}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option: any) => option.name}
            error={(errors.HocKy as any)?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
          <FormControlLabel
            control={
              <Controller
                name='DiemTichLuy'
                control={control}
                render={({ field }) => <Checkbox checked={field.value} {...field} />}
              />
            }
            label='Điểm tích lũy'
            sx={{
              span: {
                fontSize: '16px',
                fontWeight: '500',
                color: 'initial'
              }
            }}
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
});

export default memo(ContentForm);
