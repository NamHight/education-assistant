import { GET } from '@/app/api/copilotkit/route';

export const TOKEN_ACCESS: string = 'access_token';
export const REFRESH_TOKEN: string = 'refresh_token';
export const THEME_LIGHT: string = 'light';
export const THEME_DARK: string = 'dark';
export const TOOLPAD_MODE: string = 'toolpad-mode';
export const USER: string = 'user';
export const ROLE: string = 'role';
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  TUAN: {
    GET_ALL_BY_NAM_HOC: '/Tuan/by-nam-hoc',
    GET_ALL_DEN_BY_TUAN_VAO: '/Tuan/combobox-copy'
  },
  LICH_BIEU: {
    GET_ALL: '/LichBieu',
    GET_BY_ID: '/LichBieu/:id',
    COPY: '/LichBieu/copy',
    GET_ALL_BY_NO_PAGE: '/LichBieu/no-page'
  },
  AUTH: {
    LOGIN: '/Authenticate/login',
    LOGOUT: '/Authenticate/logout',
    REGISTER: '/Authenticate/register',
    REFRESH_TOKEN: '/Authenticate/refresh-token',
    USER: '/Authenticate/me',
    FORGOT_PASSWORD: '/Authenticate/forgot-password',
    RESET_PASSWORD: '/Authenticate/reset-password',
    PASSWORD_CONFIRM: '/Authenticate//forgot-password-confirm'
  },
  CHI_TIET_LOP_HOC_PHAN: {
    GET_ALL: '/ChiTietLopHocPhan',
    GET_BY_ID: '/ChiTietLopHocPhan/:id',
    GET_BY_LOP_HOC_PHAN_ID: '/ChiTietLopHocPhan/:id/by-lop-hoc-phan',
    UPDATE_POINT: '/ChiTietLopHocPhan/update-list',
    EXPORT_FILE: '/ChiTietLopHocPhan/:id/export',
    IMPORT_FILE: '/ChiTietLopHocPhan/import'
  },
  HOC_BA: {
    GET_ALL: '/HocBa',
    GET_BY_ID: '/HocBa/:id',
    NOP_DIEM: '/HocBa/nop-diem',
    DELETE_LIST: '/HocBa/delete-list',
    GET_ALL_BY_MSSV: '/HocBa/by-sinh-vien',
  },
  THONG_KE: {
    GET_XEP_LOAI_HOC_LUC: '/ThongKe/xep-loai-hoc-luc',
    XEP_HANG_SINH_VIEN: '/ThongKe/top-sinh-vien-gpa',
    GET_TY_LE_QUA_MON: '/ThongKe/qua-mon-trong-nam',
    GET_TY_LE_THI_LAI_TRONG_NAM: '/ThongKe/thi-lai-trong-nam',
  },
  PHONG_HOC: {
    GET_ALL: '/PhongHoc',
    GET_BY_ID: '/PhongHoc/:id',
    CHANGE_STATUS: '/PhongHoc/:id/update-trang-thai',
    GET_ALL_NO_PAGE: '/PhongHoc/no-page'
  },
  NGANH: {
    GET_ALL: '/Nganh',
    GET_BY_ID: '/Nganh/:id',
    GET_ALL_NO_PAGE: "/Nganh/no-page",
    GET_ALL_BY_KHOA_ID: "/Nganh/no-parent/:khoaId",
    GET_BY_KHOA_ID: '/Nganh/by-khoa/:khoaId',
  },
  SINH_VIEN: {
    GET_ALL: '/SinhVien',
    GET_BY_ID: '/SinhVien/:id',
    RESTORE: '/SinhVien/:id/restore',
    TINH_TRANG_HOC_TAP: '/SinhVien/all-tinh-trang-hoc-tap',
    IMPORT: '/SinhVien/import',
    EXPORT: '/SinhVien/:id/export',
    GET_BY_LOP_HOC_PHAN: '/SinhVien/by-lop-hoc-phan',
    GET_BY_MSSV: '/SinhVien/mssv',
    DANG_KY_MON_HOC: '/SinhVien/dang-ky-mon-hoc',
    DELETE_LHP: '/SinhVien/:id/lhp/:lopHocPhanId/xoa-sv-khoi-lhp',
    GET_BY_ID_LOP_HOC: '/SinhVien/:lopHocId/by-lop-hoc',
    CHUYEN_LOP_SINH_VIEN: '/SinhVien/chuyen-lop',
  },
  GIANG_VIEN: {
    GET_ALL: '/giangviens',
    GET_ONE: '/giangviens/:id',
    RESTORE: '/giangviens/:id/restore',
    GET_BY_KHOA_ID: '/giangviens/:khoaId/by-khoa',
    CHANGE_PASSWORD: '/giangviens/change_password',
    UPDATE_PROFILE: '/giangviens/:id/update-giang-vien',
    GET_BY_BO_MON_ID: '/giangviens/:boMonId/by-bomon',
    TINH_TRANG: '/giangviens/tinh-trang-lam-viec',
    GET_GIANG_VIEN_NO_PAGE: '/giangviens/no-page',
  },
  KHOA: {
    GET_ALL: '/khoa',
    GET_BY_ID: '/Khoa/:id',
    GET_ALL_NO_PAGE: '/Khoa/no-page'
  },
  BO_MON: {
    GET_ALL: '/BoMon',
    GET_BY_ID: '/BoMon/:id',
    GET_ALL_BY_KHOA_ID: '/BoMon/by-khoa/:khoaId',
    GET_ALL_NO_PAGE: '/BoMon/no-page',
    GET_ALL_MON_HOC_BY_KHOA: '/BoMon/by-khoa/:khoaId'
  },
  LOP_HOC_PHAN: {
    GET_ALL: '/LopHocPhan',
    GET_BY_ID: '/LopHocPhan/:id',
    PHAN_CONG: '/LopHocPhan/list-phan-cong',
    ADD_HOC_KY_PHU: '/LopHocPhan/them-lop-hkp',
    CHANGE_STATUS: '/LopHocPhan/:id/update-trang-thai',
    ADD_AUTO: '/LopHocPhan/them-auto',
    GET_BY_GIANG_VIEN_ID: '/LopHocPhan/by-giang-vien',
    GET_ALL_NO_PAGE: '/LopHocPhan/no-page',
    GET_BY_LOP_HOC_AND_HOC_KY: '/LopHocPhan/by-lop-hoc-and-hoc-ky'
  },
  MON_HOC: {
    GET_ALL: '/MonHoc',
    GET_BY_ID: '/MonHoc/:id',
    GET_ALL_BY_KHOA_ID: '/MonHoc/by-khoa/:khoaId'
  },
  LOP_HOC: {
    GET_ALL: '/LopHoc',
    GET_BY_ID: '/LopHoc/:id',
    GET_ALL_NO_PAGE: '/LopHoc/no-page'
  },
  CHUONG_TRINH_DAO_TAO: {
    GET_ALL: '/ChuongTrinhDaoTao',
    GET_BY_ID: '/ChuongTrinhDaoTao/:id'
  },
  CHI_TIET_CHUONG_TRINH_DAO_TAO: {
    GET_ALL: '/ChiTietChuongTrinhDaoTao',
    GET_BY_ID: '/ChiTietChuongTrinhDaoTao/:id',
    ADD: '/ChiTietChuongTrinhDaoTao/them-moi',
    CHUONG_TRINH_MON_HOC: '/ChiTietChuongTrinhDaoTao/ChuongTrinhDaoTao/:id'
  },
  TRUONG: {
    GET_ALL: '/Truong/key-value',
    UPDATE: 'Truong'
  }
};

export const APP_ROUTE = {
  DANG_NHAP: '/dang-nhap',
  DASHBOARD: '/thong-ke',
  CHUONG_TRINH_DAO_TAO: {
    ROOT: '/chuong-trinh-dao-tao',
    ADD: '/chuong-trinh-dao-tao/them-moi',
    EDIT: (id: string) => `/chuong-trinh-dao-tao/${id}`
  },
  HOC_BA: {
    ROOT: '/hoc-ba',
    ADD: '/hoc-ba/them-moi',
    EDIT: (id: string) => `/hoc-ba/${id}`
  },
  GIANG_VIEN: {
    ROOT: '/giang-vien',
    ADD: '/giang-vien/them-moi',
    EDIT: (id: string) => `/giang-vien/${id}`
  },
  PHONG_HOC: {
    ROOT: '/phong-hoc',
    ADD: '/phong-hoc/them-moi',
    EDIT: (id: string) => `/phong-hoc/${id}`
  },
  LOP_HOC_PHAN: {
    ROOT: '/lop-hoc-phan',
    ADD: '/lop-hoc-phan/them-moi',
    ADD_HOC_KY_PHU: '/lop-hoc-phan/them-moi-hoc-ky-phu',
    EDIT: (id: string) => `/lop-hoc-phan/${id}`
  },
  SINH_VIEN: {
    ROOT: '/sinh-vien',
    ADD: '/sinh-vien/them-moi',
    EDIT: (id: string) => `/sinh-vien/${id}`
  },
  KHOA: {
    ROOT: '/khoa',
    ADD: '/khoa/them-moi',
    EDIT: (id: string) => `/khoa/${id}`
  },
  MON_HOC: {
    ROOT: '/mon-hoc',
    ADD: '/mon-hoc/them-moi',
    EDIT: (id: string) => `/mon-hoc/${id}`
  },
  NGANH: {
    ROOT: '/nganh',
    ADD: '/nganh/them-moi',
    EDIT: (id: string) => `/nganh/${id}`
  },
  BO_MON: {
    ROOT: '/bo-mon',
    ADD: '/bo-mon/them-moi',
    EDIT: (id: string) => `/bo-mon/${id}`
  },
  CHI_TIET_CHUONG_TRINH_DAO_TAO: {
    ROOT: '/chi-tiet-chuong-trinh-dao-tao',
    ADD: '/chi-tiet-chuong-trinh-dao-tao/them-moi',
    EDIT: (id: string) => `/chi-tiet-chuong-trinh-dao-tao/${id}`
  },
  TRUONG: {
    ROOT: '/truong'
  },
  LOP_HOC: {
    ROOT: '/lop-hoc',
    ADD: '/lop-hoc/them-moi',
    EDIT: (id: string) => `/lop-hoc/${id}`
  }
};

export const breadcrumbTranslations: { [key: string]: string } = {
  'giang-vien': 'Giảng viên',
  'them-moi': 'Thêm mới',
  'chinh-sua': 'Chỉnh sửa',
  'chi-tiet': 'Chi tiết',
  'sinh-vien': 'Quản lý Sinh viên',
  'lop-hoc': 'Lớp học',
  'lop-hoc-phan': 'Lớp học phần',
  khoa: 'Khoa',
  'them-moi-hoc-ky-phu': 'Thêm học kỳ phụ',
  'mon-hoc': 'Môn học',
  'chuong-trinh-dao-tao': 'Chương trình đào tạo',
  'chi-tiet-chuong-trinh-dao-tao': 'Chi tiết chương trình đào tạo',
  'bo-mon': 'Bộ môn',
  'phong-hoc': 'Phòng học',
  nganh: 'Ngành',
  'hoc-ba': 'Học bạ',
  truong: 'Trường',
  'phan-cong': 'Phân công'
  // Thêm các bản dịch khác của bạn ở đây
};
