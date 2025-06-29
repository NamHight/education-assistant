import { BaseEntity } from "./BaseEntity";
import { GiangVien } from "./GiangVien";
import { LopHocPhan } from "./LopHocPhan";
import { MonHoc } from "./MonHoc";
import { SinhVien } from "./SinhVien";

export interface ChiTietLopHocPhan extends BaseEntity
{
    DiemChuyenCan?: number;
    DiemTrungBinh?: number;
    DiemThi1?: number;
    DiemThi2?: number;
    DiemTongKet1?: number;
    DiemTongKet2?: number;
    NgayLuuDiem?: Date;
    NgayNopDiem?: Date;

    HocKy?: number;
    GhiChu?: string;

    TrangThai?: number;

    SinhVienId?: string;
    SinhVien?: SinhVien;
    MonHocId?: string;
    MonHoc?: MonHoc;
    GiangVienId?: string;
    GiangVien?: GiangVien;
    LopHocPhanId?: string;
    LopHocPhan?: LopHocPhan;
}


export enum TrangThaiChiTietLopHocPhanEnum
{
    DANG_HOAT_DONG = 1,
    KHONG_HOAT_DONG = 2
}