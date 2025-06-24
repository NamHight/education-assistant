import { BaseEntity } from "./BaseEntity";
import { GiangVien } from "./GiangVien";
import { Nganh } from "./Nganh";
import { SinhVien } from "./SinhVien";

export interface LopHoc extends BaseEntity
{
    id: string;
    maLopHoc: string;
    siSo: number;
    namHoc: string;
    giangVienId?: string | null;
    giangVien?: GiangVien | null;
    nganhId?: string | null;
    nganh?: Nganh | null;
    danhSachSinhVien?: SinhVien[] | null;
}