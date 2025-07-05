import { BaseEntity } from './BaseEntity';
import { ChiTietChuongTrinhDaoTao } from './ChiTietChuongTrinhDaoTao';
import { Nganh } from './Nganh';
import { SinhVienChuongTrinhDaoTao } from './SinhVienChuongTrinhDaoTao';

export interface ChuongTrinhDaoTao extends BaseEntity {
  maChuongTrinh: string;
  tenChuongTrinh: string;
  loaiChuonTrinhDaoTao?: number;
  thoiGianDaoTao: string;
  hocPhi: number;
  moTa?: string;
  tongSoTinChi: number;
  khoa?: number;
  nganhId?: string;
  nganh?: Nganh;
  danhSachSinhVienChuongTrinhDaoTao?: SinhVienChuongTrinhDaoTao[];
  danhSachChiTietChuongTrinhDaoTao?: ChiTietChuongTrinhDaoTao[];
}

export enum LoaiChuongTrinhDaoTaoEnum {
  CAO_DANG = 1,
  CAO_DANG_NGHE = 2
}
