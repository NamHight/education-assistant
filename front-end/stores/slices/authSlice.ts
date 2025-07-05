import { REFRESH_TOKEN, TOKEN_ACCESS } from './../../types/general';
import { createSlice } from '../utility';
import cookieStorage from '@/lib/cookie';
import { RootAuthState } from '../authStore';
import { GiangVien } from '@/models/GiangVien';

export interface IAuthState {
  user: GiangVien | null;
  token: string | null;
  refreshToken: string | null;
  actions?: {
    login: (user: GiangVien, token: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: Partial<GiangVien>) => void;
  };
}

export const createAuthSlice = createSlice<RootAuthState, IAuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  actions: {
    login: (user: GiangVien, token: string, refreshToken: string) =>
      set((state: IAuthState) => {
        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
      }),
    logout: () =>
      set((state: IAuthState) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        cookieStorage.remove(TOKEN_ACCESS);
        cookieStorage.remove(REFRESH_TOKEN);
      }),
    updateUser: (partialUser) =>
      set((state: IAuthState) => {
        if (state.user) {
          state.user = { ...state.user, ...partialUser };
        }
      })
  }
}));
