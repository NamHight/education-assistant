import { GiangVien } from '@/models/GiangVien';
import authApi from '@/lib/authAxios';
import authApiServer from '@/lib/authAxiosServer';
import { API } from '@/types/general';

export class ThongKeService {
  static async getXepLoaiHocLuc() {
    return await authApi
      .get(`${API.THONG_KE.GET_XEP_LOAI_HOC_LUC}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getXepLoaiHocLucServer() {
    return await authApiServer
      .get(`${API.THONG_KE.GET_XEP_LOAI_HOC_LUC}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getXepHangSinhVien() {
    return await authApi
      .get(`${API.THONG_KE.XEP_HANG_SINH_VIEN}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getXepHangSinhVienServer() {
    return await authApiServer
      .get(`${API.THONG_KE.XEP_HANG_SINH_VIEN}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }

  static async getThongKeTyLeThiLaiTrongNam() {
    return await authApi.get(`${API.THONG_KE.GET_TY_LE_THI_LAI_TRONG_NAM}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
  static async getThongKeTyLeThiLaiTrongNamServer() {
    return await authApiServer.get(`${API.THONG_KE.GET_TY_LE_THI_LAI_TRONG_NAM}`)
      .then((response) => response.data)
      .catch((error) => error.response?.data);
  }
}
