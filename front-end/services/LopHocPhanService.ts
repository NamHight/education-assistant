import { create } from 'zustand';
import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamLopHocPhan, IParamLopHocPhan2 } from '@/types/params';

export class LopHocPhanService {
  static async getAllLopHocPhan(params: IParamLopHocPhan) {
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_ALL}`, {
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
  static async getAllLopHocPhanServer(params: IParamLopHocPhan) {
    return await authApiServer
      .get(`${API.LOP_HOC_PHAN.GET_ALL}`, {
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
  static async getLopHocPhanDaNop(params: IParamLopHocPhan){
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_DA_NOP}`, {
        params: params
      })
      .then((response) => Promise.resolve({
          data: response.data,
          meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
      .catch((error) => error.response?.data);
  }
  static async getLopHocPhanByLopHocAndHocKy(params: IParamLopHocPhan2) {
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_BY_LOP_HOC_AND_HOC_KY}`, {
        params: params
      })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => error.response?.data);
  }

  static async getLopHocPhanByGiangVienId(params: IParamLopHocPhan2) {
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_BY_GIANG_VIEN_ID}`, {
        params: params
      })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => error.response?.data);
  }

  static async getLopHocPhanById(id: string | number | null) {
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getLopHocPhanByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getLopHocPhanNoPage() {
    return await authApi
      .get(`${API.LOP_HOC_PHAN.GET_ALL_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async createLopHocPhan(data: any) {
    try {
      const result = await authApi.post(`${API.LOP_HOC_PHAN.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async updateLopHocPhan(id: string | number | null, data: any) {
    try {
      const result = await authApi.put(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async deleteLopHocPhan(id: string | number | null) {
    try {
      const result = await authApi.delete(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async phanCongLopHocPhan(data: FormData) {
    try {
      const result = await authApi.put(`${API.LOP_HOC_PHAN.PHAN_CONG}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async createHocKyPhu(data: FormData) {
    try {
      const result = await authApi.post(`${API.LOP_HOC_PHAN.ADD_HOC_KY_PHU}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async changeStatusLopHocPhan(id: string | number | null, data: FormData) {
    try {
      const result = await authApi.put(`${API.LOP_HOC_PHAN.CHANGE_STATUS}`.replace(':id', `${id}`), data);

      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async createLopHocPhanAuto(data: any) {
    try {
      const result = await authApi.post(`${API.LOP_HOC_PHAN.ADD_AUTO}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
