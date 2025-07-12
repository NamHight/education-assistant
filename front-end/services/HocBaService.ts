import { create } from 'zustand';
import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamHocBa } from '@/types/params';

export class HocBaService {
  static async getAllHocBa(params: IParamHocBa) {
    return await authApi
      .get(`${API.HOC_BA.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => {
        return Promise.reject(error.response?.data);
      });
  }

  static async getAllHocBaServer(params: IParamHocBa) {
    return await authApiServer
      .get(`${API.HOC_BA.GET_ALL}`, {
        params: params
      })
      .then((response) =>
        Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        })
      )
      .catch((error) => {
        return Promise.reject(error.response?.data);
      });
  }

  static async getAllHocBaByMssv(params: IParamHocBa) {
    return await authApi
      .get(`${API.HOC_BA.GET_ALL_BY_MSSV}`, {
        params: params
      })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => {
        return Promise.reject(error.response?.data);
      });
  }

  static async getHocBaById(id: string | number | null) {
    return await authApi
      .get(`${API.HOC_BA.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => {
        return Promise.reject(error.response?.data);
      });
  }

  static async getHocBaByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.HOC_BA.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => {
        return Promise.reject(error.response?.data);
      });
  }

  static async updateHocBa(id: string | number | null, data: any) {
    try {
      const response = await authApi.put(`${API.HOC_BA.GET_BY_ID.replace(':id', `${id}`)}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }


  static async deleteHocBa(id: string | number | null) {
    try {
      const response = await authApi.delete(`${API.HOC_BA.GET_BY_ID.replace(':id', `${id}`)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async createHocBa(data: any) {
    try {
      const response = await authApi.post(`${API.HOC_BA.GET_ALL}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async nopDiemHocBa(data: any) {
    try {
      const response = await authApi.post(`${API.HOC_BA.NOP_DIEM}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async deleteHocBaList(data: { ids: string[] }) {
    try {
      const response = await authApi.delete(`${API.HOC_BA.DELETE_LIST}`, {
        params: data
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
