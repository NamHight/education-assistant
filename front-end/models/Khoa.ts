import { BaseEntity } from "./BaseEntity";
import { GiangVien } from "./GiangVien";
import { MonHoc } from "./MonHoc";
import { Nganh } from "./Nganh";

export interface Khoa extends BaseEntity
{
    id: string;
    tenKhoa: string;

    soDienThoai: string;

    email: string;

    viTriPhong: string;

    website: string;
    danhSachMonHoc?: MonHoc[] | null;
    danhSachGiangVien?: GiangVien[] | null;
    danhSachNganh?: Nganh[] | null;
}