import moment from 'moment';

export interface IOption {
  id: number;
  name: string;
}

export enum TrinhDoEnum {
  CU_NHAN = 1,
  KY_SU = 2,
  THAC_SI = 3,
  TIEN_SI = 4,
  PHO_GIAO_SU = 5,
  GIAO_SU = 6
}
export const trinhDoOptions: IOption[] = [
  { id: TrinhDoEnum.CU_NHAN, name: 'Cử nhân' },
  { id: TrinhDoEnum.KY_SU, name: 'Kỹ sư' },
  { id: TrinhDoEnum.THAC_SI, name: 'Thạc sĩ' },
  { id: TrinhDoEnum.TIEN_SI, name: 'Tiến sĩ' },
  { id: TrinhDoEnum.PHO_GIAO_SU, name: 'Phó Giáo sư' },
  { id: TrinhDoEnum.GIAO_SU, name: 'Giáo sư' }
];

export enum ChucVuEnum {
  GIANG_VIEN = 1,
  GIANG_VIEN_CHINH = 2,
  PHO_TRUONG_BO_MON = 3,
  TRUONG_BO_MON = 4,
  PHO_TRUONG_KHOA = 5,
  TRUONG_KHOA = 6
}
// Danh sách chức vụ (nếu cần)
export const chucVuOptions: IOption[] = [
  { id: ChucVuEnum.GIANG_VIEN, name: 'Giảng viên' },
  { id: ChucVuEnum.GIANG_VIEN_CHINH, name: 'Giảng viên chính' },
  { id: ChucVuEnum.PHO_TRUONG_BO_MON, name: 'Phó trưởng bộ môn' },
  { id: ChucVuEnum.TRUONG_BO_MON, name: 'Trưởng bộ môn' },
  { id: ChucVuEnum.PHO_TRUONG_KHOA, name: 'Phó trưởng khoa' },
  { id: ChucVuEnum.TRUONG_KHOA, name: 'Trưởng khoa' }
];

export enum GioiTinhEnum {
  NAM = 1,
  NU = 2,
  KHAC = 3
}
// Giới tính
export const gioiTinhOptions: IOption[] = [
  { id: GioiTinhEnum.NAM, name: 'Nam' },
  { id: GioiTinhEnum.NU, name: 'Nữ' },
  { id: GioiTinhEnum.KHAC, name: 'Khác' }
];

export enum LoaiTaiKhoanEnum {
  ADMIN = 1,
  QUAN_LY_KHOA_BO_MON = 2,
  GIANG_VIEN = 3
}
export const loaiTaiKhoanOptions: IOption[] = [
  { id: LoaiTaiKhoanEnum.ADMIN, name: 'admin' },
  { id: LoaiTaiKhoanEnum.QUAN_LY_KHOA_BO_MON, name: 'quản lý khoa bộ môn' },
  { id: LoaiTaiKhoanEnum.GIANG_VIEN, name: 'giảng viên' }
];

export enum TrangThaiEnum {
  DANG_CONG_TAC = 1,
  NGHI_VIEC = 2,
  NGHI_HUU = 3,
  NGHI_PHEP = 4
}

export const TrangThaiGiangVien: IOption[] = [
  { id: TrangThaiEnum.DANG_CONG_TAC, name: 'Đang công tác' },
  { id: TrangThaiEnum.NGHI_VIEC, name: 'Nghỉ việc' },
  { id: TrangThaiEnum.NGHI_HUU, name: 'Nghỉ hưu' },
  { id: TrangThaiEnum.NGHI_PHEP, name: 'Nghỉ phép' }
];

export enum TrangThaiLopHocPhanEnum {
  DANG_HOAT_DONG = 1,
  KHONG_HOAT_DONG = 2
}
export const TrangThaiLopHocPhan: IOption[] = [
  { id: TrangThaiLopHocPhanEnum.DANG_HOAT_DONG, name: 'Đang hoạt động' },
  { id: TrangThaiLopHocPhanEnum.KHONG_HOAT_DONG, name: 'Không hoạt động' }
];

export const HocKyLopHocPhan: IOption[] = [
  { id: 1, name: 'Học kỳ 1' },
  { id: 2, name: 'Học kỳ 2' },
  { id: 3, name: 'Học kỳ 3' },
  { id: 4, name: 'Học kỳ 4' },
  { id: 5, name: 'Học kỳ 5' },
  { id: 6, name: 'Học kỳ 6' }
];

export enum TrangThaiSinhVienEnum {
  DANG_HOC = 1,
  TAM_NGHI = 2,
  DA_TOT_NGHIEP = 3,
  BO_HOC = 4,
  BUOC_THOI_HOC = 5
}

export const TrangThaiSinhVien: IOption[] = [
  { id: TrangThaiSinhVienEnum.DANG_HOC, name: 'Đang học' },
  { id: TrangThaiSinhVienEnum.TAM_NGHI, name: 'Tạm nghỉ' },
  { id: TrangThaiSinhVienEnum.DA_TOT_NGHIEP, name: 'Đã tốt nghiệp' },
  { id: TrangThaiSinhVienEnum.BO_HOC, name: 'Bỏ học' },
  { id: TrangThaiSinhVienEnum.BUOC_THOI_HOC, name: 'Buộc thôi học' }
];

export enum TrangThaiPhongHocEnum {
  HOAT_DONG = 1,
  BAO_TRI = 2,
  KHONG_SU_DUNG = 3
}

export const TrangThaiPhongHoc: IOption[] = [
  { id: TrangThaiPhongHocEnum.HOAT_DONG, name: 'Hoạt động' },
  { id: TrangThaiPhongHocEnum.BAO_TRI, name: 'Bảo trì' },
  { id: TrangThaiPhongHocEnum.KHONG_SU_DUNG, name: 'Không sử dụng' }
];

export enum LoaiPhongHocEnum {
  LY_THIET = 1,
  THUC_HANH = 2,
  HOI_TRUONG = 3
}

export const LoaiPhongHoc: IOption[] = [
  { id: LoaiPhongHocEnum.LY_THIET, name: 'Lý thuyết' },
  { id: LoaiPhongHocEnum.THUC_HANH, name: 'Thực hành' },
  { id: LoaiPhongHocEnum.HOI_TRUONG, name: 'Hội trường' }
];

export enum LoaiChuongTrinhDaoTaoEnum {
  CAO_DANG = 1,
  CAO_DANG_NGHE = 2
}

export const LoaiChuongTrinhDaoTao: IOption[] = [
  { id: LoaiChuongTrinhDaoTaoEnum.CAO_DANG, name: 'Cao đẳng' },
  { id: LoaiChuongTrinhDaoTaoEnum.CAO_DANG_NGHE, name: 'Cao đẳng nghề' }
];
const currentYear = moment().year();
const years = Array.from({ length: 15 }, (_, i) => currentYear - 14 + i);
export const yearOptions: IOption[] = years.map((year) => ({
  id: year,
  name: year.toString()
})).toReversed();

const yearsCurrent = Array.from({ length: 4 }, (_, i) => currentYear - 3 + i);
export const yearOptionsCurrent: IOption[] = yearsCurrent.map((year) => ({
  id: year,
  name: year.toString()
}));

export const weekOptions: IOption[] = Array.from({ length: 52 }, (_, i) => {
  return {
    id: i + 1,
    name: `${i + 1}`
  };
});

export enum LoaiMonHocEnum {
  LY_THUYET = 1,
  THUC_HANH = 2,
  MODUN = 3,
  THUC_TAP_TOT_NGHIEP = 4,
  KIEN_TAP = 5,
  DO_AN_TOT_NGHIEP = 6,
  KHOA_LUAN_TOT_NGHIEP = 7,
  THI_TOT_NGHIEP_LY_THUYET = 8,
  THI_TOT_NGHIEP_THUC_HANH = 9,
  CHUC_CHUNG_CHI = 10
}

export const LoaiMonHoc: IOption[] = [
  { id: LoaiMonHocEnum.LY_THUYET, name: 'Lý thuyết' },
  { id: LoaiMonHocEnum.THUC_HANH, name: 'Thực hành' },
  { id: LoaiMonHocEnum.MODUN, name: 'Modun' },
  { id: LoaiMonHocEnum.THUC_TAP_TOT_NGHIEP, name: 'Thực tập tốt nghiệp' },
  { id: LoaiMonHocEnum.KIEN_TAP, name: 'Kiến tập' },
  { id: LoaiMonHocEnum.DO_AN_TOT_NGHIEP, name: 'Đồ án tốt nghiệp' },
  { id: LoaiMonHocEnum.KHOA_LUAN_TOT_NGHIEP, name: 'Khóa luận tốt nghiệp' },
  { id: LoaiMonHocEnum.THI_TOT_NGHIEP_LY_THUYET, name: 'Thi tốt nghiệp lý thuyết' },
  { id: LoaiMonHocEnum.THI_TOT_NGHIEP_THUC_HANH, name: 'Thi tốt nghiệp thực hành' },
  { id: LoaiMonHocEnum.CHUC_CHUNG_CHI, name: 'Chứng chỉ' }
];

export enum LoaiLopHocEnum {
  LOP_HOC_PHAN = 1,
  LOP_HOC_KY_PHU = 2
}
export const LoaiLopHocPhan: IOption[] = [
  { id: LoaiLopHocEnum.LOP_HOC_PHAN, name: 'Lớp học phần' },
  { id: LoaiLopHocEnum.LOP_HOC_KY_PHU, name: 'Lớp học kỳ phụ' }
];

export enum KetQuaHocBaEnum {
  DAT = 1,
  KHONG_DAT = 2
}

export const KetQuaHocBa: IOption[] = [
  { id: KetQuaHocBaEnum.DAT, name: 'Đạt' },
  { id: KetQuaHocBaEnum.KHONG_DAT, name: 'Không đạt' }
];

export enum TinhTrangHocTapSinhVienEnum {
  YEU = 1,
  TRUNG_BINH = 2,
  KHA = 3,
  GIOI = 4,
  XUAT_SAC = 5,
}

export const TinhTrangHocTapSinhVien: IOption[] = [
  { id: TinhTrangHocTapSinhVienEnum.YEU, name: 'Yếu' },
  { id: TinhTrangHocTapSinhVienEnum.TRUNG_BINH, name: 'Trung bình' },
  { id: TinhTrangHocTapSinhVienEnum.KHA, name: 'Khá' },
  { id: TinhTrangHocTapSinhVienEnum.GIOI, name: 'Giỏi' },
  { id: TinhTrangHocTapSinhVienEnum.XUAT_SAC, name: 'Xuất sắc' },
];

export const ThuTrongTuan: IOption[] = [
  { id: 2, name: 'Thứ 2' },
  { id: 3, name: 'Thứ 3' },
  { id: 4, name: 'Thứ 4' },
  { id: 5, name: 'Thứ 5' },
  { id: 6, name: 'Thứ 6' },
  { id: 7, name: 'Thứ 7' },
  { id: 8, name: 'Chủ nhật' }
];
