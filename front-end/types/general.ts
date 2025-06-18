export const TOKEN_ACCESS: string = "TOKEN";
export const REFRESH_TOKEN: string = "REFRESH_TOKEN";
export const THEME_LIGHT: string = "light";
export const THEME_DARK: string = "dark";
export const TOOLPAD_MODE:string = "toolpad-mode";
export const USER: string = "USER";




export const API = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    AUTH: {
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REGISTER: "/auth/register",
        REFRESH_TOKEN: "/auth/refresh-token",
        USER: "/auth/user",
    },
    GIANG_VIEN: {
        GET_ALL: "/giangviens"
    }
    
}