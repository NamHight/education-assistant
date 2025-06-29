import { BaseEntity } from "./BaseEntity";
import { ChuongTrinhDaoTao } from "./ChuongTrinhDaoTao";
import { Khoa } from "./Khoa";
import { LopHoc } from "./LopHoc";

export interface Nganh extends BaseEntity
{
    id: string;
    maNganh: string;
    tenNganh: string;
    moTa?: string | null;
    khoaId?: string | null;
    khoa?: Khoa | null;
    danhSachChuongTrinhDaoTao?: ChuongTrinhDaoTao[] | null;
    danhSachLopHoc?: LopHoc[] | null;
}
