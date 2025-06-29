import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";

export class ThongKeService {
    static async getLuotRot() {
        return await authApi.get(`${API.THONG_KE.GET_LUOT_ROT}`)
            .then((response) => response.data)
            .catch((error) => error.response?.data);
    }
    static async getLuotRotServer() {
        return await authApiServer.get(`${API.THONG_KE.GET_LUOT_ROT}`)
            .then((response) => response.data)
            .catch((error) => error.response?.data);
    }
}