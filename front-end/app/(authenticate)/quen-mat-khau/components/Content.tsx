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
interface LoginData {
  email: string;
}

const Content = () => {
  const { actions } = useAuthStore();
  const router = useRouter();
  const notification = useNotifications();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().email('Email không hợp lệ').required('Email không được để trống')
    });
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ''
    },
    mode: 'onChange'
  });
  const mutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const result = await AuthenticateService.forgotPassword(data.email);
      return result;
    },
    onSuccess: () => {
      notification.show('Vui lòng kiểm tra email để đặt lại mật khẩu.', {
        severity: 'success',
        autoHideDuration: 4000
      });
      router.push('/quen-mat-khau/thanh-cong');
    },
    onError: (error: any) => {
      notification.show(error?.Message, {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleLogin = (data: LoginData) => {
    mutation.mutate({
      email: data.email
    });
  };

  return (
    <div className='mt-4 sm:mx-auto sm:w-full sm:max-w-sm'>
      <FormControl component={'form'} className='space-y-4 w-full' onSubmit={handleSubmit(handleLogin)}>
        <Input title='Email' register={register} name='email' type='email' error={errors.email?.message} />
        <div className='flex flex-col gap-4'>
          <button
            type='submit'
            className='flex cursor-pointer w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            Lấy mật khẩu mới
          </button>
          <Divider className='!my-1' />
          <div className='flex items-center justify-center gap-2'>
            <span className='text-sm text-gray-500'>Bạn đã có tài khoản?</span>
            <button
              type="button"
              onClick={() => router.push('/dang-nhap')}
              className='text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors duration-200 ease-in-out hover:underline'
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export default Content;
