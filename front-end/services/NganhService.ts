import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamNganh } from '@/types/params';

export class NganhService {
  static async getAllNganh(params: IParamNganh) {
    return await authApi
      .get(`${API.NGANH.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }


  static async getAllNganhServer(params: IParamNganh) {
    return await authApiServer
      .get(`${API.NGANH.GET_ALL}`, {
        params: params
      })
      .then((response) => ({
        data: response.data,
        meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
      }))
      .catch((error) => error.response?.data);
  }

  static async getAllNganhNoPageServer() {
    return await authApiServer
      .get(`${API.NGANH.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getAllNganhNoPage() {
    return await authApi
      .get(`${API.NGANH.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getAllNganhByKhoaId(khoaId: number | string | null) {
    return await authApi
      .get(`${API.NGANH.GET_ALL_BY_KHOA_ID}`.replace(':khoaId', `${khoaId}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getNganhById(id: number | string | null) {
    return await authApi
      .get(`${API.NGANH.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getNganhByKhoaId(khoaId: number | string) {
    return await authApi
      .get(`${API.NGANH.GET_BY_KHOA_ID}`.replace(':khoaId', `${khoaId}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getNganhByIdServer(id: number | string | null) {
    return await authApiServer
      .get(`${API.NGANH.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async createNganh(data: any) {
    try {
      const result = await authApi.post(`${API.NGANH.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateNganh(id: number | string | null, data: any) {
    try {
      const result = await authApi.put(`${API.NGANH.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deleteNganh(id: number | string | null) {
    try {
      const result = await authApi.delete(`${API.NGANH.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
