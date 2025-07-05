import { BaseEntity } from './BaseEntity';
import { LichBieu } from './LichBieu';

export interface Tuan extends BaseEntity {
  SoTuan: number;
  NamHoc: number;
  NgayBatDau?: Date;
  NgayKetThuc?: Date;
  DanhSachLichBieu?: LichBieu[];
}
