import { BaseEntity } from './BaseEntity';
import { ChuongTrinhDaoTao } from './ChuongTrinhDaoTao';
import { SinhVien } from './SinhVien';

export interface SinhVienChuongTrinhDaoTao extends BaseEntity {
  SinhVienId?: string;
  SinhVien?: SinhVien;
  ChuongTrinhDaoTaoId?: string;
  ChuongTrinhDaoTao?: ChuongTrinhDaoTao;
}
