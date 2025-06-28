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
        // Nếu là lỗi 401 thì trả về lỗi luôn, KHÔNG refresh token ở server
        return Promise.reject(error);
    }
);



export default authApiServer;