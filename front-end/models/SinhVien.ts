import { BaseEntity } from './BaseEntity';
import { ChiTietLopHocPhan } from './ChiTietLopHocPhan';
import { DangKyMonHoc } from './DangKyMonHoc';
import { HocBa } from './HocBa';
import { LopHoc } from './LopHoc';
import { SinhVienChuongTrinhDaoTao } from './SinhVienChuongTrinhDaoTao';

export interface SinhVien extends BaseEntity {
  id: string;
  mssv: number;
  cccd: string;
  anhDaiDien: string;
  hoTen: string;
  email: string;
  soDienThoai?: string;
  ngaySinh?: Date;
  gioiTinh?: number;
  diaChi: string;
  trangThaiSinhVien?: number;
  tinhTrangHocTap?: number;
  ngayTotNghiep: Date;
  ngayNhapHoc: Date;
  lopHocId?: string;
  lopHoc?: LopHoc;
  danhSachDangKyMonHoc?: DangKyMonHoc[];
  danhSachSinhVienChuongTrinhDaoTao?: SinhVienChuongTrinhDaoTao[];
  danhSachHocBa?: HocBa[];
  danhSachChiTietLopHocPhan?: ChiTietLopHocPhan[];
}

export enum TrangThaiSinhVienEnum {
  DANG_HOC = 1,
  DA_TOT_NGHIEP = 2,
  BO_HOC = 3,
  BUOC_THOI_HOC = 4
}
export enum TinhTrangHocTapSinhVienEnum {
  YEU = 1,
  TRUNG_BINH = 2,
  KHA = 3,
  GIOI = 4,
  XUAT_SAC = 5,
  DINH_CHI = 6
}
