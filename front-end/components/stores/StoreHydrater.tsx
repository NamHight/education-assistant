'use client';
import authApi from '@/lib/authAxios';
import cookieStorage from '@/lib/cookie';
import { GiangVien } from '@/models/GiangVien';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useUserActions } from '@/stores/selectors';
import { useAppStore } from '@/stores/store';
import { API, REFRESH_TOKEN, ROLE } from '@/types/general';
import { usePrefetchQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

interface StoreHydraterProps {
  auth: {
    user: GiangVien | undefined;
  };
  setting: {
    theme: 'light' | 'dark';
  };
}

const StoreHydrater = ({ auth, setting }: StoreHydraterProps) => {
  'use client';
    const [isClient, setIsClient] = useState(false);
     useEffect(() => {
    setIsClient(true);
  }, []);
  const actions = useUserActions();
  const hasUser = !!auth?.user;
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await AuthenticateService.getMe();
      return response;
    },
    ...(hasUser ? { initialData: auth.user } : {}),
    enabled: isClient && !hasUser,
    gcTime: Infinity,
    staleTime: Infinity,
    retry: false,
  });
  console.log('user',user);
  useEffect(() => {
    if (!isClient) return;
  if (setting) {
      useAppStore.setState({
        theme: setting.theme
      });
    }
    if (auth?.user) {
      useAuthStore.setState({ user: auth.user });
    } else if (user) {
      useAuthStore.setState({ user });
    }
  }, [auth?.user, user, setting, isClient]);
  return null;
};

export default StoreHydrater;
