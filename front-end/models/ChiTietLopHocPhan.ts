import { BaseEntity } from './BaseEntity';
import { GiangVien } from './GiangVien';
import { LopHocPhan } from './LopHocPhan';
import { MonHoc } from './MonHoc';
import { SinhVien } from './SinhVien';

export interface ChiTietLopHocPhan extends BaseEntity {
  diemChuyenCan?: number;
  diemTrungBinh?: number;
  diemThi1?: number;
  diemThi2?: number;
  diemTongKet1?: number;
  diemTongKet2?: number;
  ngayLuuDiem?: Date;
  ngayNopDiem?: Date;

  hocKy?: number;
  ghiChu?: string;

  trangThai?: number;

  sinhVienId?: string;
  sinhVien?: SinhVien;
  monHocId?: string;
  monHoc?: MonHoc;
  giangVienId?: string;
  giangVien?: GiangVien;
  lopHocPhanId?: string;
  lopHocPhan?: LopHocPhan;
}

export enum TrangThaiChiTietLopHocPhanEnum {
  DANG_HOAT_DONG = 1,
  KHONG_HOAT_DONG = 2
}
