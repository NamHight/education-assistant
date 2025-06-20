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
    GIANG_VIEN: {
        GET_ALL: "/giangviens",
        GET_ONE: "/giangviens/:id",
    },  
    KHOA: {
        GET_ALL: "/khoa"
    },
    BOMON: {
        GET_ALL: "/BoMon",
        GET_BY_ID: "/BoMon/:id"
    },
    
}

export const APP_ROUTE = {
    DANG_NHAP: "/dang-nhap",
    DASHBOARD: "/",
    GIANG_VIEN: {
        ROOT: "/giang-vien",
        ADD: "/giang-vien/them-moi",
        EDIT: (id: string) => `/giang-vien/thay-doi/${id}`,
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