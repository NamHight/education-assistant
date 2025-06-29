'use client';
import { login } from '@/types/validate/login';
import { useAnimationFrame } from 'motion/react';
import React, { use, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MessageError from '@/components/texts/MessageError';
import Input from '@/components/inputs/Input';
import { Box, Divider, FormControl } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { passwordPattern } from '@/lib/pattern';
interface LoginData {
  newPassword: string;
  confirmNewPassword: string;
}

interface Props {
  email?: string;
  token?: string;
}

const Content = ({ email, token }: Props) => {
  const { actions } = useAuthStore();
  const router = useRouter();
  const notification = useNotifications();
  const schema = useMemo(() => {
    return yup.object().shape({
      newPassword: yup
        .string()
        .matches(passwordPattern, 'Mật khẩu ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số')
        .required('Mật khẩu mới không được để trống'),
      confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), undefined], 'Mật khẩu xác nhận không khớp')
        .required('Mật khẩu xác nhận không được để trống')
    });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: ''
    },
    mode: 'onChange'
  });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await AuthenticateService.resetPassword(data);
      return result;
    },
    onSuccess: () => {
      notification.show('Đổi mật khẩu thành công.', {
        severity: 'success',
        autoHideDuration: 4000
      });
      router.push('/dang-nhap');
    },
    onError: (error: any) => {
      console.log('Error:', error);
      notification.show(error?.Message || 'Đã xảy ra lỗi khi đổi mật khẩu.', {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleLogin = (data: LoginData) => {
    if (!email || !token) {
      return;
    }
    console.log('Data:', email);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('token', token);
    formData.append('password', data.newPassword);
    if (data) mutation.mutate(formData);
  };

  return (
    <div className='mt-4 sm:mx-auto sm:w-full sm:max-w-sm'>
      <FormControl component={'form'} className='space-y-4 w-full' onSubmit={handleSubmit(handleLogin)}>
        <Input
          title='Mật khẩu mới'
          register={register}
          name='newPassword'
          type='password'
          error={errors.newPassword?.message}
        />
        <Input
          title='Xác nhận mật khẩu mới'
          register={register}
          name='confirmNewPassword'
          type='password'
          error={errors.confirmNewPassword?.message}
        />
        <div className='flex flex-col gap-4'>
          <button
            type='submit'
            className='flex cursor-pointer w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            Đổi mật khẩu
          </button>
        </div>
      </FormControl>
    </div>
  );
};

export default Content;
