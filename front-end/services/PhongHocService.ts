import { IParamPhongHoc } from '@/types/params';
import { PhongHoc } from './../models/PhongHoc';
import authApi from '@/lib/authAxios';
import { API } from '@/types/general';
import authApiServer from '@/lib/authAxiosServer';
export class PhongHocService {
  static async getAllPhongHocServer(params: IParamPhongHoc) {
    return await authApiServer
      .get(`${API.PHONG_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => error.response?.data);
  }

  static async getAllPhongHoc(params: IParamPhongHoc) {
    return await authApi
      .get(`${API.PHONG_HOC.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => error.response?.data);
  }

  static async getPhongHocById(id: string | number | null) {
    return await authApi
      .get(`${API.PHONG_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getPhongHocByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.PHONG_HOC.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async createPhongHoc(data: PhongHoc) {
    try {
      const result = await authApi.post(`${API.PHONG_HOC.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updatePhongHoc(id: string | number | null, data: FormData) {
    try {
      const result = await authApi.put(`${API.PHONG_HOC.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deletePhongHoc(id: string | number | null) {
    try {
      const result = await authApi.delete(`${API.PHONG_HOC.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updatePhongHocOption(id: string | number | null, data: FormData) {
    try {
      const result = await authApi.put(`${API.PHONG_HOC.UPDATE_OPTION}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async changeStatusPhongHoc(id: string | number | null, data: FormData) {
    try {
      const result = await authApi.patch(`${API.PHONG_HOC.CHANGE_STATUS}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async createPhongHocList(data: FormData) {
    try {
      const result = await authApi.post(`${API.PHONG_HOC.CREATE_LIST}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async getPhongHocNoPage() {
    return await authApi
      .get(`${API.PHONG_HOC.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
}
