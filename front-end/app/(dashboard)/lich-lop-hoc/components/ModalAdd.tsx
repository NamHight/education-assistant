'use client';
import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import { LichBieuService } from '@/services/LichBieuService';
import { LopHocPhanService } from '@/services/LopHocPhanService';
import { PhongHocService } from '@/services/PhongHocService';
import { TuanService } from '@/services/TuanService';
import { IOption, ThuTrongTuan, yearOptions } from '@/types/options';
import { IParamTuan } from '@/types/params';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import { set } from 'lodash';
import { TriangleAlert } from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
interface ModalAddProps {
  open: boolean;
  handleClose: () => void;
  queryKey?: string;
  filter?: {
    namHoc: {
      id: string | number;
      name: string;
    };
    tuan: {
      id: string;
      name: string;
    };
    giangVien: {
      id: string;
      name: string;
    };
    hocKy: number | string;
    lopHoc: {
      id: string;
      name: string;
    };
  } | null;
}
export interface IFormData {
  TietBatDau: number;
  TietKetThuc: number;
  Thu?: IOption;
  Tuan?: IOption;
  LopHocPhan?: IOption;
  PhongHoc?: IOption;
}
const ModalAdd = forwardRef(({ open, handleClose, queryKey, filter }: ModalAddProps, ref) => {
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [filterAdd, setFilterAdd] = useState<{
    namHoc: number | string;
  } | null>(null);
  const schema = useMemo(() => {
    return yup.object().shape({
      TietBatDau: yup.number().min(1, 'Tiết bắt đầu phải lớn hơn hoặc bằng 1').max(99,"Tiết bắt đầu phải nhỏ hơn hoặc bằng 99").typeError('Tiết bắt đầu phải là số').required('Tiết bắt đầu là bắt buộc'),
      TietKetThuc: yup.number().min(1, 'Tiết kết thúc phải lớn hơn hoặc bằng 1').max(99,"Tiết kết thúc phải nhỏ hơn hoặc bằng 99").typeError('Tiết kết thúc phải là số').required('Tiết kết thúc là bắt buộc'),
      Thu: yup.object().required('Thứ là bắt buộc'),
      Tuan: yup.object().required('Tuần là bắt buộc'),
      LopHocPhan: yup.object().required('Lớp học phần là bắt buộc'),
      PhongHoc: yup.object().required('Phòng học là bắt buộc')
    });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<IFormData | any>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {}
  });

  const { data: tuans, isLoading: isLoadingTuan } = useQuery({
    queryKey: ['tuan-list', filterAdd?.namHoc],
    queryFn: async () => {
      const params: IParamTuan = {
        namHoc: filterAdd?.namHoc
      };
      const result = await TuanService.getAllTuanByNamHoc(params);
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: `${item.soTuan}`
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: !!filterAdd?.namHoc
  });
  const { data: lopHocPhans, isLoading: isLoadingLHP } = useQuery({
    queryKey: ['lop-hoc-phan-list', filter?.lopHoc?.id, filter?.hocKy],
    queryFn: async () => {
      const result = await LopHocPhanService.getLopHocPhanByLopHocAndHocKy({
        lopHocId: filter?.lopHoc?.id,
        hocKy: filter?.hocKy
      });
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.maHocPhan
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: open
  });
  const { data: phongHocs, isLoading: isLoadingPhongHoc } = useQuery({
    queryKey: ['phong-hoc-list'],
    queryFn: async () => {
      const result = await PhongHocService.getPhongHocNoPage();
      return result;
    },
    select: (data) => {
      return data?.map((item: any) => ({
        id: item.id,
        name: item.tenPhong
      }));
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    enabled: open
  });
  const mutationAdd = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await LichBieuService.createLichBieu(data);
      return result;
    },
    onSuccess: (data) => {
      notification.show('Thêm lịch công tác thành công', {
        severity: 'success',
        autoHideDuration: 3000
      });
      queryClient.invalidateQueries({
        queryKey: queryKey ? [queryKey] : ['lich-cong-tac-tuan-list'],
        exact: false
      });
      handleClose();
      reset();
    },
    onError: (error) => {
      notification.show('Thêm lịch công tác thất bại', {
        severity: 'error',
        autoHideDuration: 3000
      });
      console.error('Error adding schedule:', error);
    }
  });
  const handleSubmitForm = (data: IFormData) => {
    const formData = new FormData();
    formData.append('TietBatDau', data.TietBatDau.toString());
    formData.append('TietKetThuc', data.TietKetThuc.toString());
    formData.append('Thu', data.Thu?.id.toString() || '');
    formData.append('TuanId', data.Tuan?.id.toString() || '');
    formData.append('LopHocPhanId', data.LopHocPhan?.id.toString() || '');
    formData.append('PhongHocId', data.PhongHoc?.id.toString() || '');
    mutationAdd.mutate(formData);
  };
  useEffect(() => {
    if (filter?.namHoc && filter?.tuan?.id) {
      reset({
        namHoc: filter.namHoc,
        Tuan: filter.tuan
      });
    } else {
      reset({
        TietBatDau: '',
        TietKetThuc: '',
        Thu: null,
        Tuan: null,
        LopHocPhan: null,
        PhongHoc: null,
        namHoc: null
      });
    }
  }, [filter, reset, open]);
  useImperativeHandle(ref, () => ({
    reset: () => reset()
  }));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      slotProps={{
        paper: {
          component: 'form',
          className: 'w-full max-w-3xl !bg-white rounded-lg shadow-lg p-3',
          onSubmit: handleSubmit(handleSubmitForm)
        }
      }}
    >
      <DialogTitle id='alert-dialog-title' component={'div'}>
        <Typography variant='h5' fontWeight='bold' color='primary.main'>
          Thêm mới lịch học
        </Typography>
        <Typography variant='subtitle1' color='text.secondary' className='!text-[13px]'>
          Vui lòng nhập đầy đủ thông tin bên dưới để thêm lịch học
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Input2
              {...register('TietBatDau')}
              title='Tiết bắt đầu'
              placeholder='Nhập tiết bắt đầu'
              error={errors.TietBatDau?.message}
              isDisabled={false}
              type='number'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <Input2
              {...register('TietKetThuc')}
              title='Tiết kết thúc'
              placeholder='Nhập tiết kết thúc'
              error={errors.TietKetThuc?.message}
              isDisabled={false}
              type='number'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'Thu'}
              placeholder={'Chọn thứ'}
              title={'Thứ'}
              data={ThuTrongTuan ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.Thu as any)?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'namHoc'}
              placeholder={'Chọn năm học'}
              title={'Năm học'}
              data={yearOptions ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.namHoc as any)?.message}
              getOnChangeValue={(value: any) => {
                setFilterAdd((prev) => ({
                  ...prev,
                  namHoc: value?.id
                }));
                setValue('Tuan', null);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'Tuan'}
              placeholder={'Chọn tuần'}
              title={'Tuần'}
              isLoading={isLoadingTuan}
              data={tuans ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.Tuan as any)?.message}
            />
            <Typography color='warning.main' variant='caption' display='flex' alignItems='center' gap={0.5}>
              <TriangleAlert className='h-4 w-4' />
              Vui lòng chọn năm trước khi chọn tuần
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'LopHocPhan'}
              isLoading={isLoadingLHP}
              placeholder={'Chọn lớp học phần'}
              title={'Lớp học phần'}
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
              name={'PhongHoc'}
              isLoading={isLoadingPhongHoc}
              placeholder={'Chọn phòng học'}
              title={'Phòng học'}
              data={phongHocs ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.PhongHoc as any)?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='!px-3 !pb-'>
        <Button type='button' onClick={handleClose}>
          Hủy
        </Button>
        <Button autoFocus type='submit' variant='contained' color='info'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ModalAdd;
