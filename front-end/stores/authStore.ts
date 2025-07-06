import { TaiKhoan } from './../models/TaiKhoan';
import { immer } from 'zustand/middleware/immer';
import { createAuthSlice, IAuthState } from './slices/authSlice';
import { createSettingSlice, ISettingState } from './slices/settingSlice';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import cookieStorage from '@/lib/cookie';
import localStorage from '@/lib/localStorage';
import { REFRESH_TOKEN, ROLE, TOKEN_ACCESS, USER } from '@/types/general';
import { GiangVien } from '@/models/GiangVien';

export interface IPartializeState {
  token: string | null;
  user: GiangVien | null;
  refreshToken: string | null;
}
export type RootAuthState = IAuthState;

export const useAuthStore = create<RootAuthState>()(
  immer(
    persist(createAuthSlice, {
      name: 'app-auth-storage',
      partialize: (state: RootAuthState): IPartializeState => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user ? state.user : null
      }),
      storage: createJSONStorage(() => ({
        getItem: () => {
          const token = cookieStorage.get(TOKEN_ACCESS);
          const refreshToken = cookieStorage.get(REFRESH_TOKEN);
          return JSON.stringify({
            state: {
              token,
              refreshToken
            }
          });
        },
        setItem: (name, value) => {
          const parsedValue = JSON.parse(value).state;
          cookieStorage.set(ROLE, parsedValue?.user?.taiKhoan?.loaiTaiKhoan);
        },
        removeItem: () => {
          cookieStorage.remove(TOKEN_ACCESS);
          cookieStorage.remove(REFRESH_TOKEN);
        }
      }))
    })
  )
);
