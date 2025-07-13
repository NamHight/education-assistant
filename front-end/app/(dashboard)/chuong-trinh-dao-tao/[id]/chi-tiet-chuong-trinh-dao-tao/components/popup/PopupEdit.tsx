import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import { BoMonService } from '@/services/BoMonService';
import { MonHocService } from '@/services/MonHocService';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { HocKyLopHocPhan, IOption, LoaiMonHoc } from '@/types/options';
import { TriangleAlert } from 'lucide-react';
import { ChitietChuongTrinhDaoTaoService } from '@/services/ChitietChuongTrinhDaoTaoService';
import { useNotifications } from '@toolpad/core';
interface IProps {
  khoas?: any[];
  open: boolean;
  onClose: () => void;
  getId: any;
  chuongTrinhDaoTao?: IOption | null;
  queryKey?: string;
  isLoadingKhoa?: boolean;
}

export interface IFormData {
  MonHoc: IOption;
  ChuongTrinhDaoTao: IOption;
  BoMon: IOption;
  SoTinChi: string;
  DiemTichLuy: boolean;
  LoaiMonHoc: IOption;
  HocKy: IOption;
  Khoa: IOption;
  
}

const PopupEdit = ({ khoas, open, onClose, getId, queryKey, chuongTrinhDaoTao, isLoadingKhoa }: IProps) => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();
  const notification = useNotifications();
  const [khoa, setkhoa] = useState<{
    id: string | number | null;
    name: string;
  } | null>(null);
  const { data } = useQuery({
    queryKey: ['chi-tiet-chuong-trinh-dao-tao', { id: getId }],
    queryFn: async () => {
      const result = await ChitietChuongTrinhDaoTaoService.getChiTietChuongTrinhDaoTaoById(getId);
      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!getId,
    gcTime: 0,
    staleTime: 0
  });
  const schema = useMemo(() => {
    return yup.object().shape({
      MonHoc: yup.object().required('Vui lòng chọn môn học'),
      ChuongTrinhDaoTao: yup.object().required('Vui lòng chọn chương trình đào tạo'),
      BoMon: yup.object().required('Vui lòng chọn bộ môn'),
      SoTinChi: yup
        .number()
        .required('Số tín chỉ là bắt buộc')
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .min(0, 'Số tín chỉ không được nhỏ hơn 0')
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
      MonHoc: null,
      ChuongTrinhDaoTao: null,
      BoMon: null,
      SoTinChi: '',
      DiemTichLuy: false,
      LoaiMonHoc: null,
      HocKy: null,
      Khoa: {
        id: khoa?.id || null,
        name: khoa?.name || ''
      }
    }
  });

  useEffect(() => {
    if (data) {
      setkhoa({
        id: data.monHoc?.khoa?.id || null,
        name: data.monHoc?.khoa?.tenKhoa || ''
      });
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
  useEffect(() => {
  if (open && !getId) {
    reset({
      MonHoc: null,
      ChuongTrinhDaoTao: {
        id: chuongTrinhDaoTao?.id || null,
        name: chuongTrinhDaoTao?.name || ''
      },
      BoMon: null,
      SoTinChi: '',
      DiemTichLuy: true,
      LoaiMonHoc: null,
      HocKy: null,
      Khoa: null
    });
  }
}, [open, getId, reset]);
  const mutationUpdate = useMutation({
    mutationFn: async (data: FormData) => {
      console.log('data', getId);
      const result = await ChitietChuongTrinhDaoTaoService.updateChiTietChuongTrinhDaoTao(getId, data);
      return result;
    },
    onSuccess: async (data: any) => {
      console.log('Cập nhật chi tiết chương trình đào tạo thành công:', data);
      notifications.show('Thay đổi thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
      queryClient.invalidateQueries({ queryKey: ['chi-tiet-chuong-trinh-dao-tao'], exact: false });
      onClose();
      reset();
    },
    onError: (error: any) => {
      notifications.show(error.Message, {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });
  const mutationCreate = useMutation({
     mutationFn: async (formData: any) => {
          const response = await ChitietChuongTrinhDaoTaoService.createChiTietChuongTrinhDaoTao(formData);
          return response;
        },
    onSuccess: async (data) => {
      console.log('Thêm chi tiết chương trình đào tạo thành công:', data);
      notification.show('Thêm thành công', {
        severity: 'success',
        autoHideDuration: 4000
      });
      queryClient.invalidateQueries({
        queryKey: ['chi-tiet-chuong-trinh-dao-tao-list'],
        exact: false
      });
      reset();
      onClose();
      await queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Thêm thất bại', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  })
  useEffect(() => {
  if (open && getId) {
    queryClient.invalidateQueries({ queryKey: ['chi-tiet-chuong-trinh-dao-tao', { id: getId }] });
  }
  }, [open, getId, queryClient]);

  const handleSubmitForm = useCallback((formData: IFormData) => {
    const form = new FormData();
    if (data?.id) form.append('id', String(data.id));
    if (formData.BoMon) form.append('BoMonId', String(formData.BoMon?.id));
    if (formData.MonHoc) form.append('MonHocId', String(formData.MonHoc?.id));
    if (formData.ChuongTrinhDaoTao) form.append('ChuongTrinhDaoTaoId', String(formData.ChuongTrinhDaoTao?.id));
    form.append('SoTinChi', String(formData.SoTinChi || 0));
    form.append('DiemTichLuy', String(formData.DiemTichLuy || false));
    if (formData.LoaiMonHoc) form.append('LoaiMonHoc', String(formData.LoaiMonHoc?.id));
    if (formData.HocKy) form.append('HocKy', String(formData.HocKy?.id));
    if(data){
      mutationUpdate.mutate(form);
    }else{
      mutationCreate.mutate(form);
    }
  },[data]);
  const handleClose = () => {
    onClose();
    reset({});
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          className: 'p-2 w-full max-w-[600px] bg-white',
          component: 'form',
          onSubmit: handleSubmit(handleSubmitForm)
        }
      }}
    >
      <DialogTitle>{data ? "Chỉnh sửa chi tiết đào tạo" : "Thêm mới chi tiết đào tạo"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Box className='flex flex-col gap-1'>
              <Typography className='!text-[16px] !font-[500] !leading-6 !text-gray-500 mb-1'>
                Chương trình đào tạo
              </Typography>
              <Box
                className='rounded bg-gray-100 px-3 py-2 border border-gray-200 text-[15px] text-gray-800 font-medium'
                style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}
              >
                {chuongTrinhDaoTao?.name || ''}
              </Box>
            </Box>
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
              title={'Khoa'}
              data={khoas ?? []}
              isLoading={isLoadingKhoa}
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
                  render={({ field }) => <Checkbox checked={!!field.value} {...field} />}
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
      </DialogContent>
      <DialogActions>
        <Button
          title='hủy'
          onClick={() => {
            onClose();
            reset();
          }}
          type='button'
        >
          Hủy
        </Button>
        <Button title='Cập nhật' type='submit' className='!bg-blue-500 !text-white hover:!bg-blue-600'>
          {data? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupEdit;
