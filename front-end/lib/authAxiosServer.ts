'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { TOKEN_ACCESS } from '@/types/general';
const authApiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true
});
const getAccessToken = async () => {
  const cookie = await cookies();
  return (await cookie.get(TOKEN_ACCESS)?.value) || null;
};

authApiServer.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
authApiServer.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default authApiServer;
