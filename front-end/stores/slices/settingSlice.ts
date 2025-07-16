import { RootState } from '../store';
import { createSlice } from '../utility';

export interface ISettingState {
  theme: 'light' | 'dark';
}

export const createSettingSlice = createSlice<RootState, ISettingState>((set, get) => ({
  theme: 'light'
}));
