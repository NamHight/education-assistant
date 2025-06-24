import { BaseEntity } from "./BaseEntity";
import { LopHocPhan } from "./LopHocPhan";
import { SinhVien } from "./SinhVien";

export interface DangKyMonHoc extends BaseEntity
{
    NgayDangKyHoc?: Date;
    Diem?: number;
    GhiChu?: string;
    TrangThai?: number;
    SinhVienId?: string;
    SinhVien?: SinhVien;
    LopHocPhanId?: string;
    LopHocPhan?: LopHocPhan;
}

export enum TrangThaiDangKyMonHocEnum
{
    DA_DANG_KY = 1,
    TU_Y_BO_HOC = 2,
    RUT_KHOI_LOP = 3,
    DA_HOAN_THANH = 4
}