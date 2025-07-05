import { BaseEntity } from './BaseEntity';
import { BoMon } from './BoMon';
import { ChuongTrinhDaoTao } from './ChuongTrinhDaoTao';
import { MonHoc } from './MonHoc';

export interface ChiTietChuongTrinhDaoTao extends BaseEntity {
  monHocId?: string;
  monHoc?: MonHoc;
  chuongTrinhDaoTaoId?: string;
  chuongTrinhDaoTao?: ChuongTrinhDaoTao;
  boMonId?: string;
  boMon?: BoMon;
  soTinChi: number;
  hocKy: number;
  diemTichLuy?: boolean;
  loaiMonHoc?: number;
}
