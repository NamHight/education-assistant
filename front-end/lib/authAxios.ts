import axios from 'axios';
import cookieStorage from './cookie';
import { API, REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';
import axiosAuthRefresh from 'axios-auth-refresh'
const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    withCredentials: true 
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
const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        window.location.href = '/dang-nhap';
        return Promise.reject(failedRequest);
    }
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/refresh/`,
            { refresh: refreshToken },
            { withCredentials: true }
        );
        console.log("Token refreshed successfully:", response?.data);
        const newAccessToken = response.data.token;
        cookieStorage.set(TOKEN_ACCESS, newAccessToken);
        failedRequest.response.config.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return Promise.resolve();
    } catch (error) {
        cookieStorage.remove(TOKEN_ACCESS);
        cookieStorage.remove(REFRESH_TOKEN);
        window.location.href = '/dang-nhap';
        return Promise.reject(error);
    }
};

axiosAuthRefresh(authApi, refreshAuthLogic);
export default authApi;