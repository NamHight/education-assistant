'use client';
import { login } from '@/types/validate/login';
import { useAnimationFrame } from 'motion/react';
import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MessageError from '@/components/texts/MessageError';
import Input from '@/components/inputs/Input';
import { FormControl } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';

interface LoginData {
  email: string;
  password: string;
}

const Content = () => {
  const { actions } = useAuthStore();
  const router = useRouter();
  const notification = useNotifications();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(login),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await AuthenticateService.login(data);
      console.log('Login result:', result);
      return result;
    },
    onSuccess: (data) => {
      actions?.login(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      notification.show(error?.Message, {
        severity: 'error',
        autoHideDuration: 4000
      });
    }
  });
  const handleLogin = (data: LoginData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    mutation.mutate(formData);
  };

  return (
    <div className='mt-4 sm:mx-auto sm:w-full sm:max-w-sm'>
      <FormControl component={'form'} className='space-y-4 w-full' onSubmit={handleSubmit(handleLogin)}>
        <Input title='Email' register={register} name='email' type='email' error={errors.email?.message} />
        <Input
          title='Mật khẩu'
          register={register}
          name='password'
          type='password'
          error={errors.password?.message}
          options={
            <div className='text-sm'>
              <a href='#' className='font-semibold text-blue-600 hover:text-blue-500'>
                Quên mật khẩu?
              </a>
            </div>
          }
        />
        <div>
          <button
            type='submit'
            className='flex cursor-pointer w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
          >
            Đăng nhập
          </button>
        </div>
      </FormControl>
    </div>
  );
};

export default Content;
