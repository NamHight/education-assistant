import authApi from '@/lib/authAxios';
import { API } from '@/types/general';
import { IParamTuan } from '@/types/params';

export class TuanService {
  static async getAllTuanByNamHoc(params: IParamTuan) {
    return await authApi
      .get(`${API.TUAN.GET_ALL_BY_NAM_HOC}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getAllTuanDenByTuanVao(params: IParamTuan) {
    return await authApi
      .get(`${API.TUAN.GET_ALL_DEN_BY_TUAN_VAO}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async createTuanAuto(data: any){
    try {
      const result = await authApi.post(`${API.TUAN.CREATE_AUTO}`, data);
      return result;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
