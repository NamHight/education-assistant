'use client';
import authApi from '@/lib/authAxios';
import { GiangVien } from '@/models/GiangVien';
import { AuthenticateService } from '@/services/AuthenticateService';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/store';
import { API } from '@/types/general';
import { usePrefetchQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

interface StoreHydraterProps {
  auth: {
    user: GiangVien | null;
  };
  setting: {
    theme: 'light' | 'dark';
  };
}

const StoreHydrater = ({ auth, setting }: StoreHydraterProps) => {
  const data = usePrefetchQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await AuthenticateService.getMe();
      return response;
    },
    initialData: auth,
    gcTime: Infinity,
    staleTime: Infinity
  });
  useEffect(() => {
    if (auth) {
      useAuthStore.setState({
        user: auth.user
      });
    }
    if (setting) {
      useAppStore.setState({
        theme: setting.theme
      });
    }
  }, [auth, setting]);
  return null;
};

export default StoreHydrater;
