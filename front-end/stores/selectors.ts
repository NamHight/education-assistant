"use client"
import { useAuthStore } from "./authStore";
import { useAppStore } from "./store";
//Auth
export const useUser = () => useAuthStore(state => state.user);
export const useToken = () => useAuthStore(state => state.token);
export const useTheme = () => useAppStore(state => state.theme);