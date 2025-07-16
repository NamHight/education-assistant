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
import { TriangleAlert } from 'lucide-react';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  id?: string | number;
}
export interface IFormData {
  TietBatDau: number;
  TietKetThuc: number;
  Thu?: IOption;
  Tuan?: IOption;
  LopHocPhan?: IOption;
  PhongHoc?: IOption;
}
const ModalEdit = forwardRef(({ open, handleClose, queryKey, filter, id }: ModalAddProps, ref) => {
  const { data, refetch } = useQuery({
    queryKey: ['lich-lop-hoc', id],
    queryFn: async () => {
      if (!id) return null;
      const result = await LichBieuService.getLichBieuById(id);
      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!id
  });
  const notification = useNotifications();
  const queryClient = useQueryClient();
  const [filterAdd, setFilterAdd] = useState<{
    namHoc: number | string;
  } | null>(null);
  const schema = useMemo(() => {
    return yup.object().shape({
      TietBatDau: yup
        .number()
        .min(1, 'Tiết bắt đầu phải lớn hơn 0')
        .max(99, 'Tiết bắt đầu phải nhỏ hơn 100')
        .typeError('Tiết bắt đầu phải là số')
        .required('Tiết bắt đầu là bắt buộc'),
      TietKetThuc: yup
        .number()
        .min(1, 'Tiết kết thúc phải lớn hơn 0')
        .max(99, 'Tiết kết thúc phải nhỏ hơn 100')
        .typeError('Tiết kết thúc phải là số')
        .required('Tiết kết thúc là bắt buộc'),
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
  useEffect(() => {
    if (open && id) {
      refetch();
    }
  }, [open, id, refetch]);
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
  const mutationUpdate = useMutation({
    mutationFn: async (data: FormData) => {
      if (!id) return;
      const result = await LichBieuService.updateLichBieu(id, data);
      return result;
    },
    onSuccess: (data) => {
      notification.show('Cập nhật lịch thành công', {
        severity: 'success',
        autoHideDuration: 3000
      });
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        exact: false
      });
      reset();
      handleClose();
    },
    onError: (error) => {
      notification.show('Cập nhật lịch công tác thất bại', {
        severity: 'error',
        autoHideDuration: 3000
      });
    }
  });
  const handleSubmitForm = (data: IFormData) => {
    if (!id) {
      notification.show('Không có id để cập nhật', {
        severity: 'error',
        autoHideDuration: 3000
      });
      return;
    }
    const formData = new FormData();
    formData.append('Id', id?.toString() || '');
    formData.append('TietBatDau', data.TietBatDau.toString());
    formData.append('TietKetThuc', data.TietKetThuc.toString());
    formData.append('Thu', data.Thu?.id.toString() || '');
    formData.append('TuanId', data.Tuan?.id.toString() || '');
    formData.append('LopHocPhanId', data.LopHocPhan?.id.toString() || '');
    formData.append('PhongHocId', data.PhongHoc?.id.toString() || '');
    mutationUpdate.mutate(formData);
  };

  useEffect(() => {
    if (data) {
      setFilterAdd({
        namHoc: data.tuan.namHoc
      });
      reset({
        TietBatDau: data.tietBatDau,
        TietKetThuc: data.tietKetThuc,
        Thu: ThuTrongTuan.find((item) => item.id === data.thu),
        Tuan: {
          id: data.tuan.id,
          name: `${data.tuan.soTuan}`
        },
        LopHocPhan: {
          id: data.lopHocPhan.id,
          name: data.lopHocPhan.maHocPhan
        },
        PhongHoc: {
          id: data.phongHoc.id,
          name: data.phongHoc.tenPhong
        },
        namHoc: {
          id: data.tuan.namHoc,
          name: `${data.tuan.namHoc}`
        }
      });
    }
  }, [data]);

  useImperativeHandle(ref, () => ({
    reset: (data: any) => reset(data)
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
          Cập nhật lịch học
        </Typography>
        <Typography variant='subtitle1' color='text.secondary' className='!text-[13px]'>
          Vui lòng nhập đầy đủ thông tin bên dưới để cập nhật lịch học
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
        <Button type='button' onClick={handleClose} variant='outlined' color='error'>
          Hủy
        </Button>
        <Button autoFocus type='submit' variant='contained' color='info'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ModalEdit;
