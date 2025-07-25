'use client';
import { login } from '@/types/validate/login';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/inputs/Input';
import { FormControl } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import cookieStorage from '@/lib/cookie';
import { REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';

interface LoginData {
  email: string;
  password: string;
}

const Content = () => {
  const { actions } = useAuthStore();
  const router = useRouter();
  const notification = useNotifications();
  const queryClient = useQueryClient();
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
  useEffect(() => {
    const topad = localStorage.getItem('toolpad-mode');
    if (!topad) {
      localStorage.setItem('toolpad-mode', 'light');
    }
  }, []); 
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const result = await AuthenticateService.login(data);
      return result;
    },
    onSuccess: async (data) => {
      actions?.login(data.user, data.accessToken, data.refreshToken);
      queryClient.clear();
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      cookieStorage.set(TOKEN_ACCESS, data.accessToken);
      cookieStorage.set(REFRESH_TOKEN, data.refreshToken);
      window.location.href = '/';
    },
    onError: (error: any) => {
      notification.show(error?.Message || "Đăng nhập thất bại", {
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
              <Link href='/quen-mat-khau' className='font-semibold text-blue-600 hover:text-blue-500'>
                Quên mật khẩu?
              </Link>
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
