import { immer } from "zustand/middleware/immer";
import {  createAuthSlice, IAuthState } from "./slices/authSlice";
import { createSettingSlice, ISettingState } from "./slices/settingSlice";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import cookieStorage from "@/lib/cookie";
import localStorage from "@/lib/localStorage";
import {IUSerCookie} from "@/models/GiangVien";
import {REFRESH_TOKEN, TOKEN_ACCESS, USER} from "@/types/general";

export interface IPartializeState {
        token: string | null;
        user: IUSerCookie | null;
        refreshToken: string | null;
} 
export type RootAuthState = IAuthState;

export const useAuthStore = create<RootAuthState>()(
    immer(
        persist(
            createAuthSlice,
            {
                name: "app-auth-storage",
                partialize: (state:RootAuthState): IPartializeState => ({
                    token: state.token,
                    refreshToken: state.refreshToken,
                    user: state.user ? {
                        id: state.user.id,
                        name: state.user.name,
                        email: state.user.email,
                        avatar: state.user.avatar,
                        role: state.user.role
                    } : null
                }),
                storage: createJSONStorage(() => ({
                    getItem: () => {
                        const token = cookieStorage.get(TOKEN_ACCESS);
                        const refreshToken = cookieStorage.get(REFRESH_TOKEN);
                        const user = cookieStorage.get(USER);
                        return JSON.stringify({
                            state: {
                                token,
                                refreshToken,
                                user
                            }
                        })
                    },
                    setItem: (name, value) => {
                        const parsedValue = JSON.parse(value).state;
                        console.log(parsedValue);
                        cookieStorage.set(TOKEN_ACCESS, parsedValue.token)
                        cookieStorage.set(REFRESH_TOKEN, parsedValue.refreshToken)
                    },
                    removeItem: () => {
                        cookieStorage.remove(TOKEN_ACCESS)
                        cookieStorage.remove(REFRESH_TOKEN)
                    }
                }))
            },
        )
    )
)