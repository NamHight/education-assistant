import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamLopHoc } from '@/types/params';

export class LopHocService {
  static async getAllLopHoc(params?: IParamLopHoc) {
    return await authApi
      .get(`${API.LOP_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => Promise.reject(error.response?.data));
  }
  static async getAllLopHocServer(params?: IParamLopHoc) {
    return await authApiServer
      .get(`${API.LOP_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => Promise.reject(error.response?.data));
  }

  static async getLopHocNoPage() {
    return await authApi
      .get(`${API.LOP_HOC.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getLopHocNoPageServer() {
    return await authApiServer
      .get(`${API.LOP_HOC.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getLopHocById(id: string | number | null) {
    return await authApi
      .get(`${API.LOP_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getLopHocByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.LOP_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async deleteLopHoc(id: number | string | null) {
    try {
      const result = await authApi.delete(`${API.LOP_HOC.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async createLopHoc(data: any) {
    try {
      const result = await authApi.post(`${API.LOP_HOC.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateLopHoc(id: string | number | null, data: any) {
    try {
      const result = await authApi.put(`${API.LOP_HOC.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
