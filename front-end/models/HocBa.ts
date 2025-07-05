import { BaseEntity } from './BaseEntity';
import { ChiTietChuongTrinhDaoTao } from './ChiTietChuongTrinhDaoTao';
import { LopHocPhan } from './LopHocPhan';
import { SinhVien } from './SinhVien';

export interface HocBa extends BaseEntity {
  id: string;
  diemTongKet: number;
  moTa?: string;
  lanHoc: number;
  ketQua?: number;
  sinhVienId?: string;
  sinhVien?: SinhVien;
  lopHocPhanId?: string;
  lopHocPhan?: LopHocPhan;
  chiTietChuongTrinhDaoTaoId?: string;
  chiTietChuongTrinhDaoTao?: ChiTietChuongTrinhDaoTao;
}

export enum KetQuaHocBaEnum {
  DAT = 1,
  KHONG_DAT = 2
}
