import {REFRESH_TOKEN, TOKEN_ACCESS} from './../../types/general';
import { User } from "@/models/GiangVien";
import { createSlice } from '../utility';
import cookieStorage from '@/lib/cookie';
import { RootAuthState } from '../authStore';

export interface IAuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  actions?: {
      login: (user:User, token: string,refreshToken: string) => void;
      logout: () => void;
      updateUser: (user:Partial<User>) => void;
  }
}


export const createAuthSlice = createSlice<RootAuthState,IAuthState>((set) => ({
user: null,
token: null,
refreshToken: null,
actions: {
  login: (user: User,token: string,refreshToken: string) => set((state:IAuthState) => {
  state.user = user;
  state.token = token;
  state.refreshToken = refreshToken;
}),
logout: () => set((state:IAuthState) => {
  state.user = null;
  state.token = null;
  state.refreshToken = null;
  cookieStorage.remove(TOKEN_ACCESS);
  cookieStorage.remove(REFRESH_TOKEN);
}),
updateUser: (partialUser) => set((state:IAuthState) => {
  if(state.user){
    state.user = {...state.user,...partialUser}
  }
})
}
})
)