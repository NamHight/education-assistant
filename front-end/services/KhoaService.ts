import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamKhoa } from '@/types/params';

export class KhoaService {
  static async getAllKhoa(params?: IParamKhoa) {
    return await authApi
      .get(`${API.KHOA.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }
  static async getAllKhoaServer(params?: IParamKhoa) {
    return await authApiServer
      .get(`${API.KHOA.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }
  static async getKhoaNoPage() {
    return await authApi
      .get(`${API.KHOA.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getKhoaNoPageServer() {
    return await authApiServer
      .get(`${API.KHOA.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getKhoaById(id: string | number | null) {
    return await authApi
      .get(`${API.KHOA.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getKhoaByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.KHOA.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async updateKhoa(id: string | number | null, data: any) {
    try {
      const result = await authApi.put(`${API.KHOA.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deleteKhoa(id: string | number | null) {
    try {
      const result = await authApi.delete(`${API.KHOA.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async createKhoa(data: any) {
    try {
      const result = await authApi.post(`${API.KHOA.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
