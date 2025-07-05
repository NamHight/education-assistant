import { BaseEntity } from './BaseEntity';
import { GiangVien } from './GiangVien';

export interface TaiKhoan extends BaseEntity {
  email: string;
  password: string;
  lastLoginDate?: Date;
  resetToken?: string;
  resetTokenExpires?: Date;
  status: boolean;
  loaiTaiKhoan?: number;
  giangVien?: GiangVien;
}

export enum LoaiTaiKhoaEnum {
  ADMIN = 1,
  QUAN_LY_KHOA_BO_MON = 2,
  GIANGVIEN = 3
}
