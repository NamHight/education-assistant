import authApi from "@/lib/authAxios";
import { API } from "@/types/general";

export class AuthenticateService {
    static async login(data: FormData){
        try {
            const response = await authApi.post(`${API.AUTH.LOGIN}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Login error:", error);
             throw  error?.response?.data
        }
    }
    static async getMe() {
        return authApi.get(`${API.AUTH.USER}`)
            .then((response) => Promise.resolve(response.data))
            .catch((error) => Promise.reject(error.response?.data));
    }
}