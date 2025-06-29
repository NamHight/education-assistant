import { immer } from "zustand/middleware/immer";
import {  createAuthSlice, IAuthState } from "./slices/authSlice";
import { createSettingSlice, ISettingState } from "./slices/settingSlice";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import cookieStorage from "@/lib/cookie";
import localStorage from "@/lib/localStorage";
import { TOOLPAD_MODE } from "@/types/general";

export interface IPartializeState {
    setting: {
        theme: 'light' | 'dark';
    };
} 

export type RootState =  ISettingState;

export const useAppStore = create<RootState>()(
    immer(
        persist(
            (...a) => ({
                ...createSettingSlice(...a),
            }),
            {
                name: "app-storage",
                partialize: (state:RootState): IPartializeState => ({
                    setting: {
                        theme: state.theme
                    }
                }),
                merge: (persistedState:any, currentState: any) => ({
                    ...currentState,
                    ...persistedState.auth && {
                        token: persistedState.auth.token
                    },
                    ...persistedState.setting && {
                        theme: persistedState.setting.theme
                    }
                }),
                storage: createJSONStorage(() => ({
                    getItem: () => {
                        const theme = localStorage.get(TOOLPAD_MODE);
                        return JSON.stringify({
                           state: {
                               setting: {
                                   theme: theme || 'light'
                               }
                           }
                        })
                   },
                    setItem: (name, value) => {
                    const parsedValue = JSON.parse(value);
                    localStorage.set(TOOLPAD_MODE, parsedValue.state.setting.theme)
                    },
                    removeItem: (name) => {
                        localStorage.remove(name)
                    }
                        }))
                    }
                )
    )
)