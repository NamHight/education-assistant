'use client';
import Input2 from '@/components/inputs/Input2';
import { passwordPattern } from '@/lib/pattern';
import { GiangVienService } from '@/services/GiangVienService';
import { useUser } from '@/stores/selectors';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '@toolpad/core';
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export interface IFormData {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword?: string;
}

const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const notification = useNotifications();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const user = useUser();
  const handleClose = () => {
    setOpen(false);
  };
  const schema = useMemo(() => {
    return yup.object().shape({
      OldPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
      NewPassword: yup
        .string()
        .matches(
          passwordPattern,
          'Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số'
        )
        .required('Mật khẩu mới là bắt buộc')
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
      ConfirmPassword: yup
        .string()
        .oneOf([yup.ref('NewPassword'), undefined], 'Mật khẩu xác nhận không khớp')
        .required('Mật khẩu xác nhận là bắt buộc')
    });
  }, []);
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
      OldPassword: '',
      NewPassword: ''
    }
  });
  const mutationChangePassword = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await GiangVienService.changePassword(data);
    },
    onSuccess: (data: any) => {
      reset();
      handleClose();
      notification.show('Thay đổi mật khẩu thành công', {
        severity: 'success',
        autoHideDuration: 5000
      });
    },
    onError: (error: any) => {
      notification.show(error.Message || 'Thay đổi mật khẩu thất bại', {
        severity: 'error',
        autoHideDuration: 5000
      });
    }
  });

  const handleSubmitForm = (data: IFormData) => {
    if (!user) return;
    const formData = new FormData();
    formData.append('Id', String(user?.taiKhoanId));
    formData.append('OldPassword', data.OldPassword);
    formData.append('NewPassword', data.NewPassword);
    mutationChangePassword.mutate(formData);
  };
  return (
    <Box className='flex gap-2 border border-gray-200 rounded-lg p-4 shadow-sm'>
      <Button variant='contained' color='info' onClick={handleClickOpen}>
        Thay đổi mật khẩu
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        slotProps={{
          paper: {
            component: 'form',
            className: 'rounded-lg shadow-lg !max-w-lg !w-full !bg-white ',
            onSubmit: handleSubmit(handleSubmitForm)
          }
        }}
      >
        <DialogTitle id='alert-dialog-title' className='!text-lg !font-semibold !pb-0 !px-6'>
          Thay đổi mật khẩu
        </DialogTitle>
        <DialogContent className='!py-5'>
          <Grid container spacing={2} rowSpacing={1}>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
              <Input2
                {...register('OldPassword')}
                title='Mật khẩu cũ'
                placeholder='Nhập mật khẩu cũ'
                error={errors.OldPassword?.message}
                isDisabled={false}
                type='password'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
              <Input2
                {...register('NewPassword')}
                title='Mật khẩu mới'
                placeholder='Nhập mật khẩu mới'
                error={errors.NewPassword?.message}
                isDisabled={false}
                type='password'
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 12 }}>
              <Input2
                {...register('ConfirmPassword')}
                title='Xác nhận mật khẩu mới'
                placeholder='Nhập lại mật khẩu mới'
                error={errors.ConfirmPassword?.message}
                isDisabled={false}
                type='password'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className=' !pt-0 !px-6 !pb-5'>
          <Button type='button' onClick={handleClose}>
            Hủy
          </Button>
          <Button type='submit' autoFocus className='!bg-blue-500 !text-white !hover:bg-blue-600'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangePassword;
