import { create } from 'zustand';
import authApi from "@/lib/authAxios";
import authApiServer from "@/lib/authAxiosServer";
import { API } from "@/types/general";
import { IParamChiTietChuongTrinhDaoTao } from "@/types/params";

export class ChitietChuongTrinhDaoTaoService {
    static async getChitietChuongTrinhDaoTaoServer(params: IParamChiTietChuongTrinhDaoTao) {
        return await authApiServer.get(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_ALL}`,{
            params:params
        })
        .then(response => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
        .catch(error => error.response?.data);
    }

    static async getChiTietChuongTrinhDaoTao(params: IParamChiTietChuongTrinhDaoTao){
        return await authApi.get(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_ALL}`, {
            params: params
        }).then(response => Promise.resolve({
            data: response.data,
            meta: response.headers['x-pagination'] ? JSON.parse(response.headers['x-pagination'] || '{}') : {}
        }))
        .catch(error => error.response?.data);
    }

    static async getChiTietChuongTrinhDaoTaoByIdServer(id: string | number | null) {
        return await authApiServer.get(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }

    static async getChiTietChuongTrinhDaoTaoById(id: string | number | null) {
        return await authApi.get(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`))
            .then(response => response.data)
            .catch(error => error.response?.data);
    }

    static async deleteChiTietChuongTrinhDaoTao(id: number | string | null) {
        try {
            const result = await authApi.delete(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`));
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }

    static async createChiTietChuongTrinhDaoTao(data: any) {
        try {
            const result = await authApi.post(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_ALL}`, data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }

    static async updateChiTietChuongTrinhDaoTao(id: string | number | null, data: any) {
        try {
            const result = await authApi.put(`${API.CHI_TIET_CHUONG_TRINH_DAO_TAO.GET_BY_ID}`.replace(':id', `${id}`), data);
            return result.data;
        } catch (error: any) {
            throw error.response?.data;
        }
    }
}