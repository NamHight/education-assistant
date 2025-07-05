import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamMonHoc } from '@/types/params';
import { ca } from 'zod/v4/locales';

export class MonHocService {
  static async getAllMonHoc(params?: IParamMonHoc) {
    return await authApi
      .get(`${API.MON_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }
  static async getAllMonHocServer(params?: IParamMonHoc) {
    return await authApiServer
      .get(`${API.MON_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }
  static async getMonHocById(id: number | string | null) {
    return await authApi
      .get(`${API.MON_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllMonHocByKhoaId(khoaId: number | string | null) {
    return await authApi
      .get(`${API.MON_HOC.GET_ALL_BY_KHOA_ID}`.replace(':khoaId', `${khoaId}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getMonHocByIdServer(id: number | string | null) {
    return await authApiServer
      .get(`${API.MON_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async createMonHoc(data: any) {
    try {
      const result = await authApi.post(`${API.MON_HOC.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async updateMonHoc(id: number | string | null, data: any) {
    try {
      const result = await authApi.put(`${API.MON_HOC.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async deleteMonHoc(id: number | string | null) {
    try {
      const result = await authApi.delete(`${API.MON_HOC.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
