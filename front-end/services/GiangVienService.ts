import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';
import { IParamGiangVien } from '@/types/params';

export class GiangVienService {
  static async danhSachGiangVien(params: IParamGiangVien) {
    return authApi
      .get(`${API.GIANG_VIEN.GET_ALL}`, {
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
  static async getGiangVienTinhTrang(params: IParamGiangVien) {
    try {
      const response = await authApi.get(`${process.env.NEXT_PUBLIC_API_URL}/giangviens/tinh-trang-lam-viec`, {
        params: params
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async getGiangVienNoPageServer() {
    return authApiServer
      .get(`${API.GIANG_VIEN.GET_GIANG_VIEN_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getGiangVienNoPage() {
    return authApi
      .get(`${API.GIANG_VIEN.GET_GIANG_VIEN_NO_PAGE}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getGiangVienTinhTrangServer(params: IParamGiangVien) {
    return await authApiServer
      .get(`${API.GIANG_VIEN.TINH_TRANG}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async danhSachGiangVienServer(params: IParamGiangVien) {
    return authApiServer
      .get(`${API.GIANG_VIEN.GET_ALL}`, {
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

  static async getGiangVienByBoMonId(boMonId: string | number | undefined) {
    return authApi
      .get(`${API.GIANG_VIEN.GET_BY_BO_MON_ID}`.replace(':boMonId', `${boMonId}`))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }
  static async tinhTrangLamViecGiangVienServer(params: { khoaId?: string }) {
    return authApiServer
      .get(`${API.GIANG_VIEN.TINH_TRANG}`, {
        params: params
      })
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getGiangVienByKhoaId(khoaId: string | number) {
    return authApi
      .get(`${API.GIANG_VIEN.GET_BY_KHOA_ID}`.replace(':khoaId', `${khoaId}`))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }
  static async getGiangVien(id: string) {
    return authApi
      .get(`${API.GIANG_VIEN.GET_ONE}`.replace(':id', id))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }
  static async getGiangVienServer(id: string) {
    return authApiServer
      .get(`${API.GIANG_VIEN.GET_ONE}`.replace(':id', id))
      .then((response) => Promise.resolve(response.data))
      .catch((error) => Promise.reject(error.response?.data));
  }
  static async themMoiGiangVien(data: any) {
    try {
      const response = await authApi.post(`${API.GIANG_VIEN.GET_ALL}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateGiangVien(id: string, data: any) {
    try {
      const response = await authApi.put(`${API.GIANG_VIEN.GET_ONE.replace(':id', id)}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async deleteGiangVien(id: string | number | null) {
    try {
      const response = await authApi.delete(`${API.GIANG_VIEN.GET_ONE.replace(':id', `${id}`)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async restoreGiangVien(id: string | number | null) {
    try {
      const response = await authApi.put(`${API.GIANG_VIEN.RESTORE.replace(':id', `${id}`)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async changePassword(data: FormData) {
    try {
      const response = await authApi.put(`${API.GIANG_VIEN.CHANGE_PASSWORD}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async changeStatusGiangVien(id: string | number | null, data: any) {
    try {
      const response = await authApi.put(`${API.GIANG_VIEN.CHANGE_STATUS}`.replace(':id', `${id}`), {
        TrangThai: data
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
  static async updateProfile(id: string | number | null, data: FormData) {
    try {
      const response = await authApi.put(`${API.GIANG_VIEN.UPDATE_PROFILE.replace(':id', `${id}`)}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data;
    }
  }
}
