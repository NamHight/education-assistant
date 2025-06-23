export const TOKEN_ACCESS: string = "access_token";
export const REFRESH_TOKEN: string = "refresh_token";
export const THEME_LIGHT: string = "light";
export const THEME_DARK: string = "dark";
export const TOOLPAD_MODE:string = "toolpad-mode";
export const USER: string = "user";




export const API = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    AUTH: {
        LOGIN: "/Authenticate/login",
        LOGOUT: "/Authenticate/logout",
        REGISTER: "/Authenticate/register",
        REFRESH_TOKEN: "/Authenticate/refresh-token",
        USER: "/Authenticate/me",
    },
    PHONG_HOC:{
        GET_ALL: "/PhongHoc",
        GET_BY_ID: "/PhongHoc/:id",
    },
    NGANH:{
        GET_ALL: "/Nganh",
        GET_BY_ID: "/Nganh/:id",
    },
    SINH_VIEN:{
        GET_ALL: "/SinhVien",
        GET_BY_ID: "/SinhVien/:id",
        RESTORE: "/SinhVien/:id/restore",
    },
    GIANG_VIEN: {
        GET_ALL: "/giangviens",
        GET_ONE: "/giangviens/:id",
        RESTORE: "/giangviens/:id/restore",
        GET_BY_KHOA_ID: "/giangviens/:khoaId/by-khoa",
    },  
    KHOA: {
        GET_ALL: "/khoa",
        GET_BY_ID: "/Khoa/:id"
    },
    BO_MON: {
        GET_ALL: "/BoMon",
        GET_BY_ID: "/BoMon/:id"
    },
    LOP_HOC_PHAN:{
        GET_ALL: "/LopHocPhan",
        GET_BY_ID: "/LopHocPhan/:id",
    },
    MON_HOC: {
        GET_ALL: "/MonHoc",
        GET_BY_ID: "/MonHoc/:id",
    },
    LOP_HOC: {
        GET_ALL: "/LopHoc",
        GET_BY_ID: "/LopHoc/:id",
    },
    CHUONG_TRINH_DAO_TAO:{
        GET_ALL: "/ChuongTrinhDaoTao",
        GET_BY_ID: "/ChuongTrinhDaoTao/:id",
    }
    
}

export const APP_ROUTE = {
    DANG_NHAP: "/dang-nhap",
    DASHBOARD: "/",
    CHUONG_TRINH_DAO_TAO: {
        ROOT: "/chuong-trinh-dao-tao",
        ADD: "/chuong-trinh-dao-tao/them-moi",
        EDIT: (id: string) => `/chuong-trinh-dao-tao/${id}`,
    },
    GIANG_VIEN: {
        ROOT: "/giang-vien",
        ADD: "/giang-vien/them-moi",
        EDIT: (id: string) => `/giang-vien/${id}`,
    },
    PHONG_HOC:{
        ROOT: "/phong-hoc",
        ADD: "/phong-hoc/them-moi",
        EDIT: (id: string) => `/phong-hoc/${id}`,
    },
    LOP_HOC_PHAN: {
        ROOT: "/lop-hoc-phan",
        ADD: "/lop-hoc-phan/them-moi",
        EDIT: (id: string) => `/lop-hoc-phan/${id}`,
    },
    SINH_VIEN:{
        ROOT: "/sinh-vien",
        ADD: "/sinh-vien/them-moi",
        EDIT: (id: string) => `/sinh-vien/${id}`,
    },
    KHOA:{
        ROOT: "/khoa",
        ADD: "/khoa/them-moi",
        EDIT: (id: string) => `/khoa/${id}`,
    },
    MON_HOC:{
        ROOT: "/mon-hoc",
        ADD: "/mon-hoc/them-moi",
        EDIT: (id: string) => `/mon-hoc/${id}`,
    },
    NGANH:{
        ROOT: "/nganh",
        ADD: "/nganh/them-moi",
        EDIT: (id: string) => `/nganh/${id}`,
    },
    BO_MON:{
        ROOT: "/bo-mon",
        ADD: "/bo-mon/them-moi",
        EDIT: (id: string) => `/bo-mon/${id}`,
    }
}

export const breadcrumbTranslations: { [key: string]: string } = {
    'giang-vien': 'Giảng viên',
    'them-moi': 'Thêm mới',
    'chinh-sua': 'Chỉnh sửa',
    'chi-tiet': 'Chi tiết',
    'sinh-vien': 'Sinh viên',
    'lop-hoc': 'Lớp học',
    // Thêm các bản dịch khác của bạn ở đây
  };