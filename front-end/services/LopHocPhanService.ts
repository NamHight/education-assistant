import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamLopHocPhan } from "@/types/params";

export class LopHocPhanService {
    static async getAllLopHocPhan(params: IParamLopHocPhan) {
        return await authApi.get(`${API.LOP_HOC_PHAN.GET_ALL}`,{
            params: params
        })
        .then((response) => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
            .catch(error => error.response?.data);
    }
    static async getAllLopHocPhanServer(params: IParamLopHocPhan) {
        return await authApiServer.get(`${API.LOP_HOC_PHAN.GET_ALL}`, {
            params: params
        })
            .then((response) => Promise.resolve({
                data: response.data,
                meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
            }))
            .catch(error => error.response?.data);
    }

    static async getLopHocPhanById(id: string | number | null) {
        return await authApi.get(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }
    static async getLopHocPhanByIdServer(id: string | number | null) {
        return await authApiServer.get(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }

    static async createLopHocPhan(data: any) {
        try {
            const result = await authApi.post(`${API.LOP_HOC_PHAN.GET_ALL}`, data);
            return result.data;
        }catch (error: any) {
            throw error.response?.data;
        }
    }

    static async updateLopHocPhan(id: string | number | null, data: any) {
        try {
            const result = await authApi.put(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`), data)
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }

    static async deleteLopHocPhan(id: string | number | null) {
       try {
         const result = await authApi.delete(`${API.LOP_HOC_PHAN.GET_BY_ID}`.replace(':id', `${id}`))
         return result.data;
       } catch (error:any) {
            throw error.response?.data
       }
    }

    static async phanCongLopHocPhan(data: FormData){
        try {
            const result = await authApi.put(`${API.LOP_HOC_PHAN.PHAN_CONG}`, data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }
}