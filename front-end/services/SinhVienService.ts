import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamSinhVien } from '@/types/params';
import { error } from 'console';

export class SinhVienService {
  static async getAllSinhVien(params: IParamSinhVien) {
    return await authApi
      .get(`${API.SINH_VIEN.GET_ALL}`, {
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
  static async getSinhVienByMssv(mssv: string | null) {
    return await authApi
      .get(`${API.SINH_VIEN.GET_BY_MSSV}`, {
        params: { mssv: mssv }
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllSinhVienByLopHocPhan(params: IParamSinhVien) {
    return await authApi
      .get(`${API.SINH_VIEN.GET_BY_LOP_HOC_PHAN}`, {
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
  static async dangKyMonHoc(data: any) {
    try {
      const result = await authApi.post(`${API.SINH_VIEN.DANG_KY_MON_HOC}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async getAllSinhVienByLopHocPhanServer(params: IParamSinhVien) {
    return await authApiServer
      .get(`${API.SINH_VIEN.GET_BY_LOP_HOC_PHAN}`, {
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
  static async getAllSinhVienByLopHoc(lopHocId: string | number | null) {
    return await authApi
      .get(`${API.SINH_VIEN.GET_BY_ID_LOP_HOC}`.replace(':lopHocId', `${lopHocId}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllSinhVienByLopHocServer(lopHocId: string | number | null) {
    return await authApiServer
      .get(`${API.SINH_VIEN.GET_BY_ID_LOP_HOC}`.replace(':lopHocId', `${lopHocId}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllTinhTrangHocTap(params: IParamSinhVien) {
    return await authApi
      .get(`${API.SINH_VIEN.TINH_TRANG_HOC_TAP}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllTinhTrangHocTapServer(params?: IParamSinhVien) {
    return await authApiServer
      .get(`${API.SINH_VIEN.TINH_TRANG_HOC_TAP}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getAllSinhVienServer(params: IParamSinhVien) {
    return await authApiServer
      .get(`${API.SINH_VIEN.GET_ALL}`, {
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
  static async getSinhVienById(id: string | number | null) {
    return await authApi
      .get(`${API.SINH_VIEN.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getSinhVienByIdServer(id: string | number | null) {
    return await authApiServer
      .get(`${API.SINH_VIEN.GET_BY_ID}`.replace(':id', `${id}`))
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async createSinhVien(data: FormData) {
    try {
      const result = await authApi.post(`${API.SINH_VIEN.GET_ALL}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateSinhVien(id: string | number | null, data: FormData) {
    try {
      const result = await authApi.put(`${API.SINH_VIEN.GET_BY_ID}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deleteSinhVien(id: string | number | null) {
    try {
      const result = await authApi.delete(`${API.SINH_VIEN.GET_BY_ID}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deleteSinhVienByLHP(id: string | number | null, data: any) {
    try {
      const result = await authApi.delete(
        `${API.SINH_VIEN.DELETE_LHP}`.replace(':id', `${id}`).replace(':lopHocPhanId', `${data.lopHocPhanId}`),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async restoreSinhVien(id: string | number | null) {
    try {
      const result = await authApi.put(`${API.SINH_VIEN.RESTORE}`.replace(':id', `${id}`));
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async importSinhVien(data: FormData) {
    try {
      const result = await authApi.post(`${API.SINH_VIEN.IMPORT}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async exportSinhVien(id: string | number | null) {
    try {
      const result = await authApi.get(`${API.SINH_VIEN.EXPORT}`.replace(':id', `${id}`), {
        responseType: 'blob'
      });
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async ChuyenLopSinhVien(data: any) {
    try {
      const result = await authApi.post(`${API.SINH_VIEN.CHUYEN_LOP_SINH_VIEN}`, data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateSinhVienTrangThai(id: string | number | null, data: any) {
    try {
      const result = await authApi.put(`${API.SINH_VIEN.UPDATE_TRANG_THAI}`.replace(':id', `${id}`), data);
      return result.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
