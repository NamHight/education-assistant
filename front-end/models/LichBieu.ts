import { BaseEntity } from './BaseEntity';
import { LopHocPhan } from './LopHocPhan';
import { PhongHoc } from './PhongHoc';
import { Tuan } from './Tuan';

export interface LichBieu extends BaseEntity {
  TietBatDau: number;
  TietKetThuc: number;
  Thu: number;
  TuanId?: string; // Guid as string
  Tuan?: Tuan;
  LopHocPhanId?: string; // Guid as string
  LopHocPhan?: LopHocPhan;
  PhongHocId?: string; // Guid as string
  PhongHoc?: PhongHoc;
}
