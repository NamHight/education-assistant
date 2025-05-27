import { User } from "@/models/User"

export interface IStoreHydration {
    auth: {
        user: User| null;
        token: string | null;
        refreshToken?: string | null;
    },
    setting: {
        theme: 'light' | 'dark';
    }
}
export const storeHydration = async (): Promise<IStoreHydration> => {
    const userServer = {
        id: 'server-id',
        name: 'Server User',
        email: 'hahaha@gmail.com',
        avatar: 'https://example.com/avatar.jpg',
        role: 'admin'
    }
    return {
        auth: {
            user: userServer,
            token: 'server-token',
            refreshToken: 'server-refresh-token'
        },
        setting:{
            theme: 'light'
        }
    }

}