import { BaseEntity } from './BaseEntity';
import { BoMon } from './BoMon';
import { ChiTietLopHocPhan } from './ChiTietLopHocPhan';
import { Khoa } from './Khoa';
import { LopHoc } from './LopHoc';
import { LopHocPhan } from './LopHocPhan';
import { TaiKhoan } from './TaiKhoan';

export interface GiangVien extends BaseEntity {
  hoTen: string;
  email: string;
  chucVu: number | null;
  gioiTinh: number | null;
  ngaySinh: Date | null;
  cccd: string;
  soDienThoai: string | null;
  diaChi: string | null;
  ngayVaoTruong: Date | null;
  trinhDo: string | null;
  chuyenNganh: string | null;
  anhDaiDien: string | null;
  trangThai: number | null;
  danhSachLopHoc?: LopHoc[] | null;
  taiKhoanId?: string | null;
  taiKhoan?: TaiKhoan | null;
  khoaId?: string | null;
  khoa?: Khoa | null;
  boMonId?: string | null;
  boMon?: BoMon | null;
  danhSachLopHocPhan?: LopHocPhan[] | null;
  danhSachChiTietLopHocPhan?: ChiTietLopHocPhan[] | null;
}

export enum TrangThaiGiangVienEnum {
  DANG_CONG_TAC = 1,
  NGHI_VIEC = 2,
  NGHI_HUU = 3,
  NGHI_PHEP = 4
}

export enum ChucVuGiangVienEnum {
  GIANG_VIEN = 1,
  GIANG_VIEN_CHINH = 2,
  TRUONG_BO_MON = 3,
  TRUONG_KHOA = 4
}

export enum GioiTinhEnum {
  NAM = 1,
  NU = 2,
  KHAC = 3
}
