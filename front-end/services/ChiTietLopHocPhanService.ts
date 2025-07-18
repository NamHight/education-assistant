import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamChiTietLopHocPhan } from '@/types/params';

export class ChiTietLopHocPhanService {
  static async getAllChiTietLopHocPhan(params: IParamChiTietLopHocPhan) {
    return await authApi
      .get(`${API.CHI_TIET_LOP_HOC_PHAN.GET_ALL}`, {
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

  static async getAllChiTietLopHocPhanServer(params: IParamChiTietLopHocPhan) {
    return await authApiServer
      .get(`${API.CHI_TIET_LOP_HOC_PHAN.GET_ALL}`, {
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

  static async getAllChiTietLopHocPhanByLopHocPhanId(id: string | number | null, params?: IParamChiTietLopHocPhan) {
    return await authApi
      .get(`${API.CHI_TIET_LOP_HOC_PHAN.GET_BY_LOP_HOC_PHAN_ID}`.replace(':id', `${id}`), {
        params: params
      })
      .then((response) => Promise.resolve(response.data))
      .catch((error) => error.response?.data);
  }

  static async nhapDiemLopHocPhan(data: any) {
    try {
      const response = await authApi.put(`${API.CHI_TIET_LOP_HOC_PHAN.UPDATE_POINT}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async exportFile(lopHocPhanId: string) {
    try {
      const response = await authApi.get(`${API.CHI_TIET_LOP_HOC_PHAN.EXPORT_FILE}`.replace(':id', `${lopHocPhanId}`), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }

  static async importFile(data: FormData) {
    try {
      const response = await authApi.post(`${API.CHI_TIET_LOP_HOC_PHAN.IMPORT_FILE}`, data, {});
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateNopDiem(id: string | number | null) {
    try {
      const response = await authApi.put(`${API.CHI_TIET_LOP_HOC_PHAN.UPDATE_NOP_DIEM}`.replace(':id', `${id}`));
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
