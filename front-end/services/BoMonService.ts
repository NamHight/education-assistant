import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamBoMon } from "@/types/params";

export class BoMonService {
    static async getAllBoMon(params?: IParamBoMon) {
        return await authApi.get(`${API.BO_MON.GET_ALL}`, {
            params: params,
        })
            .then(response => ({
                data: response.data,
                meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
            }))
            .catch(error => error.response?.data);
    }
    static async getAllBoMonServer(params?: IParamBoMon) {
        return await authApiServer.get(`${API.BO_MON.GET_ALL}`, {
            params: params,
        })
            .then(response => ({
                data: response.data,
                meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
            }))
            .catch(error => error.response?.data);
    }

    static async getAllBoMonByKhoaId(khoaId: number | string | null) {
        return await authApi.get(`${API.BO_MON.GET_ALL_BY_KHOA_ID}`.replace(':khoaId', `${khoaId}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }

    static async getBoMonById(id: number | string | null) {
        return await authApi.get(`${API.BO_MON.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }
    static async getBoMonByIdServer(id: number | string | null) {
        return await authApiServer.get(`${API.BO_MON.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }
    static async createBoMon(data: any) {
        try {
            const result = await authApi.post(`${API.BO_MON.GET_ALL}`, data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }
    static async updateBoMon(id: number | string | null, data: any) {
        try {
            const result = await authApi.put(`${API.BO_MON.GET_BY_ID}`.replace(':id', `${id}`), data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }
    static async deleteBoMon(id: number | string | null) {
        try {
            const result = await authApi.delete(`${API.BO_MON.GET_BY_ID}`.replace(':id', `${id}`));
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }
}