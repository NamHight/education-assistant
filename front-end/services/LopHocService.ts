import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamLopHoc } from "@/types/params";

export class LopHocService {
    static async getAllLopHoc(params?: IParamLopHoc){
        return await authApi.get(`${API.LOP_HOC.GET_ALL}`,{
            params: params
        }).then((response) => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
        .catch((error) => Promise.reject(error.response?.data));
    }
    static async getAllLopHocServer(params?: IParamLopHoc){
        return await authApiServer.get(`${API.LOP_HOC.GET_ALL}`,{
            params: params
        }).then((response) => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
        .catch((error) => Promise.reject(error.response?.data));
    }
}