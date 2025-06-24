import { BaseEntity } from "./BaseEntity"
import { LichBieu } from "./LichBieu";

export interface PhongHoc extends BaseEntity {
    tenPhong: string;
    toaNha: string;
    sucChua: number;
    loaiPhongHoc?: number;
    trangThaiPhongHoc?: number;
    danhSachLichBieu?: LichBieu[];
}

export enum LoaiPhongHocEnum
{
    LY_THIET = 1,
    THUC_HANH = 2,
    HOI_TRUONG = 3
}

export enum TrangThaiPhongHocEnum
{
    HOAT_DONG = 1,
    BAO_TRI = 2,
    KHONG_SU_DUNG = 3
}