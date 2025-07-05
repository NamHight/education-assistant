import { BaseEntity } from './BaseEntity';
import { ChiTietChuongTrinhDaoTao } from './ChiTietChuongTrinhDaoTao';
import { ChiTietLopHocPhan } from './ChiTietLopHocPhan';
import { Khoa } from './Khoa';
import { LopHocPhan } from './LopHocPhan';

export interface MonHoc extends BaseEntity {
  maMonHoc: string;
  tenMonHoc: string;
  moTa?: string;
  khoaId?: string;
  khoa?: Khoa;
  danhSachLopHocPhan?: LopHocPhan[];
  danhSachChiTietChuongTrinhDaoTao?: ChiTietChuongTrinhDaoTao[];
  danhSachChiTietLopHocPhan?: ChiTietLopHocPhan[];
}

export enum LoaiMonHocEnum {
  LY_THUYET = 1,
  THUC_HANH = 2,
  MODUN = 3,
  THUC_TAP_TOT_NGHIEP = 4,
  KIEN_TAP = 5,
  DO_AN_TOT_NGHIEP = 6,
  KHOA_LUAN_TOT_NGHIEP = 7,
  THI_TOT_NGHIEP_LY_THUYET = 8,
  THI_TOT_NGHIEP_THUC_HANH = 9,
  CHUC_CHUNG_CHI = 10
}
