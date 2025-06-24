import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamChuongTrinhDaoTao } from "@/types/params";
import { ca } from "zod/v4/locales";

export class ChuongTrinhDaoTaoService {
    static async getAllChuongTrinhDaoTao(params?:IParamChuongTrinhDaoTao) {
        return await authApi.get(`${API.CHUONG_TRINH_DAO_TAO.GET_ALL}`,{
            params: params
        })
            .then(response => Promise.resolve({
                data: response.data,
                meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
            }))
            .catch(error => error.response?.data);
    }
    static async getAllChuongTrinhDaoTaoServer(params?:IParamChuongTrinhDaoTao) {
        return await authApiServer.get(`${API.CHUONG_TRINH_DAO_TAO.GET_ALL}`,{
            params: params
        })
            .then(response => Promise.resolve({
                data: response.data,
                meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
            }))
            .catch(error => error.response?.data);
    }

    static async getChuongTrinhDaoTaoById(id: number | string | null) {
        return await authApi.get(`${API.CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }
    static async getChuongTrinhDaoTaoByIdServer(id: number | string | null) {
        return await authApiServer.get(`${API.CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }

    static async createChuongTrinhDaoTao(data: any) {
        try {
            const result = await authApi.post(`${API.CHUONG_TRINH_DAO_TAO.GET_ALL}`, data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }

    static async updateChuongTrinhDaoTao(id: number| string | null , data: any) {
        try{
            const result = await authApi.put(`${API.CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`), data);
            return result.data;
        }catch (error: any) {
            throw error.response?.data;
        }
    }

    static async deleteChuongTrinhDaoTao(id: number | string | null) {
        try {
            const result = await authApi.delete(`${API.CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`));
            return result.data;
        } catch (error:any) {
            throw error.response?.data;
        }
    }
}