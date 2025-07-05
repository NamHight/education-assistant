import { BaseEntity } from './BaseEntity';
import { ChiTietLopHocPhan } from './ChiTietLopHocPhan';
import { DangKyMonHoc } from './DangKyMonHoc';
import { GiangVien } from './GiangVien';
import { HocBa } from './HocBa';
import { MonHoc } from './MonHoc';

export interface LopHocPhan extends BaseEntity {
  maHocPhan?: string;

  siSo?: number;

  trangThai?: number;

  monHocId?: string;
  monHoc?: MonHoc;

  giangVienId?: string;
  giangVien?: GiangVien;

  danhSachDangKyMonHoc?: DangKyMonHoc[];
  danhSachHocBa?: HocBa[];
  danhSachChiTietLopHocPhan?: ChiTietLopHocPhan[];
}

export enum TrangThaiLopHocPhanEnum {
  DANG_HOAT_DONG = 1,
  KHONG_HOAT_DONG = 2
}
