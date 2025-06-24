"use server"
import axios from 'axios';
import { cookies } from 'next/headers';
import cookieStorage from './cookie';
import { API, REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';
import axiosAuthRefresh from 'axios-auth-refresh'
import { redirect } from 'next/navigation';
const authApiServer = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    withCredentials: true 
})
const getAccessToken = async () => {
    const cookie = await cookies();
    return await cookie.get(TOKEN_ACCESS)?.value || null;
}
const getRefreshToken = async () => {
    const cookie = await cookies();
    if(typeof window === 'undefined') {
        return await cookie.get(REFRESH_TOKEN)?.value || null;
    }else{
        return cookieStorage.get(REFRESH_TOKEN);
    }
}
authApiServer.interceptors.request.use(async (config) => {
    const token = await getAccessToken();
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})
authApiServer.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return handleRefreshToken(error);
        }
        return Promise.reject(error);
    }
);
const handleRefreshToken = async (error: any) => {
    const refreshToken = await getRefreshToken();
    const cookie = await cookies();
    try {
        const response: any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${API.AUTH.REFRESH_TOKEN}`, {
            refreshToken: refreshToken,
        });
        
        const { accessToken,refreshToken:refreshTokenNew } = response?.data;
        console.log("Token refreshed successfully:", accessToken);
        (await cookies()).set(TOKEN_ACCESS, accessToken, { httpOnly: false, path: '/' });
        (await cookies()).set(REFRESH_TOKEN, refreshTokenNew, { httpOnly: false, path: '/' });
        error.response.config.headers.Authorization = `Bearer ${accessToken}`;
        return axios(error.response.config);
    } catch (error) {
        cookieStorage.remove(REFRESH_TOKEN);
        cookieStorage.remove(TOKEN_ACCESS);
        redirect('/dang-nhap');
        return Promise.reject(error);
    }
}


export default authApiServer;