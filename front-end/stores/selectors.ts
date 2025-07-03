"use client"
import { useAuthStore } from "./authStore";
import { useAppStore } from "./store";
//Auth
export const useUser = () => useAuthStore(state => state.user);
export const useUserActions = () => useAuthStore(state => state.actions);
export const useRefreshToken = () => useAuthStore(state => state.refreshToken);
export const useToken = () => useAuthStore(state => state.token);
export const useTheme = () => useAppStore(state => state.theme);
//Option
export const useOpenLHP = () => useAppStore(state => state.openLHP);
export const useOptionActions = () => useAppStore(state => state.actions);