import axios from 'axios';
import cookieStorage from './cookie';
import { API, REFRESH_TOKEN, TOKEN_ACCESS } from '@/types/general';
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true
});
const getAccessToken = async () => {
  return cookieStorage.get(TOKEN_ACCESS);
};
const getRefreshToken = async () => {
  return cookieStorage.get(REFRESH_TOKEN);
};
authApi.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getRefreshToken();
      try {
        const response: any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${API.AUTH.REFRESH_TOKEN}`, {
          refreshToken
        });
        const { accessToken, refreshToken: refreshTokenNew } = response?.data;
        cookieStorage.set(TOKEN_ACCESS, accessToken);
        cookieStorage.set(REFRESH_TOKEN, refreshTokenNew);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        cookieStorage.remove(REFRESH_TOKEN);
        cookieStorage.remove(TOKEN_ACCESS);
        window.location.href = '/dang-nhap';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
export default authApi;
