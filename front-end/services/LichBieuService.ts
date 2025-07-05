import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamLichBieu } from '@/types/params';

export class LichBieuService {
  static async getLichBieu(params: IParamLichBieu) {
    return await authApi
      .get(`${API.LICH_BIEU.GET_ALL}`, {
        params: params
      })
      .then((response) => {
        return Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        });
      })
      .catch((error) => error.response?.data);
  }

  static async getLichBieuServer(params: IParamLichBieu) {
    return await authApiServer
      .get(`${API.LICH_BIEU.GET_ALL}`, {
        params: params
      })
      .then((response) => {
        return Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        });
      })
      .catch((error) => error.response?.data);
  }

  static async getLichBieuByKhoa(params: IParamLichBieu) {
    return await authApi
      .get(`${API.LICH_BIEU.GET_ALL_BY_NO_PAGE}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getLichBieuById(id: string | number | null) {
    return await authApi
      .get(`${API.LICH_BIEU.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getLichBieuByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.LICH_BIEU.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async copyLichBieu(data: any) {
    try {
      const result = await authApi.post(`${API.LICH_BIEU.COPY}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async createLichBieu(data: any) {
    try {
      const result = await authApi.post(`${API.LICH_BIEU.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateLichBieu(id: string | number | null, data: any) {
    try {
      const result = await authApi.put(`${API.LICH_BIEU.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async deleteLichBieu(id: string | number | null) {
    try {
      const result = await authApi.delete(`${API.LICH_BIEU.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
