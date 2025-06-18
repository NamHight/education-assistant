import axios from 'axios';
import cookieStorage from './cookie';
import { API, REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';
import axiosAuthRefresh from 'axios-auth-refresh'
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
})
const getAccessToken = async () => {
    return cookieStorage.get(TOKEN_ACCESS);
}
const getRefreshToken = async () => {
    return cookieStorage.get(REFRESH_TOKEN);
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
        cookieStorage.remove(TOKEN_ACCESS);
        cookieStorage.remove(REFRESH_TOKEN);
    }
}

axiosAuthRefresh(authApi, handleRefreshToken,{
    statusCodes: [401, 403],
    skipWhileRefreshing: true
});

export default authApi;