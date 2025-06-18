'use client';
import { GiangVien } from '@/models/GiangVien';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/store';
import React, { useEffect } from 'react';

interface StoreHydraterProps {
  auth: {
    user: GiangVien | null;
    token: string | null;
    refreshToken?: string | null;
  };
  setting: {
    theme: 'light' | 'dark';
  };
}

const StoreHydrater = ({ auth, setting }: StoreHydraterProps) => {
  // useEffect(() => {
  //   if (auth) {
  //     useAuthStore.setState({
  //       user: auth.user,
  //       token: auth.token,
  //       refreshToken: auth.refreshToken
  //     });
  //   }
  //   if (setting) {
  //     useAppStore.setState({
  //       theme: setting.theme
  //     });
  //   }
  // }, [auth, setting]);
  return null;
};

export default StoreHydrater;
