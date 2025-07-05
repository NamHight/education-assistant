import { BaseEntity } from './BaseEntity';
import { ChiTietChuongTrinhDaoTao } from './ChiTietChuongTrinhDaoTao';
import { GiangVien } from './GiangVien';
import { Khoa } from './Khoa';

export interface BoMon extends BaseEntity {
  tenBoMon: string;
  email: string;
  soDienThoai: string;
  khoaId?: string;
  khoa?: Khoa;
  danhSachChiTietChuongTrinhDaoTao?: ChiTietChuongTrinhDaoTao[];
  danhSachGiangVien?: GiangVien[];
}
