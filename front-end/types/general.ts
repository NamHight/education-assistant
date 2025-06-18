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
        USER: "/Authenticate/user",
    },
    GIANG_VIEN: {
        GET_ALL: "/giangviens"
    },
    
}

export const APP_ROUTE = {
    DASHBOARD: "/",
    GIANG_VIEN: {
        ROOT: "/giang-vien",
        ADD: "/giang-vien/create",
        EDIT: (id: string) => `/giang-vien/edit/${id}`,
    }
}