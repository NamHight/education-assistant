import Input2 from '@/components/inputs/Input2';
import InputSelect2 from '@/components/selects/InputSelect2';
import { IOption, LoaiPhongHoc, TrangThaiPhongHoc } from '@/types/options';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import React, { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNotifications } from '@toolpad/core';
import { PhongHocService } from '@/services/PhongHocService';

interface ModalEditProps {
  open: boolean;
  handleClose: () => void;
  id: string;
  name?: string;
  queryKey?: string;
}
export interface IFormData {
  SucChua: number;
  LoaiPhongHoc: IOption;
  TrangThaiPhongHoc: IOption;
}

const ModalEdit = ({ open, handleClose, id, name, queryKey }: ModalEditProps) => {
  const queryClient = useQueryClient();
  const notification = useNotifications();
  const { data } = useQuery({
    queryKey: ['phong-hoc', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await PhongHocService.getPhongHocById(id).catch(() => null);
      return response;
    },
    refetchOnWindowFocus: false,
    enabled: open && !!id
  });
  const schema = useMemo(() => {
    return yup.object().shape({
      SucChua: yup.number().required('Sức chứa không được để trống').min(1, 'Sức chứa phải lớn hơn 0'),
      LoaiPhongHoc: yup
        .object()
        .required('Loại phòng học không được để trống')
        .typeError('Loại phòng học không được để trống'),
      TrangThaiPhongHoc: yup
        .object()
        .required('Trạng thái phòng học không được để trống')
        .typeError('Trạng thái phòng học không được để trống')
    });
  }, [data]);
  useEffect(() => {
    if (open && !!id) {
      queryClient.invalidateQueries({
        queryKey: ['phong-hoc'],
        exact: false
      });
    }
  }, [open, id]);
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
      DiemTongKet: 0
    }
  });
  const mutateUpdate = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await PhongHocService.updatePhongHocOption(id, formData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey], exact: false });
      notification.show('Cập nhật học bạ thành công', {
        severity: 'success',
        autoHideDuration: 3000
      });
      handleClose();
      reset();
    },
    onError: (error: any) => {
      notification.show(error?.Message || 'Cập nhật học bạ thất bại', {
        severity: 'error',
        autoHideDuration: 3000
      });
    }
  });
  const handleSubmitForm = (formData: IFormData) => {
    const form = new FormData();
    form.append('SucChua', formData.SucChua.toString());
    form.append('LoaiPhongHoc', JSON.stringify(formData.LoaiPhongHoc?.id));
    form.append('TrangThaiPhongHoc', JSON.stringify(formData.TrangThaiPhongHoc?.id));
    mutateUpdate.mutate(form);
  };
  useEffect(() => {
    if (data) {
      reset({
        SucChua: data?.sucChua || 0,
        LoaiPhongHoc: data?.loaiPhongHoc ? LoaiPhongHoc.find((item) => item.id === data.loaiPhongHoc) : null,
        TrangThaiPhongHoc: data?.trangThaiPhongHoc
          ? TrangThaiPhongHoc.find((item) => item.id === data.trangThaiPhongHoc)
          : null
      });
    }
  }, [reset, data]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      slotProps={{
        paper: {
          component: 'form',
          sx: {
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'white'
          },
          onSubmit: handleSubmit(handleSubmitForm)
        }
      }}
    >
      <DialogTitle id='alert-dialog-title' className='text-lg font-semibold text-blue-600'>
        Thay đổi phòng học
        <Typography component={'span'} className='!ml-1 !text-lg !font-semibold !text-blue-600'>
          {name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} rowSpacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
            <Input2
              {...register('SucChua')}
              title='Sức chứa'
              placeholder='Nhập sức chứa'
              error={errors?.SucChua?.message}
              isDisabled={false}
              type='number'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'LoaiPhongHoc'}
              placeholder={'Chọn loại phòng học'}
              title={'Loại phòng học'}
              data={LoaiPhongHoc ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.LoaiPhongHoc as any)?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
            <InputSelect2
              control={control}
              fullWidth
              name={'TrangThaiPhongHoc'}
              placeholder={'Chọn trạng thái phòng học'}
              title={'Trạng thái phòng học'}
              data={TrangThaiPhongHoc ?? []}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option: any) => option.name}
              error={(errors.TrangThaiPhongHoc as any)?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className='!pb-5 !px-5'>
        <Button type='button' onClick={handleClose} className='!border !border-solid !text-[14px] !leading-6'>
          Hủy
        </Button>
        <Button
          type='submit'
          onClick={handleClose}
          className='!border !text-white !border-solid !text-[14px] !leading-6 !bg-blue-600 hover:!bg-blue-500 '
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalEdit;
