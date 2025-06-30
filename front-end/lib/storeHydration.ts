import { GiangVien } from "@/models/GiangVien"
import authApiServer from "./authAxiosServer";
import { API } from "@/types/general";

export interface IStoreHydration {
    auth: {
        user: GiangVien | undefined;
    },
    setting: {
        theme: 'light' | 'dark';
    }
}
export const storeHydration = async (): Promise<IStoreHydration> => {
    try {
        const response: GiangVien = await authApiServer.get(`${API.AUTH.USER}`);
        const userServer = (response as any)?.data;
        return {
            auth: {
                user: userServer,
            },
            setting: {
                theme: 'light'
            }
        }
    } catch (error) {
        return {
            auth: {
                user: undefined,
            },
            setting: {
                theme: 'light'
            }
        }
    }
}