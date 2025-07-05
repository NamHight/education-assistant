'use client';
import authApi from '@/lib/authAxios';
import { GiangVien } from '@/models/GiangVien';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/store';
import { API } from '@/types/general';
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
    const [isClient, setIsClient] = useState(false);
     useEffect(() => {
    setIsClient(true);
  }, []);
  const hasUser = !!auth?.user;
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await AuthenticateService.getMe();
      return response;
    },
    ...(hasUser ? { initialData: auth.user } : {}),
    enabled: !hasUser,
    gcTime: Infinity,
    staleTime: Infinity,
    retry: false,
  });
  useEffect(() => {
    if (!isClient) return;
    if (auth?.user) {
      useAuthStore.setState({ user: auth.user });
    } else if (user) {
      useAuthStore.setState({ user });
    }
    if (setting) {
      useAppStore.setState({
        theme: setting.theme
      });
    }
  }, [auth?.user, user, setting]);
  return null;
};

export default StoreHydrater;
