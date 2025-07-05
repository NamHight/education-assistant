import { set } from 'lodash';
import { RootState } from '../store';
import { createPersistedSlice, createSlice } from '../utility';

export interface IOptionState {
  openLHP: boolean;
  actions?: {
    toggleLHP: () => void;
    setOpenLHP: (open: boolean) => void;
  };
}

export const createOptionSlice = createSlice<RootState, IOptionState>((set, get) => ({
  openLHP: false,
  actions: {
    toggleLHP: () =>
      set((state) => {
        state.openLHP = !state.openLHP;
      }),
    setOpenLHP: (open: boolean) =>
      set((state) => {
        state.openLHP = open;
      })
  }
}));
