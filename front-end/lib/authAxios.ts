import axios from 'axios';
import { cookies } from 'next/headers';
import cookieStorage from './cookie';
import { API, REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';
import axiosAuthRefresh from 'axios-auth-refresh'
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    }
})
const getAccessToken = async () => {
    const cookie = await cookies();
    if(typeof window === 'undefined') {
        return await cookie.get(TOKEN_ACCESS)?.value || null;
    }else{
        return cookieStorage.get(TOKEN_ACCESS);
    }
}
const getRefreshToken = async () => {
    const cookie = await cookies();
    if(typeof window === 'undefined') {
        return await cookie.get(REFRESH_TOKEN)?.value || null;
    }else{
        return cookieStorage.get(REFRESH_TOKEN);
    }
}
authApi.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})
const handleRefreshToken = async (error: any) => {
    const refreshToken = await getRefreshToken();
    const coookie = await cookies();
    if(!refreshToken){
        return Promise.reject(new Error("Không có làm mới token"));
    }
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${API.AUTH.REFRESH_TOKEN}`, {
            refreshToken: refreshToken
        })
        const {token} = response.data;
        error.response.config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve();
    } catch (error) {
        if(typeof window === 'undefined') {
            coookie.delete(TOKEN_ACCESS);
            coookie.delete(REFRESH_TOKEN);
        }else{
            cookieStorage.remove(TOKEN_ACCESS);
            cookieStorage.remove(REFRESH_TOKEN);
        }
    }
}

axiosAuthRefresh(authApi, handleRefreshToken,{
    statusCodes: [401, 403],
    skipWhileRefreshing: true
});

export default authApi;