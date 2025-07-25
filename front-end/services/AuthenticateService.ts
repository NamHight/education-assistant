import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';

export class AuthenticateService {
  static async login(data: FormData) {
    try {
      const response = await authApi.post(`${API.AUTH.LOGIN}`, data);
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
  static async getMe() {
    return authApi
      .get(`${API.AUTH.USER}`)
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }

  static async getMeServer(){
    return authApiServer
      .get(`${API.AUTH.USER}`)
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }

  static async forgotPassword(data: string) {
    try {
      const response = await authApi.post(`${API.AUTH.FORGOT_PASSWORD}`, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }

  static async resetPassword(data: FormData) {
    try {
      const response = await authApi.post(`${API.AUTH.RESET_PASSWORD}`, data);
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  }
}
