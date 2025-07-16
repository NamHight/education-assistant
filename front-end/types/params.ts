interface IBaseParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortByOrder?: 'asc' | 'desc';
  search?: string;
}

export interface IParamGiangVien extends IBaseParams {
  active?: boolean;
  trangThai?: number;
  khoaId?: string;
  vaiTro?: number;
}

export interface IParamLopHocPhan extends IBaseParams {
  khoa?: number;
  loaiChuongTrinhDaoTao?: number;
  chuongTrinhDaoTaoId?: string;
  hocKy?: number;
  trangThai?: number;
  loaiLopHoc?: number;
  giangVienId?: string;
  khoaId?: string;
}

export interface IParamMonHoc extends IBaseParams {
  khoaId?: string;
}

export interface IParamLopHoc extends IBaseParams {}

export interface IParamChuongTrinhDaoTao extends IBaseParams {}
export interface IParamSinhVien extends IBaseParams {
  lopId?: number;
  tinhTrangHocTap?: number;
  lopHocPhanId?: string;
  trangThai?: number;
}

export interface IParamKhoa extends IBaseParams {}

export interface IParamNganh extends IBaseParams {}
export interface IParamBoMon extends IBaseParams {}

export interface IParamPhongHoc extends IBaseParams {
  nganhId?: string;
  loaiPhongHoc?: string;
  trangThai?: string;
  toaNha?: string;
}

export interface IParamChiTietChuongTrinhDaoTao extends IBaseParams {
  hocKy?: number;
  chuongTrinhDaoTaoId?: string;
}

export interface IParamHocBa extends IBaseParams {
  lopHocPhanId?: string;
  mssv?: string;
}

export interface IParamChiTietLopHocPhan extends IBaseParams {
  lopHocPhanId?: string;
  ngayNopDiem?: boolean;
}

export interface IParamLopHocPhan2 {
  loaiChuongTrinhDaoTao?: number;
  khoa?: number;
  hocky?: number;
  giangVienId?: string;
  lopHocPhanid?: string;
  lopHocId?: string;
  hocKy?: number | string;
  khoaId?: string;
}

export interface IParamLichBieu extends IBaseParams {
  lopHocId?: string;
  boMonId?: string;
  tuanId?: string;
  hocKy?: number | string;
  namHoc?: number | string;
}

export interface IParamTuan extends IBaseParams {
  namHoc?: number | string;
  TuanBatDauId?: string;
  GiangVienId?: string;
}
